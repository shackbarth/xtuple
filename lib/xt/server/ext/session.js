
/** @class
  A container object that maintains state and allows for
  proper querying for a particular user based on their
  session credentials.
*/
XT.Session = XT.Object.extend(
  /** @lends XT.Session.prototype */ {
   
  /** @private */
  init: function() {
    var xtr = this.get('xtr');
    var userName = this.get('userName');
    var userKey = this.get('userKey');
    var data = this.get('data');
    var company = this.get('company');
    var sid = data ? data.sid || '' : '';
    var handler = xtr.get('handler');
    var info = xtr.get('info');
    var bits = {};
    
    bits.userKey = userKey;
    bits.sid = sid = sid || XT.Session.id();
    bits.userName = userName;
    bits.company = company;
    bits.ip = info.clientAddress;
    
    this.set('sid', sid);
    
    // make sure the xt response knows it has a session
    xtr.set('session', this);
    
    if(xtr.get('useSession') && !XT.none(handler)) {
      this._xt_readyQueue.push(function() { handler.handle(xtr); });
    }
     
    this.__setup__(XT.none(data) ? {} : data, bits);
  },
  
  /** @private */
  _xt_readyQueue: [],

  /**
    Commits the current session data collection into the cache.
    The data checksum will be updated after the lastModified
    property is updated to the current time.
    
    @param {Function} [callback] The callback to execute after the
      write to the cache has transpired.
    @method
  */
  commit: function(callback) {
    var data = this.get('data');
    var sid = this.get('sid');
    var self = this;
    var key;
    var checksum;
    var func;
    var queue = this._xt_readyQueue;
    var idx = 0;
    var queuedHandler;

    callback = callback && XT.typeOf(callback) === XT.T_FUNCTION ? callback : null;
    if(XT.none(data) || XT.none(self)) return;
    data.lastModified = XT.Session.timestamp();
    checksum = XT.Session.checksum(data);
    data.checksum = checksum;
    this.set('checksum', checksum);
    this.data = data;
    key = '%@:%@:%@:%@'.f(data.userName, data.ip, data.sid, data.company);

    func = function(err, response) {
      if(err) return issue(XT.warn("Could not successfully commit session data"));
      if(callback && XT.typeOf(callback) === XT.T_FUNCTION) callback(err, response);
      for (; idx < queue.length; ++idx) {
        queuedHandler = queue.shift();
        queuedHandler();
      }
    }
    
    // execute the cache command
    XT.cache.hmset(key, data, func);
  },
    
  query: function(query, callback) {
    var xtr = this.get('xtr');
    var company = this.get('company');
    var userName = this.get('userName');
    var func;

    // hijack the query and prefix it with the seteffective user query
    query = query.pre("select seteffectivextuser('%@'); ".f(userName));
    
    // we want to be able to catch errors and gracefully manage them
    // without propagating negative responses to the handlers
    func = function(err, ret) {
      if(err) {
        return issue(XT.close("Error in session managed query: %@".f(err.message), xtr));
      }

      // remove the ugly leftover crap in the response from the server
      // before passing it back to the handler to be transmitted to the
      // client
      if (ret.rows) {
        if (Object.keys(ret.rows[0]).contains('seteffectivextuser')) {
          ret.rows.shift();
        }
      }

      // if there was a callback, we've been successful so go ahead
      // and let them know
      if (callback && XT.typeOf(callback) === XT.T_FUNCTION) {
        callback(ret);
      }
    }

    // we need to fire off the request via the database driver
    XT.database.query(company, query, func);
  },
    
    
  /** @private */
  __setup__: function(data, bits) {
    
    XT.mixin(data, bits);
    this.data = data;
    this.data.created = this.data.created || XT.Session.timestamp();
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
