/**
    Procedure for creating a new record or dispatching a JavaScript function in the database.

    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {String} [dataHash.id] Id. If not provided and data is being posted, one will be created automatically.
    @param {Object} [dataHash.data] Data payload representing record(s) to create.
    @param {String} [dataHash.encryptionKey] Encryption key.
    @param {Object} [dataHash.dispatch] Object description for dispatching a function call.
    @param {String} [dataHash.dispatch.functionName] Object description for dispatching a function call.
    @param {Any} [dataHash.dispatch.parameters] One or many parameters to pass to the function call.

    Sample usage:
    select xt.js_init();
    select xt.post('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "99999",
      "data" : {
        "number": "99999",
        "firstName": "Bob",
        "lastName": "Marley",
        "email":[
          {
            "uuid": "f4477339-1fa9-498e-b597-6c939c1898ab",
            "email": "frankf@ttoys.com"
          }
        ],
        "comments": [
          {
            "uuid": "f4477779-1fa9-498e-b597-6c939c1898ab",
            "commentType": "General",
            "text": "This is a test.",
            "isPublic": false,
            "created": "2013-04-26T12:57:41.939Z",
            "createdBy": "admin"
          },
          {
            "uuid": "cb5a834a-b816-480c-ab17-0637a999b517",
            "commentType": "ChangeLog",
            "text": "This is another test.",
            "isPublic": false,
            "created": "2013-04-26T12:57:57.896Z",
            "createdBy": "admin"
          }
        ]
      },
      "prettyPrint": true
    }');

    select xt.post('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": 10,
      "data" : {
        "number": "10009",
        "firstName": "Bob",
        "lastName": "Marley"
      },
      "prettyPrint": true
    }');

    select xt.post($${
      "username": "admin",
      "nameSpace": "XM",
      "type": "Address",
      "dispatch": {
        "functionName":"findExisting",
        "parameters": {
          "type": "Address",
          "line1":"Tremendous Toys Inc.",
          "line2":"101 Toys Place",
          "line3":"",
          "city":
          "Walnut Hills",
          "state":"VA",
          "postalcode":"22209",
          "country":"United States"
         }
       }
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace": "XM",
      "type": "Address",
      "dispatch":{
        "functionName":"useCount",
        "parameters": 41
      }
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace": "XM",
      "type": "Model",
      "dispatch":{
        "functionName":"fetchId",
        "parameters":"XM.Address"
      }
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace": "XM",
      "type": "Model",
      "dispatch":{
        "functionName":"fetchNumber",
        "parameters":"XM.Incident"
      }
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace":"XT",
      "type":"Session",
      "dispatch":{
        "functionName":"locale"
      },
      "prettyPrint":true
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace":"XT",
      "type":"Session",
      "dispatch":{
        "functionName":"settings"
      }
    }$$);

    select xt.post($${
      "nameSpace":"XT",
      "type":"Session",
      "dispatch":{
        "functionName":"privileges"
      }
    }$$);

    select xt.post($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"Crm",
      "dispatch":{
        "functionName":"commitSettings",
        "parameters":{
          "NextCRMAccountNumber": 1,
          "NextIncidentNumber": 1600,
          "CRMAccountNumberGeneration": "A",
          "UseProjects": true,
          "AutoCreateProjectsForOrders": true,
          "OpportunityChangeLog": false,
          "DefaultAddressCountry": "Mexico",
          "StrictAddressCountry": true,
          "IncidentsPublicPrivate": true,
          "IncidentPublicDefault": true,
          "IncidentNewColor": "red",
          "IncidentFeedbackColor": "purple",
          "IncidentConfirmedColor": "yellow",
          "IncidentAssignedColor": "blue",
          "IncidentResolvedColor": "green",
          "IncidentClosedColor": "grey"
        }
      }
    }$$);
*/
create or replace function xt.post(data_hash text) returns text as $$
  try {
    var dataHash = JSON.parse(data_hash),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      dispatch = dataHash.dispatch,
      data,
      orm,
      pkey,
      prv,
      sql,
      observer,
      ret,
      obj,
      f,
      params,
      args,
      method;

    dataHash.superUser = false;
    if (dataHash.username) { XT.username = dataHash.username; }

    /* if there's data then commit it */
    if (dataHash.data) {
      data = Object.create(XT.Data)
      orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type);
      pkey = XT.Orm.primaryKey(orm);
      nkey = XT.Orm.naturalKey(orm);
      prv = JSON.parse(JSON.stringify(dataHash.data));

      /* set status */
      XT.jsonpatch.updateState(dataHash.data, "create");

      /* set id if not provided */
      if (!dataHash.id) {
        if (nkey) {
          if (dataHash.data[nkey] || nkey === 'uuid') {
            dataHash.id = dataHash.data[nkey] || XT.generateUUID();
          } else {
            plv8.elog(ERROR, "A unique id must be provided");
          }
        } else {
          dataHash.id = dataHash.data[pkey] || plv8.execute(sql)[0].nextval;
        }
      }

      /* commit the record */
      data.commitRecord(dataHash);

      /* calculate a patch of the modifed version */
      observer = XT.jsonpatch.observe(prv);
      ret = data.retrieveRecord(dataHash);
      observer.object = ret.data;
      delete ret.data;
      ret.patches = XT.jsonpatch.generate(observer);
      ret = JSON.stringify(ret, null, prettyPrint);

    /* if it's a function dispatch call then execute it */
    } else if (dispatch) {
      obj = plv8[dataHash.nameSpace][dataHash.type];
      f = dispatch.functionName;
      params = dispatch.parameters;
      args = params instanceof Array ? params : [params];

      if (obj[f]) {
        method = obj[f].curry(args);
      } else {
        XT.username = undefined;
        throw new Error('Function ' + dataHash.nameSpace +
           '.' + dataHash.type + '.' + f + ' not found.');
      }

      ret = obj.isDispatchable ? method() : false;
      ret = dispatch.isJSON ? JSON.stringify(ret, null, prettyPrint) : ret;
    }

    /* Unset XT.username so it isn't cached for future queries. */
    XT.username = undefined;

    XT.message(201, "Created");
    return ret;
  } catch (err) {
    XT.error(err);
  }

$$ language plv8;
