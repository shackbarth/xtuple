CREATE OR REPLACE FUNCTION deleteIpsItem(pIpsItemId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  DELETE FROM ipsiteminfo WHERE ipsitem_id=pIpsItemId;

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';

