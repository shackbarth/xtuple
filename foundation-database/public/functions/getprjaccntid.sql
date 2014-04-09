CREATE OR REPLACE FUNCTION getPrjAccntId(INTEGER, INTEGER) RETURNS INTEGER IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrjid ALIAS FOR $1;
  pAccntid ALIAS FOR $2;
  
BEGIN
  -- Project Accounting is required to fully implement this functionality
  RETURN pAccntId;
END;
$$ LANGUAGE 'plpgsql';
