CREATE OR REPLACE FUNCTION getCustNameFromInfo(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _email	TEXT	:= COALESCE(UPPER($1), '''');
  _company	TEXT	:= COALESCE(UPPER($2), '''');
  _first	TEXT	:= COALESCE(UPPER($3), '''');
  _last		TEXT	:= COALESCE(UPPER($4), '''');
  _fullname	TEXT	:= COALESCE(UPPER($5), '''');
  _generate	BOOLEAN	:= COALESCE($6, FALSE);
  _counter	INTEGER;
  _custcount	INTEGER	:= 0;
  _custname	TEXT;
  _candidate	RECORD;
  _r		RECORD;
BEGIN
  IF (_email != '''') THEN
    SELECT count(*), cust_name INTO _custcount, _custname
    FROM custinfo LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
    WHERE (UPPER(cntct_email)=_email)
    GROUP BY cust_name;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custname;
    END IF;
  END IF;

  IF (_company != '''') THEN
    SELECT count(*), cust_name INTO _custcount, _custname
    FROM custinfo
    WHERE (UPPER(cust_name)=_company)
    GROUP BY cust_name;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custname;
    END IF;
  END IF;

  IF (_fullname = '''' AND (_first != '''' OR _last != '''')) THEN
    _fullname := TRIM(_first || '' '' || _last);
  END IF;

  IF (_custcount <= 0 AND _fullname != '''') THEN
    SELECT count(*), cust_name INTO _custcount, _custname
    FROM custinfo
    WHERE (UPPER(cust_name)=_fullname)
    GROUP BY cust_name;
    IF (NOT FOUND) THEN
      _custcount := 0;
    ELSIF(_custcount = 1) THEN
      RETURN _custname;
    END IF;
  END IF;

  IF (_custcount > 1) THEN
    RAISE EXCEPTION ''Found % possible Customers for % and % and %'',
		    _custcount, _email, _company, _fullname;
  END IF;

  IF (_custcount <= 0 AND _generate) THEN
    IF (_company != '''') THEN
      RETURN _company;
    ELSIF (_email != '''') THEN
      RETURN _email;
    ELSIF (_fullname != '''') THEN
      RETURN _fullname;
    ELSE
      RAISE EXCEPTION ''Could not generate a new Customer Name without an email address or the name of a company or person'';
    END IF;
  END IF;

  IF (_custname IS NULL OR _custname = '''') THEN
    RAISE EXCEPTION ''Could not find Customer Name for % and %'',
		    _company, _fullname;
  END IF;

  RETURN _custname;
END;
' LANGUAGE 'plpgsql';
