
CREATE OR REPLACE FUNCTION insertIntoGLSeries(INTEGER, TEXT, TEXT, TEXT, INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pAccntid ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  _returnValue INTEGER;

BEGIN

  SELECT insertIntoGLSeries( pSequence, pSource, pDocType, pDocNumber,
                             pAccntid, pAmount, CURRENT_DATE, '' ) INTO _returnValue;

  RETURN _returnValue;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertIntoGLSeries(INTEGER, TEXT, TEXT, TEXT, INTEGER, NUMERIC, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pAccntid ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pDistDate ALIAS FOR $7;
  _returnValue INTEGER;

BEGIN

  SELECT insertIntoGLSeries( pSequence, pSource, pDocType, pDocNumber,
                             pAccntid, pAmount, pDistDate, '' ) INTO _returnValue;

  RETURN _returnValue;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertIntoGLSeries(INTEGER, TEXT, TEXT, TEXT, INTEGER, NUMERIC, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pAccntid ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pDistDate ALIAS FOR $7;
  pNotes ALIAS FOR $8;
  _returnValue INTEGER;

BEGIN

  SELECT insertIntoGLSeries( pSequence, pSource, pDocType, pDocNumber,
                             pAccntid, pAmount, pDistDate, pNotes, NULL ) INTO _returnValue;

  RETURN _returnValue;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertIntoGLSeries(INTEGER, TEXT, TEXT, TEXT, INTEGER, NUMERIC, DATE, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pAccntid ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pDistDate ALIAS FOR $7;
  pNotes ALIAS FOR $8;
  pMiscid ALIAS FOR $9;
  _glseriesid INTEGER;

BEGIN

--  Check GL Interface metric
  IF (fetchMetricBool('InterfaceToGL') = false AND pSource IN ('I/M', 'P/D', 'S/R', 'W/O')) THEN
    RETURN 0;
  END IF;
  IF (fetchMetricBool('InterfaceAPToGL') = false AND pSource = 'A/P') THEN
    RETURN 0;
  END IF;
  IF (fetchMetricBool('InterfaceARToGL') = false AND pSource IN ('A/R', 'S/O', 'S/R')) THEN
    RETURN 0;
  END IF;

--  Verify the target accnt
  IF ( (pAccntid IS NULL) OR (pAccntid = -1) ) THEN
    RETURN -1;
  END IF;

-- refuse to accept postings into closed periods
  IF (SELECT BOOL_AND(COALESCE(period_closed, FALSE))
      FROM accnt LEFT OUTER JOIN
           period ON (pDistDate BETWEEN period_start AND period_end)
      WHERE (accnt_id = pAccntid)) THEN
    RAISE EXCEPTION 'Cannot post to closed period (%).', pDistDate;
    RETURN -4;  -- remove raise exception when all callers check return code
  END IF;

-- refuse to accept postings into frozen periods without proper priv
  IF (SELECT NOT BOOL_AND(checkPrivilege('PostFrozenPeriod')) AND
             BOOL_AND(COALESCE(period_freeze, FALSE))
      FROM accnt LEFT OUTER JOIN
           period ON (pDistDate BETWEEN period_start AND period_end)
      WHERE (accnt_id = pAccntid)) THEN
    RAISE EXCEPTION 'Cannot post to frozen period (%).', pDistDate;
    RETURN -4;  -- remove raise exception when all callers check return code
  END IF;

-- refuse to accept postings into nonexistent periods
  IF NOT EXISTS(SELECT period_id
                FROM period
                WHERE (pDistDate BETWEEN period_start AND period_end)) THEN
    RAISE EXCEPTION 'Cannot post to nonexistent period (%).', pDistDate;
  END IF;

-- Insert into the glseries
  SELECT NEXTVAL('glseries_glseries_id_seq') INTO _glseriesid;
  INSERT INTO glseries
  ( glseries_id, glseries_sequence, glseries_source, glseries_doctype, glseries_docnumber,
    glseries_accnt_id, glseries_amount, glseries_distdate, glseries_notes, glseries_misc_id )
  VALUES
  ( _glseriesid, pSequence, pSource, pDocType, pDocNumber,
    pAccntid, pAmount, pDistDate, pNotes, pMiscid );

  RETURN _glseriesid;

END;
$$ LANGUAGE 'plpgsql';

