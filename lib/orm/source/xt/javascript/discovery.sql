select xt.install_js('XT','Discovery','xtuple', $$

  /**
    @class

    The XT.Discovery class includes all functions necessary to return an
    API Discovery document: (https://developers.google.com/discovery/v1/using)
  */

  XT.Discovery = {};

  XT.Discovery.isDispatchable = true;

  /**
    Return a API Discovery document for this database's ORM where isRest = true.

    @returns {Object}
  */
  XT.Discovery.getDiscovery = function() {
    var discovery = {},
        org = plv8.execute("select current_database()"),
        orms = XT.Discovery.getIsRestORMs();
        version = "v1alpha1";

    if (org.length !== 1) {
      return false;
    } else {
      org = org[0].current_database;
    }

    if (!orms) {
      return false;
    }

    /* Header section. */
    discovery.kind = "discovery#restDescription";

    /* TODO - Implement etags. */
    discovery.etag = "";

    discovery.discoveryVersion = version; /* TODO - Move this to v1 for release. */
    discovery.id = org + ":" + version;
    discovery.name = org;
    discovery.version = version;
    discovery.revision = XT.Discovery.getDate();
    discovery.title = "xTuple ERP REST API",
    discovery.description = "Lets you get and manipulate xTuple ERP business objects.",
    discovery.icons = { /* TODO - Get org's icons or set a token to be replaced when this discovery document is sent. */
      "x16": "{iconx16}",
      "x32": "{iconx32}"
    };
    discovery.documentationLink = "https://dev.xtuple.com"; /* TODO - What should this be? */
    discovery.protocol = "rest",
    discovery.baseUrl = "{rootUrl}" + org + "/" + version + "/";
    discovery.basePath = "/" + org + "/" + version + "/";
    discovery.rootUrl = "{rootUrl}";
    discovery.servicePath = org + "/" + version + "/";
    discovery.batchPath = "batch"; /* TODO - Support batch requests? */

    /* Parameters section. */
    discovery.parameters = {
      "alt": {
        "type": "string",
        "description": "Data format for the response.",
        "default": "json",
        "enum": [
          "json"
        ],
        "enumDescriptions": [
          "Responses with Content-Type of application/json"
        ],
        "location": "query"
      },
      "fields": {
        "type": "string",
        "description": "Selector specifying which fields to include in a partial response.",
        "location": "query"
      },
      "oauth_token": {
        "type": "string",
        "description": "OAuth 2.0 token for the current user.",
        "location": "query"
      },
      "prettyPrint": {
        "type": "boolean",
        "description": "Returns response with indentations and line breaks.",
        "default": "true",
        "location": "query"
      },
    };

    /* Auth section. */
    discovery.auth = {
      "oauth2": {
        "scopes": {}
      }
    };

    /* Set base full access scope. */
    discovery.auth.oauth2.scopes["{rootUrl}" + "auth/" + org] = {
      "description": "Full access to all '" + org + "' resources"
    }

    /* Loop through exposed ORM models and build scopes. */
    for (var i = 0; i < orms.length; i++) {
      var ormType = orms[i].orm_type;

      /* TODO - Do we need to include "XM" in the name? */
      discovery.auth.oauth2.scopes["{rootUrl}" + "auth/" + org + "/" + ormType.camelToHyphen()] = {
        "description": "Manage  " + orms[i].orm_type + " resources"
      }
      discovery.auth.oauth2.scopes["{rootUrl}" + "auth/" + org + "/" + ormType.camelToHyphen() + ".readonly"] = {
        "description": "View " + orms[i].orm_type + " resources"
      }
    }

    /* Schema section. */
    discovery.schemas = XT.Discovery.getORMSchemas(orms);

    if (!discovery.schemas) {
      return false;
    }


    /* Resources section. */




    /* return the results */
    return discovery;
  }


  /*
   * Helper function to convert date to string in yyyyMMdd format.
   */
  XT.Discovery.getDate = function() {
    var today = new Date(),
        year = today.getUTCFullYear(),
        month = today.getUTCMonth() + 1,
        day = today.getUTCDate();

    /* Convert to string and preserve leaving zero. */
    if (day < 10) {
      day = "0" + day;
    } else {
      day = "" + day;
    }

    if (month < 10) {
      month = "0" + month;
    } else {
      month = "" + month;
    }

    year = "" + year;

    return year + month + day;
  }

  /*
   * Helper function to get all isRest ORM Models.
   */
  XT.Discovery.getIsRestORMs = function() {

    /* TODO - Do we need to include "XM" in the propName? */
    var sql = "select orm_namespace, orm_type from xt.orm where orm_rest group by orm_namespace, orm_type order by orm_namespace, orm_type",
        orms = plv8.execute(sql);

    if (!orms.length) {
      return false;
    }

    return orms;
  }

  /*
   * Helper function to get a JSON-Schema for all ORM Models.
   */
  XT.Discovery.getORMSchemas = function(orms) {
    var schema = {};

    if (!orms.length) {
      return false;
    }

    /* Loop through the returned ORMs and get their JSON-Schema. */
    for (var i = 0; i < orms.length; i++) {
      /* TODO - Do we need to include "XM" in the propName? */
      var propName = orms[i].orm_type;

      /* Get parent ORM */
      schema[propName] = XT.Schema.getProperties({"nameSpace": orms[i].orm_namespace, "type": orms[i].orm_type});

      if (!schema[propName] || !schema[propName].properties) {
        return false;
      }

      /* Drill down through schema and get all $ref schemas. */
      for (var prop in schema[propName].properties) {
        var childProp = schema[propName].properties[prop];

        if (childProp) {
          if (childProp.items && childProp.items["$ref"]){
            var childOrm = childProp.items["$ref"];
          } else if (childProp["$ref"]){
            var childOrm = childProp["$ref"];
          }

          /* Only get this child schema if we don't already have it. */
          if (childOrm && !schema[childOrm]) {
            /* Recusing into children. */
            schema = XT.extend(schema, XT.Discovery.getORMSchemas([{ "orm_namespace": "XM", "orm_type": childOrm }]));
          }
        }
      }
    }

    return schema;
  }

  $$ );
