DROP FUNCTION IF EXISTS calcsalesorderamt(integer);
CREATE OR REPLACE FUNCTION calcSalesOrderAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoheadid ALIAS FOR $1;
  _subtotal NUMERIC := 0;
  _tax NUMERIC := 0;
  _freight NUMERIC := 0;
  _misc NUMERIC := 0;
  _amount NUMERIC := 0;

BEGIN

  SELECT COALESCE(SUM(ROUND((coitem_qtyord * coitem_qty_invuomratio) *
                            (coitem_price / coitem_price_invuomratio), 2)), 0) INTO _subtotal
  FROM coitem
  WHERE (coitem_cohead_id=pCoheadid)
    AND (coitem_status != 'X');

  SELECT COALESCE(SUM(tax), 0) INTO _tax
  FROM ( SELECT ROUND(SUM(taxdetail_tax), 2) AS tax
         FROM tax JOIN calculateTaxDetailSummary('S', pCoheadid, 'T') ON (taxdetail_tax_id=tax_id)
         GROUP BY tax_id ) AS data;

  SELECT COALESCE(cohead_freight, 0), COALESCE(cohead_misc, 0) INTO _freight, _misc
  FROM cohead
  WHERE (cohead_id=pCoheadid);

  _amount := _subtotal + _tax + _freight + _misc;

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';
