create or replace function xt.retrieve_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      encryptionKey = dataHash.encryptionKey,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      options = dataHash.options,
      ret = data.retrieveRecord(dataHash.recordType, dataHash.id, encryptionKey, options);

  if (dataHash.username) { XT.username = dataHash.username; }
  
  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.retrieve_record('{
  "recordType":"XM.Contact", 
  "id": 1,
  "prettyPrint": true
  }'
);
*/
