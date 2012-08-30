create or replace function xt.cntctmerge(source_id integer, target_id integer, purge boolean) returns boolean AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
declare
  result boolean;
begin
  alter table comment disable trigger comment_did_change;
  result = public.cntctmerge(source_id, target_id, purge);
  alter table comment enable trigger comment_did_change;
  return result;
end;
$$ language 'plpgsql';
