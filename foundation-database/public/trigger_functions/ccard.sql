CREATE OR REPLACE FUNCTION _ccardtrigger() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  New.ccard_lastupdated := current_timestamp;
  New.ccard_last_updated_by_username := getEffectiveXtUser();

  IF (TG_OP = ''UPDATE'') THEN
    INSERT INTO ccardaud
         VALUES (nextval(''ccardaud_ccardaud_id_seq''), NEW.ccard_id,
                 OLD.ccard_seq, NEW.ccard_seq, OLD.ccard_cust_id, NEW.ccard_cust_id,
                 OLD.ccard_active, NEW.ccard_active, OLD.ccard_name, NEW.ccard_name,
                 OLD.ccard_address1, NEW.ccard_address1, OLD.ccard_address2,
                 NEW.ccard_address2, OLD.ccard_city, NEW.ccard_city, OLD.ccard_state,
                 NEW.ccard_state, OLD.ccard_zip, NEW.ccard_zip, OLD.ccard_country,
                 NEW.ccard_country, OLD.ccard_number, NEW.ccard_number, OLD.ccard_debit,
                 NEW.ccard_debit, OLD.ccard_month_expired, NEW.ccard_month_expired,
                 OLD.ccard_year_expired, NEW.ccard_year_expired, OLD.ccard_type, NEW.ccard_type);
  ELSE
-- We are inserting a record, therefore no old values
    INSERT INTO ccardaud
         VALUES (nextval(''ccardaud_ccardaud_id_seq''), NEW.ccard_id,
                 NULL, NEW.ccard_seq, NULL, NEW.ccard_cust_id, NULL,
                 NEW.ccard_active, NULL, NEW.ccard_name, NULL,
                 NEW.ccard_address1, NULL, NEW.ccard_address2, NULL,
                 NEW.ccard_city, NULL, NEW.ccard_state, NULL,
                 NEW.ccard_zip, NULL, NEW.ccard_country, NULL,
                 NEW.ccard_number, NULL, NEW.ccard_debit, NULL,
                 NEW.ccard_month_expired, NULL, NEW.ccard_year_expired, NULL,
                 NEW.ccard_type);
  END IF;

  RETURN NEW;

END;
'
  LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS ccardtrigger ON ccard;
CREATE TRIGGER ccardtrigger BEFORE INSERT OR UPDATE ON ccard FOR EACH ROW EXECUTE PROCEDURE _ccardtrigger();
