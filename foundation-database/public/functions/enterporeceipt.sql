CREATE OR REPLACE FUNCTION enterPoReceipt(INTEGER, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterReceipt(''PO'', $1, $2, 0.0, '''', NULL, NULL);
END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION enterPoReceipt(INTEGER, NUMERIC, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterPoReceipt(''PO'', $1, $2, 0.0, $3, NULL, NULL);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION enterPoReceipt(INTEGER, NUMERIC, NUMERIC, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterPoReceipt(''PO'', $1, $2, $3, $4, NULL, NULL);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION enterPoReceipt(INTEGER, NUMERIC, NUMERIC, TEXT, INTEGER, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterReceipt(''PO'', $1, $2, $3, $4, $5, $6);
END;
' LANGUAGE 'plpgsql';
