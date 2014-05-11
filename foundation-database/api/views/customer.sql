
  --Customer View

  SELECT dropIfExists('VIEW', 'customer', 'api');
  CREATE OR REPLACE VIEW api.customer AS
 
  SELECT 
    cust_number::varchar AS customer_number,
    custtype_code AS customer_type,
    cust_name AS customer_name,
    cust_active AS active,
    salesrep_number AS sales_rep,
    cust_commprcnt * 100 AS commission,
    cust_shipvia AS ship_via,
    shipform_name AS ship_form,
    shipchrg_name AS shipping_charges,
    cust_backorder AS accepts_backorders,
    cust_partialship AS accepts_partial_shipments,
    cust_ffshipto AS allow_free_form_shipto,
    cust_ffbillto AS allow_free_form_billto,
    warehous_code AS preferred_selling_site,
    taxzone_code AS default_tax_zone,
    terms_code AS default_terms,
    CASE 
      WHEN cust_balmethod='B' THEN
       'Balance Forward'
      ELSE
       'Open Item'
      END AS balance_method,
    cust_discntprcnt AS default_discount,
    dc.curr_abbr AS default_currency,
    clc.curr_abbr AS credit_limit_currency,
    cust_creditlmt AS credit_limit,
    CASE
      WHEN (COALESCE(cust_gracedays, 0) > 0) THEN cust_gracedays
    END AS alternate_grace_days,
    cust_creditrating AS credit_rating,
    CASE
      WHEN (cust_creditstatus = 'G') THEN
        'In Good Standing'
      WHEN (cust_creditstatus = 'W') THEN
        'On Credit Warning'
      ELSE
        'On Credit Hold'
    END AS credit_status,
    cust_autoupdatestatus AS credit_status_exceed_warn,
    cust_autoholdorders AS credit_status_exceed_hold,
    cust_usespos AS uses_purchase_orders,
    cust_blanketpos AS uses_blanket_pos,
    mc.cntct_number AS billing_contact_number,
    mc.cntct_honorific AS billing_contact_honorific,
    mc.cntct_first_name AS billing_contact_first,
    mc.cntct_middle AS billing_contact_middle,   
    mc.cntct_last_name AS billing_contact_last,
    mc.cntct_suffix AS billing_contact_suffix,
    mc.cntct_title AS billing_contact_job_title,
    mc.cntct_phone AS billing_contact_voice,
    mc.cntct_phone2 AS billing_contact_alternate,
    mc.cntct_fax AS billing_contact_fax,
    mc.cntct_email AS billing_contact_email,
    mc.cntct_webaddr AS billing_contact_web,
    (''::TEXT) AS billing_contact_change,
    m.addr_number AS billing_contact_address_number,
    m.addr_line1 AS billing_contact_address1,
    m.addr_line2 AS billing_contact_address2,
    m.addr_line3 AS billing_contact_address3,
    m.addr_city AS billing_contact_city,
    m.addr_state AS billing_contact_state,
    m.addr_postalcode AS billing_contact_postalcode,
    m.addr_country AS billing_contact_country,
    (''::TEXT) AS billing_contact_address_change,
    cc.cntct_number AS correspond_contact_number,
    cc.cntct_honorific AS correspond_contact_honorific,
    cc.cntct_first_name AS correspond_contact_first,
    cc.cntct_middle AS correspond_contact_middle,
    cc.cntct_last_name AS correspond_contact_last,
    cc.cntct_suffix AS correspond_contact_suffix,
    cc.cntct_title AS correspond_contact_job_title,
    cc.cntct_phone AS correspond_contact_voice,
    cc.cntct_phone2 AS correspond_contact_alternate,
    cc.cntct_fax AS correspond_contact_fax,
    cc.cntct_email AS correspond_contact_email,
    cc.cntct_webaddr AS correspond_contact_web,
    (''::TEXT) AS correspond_contact_change,
    c.addr_number AS correspond_contact_address_number,
    c.addr_line1 AS correspond_contact_address1,
    c.addr_line2 AS correspond_contact_address2,
    c.addr_line3 AS correspond_contact_address3,
    c.addr_city AS correspond_contact_city,
    c.addr_state AS correspond_contact_state,
    c.addr_postalcode AS correspond_contact_postalcode,
    c.addr_country AS correspond_contact_country,
    (''::TEXT) AS correspond_contact_address_change,
    cust_comments AS notes         
  FROM
    custinfo
      LEFT OUTER JOIN shipchrg ON (cust_shipchrg_id=shipchrg_id)
      LEFT OUTER JOIN whsinfo ON (cust_preferred_warehous_id=warehous_id)
      LEFT OUTER JOIN cntct mc ON (cust_cntct_id=mc.cntct_id)
      LEFT OUTER JOIN addr m ON (mc.cntct_addr_id=m.addr_id)
      LEFT OUTER JOIN cntct cc ON (cust_corrcntct_id=cc.cntct_id)
      LEFT OUTER JOIN addr c ON (cc.cntct_addr_id=c.addr_id)
      LEFT OUTER JOIN taxzone ON (cust_taxzone_id=taxzone_id)
      LEFT OUTER JOIN shipform ON (cust_shipform_id=shipform_id),
    custtype,salesrep,
    curr_symbol dc, curr_symbol clc, terms
  WHERE ((cust_custtype_id=custtype_id)
  AND (cust_salesrep_id=salesrep_id)
  AND (cust_curr_id=dc.curr_id)
  AND (cust_creditlmt_curr_id=clc.curr_id)
  AND (cust_terms_id=terms_id))
  ;

