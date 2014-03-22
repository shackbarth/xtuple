/**
    Procedure for retrieving data from the server;

    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.id] Record id for retrieving a single record.
    @param {Object} [dataHash.query] Object query definition for retrieving an array of records.
    @param {String} [dataHash.encryptionKey] Encryption key.

    Sample usage:
    select xt.js_init();
    select xt.get('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "99999",
      "prettyPrint": true
      }'
    );

    select xt.get('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Customer",
      "id": "TTOYS",
      "prettyPrint": true
      }'
    );

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ContactListItem",
      "query":{
        "parameters":[
          {
            "attribute":"firstName",
            "value": "Mike"
          },
          {
            "attribute": "lastName",
            "value": "Farley"
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ContactListItem",
      "query":{
        "parameters":[
          {
            "attribute": "name",
            "operator": "MATCHES",
            "value": "Frank"
          }
        ],
        "orderBy": [
          {
            "attribute": "lastName"
          },
          {
            "attribute": "firstName"
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"AccountListItem",
      "query":{
        "parameters":[
          {
            "attribute":"primaryContact.address.state",
            "value": "VA"
          }
        ],
        "orderBy": [
          {
            "attribute": "primaryContact.name",
            "descending": true
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ItemListItem",
      "query":{
        "parameters":[
          {
            "attribute": "number",
            "operator": "BEGINS_WITH",
            "value": "B"
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ToDoListItem",
      "query":{
        "parameters":[
          {
            "attribute":"dueDate",
            "operator": ">=",
            "value": "2009-07-17T12:13:01.506Z"
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ContactListItem",
      "query":{
        "parameters":[
          {
            "attribute": [
              "account.number",
              "account.name",
              "name",
              "phone",
              "address.city"
             ],
            "operator": "MATCHES",
            "value": "ttoys"
          },
          {
            "attribute": "firstName",
            "operator": "BEGINS_WITH",
            "value": "M"
          }
        ]
      },
      "prettyPrint": true
    }$$);

    select xt.get($${
      "username": "admin",
      "nameSpace":"XM",
      "type":"ContactListItem",
      "query":{
        "rowLimit": 10
      },
      "prettyPrint": true
    }$$);

    select xt.get('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "CustomerRelation",
      "query":{
        "parameters":[
          {
            "attribute":"number",
            "operator": "NOT ANY",
            "value": [
              "TTOYS",
              "VCOL"
             ]
          }
        ]
      },
      "prettyPrint": true
      }'
    );

    select xt.get('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Customer",
      "query":{
        "parameters":[
          {
            "isCharacteristic": true,
            "attribute": "CUST-VOLUME",
            "operator": "=",
            "value": "> 50,000"
          }
        ]
      },
      "prettyPrint": true
      }'
    );

*/
create or replace function xt.get(data_hash text) returns text as $$

return (function () {

  try {
    var handled = null;
    var dataHash = JSON.parse(data_hash),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      ret;
    
    ret = XT.Rest.get(dataHash);

    return JSON.stringify(ret, null, prettyPrint);
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;
