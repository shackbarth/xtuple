
/** @class


  THIS CLASS IS HIGHLY VOLATILE AND IS NOT SAFE FOR
  PRODUCTION IN ANY WAY SHAPE OR FORM.


*/
XT.orm = XT.Object.create(
  /** @lends Orm.prototype */ {

  orms: {},
  ormRoot: null,
  isDisabled: NO,
  ignoredNamespaces: "PUBLIC PRIVATE".w(),

  /** @private */
  init: function() {
    var f = XT.fs.__fs__,
        p = XT.fs.__path__,
        b = XT.fs.basePath,
        s = this,
        r = this.ormRoot = p.resolve(b, '../database/orm');

    // if we can't read the database directory disable
    // the service entirely
    try {

      if(f.statSync(r).isDirectory());

        // we want to set up a watcher to monitor changes
        // to the orm directory tree
        XT.watch.createMonitor(r, function() { s.fileMonitor.apply(s, arguments); });

    } catch(e) { this.set('isDisabled', YES); }

    // THIS DOES NOT NEED TO BE HERE SINCE IT IS FOR
    // ENTIRE ROOT OF WWW???
    var server = XT.server.create({
      port: 8080,
      useWebSocket: YES,
      name: 'devUI',
      _server: XT.connect.createServer(
        XT.connect.static(XT.fs.basePath + '/www')
      )
    }).once('xtSocketsSet', function(sockets) {
      sockets.on('connection', function(socket) {
        s.populate(socket); 
        socket.on('refresh', function() {
          s.populate(socket);
        });
        socket.on('install', function(list) {
          socket.send("received install request for %@ ORM%@".f(list.length, 
            list.length > 1 ? 's' : ''));
          socket.installed = [];
          s.installList(socket, list);
        });
      });
    }).start();

    this.set('server', server);
  },

  fileMonitor: function(monitor) {

    var s = this,
        p = {};

    // there is a known bug with the npm package watch
    // that fires these events twice - it is harmless
    // for now but hopefully the pull request that is
    // pending that fixes it will be incorporated soon

    monitor.on('changed', function(file, curr, prev) {
      if(XT.fs.ext(file) !== 'json') return;
      if(p.changed === file) return p.changed = null;
      p.changed = file;
      file = XT.fs.shorten(file, 3);
      s.notifyAll("file changed => %@".f(file), 'populate');
    })
           .on('created', function(file, stat) {
      if(XT.fs.ext(file) !== 'json') return;
      if(p.created === file) return p.created = null;
      p.created = file;
      file = XT.fs.shorten(file, 3);
      s.notifyAll("new file => %@".f(file), 'populate');
    })
           .on('removed', function(file, stat) {
      if(XT.fs.ext(file) !== 'json') return;
      if(p.removed === file) return p.removed = null;
      p.removed = file;
      file = XT.fs.shorten(file, 3);
      s.notifyAll("file removed => %@".f(file), 'populate');
    });
  },

  notifyAll: function(message, directive, error) {
    var sockets = this.get('server.sockets').sockets,
        keys = XT.keys(sockets),
        i = 0,
        l = keys.length, socket, ses, func;
    for(; i<l; ++i) {
      ses = keys[i];
      socket = sockets[ses];
      if(error) socket.json.emit('error', message);
      else socket.send(message);
      func = this[directive];
      if(XT.typeOf(func) === XT.t_function)
        func.call(this, socket);
    }
  },

  __isDisabled__: function() {
    if(!this.get('isDisabled')) return;
    this.populate = this.__disabledPopulate__;
    issue(XT.warning("Could not enable ORM interface, could not find repository"));
  }.by('isDisabled'),

  __disabledPopulate__: function(socket) {
    var m = "Unable to find the database repository to read from";
    socket.json.emit('error', { message: m, context: 'init' });
  },

  filter: function(path, dir) {
    if(dir) return YES;
    return XT.fs.ext(path) === 'json' ? YES : NO;
  },

  /**
  */
  populate: function(socket) {

    var filter = this.filter,
        root = this.get('ormRoot'),
        self = this,
        fs = XT.fs.__fs__,
        orms = {},
        extensions = {};

    // we need to iterate over the directories and
    // read in all of the files available for
    // cross-reference and calculating dependencies

    socket.send("searching for valid ORM's and loading them");

    // note this is a blocking method
    XT.dive(root, { recursive: YES, filter: filter }, 
      function(err, file) {

        if(err) {
          return issue(XT.warning(err));
        }

        try {
          var json = XT.json(fs.readFileSync(file, 'utf8'), YES);
          json.fileName = XT.fs.basename(file);
          if(json.isExtension) {
            if(!extensions[json.nameSpace])
              extensions[json.nameSpace] = {};
            extensions[json.nameSpace][json.type] = json; 
          }
          else {
            if(!orms[json.nameSpace]) orms[json.nameSpace] = {};
            orms[json.nameSpace][json.type] = json;
          }
        } catch(e) {
          socket.json.emit('error', { message: e.message, context: XT.fs.shorten(file, 3) });
        }
      }
    );

    socket.extensions = extensions;

    this.calculateDeps(socket, orms);
  },

  depsFor: function(orms, orm, deps) {
    var properties = orm.properties || [],
        extensions = orm.extensions || [],
        deps = deps ? deps : orm.deps ? orm.deps : orm.deps = [],
        ignore = this.get('ignoredNamespaces'); 

    if(XT.none(orm.mdeps)) orm.mdeps = [];

    // attempt to pull dependencies from the properties
    // if they exist
    for(k=0; k<properties.length; ++k) {
      var prop = properties[k];
      if(prop.toOne || prop.toMany) {
        var _w = prop.toOne ? prop.toOne : prop.toMany,
            // _n = _w.type.match(/^(.*)\./)[1],
            _n = orm.nameSpace,
            // _t = _w.type.match(/\.(.*)$/)[1];
            _t = _w.type;
        deps.push({ namespace: _n, type: _t }); 
      }
    } // properties

    // attempt to pull dependencies from the extensions
    // if they exist
    for(k=0; k<extensions.length; ++k) {
      var ext = extensions[k];
      ext.nameSpace = orm.nameSpace;
      this.depsFor(orms, ext, deps); 
    } // extensions

    // attempt to pull a dependency from the table if
    // the namespace is not public, private or null
    namespace = orm.table.match(/^(.*)\./);

    // all done if there isn't a unique namespace
    if(!XT.none(namespace) && !ignore.contains(namespace[1].toUpperCase())) {

      // reassign it to the correct part of the match
      namespace = namespace[1].toUpperCase();

      // grab the rest of the table definition and
      // humanize it (capitalize + camel-case)
      table = orm.table.match(/\.(.*)$/)[1].h();

      // insert it as a dep and be done with this
      deps.push({ namespace: namespace, type: table });
    }

    for(var i=0; i<deps.length; ++i) {
      var dep = deps[i],
          ns = orms[dep.namespace],
          type = ns[dep.type];
      if(XT.none(type)) {
        orm.missingDependencies = YES;
        orm.mdeps.push('%@.%@'.f(dep.namespace, dep.type));
      }
    }

  },

  calculateDeps: function(socket, orms) {
    
    socket.send("calculating dependencies");

    var ns = XT.keys(orms), i, j;

    // now we need to iterate over these and figure
    // out what the hell their relationships are if
    // any

    for(i=0; i<ns.length; ++i) {
      var namespace = ns[i],
          names = XT.keys(orms[namespace]);
      for(j=0; j<names.length; ++j) {
        var name = names[j],
            orm = orms[namespace][name];
        this.depsFor(orms, orm);
      } // names
    } // namespaces

    
    for(i=0; i<ns.length; ++i) {
      var namespace = ns[i],
          names = XT.keys(orms[namespace]);
      for(j=0; j<names.length; ++j) {
        var name = names[j],
            orm = orms[namespace][name];
        orm.enabled = this.isEnabled(orms, orm);

        // XT.debug("%@ is now %@".f(orm.type, orm.enabled ? "ENABLED" : "DISABLED"));
      }

      if(i == ns.length-1) {

        // push them back to the client
        socket.json.emit('populate', orms);

        socket.orms = orms;
      }
    } 

  },

  isEnabled: function(orms, orm) {
    var deps = orm.deps,
        enabled = YES, dep, odep, i;
    if(XT.none(deps)) return enabled;
    for(i=0; i<deps.length; ++i) {
      dep = deps[i];
      odep = orms[dep.namespace][dep.type];
      if(XT.none(odep)) {
        if(XT.none(orm.udeps)) orm.udeps = [];
        orm.udeps.push('%@.%@'.f(dep.namespace, dep.type));
        enabled = NO;
        continue;
      }
      if(!this.isEnabled(orms, odep)) {
        if(XT.none(orm.fdeps)) orm.fdeps = [];
        orm.fdeps.push('%@.%@'.f(dep.namespace, dep.type));
        enabled = NO;
        continue;
      }
    }
    return enabled;
  },

  installList: function(socket, list) {
    
    if(XT.none(list) || list.length == 0) {
      socket.send("all done");
      socket.emit('complete');

      XT.debug("final installed list =>\n", socket.installed);

      socket.installed = null;
      XT.debug("all done");
      return;
    }

    var next = list.shift(),
        installed = socket.installed,
        self = this;

    // XT.debug("installList with next => %@".f(next));

    if(installed.contains(next)) { 

      //XT.debug("%@ was already installed, moving to next".f(next));

      return this.installList(socket, list);
    }

    var orm = this.ormFromName(socket, next);

    if(XT.none(orm) || !orm.enabled)
      return this.installList(socket, list);

    if(orm.deps && orm.deps.length > 0) {

      // XT.debug("%@ has dependencies".f(next));

      var deps = [];
      for(var i=0; i<orm.deps.length; ++i) {
        var name = '%@.%@'.f(orm.deps[i].namespace, orm.deps[i].type);
        if(installed.contains(name)) {

          // XT.debug("%@ was already installed, skipping".f(name));
          
          continue;
        }

        // XT.debug("%@ has not been installed, adding to list".f(name));

        deps.push(name);
      }
      if(deps.length > 0) {

        // XT.debug("some dependencies are still not installed...");

        deps.push(next);
        deps = deps.concat(list);
        return this.installList(socket, deps);
      }
    }

    // basic query
    var query = "select private.install_orm('%@')",
        text = XT.json(this.cleanse(orm)),
        query = query.f(text);

    // XT.debug("running query: ", query);

    socket.send("installing %@".f(next));
     
    // run the damn thing and get it over with
    XT.db.query(query, function(e, r) {

      // if there is an error just about everything behind
      // it is going to screw up to that depended on its 
      // success but...oh well
      if(e) { 
        socket.json.emit('error', { message: e.message,
          context: "installing %@".f(orm.type) });

        socket.json.emit('error', { message: "cannot continue without "
          + "recalculating dependencies and that feature is not "
          + "currently available", context: orm.type });
        return;
      }

      // let the client know it was successful
      socket.emit('success', next);

      installed.push(next);

      // check for extensions...
      var exts = socket.extensions;
      if(exts[orm.nameSpace]) {
        if(exts[orm.nameSpace][orm.type]) {

          var etype = '%@.%@'.f(orm.nameSpace, orm.type),
              query = "select private.install_orm('%@')",
              text = XT.json(self.cleanse(exts[orm.nameSpace][orm.type])),
              query = query.f(text);

          socket.send("installing extension %@".f(etype));

          XT.db.query(query, function(e, r) {
            if(e) {
              socket.json.emit('error', { message: e.message,
                context: "installing extension %@".f(etype) });
            }
            self.installList(socket, list); 
          });
          return;
        }
      }

      self.installList(socket, list);

    });
     
  },

  ormFromName: function(socket, name) {
    var orms = socket.orms,
        ns = name.match(/^(.*)\./)[1],
        ty = name.match(/\.(.*)$/)[1],
        orm = orms[ns][ty];
    return orm;
  },

  cleanse: function(orm) {
    var possible = "deps mdeps fdeps udeps fileName".w(), key, i;
    for(i=0; i<possible.length; ++i) {
      key = possible[i];
      delete orm[key];
    } 

    // this might cause problems
    if(orm.extensions) {
      for(i=0; i<orm.extensions.length; ++i) {
        var ext = orm.extensions[i];
        orm.extensions[i] = this.cleanse(ext);
      }
    }
    return orm;
  },

  /** @private */
  className: 'XT.orm'

});

// export an instance
module.exports = XT.orm;
