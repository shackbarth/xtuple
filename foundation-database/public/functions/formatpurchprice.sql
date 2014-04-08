CREATE OR REPLACE FUNCTION formatPurchPrice(NUMERIC) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN formatNumeric($1, ''purchprice'');
END;' LANGUAGE 'plpgsql';
