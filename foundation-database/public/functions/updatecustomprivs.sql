
CREATE OR REPLACE FUNCTION updateCustomPrivs() RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;
BEGIN

  FOR _r IN SELECT priv_id
              FROM priv
             WHERE ((priv_name IN (SELECT priv_name
                                     FROM priv
                                    WHERE (priv_module=''Custom'')
                                   EXCEPT
                                   SELECT (''Custom''||cmd_privname)
                                     FROM cmd))
               AND  (priv_module=''Custom'')) LOOP
    -- TODO: something here
    DELETE FROM grppriv WHERE grppriv_priv_id=_r.priv_id;
    DELETE FROM usrpriv WHERE usrpriv_priv_id=_r.priv_id;
    DELETE FROM priv WHERE priv_id=_r.priv_id;
  END LOOP;

  FOR _r IN SELECT (''Custom''||cmd_privname) AS privname
              FROM cmd
            EXCEPT
            SELECT priv_name
              FROM priv
             WHERE (priv_module=''Custom'') LOOP
    -- TODO: something here
    INSERT INTO priv (priv_module, priv_name, priv_descrip)
              VALUES (''Custom'', _r.privname, ''Auto Generated Custom Priv.'');
  END LOOP;

  RETURN TRUE;
END;
' LANGUAGE 'plpgsql';

