
/** @class
  A container object that maintains state and allows for
  proper querying for a particular user based on their
  session credentials.
*/
XT.Session = XT.Object.extend(
  /** @lends XT.Session.prototype */ {
   
  /** @private */
  init: function() {
    
    // XT.debug("in XT.Session.init");
    
    var xtr = this.get('xtr'),
        u = this.get('userName'),
        k = this.get('userKey'),
        d = this.get('data'),
        s = d ? d.sid || '' : '',
        // s = this.get('sid'),
        h = xtr.get('handler'), // if a handler is waiting on the session
        t = {},
        i = xtr.get('info'),
        self = this;
    
    
    t.userKey = k;
    t.sid = s = s || XT.Session.id();
    t.userName = u;
    t.ip = i.clientAddress;
    
    this.set('sid', s);
    
    // make sure the xt response knows it has a session
    xtr.set('session', this);
     
    
    
    if(xtr.get('useSession') && !XT.none(h))
      this.once('xtReady', function() { h.handle(xtr); });
     
     
    this.__setup__(XT.none(d) ? {} : d, t);
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
        s = this.get('sid'),
        self = this, c, key;
    cb = cb && XT.typeOf(cb) === XT.T_FUNCTION ? cb : null;
    if(XT.none(d) || XT.none(s)) return;
    d.lastModified = XT.Session.timestamp();
    c = XT.Session.checksum(d);
    d.checksum = c;
    this.set('checksum', c);
    this.data = d;
    key = '%@:%@:%@'.f(d.userName, d.ip, d.sid);
    
    var f = function(e, r) {
      if(e) return issue(XT.warn("Could not successfully commit session data"));
      if(cb && XT.typeOf(cb) === XT.T_FUNCTION) cb(e, r);
      
      // in case anyone is interested in when we're done
      self.emit('xtReady');
    };
    
    XT.cache.hmset(key, d, f);
  },
    
  reload: function() {},
    
  
  query: function(q, cb) {
    q = q.pre("select seteffectivextuser('%@'); ".f(this.get('userName'))),
    self = this;
    
    XT.debug("XT.Session.query => %@".f(q));
    
    var f = function(e, r) {
      
      // we only propagate the response if successfull, on error, the
      // callback is not used
      if(e) {
        // if(cb && XT.typeOf(cb) === XT.T_FUNCTION) return cb(e, r);
        // else return issue(XT.close("Error in session query but no callback to respond: %@".f(e.message), self.get('xtr')));
        return issue(XT.close("Error in session managed query: %@".f(e.message), self.get('xtr')));
      }
      
      // since we know there's going to be additional crap inside
      // the response from the session query go ahead and strip it
      // transparently and let the handler think everything is
      // david bowie...i mean, hunky dory
      if(r.rows)
        // if(r.rows[0].keys().contains('seteffectivextuser'))
        if(XT.keys(r.rows[0]).contains('seteffectivextuser'))
          r.rows.shift();
      
      // there, all pretty again
      if(cb && XT.typeOf(cb) === XT.T_FUNCTION) cb(r);
    };
    
    XT.db.query(q, f);
  },
    
    
  /** @private */
  __setup__: function(data, bits) {
    
    XT.mixin(data, bits);
    this.data = data;
    this.data.created = this.data.created || XT.Session.timestamp();
    
    // XT.debug("XT.Session.__setup__ \n", this.get('data'));
    
    this.commit();
  },

  className: 'XT.Session'
    
});

//.............................................
// Post-Initialization Routines
//
  XT.mixin(XT.Session, 
    /** @lends XT.Session */ {
    
    /**
      Creates a checksum of the parameter.
      
      @param {Object|String} data The data to be digested into a checksum.
      @returns {String} The checksum of the data.
      @method
    */
    checksum: function(data) {
      var h = this.__sha1hash__();
      data = XT.typeOf(data) === XT.T_HASH ? XT.json(data) : data;
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
    __sha1hash__: function() { return XT.crypto.createHash('sha1'); },
    
    /**
      Shared MD5 hash generator for creating *unique*
      session id's.
    
      @property
    */
    __md5hash__: function() { return XT.crypto.createHash('md5'); }
    
  });
