/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, io:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.dataSource = {

    datasourceUrl: "bigiron.xtuple.com",
    //datasourceUrl: "purpletie.xtuple.com",
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
          var dataHash, params = {}, error;

          // Handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.message.data.detail;
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
        
      var query = options.query,
        Klass = XT.Model.getObjectByName(query.recordType),
        params = query.parameters,
        conditions = query.conditions,
        orderBy = query.orderBy,
        list = XT.query.tokenizeString(conditions),
        conds = [],
        prop,
        i,
        len,
        getRelation = function (relations, recordType) {
          return _.find(Klass.prototype.relations, function (relation) {
            return relation.relatedModel === value;
          });
        };
      
      // Massage conditions so they are compatible with the data source
      for (i = 0, len = list.length; i < len; i++) {
        var tokenValue;
        switch (list[i].tokenType) {
        case "PROPERTY":
          var value = list[i].tokenValue,
              relation = getRelation(Klass.prototype.relations, value);
          // format nested records to array query format
          if (relation && relation.type === Backbone.Relational.HasOne &&
                relation.includeInJSON === undefined) {
            tokenValue = '("' + value + '").id';
          } else {
            tokenValue = value === "id" ? '"id"' : '"' + value + '"';
          }
          break;
        case "YES":
          tokenValue = "true";
          break;
        case "NO":
          tokenValue = "false";
          break;
        case "BEGINS_WITH":
          tokenValue = '~^';
          break;
        case "ENDS_WITH":
          tokenValue = '~?';
          break;
        case "CONTAINS":
        case "MATCHES":
          tokenValue = '~';
          break;
        case "ANY":
          tokenValue = '<@';
          break;
        case "PARAMETER":
          tokenValue =  '{' + list[i].tokenValue + '}';
          break;
        case "%@":
          tokenValue = list[i].tokenType;
          break;
        default:
          tokenValue = list[i].tokenValue;
        }
        conds.push(tokenValue);
      }

      // Massage `orderBy` as well
      if (orderBy) {
        
        // Split order by on comma into array
        list = orderBy.split(',');
        for (i = 0; i < list.length; i++) {
          
          // Strip leading whitespace and separate potential DESC and ASC qualifiers
          var str = list[i].replace(/^\s+|\s+$/g, ""),
              sub = str.split(' ');
          // Quote the property name, then put it all back together
          sub.splice(0, 1, ['"' + _.first(sub) + '"']);
          list.splice(i, 1, [sub.join(' ')]);
        }
        orderBy = list.join(',');
      }

      // Helper function to convert parameters to data source friendly formats
      var format = function (value) {
        
        // Format date if applicable
        if (value instanceof Date) {
          return value.toJSON();
          
        // Format record if applicable
        } else if (value instanceof XT.Model) {
          return value.id;
        }
        
        // Return regex source if regex
        return value.source === undefined ? value : value.source;
      };

      // Massage parameters so they are compatible with the data source
      if (params instanceof Array) {
        for (i = 0, len = params.length; i < len; i++) {
          params[i] = format(params[i]);
        }
      } else {
        for (prop in params) {
          params[prop] = format(params[prop]);
        }
      }

      payload.requestType = 'fetch';
      payload.query = options.query;
      payload.query.conditions = conds.join(' ');
      payload.query.parameters = params;
      payload.query.orderBy = orderBy;

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
              params.error = response.message.data.detail;
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

    @param {XT.Model} model
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
              params.error = response.message.data.detail;
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
              params.error = response.message.data.detail;
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
        datasource = "http://%@:%@/client".f(url, port),
        self = this,
        didConnect = this.sockDidConnect,
        didError = this.sockDidError;

      // attempt to connect and supply the appropriate
      // responders for the connect and error events
      this._sock = io.connect(datasource);
      this._sock.on("connect", function () {
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
