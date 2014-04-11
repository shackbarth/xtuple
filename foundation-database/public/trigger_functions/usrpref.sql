/* most of the processing here is to maintain crm accounts because
   usr is a view on pg_user and usrpref, not an actual table.
   the following records contribute to the usr view: usrpref_name IN
   ('propername', 'locale', 'initials', 'agent', 'active', 'email', 'window')
TODO: change usr view so it works with a cntct_id stored in usrpref instead of
      'propername', 'initials', and 'email'?
TODO: should usrpref_name='active' be calculated from pg_authid's
      rolname, rolcanlogin, rolvaliduntil?
 */

CREATE OR REPLACE FUNCTION _usrprefBeforeTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF NOT (checkPrivilege('MaintainUsers') OR
          checkPrivilege('MaintainPreferencesOthers') OR
          (checkPrivilege('MaintainPreferencesSelf'))) THEN
    -- 2 IFs because plpgsql doesn't always evaluate boolean exprs left-to-right
    IF (TG_OP = 'DELETE') THEN
      IF NOT (OLD.usrpref_name LIKE '%/checked' OR OLD.usrpref_name LIKE '%/columnsShown') THEN
        RAISE EXCEPTION 'You do not have privileges to change this User Preference.';
      END IF;
    ELSIF (NEW.usrpref_username = getEffectiveXtUser()) THEN
      IF NOT (NEW.usrpref_name LIKE '%/checked' OR NEW.usrpref_name LIKE '%/columnsShown') THEN
        RAISE EXCEPTION 'You do not have privileges to change this User Preference.';
      END IF;
    END IF;
  END IF;

  IF (TG_OP IN ('INSERT', 'UPDATE')) THEN
    IF (NEW.usrpref_name = 'locale') THEN
      IF NOT EXISTS(SELECT locale_id
                      FROM locale
                     WHERE locale_id = NEW.usrpref_value::INTEGER) THEN
        RAISE EXCEPTION 'You must supply a valid Locale.';
      END IF;

    ELSIF (NEW.usrpref_name IN ('agent', 'active')) THEN
      IF (NEW.usrpref_value NOT IN ('t', 'f')) THEN
        RAISE EXCEPTION '% must be either "t" or "f"', NEW.usrpref_name;
      END IF;
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'usrprefBeforeTrigger');
CREATE TRIGGER usrprefBeforeTrigger BEFORE INSERT OR UPDATE OR DELETE ON usrpref
       FOR EACH ROW EXECUTE PROCEDURE _usrprefBeforeTrigger();

CREATE OR REPLACE FUNCTION _usrprefAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- http://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE
    IF (NEW.usrpref_name='active') THEN
      LOOP
        UPDATE crmacct SET crmacct_usr_username=NEW.usrpref_username
         WHERE crmacct_number=UPPER(NEW.usrpref_username);
        IF (FOUND) THEN
          EXIT;
        END IF;
        BEGIN
          INSERT INTO crmacct(crmacct_number,        crmacct_active,
                              crmacct_type,          crmacct_usr_username
                    ) VALUES (NEW.usrpref_username,  NEW.usrpref_value::BOOL,
                              'I',                   NEW.usrpref_username);
          EXIT;
        EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
        END;
      END LOOP;

    ELSIF (NEW.usrpref_name='propername') THEN
      LOOP
        UPDATE crmacct SET crmacct_name=NEW.usrpref_value
         WHERE crmacct_number=UPPER(NEW.usrpref_username);
        IF (FOUND) THEN
          EXIT;
        END IF;
        BEGIN
          INSERT INTO crmacct(crmacct_number,        crmacct_active,
                              crmacct_name,
                              crmacct_type,          crmacct_usr_username
                    ) VALUES (UPPER(NEW.usrpref_username), TRUE,
                              NEW.usrpref_value,
                              'I',                   NEW.usrpref_username);
          EXIT;
        EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
        END;
      END LOOP;

    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'usrprefAfterTrigger');
CREATE TRIGGER usrprefAfterTrigger AFTER INSERT OR UPDATE OR DELETE ON usrpref
       FOR EACH ROW EXECUTE PROCEDURE _usrprefAfterTrigger();
