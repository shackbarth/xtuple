CREATE OR REPLACE FUNCTION deleteTaxType(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxtypeid ALIAS FOR $1;
  _result INTEGER;
BEGIN

  SELECT taxtype_id
    INTO _result
    FROM taxtype
   WHERE ((taxtype_sys)
     AND  (taxtype_id=pTaxtypeid));
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  SELECT taxass_id
    INTO _result
    FROM taxass
   WHERE (taxass_taxtype_id=pTaxtypeid);
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  SELECT taxhist_id
    INTO _result
    FROM taxhist
   WHERE (taxhist_taxtype_id=pTaxtypeid);
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  DELETE
    FROM taxtype
   WHERE (taxtype_id=pTaxtypeid);

  RETURN pTaxtypeid;

END;
' LANGUAGE 'plpgsql';
