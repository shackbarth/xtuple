CREATE OR REPLACE FUNCTION determineDueDate(INTEGER, DATE) RETURNS DATE STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTermsid ALIAS FOR $1;
  pSourceDate ALIAS FOR $2;
  _dueDate DATE;
  _p RECORD;

BEGIN

  SELECT terms_type, terms_duedays, terms_cutoffday INTO _p
  FROM terms
  WHERE (terms_id=pTermsid);
  IF (NOT FOUND) THEN
    _dueDate := pSourceDate;

--  Handle type D terms
  ELSIF (_p.terms_type = 'D') THEN
    _dueDate := (pSourceDate + _p.terms_duedays);

--  Handle type P terms
  ELSIF (_p.terms_type = 'P') THEN
    IF (date_part('day', pSourceDate) <= _p.terms_cutoffday) THEN
      _dueDate := (DATE(date_trunc('month', pSourceDate)) + (_p.terms_duedays - 1));
    ELSE
      _dueDate := (DATE(date_trunc('month', pSourceDate)) + (_p.terms_duedays - 1) + INTERVAL '1 month');
    END IF;

--  Handle unknown terms
  ELSE
    _dueDate := pSourceDate;
  END IF;

  RETURN _dueDate;

END;
$$ LANGUAGE 'plpgsql';
