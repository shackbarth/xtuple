CREATE OR REPLACE FUNCTION xt.order_total_qty_issue_remaining(text, integer)
  RETURNS numeric AS
$BODY$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrdertype ALIAS FOR $1;
  pOrderid ALIAS FOR $2;
  _totalqty NUMERIC := 0;

BEGIN
  IF pOrdertype = 'SO' THEN 
      SELECT COALESCE(SUM(ROUND(((coitem_qtyord - coitem_qtyshipped) * coitem_qty_invuomratio), 2)), 0) INTO _totalqty
      FROM coitem
      WHERE (coitem_cohead_id=pOrderid)  
        AND coitem_status NOT IN ('X', 'C');
  ELSEIF pOrdertype = 'WO' THEN 
      SELECT COALESCE(SUM(ROUND((womatl_qtyreq - womatl_qtyiss), 2)), 0) INTO _totalqty
      FROM womatl
      WHERE (womatl_wo_id=pOrderid)
        AND (womatl_issuemethod <> 'L');
  END IF;

  RETURN _totalqty;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt.order_total_qty_issue_remaining(text, integer)
  OWNER TO admin;

