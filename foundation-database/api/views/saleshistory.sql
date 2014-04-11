  --Sales History View

  SELECT dropIfExists('VIEW', 'saleshistory', 'api');
  CREATE OR REPLACE VIEW api.saleshistory AS

  SELECT
    cust_number AS customer_number,
    item_number,
    warehous_code AS site_code,
    cohist_shipdate AS ship_date,
    cohist_shipvia AS ship_via,
    cohist_ordernumber AS order_number,
    cohist_ponumber AS purchase_order_number,
    cohist_orderdate AS order_date,
    cohist_invcnumber AS invoice_number,
    cohist_invcdate AS invoice_date,
    cohist_qtyshipped AS quantity_shipped,
    cohist_unitprice AS unit_price,
    shipto_num AS shipto_number,
    salesrep_number AS sales_rep,
    cohist_duedate AS due_date,
    cohist_promisedate AS promise_date,
    cohist_imported AS imported,
    cohist_billtoname AS billto_name,
    cohist_billtoaddress1 AS billto_address1,
    cohist_billtoaddress2 AS billto_address2,
    cohist_billtoaddress3 AS billto_address3,
    cohist_billtocity AS billto_city,
    cohist_billtostate AS billto_state,
    cohist_billtozip AS billto_zip,
    cohist_shiptoname AS shipto_name,
    cohist_shiptoaddress1 AS shipto_address1,
    cohist_shiptoaddress2 AS shipto_address2,
    cohist_shiptoaddress3 AS shipto_address3,
    cohist_shiptocity AS shipto_city,
    cohist_shiptostate AS shipto_state,
    cohist_shiptozip AS shipto_zip,
    cohist_commission AS commission,
    cohist_commissionpaid AS commission_paid,
    cohist_unitcost AS unit_cost,
    CASE
      WHEN cohist_misc_type IS NULL THEN
        ''
      WHEN cohist_misc_type = 'M' THEN
        'Misc. Charge'
      WHEN cohist_misc_type = 'F' THEN
        'Freight'
      ELSE
        'Unknown'
     END AS misc_type,
    cohist_misc_descrip AS misc_description,
    CASE
      WHEN cohist_misc_id IS NULL THEN
        ''
      WHEN cohist_misc_type = 'M' THEN
        formatglaccount(cohist_misc_id)
      ELSE
        'Unknown'
    END AS misc_info,
    taxzone_code AS tax_zone,
    taxtype_name AS tax_type,
    CASE
      WHEN cohist_doctype = 'I' THEN
        'Invoice'
      WHEN cohist_doctype = 'C' THEN
        'Credit Memo'
      ELSE
        'Unknown'
    END AS document_type,
    curr_abbr AS currency,
    cohist_sequence AS gl_sequence,
    (SELECT SUM(taxhist_tax)
     FROM cohisttax
     WHERE (taxhist_parent_id=cohist_id)) AS tax
  FROM cohist
    LEFT OUTER JOIN custinfo ON (cohist_cust_id=cust_id)
    LEFT OUTER JOIN shiptoinfo ON (cohist_shipto_id=shipto_id)
    LEFT OUTER JOIN taxzone ON (cohist_taxzone_id=taxzone_id)
    LEFT OUTER JOIN taxtype ON (cohist_taxtype_id=taxtype_id)
    LEFT OUTER JOIN salesrep ON (cohist_salesrep_id=salesrep_id)
    LEFT OUTER JOIN itemsite ON (cohist_itemsite_id=itemsite_id)
    LEFT OUTER JOIN item ON (itemsite_item_id=item_id)
    LEFT OUTER JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
    LEFT OUTER JOIN curr_symbol ON (cohist_curr_id=curr_id);

GRANT ALL ON TABLE api.saleshistory TO xtrole;
COMMENT ON VIEW api.saleshistory IS 'Sales History';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.saleshistory DO INSTEAD

  INSERT INTO cohist (
    cohist_cust_id,
    cohist_itemsite_id,
    cohist_shipdate,
    cohist_shipvia,
    cohist_ordernumber,
    cohist_orderdate,
    cohist_invcnumber,
    cohist_invcdate,
    cohist_qtyshipped,
    cohist_unitprice,
    cohist_shipto_id,
    cohist_salesrep_id,
    cohist_duedate,
    cohist_imported,
    cohist_billtoname,
    cohist_billtoaddress1,
    cohist_billtoaddress2,
    cohist_billtoaddress3,
    cohist_billtocity,
    cohist_billtostate,
    cohist_billtozip,
    cohist_shiptoname,
    cohist_shiptoaddress1,
    cohist_shiptoaddress2,
    cohist_shiptoaddress3,
    cohist_shiptocity,
    cohist_shiptostate,
    cohist_shiptozip,
    cohist_commission,
    cohist_commissionpaid,
    cohist_unitcost,
    cohist_misc_type,
    cohist_misc_descrip,
    cohist_misc_id,
    cohist_doctype,
    cohist_promisedate,
    cohist_ponumber,
    cohist_curr_id,
    cohist_sequence,
    cohist_taxzone_id,
    cohist_taxtype_id )
  VALUES (
    getCustId(NEW.customer_number),
    getItemsiteId(NEW.site_code,NEW.item_number),
    NEW.ship_date,
    NEW.ship_via,
    NEW.order_number,
    NEW.order_date,
    NEW.invoice_number,
    NEW.invoice_date,
    NEW.quantity_shipped,
    COALESCE(NEW.unit_price,0),
    getShiptoId(NEW.customer_number,NEW.shipto_number),
    getSalesRepId(NEW.sales_rep),
    NEW.due_date,
    TRUE,
    NEW.billto_name,
    NEW.billto_address1,
    NEW.billto_address2,
    NEW.billto_address3,
    NEW.billto_city,
    NEW.billto_state,
    NEW.billto_zip,
    NEW.shipto_name,
    NEW.shipto_address1,
    NEW.shipto_address2,
    NEW.shipto_address3,
    NEW.shipto_city,
    NEW.shipto_state,
    NEW.shipto_zip,
    COALESCE(NEW.commission,0),
    COALESCE(NEW.commission_paid,false),
    COALESCE(NEW.unit_cost,0),
    CASE
      WHEN NEW.misc_type = 'Misc. Charge' THEN
        'M'
      WHEN NEW.misc_type = 'Freight' THEN
        'F'
    END,
    NEW.misc_description,
    CASE
      WHEN NEW.misc_type = 'Misc. Charge' THEN
        getGlAccntId(NEW.misc_info)
    END,
    CASE
      WHEN NEW.document_type = 'Invoice' THEN
        'I'
      WHEN NEW.document_type = 'Credit Memo' THEN
        'C'
    END,
    NEW.promise_date,
    NEW.purchase_order_number,
    COALESCE(getCurrId(NEW.currency),basecurrid()),
    NEW.gl_sequence,
    getTaxzoneId(NEW.tax_zone),
    getTaxtypeId(NEW.tax_type) );
 
  CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.saleshistory DO INSTEAD

  NOTHING;

  CREATE OR REPLACE RULE "_DELETE" AS
  ON DELETE TO api.saleshistory DO INSTEAD

  NOTHING;
