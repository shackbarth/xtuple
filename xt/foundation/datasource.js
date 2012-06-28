// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, io:true, _:true, console:true */

(function () {
  "use strict";

  XT.dataSource = {

    datasourceUrl: "asteroidbelt.xtuple.com",
    //datasourceUrl: "localhost",
    datasourcePort: 9000,
    isConnected: false,

    /*
    Returns a record array based on a query.
  
    @param {Object} query
    @param {Object} options
    */
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      var that = this,
        payload = {},
        complete = function (response) {
          var dataHash;

          // Handle error
          if (response.data.isError) {
            if (options && options.error) {
              options.error.call(that, response.data.reason);
            }
            return;
          }

          // Handle success
          dataHash = JSON.parse(response.data.rows[0].fetch);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.requestType = 'fetch';
      payload.query = options.query;

      return XT.Request
               .handle("function/fetch")
               .notify(complete)
               .send(payload);
    },

    /*
    Returns a single record.
  
    @param {String} record type
    @param {Number} id
    @param {Object} options
    */
    retrieveRecord: function (recordType, id, options) {
      var that = this,
        payload = {},
        complete = function (response) {
          var dataHash;

          // Handle error
          if (response.data.isError) {
            if (options && options.error) {
              options.error.call(that, response.data.reason);
            }
            return;
          }
          dataHash = JSON.parse(response.data.rows[0].retrieve_record);

          // Handle no data as error
          if (_.isEmpty(dataHash)) {
            if (options && options.error) {
              options.error.call(that, "_recordNotFound".loc());
            }
            return;
          }

          // Handle success
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.requestType = 'retrieveRecord';
      payload.recordType = recordType;
      payload.id = id;

      return XT.Request
               .handle("function/retrieveRecord")
               .notify(complete)
               .send(payload);
    },

    /*
    Commit a single record.
  
    @param {XT.Model} model
    @param {Object} options
    */
    commitRecord: function (model, options) {
      var that = this,
        payload = {},
        complete = function (response) {
          var dataHash;

          // Handle error
          if (response.data.isError) {
            if (options && options.error) {
              options.error.call(that, response.data.reason);
            }
            return;
          }

          // Handle ok or complete hash response
          dataHash = JSON.parse(response.data.rows[0].commit_record);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.requestType = 'commitRecord';
      payload.recordType = model.recordType;
      payload.requery = options.requery;
      payload.dataHash = model.toJSON();

      return XT.Request
               .handle("function/commitRecord")
               .notify(complete)
               .send(payload);
    },

    /*
    Dispatch a server side function call to the datasource.
  
    @param {String} class name
    @param {String} function name
    @param {Object} parameters
    @param {Function} success callback
    @param {Function} error callback
    */
    /** @private */
    dispatch: function (name, func, params, options) {
      var that = this,
        payload = {
          requestType: 'dispatch',
          className: name,
          functionName: func,
          parameters: params
        },
        complete = function (response) {
          var dataHash;

          // handle error
          if (response.data.isError) {
            if (options && options.error) {
              options.error.call(that, response.data.reason);
            }
            return;
          }

          // handle success
          dataHash = JSON.parse(response.data.rows[0].dispatch);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      return XT.Request
               .handle('function/dispatch')
               .notify(complete)
               .send(payload);
    },

    /* @private */
    connect: function () {
      if (this.isConnected) { return; }

      console.log("Attempting to connect to the datasource");

      var url = this.datasourceUrl,
        port = this.datasourcePort,
        datasource = "http://%@:%@/client".f(url, port),
        self = this,
        didConnect = this.sockDidConnect,
        didError = this.sockDidError;

      // attempt to connect and supply the appropriate
      // responders for the connect and error events
      this._sock = io.connect(datasource);
      this._sock.on("connect", function () {
        didConnect.call(self);
      });
      this._sock.on("error", function (err) {
        didError.call(self, err);
      });
      this._sock.on("debug", function (msg) {
        console.log("SERVER DEBUG => ", msg);
      });
    },

    /* @private */
    sockDidError: function (err) {
      // TODO: need some handling here
      console.warn(err);
    },

    /* @private */
    sockDidConnect: function () {

      console.log("Successfully connected to the datasource");

      this.isConnected = true;

      // go ahead and create the session object for the
      // application if it does not already exist
      if (!XT.session) {
        XT.session = new XT.Session();
      }
    },

    reset: function () {
      if (!this.isConnected) {
        return;
      }

      var sock = this._sock;
      if (sock) {
        sock.disconnect();
        this.isConnected = false;
      }

      this.connect();
    }

  };

}());