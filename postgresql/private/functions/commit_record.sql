create or replace function private.commit_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* Constants */
  var COMPOUND_TYPE = "C",
      ARRAY_TYPE = "A",
      DATE_TYPE = "D",
      STRING_TYPE = "S",
      CREATED_STATE = 'created',
      UPDATED_STATE = 'updated',
      DELETED_STATE = 'deleted';

  // ..........................................................
  // METHODS
  //

  /* Commit a record to the database 

     @param {String} model name
     @param {Object} data object
  */
  commitRecord = function(key, value) {
    var changeType;
    
    if(value && value.dataState) {
      if(value.dataState === CREATED_STATE) { 
        createRecord(key, value);
      }
      else if(value.dataState === UPDATED_STATE) { 
        updateRecord(key, value);
      }
      else if(value.dataState === DELETED_STATE) { 
        deleteRecord(key, value); 
      }
    }
  }

  /* Commit insert to the database 

     @param {String} model name
     @param {Object} the record to be committed
  */
  createRecord = function(key, value) {
    var model = decamelize(key).replace(nameSpace + '.',''), 
        record = decamelize(value),
        sql = '', columns, expressions,
        props = [], params = [], 
        viewdef = getViewDefinition(model, nameSpace);

    /* build up the content for insert of this record */
    for(var prop in record) {
      var coldef = findProperty(viewdef, 'attname', prop);

      if (prop !== 'data_state' && 
          prop !== 'type' && 
          coldef.typcategory !== ARRAY_TYPE) { 
        props.push(prop);
        if(record[prop]) { 
          if (coldef.typcategory === COMPOUND_TYPE) { 
            var row = rowify(coldef.typname, record[prop]);

            record[prop] = row;
          } 
          
          if(coldef.typcategory === STRING_TYPE ||
             coldef.typcategory === DATE_TYPE) { 
            params.push("'" + record[prop] + "'");
          } else {
            params.push(record[prop]);
          }
        } else {
          params.push('null');
        }
      }
    }

    columns = props.join(', ');
    expressions = params.join(', ');
    sql = sql.concat('insert into ', nameSpace, '.', model, ' (', columns, ') values (', expressions, ')');
    
    if(debug) { print(NOTICE, 'sql =', sql); }
    
    /* commit the record */
    executeSql(sql); 

    /* okay, now lets handle arrays */
    commitArrays(record, viewdef);
  }

  /* Commit update to the database 

     @param {String} model name
     @param {Object} the record to be committed
  */
  updateRecord = function(key, value) {
    var model = decamelize(key), 
        record = decamelize(value),
        sql = '', expressions, params = [],
        viewdef = getViewDefinition(model, nameSpace);

    /* build up the content for update of this record */
    for(var prop in record) {
      var coldef = findProperty(viewdef, 'attname', prop);

      if (prop !== 'data_state' &&
          prop !== 'type' && 
          coldef.typcategory !== ARRAY_TYPE) {
        if(record[prop]) { 
          if (coldef.typcategory === COMPOUND_TYPE) {
            var row = rowify(coldef.typname, record[prop]);
            
            record[prop] = row;
          } 
        
          if(coldef.typcategory === STRING_TYPE ||
             coldef.typcategory === DATE_TYPE) { 
            params.push(prop.concat(" = '", record[prop], "'"));
          } else {
            params.push(prop.concat(" = ", record[prop]));
          }
        } else {
          params.push(prop.concat(' = null'));
        }
      }
    }

    expressions = params.join(', ');
    sql = sql.concat('update ', nameSpace, '.', model, ' set ', expressions, ' where guid = ', record.guid);
    
    if(debug) { print(NOTICE, 'sql =', sql); }
    
    /* commit the record */
    executeSql(sql); 

    /* okay, now lets handle arrays */
    commitArrays(record, viewdef); 
  } 

  /* Commit deletion to the database 

     @param {String} model name
     @param {Object} the record to be committed
  */
  deleteRecord = function(key, value) {
    var model = decamelize(key), 
        record = decamelize(value), sql = '';

    sql = sql.concat('delete from ', nameSpace, '.', model, ' where guid = ', record.guid);
    
    if(debug) { print(NOTICE, 'sql =', sql); }
    
    /* commit the record */
    executeSql(sql); 
  }

  /* Commit array columns with their own statements 
  
     @param {Object} record object to be committed
     @param {Object} view definition object
  */
  commitArrays = function(record, viewdef) {
    for(var prop in record) {
      var coldef = findProperty(viewdef, 'attname', prop);

      if (coldef['typcategory'] === ARRAY_TYPE) {
          var key = coldef['typname'].substring(1); /* strip underscore from (array) type name */
              values = record[prop]; 

        for(var i in values) {
          commitRecord(key, values[i]);
        }
      }
    }   
  }

  /* Convert object to postgres row type

     @param {String} the column type
     @param {Object} data to convert
     @returns {String} a string formatted like a postgres RECORD datatype 
  */
  rowify = function(key, value) {
    var viewdef = getViewDefinition(key, nameSpace),
        record = decamelize(value),
        props = [], ret = '';

    /* remove potential fields not part of data definition */
    delete record['data_state'];
    delete record['type'];
    
    for(var prop in record) {
      var coldef = findProperty(viewdef, 'attname', prop);
      if(prop) {
        if(coldef.typcategory !== ARRAY_TYPE) { 
          if(coldef.typcategory === COMPOUND_TYPE) { 
            record[prop] = rowify(coldef.attname, record[prop]);
          }
          if(coldef.typcategory === STRING_TYPE ||
             coldef.typcategory === DATE_TYPE) {
            props.push("'" + record[prop] + "'"); 
          } else {
            props.push(record[prop]);
          }
        }
      } else {
        props.push('null');
      }
    }

    ret = ret.concat('(', props.join(','), ')');

    if(debug) { print(NOTICE, 'rowify = ', ret); }
    
    return ret;
  }

  /* Returns an the first item in an array with a property matching the passed value.  

     @param {Object} an array to search
     @param {String} property name to search on
     @param {String} a value to match
     @returns Object found item or null
  */
  findProperty = function(ary, key, value) {
    for(var i = 0; i < ary.length; i++) {
      for(var prop in ary[i]) {
        if(prop === key &&
           ary[i][prop] === value) {
             return ary[i];
        }
      }
    }
    return false;
  }

  /* Pass an argument to change camel case names to snake case.
     A string passed in simply returns a decamelized string.
     If an object is passed, an object is returned with all it's
     proprety names camelized.

     @param {String | Object}
     @returns {String | Object} The argument modified
  */
  decamelize = function(arg) {
    var ret = arg; 

    decamelizeStr = function(str) {
      return str.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
    }

    if(typeof arg == "string") {
      ret = decamelizeStr(arg);
    } else if(typeof arg == "object") {
      ret = new Object;

      for(var prop in arg) {
        ret[decamelizeStr(prop)] = arg[prop];
      }
    }

    return ret;
  }

  /* Validate whether the passed type is nested
     based on the model definition in Postgres

     @param {String} recordType
     @returns {Boolean}
  */
  validateType = function(recordType) {
    var sql = 'select model_id, modelbas_nested '
            + 'from private.modelbas '
            + 'where model_name=$1',
        res = executeSql(sql, [ recordType ]);

    if(!res.length) {
      throw new Error("The model definition for " + recordType + " was not found.");
    }
    if(res[0].modelbas_nested) { 
      throw new Error ("The model definition for " + recordType + " is nested and may only be accessed in the context of a parent record.");
    }

    return true;
  }

  /* Pass a record type and return an array
     that describes the view definition with
     item representing a column.

     @param {String} recordType
     @returns {Object} 
  */
  getViewDefinition = function(recordType, nameSpace) {
    var sql = "select attnum, attname, typname, typcategory "
            + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
            + "where c.relname = $1 "
            + "and n.nspname = $2 "
	    + "and n.oid = c.relnamespace "
	    + "and a.attnum > 0 "
	    + "and a.attrelid = c.oid "
	    + "and a.atttypid = t.oid "
	    + "order by attnum";

    if(debug) { print(NOTICE, 'viewdefSql = ', sql) };

    return executeSql(sql, [ recordType, nameSpace ]);
  }

  // ..........................................................
  // PROCESS
  //
  var dataHash = JSON.parse(data_hash),
      recordType = decamelize(dataHash.recordType.replace((/\w+\./i),'')), 
      nameSpace = dataHash.recordType.replace((/\.\w+/i),'').toLowerCase();
      debug = false;

  delete dataHash.recordType;

  if(debug) print(NOTICE, recordType, nameSpace);

  if(validateType(recordType)) { 
    commitRecord(recordType, dataHash);
    return '{ "status":"ok" }';
  } 
  
  return '{ "status":"error" }';
  
