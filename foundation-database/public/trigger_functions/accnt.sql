CREATE OR REPLACE FUNCTION _accntTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ffSub BOOLEAN;
  ffProfit BOOLEAN;
  result INTEGER;
BEGIN
  SELECT (metric_value='t')
    INTO ffSub
    FROM metric
   WHERE(metric_name='GLFFSubaccounts')
   LIMIT 1;
  ffSub := COALESCE(ffSub, false);

  SELECT (metric_value='t')
    INTO ffProfit
    FROM metric
   WHERE(metric_name='GLFFProfitCenters')
   LIMIT 1;
  ffProfit := COALESCE(ffProfit, false);

  IF (NEW.accnt_sub IS NOT NULL AND ffSub = false) THEN
    SELECT subaccnt_id
      INTO result
      FROM subaccnt
     WHERE(subaccnt_number=NEW.accnt_sub)
     LIMIT 1;
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'You must supply a valid Sub Account Number.';
    END IF;
  END IF;

  IF (NEW.accnt_profit IS NOT NULL AND ffProfit = false) THEN
    SELECT prftcntr_id
      INTO result
      FROM prftcntr
     WHERE(prftcntr_number=NEW.accnt_profit)
     LIMIT 1;
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'You must supply a valid Profit Center Number.';
    END IF;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF ((NEW.accnt_type != OLD.accnt_type) AND
        (SELECT (count(*) > 0) FROM gltrans WHERE (gltrans_accnt_id=NEW.accnt_id))) THEN
      RAISE EXCEPTION 'You may not change the account type of an account that has transaction history';
    END IF;
  END IF;

  NEW.accnt_name := formatGlAccount(NEW.accnt_company, NEW.accnt_profit, NEW.accnt_number, NEW.accnt_sub);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'accntTrigger');
CREATE TRIGGER accntTrigger BEFORE INSERT OR UPDATE ON accnt FOR EACH ROW EXECUTE PROCEDURE _accntTrigger();

CREATE OR REPLACE FUNCTION _accntUniqueTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
BEGIN
  -- This trigger is to protect against id collision on inherited tables since there is no way 
  -- to enforce that with regular constraints.  It should be applied to accnt and any table that 
  -- inherits accnt.
  IF (SELECT (count(accnt_id) > 0) FROM accnt WHERE (accnt_id = NEW.accnt_id)) THEN
    RAISE EXCEPTION 'Can not create record on account with duplicate key %.', NEW.accnt_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'accntUniqueTrigger');
CREATE TRIGGER accntUniqueTrigger BEFORE INSERT ON accnt FOR EACH ROW EXECUTE PROCEDURE _accntUniqueTrigger();

CREATE OR REPLACE FUNCTION _accntDeleteTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _accntnum     TEXT := formatGLAccount(OLD.accnt_id);
  _check INTEGER;
BEGIN
-- This trigger is to protect against accounts that are in use

--  Check to see if the passed accnt is used in a Cost Category
  SELECT costcat_id INTO _check
  FROM costcat
  WHERE ( (costcat_asset_accnt_id=OLD.accnt_id)
     OR   (costcat_liability_accnt_id=OLD.accnt_id)
     OR   (costcat_adjustment_accnt_id=OLD.accnt_id)
     OR   (costcat_purchprice_accnt_id=OLD.accnt_id)
     OR   (costcat_laboroverhead_accnt_id=OLD.accnt_id)
     OR   (costcat_scrap_accnt_id=OLD.accnt_id)
     OR   (costcat_invcost_accnt_id=OLD.accnt_id)
     OR   (costcat_wip_accnt_id=OLD.accnt_id)
     OR   (costcat_shipasset_accnt_id=OLD.accnt_id)
     OR   (costcat_mfgscrap_accnt_id=OLD.accnt_id)
     OR   (costcat_transform_accnt_id=OLD.accnt_id)
     OR   (costcat_freight_accnt_id=OLD.accnt_id) )
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Cost Category';
  END IF;

--  Check to see if the passed accnt is used in a Sales Account Assignment
  SELECT salesaccnt_id INTO _check
  FROM salesaccnt
  WHERE ( (salesaccnt_sales_accnt_id=OLD.accnt_id)
     OR   (salesaccnt_credit_accnt_id=OLD.accnt_id)
     OR   (salesaccnt_cos_accnt_id=OLD.accnt_id) )
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Sales Account Assignment';
  END IF;

