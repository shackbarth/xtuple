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

    if (DEBUG) {
      XT.debug('install sql = ', sql);
      XT.debug('install values = ', [nameSpace, type, context]);
    }
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

      if (DEBUG) {
        XT.debug('install sql = ', sql);
        XT.debug('install values = ', [json, sequence, isRest, oldOrm.id]);
      }
      plv8.execute(sql, [json, sequence, isRest, oldOrm.id]);
    } else {
      sql = 'insert into xt.orm ( orm_namespace, orm_type, orm_context, orm_json, orm_seq, orm_ext, orm_rest ) values ($1, $2, $3, $4, $5, $6, $7)';

      if (DEBUG) {
        XT.debug('install sql = ', sql);
        XT.debug('install values = ', [nameSpace, type, context, json, sequence, isExtension, isRest]);
      }
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

    if (DEBUG) {
      XT.debug('viewDependencies sql = ', sql);
      XT.debug('viewDependencies values = ', [view, quoted]);
    }
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
    @param {Object} options
    @param {Boolean} [options.refresh=false] Indicate whether to force a refresh of the orm cached result.
    @param {Boolean} [options.silentError=false] Silence errors and return false instead.
    @param {Boolean} [options.superUser=false] Ignore privilege checking.
    @returns {Object}
  */
  XT.Orm.fetch = function(nameSpace, type, options) {
    options = options || {};
    var db = XT.currentDb(),
      ext,
      i,
      orm,
      ret,
      recordType = nameSpace + '.'+ type,
      res,
      sql,
      isSuper = options.superUser || false;

    if (!this._maps) {
      this._maps = {};
    }
    if (!this._maps[db]) {
      this._maps[db] = {};
    }
    if (!this._maps[db][XT.username]) {
      this._maps[db][XT.username] = [];
    }

    res = options.refresh ? null : this._maps[db][XT.username].findProperty('recordType', recordType);

    if (res) {
      ret = res.map;
    } else {
     /* get base, but only for types the user has been granted access */
      sql = "select orm_json as json " +
            "from xt.orm " +
            "where orm_namespace=$1" +
            " and orm_type=$2" +
            " and not orm_ext " +
            " and orm_active " +
            " and orm_context='xtuple'  " +
            "union all " +
            "select orm_json as json " +
            "from xt.orm " +
            " join xt.ext on ext_name=orm_context " +
            " join xt.usrext on ext_id=usrext_ext_id " +
            "where orm_namespace=$1 " +
            " and orm_type=$2 " +
            " and not orm_ext " +
            " and orm_active " +
            " and orm_context != 'xtuple'" +
            " and usrext_usr_username=$3;";
      superSql = "select orm_json as json " +
                 "from xt.orm " +
                 "where orm_namespace=$1" +
                 " and orm_type=$2" +
                 " and not orm_ext " +
                 " and orm_active; ";

      if (DEBUG) {
        XT.debug('fetch sql = ', sql);
        XT.debug('fetch values = ', [nameSpace, type]);
      }
      if (isSuper) {
        res = plv8.execute(superSql, [nameSpace, type]);
      } else {
        res = plv8.execute(sql, [nameSpace, type, XT.username]);
      }

      if(!res.length) {
        if (options.silentError) {
          return false;
        } else {
          plv8.elog(ERROR, "No orm found for " + nameSpace + "." + type);
        }
      }
      ret = JSON.parse(res[0].json);

      /* get extensions and merge them into the base */
      if (!ret.extensions) ret.extensions = [];
      sql = 'select orm_json as json ' +
            'from xt.orm ' +
            '  join xt.ext on ext_name = orm_context ' +
            '  left join xt.usrext on ext_id = usrext_ext_id ' +
            'where orm_namespace=$1' +
            ' and orm_type=$2' +
            ' and orm_ext ' +
            ' and orm_active ' +
            ' and (usrext_usr_username=$3) ' +
            'order by orm_seq';
      superSql = 'select orm_json as json ' +
            'from xt.orm ' +
            'where orm_namespace=$1' +
            ' and orm_type=$2' +
            ' and orm_ext ' +
            ' and orm_active ' +
            'order by orm_seq';

      if (DEBUG) {
        XT.debug('fetch sql = ', sql);
        XT.debug('fetch values = ', [nameSpace, type]);
      }

      if (isSuper) {
        res = plv8.execute(superSql, [nameSpace, type]);
      } else {
        res = plv8.execute(sql, [nameSpace, type, XT.username]);
      }

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
      this._maps[db][XT.username].push({ "recordType": recordType, "map": ret});
    }
    return ret;
  };

  /**
    Returns the natural key name as designated in an ORM map.
    If column is true, returns the column name.

    @param {Object} ORM
    @param {Boolean} Get column - default false.
    @returns String
  */
  XT.Orm.naturalKey = function (orm, getColumn) {
    var i,
      prop;

    /* find primary key */
    for (i = 0; i < orm.properties.length; i++) {
      var prop = orm.properties[i];
      if(prop.attr && prop.attr.isNaturalKey)
        return getColumn ? prop.attr.column : prop.name;
    }

    return false;
  };

  /**
    Returns the primary key name as designated in an ORM map.
    If column is true, returns the column name.

    @param {Object} ORM
    @param {Boolean} Get column - default false.
    @returns String
  */
  XT.Orm.primaryKey = function (orm, getColumn) {
    var i,
      prop;

    /* find primary key */
    for (i = 0; i < orm.properties.length; i++) {
      var prop = orm.properties[i];
      if(prop.attr && prop.attr.isPrimaryKey)
        return getColumn ? prop.attr.column : prop.name;
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
    var SELECT = 'select {columns} from {table} where {conditions} {order}',
      cols = [],
      tbls = [],
      tbl = 1 - 0,
      clauses = [],
      orderBy = [],
      comments = 'System view generated by object relation maps: WARNING! Do not make changes, add rules or dependencies directly to this view!',
      query = '',
      base = orm,
      viewName = orm.nameSpace.decamelize() + '.' + orm.type.decamelize(),
      processOrm,
      schemaName,
      tableName,
      res;

    // ..........................................................
    // METHODS
    //

    /* internal function for processing orm and its extensions recursively */
    processOrm = function(orm) {
      var props = orm.properties ? orm.properties : [],
        tblAlias = orm.table === base.table ? 't1' : 't' + tbl,
        ormClauses = [],
        Orm = XT.Orm,
        prop,
        i,
        n,
        col,
        alias,
        toOne,
        table,
        type,
        inverse,
        iorm,
        ormp,
        attr,
        isVisible,
        value,
        conditions,
        join,
        lockTable,
        schemaName,
        tableName,
        pkey,
        nkey,
        orderBy;

      /* process properties */
      for (i = 0; i < props.length; i++) {
        prop = props[i];
        nkey = prop.toOne ? Orm.naturalKey(Orm.fetch(orm.nameSpace, prop.toOne.type, {superUser: true})) : false,
        alias = prop.name;
        if(DEBUG) XT.debug('processing property ->', prop.name);
        if(prop.name === 'dataState') throw new Error("Can not use 'dataState' as a property name.");

        /* process attributes */
        if (prop.attr || prop.toOne) {
          attr = prop.attr ? prop.attr : prop.toOne;
          if (DEBUG) XT.debug('building attribute', [prop.name, attr.column]);
          isVisible = attr.value === undefined ? true : false;
          if (!attr.type) throw new Error('No type was defined on property ' + prop.name);
          if (isVisible) {
            col = tblAlias + '.' + attr.column;
            col = col.concat(' as "', alias, '"');

            /* If the column is `obj_uuid` and it's not there, create it.
               This violates our rule to not touch the source schema, but otherwise
               we risk a big performance hit on all the joins that
               would be required if uuid were in another table */
            if (attr.column  === "obj_uuid") {
              query = "select count(a.attname) " +
                      "from pg_class c, pg_namespace n, pg_attribute a, pg_type t " +
                      "where c.relname = $1 " +
                      " and n.nspname = $2 " +
                      " and n.oid = c.relnamespace " +
                      " and a.attnum > 0 " +
                      " and a.attname = 'obj_uuid' " +
                      " and a.attrelid = c.oid " +
                      " and a.atttypid = t.oid; ";
              schemaName = orm.table.indexOf(".") === -1 ? 'public' : orm.table.beforeDot();
              tableName = orm.table.indexOf(".") === -1 ? orm.table : orm.table.afterDot();

              if (DEBUG) {
                XT.debug('createView check obj_uuid sql = ', query);
                XT.debug('createView values = ', [tableName, schemaName]);
              }
              res = plv8.execute(query, [tableName, schemaName]);

              if (!res[0].count) {
                /* make sure this isn't a view */
                query = "select relkind " +
                        "from pg_class c, pg_namespace n " +
                        "where c.relname = $1 " +
                        " and n.nspname = $2 " +
                        " and n.oid = c.relnamespace;"

                if (DEBUG) {
                  XT.debug('createView check obj table sql = ', query);
                  XT.debug('createView values = ', [tableName, schemaName]);
                }
                res = plv8.execute(query, [tableName, schemaName]);

                if (!res[0] || res[0].relkind !== 'r') {
                  plv8.elog(ERROR, "Can not add obj_uuid field because {table} is not a table.".replace("{table}", orm.table));
                }

                /* looks good. add the column */
                query = "alter table {table} add column obj_uuid text default xt.generate_uuid();".replace("{table}", orm.table);

                if (DEBUG) {
                  XT.debug('createView add obj_uuid sql = ', query);
                }
                plv8.execute(query);

                query = "comment on column {table}.obj_uuid is 'Added by xt the web-mobile package.'".replace("{table}", orm.table);
                plv8.execute(query);
              }
            }

            /* handle the attribute */
            if (prop.attr ||
               (prop.toOne.isNested === undefined && !nkey)) {
              cols.push(col);
            }
          }

          /* handle fixed value */
          if (attr.value !== undefined) {
            value = isNaN(attr.value - 0) ? "'" + attr.value + "'" : attr.value;
            ormClauses.push('"' + attr.column + '" = ' + value);
          }
        }

        /* process toOne  */
        if (prop.toOne &&
           (prop.toOne.isNested !== false || nkey)) {
          toOne = prop.toOne;
          table = base.nameSpace.decamelize() + '.' + toOne.type.decamelize();
          type = table.afterDot();
          inverse = toOne.inverse ? toOne.inverse.camelize() : 'id';
          col = '({select}) as "{alias}"';
          if (!type) { throw new Error('No type was defined on property ' + prop.name); }
          if (DEBUG) { XT.debug('building toOne'); }
          conditions = '"' + type + '"."' + inverse + '" = ' + tblAlias + '.' + toOne.column;

          /* handle the nested and natural key cases */
          if (prop.toOne.isNested === true || nkey) {
            col = col.replace('{select}',
               SELECT.replace('{columns}',  prop.toOne.isNested ? '"' + type + '"' : nkey)
                     .replace('{table}',  table)
                     .replace('{conditions}', conditions))
                     .replace('{alias}', alias)
                     .replace('{order}', '');
            cols.push(col);
          }
        }

        /* process toMany */
        if (prop.toMany) {
          if (DEBUG) XT.debug('building toMany');
          if (!prop.toMany.type) { throw new Error('No type was defined on property ' + prop.name); }
          toMany = prop.toMany;
          table = base.nameSpace + '.' + toMany.type.decamelize();
          type = toMany.type.decamelize();
          iorm = Orm.fetch(base.nameSpace, toMany.type, {superUser: true});
          pkey = Orm.primaryKey(iorm);
          nkey = Orm.naturalKey(iorm);
          column = toMany.isNested ? type : nkey;
          col = 'array({select}) as "{alias}"',
          orderBy = 'order by ' + pkey;

           /* handle inverse */
          inverse = toMany.inverse ? toMany.inverse.camelize() : 'id';
          ormp = Orm.getProperty(iorm, inverse);
          if (ormp && ormp.toOne && ormp.toOne.isNested) {
            conditions = toMany.column ? '(' + type + '."' + inverse + '").id = ' + tblAlias + '.' + toMany.column : 'true';
          } else {
            conditions = toMany.column ? type + '."' + inverse + '" = ' + tblAlias + '.' + toMany.column : 'true';
          }

          /* build select */
          col = col.replace('{select}',
             SELECT.replace('{columns}', column)
                   .replace('{table}', table)
                   .replace('{conditions}', conditions))
                   .replace('{alias}', alias)
                   .replace('{order}', orderBy);
          cols.push(col);
        }
      }

      /* process extension */
      if(orm.isExtension) {
        if(DEBUG) XT.debug('process extension');

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
        if (DEBUG) { XT.debug('process extension relations'); }
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
        if(DEBUG) XT.debug('process base CRUD');

        /* table */
        clauses = clauses.concat(ormClauses);
        tbls.unshift(orm.table + ' ' + tblAlias);
      }

      /* process and add order by array */
      if (DEBUG) XT.debug('process base order array');
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
      if (DEBUG) XT.debug('process base extensions');
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

    if (DEBUG) {
      XT.debug('createView sql = ', query);
    }
    plv8.execute(query);

    /* Add comment */
    query = "comment on view {name} is '{comments}'"
            .replace('{name}', viewName)
            .replace('{comments}', comments);
    plv8.execute(query);

    /* Grant access to xtrole */
    query = 'grant all on {view} to xtrole'
            .replace('{view}', viewName);

    if (DEBUG) {
      XT.debug('createView grant sql = ', query);
    }
    plv8.execute(query);

    /* clean up triggers that we may or may not want to be there */
    lockTable = orm.lockTable || orm.table;
    schemaName = lockTable.indexOf(".") === -1 ? 'public' : lockTable.beforeDot();
    tableName = lockTable.indexOf(".") === -1 ? lockTable : lockTable.afterDot();
    query = 'drop trigger if exists {tableName}_did_change on {table};'
    query =  query.replace(/{tableName}/g, tableName)
                  .replace(/{table}/g, lockTable);

    if (DEBUG) {
      XT.debug('createView drop trigger sql = ', query);
    }
    plv8.execute(query);

    /* If applicable, add a trigger to the table to keep version number updated */
    if (orm.lockable) {
      query = 'select * from pg_tables where schemaname = $1 and tablename = $2';
      res = plv8.execute(query, [schemaName, tableName]);
      if (res.length) {
        query = 'create trigger {tableName}_did_change after insert or update or delete on {table} for each row execute procedure xt.record_did_change();';
        query =  query.replace(/{tableName}/g, tableName)
                      .replace(/{table}/g, lockTable);

        if (DEBUG) {
          XT.debug('createView create trigger sql = ', query);
        }
        plv8.execute(query);
      }
    }
 
  };
$$ );
