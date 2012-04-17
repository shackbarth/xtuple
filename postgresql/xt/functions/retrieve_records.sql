create or replace function xt.retrieve_records(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      encryptionKey = dataHash.encryptionKey,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      ret = data.retrieveRecords(dataHash.recordType, dataHash.ids, encryptionKey);

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.retrieve_records('{
  "recordType":"XM.Contact", 
  "ids": [1,2,8],
  "prettyPrint": true
  }'
);
*/
