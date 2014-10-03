-- NO create trigger statements. the updater will create them.

SELECT dropIfExists('TRIGGER', 'pkgreportbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgreportbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _reportid     INTEGER;
  _debug        BOOL := false;

BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (_debug) THEN
      RAISE NOTICE 'update OLD % %, NEW % %',
                   OLD.report_name, OLD.report_grade, NEW.report_name, NEW.report_grade;
    END IF;

    IF (NEW.report_name != OLD.report_name) THEN
      SELECT report_id INTO _reportid
      FROM report
      WHERE ((report_name=NEW.report_name)
        AND  (report_grade=NEW.report_grade));
      IF (FOUND) THEN
        RAISE EXCEPTION 'Cannot change report % % because another report with that name and grade already exists.', NEW.report_name, NEW.report_grade;
      END IF;
    END IF;

  ELSIF (TG_OP = 'INSERT') THEN
    IF (_debug) THEN
      RAISE NOTICE 'insert NEW % %', NEW.report_name, NEW.report_grade;
    END IF;
    SELECT report_id INTO _reportid
    FROM report
    WHERE ((report_name=NEW.report_name)
      AND  (report_grade=NEW.report_grade));
    IF (FOUND) THEN
      RAISE EXCEPTION 'Cannot create new report % % because another report with that name and grade already exists.', NEW.report_name, NEW.report_grade;
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgreportalterTrigger() RETURNS TRIGGER AS $$
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
    RAISE EXCEPTION 'You may not create report definitions in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'UPDATE') THEN
    RAISE EXCEPTION 'You may not alter report definitions in packages except using the xTuple Updater utility';

  ELSIF (TG_OP = 'DELETE') THEN
    RAISE EXCEPTION 'You may not delete report definitions from packages. Try deleting or disabling the package.';

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgreportaftertrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
