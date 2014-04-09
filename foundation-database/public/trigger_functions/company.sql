CREATE OR REPLACE FUNCTION _companyTrigger() RETURNS "trigger" AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _used	BOOLEAN := false;

BEGIN
  IF (NEW.company_external AND NOT OLD.company_external) THEN
    IF EXISTS(SELECT accnt_id
              FROM accnt, company, (
                  SELECT DISTINCT apaccnt_ap_accnt_id AS test_accnt_id FROM apaccnt
                  UNION SELECT DISTINCT apaccnt_discount_accnt_id FROM apaccnt
                  UNION SELECT DISTINCT apaccnt_prepaid_accnt_id FROM apaccnt
                  UNION SELECT DISTINCT apopen_accnt_id FROM apopen
                  UNION SELECT DISTINCT araccnt_ar_accnt_id FROM araccnt
                  UNION SELECT DISTINCT araccnt_deferred_accnt_id FROM araccnt
                  UNION SELECT DISTINCT araccnt_freight_accnt_id FROM araccnt
                  UNION SELECT DISTINCT araccnt_prepaid_accnt_id FROM araccnt
                  UNION SELECT DISTINCT aropen_accnt_id FROM aropen
                  UNION SELECT DISTINCT bankaccnt_accnt_id FROM bankaccnt
                  UNION SELECT DISTINCT bankaccnt_rec_accnt_id FROM bankaccnt
                  UNION SELECT DISTINCT budgitem_accnt_id FROM budgitem
                  UNION SELECT DISTINCT cashrcptmisc_accnt_id FROM cashrcptmisc
                  UNION SELECT DISTINCT cmhead_misc_accnt_id FROM cmhead
                  UNION SELECT DISTINCT cobmisc_misc_accnt_id FROM cobmisc
                  UNION SELECT DISTINCT cohead_misc_accnt_id FROM cohead
                  UNION SELECT DISTINCT coitem_cos_accnt_id FROM coitem
                  UNION SELECT DISTINCT costcat_adjustment_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_asset_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_freight_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_invcost_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_laboroverhead_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_liability_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_matusage_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_mfgscrap_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_purchprice_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_scrap_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_shipasset_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_toliability_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_transform_accnt_id FROM costcat
                  UNION SELECT DISTINCT costcat_wip_accnt_id FROM costcat
                  UNION SELECT DISTINCT costelem_exp_accnt_id FROM costelem
                  UNION SELECT DISTINCT expcat_exp_accnt_id FROM expcat
                  UNION SELECT DISTINCT expcat_freight_accnt_id FROM expcat
                  UNION SELECT DISTINCT expcat_liability_accnt_id FROM expcat
                  UNION SELECT DISTINCT expcat_purchprice_accnt_id FROM expcat
                  UNION SELECT DISTINCT glseries_accnt_id FROM glseries
                  UNION SELECT DISTINCT gltrans_accnt_id FROM gltrans
                  UNION SELECT DISTINCT invchead_misc_accnt_id FROM invchead
                  UNION SELECT DISTINCT quhead_misc_accnt_id FROM quhead
                  UNION SELECT DISTINCT salesaccnt_cor_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salesaccnt_cos_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salesaccnt_cow_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salesaccnt_credit_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salesaccnt_returns_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salesaccnt_sales_accnt_id FROM salesaccnt
                  UNION SELECT DISTINCT salescat_ar_accnt_id FROM salescat
                  UNION SELECT DISTINCT salescat_prepaid_accnt_id FROM salescat
                  UNION SELECT DISTINCT salescat_sales_accnt_id FROM salescat
                  UNION SELECT DISTINCT stdjrnlitem_accnt_id FROM stdjrnlitem
                  UNION SELECT DISTINCT tax_sales_accnt_id FROM tax
                  UNION SELECT DISTINCT taxauth_accnt_id FROM taxauth
                  UNION SELECT DISTINCT vodist_accnt_id FROM vodist
                  UNION SELECT DISTINCT warehous_default_accnt_id FROM whsinfo
                ) AS dummy
              WHERE ((accnt_id=test_accnt_id)
                AND  (accnt_company=company_number)
                AND  (accnt_company=NEW.company_number))
    ) THEN
      RAISE EXCEPTION ''Cannot make Company % External because it is used in the local database.'',
                      NEW.company_number;
    ELSIF (fetchMetricBool(''EnableReturnAuth'')) THEN
      IF EXISTS(SELECT accnt_id
              FROM accnt, company, (
                  SELECT DISTINCT rahead_misc_accnt_id AS test_accnt_id FROM rahead
                  UNION SELECT DISTINCT raitem_cos_accnt_id FROM raitem
                ) AS dummy
              WHERE ((accnt_id=test_accnt_id)
                AND  (accnt_company=company_number)
                AND  (accnt_company=NEW.company_number))
      ) THEN
        RAISE EXCEPTION ''Cannot make Company % External because it is used in the local database.'',
                        NEW.company_number;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'companyTrigger');
CREATE TRIGGER companyTrigger BEFORE UPDATE
ON company
FOR EACH ROW
EXECUTE PROCEDURE _companyTrigger();
