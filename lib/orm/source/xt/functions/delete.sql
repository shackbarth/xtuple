/**
    Procedure for deleting a record and its children from the database.

    @param {Text} Data hash that can parsed into a JavaScript object or array.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Number} [dataHash.etag] Optional record id version for optimistic locking.
    @param {Object} [dataHash.lock] Lock information for pessemistic locking.
    @param {Number} [dataHash.lock.key] Lock key for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.

    Sample usage:
    select xt.js_init();
    select xt.delete('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10009",
      "etag": "e5b73834-492d-47b1-89a2-10b354b8f5e3",
      "prettyPrint": true
    }');

*/
create or replace function xt.delete(data_hash text) returns boolean as $$

return (function () {
  
  try {
    return XT.Rest.delete(JSON.parse(data_hash));
    
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;
