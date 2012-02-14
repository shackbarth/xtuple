create or replace function private.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select private.init_js()');

  // ..........................................................
  // PROCESS
  //

  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.recordType.replace((/\.\w+/i),''),
      type = dataHash.recordType.replace((/\w+\./i),''),
      table = (nameSpace + '.' + type).decamelize(),
      conditions = dataHash.conditions,
      orderBy = (dataHash.orderBy ? 'order by ' + dataHash.orderBy : '').decamelize(),
      parameters = dataHash.parameters,
      limit = dataHash.rowLimit ? 'limit ' + dataHash.rowLimit : '';
      offset = dataHash.rowOffset ? 'offset ' + dataHash.rowOffset : '',
      data = Object.create(XT.Data), recs = null, 
      conditions = data.buildClause(nameSpace, type, conditions, parameters),
      prettyPrint = dataHash.prettyPrint ? 2 : null, 
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

  for (var i = 0; i < recs.length; i++) {
    recs[i] = data.normalize(nameSpace, type, recs[i]);
  };
 
  /* return the results */
  return JSON.stringify(recs, null, prettyPrint);

$$ language plv8;
/*
select private.init_js();
select private.fetch(E'{ "recordType":"XM.Contact",
                         "parameters":{ 
                           "firstName": "Jake", 
                           "lastName": "F"
                         }, 
                         "conditions":"firstName = {firstName} OR lastName BEGINS_WITH {lastName}", 
                         "orderBy":"lastName", 
                         "rowLimit": 3,
                         "prettyPrint": true
                         }');

select private.fetch(E'{ "recordType":"XM.Contact",
                         "rowLimit": 10,
                         "prettyPrint": true
                         }');

select private.fetch(E'{ "recordType":"XM.Contact",
                         "parameters":[ "Jake",  "F" ], 
                         "conditions":"firstName = %@ OR lastName BEGINS_WITH %@", 
                         "orderBy":"lastName", 
                         "rowLimit": 3,
                         "prettyPrint":true
                         }');
*/
