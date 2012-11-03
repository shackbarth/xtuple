create or replace function xt.useracct_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

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

 select setUserPreference(new.nodeusr_username, 'DisableExportContents', case when new.useracct_disable_export then 't' else 'f' end );
 select setUserPreference(new.nodeusr_username, 'propername', new.useracct_propername);
 select setUserPreference(new.nodeusr_username, 'email', new.useracct_email);
 select setUserPreference(new.nodeusr_username, 'initials', new.useracct_initials);
 select setUserPreference(new.nodeusr_username, 'locale_id', new.useracct_locale_id::text);
 select setUserPreference(new.nodeusr_username, 'active', case when new.useracct_active then 't' else 'f' end );
  
 return NEW;

$$ language plv8;
