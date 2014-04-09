CREATE OR REPLACE FUNCTION getSoSchedDate(INTEGER) RETURNS DATE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoheadid ALIAS FOR $1;
  _minscheddate DATE;

BEGIN

  SELECT MIN(coitem_scheddate) INTO _minscheddate
  FROM coitem
  WHERE ( (coitem_cohead_id=pCoheadid)
    AND   (coitem_status NOT IN ('C', 'X')) );

  RETURN _minscheddate;

END;
$$ LANGUAGE 'plpgsql';
