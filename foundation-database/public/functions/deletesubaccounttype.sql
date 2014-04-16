
CREATE OR REPLACE FUNCTION deleteSubAccountType (integer) RETURNS integer
    AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSubAccntTypeid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if the passed subaccnttype is used in any accounts
  SELECT accnt_id INTO _check
  FROM accnt, subaccnttype
  WHERE ( (accnt_subaccnttype_code=subaccnttype_code)
   AND (subaccnttype_id=pSubAccntTypeid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Delete the Sub Account Type
  DELETE FROM subaccnttype
  WHERE (subaccnttype_id=pSubAccntTypeid);

  RETURN 0;

END;
' LANGUAGE 'plpgsql';

