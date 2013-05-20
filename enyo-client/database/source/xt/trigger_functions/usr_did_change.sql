create or replace function xt.usr_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var sql = "select setUserPreference('" + NEW.usr_username + "', '{name}', $1)";
 if (TG_OP === 'INSERT') {
   /* Set a unique id. Some ids come from pg_user oid, so there could be overlap */
   var sql1 = "select nextval('usr_usr_id_seq') as sequence;",
     sql2 = "select usr_id from usr where usr_username = $1;",
     sql3 = "update usr set usr_id = $1 where usr_username = $2;",
     sql4 = "update usr set usr_username = $1 where usr_username = $2;",
     id = NEW.usr_id,
     res;
   while (!id) {
     id = plv8.execute(sql1)[0].sequence;
     res = plv8.execute(sql2, [ id ]);
     if (res.length) { 
       id = undefined;
     } else {
       plv8.execute(sql3, [ id, NEW.usr_username ]);
     }
   }
 
   if (NEW.useracct_username !== NEW.usr_username.toLowerCase()) {
     plv8.execute(sql4, [ NEW.usr_username.toLowerCase(), NEW.usr_username ]);
   }
 }

 /* Avoid recursive behavior by only updating from one side */
 if (!XT.UserPreferencesUpdating) {
   XT.UserPreferencesUpdating = true;
   plv8.execute(sql.replace("{name}", 'propername'), [NEW.usr_propername]);
   plv8.execute(sql.replace("{name}", 'email'), [NEW.usr_email]);
   plv8.execute(sql.replace("{name}", 'initials'), [NEW.usr_initials]);
   plv8.execute(sql.replace("{name}", 'locale_id'), [NEW.usr_locale_id + ""]);
   plv8.execute(sql.replace("{name}", 'active'), [NEW.usr_active ? 't' : 'f'] );
   XT.UserPreferencesUpdating = false;
 }
  
 return NEW;

$$ language plv8;
