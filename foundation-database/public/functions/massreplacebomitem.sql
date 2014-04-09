CREATE OR REPLACE FUNCTION massReplaceBomitem(INTEGER, INTEGER, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pNewItemid ALIAS FOR $1;
  pOriginalItemid ALIAS FOR $2;
  pEffectiveDate ALIAS FOR $3;
  pECN ALIAS FOR $4;
  _effectiveDate DATE;
  _result		INTEGER;

BEGIN

  _effectiveDate := COALESCE(pEffectiveDate, CURRENT_DATE);

  IF (BOMContains(pOriginalItemid, pNewItemid) OR
      BOMContains(pNewItemid, pOriginalItemid)) THEN
    RETURN -1;
  END IF;

  INSERT INTO bomitem
  ( bomitem_parent_item_id, bomitem_seqnumber,
    bomitem_item_id, bomitem_qtyfxd, bomitem_qtyper, bomitem_uom_id,
    bomitem_scrap, bomitem_effective, bomitem_expires, bomitem_ecn,
    bomitem_createwo, bomitem_issuemethod, bomitem_subtype,
    bomitem_booitem_seq_id, bomitem_schedatwooper, bomitem_moddate, bomitem_rev_id,
    bomitem_char_id, bomitem_value )
  SELECT bomitem_parent_item_id, bomitem_seqnumber,
         pNewItemid, bomitem_qtyfxd, bomitem_qtyper, bomitem_uom_id,
         bomitem_scrap, _effectiveDate, endOfTime(), pECN,
         bomitem_createwo, bomitem_issuemethod, 'I',
         bomitem_booitem_seq_id, bomitem_schedatwooper, CURRENT_DATE, getActiveRevId('BOM',bomitem_parent_item_id),
         bomitem_char_id, bomitem_value
  FROM bomitem
  WHERE ( (_effectiveDate < bomitem_expires)
   AND (bomitem_item_id=pOriginalItemid)
   AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id)) );

  UPDATE bomitem
  SET bomitem_expires=_effectiveDate
  WHERE ( (_effectiveDate < bomitem_expires)
   AND (bomitem_item_id=pOriginalItemid)
   AND (bomitem_rev_id=getActiveRevid('BOM',bomitem_parent_item_id)) );

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