--  Check to see if the passed accnt is used in a A/R Account Assignment
  SELECT araccnt_id INTO _check
  FROM araccnt
  WHERE ( (araccnt_freight_accnt_id=OLD.accnt_id)
     OR   (araccnt_ar_accnt_id=OLD.accnt_id)
     OR   (araccnt_prepaid_accnt_id=OLD.accnt_id) )
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in A/R Account Assignment';
  END IF;

--  Check to see if the passed accnt is used in a Warehouse
  SELECT warehous_id INTO _check
  FROM whsinfo
  WHERE (warehous_default_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Site';
  END IF;

--  Check to see if the passed accnt is used in a Bank Account
  SELECT bankaccnt_id INTO _check
  FROM bankaccnt
  WHERE (bankaccnt_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Bank Account';
  END IF;

--  Check to see if the passed accnt is used in an Expense Category
  SELECT expcat_id INTO _check
  FROM expcat
  WHERE ( (expcat_exp_accnt_id=OLD.accnt_id)
     OR   (expcat_liability_accnt_id=OLD.accnt_id)
     OR   (expcat_purchprice_accnt_id=OLD.accnt_id)
     OR   (expcat_freight_accnt_id=OLD.accnt_id) )
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Expense Category';
  END IF;

--  Check to see if the passed accnt is used in a Tax Code
  SELECT tax_id INTO _check
  FROM tax
  WHERE (tax_sales_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Tax Code';
  END IF;

--  Check to see if the passed accnt is used in a Standard Journal Item
  SELECT stdjrnlitem_id INTO _check
  FROM stdjrnlitem
  WHERE (stdjrnlitem_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Standard Journal Item';
  END IF;

--  Check to see if the passed accnt is used in a A/P Account Assignment
  SELECT apaccnt_ap_accnt_id INTO _check
  FROM apaccnt
  WHERE ( (apaccnt_ap_accnt_id=OLD.accnt_id)
     OR   (apaccnt_prepaid_accnt_id=OLD.accnt_id)
     OR   (apaccnt_discount_accnt_id=OLD.accnt_id) )
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in A/P Account Assignment';
  END IF;

--  Check to see if the passed accnt is used in an A/R Open Item record
  SELECT aropen_accnt_id INTO _check
    FROM aropen
   WHERE (aropen_accnt_id=OLD.accnt_id)
   LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in A/R Open Item';
  END IF;

--  Check to see if the passed accnt has been used in the G/L
  SELECT gltrans_accnt_id INTO _check
  FROM gltrans
  WHERE (gltrans_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in G/L Transaction';
  END IF;

  SELECT sltrans_accnt_id INTO _check
  FROM sltrans
  WHERE (sltrans_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in G/L Journal Transaction';
  END IF;

  SELECT glseries_accnt_id INTO _check
  FROM glseries
  WHERE (glseries_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in G/L Series';
  END IF;

  SELECT trialbal_accnt_id INTO _check
  FROM trialbal
  WHERE (trialbal_accnt_id=OLD.accnt_id)
    AND (trialbal_beginning != 0 OR trialbal_ending != 0)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Trial Balance';
  END IF;

  SELECT cashrcptmisc_accnt_id INTO _check
  FROM cashrcptmisc
  WHERE (cashrcptmisc_accnt_id=OLD.accnt_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Can not delete, used in Cash Receipt Misc. Application';
  END IF;

  -- TODO: everything above here should be replaced by fkeys
  IF (OLD.accnt_id = fetchMetricValue('DefaultAPAccount')) THEN
    RAISE EXCEPTION 'Cannot delete the default A/P Account [xtuple: accnt, -1, %]',
                    _accntnum;
  ELSIF (OLD.accnt_id = fetchMetricValue('DefaultARAccount')) THEN
    RAISE EXCEPTION 'Cannot delete the default A/R Account [xtuple: accnt, -2, %]',
                    _accntnum;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'accntDeleteTrigger');
CREATE TRIGGER accntDeleteTrigger BEFORE DELETE ON accnt FOR EACH ROW EXECUTE PROCEDURE _accntDeleteTrigger();
