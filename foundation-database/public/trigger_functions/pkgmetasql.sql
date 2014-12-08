-- NO create trigger statements. the updater will create them.

SELECT dropIfExists('TRIGGER', 'pkgmetasqlbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgmetasqlbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _metasqlid    INTEGER;
  _isdba        BOOLEAN := false;

BEGIN
  SELECT rolsuper INTO _isdba FROM pg_roles WHERE (rolname=getEffectiveXtUser());

  IF (NOT (_isdba OR checkPrivilege('MaintainMetaSQL'))) THEN
    RAISE EXCEPTION '% does not have privileges to maintain MetaSQL statements in %.% (DBA=%)',
                getEffectiveXtUser(), TG_TABLE_SCHEMA, TG_TABLE_NAME, _isdba;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    RAISE DEBUG 'update OLD %-%-%, NEW %-%-%',
                 OLD.metasql_group, OLD.metasql_name, OLD.metasql_grade,
                 NEW.metasql_group, NEW.metasql_name, NEW.metasql_grade;

    IF (NEW.metasql_name != OLD.metasql_name OR NEW.metasql_group != OLD.metasql_group OR NEW.metasql_grade != OLD.metasql_grade) THEN
      SELECT metasql_id INTO _metasqlid
      FROM metasql
      WHERE metasql_name=NEW.metasql_name AND metasql_group=NEW.metasql_group AND metasql_grade=NEW.metasql_grade;
      IF (FOUND) THEN
        RAISE EXCEPTION 'Cannot change the MetaSQL statement named %-%-% because another MetaSQL statement with that group, name and grade already exists.', NEW.metasql_group, NEW.metasql_name, NEW.metasql_grade;
      END IF;
    END IF;

  ELSIF (TG_OP = 'INSERT') THEN
    RAISE DEBUG 'insert NEW %-% %',
                 NEW.metasql_group, NEW.metasql_name, NEW.metasql_grade;
    SELECT metasql_id INTO _metasqlid
    FROM metasql
    WHERE metasql_name=NEW.metasql_name AND metasql_group=NEW.metasql_group AND metasql_grade=NEW.metasql_grade;
    IF (FOUND) THEN
      RAISE EXCEPTION 'The new MetaSQL statement %-% % conflicts with an existing statement.',
                      NEW.metasql_group, NEW.metasql_name, NEW.metasql_grade;
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgmetasqlalterTrigger() RETURNS TRIGGER AS $$
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

  -- cannot combine IF's because plpgsql does not always evaluate left-to-right
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.metasql_grade <= 0 AND NOT _isdba) THEN
      RAISE EXCEPTION 'You may not create grade 0 MetaSQL statements in packages except using the xTuple Updater utility';
    END IF;

  ELSIF (TG_OP = 'UPDATE') THEN
    IF (NEW.metasql_grade <= 0 AND NOT _isdba) THEN
      RAISE EXCEPTION 'You may not alter grade 0 MetaSQL statements in packages except using the xTuple Updater utility';
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.metasql_grade <= 0 AND NOT _isdba) THEN
      RAISE EXCEPTION 'You may not delete grade 0 MetaSQL statements from packages. Try deleting or disabling the package.';
    ELSE
      RETURN OLD;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _pkgmetasqlaftertrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
