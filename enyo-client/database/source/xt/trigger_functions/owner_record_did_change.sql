create or replace function xt.owner_record_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var sql;
 
 /* Set server side default enforcement if no privilege for owner */
 if (TG_OP === 'INSERT' && !XT.Data.checkPrivilege("editOwner")) {
   sql = "update " + TG_TABLE_SCHEMA + "." + TG_TABLE_NAME + " set " +
         "owner = geteffectivextuser() where id = " + NEW.id;
   plv8.execute(sql);
 }

 return NEW;

$$ language plv8;
