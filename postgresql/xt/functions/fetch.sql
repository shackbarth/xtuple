create or replace function xt.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var query = JSON.parse(data_hash).query,
      recordType = query.recordType
      orderBy = query.orderBy,
      parameters = query.parameters,
      rowLimit = query.rowLimit;
      rowOffset = query.rowOffset,
      data = Object.create(XT.Data), recs = null, 
      prettyPrint = query.prettyPrint ? 2 : null;

  recs = data.fetch(recordType, parameters, orderBy, rowLimit, rowOffset);
 
  /* return the results */
  return JSON.stringify(recs, null, prettyPrint);

$$ language plv8;
/*
select xt.js_init();
select xt.fetch($${ "query":{
                         "recordType":"XM.ContactInfo",
                         "parameters":[{
                           "attribute":"firstName",
                           "value": "Mike"
                          }, {
                           "attribute": "lastName",
                           "value": "Farley"
                         }], 
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
