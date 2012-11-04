select xt.install_js('XT','Session','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

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
            + 'lang_abbr2 AS "language", '
            + 'country_abbr AS "country", '
            + 'case when length(locale_error_color) = 0 then \'red\' else locale_error_color end as "errorColor", '
            + 'case when length(locale_warning_color) = 0 then \'orange\' else locale_warning_color end as "warningColor", '
            + 'case when length(locale_emphasis_color) = 0 then \'blue\' else locale_emphasis_color end as "emphasisColor", '
            + 'case when length(locale_altemphasis_color) = 0 then \'green\' else locale_altemphasis_color end as "altEmphasisColor", '
            + 'case when length(locale_expired_color) = 0 then \'red\' else locale_expired_color end as "expiredColor", '
            + 'case when length(locale_future_color) = 0 then \'blue\' else locale_future_color end as "futureColor", '
            + 'coalesce(locale_curr_scale,2) as "currencyScale", '
            + 'coalesce(locale_salesprice_scale, 4) as "salesPriceScale", '
            + 'coalesce(locale_purchprice_scale, 4) as "purchasePriceScale", '
            + 'coalesce(locale_extprice_scale, 2) as "extPriceScale", '
            + 'coalesce(locale_cost_scale, 4) as "costScale", '
            + 'coalesce(locale_qty_scale, 2) as "qtyScale", '
            + 'coalesce(locale_qtyper_scale, 6) as "qtyPerScale", '
            + 'coalesce(locale_uomratio_scale, 6) as "uomRatioScale", '
            + 'coalesce(locale_percent_scale, 2) as "percentScale", '
            + 'coalesce(locale_weight_scale, 2) as "weightScale" '
            + 'from locale '
            + 'join usr on usr_locale_id = locale_id '
            + 'left join lang on locale_lang_id = lang_id '
            + 'left join country on locale_country_id = country_id '
            + 'where usr_username = $1 ', 
    rec = plv8.execute(sql, [ XT.username ])[0];

    /* determine culture */
    var culture = 'en';
    if (rec.language && rec.country) culture = rec.language+'-'+rec.country;
    else if (rec.language) culture = rec.language;
    rec.culture = culture;

    return JSON.stringify(rec);
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
        settings = XT.extend(settings, JSON.parse(XM[type].settings()));
      }
    }

    return JSON.stringify(settings);
  }

  /** 
    Returns a hash of key, value pairs of privileges and their granted state for the effective user.

    @returns {Hash}
  */ 
  XT.Session.privileges = function() {
    var sql = 'select priv_name as "privilege", ' +
              'coalesce(usrpriv_priv_id, grppriv_priv_id, -1) > 0 as "isGranted", ' +
              'priv_seq as sequence ' +
              'from priv ' +
              'left outer join usrpriv on (priv_id=usrpriv_priv_id) and (usrpriv_username=$1) ' +
              'left outer join ( ' +
              '  select distinct grppriv_priv_id ' +
              'from grppriv ' +
              'join usrgrp on (grppriv_grp_id=usrgrp_grp_id) and (usrgrp_username=$1) ' +
              ') grppriv on (grppriv_priv_id=priv_id); '
      rec = plv8.execute(sql, [ XT.username ] );

    return rec.length ? JSON.stringify(rec) : '{}';
  }

  /**
    Returns a type map for a schema.

    @param {String} Schema name
    @returns {Hash}
  */
  XT.Session.schema = function(schema, refresh) {
  
    if (!refresh && this._schema) { return this._schema };
    var sql = 'select c.relname as "type", ' +
              '  attname as "column", ' +
              '  typcategory as "category" ' +
              'from pg_class c' +
              '  join pg_namespace n on n.oid = c.relnamespace' +
              '  join pg_attribute a on a.attrelid = c.oid ' +
              '  join pg_type t on a.atttypid = t.oid ' +
              'where n.nspname = $1 ' +
              'order by c.relname, attnum',
      recs = plv8.execute(sql, [ schema ]),
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
        return value.toOne;
      },
      filterToMany = function (value) {
        return value.toMany;
      },
      addToOne = function (value) {
        var relations = result[type]['relations'],
          child = XT.Orm.fetch(schema.toUpperCase(), value.toOne.type),
          pkey = XT.Orm.primaryKey(child),
          rel = {
            type: "Backbone.HasOne",
            key: value.name,
            relatedModel: schema.toUpperCase() + '.' + value.toOne.type
          };
        rel.includeInJSON = pkey;
        if(value.toOne.isNested) {
          rel.isNested = true;
        }
        relations.push(rel);
      },
      addToMany = function (value) {
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
          rel.includeInJSON = pkey;
        } else {
          rel.isNested = true;
        }
        relations.push(rel);
      },
      processProperties = function (orm) {
        var n;
        if (orm.properties && orm.properties.length) {
          /* To One */
          props = orm.properties.filter(filterToOne);
          props.forEach(addToOne);
 
          /* To Many */
          props = orm.properties.filter(filterToMany);
          props.forEach(addToMany);
        }

        /* extensions */
        if (orm.extensions && orm.extensions.length) {
          for (n = 0; n < orm.extensions.length; n++) {
            processProperties(orm.extensions[n]);
          }
        }
      },
      processPrivileges = function (orm) {
        if (orm.privileges) {
	   result[type]['privileges'] = orm.privileges;
	}
      };

    /* Loop through each field and add to the object */
    for (i = 0; i < recs.length; i++) {
      type = recs[i].type.classify();
      name = recs[i].column;
      if (type !== prev) {
        result[type] = {};
        result[type].columns = [];
        
        /* Add relations and privileges from the orm*/
        if (DEBUG) { 
          plv8.elog(NOTICE, 'Fetching schema ' + schema.toUpperCase() + '.' + type);
        }
        orm = XT.Orm.fetch(schema.toUpperCase(), type);
       
        result[type]['relations'] = [];
        processProperties(orm);
        processPrivileges(orm);
      }
      column = { 
        name: name,
        category: recs[i].category
      }
      result[type]['columns'].push(column);
      prev = type;
    }

    /* Handle configuration settings */
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

    this._schema = JSON.stringify(result);
    return this._schema;
  }
  
$$ );

