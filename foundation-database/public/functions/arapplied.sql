CREATE OR REPLACE FUNCTION arapplied(INTEGER, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAropenid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  _amount NUMERIC;

BEGIN

  -- Return amount applied to an aropen in base currency item as of the parameter date
  SELECT SUM(currtobase(arapply_curr_id,arapply_applied,pDate)) INTO _amount
  FROM arapply
  WHERE (((arapply_target_aropen_id = pAropenid) OR (arapply_source_aropen_id = pAropenid))
  AND (((arapply_journalnumber=0) AND (arapply_postdate <= pDate))
  OR EXISTS(SELECT * 
             FROM gltrans 
             WHERE ((gltrans_journalnumber=arapply_journalnumber)
             AND (gltrans_date <= pDate)))));

  IF (_amount IS NULL) THEN
    RETURN 0;
  ELSE
    RETURN _amount;
  END IF;

END;
' LANGUAGE 'plpgsql';
