CREATE OR REPLACE FUNCTION _grpprivTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check BOOLEAN;
  _returnVal INTEGER;
BEGIN
  -- This looks like a candidate for a foreign key but isn't.
  -- fkeys don't work if the foreign key value resides in a child of the 
  -- table and not the table itself.
  IF ((TG_OP = 'UPDATE' OR TG_OP = 'INSERT') AND
      (NOT EXISTS(SELECT priv_id
                  FROM priv
                  WHERE (priv_id=NEW.grppriv_priv_id)))) THEN
    RAISE EXCEPTION 'Privilege id % does not exist or is part of a disabled package.',
                NEW.grppriv_priv_id;
    RETURN OLD;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'grpprivTrigger');
CREATE TRIGGER grpprivTrigger BEFORE INSERT OR UPDATE ON grppriv FOR EACH ROW EXECUTE PROCEDURE _grpprivTrigger();
