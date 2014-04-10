CREATE OR REPLACE FUNCTION calcPurchaseOrderAmt(pPoheadid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN calcPurchaseOrderAmt(pPoheadid, 'T');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcPurchaseOrderAmt(pPoheadid INTEGER,
                                                pType TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _subtotal NUMERIC := 0;
  _freightsub NUMERIC := 0;
  _tax NUMERIC := 0;
  _freight NUMERIC := 0;
  _currid INTEGER := 0;
  _effdate DATE := CURRENT_DATE;
  _amount NUMERIC := 0;

BEGIN

  -- pType: S = line item subtotal
  --        T = total
  --        X = tax

  SELECT COALESCE(SUM(ROUND(poitem_qty_ordered * poitem_unitprice, 2)), 0),
         COALESCE(SUM(ROUND(poitem_freight, 2)), 0)
         INTO _subtotal, _freightsub
  FROM poitem
  WHERE (poitem_pohead_id=pPoheadid);

  SELECT COALESCE(SUM(tax), 0) INTO _tax
  FROM ( SELECT COALESCE(ROUND(SUM(taxdetail_tax), 2), 0.0) AS tax
         FROM tax JOIN calculateTaxDetailSummary('PO', pPoheadid, 'T') ON (taxdetail_tax_id=tax_id)
         GROUP BY tax_id ) AS data;

  SELECT COALESCE(pohead_freight, 0), pohead_curr_id, pohead_orderdate
         INTO _freight, _currid, _effdate
  FROM pohead
  WHERE (pohead_id=pPoheadid);

  _amount := currToBase(_currid,
                        CASE pType WHEN 'S' THEN (_subtotal)
                                   WHEN 'T' THEN (_subtotal + _tax + _freight + _freightsub)
                                   WHEN 'X' THEN (_tax)
                                   ELSE 0.0
                        END,
                        _effdate);

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';
