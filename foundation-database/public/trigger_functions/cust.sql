CREATE OR REPLACE FUNCTION _custTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF NOT (checkPrivilege('MaintainCustomerMasters') OR
          checkPrivilege('PostMiscInvoices')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Customers.';
  END IF;

  IF (NEW.cust_number IS NULL) THEN
        RAISE EXCEPTION 'You must supply a valid Customer Number.';
  END IF;

  IF (LENGTH(COALESCE(NEW.cust_name,''))=0) THEN
        RAISE EXCEPTION 'You must supply a valid Customer Name.';
  END IF;

  IF (NEW.cust_custtype_id IS NULL) THEN
        RAISE EXCEPTION 'You must supply a valid Customer Type ID.';
  END IF;

  IF (NEW.cust_salesrep_id IS NULL) THEN
        RAISE EXCEPTION 'You must supply a valid Sales Rep ID.';
  END IF;

  IF (NEW.cust_terms_id IS NULL) THEN
        RAISE EXCEPTION 'You must supply a valid Terms Code ID.';
  END IF;

  IF (TG_OP = 'INSERT' AND fetchMetricText('CRMAccountNumberGeneration') IN ('A','O')) THEN
    PERFORM clearNumberIssue('CRMAccountNumber', NEW.cust_number);
  END IF;

  NEW.cust_number := UPPER(NEW.cust_number);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'custTrigger');
CREATE TRIGGER custTrigger BEFORE INSERT OR UPDATE ON custinfo
       FOR EACH ROW EXECUTE PROCEDURE _custTrigger();

CREATE OR REPLACE FUNCTION _custAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _whsId      INTEGER := -1;

BEGIN

  IF (TG_OP = 'INSERT') THEN
    -- http://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE
    LOOP
      UPDATE crmacct SET crmacct_cust_id=NEW.cust_id,
                         crmacct_name=NEW.cust_name,
                         crmacct_prospect_id=NULL
      WHERE crmacct_number=NEW.cust_number;
      IF (FOUND) THEN
        DELETE FROM prospect WHERE prospect_id=NEW.cust_id;
        EXIT;
      END IF;
      BEGIN
        INSERT INTO crmacct(crmacct_number,  crmacct_name,    crmacct_active,
                            crmacct_type,    crmacct_cust_id, crmacct_cntct_id_1,
                            crmacct_cntct_id_2
                  ) VALUES (NEW.cust_number, NEW.cust_name,   NEW.cust_active,
                            'O',             NEW.cust_id,     NEW.cust_cntct_id,
                            NEW.cust_corrcntct_id);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
      END;
    END LOOP;

    PERFORM updateCharAssignment('C', NEW.cust_id, char_id, charass_value)
       FROM custtype
       JOIN charass ON (custtype_id=charass_target_id AND charass_target_type='CT')
       JOIN char ON (charass_char_id=char_id)
       WHERE ((custtype_id=NEW.cust_custtype_id)
          AND (custtype_char)
          AND (charass_default));

  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE crmacct SET crmacct_number = NEW.cust_number
    WHERE ((crmacct_cust_id=NEW.cust_id)
      AND  (crmacct_number!=NEW.cust_number));

    UPDATE crmacct SET crmacct_name = NEW.cust_name
    WHERE ((crmacct_cust_id=NEW.cust_id)
      AND  (crmacct_name!=NEW.cust_name));
  END IF;

  IF (TG_OP = 'INSERT') THEN
    PERFORM postEvent('NewCustomer', 'C', NEW.cust_id,
                      NULL, NEW.cust_number,
                      NULL, NULL, NULL, NULL);
  END IF;

  IF (fetchMetricBool('CustomerChangeLog')) THEN
    SELECT cmnttype_id INTO _cmnttypeid
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');

    IF (_cmnttypeid IS NOT NULL) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN

        IF (OLD.cust_number <> NEW.cust_number) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.cust_id,
                              ('Number changed from "' || OLD.cust_number ||
                               '" to "' || NEW.cust_number || '"') );
        END IF;

        IF (OLD.cust_name <> NEW.cust_name) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.cust_id,
                              ('Name changed from "' || OLD.cust_name ||
                               '" to "' || NEW.cust_name || '"') );
        END IF;

        IF (OLD.cust_active <> NEW.cust_active) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              CASE WHEN NEW.cust_active THEN 'Activated'
                                   ELSE 'Deactivated' END);
        END IF;

        IF (OLD.cust_discntprcnt <> NEW.cust_discntprcnt) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Discount changed from "' ||
                               formatprcnt(OLD.cust_discntprcnt) || '%" to "' ||
                               formatprcnt(NEW.cust_discntprcnt) || '%"') );
        END IF;

        IF (OLD.cust_creditlmt <> NEW.cust_creditlmt) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Credit Limit changed from ' || formatMoney(OLD.cust_creditlmt) ||
                               ' to ' || formatMoney(NEW.cust_creditlmt)));
        END IF;

        IF (OLD.cust_creditstatus <> NEW.cust_creditstatus) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Credit Status Changed from "' ||
                               CASE OLD.cust_creditstatus
                                    WHEN 'G' THEN 'In Good Standing'
                                    WHEN 'W' THEN 'Credit Warning'
                                    WHEN 'H' THEN 'Credit Hold'
                                    ELSE 'Unknown/Error'
                               END || '" to "' ||
                               CASE NEW.cust_creditstatus
                                    WHEN 'G' THEN 'In Good Standing'
                                    WHEN 'W' THEN 'Credit Warning'
                                    WHEN 'H' THEN 'Credit Hold'
                                    ELSE 'Unknown/Error'
                               END || '"') );
        END IF;

        IF (OLD.cust_custtype_id <> NEW.cust_custtype_id) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Customer type changed from "' ||
                               (SELECT custtype_code FROM custtype
                                 WHERE custtype_id = OLD.cust_custtype_id) || '" to "' ||
                               (SELECT custtype_code FROM custtype
                                 WHERE custtype_id = NEW.cust_custtype_id) || '"') );
        END IF;

        IF (COALESCE(OLD.cust_gracedays,-1) <> COALESCE(NEW.cust_gracedays,-1)) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Grace Days changed from "' ||
                               COALESCE(TEXT(OLD.cust_gracedays), 'Default') ||
                               '" to "' ||
                               COALESCE(TEXT(NEW.cust_gracedays), 'Default') || '"'));
        END IF;

        IF (OLD.cust_terms_id <> NEW.cust_terms_id) THEN
          PERFORM postComment(_cmnttypeid, 'C', NEW.cust_id,
                              ('Terms changed from "' ||
                               (SELECT terms_code FROM terms
                                 WHERE terms_id = OLD.cust_terms_id) || '" to "' ||
                               (SELECT terms_code FROM terms
                                 WHERE terms_id = NEW.cust_terms_id) || '"'));
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'custAfterTrigger');
CREATE TRIGGER custAfterTrigger AFTER INSERT OR UPDATE ON custinfo
       FOR EACH ROW EXECUTE PROCEDURE _custAfterTrigger();

