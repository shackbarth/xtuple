
/** @class

  The ORM installer is a development tool used for
  taking JSON formatted ORM definition files and
  allowing them to be installed in a database. It
  provides a UI for individual selection of the ORM's
  and manages dependencies to ensure that the correct
  ORM's are installed in the correct order.

*/
XT.ormInstaller = XT.Object.create(
  /** @lends XT.ormInstaller.prototype */ {

  /**
    If debugging is turned on, tons of output will
    be shown in the server console and the client
    console. Changing this during runtime will
    cause it to start/stop debugging immediately.

    @type Boolean
    @default NO
    @property
  */
  debugging: NO,

  /**
    The root directory from which to look for
    ORM definitions.

    @type String
    @default null
    @property
  */
  rootDir: null,

  /**
    If the installer fails to initialize properly
    it will set itself to error mode.

    @type Boolean
    @default NO
    @property
  */ 
  isDisabled: NO,

  /**
    If an error occurs that disables the installer the
    error is stored here.

    @type Object
    @default null
    @property
  */
  errorStatus: null,

  /**
    The namespaces known that should be ignored.
    @type Array
  */
  ignoredNamespaces: "PUBLIC XT".w(),

  /**
    If the installer becomes disabled, prepares it to
    use the correct method to respond to populate
    requests.

    @private
  */
  __isDisabled__: function() {
    if(!this.get('isDisabled')) return;
    this.populateSocket = this.__disabledPopulateSocket__;
  }.by('isDisabled'),

  /**
    When the installer is disabled but receives a request
    to populate a socket it instead calls this method
    and simply emits an error message to the client.

    @param {} socket The socket to communicate to.
    @private
  */
  __disabledPopulateSocket__: function(socket) {
    var error = this.get('errorStatus') || 
      { message: 'Unknown error', context: 'Unknown' };
    socket.json.emit('error', error);
  },

  /** @private */
  init: function() {
    var fs = XT.fs.__fs__,
        path = XT.fs.__path__,
        base = XT.basePath, 
        root = this.rootDir = path.resolve(base, '../database/orm'),
        self = this;

    if(XT.typeOf(XT.opts['orm-installer-debugging']) !== XT.T_UNDEFINED)
      this.set('debugging', XT.opts['orm-installer-debugging']);

    // need to test to make sure we can find the damn
    // definitions
    try {
      if(fs.statSync(root).isDirectory())
        XT.watch.createMonitor(root, function() {
          self.fileSystemMonitor.apply(self, arguments);
        });
    } catch(err) {
      this.set('isDisabled', YES);
      this.set('errorStatus', 
        { message: err.message, context: 'intializing' });
    }

    // tell the devUI server that on socket connections
    // for our domain to send them to us
    XT.devUI.setSocketHandler('/orm', 'connection', this.initSocket, this);
  },

  /**
    When a socket connects to the devUI server for the correct
    domain we set it to respond properly on the appropriate events.

    @param {} socket The socket that needs initialization.
    @private
  */
  initSocket: function(socket) {
    var self = this;
    socket.send("debugging is turned [ %@ ]".f(this.get('debugging') ? 'on' : 'off'));
    this.populateSocket(socket);
    socket
      .on('refresh', function() {
        self.populateSocket(socket);
      })
      .on('install', function(list) {
        socket.send("received install request for %@ ORM%@".f(
          list.length, list.length > 1 ? 's' : ''));
        socket.installed = [];
        self.install(socket, list);
      })
      .on('generate', function(instructions) {
        if(XT.modelGenerator) {
          socket.send("attempting to generate %@ model%@".f(instructions.list.length,
            instructions.list.length > 1 ? 's' : ''));
          self.generateModelFiles(socket, instructions.list, instructions.subclass);
        }
        else socket.json.emit('error', { message: "can't generate models, generator not found",
          context: "model generation" });
      });
  },

  generateModelFiles: function(socket, list, subclass) {
    var models = socket.models,
        gen = {},
        subs = subclass ? {} : null, 
        names = [], i, 
        path = XT.fs.__path__, orm, filename, writePath;
    for(i=0; i<list.length; ++i) {
      orm = this.ormFromName(socket, list[i]);
      if(!orm) {
        socket.json.emit('error', { message: "could not find %@".f(list[i]), context: "generate model" }); 
        continue;
      } 
      filename = orm.type.d().pre('_').suf('.js');
      writePath = path.join(orm.writePath, filename);
      filename = writePath;

      if(names.contains(filename))
        socket.json.emit('error', { message: "somehow the same file is being entered twice", context: "generate model" });
      gen[filename] = models[list[i]].superclass || "// ERROR: COULD NOT FIND GENERATED MODEL FOR ORM %@".f(list[i]);
      if(subs) subs[filename.slice(1)] = models[list[i]].subclass;
      names.push(filename);
    }
    XT.modelGenerator.writeFiles(gen, YES, socket);
    if(subs) XT.modelGenerator.writeFiles(subs, NO, socket);
    socket.send("all done writing models");
  },

  /**
    The file monitor manages real-time changes of files
    in the system. Unfortunately there are currently
    some limitations in Node.js that require the use of
    polling - rather inefficient, but useful and until
    they provide a native support for OS X filesystem
    events this will have to do.

    As of now there is also a bug in the npm package `watch`
    that fires filesystem events twice. A hack has been
    implemented to keep these listeners from actually
    participating twice but the work is already being done.
    There is a pending pull-request on github that hopefully
    will be incorporated and fix the issue soon.

    @param {} monitor The filesystem monitor object.
  */ 
  fileSystemMonitor: function(monitor) {
    if(this.isMonitoring) return XT.debug(
        "attempt to monitor filesystem twice");
    var self = this,
        last = {};
    monitor.on('changed', function(file, curr, prev) {
      if(XT.fs.ext(file) !== 'json') return;
      if(last.changed === file) return last.changed = null;
      last.changed = file;
      file = XT.fs.shorten(file, 3);
      XT.debug("File changed: %@".f(file));
      self.populate();
    }).on('created', function(file, stat) {
      if(XT.fs.ext(file) !== 'json') return;
      if(last.created === file) return last.created = null;
      last.created = file;
      file = XT.fs.shorten(file, 3);
      XT.debug("File was created: %@".f(file));
      self.populate();
    }).on('removed', function(file, stat) {
      if(XT.fs.ext(file) !== 'json') return;
      if(last.removed === file) return last.removed = null;
      last.removed = file;
      file = XT.fs.shorten(file, 3);
      XT.debug("File was removed: %@".f(file));
      self.populate();
    });
    this.isMonitoring = YES;
  },

  /**
    Used by diveSync, it filters the files depending on their extension. 
    Directories are automatically accepted but files without a `.json`
    extension are ignored.

    @param {String} path The full path to the file/directory.
    @param {Boolean} dir Whether or not the path is a directory.
    @returns {Boolean} YES|NO if the file/directory should be included.
  */
  fileFilter: function(path, dir) {
    if(dir) return YES;
    return XT.fs.ext(path) === 'json' ? YES : NO;
  },

  /**
    On filesystem changes, this finds active sockets and
    tells them to refresh. 
  */
  populate: function() {
    var sockets = XT.devUI.socketsFor('/orm'), 
        ids = XT.keys(sockets), i, socket;
    for(i=0; i<ids.length; ++i) {
      socket = sockets[ids[i]];
      if(socket) this.populateSocket(socket);
    }
  },

  /**
    Populates an individual socket. Reads entire filesystem under rootDir
    for all definitions, loads them, calculates dependencies and
    notifies client of what it has found.

    @param {} socket The socket to populate.
  */
  populateSocket: function(socket) {
    var filter = this.fileFilter,
        root = this.get('rootDir'),
        self = this,
        fs = XT.fs.__fs__,
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
    XT.dive(root, { recursive: YES, filter: filter },
      function(err, file) {

        if(err) socket.json.emit('error', {
          message: err.message, context: XT.fs.shorten(file, 3) });

        // issue a warning and keep on trucking
        if(err) return issue(XT.warning(err));

        // here we look for json parse errors and file read
        // errors and attempt to keep going if we can
        // because the dependencies calculation should take
        // care of missing dependencies or errors
        try {
          var json = XT.json(fs.readFileSync(file, 'utf8'), YES),
              fn = XT.fs.basename(file),
              ext = json.isExtension ? YES : NO,
              ns = json.nameSpace,
              type = json.type,
              context = json.context;
              
          // set the filename as an added separate property
          json.fileName = fn;

          // set the FULL path to the file for generation later
          json.fullPath = file;
  
          json.writePath = writePath(file);

          // if the definition is for an extension it has special
          // requirements (slightly) and is handled separately
          if(ext) extensions = XT.addProperties(extensions, context, ns, type, json);

          // normal ORM's are handled in the main tree being
          // organized by namespace
          else orms = XT.addProperties(orms, ns, type, json);

          if(!ext) {
            if(XT.modelGenerator) {
              models["%@.%@".f(ns, type)] = {
                superclass: XT.modelGenerator.generate(json, YES),
                subclass: XT.modelGenerator.generate(json, NO)
              };
            }
          }
        } catch(err) {
          socket.json.emit('error',
            { message: err.message, context: XT.fs.shorten(file, 3) });
        }
    });

    socket.extensions = extensions;
    socket.orms = orms;
    socket.models = models;

    // find the base for each of the extensions and nest it
    // before calculating dependencies
    var contexts = XT.keys(extensions),
        context, namespaces, namespace, names, 
        name, i, j, k, ext, type, ns, orm;
    for(i=0; i<contexts.length; ++i) {
      context = extensions[contexts[i]];
      namespaces = XT.keys(context);
      for(j=0; j<namespaces.length; ++j) {
        namespace = context[namespaces[j]];
        names = XT.keys(namespace);
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

  /**
    Examines each ORM and extension to determine what
    their dependencies are. Once they have been determined
    it then attempts to see whether an ORM or extension
    is valid and should be allowed to install due to 
    missing or errant dependencies. 

    This is done in a brute-force inefficient way. 

    If the noEmitToClient flag is set to YES, it will instead
    emit a local event with a unique key.

    @param {} socket The socket to communicate on.
    @param {Boolean} [noEmitToClient] Whether or not to emit an instruction
      to the client to repopulate its list.
  */
  calculateDependencies: function(socket, noEmitToClient) {
    socket.send("calculating dependencies");
    var orms = socket.orms,
        exts = socket.extensions, 
        emit = !!! noEmitToClient,
        namespaces, namespace, i, j, name, names, ext, orm;

    this.debug("analyzing dependencies for individual ORM's");

    // first we iterate over and determine individual
    // dependencies for each of the known ORM's
    namespaces = XT.keys(orms); 
    for(i=0; i<namespaces.length; ++i) {
      namespace = orms[namespaces[i]];
      names = XT.keys(namespace);

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
      names = XT.keys(namespace);

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

  /**
    Calculates individual dependencies for an ORM or extension
    based on what properties and extensions are listed in
    its definition.

    @param {} socket The socket to communicate on.
    @param {Object} orm The ORM or extension to examine.
    @param {Array} [deps] During recursive execution the dependencies
      will be passed down in an array.
  */
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
        orm.missingDependencies = YES;
        orm.mdeps.push('%@.%@'.f(dep.namespace, dep.type));

        this.debug("missing dependency => %@.%@".f(dep.namespace, dep.type));

      }
    }

    this.debug("final dependencies for %@.%@ => %@".f(orm.nameSpace, orm.type, this.depsString(deps)));
  },

  /**
    Looks for certain features in the dependency hierarchy to
    determine if an ORM should be enabled or not.

    @param {Object} orms The ORM container object.
    @param {Object} orm The ORM to check.
    @returns {Boolean} YES|NO if ORM should be enabled.
  */
  checkDependencies: function(socket, orm) {
    var deps = orm.deps,
        orms = socket.orms,
        enabled = YES, dep, found, i;

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

        enabled = NO;
        continue;
      }

      this.debug("checking dependencies for dependency => %@.%@".f(found.nameSpace, found.type));

      if(!this.checkDependencies(socket, found)) {
        if(XT.none(orm.fdeps)) orm.fdeps = [];
        orm.fdeps.push('%@.%@'.f(found.nameSpace, found.type));

        this.debug("found failed dependency %@.%@, disabling ORM".f(dep.namespace, dep.type));

        enabled = NO;
        continue;
      }
    }

    this.debug("found ORM %@.%@ to be %@".f(orm.nameSpace, orm.type, enabled ? 'enabled' : 'disabled'));

    return enabled;
  },

  /**
    Installs selected ORM's and extensions to the database.

    @param {} socket The socket to communicate on.
    @param {Array} list The list of names of ORM's and/or extensions
      to install.
  */
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
        "Could not find requested ORM during installation: %@".f(next)));
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

  /**
    Returns a string version of the names of ORM's/extensions that
    were in a dependency array.

    @param {Array} deps The array of dependency ORM's to convert to
      human readable string form.
    @returns {String} The string form of the array with object names.
  */
  depsString: function(deps) {
    var temp = [], i;
    for(i=0; i<deps.length; ++i)
      temp.push("%@.%@".f(deps[i].namespace, deps[i].type));
    return temp.join(', ');
  },

  /**
    Submits a stringified hash to the database.

    @param {} socket The socket to communicate on.
    @param {String} name The name of the ORM being installed.
    @param {Object} orm The ORM hash being installed.
    @param {Array} list The list of ORM's yet to be installed, null
      if being called by the extensions handler.
    @param {Array} installed The array of installed ORM's or extensions.
  */
  submit: function(socket, name, orm, list, installed, isExtension) {
    var query = "select xt.install_orm('%@')",
        self = this,
        exts = socket.extensions,
        ctxt = orm.context,
        namespace = orm.nameSpace,
        type = orm.type, 
        extlist = [], text, ext, i, contexts, context;

    socket.send("installing %@ %@".f(isExtension ? "(extension, %@)".f(ctxt) : '', name));

    // this is a tricky little bitty for removing the extensions from
    // the ORM that are to be installed separately while NOT removing
    // any of the extensions that might already have been nested
    if(!isExtension) {
      contexts = XT.keys(exts);
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
                return NO;
            }
            return YES;
          });
        }
      }
    }
    text = XT.json(this.cleanse(orm));
    query = query.f(text);
    XT.db.query(query, function(err, res) {
      if(err) {
        socket.json.emit('error', { message: err.message,
          context: "installing %@ %@".f(
            isExtension ? "(extension, %@)".f(ctxt) : '', orm.type) });
        socket.json.emit('error', { message: "attempting to recalculate dependencies "
          + "and continue with what is left to install", context: orm.type });
        orm.enabled = NO;
        self.once('xtRecalculationDone'+socket.id, function() {
          socket.send("recalculation complete, attempting to continue installing");
          self.install(socket, list);
        });
        self.calculateDependencies(socket, YES);
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
            self.submit(socket, name, ext, list, installed, YES);
          }
        });
        ext = extlist.shift();
        self.submit(socket, name, ext, null, installed, YES);
      }
      else if(isExtension) self.emit('xtExtensionInstalled'+socket.id, orm);
      else if(list) {
        if(list.length == 0) return socket.send("all done");
        self.install(socket, list);
      }
    });
  },

  /**
    Install extensions if possible.

    @param {} socket The socket to communicate on.
  */
  installExtensions: function(socket) {
    socket.send("installing any extensions");
    var exts = socket.extensions,
        self = this, 
        installed = [],
        namespaces = XT.keys(exts), 
        namespace, names, name, i, j, ext;
    for(i=0; i<namespaces.length; ++i) {
      namespace = exts[namespaces[i]],
      names = XT.keys(namespace);
      for(j=0; j<names.length; ++j) {
        name = names[j],
        ext = namespace[name];
        this.submit(socket, name, ext, null, installed);
      }
    }
  },

  /**
    Find and return an ORM from a string of the name.

    @param {} socket The socket to communicate on.
    @param {String} name The name of the ORM to find.
    @returns {Object} The ORM object hash if found, null otherwise.
  */
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

  /**
    Attempts to remove any added properties on the ORM hashes.

    @param {Object} orm The ORM hash object.
    @returns {Object} The cleaned up ORM hash.
  */
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

  /** @private */
  __populateWhenReady__: function(socket) {
    socket.json.emit('populate', socket.orms);
  }.by('xtSocketPopulated'),

  /** @private */
  debug: function(message) {
    if(!this.get('debugging')) return;
    XT.debug(message);
  },

  /** @private */
  className: 'XT.ormInstaller'

});
