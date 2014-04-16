CREATE OR REPLACE FUNCTION _apopenTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _currrate NUMERIC;

BEGIN

-- get the base exchange rate for the doc date
  IF (TG_OP = 'INSERT' AND NEW.apopen_curr_rate IS NULL) THEN
    SELECT curr_rate INTO _currrate
    FROM curr_rate
    WHERE ( (NEW.apopen_curr_id=curr_id)
    AND ( NEW.apopen_docdate BETWEEN curr_effective 
                                 AND curr_expires) );
    IF (FOUND) THEN
      NEW.apopen_curr_rate := _currrate;
    ELSE
      RAISE EXCEPTION 'Currency exchange rate not found';
    END IF;
  END IF;

  NEW.apopen_open := NEW.apopen_amount > NEW.apopen_paid;

  IF (TG_OP = 'INSERT') THEN
    IF (NEW.apopen_open=FALSE) THEN
      NEW.apopen_status='C';
    ELSE
      NEW.apopen_status='O';
    END IF;

     --- clear the number from the issue cache
    PERFORM clearNumberIssue('APMemoNumber', NEW.apopen_docnumber);
  END IF;
  
  IF (TG_OP = 'UPDATE') THEN
    IF ((OLD.apopen_open=TRUE) AND (NEW.apopen_open=FALSE)) THEN
      NEW.apopen_status='C';
      IF (NEW.apopen_closedate IS NULL) THEN
        NEW.apopen_closedate=CURRENT_DATE;
      END IF;
    END IF;
    
    IF ((OLD.apopen_open=FALSE) AND (NEW.apopen_open=TRUE)) THEN
      NEW.apopen_status='O';
      NEW.apopen_closedate=NULL;
    END IF;
  END IF;

  RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER', 'apopenTrigger');
CREATE TRIGGER apopenTrigger BEFORE INSERT OR UPDATE ON apopen FOR EACH ROW EXECUTE PROCEDURE _apopenTrigger();
