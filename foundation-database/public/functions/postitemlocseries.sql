CREATE OR REPLACE FUNCTION postItemlocSeries(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemlocseries ALIAS FOR $1;
  _result INTEGER;

BEGIN

  PERFORM postIntoTrialBalance(itemlocpost_glseq)
  FROM (
    SELECT DISTINCT itemlocpost_glseq, gltrans_accnt_id
    FROM itemlocpost
      JOIN gltrans ON (itemlocpost_glseq=gltrans_sequence)
    WHERE (itemlocpost_itemlocseries=pItemlocseries)
    ORDER BY gltrans_accnt_id
  ) AS data;
  
  PERFORM postInvHist(invhist_id)
  FROM invhist
    JOIN itemsite ON (invhist_itemsite_id=itemsite_id)
  WHERE ( (invhist_series=pItemlocseries)
  AND ( NOT invhist_posted) 
  AND ( NOT itemsite_freeze) );

  DELETE FROM itemlocpost WHERE (itemlocpost_itemlocseries=pItemlocseries);

  RETURN TRUE;
  
END;
$$ LANGUAGE 'plpgsql';

