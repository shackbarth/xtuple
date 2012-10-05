create or replace function xt.cntctrestore(contact_id integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
declare
  result boolean;
begin
  perform setUserPreference(getEffectiveXtUser(),'editCommentsException', 't');
  result = public.cntctrestore(contact_id);
  perform setUserPreference(getEffectiveXtUser(),'editCommentsException', 'f');
  return result;
end;
$$ language 'plpgsql';
