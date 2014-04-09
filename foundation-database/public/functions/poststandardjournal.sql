
CREATE OR REPLACE FUNCTION postStandardJournal(INTEGER, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  _returnValue INTEGER;

BEGIN

  SELECT postStandardJournal(pStdjrnlid, pDate, FALSE, fetchGLSequence()) INTO _returnValue;

  RETURN _returnValue;

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postStandardJournal(INTEGER, DATE, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pReverse ALIAS FOR $3;
  _returnValue INTEGER;

BEGIN

  RETURN postStandardJournal(pStdjrnlid, pDate, pReverse, fetchGLSequence());

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postStandardJournal(INTEGER, DATE, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pGlSequence ALIAS FOR $3;

BEGIN

  RETURN postStandardJournal(pStdjrnlid, pDate, FALSE, pGLSequence);

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postStandardJournal(INTEGER, DATE, BOOLEAN, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pReverse ALIAS FOR $3;
  pGlSequence ALIAS FOR $4;

BEGIN

  INSERT INTO glseries
  ( glseries_sequence, glseries_source, glseries_doctype, glseries_docnumber,
    glseries_notes, glseries_accnt_id, glseries_amount, glseries_distdate )
  SELECT pGlSequence, ''G/L'', ''ST'', stdjrnl_name,
         stdjrnlitem_notes, stdjrnlitem_accnt_id,
         CASE WHEN (pReverse=TRUE) THEN (stdjrnlitem_amount * -1)
              ELSE stdjrnlitem_amount
         END,
         pDate
  FROM stdjrnlitem, stdjrnl
  WHERE ( (stdjrnlitem_stdjrnl_id=stdjrnl_id)
   AND (stdjrnl_id=pStdjrnlid) );

  RETURN pGlSequence;

END;
' LANGUAGE 'plpgsql';

