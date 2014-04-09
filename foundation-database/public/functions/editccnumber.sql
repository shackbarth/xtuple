CREATE OR REPLACE FUNCTION editccnumber(text, text)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCcardnum ALIAS FOR $1;
  pCcardtype ALIAS FOR $2;
  card_length INTEGER;
  card_valid boolean := false;
  starting_digits TEXT;
  _sum INTEGER := 0;
  _digit INTEGER := 0;
  _timesTwo BOOLEAN := false;
BEGIN

-- Check the card type
  IF (pCcardtype NOT IN (''M'', ''V'', ''A'', ''D'')) THEN
-- Unknown Card Type
   RETURN -1;
  END IF;

  card_length := length(pCcardnum);

-- Process Master Card Checking length
-- Process Master Card Starting digits
  IF (pCcardtype = ''M'') THEN
    IF (card_length != 16) THEN
-- Bad Card Length Card Type
      RETURN -2;
    END IF;
    starting_digits := substr(pCcardnum, 1, 2);
    IF (starting_digits < ''51'' OR starting_digits > ''55'') THEN
-- Bad Starting digits
      RETURN -6;
    END IF;
  END IF;

-- Process Visa Card Checking length
-- Process Visa Card Starting digits
  IF (pCcardtype = ''V'') THEN
    IF (card_length != 13 AND card_length != 16) THEN
-- Bad Card Length Card Type
      RETURN -3;
    END IF;
    starting_digits := substr(pCcardnum, 1, 1);
    IF (starting_digits != ''4'') THEN
-- Bad Starting digits
      RETURN -7;
    END IF;
  END IF;

-- Process American Express Card Checking length
-- Process American Express Card Starting digits
  IF (pCcardtype = ''A'') THEN
    IF (card_length != 15) THEN
-- Bad Card Length Card Type
      RETURN -4;
    END IF;
    starting_digits := substr(pCcardnum, 1, 2);
    IF (starting_digits != ''34'' AND starting_digits != ''37'') THEN
-- Bad Starting digits
      RETURN -8;
    END IF;
  END IF;

-- Process Discover Card Checking length
-- Process Discover Card Starting digits
  IF (pCcardtype = ''D'') THEN
    IF (card_length != 16) THEN
-- Bad Card Length Card Type
      RETURN -5;
    END IF;
    starting_digits := substr(pCcardnum, 1, 4);
    IF (starting_digits != ''6011'') THEN
-- Bad Starting digits
      RETURN -9;
    END IF;
  END IF;

-- Now comes the fun part of doing the "check" for the check sum
-- perform a luhn checksum
  FOR i IN REVERSE card_length .. 1 LOOP
    _digit := int4(substr(pCcardnum, i, 1));
    IF (_timesTwo) THEN
      _digit := _digit * 2;
      IF (_digit > 9) THEN
        _digit := _digit - 9;
      END IF;
    END IF;
    _sum := _sum + _digit;
    _timesTwo := NOT _timesTwo;
  END LOOP;

  IF (mod(_sum, 10) != 0) THEN
    RETURN -10;
  END IF;

  RETURN 0; -- No Error

END;
'
  LANGUAGE 'plpgsql';
