create or replace function xt.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var query = JSON.parse(data_hash).query,
    recordType = query.recordType,
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
                         "recordType":"XM.ContactInfo",
                         "parameters":[{
                           "attribute": "name",
                           "operator": "MATCHES",
                           "value": "Frank"
                          }], 
                          "orderBy": [{
                            "attribute": "lastName"
                          }, {
                            "attribute": "firstName"
                          }],
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.AccountInfo",
                         "parameters":[{
                           "attribute":"primaryContact.address.state",
                           "value": "VA"
                          }],
                          "orderBy": [{
                            "attribute": "primaryContact.name",
                            "descending": true
                          }],
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.ItemInfo",
                         "parameters":[{
                           "attribute": "number",
                           "operator": "BEGINS_WITH",
                           "value": "B"
                          }], 
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.ToDoInfo",
                         "parameters":[{
                           "attribute":"dueDate",
                           "operator": ">=",
                           "value": "2009-07-17T12:13:01.506Z"
                          }], 
                         "prettyPrint": true
                         }
                       }$$);

select xt.fetch($${ "query":{
                         "recordType":"XM.ContactInfo",
                         "parameters":[{
                           "attribute": ["account.number", "account.name", "name", "phone", "address.city"],
                           "operator": "MATCHES",
                           "value": "ttoys"
                          }, {
                           "attribute": "firstName",
                           "operator": "BEGINS_WITH",
                           "value": "M"
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

*/
