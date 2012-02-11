
/** @class
*/
xt.orm = xt.object.create(
  /** @lends Orm.prototype */ {

  orms: {},
  ormRoot: null,
  isDisabled: NO,
  ignoredNamespaces: "PUBLIC PRIVATE".w(),

  /** @private */
  init: function() {
    var f = xt.fs.__fs__,
        p = xt.fs.__path__,
        b = xt.fs.basePath,
        s = this,
        r = this.ormRoot = p.resolve(b, '../database/orm');

    // if we can't read the database directory disable
    // the service entirely
    try {

      if(f.statSync(r).isDirectory());

        // we want to set up a watcher to monitor changes
        // to the orm directory tree
        xt.watch.createMonitor(r, function() { s.fileMonitor.apply(s, arguments); });

    } catch(e) { this.set('isDisabled', YES); }

    // THIS DOES NOT NEED TO BE HERE SINCE IT IS FOR
    // ENTIRE ROOT OF WWW???
    var server = xt.server.create({
      port: 8080,
      useWebSocket: YES,
      name: 'devUI',
      _server: xt.connect.createServer(
        xt.connect.static(xt.fs.basePath + '/www')
      )
    }).once('xtSocketsSet', function(sockets) {
      sockets.on('connection', function(socket) {
        s.populate(socket); 
        socket.on('refresh', function() {
          s.populate(socket);
        });
        socket.on('install', function(list) {
          socket.send("received install request for %@ ORM's".f(list.length));
          s.requestInstall(socket, list);
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
      if(xt.fs.ext(file) !== 'json') return;
      if(p.changed === file) return p.changed = null;
      p.changed = file;
      file = xt.fs.shorten(file, 3);
      s.notifyAll("file changed => %@".f(file), 'populate');
    })
           .on('created', function(file, stat) {
      if(xt.fs.ext(file) !== 'json') return;
      if(p.created === file) return p.created = null;
      p.created = file;
      file = xt.fs.shorten(file, 3);
      s.notifyAll("new file => %@".f(file), 'populate');
    })
           .on('removed', function(file, stat) {
      if(xt.fs.ext(file) !== 'json') return;
      if(p.removed === file) return p.removed = null;
      p.removed = file;
      file = xt.fs.shorten(file, 3);
      s.notifyAll("file removed => %@".f(file), 'populate');
    });
  },

  notifyAll: function(message, directive, error) {
    var sockets = this.get('server.sockets').sockets,
        keys = xt.keys(sockets),
        i = 0,
        l = keys.length, socket, ses, func;
    for(; i<l; ++i) {
      ses = keys[i];
      socket = sockets[ses];
      if(error) socket.json.emit('error', message);
      else socket.send(message);
      func = this[directive];
      if(xt.typeOf(func) === xt.t_function)
        func.call(this, socket);
    }
  },

  __isDisabled__: function() {
    if(!this.get('isDisabled')) return;
    this.populate = this.__disabledPopulate__;
    issue(xt.warning("Could not enable ORM interface, could not find repository"));
  }.by('isDisabled'),

  __disabledPopulate__: function(socket) {
    var m = "Unable to find the database repository to read from";
    socket.json.emit('error', { message: m, context: 'init' });
  },

  filter: function(path, dir) {
    if(dir) return YES;
    return xt.fs.ext(path) === 'json' ? YES : NO;
  },

  /**
  */
  populate: function(socket) {

    var filter = this.filter,
        root = this.get('ormRoot'),
        self = this,
        fs = xt.fs.__fs__,
        orms = {};

    ////// // we need to iterate over the directories and
    ////// // read in all of the files available for
    ////// // cross-reference and calculating dependencies

    socket.send("searching for valid ORM's and loading them");

    // note this is a blocking method
    xt.dive(root, { recursive: YES, filter: filter }, 
      function(err, file) {
        try {
          var json = xt.json(fs.readFileSync(file, 'utf-8'), YES);
          json.fileName = xt.fs.basename(file);
          if(!orms[json.nameSpace]) orms[json.nameSpace] = {};
          orms[json.nameSpace][json.type] = json;
        } catch(e) {
          socket.json.emit('error', { message: e.message, context: xt.fs.shorten(file, 3) });
        }
      }
    );

    this.calculateDeps(socket, orms);
  },

  depsFor: function(orm, deps) {
    var properties = orm.properties || [],
        extensions = orm.extensions || [],
        deps = deps ? deps : orm.deps ? orm.deps : orm.deps = [],
        ignore = this.get('ignoredNamespaces'), namespace, table, k;

    // attempt to pull dependencies from the properties
    // if they exist
    for(k=0; k<properties.length; ++k) {
      var prop = properties[k];
      if(prop.toOne || prop.toMany) {
        var _w = prop.toOne ? prop.toOne : prop.toMany,
            _n = _w.type.match(/^(.*)\./)[1],
            _t = _w.type.match(/\.(.*)$/)[1];
        deps.push({ namespace: _n, type: _t }); 
      }
    } // properties

    // attempt to pull dependencies from the extensions
    // if they exist
    for(k=0; k<extensions.length; ++k) {
      var ext = extensions[k];
          this.depsFor(ext, deps); 
    } // extensions

    // attempt to pull a dependency from the table if
    // the namespace is not public, private or null
    namespace = orm.table.match(/^(.*)\./);

    // all done if there isn't a unique namespace
    if(xt.none(namespace) || ignore.contains(namespace[1].toUpperCase())) return;

    // reassign it to the correct part of the match
    namespace = namespace[1].toUpperCase();

    // grab the rest of the table definition and
    // camel-case it
    table = orm.table.match(/\.(.*)$/)[1].h();

    // insert it as a dep and be done with this
    deps.push({ namespace: namespace, type: table });
  },

  calculateDeps: function(socket, orms) {
    
    socket.send("calculating dependencies");

    var ns = xt.keys(orms), i, j, k;

    // now we need to iterate over these and figure
    // out what the hell their relationships are if
    // any

    for(i=0; i<ns.length; ++i) {
      var namespace = ns[i],
          names = xt.keys(orms[namespace]);
      for(j=0; j<names.length; ++j) {
        var name = names[j],
            orm = orms[namespace][name];
        this.depsFor(orm);
      } // names
    } // namespaces

    // push them back to the client
    socket.json.emit('populate', orms);

    socket.orms = orms;
  },

  requestInstall: function(socket, list) {
    var self = this, done = [];
    for(var i=0; i<list.length; ++i) {
      var type = list[i],
          ns = type.match(/^(.*)\./)[1],
          type = type.match(/\.(.*)$/)[1],
          full = '%@.%@'.f(ns, type),
          orms = socket.orms,
          orm = orms[ns][type];

      if(xt.none(orm)) {
        xt.warn("orm was none! (ns: %@ type; %@)".f(ns, type));
        socket.json.emit('error', { message: "could not find %@ %@".f(ns, type),
          context: 'installing' });
        continue;
      }

      self.loadDependencies(socket, orm, done); 
    }
  },

  install: function(socket, orm, done) {
    
    if(done.contains(orm.type)) {
      xt.debug("TRYING TO INSTALL WHAT HAS ALREADY BEEN INSTALLED! %@".f(orm.type));
      return;
    }

    // make sure we don't try to load it again
    done.push(orm.type);

    socket.send("attempting to install %@".f(orm.type)); 

    // remove the keys so the query won't fail
    delete orm.deps;
    delete orm.fileName;

    // basic query
    var query = "select private.install_orm('%@')",
        text = xt.json(orm),
        query = query.f(text);

    xt.debug("running query: ", query);
     
    // run the damn thing and get it over with
    xt.db.query(query, function(e, r) {

      // if there is an error just about everything behind
      // it is going to screw up to that depended on its 
      // success but...oh well
      if(e) return socket.json.emit('error', { message: e.message,
        context: "installing %@".f(orm.type) });

      // let the client know it was successful
      socket.emit('success', '%@.%@'.f(orm.nameSpace, orm.type));
    });
  },

  loadDependencies: function(socket, orm, done) {
    var deps = orm.deps,
        orms = socket.orms;

    if(done.contains(orm.type)) {
      xt.debug("already loaded %@".f(orm.type));
      return;
    }

    if(deps && deps.length > 0) {
      socket.send("loading dependencies for %@".f(orm.type));
      for(var i=0; i<deps.length; ++i) {
        var dep = deps[i],
            ns = dep.namespace,
            type = dep.type,
            orm = orms[ns][type];

          if(xt.none(orm)) {
            xt.warn("orm was none! (ns: %@ type; %@)".f(ns, type));
            socket.json.emit('error', { message: "could not find %@ %@".f(ns, type),
              context: 'installing' });
            return;
          }

        this.loadDependencies(socket, orm, done);
      }
    }

    this.install(socket, orm, done);
  },

  /** @private */
  className: 'xt.orm'

});

// export an instance
module.exports = xt.orm;
