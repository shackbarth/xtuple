-- NO create trigger statements. the updater will create them.

SELECT dropIfExists('TRIGGER', 'pkgcmdargbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgcmdargbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmdargid     INTEGER;
  _debug        BOOL := false;

BEGIN
  IF (TG_OP = 'UPDATE') THEN
    RETURN NEW;

  ELSIF (TG_OP = 'INSERT') THEN
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgcmdargalterTrigger() RETURNS TRIGGER AS $$
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
    RAISE EXCEPTION 'You may not create command arguments in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'UPDATE') THEN
    RAISE EXCEPTION 'You may not alter command arguments in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'DELETE') THEN
    RAISE EXCEPTION 'You may not delete command arguments from packages. Try deleting or disabling the package.';

  END IF;

  RETURN NEW;
END;

$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgcmdargaftertrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
