CREATE OR REPLACE RULE "_INSERT" AS ON INSERT TO api.invoice DO INSTEAD NOTHING;
SELECT dropIfExists('FUNCTION', 'insertInvoice(api.invoice)');
SELECT dropIfExists('VIEW', 'invoice', 'api');
CREATE OR REPLACE VIEW api.invoice
AS
	SELECT
		invchead_invcnumber AS invoice_number,
		invchead_ordernumber AS order_number,
		invchead_invcdate AS invoice_date,
		invchead_shipdate AS ship_date,
		invchead_orderdate AS order_date,
                saletype_code AS sale_type,
		salesrep_number as sales_rep,
		invchead_commission AS commission,
		COALESCE(taxzone_code, 'None') AS tax_zone,
		terms_code AS terms,
		cust_number AS customer_number,
		invchead_billto_name AS billto_name,
		invchead_billto_address1 AS billto_address1,
		invchead_billto_address2 AS billto_address2,
		invchead_billto_address3 AS billto_address3,
		invchead_billto_city AS billto_city,
		invchead_billto_state AS billto_state,
		invchead_billto_zipcode AS billto_postal_code,
		invchead_billto_country AS billto_country,
		invchead_billto_phone AS billto_phone,
		shipto_num AS shipto_number,
		invchead_shipto_name AS shipto_name,
		invchead_shipto_address1 AS shipto_address1,
		invchead_shipto_address2 AS shipto_address2,
		invchead_shipto_address3 AS shipto_address3,
		invchead_shipto_city AS shipto_city,
		invchead_shipto_state AS shipto_state,
		invchead_shipto_zipcode AS shipto_postal_code,
		invchead_shipto_country AS shipto_country,
                shipzone_name AS shipto_shipzone,
		invchead_shipto_phone AS shipto_phone,
		invchead_ponumber AS po_number,
		invchead_shipvia AS ship_via,
		prj_number AS project_number,
		invchead_fob AS fob,
		invchead_misc_descrip AS misc_charge_description,
		invchead_misc_amount AS misc_charge,
		CASE
			WHEN invchead_misc_accnt_id = -1 THEN NULL
			ELSE formatglaccount(invchead_misc_accnt_id)
		END AS misc_charge_account_number,
		invchead_freight AS freight,
		curr.curr_abbr AS currency,
		invchead_payment AS payment,
		invchead_notes AS notes
	FROM invchead
		LEFT OUTER JOIN custinfo ON (cust_id=invchead_cust_id)
		LEFT OUTER JOIN shiptoinfo ON (shipto_id=invchead_shipto_id)
		LEFT OUTER JOIN prj ON (prj_id=invchead_prj_id)
		LEFT OUTER JOIN curr_symbol AS curr ON (curr.curr_id=invchead_curr_id)
		LEFT OUTER JOIN salesrep ON (salesrep_id=invchead_salesrep_id)
		LEFT OUTER JOIN terms ON (terms_id=invchead_terms_id)
		LEFT OUTER JOIN taxzone ON (taxzone_id=invchead_taxzone_id)
                LEFT OUTER JOIN saletype ON (invchead_saletype_id=saletype_id)
                LEFT OUTER JOIN shipzone ON (invchead_shipzone_id=shipzone_id)
;
	
GRANT ALL ON TABLE api.invoice TO xtrole;
COMMENT ON VIEW api.invoice IS '
This view can be used as an interface to import Invioce Header data directly  
into the system.  Required fields will be checked and default values will be 
populated';


