-- SalesOrder
SELECT dropIfExists('VIEW', 'salesorder', 'api');

CREATE VIEW api.salesorder
AS
   SELECT 
     cohead_number::varchar AS order_number,
     warehous_code AS site,
     cohead_orderdate AS order_date,
     cohead_packdate AS pack_date,
     saletype_code AS sale_type,
     salesrep_number AS sales_rep,
     cohead_commission AS commission,
     COALESCE(taxzone_code,'None') AS tax_zone,
     terms_code AS terms,
     prj_number AS project_number,
     cust_number AS customer_number,
     bc.cntct_number AS billto_contact_number,
     cohead_billto_cntct_honorific AS billto_contact_name,
     cohead_billto_cntct_first_name AS billto_contact_first,
     cohead_billto_cntct_middle AS billto_contact_middle,
     cohead_billto_cntct_last_name AS billto_contact_last,
     cohead_billto_cntct_suffix AS billto_contact_suffix,
     cohead_billto_cntct_phone AS billto_contact_phone,
     cohead_billto_cntct_title AS billto_contact_title,
     cohead_billto_cntct_fax AS billto_contct_fax,
     cohead_billto_cntct_email AS billto_contact_email,
     cohead_billtoname AS billto_name,
     cohead_billtoaddress1 AS billto_address1,
     cohead_billtoaddress2 AS billto_address2,
     cohead_billtoaddress3 AS billto_address3,
     cohead_billtocity AS billto_city,
     cohead_billtostate AS billto_state,
     cohead_billtozipcode AS billto_postal_code,
     cohead_billtocountry AS billto_country,
     shipto_num AS shipto_number,
     sc.cntct_number AS shipto_contact_number,
     cohead_shipto_cntct_honorific AS shipto_contact_honorific,
     cohead_shipto_cntct_first_name AS shipto_contact_first,
     cohead_shipto_cntct_middle AS shipto_contact_middle,
     cohead_shipto_cntct_last_name AS shipto_contact_last,
     cohead_shipto_cntct_suffix AS shipto_contact_suffix,
     cohead_shipto_cntct_phone AS shipto_contact_phone,
     cohead_shipto_cntct_title AS shipto_contact_title,
     cohead_shipto_cntct_fax AS shipto_contact_fax,
     cohead_shipto_cntct_email AS shipto_contact_email,
     cohead_shiptoname AS shipto_name,
     cohead_shiptophone AS shipto_phone,
     cohead_shiptoaddress1 AS shipto_address1,
     cohead_shiptoaddress2 AS shipto_address2,
     cohead_shiptoaddress3 AS shipto_address3,
     cohead_shiptocity AS shipto_city,
     cohead_shiptostate AS shipto_state,
     cohead_shiptozipcode AS shipto_postal_code,
     cohead_shiptocountry AS shipto_country,
     shipzone_name AS shipto_shipzone,
     cohead_custponumber AS cust_po_number,
     cohead_fob AS fob,
     cohead_shipvia AS ship_via,
     CASE
       WHEN cohead_holdtype = 'N' THEN
         'None'
       WHEN cohead_holdtype = 'C' THEN
         'Credit'
       WHEN cohead_holdtype = 'S' THEN
         'Shipping'
       WHEN cohead_holdtype = 'P' THEN
         'Packing'
       WHEN cohead_holdtype = 'R' THEN
         'Return'
       ELSE
         'Error'
     END AS hold_type,
     shipchrg_name AS shipping_chgs,
     shipform_name AS shipping_form,
     cohead_shipcomplete AS ship_complete,
     curr_abbr AS currency,
     cohead_misc_descrip AS misc_charge_description,
     CASE
       WHEN (cohead_misc_accnt_id IS NULL) THEN
         NULL
       ELSE
         formatglaccount(cohead_misc_accnt_id) 
     END AS misc_account_number,
     cohead_misc AS misc_charge,
     cohead_freight AS freight,
     cohead_calcfreight AS calculate_freight,
     cohead_ordercomments AS order_notes,
     cohead_shipcomments AS shipping_notes,
     false AS add_to_packing_list_batch
   FROM cohead
     LEFT OUTER JOIN cntct bc ON (cohead_billto_cntct_id=bc.cntct_id)
     LEFT OUTER JOIN cntct sc ON (cohead_shipto_cntct_id=sc.cntct_id)
     LEFT OUTER JOIN whsinfo ON (cohead_warehous_id=warehous_id)
     LEFT OUTER JOIN prj ON (cohead_prj_id=prj_id)
     LEFT OUTER JOIN shiptoinfo ON (cohead_shipto_id=shipto_id)
     LEFT OUTER JOIN shipchrg ON (cohead_shipchrg_id=shipchrg_id)
     LEFT OUTER JOIN taxzone ON (cohead_taxzone_id=taxzone_id)
     LEFT OUTER JOIN saletype ON (cohead_saletype_id=saletype_id)
     LEFT OUTER JOIN shipzone ON (cohead_shipzone_id=shipzone_id),
     custinfo,shipform,salesrep,terms,curr_symbol
   WHERE ((cohead_cust_id=cust_id)
   AND (cohead_shipform_id=shipform_id)
   AND (cohead_salesrep_id=salesrep_id)
   AND (cohead_terms_id=terms_id)
   AND (cohead_curr_id=curr_id));

