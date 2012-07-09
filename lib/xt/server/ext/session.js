/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";

  var _ = XT._;

  XT.Session = XT.Object.extend({
    /** @lends XT.Session.prototype */

    isReady: false,
    isMultiple: false,
    isValid: false,
    isLoaded: false,
    
    init: function () {
      //XT.warn("init(): ");
      //XT.log(XT.util.inspect(this.isReadyDidChange, true, 5));

      // as straight forward as possible
      var username = this.get("username"), password = this.get("password"),
          organization = this.get("organization"), sid = this.get("sid");

      // if we have a username, password, organization and no sid
      // then we have to authenticate
      // if we have a username, organization and sid
      // we have to load an active session
      if (username && password && organization) {
        this.authenticate();
      } else if (username && organization && sid) {
        this.load();
      }
    },

    //.....................................
    // ACTION METHODS
    //
    
    commit: function () {
      //XT.log("commit(): ", _util.inspect(this));
      
      var K = this.get("model"), k;
      
      if (this.get("isLoaded")) {
        // we were loaded so a commit needs to update
        // not create a new session entry
        k = {
          username: this.get("username"),
          organization: this.get("organization"),
          sid: this.get("sid")
        };
        return K.findOne(k, _.bind(this.updateForCommit, this));
      }
      
      k = new K(this.get("details"));
      k.save(_.bind(this.didCommit, this));
    },
    
    updateForCommit: function (err, res) {
      //XT.log("updateForCommit(): ");
      
      var details = this.get("details"), key;
      
      if (err) {
        return this.set("error", "could not update");
      }
      
      for (key in details) {
        if (!details.hasOwnProperty(key)) continue;
        res[key] = details[key];
      }
      
      res.save(_.bind(this.didCommit, this));
    },
    
    queueQuery: function (query, callback) {
      var queue;
      if (this.get("isReady")) {
        this.query(query, callback);
      } else {
        queue = this.queue || (this.queue = []);
        queue.push(_.bind(this.query, this, query, callback));
      }
      return this;
    },
    
    forceNew: function () {
      if (!this.get("isValid")) {
        return this.set("error", "cannot force a new session");
      }
      XT.Session.init.call(this);
      process.nextTick(_.bind(function () { this.set("isReady", true); }, this));
      this.commit();
      return this;
    },
    
    selectSession: function (index) {
      var available = this.get("available"), sid;
      
      if (index === "FORCE_NEW_SESSION") {
        return this.forceNew();
      }
      
      // TODO: must figure out a best-way to handle occassions when a
      // session is selected but no longer valid...maybe just the client
      // is notified of the error and makes an arbitrary request for
      // current sessions?
      
      if (!this.get("isMultiple")) {
        return this.set("error", "attempt to select session when not available");
      } else if (!available || index < 0 || index >= available.length) {
        return this.set("error", "invalid selection index or no sessions available");
      }
      
      sid = available[index].sid;
      if (!sid) {
        return this.set("error", "invalid selection no SID available");
      }
      this.isMultiple = false;
      this.available = null;
      this.set("sid", sid);
      this.load();
    },
    
    //.....................................
    // POST-ACTION METHODS
    //
    
    didAuthenticate: function (err, res) {
      //XT.log("didAuthenticate(): ", arguments);

      if (err) {
        //XT.warn("didAuthenticate(): ERROR");
        return this.set("error", err.message, err.stack);
      }

      try {
        this.isValid = res.rows[0].validate_user;
        this.activeSessionsForUser();
      } catch (err) {
        this.set("error", err.message, err.stack);
      }
    },

    didLoad: function (err, res) {
      //XT.log("didLoad(): ", err, res);
      
      if (err) {
        return this.set("error", err.message, err.stack);
      } else if (!res) {
        // something is wrong, we could not find the session that
        // was requested
        
        return this.set("error", "could not retrieve session");
      }
      
      this.set("isLoaded", true);
      
      this.created = res.created;
      this.checksum = res.checksum;
      this.lastModified = XT.Session.timestamp();
      this.set("isReady", true);
      
      //this.isReadyDidChange();
      
      // commit update?
      process.nextTick(_.bind(this.commit, this));
    },
    
    didCommit: function (err) {
      //XT.log("didCommit(): ", err);
      
      if (err) {
        this.set("error", err.message, err.stack);
      } else {
        // TODO: this _can_ be done lazily right?
        // this.set("isReady", true);
      }
    },
    
    didQuery: function (callback, err, res) {
      callback = callback || function () {};
      if (err) {
        return callback(err);
      }
      if (res) {
        if (res.rows) {
          if (Object.keys(res.rows[0]).contains("seteffectivextuser")) {
            res.rows.shift();
          }
        }
        callback(null, res);
      } else {
        this.set("error", "no error from query but no result");
        callback(this.get("error"));
      }
    },
    
    //.....................................
    // PROPERTY METHODS
    //
    
    model: function () {
      return XT.cache.model("Session");
    }.property(),

    details: function () {
      return {
        username: this.get("username"),
        sid: this.get("sid"),
        lastModified: this.get("lastModified") || XT.Session.timestamp(),
        created: this.get("created"),
        checksum: "",
        organization: this.get("organization")
      };
    }.property(),

    //.....................................
    // PROXIED METHODS
    //

    authenticate: function () {
      XT.Session.authenticate.call(this);
    },

    activeSessionsForUser: function () {
      XT.Session.activeSessionsForUser.call(this);
    },

    query: function () {
      XT.Session.query.apply(this, arguments);
    },

    load: function () {
      return XT.Session.load.call(this);
    },
    
    evaluateSessions: function () {
      XT.Session.evaluateSessions.apply(this, arguments);
    },
    
    
    
    
    isReadyDidChange: function () {
      //XT.log("isReadyDidChange(): ");
      var queue;
      if (!this.get("isReady")) return;
      queue = this.queue;
      if (!queue || queue.length <= 0) return;
      while (queue.length > 0) (queue.shift())();
    }.observes("isReady")
  });

  XT.mixin(XT.Session, {
    /** @lends XT.Session */

    authenticate: function () {
      //XT.log("authenticate(): ");
      var username = this.get("username"), password = this.get("password"),
          organization = this.get("organization"), query, callback;
      query = "select validate_user('%@', '%@')".f(username, password);
      callback = _.bind(this.didAuthenticate, this);
      XT.database.query(organization, query, callback);
    },

    load: function () {
      //XT.log("load(): ");
      
      var K = this.get("model"), details = {
        username: this.get("username"),
        organization: this.get("organization"),
        sid: this.get("sid")
      };
      
      //XT.log("load(): ", details);
      
      K.findOne(details, _.bind(this.didLoad, this));
      return this;
    },

    activeSessionsForUser: function () {
      //XT.log("activeSessionsForUser(): ");
      
      var username = this.get("username"), K = this.get("model"),
          callback = _.bind(this.evaluateSessions, this);
      K.find({"username": username}, callback);
    },

    evaluateSessions: function (err, res) {
      //XT.log("evaluateSessions(): ", err, res);
      
      if (err) {
        return this.set("error", err.message, err.stack);
      } else if (!res || res.length <= 0) {
        // no current sessions
        XT.Session.init.call(this);
        this.commit();
      } else {
        // many sessions
        this.available = res;
        this.set("isMultiple", true);
      }
    },

    checksum: function () {
      //var hash = XT.Session.sha1hash(), data = ;
      //data = XT.typeOf(data) === XT.T_HASH ? XT.json(data) : data;
      //return hash.update(data).digest('hex');
    },

    init: function () {
      this.sid = XT.Session.generateSID();
      this.created = XT.Session.timestamp();
    },

    generateSID: function () {
      var hash = this.md5hash();
      return hash.update(Math.random().toString()).digest('hex');
    },

    timestamp: function () { return new Date().getTime(); },

    sha1hash: function () { return XT.crypto.createHash('sha1'); },

    md5hash: function () { return XT.crypto.createHash('md5'); },

    pollCache: function () {
      var K = XT.cache.model("Session"), i = 0, len, diff, ok, now;
      K.find(function (err, res) {
        if (err) {
          // we have serious issues if we have an error here!
          return issue(XT.fatal("error polling cache", err.message, err.stack));
        }
        
        ok = (XT.opts.datasource.sessionTimeout || 15) * 60000;
        now = XT.Session.timestamp();
        
        if (res && res.length > 0) {
          len = res.length;
          for (; i < len; ++i) {
            diff = Math.abs(now - (res[i].lastModified || 1000000000));
            if (diff > ok) {
              console.log("removing ", res[i]);
              res[i].remove();
            } else { console.log("not removing ", res[i]); }
          }
        }
      });
    },

    isActiveSession: function () {
    },

    query: function (query, callback) {
      var username, organization;
      if (!this.get("isReady")) {
        this.queueQuery(query, callback);
        return this;
      }
      username = this.get("username");
      organization = this.get("organization");
      query = query.pre("select seteffectivextuser('%@'); ".f(username));
      
      XT.database.query(organization, query, _.bind(this.didQuery, this, callback));
      return this;
    }
  });
}());