CREATE OR REPLACE FUNCTION insertInvoice(api.invoice) RETURNS BOOLEAN AS
$insertInvoice$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
BEGIN
	-- NOTE: (SELECT getCustId(...)) seems redundant, but it actually produces
	-- a HUGE performance increase because it makes the Postgres query planner
	-- use an index scan rather than an sequential table scan on cust_id
	INSERT INTO invchead (
		invchead_invcnumber,
		invchead_ordernumber,
		invchead_invcdate,
		invchead_shipdate,
		invchead_orderdate,
		invchead_printed,
		invchead_posted,
		invchead_salesrep_id,
		invchead_commission,
		invchead_taxzone_id,
		invchead_terms_id,
		invchead_cust_id,
		invchead_billto_name,
		invchead_billto_address1,
		invchead_billto_address2,
		invchead_billto_address3,
		invchead_billto_city,
		invchead_billto_state,
		invchead_billto_zipcode,
		invchead_billto_country,
		invchead_billto_phone,
		invchead_shipto_id,
		invchead_shipto_name,
		invchead_shipto_address1,
		invchead_shipto_address2,
		invchead_shipto_address3,
		invchead_shipto_city,
		invchead_shipto_state,
		invchead_shipto_zipcode,
		invchead_shipto_country,
		invchead_shipto_phone,
		invchead_ponumber,
		invchead_shipvia,
		invchead_prj_id,
		invchead_fob,
		invchead_misc_descrip,
		invchead_misc_amount,
		invchead_misc_accnt_id,
		invchead_freight,
		invchead_curr_id,
		invchead_payment,
		invchead_notes,
                invchead_saletype_id,
                invchead_shipzone_id
	) SELECT
		(CASE -- use a case here so we don't unnecessarily fetch a new invoice number
			WHEN pNew.invoice_number IS NULL THEN CAST(fetchInvcNumber() AS TEXT)
			WHEN pNew.invoice_number = '' THEN CAST(fetchInvcNumber() AS TEXT)
			ELSE pNew.invoice_number
		END),
		pNew.order_number,
		COALESCE(pNew.invoice_date, CURRENT_DATE),
		pNew.ship_date,
		pNew.order_date,
		FALSE,
		FALSE,
		COALESCE(getSalesRepId(pNew.sales_rep),shipto_salesrep_id,cust_salesrep_id),
		COALESCE(pNew.commission, 0),
		CASE
			WHEN pNew.tax_zone = 'None' THEN NULL
			ELSE COALESCE(getTaxZoneId(pNew.tax_zone),shipto_taxzone_id,cust_taxzone_id)
		END,
		COALESCE(getTermsId(pNew.terms),cust_terms_id),
		(SELECT getCustId(pNew.customer_number)),
		COALESCE(pNew.billto_name, cohead_billtoname, cust_name),
		COALESCE(pNew.billto_address1, cohead_billtoaddress1, addr_line1),
		COALESCE(pNew.billto_address2, cohead_billtoaddress2, addr_line2),
		COALESCE(pNew.billto_address3, cohead_billtoaddress3, addr_line3),
		COALESCE(pNew.billto_city, cohead_billtocity, addr_city),
		COALESCE(pNew.billto_state, cohead_billtostate, addr_state),
		COALESCE(pNew.billto_postal_code, cohead_billtozipcode, addr_postalcode),
		COALESCE(pNew.billto_country, cohead_billtocountry, addr_country),
		COALESCE(pNew.billto_phone, ''),
		COALESCE(shipto_id,-1),
		pNew.shipto_name,
		pNew.shipto_address1,
		pNew.shipto_address2,
		pNew.shipto_address3,
		pNew.shipto_city,
		pNew.shipto_state,
		pNew.shipto_postal_code,
		pNew.shipto_country,
		pNew.shipto_phone,
		COALESCE(pNew.po_number, ''),
		COALESCE(pNew.ship_via,shipto_shipvia,cust_shipvia),
		COALESCE(getPrjId(pNew.project_number),-1),
		COALESCE(pNew.fob,fetchDefaultFob((
			SELECT CAST(usrpref_value AS INTEGER) 
			FROM usrpref, whsinfo
			WHERE ((warehous_id=CAST(usrpref_value AS INTEGER))
				AND (warehous_shipping)
				AND (warehous_active)
				AND (usrpref_username=getEffectiveXtUser())
				AND (usrpref_name='PreferredWarehouse')
			)
		))),
		pNew.misc_charge_description,
		COALESCE(pNew.misc_charge, 0),
		COALESCE(getGlAccntId(pNew.misc_charge_account_number),-1),
		COALESCE(pNew.freight, 0),
		COALESCE(getCurrId(pNew.currency),(
			SELECT cust_curr_id
			FROM custinfo
			WHERE (cust_id=(SELECT getCustId(pNew.customer_number)))
		),basecurrid()),
		COALESCE(pNew.payment,0),
		COALESCE(pNew.notes,''),
                getSaleTypeId(pNew.sale_type),
                getShipZoneId(pNew.shipto_shipzone)
	FROM custinfo
		LEFT OUTER JOIN shiptoinfo ON (shipto_id=(SELECT CASE
			WHEN getShiptoId(pNew.customer_number,pNew.shipto_number) IS NOT NULL
				THEN getShiptoId(pNew.customer_number,pNew.shipto_number)
			ELSE (SELECT shipto_id FROM shiptoinfo WHERE shipto_cust_id=cust_id AND shipto_default)
		END))
               LEFT OUTER JOIN cohead ON (cohead_number=pNEW.order_number)
               LEFT OUTER JOIN cntct ON (cntct_id=cust_cntct_id)
               LEFT OUTER JOIN addr ON (addr_id=cntct_addr_id)
	WHERE cust_id = (SELECT getCustId(pNew.customer_number));
	RETURN TRUE;
