CREATE OR REPLACE FUNCTION _charassTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
   IF (NEW.charass_target_type = 'I' AND NOT checkPrivilege('MaintainItemMasters')) THEN
     RAISE EXCEPTION 'You do not have privileges to maintain Items.';
   END IF;

   IF (NEW.charass_target_type = 'C' AND NOT checkPrivilege('MaintainCustomerMasters')) THEN
     RAISE EXCEPTION 'You do not have privileges to maintain Customers.';
   END IF;

-- Data check
  IF (NEW.charass_char_id IS NULL) THEN
	RAISE EXCEPTION 'You must supply a valid Characteristic ID.';
  END IF;

-- Default Logic
  IF (NEW.charass_default) THEN
    UPDATE charass
    SET charass_default = false 
    WHERE ((charass_target_id=NEW.charass_target_id)
    AND  (charass_target_type=NEW.charass_target_type)
    AND  (charass_char_id=NEW.charass_char_id)
    AND  (charass_id <> NEW.charass_ID));
  END IF;

-- Incident update
  IF (NEW.charass_target_type = 'INCDT') THEN
    UPDATE incdt SET incdt_updated = now() WHERE incdt_id = NEW.charass_target_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

select dropIfExists('TRIGGER', 'charassTrigger');
CREATE TRIGGER charassTrigger AFTER INSERT OR UPDATE ON charass FOR EACH ROW EXECUTE PROCEDURE _charassTrigger();

CREATE OR REPLACE FUNCTION _charassHistoryTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF(TG_OP = 'DELETE') THEN
    IF (OLD.charass_target_type = 'INCDT') THEN
      INSERT INTO incdthist
            (incdthist_incdt_id, incdthist_descrip)
      VALUES(OLD.charass_target_id,
             ('Characteristic ' || 
               COALESCE((SELECT char_name 
                           FROM char
                          WHERE (char_id=OLD.charass_char_id)), '')
              || ' Deleted: "' || 
              COALESCE(OLD.charass_value,'')
              || '"') );
    END IF;
    RETURN OLD;
  ELSIF (NEW.charass_target_type = 'INCDT') THEN
    IF (TG_OP = 'INSERT') THEN
      INSERT INTO incdthist
            (incdthist_incdt_id, incdthist_descrip)
      VALUES(NEW.charass_target_id,
             ('Characteristic ' || 
               COALESCE((SELECT char_name 
                           FROM char
                          WHERE (char_id=NEW.charass_char_id)), '')
              || ' Added: "' || 
              COALESCE(NEW.charass_value,'')
              || '"') );
    ELSIF (TG_OP = 'UPDATE') THEN
      IF (COALESCE(NEW.charass_value,'') <> COALESCE(OLD.charass_value,'')) THEN
        INSERT INTO incdthist
              (incdthist_incdt_id, incdthist_descrip)
        VALUES(NEW.charass_target_id,
               ('Characteristic ' || 
                 COALESCE((SELECT char_name 
                             FROM char
                            WHERE (char_id=NEW.charass_char_id)), '')
                || ' Changed: "' || 
                COALESCE(OLD.charass_value,'')
                || '" -> "' ||
                COALESCE(NEW.charass_value,'')
                || '"') );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

select dropIfExists('TRIGGER', 'charassHistoryTrigger');
CREATE TRIGGER charassHistoryTrigger BEFORE INSERT OR UPDATE OR DELETE ON charass FOR EACH ROW EXECUTE PROCEDURE _charassHistoryTrigger();

