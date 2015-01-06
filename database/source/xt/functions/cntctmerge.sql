create or replace function xt.cntctmerge(source_id integer, target_id integer, purge boolean) returns boolean as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XT.allowEditComments = true;
  plv8.execute('select public.cntctmerge($1, $2, $3);', [source_id, target_id, purge]);
  XT.allowEditComments = false;
  return true;

$$ language plv8;
