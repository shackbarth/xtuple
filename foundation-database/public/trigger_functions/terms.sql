CREATE OR REPLACE FUNCTION _termsAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (fetchMetricValue('DefaultTerms') = OLD.terms_id) THEN
    RAISE EXCEPTION 'Cannot delete the default Terms [xtuple: terms, -1, %]',
                    OLD.terms_code;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS termsAfterDeleteTrigger ON terms;
CREATE TRIGGER termsAfterDeleteTrigger AFTER DELETE ON terms
  FOR EACH ROW EXECUTE PROCEDURE _termsAfterDeleteTrigger();
