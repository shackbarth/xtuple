
/*global XT */

var _fs     = require('fs');
var _path   = require('path');

XT.ormInstaller = XT.Object.create({

  targetDatabase: null,
  debugging: false,
  rootDir: null,
  isDisabled: false,
  errorStatus: null,
  ignoredNamespaces: "PUBLIC XT".w(),
  __isDisabled__: function() {
    if(!this.get('isDisabled')) return;
    this.populateSocket = this.__disabledPopulateSocket__;
  }.observes('isDisabled'),
  __disabledPopulateSocket__: function(socket) {
    var error = this.get('errorStatus') || 
      { message: 'Unknown error', context: 'Unknown' };
    socket.json.emit('error', error);
  },
  init: function() {
    var base = XT.basePath; 
    var root = this.rootDir = _path.resolve(base, '../orm');
    var self = this;

    // need to test to make sure we can find the damn
    // definitions
    try {
      if(_fs.statSync(root).isDirectory())
        XT.watch.createMonitor(root, function() {
          self.fileSystemMonitor.apply(self, arguments);
        });
    } catch(err) {
      this.set('isDisabled', true);
      this.set('errorStatus', 
        { message: err.message, context: 'intializing' });
    }

    // tell the dev server that on socket connections
    // for our domain to send them to us
    XT.dev.setSocketHandler('/orm', 'connection', this.initSocket, this);
  },
  initSocket: function(socket) {
    var self = this;
    socket.send("debugging is turned [ %@ ]".f(this.get('debugging') ? 'on' : 'off'));
    this.populateSocket(socket);
    socket
      .on('refresh', function() {
        self.populateSocket(socket);
      })
      .on('install', function(list) {
        if (!self.get('targetDatabase')) {
          socket.json.emit('error', { context: 'request to install', message: 'no database selected' });
          return;
        }
        socket.send("received install request for %@ ORM%@".f(
          list.length, list.length > 1 ? 's' : ''));
        socket.installed = [];
        self.install(socket, list);
      })
      .on('target', function(targetDatabase) {
        socket.send("Setting target database to " + targetDatabase);
        self.set('targetDatabase', targetDatabase);
      });
  },
  
  fileFilter: function(path, dir) {
    if(dir) return true;
    return XT.ext(path) === 'json' ? true : false;
  },
  populate: function() {
    var sockets = XT.dev.socketsFor('/orm'), 
        ids = Object.keys(sockets), i, socket;
    for(i=0; i<ids.length; ++i) {
      socket = sockets[ids[i]];
      if(socket) this.populateSocket(socket);
    }
  },
  populateSocket: function(socket) {
    var filter = this.fileFilter,
        root = this.get('rootDir'),
        self = this,
        orms = {},
        extensions = {},
        models = {};

    socket.send("searching for valid ORM's and loading them");

    function writePath(fullPath) {

      // for some reason regular expression matching would work
      // intermittently (compiled expression executed worked
      // roughly 50% of the time?)
      return fullPath.split('orm')[1].split('/').slice(1,-1).join('/');
    }

    // read the entire directory structure from root
    // weeding out non `json` definition files
    XT.dive(root, { recursive: true, filter: filter },
      function(err, file) {

        if(err) socket.json.emit('error', {
          message: err.message, context: XT.shorten(file, 3) });

        // issue a warning and keep on trucking
        if(err) return issue(XT.warning(err));

        // here we look for json parse errors and file read
        // errors and attempt to keep going if we can
        // because the dependencies calculation should take
        // care of missing dependencies or errors
        try {
          var json = XT.json(_fs.readFileSync(file, 'utf8'), true),
            fn = _path.basename(file),
            ext,
            ns,
            type,
            context,
            i;

          for (i = 0; i < json.length; i++) {
            ext = json[i].isExtension ? true : false;
            ns = json[i].nameSpace;
            type = json[i].type;
            context = json[i].context;
            // set the filename as an added separate property
            //json.fileName = fn;

            // set the FULL path to the file for generation later
            //json.fullPath = file;
  
            //json.writePath = writePath(file);

            // if the definition is for an extension it has special
            // requirements (slightly) and is handled separately
            if (ext) {
              extensions = XT.addProperties(extensions, context, ns, type, json[i]);

            // normal ORM's are handled in the main tree being
            // organized by namespace
            } else {
               orms = XT.addProperties(orms, ns, type, json[i]);
            }

          }
        } catch(err) {
          socket.json.emit('error',
            { message: err.message, context: XT.shorten(file, 3) });
        }
    });

    socket.extensions = extensions;
    socket.orms = orms;
    socket.models = models;

    // find the base for each of the extensions and nest it
    // before calculating dependencies
    var contexts = Object.keys(extensions),
        context, namespaces, namespace, names, 
        name, i, j, k, ext, type, ns, orm;
    for(i=0; i<contexts.length; ++i) {
      context = extensions[contexts[i]];
      namespaces = Object.keys(context);
      for(j=0; j<namespaces.length; ++j) {
        namespace = context[namespaces[j]];
        names = Object.keys(namespace);
        for(k=0; k<names.length; ++k) {
          name = names[k];
          ext = namespace[name];
          ns = ext.nameSpace;
          type = ext.type;
          try {
            orm = orms[ns][type];
          } catch(err) { continue; }
          if(!orm.extensions) orm.extensions = [];
          orm.extensions.push(ext);
        }
      }
    }

    // go ahead and calculate the dependencies so the client
    // can organize them once it sees the tree
    this.calculateDependencies(socket);
  },
  calculateDependencies: function(socket, noEmitToClient) {
    socket.send("calculating dependencies");
    var orms = socket.orms,
        exts = socket.extensions, 
        emit = !!! noEmitToClient,
        namespaces, namespace, i, j, name, names, ext, orm;

    this.debug("analyzing dependencies for individual ORM's");

    // first we iterate over and determine individual
    // dependencies for each of the known ORM's
    namespaces = Object.keys(orms); 
    for(i=0; i<namespaces.length; ++i) {
      namespace = orms[namespaces[i]];
      names = Object.keys(namespace);

      this.debug("looking at namespace => %@".f(namespaces[i]));

      // now iterate over names in the namespace for the
      // actual ORM
      for(j=0; j<names.length; ++j) {
        name = names[j];

        this.debug("looking at dependencies for => %@".f(name));

        orm = namespace[name];
        this.dependenciesFor(socket, orm);
      }
    }

    this.debug("with dependencies known, checking to see which should be disabled");

    // to help determine if the any of the ORM's should
    // be disabled, we test a few features now that we
    // know who is missing what
    for(i=0; i<namespaces.length; ++i) {
      namespace = orms[namespaces[i]];
      names = Object.keys(namespace);

      this.debug("looking at namespace => %@".f(namespaces[i]));

      // now iterate over names in the namespaces for the
      // actual ORM and determine recursively if the
      // dependencies are valid and if it should be enabled
      // or not
      for(j=0; j<names.length; ++j) {
        name = names[j];

        this.debug("validating dependencies for => %@".f(name));

        orm = namespace[name];
        orm.enabled = this.checkDependencies(socket, orm);
      }
    }

    if(emit) socket.json.emit('populate', socket.orms);
    else if(noEmitToClient) this.emit('xtRecalculationDone'+socket.id);
  },

  dependenciesFor: function(socket, orm, deps) {
    var orms = socket.orms,
        props = orm.properties || [],
        exts = orm.extensions || [],
        deps = deps ? deps : orm.deps ? orm.deps : orm.deps = [],
        ignore = this.get('ignoredNamespaces'),
        i, prop, ext, type, namespace, what, dep, table;
    if(XT.none(orm.mdeps)) orm.mdeps = [];

    // look for toOne and toMany relationships in the properties
    // for dependencies there
    for(i=0; i<props.length; ++i) {
      prop = props[i];
      if(prop.toOne || prop.toMany) {

        this.debug("property %@ found".f(prop.toOne ? 'toOne' : 'toMany'));

        if(prop.toOne && !prop.toOne.isNested) {
        
          this.debug("property (%@.%@) was toOne but not nested, skipping".f(orm.nameSpace, prop.toOne.type));

          continue;
        }
        what = prop.toOne ? prop.toOne : prop.toMany,
        namespace = orm.nameSpace,
        type = what.type;

        this.debug("property is %@.%@".f(namespace, type), socket);

        deps.push({ namespace: namespace, type: type });
      }
    } // properties

    this.debug("extensions %@".f(
      exts.length > 0 ? "found (%@), examining for dependencies".f(exts.length) : "not found"));

    // if there are any extensions, see if there are any
    // dependencies in those
    for(i=0; i<exts.length; ++i) {
      ext = exts[i];
      ext.nameSpace = ext.nameSpace || orm.nameSpace;

      this.debug("ext => %@.%@".f(ext.nameSpace, ext.type));

      // grab the depdencies of the nested extensions
      // as dependencies of the parent ORM
      this.dependenciesFor(socket, ext, deps);
    } // extensions

    // need to do this for ORM's that have a table
    // with a namespace to ensure it is created 
    namespace = orm.table.match(/^(.*)\./);
    if(!XT.none(namespace) && !ignore.contains(namespace[1].toUpperCase())) {
      namespace = namespace[1].toUpperCase();
      table = orm.table.match(/\.(.*)$/)[1].h();

      this.debug("table found to be a dependency => %@.%@".f(namespace, table));

      deps.push({ namespace: namespace, type: table });
    }

    this.debug("checking to see if any dependencies are missing");

    // figure out based on the dependencies if there are
    // any missing dependencies
    for(i=0; i<deps.length; ++i) {
      dep = deps[i];
      namespace = orms[dep.namespace],
      type = namespace[dep.type];
      if(XT.none(type)) {
        orm.missingDependencies = true;
        orm.mdeps.push('%@.%@'.f(dep.namespace, dep.type));

        this.debug("missing dependency => %@.%@".f(dep.namespace, dep.type));

      }
    }

    this.debug("final dependencies for %@.%@ => %@".f(orm.nameSpace, orm.type, this.depsString(deps)));
  },
  checkDependencies: function(socket, orm) {
    var deps = orm.deps,
        orms = socket.orms,
        enabled = true, dep, found, i;

    if(XT.typeOf(orm.enabled) !== XT.T_UNDEFINED) {
    
      this.debug("ORM %@.%@ already had an enabled status while checking dependencies".f(orm.nameSpace, orm.type));

      if(!orm.enabled) {

        this.debug("ORM %@.%@ was already disabled, returning that status".f(orm.nameSpace, orm.type));

        return orm.enabled;
      }
      else

        this.debug("ORM %@.%@ was already enabled, returning that status".f(orm.nameSpace, orm.type));
    }

    this.debug("checking dependencies validity for => %@.%@".f(orm.nameSpace, orm.type));

    if(XT.none(deps)) return enabled;
    for(i=0; i<deps.length; ++i) {
      dep = deps[i];
      found = orms[dep.namespace][dep.type];
      if(XT.none(found)) {
        if(XT.none(orm.udeps)) orm.udeps = [];
        orm.udeps.push('%@.%@'.f(dep.namespace, dep.type));

        this.debug("found unknown dependency %@.%@, disabling ORM".f(dep.namespace, dep.type));

        enabled = false;
        continue;
      }

      this.debug("checking dependencies for dependency => %@.%@".f(found.nameSpace, found.type));

      if(!this.checkDependencies(socket, found)) {
        if(XT.none(orm.fdeps)) orm.fdeps = [];
        orm.fdeps.push('%@.%@'.f(found.nameSpace, found.type));

        this.debug("found failed dependency %@.%@, disabling ORM".f(dep.namespace, dep.type));

        enabled = false;
        continue;
      }
    }

    this.debug("found ORM %@.%@ to be %@".f(orm.nameSpace, orm.type, enabled ? 'enabled' : 'disabled'));

    return enabled;
  },
  install: function(socket, list) {
    
    var next = list.shift(),
        installed = socket.installed,
        self = this, orm, i, deps, name;

    // if the ORM has already been installed,
    // skip ahead to the next one
    if(installed.contains(next))
      return this.install(socket, list);

    // grab the ORM to be installed
    orm = this.ormFromName(socket, next);
    if(XT.none(orm)) {
      socket.emit('error', { message: "could not retrieve ORM",
        context: next });
      return issue(XT.fatal(
        "Could not find requested ORM during installation: " + next));
    }

    // if it is disabled just skip it and reap the wonderful
    // rewards of failure for something else...
    if(!orm.enabled) return this.install(socket, list);

    // if there are any dependencies queue those up to install
    // first (if they haven't been already)
    if(orm.deps && orm.deps.length > 0) {
      deps = [];
      for(i=0; i<orm.deps.length; ++i) {
        name = '%@.%@'.f(orm.deps[i].namespace, orm.deps[i].type);
        if(installed.contains(name)) continue;
        deps.push(name);
      }
      if(deps.length > 0) {

        // push the current requested ORM back at the end of the
        // new altered queue-head
        deps.push(next);

        // concatenate the lists so these deps are on top
        deps = deps.concat(list);

        // force it start again from the top of these dependencies
        return this.install(socket, deps);
      }
    }

    // ready to try and submit one finally
    this.submit(socket, next, orm, list, installed);
  },
  depsString: function(deps) {
    var temp = [], i;
    for(i=0; i<deps.length; ++i)
      temp.push("%@.%@".f(deps[i].namespace, deps[i].type));
    return temp.join(', ');
  },
  submit: function(socket, name, orm, list, installed, isExtension) {
    var query = "select xt.install_orm('%@')",
        self = this,
        exts = socket.extensions,
        ctxt = orm.context,
        namespace = orm.nameSpace,
        type = orm.type, 
        extlist = [], text, ext, i, contexts, context;

    var database = this.targetDatabase;

    socket.send("installing %@ %@".f(isExtension ? "(extension, %@)".f(ctxt) : '', name));

    // this is a tricky little bitty for removing the extensions from
    // the ORM that are to be installed separately while falseT removing
    // any of the extensions that might already have been nested
    if(!isExtension) {
      contexts = Object.keys(exts);
      for(i=0; i<contexts.length; ++i) {
        context = exts[contexts[i]];
        try {
          ext = context[namespace][type];
          if(XT.typeOf(ext) !== XT.T_UNDEFINED) extlist.push(ext);
        } catch(err) { }
        if(orm.extensions && ext) {
          orm.extensions = _.filter(orm.extensions, function(iext) {
            if(iext.nameSpace && iext.nameSpace === ext.nameSpace) {
              if(iext.type && iext.type === ext.type)
                return false;
            }
            return true;
          });
        }
      }
    }
    text = XT.json(this.cleanse(orm));
    query = query.f(text);
    XT.db.query(database, query, function(err, res) {
      if(err) {
        socket.json.emit('error', { message: err.message,
          context: "installing %@ %@".f(
            isExtension ? "(extension, %@)".f(ctxt) : '', orm.type) });
        socket.json.emit('error', { message: "attempting to recalculate dependencies "
          + "and continue with what is left to install", context: orm.type });
        orm.enabled = false;
        self.once('xtRecalculationDone'+socket.id, function() {
          socket.send("recalculation complete, attempting to continue installing");
          self.install(socket, list);
        });
        self.calculateDependencies(socket, true);
        return;
      }
      socket.emit('success', name);
      if(!isExtension) installed.push(name);
      if(extlist.length > 0) {
        var count = extlist.length;
        self.on('xtExtensionInstalled'+socket.id, function(which) {
          --count; if(count == 0) {
            self.removeAllListeners('xtExtensionInstalled'+socket.id);
            if(list.length > 0)
              self.install(socket, list);
            else socket.send("all done");
          } else {
            ext = extlist.shift();
            self.submit(socket, name, ext, list, installed, true);
          }
        });
        ext = extlist.shift();
        self.submit(socket, name, ext, null, installed, true);
      }
      else if(isExtension) self.emit('xtExtensionInstalled'+socket.id, orm);
      else if(list) {
        if(list.length == 0) return socket.send("all done");
        self.install(socket, list);
      }
    });
  },
  installExtensions: function(socket) {
    socket.send("installing any extensions");
    var exts = socket.extensions,
        self = this, 
        installed = [],
        namespaces = Object.keys(exts), 
        namespace, names, name, i, j, ext;
    for(i=0; i<namespaces.length; ++i) {
      namespace = exts[namespaces[i]],
      names = Object.keys(namespace);
      for(j=0; j<names.length; ++j) {
        name = names[j],
        ext = namespace[name];
        this.submit(socket, name, ext, null, installed);
      }
    }
  },
  ormFromName: function(socket, name) {
    if(!name || name === '' || XT.none(name)) {
      return null;
    }
    var orms = socket.orms,
        namespace = name.match(/^(.*)\./)[1],
        type = name.match(/\.(.*)$/)[1],
        orm = orms[namespace][type];
    return orm;
  },
  cleanse: function(orm) {
    var possible = "deps mdeps fdeps udeps fileName".w(), key, i;
    for(i=0; i<possible.length; ++i) {
      key = possible[i];
      delete orm[key];
    }
    if(orm.extensions) {
      for(i=0; i<orm.extensions.length; ++i) {
        var ext = orm.extensions[i];
        orm.extensions[i] = this.cleanse(ext);
      }
    }
    return orm;
  },
  __populateWhenReady__: function(socket) {
    socket.json.emit('populate', socket.orms);
  }.observes('xtSocketPopulated'),

  /** @private */
  debug: function(message) {
    if(!this.get('debugging')) return;
    XT.debug(message);
  },
  className: 'XT.ormInstaller'

});
