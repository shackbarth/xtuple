CREATE OR REPLACE FUNCTION formatflitemdescrip(int4)
  RETURNS text AS  '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlitemId ALIAS FOR $1;
  _x RECORD;
  _descrip TEXT;

BEGIN
  SELECT flitem_accnt_id, flitem_company, flitem_profit, flitem_number,
        flitem_sub, flitem_type, flitem_subaccnttype_code,
        accnt_id, accnt_descrip INTO _x
  FROM flitem LEFT OUTER JOIN accnt
        ON flitem_accnt_id=accnt_id
  WHERE flitem_id=pFlitemId;

  IF _x.flitem_accnt_id > -1 THEN

    SELECT (formatGLAccount(_x.accnt_id) || ''-'' || _x.accnt_descrip) INTO _descrip;

  ELSE

    _descrip:='''';

    IF _x.flitem_type = ''A'' THEN
      _descrip:=''Type='' || ''Asset'';
      ELSE IF _x.flitem_type=''L'' THEN
        _descrip:=''Type='' || ''Liability'';
        ELSE IF _x.flitem_type=''R'' THEN
          _descrip:=''Type='' || ''Revenue'';
          ELSE IF _x.flitem_type=''E'' THEN
            _descrip:=''Type='' || ''Expense'';
            ELSE IF _x.flitem_type=''Q'' THEN
              _descrip:=''Type='' || ''Equity'';
            END IF;
          END IF;
        END IF;
      END IF;
    END IF;

    IF _x.flitem_subaccnttype_code <> ''All'' THEN
      IF (LENGTH(TRIM(both from _descrip)) > 0) THEN
        _descrip:=_descrip || '', '';
      END IF;
      _descrip:=_descrip || ''Sub Accnt Type='' || _x.flitem_subaccnttype_code;
    END IF;

    IF _x.flitem_company <> ''All'' THEN
      IF (LENGTH(TRIM(both from _descrip)) > 0) THEN
        _descrip:=_descrip || '', '';
      END IF;
      _descrip:=_descrip || ''Company='' || _x.flitem_company;
    END IF;

    IF _x.flitem_profit <> ''All'' THEN
      IF (LENGTH(TRIM(both from _descrip)) > 0) THEN
        _descrip:=_descrip || '', '';
      END IF;
      _descrip:=_descrip || ''Profit='' || _x.flitem_profit;
    END IF;

    IF _x.flitem_number <> ''All'' THEN
      IF (LENGTH(TRIM(both from _descrip)) > 0) THEN
        _descrip:=_descrip || '', '';
      END IF;
      _descrip:=_descrip || ''Number='' || _x.flitem_number;
    END IF;

    IF _x.flitem_sub <> ''All'' THEN
      IF (LENGTH(TRIM(both from _descrip)) > 0) THEN
        _descrip:=_descrip || '', '';
      END IF;
      _descrip:=_descrip || ''Sub Accnt='' || _x.flitem_sub;
    END IF;
  END IF;

  RETURN _descrip;

END;
' LANGUAGE 'plpgsql';
