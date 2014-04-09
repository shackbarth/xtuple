CREATE OR REPLACE FUNCTION formatSoitemNumber(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  targetSoitemid ALIAS FOR $1;
BEGIN
  RETURN ( SELECT (cohead_number::TEXT || '-' || formatsolinenumber(coitem_id))
           FROM cohead, coitem
           WHERE ((coitem_cohead_id=cohead_id)
            AND (coitem_id=targetSoitemid)) );
END;
$$ LANGUAGE 'plpgsql';
