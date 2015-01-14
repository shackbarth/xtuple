CREATE OR REPLACE FUNCTION _addrtrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  DECLARE
    _uses	INTEGER	:= 0;

  BEGIN

    IF (TG_OP = 'INSERT') THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('AddressNumber', NEW.addr_number);
    ELSE
      SELECT count(*) INTO _uses
      FROM cntct
      WHERE ((cntct_addr_id=OLD.addr_id)
        AND   cntct_active);
    END IF;

    IF (TG_OP = 'UPDATE') THEN
      IF (OLD.addr_active AND NOT NEW.addr_active AND _uses > 0) THEN
	RAISE EXCEPTION 'Cannot inactivate Address with Active Contacts (%)',
			_uses;
      END IF;
    ELSIF (TG_OP = 'DELETE') THEN
      IF (_uses > 0) THEN
	RAISE EXCEPTION 'Cannot Delete Address with Active Contacts (%)',
			_uses;
      END IF;

      UPDATE cntct SET cntct_addr_id = NULL
      WHERE ((cntct_addr_id=OLD.addr_id)
	AND  (NOT cntct_active));

      RETURN OLD;
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS addrtrigger ON addr;
CREATE TRIGGER addrtrigger
  BEFORE  INSERT OR
	  UPDATE OR DELETE
  ON addr
  FOR EACH ROW
  EXECUTE PROCEDURE _addrtrigger();

CREATE OR REPLACE FUNCTION _addrAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  DELETE
  FROM charass
  WHERE charass_target_type = 'ADDR'
    AND charass_target_id = OLD.addr_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'addrAfterDeleteTrigger');
CREATE TRIGGER addrAfterDeleteTrigger
  AFTER DELETE
  ON addr
  FOR EACH ROW
  EXECUTE PROCEDURE _addrAfterDeleteTrigger();
