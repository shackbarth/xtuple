CREATE OR REPLACE FUNCTION apapplied(INTEGER, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  _amount NUMERIC;

BEGIN

  -- Return amount applied to an apopen in base currency as of apapply_postdate
  SELECT SUM(currtobase(apapply_curr_id,apapply_amount,apapply_postdate)) INTO _amount
  FROM apapply
  WHERE (((apapply_target_apopen_id = pApopenid) OR (apapply_source_apopen_id = pApopenid))
  AND (((apapply_journalnumber=0) AND (apapply_postdate <= pDate))
  OR EXISTS(SELECT * 
             FROM gltrans 
             WHERE ((gltrans_journalnumber=apapply_journalnumber)
             AND (gltrans_date <= pDate)))));

  IF (_amount IS NULL) THEN
    RETURN 0;
  ELSE
    RETURN _amount;
  END IF;

END;
' LANGUAGE 'plpgsql';
