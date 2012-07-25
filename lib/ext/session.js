/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";

  var _ = XT._;

  XT.Session = XT.Object.extend({
    /** @lends XT.Session.prototype */

    isReady: false,
    isLoaded: false,
    
    init: function () {
      //XT.warn("init(): ");
      //XT.log(XT.util.inspect(this.isReadyDidChange, true, 5));

      //// as straight forward as possible
      //var username = this.get("username"), password = this.get("password"),
      //    organization = this.get("organization"), sid = this.get("sid");
      //
      //// if we have a username, password, organization and no sid
      //// then we have to authenticate
      //// if we have a username, organization and sid
      //// we have to load an active session
      //if (username && password && organization) {
      //  this.authenticate();
      //} else if (username && organization && sid) {
      //  this.load();
      //}
      
      
      var id = this.get("id"), sid = this.get("sid");
      if (!sid) {
        XT.Session.init.call(this);
        process.nextTick(_.bind(function () { this.set("isReady", true); }, this));
        this.commit();
      } else {
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
          id: this.get("id"),
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
    
    //.....................................
    // POST-ACTION METHODS
    //

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
    
    //.....................................
    // PROPERTY METHODS
    //
    
    model: function () {
      return XT.Session.cache.model("Session");
    }.property(),

    details: function () {
      var d = {
        id: this.get("id"),
        sid: this.get("sid"),
        lastModified: this.get("lastModified") || XT.Session.timestamp(),
        created: this.get("created"),
        checksum: "",
        organization: this.get("organization")
      };
      return d;
    }.property(),

    //.....................................
    // PROXIED METHODS
    //

    load: function () {
      return XT.Session.load.call(this);
    }
  });

  XT.mixin(XT.Session, {
    /** @lends XT.Session */

    cache: null,

    load: function () {
      //XT.log("load(): ");
      
      var K = this.get("model"), details = {
        id: this.get("id"),
        sid: this.get("sid")
      };
      
      //XT.log("load(): ", details);
      
      K.findOne(details, _.bind(this.didLoad, this));
      return this;
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
      var K = XT.Session.cache.model("Session"), i = 0, len, diff, ok, now;
      K.find(function (err, res) {
        if (err) {
          // we have serious issues if we have an error here!
          return issue(XT.fatal("error polling cache", err.message, err.stack));
        }
        
        ok = (XT.options.datasource.sessionTimeout || 15) * 60000;
        now = XT.Session.timestamp();
        
        if (res && res.length > 0) {
          len = res.length;
          for (; i < len; ++i) {
            diff = Math.abs(now - (res[i].lastModified || 1000000000));
            if (diff > ok) {
              //console.log("removing ", res[i]);
              res[i].remove();
            } //else { console.log("not removing ", res[i]); }
          }
        }
      });
    },

    isActiveSession: function () {
    }
  });
  
  XT.run(function () {
    XT.cachePollingInterval = setInterval(XT.Session.pollCache, 60000);
    XT.addCleanupTask(function () {
      clearInterval(XT.cachePollingInterval);
    });
  });
}());