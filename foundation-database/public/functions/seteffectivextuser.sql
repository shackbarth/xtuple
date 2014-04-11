CREATE OR REPLACE FUNCTION setEffectiveXtUser(TEXT) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
BEGIN
  PERFORM initEffectiveXtUser();

  PERFORM *
     FROM effective_user
    WHERE effective_key = 'username';

  IF FOUND THEN
    UPDATE effective_user
       SET effective_value = pUsername
     WHERE effective_key = 'username';
  ELSE
    INSERT INTO effective_user (effective_key, effective_value)
         VALUES('username', pUsername);
  END IF;

  RETURN true;
END;
$$ LANGUAGE 'plpgsql';
