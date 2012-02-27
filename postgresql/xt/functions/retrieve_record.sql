create or replace function xt.retrieve_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      encryptionKey = dataHash.encryptionKey,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      ret = data.retrieveRecord(dataHash.recordType, dataHash.id, encryptionKey);

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
