CREATE OR REPLACE FUNCTION issueWoMaterialBatch(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  _itemlocSeries INTEGER;
  _r RECORD;
  _woNumber TEXT;

BEGIN

  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;

  FOR _r IN SELECT womatl_id, 
              CASE WHEN (womatl_qtyreq >= 0) THEN
                roundQty(itemuomfractionalbyuom(item_id, womatl_uom_id), noNeg(womatl_qtyreq - womatl_qtyiss))
              ELSE
                roundQty(itemuomfractionalbyuom(item_id, womatl_uom_id), noNeg(womatl_qtyiss * -1)) 
              END AS qty
            FROM womatl, itemsite, item
            WHERE ( (womatl_itemsite_id=itemsite_id)
             AND (itemsite_item_id=item_id)
             AND (womatl_issuemethod IN ('S', 'M'))
             AND (womatl_wo_id=pWoid) ) LOOP

    IF (_r.qty > 0) THEN
      SELECT issueWoMaterial(_r.womatl_id, _r.qty, _itemlocSeries, TRUE) INTO _itemlocSeries;
    END IF;

  END LOOP;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
