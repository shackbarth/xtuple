
CREATE OR REPLACE FUNCTION formatInvcNumber(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCobmiscid ALIAS FOR $1;

BEGIN
  RETURN ( SELECT COALESCE(cobmisc_invcnumber::TEXT, '''')
           FROM cobmisc
           WHERE (cobmisc_id=pCobmiscid) );
END;
' LANGUAGE 'plpgsql';

