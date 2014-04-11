CREATE OR REPLACE FUNCTION invhistTrig() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

--  Need to allow 'temporary' negative for average costed item that has been frozen.
--  Check at itemsite after all of the transactions have been thawed will ensure
--  that final Qty On Hand is positive. 
--  IF (NEW.invhist_qoh_after < 0 AND NEW.invhist_costmethod = 'A') THEN
--    RAISE EXCEPTION 'Invhist (%) is recording with average costing and is not allowed to have a negative quantity on hand.', NEW.invhist_id;
--  END IF;

  IF ( ( SELECT itemsite_freeze
         FROM itemsite
         WHERE (itemsite_id=NEW.invhist_itemsite_id) ) ) THEN
    NEW.invhist_posted = FALSE;
  END IF;

  -- never change the created timestamp, which defaults to CURRENT_TIMESTAMP
  IF (TG_OP != 'INSERT') THEN
    NEW.invhist_created = OLD.invhist_created;
  ELSE
    -- Always need a series id for distribution posting
    IF (NEW.invhist_series IS NULL) THEN
      RAISE EXCEPTION 'Column invhist_series may not be null.';
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'invhistTrigger');
CREATE TRIGGER invhistTrigger BEFORE INSERT OR UPDATE ON invhist FOR EACH ROW EXECUTE PROCEDURE invhistTrig();
