
CREATE OR REPLACE FUNCTION copyGLSeries(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  _sequence INTEGER := fetchGLSequence();
  _journal INTEGER;	

BEGIN

  SELECT gltrans_journalnumber INTO _journal
  FROM gltrans
  WHERE ( gltrans_sequence=pSequence )
  LIMIT 1;

  IF (FOUND) THEN
    INSERT INTO glseries
    ( glseries_sequence, glseries_source, glseries_doctype, glseries_docnumber,
      glseries_notes, glseries_accnt_id, glseries_amount, glseries_distdate )
    SELECT _sequence, gltrans_source, gltrans_doctype, gltrans_docnumber,
           gltrans_notes, gltrans_accnt_id,
           gltrans_amount, gltrans_date
    FROM gltrans
    WHERE ( gltrans_sequence=pSequence );
  ELSE
    RAISE EXCEPTION 'g/l transaction sequence not found';
  END IF;

  RETURN _sequence;
END;
$$ LANGUAGE 'plpgsql';