$$ language plv8;
/*
select private.commit_record(
 E'{ "recordType":"XM.Contact", 
    "dataState":"created",
    "guid":12171,
    "number":"14832",
    "honorific":"Mr.",
    "firstName":"John",
    "middleName":"D",
    "lastName":"Rockefeller",
    "suffix":"",
    "isActive":true,
    "jobTitle":"Founder",
    "initials":"JDR","isActive":true,
    "phone":"555-555-5555",
    "alternate":"555-444-4445",
    "fax":"555-333-3333",
    "webAddress":"www.xtuple.com",
    "notes":"A famous person",
    "owner":{
      "dataState":"read",
      "username":"admin",
      "isActive":true,
      "propername":"administrator"
    },
    "primaryEmail":"jdr@gmail.com",
    "address": null,
    "comments":[{
      "dataState":"created",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"created",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
      }
    ],
    "characteristics":[],
    "email":[]
  }'
);

select private.commit_record(
 'XM.Contact',
 '{ "dataState":"updated",
    "guid":12171,
    "number":"14832",
    "honorific":"Mrs.",
    "firstName":"Jane",
    "middleName":"L",
    "lastName":"Knight",
    "suffix":"",
    "isActive":true,
    "jobTitle":"Heiress to a fortune",
    "initials":"JLK","isActive":true,
    "phone":"555-555-5551",
    "alternate":"555-444-4441",
    "fax":"555-333-3331",
    "webAddress":
    "www.xtuple.com",
    "notes":"A distinguished person",
    "owner":{
      "dataState":"read",
      "username":"postgres",
      "isActive":true,
      "propername":""
    },
    "primaryEmail":"jane@gmail.com",
    "address":{
      "dataState":"read",
      "guid":1,
      "line1":"Tremendous Toys Inc.",
      "line2":"101 Toys Place",
      "line3":"",
      "city":"Walnut Hills",
      "state":"VA",
      "postalcode":"22209",
      "country":"United States"
    },
    "comments":[{
      "dataState":"updated",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"updated",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
    }],
    "characteristics":[],
    "email":[]
  }'
);

select private.commit_record(
 'XM.Contact',
 '{ "dataState":"deleted",
    "guid":12171,
    "number":"14832",
    "honorific":"Mrs.",
    "firstName":"Jane",
    "middleName":"L",
    "lastName":"Knight",
    "suffix":"",
    "isActive":true,
    "jobTitle":"Heiress to a fortune",
    "initials":"JLK","isActive":true,
    "phone":"555-555-5551",
    "alternate":"555-444-4441",
    "fax":"555-333-3331",
    "webAddress":
    "www.xtuple.com",
    "notes":"A distinguished person",
    "owner":{
      "dataState":"deleted",
      "username":"postgres",
      "isActive":true,
      "propername":""
    },
    "primaryEmail":"jane@gmail.com",
    "address":{
      "dataState":"deleted",
      "guid":1,
      "line1":"Tremendous Toys Inc.",
      "line2":"101 Toys Place",
      "line3":"",
      "city":"Walnut Hills",
      "state":"VA",
      "postalcode":"22209",
      "country":"United States"
    },
    "comments":[{
      "dataState":"deleted",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"deleted",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
    }],
    "characteristics":[],
    "email":[]
  }'
);
*/
