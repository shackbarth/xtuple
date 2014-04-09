CREATE OR REPLACE FUNCTION calculatetax(integer, integer, date, integer, numeric)
  RETURNS numeric AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxZoneId ALIAS FOR  $1;
  pTaxTypeId ALIAS FOR  $2;
  pDate ALIAS FOR  $3;
  pCurrId ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  _tottax numeric := 0;  -- total tax
  
BEGIN

  SELECT COALESCE(ROUND(SUM(taxdetail_tax),6),0)
    INTO _tottax 
  FROM calculateTaxDetail(pTaxZoneId, pTaxTypeId, pDate, pCurrId, pAmount);

  RETURN _tottax;
  
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
