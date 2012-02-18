create or replace function xt.is_date(text) returns boolean immutable as $$ 
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
begin 
  perform coalesce($1,'')::date; 
  return true; 
  exception when others then 
    return false; 
end; 
$$ language plpgsql; 
