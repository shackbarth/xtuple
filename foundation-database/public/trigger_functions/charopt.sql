CREATE OR REPLACE FUNCTION _charoptTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NOT checkPrivilege('MaintainCharacteristics')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Characteristic options.';
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    UPDATE charass SET
      charass_value = NEW.charopt_value
    WHERE ((charass_char_id=NEW.charopt_char_id)
      AND (charass_value=OLD.charopt_value));
  END IF;

  IF (TG_OP = 'DELETE') THEN
    IF (SELECT (count(charass_id) > 0)
        FROM charass
        WHERE ((charass_char_id=OLD.charopt_char_id)
         AND (charass_value=OLD.charopt_value))) THEN
       RAISE EXCEPTION 'This characteristic option value is in use and can not be deleted.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$	 LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'charoptTrigger');
CREATE TRIGGER charoptTrigger AFTER UPDATE OR DELETE ON charopt FOR EACH ROW EXECUTE PROCEDURE _charoptTrigger();
