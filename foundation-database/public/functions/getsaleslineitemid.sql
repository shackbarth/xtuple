CREATE OR REPLACE FUNCTION getSalesLineItemId(TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSalesOrderItem ALIAS FOR $1;
  _delpos INTEGER = 0;
  _order TEXT;
  _part TEXT;
  _ln INTEGER;
  _sn INTEGER;
BEGIN
  IF (pSalesOrderItem IS NULL) THEN
    RETURN NULL;
  END IF;
  _delpos := strpos(pSalesOrderItem, '-');
  IF (_delpos > 0) THEN
    _order := substr(pSalesOrderItem, 1, (_delpos - 1));
    _part := substr(pSalesOrderItem, (_delpos + 1));
    _delpos := strpos(_part, '.');
    IF (_delpos > 0) THEN
      _ln := CAST(substr(_part, 1, (_delpos - 1)) AS INTEGER);
      _sn := CAST(substr(_part, (_delpos + 1)) AS INTEGER);
    ELSE
      _ln := CAST(_part AS INTEGER);
      _sn := 0;
    END IF;
    RETURN getSalesLineItemId( _order, _ln, _sn );
  END IF;
  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getSalesLineItemId(TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN getSalesLineItemId($1, $2, 0);
END
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getSalesLineItemId(TEXT, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSalesOrderNumber ALIAS FOR $1;
  pLineNumber ALIAS FOR $2;
  pSubNumber ALIAS FOR $3;
  _returnVal INTEGER;
BEGIN
  IF ((pSalesOrderNumber IS NULL) OR (pLineNumber IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT coitem_id INTO _returnVal
  FROM cohead, coitem
  WHERE ((cohead_number=pSalesOrderNumber)
  AND (cohead_id=coitem_cohead_id)
  AND (coitem_linenumber=pLineNumber)
  AND (coitem_subnumber=pSubNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Sales Line Item %-%not found.', pSalesOrderNumber,pLineNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
