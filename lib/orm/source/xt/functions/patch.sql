/**
    Procedure for applying patches to the database per http://tools.ietf.org/html/rfc6902

    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.patches] Array of patches to be processed. Required
    @param {Number} [dataHash.etag] Record version for optimistic locking. Required.
    @param {Object} [dataHash.lock] Lock information for pessemistic locking.
    @param {Number} [dataHash.lock.key] Lock key for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.

    Sample usage:

    select xt.patch('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10009",
      "etag": "5972fbbf-416d-43c8-9fd5-b30093093897",
      "patches": [
        {
          "op":"replace",
          "path":"/firstName",
          "value":"Damien"
        }
        ,
        {
          "op": "add",
          "path": "/comments/3",
          "value": {
            "uuid": "bb5a834a-b816-481c-ab17-0637a999b511",
            "commentType": "General",
            "text": "We be jammin.",
            "isPublic": false,
            "created": "2013-04-26T12:57:57.896Z",
            "createdBy": "admin"
          }
        }
      ],
      "prettyPrint": true
    }');

*/
create or replace function xt.patch(data_hash text) returns text as $$

return (function () {

  var dataHash = JSON.parse(data_hash),
    ret;

  try {
    ret = XT.Rest.patch(dataHash);
    
    return JSON.stringify(ret, null, dataHash.prettyPrint);
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;

