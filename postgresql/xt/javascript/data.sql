select xt.install_js('XT','Data','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

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
     var orm = XT.Orm.fetch(nameSpace, type),
       privileges = orm.privileges,
       properties,
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
       pcond = "",
       prop;

      ret.conditions = "";
      ret.parameters = [];

      /* handle parameters */
      if (parameters) {
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
            break;
          default:
            plv8.elog(ERROR, 'Invalid operator: ' + op);
          };

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
            orClause.push(clause.join(''));
          }
          clauses.push('(' + orClause.join(' or ') + ')');
          cnt++;
          ret.parameters.push(param.value);
        }
      }

      /* handle privileges */
      if ((privileges &&
         (!privileges.all || (privileges.all &&
         (!this.checkPrivilege(privileges.all.read) && 
          !this.checkPrivilege(privileges.all.update)))) &&
           privileges.personal &&
          (this.checkPrivilege(privileges.personal.read) || 
           this.checkPrivilege(privileges.personal.update)))) {
        properties = privileges.personal.properties, conds = [], col;
        for(i = 0; i < properties.length; i++) {
          col = map.properties.findProperty('name', properties[i]).toOne ? "(" + properties[i] + ").username" : properties[i];
          conds.push(col);
        }
        pcond = "'" + this.currentUser() + "' in (" + conds.join(",") + ")";
      }
      ret.conditions = clauses.length ? '(' + clauses.join(' and ') + ')' : ret.conditions;
      ret.conditions = pcond.length ? (clauses.length ? ret.concat(' and ', pcond) : pcond) : ret.conditions;
      ret.conditions = ret.conditions || true;
      return ret;
    },

    /**
      Queries whether the current user has been granted the privilege passed.

      @param {String} privilege
      @returns {Boolean}
    */
    checkPrivilege: function (privilege) {
      var ret = privilege;
      if (typeof privilege === 'string') {
        if(!this._grantedPrivs) this._grantedPrivs = [];
        if(this._grantedPrivs.contains(privilege)) return true;  
        var res = plv8.execute("select checkPrivilege($1) as is_granted", [ privilege ]),
          ret = res[0].is_granted;
        /* cache the result locally so we don't requery needlessly */
        if(ret) this._grantedPrivs.push(privilege);
      }
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
          var i = 0, isGranted = false,
              props = privileges.personal.properties;
          while(!isGranted && i < props.length) {
            var prop = props[i];
            isGranted = record[prop] && record[prop].username === that.currentUser();
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
      plv8.execute(sql.statement); 

      /* handle extensions on other tables */
      for (i = 0; i < orm.extensions.length; i++) {
        if (orm.extensions[i].table !== orm.table && 
           !orm.extensions[i].isChild) {
          sql = this.prepareInsert(orm.extensions[i], value);
          plv8.execute(sql.statement); 
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
      var column,
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
        expressions: []
      }
      params.table = orm.table;

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
          value = typeof attr.value === 'string' ? "'" + attr.value + "'" : attr.value;
          params.columns.push('"' + attr.column + '"');
          params.expressions.push(value);

        /* handle passed values */
        } else if (record[prop] !== undefined && !ormp.toMany) {
          params.columns.push('"' + attr.column + '"');

          if (attr.isEncrypted) {
            if (encryptionKey) {
              record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                             .replace(/{value}/, record[prop])
                             .replace(/{encryptionKey}/, encryptionKey);
              params.expressions.push(record[prop]);
            } else { 
              throw new Error("No encryption key provided.");
            }
          } else if (record[prop] !== null) { 
            if (ormp && ormp.toOne && ormp.toOne.isNested) { 
              toOneOrm = XT.Orm.fetch(orm.nameSpace, ormp.toOne.type);
              toOneKey = XT.Orm.primaryKey(toOneOrm);
              toOneProp = XT.Orm.getProperty(toOneOrm, toOneKey);
              toOneVal = toOneProp.attr.type === 'String' ?
                "'" + record[prop][toOneKey] + "'" : record[prop][toOneKey];
              params.expressions.push(toOneVal);
            } else if (type === 'String' || type === 'Date') { 
              params.expressions.push("'" + record[prop] + "'");
            } else {
              params.expressions.push(record[prop]);
            }
          } else {
            params.expressions.push('null');
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
      plv8.execute(sql.statement); 

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
          plv8.execute(sql.statement); 
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
      var pkey,
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
        expressions: []
      }
      params.table = orm.table;

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
              params.expressions.push(qprop.concat(" = ", record[prop]));
            } else {
              throw new Error("No encryption key provided.");
            }
          } else if (ormp.name !== pkey) {
            if (record[prop] !== null) {
              if (ormp.toOne && ormp.toOne.isNested) {
                toOneOrm = XT.Orm.fetch(orm.nameSpace, ormp.toOne.type);
                toOneKey = XT.Orm.primaryKey(toOneOrm);
                toOneProp = XT.Orm.getProperty(toOneOrm, toOneKey);
                toOneVal = toOneProp.attr.type === 'String' ?
                  "'" + record[prop][toOneKey] + "'" : record[prop][toOneKey];
                params.expressions.push(qprop.concat(" = ", toOneVal));
              } else if (type === 'String' || type === 'Date') { 
                params.expressions.push(qprop.concat(" = '", record[prop], "'"));
              } else {
                params.expressions.push(qprop.concat(" = ", record[prop]));
              }
            } else {
              params.expressions.push(qprop.concat(' = null'));
            }
          }
        }
      }
      keyValue = typeof record[pkey] === 'string' ? "'" + record[pkey] + "'" : record[pkey];
      expressions = params.expressions.join(', ');
      params.statement = 'update ' + params.table + ' set ' + expressions + ' where ' + columnKey + ' = ' + keyValue + ';';
      if (DEBUG) { plv8.elog(NOTICE, 'sql =', params.statement); }
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
      Returns the currently logged in user's username.
      
      @returns {String} 
    */
    currentUser: function () {
      var res;
      if(!this._currentUser) {
        res = plv8.execute("select getEffectiveXtUser() as curr_user");

        /* cache the result locally so we don't requery needlessly */
        this._currentUser = res[0].curr_user;
      }
      return this._currentUser;
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
        sql = "select * from {table} where {conditions} {orderBy} {limit} {offset}";

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
      if(!this.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

      /* query the model */
      sql = sql.replace('{table}', table)
               .replace('{conditions}', clause.conditions)
               .replace('{orderBy}', orderBy)
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
      Retreives a single record from the database. If the user does not have appropriate privileges an
      error will be thrown.
      
      @param {String} namespace qualified record type
      @param {Number} record id
      @param {String} encryption key
      @returns Object
    */
    retrieveRecord: function(recordType, id, encryptionKey, options) {
      return this.retrieveRecords(recordType, [id], encryptionKey, options)[0] || {}; 
    },

    /**
      Retreives an array of records from the database. If the user does not have appropriate privileges an
      error will be thrown.
      
      @param {String} namespace qualified record type
      @param {Number} record ids
      @param {String} encryption key
      @returns Object
    */
    retrieveRecords: function(recordType, ids, encryptionKey, options) {
      options = options || {};
      var nameSpace = recordType.beforeDot(), 
          type = recordType.afterDot(),
          map = XT.Orm.fetch(nameSpace, type),
          ret, sql, pkey = XT.Orm.primaryKey(map);
      if(!pkey) throw new Error('No primary key found for {recordType}'.replace(/{recordType}/, recordType));
      for (var i = 0; i < ids.length; i++) {
        if (XT.typeOf(ids[i]) === 'string') {
          ids.splice(i,1,"'"+ids[i]+"'");
        }
      }
      sql = "select * from {schema}.{table} where {primaryKey} in ({ids});"
            .replace(/{schema}/, nameSpace.decamelize())
            .replace(/{table}/, type.decamelize())
            .replace(/{primaryKey}/, pkey)
            .replace(/{ids}/, ids.join(','));

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) {
        if (options.silentError) {
          return false;
        } else {
          throw new Error("Access Denied.");
        }
      }

      /* query the map */
      if(DEBUG) plv8.elog(NOTICE, 'sql = ', sql);
      ret = plv8.execute(sql);

      for (var i = 0; i < ret.length; i++) {
        /* check privileges again, this time against record specific criteria where applicable */
        if(!this.checkPrivileges(nameSpace, type, ret[i])) {
          if (options.silentError) {
            return false;
          } else {
            throw new Error("Access Denied.");
          }
        }
        
        /* decrypt result where applicable */
        ret[i] = this.decrypt(nameSpace, type, ret[i], encryptionKey);
      }

      /* return the results */
      return ret;
    },

    /**
      Returns a array of key value pairs of metric settings that correspond with an array of passed keys.
      
      @param {Array} array of metric names
      @returns {Array} 
    */
    retrieveMetrics: function (keys) {
      var sql = 'select metric_name as setting, metric_value as value '
              + 'from metric '
              + 'where metric_name in ({keys})', ret; 
      for (var i = 0; i < keys.length; i++) keys[i] = "'" + keys[i] + "'";
      sql = sql.replace(/{keys}/, keys.join(','));
      ret =  plv8.execute(sql);

      /* recast where applicable */
      for (var i = 0; i < ret.length; i++) {
        if(ret[i].value === 't') ret[i].value = true;
        else if(ret[i].value === 'f') ret[i].value = false
        else if(!isNaN(ret[i].value)) ret[i].value = ret[i].value - 0;
      }
      return ret;
    }
    
  }

$$ );

