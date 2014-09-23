CREATE OR REPLACE FUNCTION _usrprivTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check BOOLEAN;
  _returnVal INTEGER;
BEGIN
  -- This looks like a candidate for a foreign key but isn't.
  -- fkeys don't work if the foreign key value resides in a child of the 
  -- table and not the table itself.
  IF (NOT EXISTS(SELECT usrpriv_id 
                 FROM usrpriv, priv  
                 WHERE ((usrpriv_priv_id=priv_id) AND (priv_name ='MaintainUsers')
                        AND (usrpriv_username=geteffectivextuser())))) THEN
    RAISE EXCEPTION 'User have no privileges to modify user privileges.';
  END IF;                

  IF ((TG_OP = 'UPDATE' OR TG_OP = 'INSERT') AND
      (NOT EXISTS(SELECT priv_id
                  FROM priv
                  WHERE (priv_id=NEW.usrpriv_priv_id)))) THEN
    RAISE EXCEPTION 'Privilege id % does not exist or is part of a disabled package.',
                NEW.usrpriv_priv_id;
    RETURN OLD;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'usrprivTrigger');
CREATE TRIGGER usrprivTrigger BEFORE INSERT OR UPDATE ON usrpriv FOR EACH ROW EXECUTE PROCEDURE _usrprivTrigger();
