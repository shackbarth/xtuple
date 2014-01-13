create or replace function xt.mergecrmaccts(target_id integer, purge boolean) returns integer as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  var result;
  XT.allowEditComments = true;
  result = plv8.execute('select public.mergecrmaccts($1, $2) as result;', [target_id, purge])[0].result;
  XT.allowEditComments = false;
  return result;

$$ language plv8;
