CREATE OR REPLACE FUNCTION calcSalesOrderAmt(pCoheadid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN calcSalesOrderAmt(pCoheadid, 'T');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcSalesOrderAmt(pCoheadid INTEGER,
                                             pType TEXT) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _subtotal NUMERIC := 0.0;
  _cost NUMERIC := 0.0;
  _tax NUMERIC := 0.0;
  _freight NUMERIC := 0.0;
  _misc NUMERIC := 0.0;
  _credit NUMERIC := 0.0;
  _amount NUMERIC := 0.0;

BEGIN

  -- pType: S = line item subtotal
  --        T = total
  --        B = balance due
  --        C = allocated credits
  --        X = tax
  --        M = margin

  SELECT COALESCE(SUM(ROUND((coitem_qtyord * coitem_qty_invuomratio) *
                            (coitem_price / coitem_price_invuomratio), 2)), 0.0),
         COALESCE(SUM(ROUND((coitem_qtyord * coitem_qty_invuomratio) *
                            (CASE WHEN (coitem_subnumber > 0) THEN 0.0 ELSE coitem_unitcost END
                             / coitem_price_invuomratio), 2)), 0.0)
         INTO _subtotal, _cost
  FROM coitem
  WHERE (coitem_cohead_id=pCoheadid)
    AND (coitem_status != 'X');

  IF (pType IN ('T', 'B', 'X')) THEN
    SELECT COALESCE(SUM(tax), 0.0) INTO _tax
    FROM (SELECT COALESCE(ROUND(SUM(taxdetail_tax), 2), 0.0) AS tax
          FROM tax
               JOIN calculateTaxDetailSummary('S', pCoheadid, 'T')ON (taxdetail_tax_id=tax_id)
          GROUP BY tax_id) AS data;
  END IF;

  IF (pType IN ('T', 'B', 'C')) THEN
    SELECT COALESCE(cohead_freight, 0), COALESCE(cohead_misc, 0),
           COALESCE(SUM(currToCurr(aropenalloc_curr_id, cohead_curr_id,
                                   aropenalloc_amount, CURRENT_DATE)),0)
           INTO _freight, _misc, _credit
    FROM cohead
         LEFT OUTER JOIN aropenalloc ON (aropenalloc_doctype='S' AND aropenalloc_doc_id=cohead_id)
    WHERE (cohead_id=pCoheadid)
    GROUP BY cohead_freight, cohead_misc, cohead_curr_id;
  END IF;

  _amount := CASE pType WHEN 'S' THEN (_subtotal)
                        WHEN 'T' THEN (_subtotal + _tax + _freight + _misc)
                        WHEN 'B' THEN (_subtotal + _tax + _freight + _misc - _credit)
                        WHEN 'C' THEN (_credit)
                        WHEN 'X' THEN (_tax)
                        WHEN 'M' THEN (_subtotal - _cost)
                        ELSE 0.0
             END;

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';
