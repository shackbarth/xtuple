
CREATE OR REPLACE FUNCTION getShipToNumberFromInfo(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _custname TEXT := COALESCE(TRIM(UPPER( $1)), '');
  _email TEXT 	 := COALESCE(TRIM(UPPER( $2)), '');
  _company TEXT  := COALESCE(TRIM(UPPER( $3)), '');
  _first TEXT 	 := COALESCE(TRIM(UPPER( $4)), '');
  _last TEXT 	 := COALESCE(TRIM(UPPER( $5)), '');
  _fullname TEXT := COALESCE(TRIM(UPPER( $6)), '');
  _addr1 TEXT 	 := COALESCE(TRIM(UPPER( $7)), '');
  _addr2 TEXT 	 := COALESCE(TRIM(UPPER( $8)), '');
  _addr3 TEXT 	 := COALESCE(TRIM(UPPER( $9)), '');
  _city TEXT 	 := COALESCE(TRIM(UPPER($10)), '');
  _state TEXT 	 := COALESCE(TRIM(UPPER($11)), '');
  _postalcode TEXT := COALESCE(TRIM(UPPER($12)), '');
  _country TEXT  := COALESCE(TRIM(UPPER($13)), '');
  _generate BOOLEAN := COALESCE($14, FALSE);
  _create BOOLEAN := COALESCE($15, FALSE);

  _citytrunc TEXT;
  _counter INTEGER;
  _custid INTEGER;
  _custnumber TEXT;
  _candidate TEXT;
  _r RECORD;
  _statetrunc TEXT;
BEGIN
  IF (_custname = '') THEN
    _custname := getCustNameFromInfo(_email, _company, _first, _last,
                     _fullname, FALSE);
  END IF;


  SELECT COUNT(*) INTO _counter
  FROM custinfo, shiptoinfo, addr
  WHERE ((UPPER(cust_name)=UPPER(_custname))
    AND UPPER(shipto_name)=UPPER(_fullname)
    AND (cust_id=shipto_cust_id)
    AND (shipto_addr_id=addr_id));

  IF (_counter = 1) THEN
    SELECT shipto_num INTO _candidate
    FROM custinfo, shiptoinfo, addr
    WHERE ((UPPER(cust_name)=UPPER(_custname))
      AND UPPER(shipto_name)=UPPER(_fullname)
      AND (cust_id=shipto_cust_id)
      AND (shipto_addr_id=addr_id));

    RETURN _candidate;

  ELSE

    SELECT COUNT(*) INTO _counter
    FROM custinfo, shiptoinfo, addr
    WHERE ((UPPER(cust_name)=UPPER(_custname))
      AND (cust_id=shipto_cust_id)
      AND (shipto_addr_id=addr_id));

    IF (_counter = 1) THEN
      SELECT shipto_num INTO _candidate
      FROM custinfo, shiptoinfo, addr
      WHERE ((UPPER(cust_name)=UPPER(_custname))
        AND (cust_id=shipto_cust_id)
        AND (shipto_addr_id=addr_id));

      RETURN _candidate;

    ELSIF (_counter > 1) THEN
      SELECT shipto_num,
         CASE WHEN (UPPER(addr_country) = _country) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_postalcode) = _postalcode) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_state) = _state) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_city) = _city) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_line3) = _addr3) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_line2) = _addr2) THEN 1 ELSE 0 END +
         CASE WHEN (UPPER(addr_line1) = _addr1) THEN 1 ELSE 0 END
         AS maxquotient INTO _candidate, _counter
      FROM custinfo, shiptoinfo, addr
      WHERE ((UPPER(cust_name)=_custname)
        AND (cust_id=shipto_cust_id)
        AND (shipto_addr_id=addr_id))
      ORDER BY maxquotient desc
      LIMIT 1;

      RETURN _candidate;
    END IF;
  END IF;

  IF (_generate) THEN
    SELECT cust_number, cust_id INTO _custnumber, _custid
    FROM custinfo
    WHERE (UPPER(cust_name)=_custname);

    -- keep the number short
    _citytrunc := SUBSTRING(_city FOR 5);
    _statetrunc := SUBSTRING(_state FOR 5);

    IF (LENGTH(_citytrunc) > 0 AND NOT EXISTS(SELECT UPPER(shipto_num)
              FROM shiptoinfo
              WHERE ((shipto_cust_id=_custid)
                AND (UPPER(shipto_num)=_citytrunc)) )) THEN
      _candidate := _citytrunc;
    ELSIF (LENGTH(_last || _citytrunc) > 0 AND NOT EXISTS(SELECT UPPER(shipto_num)
              FROM shiptoinfo
              WHERE ((shipto_cust_id=_custid)
                AND (UPPER(shipto_num)=_last || _citytrunc)) )) THEN
      _candidate := _last || _citytrunc;
    ELSIF (LENGTH(_statetrunc) > 0 AND NOT EXISTS(SELECT UPPER(shipto_num)
           FROM shiptoinfo
           WHERE ((shipto_cust_id=_custid)
             AND (UPPER(shipto_num)=_statetrunc)) )) THEN
      _candidate := _statetrunc;
    ELSIF (LENGTH(_last || _statetrunc) > 0 AND NOT EXISTS(SELECT UPPER(shipto_num)
           FROM shiptoinfo
           WHERE ((shipto_cust_id=_custid)
             AND (UPPER(shipto_num)=_last || _statetrunc)) )) THEN
      _candidate := _last || _statetrunc;

    ELSIF (LENGTH(_citytrunc || _statetrunc) > 0 AND NOT EXISTS(SELECT UPPER(shipto_num)
              FROM shiptoinfo
              WHERE ((shipto_cust_id=_custid)
                AND (UPPER(shipto_num)=_citytrunc || _statetrunc)) )) THEN
      _candidate := _citytrunc || _statetrunc;

    ELSE
      SELECT CAST(COALESCE(MAX(CAST(shipto_num AS INTEGER)), 0) + 1 AS TEXT)
      INTO _candidate
      FROM shiptoinfo
      WHERE ((shipto_cust_id=_custid)
       AND (shipto_num~'^[0-9]*$'));
    END IF;

    IF (_create) THEN
      INSERT INTO api.custshipto (
    customer_number, shipto_number, name,
    address1, address2, address3,
    city, state, postal_code, country, address_change,
    first, last, email,
    edi_profile
      ) VALUES (
    _custnumber, _candidate, _candidate,
    _addr1, _addr2, _addr3,
    _city, _state, _postalcode, _country, 'CHANGEONE',
    _first, _last, LOWER(_email),
    'No EDI'
      );
    END IF;

    RETURN _candidate;
  END IF;

  RETURN '';
END;
$$ LANGUAGE 'plpgsql';
