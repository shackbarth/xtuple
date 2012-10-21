create or replace function xt.useracct_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 /* Set a unique id. Some ids come from pg_user oid, so there could be overlap */
 var sql = "select nextval('xt.useracct_useracct_id_seq') as sequence;",
   sql2 = "select useracct_id from xt.useracct where useracct_id = $1;",
   sql3 = "update xt.useracct set useracct_id = $1 where useracct_username = $2;",
   id,
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
  
 return NEW;

$$ language plv8;
