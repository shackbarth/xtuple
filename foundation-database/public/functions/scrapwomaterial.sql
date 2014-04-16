
CREATE OR REPLACE FUNCTION scrapWoMaterial(INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN scrapWoMaterial($1, $2, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION scrapWoMaterial(INTEGER, NUMERIC, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid	ALIAS FOR $1;
  pQty		ALIAS FOR $2;
  pGlDistTS     ALIAS FOR $3;
  _costmethod         	CHAR(1);
  _scrapValue		NUMERIC;
  _r                   	RECORD;

BEGIN
  -- Validate
  IF (pQty <= 0) THEN
    RAISE EXCEPTION 'Scrap quantity must be a positive number';
  ELSIF ( ( SELECT (womatl_qtyiss < pQty)
	     FROM womatl
	     WHERE (womatl_id=pWomatlid) ) ) THEN
    RAISE EXCEPTION 'You may not scrap more material than has been issued';
  END IF;

  -- Get the wip G/L account
  SELECT costcat_wip_accnt_id
    INTO _r
    FROM womatl, wo, itemsite, costcat
   WHERE((womatl_wo_id=wo_id)
     AND (wo_itemsite_id=itemsite_id)
     AND (itemsite_costcat_id=costcat_id)
     AND (womatl_id=pWomatlid));

  -- Calculate scrap value
  SELECT itemsite_costmethod INTO _costmethod
  FROM womatl
    JOIN itemsite ON (womatl_itemsite_id=itemsite_id)
  WHERE (womatl_id=pWomatlid);

  IF (_costmethod = 'S') THEN
    SELECT ROUND((stdCost(itemsite_item_id) * itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, pQty)),2)
    INTO _scrapValue
    FROM womatl
      JOIN itemsite ON (womatl_itemsite_id=itemsite_id)
    WHERE (womatl_id=pWomatlid);
     
  ELSIF (_costmethod = 'A') THEN
    SELECT ROUND((SUM(invhist_invqty * invhist_unitcost)-womatl_scrapvalue)/
            (CASE WHEN (SUM(invhist_invqty)-itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtywipscrap) = 0) THEN
              1
            ELSE
              SUM(invhist_invqty)-itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtywipscrap)
            END),2) * itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, pQty)
      INTO _scrapValue
    FROM womatl
        JOIN womatlpost ON (womatl_id=womatlpost_womatl_id)
        JOIN invhist ON (womatlpost_invhist_id=invhist_id)
        JOIN itemsite ON (womatl_itemsite_id=itemsite_id)
    WHERE (womatl_id=pWomatlid)
    GROUP BY itemsite_item_id,womatl_uom_id,womatl_qtywipscrap,womatl_scrapvalue;
  ELSE
    RAISE EXCEPTION 'Cost method not supported to scrap this item';
  END IF;

  --  Distribute to G/L
  PERFORM insertGLTransaction( 'W/O', 'WO', formatWoNumber(womatl_wo_id),
		 ('Scrap ' || item_number || ' from Work Order'),
		 getPrjAccntId(wo_prj_id, _r.costcat_wip_accnt_id), getPrjAccntId(wo_prj_id, costcat_mfgscrap_accnt_id), -1,
		 _scrapValue, date(pGlDistTS) )
  FROM wo, womatl, itemsite, item, costcat
  WHERE ( (wo_id=womatl_wo_id)
   AND (womatl_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (womatl_id=pWomatlid) );

  UPDATE womatl
  SET womatl_qtywipscrap=(womatl_qtywipscrap + pQty),
    womatl_scrapvalue = womatl_scrapvalue + _scrapValue,
    womatl_qtyiss=(womatl_qtyiss - pQty)
  WHERE (womatl_id=pWomatlid);

  UPDATE wo
  SET wo_wipvalue = wo_wipvalue-_scrapValue,
    wo_postedvalue = wo_postedvalue-_scrapValue
  FROM womatl
  WHERE ((womatl_id=pWomatlid)
   AND (wo_id=womatl_wo_id));

  RETURN pWomatlid;

END;
$$ LANGUAGE 'plpgsql';

