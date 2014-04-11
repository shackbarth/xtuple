-- Before trigger
CREATE OR REPLACE FUNCTION _cntctTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  NEW.cntct_name := formatCntctName(NULL, NEW.cntct_first_name, NEW.cntct_middle, NEW.cntct_last_name, NEW.cntct_suffix);
  NEW.cntct_email := lower(NEW.cntct_email);

  IF (TG_OP = 'INSERT') THEN
    --- clear the number from the issue cache
    PERFORM clearNumberIssue('ContactNumber', NEW.cntct_number);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cntctTrigger');
CREATE TRIGGER cntcttrigger
  BEFORE INSERT OR UPDATE
  ON cntct
  FOR EACH ROW
  EXECUTE PROCEDURE _cntctTrigger();

CREATE OR REPLACE FUNCTION _cntctTriggerBeforeDelete() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM cntctaddr WHERE cntctaddr_cntct_id=OLD.cntct_id;
    DELETE FROM cntctdata WHERE cntctdata_cntct_id=OLD.cntct_id;
    DELETE FROM cntcteml  WHERE cntcteml_cntct_id=OLD.cntct_id;
    DELETE FROM docass WHERE docass_source_id = OLD.cntct_id AND docass_source_type = 'T';
    DELETE FROM docass WHERE docass_target_id = OLD.cntct_id AND docass_target_type = 'T';

    -- these have denormalized cntct info so it should be ok to update them
    UPDATE cohead SET cohead_billto_cntct_id=NULL
     WHERE cohead_billto_cntct_id=OLD.cntct_id;
    UPDATE cohead SET cohead_shipto_cntct_id=NULL
     WHERE cohead_shipto_cntct_id=OLD.cntct_id;

    UPDATE pohead SET pohead_vend_cntct_id=NULL
     WHERE pohead_vend_cntct_id=OLD.cntct_id;
    UPDATE pohead SET pohead_shipto_cntct_id=NULL
     WHERE pohead_shipto_cntct_id=OLD.cntct_id;

    UPDATE quhead SET quhead_billto_cntct_id=NULL
     WHERE quhead_billto_cntct_id=OLD.cntct_id;
    UPDATE quhead SET quhead_shipto_cntct_id=NULL
     WHERE quhead_shipto_cntct_id=OLD.cntct_id;

    IF (fetchMetricBool('MultiWhs')) THEN
      UPDATE tohead SET tohead_destcntct_id=NULL
       WHERE tohead_destcntct_id=OLD.cntct_id;
      UPDATE tohead SET tohead_srccntct_id=NULL
       WHERE tohead_srccntct_id=OLD.cntct_id;
    END IF;

  END IF;
  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cntctTriggerBeforeDelete');
CREATE TRIGGER cntcttriggerbeforedelete
  BEFORE DELETE
  ON cntct
  FOR EACH ROW
  EXECUTE PROCEDURE _cntctTriggerBeforeDelete();

-- After trigger
CREATE OR REPLACE FUNCTION _cntctTriggerAfter() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cntctemlid INTEGER;
  _rows INTEGER;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF(length(coalesce(NEW.cntct_email,'')) > 0) THEN
      INSERT INTO cntcteml (
        cntcteml_cntct_id, cntcteml_primary, cntcteml_email )
      VALUES (
        NEW.cntct_id, true, NEW.cntct_email );
    END IF;
    PERFORM postComment('ChangeLog', 'T', NEW.cntct_id,
                        ('Created by ' || getEffectiveXtUser()));
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.cntct_email != NEW.cntct_email) THEN
      SELECT cntcteml_id INTO _cntctemlid
      FROM cntcteml
      WHERE ((cntcteml_cntct_id=NEW.cntct_id)
        AND (cntcteml_email=NEW.cntct_email));

      GET DIAGNOSTICS _rows = ROW_COUNT;
      IF (_rows = 0) THEN
        UPDATE cntcteml SET
          cntcteml_primary=false
        WHERE ((cntcteml_cntct_id=NEW.cntct_id)
         AND (cntcteml_primary=true));
       
        INSERT INTO cntcteml (
          cntcteml_cntct_id, cntcteml_primary, cntcteml_email )
        VALUES (
          NEW.cntct_id, true, NEW.cntct_email ); 
      ELSE
        UPDATE cntcteml SET
          cntcteml_primary=false
        WHERE ((cntcteml_cntct_id=NEW.cntct_id)
         AND (cntcteml_primary=true));

        UPDATE cntcteml SET
          cntcteml_primary=true
        WHERE (cntcteml_id=_cntctemlid);
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
      DELETE FROM comment
       WHERE (comment_source_id=OLD.cntct_id AND comment_source = 'T');
      DELETE FROM docass
       WHERE (docass_source_id=OLD.cntct_id AND docass_source_type = 'T')
          OR (docass_target_id=OLD.cntct_id AND docass_target_type = 'T');
      
      RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cntctTriggerAfter');
CREATE TRIGGER cntcttriggerafter
  AFTER INSERT OR UPDATE OR DELETE
  ON cntct
  FOR EACH ROW
  EXECUTE PROCEDURE _cntctTriggerAfter();

