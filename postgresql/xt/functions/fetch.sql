create or replace function xt.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) plv8.execute('select xt.js_init()');

  var query = JSON.parse(data_hash).query,
      recordType = query.recordType
      conditions = query.conditions,
      orderBy = query.orderBy,
      parameters = query.parameters,
      rowLimit = query.rowLimit;
      rowOffset = query.rowOffset,
      data = Object.create(XT.Data), recs = null, 
      prettyPrint = query.prettyPrint ? 2 : null;

  recs = data.fetch(recordType, conditions, parameters, orderBy, rowLimit, rowOffset);
 
  /* return the results */
  return JSON.stringify(recs, null, prettyPrint);

$$ language plv8;
/*
select xt.fetch($${ "query":{
                         "recordType":"XM.Contact",
                         "parameters":{ 
                           "firstName": "Jake", 
                           "lastName": "F"
                         }, 
                         "conditions":"\"firstName\" = {firstName} OR \"lastName\" ~^ {lastName}", 
                         "orderBy":"\"lastName\"", 
                         "rowLimit": 3,
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.Contact",
                         "rowLimit": 10,
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.Contact",
                         "parameters":[ "Jake",  "F" ], 
                         "conditions":"\"firstName\" = %@ OR \"lastName\" ~^ %@", 
                         "orderBy":"\"lastName\"", 
                         "rowLimit": 3,
                         "prettyPrint":true
                         }
                       }$$);
*/
