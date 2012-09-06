/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.dataSource = {

    //datasourceUrl: document.location.hostname, // development, not complete
    datasourceUrl: DOCUMENT_HOSTNAME,
    datasourcePort: 443,
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
        parameters = options.query.parameters,
        prop,
        complete = function (response) {
          var dataHash, params = {}, error;

          // Handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.reason.data.code;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // Handle success
          dataHash = JSON.parse(response.data.rows[0].fetch);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };


      // Helper function to convert parameters to data source friendly formats
      var format = function (param) {
        var recordType = options.query.recordType,
          klass = recordType ? XT.getObjectByName(recordType) : null,
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
        if (relation && relation.type === Backbone.HasOne && relation.includeInJSON) {
          klass = XT.getObjectByName(relation.relatedModel);
          idAttribute = klass.prototype.idAttribute;
          param.attribute = param.attribute + '.' + idAttribute;
        }

      };

      for (prop in parameters) {
        format(parameters[prop]);
      }

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
          var dataHash, params = {}, error;

          // Handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.reason.data.code;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }
          dataHash = JSON.parse(response.data.rows[0].retrieve_record);

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

    @param {XM.Model} model
    @param {Object} options
    */
    commitRecord: function (model, options) {
      var that = this,
        payload = {},
        complete = function (response) {
          var dataHash, params = {}, error;

          // Handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.reason.data.code;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
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
      payload.dataHash = model.changeSet();

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
          var dataHash, params = {}, error;

          // handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.reason.data.code;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
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
    connect: function (callback) {
      if (this.isConnected) {
        if (callback && callback instanceof Function) {
          callback();
        }
        return;
      }

      XT.log("Attempting to connect to the datasource");

      var url = this.datasourceUrl,
        port = this.datasourcePort,
        datasource = "https://%@/clientsock".f(url),
        self = this,
        didConnect = this.sockDidConnect,
        didError = this.sockDidError;

      // attempt to connect and supply the appropriate
      // responders for the connect and error events
      this._sock = io.connect(datasource, {port: port, secure: true});
      this._sock.on("connect", function () {
        //didConnect.call(self, callback);
      });
      this._sock.on("ok", function () {
        didConnect.call(self, callback);
      });
      this._sock.on("error", function (err) {
        didError.call(self, err, callback);
      });
      this._sock.on("debug", function (msg) {
        XT.log("SERVER DEBUG => ", msg);
      });
    },

    /* @private */
    sockDidError: function (err, callback) {
      // TODO: need some handling here
      console.warn(err);
      if (callback && callback instanceof Function) {
        callback(err);
      }
    },

    /* @private */
    sockDidConnect: function (callback) {

      XT.log("Successfully connected to the datasource");

      this.isConnected = true;

      // go ahead and create the session object for the
      // application if it does not already exist
      if (!XT.session) {
        XT.session = Object.create(XT.Session);
        setTimeout(_.bind(XT.session.start, XT.session), 0);
      }

      if (callback && callback instanceof Function) {
        callback();
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
