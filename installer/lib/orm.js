/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var _path = XT.path, _ = XT._, _fs = XT.fs, initSocket, testConnection, dive,
      parseFile, calculateDependencies, dependenciesFor, checkDependencies, cleanse,
      installQueue, submit;
  
  XT.debugging = true;
  
  initSocket = function (socket) {
    socket.on("refresh", _.bind(this.refresh, this, socket));
    socket.on("install", _.bind(this.install, this, socket));
    socket.on("select", _.bind(this.select, this, socket));
    socket.emit("message", "thanks for connecting to me");
  };
  
  cleanse = function (orm) {
    var ret = _.clone(orm);
    delete ret.undefinedDependencies;
    delete ret.failedDependencies;
    delete ret.filename;
    delete ret.missingDependencies;
    delete ret.enabled;
    delete ret.dependencies;
    
    return ret;
  };
  
  submit = function (socket, orm, queue, ack, isExtension) {
    var query, extensions, context, extensionList = [], namespace, type;
    query = "select xt.install_orm('%@')".f(XT.json(cleanse(orm)));
    context = orm.context;
    namespace = orm.nameSpace;
    extensions = socket.extensions;
    type = orm.type;

    if (!isExtension) {
      _.each(extensions, function (context) {
        var ext, idx;
        try {
          ext = context[namespace][type];
        } catch (err) {}
        if (ext) extensionList.push(ext);
        if (orm.extensions && (idx = _.find(orm.extensions, function (sub, i) {
          if (sub.nameSpace && sub.type)
            if (sub.nameSpace === ext.nameSpace && sub.type === ext.type) return i;
          return false;
        }))) orm.extensions.splice(idx, 1);
      });
    }

    socket.emit("message", "installing %@%@.%@".f(isExtension? "(extension %@) ".f(context): "", orm.nameSpace, orm.type));

    XT.db.query(socket.organization, query, _.bind(function (err, res) {
      var c = extensionList.length;
      if (err) {
        socket.emit("message", err.message);        
        if (isExtension) socket.emit("message", "skipping ahead");
        else {
          socket.emit("message", "unable to continue");
          return;
        }
      }
      
      if (!isExtension) socket.installed.push(orm);
      if (c > 0) {
        XT.debug("c > 0 ", c);
        this.on(socket.id, _.bind(function (c) {
          XT.debug("caught socket.id", socket.id);
          --c; if (c === 0) {
            XT.debug("c was 0");
            this.removeAllListeners(socket.id);
            installQueue.call(this, socket, ack, queue);
          } else {
            XT.debug("c was not 0", c);
            submit.call(this, socket, extensionList.shift(), queue, ack, true);
          }
        }, this, c));
        submit.call(this, socket, extensionList.shift(), queue, ack, true);
      } else if (isExtension) {
        XT.debug("emitting socket.id", socket.id);
        return this.emit(socket.id);
      } else {
        XT.debug("calling installQueue");
        installQueue.call(this, socket, ack, queue);
      }
    }, this));
  };
  
  installQueue = function (socket, ack, queue) {
    var installed = socket.installed, orms = socket.orms, orm, dependencies = [];
    if (!queue || queue.length === 0) return ack(socket.installed);
    orm = queue.shift();
    if (orm.dependencies) {
      _.each(orm.dependencies, function (dependency) {
        var d = orms[dependency.namespace][dependency.type];
        if (!installed.contains(d)) dependencies.push(d);
      });
      if (dependencies.length > 0) {
        dependencies.push(orm);
        dependencies = dependencies.concat(queue);
        return installQueue.call(this, socket, ack, dependencies);
      }
    }
    
    submit.call(this, socket, orm, queue, ack);
  };
  
  testConnection = function (socket, ack, organization, err, res) {
    if (err) return ack(false);
    socket.organization = organization;
    ack(true);
  };
  
  parseFile = function (path) {
    try {
      return XT.json(_fs.readFileSync(path, "utf8"), true);
    } catch (err) { return {isError: true, message: err.message, file: path}; }
  };
  
  dive = function (path, root) {
    var files = XT.directoryFiles(path, {fullPath: true}), stat, isTop, ret, content, errors = [];
    isTop = root? false: true;
    _.each(files, function (file) {
      stat = _fs.statSync(file);
      if (stat.isDirectory()) dive(file, root? root: (root = {}));
      else if (XT.ext(file) === "json") root[file] = "";
    });
    if (isTop) {
      ret = [];
      _.each(_.keys(root), function (file) {
        content = parseFile(file);
        if (content.isError) {
          errors.push(content);
        } else {
          content = content.map(function (orm) { orm.filename = file; return orm; });
          ret.push(content);
        }
      });
      if (errors.length > 0) ret.unshift({errors: errors});
      return ret;
    }
  };
  
  dependenciesFor = function (socket, orm, dependencies) {
    var properties, extensions, ignore = "PUBLIC XT".w(), namespace, table, orms;
    dependencies = dependencies? dependencies: orm.dependencies? orm.dependencies: (orm.dependencies = []);
    properties = orm.properties || [];
    extensions = orm.extensions || [];
    orms = socket.orms;
    if (!orm.missingDependencies) orm.missingDependencies = [];
    _.each(properties, function (property) {
      var which, type, ns;
      if (property.toOne || property.toMany) {
        if (property.toOne && !property.toOne.isNested) return;
        which = property.toOne? property.toOne: property.toMany;
        type = which.type;
        ns = orm.nameSpace;
        dependencies.push({namespace: ns, type: type});
      }
    });
    _.each(extensions, function (extension) {
      if (!extension.nameSpace) extension.nameSpace = orm.nameSpace;
      dependenciesFor(socket, extension, dependencies);
    });
    namespace = orm.table.match(/^(.*)\./);
    if (!XT.none(namespace) && !ignore.contains(namespace[1].toUpperCase())) {
      namespace = namespace[1].toUpperCase();
      table = orm.table.match(/\.(.*)$/)[1].h();
      dependencies.push({namespace: namespace, type: table});
    }
    _.each(dependencies, function (dependency) {
      var ns, type;
      ns = orms[dependency.namespace];
      type = ns[dependency.type];
      if (XT.none(type)) {
        orm.missingDependencies.push("%@.%@".f(dependency.namespace, dependency.type));
      }
    });
  };
  
  calculateDependencies = function (socket) {
    var orms = socket.orms;
    _.each(orms, function (namespace) {
      _.each(_.keys(namespace), function (name) {
        var orm = namespace[name];
        dependenciesFor(socket, orm);
      });
    });
    _.each(orms, function (namespace) {
      _.each(_.keys(namespace), function (name) {
        var orm = namespace[name];
        orm.enabled = checkDependencies(socket, orm);
      });
    });
  };
  
  checkDependencies = function (socket, orm) {
    var enabled = true, dependencies = orm.dependencies, found, orms;
    if (XT.typeOf(orm.enabled) !== XT.T_UNDEFINED) return orm.enabled;
    if (!dependencies || dependencies.length <= 0) return enabled;
    orms = socket.orms;
    _.each(dependencies, function (dependency) {
      found = orms[dependency.namespace][dependency.type];
      if (XT.none(found)) {
        if (!orm.undefinedDependencies) orm.undefinedDependencies = [];
        orm.undefinedDependencies.push("%@.%@".f(dependency.namespace, dependency.type));
        enabled = false;
        return;
      }
      if (!checkDependencies(socket, found)) {
        if (!orm.failedDependencies) orm.failedDependencies = [];
        orm.failedDependencies.push("%@.%@".f(found.nameSpace, found.type));
        enabled = false;
        return;
      }
    });
    return enabled;
  };
  
  XT.Server.create({
    port: XT.options.orm.port,
    useWebSocket: true,
    name: "ORM",
    autoStart: true,
    init: function () {
      
      // since we're using the over-load-ability of the sub-server
      // interface we create this now using connect
      var server = XT.connect.createServer(), root;
      root = _path.join(XT.basePath, "www");
      server.use(XT.connect.static(root, {redirect: true}));
      server.use(XT.connect.directory(root, {icons: true}));
      this.set("server", server);
      
      // super initializer
      this._super.init.call(this);
      
      // map our connections and namespace to the socket initializer
      this.setSocketHandler("/orm", "connection", _.bind(initSocket, this));
    },
    install: function (socket, ack) {
      var valid = [], installer = _.bind(installQueue, this, socket, ack), orms;
      orms = socket.orms;
      _.each(orms, function (namespace) {
        _.each(namespace, function (orm) {
          if (orm.enabled) valid.push(orm);
        });
      });
      socket.installed = [];
      installer(valid);
    },
    refresh: function (socket, ack) {
      var path = _path.join(XT.basePath, "../orm"), files, orms, extensions, errors;
      orms = {};
      extensions = {};
      files = dive(path);
      
      // if the first element is not an array
      if (XT.typeOf(files[0]) === XT.T_HASH) {
        errors = files.shift();
        errors = errors.errors;
        _.each(errors, function (error) {
          socket.emit("message", "failed to parse %@: %@".f(XT.shorten(error.file, 4), error.message));
        });
      }
      
      // map out the orm's
      _.each(files, function (file) {
        _.each(file, function (orm) {
          var ext, ns, type, ctx;
          ext = !! orm.isExtension;
          ns = orm.nameSpace;
          type = orm.type;
          ctx = orm.context;
          if (ext) extensions = XT.addProperties(extensions, ctx, ns, type, orm);
          else orms = XT.addProperties(orms, ns, type, orm);
        });
      });
      
      // organize and associate the extensions
      _.each(extensions, function (context) {
        _.each(context, function (namespace) {
          _.each(_.keys(namespace), function (name) {
            var ext, ns, type, orm;
            ext = namespace[name];
            ns = ext.nameSpace;
            type = ext.type;
            try {
              orm = orms[ns][type];
            } catch (err) { return; }
            if (!orm.extensions) orm.extensions = [];
            orm.extensions.push(ext);
          });
        });
      });
      
      socket.orms = orms;
      socket.extensions = extensions;
      
      XT.debug(extensions);
      
      calculateDependencies.call(this, socket);
      ack(orms);
    },
    select: function (socket, options, ack) {
      var key, callback;
      for (key in options) {
        if (!options.hasOwnProperty(key)) continue;
        if (options[key] === "") return ack(false);
      }
      
      callback = _.bind(testConnection, this, socket, ack, options.organization);
      
      // test our connection credentials
      XT.db.user = options.username;
      XT.db.hostname = options.hostname;
      XT.db.port = options.port;
      XT.db.password = options.password;
      XT.db.query(options.organization, "select * from usr limit 1", callback);
    }
  });
  
}());