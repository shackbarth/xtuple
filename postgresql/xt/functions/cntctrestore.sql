create or replace function xt.cntctrestore(contact_id integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
declare
  result boolean;
begin
  alter table comment disable trigger comment_did_change;
  result = public.cntctrestore(contact_id);
  alter table comment enable trigger comment_did_change;
  return result;
end;
$$ language 'plpgsql';
