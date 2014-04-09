CREATE OR REPLACE FUNCTION costsByCustomerValue(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _value NUMERIC;
  _startDate DATE;
  _endDate DATE;

BEGIN

  _startDate := findPeriodStart(pPeriodid);
  _endDate := findPeriodEnd(pPeriodid);

-- Returns value in base currency
-- ToDo: is cohist_shipdate the right DATE to use?
  SELECT SUM(cohist_qtyshipped * currToBase(cohist_curr_id, cohist_unitcost, cohist_shipdate)) INTO _value
  FROM cohist
  WHERE ( (cohist_itemsite_id<>-1)
   AND (cohist_cust_id=pCustid)
   AND (cohist_invcdate BETWEEN _startDate AND _endDate) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION costsByCustomerValue(INTEGER, INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pProdcatid ALIAS FOR $3;
  _value NUMERIC;
  _startDate DATE;
  _endDate DATE;

BEGIN

  _startDate := findPeriodStart(pPeriodid);
  _endDate := findPeriodEnd(pPeriodid);

-- Returns value in base currency
-- ToDo: is cohist_shipdate the right DATE to use?
  SELECT SUM(cohist_qtyshipped * currToBase(cohist_curr_id, cohist_unitcost, cohist_shipdate)) INTO _value
  FROM cohist, itemsite, item
  WHERE ( (cohist_cust_id=pCustid)
   AND (cohist_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (item_prodcat_id=pProdcatid)
   AND (cohist_invcdate BETWEEN _startDate AND _endDate) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION costsByCustomerValue(INTEGER, INTEGER, TEXT) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pProdcat ALIAS FOR $3;
  _value NUMERIC;
  _startDate DATE;
  _endDate DATE;

BEGIN

  _startDate := findPeriodStart(pPeriodid);
  _endDate := findPeriodEnd(pPeriodid);

-- Returns value in base currency
-- ToDo: is cohist_shipdate the right date to use?
  SELECT SUM(cohist_qtyshipped * currToBase(cohist_curr_id, cohist_unitcost, cohist_shipdate)) INTO _value
  FROM cohist, itemsite, item, prodcat
  WHERE ( (cohist_cust_id=pCustid)
   AND (cohist_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (item_prodcat_id=prodcat_id)
   AND (prodcat_code ~ pProdcat)
   AND (cohist_invcdate BETWEEN _startDate AND _endDate) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';
