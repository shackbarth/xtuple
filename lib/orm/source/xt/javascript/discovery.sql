select xt.install_js('XT','Discovery','xtuple', $$

  /**
   * @class
   *
   * The XT.Discovery class includes all functions necessary to return an
   * API Discovery document: (https://developers.google.com/discovery/v1/using)
   */

  XT.Discovery = {};

  XT.Discovery.isDispatchable = true;

  /**
   * Return an API Discovery List for this database's ORM where isRest = true.
   *
   * @param {String} Optional. An orm_type name like "Contact". If null you get all of them.
   * @param {String} Optional. The rootUrl path of the API. e.g. "https://www.example.com/"
   * @returns {Object}
   */
  XT.Discovery.getList = function(orm, rootUrl) {
    var list = {},
        master = {},
        org = XT.currentDb(),
        orms = XT.Discovery.getIsRestORMs(orm),
        version = "v1alpha1";

    rootUrl = rootUrl || "{rootUrl}";

    if (!org) {
      return false;
    }

    if (!orms) {
      return false;
    }

    list.kind = "discovery#directoryList";
    list.discoveryVersion = version;
    list.items = [];

    /* Loop through exposed ORM models and build list items. */
    for (var i = 0; i < orms.length; i++) {
      var item = {},
          ormType = orms[i].orm_type,
          ormTypeHyphen = ormType.camelToHyphen();

      item.kind = "discovery#directoryItem";
      item.id = org + "." + ormTypeHyphen + ":" + version;
      item.name = org + "." + ormTypeHyphen;
      item.version = version;
      item.title = "xTuple ERP REST API for " + ormType + " business objects.";
      item.description = "Lets you get and manipulate xTuple ERP " + ormType + " business objects.";
      item.discoveryRestUrl = rootUrl + org + "/discovery/" + version + "/apis/" + ormTypeHyphen + "/" + version + "/rest";
      item.discoveryLink = "./apis/" + ormTypeHyphen + "/" + version + "/rest";
      item.icons = {
        "x16": rootUrl + org + "/assets/api/" + ormTypeHyphen + "-16.png",
        "x32": rootUrl + org + "/assets/api/" + ormTypeHyphen + "-32.png"
      };
      item.documentationLink = "https://dev.xtuple.com/api/" + ormTypeHyphen; /* TODO - What should this be? */
      item.preferred = true; /* TODO - Change this as we add new versions. */

      list.items[i] = item;
    }

    if (!orm) {
      /* Add master item that includes all ORM models in one Discovery Document. */
      master.kind = "discovery#directoryItem";
      master.id = org + ":" + version;
      master.name = org;
      master.version = version;
      master.title = "xTuple ERP REST API all business objects.";
      master.description = "Lets you get and manipulate all xTuple ERP business objects.";
      master.discoveryRestUrl = rootUrl + org + "/discovery/" + version + "/apis/" + version + "/rest";
      master.discoveryLink = "./apis/" + version + "/rest";
      master.icons = {
        "x16": rootUrl + org + "/assets/api/api-16.png",
        "x32": rootUrl + org + "/assets/api/api-32.png"
      };
      master.documentationLink = "https://dev.xtuple.com/api/"; /* TODO - What should this be? */
      master.preferred = true; /* TODO - Change this as we add new versions. */

      list.items.unshift(master);
    }

    return list;
  };

  /**
   * Return an API Discovery document for this database's ORM where isRest = true.
   *
   * @param {String} Optional. An orm_type name like "Contact".
   * @param {String} Optional. The rootUrl path of the API. e.g. "https://www.example.com/"
   * @returns {Object}
   */
  XT.Discovery.getDiscovery = function(orm, rootUrl) {
    var discovery = {},
        org = plv8.execute("select current_database()"),
        orms = XT.Discovery.getIsRestORMs(orm),
        version = "v1alpha1";

    rootUrl = rootUrl || "{rootUrl}";

    if (org.length !== 1) {
      return false;
    } else {
      org = org[0].current_database;
    }

    if (!orms) {
      return false;
    }

    /*
     * Header section.
     */
    discovery.kind = "discovery#restDescription";

    /* TODO - Implement etags. */
    discovery.etag = "";

    discovery.discoveryVersion = version; /* TODO - Move this to v1 for release. */
    discovery.id = org + (orm ? "." + orm.camelToHyphen() : "") + ":" + version;
    discovery.name = org + (orm ? "." + orm.camelToHyphen() : "");
    discovery.version = version;
    discovery.revision = XT.Discovery.getDate();
    discovery.title = "xTuple ERP REST API for " + (orm ? orm : "all") + " business objects.";
    discovery.description = "Lets you get and manipulate xTuple ERP " + (orm ? orm + " " : "") + "business objects.";
    discovery.icons = {
      "x16": rootUrl + org + "/assets/api/" + (orm ? orm.camelToHyphen() : "api") + "-16.png",
      "x32": rootUrl + org + "/assets/api/" + (orm ? orm.camelToHyphen() : "api") + "-32.png"
    };
    discovery.documentationLink = "https://dev.xtuple.com/" + (orm ? orm.camelToHyphen() : ""); /* TODO - What should this be? */
    discovery.protocol = "rest";
    discovery.baseUrl = rootUrl + org + "/api/" + version + "/";
    discovery.basePath = "/" + org + "/api/" + version + "/";
    discovery.rootUrl = rootUrl;
    discovery.servicePath = org + "/api/" + version + "/";
    discovery.batchPath = "batch"; /* TODO - Support batch requests? */

    /*
     * Parameters section.
     */
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

    /*
     * Auth section.
     */
    discovery.auth = XT.Discovery.getAuth(orm, rootUrl);


    /*
     * Schema section.
     */
    schemas = {};
    XT.Discovery.getORMSchemas(orms, schemas);

    if (!schemas) {
      return false;
    }

    var listItemOrms = [];

    /* Get parent ListItem ORMs */
    for (var i = 0; i < orms.length; i++) {
      listItemOrms[i] = {"orm_namespace": orms[i].orm_namespace, "orm_type": orms[i].orm_type + "ListItem"};
    }

    if (listItemOrms.length > 0) {
      XT.Discovery.getORMSchemas(listItemOrms, schemas);
    }

    /* Sanitize the JSON-Schema. */
    XT.Discovery.sanitize(schemas);

    /* Sort schema properties alphabetically. */
    discovery.schemas = XT.Discovery.sortObject(schemas);


    /*
     * Resources section.
     */
    discovery.resources = XT.Discovery.getResources(orm, rootUrl);

    /* Loop through resources and add JSON-Schema primKeyProp for methods that need it. */
    for (var i = 0; i < orms.length; i++) {
      var ormType = orms[i].orm_type,
          ormNamespace = orms[i].orm_namespace,
          thisOrm = XT.Orm.fetch(ormNamespace, ormType, {"superUser":true}),
          key = XT.Discovery.getKeyProps(discovery.schemas[ormType]);

      if (!key) {
        /* This should never happen. */
        plv8.elog(ERROR, "No key found for ormType: ", ormType);
      }


      if (thisOrm.privileges.all.delete) {
        discovery.resources[ormType].methods.delete.path = discovery.resources[ormType].methods.delete.path + key.name + "}";
        discovery.resources[ormType].methods.delete.parameters = {};
        discovery.resources[ormType].methods.delete.parameters[key.name] = key.props;
        discovery.resources[ormType].methods.delete.parameters[key.name].location = 'path';
        discovery.resources[ormType].methods.delete.parameterOrder = [key.name];
      }

      if (thisOrm.privileges.all.read) {
        discovery.resources[ormType].methods.get.path = discovery.resources[ormType].methods.get.path + key.name + "}";
        discovery.resources[ormType].methods.get.parameters = {};
        discovery.resources[ormType].methods.get.parameters[key.name] = key.props;
        discovery.resources[ormType].methods.get.parameters[key.name].location = 'path';
        discovery.resources[ormType].methods.get.parameterOrder = [key.name];
      }

      if (thisOrm.privileges.all.read) {
        discovery.resources[ormType].methods.head.path = discovery.resources[ormType].methods.head.path + key.name + "}";
        discovery.resources[ormType].methods.head.parameters = {};
        discovery.resources[ormType].methods.head.parameters[key.name] = key.props;
        discovery.resources[ormType].methods.head.parameters[key.name].location = 'path';
        discovery.resources[ormType].methods.head.parameterOrder = [key.name];
      }

      if (thisOrm.privileges.all.update) {
        discovery.resources[ormType].methods.patch.path = discovery.resources[ormType].methods.patch.path + key.name + "}";
        discovery.resources[ormType].methods.patch.parameters = {};
        discovery.resources[ormType].methods.patch.parameters[key.name] = key.props;
        discovery.resources[ormType].methods.patch.parameters[key.name].location = 'path';
        discovery.resources[ormType].methods.patch.parameterOrder = [key.name];
      }
    }


    /* return the results */
    return discovery;
  };


  /**
   * Return an API Discovery document's Auth section for this database's ORM where isRest = true.
   * This function allows you get the Auth section much faster than the full getDiscovery() above.
   *
   * @param {String} Optional. An orm_type name like "Contact".
   * @param {String} Optional. The rootUrl path of the API. e.g. "https://www.example.com/"
   * @returns {Object}
   */
  XT.Discovery.getAuth = function(orm, rootUrl) {
    var auth = {},
      org = plv8.execute("select current_database()"),
      orms = XT.Discovery.getIsRestORMs(orm);

    rootUrl = rootUrl || "{rootUrl}";


    if (org.length !== 1) {
      return false;
    } else {
      org = org[0].current_database;
    }

    if (!orms) {
      return false;
    }

    auth = {
      "oauth2": {
        "scopes": {}
      }
    };

    /* Set base full access scope. */
    auth.oauth2.scopes[rootUrl + org + "/auth"] = {
      "description": "Full access to all '" + org + "' resources"
    };

    /* Loop through exposed ORM models and build scopes. */
    for (var i = 0; i < orms.length; i++) {
      var ormType = orms[i].orm_type,
          ormNamespace = orms[i].orm_namespace,
          thisOrm = XT.Orm.fetch(ormNamespace, ormType, {"superUser":true}),
          ormTypeHyphen = ormType.camelToHyphen();

      /* TODO - Do we need to include "XM" in the name? */
      auth.oauth2.scopes[rootUrl + org + "/auth/" + ormTypeHyphen] = {
        "description": "Manage " + orms[i].orm_type + " resources"
      };

      /* Only include readonly if privileges are read only. */
      if (!thisOrm.privileges.all.create && !thisOrm.privileges.all.update && !thisOrm.privileges.all.delete) {
        auth.oauth2.scopes[rootUrl + org + "/auth/" + ormTypeHyphen + ".readonly"] = {
          "description": "View " + orms[i].orm_type + " resources"
        };
      }
    }

    return auth;
  };


  /**
   * Return an API Discovery document's Resources section for this database's ORM where isRest = true.
   * This function allows you get the Resources section much faster than the full getDiscovery() above.
   * To make it faster, the JSON-Schema is skipped, so method's parameter's primKeyProp will be blank.
   *
   * @param {String} Optional. An orm_type name like "Contact".
   * @param {String} Optional. The rootUrl path of the API. e.g. "https://www.example.com/"
   * @returns {Object}
   */
  XT.Discovery.getResources = function(orm, rootUrl) {
    var resources = {},
      org = XT.currentDb(),
      orms = XT.Discovery.getIsRestORMs(orm);

    rootUrl = rootUrl || "{rootUrl}";

    if (!org) {
      return false;
    }

    if (!orms) {
      return false;
    }

    /* Loop through exposed ORM models and build resources. */
    for (var i = 0; i < orms.length; i++) {
      var listModel,
          ormType = orms[i].orm_type,
          ormNamespace = orms[i].orm_namespace,
          thisOrm = XT.Orm.fetch(ormNamespace, ormType, {"superUser":true}),
          ormTypeHyphen = ormType.camelToHyphen(),
          sql = 'select orm_type from xt.orm where orm_type=$1 and orm_active;',
          ormListItem = plv8.execute(sql, [ormType + "ListItem"]);

      resources[ormType] = {};
      resources[ormType].methods = {};

      if (ormListItem.length > 0) {
        listModel = ormType + "ListItem";
      } else {
        listModel = ormType;
      }

      /*
       * delete
       */
      if (thisOrm.privileges.all.delete) {
        resources[ormType].methods.delete = {
          "id": ormType + ".delete",
          "path": ormTypeHyphen + "/{",
          "httpMethod": "DELETE",
          "description": "Deletes a single " + ormType + " record.",
        };

        resources[ormType].methods.delete.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen
        ];
      }

      /*
       * get
       */
      if (thisOrm.privileges.all.read) {
        resources[ormType].methods.get = {
          "id": ormType + ".get",
          "path": ormTypeHyphen + "/{",
          "httpMethod": "GET",
          "description": "Gets a single " + ormType + " record.",
        };

        resources[ormType].methods.get.response = {
          "$ref": ormType
        };

        resources[ormType].methods.get.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen,
          rootUrl + org + "/auth/" + ormTypeHyphen + ".readonly"
        ];
      }

      /*
       * head
       */
      if (thisOrm.privileges.all.read) {
        resources[ormType].methods.head = {
          "id": ormType + ".head",
          "path": ormTypeHyphen + "/{",
          "httpMethod": "HEAD",
          "description": "Returns the HTTP Header as if you made a GET request for a single " + ormType + " record, but will not return any response body.",
        };

        resources[ormType].methods.head.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen,
          rootUrl + org + "/auth/" + ormTypeHyphen + ".readonly"
        ];
      }

      /*
       * insert
       */
      if (thisOrm.privileges.all.create) {
        resources[ormType].methods.insert = {
          "id": ormType + ".insert",
          "path": ormTypeHyphen,
          "httpMethod": "POST",
          "description": "Add a single " + ormType + " record.",
        };

        resources[ormType].methods.insert.request = {
          "$ref": ormType
        };

        resources[ormType].methods.insert.response = {
          "$ref": ormType
        };

        resources[ormType].methods.insert.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen
        ];
      }

      /*
       * list
       */
      if (thisOrm.privileges.all.read) {
        resources[ormType].methods.list = {
          "id": ormType + ".list",
          "path": ormTypeHyphen,
          "httpMethod": "GET",
          "description": "Returns a list of " + ormType + " records.",
        };

        resources[ormType].methods.list.parameters = {
          "maxResults": {
            "type": "integer",
            "description": "Maximum number of entries returned on one result page. Optional.",
            "format": "int32",
            "minimum": "1",
            "location": "query"
          },
          "q": {
            "type": "string",
            "description": "Free text search terms to find events that match these terms in any field. Optional.",
            "location": "query"
          },
          "pageToken": {
            "type": "string",
            "description": "Token specifying which result page to return. Optional.",
            "location": "query"
          }
        };

        resources[ormType].methods.list.response = {
          "$ref": listModel
        };

        resources[ormType].methods.list.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen,
          rootUrl + org + "/auth/" + ormTypeHyphen + ".readonly"
        ];
      }

      /*
       * listhead
       */
      if (thisOrm.privileges.all.read) {
        resources[ormType].methods.listhead = {
          "id": ormType + ".listhead",
          "path": ormTypeHyphen,
          "httpMethod": "HEAD",
          "description": "Returns the HTTP Header as if you made a GET request for a list of " + ormType + " records, but will not return any response body.",
        };

        resources[ormType].methods.listhead.parameters = {
          "maxResults": {
            "type": "integer",
            "description": "Maximum number of entries returned on one result page. Optional.",
            "format": "int32",
            "minimum": "1",
            "location": "query"
          },
          "q": {
            "type": "string",
            "description": "Free text search terms to find events that match these terms in any field. Optional.",
            "location": "query"
          },
          "pageToken": {
            "type": "string",
            "description": "Token specifying which result page to return. Optional.",
            "location": "query"
          }
        };

        resources[ormType].methods.listhead.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen,
          rootUrl + org + "/auth/" + ormTypeHyphen + ".readonly"
        ];
      }

      /*
       * patch
       */
      if (thisOrm.privileges.all.update) {
        resources[ormType].methods.patch = {
          "id": ormType + ".patch",
          "path": ormTypeHyphen + "/{",
          "httpMethod": "PATCH",
          "description": "Modifies a single " + ormType + " record. This method supports JSON-Patch semantics.",
        };

        resources[ormType].methods.patch.request = {
          "$ref": ormType
        };

        resources[ormType].methods.patch.response = {
          "$ref": ormType
        };

        resources[ormType].methods.patch.scopes = [
          rootUrl + org + "/auth",
          rootUrl + org + "/auth/" + ormTypeHyphen
        ];
      }
    }

    return resources;
  };


  /*
   * Helper function to convert date to string in yyyyMMdd format.
   *
   * @returns {String}
   */
  XT.Discovery.getDate = function() {
    var today = new Date(),
        year = today.getUTCFullYear(),
        month = today.getUTCMonth() + 1,
        day = today.getUTCDate();

    /* Convert to string and preserve leading zero. */
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
  };


  /*
   * Helper function to sanitize the schemas relations.
   * Right now, this just removes the "inverse" property from a child schema.
   * TODO: Consider using this to remove primary keys instead of the other
   * logic above. May also need to remove unprivileged properties.
   * @See: XT.Data.sanitize() function that is similar.
   *
   * @param {Object} Object of JSON-Schemas.
   */
  XT.Discovery.sanitize = function(schema) {
    var inverse,
        parentOrm,
        parentOrmProp,
        propName,
        propery,
        resource;

    for (resource in schema) {
      /* Find the inverse value from the original ORM. */
      /* TODO: Assuming "XM" here... */
      parentOrm = XT.Orm.fetch("XM", resource, {"silentError": true});

      for (propName in schema[resource].properties) {
        propery = schema[resource].properties[propName];

        if (propery.items && propery.items.$ref) {
          parentOrmProp = XT.Orm.getProperty(parentOrm, propName);
          if (parentOrmProp.toMany && parentOrmProp.toMany.type && parentOrmProp.toMany.inverse) {
            inverse = parentOrmProp.toMany.inverse;

            /* Delete the inverse property from the Child JSON-Schema. */
            if (schema[parentOrmProp.toMany.type] && schema[parentOrmProp.toMany.type].properties[inverse]) {
              delete schema[parentOrmProp.toMany.type].properties[inverse];
            }
          }
        }
      }
    }
  };


  /*
   * Helper function to sort the schemas properties alphabetically.
   * Note: ECMA-262 does not specify enumeration order. This is just for
   * human readability in outputted JSON.
   *
   * @param {Object} Object of JSON-Schemas.
   * @returns {Object}
   */
  XT.Discovery.sortObject = function(obj) {
    var arr = [],
        key,
        sorted = {};

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }

    arr.sort();

    for (key = 0; key < arr.length; key++) {
      sorted[arr[key]] = obj[arr[key]];
    }

    return sorted;
  };

  /*
   * Helper function to get a single or all isRest ORM Models.
   *
   * @param {String} Optional. An orm_type name like "Contact".
   * @returns {Object}
   */
  XT.Discovery.getIsRestORMs = function(orm) {
    /* TODO - Do we need to include "XM" in the propName? */
    var sql = "select orm_namespace, orm_type from xt.orm where orm_rest " +
              "group by orm_namespace, orm_type order by orm_namespace, orm_type",
        orms = [],
        relations = [],
        singleOrms = [],
        thisOrm;

    orms = plv8.execute(sql);

    /* If this is a single ORM request, find all the related ORMs that are
     * exposed to REST and return only the single and related ORMs.
     */
    if (orm) {
      /* Fetch the single ORM. Only need this loop to get the namespace. */
      for (var i = 0; i < orms.length; i++) {
        if (orm === orms[i].orm_type) {
          thisOrm = XT.Orm.fetch(orms[i].orm_namespace, orm, {"superUser":true});
        }
      }

      /* Find the related ORMs. */
      for (var prop in thisOrm.properties) {
        var relation;

        if (thisOrm.properties[prop].toOne || thisOrm.properties[prop].toMany) {
          relation = thisOrm.properties[prop].toOne || thisOrm.properties[prop].toMany;
          if (relation.type) {
            relations.push(relation.type);
          }
        }
      }

      /* Return only ORM that are the single requested or a REST exposed relation. */
      for (var i = 0; i < orms.length; i++) {
        if (orms[i].orm_type === orm || relations.indexOf(orms[i].orm_type) !== -1) {
          singleOrms.push(orms[i]);
        }
      }

      /* The limited set of ORMs. */
      orms = singleOrms;
    }

    if (!orms.length) {
      return false;
    }

    return orms;
  };

  /*
   * Helper function to get a JSON-Schema for ORM Models.
   *
   * @param {Array} An array of orm objects name like [{"orm_namespace": "XM", "orm_type":"Contact"}].
   * @param {Object} Optional. A schema object to add schemas too.
   * @returns {Object}
   */
  XT.Discovery.getORMSchemas = function(orms, schemas) {
    schemas = schemas || {};

    if (!orms.length) {
      return false;
    }

    /* Loop through the returned ORMs and get their JSON-Schema. */
    for (var i = 0; i < orms.length; i++) {
      /* TODO - Do we need to include "XM" in the propName? */
      var propName = orms[i].orm_type,
          propSchema;

      /* Only get this parent schema if we don't already have it. */
      if (!schemas[propName]) {
        /* Get parent ORM */
        propSchema = XT.Schema.getProperties({"nameSpace": orms[i].orm_namespace, "type": orms[i].orm_type});

        if (propSchema) {
          schemas[propName] = propSchema;
        }
      }

      if (schemas[propName] && schemas[propName].properties) {
        /* Drill down through schemas and get all $ref schemas. */
        for (var prop in schemas[propName].properties) {
          var childProp = schemas[propName].properties[prop],
              childOrm;

          if (childProp) {
            if (childProp.items && childProp.items["$ref"]){
              childOrm = childProp.items["$ref"];
            } else if (childProp["$ref"]){
              childOrm = childProp["$ref"];
            }

            /* Only get this child schema if we don't already have it. */
            if (childOrm && !schemas[childOrm]) {
              /* Recusing into children. */
              schemas = XT.extend(schemas, XT.Discovery.getORMSchemas([{ "orm_namespace": "XM", "orm_type": childOrm }]));
            }
          }
        }
      }
    }

    return schemas;
  };


  /*
   * Helper function to find the primary key for a JSON-Schema and return it's properties.
   *
   * @param {Object} A JSON-Schema object.
   * @returns {Object}
   */
  XT.Discovery.getKeyProps = function(schema) {
    for (var prop in schema.properties) {
      if (schema.properties[prop].isKey) {
        var keyProp = {};

        /* Use extend so we can delete without affecting schema.properties[prop]. */
        keyProp = XT.extend(keyProp, schema.properties[prop]);

        /* Delete these properties which are not needed for a resource's parameters. */
        delete keyProp.isKey;
        delete keyProp.title;
        delete keyProp.required;

        return {"name": prop, "props": keyProp};
      }
    }

    return false;
  };

$$ );
