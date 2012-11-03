create or replace function xt.usrpref_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var sql = 'update xt.useracct set {col} = $1 where useracct_username = $2';

 switch (NEW.usrpref_name)
 {
 case 'active':
   plv8.execute(sql.replace("{col}", "useracct_active"), [NEW.usrpref_value === 't', NEW.usrpref_username]);
   break;
 case 'DisableExportContents':
   plv8.execute(sql.replace("{col}", "useracct_disable_export"), [NEW.usrpref_value === 't', NEW.usrpref_username]);
   break;
 case 'propername':
   plv8.execute(sql.replace("{col}", "useracct_propername"), [NEW.usrpref_value, NEW.usrpref_username]);
   break;
 case 'email':
   plv8.execute(sql.replace("{col}", "useracct_email"), [NEW.usrpref_value, NEW.usrpref_username]);
   break
 case 'initials':
   plv8.execute(sql.replace("{col}", "useracct_initials"), [NEW.usrpref_value, NEW.usrpref_username]);
   break;
 case 'locale_id':
   plv8.execute(sql.replace("{col}", "useracct_locale_id"), [NEW.usrpref_value - 0, NEW.usrpref_username]);
   break;
 }
 return NEW;

$$ language plv8;
