/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, _:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    fs = require("fs"),
    calculateDependencies,
    checkDependencies,
    cleanse,
    dependenciesFor,
    dive,
    existing,
    findExisting,
    install,
    installQueue,
    parseFile,
    refresh,
    runOrmInstaller,
    select,
    raiseNotice = function (string) {
      return "do $$ plv8.elog(NOTICE, '%@'); $$ language plv8;\n".f(string);
    },
    submit,
    /*
      The clearing sql call: we get into trouble when there are orms "registered"
      with a row in the xt.orm table, but without an actual view defined. This
      happens if some other trigger cascade-deletes a view. Generally speaking
      these triggers don't know to delete the related xt.orm row. Because we
      frequently use the presence of a row as a proxy for the presence of the
      view, it's very dangerous if these fall out of sync. This sql call
      erases any xt.orm row that has no view. Assumption: the views will always
      be in the xm namespace.
    */
    ormSql = "delete from xt.orm  " +
      "where orm_id in ( " +
      "select orm_id from xt.orm  " +
      "left join ( " +
      "select replace(relname, '_', '') as viewName " +
      "from pg_class c   " +
      "join pg_namespace n on (c.relnamespace=n.oid)  " +
      "where nspname in (select distinct lower(orm_namespace) from xt.orm) " +
      ") views on lower(orm_type) = viewName " +
      "where viewName is null " +
      ");";

  // still required for the X functions
  require('../../node-datasource/xt/foundation/foundation');

  /**
    Prepares the orm for insertion into the database by cleaning out all the junk
    that we attached to it for the sake of these calculations.
   */
  cleanse = function (orm) {
    var ret = _.clone(orm);
    delete ret.undefinedDependencies;
    delete ret.failedDependencies;
    delete ret.filename;
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
    Here is the function that actually installs the ORM
   */
  submit = function (data, orm, queue, ack, isExtension) {
    var extensions, context, extensionList = [], namespace, type;
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

    //console.log(raiseNotice("installing %@%@.%@").f(isExtension ? "(extension %@) ".f(context): "", orm.nameSpace, orm.type));
    ormSql += raiseNotice("installing %@%@.%@").f(isExtension ? "(extension %@) ".f(context): "", orm.nameSpace, orm.type);
    ormSql += "select xt.install_orm('%@');\n".f(X.json(cleanse(orm)));

    var c = extensionList.length;

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
    var installed = data.installed,
      orms = data.orms,
      orm, dependencies = [];

    if (!queue || queue.length === 0) {
      // this is the actual callback! The first arg is an error, which is null if
      // we've made it this far. The second arg is an array of all the orm names
      // that have been installed.
      return ack(null, {
        query: ormSql,
        orms: _.map(data.installed, function (orm) {
          return {
            namespace: orm.nameSpace || orm.namespace,
            type: orm.type
          };
        })
      });
    }
    orm = queue.shift();

    if (installed.indexOf(orm) !== -1) {
      return installQueue.call(this, data, ack, queue);
    }
    //
    // Dependencies of this orm need to be installed before this orm.
    //
    if (orm.dependencies) {
      _.each(orm.dependencies, function (dependency) {
        var d = orms[dependency.nameSpace][dependency.type];
        if (!installed.contains(d)) {
          // only install dependencies that have not already been installed
          dependencies.push(d);
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
      return X.json(fs.readFileSync(path, "utf8"), true);
    } catch (err) { return {isError: true, message: err.message, file: path}; }
  };

  /**
    Recurse into the file structure to parse the json files.
   */
  dive = function (path, root) {
    var files = X.directoryFiles(path, {fullPath: true}),
      stat,
      isTop,
      ret,
      content,
      errors = [];

    isTop = root ? false : true;
    _.each(files, function (file) {
      stat = fs.statSync(file);
      if (stat.isDirectory()) {
        // we'll be populating this root object in the recursion with empty keys
        dive(file, root ? root : (root = {}));
      } else if (X.ext(file) === "json" || X.ext(file) === "js") {
        root[file] = "";
      }
    });
    if (isTop) {
      ret = [];
      // and now we populate those keys with the file data
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
    Adds a dependencies array to the orm.
   */
  dependenciesFor = function (data, orm, dependencies) {
    var properties, extensions, namespace, orms, dep;
    dependencies = dependencies ? dependencies : orm.dependencies ? orm.dependencies : (orm.dependencies = []);
    properties = orm.properties || [];
    extensions = orm.extensions || [];
    orms = data.orms;
    _.each(properties, function (property) {
      var which, type, ns;
      if (property.toOne || property.toMany) {
        if (property.toOne && property.toOne.isNested === false) return;
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
      dependenciesFor(data, extension, dependencies);
    });
  };

  /**
    Not sure what this does.
   */
  checkDependencies = function (data, orm) {
    var enabled = true,
      dependencies = orm.dependencies,
      found,
      orms;

    if (X.typeOf(orm.enabled) !== X.T_UNDEFINED) return orm.enabled;
    if (!dependencies || dependencies.length <= 0) return enabled;
    orms = data.orms;
    _.each(dependencies, function (dependency) {
      found = orms[dependency.nameSpace][dependency.type];
      if (X.none(found)) {
        if (!orm.undefinedDependencies) { orm.undefinedDependencies = []; }
        orm.undefinedDependencies.push("%@.%@".f(dependency.namespace, dependency.type));
        enabled = false;
        console.log("Cannot install", orm.type, "because of dependency failure", dependency);
        throw new Error("Cannot install " + orm.type);
      }
      if (!checkDependencies(data, found)) {
        if (!orm.failedDependencies) { orm.failedDependencies = []; }
        orm.failedDependencies.push("%@.%@".f(found.nameSpace, found.type));
        enabled = false;
        console.log("Cannot install", orm.type, "because of dependency failure", dependency);
        throw new Error("Cannot install " + orm.type);
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
        dependenciesFor(data, orm);
      });
    });

    _.each(orms, function (namespace) {
      _.each(_.keys(namespace), function (name) {
        var orm = namespace[name];
        orm.enabled = checkDependencies(data, orm);
      });
    });
  };

  /**
    Checks to see if the orm is already installed, using the global
    existing variable. Note that existing is populated from xt.orm,
    and assumes that xt.orm is in sync with the actual views that
    are created from the orm records.
   */
  findExisting = function (nameSpace, type) {
    return _.find(existing, function (orm) {
      return orm.namespace === nameSpace && orm.type === type;
    });
  };


  install = function (data, ack) {
    var valid = [], installer = _.bind(installQueue, this, data, ack), orms;
    orms = data.orms;
    _.each(orms, function (namespace) {
      _.each(namespace, function (orm) {
        if (orm.enabled) valid.push(orm);
      });
    });
    data.installed = [];
    _.each(existing, function (orm) {
      data.installed.push(orm);
    });
    installer(valid);
  };


  /**
    Parses the orms from their files.
    Also looks at all the orms currently "registered" in the
    the XT.Orm table and calculates dependencies
   */
  refresh = function (data, options, ack) {
    options = options || {};
    if (typeof options === 'function') { ack = options; }
    var path = options.path,
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

    // the pre-existing ORMs are passed in to us from whoever calls the ORM installer
    // This is necessary to keep the ORM installer write-only.
    existing = options.orms ? options.orms : [];

    // organize and associate the extensions
    _.each(extensions, function (context) {
      _.each(context, function (namespace) {
        _.each(_.keys(namespace), function (name) {
          var ext, ns, type, orm;
          ext = namespace[name];
          ns = ext.nameSpace;
          type = ext.type;
          try {
            if (!orms[ns]) {
              // prevents a bug whereby a module with only "extensions" and no "models"
              // would get ignored entirely by the orm installer
              orms[ns] = {};
            }
            orm = orms[ns][type];
          } catch (err) {
            console.log("orm extension error:", err);
            return;
          }
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
    ack();
  };


  /**
    Entry point for installer. Chains together call to select, then refresh, then install.
   */
  exports.run = runOrmInstaller = function (path, options, callback) {
    var data = {};
    options = options || {};

    if (!callback) {
      callback = function () {
        // TODO - Call stored procedure to generate cached REST API Discovery Document.
        console.log("all done");
      };
    }

    refresh(data, {path: path, orms: options.orms}, function () {
      install(data, callback);
    });
  };

  // debug
  /*
  var debugPath = X.path.join(__dirname, "../../enyo-client/extensions/source/test/database/orm");
  runOrmInstaller(debugPath, {orms: []}, function (err, res) {
    console.log(err, res);
  });
  */
}());
