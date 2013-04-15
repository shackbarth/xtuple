/**
    Procedure for applying patches to the database per http://tools.ietf.org/html/rfc6902
    
    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.patches] Array of patches to be processed. Required
    @param {Number} [dataHash.version] Record version for optimistic locking. Required.
    @param {Number} [dataHash.lock] Lock information for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.
*/
create or replace function xt.patch(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      options = JSON.parse(JSON.stringify(dataHash)),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      observer,
      prv,
      rec,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* get the current version of the record */
  rec = data.retrieveRecord(dataHash);
  prv = JSON.parse(JSON.stringify(rec.data));

  /* apply the patch */
  if (!XT.jsonpatch.apply(rec.data, dataHash.patches, true)) {
    plv8.elog(ERROR, 'Malformed patch document');
  }
  options.data = rec.data;

  /* commit the record */
  data.commitRecord(options);

  /* calculate a patch of the modifed version */
  XT.jsonpatch.apply(prv, dataHash.data);
  observer = XT.jsonpatch.observe(prv);
  ret = data.retrieveRecord(dataHash);
  observer.object = ret.data;
  delete ret.data;
  ret.patches = XT.jsonpatch.generate(observer);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;

/*
select xt.js_init();
select xt.patch('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Quote",
  "id": 351,
  "version": 15,
  "data" : [{"op":"replace","path":"/status","value":"C"}],
  "prettyPrint": true
  }'
);
*/