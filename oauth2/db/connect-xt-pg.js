/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, console:true*/

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
  var Store = connect.session.Store;

  /**
   * Initialize XTPGStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */
  function XTPGStore(options) {
    options = options || {};
    Store.call(this, options);
    this.prefix = null == options.prefix ? 'sess:' : options.prefix;

    // TODO - Add an option flag that turns on use of Express's MemoryStore as a memory cache.
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
      var sessionStore = {},
          fetchOptions = {},
          result;

      sid = this.prefix + sid;

      // Create new XM.SessionStore object.
      sessionStore = new XM.SessionStore();

      // TODO - remote this
      X.debug('XTPGStore GET :', sid);

      fetchOptions.id = sid;

      fetchOptions.success = function (model) {
        // We have a matching session store cookie

        // TODO - update lastModified time to extend timeout?
        //model.set("lastModified", new Date().getTime());
        //model.save(null, saveOptions);

        // TODO - remote this
        X.debug('XTPGStore sessionStore fetch model:');

        if (model.get("session")) {
          result = JSON.parse(model.get("session"));
          // TODO - remote this
          X.debug('XTPGStore sessionStore fetch return:', result);
        }

        // Return the session data back to Express to be used by routes and functors.
        return done(null, result);
      };
      fetchOptions.error = function (model, err) {
        if (err) {
          // Session was not found. This can happen if cookie is still in the browser, but
          // db record was removed by CleanupTask because it has timed out.

          // TODO - remote this
          X.debug('XTPGStore sessionStore fetch error:');

          done && done(err);
        }
      };

      // Try to fetch a session matching the user's cookie sid.
      sessionStore.fetch(fetchOptions);
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
      var fetchOptions = {},
          saveOptions = {},
          sessionAttributes = {},
          sessionStore = {};

      sid = this.prefix + sid;
      sess = JSON.stringify(sess);

      // Create new XM.SessionStore object.
      sessionStore = new XM.SessionStore();

      // TODO - remote this
      X.debug('XTPGStore SET :', sid);
      X.debug('XTPGStore SET sess =', sess);

      saveOptions.success = function (model) {
        X.debug('########### got here 4');
        // TODO - remote this
        X.debug('XTPGStore sessionStore save model:');
        done && done();
      };
      saveOptions.error = function (model, err) {
        X.debug('########### got here 5');
        // TODO - remote this
        X.debug('XTPGStore sessionStore save error:');
        done && done(err);
      };

      fetchOptions.id = sid;

      fetchOptions.success = function (model) {
        X.debug('########### got here 2');
        // Fetch found this session, update it and save.
        model.set("session", sess);

        X.debug("Can't get session to save here: ", model.getStatusString());

        // Set gets called a lot. There isn't allways a change to save and save will fail.
        // Check if this model has changed before trying to sve it.
        if (model.getStatusString() === "READY_CLEAN") {
          // Nothing to save, move along.
          done && done();
        } else if (model.getStatusString() === "READY_DIRTY") {
          // TODO - remote this
          X.debug('XTPGStore sessionStore SET fetch found, saving update: ', sid);

          // Try to save XM.SessionStore to database.
          model.save(null, saveOptions);
        }
      };
      fetchOptions.error = function (model, err) {
        X.debug('########### got here 3');
        // Fetch did not find this session, initialize new and save.
        // Create new XM.SessionStore object.
        // TODO - Is this redundant?  Can I just call model.initialize...???
        sessionStore = new XM.SessionStore();
        sessionStore.initialize(null, {isNew: true});


        X.debug('########### got here 3.1');
        // Set new XM.SessionStore data.
        sessionAttributes = {
          id: sid,
          session: sess
        };

        // TODO - remote this
        X.debug('XTPGStore sessionStore SET fetch error, saving new: ', sid);


        X.debug('########### got here 3.2');
        // Try to save XM.SessionStore to database.
        sessionStore.save(sessionAttributes, saveOptions);
      };

      X.debug('########### got here 1');
      // Try to fetch a session matching the user's cookie sid to
      // see if we need to make a new one or update the old one.
      sessionStore.fetch(fetchOptions);
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
          fetchOptions = {};

      sid = this.prefix + sid;

      // Create new XM.SessionStore object.
      sessionStore = new XM.SessionStore();

      // TODO - remote this
      X.debug('XTPGStore DESTROY :', sid);

      fetchOptions.id = sid;

      fetchOptions.success = function (model) {
        // TODO - remote this
        X.debug("######### destroy test");

        // Delete this session from the db store.
        model.destroy();
        done && done();
      };
      fetchOptions.error = function (model, err) {
        // TODO - remote this
        X.debug('XTPGStore sessionStore destroy error:');

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