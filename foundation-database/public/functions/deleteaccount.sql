
CREATE OR REPLACE FUNCTION deleteAccount(integer) RETURNS integer
    AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if the passed accnt is used in a Cost Category
  SELECT costcat_id INTO _check
  FROM costcat
  WHERE ( (costcat_asset_accnt_id=pAccntid)
     OR   (costcat_liability_accnt_id=pAccntid)
     OR   (costcat_adjustment_accnt_id=pAccntid)
     OR   (costcat_purchprice_accnt_id=pAccntid)
     OR   (costcat_laboroverhead_accnt_id=pAccntid)
     OR   (costcat_scrap_accnt_id=pAccntid)
     OR   (costcat_invcost_accnt_id=pAccntid)
     OR   (costcat_wip_accnt_id=pAccntid)
     OR   (costcat_shipasset_accnt_id=pAccntid)
     OR   (costcat_mfgscrap_accnt_id=pAccntid)
     OR   (costcat_transform_accnt_id=pAccntid)
     OR   (costcat_freight_accnt_id=pAccntid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Check to see if the passed accnt is used in a Sales Account Assignment
  SELECT salesaccnt_id INTO _check
  FROM salesaccnt
  WHERE ( (salesaccnt_sales_accnt_id=pAccntid)
     OR   (salesaccnt_credit_accnt_id=pAccntid)
     OR   (salesaccnt_cos_accnt_id=pAccntid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Check to see if the passed accnt is used in a A/R Account Assignment
  SELECT araccnt_id INTO _check
  FROM araccnt
  WHERE ( (araccnt_freight_accnt_id=pAccntid)
     OR   (araccnt_ar_accnt_id=pAccntid)
     OR   (araccnt_prepaid_accnt_id=pAccntid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Check to see if the passed accnt is used in a Warehouse
  IF EXISTS (SELECT 1
               FROM whsinfo
              WHERE (warehous_default_accnt_id=pAccntid)) THEN
    RETURN -4;
  END IF;

--  Check to see if the passed accnt is used in a Bank Account
  SELECT bankaccnt_id INTO _check
  FROM bankaccnt
  WHERE (bankaccnt_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -5;
  END IF;

--  Check to see if the passed accnt is used in an Expense Category
  SELECT expcat_id INTO _check
  FROM expcat
  WHERE ( (expcat_exp_accnt_id=pAccntid)
     OR   (expcat_liability_accnt_id=pAccntid)
     OR   (expcat_purchprice_accnt_id=pAccntid)
     OR   (expcat_freight_accnt_id=pAccntid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -6;
  END IF;

--  Check to see if the passed accnt is used in a Tax Code
  SELECT tax_id INTO _check
  FROM tax
  WHERE (tax_sales_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -7;
  END IF;

--  Check to see if the passed accnt is used in a Standard Journal Item
  SELECT stdjrnlitem_id INTO _check
  FROM stdjrnlitem
  WHERE (stdjrnlitem_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -8;
  END IF;

--  Check to see if the passed accnt is used in a A/P Account Assignment
  SELECT apaccnt_ap_accnt_id INTO _check
  FROM apaccnt
  WHERE ( (apaccnt_ap_accnt_id=pAccntid)
     OR   (apaccnt_prepaid_accnt_id=pAccntid)
     OR   (apaccnt_discount_accnt_id=pAccntid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -9;
  END IF;

--  Check to see if the passed accnt is used in an A/R Open Item record
  SELECT aropen_accnt_id INTO _check
    FROM aropen
   WHERE (aropen_accnt_id=pAccntid)
   LIMIT 1;
  IF (FOUND) THEN
    RETURN -11;
  END IF;

--  Check to see if the passed accnt has been used in the G/L
  SELECT gltrans_accnt_id INTO _check
  FROM gltrans
  WHERE (gltrans_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -99;
  END IF;

  SELECT glseries_accnt_id INTO _check
  FROM glseries
  WHERE (glseries_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -99;
  END IF;

  SELECT trialbal_accnt_id INTO _check
  FROM trialbal
  WHERE (trialbal_accnt_id=pAccntid)
    AND (trialbal_beginning != 0 OR trialbal_ending != 0)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -99;
  END IF;

  SELECT cashrcptmisc_accnt_id INTO _check
  FROM cashrcptmisc
  WHERE (cashrcptmisc_accnt_id=pAccntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -99;
  END IF;

--  Delete any non-critical use
  DELETE FROM flitem
  WHERE (flitem_accnt_id=pAccntid);

  -- only possible because of trialbal error-check above
  DELETE FROM trialbal
  WHERE (trialbal_accnt_id=pAccntid)
    AND (trialbal_beginning=0)
    AND (trialbal_ending=0);

--  Delete the Account
  DELETE FROM accnt
  WHERE (accnt_id=pAccntid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

