
CREATE OR REPLACE FUNCTION getGlAccntId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pGlAccnt ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pGlAccnt IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT accnt_id INTO _returnVal
  FROM accnt
  WHERE (formatglaccount(accnt_id)=pGlAccnt);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Account Number % not found.', pGlAccnt;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getglaccntid(TEXT,TEXT,TEXT,TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCompany ALIAS FOR $1;
  pProfit ALIAS FOR $2;
  pGlAccnt ALIAS FOR $3;
  pSub ALIAS FOR $4;
  _account TEXT;
  _returnVal INTEGER;
BEGIN
  IF (pGlAccnt IS NULL) THEN
	RETURN NULL;
  END IF;

  IF (pCompany is not null) THEN
    _account := pCompany || '-';
  END IF;

  IF (pProfit is not null) THEN
    _account := _account || pProfit || '-';
  END IF;
  IF (pGlAccnt is not null) THEN
    if (_account is null) then
	_account := pGlAccnt;
    else
	_account := _account || pGlAccnt;
    end if;
  END IF;

  IF (pSub is not null) THEN
    _account := _account || '-' || pSub;
  END IF;

  SELECT accnt_id INTO _returnVal
  FROM accnt
  WHERE (formatglaccount(accnt_id)=_account);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Account Number % not found.', _account;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

