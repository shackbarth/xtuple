CREATE OR REPLACE FUNCTION releasePurchaseOrder(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;

BEGIN

  IF ( ( SELECT (COUNT(*) = 0)
         FROM poitem
         WHERE ( (poitem_pohead_id=pPoheadid)
           AND   (poitem_status='U') ) ) ) THEN
    RETURN -1;
  END IF;

  IF ( ( SELECT (pohead_status='U')
         FROM pohead
         WHERE (pohead_id=pPoheadid) ) ) THEN

    --update status and store the date that the order was released on
    UPDATE pohead
    SET pohead_status='O', pohead_released = current_date
    WHERE (pohead_id=pPoheadid);

  END IF;

  --update status and store the duedates at release
  UPDATE poitem
  SET poitem_status='O', poitem_rlsd_duedate = poitem_duedate
  WHERE (poitem_pohead_id=pPoheadid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
