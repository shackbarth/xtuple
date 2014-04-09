CREATE OR REPLACE FUNCTION _metasqlTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  NEW.metasql_lastuser 		:= getEffectiveXtUser();
  NEW.metasql_lastupdate 	:= current_date;
  RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

SELECT dropifexists( 'TRIGGER', 'metasqlTrigger','PUBLIC');
CREATE TRIGGER metasqlTrigger BEFORE INSERT OR UPDATE ON metasql FOR EACH ROW EXECUTE PROCEDURE _metasqlTrigger();

CREATE OR REPLACE FUNCTION _metasqlalterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NOT (isDBA() OR checkPrivilege('MaintainMetaSQL'))) THEN
    RAISE EXCEPTION '% does not have privileges to maintain MetaSQL statements in %.%',
                getEffectiveXtUser(), TG_TABLE_SCHEMA, TG_TABLE_NAME;
  END IF;

  IF ((TG_OP = 'UPDATE' OR TG_OP = 'DELETE')
      AND NEW.metasql_grade <= 0
      AND NOT isDBA()) THEN
    RAISE EXCEPTION 'You may not alter grade 0 metasql queries except using the xTuple Updater utility';
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;

$$ LANGUAGE 'plpgsql';

SELECT dropifexists( 'TRIGGER', 'metasqlAlterTrigger','PUBLIC');
CREATE TRIGGER metasqlAlterTrigger BEFORE INSERT OR UPDATE ON metasql FOR EACH ROW EXECUTE PROCEDURE _metasqlAlterTrigger();
