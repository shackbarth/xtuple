create or replace function private.fetch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select private.init_js()');

  // ..........................................................
  // METHODS
  //

  buildClause = function(conditions, parameters) {
    var ret = ' true ';
    
    if(conditions) {
      /* replace special operators */
      ret = conditions.replace('BEGINS_WITH','~^')
                      .replace('ENDS_WITH','~?')
                      .replace('CONTAINS','~')
                      .replace('MATCHES','~')
                      .replace('ANY', '<@ array')
                      .decamelize();

      quoteIfString = function(arg) { 
        if(typeof arg === 'string') { 
          return "'" + arg + "'"; 
        }

        return arg;
      }
      
      if(parameters) {
        if(ret.indexOf('%@') > 0) {  /* replace wild card tokens */
          for(var i = 0; i < parameters.length; i++) {
            var n = ret.indexOf('%@'),
                val =  quoteIfString(parameters[i]);

            ret = ret.replace(/%@/,val);
          }
        } else {  /* replace parameterized tokens */
          for(var prop in parameters) {
            var param = '{' + prop.decamelize() + '}',
                val = quoteIfString(parameters[prop]);
            
            ret = ret.replace(param, val);
          }
        }
      }
    }
    return ret;
  }

  // ..........................................................
  // PROCESS
  //

  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.recordType.replace((/\.\w+/i),'').decamelize(),
      type = dataHash.recordType.replace((/\w+\./i),'').decamelize(),
      conditions = dataHash.conditions,
      orderBy = dataHash.orderBy ? 'order by ' + dataHash.orderBy : '',
      parameters = dataHash.parameters,
      limit = dataHash.rowLimit ? 'limit ' + dataHash.rowLimit : '';
      offset = dataHash.rowOffset ? 'offset ' + dataHash.rowOffset : '',
      data = Object.create(XT.Data),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      debug = true, recs = null, 
      sql = "select * from {table} where {conditions} {orderBy} {limit} {offset}";
  
  /* query the model */
  sql = sql.replace('{table}', nameSpace + '.' + type)
           .replace('{conditions}', buildClause(conditions, parameters))
           .replace('{orderBy}', orderBy.decamelize())
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
                         "parameters":[ "Jake",  "F" ], 
                         "conditions":"firstName = %@ OR lastName BEGINS_WITH %@", 
                         "orderBy":"lastName", 
                         "rowLimit": 3,
                         "prettyPrint":true
                         }');
*/
