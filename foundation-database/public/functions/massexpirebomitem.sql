CREATE OR REPLACE FUNCTION massExpireBomitem(INTEGER, DATE, TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pExpireDate ALIAS FOR $2;
  pECN ALIAS FOR $3;

BEGIN

  UPDATE bomitem
  SET bomitem_expires=pExpireDate
  WHERE ( (bomitem_expires >= CURRENT_DATE)
   AND (bomitem_item_id=pItemid)
   AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id)) );

  RETURN TRUE;
END;
$$ LANGUAGE 'plpgsql';
