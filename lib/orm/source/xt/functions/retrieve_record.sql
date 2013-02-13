create or replace function xt.retrieve_record(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      encryptionKey = dataHash.encryptionKey,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      options = dataHash.options,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }
  ret = data.retrieveRecord(dataHash.recordType, dataHash.id, encryptionKey, options);
  
  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.retrieve_record('{
  "username": "admin",
  "recordType":"XM.Contact", 
  "id": 1,
  "prettyPrint": true
  }'
);
*/
