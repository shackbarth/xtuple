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

      //   worker.on('message', function(m) {
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
      if (err) {
        issue(X.warning("Failed to connect to database: " +
          "{hostname}:{port}/{database} => %@".f(options, err.message)));
        done();
        return callback(err);
      }

      if (ranInit === true) {
        client.hasRunInit = true;
      }

      if (!client.hasRunInit) {
        client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          this.connected, this, query, options, callback, err, client, done, true));
      } else {

        client.query(query, function (err, result) {
          // Release the client from the pool.
          done();

          // Call the call back.
          callback(err, result);
        });
      }
    },

    /*
    Returns a record array based on a query.

    @param {Object} query
    @param {Object} options
    */
    fetch: function (collection, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        payload = {},
        parameters = options.query.parameters,
        prop,
        conn = X.options.globalDatabase,
        query,
        complete = function (err, response) {
          var dataHash, params = {}, error;

          // Handle error
          if (err) {
            if (options && options.error) {
              params.error = err.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // Handle success
          dataHash = JSON.parse(response.rows[0].fetch);
          if (options && options.success) {
            if (collection) {
              options.success.call(that, collection, dataHash, options);
            // Support for legacy code
            } else {
              options.success.call(that, dataHash);
            }
          }
        };


      // Helper function to convert parameters to data source friendly formats
      var format = function (param) {
        var recordType = options.query.recordType,
          klass = recordType ? Backbone.Relational.store.getObjectByName(recordType) : null,
          relations = klass ? klass.prototype.relations : [],
          relation = _.find(relations, function (rel) {
            return rel.key === param.attribute;
          }),
          idAttribute;

        // Format date if applicable
        if (param.value instanceof Date) {
          param.value = param.value.toJSON();

        // Format record if applicable
        } else if (param.value instanceof XM.Model) {
          param.value = param.value.id;
        }

        // Format attribute if it's `HasOne` relation
        if (relation && relation.type === Backbone.HasOne && relation.isNested) {
          klass = Backbone.Relational.store.getObjectByName(relation.relatedModel);
          idAttribute = klass.prototype.idAttribute;
          param.attribute = param.attribute + '.' + idAttribute;
        }

      };

      for (prop in parameters) {
        format(parameters[prop]);
      }

      payload.query = options.query;
      payload.username = options.username;
      payload = JSON.stringify(payload);
      query = "select xt.fetch('%@')".f(payload);
      //X.log(query);
      this.query(query, conn, complete);
      return true;
    },

    /*
    Request for data processing action

    @param {String} record type
    @param {Number} id
    @param {Object} options
    */
    request: function (model, method, payload, options) {
      var that = this,
        conn = X.options.globalDatabase,
        query,
        complete = function (err, response) {
          var dataHash, params = {}, error;

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
          if (_.isEmpty(dataHash)) {
            if (options && options.error) {
              error = XT.Error.clone('xt1007');
              options.error.call(that, error);
            }
            return;
          }

          // Handle success
          if (options && options.success) {
            options.success.call(that, model, dataHash, options);
          }
        };

      payload.username = options.username;
      payload = JSON.stringify(payload);
      query = "select xt.retrieve_record('%@') as request".f(payload);
      //X.log(query);
      this.query(query, conn, complete);
      return true;
    },

    /*
    Dispatch a server side function call to the datasource.

    @param {String} class name
    @param {String} function name
    @param {Object} parameters
    @param {Object} options
    @param {Function} options.success callback
    @param {Function} options.error callback
    */
    dispatch: function (name, func, params, options) {
      var that = this,
        conn = X.options.globalDatabase,
        query,
        payload = {
          className: name,
          functionName: func,
          parameters: params,
          username: options.username
        },
        complete = function (err, response) {
          var dataHash, params = {}, error;

          // handle error
          if (err) {
            if (options && options.error) {
              params.error = err;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // handle success
          if (options && options.success) {
            try {
              dataHash = JSON.parse(response.rows[0].dispatch);
            } catch (err) {
              dataHash = response.rows[0].dispatch;
            }
            options.success.call(that, dataHash, options);
          }
        };
      payload = JSON.stringify(payload);
      query = "select xt.dispatch('%@')".f(payload);
      //X.log(query);
      this.query(query, conn, complete);
      return true;
    }

  });

}());
