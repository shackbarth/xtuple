
CREATE OR REPLACE FUNCTION formatUserBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUserid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT formatUserBarcode(usr_username) INTO _barcode
    FROM usr
   WHERE(usr_id=pUserid);

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatUserBarcode(TEXT) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  _barcode := ( E'\138USER' || LENGTH(pUsername)::TEXT || pUsername );

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

