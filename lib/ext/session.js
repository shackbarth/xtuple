/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  var _ = X._, _util = X.util;

  /**
    Session object for datasource.

    @class
    @extends X.Object
   */
  X.Session = X.Object.extend(/** @lends X.Session.prototype */{


    isReady: false,
    isLoaded: false,

    init: function () {
      var id = this.get("id"), sid = this.get("sid"),
          selected = this.get("selected"), logout = this.get("logout");
      if (logout) {
        this.load(_.bind(this.didLoadForLogout, this));
      } else if (!sid) {
        X.Session.init.call(this);
        process.nextTick(_.bind(function () { this.set("isReady", true); }, this));
        this.commit();
      } else if (selected && id && sid) {
        
        //X.debugging = true;
        //X.debug("ABOUT TO SELECT: ", id, selected, sid);
        
        this.load(_.bind(this.didLoadForSelection, this));
      } else {
        
        //X.debugging = true;
        //X.debug("ABOUT LOAD: ", id, sid, selected);
        
        this.load();
      }
    },

    //.....................................
    // ACTION METHODS
    //
    /**
      Commit.

     */
    commit: function () {
      //X.log("commit(): ", _util.inspect(this));

      var K = this.get("model"), k;

      if (this.get("isLoaded")) {
        // we were loaded so a commit needs to update
        // not create a new session entry
        k = {
          id: this.get("id"),
          sid: this.get("sid")
        };
        return K.findOne(k, _.bind(this.updateForCommit, this));
      }

      k = new K(this.get("details"));
      k.save(_.bind(this.didCommit, this));
    },
    /**
      Update for commit

     */
    updateForCommit: function (err, res) {
      //X.log("updateForCommit(): ");

      var details = this.get("details"), key;

      if (err || !res) {
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
      //X.log("didLoad(): ", err, res);

      if (err) {
        return this.set("error", err.message, {stack: err.stack});
      } else if (!res) {
        // something is wrong, we could not find the session that
        // was requested
        return this.set("error", "could not retrieve session", {code: "SESSION_NOT_FOUND"});
      }

      X.mixin(this, res.toObject());

      this.set("isLoaded", true);

      this.created = res.created;
      this.checksum = res.checksum;
      this.lastModified = X.Session.timestamp();
      this.set("isReady", true);

      //this.isReadyDidChange();

      // commit update?
      process.nextTick(_.bind(this.commit, this));
    },

    didCommit: function (err) {
      //X.log("didCommit(): ", err);

      if (err) {
        this.set("error", err.message, err.stack);
      } else {
        // TODO: this _can_ be done lazily right?
        // this.set("isReady", true);
        this.emit("didCommit");
      }
    },

    didLoadForSelection: function (err, res) {
      //X.debug("didLoadForSelection(): ", res);
      var organizations = this.get("organizations"), selected, found;
      if (!organizations || organizations.length <= 0) {
        return this.set("error", "no organizations available for selection");
      } else if (err) { return this.didLoad(err, res); }
      selected = this.get("selected");
      if ((found = _.find(organizations, function (o) {
        return o.name === selected? true: false;
      }))) {
        // TODO: this needs to seriously be reevaluated
        // as it seems like if for any reason the session
        // already had an organization listed (somehow)
        // it will be overwritten and cause unknown
        // behaviors as a result
        this.set("organization", selected);
        this.set("username", found.username);
        this.didLoad(null, res);
      } else this.set("error", "invalid organization selected for user");
    },

    didLoadForLogout: function (err, res) {
      if (err) {
        return this.set("error", "could not load the session to logout");
      }
      // successfully loaded the session which means its valid
      // lets go ahead and logout by destroying ourselves
      this.set("isLoaded", true);
      this.destroy(res);
    },

    destroy: function (session) {
      if (session && session.remove) session.remove();
      this.set("isReady", true);
    },

    query: function (query, callback) {
      var organization = this.get("organization"), orig = callback;
      if (!this.get("isLoaded")) {
        X.warn("Error: cannot query unloaded session");
        return this.set("error", "cannot query unloaded session");
      }
      callback = _.bind(this.didQuery, this, orig);
      //X.debug("query: %@".f(query));
      X.database.query(organization, query, callback);
      return this;
    },

    didQuery: function (callback, err, res) {
      if (err) return callback(err);
      if (res) {
        callback(null, res);
      } else this.set("error", "no result from query");
    },

    //.....................................
    // PROPERTY METHODS
    //

    model: function () {
      return X.Session.cache.model("Session");
    }.property(),

    details: function () {
      var d = {
        id: this.get("id"),
        sid: this.get("sid"),
        lastModified: this.get("lastModified") || X.Session.timestamp(),
        created: this.get("created"),
        checksum: "",
        username: this.get("username"),
        organization: this.get("organization"),
        organizations: this.get("organizations"),
        socket: this.get("socket")
      };
      
      //X.debug("details", d);
      
      return d;
    }.property(),
    
    socket: function (socket) {
      if (arguments.length === 0) return this._socketId;
      this._socketId = socket.id;
      this.commit();
    }.property(),
    
    error: function () {
      if (arguments.length === 0) return this._error;
      var err = this._error = {}, args = X.$A(arguments);
      err.reason = args.shift();
      while (args.length > 0) {
        X.mixin(err, args.shift());
      }
    }.property(),

    //.....................................
    // PROXIED METHODS
    //

    load: function () {
      return X.Session.load.apply(this, arguments);
    }
  });

  X.mixin(X.Session, /** @lends X.Session */{

    cache: null,

    load: function (callback) {
      //X.log("load(): ");

      var K = this.get("model"), details = {
        id: this.get("id"),
        sid: this.get("sid")
      };

      if (!callback) callback = _.bind(this.didLoad, this);

      //X.log("load(): ", details);

      K.findOne(details, callback);
      return this;
    },

    checksum: function () {
      //var hash = X.Session.sha1hash(), data = ;
      //data = X.typeOf(data) === X.T_HASH ? X.json(data) : data;
      //return hash.update(data).digest('hex');
    },

    init: function () {
      this.sid = X.Session.generateSID();
      this.created = X.Session.timestamp();
    },

    generateSID: function () {
      var hash = this.md5hash();
      return hash.update(Math.random().toString()).digest('hex');
    },

    timestamp: function () { return new Date().getTime(); },

    sha1hash: function () { return X.crypto.createHash('sha1'); },

    md5hash: function () { return X.crypto.createHash('md5'); },

    /**
      Polls cache and logs uses out upon session timeout. This method
      can be used to do any actions that are driven from the cache.
     */
    pollCache: function () {
      
      var K = X.Session.cache.model("Session"), i = 0, len, diff, ok, now, socket, sockets;
      
      sockets = X.Server.getServer("Data").socketsFor("/clientsock");
      
      K.find(function (err, res) {
        if (err) {
          // we have serious issues if we have an error here!
          return issue(X.fatal("error polling cache", err.message, err.stack));
        }

        ok = (X.options.datasource.sessionTimeout || 15) * 60000;
        now = X.Session.timestamp();

        //console.log("RUNNING", ok, now);

        if (res && res.length > 0) {
          len = res.length;
          for (; i < len; ++i) {
            diff = Math.abs(now - (res[i].lastModified || 1000000000));
            if (diff > ok) {
              console.log("removing ", res[i]);
              socket = sockets[res[i].socket];
              if (socket) {
                socket.emit("timeout");
                socket.disconnect();
              }
              res[i].remove();
            } else { /*console.log("not removing ", res[i]);*/ }
          }
        }
      });
    },

    isActiveSession: function () {
    }
  });

  X.run(function () {
    X.cachePollingInterval = setInterval(X.Session.pollCache, 10000);
    X.addCleanupTask(function () {
      clearInterval(X.cachePollingInterval);
    });
  });
}());
