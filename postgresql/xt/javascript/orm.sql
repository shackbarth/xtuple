select xt.install_js('XT','Orm','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /**
  @class

  */
  
  XT.Orm = {};

  /** 
  Pass a record type and return an array that describes the view definition with
  an array of items representing respective column definitions.

  @param {String} view name
  @param {String} schema name
  @returns {Object} 
  */
  XT.Orm.viewDefinition = function(viewName, schemaName) {
    var sql = "select attnum, attname, typname, typcategory "
            + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
            + "where c.relname = $1 "
            + "and n.nspname = $2 "
	    + "and n.oid = c.relnamespace "
	    + "and a.attnum > 0 "
	    + "and a.attrelid = c.oid "
	    + "and a.atttypid = t.oid "
	    + "order by attnum";

    return executeSql(sql, [ viewName, schemaName ]);
  }

  /**
  Returns an array of views dependent on the view name passed.

  @param {String} view
  @returns Array
  */
  XT.Orm.viewDependencies = function(view) {
    var rec, viewNames = [], 
        rel = view.afterDot(), 
        nsp = view.beforeDot(),
        sql = 'select distinct relname::text as "viewName" '
            + 'from pg_depend '
            + 'join pg_rewrite on (pg_rewrite.oid=objid) '
            + 'join pg_class c on (c.oid=ev_class) '
            + 'join pg_namespace n on (c.relnamespace=n.oid) '
            + "where (classid='pg_rewrite'::regclass) "
            + " and (refclassid='pg_class'::regclass) "
            + ' and (refobjid::regclass::text = $1) '
            + " and (nspname || '.' || relname != $1) "

    rec = executeSql(sql, [view])

    /*  Loop through view dependencies */
    for(var i = 0; i < rec.length; i++) {
      var viewName = rec[i].viewName,
          res = XT.Orm.viewDependencies(nsp + '.' + viewName);
   
      for(var r = 0; r < res.length; r++) {
        if(viewNames.contains(res[r])) {
          viewNames.splice(viewNames.indexOf(res[r]), 1);
        }
        viewNames.push(res[r]);  
      }
    }

    /* If the view we're on isnt already in the array, prepend the dependency */
    if(!viewNames.contains(view)) viewNames.unshift(view);

    /* Return the dependencies */
    return viewNames;
  }

  /**
  Return an Object Relational Map definition that includes all active extensions.

  @param {String} name space
  @param {String} type
  @param {Boolean} indicate whether to force a refresh of the orm cached result
  @returns {Object}
  */
  XT.Orm.fetch = function(nameSpace, type, refresh) {
    if(!this._maps) this._maps = [];
    
    var ret, recordType = nameSpace + '.'+ type,
        res = refresh ? null : this._maps.findProperty('recordType', recordType);
    
    if(res) ret = res.map;
    else {
     /* get base */
      var sql = 'select orm_json as json '
              + 'from xt.orm '
              + 'where orm_namespace=$1'
              + ' and orm_type=$2'
              + ' and not orm_ext '
              + ' and orm_active ',
          res = executeSql(sql, [ nameSpace, type ]);

      if(!res.length) return false;

      ret = JSON.parse(res[0].json);

      /* get extensions and merge them into the base */
      if(!ret.extensions) ret.extensions = [];
      
      sql = 'select orm_json as json '
              + 'from xt.orm '
              + 'where orm_namespace=$1'
              + ' and orm_type=$2'
              + ' and orm_ext '
              + ' and orm_active '
              + 'order by orm_seq';
      res = executeSql(sql, [ nameSpace, type ]);

      for(var i = 0; i < res.length; i++) {
        var orm = JSON.parse(res[i].json),
            ext = {};

        ext.context = orm.context;
        ext.table = orm.table;
        ext.isChild = orm.isChild;
        ext.relations = orm.relations;
        ext.properties = orm.properties;
        ext.order = orm.order;

        ret.extensions.push(ext);
      }

      /* cache the result so we don't requery needlessly */
      this._maps.push({ "recordType": recordType, "map": ret});
    }

    return ret;
  }

  /**
  Returns the primary key name as designated in an ORM map.

  @param {Object} ORM
  @returns String
  */
  XT.Orm.primaryKey = function(orm) {
    /* find primary key */
    for(var i = 0; i < orm.properties.length; i++) {
      if(orm.properties[i].attr && 
         orm.properties[i].attr.isPrimaryKey)
        return orm.properties[i].name;
    }

    return false;
  }

  /** 
  Returns matching property from the propreties array in an ORM map.

  @param {Object} ORM
  @param {String} property
  @returns Object
  */
  XT.Orm.getProperty = function(orm, property) {
    /* look for property on the first level */
    for(var i = 0; i < orm.properties.length; i++) {
      if(orm.properties[i].name === property)
        return orm.properties[i];
    }

    /* look recursively for property on extensions */
    if(orm.extensions) {
      for(var i = 0; i < orm.extensions.length; i++) {
        var ret = XT.Orm.getProperty(orm.extensions[i], property);
        if(ret) return ret;
      }
    }

    return false;
  }

  /**
  Create the PostgreSQL view and associated rules for an ORM.

  @param {Object} orm
  */
  XT.Orm.createView = function(orm) {
    /* constants */
    var SELECT = 'select {columns} from {table} where {conditions}'
        INSERT = 'insert into {table} ({columns}) values ({expressions})',
        UPDATE = 'update {table} set {expressions} where {conditions}',
        DELETE = 'delete from {table} where {conditions};',
        CREATE_RULE = 'create rule {name} as on {event} to {table} do instead {command};',

    // ..........................................................
    // METHODS
    //

    /* internal function for processing orm and it's extensions recursively */
    processOrm = function(orm) {

      var props = orm.properties,
          tblAlias = orm.table === base.table ? 't1' : 't' + tbl, 
          pKey = orm.isExtension ? orm.properties.findProperty('name', XT.Orm.primaryKey(orm)) : null,
          pKeyCol = pKey ? pKey.attr.column : null, 
          pKeyAlias = pKey ? pKey.name : null,
          insTgtCols = [], insSrcCols = [], updCols = [], delCascade = [], 
          canCreate = orm.privileges && orm.privileges.all && orm.privileges.all.create ? true : false,
          canUpdate = orm.privileges && orm.privileges.all && orm.privileges.all.update ? true : false,
          canDelete = orm.privileges && orm.privileges.all && orm.privileges.all.delete ? true : false,
          toOneJoins = [];

      for(var i = 0; i < props.length; i++) {
        var col, alias = props[i].name.decamelize();

        /* process attributes */
        if(props[i].attr && props[i].attr.column) {
          var attr = props[i].attr,
              isVisible = attr.isVisible !== false ? true : false,
              isEditable = attr.isEditable !== false ? true : false,
              isPrimaryKey = attr.isPrimaryKey ? true : false;

          if(isVisible) {
            /* if it is composite, assign the table itself */
            col = attr.type.decamelize() === orm.table ? tblAlias : tblAlias + '.' + attr.column;
            col = col.concat(' as "', alias, '"');
            cols.push(col);
          }

          /* for update and delete rules */
          if(isPrimaryKey) {
            pKeyCol = attr.column;
            pKeyAlias = alias;
          }

          /* handle fixed value */
          if(attr.value) {
            var value = isNaN(attr.value - 0) ? "'" + attr.value + "'" : attr.value;

            /* for select */     
            clauses.push(attr.column + ' = ' + value);
            
            /* for insert */
            insSrcCols.push(value);
          } else insSrcCols.push('new.' + alias);

          /* for insert rule */
          insTgtCols.push(attr.column);

          /* for update rule */
          if(isVisible && isEditable && !isPrimaryKey) updCols.push(attr.column + ' = new.' + alias);
        }

        /* process toOne - TODO: we should make a transform for this */
        if(props[i].toOne && props[i].toOne.column) {
          var toOne = props[i].toOne,
              table = base.nameSpace.decamelize() + '.' + toOne.type.decamelize(),
              type = table.replace((/\w+\./i),''),
              inverse = toOne.inverse ? toOne.inverse.decamelize() : 'guid',
              isEditable = toOne.isEditable !== false ? true : false,
              toOneAlias, join;

          tbl++;
          toOneAlias = 't' + tbl;
          
          join = '{qualified} join {table} as {toOneAlias} on {toOneAlias}.{inverse} = {tableAlias}.{column}'
                 .replace(/{qualified}/, toOne.isChild ? '' : 'left')
                 .replace(/{table}/, table)
                 .replace(/{toOneAlias}/g, toOneAlias)
                 .replace(/{inverse}/, inverse)
                 .replace(/{tableAlias}/, tblAlias)
                 .replace(/{column}/, toOne.column);

          toOneJoins.push(join);
            
          col = toOneAlias + ' as  "' + alias + '"';
          cols.push(col);

          /* fix any order items referencing this table */
          if(orm.order) {
            for(var o = 0; o < orm.order.length; o++) {
              orm.order[o] = orm.order[o].replace(RegExp(type + ".", "g"), toOneAlias + ".");
            }   
          } 

          /* for insert rule */
          if(isEditable) {
            insTgtCols.push(toOne.column);
            insSrcCols.push('(new.' + alias + ').' + inverse);
          }

          /* for update rule */
          if(isEditable) updCols.push(toOne.column + ' = (new.' + alias + ').' + inverse );
        }

        /* process toMany - TODO: We should make a transform for this */
        if(props[i].toMany) {
          var toMany = props[i].toMany,
              table = base.nameSpace + '.' + toMany.type.decamelize(),
              type = toMany.type.decamelize(), 
              column = toMany.isNested ? type : XT.Orm.primaryKey(XT.Orm.fetch(orm.nameSpace, toMany.type)),
              inverse = toMany.inverse ? toMany.inverse.decamelize() : 'guid',
              sql, col = 'array({select}) as "{alias}"',
              conditions = toMany.column ? type + '.' + inverse + ' = ' + tblAlias + '.' + toMany.column : 'true';

          col = col.replace(/{select}/,
             SELECT.replace(/{columns}/, column)
                   .replace(/{table}/, table) 
                   .replace(/{conditions}/, conditions))
                   .replace(/{alias}/, alias);
              
          cols.push(col);
      
          /* build array for delete cascade */
          if(toMany.isNested &&
             toMany.deleteDelegate && 
             toMany.deleteDelegate.table && 
             toMany.deleteDelegate.relations) {

            var rel = toMany.deleteDelegate.relations,
                table = toMany.deleteDelegate.table,
                conditions = [];

            for(var n = 0; n < rel.length; n++) {
              var col = rel[n].column,
                  value = rel[n].inverse ? 
                          'old.' + rel[n].inverse : 
                          isNaN(rel[n].value - 0) ? 
                          "'" + rel[n].value + "'" :
                          rel[n].value;
                          
              conditions.push(col + ' = ' + value);
            }

            sql = DELETE.replace(/{table}/, table)
                        .replace(/{conditions}/, conditions.join(' and '));

            delCascade.push(sql);
          } else if (toMany.isNested) {
            sql = DELETE.replace(/{table}/, table)
                        .replace(/{conditions}/, type + '.' + inverse  + ' = ' + 'old.{pKeyAlias}'); 
                        
            delCascade.push(sql); 
          }
        }
      }

      /* build crud rules */

      /* process extension */
      if(orm.isExtension) {
        var upsTgtCols = [],
            upsSrcCols = [];

        /* process relations (if different table) */
        if(orm.table !== base.table) {
          if(orm.relations) {
            var join = orm.isChild ? ' join ' : ' left join ',
                conditions = [];

            join = join.concat(orm.table, ' ', tblAlias, ' on ');
      
            for(var i = 0; i < orm.relations.length; i++) {
              var rel = orm.relations[i], value,
                  inverse = rel.inverse ? rel.inverse : 'guid',
                  condition; 
        
              for(var i = 0; i < base.properties.length; i++) {
                if(base.properties[i].name === inverse) {
                  value = 't1.' + base.properties[i].attr.column;
                  break;
                }
              }

              condition = tblAlias + '.' + rel.column + ' = ' + value;
              conditions.push(condition);
            }

            join = join.concat(conditions.join(' and '));

            tbls.push(join);
          }
        }

        tbls = tbls.concat(toOneJoins);
        
        /* build rules */
        conditions = [];
          
        for(var i = 0; i < orm.relations.length; i++) {
          var rel = orm.relations[i], value;

          if(rel.value) {
            value = isNaN(rel.value - 0) ? "'" + rel.value + "'" : rel.value;
          } else if (rel.inverse) {
            value = '{state}.' + rel.inverse;
          } else {
            value = '{state}.guid';
          }
                     
          conditions.push(rel.column + ' = ' + value);
          upsTgtCols.push(rel.column);
          upsSrcCols.push(value);
        }

        /* insert rules for extensions */
        if(canCreate && insSrcCols.length) {
          if(base.table === orm.table) {
            rule = CREATE_RULE.replace(/{name}/,'"_UPSERT_' + tblAlias.toUpperCase() + '"')
                              .replace(/{event}/, 'insert')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 
                        UPDATE.replace(/{table}/, orm.table)
                              .replace(/{expressions}/, updCols.join(','))
                              .replace(/{conditions}/, conditions.join(' and '))
                              .replace(/{state}/, 'new'));
          } else {
            rule = CREATE_RULE.replace(/{name}/,'"_INSERT_' + tblAlias.toUpperCase() + '"')
                              .replace(/{event}/, 'insert')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 
                        INSERT.replace(/{table}/, orm.table)
                              .replace(/{columns}/, upsTgtCols.join(',') + ',' + insTgtCols.join(','))
                              .replace(/{expressions}/, upsSrcCols.join(',')
                              .replace(/{state}/, 'new') + ',' + insSrcCols.join(',')));
          }
          
          rules.push(rule); 
        }

        /* update rules for extensions */
        if(canUpdate && updCols.length) {
          var rule;

          if(!orm.isChild && base.table !== orm.table) {
            /* insert rule for case where record doesn't yet exist */
            rule = CREATE_RULE.replace(/{name}/,'"_UPSERT_' + tblAlias.toUpperCase() + '"')
                              .replace(/{event}/, 'update')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '(' +
                        SELECT.replace(/{columns}/,'count(*) = 0') 
                              .replace(/{table}/, orm.table) 
                              .replace(/{conditions}/, conditions.join(' and ') 
                              .replace(/{state}/, 'old') + ' )') + ')') 
                              .replace(/{command}/, 
                        INSERT.replace(/{table}/, orm.table)
                              .replace(/{columns}/, upsTgtCols.join(',') + ',' + insTgtCols.join(','))
                              .replace(/{expressions}/, upsSrcCols.join(',')
                              .replace(/{state}/, 'old') + ',' + insSrcCols.join(',')));
                             
            rules.push(rule);

            /* update rule for case where record does exist */
            rule = CREATE_RULE.replace(/{name}/,'"_UPDATE_' + tblAlias.toUpperCase() + '"')
                              .replace(/{event}/, 'update')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '(' +
                        SELECT.replace(/{columns}/,'count(*) > 0') 
                              .replace(/{table}/, orm.table) 
                              .replace(/{conditions}/, conditions.join(' and ') 
                              .replace(/{state}/, 'old') + ' )') + ')') 
                              .replace(/{command}/, 
                        UPDATE.replace(/{table}/, orm.table) 
                              .replace(/{expressions}/, updCols.join(','))
                              .replace(/{conditions}/, conditions.join(' and '))
                              .replace(/{state}/, 'old')); 
          } else {  
            rule = CREATE_RULE.replace(/{name}/,'"_UPDATE_' + tblAlias.toUpperCase() + '"')
                              .replace(/{event}/, 'update')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 
                        UPDATE.replace(/{table}/, orm.table) 
                              .replace(/{expressions}/, updCols.join(','))
                              .replace(/{conditions}/, conditions.join(' and '))
                              .replace(/{state}/, 'old'));                      
          }
          rules.push(rule);              
        }

        /* only delete where circumstances allow */
        if(canDelete && !orm.isChild && base.table !== orm.table) {
          rule = CREATE_RULE.replace(/{name}/,'"_DELETE_' + tblAlias.toUpperCase() + '"') 
                            .replace(/{event}/, 'delete')
                            .replace(/{table}/, viewName)
                            .replace(/{where}/, '')
                            .replace(/{command}/,
                      DELETE.replace(/{table}/, orm.table) 
                            .replace(/{conditions}/, conditions.join(' and '))
                            .replace(/{state}/, 'old')); 
                            
          rules.push(rule);
        }

      /* base orm */
      } else {
        var rule;
        
        /* table */
        tbls.unshift(orm.table + ' ' + tblAlias);
        tbls = tbls.concat(toOneJoins);
            
        if(orm.privileges || orm.isNestedOnly) {
          
          /* insert rule */
          if(canCreate && insSrcCols.length) {
            rule = CREATE_RULE.replace(/{name}/, '"_INSERT"')
                              .replace(/{event}/, 'insert')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/,
                        INSERT.replace(/{table}/, orm.table)
                              .replace(/{columns}/, insTgtCols.join(',')) 
                              .replace(/{expressions}/, insSrcCols.join(',')));
          } else {              
            rule = CREATE_RULE.replace(/{name}/, '"_INSERT"')
                              .replace(/{event}/, 'insert')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/,'nothing');
          }
                
          rules.push(rule);

          /* update rule */
          if(canUpdate && pKeyCol && updCols.length) {
            rule = CREATE_RULE.replace(/{name}/,'"_UPDATE"')
                              .replace(/{event}/, 'update')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 
                        UPDATE.replace(/{table}/, orm.table) 
                              .replace(/{expressions}/, updCols.join(','))
                              .replace(/{conditions}/, pKeyCol + ' = old.' + pKeyAlias)); 
          } else {
            rule = CREATE_RULE.replace(/{name}/,'"_UPDATE"')
                              .replace(/{event}/, 'update')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 'nothing'); 
          }

          rules.push(rule); 

          /* delete rule */
          if(canDelete && pKeyCol) {
            rule = CREATE_RULE.replace(/{name}/,'"_DELETE"')
                              .replace(/{event}/, 'delete')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, '(' + delCascade.join(' ')
                              .replace(/{pKeyAlias}/g, pKeyAlias) +
                        DELETE.replace(/{table}/, orm.table) 
                              .replace(/{conditions}/, pKeyCol + ' = old.' + pKeyAlias) + ')');  
          } else {
            rule = CREATE_RULE.replace(/{name}/,'"_DELETE"')
                              .replace(/{event}/, 'delete')
                              .replace(/{table}/, viewName)
                              .replace(/{where}/, '')
                              .replace(/{command}/, 'nothing'); 
          };

          rules.push(rule);

        /* must be non-updatable view */
        } else { 
          rule = CREATE_RULE.replace(/{name}/,'"_INSERT"')
                            .replace(/{event}/, 'insert')
                            .replace(/{table}/, viewName)
                            .replace(/{where}/, '')
                            .replace(/{command}/, 'nothing'); 
                            
          rules.push(rule);

          rule = CREATE_RULE.replace(/{name}/,'"_UPDATE"')
                            .replace(/{event}/, 'update')
                            .replace(/{table}/, viewName)
                            .replace(/{where}/, '')
                            .replace(/{command}/, 'nothing'); 
                            
          rules.push(rule);

          rule = CREATE_RULE.replace(/{name}/,'"_DELETE"')
                            .replace(/{event}/, 'delete')
                            .replace(/{table}/, viewName)
                            .replace(/{where}/, '')
                            .replace(/{command}/, 'nothing'); 
                            
          rules.push(rule);
        }
      }

      /* process and add order by array */
      if(orm.order) {
        for(var i = 0; i < orm.order.length; i++) {
          orm.order[i] = orm.order[i].replace(RegExp(table + ".", "g"), tblAlias + ".");
          orderBy.push(orm.order[i]);
        }
      }

      if(orm.comment) comments = comments.concat('\n', orm.comment);

      tbl++;

      /* add extensions */
      if(orm.extensions) {
        for(var i = 0; i < orm.extensions.length; i++) {
          var ext = orm.extensions[i];

          ext.isExtension = true;
         
          processOrm(ext);
        }
      }
    };

    // ..........................................................
    // PROCESS
    //

    var cols = [], tbls = [], clauses = [], orderBy = [],
    comments = 'System view generated by object relation maps: WARNING! Do not make changes, add rules or dependencies directly to this view!',
    rules = [], query = '', tbl = 1 - 0, sql, base = orm,
    viewName = orm.nameSpace.decamelize() + '.' + orm.type.decamelize();
    
    /* do the heavy lifting here. This recursively processes extensions */
    processOrm(orm);
    
    /* Validate colums */
    if(!cols.length) throw new Error('There must be at least one column defined on the map.');
   
    /* Build query to create the new view */
    query = 'create view {name} as select {columns} from {tables} {where} {order};'
            .replace(/{name}/, viewName)
            .replace(/{columns}/, cols.join(', '))
            .replace(/{tables}/, tbls.join(' '))
            .replace(/{where}/, clauses.length ? 'where ' + clauses.join(' and ') : '')
            .replace(/{order}/, orderBy.length ? 'order by ' + orderBy.join(' , ') : '');

    if(DEBUG) print(NOTICE, 'query', query);

    executeSql(query);

    /* Add comment */
    query = "comment on view {name} is '{comments}'"
            .replace(/{name}/, viewName)
            .replace(/{comments}/, comments); 
            
    executeSql(query);
    
    /* Apply the rules */
    for(var i = 0; i < rules.length; i++) {
      if(DEBUG) print(NOTICE, 'rule', rules[i]);
      
      executeSql(rules[i]);
    }

    /* Grant access to xtrole */
    query = 'grant all on {view} to xtrole'
            .replace(/{view}/, viewName);
            
    executeSql(query); 

  }

$$ );

