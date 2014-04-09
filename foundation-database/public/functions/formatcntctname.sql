CREATE OR REPLACE FUNCTION formatCntctName(INTEGER) RETURNS TEXT AS $$ 
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntctId ALIAS FOR $1;
  _r RECORD;
  _rows NUMERIC;

BEGIN

  SELECT cntct_honorific, cntct_first_name, cntct_middle, 
    cntct_last_name, cntct_suffix INTO _r
  FROM cntct
  WHERE (cntct_id=pCntctId);

  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows = 0) THEN
    RETURN '';
  END IF;

  RETURN formatCntctName(_r.cntct_honorific, _r.cntct_first_name, _r.cntct_middle, _r.cntct_last_name, _r.cntct_suffix);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatCntctName(TEXT, TEXT, TEXT, TEXT, TEXT) RETURNS TEXT AS $$ 
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pHonorific ALIAS FOR $1;
  pFirstName ALIAS FOR $2;
  pMiddle ALIAS FOR $3;
  pLastName ALIAS FOR $4;
  pSuffix ALIAS FOR $5;
  _name TEXT := '';

BEGIN

  IF (LENGTH(TRIM(both from COALESCE(pHonorific,''))) > 0) THEN
    IF (POSITION('.' IN COALESCE(pHonorific, '')) > 0) THEN
      _name:= pHonorific;
    ELSE
      _name:= pHonorific || '.';
    END IF;
  END IF;

  IF (LENGTH(TRIM(both from COALESCE(pFirstName,''))) > 0)  THEN
        IF (LENGTH(TRIM(both from _name)) > 0) THEN
                _name:=_name || ' ';
        END IF;
    _name:=_name || pFirstName;
  END IF;

  IF (LENGTH(TRIM(both from COALESCE(pMiddle,''))) > 0)  THEN
        IF (LENGTH(TRIM(both from _name)) > 0) THEN
                _name:=_name || ' ';
        END IF;
    IF (POSITION('.' IN COALESCE(pHonorific, '')) > 0) THEN
      _name:=_name || pMiddle;
    ELSE
      _name:=_name || pMiddle || '.';
    END IF;
  END IF;

  IF (LENGTH(TRIM(both from COALESCE(pLastName,''))) > 0)  THEN
        IF (LENGTH(TRIM(both from _name)) > 0) THEN
                _name:=_name || ' ';
        END IF;
    _name:=_name || pLastName;
  END IF;

  IF (LENGTH(TRIM(both from COALESCE(pSuffix,''))) > 0)  THEN
        IF (LENGTH(TRIM(both from _name)) > 0) THEN
                _name:=_name || ' ';
        END IF;
    _name:=_name || pSuffix;
  END IF;

  RETURN _name;

END;
$$ LANGUAGE 'plpgsql';

