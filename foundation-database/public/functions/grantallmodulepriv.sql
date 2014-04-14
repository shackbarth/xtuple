CREATE OR REPLACE FUNCTION grantAllModulePriv(TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pModuleName ALIAS FOR $2;
  _priv RECORD;
  _privCounter INTEGER;

BEGIN

  _privCounter := 0;

  FOR _priv IN SELECT priv_id
               FROM priv 
               WHERE (priv_module=pModuleName) LOOP

    IF (SELECT grantPriv(pUsername, _priv.priv_id)) THEN
      _privCounter := _privCounter + 1;
    END IF;

  END LOOP;

  RETURN _privCounter;

END;
$$ LANGUAGE 'plpgsql';

