create or replace function xt.useracct_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var sql = "select setUserPreference('" + NEW.useracct_username + "', '{name}', $1)";
 if (TG_OP === 'INSERT') {
   /* Set a unique id. Some ids come from pg_user oid, so there could be overlap */
   var sql = "select nextval('xt.useracct_useracct_id_seq') as sequence;",
     sql2 = "select useracct_id from xt.useracct where useracct_id = $1;",
     sql3 = "update xt.useracct set useracct_id = $1 where useracct_username = $2;",
     sql4 = "update xt.useracct set useracct_username = $1 where useracct_username = $2;",
     id = NEW.useracct_id,
     res;
   while (!id) {
     id = plv8.execute(sql)[0].sequence;
     res = plv8.execute(sql2, [ id ]);
     if (res.length) { 
       id = undefined;
     } else {
       plv8.execute(sql3, [ id, NEW.useracct_username ]);
     }
   }
 
   if (NEW.useracct_username !== NEW.useracct_username.toLowerCase()) {
     plv8.execute(sql4, [ NEW.useracct_username.toLowerCase(), NEW.useracct_username ]);
   }
 }

 /* Avoid recursive behavior by only updating from one side */
 if (!XT.UserPreferencesUpdating) {
   XT.UserPreferencesUpdating = true;
   plv8.execute(sql.replace("{name}", 'DisableExportContents'), [NEW.useracct_disable_export ? 't' : 'f'] );
   plv8.execute(sql.replace("{name}", 'propername'), [NEW.useracct_propername]);
   plv8.execute(sql.replace("{name}", 'email'), [NEW.useracct_email]);
   plv8.execute(sql.replace("{name}", 'initials'), [NEW.useracct_initials]);
   plv8.execute(sql.replace("{name}", 'locale_id'), [NEW.useracct_locale_id + ""]);
   plv8.execute(sql.replace("{name}", 'active'), [NEW.useracct_active ? 't' : 'f'] );
   XT.UserPreferencesUpdating = false;
 }
  
 return NEW;

$$ language plv8;
