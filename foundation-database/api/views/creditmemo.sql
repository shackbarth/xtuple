CREATE OR REPLACE RULE "_INSERT" AS ON INSERT TO api.creditmemo DO INSTEAD NOTHING;
SELECT dropIfExists('FUNCTION', 'insertCreditMemo(api.creditmemo)');

SELECT dropIfExists('VIEW', 'creditmemo', 'api');
CREATE OR REPLACE VIEW api.creditmemo AS
  SELECT cmhead_number AS memo_number,
         CASE
           WHEN (cmhead_invcnumber = '-1') THEN ''
           ELSE cmhead_invcnumber
         END AS apply_to,
         cmhead_docdate AS memo_date,
         CASE
           WHEN (cmhead_posted) THEN 'Posted'
           ELSE 'Unposted'
         END AS status,
         salesrep_number AS sales_rep,
         cmhead_commission AS commission,
         COALESCE(taxzone_code, 'None') AS tax_zone,
         COALESCE(rsncode_code, 'None') AS reason_code,
         cmhead_hold AS on_hold,
         cust_number AS customer_number,
         cmhead_billtoname AS billto_name,
         cmhead_billtoaddress1 AS billto_address1,
         cmhead_billtoaddress2 AS billto_address2,
         cmhead_billtoaddress3 AS billto_address3,
         cmhead_billtocity AS billto_city,
         cmhead_billtostate AS billto_state,
         cmhead_billtozip AS billto_postal_code,
         cmhead_billtocountry AS billto_country,
         shipto_num AS shipto_number,
         cmhead_shipto_name AS shipto_name,
         cmhead_shipto_address1 AS shipto_address1,
         cmhead_shipto_address2 AS shipto_address2,
         cmhead_shipto_address3 AS shipto_address3,
         cmhead_shipto_city AS shipto_city,
         cmhead_shipto_state AS shipto_state,
         cmhead_shipto_zipcode AS shipto_postal_code,
         cmhead_shipto_country AS shipto_country,
         cmhead_custponumber AS customer_po_number,
         cmhead_comments AS notes,
         curr.curr_abbr AS currency,
         cmhead_misc_descrip AS misc_charge_description,
         cmhead_misc AS misc_charge_amount,
         CASE
           WHEN cmhead_misc_accnt_id = -1 THEN ''
           ELSE formatglaccount(cmhead_misc_accnt_id)
         END AS misc_charge_credit_account,
         cmhead_freight AS freight
       FROM cmhead
         LEFT OUTER JOIN custinfo ON (cust_id=cmhead_cust_id)
         LEFT OUTER JOIN shiptoinfo ON (shipto_id=cmhead_shipto_id)
         LEFT OUTER JOIN curr_symbol AS curr ON (curr.curr_id=cmhead_curr_id)
         LEFT OUTER JOIN salesrep ON (salesrep_id=cmhead_salesrep_id)
         LEFT OUTER JOIN taxzone ON (taxzone_id=cmhead_taxzone_id)
         LEFT OUTER JOIN rsncode ON (rsncode_id=cmhead_rsncode_id);
      
GRANT ALL ON TABLE api.creditmemo TO xtrole;
COMMENT ON VIEW api.creditmemo IS 'Credit Memo Header';


