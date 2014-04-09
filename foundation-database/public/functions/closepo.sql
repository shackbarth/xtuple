CREATE OR REPLACE FUNCTION closePo(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;

BEGIN

  UPDATE poitem
  SET poitem_status='C'
  WHERE (poitem_pohead_id=pPoheadid);

-- _poitemTrigger will close pohead when the last poitem is closed
--  UPDATE pohead
--  SET pohead_status='C'
--  WHERE (pohead_id=pPoheadid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
