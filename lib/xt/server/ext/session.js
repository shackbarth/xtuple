/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var _ = XT._, _util = XT.util;

  XT.Session = XT.Object.extend({
    /** @lends XT.Session.prototype */

    isReady: false,
    isMultiple: false,
    isValid: false,
    isLoaded: false,
    
    init: function () {
      XT.log("init(): ");

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

    didAuthenticate: function (err, res) {
      XT.log("didAuthenticate(): ", arguments);

      if (err) {
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
      XT.log("didLoad(): ");
      
      if (err) {
        return this.set("error", err.message, err.stack);
      }
      
      this.set("isLoaded", true);
      
      this.created = res.created;
      this.checksum = res.checksum;
      this.lastModified = XT.Session.timestamp();
      this.set("isReady", true);
      
      // commit update?
      this.commit();
    },

    commit: function () {
      XT.log("commit(): ", _util.inspect(this));
      
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
      XT.log("updateForCommit(): ");
      
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
    
    didCommit: function (err) {
      XT.log("didCommit(): ", err);
      
      if (err) {
        this.set("error", err.message, err.stack);
      } else {
        this.set("isReady", true);
      }
    },
    
    forceNew: function () {
      if (!this.get("isValid")) {
        return this.set("error", "cannot force a new session");
      }
      XT.Session.init.call(this);
      this.commit();
      return this;
    },
    
    selectSession: function (index) {
      var available = this.get("available"), sid;
      
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
    }
  });

  XT.mixin(XT.Session, {
    /** @lends XT.Session */

    authenticate: function () {
      XT.log("authenticate(): ");
      var username = this.get("username"), password = this.get("password"),
          organization = this.get("organization"), query, callback;
      query = "select validate_user('%@', '%@')".f(username, password);
      callback = _.bind(this.didAuthenticate, this);
      XT.database.query(organization, query, callback);
    },

    load: function () {
      XT.log("load(): ");
      
      var K = this.get("model"), details = {
        username: this.get("username"),
        organization: this.get("organization"),
        sid: this.get("sid")
      };
      K.findOne(details, _.bind(this.didLoad, this));
      return this;
    },

    activeSessionsForUser: function () {
      XT.log("activeSessionsForUser(): ");
      
      var username = this.get("username"), K = this.get("model"),
          callback = _.bind(this.evaluateSessions, this);
      K.find({"username": username}, callback);
    },

    evaluateSessions: function (err, res) {
      XT.log("evaluateSessions(): ", err, res);
      
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
    },

    isActiveSession: function () {
    },

    query: function () {
    }
  });
}());