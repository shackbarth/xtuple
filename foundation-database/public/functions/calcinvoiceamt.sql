CREATE OR REPLACE FUNCTION calcInvoiceAmt(pInvcheadid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN calcInvoiceAmt(pInvcheadid, 'T');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcInvoiceAmt(pInvcheadid INTEGER,
                                          pType TEXT) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _subtotal NUMERIC := 0.0;
  _cost NUMERIC := 0.0;
  _tax NUMERIC := 0.0;
  _freight NUMERIC := 0.0;
  _misc NUMERIC := 0.0;
  _amount NUMERIC := 0.0;

BEGIN

  -- pType: S = line item subtotal
  --        T = total
  --        X = tax
  --        M = margin

  SELECT COALESCE(SUM(ROUND((invcitem_billed * invcitem_qty_invuomratio) *
                            (invcitem_price / COALESCE(invcitem_price_invuomratio, 1.0)), 2)), 0.0),
         COALESCE(SUM(ROUND((invcitem_billed * invcitem_qty_invuomratio) *
                            COALESCE(coitem_unitcost, itemCost(itemsite_id), 0.0), 2)), 0.0)
         INTO _subtotal, _cost
  FROM invcitem LEFT OUTER JOIN coitem ON (coitem_id=invcitem_coitem_id)
                LEFT OUTER JOIN itemsite ON (itemsite_item_id=invcitem_item_id AND itemsite_warehous_id=invcitem_warehous_id)
  WHERE (invcitem_invchead_id=pInvcheadid);

  IF (pType IN ('T', 'X')) THEN
    SELECT COALESCE(SUM(tax), 0.0) INTO _tax
    FROM (SELECT COALESCE(ROUND(SUM(taxdetail_tax), 2), 0.0) AS tax
          FROM tax
               JOIN calculateTaxDetailSummary('I', pInvcheadid, 'T')ON (taxdetail_tax_id=tax_id)
          GROUP BY tax_id) AS data;
  END IF;

  IF (pType = 'T') THEN
    SELECT COALESCE(invchead_freight, 0), COALESCE(invchead_misc_amount, 0)
           INTO _freight, _misc
    FROM invchead
    WHERE (invchead_id=pinvcheadid);
  END IF;

  _amount := CASE pType WHEN 'S' THEN (_subtotal)
                        WHEN 'T' THEN (_subtotal + _tax + _freight + _misc)
                        WHEN 'X' THEN (_tax)
                        WHEN 'M' THEN (_subtotal - _cost)
                        ELSE 0.0
             END;

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';
