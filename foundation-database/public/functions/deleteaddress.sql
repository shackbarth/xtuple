
CREATE OR REPLACE FUNCTION deleteAddress(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  paddrId     ALIAS FOR $1;
  _count      INTEGER := 0;
BEGIN
  SELECT count(*) INTO _count
    FROM cntct
    WHERE (cntct_active
      AND  (cntct_addr_id = paddrId));
  IF (_count > 0) THEN
    RETURN -1;
  END IF;

  SELECT count(*) INTO _count
    FROM vendinfo
    WHERE (vend_active
      AND  (vend_addr_id = paddrId));
  IF (_count > 0) THEN
    RETURN -2;
  END IF;

  SELECT count(*) INTO _count
    FROM shiptoinfo
    WHERE (shipto_active
      AND  (shipto_addr_id = paddrId));
  IF (_count > 0) THEN
    RETURN -3;
  END IF;

  SELECT count(*) INTO _count
    FROM vendaddrinfo
    WHERE (vendaddr_addr_id = paddrId);
  IF (_count > 0) THEN
    RETURN -4;
  END IF;

  SELECT count(*) INTO _count
    FROM whsinfo
    WHERE (warehous_active
      AND  (warehous_addr_id = paddrId));
  IF (_count > 0) THEN
    RETURN -5;
  END IF;

  UPDATE cntct SET cntct_addr_id = NULL WHERE (cntct_addr_id = paddrId);
  UPDATE vendinfo SET vend_addr_id = NULL WHERE (vend_addr_id = paddrId);
  UPDATE shiptoinfo SET shipto_addr_id = NULL WHERE (shipto_addr_id =paddrId);
  UPDATE vendaddrinfo SET vendaddr_addr_id = NULL
    WHERE (vendaddr_addr_id = paddrId);
  UPDATE whsinfo SET warehous_addr_id = NULL WHERE (warehous_addr_id=paddrId);

  DELETE FROM addr WHERE addr_id = paddrId;
  RETURN 0;
END;
' LANGUAGE 'plpgsql';