END;
$insertInvoice$ LANGUAGE 'plpgsql';


--Rules

CREATE OR REPLACE RULE "_INSERT" AS
	ON INSERT TO api.invoice DO INSTEAD
		SELECT insertInvoice(NEW);


CREATE OR REPLACE RULE "_UPDATE" AS 
	ON UPDATE TO api.invoice DO INSTEAD

	UPDATE invchead SET
		invchead_invcnumber=OLD.invoice_number,
		invchead_ordernumber=NEW.order_number,
		invchead_invcdate=NEW.invoice_date,
		invchead_shipdate=NEW.ship_date,
		invchead_orderdate=NEW.order_date,
		invchead_salesrep_id=getSalesRepId(NEW.sales_rep),
		invchead_commission=NEW.commission,
		invchead_taxzone_id=getTaxZoneId(NULLIF(NEW.tax_zone, 'None')),
		invchead_terms_id=getTermsId(NEW.terms),
		invchead_cust_id=(SELECT getCustId(NEW.customer_number)),
		invchead_billto_name=NEW.billto_name,
		invchead_billto_address1=NEW.billto_address1,
		invchead_billto_address2=NEW.billto_address2,
		invchead_billto_address3=NEW.billto_address3,
		invchead_billto_city=NEW.billto_city,
		invchead_billto_state=NEW.billto_state,
		invchead_billto_zipcode=NEW.billto_postal_code,
		invchead_billto_country=NEW.billto_country,
		invchead_billto_phone=NEW.billto_phone,
		invchead_shipto_id=COALESCE(getShiptoId(NEW.customer_number,NEW.shipto_number),-1),
		invchead_shipto_name=NEW.shipto_name,
		invchead_shipto_address1=NEW.shipto_address1,
		invchead_shipto_address2=NEW.shipto_address2,
		invchead_shipto_address3=NEW.shipto_address3,
		invchead_shipto_city=NEW.shipto_city,
		invchead_shipto_state=NEW.shipto_state,
		invchead_shipto_zipcode=NEW.shipto_postal_code,
		invchead_shipto_country=NEW.shipto_country,
		invchead_shipto_phone=NEW.shipto_phone,
		invchead_ponumber=NEW.po_number,
		invchead_shipvia=NEW.ship_via,
		invchead_prj_id=COALESCE(getPrjId(NEW.project_number),-1),
		invchead_fob=NEW.fob,
		invchead_misc_descrip=NEW.misc_charge_description,
		invchead_misc_amount=NEW.misc_charge,
		invchead_misc_accnt_id=COALESCE(getGlAccntId(NEW.misc_charge_account_number),-1),
		invchead_freight=NEW.freight,
		invchead_curr_id=COALESCE(getCurrId(NEW.currency),-1),
		invchead_payment=NEW.payment,
		invchead_notes=NEW.notes,
                invchead_saletype_id=getSaleTypeId(NEW.sale_type),
                invchead_shipzone_id=getShipZoneId(NEW.shipto_shipzone)
	WHERE (invchead_invcnumber=OLD.invoice_number)
		AND (invchead_posted = FALSE);


CREATE OR REPLACE RULE "_DELETE" AS 
	ON DELETE TO api.invoice DO INSTEAD
	
	SELECT deleteInvoice(invchead_id)
	FROM invchead
	WHERE invchead_invcnumber = OLD.invoice_number AND invchead_posted = FALSE;
