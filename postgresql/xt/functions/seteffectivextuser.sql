create or replace function xt.setEffectiveXtUser(username text) returns bool as $$
/* Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XT.username = username;
  return true;
  
$$ language 'plv8';
