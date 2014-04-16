CREATE OR REPLACE FUNCTION api.getCustNumberFromInfo(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _email	TEXT	:= COALESCE(UPPER($1), '');
  _company	TEXT	:= COALESCE(UPPER($2), '');
  _first	TEXT	:= COALESCE(UPPER($3), '');
  _last		TEXT	:= COALESCE(UPPER($4), '');
  _fullname	TEXT	:= COALESCE(UPPER($5), TRIM(_first || ' ' || _last));
  _generate	BOOLEAN	:= COALESCE($6, FALSE);
  _counter	INTEGER;
  _custcount	INTEGER	:= 0;
  _custnumber	TEXT;
  _candidate	TEXT	:= '';
  _loopmax	INTEGER := 0;
  _minlength	INTEGER := 5;
  _maxlength	INTEGER := 8;
  _numformat	TEXT	:= '';
  _testme	TEXT;
BEGIN
  IF (_email != '') THEN
    SELECT count(*), cust_number INTO _custcount, _custnumber
    FROM custinfo LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
    WHERE (UPPER(cntct_email)=_email)
    GROUP BY cust_number;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custnumber;
    END IF;
  END IF;

  IF (_company != '') THEN
    SELECT count(*), cust_number INTO _custcount, _custnumber
    FROM custinfo
    WHERE (UPPER(cust_name)=_company)
    GROUP BY cust_number;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custnumber;
    END IF;
  END IF;

  IF (_fullname = '' AND (_first != '' OR _last != '')) THEN
    _fullname := TRIM(_first || ' ' || _last);
  END IF;

  IF (_custcount <= 0 AND _fullname != '') THEN
    SELECT count(*), cust_number INTO _custcount, _custnumber
    FROM custinfo
    WHERE (UPPER(cust_name)=_fullname)
    GROUP BY cust_number;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custnumber;
    END IF;
  END IF;

  IF (_custcount > 1) THEN
    RAISE EXCEPTION 'Found % possible Customers for % and % and %',
		    _custcount, _email, _company, _fullname;
  END IF;

  IF (_custcount <= 0 AND _generate) THEN
    IF (_maxlength < _minlength) THEN
      RAISE EXCEPTION 'Fix getCustNumberFromInfo: max length < min length';
    END IF;

    IF (_company != '') THEN
      _candidate := _company;
    ELSIF (_email != '') THEN
      _candidate := SUBSTRING(_email FOR POSITION('@' IN _email) - 1);
    ELSIF (_last != '') THEN
      _candidate := _last;
      IF (_first != '') THEN
	_candidate := _candidate || _first;
      END IF;
    ELSIF (_fullname != '' AND (POSITION(' ' IN _fullname) > 0)) THEN
      _candidate := SUBSTRING(_fullname FROM POSITION(' ' IN _fullname) + 1) ||
		    SUBSTRING(_fullname FOR  POSITION(' ' IN _fullname) - 1);
    END IF;
    WHILE (POSITION(' ' IN _candidate) > 0) LOOP
      _candidate := SUBSTRING(_candidate FOR  POSITION(' ' IN _candidate) - 1) ||
		    SUBSTRING(_candidate FROM POSITION(' ' IN _candidate) + 1);
    END LOOP;
    FOR _counter IN _minlength.._maxlength LOOP
      _testme := SUBSTRING(_candidate FOR _counter);
      IF (NOT EXISTS(SELECT cust_number
		     FROM custinfo
		     WHERE (cust_number=_testme))) THEN
	_custnumber := _testme;
	EXIT;
      END IF;
    END LOOP;
    IF (_custnumber IS NULL OR _custnumber = '') THEN
      IF (LENGTH(_candidate) < _minlength) THEN
	_minlength := LENGTH(_candidate);
      END IF;
      FOR _counter IN _minlength.._maxlength LOOP
	_loopmax := _loopmax * 10 + 9;
	_numformat := _numformat || '0';
      END LOOP;
      FOR _counter IN 1.._loopmax LOOP
	_testme := SUBSTRING(_candidate FOR _minlength) ||
		   TRIM(TO_CHAR(_counter, _numformat));
	IF (NOT EXISTS(SELECT cust_number
		       FROM custinfo
		       WHERE (cust_number=_testme))) THEN
	  _custnumber := _testme;
	  EXIT;
	END IF;
      END LOOP;
    END IF;
    IF (_custnumber IS NULL OR _custnumber = '') THEN
      RAISE EXCEPTION 'Could not generate a new Customer Number';
    END IF;
  END IF;

  IF (_custnumber IS NULL OR _custnumber = '') THEN
    RAISE EXCEPTION 'Could not find Customer Number for % and % and %',
		    _email, _company, _fullname;
  END IF;

  RETURN _custnumber;
END;
$$ LANGUAGE 'plpgsql';
