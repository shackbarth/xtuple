-- NO create trigger statements. the updater will create them.

SELECT dropIfExists('TRIGGER', 'pkgprivbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgprivbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _privid       INTEGER;
  _debug        BOOL := false;

BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (_debug) THEN
      RAISE NOTICE 'OLD.priv_name %, NEW.priv_name %',
                   OLD.priv_name, NEW.priv_name;
    END IF;

    IF (NEW.priv_name != OLD.priv_name) THEN
      SELECT priv_id INTO _privid FROM priv WHERE priv_name=NEW.priv_name;
      IF (FOUND) THEN
        RAISE EXCEPTION 'Cannot change privilege name % because another privilege with that name already exists.', NEW.priv_name;
      END IF;
    END IF;

  ELSIF (TG_OP = 'INSERT') THEN
    IF (_debug) THEN
      RAISE NOTICE 'inserting NEW.priv_name %', NEW.priv_name;
    END IF;
    SELECT priv_id INTO _privid FROM priv WHERE priv_name=NEW.priv_name;
    IF (FOUND) THEN
      RAISE EXCEPTION 'Cannot create new privilege % because another privilege with that name already exists.', NEW.priv_name;
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF (_debug) THEN RAISE NOTICE 'deleting pkgpriv_id %', OLD.priv_id; END IF;
    DELETE FROM usrpriv WHERE usrpriv_priv_id=OLD.priv_id;
    DELETE FROM grppriv WHERE grppriv_priv_id=OLD.priv_id;

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgprivalterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (pkgMayBeModified(TG_TABLE_SCHEMA) OR isDba()) THEN
    IF (TG_OP = 'DELETE') THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    RAISE EXCEPTION 'You may not create privileges in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'UPDATE') THEN
    RAISE EXCEPTION 'You may not alter privileges in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'DELETE') THEN
    RAISE EXCEPTION 'You may not delete privileges from packages. Try deleting or disabling the package.';

  END IF;

  RETURN NEW;
END;

$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgprivaftertrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
