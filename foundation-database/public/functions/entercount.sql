CREATE OR REPLACE FUNCTION enterCount(int, numeric, text) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcntid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pComments ALIAS FOR $3;
BEGIN

  UPDATE invcnt
  SET invcnt_qoh_after = pQty,
      invcnt_comments = CASE WHEN ( (LENGTH(invcnt_comments) = 0) AND
                                    (LENGTH(pComments) > 0) ) THEN pComments
                             WHEN (LENGTH(pComments) > 0) THEN (invcnt_comments || E'\n' || pComments)
                             ELSE invcnt_comments
                        END,
      invcnt_cntdate = CURRENT_TIMESTAMP,
      invcnt_cnt_username = getEffectiveXtUser()
  WHERE (invcnt_id=pInvcntid);

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
