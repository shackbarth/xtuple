/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, X:true, _:true */

var routes = require('./routes'),
  _ = require('underscore'),
  str = require('underscore.string'),
  querylib = require('../lib/query'),
  RestQuery = querylib.RestQuery,
  XtGetQuery = querylib.XtGetQuery;

_.mixin(str.exports());

/**
 * @class RestRouter
 */
module.exports = (function () {
  'use strict';

  var handlers = {
      /**
       * @private
       * Requests a representation of the specified resource.
       */
      GET: function (req, res, session, options) {
        var schema,
          searchableAttributes,
          ormType = options.ormType,
          id = options.id,
          resources = options.resources,
          callback = options.callback,
          rq,
          target,
          payload = {
            nameSpace: 'XM',
            type: ormType
          };


        if (req.params.id) { // This is a single resource request.
          payload.type = ormType;
          payload.id = id + "";

          routes.queryDatabase("get", payload, session, callback);

        } else { // This is a list request.

          payload.query = new RestQuery(req.query).toTarget(XtGetQuery).query;
          console.log(payload.query);

          return routes.queryDatabase("get", payload, session, callback);

          /*
          payload.query = {};
          payload.query.rowLimit = (+req.query.maxResults) || 100;
          // assumption: pageToken is 0-indexed
          payload.query.rowOffset = (+req.query.pageToken) ?
            (+req.query.pageToken) * ((+req.query.maxResults) || 100) :
            0;
          */


          // q represents a full-text search on any text attributes of the ormType
          /*
          payload.query.parameters = [];
          schema = XT.session.schemas.XM.attributes[payload.type.camelize().capitalize()];
          if (req.query.q) {
            searchableAttributes = _.compact(_.map(schema.columns, function (column) {
              return column.category === 'S' ? column.name : null;
            }));
            if (searchableAttributes.length > 0) {
              payload.query.parameters.push({
                attribute: searchableAttributes,
                operator: "MATCHES",
                value: req.query.q
              });
            }
          }
          */

          // We also support field-level filtering, with the MATCHES, >=, or <=
          // operations. These latter two can be requested by appending Min or Max
          // to the end of the attribute name, as advertised in the discovery doc.
          _.each(schema.columns, function (column) {
            var attr = column.name,
              category = column.category,
              operator;

            if (['B', 'D', 'N', 'S'].indexOf(category) < 0) {
              return;
            }
            if (req.query[attr]) {
              if (category === 'S') {
                operator = "MATCHES";
              } else if (category === 'B' || category === 'N') {
                operator = "=";
              }
              payload.query.parameters.push({
                attribute: attr,
                operator: operator,
                value: req.query[attr]
              });
            }

            if (req.query[attr + "Min"]) {
              payload.query.parameters.push({
                attribute: attr,
                operator: ">=",
                value: req.query[attr + "Min"]
              });
            }
            if (req.query[attr + "Max"]) {
              payload.query.parameters.push({
                attribute: attr,
                operator: "<=",
                value: req.query[attr + "Max"]
              });
            }
          });

          routes.queryDatabase("get", payload, session, callback);
        }
      },

      /**
       * @private
       * Requests that the server accept the entity enclosed in the request as a
       * new subordinate of the web resource identified by the URI.
       * POST method can also call dispatch functions for "Service" endpoints.
       */
      POST: function (req, res, session, options) {
        var serviceModel = options.serviceModel,
          services = options.services,
          id = _.camelize(options.id),
          ormType = options.ormType,
          callback = options.callback,
          payload = {
            nameSpace: "XM",
            type: ormType,
            dispatch: serviceModel && {
              functionName: id,
              parameters: req.body.attributes
            },
            data: !serviceModel && req.body
          };

        if (!req.body) {
          return res.send(400, "Bad Request");
        }

        routes.queryDatabase("post", payload, session, callback);
      },

      /**
       * @private
       * TODO implement
       */
      PUT: null,

      /**
       * Deletes the specified resource.
       * @private
       */
      DELETE: function (req, res, session, options) {
        var id = options.id,
          ormType = options.ormType,
          callback = options.callback,
          payload = { };
        if (!id) {
          return res.send(404, "Not Found");
        }

        payload.nameSpace = "XM";
        payload.type = ormType;
        payload.id = id + "";

        routes.queryDatabase("delete", payload, session, callback);
      },
      
      /**
       * Apply partial modifications to a resource.
       * @private
       */
      PATCH: function (req, res, session, options) {
        var id = options.id,
          ormType = options.ormType,
          callback = options.callback,
          payload = { };

        if (!id || !req.body || !req.body.etag || !req.body.patches) {
          return res.send(404, "Not Found");
        }

        payload.nameSpace = "XM";
        payload.type = ormType;
        payload.id = id + "";
        payload.etag = req.body.etag;
        payload.patches = req.body.patches;

        routes.queryDatabase("patch", payload, session, callback);
      },

      /**
       * Returns the HTTP methods that the server supports for specified URL.
       * This can be used to check the functionality of a web server by requesting '*' instead
       * of a specific resource.
       * TODO - call options method.
       * @private
       */
      OPTIONS: function (req, res, session, options) {
        var ormType = options.ormType;
        return res.send('REST API OPTIONS call to ormType: ' + ormType);
      },

      /**
       * Asks for the response identical to the one that would correspond to a GET request,
       * but without the response body. This is useful for retrieving meta-information written
       * in response headers, without having to transport the entire content.
       * TODO - call head method.
       * @private
       */
      HEAD: function (req, res, session, options) {
        return res.send();
      }
    },

    /**
     * @private
     */
    _getResources = function (req, res, next, orms) {
      var callback = {},
          payload = {},
          rootUrl = req.protocol + "://" + req.host + "/",
          session = {};

      callback = function (result) {
        if (result.isError) {
          return next(new Error("Invalid Request."));
        }

        _getServices(req, res, next, orms, result.data);
      };

      payload.nameSpace = "XT";
      payload.type = "Discovery";
      payload.dispatch = {
        functionName: "getResources",
        parameters: [null, rootUrl]
      };

      // Dummy up session.
      session.passport = {
        "user": {
          "id": "admin",
          "username": "admin",
          "organization": "masterref"
        }
      };
      routes.queryDatabase("post", payload, session, callback);
    },

    /**
     * @private
     */
    _getServices = function (req, res, next, orms, resources) {
      var callback = {},
          payload = {},
          rootUrl = req.protocol + "://" + req.host + "/",
          session = {};

      callback = function (result) {
        if (result.isError) {
          return next(new Error("Invalid Request."));
        }

        routeCall(req, res, next, orms, resources, result.data);
      };

      payload.nameSpace = "XT";
      payload.type = "Discovery";
      payload.dispatch = {
        functionName: "getServices",
        parameters: [null, rootUrl, true]
      };

      // Dummy up session.
      session.passport = {
        "user": {
          "id": "admin",
          "username": "admin",
          "organization": "masterref"
        }
      };

      routes.queryDatabase("post", payload, session, callback);
    },

    /**
     * @private
     */
    routeCall = function (req, res, next, orms, resources, services) {
      var ormType = _.capitalize(_.camelize(req.params.model)),
        resourceModel,
        serviceModel,
        session = {
          passport: {
            "user": {
              "id": "admin",
              "username": "admin",
              "organization": "masterref"
            }
          }
        },
        callback = function (resp) {
          if (resp.isError) {
            // Google style error object.
            return res.json(resp.status.code, {
              error: {
                code: resp.status.code,
                message: resp.status.message,
                errors: [
                  { message: resp.status.message }
                ]
              }
            });
          } else {
            return res.json(resp.status.code, resp);
          }
        };

      if (!req.params.model) {
        return res.send(404, "Not Found");
      }

      resourceModel = _.findWhere(orms, { orm_type: ormType });
      serviceModel  = _.contains(_.keys(services), ormType);

      if (resourceModel && serviceModel) {
        X.err("REST API Error! ");
        X.err("Found both a matching ORM type and a Service for '" + ormType +
          "'. REST Router does not know what to do with this request.");
        X.err("On path: ", req.path);
        X.err("Please fix this!!!");

        return res.send(501, "Not Implemented");
      }

      if (!(resourceModel || serviceModel)) {
        return res.send(404, "Not Found");
      }

      // handle request
      var handler = handlers[req.method];
      if (!_.isFunction(handler)) {
        return res.send(405, "Method Not Allowed");
      }
      else {
        handler(req, res, session, {
          ormType: ormType,
          id: req.params.id,
          resources: resources,
          serviceModel: serviceModel,
          services: services,
          callback: callback
        });
      }
    };

  /**
   * @public
   */
  function getIsRestORMs(req, res, next) {
    var callback = {},
        payload = {},
        session = {};

    callback = function (result) {
      if (result.isError) {
        return next(new Error("Invalid Request."));
      }

      _getResources(req, res, next, result.data);
    };

    payload.nameSpace = "XT";
    payload.type = "Discovery";
    payload.dispatch = {
      functionName: "getIsRestORMs"
    };

    // Dummy up session.
    session.passport = {
      "user": {
        "id": "admin",
        "username": "admin",
        "organization": "masterref"
      }
    };
    routes.queryDatabase("post", payload, session, callback);
  }

  return {
    router: [getIsRestORMs]
  };
})();
