CREATE OR REPLACE FUNCTION alterencrypt(text, text)
  RETURNS integer AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOldKey ALIAS FOR $1;
  pNewKey ALIAS FOR $2;
  _cc RECORD;
  _ccaud RECORD;
  _metricenc RECORD;
  num_updated INTEGER;

BEGIN

  num_updated := 0;

-- Update ccard

  FOR _cc IN SELECT ccard_id, 
             decrypt(setbytea(ccard_name), setbytea(pOldKey), ''bf'') AS ccard_name,
             decrypt(setbytea(ccard_address1), setbytea(pOldKey), ''bf'') AS ccard_address1,
             decrypt(setbytea(ccard_address2), setbytea(pOldKey), ''bf'') AS ccard_address2,
             decrypt(setbytea(ccard_city), setbytea(pOldKey), ''bf'') AS ccard_city,
             decrypt(setbytea(ccard_state), setbytea(pOldKey), ''bf'') AS ccard_state,
             decrypt(setbytea(ccard_zip), setbytea(pOldKey), ''bf'') AS ccard_zip,
             decrypt(setbytea(ccard_country), setbytea(pOldKey), ''bf'') AS ccard_country,
             decrypt(setbytea(ccard_number), setbytea(pOldKey), ''bf'') AS ccard_number,
             decrypt(setbytea(ccard_month_expired), setbytea(pOldKey), ''bf'') AS ccard_month_expired,
             decrypt(setbytea(ccard_year_expired), setbytea(pOldKey), ''bf'') AS ccard_year_expired
      FROM ccard LOOP

      UPDATE ccard
             set ccard_name = encrypt(setbytea(_cc.ccard_name), setbytea(pNewKey), ''bf''),
                 ccard_address1 = encrypt(setbytea(_cc.ccard_address1), setbytea(pNewKey), ''bf''),
                 ccard_address2 = encrypt(setbytea(_cc.ccard_address2), setbytea(pNewKey), ''bf''),
                 ccard_city = encrypt(setbytea(_cc.ccard_city), setbytea(pNewKey), ''bf''),
                 ccard_state = encrypt(setbytea(_cc.ccard_state), setbytea(pNewKey), ''bf''),
                 ccard_zip = encrypt(setbytea(_cc.ccard_zip), setbytea(pNewKey), ''bf''),
                 ccard_country = encrypt(setbytea(_cc.ccard_country), setbytea(pNewKey), ''bf''),
                 ccard_number = encrypt(setbytea(_cc.ccard_number), setbytea(pNewKey), ''bf''),
                 ccard_month_expired = encrypt(setbytea(_cc.ccard_month_expired), setbytea(pNewKey), ''bf''),
                 ccard_year_expired = encrypt(setbytea(_cc.ccard_year_expired), setbytea(pNewKey), ''bf'')
      WHERE ccard_id = _cc.ccard_id;

      num_updated := num_updated + 1;

  END LOOP;

-- Update ccardaud

  FOR _ccaud IN SELECT ccardaud_id, 
             decrypt(setbytea(ccardaud_ccard_name_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_name_old,
             decrypt(setbytea(ccardaud_ccard_name_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_name_new,
             decrypt(setbytea(ccardaud_ccard_address1_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_address1_old,
             decrypt(setbytea(ccardaud_ccard_address1_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_address1_new,
             decrypt(setbytea(ccardaud_ccard_address2_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_address2_old,
             decrypt(setbytea(ccardaud_ccard_address2_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_address2_new,
             decrypt(setbytea(ccardaud_ccard_city_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_city_old,
             decrypt(setbytea(ccardaud_ccard_city_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_city_new,
             decrypt(setbytea(ccardaud_ccard_state_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_state_old,
             decrypt(setbytea(ccardaud_ccard_state_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_state_new,
             decrypt(setbytea(ccardaud_ccard_zip_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_zip_old,
             decrypt(setbytea(ccardaud_ccard_zip_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_zip_new,
             decrypt(setbytea(ccardaud_ccard_country_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_country_old,
             decrypt(setbytea(ccardaud_ccard_country_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_country_new,
             decrypt(setbytea(ccardaud_ccard_number_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_number_old,
             decrypt(setbytea(ccardaud_ccard_number_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_number_new,
             decrypt(setbytea(ccardaud_ccard_month_expired_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_month_expired_old,
             decrypt(setbytea(ccardaud_ccard_month_expired_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_month_expired_new,
             decrypt(setbytea(ccardaud_ccard_year_expired_old), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_year_expired_old,
             decrypt(setbytea(ccardaud_ccard_year_expired_new), setbytea(pOldKey), ''bf'') AS ccardaud_ccard_year_expired_new
      FROM ccardaud LOOP

      UPDATE ccardaud
             set ccardaud_ccard_name_old = encrypt(setbytea(_ccaud.ccardaud_ccard_name_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_name_new = encrypt(setbytea(_ccaud.ccardaud_ccard_name_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_address1_old = encrypt(setbytea(_ccaud.ccardaud_ccard_address1_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_address1_new = encrypt(setbytea(_ccaud.ccardaud_ccard_address1_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_address2_old = encrypt(setbytea(_ccaud.ccardaud_ccard_address2_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_address2_new = encrypt(setbytea(_ccaud.ccardaud_ccard_address2_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_city_old = encrypt(setbytea(_ccaud.ccardaud_ccard_city_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_city_new = encrypt(setbytea(_ccaud.ccardaud_ccard_city_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_state_old = encrypt(setbytea(_ccaud.ccardaud_ccard_state_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_state_new = encrypt(setbytea(_ccaud.ccardaud_ccard_state_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_zip_old = encrypt(setbytea(_ccaud.ccardaud_ccard_zip_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_zip_new = encrypt(setbytea(_ccaud.ccardaud_ccard_zip_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_country_old = encrypt(setbytea(_ccaud.ccardaud_ccard_country_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_country_new = encrypt(setbytea(_ccaud.ccardaud_ccard_country_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_number_old = encrypt(setbytea(_ccaud.ccardaud_ccard_number_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_number_new = encrypt(setbytea(_ccaud.ccardaud_ccard_number_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_month_expired_old = encrypt(setbytea(_ccaud.ccardaud_ccard_month_expired_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_month_expired_new = encrypt(setbytea(_ccaud.ccardaud_ccard_month_expired_new), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_year_expired_old = encrypt(setbytea(_ccaud.ccardaud_ccard_year_expired_old), setbytea(pNewKey), ''bf''),
                 ccardaud_ccard_year_expired_new = encrypt(setbytea(_ccaud.ccardaud_ccard_year_expired_new), setbytea(pNewKey), ''bf'')
      WHERE ccardaud_id = _ccaud.ccardaud_id;

      num_updated := num_updated + 1;

  END LOOP;

-- Update metricenc

  FOR _metricenc IN SELECT metricenc_id, 
             decrypt(setbytea(metricenc_value), setbytea(pOldKey), ''bf'') AS metricenc_value
      FROM metricenc LOOP

      UPDATE metricenc
             set metricenc_value = encrypt(setbytea(_metricenc.metricenc_value), setbytea(pNewKey), ''bf'')
      WHERE metricenc_id = _metricenc.metricenc_id;

      num_updated := num_updated + 1;

  END LOOP;


  RETURN num_updated;

END;
'
  LANGUAGE 'plpgsql';
