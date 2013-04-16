select xt.install_js('XT','Orm','xtuple', $$

  /**
   @class

   An ORM is an Object Relational Mapping that defines the relationship between object oriented type
   definitions and relational tables or views in a database. This implementation is currently designed
   to apply specifically to a PostgreSQL database, but theoretically could be applied to any database
   for which an ORM API is defined to process these definitions.

   In the xTuple PostgreSQL implmentation the installation of ORM files triggers views to be created
   whose structures and rules conform to the definition of the ORM. The ORMs use camel and class case
   conventions when referencing object attributes and snake case conventions when referencing database
   attributes. Because ORMs generates views, these views can in turn be referenced by other ORMs to manage
   a class hierachy. To determine the name of a view created by an ORM simply convert the name space
   qualified type of the object to a snake case schema and view name like so:

   Object Name      Datbase Name
   --------------   ----------------
   XM.Contact       xm.contact
   XM.ToDo          xm.to_do
   XM.ToDoComment   xm.to_do_comment

   ORMs are specifically designed to be extensible so that a database table can be virtually expanded
   without changing the original table definition, while presenting the new data through the ORM API
   as though it were all one unit. This effectively ensures that "core" database definitions
   and custom or 3rd party data extensions are effectively encapuslated from one another. In addition
   ORMs can be activated and deactivated in the xt.orm table so extensions can be "turned off" at
   any time.

   The initial ORM is referred to as the "base" ORM. Additional ORMs can be defined against the
   original base using the same name space and type but giving them a different context name and
   setting the isExtension flag to true. Typically the table on an ORM extension should reside in a
   different database schema where you would create a table with colums that contain data you want to
   "add" to a table in the original schema. The new table should contain a column relation to associate
   with the original (which may also be the primary key for it as well.) When you create an ORM
   extension the new table will be left joined on the original. Any inserts, updates or delete
   actions will propagate results to both the original and the new table automatically.

   Extensions can be created as both completely independent ORM definitions or added to an
   extension array on a base or extension ORM.
  */

  XT.Orm = {};

  /**
   Installs an orm in the database. Installation triggers the creation or update of the supporting
   view.

   @param {String} orm definition
  */
  XT.Orm.install = function(json) {
    var newJson = JSON.parse(json),
      oldJson,
      oldOrm,
      isExtension,
      isRest = newJson.isRest ? newJson.isRest : false,
      sequence,
      nameSpace = newJson.nameSpace,
      type = newJson.type,
      context = newJson.context,
      sql;
    if(!nameSpace) throw new Error("A name space is required");
    if(!type) throw new Error("A type is required");
    if(!context) throw new Error("A context is required");
    sql = 'select orm_id as "id", ' +
          '  orm_json as "json", ' +
          '  orm_ext as "isExtension" ' +
          'from xt.orm ' +
          'where orm_namespace = $1 ' +
          ' and orm_type = $2 ' +
          ' and orm_context = $3';
    oldOrm = plv8.execute(sql, [nameSpace, type, context])[0];
    sequence = newJson.sequence ? newJson.sequence : 0;
    isExtension = newJson.isExtension ? true : false;
    if(oldOrm) {
      oldJson = JSON.parse(oldOrm.json);
      if(oldJson.isSystem && !newJson.isSystem) throw new Error("A system map already exists for" + nameSpace + '.' + type);
      if(oldOrm.isExtension !== isExtension) throw new Error("Can not change extension state for " + nameSpace + '.' + type);
      sql = 'update xt.orm set ' +
            ' orm_json = $1, ' +
            ' orm_seq = $2, ' +
            ' orm_rest = $3 ' +
            'where orm_id = $4';
      plv8.execute(sql, [json, sequence, isRest, oldOrm.id]);
    } else {
      sql = 'insert into xt.orm ( orm_namespace, orm_type, orm_context, orm_json, orm_seq, orm_ext, orm_rest ) values ($1, $2, $3, $4, $5, $6, $7)';
      plv8.execute(sql, [nameSpace, type, context, json, sequence, isExtension, isRest]);
    }
  };

  /**
    Returns an array of views dependent on the view name passed.

    @param {String} view
    @returns Array
  */
  XT.Orm.viewDependencies = function(view) {
    var rec, viewNames = [],
      nsp = view.beforeDot(),
      quoted = view.replace(".", '."') + '"';
      sql = 'select distinct relname::text as "viewName" ' +
            'from pg_depend ' +
            'join pg_rewrite on (pg_rewrite.oid=objid) ' +
            'join pg_class c on (c.oid=ev_class) ' +
            'join pg_namespace n on (c.relnamespace=n.oid) ' +
            "where (classid='pg_rewrite'::regclass) " +
            " and (refclassid='pg_class'::regclass) " +
            ' and (refobjid::regclass::text in ($1,$2)) ' +
            " and (nspname || '.' || relname not in ($1,$2));";
    rec = plv8.execute(sql, [view, quoted]);

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
  };

  /**
    Return an Object Relational Map definition that includes all active extensions.

    @param {String} name space
    @param {String} type
    @param {Boolean} indicate whether to force a refresh of the orm cached result
    @returns {Object}
  */
  XT.Orm.fetch = function(nameSpace, type, refresh) {
    if(!this._maps) this._maps = [];
    var ret,
      recordType = nameSpace + '.'+ type,
      res = refresh ? null : this._maps.findProperty('recordType', recordType),
      i,
      sql,
      orm,
      ext;
    if(res) ret = res.map;
    else {
     /* get base */
      sql = 'select orm_json as json ' +
                'from xt.orm ' +
                'where orm_namespace=$1' +
                ' and orm_type=$2' +
                ' and not orm_ext ' +
                ' and orm_active ';
      res = plv8.execute(sql, [ nameSpace, type ]);
      if(!res.length) {
        plv8.elog(ERROR, "No orm found for " + nameSpace + "." + type);
      }
      ret = JSON.parse(res[0].json);

      /* get extensions and merge them into the base */
      if (!ret.extensions) ret.extensions = [];
      sql = 'select orm_json as json ' +
            'from xt.orm ' +
            'where orm_namespace=$1' +
            ' and orm_type=$2' +
            ' and orm_ext ' +
            ' and orm_active ' +
            'order by orm_seq';
      res = plv8.execute(sql, [ nameSpace, type ]);
      for (i = 0; i < res.length; i++) {
        orm = JSON.parse(res[i].json);
        ext = {};
        ext.context = orm.context;
        ext.comment = orm.comment;
        ext.nameSpace = nameSpace;
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
  };

  /**
    Returns the primary key name as designated in an ORM map.
    If column is true, returns the column name.

    @param {Object} ORM
    @param {Boolean} Get column - default false.
    @returns String
  */
  XT.Orm.primaryKey = function (orm, getColumn) {
    var i;
    /* find primary key */
    for (i = 0; i < orm.properties.length; i++) {
      if(orm.properties[i].attr &&
         orm.properties[i].attr.isPrimaryKey)
        return getColumn ? orm.properties[i].attr.column : orm.properties[i].name;
    }
    return false;
  };

  /**
    Returns matching property from the propreties array in an ORM map.

    @param {Object} ORM
    @param {String} property
    @returns Object
  */
  XT.Orm.getProperty = function (orm, property) {
    var i,
      ret;
    /* look for property on the first level */
    if (orm) {
      for (i = 0; i < orm.properties.length; i++) {
        if(orm.properties[i].name === property)
          return orm.properties[i];
      }

      /* look recursively for property on extensions */
      if(orm.extensions) {
        for (i = 0; i < orm.extensions.length; i++) {
          ret = XT.Orm.getProperty(orm.extensions[i], property);
          if(ret) return ret;
        }
      }
    }
    return false;
  };

  /**
    Create the PostgreSQL view and associated rules for an ORM.

    @param {Object} orm
  */
  XT.Orm.createView = function (orm) {
    /* constants */
    var SELECT = 'select {columns} from {table} where {conditions}',
      cols = [],
      altcols = [],
      tbls = [],
      tbl = 1 - 0,
      clauses = [],
      orderBy = [],
      comments = 'System view generated by object relation maps: WARNING! Do not make changes, add rules or dependencies directly to this view!',
      query = '',
      base = orm,
      viewName = orm.nameSpace.decamelize() + '.' + orm.type.decamelize(),
      altViewName = orm.nameSpace.decamelize() + '._' + orm.type.decamelize(),
      processOrm,
      res;

    // ..........................................................
    // METHODS
    //

    /* internal function for processing orm and its extensions recursively */
    processOrm = function(orm) {
      var props = orm.properties ? orm.properties : [],
        tblAlias = orm.table === base.table ? 't1' : 't' + tbl,
        ormClauses = [],
        i,
        n,
        col,
        alias,
        toOne,
        table,
        alttable,
        type,
        inverse,
        iorm,
        ormp,
        attr,
        isVisible,
        value,
        conditions,
        altconditions,
        join,
        lockTable,
        schemaName,
        tableName;
      for (i = 0; i < props.length; i++) {
        alias = props[i].name;
        if(DEBUG) plv8.elog(NOTICE, 'processing property ->', props[i].name);
        if(props[i].name === 'dataState') throw new Error("Can not use 'dataState' as a property name.");

        /* process attributes */
        if (props[i].attr || props[i].toOne) {
          if (DEBUG) plv8.elog(NOTICE, 'building attribute');
          attr = props[i].attr ? props[i].attr : props[i].toOne;
          isVisible = attr.value ? false : true;
          if (!attr.type) throw new Error('No type was defined on property ' + props[i].name);
          if (isVisible) {
            col = tblAlias + '.' + attr.column;
            col = col.concat(' as "', alias, '"');
            if (props[i].attr || props[i].toOne.isNested === false) {
              cols.push(col);
            }

            /* handle the default non-nested case */
            if (props[i].attr || props[i].toOne.isNested === undefined) {
              altcols.push(col);
            }
          }

          /* handle fixed value */
          if (attr.value !== undefined) {
            value = isNaN(attr.value - 0) ? "'" + attr.value + "'" : attr.value;
            ormClauses.push('"' + attr.column + '" = ' + value);
          }
        }

        /* process toOne  */
        if (props[i].toOne && props[i].toOne.isNested !== false) {
          toOne = props[i].toOne;
          table = base.nameSpace.decamelize() + '.' + toOne.type.decamelize();
          type = table.afterDot();
          inverse = toOne.inverse ? toOne.inverse.camelize() : 'id';
          col = '({select}) as "{alias}"';
          if(!type) { throw new Error('No type was defined on property ' + props[i].name); }
          if(DEBUG) { plv8.elog(NOTICE, 'building toOne'); }
          conditions = '"' + type + '"."' + inverse + '" = ' + tblAlias + '.' + toOne.column;

          /* build select */
          col = col.replace('{select}',
             SELECT.replace('{columns}', '"' + type + '"')
                   .replace('{table}',  table)
                   .replace('{conditions}', conditions))
                   .replace('{alias}', alias);
          cols.push(col);

          /* handle the default non-nested case */
          if (props[i].toOne.isNested === true) {
            table = base.nameSpace.decamelize() + '._' + toOne.type.decamelize();
            conditions = '"_' + type + '"."' + inverse + '" = ' + tblAlias + '.' + toOne.column;
            col = '({select}) as "{alias}"';
            col = col.replace('{select}',
             SELECT.replace('{columns}', '"_' + type + '"')
                   .replace('{table}',  table)
                   .replace('{conditions}', conditions))
                   .replace('{alias}', alias);
            altcols.push(col);
          }
        }

        /* process toMany */
        if(props[i].toMany) {
          if(DEBUG) plv8.elog(NOTICE, 'building toMany');
         if(!props[i].toMany.type) throw new Error('No type was defined on property ' + props[i].name);
           toMany = props[i].toMany;
           table = base.nameSpace + '.' + toMany.type.decamelize();
           alttable = base.nameSpace + '._' + toMany.type.decamelize();
           type = toMany.type.decamelize();
           column = toMany.isNested ? type : XT.Orm.primaryKey(XT.Orm.fetch(base.nameSpace, toMany.type));
           iorm = XT.Orm.fetch(base.nameSpace, toMany.type);
           col = 'array({select}) as "{alias}"';

           /* handle inverse */
          inverse = toMany.inverse ? toMany.inverse.camelize() : 'id';
          ormp = XT.Orm.getProperty(iorm, inverse);
          if(ormp && ormp.toOne && ormp.toOne.isNested) {
            conditions = toMany.column ? '(' + type + '."' + inverse + '").id = ' + tblAlias + '.' + toMany.column : 'true';
            altconditions = toMany.column ? '(_' + type + '."' + inverse + '").id = ' + tblAlias + '.' + toMany.column : 'true';
          } else {
            conditions = toMany.column ? type + '."' + inverse + '" = ' + tblAlias + '.' + toMany.column : 'true';
            altconditions = toMany.column ? "_" + type + '."' + inverse + '" = ' + tblAlias + '.' + toMany.column : 'true';
          }

          /* build select */
          col = col.replace('{select}',
             SELECT.replace('{columns}', column)
                   .replace('{table}', table)
                   .replace('{conditions}', conditions))
                   .replace('{alias}', alias);
          cols.push(col);

          /* same for alternate view */
          col = 'array({select}) as "{alias}"';
          col = col.replace('{select}',
             SELECT.replace('{columns}', toMany.isNested ? "_" + column : column)
                   .replace('{table}', alttable)
                   .replace('{conditions}', altconditions))
                   .replace('{alias}', alias);
          altcols.push(col);
        }
      }

      /* process extension */
      if(orm.isExtension) {
        if(DEBUG) plv8.elog(NOTICE, 'process extension');

        /* process relations (if different table) */
        if(orm.table !== base.table) {
          if(orm.relations) {
            join = orm.isChild ? ' join ' : ' left join ';
            conditions = [];
            join = join.concat(orm.table, ' ', tblAlias, ' on ');
            for (i = 0; i < orm.relations.length; i++) {
              rel = orm.relations[i];
              inverse = rel.inverse ? rel.inverse : 'id';
              for (n = 0; n < base.properties.length; n++) {
                if(base.properties[n].name === inverse) {
                  var obj = base.properties[n].attr ? base.properties[n].attr : base.properties[n].toOne;
                  value = 't1.' + obj.column;
                  break;
                }
              }
              condition = tblAlias + '.' + rel.column + ' = ' + value;
              conditions.push(condition);
            }
            conditions = conditions.concat(ormClauses);
            join = join.concat(conditions.join(' and '));
            tbls.push(join);
          }
        }

        /* build rules */
        conditions = [];
        if (DEBUG) { plv8.elog(NOTICE, 'process extension relations'); }
        if (!orm.relations) { throw new Error("Extension must have at least one relation defined."); }
        for (i = 0; i < orm.relations.length; i++) {
          rel = orm.relations[i];
          if(rel.value) {
            value = isNaN(rel.value - 0) ? "'" + rel.value + "'" : rel.value;
          } else if (rel.inverse) {
            value = '{state}.' + rel.inverse;
          } else {
            value = '{state}.id';
          }
          conditions.push(rel.column + ' = ' + value);
        }

      /* base orm */
      } else {
        if(DEBUG) plv8.elog(NOTICE, 'process base CRUD');

        /* table */
        clauses = clauses.concat(ormClauses);
        tbls.unshift(orm.table + ' ' + tblAlias);
      }

      /* process and add order by array */
      if (DEBUG) plv8.elog(NOTICE, 'process base order array');
      if (orm.order) {
        for (i = 0; i < orm.order.length; i++) {
          if (orm.order[i].indexOf('.') === -1) {
            orm.order[i] = tblAlias + "." + orm.order[i];
          } else {
            orm.order[i] = orm.order[i].replace(RegExp(orm.table + "."), tblAlias + ".");
          }
          orderBy.push(orm.order[i]);
        }
      }
      if(orm.comment) comments = comments.concat('\n', orm.comment);
      tbl++;

      /* add extensions */
      if (DEBUG) plv8.elog(NOTICE, 'process base extensions');
      if (orm.extensions) {
        for (i = 0; i < orm.extensions.length; i++) {
          var ext = orm.extensions[i];
          ext.isExtension = true;
          processOrm(ext);
        }
      }
    };

    // ..........................................................
    // PROCESS
    //

    /* do the heavy lifting here. This recursively processes extensions */
    processOrm(orm);

    /* Validate colums */
    if(!cols.length) { throw new Error('There must be at least one column defined on the map.'); }

    /* Build query to create the new view */
    query = 'create view {name} as select {columns} from {tables} {where} {order};'
            .replace('{name}', viewName)
            .replace('{columns}', cols.join(', '))
            .replace('{tables}', tbls.join(' '))
            .replace('{where}', clauses.length ? 'where ' + clauses.join(' and ') : '')
            .replace('{order}', orderBy.length ? 'order by ' + orderBy.join(' , ') : '');
    if(DEBUG) plv8.elog(NOTICE, 'query', query);
    plv8.execute(query);

    /* Add comment */
    query = "comment on view {name} is '{comments}'"
            .replace('{name}', viewName)
            .replace('{comments}', comments);
    plv8.execute(query);

    /* Grant access to xtrole */
    query = 'grant all on {view} to xtrole'
            .replace('{view}', viewName);
    plv8.execute(query);

    /* This is the alternate view where the default toOne behavior is non-nested */

    /* Build query to create the new alternate view */
    query = 'create view {name} as select {columns} from {tables} {where} {order};'
            .replace('{name}', altViewName)
            .replace('{columns}', altcols.join(', '))
            .replace('{tables}', tbls.join(' '))
            .replace('{where}', clauses.length ? 'where ' + clauses.join(' and ') : '')
            .replace('{order}', orderBy.length ? 'order by ' + orderBy.join(' , ') : '');
    if(DEBUG) plv8.elog(NOTICE, 'query', query);
    plv8.execute(query);

    /* Add comment */
    query = "comment on view {name} is '{comments}'"
            .replace('{name}', altViewName)
            .replace('{comments}', comments);
    plv8.execute(query);

    /* Grant access to xtrole */
    query = 'grant all on {view} to xtrole'
            .replace('{view}', altViewName);
    plv8.execute(query);

    /* If applicable, add a trigger to the table to keep version number updated */
    if (orm.isNestedOnly !== true &&
       (orm.privileges && orm.privileges.all && orm.privileges.all.create !== false ||
        orm.privileges && orm.privileges.all && orm.privileges.all.update !== false ||
        orm.privileges && orm.privileges.all && orm.privileges.all.delete !== false)) {
      query = 'select * from pg_tables where schemaname = $1 and tablename = $2';
      lockTable = orm.lockTable || orm.table;
      schemaName = lockTable.indexOf(".") === -1 ? 'public' : lockTable.beforeDot();
      tableName = lockTable.indexOf(".") === -1 ? lockTable : lockTable.afterDot();
      res = plv8.execute(query, [schemaName, tableName]);
      if (res.length) {
        query = 'drop trigger if exists {tableName}_did_change on {table};' +
                'create trigger {tableName}_did_change after insert or update or delete on {table} for each row execute procedure xt.record_did_change();';
        query =  query.replace(/{tableName}/g, tableName)
                      .replace(/{table}/g, lockTable);
        plv8.execute(query);
      }
    }
  };
$$ );
