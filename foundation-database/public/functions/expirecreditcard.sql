CREATE OR REPLACE FUNCTION expireCreditCard(integer, bytea)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCust ALIAS FOR $1;
  pKey ALIAS FOR $2;
  num_updated INTEGER;
  cc_year INTEGER;
  cc_month INTEGER;
  cc_year_t TEXT;
  cc_month_t TEXT;
  _dr RECORD;
  _cc RECORD;
  bf TEXT;

BEGIN

  num_updated := 0;
  bf := ''bf'';

  select cast(date_part(''year'', CURRENT_DATE) AS INTEGER) AS check_year, cast(date_part(''month'', CURRENT_DATE) AS INTEGER) AS check_month INTO _dr;

  FOR _cc IN SELECT ccard_id, 
                    decrypt(setbytea(ccard_month_expired), setbytea(pKey), ''bf'') AS ccard_month_expired,
                    decrypt(setbytea(ccard_year_expired), setbytea(pKey), ''bf'') AS ccard_year_expired
      FROM ccard
      WHERE ( (ccard_cust_id=pCust)
        AND   (ccard_active) ) LOOP

      SELECT formatbytea(_cc.ccard_month_expired) INTO cc_month_t;
      SELECT formatbytea(_cc.ccard_year_expired) INTO cc_year_t;
      SELECT cast(cc_month_t AS INTEGER) INTO cc_month;
      SELECT cast(cc_year_t AS INTEGER) INTO cc_year;

      IF (cc_year < _dr.check_year) THEN
--  We have an expired card
        UPDATE ccard set ccard_active = FALSE where ccard_id = _cc.ccard_id;
        num_updated := num_updated + 1;
      ELSIF (cc_year = _dr.check_year AND cc_month < _dr.check_month) THEN
--  We have an expired card
        UPDATE ccard set ccard_active = FALSE where ccard_id = _cc.ccard_id;
        num_updated := num_updated + 1;
      END IF;

  END LOOP;

  RETURN num_updated;

END;
'
  LANGUAGE 'plpgsql';
