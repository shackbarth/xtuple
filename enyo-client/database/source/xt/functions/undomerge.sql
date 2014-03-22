create or replace function xt.undomerge(schema_name text, table_name text, id integer) returns integer as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  var result;
  XT.allowEditComments = true;
  result = plv8.execute('select public.undomerge($1, $2, $3) as result;', [schema_name, table_name, id])[0].result;
  XT.allowEditComments = false;
  return result;

$$ language plv8;
