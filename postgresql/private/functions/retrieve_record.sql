create or replace function private.retrieve_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select private.init_js()');

  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.recordType.replace((/\.\w+/i),'').toLowerCase(), 
      recordType = dataHash.recordType.replace((/\w+\./i),'').decamelize(),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      rec, data = Object.create(XT.Data);
      
      map = XT.fetchMap(recordType),
      debug = false, rec,
      sql = "select * from {nameSpace}.{recordType} where guid = {id};"
            .replace(/{nameSpace}/, nameSpace)
            .replace(/{recordType}/, recordType)
            .replace(/{id}/, dataHash.id);  

  /* validate - don't bother running the query if the user has no privileges */
  if(!data.checkPrivileges(map)) throw new Error("Access Denied.");

  /* query the map */
  if(debug) print(NOTICE, 'sql = ', sql);
  
  rec = data.normalize(nameSpace, recordType, executeSql(sql)[0]);

  /* check privileges again, this time against record specific criteria where applicable */
  if(!data.checkPrivileges(map, rec)) throw new Error("Access Denied.");

  /* return the results */
  return JSON.stringify(rec, null, prettyPrint);

$$ language plv8;
/*
select private.retrieve_record('{
  "recordType":"XM.Contact", 
  "id": 1,
  "prettyPrint": true
  }'
);
*/