GRANT ALL ON TABLE api.salesorder TO xtrole;
COMMENT ON VIEW api.salesorder IS 'Sales Order';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.salesorder DO INSTEAD

  INSERT INTO cohead (
    cohead_number,
    cohead_cust_id,
    cohead_custponumber,
    cohead_orderdate,
    cohead_warehous_id,
    cohead_shipto_id,
    cohead_shiptoname,
    cohead_shiptoaddress1,
    cohead_shiptoaddress2,
    cohead_shiptoaddress3,
    cohead_salesrep_id,
    cohead_terms_id,
    cohead_fob,
    cohead_shipvia,
    cohead_shiptocity,
    cohead_shiptostate,
    cohead_shiptozipcode,
    cohead_freight,
    cohead_calcfreight,
    cohead_misc,
    cohead_imported,
    cohead_ordercomments,
    cohead_shipcomments,
    cohead_shiptophone,
    cohead_shipchrg_id,
    cohead_shipform_id,
    cohead_billtoname,
    cohead_billtoaddress1,
    cohead_billtoaddress2,
    cohead_billtoaddress3,
    cohead_billtocity,
    cohead_billtostate,
    cohead_billtozipcode,
    cohead_misc_accnt_id,
    cohead_misc_descrip,
    cohead_commission,
    cohead_holdtype,
    cohead_packdate,
    cohead_prj_id,
    cohead_shipcomplete,
    cohead_billtocountry,
    cohead_shiptocountry,
    cohead_curr_id,
    cohead_taxzone_id,
    cohead_shipto_cntct_id,
    cohead_shipto_cntct_honorific,
    cohead_shipto_cntct_first_name,
    cohead_shipto_cntct_middle,
    cohead_shipto_cntct_last_name,
    cohead_shipto_cntct_suffix,
    cohead_shipto_cntct_phone,
    cohead_shipto_cntct_title,
    cohead_shipto_cntct_fax,
    cohead_shipto_cntct_email,
    cohead_billto_cntct_id,
    cohead_billto_cntct_honorific,
    cohead_billto_cntct_first_name,
    cohead_billto_cntct_middle,
    cohead_billto_cntct_last_name,
    cohead_billto_cntct_suffix,
    cohead_billto_cntct_phone,
    cohead_billto_cntct_title,
    cohead_billto_cntct_fax,
    cohead_billto_cntct_email,
    cohead_saletype_id,
    cohead_shipzone_id
    )
  SELECT
    NEW.order_number,
    getCustId(NEW.customer_number),
    NEW.cust_po_number,
    NEW.order_date,
    getWarehousId(NEW.site,'SHIPPING'),
    getShiptoId(NEW.customer_number,NEW.shipto_number),
    NEW.shipto_name,
    NEW.shipto_address1,
    NEW.shipto_address2,
    NEW.shipto_address3,
    getSalesRepId(NEW.sales_rep),
    getTermsId(NEW.terms),
    NEW.fob,
    NEW.ship_via,
    NEW.shipto_city,
    NEW.shipto_state,
    NEW.shipto_postal_code,
    CASE WHEN (COALESCE(NEW.calculate_freight, fetchMetricBool('CalculateFreight'))) THEN 0
         ELSE
           NEW.freight
    END,
    COALESCE(NEW.calculate_freight, fetchMetricBool('CalculateFreight')),
    NEW.misc_charge,
    true,
    NEW.order_notes,
    NEW.shipping_notes,
    NEW.shipto_phone,
    getShipChrgId(NEW.shipping_chgs),
    getShipFormId(NEW.shipping_form),
    NEW.billto_name,
    NEW.billto_address1,
    NEW.billto_address2,
    NEW.billto_address3,
    NEW.billto_city,
    NEW.billto_state,
    NEW.billto_postal_code,
    getGlAccntId(NEW.misc_account_number),
    NEW.misc_charge_description,
    NEW.commission,
    CASE
      WHEN NEW.hold_type = 'Credit' THEN
        'C'
      WHEN NEW.hold_type = 'Shipping' THEN
        'S'
      WHEN NEW.hold_type = 'Packing' THEN
        'P'
      ELSE
        'N'
    END,
    NEW.pack_date,
    getPrjId(NEW.project_number),
    NEW.ship_complete,
    NEW.billto_country,
    NEW.shipto_country,
    getCurrId(NEW.currency),
    CASE 
      WHEN NEW.tax_zone = 'None' THEN
        -1
      ELSE 
        getTaxZoneId(NEW.tax_zone)
    END,
    getCntctId(NEW.shipto_contact_number),
    NEW.shipto_contact_honorific,
    NEW.shipto_contact_first,
    NEW.shipto_contact_middle,
    NEW.shipto_contact_last,
    NEW.shipto_contact_suffix,
    NEW.shipto_contact_phone,
    NEW.shipto_contact_title,
    NEW.shipto_contact_fax,
    NEW.shipto_contact_email,
    getCntctId(NEW.billto_contact_number),
    NEW.billto_contact_name,
    NEW.billto_contact_first,
    NEW.billto_contact_middle,
    NEW.billto_contact_last,
    NEW.billto_contact_suffix,
    NEW.billto_contact_phone,
    NEW.billto_contact_title,
    NEW.billto_contct_fax,
    NEW.billto_contact_email,
    getSaleTypeId(NEW.sale_type),
    getShipZoneId(NEW.shipto_shipzone)
   FROM custinfo
   WHERE (cust_number=NEW.customer_number);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.salesorder DO INSTEAD

  UPDATE cohead SET
    cohead_number=OLD.order_number,
    cohead_cust_id=getCustId(NEW.customer_number),
    cohead_custponumber=NEW.cust_po_number,
    cohead_orderdate=NEW.order_date,
    cohead_warehous_id=getWarehousId(NEW.site,'SHIPPING'),
    cohead_shipto_id=getShiptoId(NEW.customer_number,NEW.shipto_number),
    cohead_shiptoname=NEW.shipto_name,
    cohead_shiptoaddress1=NEW.shipto_address1,
    cohead_shiptoaddress2=NEW.shipto_address2,
    cohead_shiptoaddress3=NEW.shipto_address3,
    cohead_salesrep_id=getSalesRepId(NEW.sales_rep),
    cohead_terms_id=getTermsId(NEW.terms),
    cohead_fob=NEW.fob,
    cohead_shipvia=NEW.ship_via,
    cohead_shiptocity=NEW.shipto_city,
    cohead_shiptostate=NEW.shipto_state,
    cohead_shiptozipcode=NEW.shipto_postal_code,
    cohead_freight=
    CASE WHEN (NEW.calculate_freight) THEN
           COALESCE((SELECT SUM(freightdata_total) FROM freightDetail('SO',
                                                             getCoheadid(OLD.order_number),
                                                             getCustId(NEW.customer_number),
                                                             getShiptoId(NEW.customer_number,NEW.shipto_number),
                                                             NEW.order_date,
                                                             NEW.ship_via,
                                                             getCurrId(NEW.currency))),0)
         ELSE
           NEW.freight
    END,
    cohead_calcfreight=NEW.calculate_freight,
    cohead_misc=NEW.misc_charge,
    cohead_ordercomments=NEW.order_notes,
    cohead_shipcomments=NEW.shipping_notes,
    cohead_shiptophone=NEW.shipto_phone,
    cohead_shipchrg_id=getShipChrgId(NEW.shipping_chgs),
    cohead_shipform_id=getShipFormId(NEW.shipping_form),
    cohead_billtoname=NEW.billto_name,
    cohead_billtoaddress1=NEW.billto_address1,
    cohead_billtoaddress2=NEW.billto_address2,
    cohead_billtoaddress3=NEW.billto_address3,
    cohead_billtocity=NEW.billto_city,
    cohead_billtostate=NEW.billto_state,
    cohead_billtozipcode=NEW.billto_postal_code,
    cohead_misc_accnt_id=getGlAccntId(NEW.misc_account_number),
    cohead_misc_descrip=NEW.misc_charge_description,
    cohead_commission=NEW.commission,
    cohead_holdtype=
    CASE
      WHEN NEW.hold_type = 'Credit' THEN
        'C'
      WHEN NEW.hold_type = 'Shipping' THEN
        'S'
      WHEN NEW.hold_type = 'Packing' THEN
        'P'
      ELSE
        'N'
    END,
    cohead_packdate=NEW.pack_date,
    cohead_prj_id=getPrjId(NEW.project_number),
    cohead_shipcomplete=NEW.ship_complete,
    cohead_billtocountry=NEW.billto_country,
    cohead_shiptocountry=NEW.shipto_country,
    cohead_curr_id=getCurrId(NEW.currency),
    cohead_taxzone_id=getTaxZoneId(NEW.tax_zone),
    cohead_lastupdated=('now'::text)::timestamp(6) with time zone,
    cohead_shipto_cntct_id = getCntctId(NEW.shipto_contact_number),
    cohead_shipto_cntct_honorific = NEW.shipto_contact_honorific,
    cohead_shipto_cntct_first_name = NEW.shipto_contact_first,
    cohead_shipto_cntct_middle = NEW.shipto_contact_middle,
    cohead_shipto_cntct_last_name = NEW.shipto_contact_last,
    cohead_shipto_cntct_suffix = NEW.shipto_contact_suffix,
    cohead_shipto_cntct_phone = NEW.shipto_contact_phone,
    cohead_shipto_cntct_title = NEW.shipto_contact_title,
    cohead_shipto_cntct_fax = NEW.shipto_contact_fax,
    cohead_shipto_cntct_email = NEW.shipto_contact_email,
    cohead_billto_cntct_id = getCntctId(NEW.billto_contact_number),
    cohead_billto_cntct_honorific = NEW.billto_contact_name,
    cohead_billto_cntct_first_name = NEW.billto_contact_first,
    cohead_billto_cntct_middle = NEW.billto_contact_middle,
    cohead_billto_cntct_last_name = NEW.billto_contact_last,
    cohead_billto_cntct_suffix = NEW.billto_contact_suffix,
    cohead_billto_cntct_phone = NEW.billto_contact_phone,
    cohead_billto_cntct_title = NEW.billto_contact_title,
    cohead_billto_cntct_fax = NEW.billto_contct_fax,
    cohead_billto_cntct_email = NEW.billto_contact_email,
    cohead_saletype_id=getSaleTypeId(NEW.sale_type),
    cohead_shipzone_id=getShipZoneId(NEW.shipto_shipzone)
  WHERE (cohead_number=OLD.order_number);
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.salesorder DO INSTEAD

  SELECT deleteso(cohead_id,OLD.order_number)
  FROM cohead
  WHERE (cohead_number=OLD.order_number);
