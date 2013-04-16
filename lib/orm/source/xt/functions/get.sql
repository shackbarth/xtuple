/**
    Procedure for retrieving data from the server;
    
    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.id] Array Record Id. Required
    @param {Number} [dataHash.obtainLock] Obtain a pessimistic lock on the record.
    @param {String} [dataHash.encryptionKey] Encryption key.
*/
create or replace function xt.get(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }
  ret = data.retrieveRecord(dataHash);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.js_init();
select xt.get('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Contact",
  "id": 10,
  "prettyPrint": true
  }'
);
*/
