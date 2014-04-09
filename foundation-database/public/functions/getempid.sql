CREATE OR REPLACE FUNCTION getEmpId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pEmpCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (COALESCE(TRIM(pEmpCode), '''') = '''') THEN
    RETURN NULL;
  END IF;

  SELECT emp_id INTO _returnVal
  FROM emp
  WHERE (UPPER(emp_code)=UPPER(pEmpCode));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION ''Employee % not found.'', pEmpCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
