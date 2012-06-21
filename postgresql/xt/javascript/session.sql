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
            + 'where usr_username = getEffectiveXtUser() ', 
    rec = plv8.execute(sql)[0];

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
    var settings = [], regs = XT.settingsRegistrations();

    for(var i = 0; i < regs.length; i++) {
      var nameSpace = regs[i].nameSpace,
          type = regs[i].type,
          action = regs[i].action;
  
      settings = settings.concat(this[nameSpace][type][action]()); 
    }

    return JSON.stringify(settings);
  }

  /** 
    Returns a hash of key, value pairs of privileges and their granted state for the effective user.

    @returns {Hash}
  */ 
  XT.Session.privileges = function() {
    var rec = plv8.execute( 'select privilege, granted as "isGranted" from privgranted' );

    return rec.length ? JSON.stringify (rec) : '{}';
  }

  /**
    Returns a type map for a schema.

    @param {String} Schema name
    @returns {Hash}
  */
  XT.Session.schema = function(schema) {
    var sql = 'select c.relname as "recordType", ' +
              '  attname as "column", ' +
              '  typcategory as "category" ' +
              'from pg_class c' +
              '  join pg_namespace n on n.oid = c.relnamespace' +
              '  join pg_attribute a on a.attrelid = c.oid ' +
              '  join pg_type t on a.atttypid = t.oid ' +
              'where n.nspname = $1 ' +
              'order by c.relname, attnum';
    var recs = plv8.execute(sql, [ schema ]);
    var recordType;
    var prev = '';
    var name;
    var column;
    var result = {};
    var i;

    /* Loop through each field and add to the object */
    for (i = 0; i < recs.length; i++) {
      recordType = recs[i].recordType.classify();
      name = recs[i].column;
      if (recordType !== prev) {
        result[recordType] = {};
        result[recordType].columns = [];
      }
      column = { 
        name: name,
        category: recs[i].category
      }
      result[recordType]['columns'].push(column);
      prev = recordType;
    }

    return JSON.stringify(result);
  }
  
$$ );

