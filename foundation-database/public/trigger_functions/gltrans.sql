CREATE OR REPLACE FUNCTION _gltransInsertTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _reqNotes BOOLEAN;
  _externalCompany      BOOLEAN := false;
BEGIN
  -- Checks
  -- Start with privileges
  IF ((NEW.gltrans_doctype='JE') AND (NOT checkPrivilege('PostJournalEntries'))) THEN
      RAISE EXCEPTION 'You do not have privileges to create a Journal Entry.';
  END IF;

  SELECT company_external INTO _externalCompany
  FROM company JOIN accnt ON (company_number=accnt_company)
  WHERE (accnt_id=NEW.gltrans_accnt_id);
  IF (_externalCompany) THEN
    RAISE EXCEPTION 'Transactions are not allowed for G/L Accounts with External Company segments.';
  END IF;
  -- RAISE NOTICE '_gltransInsertTrigger(): company_external = %', _externalCompany;

  SELECT metric_value='t'
    INTO _reqNotes
    FROM metric
   WHERE(metric_name='MandatoryGLEntryNotes');
  IF (_reqNotes IS NULL) THEN
    _reqNotes := false;
  END IF;
  IF ((NEW.gltrans_doctype='JE') AND _reqNotes AND (TRIM(BOTH FROM COALESCE(NEW.gltrans_notes,''))='')) THEN
      RAISE EXCEPTION 'Notes are required for Journal Entries.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'gltransInsertTrigger');
CREATE TRIGGER gltransInsertTrigger BEFORE INSERT ON gltrans FOR EACH ROW EXECUTE PROCEDURE _gltransInsertTrigger();

CREATE OR REPLACE FUNCTION _gltransAlterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _externalCompany      BOOLEAN := false;
  _updated BOOLEAN := false;
BEGIN
  IF(TG_OP='DELETE') THEN
    RAISE EXCEPTION 'You may not delete G/L Transactions once they have been created.';
  ELSIF (TG_OP = 'UPDATE') THEN
    SELECT company_external INTO _externalCompany
    FROM company JOIN accnt ON (company_number=accnt_company)
    WHERE (accnt_id=NEW.gltrans_accnt_id);
    IF (_externalCompany) THEN
      RAISE EXCEPTION 'Transactions are not allowed for G/L Accounts with External Company segments.';
    END IF;

    IF(OLD.gltrans_id != NEW.gltrans_id) THEN
      _updated := true;
    ELSIF(OLD.gltrans_date != NEW.gltrans_date) THEN
      _updated := true;
    ELSIF(OLD.gltrans_accnt_id != NEW.gltrans_accnt_id) THEN
      _updated := true;
    ELSIF(OLD.gltrans_amount != NEW.gltrans_amount) THEN
      _updated := true;
    ELSIF(OLD.gltrans_username != NEW.gltrans_username) THEN
      _updated := true;
    ELSIF( (OLD.gltrans_sequence IS NULL     AND NEW.gltrans_sequence IS NOT NULL)
        OR (OLD.gltrans_sequence IS NOT NULL AND NEW.gltrans_sequence IS NULL)
        OR (COALESCE(OLD.gltrans_sequence,0) != COALESCE(NEW.gltrans_sequence,0)) ) THEN
      _updated := true;
    ELSIF( (OLD.gltrans_created IS NULL     AND NEW.gltrans_created IS NOT NULL)
        OR (OLD.gltrans_created IS NOT NULL AND NEW.gltrans_created IS NULL)
        OR (COALESCE(OLD.gltrans_created,now()) != COALESCE(NEW.gltrans_created,now())) ) THEN
      _updated := true;
    ELSIF( (OLD.gltrans_source IS NULL     AND NEW.gltrans_source IS NOT NULL)
        OR (OLD.gltrans_source IS NOT NULL AND NEW.gltrans_source IS NULL)
        OR (COALESCE(OLD.gltrans_source,'') != COALESCE(NEW.gltrans_source,'')) ) THEN
      _updated := true;
    ELSIF( (OLD.gltrans_docnumber IS NULL     AND NEW.gltrans_docnumber IS NOT NULL)
        OR (OLD.gltrans_docnumber IS NOT NULL AND NEW.gltrans_docnumber IS NULL)
        OR (COALESCE(OLD.gltrans_docnumber,'') != COALESCE(NEW.gltrans_docnumber,'')) ) THEN
      _updated := true;
    ELSIF( (OLD.gltrans_doctype IS NULL     AND NEW.gltrans_doctype IS NOT NULL)
        OR (OLD.gltrans_doctype IS NOT NULL AND NEW.gltrans_doctype IS NULL)
        OR (COALESCE(OLD.gltrans_doctype,'') != COALESCE(NEW.gltrans_doctype,'')) ) THEN
      _updated := true;
    END IF;

    IF(_updated) THEN
      RAISE EXCEPTION 'You may not alter some G/L Transaction fields once they have been created.';
    END IF;
  ELSE
    RAISE EXCEPTION 'trigger for gltrans table called in unexpected state.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'gltransAlterTrigger');
CREATE TRIGGER gltransAlterTrigger BEFORE UPDATE OR DELETE ON gltrans FOR EACH ROW EXECUTE PROCEDURE _gltransAlterTrigger();
