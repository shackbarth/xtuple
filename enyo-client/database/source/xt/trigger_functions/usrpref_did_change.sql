create or replace function xt.usrpref_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

 var sql = "update xt.usrlite set usr_{name} = $1 where usr_username = $2",
   val = NEW.usrpref_value,
   name;

 /* If the prefence is related to a user account, update our "lite" table */
 switch (NEW.usrpref_name)
 {
   case "propername":
   case "active":
   case "email":
   case "agent":
     name = NEW.usrpref_name;
     break;
   case "DisableExportContents":
     name = "disable_export"; 
 }

 if (NEW.usrpref_name === 'active' ||
     NEW.usrpref_name === 'agent' ||
     NEW.usrpref_name === 'DisableExportContents') {
   val = val === 't' ? true : false; 
 }

 if (name) {
   sql = sql.replace("{name}", name); 
   plv8.execute(sql, [ val, NEW.usrpref_username]);
 }
 
 return NEW;

}());

$$ language plv8;
