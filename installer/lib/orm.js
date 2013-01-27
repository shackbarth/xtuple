/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

require('../../../../node-xt/foundation/foundation');
require('../../../../node-xt/database/database');

(function () {
  "use strict";

  var
    _path = X.path, _ = X._, _fs = X.fs, initSocket, testConnection, dive,
    parseFile, calculateDependencies, dependenciesFor, checkDependencies, cleanse,
    installQueue, submit, existing, findExisting, install, select, refresh, runOrmInstaller;

  X.debugging = true;
  X.db = X.Database.create();

  cleanse = function (orm) {
    var ret = _.clone(orm);
    delete ret.undefinedDependencies;
    delete ret.failedDependencies;
    delete ret.filename;
    delete ret.missingDependencies;
    delete ret.enabled;
    delete ret.dependencies;

    if (ret.extensions && ret.extensions.length > 0) {
      _.each(ret.extensions, function (ext, i) {
        ret.extensions[i] = cleanse(ext);
      });
    }

    return ret;
  };

  submit = function (socket, orm, queue, ack, isExtension) {
    //console.log("submit", arguments);
    var query, extensions, context, extensionList = [], namespace, type;
    context = orm.context;
    namespace = orm.nameSpace;
    extensions = socket.extensions;
    type = orm.type;

    if (!isExtension) {
      _.each(extensions, function (context) {
        var ext, idx = -1;
        try {
          ext = context[namespace][type];
        } catch (err) {}
        if (ext) {
          extensionList.push(ext);
          if (orm.extensions && (_.find(orm.extensions, function (sub, i) {
            if (sub.nameSpace && sub.type) {
              if (sub.nameSpace === ext.nameSpace && sub.type === ext.type) {
                idx = i;
                return true;
              }
            }
            return false;
          }))) {
            if (idx > -1) {
              orm.extensions.splice(idx, 1);
              idx = -1;
            }
          }
        }
      });
    }

    console.log("installing %@%@.%@".f(isExtension ? "(extension %@) ".f(context): "", orm.nameSpace, orm.type));

    query = "select xt.install_orm('%@')".f(X.json(cleanse(orm)));

    X.db.query(query, socket.databaseOptions, _.bind(function (err, res) {
      var c = extensionList.length;
      if (err) {
        console.log("Error: " + err.message);
        if (isExtension) {
          console.log("skipping ahead");
        } else {
          console.log("unable to continue");
          X.log("Critical error. Unable to continue. Killing process. ", err.message);
          process.emit("SIGKILL");
          return;
        }
      }

      if (!isExtension) socket.installed.push(orm);
      if (c > 0) {
        submit.call(this, socket, extensionList.shift(), queue, ack, true);
      } else if (isExtension) {
        // this is the one part I'm worried about SMH
        --c;
        if (!extensionList.length) {
          installQueue.call(this, socket, ack, queue);
        } else {
          submit.call(this, socket, extensionList.shift(), queue, ack, true);
        }
      } else {
        installQueue.call(this, socket, ack, queue);
      }
    }, this));
  };

  installQueue = function (socket, ack, queue) {
    //console.log("install queue", arguments);
    var installed = socket.installed,
      orms = socket.orms,
      orm, dependencies = [];
    if (!queue || queue.length === 0) { return ack(socket.installed); }
    orm = queue.shift();

    if (installed.indexOf(orm) !== -1) {
      return installQueue.call(this, socket, ack, queue);
    }
    if (orm.dependencies) {
      _.each(orm.dependencies, function (dependency) {
        var d = orms[dependency.nameSpace][dependency.type];
        if (!installed.contains(d)) {
          dependencies.push(d);
        }
      });
      if (dependencies.length > 0) {
        dependencies.push(orm);
        dependencies = dependencies.concat(queue);
        return installQueue.call(this, socket, ack, dependencies);
      }
    }

    submit.call(this, socket, orm, queue, ack);
  };

  testConnection = function (socket, ack, options, err, res) {
    if (err) return ack(false);
    socket.databaseOptions = options;
    ack(true);
  };

  parseFile = function (path) {
    try {
      return X.json(_fs.readFileSync(path, "utf8"), true);
    } catch (err) { return {isError: true, message: err.message, file: path}; }
  };

  dive = function (path, root) {
    var files = X.directoryFiles(path, {fullPath: true}), stat, isTop, ret, content, errors = [];
    isTop = root ? false: true;
    _.each(files, function (file) {
      stat = _fs.statSync(file);
      if (stat.isDirectory()) dive(file, root ? root: (root = {}));
      else if (X.ext(file) === "json") root[file] = "";
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
    var properties, extensions, namespace, orms, dep;
    dependencies = dependencies ? dependencies : orm.dependencies ? orm.dependencies : (orm.dependencies = []);
    properties = orm.properties || [];
    extensions = orm.extensions || [];
    orms = socket.orms;
    if (!orm.missingDependencies) { orm.missingDependencies = []; }
    _.each(properties, function (property) {
      var which, type, ns;
      if (property.toOne || property.toMany) {
        if (property.toOne && !property.toOne.isNested) return;
        which = property.toOne ? property.toOne: property.toMany;
        type = which.type;
        ns = orm.nameSpace;
        dep = {nameSpace: ns, type: type};
        if (!dependencies.contains(dep) && !findExisting(ns, type)) {
          dependencies.push({nameSpace: ns, type: type});
        }
      }
    });
    _.each(extensions, function (extension) {
      if (!extension.nameSpace) extension.nameSpace = orm.nameSpace;
      dependenciesFor(socket, extension, dependencies);
    });
    namespace = orm.table.match(/^(.*)\./);
    _.each(dependencies, function (dependency) {
      var ns, type;
      ns = orms[dependency.nameSpace];
      type = ns[dependency.type];
      if (X.none(type)) {
        orm.missingDependencies.push("%@.%@".f(dependency.nameSpace, dependency.type));
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
    if (X.typeOf(orm.enabled) !== X.T_UNDEFINED) return orm.enabled;
    if (!dependencies || dependencies.length <= 0) return enabled;
    orms = socket.orms;
    _.each(dependencies, function (dependency) {
      found = orms[dependency.nameSpace][dependency.type];
      if (X.none(found)) {
        if (!orm.undefinedDependencies) { orm.undefinedDependencies = []; }
        orm.undefinedDependencies.push("%@.%@".f(dependency.namespace, dependency.type));
        enabled = false;
        return;
      }
      if (!checkDependencies(socket, found)) {
        if (!orm.failedDependencies) { orm.failedDependencies = []; }
        orm.failedDependencies.push("%@.%@".f(found.nameSpace, found.type));
        enabled = false;
        return;
      }
    });
    return enabled;
  };

  findExisting = function (nameSpace, type) {
    return _.find(existing, function (orm) {
      return orm.namespace === nameSpace && orm.type === type;
    });
  };


  install = function (socket, ack) {
    var valid = [], installer = _.bind(installQueue, this, socket, ack), orms;
    orms = socket.orms;
    _.each(orms, function (namespace) {
      _.each(namespace, function (orm) {
        if (orm.enabled) valid.push(orm);
      });
    });
    socket.installed = [];
    _.each(existing, function (orm) {
      socket.installed.push();
    });
    installer(valid);
  };

  select =  function (socket, options, ack) {
    var key, callback, creds = {};
    for (key in options) {
      if (!options.hasOwnProperty(key)) continue;
      if (options[key] === "") return ack(false);
    }

    creds.user = options.username;
    creds.hostname = options.hostname;
    creds.port = options.port;
    creds.password = options.password;
    creds.database = options.organization;

    callback = _.bind(testConnection, this, socket, ack, creds);

    X.db.query("select * from pg_class limit 1", creds, callback);
  };

  refresh = function (socket, options, ack) {
    options = options || {};
    if (typeof options === 'function') { ack = options; }
    var path = _path.join(X.basePath, options.path || X.options.orm.defaultPath),
      files,
      orms,
      extensions,
      errors,
      sql,
      callback;
    orms = {};
    extensions = {};
    files = dive(path);

    // if the first element is not an array
    if (X.typeOf(files[0]) === X.T_HASH) {
      errors = files.shift();
      errors = errors.errors;
      _.each(errors, function (error) {
        console.log("failed to parse %@: %@".f(X.shorten(error.file, 4), error.message));
      });
    }

    // map out the orm's
    _.each(files, function (file) {
      _.each(file, function (orm) {
        var ext, ns, type, ctx;
        ext = !!orm.isExtension;
        ns = orm.nameSpace;
        type = orm.type;
        ctx = orm.context;
        if (ext) {
          extensions = X.addProperties(extensions, ctx, ns, type, orm);
        } else {
          orms = X.addProperties(orms, ns, type, orm);
        }
      });
    });

    // Get a list of existing orms
    sql = "select orm_namespace as namespace, " +
          " orm_type as type " +
          "from xt.orm " +
          "where not orm_ext;";
    callback = function (err, resp) {
      existing = resp.rows;

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
            if (orm) {
              if (!orm.extensions) { orm.extensions = []; }
              orm.extensions.push(ext);
            } else if (findExisting(ns, type)) {
              orms = X.addProperties(orms, ns, type, ext);
            } else {
              console.log("no base orm for extension %@.%@".f(ns, type));
            }
          });
        });
      });

      socket.orms = orms;
      socket.extensions = extensions;

      calculateDependencies.call(this, socket);
      ack(orms);
    };
    _.bind(callback, this);
    X.db.query(sql, socket.databaseOptions, callback);
  };

  runOrmInstaller = function (creds, path) {
    console.log("Starting orm installer");
    var socket = {databaseOptions: creds};
    select(socket, creds, function () {
      refresh(socket, {path: path}, function () {
        install(socket, function () {
          console.log("all done");
          process.exit(0);
        });
      });
    });
  };

  exports.run = runOrmInstaller;

}());
