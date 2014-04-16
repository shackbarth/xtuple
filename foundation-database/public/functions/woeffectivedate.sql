CREATE OR REPLACE FUNCTION woEffectiveDate(DATE) RETURNS DATE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStartDate ALIAS FOR $1;

BEGIN

  IF (explodeWoEffective() = ''E'') THEN
    RETURN CURRENT_DATE;
  ELSE
    RETURN pStartDate;
  END IF;

END;
' LANGUAGE 'plpgsql';
