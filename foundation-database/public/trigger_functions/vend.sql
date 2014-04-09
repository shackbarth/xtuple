CREATE OR REPLACE FUNCTION _vendTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  IF NOT (checkPrivilege('MaintainVendors')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Vendors.';
  END IF;

  IF (LENGTH(COALESCE(NEW.vend_number, ''))=0) THEN
    RAISE EXCEPTION 'You must supply a valid Vendor Number.';
  END IF;

  IF (LENGTH(COALESCE(NEW.vend_name, ''))=0) THEN
    RAISE EXCEPTION 'You must supply a valid Vendor Name.';
  END IF;

  IF (NEW.vend_vendtype_id IS NULL) THEN
    RAISE EXCEPTION 'You must supply a valid Vendor Type ID.';
  END IF;

  IF (NEW.vend_terms_id IS NULL) THEN
    RAISE EXCEPTION 'You must supply a valid Terms Code ID.';
  END IF;

  IF (TG_OP = 'INSERT' AND fetchMetricText('CRMAccountNumberGeneration') IN ('A','O')) THEN
    PERFORM clearNumberIssue('CRMAccountNumber', NEW.vend_number);
  END IF;

  NEW.vend_number := UPPER(NEW.vend_number);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'vendTrigger');
CREATE TRIGGER vendTrigger BEFORE INSERT OR UPDATE ON vendinfo
       FOR EACH ROW EXECUTE PROCEDURE _vendTrigger();

CREATE OR REPLACE FUNCTION _vendAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid   INTEGER;

BEGIN

  IF (TG_OP = 'INSERT') THEN
    -- http://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE
    LOOP
      UPDATE crmacct SET crmacct_vend_id=NEW.vend_id,
                         crmacct_name=NEW.vend_name
       WHERE crmacct_number=NEW.vend_number;
      IF (FOUND) THEN
        EXIT;
      END IF;
      BEGIN
        INSERT INTO crmacct(crmacct_number,     crmacct_name,    crmacct_active,
                            crmacct_type,       crmacct_vend_id,
                            crmacct_cntct_id_1, crmacct_cntct_id_2
                  ) VALUES (NEW.vend_number,    NEW.vend_name,   NEW.vend_active,
                            'O',                NEW.vend_id,
                            NEW.vend_cntct1_id, NEW.vend_cntct2_id);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
      END;
    END LOOP;

    /* TODO: default characteristic assignments based on vendgrp? */

  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE crmacct SET crmacct_number = NEW.vend_number
    WHERE ((crmacct_vend_id=NEW.vend_id)
      AND  (crmacct_number!=NEW.vend_number));

    UPDATE crmacct SET crmacct_name = NEW.vend_name
    WHERE ((crmacct_vend_id=NEW.vend_id)
      AND  (crmacct_name!=NEW.vend_name));

  END IF;

  IF (fetchMetricBool('VendorChangeLog')) THEN
    SELECT cmnttype_id INTO _cmnttypeid
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');

    IF (_cmnttypeid IS NOT NULL) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'V', NEW.vend_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN

        IF (OLD.vend_number <> NEW.vend_number) THEN
          PERFORM postComment(_cmnttypeid, 'V', NEW.vend_id,
                              ('Number Changed from "' || OLD.vend_number ||
                               '" to "' || NEW.vend_number || '"') );
        END IF;

        IF (OLD.vend_name <> NEW.vend_name) THEN
          PERFORM postComment( _cmnttypeid, 'V', NEW.vend_id,
                              ('Name Changed from "' || OLD.vend_name ||
                               '" to "' || NEW.vend_name || '"') );
        END IF;

        IF (OLD.vend_active <> NEW.vend_active) THEN
          PERFORM postComment(_cmnttypeid, 'V', NEW.vend_id,
                              CASE WHEN NEW.vend_active THEN 'Activated'
                                   ELSE 'Deactivated' END);
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'vendAfterTrigger');
CREATE TRIGGER vendAfterTrigger AFTER INSERT OR UPDATE ON vendinfo
       FOR EACH ROW EXECUTE PROCEDURE _vendAfterTrigger();

CREATE OR REPLACE FUNCTION _vendinfoBeforeDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF NOT (checkPrivilege('MaintainVendors')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Vendors.';
  END IF;

  DELETE FROM itemsrcp
   WHERE itemsrcp_itemsrc_id IN (SELECT itemsrc_id
                                   FROM itemsrc
                                  WHERE itemsrc_vend_id=OLD.vend_id);

  DELETE FROM itemsrc WHERE (itemsrc_vend_id=OLD.vend_id);

  DELETE FROM vendaddrinfo WHERE (vendaddr_vend_id=OLD.vend_id);

  DELETE FROM docass WHERE docass_source_id = OLD.vend_id AND docass_source_type = 'V';
  DELETE FROM docass WHERE docass_target_id = OLD.vend_id AND docass_target_type = 'V';

  UPDATE crmacct SET crmacct_vend_id = NULL
   WHERE crmacct_vend_id = OLD.vend_id;
  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'vendinfoBeforeDeleteTrigger');
CREATE TRIGGER vendinfoBeforeDeleteTrigger BEFORE DELETE ON vendinfo
       FOR EACH ROW EXECUTE PROCEDURE _vendinfoBeforeDeleteTrigger();

CREATE OR REPLACE FUNCTION _vendinfoAfterDeleteTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF EXISTS(SELECT 1
              FROM checkhead
             WHERE ((checkhead_recip_id=OLD.vend_id)
                AND (checkhead_recip_type='V'))) THEN
    RAISE EXCEPTION '[xtuple: deleteVendor, -7]';
  END IF;

  DELETE FROM taxreg
   WHERE ((taxreg_rel_type='V')
      AND (taxreg_rel_id=OLD.vend_id));

  IF (fetchMetricBool('VendorChangeLog')) THEN
    PERFORM postComment(cmnttype_id, 'V', OLD.vend_id,
                        ('Deleted "' || OLD.vend_number || '"'))
      FROM cmnttype
     WHERE (cmnttype_name='ChangeLog');
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'vendinfoAfterDeleteTrigger');
CREATE TRIGGER vendinfoAfterDeleteTrigger AFTER DELETE ON vendinfo
       FOR EACH ROW EXECUTE PROCEDURE _vendinfoAfterDeleteTrigger();
