CREATE OR REPLACE FUNCTION calcQuoteAmt(pQuheadid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN calcQuoteAmt(pQuheadid, 'T');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcQuoteAmt(pQuheadid INTEGER,
                                        pType TEXT) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
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

  SELECT COALESCE(SUM(ROUND((quitem_qtyord * quitem_qty_invuomratio) *
                            (quitem_price / quitem_price_invuomratio), 2)), 0.0),
         COALESCE(SUM(ROUND((quitem_qtyord * quitem_qty_invuomratio) *
                            (quitem_unitcost / quitem_price_invuomratio), 2)), 0.0)
         INTO _subtotal, _cost
  FROM quitem
  WHERE (quitem_quhead_id=pQuheadid);

  IF (pType IN ('T', 'X')) THEN
    SELECT SUM(tax) INTO _tax
    FROM (SELECT COALESCE(ROUND(SUM(taxdetail_tax), 2), 0.0) AS tax
          FROM tax
               JOIN calculateTaxDetailSummary('Q', pQuheadid, 'T')ON (taxdetail_tax_id=tax_id)
          GROUP BY tax_id) AS data;
  END IF;

  IF (pType = 'T') THEN
    SELECT COALESCE(quhead_freight, 0), COALESCE(quhead_misc, 0) INTO _freight, _misc
    FROM quhead
    WHERE (quhead_id=pQuheadid);
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
