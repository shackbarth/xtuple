CREATE OR REPLACE FUNCTION orderedByWo(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pLookAheadDays ALIAS FOR $2;

BEGIN

  RETURN orderedByWo(pItemsiteid, startOfTime(), (CURRENT_DATE + pLookAheadDays));

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION orderedByWo(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _itemType CHARACTER(1);
  _qty NUMERIC := 0;

BEGIN
  SELECT item_type INTO _itemType
  FROM itemsite, item
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_id=pItemsiteid) );
  
  IF (_itemType NOT IN ('C','T')) THEN
    SELECT COALESCE(SUM(noNeg(wo_qtyord - wo_qtyrcv)), 0.0) INTO _qty
    FROM wo
    WHERE ( (wo_status <> 'C')
     AND (wo_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) );
  ELSIF (_itemType = 'C') THEN
    SELECT COALESCE(SUM((noNeg(wo_qtyord - wo_qtyrcv) * brddist_stdqtyper)), 0.0) INTO _qty
    FROM wo, xtmfg.brddist
    WHERE ( (wo_status <> 'C')
     AND (brddist_wo_id=wo_id)
     AND (brddist_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) );
  ELSIF (_itemType = 'T' AND fetchMetricBool('Routings')) THEN -- Tooling:  Determine quantity already returned
    SELECT
      -- Qty Required
      COALESCE(SUM(noNeg(womatl_qtyreq)),0)  - 
      -- Qty Returned
     (SELECT COALESCE(SUM(abs(invhist_invqty)),0) 
      FROM wo
        JOIN womatl ON (womatl_wo_id=wo_id)
        JOIN womatlpost ON (womatl_id=womatlpost_womatl_id)
        JOIN invhist ON ((womatlpost_invhist_id=invhist_id)
                     AND (invhist_invqty < 0))   
      LEFT OUTER JOIN xtmfg.wooper ON (womatl_wooper_id=wooper_id)
    WHERE ( NOT (COALESCE(wooper_rncomplete,wo_status = 'C'))
     AND (womatl_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) )
       )
   INTO _qty
    FROM wo
      JOIN womatl ON (womatl_wo_id=wo_id)
      LEFT OUTER JOIN xtmfg.wooper ON (womatl_wooper_id=wooper_id)
    WHERE ( NOT (COALESCE(wooper_rncomplete,wo_status = 'C'))
     AND (womatl_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) )
    GROUP BY womatl_qtyreq;   
  ELSIF (_itemType = 'T') THEN -- Tooling:  Determine quantity already returned
    SELECT
      -- Qty Required
      COALESCE(SUM(noNeg(womatl_qtyreq)),0)  - 
      -- Qty Returned
     (SELECT COALESCE(SUM(abs(invhist_invqty)),0) 
      FROM wo
        JOIN womatl ON (womatl_wo_id=wo_id)
        JOIN womatlpost ON (womatl_id=womatlpost_womatl_id)
        JOIN invhist ON ((womatlpost_invhist_id=invhist_id)
                     AND (invhist_invqty < 0))
    WHERE ( NOT (wo_status = 'C')
     AND (womatl_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) )
       )
   INTO _qty
    FROM wo
      JOIN womatl ON (womatl_wo_id=wo_id)
    WHERE ( NOT (wo_status = 'C')
     AND (womatl_itemsite_id=pItemsiteid)
     AND (wo_duedate BETWEEN pStartDate AND pEndDate) )
    GROUP BY womatl_qtyreq;   
  END IF;

  RETURN COALESCE(_qty,0);

END;
$$ LANGUAGE 'plpgsql';