CREATE OR REPLACE FUNCTION _custinfoBeforeDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF NOT (checkPrivilege('MaintainCustomerMasters')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Customers.';
  END IF;

  UPDATE crmacct SET crmacct_cust_id = NULL
   WHERE crmacct_cust_id = OLD.cust_id;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'custinfoBeforeDeleteTrigger');
CREATE TRIGGER custinfoBeforeDeleteTrigger BEFORE DELETE ON custinfo
       FOR EACH ROW EXECUTE PROCEDURE _custinfoBeforeDeleteTrigger();

CREATE OR REPLACE FUNCTION _custinfoAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  -- handle transitory state when converting customer to prospect
  IF EXISTS(SELECT quhead_id
              FROM quhead
             WHERE (quhead_cust_id=OLD.cust_id) AND
     NOT EXISTS(SELECT prospect_id
                  FROM prospect
                 WHERE prospect_id=OLD.cust_id)) THEN
    RAISE EXCEPTION '[xtuple: deleteCustomer, -8]';
  END IF;

  IF EXISTS(SELECT invchead_id
              FROM invchead
             WHERE (invchead_cust_id=OLD.cust_id)) THEN
    RAISE EXCEPTION '[xtuple: deleteCustomer, -7]';
  END IF;
  -- end TODO

  IF EXISTS(SELECT checkhead_recip_id
              FROM checkhead
             WHERE ((checkhead_recip_id=OLD.cust_id)
               AND  (checkhead_recip_type='C'))) THEN
    RAISE EXCEPTION '[xtuple: deleteCustomer, -6]';
  END IF;

  DELETE FROM taxreg
   WHERE ((taxreg_rel_type='C')
     AND  (taxreg_rel_id=OLD.cust_id));

  DELETE FROM ipsass
   WHERE (ipsass_cust_id=OLD.cust_id);

  DELETE FROM docass WHERE docass_source_id = OLD.cust_id AND docass_source_type = 'C';
  DELETE FROM docass WHERE docass_target_id = OLD.cust_id AND docass_target_type = 'C';

  IF (fetchMetricBool('CustomerChangeLog')) THEN
    PERFORM postComment(cmnttype_id, 'C', OLD.cust_id,
                        ('Deleted "' || OLD.cust_number || '"'))
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'custinfoAfterDeleteTrigger');
CREATE TRIGGER custinfoAfterDeleteTrigger AFTER DELETE ON custinfo
       FOR EACH ROW EXECUTE PROCEDURE _custinfoAfterDeleteTrigger();
