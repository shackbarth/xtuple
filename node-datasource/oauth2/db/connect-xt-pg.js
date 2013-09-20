/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true, expr:true */
/*global X:true, SYS: true, XM:true, XT:true, console:true, _:true*/

/**
 * Connect - xTuple - PostgreSQL Store
 *
 * connect-xt-pg is a PostgreSQL session store that uses xTuple's glabal database
 * to persist session data.  To speed up session reads, Express's Session MemoryStore
 * is used as a cache.
 *
 * Modeled off of:
 * - https://github.com/visionmedia/connect-redis/blob/master/lib/connect-redis.js
 * - https://github.com/kcbanner/connect-mongo/blob/master/lib/connect-mongo.js
 * - https://github.com/jebas/connect-pg/blob/master/lib/connect-pg.js
 */


/**
 * Return the `XTPGStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function (connect) {
  "use strict";

  /**
   * Connect's Store.
   */
  var Store = connect.session.Store,
      // TODO - If we ever run multiple processes/servers, MemoryStore must be replaced with something
      // all processes/servers can use/share and keep in sync like Redis.
      MemoryStore = new connect.session.MemoryStore();

  /**
   * Initialize XTPGStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */
  function XTPGStore(options) {
    var self = this;

    options = options || {};
    Store.call(this, options);
    this.prefix = options.prefix ? options.prefix : 'sess:';
    this.hybridCache = options.hybridCache ? options.hybridCache : false;
    this.sessions = {};

    // Load all the data from SYS.SessionStore into the Express MemoryStore for caching.
    this.loadSessions = function (options, callback) {
      // TODO - options could be used to only load parital dataset of recently active sessions.
      // It could also be used to help process/server syncing if we move to something like Redis.

      var fetchOptions = {},
        payload = {
          nameSpace: "SYS",
          type: "SessionStore"
        };

      fetchOptions.success = function (obj, sessionstore, opts) {
        var sid,
            sess;

        // Flush any sessions before reloading it.
        self.sessions[options.database] = {};

        _.each(sessionstore, function (model, id, collection) {
          sid = model.id;
          sess = JSON.parse(model.session);

          if (self.hybridCache) {
            // Store the session data in the Express MemeoryStore for caching.
            MemoryStore.set(sid, sess, function () {});
          }

          self.sessions[options.database][sid] = sess;
        });

        // Now that sessions are loaded, we'll call the callback that was waiting for them.
        if (callback &&  typeof callback === 'function') {
          callback();
        }
      };
      fetchOptions.error = function (sessionstore, err) {
        X.debug("Session Collection fetch failed.");

        // Now that sessions are loaded, we'll call the callback that was waiting for them.
        if (callback &&  typeof callback === 'function') {
          callback("Session Collection fetch failed.");
        }
      };

      // TODO - This is REALLY SLOW if there are 10,000 sessions in the table and we use collection.fetch().
      // var sessionsCollection = new SYS.SessionStoreCollection();
      //sessionsCollection.fetch(fetchOptions);

      // Fetch all records from SYS.SessionStore and load them into the Express MemoryStore.
      // fetchOptions.username = GLOBAL_USERNAME; // TODO
      fetchOptions.username = 'node';
      fetchOptions.database = options.database;
      XT.dataSource.request(null, "get", payload, fetchOptions);
    };

    // Loops through the sessions, find the ones that are expired and sends that session data
    // to the callback function. This allows us to expire session from code that has access to
    // stuff like socket.io in main.js.
    this.expireSessions = function (callback) {

      _.each(X.options.datasource.databases, function (dbval, dbkey, dblist) {
        self.loadSessions({database: dbval}, function (err) {
          if (err) {
            return;
          }

          _.each(X.options.datasource.databases, function (dbval, dbkey, dblist) {
            _.each(self.sessions[dbval], function (val, key, list) {
              var expires = new Date(val.cookie.expires),
                  now = new Date();

              if ((expires - now) <= 0) {
                //X.debug("Session: ", key, " expired ", (expires - now));
                callback(key, val);
              } else {
                //X.debug("Session: ", key, " expires in ", (expires - now));
              }
            });
          });
        });
      });
    };

    X.log("SessionStore using hybridCache = ", this.hybridCache);

    // Prime this.sessions and MemoryCache on initialization.
    _.each(X.options.datasource.databases, function (dbval, dbkey, dblist) {
      self.loadSessions({database: dbval});
    });
  }

  /**
   * Inherit from `Store`.
   */
  XTPGStore.prototype = new Store();

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  XTPGStore.prototype.get = function (sid, done) {
    try {
      var fetchCache,
          fetchDB,
          that = this;

      sid = this.prefix + sid;

      fetchDB = function () {
        var fetchOptions = {},
            result,
            sessionStore = {};

        sessionStore = new SYS.SessionStore();
        fetchOptions.id = sid;
//TODO - This might break.
        fetchOptions.database = sid.split(".")[0].split(":")[1];

        fetchOptions.success = function (model) {
          // We have a matching session store cookie

          // TODO - update lastModified time to extend timeout?
          // Doing this will complicate things with a hybridCache MemoryStore.
          // Do we really need to set that here for just in XM.Session and have CleanupTask
          // clean up SYS.SessionStore on timeouts?
          //model.set("lastModified", new Date().getTime());
          //model.save(null, saveOptions);

          if (model.get("session")) {
            result = JSON.parse(model.get("session"));
          }

          if (that.hybridCache) {
            // We fetched from the database because this session was not in the MemoryStore.
            // Load this data into the MemoryStore to speed this up next time.
            MemoryStore.set(sid, result, function (err, cache) {
              if (err) {
                // Could not set. This shouldn't happen. Return error and move along...
                console.trace("MemoryStore.set error:");
                done && done(err);
              } else {
                // Return the session data back to Express to be used by routes and functors.
                return done(null, result);
              }
            });
          } else {
            // Return the session data back to Express to be used by routes and functors.
            return done(null, result);
          }
        };
        fetchOptions.error = function (model, err) {
          // Session was not found. This can happen if cookie is still in the browser, but
          // db record was removed by CleanupTask because it has timed out.

          // This is called when MemoryStore did not find session data.
          // No need to touch MemoryStore here.

          // Nothing found anywhere, no need to return the err, return nothing and move along...
          done && done();
        };

        // Try to fetch a session matching the user's cookie sid.
        sessionStore.fetch(fetchOptions);
      };

      if (this.hybridCache) {
        // Try to get session data from MemoryStore.
        fetchCache = function (err, cache) {
          if (cache && !err) {
            return done(null, cache);
          } else {
            fetchDB();
          }
        };
        MemoryStore.get(sid, fetchCache);
      } else {
        fetchDB();
      }
    } catch (err) {
      done && done(err);
    }
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */
  XTPGStore.prototype.set = function (sid, sess, done) {
    try {
      var fetchCache,
          fetchDB,
          that = this;

      sid = this.prefix + sid;
      sess = JSON.stringify(sess);

      fetchDB = function () {
        var fetchOptions = {},
            saveOptions = {},
            sessionAttributes = {},
            sessionStore = {};

        sessionStore = new SYS.SessionStore();

        saveOptions.success = function (model) {
          if (that.hybridCache) {
            // Overwrite the MemoryStore with the new data, replacing old or creating new entry.
            MemoryStore.set(sid, JSON.parse(sess), function (err, cache) {
              if (err) {
                // Could not set. Return error and move along.
                console.trace("MemoryStore.set error:");
                done && done(err);
              } else {
                // Success, MemoryStore updated, move along.
                done && done();
              }
            });
          } else {
            // Success, move along.
            done && done();
          }
        };
        saveOptions.error = function (model, saveErr) {
          // This shouldn't happen. How did we get here? Log trace.
          console.trace("SYS.SessionStore save error. This shouldn't happen.");

          if (that.hybridCache) {
            // Delete any match in MemoryStore.
            MemoryStore.destroy(sid, function (err, cache) {
              if (err) {
                // Could not destroy. This shouldn't happen. Return error and move along.
                console.trace("MemoryStore.destroy error:");
                done && done(err);
              } else {
                // TODO - This might throw an error because our err object does not include a stack.
                // https://github.com/senchalabs/connect/blob/master/lib/middleware/errorHandler.js#L48
                // MemoryStore destroyed, move along.
                done && done(saveErr);
              }
            });
          } else {
            // TODO - This might throw an error because our err object does not include a stack.
            // https://github.com/senchalabs/connect/blob/master/lib/middleware/errorHandler.js#L48
            // Return nothing and move along.
            done && done(saveErr);
          }
        };

        fetchOptions.id = sid;
//TODO - This might break.
        fetchOptions.database = sid.split(".")[0].split(":")[1];
        saveOptions.database = fetchOptions.database;

        fetchOptions.success = function (model, resp) {
          // Fetch found this session, update it and save.
          model.set("session", sess);

          // Set gets called a lot. There isn't always a change to save and save will fail.
          // Check if this model has changed before trying to save it.
          if (model.getStatusString() === "READY_CLEAN") {
            if (that.hybridCache) {
              // MemoryStore did not have a matching session, update existing or add new.
              MemoryStore.set(sid, JSON.parse(sess), function (err, cache) {
                if (err) {
                  // Could not set. This shouldn't happen. Return error and move along.
                  console.trace("MemoryStore.set error:");
                  done && done(err);
                } else {
                  // Nothing to save, MemoryStore updated, move along.
                  done && done();
                }
              });
            } else {
              // Nothing to save, move along.
              done && done();
            }
          } else if (model.getStatusString() === "READY_DIRTY") {
            // Try to save SYS.SessionStore to database.
            model.save(null, saveOptions);
          }
        };
        fetchOptions.error = function (model, err) {
          // Fetch did not find this session, initialize new and save.
          // Create new SYS.SessionStore object.
          sessionStore = new SYS.SessionStore();
          // TODO - Is this redundant?  Can I just call model.initialize...???
          sessionStore.initialize(null, {isNew: true});

          sessionAttributes = {
            id: sid,
            session: sess
          };

          // Try to save SYS.SessionStore to database.
          sessionStore.save(sessionAttributes, saveOptions);
        };

        // Try to fetch a session matching the user's cookie sid to
        // see if we need to make a new one or update the old one.
        sessionStore.fetch(fetchOptions);
      };

      if (this.hybridCache) {
        // Try to get session data from MemoryStore.
        fetchCache = function (err, cache) {
          if (cache && !err) {
            if (JSON.stringify(cache, null, null) === sess) {
              // No change to the session data, nothing to save, move along.
              done && done();
            } else {
              fetchDB();
            }
          } else {
            fetchDB();
          }
        };
        MemoryStore.get(sid, fetchCache);
      } else {
        fetchDB();
      }
    } catch (err) {
      done && done(err);
    }
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */
  XTPGStore.prototype.destroy = function (sid, done) {
    try {
      var sessionStore = {},
          fetchOptions = {},
          that = this;

      sid = this.prefix + sid;
      sessionStore = new SYS.SessionStore();
      fetchOptions.id = sid;
//TODO - This might break.
      fetchOptions.database = sid.split(".")[0].split(":")[1];

      fetchOptions.success = function (model) {
        var destroyOptions = {};

        destroyOptions.database = fetchOptions.database;
        // Delete this session from the db store.
        model.destroy(destroyOptions);

        if (that.hybridCache) {
          // Delete this session from the MemoryStore as well.
          MemoryStore.destroy(sid, function (err, cache) {
            if (err) {
              // Could not destroy. This shouldn't happen. Return error and move along.
              console.trace("MemoryStore.destroy error:");
              done && done(err);
            } else {
              // MemoryStore destroyed, move along.
              done && done();
            }
          });
        } else {
          done && done();
        }
      };
      fetchOptions.error = function (model, err) {
        if (that.hybridCache) {
          // Did not find a match in the db, delete this session from the MemoryStore, it's invalid.
          MemoryStore.destroy(sid, function (err, cache) {
            if (err) {
              // Could not destroy. This shouldn't happen. Return error and move along.
              console.trace("MemoryStore.destroy error:");
              done && done(err);
            } else {
              // MemoryStore destroyed. Return nothing and move along.
              done && done();
            }
          });
        } else {
          // Return nothing and move along.
          done && done();
        }
      };

      // Try to fetch a session matching the user's cookie sid.
      sessionStore.fetch(fetchOptions);
    } catch (err) {
      done && done(err);
    }
  };

  /**
   * Invoke the given callback `fn` with all active sessions.
   *
   * @param {Function} fn
   * @api public
   */
  XTPGStore.prototype.all = function (fn) {
    var self = this;

    _.each(X.options.datasource.databases, function (dbval, dbkey, dblist) {
      self.loadSessions({database: dbval}, function (err) {
        if (err) {
          return fn(err);
        }

        var arr = [],
            keys = Object.keys(this.sessions[dbval]);

        for (var i = 0, len = keys.length; i < len; ++i) {
          arr.push(this.sessions[dbval][keys[i]]);
        }
        fn(null, arr);
      });
    });
  };

  /**
   * Fetch number of sessions.
   *
   * @param {Function} fn
   * @api public
   */
  XTPGStore.prototype.length = function (fn) {
    var self = this;

    _.each(X.options.datasource.databases, function (dbval, dbkey, dblist) {
      self.loadSessions({database: dbval}, function (err) {
        if (err) {
          return fn(err);
        }

        fn(null, Object.keys(this.sessions[dbval]).length);
      });
    });
  };

  return XTPGStore;
};
