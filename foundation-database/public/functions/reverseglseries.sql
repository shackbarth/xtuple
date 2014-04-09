
CREATE OR REPLACE FUNCTION reverseGLSeries(INTEGER, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pDistDate ALIAS FOR $2;
  pNotes ALIAS FOR $3;
  _sequence INTEGER := fetchGLSequence();	
  _journal INTEGER;

BEGIN

  IF (SELECT COUNT(gltrans_sequence) > 0 FROM gltrans WHERE gltrans_sequence = pSequence) THEN
    SELECT fetchJournalNumber(jrnluse_use) INTO _journal
    FROM gltrans
      JOIN jrnluse ON (gltrans_journalnumber=jrnluse_number)
    WHERE (gltrans_sequence=pSequence)
    LIMIT 1;
  
    INSERT INTO gltrans (gltrans_created, gltrans_posted, gltrans_exported,
                         gltrans_date, gltrans_sequence, gltrans_accnt_id,
                         gltrans_source, gltrans_docnumber, gltrans_misc_id,
                         gltrans_amount, gltrans_notes, gltrans_journalnumber,
                         gltrans_doctype)
                 SELECT  CURRENT_TIMESTAMP, FALSE, FALSE,
                         pDistDate, _sequence, gltrans_accnt_id,
                         gltrans_source, gltrans_docnumber, gltrans_misc_id,
                         (gltrans_amount * -1), pNotes, _journal,
                         gltrans_doctype
                    FROM gltrans
                   WHERE (gltrans_sequence=pSequence);

    PERFORM postIntoTrialBalance(_sequence);
  ELSE
    SELECT fetchJournalNumber(jrnluse_use) INTO _journal
    FROM sltrans
      JOIN jrnluse ON (sltrans_journalnumber=jrnluse_number)
    WHERE (sltrans_sequence=pSequence)
    LIMIT 1;
    
    INSERT INTO sltrans (sltrans_created, sltrans_posted,
                         sltrans_date, sltrans_sequence, sltrans_accnt_id,
                         sltrans_source, sltrans_docnumber, sltrans_misc_id,
                         sltrans_amount, sltrans_notes, sltrans_journalnumber,
                         sltrans_doctype)
                 SELECT  CURRENT_TIMESTAMP, FALSE,
                         pDistDate, _sequence, sltrans_accnt_id,
                         sltrans_source, sltrans_docnumber, sltrans_misc_id,
                         (sltrans_amount * -1), pNotes, _journal,
                         sltrans_doctype
                    FROM sltrans
                   WHERE (sltrans_sequence=pSequence);
  END IF;

  RETURN _journal;
END;
$$ LANGUAGE 'plpgsql';

