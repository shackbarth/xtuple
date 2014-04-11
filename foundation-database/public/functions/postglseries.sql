
CREATE OR REPLACE FUNCTION postGLSeries(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  _journalNumber INTEGER;
  _returnValue INTEGER;

BEGIN

  SELECT postGLSeries(pSequence, fetchJournalNumber('G/L')) INTO _returnValue;
  RETURN _returnValue;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postGLSeries(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  _returnValue INTEGER;

BEGIN

  SELECT postGLSeries(pSequence, pJournalNumber, true) INTO _returnValue;
  RETURN _returnValue;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postGLSeries(INTEGER, INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence 		ALIAS FOR $1;
  pJournalNumber 	ALIAS FOR $2;
  pPostZero		ALIAS FOR $3;
  _glseries RECORD;
  _transCount INTEGER := 0;
  _delta NUMERIC;
  _discrepDate DATE;
  _discrepAccntid INTEGER;
  _rows INTEGER;
BEGIN

/*  Make sure we don't create an imbalance across companies.
    The 'IgnoreCompanyBalance' metric is a back door mechanism to
    allow legacy users to create transactions accross companies if
    they have been using the company segment for something else
    and they MUST continue to be able to do so.  It can only be 
    implemented by direct sql update to the metric table and should 
    otherwise be discouraged.
*/ 
  IF (COALESCE(fetchMetricValue('GLCompanySize'),0) > 0 
    AND fetchMetricBool('IgnoreCompany') = false)  THEN

    SELECT count(accnt_company) INTO _rows
    FROM (
      SELECT DISTINCT accnt_company
      FROM accnt 
        JOIN glseries ON (glseries_accnt_id=accnt_id)
      WHERE (glseries_sequence=pSequence)) _data;
    
    IF (_rows > 1) THEN
      RAISE EXCEPTION 'G/L Series can not be posted because multiple companies are referenced in the same series.';
    END IF;
  END IF;
  
--  Make sure that we balance
  SELECT SUM(glseries_amount), MAX(glseries_distdate) INTO _delta, _discrepDate
    FROM glseries
   WHERE (glseries_sequence=pSequence);
  IF ( _delta <> 0 ) THEN
    IF (COALESCE(fetchMetricValue('GLCompanySize'),0) = 0) THEN
      SELECT accnt_id INTO _discrepAccntid
        FROM accnt, metric
       WHERE ((metric_name='GLSeriesDiscrepancyAccount')
         AND  (accnt_id=CAST(metric_value AS INTEGER)));
    ELSE
       SELECT company_dscrp_accnt_id INTO _discrepAccntid
        FROM company
          JOIN accnt ON (accnt_company=company_number) 
          JOIN glseries ON (glseries_accnt_id=accnt_id)
       WHERE (glseries_sequence=pSequence)
       LIMIT 1;
    END IF;

    IF (NOT FOUND) THEN
      RETURN -5;
    END IF;
    
    INSERT INTO glseries
           ( glseries_sequence, glseries_source, glseries_doctype, glseries_docnumber,
             glseries_accnt_id, glseries_amount, glseries_distdate, glseries_notes )
    SELECT glseries_sequence, glseries_source, glseries_doctype, glseries_docnumber,
             _discrepAccntid, (_delta * -1), _discrepDate, 'G/L Series Discrepancy'
      FROM glseries
     WHERE (glseries_sequence=pSequence)
     LIMIT 1;
  END IF;

--  March through the glseries members, posting them one at a time
  FOR _glseries IN SELECT glseries_source, glseries_doctype, glseries_docnumber,
                          glseries_accnt_id, glseries_distdate, glseries_notes,
                          glseries_misc_id,
                          SUM(glseries_amount) as amount
                     FROM glseries
                    WHERE ((glseries_amount<>0.0)
                      AND  (glseries_sequence=pSequence))
                    GROUP BY glseries_source, glseries_doctype, glseries_docnumber,
                             glseries_accnt_id, glseries_distdate, glseries_notes,
                             glseries_misc_id LOOP

-- refuse to accept postings into closed periods
    IF (SELECT BOOL_AND(COALESCE(period_closed, FALSE))
        FROM accnt LEFT OUTER JOIN
             period ON (_glseries.glseries_distdate BETWEEN period_start AND period_end)
        WHERE (accnt_id = _glseries.glseries_accnt_id)) THEN
      RAISE EXCEPTION 'Cannot post to closed period (%).', _glseries.glseries_distdate;
      RETURN -4;        -- remove raise exception when all callers check return code
    END IF;

-- refuse to accept postings into frozen periods without proper priv
    IF (SELECT NOT BOOL_AND(checkPrivilege('PostFrozenPeriod')) AND
               BOOL_AND(COALESCE(period_freeze, FALSE))
        FROM accnt LEFT OUTER JOIN
             period ON (_glseries.glseries_distdate BETWEEN period_start AND period_end)
        WHERE (accnt_id = _glseries.glseries_accnt_id)) THEN
      RAISE EXCEPTION 'Cannot post to frozen period (%).', _glseries.glseries_distdate;
      RETURN -4;        -- remove raise exception when all callers check return code
    END IF;

-- refuse to accept postings into nonexistent periods
    IF NOT EXISTS(SELECT period_id
                  FROM period
                  WHERE (_glseries.glseries_distdate BETWEEN period_start AND period_end)) THEN
      RAISE EXCEPTION 'Cannot post to nonexistent period (%).', pDistDate;
    END IF;

    IF (_glseries.amount != 0 OR pPostZero) THEN
      IF (fetchMetricBool('UseJournals')) THEN
       INSERT INTO sltrans
        ( sltrans_posted, sltrans_created, sltrans_date, sltrans_misc_id,
          sltrans_sequence, sltrans_accnt_id, sltrans_source, sltrans_notes,
          sltrans_doctype, sltrans_docnumber, sltrans_amount, sltrans_journalnumber )
        VALUES
        ( FALSE, CURRENT_TIMESTAMP, _glseries.glseries_distdate, _glseries.glseries_misc_id,
          pSequence, _glseries.glseries_accnt_id, _glseries.glseries_source, _glseries.glseries_notes,
          _glseries.glseries_doctype, _glseries.glseries_docnumber, _glseries.amount, pJournalNumber );      
      ELSE
       INSERT INTO gltrans
        ( gltrans_posted, gltrans_exported, gltrans_created, gltrans_date, gltrans_misc_id,
          gltrans_sequence, gltrans_accnt_id, gltrans_source, gltrans_notes,
          gltrans_doctype, gltrans_docnumber, gltrans_amount, gltrans_journalnumber )
        VALUES
        ( FALSE, FALSE, CURRENT_TIMESTAMP, _glseries.glseries_distdate, _glseries.glseries_misc_id,
          pSequence, _glseries.glseries_accnt_id, _glseries.glseries_source, _glseries.glseries_notes,
          _glseries.glseries_doctype, _glseries.glseries_docnumber, _glseries.amount, pJournalNumber );
      END IF;
      
      _transCount := _transCount + 1;
    END IF;
  END LOOP;

--  Delete all of the posted glseries members
  DELETE FROM glseries
  WHERE (glseries_sequence=pSequence);

  PERFORM postIntoTrialBalance(pSequence);

  RETURN _transCount;

END;
$$ LANGUAGE 'plpgsql';

