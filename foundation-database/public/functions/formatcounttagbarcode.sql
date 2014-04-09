
CREATE OR REPLACE FUNCTION formatCountTagBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCnttagid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138CTXX' ||
           LTRIM(TO_CHAR(LENGTH(invcnt_tagnumber), '00')) || invcnt_tagnumber ) INTO _barcode
  FROM invcnt
  WHERE (invcnt_id=pCnttagid);

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

