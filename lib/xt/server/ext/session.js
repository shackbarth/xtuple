
/** @class
*/
xt.session = xt.object.extend(
  /** @lends xt.session.prototype */ {
   
  /** @private */
  init: function() {
    
    xt.debug("in xt.session.init");
    
    var xtr = this.get('xtr'),
        u = this.get('userName'),
        s = this.get('sid'),
        k = this.get('userKey'),
        d = this.get('data'),
        h = xtr.get('handler'), // if a handler is waiting on the session
        t = {},
        i = xtr.get('info'),
        self = this;
    
    t.userKey = k;
    t.sid = s = s || xt.session.id();
    t.userName = u;
    t.ip = i.clientAddress;
    
    this.set('sid', s);
    
    // if there is a session id already, retrieve
    // the session data
    if(s)
      xt.cache.hgetall(s, function(e, r) {
        if(e) {
          issue(xt.close("Could not retrieve valid session data", xtr));
          delete self.xtr; // free the xt response object
          return;
        }
        self.__setup__(r, t);
      });
    
    // else we create the entry for the session id
    // and overwrite anything that might have been there
    else this.__setup__(xt.none(d) ? {} : d, t);
    
    // make sure the xt response knows it has a session
    xtr.set('session', this);
    
    // remove circular relationship
    delete this.xtr;
    
    if(xtr.get('useSession') && !xt.none(h))
      h.handle(xtr);
  },
  
  /**
    Commits the current session data collection into the cache.
    The data checksum will be updated after the lastModified
    property is updated to the current time.
    
    @param {Function} [callback] The callback to execute after the
      write to the cache has transpired.
    @method
  */
  commit: function(cb) {
    var d = this.get('data'),
        s = this.get('sid'), c, key;
    cb = cb && xt.typeOf(cb) === xt.t_function ? cb : null;
    if(xt.none(d) || xt.none(s)) return;
    d.lastModified = xt.session.timestamp();
    c = xt.session.checksum(d);
    d.checksum = c;
    this.set('checksum', c);
    this.data = d;
    key = '%@:%@:%@'.f(d.userName, d.ip, d.sid);
    xt.cache.hmset(key, d, cb);
  },
    
  reload: function() {},
    
  /** @private */
  __setup__: function(data, bits) {
    xt.mixin(data, bits);
    this.data = data;
    this.data.created = xt.session.timestamp();
    this.commit();
    this.emit('xtReady');
  }
    
});

//.............................................
// Post-Initialization Routines
//
process.once('xtReady', function() {
  xt.mixin(xt.session, 
    /** @lends xt.session */ {
    
    /**
      Creates a checksum of the parameter.
      
      @param {Object|String} data The data to be digested into a checksum.
      @returns {String} The checksum of the data.
      @method
    */
    checksum: function(data) {
      var h = this.__sha1hash__();
      data = xt.typeOf(data) === xt.t_hash ? xt.json(data) : data;
      return h.update(data).digest('hex');
    },
    
    
    /**
      Creates a unique session id from a random MD5 hash.
      
      @returns {String} A unique MD5 session id.
      @method
    */
    id: function() {
      var h = this.__md5hash__();
      return h.update(Math.random().toString()).digest('hex');
    },
    
    /**
      Returns a timestamp in milliseconds.
      
      @returns {Number} The current time in milliseconds.
    */
    timestamp: function() { return new Date().getTime(); },
    
    /**
      Shared SHA1 hash generator for checksum calculations
      of the session datasets.
      
      @property
    */
    __sha1hash__: function() { return xt.crypto.createHash('sha1'); },
    
    /**
      Shared MD5 hash generator for creating *unique*
      session id's.
    
      @property
    */
    __md5hash__: function() { return xt.crypto.createHash('md5'); }
    
  });
});
