
CREATE OR REPLACE FUNCTION spellAmount(NUMERIC) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN spellAmount($1, baseCurrId());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION spellAmount(NUMERIC, INTEGER) RETURNS text AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pN ALIAS FOR $1;
  pCurrId ALIAS FOR $2;
  _t text;
  _dollars text;
  _cents text;
  _l integer;
  _p integer;
  _words text;
  _word text;
  _hundreds char;
  _tens char;
  _ones char;
  _fractionalPartName text;
  _curr curr_symbol%ROWTYPE;
BEGIN

  _t := ltrim(to_char(pN, '999999999990D99'),' ');
  IF strpos(_t, '.') > 0 THEN
    _dollars := split_part(_t, '.', 1);
    _cents := split_part(_t, '.', 2);
  ELSIF strpos(_t, ',') > 0 THEN
    _dollars := split_part(_t, ',', 1);
    _cents := split_part(_t, ',', 2);
  END IF;

  _p := 0;
  _l := length(_dollars);

  _words := '';
  WHILE (_p < _l) LOOP
    IF((_l - _p - 2) < 1) THEN
      _hundreds := '0';
    ELSE
      _hundreds := substr(_dollars, _l - _p - 2, 1);
    END IF;
    IF((_l - _p - 1) < 1) THEN
      _tens := '0';
    ELSE
      _tens := substr(_dollars, _l - _p - 1, 1);
    END IF;
    IF((_l - _p) < 1) THEN
      _ones := '0';
    ELSE
      _ones := substr(_dollars, _l - _p, 1);
    END IF;

    IF(_hundreds != '0' OR _tens != '0' OR _ones != '0') THEN
      IF (_p = 3) THEN
        _words := 'thousand ' || _words;
      ELSIF (_p = 6) THEN
        _words := 'million ' || _words;
      ELSIF (_p = 9) THEN
        _words := 'billion ' || _words;
      END IF;

      _word := '';
      IF(_tens = '1') THEN
        IF(_ones = '0') THEN
          _word := 'ten';
        ELSIF(_ones = '1') THEN
          _word := 'eleven';
        ELSIF(_ones = '2') THEN
          _word := 'twelve';
        ELSIF(_ones = '3') THEN
          _word := 'thirteen';
        ELSIF(_ones = '4') THEN
          _word := 'fourteen';
        ELSIF(_ones = '5') THEN
          _word := 'fifteen';
        ELSIF(_ones = '6') THEN
          _word := 'sixteen';
        ELSIF(_ones = '7') THEN
          _word := 'seventeen';
        ELSIF(_ones = '8') THEN
          _word := 'eighteen';
        ELSIF(_ones = '9') THEN
          _word := 'nineteen';
        ELSE
          _word := 'ERROR';
        END IF;
      ELSE
        IF(_ones = '1') THEN
          _word := 'one';
        ELSIF(_ones = '2') THEN
          _word := 'two';
        ELSIF(_ones = '3') THEN
          _word := 'three';
        ELSIF(_ones = '4') THEN
          _word := 'four';
        ELSIF(_ones = '5') THEN
          _word := 'five';
        ELSIF(_ones = '6') THEN
          _word := 'six';
        ELSIF(_ones = '7') THEN
          _word := 'seven';
        ELSIF(_ones = '8') THEN
          _word := 'eight';
        ELSIF(_ones = '9') THEN
          _word := 'nine';
        ELSIF(_ones != '0') THEN
          _word := 'ERROR';
        END IF;

        if(_tens != '0') THEN
          _word := '-' || _word;
        END IF;

        IF(_tens = '2') THEN
          _word := 'twenty' || _word;
        ELSIF(_tens = '3') THEN
          _word := 'thirty' || _word;
        ELSIF(_tens = '4') THEN
          _word := 'forty' || _word;
        ELSIF(_tens = '5') THEN
          _word := 'fifty' || _word;
        ELSIF(_tens = '6') THEN
          _word := 'sixty' || _word;
        ELSIF(_tens = '7') THEN
          _word := 'seventy' || _word;
        ELSIF(_tens = '8') THEN
          _word := 'eighty' || _word;
        ELSIF(_tens = '9') THEN
          _word := 'ninety' || _word;
        ELSIF(_tens != '0' AND _tens != '1') THEN
          _word := 'ERROR' || _word;
        END IF;
      END IF;
      if(_word != '') THEN
        _words := _word || ' ' || _words;
      END IF;

      _word := '';
      IF(_hundreds = '1') THEN
        _word := 'one hundred';
      ELSIF(_hundreds = '2') THEN
        _word := 'two hundred';
      ELSIF(_hundreds = '3') THEN
        _word := 'three hundred';
      ELSIF(_hundreds = '4') THEN
        _word := 'four hundred';
      ELSIF(_hundreds = '5') THEN
        _word := 'five hundred';
      ELSIF(_hundreds = '6') THEN
        _word := 'six hundred';
      ELSIF(_hundreds = '7') THEN
        _word := 'seven hundred';
      ELSIF(_hundreds = '8') THEN
        _word := 'eight hundred';
      ELSIF(_hundreds = '9') THEN
        _word := 'nine hundred';
      ELSIF(_hundreds != '0') THEN
        _words := 'ERROR';
      END IF;
      if(_word != '') THEN
        _words := _word || ' ' || _words;
      END IF;
    END IF;

    _p := _p + 3;
  END LOOP;

  _words := rtrim(_words, ' ');
  IF(_words = '') THEN
    _words := 'zero';
  END IF;

  SELECT * INTO _curr
    FROM curr_symbol
    WHERE curr_id = pCurrId;

  IF(_words = 'one') AND TRIM(_curr.curr_name) ~ '.*s' THEN
    _word := rtrim(_curr.curr_name, ' s');
  ELSE
    _word := trim(_curr.curr_name);
  END IF;

  IF _curr.curr_abbr = 'USD' OR _curr.curr_abbr = 'CAD' THEN
      IF (_cents = '1') THEN
        _fractionalPartName = ' cent';
      ELSE
        _fractionalPartName = ' cents';
      END IF;
  ELSE
    _fractionalPartName = ' / 100 ';
  END IF;

  RETURN _words || ' ' || _word || ' and ' || _cents || _fractionalPartName;
END;
$$ LANGUAGE 'plpgsql' VOLATILE;

