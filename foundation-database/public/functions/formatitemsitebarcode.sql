CREATE OR REPLACE FUNCTION formatItemSiteBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138ISXX' ||
           LTRIM(TO_CHAR(LENGTH(item_number), '00')) || LENGTH(warehous_code)::TEXT ||
           item_number || warehous_code ) INTO _barcode
  FROM itemsite, item, whsinfo
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_warehous_id=warehous_id)
   AND (itemsite_id=pItemsiteid) );

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

