CREATE OR REPLACE FUNCTION _apapplyTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _tpaid NUMERIC;

BEGIN

-- get the exchange rate for the doc date
  IF (TG_OP = 'INSERT') THEN
    SELECT currtocurr(NEW.apapply_curr_id,apopen_curr_id,NEW.apapply_amount,NEW.apapply_postdate) 
      INTO _tpaid
    FROM apopen
    WHERE ( apopen_id=NEW.apapply_target_apopen_id );
    IF (FOUND) THEN
      NEW.apapply_target_paid := _tpaid;
    ELSE
      RAISE EXCEPTION 'Error calculating paid amount on application';
    END IF;
  END IF;

  RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER', 'apapplyTrigger');
CREATE TRIGGER apapplyTrigger BEFORE INSERT OR UPDATE ON apapply FOR EACH ROW EXECUTE PROCEDURE _apapplyTrigger();
