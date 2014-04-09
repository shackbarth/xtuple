CREATE OR REPLACE FUNCTION getAddrId(pAddressNumber text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pAddressNumber IS NULL OR pAddressNumber = '') THEN
    RETURN NULL;
  END IF;

  SELECT addr_id INTO _returnVal
  FROM addr
  WHERE (addr_number=pAddressNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Address Number % not found.', pAddressNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
