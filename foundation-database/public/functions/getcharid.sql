CREATE OR REPLACE FUNCTION getCharId(pChar text,
                                     pType text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (COALESCE(pChar, '') = '') THEN
    RETURN NULL;
  END IF;

  SELECT char_id INTO _returnVal
  FROM char
  WHERE ((char_name=pChar)
  AND ((pType IN ('C','CT') AND char_customers)
    OR (pType IN ('I','SI','QI','W','PI','TI') AND char_items)
    OR (pType='CRMACCT' AND char_crmaccounts)
    OR (pType='ADDR' AND char_addresses)
    OR (pType='CNTCT' AND char_contacts)
    OR (pType='LS' AND char_lotserial)
    OR (pType='EMP' AND char_employees)
    OR (pType='INCDT' AND char_incidents)
    )) LIMIT 1;

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Characteristic % not found.', pChar;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
