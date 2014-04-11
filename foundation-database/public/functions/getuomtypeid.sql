CREATE OR REPLACE FUNCTION getUomTypeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUomType ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pUomType IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT uomtype_id INTO _returnVal
  FROM uomtype
  WHERE (UPPER(uomtype_name)=UPPER(pUomType));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Unit of Measuer Type % not found.'', pUomType;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getUomTypeId(text[]) RETURNS INTEGER[] AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUomTypes ALIAS FOR $1;
  _returnVal INTEGER[];
  _val INTEGER;
  _i INTEGER;
BEGIN
  IF (pUomTypes IS NULL) OR (ARRAY_UPPER(pUomTypes,1) = 0) THEN
	RETURN NULL;
  END IF;

  FOR _i IN 1..ARRAY_UPPER(pUomTypes,1)
  LOOP
    SELECT uomtype_id INTO _val
    FROM uomtype
    WHERE (UPPER(uomtype_name)=UPPER(pUomTypes[_i]));

    IF (_val IS NULL) THEN
	RAISE EXCEPTION ''Unit of Measure Type % not found.'', pUomTypes[_i];
    ELSE
      _returnVal[_i] := _val;
    END IF;
  END LOOP;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
