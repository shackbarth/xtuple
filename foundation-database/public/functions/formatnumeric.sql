CREATE OR REPLACE FUNCTION formatNumeric(NUMERIC, TEXT) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value        NUMERIC := $1;
  _type         TEXT    := LOWER(COALESCE($2, 'curr'));
  _abs          NUMERIC;
  _magnitudecnt NUMERIC(1000);
  _wholefmt     TEXT    := '0';
  _scale        INTEGER;
  _neg          TEXT;
  _decimal      TEXT;
  _group        TEXT;
  _string       TEXT;
  _debug        BOOL := false;
  _r            RECORD;

BEGIN
  -- If the value passed in is NULL then we want to pass back an empty string
  IF(_value IS NULL) THEN
    RETURN '';
  END IF;

  SELECT * INTO _r
  FROM locale
  WHERE (locale_id=getUsrLocaleId());

  _decimal := COALESCE(SUBSTRING(_r.locale_qtyformat FROM 1 FOR 1), '.');
  _neg     := COALESCE(SUBSTRING(_r.locale_qtyformat FROM 2 FOR 1), '-');
  _group   := COALESCE(SUBSTRING(_r.locale_qtyformat FROM 3 FOR 1), ',');

  _scale   := CASE WHEN _type = 'cost'       THEN _r.locale_cost_scale
                   WHEN _type = 'extprice'   THEN _r.locale_extprice_scale
                   WHEN _type = 'percent'    THEN _r.locale_percent_scale
                   WHEN _type = 'purchprice' THEN _r.locale_purchprice_scale
                   WHEN _type = 'qty'        THEN _r.locale_qty_scale
                   WHEN _type = 'qtyper'     THEN _r.locale_qtyper_scale
                   WHEN _type = 'salesprice' THEN _r.locale_salesprice_scale
                   WHEN _type = 'uomratio'   THEN _r.locale_uomratio_scale
                   WHEN _type = 'weight'     THEN _r.locale_weight_scale
                   WHEN SUBSTRING(_type FOR 4) = 'curr' THEN _r.locale_curr_scale
                   ELSE 2
              END;

  _value        := round(_value, _scale);
  _abs          := ABS(_value);
  _magnitudecnt := TRUNC(_abs / 10);

  IF (_debug) THEN
    RAISE NOTICE '_value % _abs % _scale % _neg % _decimal % _group % ',
                 _value, _abs, _scale, _decimal, _group, _scale;
  END IF;

  IF (_value < 0) THEN
    _string := _neg;
  ELSE
    _string := '';
  END IF;

  WHILE (_magnitudecnt >= 1) LOOP
    _magnitudecnt := TRUNC(_magnitudecnt / 10);
    IF (LENGTH(_wholefmt) % 3 = 0) THEN
      _wholefmt := '"' || _group || '"' || _wholefmt;
    END IF;
    _wholefmt := '9' || _wholefmt;
  END LOOP;

  IF (_scale > 0) THEN
    _abs := (_abs * (10 ^ _scale));
    _abs := TRUNC(_abs);
    _wholefmt := _wholefmt || '"' || _decimal || '"' || REPEAT('0', _scale);
  END IF;

  _wholefmt := 'FM' || _wholefmt;
  _string := _string || to_char(_abs, _wholefmt);

  RETURN _string;
END;$$
LANGUAGE 'plpgsql';
