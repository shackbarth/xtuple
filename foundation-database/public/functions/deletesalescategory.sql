CREATE OR REPLACE FUNCTION deleteSalesCategory(integer) RETURNS integer
    AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSalescatid ALIAS FOR $1;

BEGIN

  PERFORM invcitem_salescat_id
  FROM invchead, invcitem
  WHERE ( (invcitem_invchead_id=invchead_id)
   AND (NOT invchead_posted)
   AND (invcitem_salescat_id=pSalescatid) );
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  PERFORM invcitem_salescat_id
  FROM invchead, invcitem
  WHERE ( (invcitem_invchead_id=invchead_id)
   AND (invchead_posted)
   AND (invcitem_salescat_id=pSalescatid) );
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  PERFORM aropen_salescat_id
     FROM aropen
    WHERE (aropen_salescat_id=pSalescatid);
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  DELETE FROM salescat
  WHERE (salescat_id=pSalescatid);

  RETURN 0;

END;
' LANGUAGE plpgsql;
