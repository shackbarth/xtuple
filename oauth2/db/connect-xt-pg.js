/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, console:true, _:true*/

/*!
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
    this.prefix = null == options.prefix ? 'sess:' : options.prefix;
    this.hybridCache = null == options.hybridCache ? false : options.hybridCache;

    X.debug("this.hybridCache = ", this.hybridCache);

    // Load all the data from XM.SessionStore into the Express MemoryStore for caching.
    this.loadCache = function (options) {
      // TODO - options could be used to only load parital dataset of recently active sessions.
      // It could also be used to help process/server syncing if we move to something like Redis.

      if (self.hybridCache) {
        var fetchOptions = {};

        fetchOptions.success = function (sessions) {
          var callback,
              sid,
              sess;

          callback = function () {
            // TODO - Don't need to do anything here, but MemoryStore.set() needs a callback.
          };

          _.each(sessions, function (model) {
            sid = model.id;
            sess = JSON.parse(model.session);

            // Store the session data in the Express MemeoryStore for caching.
            MemoryStore.set(sid, sess, callback);
          });
        };
        fetchOptions.error = function (sessions, err) {
          X.debug("Session Collection fetch failed.");
        };

        // TODO - This is REALLY SLOW if there are 10,000 sessions in the table and we use collection.fetch().
        // var sessionsCollection = new XM.SessionStoreCollection();
        //sessionsCollection.fetch(fetchOptions);

        // Fetch all records from XM.SessionStore and load them into the Express MemoryStore.
        fetchOptions.query = {
          requestType: "fetch",
          recordType: "XM.SessionStore"
        };

        // fetchOptions.username = GLOBAL_USERNAME; // TODO
        fetchOptions.username = 'node';
        XT.dataSource.fetch(fetchOptions);
      }
    };
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

        sessionStore = new XM.SessionStore();
        fetchOptions.id = sid;

        fetchOptions.success = function (model) {
          // We have a matching session store cookie

          // TODO - update lastModified time to extend timeout?
          // Doing this will complicate things with a hybridCache MemoryStore.
          // Do we really need to set that here for just in XM.Session and have CleanupTask
          // clean up XM.SessionStore on timeouts?
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

        sessionStore = new XM.SessionStore();

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
        saveOptions.error = function (model, err) {
          var that = this;
          // This shouldn't happen. How did we get here? Log trace.
          console.trace("XM.SessionStore save error. This shouldn't happen.");

          if (that.hybridCache) {
            // Delete any match in MemoryStore.
            MemoryStore.destroy(sid, function (err, cache) {
              if (err) {
                // Could not destroy. This shouldn't happen. Return error and move along.
                console.trace("MemoryStore.destroy error:");
                done && done(err);
              } else {
                // TODO - This might throw an error because our err object does not includes a stack.
                // https://github.com/senchalabs/connect/blob/master/lib/middleware/errorHandler.js#L48
                // MemoryStore destroyed, move along.
                done && done(that.err);
              }
            });
          } else {
            // TODO - This might throw an error because our err object does not includes a stack.
            // https://github.com/senchalabs/connect/blob/master/lib/middleware/errorHandler.js#L48
            // Return nothing and move along.
            done && done(err);
          }
        };

        fetchOptions.id = sid;

        fetchOptions.success = function (model) {
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
            // Try to save XM.SessionStore to database.
            model.save(null, saveOptions);
          }
        };
        fetchOptions.error = function (model, err) {
          // Fetch did not find this session, initialize new and save.
          // Create new XM.SessionStore object.
          sessionStore = new XM.SessionStore();
          // TODO - Is this redundant?  Can I just call model.initialize...???
          sessionStore.initialize(null, {isNew: true});

          sessionAttributes = {
            id: sid,
            session: sess
          };

          // Try to save XM.SessionStore to database.
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
      sessionStore = new XM.SessionStore();
      fetchOptions.id = sid;

      fetchOptions.success = function (model) {
        // Delete this session from the db store.
        model.destroy();

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

  return XTPGStore;
};