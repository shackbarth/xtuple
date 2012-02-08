create or replace function private.create_orm_view(orm_name text) returns void as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

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
        tblAlias = 't' + tbl, pKeyCol, pKeyAlias,
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
        }
        else insSrcCols.push('new.' + alias);

        /* for insert rule */
        insTgtCols.push(props[i].attr.column);

        /* for update rule */
        if(isVisible && isEditable && !isPrimaryKey) updCols.push(props[i].attr.column + ' = new.' + alias);
      }

      /* process toOne */
      if(props[i].toOne && props[i].toOne.column) {
        var table = decamelize(props[i].toOne.type),
            type = table.replace((/\w+\./i),''),
            inverse = props[i].toOne.inverse ? props[i].toOne.inverse : 'guid';
        col = '(select ' + type + ' from ' + table + ' where ' + type + '.' + inverse + ' = ' + tblAlias + '.' + props[i].toOne.column + ') as "' + alias + '"';

        cols.push(col);
      }

      /* process toMany */
      if(props[i].toMany && props[i].toMany.column) {
        var table = decamelize(props[i].toMany.type),
            type = table.replace((/\w+\./i),''),
            inverse = props[i].toMany.inverse ? props[i].toMany.inverse : 'guid';
            
        col = 'array(select ' + type + ' from ' + table + ' where ' + type + '.' + inverse + ' = ' + tblAlias + '.' + props[i].toMany.column + ') as "' + alias + '"';
        cols.push(col);
        
        /* build array for delete cascade */
        if(props[i].toMany.deleteDelegate && 
           props[i].toMany.deleteDelegate.table && 
           props[i].toMany.deleteDelegate.relations) {
          var clauses = [];

          for(var n = 0; n < props[i].toMany.deleteDelegate.relations.length; n++) {
            var col = props[i].toMany.deleteDelegate.relations[n].column,
                value = props[i].toMany.deleteDelegate.relations[n].inverse ? 
                        'old.' + props[i].toMany.deleteDelegate.relations[n].inverse : 
                        isNaN(props[i].toMany.deleteDelegate.relations[n].value - 0) ? 
                        "'" + props[i].toMany.deleteDelegate.relations[n].value + "'" :
                        props[i].toMany.deleteDelegate.relations[n].value;
                        
            clauses.push(col + ' = ' + value);
          }

          delCascade.push('delete from ' + props[i].toMany.deleteDelegate.table + ' where ' + clauses.join(' and ') + ';');
        } else if(props[i].toMany.deleteCascade !== false) {
          delCascade.push('delete from ' + table + ' where ' + type + '.' + inverse  + ' = ' + 'old.{pKeyAlias};');
        }
        
      }

      /* process relation (extension only) */
      if(orm.isExtension && props[i].relation && props[i].relation.column && props[i].relation.inverse) {
        var join = orm.isRequired ? ' join ' : ' left outer join ';

        join = join + orm.table + ' ' + tblAlias + ' on ' + tblAlias + '.' + props[i].relation.column + ' = t1.' + props[i].relation.inverse;

        tbls.push(join);
      }
    }

    /* process for base orm */
    if(!orm.isExtension) {
      /* table */
      tbls.push(orm.table + ' t' + tbl);

      /* build crud rules */
      var inspre = 'create rule "_CREATE" as on insert to ' + view_name + ' do instead ';
          updpre = 'create rule "_UPDATE" as on update to ' + view_name + ' do instead ';
          delpre = 'create rule "_DELETE" as on delete to ' + view_name + ' do instead ';
          
      if(orm.privileges || orm.isNested) {
        var rule;
        
        /* insert rule */
        rule = canCreate ? 
               inspre + 'insert into ' + orm.table + '(' + insTgtCols.join(',') + ') values (' + insSrcCols.join(',') + ')' :
               inspre + 'nothing;';

        rules.push(rule);

        /* update rule */
        rule = canUpdate && pKeyCol ? 
               updpre + 'update ' + orm.table + ' set ' + updCols.join(',') + ' where ' + pKeyCol + ' = old.' + pKeyAlias :
               updpre + 'nothing;';

        rules.push(rule); 

        /* delete rule */
        if(canDelete && pKeyCol) {
          rule = delpre + '(' + delCascade.join(' ').replace(/{pKeyAlias}/g, pKeyAlias) + ' delete from '+ orm.table + ' where ' + pKeyCol + ' = old.'+ pKeyAlias + ');';
          print(NOTICE, 'del rule', rule);
        }
        else rule = delpre + 'nothing;';

        rules.push(rule);

      /* must be non-updatable view */
      } else { 
        rules.push(inspre + 'nothing;');
        rules.push(updpre + 'nothing;');
        rules.push(delpre + 'nothing;');
      }
    }
    /* handle extension */
    else {
    /*
      if(orm.isRequired) {
        else tbls.push(orm.table);
        
        tbls.push(orm.joinType + ' ' + orm.table + ' on (' + orm.joinClause + ')');
        */
    } ;
 
    /* if(orm.clauses) clauses.push(orm.conditions); */

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

  base = JSON.parse(executeSql(sql, [orm_name])[0].json);

  processOrm(base);
 
  /* orm extensions */
  sql = 'select orm_id as id, orm_json as json '
      + 'from private.orm '
      + 'where orm_name = $1 '
      + ' and orm_active '
      + ' and orm_ext '
      + 'order by orm_seq, orm_id ';

  extensions = executeSql(sql, [orm_name]);
  for(var i; i < extensions.length; i++) {
    processOrm(JSON.parse(extensions[i].json));
  }
  
  /* Validate colums */
  if(!cols.length) throw new Error('There must be at least one column defined on the map.');
 
  /* Build query to create the new view */
  query = query.concat( 'create view ' + base.nameSpace.toLowerCase() + '.' + orm_name, ' as ',
                        'select ', cols.join(', '),
                        ' from ', tbls.join(' '));
                     
  if(clauses.length) query = query.concat(' where ', clauses.join(' and '));
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