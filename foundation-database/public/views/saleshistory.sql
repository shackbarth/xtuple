SELECT dropIfExists('view', 'saleshistory');
CREATE VIEW saleshistory AS
SELECT cohist.*,
       CASE WHEN (cohist_invcnumber='-1') THEN 'Credit'
            ELSE cohist_invcnumber
       END AS invoicenumber,
       cust_id, cust_number, cust_name, cust_curr_id, cust_custtype_id, custtype_code, custtype_descrip,
       salesrep_number, salesrep_name, shipzone_id, shipzone_name, shipzone_descrip,
       itemsite_warehous_id, itemsite_item_id,
       item_id, item_number, item_descrip1, (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
       item_prodcat_id, warehous_code, warehous_descrip, prodcat_code,
       currtobase(cohist_curr_id, cohist_commission, cohist_invcdate) AS basecommission,
       currtobase(cohist_curr_id, cohist_unitprice, cohist_invcdate) AS baseunitprice,
       currtocurr(cohist_curr_id, cust_curr_id, cohist_unitprice, cohist_invcdate) AS custunitprice,
       round((cohist_qtyshipped * cohist_unitprice), 2) AS extprice,
       round((cohist_qtyshipped * currtobase(cohist_curr_id, cohist_unitprice, cohist_invcdate)), 2) AS baseextprice,
       round((cohist_qtyshipped * currtocurr(cohist_curr_id, cust_curr_id, cohist_unitprice, cohist_invcdate)), 2) AS custextprice,
       round((cohist_qtyshipped * cohist_unitcost), 4) AS extcost,
       currConcat(cohist_curr_id) AS currAbbr,
       'Return'::TEXT AS cohist_invcdate_xtnullrole,
       'qty'::TEXT AS cohist_qtyshipped_xtnumericrole,
       'salesprice'::TEXT AS cohist_unitprice_xtnumericrole,
       'salesprice'::TEXT AS baseunitprice_xtnumericrole,
       'curr'::TEXT AS custunitprice_xtnumericrole,
       'curr'::TEXT AS custextprice_xtnumericrole,
       'curr'::TEXT AS extprice_xtnumericrole,
       'curr'::TEXT AS baseextprice_xtnumericrole,
       'cost'::TEXT AS cohist_unitcost_xtnumericrole,
       'curr'::TEXT AS extcost_xtnumericrole,
       'curr'::TEXT AS cohist_commission_xtnumericrole,
       'curr'::TEXT AS basecommission_xtnumericrole,
       0 AS cohist_qtyshipped_xttotalrole,
       0 AS custextprice_xttotalrole,
       0 AS baseextprice_xttotalrole,
       0 AS extcost_xttotalrole,
       0 AS basecommission_xttotalrole
FROM cohist JOIN custinfo ON (cust_id=cohist_cust_id)
            JOIN custtype ON (custtype_id=cust_custtype_id)
            JOIN salesrep ON (salesrep_id=cohist_salesrep_id)
            JOIN itemsite ON (itemsite_id=cohist_itemsite_id)
            JOIN site() ON (warehous_id=itemsite_warehous_id)
            JOIN item ON (item_id=itemsite_item_id)
            JOIN prodcat ON (prodcat_id=item_prodcat_id)
            LEFT OUTER JOIN shiptoinfo ON (shipto_id=cohist_shipto_id)
            LEFT OUTER JOIN shipzone ON (shipzone_id=shipto_shipzone_id);

REVOKE ALL ON TABLE saleshistory FROM PUBLIC;
GRANT  ALL ON TABLE saleshistory TO GROUP xtrole;

COMMENT ON VIEW saleshistory IS 'Single point for sales history calculations.'
;
