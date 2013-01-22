/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, console:true, _:true*/

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

    // TODO - Add an option flag that turns on use of Express's MemoryStore as a memory cache.
    // TODO - If we ever run multiple processes/servers, MemoryStore must be replaced with something
    // all processes/servers can use/share and keep in sync like Redis.

    // Provides a function to load all the data from XM.SessionStore into the Express MemoryStore for caching.
    this.loadCache = function (options) {
      if (self.hybridCache) {
        // Create new XM.SessionStore object.
        var sessionsCollection = new XM.SessionStoreCollection(),
            fetchOptions = {};
        // TODO - options could be used to only load parital dataset of recently active sessions.
        // It could also be used to help process/server syncing if we move to something like Redis.

        // TODO - Fetch all records from XM.SessionStore and load them into the Express MemoryStore.
        // How do you fetch all? Collection?

        fetchOptions.success = function (sessmodels) {
          var sid,
              sess,
              done;

          done = function (err, something) {
            //X.debug("MemoryStore was hit ", something);
          };

          _.each(sessmodels.models, function (model) {
            sid = model.get("id");
            sess = JSON.parse(model.get("session"));

            //X.debug("Here are all the sessions: ", sess);
            // TODO - Stuff this into Express MemeoryStore for caching.

            MemoryStore.set(sid, sess, done);

            //X.debug("Here is the MemoryStore: ", MemoryStore.get(sid, done));
          });
        };
        //fetchOptions.error = function (models, err) {
        //  X.debug("Session Collection fetch failed.");
        //}

        //X.debug("########## this is where we load XM.SessionStore into the Express MemoryStore");

        // TODO - This is REALLY SLOW if there are 10,000 sessions in the table.
        // I think that is caused by the backbone model layer.
        // This is a start up task, so everything is fine after about 1 min once all of this loads.
        sessionsCollection.fetch(fetchOptions);
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

        // Create new XM.SessionStore object.
        sessionStore = new XM.SessionStore();

        // TODO - remove this
        //X.debug('XTPGStore GET :', sid);

        fetchOptions.id = sid;

        fetchOptions.success = function (model) {
          // We have a matching session store cookie

          // TODO - update lastModified time to extend timeout?
          // Doing this will complicate things with a hybridCache MemoryStore.
          // Do we really need to set that here for just in XM.Session and have CleanupTask
          // clean up XM.SessionStore on timeouts?
          //model.set("lastModified", new Date().getTime());
          //model.save(null, saveOptions);

          // TODO - remove this
          //X.debug('XTPGStore sessionStore fetch model:');

          if (model.get("session")) {
            result = JSON.parse(model.get("session"));
            // TODO - remove this
            //X.debug('XTPGStore sessionStore fetch return:', result);
          }

          if (that.hybridCache) {
            // TODO...
            // We fetched from the database because this session was not in the MemoryStore.
            // Load this data into the MemoryStore to speed this up next time.
            MemoryStore.set(sid, result, function (err, cache) {
              if (err) {
                // Nothing found anywhere, return error and move along...
                //X.debug("MemoryStore.set error");
                done && done(err);
              } else {
                // Return the session data back to Express to be used by routes and functors.
                //X.debug("MemoryStore.set success");
                return done(null, result);
              }
            });
          } else {
            // Return the session data back to Express to be used by routes and functors.
            //X.debug("No MemoryStore fetch success");
            return done(null, result);
          }
        };
        fetchOptions.error = function (model, err) {
          if (err) {
            // Session was not found. This can happen if cookie is still in the browser, but
            // db record was removed by CleanupTask because it has timed out.

            // This is called when MemoryStore did not find session data.
            // No need to touch MemoryStore here.

            // TODO - remove this
            //X.debug('XTPGStore sessionStore fetch error:');

            // Nothing found anywhere, return error nd move along...
            done && done(err);
          }
        };

        // Try to fetch a session matching the user's cookie sid.
        sessionStore.fetch(fetchOptions);
      };

      if (this.hybridCache) {
        // TODO - Try to get session data from MemoryStore.
        fetchCache = function (err, cache) {
          if (cache && !err) {
            //X.debug("MemoryStore.get success ", cache);
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

        // Create new XM.SessionStore object.
        sessionStore = new XM.SessionStore();

        // TODO - remove this
        //X.debug('XTPGStore SET :', sid);
        //X.debug('XTPGStore SET sess =', sess);

        saveOptions.success = function (model) {
          //X.debug('########### got here 4');
          // TODO - remove this
          //X.debug('XTPGStore sessionStore save model:');

          if (that.hybridCache) {
            // TODO - Overwrite the MemoryStore with the new data, replacing old or creating new entry.

            // If MemoryStore err, log a trace, this shouldn't happen.
          }
          // Success, move along.
          done && done();
        };
        saveOptions.error = function (model, err) {
          //X.debug('########### got here 5');
          // TODO - remove this
          //X.debug('XTPGStore sessionStore save error:');

          // This shouldn't happen. How did we get here? Log trace.
          console.trace("XM.SessionStore save error. This shouldn't happen.");

          if (that.hybridCache) {
            // TODO - Delete any match in MemoryStore.

            // If MemoryStore err, log a trace, this shouldn't happen.
          }
          // Send error and move along.
          done && done(err);
        };

        fetchOptions.id = sid;

        fetchOptions.success = function (model) {
          //X.debug('########### got here 2');
          // Fetch found this session, update it and save.
          model.set("session", sess);

          //X.debug("Can't get session to save here: ", model.getStatusString());

          // Set gets called a lot. There isn't always a change to save and save will fail.
          // Check if this model has changed before trying to save it.
          if (model.getStatusString() === "READY_CLEAN") {
            // This shouldn't happen when using MemoryStore caching because we check it first for changes.
            if (that.hybridCache) {
              // This shouldn't happen. How did we get here? Log trace.
              //console.trace("XM.SessionStore update has status of 'READY_CLEAN' when MemoryStore checking is on, but didn't find a match.");
            }

            // Nothing to save, move along.
            done && done();
          } else if (model.getStatusString() === "READY_DIRTY") {
            // TODO - remove this
            //X.debug('XTPGStore sessionStore SET fetch found, saving update: ', sid);

            // Try to save XM.SessionStore to database.
            model.save(null, saveOptions);
          }
        };
        fetchOptions.error = function (model, err) {
          //X.debug('########### got here 3');
          // Fetch did not find this session, initialize new and save.
          // Create new XM.SessionStore object.
          // TODO - Is this redundant?  Can I just call model.initialize...???
          sessionStore = new XM.SessionStore();
          sessionStore.initialize(null, {isNew: true});


          //X.debug('########### got here 3.1');
          // Set new XM.SessionStore data.
          sessionAttributes = {
            id: sid,
            session: sess
          };

          // TODO - remove this
          //X.debug('XTPGStore sessionStore SET fetch error, saving new: ', sid);

          //X.debug('########### got here 3.2');
          // Try to save XM.SessionStore to database.
          sessionStore.save(sessionAttributes, saveOptions);
        };

        //X.debug('########### got here 1');
        // Try to fetch a session matching the user's cookie sid to
        // see if we need to make a new one or update the old one.
        sessionStore.fetch(fetchOptions);
      };

      if (this.hybridCache) {
        // TODO - Try to get session data from MemoryStore.
        fetchCache = function (err, cache) {
          if (cache && !err) {
            // If found, check if sess data matches MemoryStore.
            if (1 === 1) {
              // If match, nothing to save, move along.
              //X.debug("MemoryStore matches, no need to set. ", cache);
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

      // Create new XM.SessionStore object.
      sessionStore = new XM.SessionStore();

      // TODO - remove this
      //X.debug('XTPGStore DESTROY :', sid);

      fetchOptions.id = sid;

      fetchOptions.success = function (model) {
        // TODO - remove this
        //X.debug("######### destroy test");

        // Delete this session from the db store.
        model.destroy();

        if (that.hybridCache) {
          // TODO - Delete this session from the MemoryStore as well.
        }

        done && done();
      };
      fetchOptions.error = function (model, err) {
        // TODO - remove this
        //X.debug('XTPGStore sessionStore destroy error:');

        if (that.hybridCache) {
          // TODO - Did not find a match in the db, delete this session from the MemoryStore, it's invalid.
        }
        done && done(err);
      };

      // Try to fetch a session matching the user's cookie sid.
      sessionStore.fetch(fetchOptions);
    } catch (err) {
      done && done(err);
    }
  };

  return XTPGStore;
};