create or replace function private.export_model(record_type text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var COMPOUND_TYPE = 'C',
      ARRAY_TYPE = 'A',
      STRING_TYPE = 'S',
      DATE_TYPE = 'D',
      NUMBER_TYPE = 'N',
      BOOLEAN_TYPE = 'B'
      NAMESPACE = 'XM'; /* temporary */

  // ..........................................................
  // METHODS
  //

  /* Trim whitespace from a string */
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
  }

  /* Pass an argument to change names with underscores '_' camel case.
     A string passed in simply returns a camelized string.
     If an object is passed, an object is returned with all it's
     proprety names camelized.

     @param {String | Object}
     @returns {String | Object} decamelized argument
  */
  camelize = function(arg) {
    var ret = arg; 

    camelizeStr = function(str) {
      var rtn = str.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(str, separater, character) {
        return character ? character.toUpperCase() : '';
      });

      var first = rtn.charAt(0),
          lower = first.toLowerCase();

      return first !== lower ? lower + ret.slice(1) : rtn;
    };

    if(typeof arg == "string") {
      ret = camelizeStr(arg);
    } else if(typeof arg == "object") {
      ret = new Object;

      for(var prop in arg) {
        ret[camelizeStr(prop)] = arg[prop];
      }
    }
   
    return ret;
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
  
  var sql = "select * from only private.model where model_name = $1",
      recordType = decamelize(record_type.replace((/\w+\./i),'')), 
      nameSpace = record_type.replace((/\.\w+/i),'').toLowerCase(),
      viewdef = getViewDefinition(recordType, nameSpace),
      debug = true, model, ret = new Object;

  /* query the model */
  if(debug) print(NOTICE, 'sql = ', sql);

  model = executeSql(sql, [ recordType ]);

  if(model.length) {
    model = model[0];

    ret.name = model.model_name;
    ret.table = model.model_table_name;
    ret.properties = [];
    for(var i = 0; i < model.model_columns.length; ++i) {
      var cols = model.model_columns, 
          aidx = cols[i].search(' as '),
          pidx = cols[i].indexOf('.'),
          eidx = cols[i].indexOf('=') + 1,
          ridx = cols[i].indexOf(')'),
          property = new Object, 
          attr, coldef;

      /* find the attribute name */
      attr = aidx > 0 ? cols[i].substring(aidx + 3).trim() : cols[i].trim();

      coldef = findProperty(viewdef, 'attname', attr);

      switch (coldef.typcategory) 
      {
      case COMPOUND_TYPE:
        var col = cols[i].slice(eidx, ridx).trim(),
            pidx = col.indexOf('.');
            
        /* TODO: namespace needs to come from the model definition eventually */
        property.type = NAMESPACE + '.' + coldef.typname.slice(0,1).toUpperCase() + camelize(coldef.typname.slice(1));
        property.toOne = camelize(attr);
        property.column = col.slice(pidx + 1);
        break;
      case ARRAY_TYPE:
        var col = cols[i].slice(eidx, ridx).trim(),
            pidx = col.indexOf('.'),
            widx = cols[i].indexOf('where') + 5;

        /* TODO: namespace needs to come from the model definition eventually */
        property.type = NAMESPACE + '.' + coldef.typname.slice(1,2).toUpperCase() + camelize(coldef.typname.slice(2));
        property.toMany = camelize(attr);
        property.column = cols[0].slice(eidx,ridx).trim();
        property.inverse = cols[i].slice(widx, eidx - 1).trim();
        delete property.column;
        break; 
      case STRING_TYPE:
        property.type = 'String';
      case NUMBER_TYPE:
        property.type = 'Number';
      case BOOLEAN_TYPE:
        property.type = 'Boolean';
      case DATE_TYPE:
        property.type = 'Date';
      default:
        property.attr = camelize(attr);
        property.column = cols[i].slice(0, aidx).slice(pidx + 1);
      }

      ret.properties.push(property);
    }
    ret.conditions = model.model_conditions;
    ret.order = model.model_order;
    ret.comment = model.model_comment;
    ret.isSystem = model.model_system;
    
    return JSON.stringify(ret, null, 2);
  } else {
    return '{ error: "Model not found" }';
  }
  
$$ language plv8;

select private.export_model('XM.Contact');
