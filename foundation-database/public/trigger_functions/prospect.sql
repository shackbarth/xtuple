CREATE OR REPLACE FUNCTION _prospectTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NOT checkPrivilege('MaintainProspectMasters')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Prospects.';
  END IF;

  IF (NEW.prospect_number IS NULL) THEN
    RAISE EXCEPTION 'You must supply a valid Prospect Number.';
  END IF;

  NEW.prospect_number := UPPER(NEW.prospect_number);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'prospectTrigger');
CREATE TRIGGER prospectTrigger BEFORE INSERT OR UPDATE ON prospect
       FOR EACH ROW EXECUTE PROCEDURE _prospectTrigger();

CREATE OR REPLACE FUNCTION _prospectAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid   INTEGER;
  _custid       INTEGER;
  _prospectid   INTEGER;

BEGIN

  IF (TG_OP = 'INSERT') THEN
    SELECT crmacct_cust_id, crmacct_prospect_id INTO _custid, _prospectid
      FROM crmacct
     WHERE crmacct_number=NEW.prospect_number;

    IF (_custid > 0 AND _custid != _prospectid) THEN
      RAISE EXCEPTION '[xtuple: createProspect, -2]';
    END IF;

    IF (_prospectid > 0) THEN
      RAISE EXCEPTION '[xtuple: createProspect, -3]';
    END IF;

    -- http://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE
    LOOP
      UPDATE crmacct SET crmacct_prospect_id=NEW.prospect_id,
                         crmacct_cust_id=NULL,
                         crmacct_name=NEW.prospect_name
       WHERE crmacct_number=NEW.prospect_number;
      IF (FOUND) THEN
        EXIT;
      END IF;
      BEGIN
        INSERT INTO crmacct(crmacct_number,      crmacct_name,
                            crmacct_active,      crmacct_type,
                            crmacct_prospect_id, crmacct_cntct_id_1
                  ) VALUES (NEW.prospect_number, NEW.prospect_name,
                            NEW.prospect_active, 'O',
                            NEW.prospect_id,     NEW.prospect_cntct_id);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
      END;
    END LOOP;

    /* TODO: default characteristic assignments based on what? */

  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE crmacct SET crmacct_number = NEW.prospect_number
    WHERE ((crmacct_prospect_id=NEW.prospect_id)
      AND  (crmacct_number!=NEW.prospect_number));

    UPDATE crmacct SET crmacct_name = NEW.prospect_name
    WHERE ((crmacct_prospect_id=NEW.prospect_id)
      AND  (crmacct_name!=NEW.prospect_name));

  END IF;

  IF (fetchMetricBool('ProspectChangeLog')) THEN
    SELECT cmnttype_id INTO _cmnttypeid
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');

    IF (_cmnttypeid IS NOT NULL) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.prospect_active <> NEW.prospect_active) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              CASE WHEN NEW.prospect_active THEN 'Activated'
                                   ELSE 'Deactivated' END);
        END IF;

        IF (OLD.prospect_number <> NEW.prospect_number) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Number changed from "' || OLD.prospect_number ||
                              '" to "' || NEW.prospect_number || '"');
        END IF;

        IF (OLD.prospect_name <> NEW.prospect_name) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Name changed from "' || OLD.prospect_name ||
                              '" to "' || NEW.prospect_name || '"');
        END IF;

        IF (OLD.prospect_cntct_id <> NEW.prospect_cntct_id) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Contact changed from "' ||
                              formatCntctName(OLD.prospect_cntct_id) || '" to "' ||
                              formatCntctName(NEW.prospect_cntct_id) || '"');
        END IF;

        IF (OLD.prospect_taxauth_id <> NEW.prospect_taxauth_id) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Tax Authority changed from "' ||
                              (SELECT taxauth_code FROM taxauth
                                WHERE taxauth_id=OLD.prospect_taxauth_id) ||
                              '" to "' ||
                              (SELECT taxauth_code FROM taxauth
                                WHERE taxauth_id=NEW.prospect_taxauth_id) || '"');
        END IF;

        IF (OLD.prospect_salesrep_id <> NEW.prospect_salesrep_id) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Sales Rep changed from "' ||
                              (SELECT salesrep_number FROM salesrep
                               WHERE salesrep_id=OLD.prospect_salesrep_id) ||
                              '" to "' ||
                              (SELECT salesrep_number FROM salesrep
                               WHERE salesrep_id=NEW.prospect_salesrep_id) || '"');
        END IF;

        IF (OLD.prospect_warehous_id <> NEW.prospect_warehous_id) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Warehouse changed from "' ||
                              (SELECT warehous_code FROM whsinfo
                                WHERE warehous_id=OLD.prospect_warehous_id) ||
                              '" to "' ||
                              (SELECT warehous_code FROM whsinfo
                                WHERE warehous_id=NEW.prospect_warehous_id) || '"');
        END IF;

        IF (OLD.prospect_taxzone_id <> NEW.prospect_taxzone_id) THEN
          PERFORM postComment(_cmnttypeid, 'PSPCT', NEW.prospect_id,
                              'Tax Zone changed from "' ||
                              (SELECT taxzone_code FROM taxzone
                                WHERE taxzone_id=OLD.prospect_taxzone_id) || '" to "' ||
                              (SELECT taxzone_code FROM taxzone
                                WHERE taxzone_id=NEW.prospect_taxzone_id) || '"');
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'prospectAfterTrigger');
CREATE TRIGGER prospectAfterTrigger AFTER INSERT OR UPDATE ON prospect
       FOR EACH ROW EXECUTE PROCEDURE _prospectAfterTrigger();

CREATE OR REPLACE FUNCTION _prospectBeforeDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (NOT checkPrivilege('MaintainProspectMasters')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Prospects.';
  END IF;

  UPDATE crmacct SET crmacct_prospect_id = NULL
   WHERE crmacct_prospect_id = OLD.prospect_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'prospectBeforeDeleteTrigger');
CREATE TRIGGER prospectBeforeDeleteTrigger BEFORE DELETE ON prospect
       FOR EACH ROW EXECUTE PROCEDURE _prospectBeforeDeleteTrigger();

CREATE OR REPLACE FUNCTION _prospectAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF EXISTS(SELECT 1 FROM quhead WHERE quhead_cust_id = OLD.prospect_id) AND
     NOT EXISTS (SELECT 1 FROM custinfo WHERE cust_id = OLD.prospect_id) THEN
    RAISE EXCEPTION '[xtuple: deleteProspect, -1]';
  END IF;

  IF (fetchMetricBool('ProspectChangeLog')) THEN
    PERFORM postComment(cmnttype_id, 'PSPCT', OLD.prospect_id,
                        'Deleted "' || OLD.prospect_number || '"')
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'prospectAfterDeleteTrigger');
CREATE TRIGGER prospectAfterDeleteTrigger AFTER DELETE ON prospect
       FOR EACH ROW EXECUTE PROCEDURE _prospectAfterDeleteTrigger();
