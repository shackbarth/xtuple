CREATE OR REPLACE FUNCTION getWarehousId(pWarehousCode text,
                                         pType text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _active BOOL;
  _shipping BOOL;
  _returnVal INTEGER;
BEGIN
  IF (pWarehousCode IS NULL) THEN
	RETURN NULL;
  END IF;
 
  IF (UPPER(pType) NOT IN ('ALL','ACTIVE','SHIPPING')) THEN
    	RAISE EXCEPTION 'Warehouse lookip type % not valid. Valid types are ALL, ACTIVE and SHIPPING', pType;
  END IF;

  SELECT warehous_id, warehous_active, warehous_shipping INTO _returnVal, _active, _shipping
  FROM site()
  WHERE (warehous_code=UPPER(pWarehousCode));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Warehouse Code % not found.', pWarehousCode;
    ELSE IF ((pType='SHIPPING') AND (_shipping=false)) THEN
      RAISE EXCEPTION 'Warehouse Code % is not a vaild shipping warehouse.', pWarehousCode;
      ELSE IF ((pType IN ('SHIPPING','ACTIVE')) AND (_active=false)) THEN
        RAISE EXCEPTION 'Warehouse Code % is inactive.', pWarehousCode;
      END IF;
    END IF;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
