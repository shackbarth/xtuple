create or replace function xt.usr_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var sql = "select setUserPreference('" + NEW.usr_username + "', '{name}', $1)";
 if (TG_OP === 'INSERT') {
   /* XXX FIXME TODO: use XT.format */
   /* https://github.com/xtuple/xtuple/blob/master/lib/orm/source/xt/functions/js_init.sql#L282 */
   var sqlInsert = "create user " + NEW.usr_username.toLowerCase();
   plv8.execute(sqlInsert);
 }

 /* Avoid recursive behavior by only updating from one side */
 if (!XT.UserPreferencesUpdating) {
   XT.UserPreferencesUpdating = true;
   plv8.execute(sql.replace("{name}", 'propername'), [NEW.usr_propername]);
   plv8.execute(sql.replace("{name}", 'email'), [NEW.usr_email]);
   plv8.execute(sql.replace("{name}", 'initials'), [NEW.usr_initials]);
   plv8.execute(sql.replace("{name}", 'locale_id'), [NEW.usr_locale_id + ""]);
   plv8.execute(sql.replace("{name}", 'active'), [NEW.usr_active ? 't' : 'f'] );
   plv8.execute(sql.replace("{name}", 'UseEnhancedAuth'), [NEW.usr_enhancedauth ? 't' : 'f'] );
   XT.UserPreferencesUpdating = false;
 }
  
 return NEW;

$$ language plv8;
