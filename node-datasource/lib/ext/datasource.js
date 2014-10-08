/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, console:true, issue:true, require:true, XM:true, io:true,
Backbone:true, _:true, X:true, __dirname:true, exports:true, module: true */

(function () {
  "use strict";

  require('../../xt/');
  require('../../xt/database/database');

  var RJSON = require("rjson"),
    path = require('path'),
    _ = require("underscore"),
    DataSource = {
      requestNum: 0,
      callbacks: { },

      getAdminCredentials: function (organization) {
        return {
          user: X.options.databaseServer.user,
          host: X.options.databaseServer.hostname,
          port: X.options.databaseServer.port,
          database: organization,
          password: X.options.databaseServer.password
        };
      },

      /**
      * Encode the server's response into the encoding specified by the client
      * @see enyo-client/application/source/ext/datasource.js#decodeResponse
      */
      encodeResponse: function (result, encoding) {
        if (!encoding) {
          return result;
        }
        else if (encoding === "rjson") {
          return RJSON.pack(result);
        }
        else {
          return {
            isError: true,
            status: "Encoding [" + encoding + "] not recognized."
          };
        }
      },

      /**
      * Initializes database by setting the default pool size
      */
      init: function () {
        var that = this;

        X.addCleanupTask(_.bind(this.cleanup, this), this);
        X.pg.defaults.poolSize = this.poolSize;

        if (X.options && X.options.datasource && X.options.datasource.pgWorker) {
          // Single worker version.
          this.worker = require('child_process').fork(
            path.join(__dirname, '../workers/pg_worker.js')
          );

          this.worker.on('message', function (m) {
            var callback = that.callbacks[m.id];
            delete that.callbacks[m.id];

            if (!m.err) {
              callback(m.err, m.result);
            }
          });

          this.worker.on('exit', function (code, signal) {
            var pid = that.worker.pid,
                exitCode = that.worker.exitCode,
                signalCode = that.worker.signalCode;

            X.err('pgWorker ' + pid + ' died (exitCode: ' + exitCode +
              ' signalCode: ' + signalCode + '). Cannot run any more queries.');
          });
        }
      },

      /**
        Perform query

        @param {String} query
        @param {Object} options
        @param {Function} callback
      */
      query: function (query, options, callback) {
        var creds = {
          "user": options.user,
          "port": options.port,
          "host": options.host || options.hostname,
          "database": options.database,
          "password": options.password
        };

        if (X.options && X.options.datasource && X.options.datasource.pgWorker) {
          this.requestNum += 1;

          this.callbacks[this.requestNum] = callback;
          // Single worker version.
          options.debugDatabase = X.options.datasource.debugDatabase;
          this.worker.send({id: this.requestNum, query: query, options: options, creds: creds, poolSize: this.poolSize});

          // NOTE: Round robin benchmarks are slower then the above single pgworker code.
          // Round robin workers version. This might be useful in the future.
          // var worker = this.workers[this.nextWorker];
          // this.nextWorker += 1;
          // if (this.nextWorker === this.workers.length) {
          //   this.nextWorker = 0;
          // }
          // options.debugDatabase = X.options.datasource.debugDatabase;
          // worker.send({id: this.requestNum, query: query, options: options, creds: creds});
        } else {
          if (X.options && X.options.datasource.debugging &&
              query.indexOf('select xt.delete($${"nameSpace":"SYS","type":"SessionStore"') < 0 &&
              query.indexOf('select xt.get($${"nameSpace":"SYS","type":"SessionStore"') < 0) {
            X.log(query);
          }
          X.pg.connect(creds, _.bind(this.connected, this, query, options, callback));
        }
      },

      /**
      * Connected.
      *
      * NOTE: This is only used when not using a seperate pgWorker process.
      * It's useful if you need to run the node-inspector debugger which breaks on multiple processes.
      * See: https://github.com/dannycoates/node-inspector/issues/130
      * You can also just run, "kill -USR1 12345", to start the debugger on a running process
      * instead of starting node with the debugger running: "sudo node --debug-brk main.js".
      */
      connected: function (query, options, callback, err, client, done, ranInit) {
        // WARNING!!! If you make any changes here, please update pg_worker.js as well.
        var that = this,
          queryCallback;

        if (err) {
          issue(X.warning("Failed to connect to database: " +
            "{host}:{port}/{database} => %@".f(options, err.message)));
          done();
          return callback(err);
        }

        client.status = [];
        client.debug = [];

        if (ranInit === true) {
          client.hasRunInit = true;

          // Register error handler to log errors.
          client.connection.on('error', function (msg) {
            var lastQuery;

            if (msg.message !== "handledError") {
              X.err("Database Error! ", msg.message + " Please fix this!!!");
              _.each(client.debug, function (message) {
                X.err("Database Error! DB message was: ", message);
              });
              lastQuery = that.activeQuery && that.activeQuery.length > 10000 ?
                "Too long to print (" + that.activeQuery.length + " chars) " +
                "but starts with " + that.activeQuery.substring(0, 1000) :
                that.activeQuery;
              X.err("Database Error! Last query was: ", lastQuery);
              X.err("Database Error! DB name = ", options.database);
            }
          });

          client.connection.on('notice', function (msg) {
            if (msg && msg.message) {
              if (msg.severity === 'NOTICE') {
                client.status.push(msg.message);
                //console.log("Database notice Message: ", msg.message);
              } else if (msg.severity === 'INFO') {
                client.status.push(msg.message);
                //console.log("Database info Message: ", msg.message);
              } else if (msg.severity === 'WARNING') {
                client.debug.push(msg.message);
                //console.log("Database warning Message: ", msg.message);
              } else if (msg.severity === 'DEBUG') {
                client.debug.push(msg.message);
                //console.log("Database debug Message: ", msg.message);
              }
            }
          });
        }

        if (!client.hasRunInit) {
          //client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          client.query("select xt.js_init(" + (X.options && X.options.datasource.debugDatabase || false) + ");", _.bind(
            this.connected, this, query, options, callback, err, client, done, true));
        } else {
          queryCallback = function (err, result) {
            if (err) {
              // Set activeQuery for error event handler above.
              that.activeQuery = client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.';
            }

            if (client.status && client.status.length) {
              if (result) {
                try {
                  result.status = JSON.parse(client.status[0]);
                } catch (error) {
                  // Move on, no status message to set. We only want JSON messages here.
                }
              } else if (err) {
                try {
                  err.status = JSON.parse(client.status[0]);
                } catch (error) {
                  // Move on, no status message to set. We only want JSON messages here.
                }
              } else {
                console.log("### FIX ME ### No result or err returned for query. This shouldn't happen.");
                console.trace("### At this location ###");
              }

              if (client.status.length > 1) {
                try {
                  JSON.parse(client.status);
                  console.log("### FIX ME ### Database is returning more than 1 message status. This shouldn't happen.");
                  console.log("### FIX ME ### Status is: ", JSON.stringify(client.status));
                  console.log("### FIX ME ### Query was: ", client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.');
                  console.trace("### At this location ###");
                } catch (error) {
                  // Move on, no status message to set. We only want JSON messages here.
                }
              }
            }
            if (client.debug && client.debug.length) {
              if (result) {
                result.debug = client.debug;
              } else if (err) {
                err.debug = client.debug;
              } else {
                console.log("### FIX ME ### No result or err returned for query. This shouldn't happen.");
                console.trace("### At this location ###");
              }
            }

            // Release the client from the pool.
            done();

            // Call the call back.
            callback(err, result);
          };

          // node-postgres supports parameters as a second argument. These will be options.parameters
          // if they're there.
          if (options.parameters) {
            client.query(query, options.parameters, queryCallback);
          } else {
            client.query(query, queryCallback);
          }
        }
      },

      /*
      Server request

      @param {Object} model or collection
      @param {String} method
      @param {Object} payload
      @param {Object} options
      */
      request: function (obj, method, payload, options) {
        var that = this,
          conn = X.options.databaseServer,
          isDispatch = _.isObject(payload.dispatch),
          query,
          complete = function (err, response) {
            var dataHash,
              params = {},
              error,
              attrs;

            // Handle error
            if (err) {
              if (options && options.error) {
                params.error = err;
                error = XT.Error.clone('xt1001', { params: params });
                options.error.call(that, error);
              }
              return;
            }

            dataHash = JSON.parse(response.rows[0].request);

            // Handle no data as error
            if (method === "get" && options.id &&
              _.isEmpty(dataHash.data)) {
              if (options && options.error) {
                error = XT.Error.clone('xt1007');
                options.error.call(obj, error);
              }
              return;
            }

            // Handle success
            if (options && options.success) {
              if (isDispatch) {
                options.success(dataHash, options);
                return;
              }
              if (dataHash.patches) {
                attrs = obj ?
                    XM.jsonpatch.apply(obj.toJSON(), dataHash.patches) :
                    dataHash.patches;
              } else {
                attrs = dataHash.data;
              }
              if (obj) {
                obj.etag = dataHash.etag;
              }
              options.success.call(that, obj, attrs, options);
            }
          };

        payload.username = options.username;
        payload.encryptionKey = X.options.encryptionKey;
        payload = JSON.stringify(payload);
        query = "select xt.{method}($${payload}$$) as request"
                .replace("{method}", method)
                .replace("{payload}", payload);

        //if (X.options.datasource.debugging) {
        //  X.log("Query from model: ", query);
        //}

        if (options.database) {
          conn.database = options.database;
        } else {
          console.log("### FIX ME ### calling XT.dataSource.request with payload = ", JSON.stringify(payload));
          console.log("### FIX ME ### call needs to set database in options!!!");
          console.trace("### At this location ###");
          conn.database = X.options.datasource.databases[0]; // XXX FIXME this has to come from req.session.passport.user.organization
        }

        this.query(query, conn, complete);
        return true;
      }
    };

  //
  // Set up listener for postgres events on the nodext channel
  //
  /*
    do $$
      var payload = {action: "email", content: {
        from: "no-reply@xtuple.com",
        to: "shackbarth@xtuple.com",
        subject: "test subject",
        text: "test body"
      }};
      plv8.execute("select pg_notify($1, $2);", ['nodext', JSON.stringify(payload)]);
    $$ language plv8;
  */
  var setupPgListeners = function (databases, eventHandlers) {
    var afterAction = function () {
      // do nothing.
      console.log("action taken", arguments);
    };
    _.each(databases, function (database) {
      var creds = DataSource.getAdminCredentials(database);
      X.pg.connect(creds, function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }
        client.on('notification', function (msg) {
          var payload = JSON.parse(msg.payload);

          // the event handlers get passed in by the caller. Just run the
          // event handler that corresponds to the action postgres is
          // requesting.
          eventHandlers[payload.action](payload.content, afterAction);
        });
        client.query("LISTEN nodext");
        X.log("Listening for postgres notifications on the nodext channel on ", database);
      });
    });
  };

  XT.dataSource = X.Database.create(DataSource);

  module.exports = {
    api: DataSource,
    dataSource: XT.dataSource,
    setupPgListeners: setupPgListeners
  };

}());
