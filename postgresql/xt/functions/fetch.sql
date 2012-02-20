create or replace function xt.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  // ..........................................................
  // PROCESS
  //

  var query = JSON.parse(data_hash).query,
      nameSpace = query.recordType.replace((/\.\w+/i),''),
      type = query.recordType.replace((/\w+\./i),''),
      table = (nameSpace + '.' + type).decamelize(),
      conditions = query.conditions,
      orderBy = (query.orderBy ? 'order by ' + query.orderBy : '').decamelize(),
      parameters = query.parameters,
      limit = query.rowLimit ? 'limit ' + query.rowLimit : '';
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      data = Object.create(XT.Data), recs = null, 
      conditions = data.buildClause(nameSpace, type, conditions, parameters),
      prettyPrint = query.prettyPrint ? 2 : null, 
      sql = "select * from {table} where {conditions} {orderBy} {limit} {offset}";

  /* validate - don't bother running the query if the user has no privileges */
  if(!data.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

  /* query the model */
  sql = sql.replace('{table}', table)
           .replace('{conditions}', conditions)
           .replace('{orderBy}', orderBy)
           .replace('{limit}', limit)
           .replace('{offset}', offset);
       
  if(DEBUG) { print(NOTICE, 'sql = ', sql); }

  recs = executeSql(sql);
 
  /* return the results */
  return JSON.stringify(XT.camelize(recs), null, prettyPrint);

$$ language plv8;
/*
select xt.fetch(E'{ "query":{
                         "recordType":"XM.Contact",
                         "parameters":{ 
                           "firstName": "Jake", 
                           "lastName": "F"
                         }, 
                         "conditions":"firstName = {firstName} OR lastName BEGINS_WITH {lastName}", 
                         "orderBy":"lastName", 
                         "rowLimit": 3,
                         "prettyPrint": true
                         }
                       }');

select xt.fetch(E'{ "query":{
                         "recordType":"XM.Contact",
                         "rowLimit": 10,
                         "prettyPrint": true
                         }
                       }');

select xt.fetch(E'{ "query":{
                         "recordType":"XM.Contact",
                         "parameters":[ "Jake",  "F" ], 
                         "conditions":"firstName = %@ OR lastName BEGINS_WITH %@", 
                         "orderBy":"lastName", 
                         "rowLimit": 3,
                         "prettyPrint":true
                         }
                       }');
*/
