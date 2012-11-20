/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, X:true */

(function () {
  "use strict";

  XT.dataSource = X.Database.create({

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
        conn = X.options.globalDatabase,
        query,
        complete = function (err, response) {
          var dataHash, params = {}, error;

          // Handle error
          if (err) {
            if (options && options.error) {
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // Handle success
          dataHash = JSON.parse(response.rows[0].fetch);
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

      payload.query = options.query;
      payload.username = conn.user;
      payload = JSON.stringify(payload);
      query = "select xt.fetch('%@')".f(payload);
      this.query(query, conn, complete);
      return true;
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
          dataHash = JSON.parse(response.rows[0].retrieve_record);

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

      payload.recordType = recordType;
      payload.id = id;
      payload.options = { context: options.context };
      payload.username = conn.user;
      payload = JSON.stringify(payload);
      query = "select xt.retrieve_record('%@')".f(payload);
      this.query(query, conn, complete);
      return true;
    },

    /*
    Commit a single record.

    @param {XM.Model} model
    @param {Object} options
    */
    commitRecord: function (model, options) {
      var that = this,
        payload = {},
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

          // Handle ok or complete hash response
          dataHash = JSON.parse(response.rows[0].commit_record);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload.recordType = model.recordType;
      payload.requery = options.requery;
      payload.dataHash = model.changeSet();
      payload.username = conn.user;
      payload = JSON.stringify(payload);
      query = "select xt.commit_record('%@')".f(payload);
      this.query(query, conn, complete);
      return true;
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
        conn = X.options.globalDatabase,
        query,
        payload = {
          className: name,
          functionName: func,
          parameters: params,
          username: conn.user
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
          dataHash = JSON.parse(response.rows[0].dispatch);
          if (options && options.success) {
            options.success.call(that, dataHash);
          }
        };

      payload = JSON.stringify(payload);
      query = "select xt.dispatch('%@')".f(payload);
      this.query(query, conn, complete);
      return true;
    }

  });

}());
