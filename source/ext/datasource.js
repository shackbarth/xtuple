/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, console:true, enyo:true */

(function () {
  "use strict";

  XT.DataSource = {

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
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // Handle success
          // currently dealing with two different protocols for response formatting
          dataHash = response.data.rows ? JSON.parse(response.data.rows[0].fetch) : response.data;
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
        if (relation && relation.type === Backbone.HasOne && relation.isNested) {
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
      payload.databaseType = options.databaseType;

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
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }
          // currently dealing with two different protocols for response formatting
          dataHash = response.data.rows ? JSON.parse(response.data.rows[0].retrieve_record) : response.data;
          //dataHash = JSON.parse(response.data.rows[0].retrieve_record);

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
      payload.databaseType = options.databaseType;
      payload.options = { context: options.context };

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
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // Handle ok or complete hash response
          // currently dealing with two different protocols for response formatting
          dataHash = response.data.rows ? JSON.parse(response.data.rows[0].commit_record) : response.data;
          //dataHash = JSON.parse(response.data.rows[0].commit_record);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.requestType = 'commitRecord';
      payload.recordType = model.recordType;
      payload.binaryField = model.binaryField; // see issue 18661
      payload.requery = options.requery;
      payload.databaseType = options.databaseType;
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
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // handle success
          // currently dealing with two different protocols for response formatting
          // TODO: long-term solution for all of these in this file
          dataHash = response.data.rows ? JSON.parse(response.data.rows[0].dispatch) : response.data;
          //dataHash = JSON.parse(response.data.rows[0].dispatch);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.databaseType = options.databaseType;
      return XT.Request
               .handle('function/dispatch')
               .notify(complete)
               .send(payload);
    },

    /*
      Reset a global user's password.

    @param {String} id
    @param {Function} options.success callback
    @param {Function} options.error callback
    */
    resetPassword: function (id, options) {
      var that = this,
        payload = {
          id: id,
          newUser: options.newUser
        },
        complete = function (response) {
          var params = {}, error;

          // handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // handle success
          if (options && options.success) {
            options.success.call(that, response.data);
          }
        };

      return XT.Request
               .handle('function/resetPassword')
               .notify(complete)
               .send(payload);
    },

    /*
      Change a global password.

    @param {Object} parameters
    @param {Function} options.success callback
    @param {Function} options.error callback
    */
    changePassword: function (params, options) {
      var that = this,
        payload = {
          parameters: params
        },
        complete = function (response) {
          var params = {}, error;

          // handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // handle success
          if (options && options.success) {
            options.success.call(that, response.data);
          }
        };

      return XT.Request
               .handle('function/changePassword')
               .notify(complete)
               .send(payload);
    },

    ajaxSuccess: function (inSender, inResponse) {
      var params = {}, error;

      // handle error
      if (inResponse.isError) {
        if (inSender.error) {
          params.error = inResponse.message;
          error = XT.Error.clone('xt1001', { params: params });
          inSender.error.call(this, error);
        }
        return;
      }

      // handle success
      if (inSender.success) {
        inSender.success.call(this, inResponse.data);
      }
    },
    /*
      Sends a request to node to send out an email

    @param {Object} payload
    @param {String} payload.from
    @param {String} payload.to
    @param {String} payload.cc
    @param {String} payload.bcc
    @param {String} payload.subject
    @param {String} payload.text
    */
    sendEmail: function (payload, options) {
      var that = this,
        ajax = new enyo.Ajax({
          url: "http://localhost:2000/email", // XXX temp until migration
          //url: "/email",
          success: options ? options.success : undefined,
          error: options ? options.error : undefined
        });

      ajax.response(this.ajaxSuccess);
      ajax.go(payload);
    },

    /*
      Determine the list of extensions in use by the user's
      organization.

    @param {Object} parameters
    @param {Function} options.success callback
    @param {Function} options.error callback
    */
    getExtensionList: function (options) {
      var that = this,
        ajax = new enyo.Ajax({
          url: "http://localhost:2000/extensions", // XXX temp until migration
          //url: "/extensions",
          success: options ? options.success : undefined,
          error: options ? options.error : undefined
        });

      ajax.response(this.ajaxSuccess);
      ajax.go();

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

      this._sock.on("timeout", function (msg) {
        XT.log("SERVER SAID YOU TIMED OUT");

        var p = XT.app.createComponent({
          kind: "onyx.Popup",
          centered: true,
          modal: true,
          floating: true,
          scrim: true,
          autoDismiss: false,
          style: "text-align: center;",
          components: [
            {content: "_sessionTimedOut".loc()},
            {kind: "onyx.Button", content: "_ok".loc(), tap: function () { relocate(); }}
          ]
        });
        p.show();
      });

      this._sock.on("disconnect", function () {
        XT.log("DISCONNECTED FROM SERVER");
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

  XT.dataSource = Object.create(XT.DataSource);

}());
