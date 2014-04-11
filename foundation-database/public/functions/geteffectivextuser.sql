CREATE OR REPLACE FUNCTION getEffectiveXtUser() RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
/*
  The default return value of this function is simply
  the user currently connected.
  
  Overload this function from another schema 
  to implement specific user handling from an external 
  application that uses connection pooling. 
  Use setEffectiveXtUser(text) to create a temporary table that 
  inserts user data that can in turn be used as a lookup 
  reference for an over loaded version of this function like so:
  
  SELECT effective_value
  FROM effective_user
  WHERE effective_key = 'username'
*/

  RETURN CURRENT_USER;

END;
$$ LANGUAGE 'plpgsql' STABLE;

