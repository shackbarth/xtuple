/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

require('../xt/foundation/foundation');
require('../xt/database/database');

(function () {
  "use strict";

  var _path = X.path, _ = X._, _fs = X.fs, initSocket, dive,
    parseFile, calculateDependencies, dependenciesFor, checkDependencies, cleanse,
    installQueue, submit, existing, findExisting, install, select, refresh, runOrmInstaller;

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

  /**
    Here is the function that actually installs the ORM!
   */
  submit = function (data, orm, queue, ack, isExtension) {
    //console.log("submit", arguments);
    var query, extensions, context, extensionList = [], namespace, type;
    context = orm.context;
    namespace = orm.nameSpace;
    extensions = data.extensions;
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

    X.db.query(query, data.databaseOptions, _.bind(function (err, res) {
      var c = extensionList.length;
      if (err) {
        console.log("Error: " + err.message);
        if (isExtension) {
          console.log("skipping ahead");
        } else {
          console.log("unable to continue");
          ack(err.message);
          //X.log("Critical error. Unable to continue. Killing process. ", err.message);
          //process.emit("SIGKILL");
          return;
        }
      }

      if (!isExtension) data.installed.push(orm);
      if (c > 0) {
        submit.call(this, data, extensionList.shift(), queue, ack, true);
      } else if (isExtension) {
        --c;
        if (!extensionList.length) {
          installQueue.call(this, data, ack, queue);
        } else {
          submit.call(this, data, extensionList.shift(), queue, ack, true);
        }
      } else {
        installQueue.call(this, data, ack, queue);
      }
    }, this));
  };


  /**
    Iterates recursively down the queue of orms to install.
    Initially called with a queue in no particular order.
    However, we do know the dependencies of each orm.

    @param data
    @param data.installed {Array} Array of ORMs (as JSON) that have already been installed
    @param ack {Function} callback function to be eventually called to return out of this
      whole installer
   */
  installQueue = function (data, ack, queue) {
    console.log("install queue", queue.length, queue.length && queue[0].type);
    var installed = data.installed,
      orms = data.orms,
      orm, dependencies = [];
    if (!queue || queue.length === 0) {
      // this is the actual callback! The first arg is an error, which is null if
      // we've made it this far. The second arg is an array of all the orm names
      // that have been installed.
      return ack(null, _.map(data.installed, function (orm) {return orm.type}));
    }
    orm = queue.shift();

    if (installed.indexOf(orm) !== -1) {
      return installQueue.call(this, data, ack, queue);
    }
    //
    // Dependencies of this orm need to be installed before this orm.
    //
    console.log("orm dependencies are", orm.dependencies);
    if (orm.dependencies) {
      _.each(orm.dependencies, function (dependency) {
        var d = orms[dependency.nameSpace][dependency.type];
        if (!installed.contains(d)) {
          // only install dependencies that have not already been installed
          console.log("got to install");
          dependencies.push(d);
        } else {
          console.log("already installed");
        }
      });
      if (dependencies.length > 0) {
        dependencies.push(orm);
        dependencies = dependencies.concat(queue);
        return installQueue.call(this, data, ack, dependencies);
        // do NOT install this orm right now! We'll get to it when the time is right.
      }
    }

    submit.call(this, data, orm, queue, ack);
  };

  /**
    Parse a json file and return the json.
    @param {String} path

    @returns {Object}
   */
  parseFile = function (path) {
    try {
      return X.json(_fs.readFileSync(path, "utf8"), true);
    } catch (err) { return {isError: true, message: err.message, file: path}; }
  };

  /**
    Recurse into the file structure to parse the json files.
   */
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

  /**
    Adds a dependencies array to the orm, as well as a missingDependencies array,
    which I don't think is used for anything.
   */
  dependenciesFor = function (data, orm, dependencies) {
    var properties, extensions, namespace, orms, dep;
    dependencies = dependencies ? dependencies : orm.dependencies ? orm.dependencies : (orm.dependencies = []);
    properties = orm.properties || [];
    extensions = orm.extensions || [];
    orms = data.orms;
    if (!orm.missingDependencies) { orm.missingDependencies = []; }
    _.each(properties, function (property) {
      var which, type, ns;
      console.log("prop is", property);
      if (property.toOne || property.toMany) {
        if (property.toOne && property.toOne.isNested === false) return;
        which = property.toOne ? property.toOne: property.toMany;
        type = which.type;
        ns = orm.nameSpace;
        dep = {nameSpace: ns, type: type};
        if (!dependencies.contains(dep) && !findExisting(ns, type)) {
          console.log("pushing dep", ns, type);
          dependencies.push({nameSpace: ns, type: type});
        }
      }
    });
    _.each(extensions, function (extension) {
      if (!extension.nameSpace) extension.nameSpace = orm.nameSpace;
      dependenciesFor(data, extension, dependencies);
    });
    namespace = orm.table.match(/^(.*)\./);
    _.each(dependencies, function (dependency) {
      var ns, type;
      ns = orms[dependency.nameSpace];
      type = ns[dependency.type];
      if (X.none(type)) {
        console.log("pushing missing dep", dependency.namespace, dependency.type);
        orm.missingDependencies.push("%@.%@".f(dependency.nameSpace, dependency.type));
      }
    });
  };

  checkDependencies = function (data, orm) {
    var enabled = true, dependencies = orm.dependencies, found, orms;
    if (X.typeOf(orm.enabled) !== X.T_UNDEFINED) return orm.enabled;
    if (!dependencies || dependencies.length <= 0) return enabled;
    orms = data.orms;
    _.each(dependencies, function (dependency) {
      found = orms[dependency.nameSpace][dependency.type];
      if (X.none(found)) {
        if (!orm.undefinedDependencies) { orm.undefinedDependencies = []; }
        orm.undefinedDependencies.push("%@.%@".f(dependency.namespace, dependency.type));
        enabled = false;
        return;
      }
      if (!checkDependencies(data, found)) {
        if (!orm.failedDependencies) { orm.failedDependencies = []; }
        orm.failedDependencies.push("%@.%@".f(found.nameSpace, found.type));
        enabled = false;
        return;
      }
    });
    return enabled;
  };

  /**
    For each ORM, calculates that ORMs dependencies

   */
  calculateDependencies = function (data) {
    var orms = data.orms;
    _.each(orms, function (namespace) {
      _.each(_.keys(namespace), function (name) {
        var orm = namespace[name];
        //console.log("before", orm);
        dependenciesFor(data, orm);
        //console.log("after", orm);
      });
    });
    // what does this do ??? XXX
    _.each(orms, function (namespace) {
      _.each(_.keys(namespace), function (name) {
        var orm = namespace[name];
        orm.enabled = checkDependencies(data, orm);
      });
    });
  };

  findExisting = function (nameSpace, type) {
    return _.find(existing, function (orm) {
      return orm.namespace === nameSpace && orm.type === type;
    });
  };


  install = function (data, ack) {
    //console.log("install", JSON.stringify(Object.keys(data.orms.XM)));
    var valid = [], installer = _.bind(installQueue, this, data, ack), orms;
    orms = data.orms;
    _.each(orms, function (namespace) {
      _.each(namespace, function (orm) {
        if (!orm.enabled) console.log("install", JSON.stringify(orm));
        if (orm.enabled) valid.push(orm);
      });
    });
    data.installed = [];
    console.log("existing length is", existing.length);
    _.each(existing, function (orm) {
      //data.installed.push(); // XXX buggy?
      data.installed.push(orm);
    });
    console.log("these orms are already installed", data.installed.length);
    installer(valid);
  };

  /*
    Puts the options into the data object and runs the clearing sql call.
    The clearing sql call: we get into trouble when there are orms "registered"
    with a row in the xt.orm table, but without an actual view defined. This
    happens if some other trigger cascade-deletes a view. Generally speaking
    these triggers don't know to delete the related xt.orm row. Because we
    frequently use the presence of a row as a proxy for the presence of the
    view, it's very dangerous if these fall out of sync. This sql call
    erases any xt.orm row that has no view. Assumption: the views will always
    be in the xm namespace.

    The clearing sql call is also useful as a verification that the db is
    connected. In an earlier incarnation this was just a useless/harmless
    placeholder call.
  */
  select =  function (data, options, ack) {
    var key, callback, creds = {},
      clearingSql = "delete from xt.orm  " +
        "where orm_id in ( " +
        "select orm_id from xt.orm  " +
        "left join ( " +
        "select replace(relname, '_', '') as viewName " +
        "from pg_class c   " +
        "join pg_namespace n on (c.relnamespace=n.oid)  " +
        "where nspname like 'xm' " +
        ") views on lower(orm_type) = viewName " +
        "where not orm_ext " +
        "and viewName is null " +
        ")",
      testConnection = function (data, ack, options, err, res) {
        if (err) return ack(false);
        data.databaseOptions = options;
        ack(true);
      };

    for (key in options) {
      if (!options.hasOwnProperty(key)) continue;
      if (options[key] === "") return ack(false);
    }

    creds.user = options.username;
    creds.hostname = options.hostname;
    creds.port = options.port;
    creds.password = options.password;
    creds.database = options.organization;

    callback = _.bind(testConnection, this, data, ack, creds);

    X.db.query(clearingSql, creds, callback);
  };

  /**
    Parses the orms from their files.
    Also looks at all the orms currently "registered" in the
    the XT.Orm table and calculates dependencies
   */
  refresh = function (data, options, ack) {
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
      if (err) {
        console.log("Error in xt.orm query callback", err);
      }
      existing = resp ? resp.rows : [];
      console.log("just set existing length ", existing.length);

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

      data.orms = orms;
      data.extensions = extensions;

      calculateDependencies.call(this, data);
      console.log("calc dep", JSON.stringify(Object.keys(data.orms.XM)));
      ack(orms);
    };
    _.bind(callback, this);
    X.db.query(sql, data.databaseOptions, callback);
  };

  /**
    Entry point for installer. Chains together call to select, then refresh, then install.
   */
  exports.run = runOrmInstaller = function (creds, path, callback) {
    if (!callback) {
      callback = function () {
        console.log("all done");
        process.exit(0);
      };
    }

    var data = {databaseOptions: creds};
    select(data, creds, function () {
      refresh(data, {path: path}, function () {
        install(data, callback);
      });
    });
  };

}());
