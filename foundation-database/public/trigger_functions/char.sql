CREATE OR REPLACE FUNCTION _charBeforeTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NOT checkPrivilege('MaintainCharacteristics')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Characteristics.';
  END IF;

  RETURN NEW;
END;
$$	 LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'charBeforeTrigger');
CREATE TRIGGER charBeforeTrigger BEFORE INSERT OR UPDATE ON char FOR EACH ROW EXECUTE PROCEDURE _charBeforeTrigger();
