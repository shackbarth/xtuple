CREATE OR REPLACE FUNCTION _commentTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NEW.comment_cmnttype_id IS NULL) THEN
	RAISE EXCEPTION 'You must supply a valid Comment Type ID.';
  ELSIF (NEW.comment_source = 'INCDT') THEN
    UPDATE incdt SET incdt_updated = now() WHERE incdt_id = NEW.comment_source_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS commentTrigger ON comment;
CREATE TRIGGER commentTrigger AFTER INSERT OR UPDATE ON comment FOR EACH ROW EXECUTE PROCEDURE _commentTrigger();
