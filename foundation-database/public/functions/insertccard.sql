CREATE OR REPLACE FUNCTION insertccard(text,boolean,text,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,text) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustomer ALIAS FOR $1;
  pActive ALIAS FOR $2;
  pType ALIAS FOR $3;
  pNumber ALIAS FOR $4;
  pName ALIAS FOR $5;
  pAddr1 ALIAS FOR $6;
  pAddr2 ALIAS FOR $7;
  pCity ALIAS FOR $8;
  pState ALIAS FOR $9;
  pPostal ALIAS FOR $10;
  pCountry ALIAS FOR $11;
  pMonth ALIAS FOR $12;
  pYear ALIAS FOR $13;
  pKey ALIAS FOR $14;
  _type CHAR;
  _number TEXT;
  _month INTEGER;
  _year INTEGER;
  _result INTEGER;

BEGIN
  --Initialize
  _number = CAST(encode(pNumber, 'escape') AS text);
  _month = CAST(encode(pMonth, 'escape') AS integer);
  _year = CAST(encode(pYear, 'escape') AS integer);

  -- Check Card holder info
  IF (pName IS NULL) THEN
      RAISE EXCEPTION 'The name of the card holder must be entered';
  END IF;
  IF (pAddr1 IS NULL OR pAddr1 = '') THEN
      RAISE EXCEPTION 'The first address line must be entered';
  END IF;
  IF (pCity IS NULL OR pCity = '') THEN
      RAISE EXCEPTION 'The city must be entered';
  END IF;
  IF (pState IS NULL OR pState = '') THEN
      RAISE EXCEPTION 'The state must be entered';
  END IF;
  IF (pPostal IS NULL OR pPostal = '') THEN
      RAISE EXCEPTION 'The zip code must be entered';
  END IF;
  IF (pCountry IS NULL OR pCountry = '') THEN
      RAISE EXCEPTION 'The country must be entered';
  END IF;
  IF (pMonth IS NULL OR pMonth = '') THEN
      RAISE EXCEPTION 'The Expiration Month must be entered';
  END IF;
  IF (_month < 1 OR _month > 12) THEN
      RAISE EXCEPTION 'Valid Expiration Months are 01 through 12';
  END IF;
  IF (LENGTH(_year::text) <> 4) THEN
      RAISE EXCEPTION 'Valid Expiration Years are CCYY in format';
  END IF;
  IF (_year < 1970 OR _year > 2100) THEN
      RAISE EXCEPTION 'Valid Expiration Years are 1970 through 2100';
  END IF;
  
  -- Check Number Length
  IF ((NOT _number ~  '[0-9]{13,16}') OR (LENGTH(_number) = 14) OR (LENGTH(_number) > 16)) THEN
    RAISE EXCEPTION 'The credit card number must be all numeric (no spaces or hyphens) and must be 13, 15 or 16 characters in length';
  END IF;
 
  -- Convert Type
  IF (pType = 'Visa') THEN
    _type  = 'V';
  ELSE
    IF (pType = 'Master Card') THEN
      _type  = 'M';
    ELSE
      IF (pType = 'American Express') THEN
        _type  = 'A';
      ELSE
        IF (pType = 'Discover') THEN
          _type  = 'D';
        ELSE
          RAISE EXCEPTION 'You must select Master Card, Visa, American 
                            Express or Discover as the credit card type.';
        END IF;
      END IF;
    END IF;
  END IF;
  
  -- Check Card Specific Data
  SELECT editccnumber(_number, _type) INTO _result;

  IF (_result = -1) THEN
    RAISE EXCEPTION 'You must select Master Card, Visa, American 
                      Express or Discover as the credit card type.';
  END IF;
  IF (_result = -2) THEN
    RAISE EXCEPTION 'The length of a Master Card credit card number
                      has to be 16 digits.';
  END IF;
  IF (_result = -3) THEN
    RAISE EXCEPTION 'The length of a Visa credit card number
                      has to be either 13 or 16 digits.';
  END IF;
  IF (_result = -4) THEN
    RAISE EXCEPTION 'The length of an American Express credit card
                      number has to be 15 digits.';
  END IF;
  IF (_result = -5) THEN
    RAISE EXCEPTION 'The length of a Discover credit card number 
                      has to be 16 digits.';
  END IF;
   IF (_result = -6) THEN
    RAISE EXCEPTION 'The first two digits for a valid Master Card
                      number must be between 51 and 55';
  END IF;
  IF (_result = -7) THEN
    RAISE EXCEPTION 'The first digit for a valid Visa number must
                      be 4';
  END IF;
   IF (_result = -8) THEN
    RAISE EXCEPTION 'The first two digits for a valid American
                      Express number must be 34 or 37.';
  END IF;
  IF (_result = -9) THEN
    RAISE EXCEPTION 'The first four digits for a valid Discover
                      Express number must be 6011.';
  END IF;
  IF ((_result = -10) AND NOT fetchmetricbool('CCTest')) THEN
    RAISE EXCEPTION 'The credit card number that you have provided
                      is not valid.';
  END IF;
  IF (_result < -10) THEN
    RAISE EXCEPTION 'Invalid Credit Card Information';
  END IF;

  -- Insert Record

  INSERT INTO ccard ( 
    ccard_seq, 
    ccard_cust_id,
    ccard_active, 
    ccard_name, 
    ccard_address1,
    ccard_address2,
    ccard_city, 
    ccard_state, 
    ccard_zip,
    ccard_country, 
    ccard_number,
    ccard_month_expired, 
    ccard_year_expired, 
    ccard_type)
    VALUES 
    ((SELECT COALESCE(MAX(ccard_seq), 0) + 10
      FROM ccard 
      WHERE (ccard_cust_id =getCustId(pCustomer))),
     getCustId(pCustomer),
     COALESCE(pActive),
     encrypt(setbytea(pName), setbytea(pKey), 'bf'),
     encrypt(setbytea(pAddr1), setbytea(pKey), 'bf'),
     encrypt(setbytea(pAddr2), setbytea(pKey), 'bf'),
     encrypt(setbytea(pCity), setbytea(pKey), 'bf'),
     encrypt(setbytea(pState), setbytea(pKey), 'bf'),
     encrypt(setbytea(pPostal), setbytea(pKey), 'bf'),
     encrypt(setbytea(pCountry), setbytea(pKey), 'bf'),
     encrypt(setbytea(pNumber), setbytea(pKey), 'bf'),
     encrypt(setbytea(pMonth), setbytea(pKey), 'bf'),
     encrypt(setbytea(pYear), setbytea(pKey), 'bf'),
     _type );

  RETURN true;
END;
$$ LANGUAGE 'plpgsql';
COMMENT ON FUNCTION insertccard(text,boolean,text,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,bytea,text)  IS 'This function is generally used to support the _custcreditcard API view';

