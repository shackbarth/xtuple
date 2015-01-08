create or replace function xt.cntctrestore(contact_id integer) returns boolean as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XT.allowEditComments = true;
  plv8.execute('select public.cntctrestore($1);', [contact_id]);
  XT.allowEditComments = false;
  return true;

$$ language plv8;
