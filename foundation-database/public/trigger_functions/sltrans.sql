CREATE OR REPLACE FUNCTION _sltransInsertTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _reqNotes BOOLEAN;
  _externalCompany      BOOLEAN := false;
BEGIN
  -- Checks
  SELECT company_external INTO _externalCompany
  FROM company JOIN accnt ON (company_number=accnt_company)
  WHERE (accnt_id=NEW.sltrans_accnt_id);
  IF (_externalCompany) THEN
    RAISE EXCEPTION 'Transactions are not allowed for G/L Accounts with External Company segments.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'sltransInsertTrigger');
CREATE TRIGGER sltransInsertTrigger BEFORE INSERT ON sltrans FOR EACH ROW EXECUTE PROCEDURE _sltransInsertTrigger();

CREATE OR REPLACE FUNCTION _sltransAlterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _externalCompany      BOOLEAN := false;
  _updated BOOLEAN := false;
BEGIN
  IF(TG_OP='DELETE') THEN
    RAISE EXCEPTION 'You may not delete Journal Transactions once they have been created.';
  ELSIF (TG_OP = 'UPDATE') THEN	
    IF(OLD.sltrans_id != NEW.sltrans_id) THEN
      _updated := true;
    ELSIF(OLD.sltrans_date != NEW.sltrans_date) THEN
      _updated := true;
    ELSIF(OLD.sltrans_accnt_id != NEW.sltrans_accnt_id) THEN
      _updated := true;
    ELSIF(OLD.sltrans_amount != NEW.sltrans_amount) THEN
      _updated := true;
    ELSIF(OLD.sltrans_username != NEW.sltrans_username) THEN
      _updated := true;
    ELSIF( (OLD.sltrans_sequence IS NULL     AND NEW.sltrans_sequence IS NOT NULL)
        OR (OLD.sltrans_sequence IS NOT NULL AND NEW.sltrans_sequence IS NULL)
        OR (COALESCE(OLD.sltrans_sequence,0) != COALESCE(NEW.sltrans_sequence,0)) ) THEN
      _updated := true;
    ELSIF( (OLD.sltrans_created IS NULL     AND NEW.sltrans_created IS NOT NULL)
        OR (OLD.sltrans_created IS NOT NULL AND NEW.sltrans_created IS NULL)
        OR (COALESCE(OLD.sltrans_created,now()) != COALESCE(NEW.sltrans_created,now())) ) THEN
      _updated := true;
    ELSIF( (OLD.sltrans_source IS NULL     AND NEW.sltrans_source IS NOT NULL)
        OR (OLD.sltrans_source IS NOT NULL AND NEW.sltrans_source IS NULL)
        OR (COALESCE(OLD.sltrans_source,'') != COALESCE(NEW.sltrans_source,'')) ) THEN
      _updated := true;
    ELSIF( (OLD.sltrans_docnumber IS NULL     AND NEW.sltrans_docnumber IS NOT NULL)
        OR (OLD.sltrans_docnumber IS NOT NULL AND NEW.sltrans_docnumber IS NULL)
        OR (COALESCE(OLD.sltrans_docnumber,'') != COALESCE(NEW.sltrans_docnumber,'')) ) THEN
      _updated := true;
    ELSIF( (OLD.sltrans_doctype IS NULL     AND NEW.sltrans_doctype IS NOT NULL)
        OR (OLD.sltrans_doctype IS NOT NULL AND NEW.sltrans_doctype IS NULL)
        OR (COALESCE(OLD.sltrans_doctype,'') != COALESCE(NEW.sltrans_doctype,'')) ) THEN
      _updated := true;
    END IF;

    IF(_updated) THEN
      RAISE EXCEPTION 'You may not alter some Journal Transaction fields once they have been created.';
    END IF;
  ELSE
    RAISE EXCEPTION 'trigger for sltrans table called in unexpected state.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'sltransAlterTrigger');
CREATE TRIGGER sltransAlterTrigger BEFORE UPDATE OR DELETE ON sltrans FOR EACH ROW EXECUTE PROCEDURE _sltransAlterTrigger();
