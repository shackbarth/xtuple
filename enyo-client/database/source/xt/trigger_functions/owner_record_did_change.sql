create or replace function xt.owner_record_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

 var id = TG_TABLE_NAME + "_id",
   sql;

 /* Set server side default enforcement if no privilege for owner */
 if (TG_OP === 'INSERT' && !XT.Data.checkPrivilege("editOwner")) {
   sql = "update " + TG_TABLE_SCHEMA + "." + TG_TABLE_NAME + " set " + TG_TABLE_NAME +
         "_owner_username = geteffectivextuser() where " + id + " = " + NEW[id];
   plv8.execute(sql);
 }

 return NEW;

}());

$$ language plv8;
