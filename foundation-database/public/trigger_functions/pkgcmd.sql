-- NO create trigger statements here. the updater will create them.

SELECT dropIfExists('TRIGGER', 'pkgcmdbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgcmdbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmdid       INTEGER;
  _debug        BOOL := false;

BEGIN
    IF (TG_OP = 'UPDATE') THEN
      IF (_debug) THEN
        RAISE NOTICE 'OLD.cmd_name %, NEW.cmd_name %',
                     OLD.cmd_name, NEW.cmd_name;
      END IF;

      IF (NEW.cmd_name != OLD.cmd_name) THEN
        SELECT cmd_id INTO _cmdid FROM cmd WHERE cmd_name=NEW.cmd_name;
        IF (FOUND) THEN
          RAISE EXCEPTION 'Cannot change command name % because another command with that name already exists.', NEW.cmd_name;
        END IF;
      END IF;

    ELSIF (TG_OP = 'INSERT') THEN
      IF (_debug) THEN
        RAISE NOTICE 'inserting NEW.cmd_name %', NEW.cmd_name;
      END IF;
      SELECT cmd_id INTO _cmdid FROM cmd WHERE cmd_name=NEW.cmd_name;
      IF (FOUND) THEN
        RAISE EXCEPTION 'Cannot create new command % because another command with that name already exists.', NEW.cmd_name;
      END IF;

    ELSIF (TG_OP = 'DELETE') THEN
      DELETE FROM cmdarg WHERE cmdarg_cmd_id=OLD.cmd_id;

      RETURN OLD;
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgcmdalterTrigger() RETURNS TRIGGER AS $$
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
    RAISE EXCEPTION 'You may not create custom commands in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'UPDATE') THEN
    RAISE EXCEPTION 'You may not alter custom commands in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'DELETE') THEN
    RAISE EXCEPTION 'You may not delete custom commands from packages. Try deleting or disabling the package.';

  END IF;

  RETURN NEW;
END;

$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgcmdaftertrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
