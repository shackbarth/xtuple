CREATE OR REPLACE FUNCTION rollUpActualCost(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
    pItemid ALIAS FOR $1;

BEGIN
    RETURN rollUpSorACost(pitemid, TRUE);
END;
' LANGUAGE 'plpgsql';
