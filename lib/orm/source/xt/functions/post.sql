/**
    Procedure for creating a new record or dispatching a JavaScript function in the database.

    @param {Text} Data hash that can parsed into a JavaScript object or array.
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
    select xt.js_init(true);
    select xt.post('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10009",
      "data" : {
        "number": "10009",
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
      "id": "10009",
      "data" : {
        "number": "10009",
        "firstName": "Bob",
        "lastName": "Marley"
      },
      "prettyPrint": true
    }');

    select xt.post('[
      {
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10009",
      "method": "post",
      "data" : {
        "number": "10009",
        "firstName": "Bob",
        "lastName": "Marley"
      },
      "prettyPrint": true
      },
      {
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10010",
      "method": "post",
      "data" : {
        "number": "10010",
        "firstName": "Ziggy",
        "lastName": "Marley"
      },
      "prettyPrint": true
      }
    ]');

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

return (function () {

  var dataHash = JSON.parse(data_hash),
    isNotDispatch = (typeof dataHash.data == "object"),
    prettyPrint,
    ret = [];

  try {
    /* If the request is an array of objects loop through them */
    if (dataHash.length) {
      dataHash.forEach(function (obj) {
        switch (obj.method)
        {
        case "post":
          ret.push(XT.Rest.post(obj));
          break;
        case "patch":
          ret.push(XT.Rest.patch(obj));
          break;
        case "delete":
          XT.Rest.delete(obj);
          break;
        default:
          plv8.elog(ERROR, "Unknown or unsupported method");
        }
      });

      return JSON.stringify(ret, null, dataHash[0].prettyPrint);
    }

    /* If just one object, deal with it normally */
    ret = XT.Rest.post(dataHash);

    /* Dispatches handle stringify internally.
       We'll stringify any commit results here */
    if (isNotDispatch) {
      ret = JSON.stringify(ret, null, dataHash.prettyPrint);
    }

    return ret;

  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;
