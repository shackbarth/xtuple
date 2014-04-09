CREATE OR REPLACE FUNCTION coheadstatecolor(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoheadId	ALIAS FOR $1;
  _shipheadid	INTEGER;
  _result	TEXT := '';

BEGIN
  
  IF (pCoheadid IS NULL) THEN
    RAISE EXCEPTION 'Customer Id is required.';
  END IF;
  
  SELECT 
    shiphead_id INTO _shipheadid
  FROM cohead
    JOIN shiphead ON ((shiphead_order_id=cohead_id)
                  AND (shiphead_order_type='SO'))
    JOIN shipitem ON (shiphead_id=shipitem_shiphead_id)
  WHERE ((cohead_id=pCoheadId)
    AND (NOT shipitem_invoiced))
  ORDER BY shiphead_id DESC
  LIMIT 1;

  IF (FOUND) THEN
    SELECT 
      CASE 
        WHEN ((shiphead_shipped) 
         AND (COALESCE(shiphead_order_id,0) > 0) 
         AND (SUM(noNeg(coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned)) <= 0)) THEN 
           'altemphasis'
        WHEN ((COALESCE(cobmisc_cohead_id,0) > 0)       
         AND (SUM(noNeg(coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned)) > 0)) THEN 
           'error' 
        WHEN (NOT shiphead_shipped) THEN 
          'emphasis' 
       END INTO _result
    FROM cohead
      JOIN coitem ON (cohead_id=coitem_cohead_id)
      JOIN shiphead ON ((shiphead_order_id=cohead_id)
                    AND (shiphead_order_type='SO'))
      JOIN shipitem ON (shiphead_id=shipitem_shiphead_id)
      LEFT OUTER JOIN (SELECT DISTINCT cobmisc_cohead_id FROM cobmisc) AS cobmisc ON (cobmisc_cohead_id=cohead_id) 
    WHERE (shiphead_id=_shipheadid)
    GROUP BY shiphead_id,shiphead_shipped,shiphead_order_id,cobmisc_cohead_id
    ORDER BY shiphead_id DESC;
  ELSE
    _result := '';
  END IF;
  
  RETURN _result;
  
END;
$$ LANGUAGE 'plpgsql';
