select xt.install_js('XT','Session','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  XT.Session = {};

  XT.Session.isDispatchable = true;

  /**
    Returns a hash of key, value pairs of locale properties and their selections for the effective user.

    @returns {hash}
  */
  XT.Session.locale = function() {
    var sql = 'select '
            + 'locale_id as "id", '
            + 'locale_code as "code", '
            + 'lang_abbr2 as "language", '
            + 'country_abbr as "country", '
            + 'coalesce(locale_curr_scale,2) as "currencyScale", '
            + 'coalesce(locale_salesprice_scale, 4) as "salesPriceScale", '
            + 'coalesce(locale_purchprice_scale, 4) as "purchasePriceScale", '
            + 'coalesce(locale_extprice_scale, 2) as "extendedPriceScale", '
            + 'coalesce(locale_cost_scale, 4) as "costScale", '
            + 'coalesce(locale_qty_scale, 2) as "quantityScale", '
            + 'coalesce(locale_qtyper_scale, 6) as "quantityPerScale", '
            + 'coalesce(locale_uomratio_scale, 6) as "unitRatioScale", '
            + 'coalesce(locale_percent_scale, 2) as "percentScale", '
            + 'coalesce(locale_weight_scale, 2) as "weightScale", '
            + 'coalesce(localeext_hours_scale, 2) as "hoursScale" '
            + 'from locale '
            + 'join usr on usr_locale_id = locale_id '
            + 'left join xt.localeext on locale_id=localeext_id '
            + 'left join lang on locale_lang_id = lang_id '
            + 'left join country on locale_country_id = country_id '
            + 'where usr_username = $1 ',
      rec = plv8.execute(sql, [ XT.username ])[0],
      /* only serve the translations for pertinent extensions */
      dictionarySql = "select dict_strings from xt.dict where dict_id in ( " +
        "select dict_id " +
        "from xt.dict " +
        "left join xt.ext on dict_ext_id = ext_id " +
        "left join xt.usrext on ext_id = usrext_ext_id " +
        "left join xt.grpext on ext_id = grpext_ext_id " +
        "left join usrgrp on grpext_grp_id = usrgrp_grp_id " +
        "where dict_language_name = $1 " +
        "and dict_is_database = false " +
        "and (ext_id is null or usrgrp_username = $2 or usrext_usr_username = $2) " +
        ");",
      strings;

    /* determine culture */
    var culture = 'en';
    if (!rec) {
      /* no result. The user probably does not exist */
      throw "No result for locale. Username probably does not exist in the instance database";
    } else if (rec.language && rec.country) {
      culture = rec.language + '_' + rec.country;
    } else {
      /* Sensible default if locale is not fully set */
      culture = "en_US";
    }
    rec.culture = culture;

    /* might as well request the translations in here too */
    strings = plv8.execute(dictionarySql, [culture, XT.username]);
    if(strings.length === 0) {
      /* Sensible default if locale is fully set but no dictionary exists */
      strings = plv8.execute(dictionarySql, ["en_US"]);
    }
    rec.strings = strings.map(function (row) {
      return JSON.parse(row.dict_strings);
    });

    return rec;
  }

  /**
    Returns a hash of key, value pairs of settings and values for the effective user.

    @returns {hash}
  */
  XT.Session.settings = function() {
    var settings = {},
      type;

    for (type in XM) {
      if (XM.hasOwnProperty(type) &&
          XM[type].settings &&
          typeof XM[type].settings === 'function') {
        settings = XT.extend(settings, XM[type].settings());
      }
    }

    return settings;
  }

  /**
    Returns a hash of key, value pairs of privileges and their granted state for the effective user.

    @returns {Hash}
  */
  XT.Session.privileges = function() {
    var sql = 'select priv_name as "privilege", ' +
              'coalesce(usrpriv_priv_id, grppriv_priv_id, -1) > 0 as "isGranted" ' +
              'from priv ' +
              'left join usrpriv on (priv_id=usrpriv_priv_id) and (usrpriv_username=$1) ' +
              'left join ( ' +
              '  select distinct grppriv_priv_id ' +
              'from grppriv ' +
              'join usrgrp on (grppriv_grp_id=usrgrp_grp_id) and (usrgrp_username=$1) ' +
              ') grppriv on (grppriv_priv_id=priv_id); '
      rec = plv8.execute(sql, [ XT.username ] );

    return rec.length ? rec : {};
  }



  /*
    Return user preferences

    @returns {Object}
  */
  XT.Session.preferences = function() {
    var sql = "select * from xt.userpref where userpref_usr_username = $1 " +
              "and userpref_name != 'PreferredWarehouse' " +
              "union " +
              /* Sorry, we've just got to share this one... */
              "select usrpref_id, usrpref_username, usrpref_name, warehous_code " +
              "from usrpref " +
              " join whsinfo on usrpref_value = warehous_id::text " +
              "where usrpref_username = $1 "
              "and usrpref_name = 'PreferredWarehouse';";
      result = plv8.execute(sql, [XT.username]),
      resultObj = {};

    result.map(function (res) {
      resultObj[res.userpref_name] = res.userpref_value;
    });
    return resultObj;
  }

  /*
    Update user preferences.

   @param {Object} patches
   @returns {Boolean}
  */
  XT.Session.commitPreferences = function(patches) {
    var data = Object.create(XT.Data);

    /* check privileges */
    if(!data.checkPrivilege('MaintainPreferencesSelf')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    patches.map(function (patch) {
      var sql,
        name = patch.path.substring(1),
        updateSql = "UPDATE xt.userpref SET userpref_value = $1 WHERE userpref_usr_username = $2 AND userpref_name = $3;",
        insertSql = "INSERT INTO xt.userpref (userpref_value, userpref_usr_username, userpref_name) VALUES ($1, $2, $3);",
        /* Handle the ugly exception */
        updateSqlSite = "UPDATE usrpref SET usrpref_value = (select warehous_id from whsinfo where warehous_code = $1) WHERE usrpref_username = $2 AND usrpref_name = $3;",
        insertSqlSite = "INSERT INTO usrpref (usrpref_value, usrpref_username, usrpref_name) VALUES ($1, $2, $3);";

      if (name !== "PreferredWarehouse") {
        if (patch.op === 'add') {
          sql = insertSql;
        } else if(patch.op === 'replace') {
          sql = updateSql;
        } else {
          /* no other operation is supported at the moment */
          return;
        }
      } else {
        if (patch.op === 'add') {
          sql = insertSqlSite;
        } else if(patch.op === 'replace') {
          sql = updateSqlSite;
        } else {
          /* no other operation is supported at the moment */
          return;
        }
      }

      plv8.execute(sql, [patch.value, XT.username, name]);
    });
    return true;
  }

  /**
    Returns a type map for a schema.

    @param {String} Schema name
    @returns {Hash}
  */
  XT.Session.schema = function(schema, table) {
    var sql = 'select c.relname as "type", ' +
              '  attname as "column", ' +
              '  typcategory as "category", ' +
              '  n.nspname as "schema", attnum ' +
              'from pg_class c' +
              '  join pg_namespace n on n.oid = c.relnamespace' +
              '  join pg_attribute a on a.attrelid = c.oid ' +
              '  join pg_type t on a.atttypid = t.oid ' +
              ' join xt.orm on lower(orm_namespace) = n.nspname and xt.decamelize(orm_type) = c.relname and not orm_ext ' +
              'where n.nspname = $1 ' +
              (table ? ' and c.relname = $2 ' : '') +
              'and relkind = \'v\' ' +
              'and orm_context = \'xtuple\' ' +
              'union all ' +
              'select c.relname as "type", ' +
              '  attname as "column", ' +
              '  typcategory as "category", ' +
              '  n.nspname as "schema", attnum ' +
              'from pg_class c' +
              '  join pg_namespace n on n.oid = c.relnamespace' +
              '  join pg_attribute a on a.attrelid = c.oid ' +
              '  join pg_type t on a.atttypid = t.oid ' +
              '  join xt.orm on lower(orm_namespace) = n.nspname and xt.decamelize(orm_type) = c.relname and not orm_ext ' +
              '  join xt.ext on ext_name = orm_context ' +
              '  left join xt.usrext on ext_id = usrext_ext_id ' +
              '  left join xt.grpext on ext_id=grpext_ext_id ' +
              '  left join usrgrp on usrgrp_grp_id=grpext_grp_id ' +
              'where n.nspname = $1 ' +
              (table ? ' and c.relname = $2 ' : '') +
              ' and relkind = \'v\' ' +
              ' and orm_context != \'xtuple\' ' +
              ' and (usrext_usr_username = $3 or usrgrp_username = $3) ' +
              ' group by c.relname, attname, typcategory, n.nspname, attnum ' +
              'order by type, attnum',
      recs = plv8.execute(sql, [schema, table, XT.username]),
      type,
      prev = '',
      name,
      column,
      result = {},
      i,
      orm,
      props,
      options,
      filterToOne = function (value) {
        return  value.toOne && propertyIsValid(orm, value.name);
      },
      filterToMany = function (value) {
        return value.toMany && propertyIsValid(orm, value.name);
      },
      addToOne = function (value, schema) {
        var relations = result[type]['relations'],
          child = XT.Orm.fetch(schema.toUpperCase(), value.toOne.type),
          pkey = XT.Orm.primaryKey(child),
          nkey = XT.Orm.naturalKey(child),
          rel = {
            type: "Backbone.HasOne",
            key: value.name,
            relatedModel: schema.toUpperCase() + '.' + value.toOne.type
          };
        rel.includeInJSON = nkey || pkey;
        if(value.toOne.isNested) {
          rel.isNested = true;
        }
        relations.push(rel);
      },
      addToMany = function (value, schema) {
        var relations = result[type]['relations'],
          child = XT.Orm.fetch(schema.toUpperCase(), value.toMany.type),
          pkey = XT.Orm.primaryKey(child),
          inverse = value.toMany.inverse ? value.toMany.inverse.camelize() : undefined;
          rel = {
            type: "Backbone.HasMany",
            key: value.name,
            relatedModel: schema.toUpperCase() + '.' + value.toMany.type,
            reverseRelation: {
              key: inverse
            }
          };
        if (!value.toMany.isNested) {
          rel.includeInJSON = false;
        } else {
          rel.isNested = true;
        }
        relations.push(rel);
      },
      processProperties = function (orm, schema) {
        var n;
        required = result[type]['requiredAttributes']
        if (orm.properties && orm.properties.length) {
          /* Required */
          props = orm.properties;
          props.forEach(function(prop) {
            if (prop.attr && prop.attr.required) {
              required.push(prop.name);
            }
          });

          /* To One */
          props = orm.properties.filter(filterToOne);
          props.forEach(function(prop) {
            if (prop.toOne.required) {
              required.push(prop.name);
            }
            addToOne(prop, schema);
          });

          /* To Many */
          props = orm.properties.filter(filterToMany);
          props.forEach(function(prop) {
            addToMany(prop, schema)
          });
        }

        /* extensions */
        if (orm.extensions && orm.extensions.length) {
          for (n = 0; n < orm.extensions.length; n++) {
            processProperties(orm.extensions[n], schema);
          }
        }
      },
      processPrivileges = function (orm) {
        if (orm.privileges) {
          result[type]['privileges'] = orm.privileges;
        }
      },
      propertyIsValid = function(orm, name) {
        if (!XT.Orm.getProperty(orm, name)) { return false; }
        if (orm.privilges && orm.privileges.attribute &&
            orm.privileges.attribute[name] &&
            orm.privileges.attribute[name].view) {
          return XT.Data.checkPrivilige(orm.privileges.attribute[name].view);
        }
        return true;
      };

    /* Loop through each field and add to the object */
    for (i = 0; i < recs.length; i++) {
      type = recs[i].type.classify();
      name = recs[i].column;
      schema = recs[i].schema;
      if (type !== prev) {
        orm = XT.Orm.fetch(schema.toUpperCase(), type);
        result[type] = {};
        result[type].columns = [];
        result[type].requiredAttributes = [];

        /* Add relations and privileges from the orm*/
        if (DEBUG) {
          XT.debug('Fetching schema ' + schema.toUpperCase() + '.' + type);
        }
        result[type]['idAttribute'] = XT.Orm.naturalKey(orm) || XT.Orm.primaryKey(orm);
        result[type]['lockable'] = orm.lockable || false;
        result[type]['relations'] = [];
        processProperties(orm, schema);
        processPrivileges(orm);
      }
      /* Only add column if it's valid */
      if (propertyIsValid(orm, name)) {
        column = {
          name: name,
          category: recs[i].category,
          type: XT.Orm.getType(orm, name)
        }
        result[type]['columns'].push(column);
      }
      prev = type;
    }

    /* Handle configuration settings */
    if (schema === 'xm') {
      for (type in XM) {
        if (XM.hasOwnProperty(type) &&
            XM[type].options &&
            XT.typeOf(XM[type].options) === 'array') {
          options = XM[type].options;
          result[type] = {};
          result[type].columns = [];
          for (i = 0; i < options.length; i++) {
            column = {
              name: options[i],
              category: 'X'
            }
            result[type].columns.push(column);
          }
        }
      }
    }

    return result;
  }

}());

$$ );
