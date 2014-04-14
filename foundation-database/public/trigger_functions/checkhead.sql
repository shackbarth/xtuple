CREATE OR REPLACE FUNCTION _checkheadBeforeTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE 
  _amount NUMERIC;
  _currrate NUMERIC;

BEGIN

-- get the base exchange rate for the check date
  IF (TG_OP = 'INSERT' AND NEW.checkhead_curr_rate IS NULL) THEN
    SELECT curr_rate INTO _currrate
    FROM curr_rate
    WHERE ( (NEW.checkhead_curr_id=curr_id)
      AND ( NEW.checkhead_checkdate BETWEEN curr_effective 
                                   AND curr_expires) );
    IF (FOUND) THEN
      NEW.checkhead_curr_rate := _currrate;
    ELSE
      RAISE EXCEPTION 'Currency exchange rate not found';
    END IF;
  END IF;

  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF (NOT EXISTS (SELECT checkrecip_id
		    FROM checkrecip
		    WHERE ((checkrecip_type=NEW.checkhead_recip_type)
		      AND  (checkrecip_id=NEW.checkhead_recip_id)) )) THEN
      RAISE EXCEPTION 'Cannot verify recipient for check % (type %  id %)',
		      NEW.checkhead_number, NEW.checkhead_recip_type,
		      NEW.checkhead_recip_id;
    END IF;

    IF (NEW.checkhead_journalnumber IS NOT NULL
        AND NOT EXISTS (SELECT jrnluse_number
			FROM jrnluse
			WHERE (jrnluse_number=NEW.checkhead_journalnumber))
	) THEN
      RAISE EXCEPTION 'Journal Number % does not exist and cannot be used for check %.',
		      NEW.checkhead_journalnumber, NEW.checkhead_number;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'checkheadBeforeTrigger');
CREATE TRIGGER checkheadBeforeTrigger BEFORE INSERT OR UPDATE ON checkhead FOR EACH ROW EXECUTE PROCEDURE _checkheadBeforeTrigger();

