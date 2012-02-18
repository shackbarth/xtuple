create or replace function xt.text_lt_date(arg1 text, arg2 date) returns boolean immutable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
     
  select case when xt.is_date($1) then $1::date < $2 else false end;
$$ language 'sql';