CREATE OR REPLACE FUNCTION insertCreditMemo(api.creditmemo) RETURNS boolean AS
$insertCreditMemo$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
BEGIN
	-- NOTE: (SELECT getCustId(...)) seems redundant, but it actually produces
	-- a HUGE performance increase because it makes the Postgres query planner
	-- use an index scan rather than an sequential table scan on cust_id
  INSERT INTO cmhead (
		cmhead_number,
		cmhead_posted,
		cmhead_invcnumber,
                cmhead_custponumber,
		cmhead_cust_id,
		cmhead_docdate,
		cmhead_shipto_id,
		cmhead_shipto_name,
		cmhead_shipto_address1,
		cmhead_shipto_address2,
		cmhead_shipto_address3,
		cmhead_shipto_city,
		cmhead_shipto_state,
		cmhead_shipto_zipcode,
		cmhead_shipto_country,
		cmhead_salesrep_id,
		cmhead_freight,
		cmhead_misc,
		cmhead_comments,
		cmhead_printed,
		cmhead_billtoname,
		cmhead_billtoaddress1,
		cmhead_billtoaddress2,
		cmhead_billtoaddress3,
		cmhead_billtocity,
		cmhead_billtostate,
		cmhead_billtozip,
		cmhead_billtocountry,
		cmhead_hold,
		cmhead_commission,
		cmhead_misc_accnt_id,
		cmhead_misc_descrip,
		cmhead_rsncode_id,
		cmhead_curr_id,
		cmhead_taxzone_id,
                cmhead_gldistdate,
                cmhead_rahead_id
		)
	 SELECT
		(CASE -- use a case here so we don't unnecessarily fetch a new CM number
			WHEN pNew.memo_number IS NULL THEN fetchCMNumber()
			ELSE pNew.memo_number
		END),
		FALSE, -- posted
		pNew.apply_to,
		pNew.customer_po_number,
		cust_id,
		COALESCE(pNew.memo_date, CURRENT_DATE),
		COALESCE(shipto_id,-1),
		pNew.shipto_name,
		pNew.shipto_address1,
		pNew.shipto_address2,
		pNew.shipto_address3,
		pNew.shipto_city,
		pNew.shipto_state,
		pNew.shipto_postal_code,
		pNew.shipto_country,
		COALESCE(getSalesRepId(pNew.sales_rep),shipto_salesrep_id,cust_salesrep_id),
		COALESCE(pNew.freight, 0),
		COALESCE(pNew.misc_charge_amount, 0),
		pNew.notes,
		FALSE, -- printed
		COALESCE(pNew.billto_name, invchead_billto_name, cust_name),
		COALESCE(pNew.billto_address1, invchead_billto_address1, addr_line1),
		COALESCE(pNew.billto_address2, invchead_billto_address2, addr_line2),
		COALESCE(pNew.billto_address3, invchead_billto_address3, addr_line3),
		COALESCE(pNew.billto_city, invchead_billto_city, addr_city),
		COALESCE(pNew.billto_state, invchead_billto_state, addr_state),
		COALESCE(pNew.billto_postal_code, invchead_billto_zipcode, addr_postalcode),
		COALESCE(pNew.billto_country, invchead_billto_country, addr_country),
		COALESCE(pNew.on_hold, FALSE),
		COALESCE(pNew.commission, 0),
		COALESCE(getGlAccntId(pNew.misc_charge_credit_account),-1),
		pNew.misc_charge_description,
		(SELECT rsncode_id FROM rsncode WHERE rsncode_code = pNew.reason_code),
		COALESCE(getCurrId(pNew.currency),cust_curr_id,basecurrid()),
                CASE WHEN pNew.tax_zone = 'None' THEN NULL
                     ELSE COALESCE(getTaxZoneID(pNew.tax_zone),cust_taxzone_id)
                END,
                NULL,
                NULL
	FROM custinfo
		LEFT OUTER JOIN shiptoinfo ON (shipto_id=(SELECT CASE
			WHEN getShiptoId(pNew.customer_number,pNew.shipto_number) IS NOT NULL
				THEN getShiptoId(pNew.customer_number,pNew.shipto_number)
			ELSE (SELECT shipto_id FROM shiptoinfo WHERE shipto_cust_id=cust_id AND shipto_default)
		END))
                LEFT OUTER JOIN invchead ON (invchead_id=getInvcheadId(pNEW.apply_to))
                LEFT OUTER JOIN cntct ON (cntct_id=cust_cntct_id)
                LEFT OUTER JOIN addr ON (addr_id=cntct_addr_id)
	WHERE cust_id = (CASE
		WHEN pNew.customer_number IS NOT NULL THEN (SELECT getCustId(pNew.customer_number))
		ELSE (SELECT invchead_cust_id FROM invchead WHERE invchead_invcnumber = pNew.apply_to)
	END);
	RETURN TRUE;
END;
$insertCreditMemo$ LANGUAGE 'plpgsql';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
	ON INSERT TO api.creditmemo DO INSTEAD
		SELECT insertCreditMemo(NEW);


CREATE OR REPLACE RULE "_UPDATE" AS 
	ON UPDATE TO api.creditmemo DO INSTEAD
	UPDATE cmhead SET
		cmhead_custponumber=NEW.customer_po_number,
		cmhead_docdate=NEW.memo_date,
		cmhead_shipto_id=COALESCE(getShiptoId(NEW.customer_number,NEW.shipto_number),-1),
		cmhead_shipto_name=NEW.shipto_name,
		cmhead_shipto_address1=NEW.shipto_address1,
		cmhead_shipto_address2=NEW.shipto_address2,
		cmhead_shipto_address3=NEW.shipto_address3,
		cmhead_shipto_city=NEW.shipto_city,
		cmhead_shipto_state=NEW.shipto_state,
		cmhead_shipto_zipcode=NEW.shipto_postal_code,
		cmhead_shipto_country=NEW.shipto_country,
		cmhead_salesrep_id=getSalesRepId(NEW.sales_rep),
		cmhead_freight=COALESCE(NEW.freight,0),
		cmhead_misc=COALESCE(NEW.misc_charge_amount,0),
		cmhead_comments=NEW.notes,
		cmhead_billtoname=NEW.billto_name,
		cmhead_billtoaddress1=NEW.billto_address1,
		cmhead_billtoaddress2=NEW.billto_address2,
		cmhead_billtoaddress3=NEW.billto_address3,
		cmhead_billtocity=NEW.billto_city,
		cmhead_billtostate=NEW.billto_state,
		cmhead_billtozip=NEW.billto_postal_code,
		cmhead_billtocountry=NEW.billto_country,
		cmhead_hold=COALESCE(NEW.on_hold,FALSE),
		cmhead_commission=COALESCE(NEW.commission,0),
		cmhead_misc_accnt_id=COALESCE(getGlAccntId(NEW.misc_charge_credit_account),-1),
		cmhead_misc_descrip=NEW.misc_charge_description,
		cmhead_rsncode_id=(SELECT rsncode_id FROM rsncode WHERE rsncode_code = NEW.reason_code),
		cmhead_curr_id=COALESCE(getCurrId(NEW.currency),-1),
		cmhead_taxzone_id=getTaxZoneId(NULLIF(NEW.tax_zone, 'None'))
	WHERE (cmhead_number=OLD.memo_number)
		AND (cmhead_posted = FALSE);


CREATE OR REPLACE RULE "_DELETE" AS 
	ON DELETE TO api.creditmemo DO INSTEAD
	
	SELECT deleteCreditMemo(cmhead_id)
	FROM cmhead
	WHERE cmhead_number = OLD.memo_number AND cmhead_posted = FALSE;
