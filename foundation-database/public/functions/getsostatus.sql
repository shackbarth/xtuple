CREATE OR REPLACE FUNCTION getSoStatus(INTEGER) RETURNS CHAR(1) AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoheadid ALIAS FOR $1;
  _result char(1);

BEGIN

  SELECT cohead_status INTO _result
  FROM cohead
  WHERE (cohead_id=pCoheadid);

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql' STABLE;
