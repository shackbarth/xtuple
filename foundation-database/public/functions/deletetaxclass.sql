CREATE OR REPLACE FUNCTION deletetaxclass(integer)
  RETURNS integer AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
pTaxclassid ALIAS FOR $1;
_result INTEGER;

BEGIN

-- Check to find if the tax class is used in any tax code
SELECT tax_id INTO _result
FROM tax
WHERE (tax_taxclass_id = pTaxclassid);
IF (FOUND) THEN
   RETURN -1;
END IF;

-- Delete the tax class if the above condition doesn't match
DELETE FROM taxclass WHERE taxclass_id = pTaxclassid ;

RETURN pTaxclassid;

END;
$$
  LANGUAGE 'plpgsql' VOLATILE;
