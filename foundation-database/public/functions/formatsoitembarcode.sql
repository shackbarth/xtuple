
CREATE OR REPLACE FUNCTION formatSoitemBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoitemid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138SOLI' ||
           LENGTH(TEXT(cohead_number)) || LENGTH(formatsolinenumber(coitem_id)) ||
           TEXT(cohead_number) || formatsolinenumber(coitem_id) ) INTO _barcode
  FROM cohead, coitem
  WHERE ( (coitem_cohead_id=cohead_id)
   AND (coitem_id=pSoitemid) );

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

