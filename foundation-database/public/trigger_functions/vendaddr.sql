CREATE OR REPLACE FUNCTION _vendaddrTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check      BOOLEAN;
  _vendname   TEXT;

BEGIN

--  Checks
  SELECT checkPrivilege(''MaintainVendors'') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION ''You do not have privileges to maintain Vendors.'';
  END IF;

  IF (TG_OP IN (''INSERT'',''UPDATE'')) THEN

    IF (LENGTH(COALESCE(NEW.vendaddr_code, ''''))=0) THEN
      RAISE EXCEPTION ''You must supply a valid Vendor Address Number.'';
    END IF;

    IF (LENGTH(COALESCE(NEW.vendaddr_name, ''''))=0) THEN
      RAISE EXCEPTION ''You must supply a valid Vendor Address Name.'';
    END IF;

    IF (NEW.vendaddr_vend_id IS NULL) THEN
      RAISE EXCEPTION ''You must supply a valid Vendor ID.'';
    END IF;

    SELECT vendaddr_code INTO _vendname
    FROM vendaddrinfo
    WHERE ( (vendaddr_vend_id=NEW.vendaddr_vend_id)
      AND (UPPER(vendaddr_code)=UPPER(NEW.vendaddr_code))
      AND (vendaddr_id<>NEW.vendaddr_id) );
    IF (FOUND) THEN
      RAISE EXCEPTION ''The Vendor Address Number entered cannot be used as it is in use.'';
    END IF;

  END IF;
  
  IF (TG_OP = ''DELETE'') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'vendaddrTrigger');
CREATE TRIGGER vendaddrTrigger BEFORE INSERT OR UPDATE OR DELETE ON vendaddrinfo FOR EACH ROW EXECUTE PROCEDURE _vendaddrTrigger();
