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
    var sql = "select "
            + "locale_id as id, "
            + "locale_code as code, "
            + "lang_id AS language, "
            + "country_id AS country, "
            + "case when length(locale_error_color) = 0 then 'red' else locale_error_color end as errorColor, "
            + "case when length(locale_warning_color) = 0 then 'orange' else locale_warning_color end as warningColor, "
            + "case when length(locale_emphasis_color) = 0 then 'blue' else locale_emphasis_color end as emphasisColor, "
            + "case when length(locale_altemphasis_color) = 0 then 'green' else locale_altemphasis_color end as altEmphasisColor, "
            + "case when length(locale_expired_color) = 0 then 'red' else locale_expired_color end as expiredColor, "
            + "case when length(locale_future_color) = 0 then 'blue' else locale_future_color end as futureColor, "
            + "coalesce(locale_curr_scale,2) as currencyScale, "
            + "coalesce(locale_salesprice_scale, 4) as salesPriceScale, "
            + "coalesce(locale_purchprice_scale, 4) as purchasePriceScale, "
            + "coalesce(locale_extprice_scale, 2) as extPriceScale, "
            + "coalesce(locale_cost_scale, 4) as costScale, "
            + "coalesce(locale_qty_scale, 2) as qtyScale, "
            + "coalesce(locale_qtyper_scale, 6) as qtyPerScale, "
            + "coalesce(locale_uomratio_scale, 6) as uomRatioScale, "
            + "coalesce(locale_percent_scale, 2) as percentScale "
            + "from locale "
            + "join usr on usr_locale_id = locale_id "
            + "left outer join lang on locale_lang_id = lang_id "
            + "left outer join country on locale_country_id = country_id "
            + "where usr_username = getEffectiveXtUser() ", 
    rec = executeSql(sql)[0];

    /* determine culture */
    var country = rec.country || -1,
        language = rec.language || -1,
        countryAbbr, languageAbbr,
        culture = 'en-US';
    if (country > 0 && language > 0) {
      countryAbbr = executeSql('select country_abbr as result from country where country_id=$1', [country])[0].result;
      languageAbbr = executeSql('select lang_abbr2 as result from lang where lang_id=$1', [language])[0].result;
      if (languageAbbr && countryAbbr) culture = languageAbbr+'-'+countryAbbr;
    }
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

    @returns {hash}
  */ 
  XT.Session.privileges = function() {
    var rec = executeSql( 'select privilege, granted as "isGranted" from privgranted' );

    return rec.length ? JSON.stringify (rec) : '{}';
  }
  
$$ );

