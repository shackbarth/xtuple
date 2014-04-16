CREATE OR REPLACE FUNCTION allocatedForWo(INTEGER, INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pLookAheadDays ALIAS FOR $2;

BEGIN

  RETURN allocatedForWo(pItemsiteid, startOfTime(), (CURRENT_DATE + pLookaheadDays));

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION allocatedForWo(INTEGER, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  RETURN allocatedForWo(pItemsiteid, startOfTime(), pDate);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION allocatedForWo(INTEGER, DATE, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _itemtype TEXT;
  _qty NUMERIC;

BEGIN

  SELECT item_type INTO _itemtype
  FROM itemsite JOIN item ON (item_id=itemsite_item_id)
  WHERE (itemsite_id=pItemsiteid);

  IF (_itemtype != 'T') THEN
    SELECT
      COALESCE(SUM(noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - womatl_qtyiss))), 0.0) INTO _qty
    FROM womatl JOIN wo ON (wo_id=womatl_wo_id AND wo_status IN ('E','I','R'))
                JOIN itemsite ON (itemsite_id=womatl_itemsite_id)
    WHERE (womatl_itemsite_id=pItemsiteid)
      AND (womatl_duedate BETWEEN pStartDate AND pEndDate);
  ELSE
    SELECT
      COALESCE(SUM(noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq))), 0.0)  -
	(
		SELECT COALESCE(SUM(invhist_invqty),0) 
		FROM itemsite, item, wo, womatl
			LEFT OUTER JOIN womatlpost ON (womatl_id=womatlpost_womatl_id)
			LEFT OUTER JOIN invhist ON ((womatlpost_invhist_id=invhist_id)
                            AND (invhist_invqty > 0))
		WHERE ( (womatl_itemsite_id=pItemsiteid)
		AND (womatl_itemsite_id=itemsite_id)
		AND (itemsite_item_id=item_id)
		AND (womatl_duedate BETWEEN pStartDate AND pEndDate) 
		AND (wo_id=womatl_wo_id)
		AND (wo_status IN ('E','I','R')) )
	) INTO _qty
    FROM womatl JOIN wo ON (wo_id=womatl_wo_id AND wo_status IN ('E','I','R'))
                JOIN itemsite ON (itemsite_id=womatl_itemsite_id)
    WHERE (womatl_itemsite_id=pItemsiteid)
      AND (womatl_duedate BETWEEN pStartDate AND pEndDate);
  END IF;

  RETURN COALESCE(_qty,0);

END;
$$ LANGUAGE 'plpgsql';