GRANT ALL ON TABLE api.customer TO xtrole;
COMMENT ON VIEW api.customer IS 'Customer';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.customer DO INSTEAD

INSERT INTO custinfo
	(cust_active,
	cust_custtype_id,
        cust_salesrep_id,
        cust_commprcnt,
        cust_name,
        cust_creditlmt,
  	cust_creditrating,
  	cust_backorder,
  	cust_partialship,
  	cust_terms_id,
	cust_discntprcnt,
  	cust_balmethod,
  	cust_ffshipto,
  	cust_shipform_id,
  	cust_shipvia,
  	cust_blanketpos,
  	cust_shipchrg_id,
  	cust_creditstatus,
  	cust_comments,
        cust_ffbillto,
        cust_usespos,
        cust_number,
        cust_autoupdatestatus,
        cust_autoholdorders,
        cust_preferred_warehous_id,
        cust_curr_id,
        cust_creditlmt_curr_id,
        cust_cntct_id,
        cust_corrcntct_id,
        cust_taxzone_id,
        cust_gracedays )
        VALUES (
	COALESCE(NEW.active,true),
	COALESCE(getcusttypeid(NEW.customer_type),FetchMetricValue('DefaultCustType')),
        COALESCE(getSalesRepId(NEW.sales_rep),FetchMetricValue('DefaultSalesRep')),
        COALESCE(NEW.commission * .01,(
          SELECT salesrep_commission
          FROM salesrep
          WHERE (salesrep_id=getSalesRepId(NEW.sales_rep)))),
        COALESCE(NEW.customer_name,''),
        COALESCE(NEW.credit_limit,FetchMetricValue('SOCreditLimit')),	
        COALESCE(NEW.credit_rating,FetchMetricText('SOCreditRate')),
        COALESCE(NEW.accepts_backorders,FetchMetricBool('DefaultBackOrders'),false),
        COALESCE(NEW.accepts_partial_shipments,FetchMetricBool('DefaultPartialShipments'::text),false),
        COALESCE(getTermsId(NEW.default_terms),FetchMetricValue('DefaultTerms')),
        COALESCE(NEW.default_discount,0),
	CASE 
	  WHEN NEW.balance_method='Balance Forward' THEN
	    'B'
	  WHEN NEW.balance_method='Open Items' THEN
	    'O'
          ELSE
            COALESCE(FetchMetricText('DefaultBalanceMethod'),'B')
	END,
        COALESCE(NEW.allow_free_form_shipto,FetchMetricBool('DefaultFreeFormShiptos'),false),
        COALESCE(getShipFormId(NEW.ship_form),FetchMetricValue('DefaultShipFormId')),
        COALESCE(NEW.ship_via,FetchDefaultShipVia()),
        COALESCE(NEW.uses_blanket_pos,false),
        COALESCE(getShipChrgId(NEW.shipping_charges),-1),
        CASE
	  WHEN (NEW.credit_status = 'On Credit Warning') THEN
	   'W'
	  WHEN (NEW.credit_status = 'On Credit Hold') THEN
	   'H'
         ELSE
           'G'
	END,
        COALESCE(NEW.notes,''),
        COALESCE(NEW.allow_free_form_billto,false),
        COALESCE(NEW.uses_purchase_orders,false),
        COALESCE(UPPER(NEW.customer_number),CAST(fetchCRMAccountNumber() AS text)),
        COALESCE(NEW.credit_status_exceed_warn,false),
        COALESCE(NEW.credit_status_exceed_hold,false),
        COALESCE(getWarehousId(NEW.preferred_selling_site,'ACTIVE'),-1),
        COALESCE(getCurrId(NEW.default_currency),basecurrid()),
        COALESCE(getCurrID(NEW.credit_limit_currency),basecurrid()),
        saveCntct(
          getCntctId(NEW.billing_contact_number,false),
          NEW.billing_contact_number,
          saveAddr(
            getAddrId(NEW.billing_contact_address_number),
            NEW.billing_contact_address_number,
            NEW.billing_contact_address1,
            NEW.billing_contact_address2,
            NEW.billing_contact_address3,
            NEW.billing_contact_city,
            NEW.billing_contact_state,
            NEW.billing_contact_postalcode,
            NEW.billing_contact_country,
            NEW.billing_contact_address_change),
          NEW.billing_contact_honorific,
          NEW.billing_contact_first,
          NEW.billing_contact_middle,
          NEW.billing_contact_last,
          NEW.billing_contact_suffix,
          NEW.billing_contact_voice,
          NEW.billing_contact_alternate,
          NEW.billing_contact_fax,
          NEW.billing_contact_email,
          NEW.billing_contact_web,
          NEW.billing_contact_job_title,
          NEW.billing_contact_change
          ),
        saveCntct(
          getCntctId(NEW.correspond_contact_number,false),
          NEW.correspond_contact_number,
          saveAddr(
            getAddrId(NEW.correspond_contact_address_number),
            NEW.correspond_contact_address_number,
            NEW.correspond_contact_address1,
            NEW.correspond_contact_address2,
            NEW.correspond_contact_address3,
            NEW.correspond_contact_city,
            NEW.correspond_contact_state,
            NEW.correspond_contact_postalcode,
            NEW.correspond_contact_country,
            NEW.correspond_contact_address_change),
          NEW.correspond_contact_honorific,
          NEW.correspond_contact_first,
          NEW.correspond_contact_middle,
          NEW.correspond_contact_last,
          NEW.correspond_contact_suffix,
          NEW.correspond_contact_voice,
          NEW.correspond_contact_alternate,
          NEW.correspond_contact_fax,
          NEW.correspond_contact_email,
          NEW.correspond_contact_web,
          NEW.correspond_contact_job_title,
          NEW.correspond_contact_change
          ),
        getTaxZoneId(NEW.default_tax_zone),
        CASE WHEN (COALESCE(NEW.alternate_grace_days, 0) > 0) THEN NEW.alternate_grace_days
             ELSE NULL
        END
         );

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.customer DO INSTEAD

