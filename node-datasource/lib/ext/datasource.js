/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, X:true */

(function () {
  "use strict";

  XT.dataSource = X.Database.create({
    requestNum: 0,
    callbacks: {},

    /**
     * Initializes database by setting the default pool size
     */
    init: function () {
      var that = this;

      // TODO - I don't think the cleanup task is needed when using a child pgworker.
      // It may not ne needed at all anymore. BT 2013-03-31
      X.addCleanupTask(_.bind(this.cleanup, this), this);
      X.pg.defaults.poolSize = this.poolSize;

      if (X.options && X.options.datasource && X.options.datasource.pgWorker) {
        // Single worker version.
        this.worker = require('child_process').fork(__dirname + '/pgworker.js');
        this.worker.on('message', function (m) {
          var callback = that.callbacks[m.id];
          delete that.callbacks[m.id];

          if (m.err) {
            issue(X.warning("Failed to connect to database: " +
              "{hostname}:{port}/{database} => %@".f(m.options, m.err.message)));
            return callback(m.err);
          }

          callback(m.err, m.result);
        });

        this.worker.on('exit', function (code, signal) {
          var pid = that.worker.pid,
              exitCode = that.worker.exitCode,
              signalCode = that.worker.signalCode;

          X.err('pgWorker ' + pid + ' died (exitCode: ' + exitCode + ' signalCode: ' + signalCode + '). Cannot run any more queries.');

          // TODO - Figure out how to restart the worker.  This doesn't work.
          //that.worker = require('child_process').fork(__dirname + '/pgworker.js');
        });
      }

      // NOTE: Round robin benchmarks are slower then the above single pgworker code.
      // Round robin workers version. This might be useful in the future.
      // if (require('os').cpus().length > 1) {
      //   this.numWorkers = require('os').cpus().length * 2;
      //   //this.numWorkers = 1;
      // } else {
      //   this.numWorkers = 1;
      // }

      // X.log("Number of pgWorkers = ", this.numWorkers);

      // this.nextWorker = 0;
      // this.workers = [];
      // for (var i=0; i < this.numWorkers; i++) {
      //   var worker = require('child_process').fork(__dirname + '/pgworker.js');
      //   this.workers.push(worker);

      //   worker.on('message', function (m) {
      //     var callback = that.callbacks[m.id];
      //     delete that.callbacks[m.id];

      //     if (m.err) {
      //       issue(X.warning("Failed to connect to database: " +
      //         "{hostname}:{port}/{database} => %@".f(m.options, m.err.message)));
      //       return callback(m.err);
      //     }

      //     callback(m.err, m.result);
      //   })
      // }
    },

    /**
      Perform query

      @param {String} query
      @param {Object} options
      @param {Function} callback
     */
    query: function (query, options, callback) {
      var str = this.conString(_.clone(options));

      if (X.options && X.options.datasource && X.options.datasource.pgWorker) {
        this.requestNum += 1;

        this.callbacks[this.requestNum] = callback;
        // Single worker version.
        this.worker.send({id: this.requestNum, query: query, options: options, conString: str, poolSize: this.poolSize});

        // NOTE: Round robin benchmarks are slower then the above single pgworker code.
        // Round robin workers version. This might be useful in the future.
        // var worker = this.workers[this.nextWorker];
        // this.nextWorker += 1;
        // if (this.nextWorker === this.workers.length) {
        //   this.nextWorker = 0;
        // }
        // worker.send({id: this.requestNum, query: query, options: options, conString: str});
      } else {
        if (X.options.datasource.debugging) {
          console.log(query);
        }
        X.pg.connect(str, _.bind(this.connected, this, query, options, callback));
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
      // WARNING!!! If you make any changes here, please update pgworker.js as well.
      var that = this;

      if (err) {
        issue(X.warning("Failed to connect to database: " +
          "{hostname}:{port}/{database} => %@".f(options, err.message)));
        done();
        return callback(err);
      }

      if (ranInit === true) {
        client.hasRunInit = true;

        // Register error handler to log errors.
        // TODO - Not sure if setting that.activeQuery below is getting the right query here.
        client.connection.on('error', function (msg) {
          console.log("Database Error! Last query was: ", that.activeQuery);
          console.log("Database Error! DB message was: ", msg);
        });

        client.connection.on('notice', function (msg) {
          if (msg && msg.message) {
            if (msg.severity === 'NOTICE') {
              that.msg = msg.message;
            } else if (msg.severity === 'INFO') {
              that.msg = msg.message;
            } else if (msg.severity === 'WARNING') {
              that.msg = msg.message;
              console.log("Database warning Message: ", msg.message);
            } else if (msg.severity === 'DEBUG') {
              that.debug = msg.message;
            }
          }
        });
      }

      if (!client.hasRunInit) {
        client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          this.connected, this, query, options, callback, err, client, done, true));
      } else {
        client.query(query, function (err, result) {
          if (err) {
            // Set activeQuery for error event handler above.
            that.activeQuery = client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.';
          }

          // Release the client from the pool.
          done();

          if (that.msg) {
            result.msg = that.msg;
          }
          if (that.debug) {
            if (result) {
              result.debug = that.debug;
            } else {
              console.log("result = ", JSON.stringify(result));
              console.log("error = ", JSON.stringify(err));
            }
          }

          // Call the call back.
          callback(err, result);
        });
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
        conn = X.options.globalDatabase,
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
      payload = JSON.stringify(payload);
      query = "select xt.{method}($${payload}$$) as request"
              .replace("{method}", method)
              .replace("{payload}", payload);
      // uncomment this to see the query against the global database
      //X.log(query);
      this.query(query, conn, complete);
      return true;
    }

  });

}());
