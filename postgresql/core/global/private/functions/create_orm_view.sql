create or replace function private.create_orm_view(orm_name text) returns void as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var INSERT_RULE = 'create rule {name} as on insert to {table} do instead {command};';

  // ..........................................................
  // METHODS
  //
   
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
  
  processOrm = function(orm) {
    var props = orm.properties,
        view_name = orm.nameSpace ? orm.nameSpace.toLowerCase() + '.' + orm_name : '',
        tblAlias = orm.table === base.table ? 't1' : 't' + tbl, 
        pKeyCol, pKeyAlias,
        insTgtCols = [], insSrcCols = [], updCols = [], delCascade = [], 
        canCreate = orm.canCreate !== false ? true : false,
        canUpdate = orm.canUpdate !== false ? true : false,
        canDelete = orm.canDelete !== false ? true : false;

    for(var i = 0; i < props.length; i++) {
      var col, alias = decamelize(props[i].name);
      
      /* process attributes */
      if(props[i].attr && props[i].attr.column) {
        var isVisible = props[i].attr.isVisible !== false ? true : false,
            isEditable = props[i].attr.isEditable !== false ? true : false,
            isPrimaryKey = props[i].attr.isPrimaryKey ? true : false;

        if(isVisible) {
          /* if it is composite, assign the table itself */
          col = decamelize(props[i].attr.type) === orm.table ? tblAlias : tblAlias + '.' + props[i].attr.column;
          col = col.concat(' as "', alias, '"');
          cols.push(col);
        }

        /* for update and delete rules */
        if(isPrimaryKey) {
          pKeyCol = props[i].attr.column;
          pKeyAlias = alias;
        }

        /* handle fixed value */
        if(props[i].attr.value) {
          var value = isNaN(props[i].attr.value - 0) ? "'" + props[i].attr.value + "'" : props[i].attr.value;

          /* for select */     
          clauses.push(props[i].attr.column + ' = ' + value);
          
          /* for insert */
          insSrcCols.push(value);
        } else insSrcCols.push('new.' + alias);

        /* for insert rule */
        insTgtCols.push(props[i].attr.column);

        /* for update rule */
        if(isVisible && isEditable && !isPrimaryKey) updCols.push(props[i].attr.column + ' = new.' + alias);
      }

      /* process toOne */
      if(props[i].toOne && props[i].toOne.column) {
        var table = decamelize(props[i].toOne.type),
            type = table.replace((/\w+\./i),''),
            inverse = props[i].toOne.inverse ? props[i].toOne.inverse : 'guid',
            isEditable = props[i].toOne.isEditable !== false ? true : false;
            
        col = '(select ' + type 
            + ' from ' + table 
            + ' where ' + type + '.' + inverse + ' = ' + tblAlias + '.' + props[i].toOne.column + ') as "' + alias + '"';
            
        cols.push(col);

        /* for insert rule */
        insTgtCols.push(props[i].toOne.column);
        insSrcCols.push('(new.' + alias + ').' + inverse);

        /* for update rule */
        if(isEditable) updCols.push(props[i].toOne.column + ' = (new.' + alias + ').' + inverse );
      }

      /* process toMany */
      if(props[i].toMany && props[i].toMany.column) {
        var table = decamelize(props[i].toMany.type),
            type = table.replace((/\w+\./i),''),
            inverse = props[i].toMany.inverse ? props[i].toMany.inverse : 'guid';
            
        col = 'array(select ' + type 
            + ' from ' + table 
            + ' where ' + type + '.' + inverse + ' = ' + tblAlias + '.' + props[i].toMany.column + ') as "' + alias + '"';
            
        cols.push(col);
    
        /* build array for delete cascade */
        if(props[i].toMany.isMaster &&
           props[i].toMany.deleteDelegate && 
           props[i].toMany.deleteDelegate.table && 
           props[i].toMany.deleteDelegate.relations) {

          var rel = props[i].toMany.deleteDelegate.relations,
              table = props[i].toMany.deleteDelegate.table,
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

          delCascade.push('delete from ' + table + ' where ' + conditions.join(' and ') + ';');
        } else if (props[i].toMany.isMaster) { 
          delCascade.push('delete from ' + table + ' where ' + type + '.' + inverse  + ' = ' + 'old.{pKeyAlias};'); 
        }
      }
    }

    /* build crud rules */
    var inspre = 'create rule {name} as on insert to ' + view_name + ' do instead ';
        updpre = 'create rule {name} as on update to ' + view_name + ' do instead ';
        delpre = 'create rule {name} as on delete to ' + view_name + ' do instead ';

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
          rule = INSERT_RULE.replace(/{name}/,'"_UPSERT_' + tblAlias.toUpperCase() + '"')
                            .replace(/{table}/, view_name)
                            .replace(/{where}/, '')
                            .replace(/{command}/, 'update {table} set {expressions} where {conditions}'
                            .replace(/{table}/, orm.table)
                            .replace(/{expressions}/, updCols.join(','))
                            .replace(/{conditions}/, conditions.join(' and '))
                            .replace(/{state}/, 'new'));
        } else {
          rule = INSERT_RULE.replace(/{name}/,'"_INSERT_' + tblAlias.toUpperCase() + '"')
                            .replace(/{table}/, view_name)
                            .replace(/{where}/, '')
                            .replace(/{command}/, 'insert into {table} ({columns}) values ({expressions})'
                            .replace(/{table}/, orm.table)
                            .replace(/{columns}/, upsTgtCols.join(',') + ',' + insTgtCols.join(','))
                            .replace(/{expressions}/, upsSrcCols.join(',').replace(/{state}/, 'new') + ',' + insSrcCols.join(',')));
        }
        
        rules.push(rule); 
      }

      /* update rules for extensions */
      if(canUpdate && updCols.length) {
        var rule;

        if(!orm.isChild && base.table !== orm.table) {
          rule = updpre.replace(/{name}/,'"_UPSERT_' + tblAlias.toUpperCase() + '"') 
               + 'insert into ' + orm.table + ' (' + upsTgtCols.join(',') + ',' + insTgtCols.join(',') + ') ' 
               + 'select ' + upsSrcCols.join(',').replace(/{state}/, 'old') + ',' + insSrcCols.join(',') 
               + ' where ( select count(*) = 0 from '
               + orm.table + ' where ' + conditions.join(' and ').replace(/{state}/, 'old') + ' )';

          rules.push(rule);
        }

        rule = updpre.replace(/{name}/,'"_UPDATE_' + tblAlias.toUpperCase() + '"') 
             + 'update ' + orm.table + ' set ' + updCols.join(',')
             + ' where ' + conditions.join(' and ').replace(/{state}/, 'old');
               
        rules.push(rule); 
      }

      /* only delete where circumstances allow */
      if(canDelete && !orm.isChild && base.table !== orm.table) {
        var rule = delpre.replace(/{name}/,'"_DELETE_' + tblAlias.toUpperCase() + '"') 
                 + ' delete from '+ orm.table + ' where ' + conditions.join(' and ').replace(/{state}/, 'old');

        rules.push(rule);
      }

    /* base orm */
    } else {
      /* table */
      tbls.push(orm.table + ' t' + tbl);
          
      if(orm.privileges || orm.isNested) {
        var rule;
        
        /* insert rule */
        rule = canCreate && insSrcCols.length ? 
               INSERT_RULE.replace(/{name}/, '"_INSERT"')
                          .replace(/{table}/, view_name)
                          .replace(/{where}/, '')
                          .replace(/{command}/, 'insert into {table} ({columns}) values ({expressions})'
                          .replace(/{table}/, orm.table)
                          .replace(/{columns}/, insTgtCols.join(',')) 
                          .replace(/{expressions}/, insSrcCols.join(','))) :
               INSERT_RULE.replace(/{name}/, '"_INSERT"')
                          .replace(/{table}/, view_name)
                          .replace(/{where}/, '')
                          .replace(/{command}/,'nothing');


        rules.push(rule.replace(/{name}/,'"_INSERT"'));

        /* update rule */
        rule = canUpdate && pKeyCol && updCols.length ? 
               updpre + 'update ' + orm.table + ' set ' + updCols.join(',') + ' where ' + pKeyCol + ' = old.' + pKeyAlias :
               updpre + 'nothing;';

        rules.push(rule.replace(/{name}/,'"_UPDATE"')); 

        /* delete rule */
        if(canDelete && pKeyCol) {
          rule = delpre + '(' + delCascade.join(' ').replace(/{pKeyAlias}/g, pKeyAlias) 
               + ' delete from '+ orm.table + ' where ' + pKeyCol + ' = old.'+ pKeyAlias + ');';
        }
        else rule = delpre + 'nothing;';

        rules.push(rule.replace(/{name}/,'"_DELETE"'));

      /* must be non-updatable view */
      } else { 
        rules.push(inspre + 'nothing;');
        rules.push(updpre + 'nothing;');
        rules.push(delpre + 'nothing;');
      }
    }

    if(orm.order) {
      for(var i = 0; i < orm.order.length; i++) {
        orderBy.push(tblAlias + '.' + orm.order);
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
  }

  // ..........................................................
  // PROCESS
  //

  var cols = [], tbls = [], clauses = [], orderBy = [],
  comments = 'System view generated by object relation maps: WARNING! Do not make changes, add rules or dependencies directly to this view!',
  rules = [], query = '', tbl = 1 - 0, sql, base, extensions = [],
  debug = false;
  
  /* base orm */
  sql = 'select orm_id as id, orm_json as json '
      + 'from private.orm '
      + 'where orm_name = $1 '
      + ' and orm_active '
      + ' and not orm_ext ';

  qry = executeSql(sql, [orm_name]);
  
  if(!qry.length) throw new Error('No base object relational map found for ' + orm_name);
  
  base = JSON.parse(qry[0].json);

  processOrm(base);

  /* orm extensions */
  sql = 'select orm_id as id, orm_json as json '
      + 'from private.orm '
      + 'where orm_name = $1 '
      + ' and orm_active '
      + ' and orm_ext '
      + 'order by orm_seq, orm_id ';

  extensions = executeSql(sql, [orm_name]);

  for(var i = 0; i < extensions.length; i++) {
    processOrm(JSON.parse(extensions[i].json));
  }
  
  /* Validate colums */
  if(!cols.length) throw new Error('There must be at least one column defined on the map.');
 
  /* Build query to create the new view */
  query = query.concat( 'create view ' + base.nameSpace.toLowerCase() + '.' + orm_name, ' as ',
                        'select ', cols.join(', '),
                        ' from ', tbls.join(' '));
                     
  if(orderBy.length) query = query.concat(' order by ', orderBy.join(' , '));

  if(debug) print(NOTICE, 'query', query);

  executeSql(query);

  /* Add comment */
  query = "comment on view xm." + orm_name + " is '" + comments + "'"; 
  executeSql(query);
  
  /* Apply the rules */
  for(var i = 0; i < rules.length; i++) {
    if(debug) print(NOTICE, 'rule', rules[i]);
    
    executeSql(rules[i]);
  }

 /* Grant access to xtrole */
  query = 'grant all on xm.' + orm_name + ' to xtrole';
  executeSql(query); 

$$ language plv8;