DROP FUNCTION IF EXISTS calcquoteamt(integer);
CREATE OR REPLACE FUNCTION calcQuoteAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  _subtotal NUMERIC := 0;
  _tax NUMERIC := 0;
  _freight NUMERIC := 0;
  _misc NUMERIC := 0;
  _amount NUMERIC := 0;

BEGIN

  SELECT COALESCE(SUM(ROUND((quitem_qtyord * quitem_qty_invuomratio) *
                            (quitem_price / quitem_price_invuomratio), 2)), 0) INTO _subtotal
  FROM quitem
  WHERE (quitem_quhead_id=pQuheadid);

  SELECT COALESCE(SUM(tax), 0) INTO _tax
  FROM ( SELECT ROUND(SUM(taxdetail_tax), 2) AS tax
         FROM tax JOIN calculateTaxDetailSummary('Q', pQuheadid, 'T') ON (taxdetail_tax_id=tax_id)
         GROUP BY tax_id ) AS data;

  SELECT COALESCE(quhead_freight, 0), COALESCE(quhead_misc, 0) INTO _freight, _misc
  FROM quhead
  WHERE (quhead_id=pQuheadid);

  _amount := _subtotal + _tax + _freight + _misc;

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';
