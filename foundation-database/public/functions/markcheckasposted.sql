CREATE OR REPLACE FUNCTION markCheckASPosted(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCheckid ALIAS FOR $1;

BEGIN

  UPDATE checkhead
  SET checkhead_posted=TRUE
  WHERE (checkhead_id=pCheckid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';
