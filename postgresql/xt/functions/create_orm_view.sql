create or replace function xt.create_orm_view(view_name text) returns void as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var SELECT = 'select {columns} from {table} where {conditions}'
      INSERT = 'insert into {table} ({columns}) values ({expressions});',
      UPDATE = 'update {table} set {expressions} where {conditions};',
      DELETE = 'delete from {table} where {conditions};',
      CREATE_RULE = 'create rule {name} as on {event} to {table} do instead {command};',

  // ..........................................................
  // METHODS
  //
  
  processOrm = function(orm) {
    var props = orm.properties,
        viewName = view_name,
        tblAlias = orm.table === base.table ? 't1' : 't' + tbl, 
        pKeyCol, pKeyAlias,
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

      /* process toOne */
      if(props[i].toOne && props[i].toOne.column) {
        var toOne = props[i].toOne,
            table = base.nameSpace.decamelize() + '.' + toOne.type.decamelize(),
            type = table.replace((/\w+\./i),''),
            inverse = toOne.inverse ? toOne.inverse.decamelize() : 'id',
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

      /* process toMany */
      if(props[i].toMany) {
        var toMany = props[i].toMany,
            table = orm.nameSpace + '.' + toMany.type.decamelize(),
            type = toMany.type.decamelize(), 
            column = toMany.isNested ? type : XT.getPrimaryKey(XT.getORM(orm.nameSpace, toMany.type)),
            inverse = toMany.inverse ? toMany.inverse.decamelize() : 'id',
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
                inverse = rel.inverse ? rel.inverse : 'id',
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
          value = '{state}.id';
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
  rules = [], query = '', tbl = 1 - 0, sql, base, extensions = [],
  nameSpace = view_name.replace(/\.\w+/i, '').toUpperCase(), 
  type = view_name.replace(/\w+\./i, '').classify();
  
  /* base orm */
  sql = 'select orm_id as id, orm_json as json '
      + 'from xt.orm '
      + 'where orm_namespace = $1 '
      + ' and orm_type = $2 '
      + ' and orm_active '
      + ' and not orm_ext ';

  qry = plv8.execute(sql, [nameSpace, type]);
  
  if(!qry.length) throw new Error('No base object relational map found for view ' + view_name);
  
  base = JSON.parse(qry[0].json);

  processOrm(base);

  /* orm extensions */
  sql = 'select orm_id as id, orm_json as json '
      + 'from xt.orm '
      + 'where orm_namespace = $1 '
      + ' and orm_type = $2 '
      + ' and orm_active '
      + ' and orm_ext '
      + 'order by orm_seq, orm_id ';

  extensions = plv8.execute(sql, [nameSpace, type]);

  for(var i = 0; i < extensions.length; i++) {
    processOrm(JSON.parse(extensions[i].json));
  }
  
  /* Validate colums */
  if(!cols.length) throw new Error('There must be at least one column defined on the map.');
 
  /* Build query to create the new view */
  query = 'create view {name} as select {columns} from {tables} {where} {order};'
          .replace(/{name}/, view_name)
          .replace(/{columns}/, cols.join(', '))
          .replace(/{tables}/, tbls.join(' '))
          .replace(/{where}/, clauses.length ? 'where ' + clauses.join(' and ') : '')
          .replace(/{order}/, orderBy.length ? 'order by ' + orderBy.join(' , ') : '');

  if(DEBUG) plv8.elog(NOTICE, 'query', query);

  plv8.execute(query);

  /* Add comment */
  query = "comment on view {name} is '{comments}'"
          .replace(/{name}/, view_name)
          .replace(/{comments}/, comments); 
          
  plv8.execute(query);
  
  /* Apply the rules */
  for(var i = 0; i < rules.length; i++) {
    if(DEBUG) plv8.elog(NOTICE, 'rule', rules[i]);
    
    plv8.execute(rules[i]);
  }

  /* Grant access to xtrole */
  query = 'grant all on {view} to xtrole'
          .replace(/{view}/, view_name);
          
  plv8.execute(query); 

$$ language plv8;
