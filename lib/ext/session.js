/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, issue:true, XT:true */

(function () {
  "use strict";

  var _ = X._;
  //var _util = X.util;

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

      var K = this.get("model"),
        k = new K(),
        that = this,
        options = {};

      if (this.get("isLoaded")) {
        // we were loaded so a commit needs to update
        // not create a new session entry
        options.success = function (res) { that.updateForCommit(null, k); };
        options.error = function (model, err) { that.updateForCommit(err); };
        options.id = this.get("sid");
        return k.fetch(options);
      }

      options.success = function () { that.didCommit(); };
      k.initialize(null, {isNew: true});
      k.save(this.get("details"), options);
    },
    /**
      Update for commit

     */
    updateForCommit: function (err, res) {
      //X.log("updateForCommit(): ");

      var details = this.get("details"),
        that = this,
        options = {},
        key;

      if (err || !res) {
        return this.set("error", "could not update");
      }

      for (key in details) {
        if (!details.hasOwnProperty(key)) continue;
        res.set(key, details[key]);
      }

      options.success = function () { that.didCommit(); };
      options.error = function (model, err) { that.didCommit(err); };
      res.save(null, options);
    },

    //.....................................
    // POST-ACTION METHODS
    //

    didLoad: function (err, res) {
      //X.log("didLoad(): ", err, res);
      var loaded,
        prop;

      if (err) {
        return this.set("error", err.message, {code: "SESSION_NOT_FOUND", stack: err.stack});
      } else if (!res) {
        // something is wrong, we could not find the session that
        // was requested
        return this.set("error", "could not retrieve session", {code: "SESSION_NOT_FOUND"});
      }

      loaded = res.toJSON();

      // Need to remove null values... no, it doesn't make a lot of sense
      for (prop in loaded) {
        if (loaded.hasOwnProperty(prop)) {
          if (_.isNull(loaded[prop])) {
            delete loaded[prop];
          }
        }
      }

      X.mixin(this, loaded);

      this.set("isLoaded", true);

      this.created = res.get('created');
      this.checksum = res.get('checksum');
      this.lastModified = X.Session.timestamp();
      this.set("isReady", true);

      //this.isReadyDidChange();

      // commit update?
      process.nextTick(_.bind(this.commit, this));
    },

    didCommit: function (err) {
      //X.log("didCommit(): ", err);

      if (err) {
        this.set("error", err.message(), err.code);
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
        return o.name === selected ? true: false;
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
      if (session && session.destroy) { session.destroy(); }
      this.set("isReady", true);
    },

    query: function (query, callback) {
      var options,
        payload = this.payload,
        organization = this.get("organization"), orig = callback;
      if (!this.get("isLoaded")) {
        X.warn("Error: cannot query unloaded session");
        return this.set("error", "cannot query unloaded session");
      }
      callback = _.bind(this.didQuery, this, orig);
      if (payload && payload.databaseType === 'global') {
        // run this query against the global database
        options = JSON.parse(JSON.stringify(this.payload)); // clone
        options.success = function (resp) { callback(null, resp); };
        options.error = function (model, err) { callback(err); };

        // let the user of this dispatch be the global username of the user making the request
        options.username = this.get("details").id;
        if (payload.requestType === 'fetch') {
          XT.dataSource.fetch(options);
        } else if (payload.requestType === 'dispatch') {
          XT.dataSource.dispatch(payload.className, payload.functionName, payload.parameters, options);
        } else if (payload.requestType === 'retrieveRecord') {
          XT.dataSource.retrieveRecord(payload.recordType, payload.id, options);
        } else if (payload.requestType === 'commitRecord') {
          if (!payload.dataHash) { return this.set("error", "invalid commit"); }
          // Passing payload through, but trick dataSource into thinking it's a Model:
          payload.changeSet = function () { return payload.dataHash; };
          options.force = true;
          XT.dataSource.commitRecord(payload, options);
        }
      } else {
        // run this query against an instance database
        X.database.query(organization, query, callback);
      }
      return this;
    },

    didQuery: function (callback, err, res) {
      if (err) return callback(err);
      if (res !== undefined) {
        callback(null, res);
      } else {
        this.set("error", "no result from query");
      }
    },

    //.....................................
    // PROPERTY METHODS
    //

    model: function () {
      return XM.Session;
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

      var K = this.get("model"),
        k = new K(),
        options = {};

      if (!callback) { callback = _.bind(this.didLoad, this); }
      options.id = this.get("sid") || -1;
      options.success = function (resp) { callback(null, resp); };
      options.error = function (model, err) { callback(err); };

      //X.log("load(): ", details);

      k.fetch(options);
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
      // http://www.ietf.org/rfc/rfc4122.txt
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },

    timestamp: function () { return new Date().getTime(); },

    sha1hash: function () { return X.crypto.createHash('sha1'); },

    md5hash: function () { return X.crypto.createHash('md5'); },

    /**
      Polls database and logs users out upon session timeout. This method
      can be used to do any actions that are driven from the cache.
     */
    pollCache: function () {
      var sessions = new XM.SessionCollection(),
        i,
        diff,
        ok,
        now,
        model,
        socket,
        sockets,
        options = {};

      sockets = X.Server.getServer("Data").socketsFor("/clientsock");

      options.success = function () {
        ok = (X.options.datasource.sessionTimeout || 15) * 60000;
        now = X.Session.timestamp();

        //console.log("RUNNING", ok, now);

        if (sessions && sessions.length > 0) {
          for (i = 0; i < sessions.length; ++i) {
            model = sessions.at(i);
            diff = Math.abs(now - (model.get('lastModified') || 1000000000));
            if (diff > ok) {
              socket = sockets[model.get('socket')];
              if (socket) {
                socket.emit("timeout");
                socket.disconnect();
              }
              model.destroy();
            }
          }
        }
      };
      options.error = function (model, err) {
        // we have serious issues if we have an error here!
        return issue(X.fatal("error polling cache", err.message(), err.code));
      };
      sessions.fetch(options);
    },

    isActiveSession: function () {
    }
  });

}());
