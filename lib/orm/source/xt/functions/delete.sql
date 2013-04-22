/**
    Procedure for deleting a record and its children from the database.
    
    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Number} [dataHash.etag] Record version for optimistic locking. Required.
    @param {Object} [dataHash.lock] Lock information for pessemistic locking.
    @param {Number} [dataHash.lock.key] Lock key for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.
*/
create or replace function xt.delete(data_hash text) returns boolean as $$

  var dataHash = JSON.parse(data_hash),
    data = Object.create(XT.Data),
    options = JSON.parse(JSON.stringify(dataHash)),
    prettyPrint = dataHash.prettyPrint ? 2 : null,
    observer,
    rec,
    ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* get the current version of the record */
  rec = data.retrieveRecord(dataHash);
  if (!rec.data) { plv8.elog(ERROR, "Record not found"); };
  dataHash.data = rec.data;

  /* mark for deletion */
  XT.jsonpatch.updateState(dataHash.data, "delete");

  /* commit the record */
  data.commitRecord(dataHash);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return true;

$$ language plv8;

/*
select xt.js_init();
select xt.delete('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Contact",
  "id": 10,
  "version": 2,
  "prettyPrint": true
}');
*/