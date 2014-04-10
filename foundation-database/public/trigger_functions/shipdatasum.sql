CREATE OR REPLACE FUNCTION _shipdatasumtrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  IF (LENGTH(TRIM(NEW.shipdatasum_shiphead_number)) = 0) THEN
    NEW.shipdatasum_shiphead_number = NULL;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'shipdatasumtrigger');
CREATE TRIGGER shipdatasumtrigger BEFORE INSERT OR UPDATE ON shipdatasum FOR EACH ROW EXECUTE PROCEDURE _shipdatasumtrigger();
