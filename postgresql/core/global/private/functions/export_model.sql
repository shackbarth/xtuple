create or replace function private.export_model(record_type text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var COMPOUND_TYPE = 'C',
      ARRAY_TYPE = 'A',
      STRING_TYPE = 'S',
      DATE_TYPE = 'D',
      NUMBER_TYPE = 'N',
      BOOLEAN_TYPE = 'B',
      local = {};

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

  getNamespace = function(model_name) {
    var sql = "select model_namespace from private.modelbas where model_name = $1",
        ret;

    ret = executeSql(sql, [ model_name ]);

    if(ret && ret.length) { return ret[0].model_namespace.toUpperCase(); }

    return false;
  }

  // ..........................................................
  // PROCESS
  //
  
  var sql = "select * "
          + "from private.modelbas "
          + "where model_name = $1",
      recordType = decamelize(record_type.replace((/\w+\./i),'')), 
      nameSpace = record_type.replace((/\.\w+/i),'').toLowerCase(),
      viewdef = getViewDefinition(recordType, nameSpace),
      debug = false, model, ret = new Object;

  /* query the model */
  if(debug) print(NOTICE, 'sql = ', sql);

  model = executeSql(sql, [ recordType ]);

  if(model.length) {
    var rules = [], updcmd;
    
    model = model[0];

    /* add some basic definition */
    ret.context = "xtuple";
    ret.nameSpace = model.model_namespace.toUpperCase();
    ret.type = model.model_name.slice(0,1).toUpperCase() + camelize(model.model_name.slice(1));;
    //ret.schema = model.model_schema_name ? model.model_schema_name : model.model_table_name.replace((/\.\w+/i),'');
    ret.table = model.model_table_name.replace((/\w+\./i),'');
    if(model.modelbas_id_seq_name) { ret.idSequenceName = model.modelbase_id_seq_name };
    if(model.model_comment.length) { ret.comment = model.model_comment; }

    ret.canCreate = false;
    ret.canUpdate = false;
    ret.canDelete = false;

    /* parse rules */
    for(var i = 0; i < model.model_rules.length; ++i) {
      var curr = model.model_rules[i], rule = new Object,
          isNothing = curr.search(/nothing/i) > 0 && curr.search(/when/i) === -1;
 
      var ridx = curr.search(/rule /i) + 4,
          aidx = curr.search(/as/i),
          iidx = curr.search(/instead/i) + 7,
          widx = curr.search(/where/i) + 5,
          didx = curr.search(/do/i),
          cond = curr.slice(widx, didx).replace(/\n/g,'').trim();

      rule.name = curr.slice(ridx, aidx).replace(/"|"/g,'').trim();
      rule.event = curr.search(/ insert/i) > 0 ? 'insert' : curr.search(/ update/i) > 0 ? 'update' : curr.search(/ delete/i) > 0 ? 'delete' : null;
      if(cond && cond.length) { rule.condition = curr.slice(widx, didx).replace(/\n/g,'').replace(/\s+/g,' ').trim(); }
      rule.command = curr.slice(iidx).replace(/\n/g,'').trim();

      if(rule.name === "_UPDATE") { updcmd = rule.command; }

      /* only include 'non-standard' rules */
      if(rule.name === "_CREATE") {
        if(!isNothing) delete ret.canCreate;
      } else if (rule.name === "_UPDATE") {
        if(!isNothing) delete ret.canUpdate;
      } else if (rule.name === "_DELETE") {
        if(!isNothing) delete ret.canDelete;
      } else if(rule.name === "_CREATE_CHECK_PRIV") {
//        ret.canCreate = rule.condition;
      } else if (rule.name === "_UPDATE_CHECK_PRIV") {
 //      ret.canUpdate = rule.condition;
      } else if (rule.name === "_DELETE_CHECK_PRIV") {
    //    ret.canDelete = rule.condition;
      } else {
        rules.push(rule);
      }
    }

    /* parse columns */
    ret.properties = [];
        
    for(var i = 0; i < model.model_columns.length; ++i) {
      var cols = model.model_columns, 
          aidx = cols[i].search(/ as /i),
          pidx = cols[i].indexOf('.'),
          eidx = cols[i].indexOf('=') + 1,
          ridx = cols[i].indexOf(')'),
          property = new Object, 
          attr, coldef;


      /* find the attribute name */
      attr = aidx > 0 ? cols[i].substring(aidx + 3).trim() : cols[i].trim();

      coldef = findProperty(viewdef, 'attname', attr);

      property.name = camelize(attr);

      switch (coldef.typcategory) 
      {
      case COMPOUND_TYPE:
        var col = cols[i].slice(eidx, ridx).trim(),
            pidx = col.indexOf('.'), t;
            widx = cols[i].search(/where/) + 5;
            
        property.toOne = new Object;
        property.toOne.type = getNamespace(coldef.typname) + '.' + coldef.typname.slice(0,1).toUpperCase() + camelize(coldef.typname.slice(1));
   //     property.toOne.table = col.slice(0, pidx);
        property.toOne.column = col.slice(pidx + 1);
        if(cols[i].slice(widx, eidx - 1).trim() !== 'guid') property.toOne.inverse = cols[i].slice(widx, eidx - 1).trim();
        break;
      case ARRAY_TYPE:
        var col = cols[i].slice(eidx, ridx).trim(),
            pidx = col.indexOf('.'),
            widx = cols[i].search(/where/) + 5;

        property.toMany = new Object;
        property.toMany.type = getNamespace(coldef.typname.slice(1)) + '.' + coldef.typname.slice(1,2).toUpperCase() + camelize(coldef.typname.slice(2));
   //     property.toMany.table = col.slice(0, pidx);
        property.toMany.column = col.slice(pidx + 1);
        property.toMany.inverse = cols[i].slice(widx, eidx - 1).trim();
        break; 
      case STRING_TYPE:
        t = 'String';
        break;
      case NUMBER_TYPE:
        t = 'Number';
        break;
      case BOOLEAN_TYPE:
        t = 'Boolean';
        break;
      case DATE_TYPE:
        t = 'Date';
        break;
      }
        
      if(!property.toOne && !property.toMany) {

        property.attr = new Object;
        property.attr.type = t;
       // property.attr.table = cols[i].slice(0, pidx);
        property.attr.column = cols[i].slice(0, aidx).slice(pidx + 1);

       /* scan the update command to determine whether this attribute can be updated */
        if(property.name === 'guid') property.attr.isPrimaryKey = true;
        else if(updcmd.indexOf('new.' + attr) === -1) { property.attr.isEditable = false; }
      }
        


      ret.properties.push(property);
    }
    if(model.model_conditions.length) { 
      model.model_conditions.length > 1 ? ret.conditions = model.model_conditions : ret.conditions = model.model_conditions[0]; 
    }
    if(model.model_order.length) { 
      model.model_order.length > 1 ? ret.order = model.model_order : ret.order = model.model_order[0]; 
    }
    if(rules.length) { ret.rules = rules; }
    if(model.modelbas_nested) { ret.isNested = model.modelbas_nested; }
    if(model.model_system) { ret.isSystem = model.model_system };
    
    return JSON.stringify(ret, null, 2);
  } else {
    return '{ "error": "Model not found" }';
  }
  
$$ language plv8;

select private.export_model('XM.ProjectInfo');
