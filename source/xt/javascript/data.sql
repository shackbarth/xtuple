select xt.install_js('XT','Data','xtuple', $$

  /**
    @class

    The XT.Data class includes all functions necessary to process data source requests against the database.
    It should be instantiated as an object against which its funtion calls are made. This class enforces privilege 
    control and as such is not and should not be dispatchable.
  */
  
  XT.Data = {

    ARRAY_TYPE: "A",
    COMPOSITE_TYPE: "C",
    DATE_TYPE: "D",
    STRING_TYPE: "S",
  
    CREATED_STATE: 'create',
    READ_STATE: "read",
    UPDATED_STATE: 'update',
    DELETED_STATE: 'delete',

    /** 
      Build a SQL `where` clause based on privileges for name space and type,
      and conditions and parameters passed. 

      @seealso fetch

      @param {String} Name space
      @param {String} Type
      @param {Object} Parameters - optional
      @returns {Object}
    */
    buildClause: function (nameSpace, type, parameters) {
     parameters = parameters || [];
     var orm = XT.Orm.fetch(nameSpace, type),
       privileges = orm.privileges,
       param,
       childOrm,
       clause,
       orClause,
       clauses = [],
       attr,
       parts,
       op,
       arg,
       i,
       n,
       c,
       cnt = 1,
       ret = {},
       conds = [],
       prop;

      ret.conditions = "";
      ret.parameters = [];

      /* handle privileges */
      if (orm.isNestedOnly) { plv8.elog(ERROR, 'Access Denied'); }
      if ((privileges &&
         (!privileges.all || (privileges.all &&
         (!this.checkPrivilege(privileges.all.read) && 
          !this.checkPrivilege(privileges.all.update)))) &&
           privileges.personal &&
          (this.checkPrivilege(privileges.personal.read) || 
           this.checkPrivilege(privileges.personal.update)))) {
        parameters.push({
          attribute: privileges.personal.properties,
          isLower: true,
          value: XT.username
        });
      }

      /* handle parameters */
      if (parameters.length) {
        for (i = 0; i < parameters.length; i++) {
          orClause = [];
          param = parameters[i];
          op = param.operator || '=';
          switch (op) {
          case '=':
          case '>':
          case '<':
          case '>=':
          case '<=':
          case '!=':
            break;
          case 'BEGINS_WITH':
            op = '~^';
            break;
          case 'ENDS_WITH':
            op = '~?';
            break;
          case 'MATCHES':
            op = '~*';
            break;
          case 'ANY':
            op = '<@';
            for (c = 0; c < param.value.length; c++) {
              ret.parameters.push(param.value[c]);
              param.value[c] = '$' + cnt;
              cnt++;
            }
            break;
          default:
            plv8.elog(ERROR, 'Invalid operator: ' + op);
          };

          /* Handle characteristics. This is very specific to xTuple,
             and highly dependant on certain table structures and naming conventions,
             but otherwise way too much work to refactor in an abstract manner right now */
          if (param.isCharacteristic) {
            /* Handle array */
            if (op === '<@') {
              param.value = ' ARRAY[' + param.value.join(',') + ']';
            }
            
            /* Booleans are stored as strings */
            if (param.value === true) {
              param.value = 't';
            } else if (param.value === false) {
              param.value = 'f';
            }

            /* Yeah, it depends on a property called 'charectristics'... */
            prop = XT.Orm.getProperty(orm, 'characteristics');

            /* Build the clause */
            clause = '"id" in (' +
                     '  select {column}' +
                     '  from {table}' +
                     '    join char on (char_id=characteristic)' +
                     '  where' + 
                     '    char_name = \'{name}\' and' +
                     '    "value" {operator} \'{value}\'' +
                     ')';
            clause = clause.replace(/{column}/, prop.toMany.inverse)
                     .replace(/{table}/, orm.nameSpace.toLowerCase() + "." + prop.toMany.type.decamelize())
                     .replace(/{name}/, param.attribute)
                     .replace(/{operator}/, op)
                     .replace(/{value}/, param.value);
            clauses.push(clause);
 
          /* Array comparisons handle another way */
          } else if (op === '<@') {
            clause = param.attribute + ' ' + op + ' ARRAY[' + param.value.join(',') + ']';
            clauses.push(clause);

          /* Everything else handle another */
          } else {
            if (XT.typeOf(param.attribute) !== 'array') {
              param.attribute = [param.attribute];
            }

            for (c = 0; c < param.attribute.length; c++) {       
              /* handle paths if applicable */
              if (param.attribute[c].indexOf('.') > -1) {
                parts = param.attribute[c].split('.');
                childOrm = orm;
                attr = "";
                for (n = 0; n < parts.length; n++) {
                  /* validate attribute */
                  prop = XT.Orm.getProperty(childOrm, parts[n])
                  if (!prop) {
                    plv8.elog(ERROR, 'Attribute not found in object map: ' + parts[n]);
                  }

                  /* build path */
                  attr += '"' + parts[n] + '"';
                  if (n < parts.length - 1) {
                    attr = "(" + attr + ").";
                    childOrm = XT.Orm.fetch(nameSpace, prop.toOne.type);
                  } else if (param.isLower) {
                    attr = "lower(" + attr + ")";
                  }
                }
              } else {
                /* validate attribute */
                prop = XT.Orm.getProperty(orm, param.attribute[c]);
                if (!prop) {
                  plv8.elog(ERROR, 'Attribute not found in object map: ' + param.attribute[c]);
                }
                attr = '"' + param.attribute[c] + '"';
              }

              arg = '$' + cnt;
              if (prop.attr && prop.attr.type === 'Date') { arg += '::date'; }

              clause = [];
              clause.push(attr);
              clause.push(op);
              clause.push(arg);
              if (parameters[i].includeNull) {
                clause.push(' or ' + attr + 'is null');
              }
              orClause.push(clause.join(''));
            }
            clauses.push('(' + orClause.join(' or ') + ')');
            cnt++;
            ret.parameters.push(param.value);
          }
        }
      }

      ret.conditions = (clauses.length ? '(' + clauses.join(' and ') + ')' : ret.conditions) || true;
      return ret;
    },

    /**
      Queries whether the current user has been granted the privilege passed.

      @param {String} privilege
      @returns {Boolean}
    */
    checkPrivilege: function (privilege) {
      var ret = privilege,
       sql = 'select coalesce(usrpriv_priv_id, grppriv_priv_id, -1) > 0 as granted ' +
             'from priv ' +
             'left outer join usrpriv on (priv_id=usrpriv_priv_id) and (usrpriv_username=$1) ' +
             'left outer join ( ' +
             '  select distinct grppriv_priv_id ' +
             '  from grppriv ' +
             '    join usrgrp on (grppriv_grp_id=usrgrp_grp_id) and (usrgrp_username=$1) ' +
             '  ) grppriv on (grppriv_priv_id=priv_id) ' +
             'where priv_name = $2;';
      if (typeof privilege === 'string') {
        if (!this._granted) { this._granted = {}; }
        if (this._granted[privilege] !== undefined) { return this._granted[privilege]; }
        var res = plv8.execute(sql, [ XT.username, privilege ]),
          ret = res.length ? res[0].granted : false;
        /* memoize */
        this._granted[privilege] = ret;
      }
      if (DEBUG) { plv8.elog(NOTICE, 'Privilege check for "' + XT.username + '" on "' + privilege + '" returns ' + ret); }
      return ret;
    },
  
    /**
      Validate whether user has read access to data. If a record is passed, check personal privileges of
      that record. 

      @param {String} name space
      @param {String} type name
      @param {Object} record - optional
      @param {Boolean} is top level, default is true
      @returns {Boolean}
    */
    checkPrivileges: function (nameSpace, type, record, isTopLevel) {
      var isTopLevel = isTopLevel !== false ? true : false,
          isGrantedAll = true,
          isGrantedPersonal = false,
          map = XT.Orm.fetch(nameSpace, type),
          privileges = map.privileges,
          committing = record ? record.dataState !== this.READ_STATE : false;
          action =  record && record.dataState === this.CREATED_STATE ? 'create' : 
                    record && record.dataState === this.DELETED_STATE ? 'delete' :
                    record && record.dataState === this.UPDATED_STATE ? 'update' : 'read';

      /* if there is no ORM, this isn't a table data type so no check required */
      if (DEBUG) plv8.elog(NOTICE, 'orm is ->', JSON.stringify(map));    
      if(!map) return true;
      
      /* can not access 'nested only' records directly */
      if(DEBUG) plv8.elog(NOTICE, 'is top level ->', isTopLevel, 'is nested ->', map.isNestedOnly);    
      if(isTopLevel && map.isNestedOnly) return false
        
      /* check privileges - first do we have access to anything? */
      if(privileges) { 
        if(DEBUG) plv8.elog(NOTICE, 'privileges found');      
        if(committing) {
          if(DEBUG) plv8.elog(NOTICE, 'is committing');
          
          /* check if user has 'all' read privileges */
          isGrantedAll = privileges.all ? this.checkPrivilege(privileges.all[action]) : false;

          /* otherwise check for 'personal' read privileges */
          if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? this.checkPrivilege(privileges.personal[action]) : false;
        } else {
          if(DEBUG) plv8.elog(NOTICE, 'is NOT committing');
          
          /* check if user has 'all' read privileges */
          isGrantedAll = privileges.all ? 
                         this.checkPrivilege(privileges.all.read) || 
                         this.checkPrivilege(privileges.all.update) : false;

          /* otherwise check for 'personal' read privileges */
          if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? 
                                                 this.checkPrivilege(privileges.personal.read) || 
                                                 this.checkPrivilege(privileges.personal.update) : false;
        }
      }
      
      /* if we're checknig an actual record and only have personal privileges, see if the record allows access */
      if(record && !isGrantedAll && isGrantedPersonal) {
        if(DEBUG) plv8.elog(NOTICE, 'checking record level personal privileges');    
        var that = this,

        /* shared checker function that checks 'personal' properties for access rights */
        checkPersonal = function(record) {
          var i = 0,
            isGranted = false,
            props = privileges.personal.properties,
            get = function (obj, target) {
              var parts = target.split("."),
                ret,
                part,
                idx;
              for (idx = 0; idx < parts.length; idx++) {
                part = parts[idx];
                ret = ret ? ret[part] : obj[part];
                if (ret === null || ret === undefined) {
                  return null;
                }
              }
              return ret.toLowerCase();
            };
          while(!isGranted && i < props.length) {
            var prop = props[i];
            isGranted = get(record, prop) === XT.username;
            i++;
          }
          return isGranted;
        }
        
        /* if committing we need to ensure the record in its previous state is editable by this user */
        if(committing && (action === 'update' || action === 'delete')) {
          var pkey = XT.Orm.primaryKey(map),
              old = this.retrieveRecord(nameSpace + '.' + type, record[pkey]);
          isGrantedPersonal = checkPersonal(old);
          
        /* ...otherwise check personal privileges on the record passed */
        } else if(action === 'read') {
          isGrantedPersonal = checkPersonal(record);
        }
      }
      if(DEBUG) plv8.elog(NOTICE, 'is granted all ->', isGrantedAll, 'is granted personal ->', isGrantedPersonal);  
      return isGrantedAll || isGrantedPersonal;
    },
    
    /**
      Commit array columns with their own statements 

      @param {Object} Orm     
      @param {Object} Record
    */
    commitArrays: function (orm, record) {
      var prop,
        ormp;
      for(prop in record) {
        ormp = XT.Orm.getProperty(orm, prop);

        /* if the property is an array of objects they must be records so commit them */
        if (ormp.toMany && ormp.toMany.isNested) {
            var key = orm.nameSpace + '.' + ormp.toMany.type,
                values = record[prop]; 
          for (var i = 0; i < values.length; i++) {
            this.commitRecord(key, values[i], false);
          }
        }
      }   
    },

    /**
      Commit metrics that have changed to the database.

      @param {Object} metrics
      @returns Boolean
    */
    commitMetrics: function (metrics) {
      var key,
        value;
      for (key in metrics) {
        value = metrics[key];      
        if(typeof value === 'boolean') value = value ? 't' : 'f';
        else if(typeof value === 'number') value = value.toString();    
        plv8.execute('select setMetric($1,$2)', [key, value]);
      }
      return true;
    },

    /**
      Commit a record to the database 

      @param {String} name space qualified record type
      @param {Object} data object
    */
    commitRecord: function (key, value, encryptionKey) {
      var nameSpace = key.beforeDot().camelize().toUpperCase(),
        type = key.afterDot().classify(),
        hasAccess = this.checkPrivileges(nameSpace, type, value, false);
      if(!hasAccess) throw new Error("Access Denied.");    
      if(value && value.dataState) {
        if(value.dataState === this.CREATED_STATE) { 
          this.createRecord(key, value, encryptionKey);
        }
        else if(value.dataState === this.UPDATED_STATE) { 
          this.updateRecord(key, value, encryptionKey);
        }
        else if(value.dataState === this.DELETED_STATE) { 
          this.deleteRecord(key, value); 
        }
      }
    },

    /**
      Commit insert to the database 

      @param {String} Name space qualified record type
      @param {Object} Record
    */
    createRecord: function (key, value, encryptionKey) {
      var orm = XT.Orm.fetch(key.beforeDot(), key.afterDot()),
        sql = this.prepareInsert(orm, value),
        i;
        
      /* handle extensions on the same table */
      for (i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table === orm.table) {
          sql = this.prepareInsert(orm.extensions[i], value, sql);
        }
      }

      /* commit the base record */
      plv8.execute(sql.statement, sql.values); 

      /* handle extensions on other tables */
      for (i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table !== orm.table && 
           !orm.extensions[i].isChild) {
          sql = this.prepareInsert(orm.extensions[i], value);
          plv8.execute(sql.statement, sql.values); 
        }
      }

      /* okay, now lets handle arrays */
      this.commitArrays(orm, value);
    },

   /**
     Use an orm object and a record and build an insert statement. It
     returns an object with a table name string, columns array, expressions
     array and insert statement string that can be executed.

     The optional params object includes objects columns, expressions
     that can be cumulatively added to the result.

     @params {Object} Orm
     @params {Object} Record
     @params {Object} Params - optional
     @returns {Object}
   */
    prepareInsert: function (orm, record, params) {
      var count,
        column,
        columns,
        expressions,
        ormp,
        prop,
        attr,
        type,
        toOneOrm,
        toOneKey,
        toOneProp,
        toOneVal,
        i,
        value;
      params = params || { 
        table: "", 
        columns: [], 
        expressions: [],
        values: []
      }
      params.table = orm.table;
      count = params.values.length + 1;

      /* if extension handle key */
      if (orm.relations) {
        for (i = 0; i < orm.relations.length; i++) {
          column = '"' + orm.relations[i].column + '"';
          if (!params.columns.contains(column)) {
            params.columns.push(column);
            params.expressions.push(record[orm.relations[i].inverse]);
          }
        }
      }

      /* build up the content for insert of this record */
      for (i = 0; i < orm.properties.length; i++) {
        ormp = orm.properties[i];
        prop = ormp.name;
        attr = ormp.attr ? ormp.attr : ormp.toOne ? ormp.toOne : ormp.toMany;
        type = attr.type;

        /* handle fixed values */
        if (attr.value) {
          params.columns.push('"' + attr.column + '"');
          params.expressions.push('$' +count);
          params.values.push(attr.value);
          count++

        /* handle passed values */
        } else if (record[prop] !== undefined && record[prop] !== null && !ormp.toMany) {
          params.columns.push('"' + attr.column + '"');

          if (attr.isEncrypted) {
            if (encryptionKey) {
              record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                             .replace(/{value}/, record[prop])
                             .replace(/{encryptionKey}/, encryptionKey);
              params.values.push(record[prop]);
              params.expressions.push('$' + count);
              count++;
            } else { 
              throw new Error("No encryption key provided.");
            }
          /* Unfortuantely dates aren't handled correctly by parameters */
          } else if (attr.type === 'Date') {
            params.expressions.push("'" + record[prop] + "'");
          } else { 
            params.expressions.push('$' + count);
            count++;
            params.values.push(record[prop]);
          }
        }
      }

      /* Build the insert statement */
      columns = params.columns.join(', ');
      expressions = params.expressions.join(', ');
      params.statement = 'insert into ' + params.table + ' (' + columns + ') values (' + expressions + ')';
      if (DEBUG) { plv8.elog(NOTICE, 'sql =', params.statement); }
      return params;
    },

    /**
      Commit update to the database 

      @param {String} Name space qualified record type
      @param {Object} Record
    */
    updateRecord: function(key, value, encryptionKey) {
      var orm = XT.Orm.fetch(key.beforeDot(),key.afterDot()),
        sql = this.prepareUpdate(orm, value),
        pkey = XT.Orm.primaryKey(orm),
        ext,
        rows,
        i;
        
      /* handle extensions on the same table */
      for (i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table === orm.table) {
          sql = this.prepareUpdate(orm.extensions[i], value, sql);
        }
      }

      /* commit the base record */
      plv8.execute(sql.statement, sql.values); 

      /* handle extensions on other tables */
      for (i = 0; i < orm.extensions.length; i++) {
        ext = orm.extensions[i];
        if (ext.table !== orm.table && 
           !ext.isChild) {
           
          /* Determine whether to insert or update */
          sql = 'select ' + ext.relations[0].column + ' from ' + ext.table +
                ' where ' + ext.relations[0].column + ' = $1;';
                plv8.elog(NOTICE, 'sql =', sql, value[pkey]);
          rows = plv8.execute(sql, [value[pkey]]);
          if (rows.length) {
            sql = this.prepareUpdate(ext, value);
          } else {
            sql = this.prepareInsert(ext, value);
          }
          plv8.execute(sql.statement, sql.values); 
        }
      }

      /* okay, now lets handle arrays */
      this.commitArrays(orm, value); 
    },

    /**
     Use an orm object and a record and build an update statement. It
     returns an object with a table name string, expressions array and
     insert statement string that can be executed.

     The optional params object includes objects columns, expressions
     that can be cumulatively added to the result.

     @params {Object} Orm
     @params {Object} Record
     @params {Object} Params - optional
     @returns {Object}
   */
    prepareUpdate: function (orm, record, params) {
      var count, 
        pkey,
        columnKey,
        expressions, 
        prop,
        ormp,
        attr,
        type,
        qprop,
        toOneOrm,
        toOneKey,
        toOneProp,
        toOneVal,
        keyValue;
      params = params || { 
        table: "", 
        expressions: [],
        values: []
      }
      params.table = orm.table;
      count = params.values.length + 1;

      if (orm.relations) {
        /* extension */
        pkey = orm.relations[0].inverse;
        columnKey = orm.relations[0].column;
      } else {
        /* base */
        pkey = XT.Orm.primaryKey(orm);
        columnKey = XT.Orm.primaryKey(orm, true);
      }

      /* build up the content for update of this record */
      for (i = 0; i < orm.properties.length; i++) {
        ormp = orm.properties[i];
        prop = ormp.name;
        attr = ormp.attr ? ormp.attr : ormp.toOne ? ormp.toOne : ormp.toMany;
        type = attr.type;
        qprop = '"' + attr.column + '"';

        if (record[prop] !== undefined && !ormp.toMany) {
          /* handle encryption if applicable */
          if(attr.isEncrypted) {
            if(encryptionKey) {
              record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                             .replace(/{value}/, record[prop])
                             .replace(/{encryptionKey}/, encryptionKey);
              params.values.push(record[prop]);
              params.expressions.push(qprop.concat(" = ", "$", count));
              count++;
            } else {
              throw new Error("No encryption key provided.");
            }
          } else if (ormp.name !== pkey) {
            /* Unfortuantely dates and nulls aren't handled correctly by parameters */
            if (record[prop] === null) {
              params.expressions.push(qprop.concat(' = null'));
            } else if (attr.type === 'Date') {
              params.expressions.push(qprop.concat(" = '" + record[prop] + "'"));
            } else {
              params.values.push(record[prop]);
              params.expressions.push(qprop.concat(" = ", "$", count));
              count++;
            }
          }
        }
      }
      keyValue = typeof record[pkey] === 'string' ? "'" + record[pkey] + "'" : record[pkey];
      expressions = params.expressions.join(', ');
      params.statement = 'update ' + params.table + ' set ' + expressions + ' where ' + columnKey + ' = ' + keyValue + ';';
      if (DEBUG) { plv8.elog(NOTICE, 'sql =', params.statement); }
      if (DEBUG) { plv8.elog(NOTICE, 'values =', params.values); }
      return params;
    },

    /**
      Commit deletion to the database 

      @param {String} name space qualified record type
      @param {Object} the record to be committed
    */
    deleteRecord: function(key, value) {
      var record = XT.decamelize(value), sql = '',
        orm = XT.Orm.fetch(key.beforeDot(),key.afterDot()),
        sql,
        nameKey,
        columnKey,
        prop,
        ormp,
        childKey,
        values,
        ext,
        i;
          
      /* Delete children first */
     for (prop in record) {
       ormp = XT.Orm.getProperty(orm, prop);

       /* if the property is an array of objects they must be records so delete them */
       if (ormp.toMany && ormp.toMany.isNested) {
         childKey = key.beforeDot() + '.' + ormp.toMany.type,
         values = record[prop]; 
         for (i = 0; i < values.length; i++) {
            this.deleteRecord(childKey, values[i]);
         }
       }
     }   

     /* Next delete from extension tables */
     for (i = 0; i < orm.extensions.length; i++) {
       ext = orm.extensions[i];
       if (ext.table !== orm.table &&
           !ext.isChild) {
         columnKey = ext.relations[0].column;
         nameKey = ext.relations[0].inverse;     
         sql = 'delete from '+ ext.table + ' where ' + columnKey + ' = $1;';
         plv8.execute(sql, [record[nameKey]]);
       }
     }

      /* Now delete the top */
      nameKey = XT.Orm.primaryKey(orm),
      columnKey = XT.Orm.primaryKey(orm, true);
      sql = 'delete from '+ orm.table + ' where ' + columnKey + ' = $1;';
      if(DEBUG) plv8.elog(NOTICE, 'sql =', sql,  record[nameKey]);
      
      /* commit the record */
      plv8.execute(sql, [record[nameKey]]); 
    },

    /** 
      Decrypts properties where applicable.

      @param {String} name space
      @param {String} type
      @param {Object} record
      @param {Object} encryption key
      @returns {Object} 
    */
    decrypt: function (nameSpace, type, record, encryptionKey) {
      var orm = XT.Orm.fetch(nameSpace, type);
      for(var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop.camelize());

        /* decrypt property if applicable */
        if(ormp && ormp.attr && ormp.attr.isEncrypted) {
          if(encryptionKey) {
            sql = "select formatbytea(decrypt(setbytea($1), setbytea($2), 'bf')) as result";
            record[prop] = plv8.execute(sql, [record[prop], encryptionKey])[0].result;
          } else {
            record[prop] = '**********'
          }
            
        /* check recursively */
        } else if (ormp.toMany && ormp.toMany.isNested) {
          this.decrypt(nameSpace, ormp.toMany.type, record[prop][i]);
        }
      }
      return record;
    },

    /**
      Fetch an array of records from the database.

      @param {String} record type
      @param {Object} conditions
      @param {Object} parameters
      @param {String} order by - optional
      @param {Number} row limit - optional
      @param {Number} row offset - optional
      @returns Array
    */
    fetch: function (recordType, parameters, orderBy, rowLimit, rowOffset) {
      var nameSpace = recordType.beforeDot(),
        type = recordType.afterDot(),
        table = (nameSpace + '.' + type).decamelize(),
        orm = XT.Orm.fetch(nameSpace, type),
        key = XT.Orm.primaryKey(orm),
        limit = rowLimit ? 'limit ' + rowLimit : '',
        offset = rowOffset ? 'offset ' + rowOffset : '',
        recs = null,
        prop,
        i,
        n,
        attr,
        parts,
        list = [],
        clause = this.buildClause(nameSpace, type, parameters),
        sql = "select * from {table} where {key} in " +
              "(select {key} from {table} where {conditions} {orderBy} {limit} {offset}) " +
              "{orderBy}";

      /* Massage ordeBy with quoted identifiers */
      if (orderBy) {
        for (i = 0; i < orderBy.length; i++) {
          /* handle path case */
          if (orderBy[i].attribute.indexOf('.') > -1) {
            attr = "";
            parts = orderBy[i].attribute.split('.');
            for (n = 0; n < parts.length; n++) {
              prop = XT.Orm.getProperty(orm, parts[n]);
              if (!prop) {
                plv8.elog(ERROR, 'Attribute not found in map: ' + parts[n]);
              }
              attr += '"' + parts[n] + '"';
              if (n < parts.length - 1) {
                attr = "(" + attr + ").";
                orm = XT.Orm.fetch(nameSpace, prop.toOne.type); 
              }
            }
          /* normal case */
          } else {
            prop = XT.Orm.getProperty(orm, orderBy[i].attribute);
            if (!prop) {
              plv8.elog(ERROR, 'Attribute not found in map: ' + orderBy[i].attribute);
            }
            attr = '"' + orderBy[i].attribute + '"';
          }
          if (orderBy[i].isEmpty) {
            attr = "length(" + attr + ")=0";
          }       
          if (orderBy[i].descending) {
            attr += " desc";
          }
          list.push(attr);
        }
      }
      orderBy = list.length ? 'order by ' + list.join(',') : '';

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) { return []; };

      /* query the model */
      sql = sql.replace(/{table}/g, table)
               .replace(/{key}/g, key)
               .replace('{conditions}', clause.conditions)
               .replace(/{orderBy}/g, orderBy)
               .replace('{limit}', limit)
               .replace('{offset}', offset);
      if(DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }
      recs = plv8.execute(sql, clause.parameters);
      for (var i = 0; i < recs.length; i++) {  	
        recs[i] = this.decrypt(nameSpace, type, recs[i]);	  	
      }
      return recs;
    },

    /**
      Retreives a record from the database. If the user does not have appropriate privileges an
      error will be thrown unless the `silentError` option is passed.

      If `context` is passed as an option then a record will only be returned if it exists in the context record,
      which itself must be accessible by the effective user. Context is an object that requires the following
      properties.

      recordType: The namespace qualifed object name the record exists in. 
      value: The value of the primary key.
      relation: The name of the attribute on the recordType to which this record is related.
      
      @param {String} namespace qualified record type
      @param {Number} record id
      @param {String} encryption key
      @param {Object} options - support options are context and silentError
      @returns Object
    */
    retrieveRecord: function(recordType, id, encryptionKey, options) {
      options = options || {};
      var nameSpace = recordType.beforeDot(), 
        type = recordType.afterDot(),
        map = XT.Orm.fetch(nameSpace, type),
        ret, sql, pkey = XT.Orm.primaryKey(map),
        context = options.context,
        join = "",
        params = {};
      if(!pkey) throw new Error('No primary key found for {recordType}'.replace(/{recordType}/, recordType));
      if (XT.typeOf(id) === 'string') {
        id = "'" + id + "'";
      }

      /* Context means search for this record inside another */
      if (context) {
        context.nameSpace = context.recordType.beforeDot();
        context.type = context.recordType.afterDot()
        context.map = XT.Orm.fetch(context.nameSpace, context.type);
        context.prop = XT.Orm.getProperty(context.map, context.relation);
        context.fkey = context.prop.toMany.inverse;
        context.pkey = XT.Orm.primaryKey(context.map);
        params.attribute = context.pkey;
        params.value = context.value;
        join = 'join {recordType} on ({table1}."{pkey}"={table2}."{fkey}")';
        join = join.replace(/{recordType}/, context.recordType.decamelize())
                   .replace(/{table1}/, context.type.decamelize())
                   .replace(/{pkey}/, context.pkey)
                   .replace(/{table2}/, type.decamelize())
                   .replace(/{fkey}/, context.fkey);   
      }

      /* validate - don't bother running the query if the user has no privileges */
      if(!context && !this.checkPrivileges(nameSpace, type)) {
        if (options.silentError) {
          return false;
        } else {
          throw new Error("Access Denied.");
        }
      }

      sql = 'select {table}.* from {schema}.{table} {join} where {table}."{primaryKey}" = {id};'
            .replace(/{schema}/, nameSpace.decamelize())
            .replace(/{table}/g, type.decamelize())
            .replace(/{join}/, join)
            .replace(/{primaryKey}/, pkey)
            .replace(/{id}/, id);

      /* query the map */
      if(DEBUG) plv8.elog(NOTICE, 'sql = ', sql);
      ret = plv8.execute(sql)[0];

      if (!context) {
        /* check privileges again, this time against record specific criteria where applicable */
        if(!this.checkPrivileges(nameSpace, type, ret)) {
          if (options.silentError) {
            return false;
          } else {
            throw new Error("Access Denied.");
          }
        }
        
        /* decrypt result where applicable */
        ret = this.decrypt(nameSpace, type, ret, encryptionKey);
      }

      /* return the results */
      return ret || {};
    },

    /**
      Returns a array of key value pairs of metric settings that correspond with an array of passed keys.
      
      @param {Array} array of metric names
      @returns {Array} 
    */
    retrieveMetrics: function (keys) {
      var sql = 'select metric_name as setting, metric_value as value '
              + 'from metric '
              + 'where metric_name in ({keys})',
        qry,
        ret = {},
        prop; 
      for (var i = 0; i < keys.length; i++) keys[i] = "'" + keys[i] + "'";
      sql = sql.replace(/{keys}/, keys.join(','));
      qry =  plv8.execute(sql);

      /* recast where applicable */
      for (var i = 0; i < qry.length; i++) {
        prop = qry[i].setting;
        if(qry[i].value === 't') { ret[prop] = true; }
        else if(qry[i].value === 'f') { ret[prop] = false }
        else if(!isNaN(qry[i].value)) { ret[prop] = qry[i].value - 0; }
        else { ret[prop] = qry[i].value; }
      }
      return ret;
    }
    
  }

$$ );

