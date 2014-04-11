CREATE OR REPLACE FUNCTION getQuoteSchedDate(INTEGER) RETURNS DATE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  _minscheddate DATE;

BEGIN

  SELECT MIN(quitem_scheddate) INTO _minscheddate
  FROM quitem
  WHERE (quitem_quhead_id=pQuheadid);

  RETURN _minscheddate;

END;
$$ LANGUAGE 'plpgsql';
