
/** @class
*/
xt.orm = xt.object.extend(
  /** @lends Orm.prototype */ {

  orms: null,
  exts: null,

  /** @private */
  init: function() {
    this.orms = {};
    this.exts = {};
  },

  /**
  */
  populate: function(socket) {
    var basePath = '%@/lib/xt/orm'.f(xt.fs.basePath),
        ormsPath = '%@/core'.f(basePath),
        extsPath = '%@/exts'.f(basePath), 
        fs = xt.fs.__fs__,
        self = this, i, j, json;

    // we are going to arbitrarily use synchronous
    // filesystem reads since we need to populate
    // sequentially

    socket.send("reading all ORM and extension directories");

    try {
      var orms = this._orms = fs.readdirSync(ormsPath),
          exts = this._exts = fs.readdirSync(extsPath);
    } catch(e) { return socket.json.emit('error', 
      { message: e.message, context: 'reading files' }); }
        
    // we need to iterate over the directories and
    // read in all of the files available for
    // cross-reference and calculating dependencies

    socket.send("looking for valid ORM's and extensions");

    try {
      for(i=0; i<orms.length; ++i) {
        var dir = '%@/core/%@'.f(basePath, orms[i]), files;
        if(orms[i][0] === '.') continue;
        if(!fs.statSync(dir).isDirectory()) continue;
        this.loadFiles('orms', dir, socket);
      } 
      for(i=0; i<exts.length; ++i) {
        var dir = '%@/exts/%@'.f(basePath, exts[i]), files;
        if(exts[i][0] === '.') continue;
        if(!fs.statSync(dir).isDirectory()) continue;
        this.loadFiles('exts', dir, socket);
      }
    } catch(e) { return socket.json.emit('error', 
      { message: e.message, context: dir }); }

    // now we have all of the core ORM's and their possible
    // extensions time to sort    

    this.calculateDeps(socket);
  },

  calculateDeps: function(socket) {
    var orms = this.get('orms'),
        exts = this.get('exts'), 
        okeys = xt.keys(orms),
        ekeys = xt.keys(exts), i, k, v, j, p, t;
    
    // now we need to iterate over these and figure
    // out what the hell their relationships are if
    // any

    socket.send("calculating dependencies");

    for(i=0; i<okeys.length; ++i) {
      k = okeys[i];
      v = orms[k];

      // first check to see if there are normal
      // dependencies
      if(!xt.none(v.properties))
        for(j=0; j<v.properties.length; ++j) {
          p = v.properties[j];
          if(p.toOne || p.toMany) {
            t = p[ p.toMany ? 'toMany' : 'toOne' ].type.match(/XM\.(.*)$/)[1];
            if(xt.none(v.deps)) v.deps = [];
            v.deps.push(t);
          }
        }

      // now check to see if there are required
      // extensions to look for

    }

    // push them back to the client
    socket.json.emit('populate', this.get('orms'));
  },

  loadFiles: function(property, dir, socket) {
    var fs = xt.fs.__fs__, files, i, json, path;
    try {
      files = xt.fs.reduce(fs.readdirSync(dir), 'json');
      for(i=0; i<files.length; ++i) {
        path = '%@/%@'.f(dir, files[i]);
        json = xt.json(fs.readFileSync(path, 'utf-8'));
        json.fileName = files[i];
        this.set('%@.%@'.f(property, json.type), json);
      }
    } catch(e) { return socket.json.emit('error', 
      { message: e.message, context: files[i] }); }
  },

  /** @private */
  className: 'xt.orm'

});

// export an instance
module.exports = xt.orm.create();
