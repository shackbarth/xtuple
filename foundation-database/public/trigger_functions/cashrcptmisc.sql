CREATE OR REPLACE FUNCTION _cashRcptMiscTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check      BOOLEAN;

BEGIN

  -- Checks
  -- Start with Privileges
  IF (TG_OP = ''INSERT'') THEN
    SELECT checkPrivilege(''MaintainCashReceipts'') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION ''You do not have privileges to add a new Cash Receipt Misc. Application.'';
    END IF;
  ELSE
    SELECT checkPrivilege(''MaintainCashReceipts'') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION ''You do not have privileges to alter a Cash Receipt Misc. Application.'';
    END IF;
  END IF;

  -- Account is required
  IF (NEW.cashrcptmisc_accnt_id IS NULL) THEN
    RAISE EXCEPTION ''You must supply a valid GL Account.'';
  END IF;

  -- Amount is required
  IF (COALESCE(NEW.cashrcptmisc_amount, 0) = 0) THEN
    RAISE EXCEPTION ''You must supply a valid Amount.'';
  END IF;

  RETURN NEW;

END;
' LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cashRcptMiscTrigger');
CREATE TRIGGER cashRcptMiscTrigger BEFORE INSERT OR UPDATE ON cashrcptmisc FOR EACH ROW EXECUTE PROCEDURE _cashRcptMiscTrigger();
