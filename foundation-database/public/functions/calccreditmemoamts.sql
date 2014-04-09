CREATE OR REPLACE FUNCTION calcCmheadAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmheadid ALIAS FOR $1;
  _amount NUMERIC := 0;

BEGIN

  SELECT SUM(COALESCE(extprice, 0)) INTO _amount
  FROM cmhead JOIN creditmemoitem ON (cmhead_id=cmitem_cmhead_id)
  WHERE (cmhead_id=pCmheadid);

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcCmheadTax(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmheadid ALIAS FOR $1;
  _headamount NUMERIC := 0;
  _itemamount NUMERIC := 0;
  _amount NUMERIC := 0;

BEGIN

  SELECT COALESCE(SUM(taxhist_tax), 0) INTO _headamount
  FROM cmhead JOIN cmheadtax ON (taxhist_parent_id=cmhead_id)
  WHERE (cmhead_id=pCmheadid);

  SELECT SUM(COALESCE(tax, 0)) INTO _itemamount
  FROM cmhead JOIN creditmemoitem ON (cmhead_id=cmitem_cmhead_id)
  WHERE (cmhead_id=pCmheadid);

  _amount := _headamount + _itemamount;
  RETURN (_amount * -1.0);

END;
$$ LANGUAGE 'plpgsql';
