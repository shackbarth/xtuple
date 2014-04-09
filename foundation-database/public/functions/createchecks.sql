CREATE OR REPLACE FUNCTION createChecks(pBankaccntid INTEGER,
                                        pCheckDate DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _v RECORD;
  _r RECORD;
  _c RECORD;
  _checkid		INTEGER;
  _counter		INTEGER := 0;
  _check_curr_id	INTEGER;
  _check_curr_rate      NUMERIC;

BEGIN

  SELECT bankaccnt_curr_id, currRate(bankaccnt_curr_id, pCheckDate) 
    INTO _check_curr_id, _check_curr_rate
    FROM bankaccnt
    WHERE ( bankaccnt_id = pBankaccntid );
  FOR _v IN SELECT DISTINCT vend_id, vend_number, vend_name
              FROM apselect
              JOIN apopen   ON (apselect_apopen_id=apopen_id)
              JOIN vendinfo ON (apopen_vend_id=vend_id)
            WHERE ((apselect_bankaccnt_id=pBankaccntid)
               AND (apselect_date <= pCheckDate)) LOOP

    -- if we owe this vendor anything (we might not) then create a check
    -- allow $0 checks
    IF ((SELECT SUM(CASE apopen_doctype WHEN 'C' THEN (apselect_amount * -1.0)
                                        ELSE apselect_amount END * _check_curr_rate / apopen_curr_rate)          
	 FROM apselect JOIN apopen ON (apopen_id=apselect_apopen_id)
	 WHERE ((apopen_vend_id=_v.vend_id)
	   AND  (apselect_bankaccnt_id=pBankaccntid)) ) >= 0) THEN
      -- 0.01 is a temporary amount; we''ll update the check amount later
      _checkid := createCheck(pBankaccntid,	'V',	_v.vend_id,
			      pCheckDate,		0.01,	_check_curr_id,
			      NULL,		NULL, '',	'',	FALSE);

      FOR _r IN SELECT apopen_id, apselect_id,
		       apopen_docnumber, apopen_invcnumber, apopen_ponumber,
		       apopen_docdate, apselect_curr_id,
		       apselect_amount, apselect_discount
		FROM apselect, apopen
		WHERE ( (apselect_apopen_id=apopen_id)
		 AND (apopen_vend_id=_v.vend_id)
		 AND (apselect_bankaccnt_id=pBankaccntid) ) LOOP
	INSERT INTO checkitem
	( checkitem_checkhead_id, checkitem_apopen_id,
	  checkitem_vouchernumber, checkitem_invcnumber, checkitem_ponumber,
	  checkitem_amount, checkitem_discount, checkitem_docdate,
          checkitem_curr_id, checkitem_curr_rate )
	VALUES
	( _checkid, _r.apopen_id,
	  _r.apopen_docnumber, _r.apopen_invcnumber, _r.apopen_ponumber,
	  _r.apselect_amount, _r.apselect_discount, _r.apopen_docdate,
	  _r.apselect_curr_id, 
          1 / (_check_curr_rate / currRate(_r.apselect_curr_id, pCheckdate))  );

	DELETE FROM apselect
	WHERE (apselect_id=_r.apselect_id);

      END LOOP;

      -- one check can pay for purchases on multiple dates in multiple currencies
      UPDATE checkhead
      SET checkhead_amount = (SELECT SUM(CASE WHEN (apopen_doctype='C') THEN checkitem_amount / checkitem_curr_rate * -1.0
                                              ELSE checkitem_amount / checkitem_curr_rate END)
			      FROM checkitem LEFT OUTER JOIN apopen ON (apopen_id=checkitem_apopen_id)
			      WHERE (checkitem_checkhead_id=checkhead_id))
      WHERE (checkhead_id=_checkid);

      _counter := (_counter + 1);
    END IF;

  END LOOP;

  RETURN _counter;

END;
$$ LANGUAGE 'plpgsql';
