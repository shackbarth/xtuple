create or replace function private.session_locale() 
  returns text stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //
  var sql = "select "
      + "locale_id as guid, "
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
      + "where usr_username = current_user ";
  var rec = executeSql( sql );
	/* Testing to format json string (rec, null, 2) */
  return rec.length ? JSON.stringify (rec) : '{}';

$$ LANGUAGE plv8;
/*
select private.session_locale();
*/