UPDATE custinfo SET
	cust_active=NEW.active,
	cust_custtype_id=getCustTypeId(NEW.customer_type),
        cust_salesrep_id=getSalesRepId(NEW.sales_rep),
        cust_commprcnt=NEW.commission * .01,
        cust_name=NEW.customer_name,
        cust_creditlmt=NEW.credit_limit,
  	cust_creditrating=NEW.credit_rating,
  	cust_backorder=NEW.accepts_backorders,
  	cust_partialship=NEW.accepts_partial_shipments,
  	cust_terms_id=getTermsId(NEW.default_terms),
	cust_discntprcnt=NEW.default_discount,
  	cust_balmethod=
	  CASE 
	    WHEN NEW.balance_method='Balance Forward' THEN
	      'B'
	    WHEN NEW.balance_method='Open Items' THEN
	      'O'
            ELSE
              NULL
	  END,
  	cust_ffshipto=NEW.allow_free_form_shipto,
  	cust_shipform_id=getShipFormId(NEW.ship_form),
  	cust_shipvia=NEW.ship_via,
  	cust_blanketpos=NEW.uses_blanket_pos,
  	cust_shipchrg_id=COALESCE(getShipChrgId(NEW.shipping_charges),-1),
  	cust_creditstatus=
          CASE
	    WHEN (NEW.credit_status = 'On Credit Warning') THEN
	      'W'
	    WHEN (NEW.credit_status = 'On Credit Hold') THEN
	      'H'
            ELSE
              'G'
        END,
  	cust_comments=NEW.notes,
        cust_ffbillto=NEW.allow_free_form_billto,
        cust_usespos=NEW.uses_purchase_orders,
        cust_number=NEW.customer_number,
        cust_autoupdatestatus=NEW.credit_status_exceed_warn,
        cust_autoholdorders=NEW.credit_status_exceed_hold,
        cust_preferred_warehous_id=COALESCE(getWarehousId(NEW.preferred_selling_site,'ACTIVE'),-1),
        cust_curr_id=getCurrId(NEW.default_currency),
        cust_creditlmt_curr_id=getCurrId(NEW.credit_limit_currency),
        cust_cntct_id=saveCntct(
          getCntctId(NEW.billing_contact_number,false),
          NEW.billing_contact_number,
          saveAddr(
            getAddrId(NEW.billing_contact_address_number),
            NEW.billing_contact_address_number,
            NEW.billing_contact_address1,
            NEW.billing_contact_address2,
            NEW.billing_contact_address3,
            NEW.billing_contact_city,
            NEW.billing_contact_state,
            NEW.billing_contact_postalcode,
            NEW.billing_contact_country,
            NEW.billing_contact_address_change),
          NEW.billing_contact_honorific,
          NEW.billing_contact_first,
          NEW.billing_contact_middle,
          NEW.billing_contact_last,
          NEW.billing_contact_suffix,
          NEW.billing_contact_voice,
          NEW.billing_contact_alternate,
          NEW.billing_contact_fax,
          NEW.billing_contact_email,
          NEW.billing_contact_web,
          NEW.billing_contact_job_title,
          NEW.billing_contact_change
          ),
        cust_corrcntct_id=saveCntct(
          getCntctId(NEW.correspond_contact_number,false),
          NEW.correspond_contact_number,
          saveAddr(
            getAddrId(NEW.correspond_contact_address_number),
            NEW.correspond_contact_address_number,
            NEW.correspond_contact_address1,
            NEW.correspond_contact_address2,
            NEW.correspond_contact_address3,
            NEW.correspond_contact_city,
            NEW.correspond_contact_state,
            NEW.correspond_contact_postalcode,
            NEW.correspond_contact_country,
            NEW.correspond_contact_address_change),
          NEW.correspond_contact_honorific,
          NEW.correspond_contact_first,
          NEW.correspond_contact_middle,
          NEW.correspond_contact_last,
          NEW.correspond_contact_suffix,
          NEW.correspond_contact_voice,
          NEW.correspond_contact_alternate,
          NEW.correspond_contact_fax,
          NEW.correspond_contact_email,
          NEW.correspond_contact_web,
          NEW.correspond_contact_job_title,
          NEW.correspond_contact_change
          ),
        cust_taxzone_id=getTaxZoneId(NEW.default_tax_zone),
        cust_gracedays=
          CASE WHEN (COALESCE(NEW.alternate_grace_days, 0) > 0) THEN NEW.alternate_grace_days
          END
        WHERE cust_id=getCustId(OLD.customer_number);

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.customer DO INSTEAD
    DELETE FROM custinfo WHERE (cust_number=OLD.customer_number);

