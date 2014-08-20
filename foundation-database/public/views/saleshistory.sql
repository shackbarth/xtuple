SELECT dropIfExists('view', 'saleshistory');
CREATE VIEW saleshistory AS
SELECT *,
       round((cohist_qtyshipped * cohist_unitprice), 2) AS extprice,
       round((cohist_qtyshipped * baseunitprice), 2) AS baseextprice,
       round((cohist_qtyshipped * custunitprice), 2) AS custextprice,
       round((cohist_qtyshipped * cohist_unitcost), 4) AS extcost,
       round((cohist_qtyshipped * baseunitprice) - (cohist_qtyshipped * cohist_unitcost), 2) AS margin,
       CASE WHEN (cohist_qtyshipped * baseunitprice > 0.0) THEN
            (round((cohist_qtyshipped * baseunitprice) - (cohist_qtyshipped * cohist_unitcost), 2) /
             round((cohist_qtyshipped * baseunitprice), 2))
            ELSE 0.0
       END AS marginpercent,
       currConcat(cohist_curr_id) AS currAbbr,
       'qty'::TEXT AS cohist_qtyshipped_xtnumericrole,
       'salesprice'::TEXT AS cohist_unitprice_xtnumericrole,
       'salesprice'::TEXT AS baseunitprice_xtnumericrole,
       'curr'::TEXT AS custunitprice_xtnumericrole,
       'curr'::TEXT AS custextprice_xtnumericrole,
       'curr'::TEXT AS extprice_xtnumericrole,
       'curr'::TEXT AS baseextprice_xtnumericrole,
       'cost'::TEXT AS cohist_unitcost_xtnumericrole,
       'curr'::TEXT AS extcost_xtnumericrole,
       'curr'::TEXT AS margin_xtnumericrole,
       'percent'::TEXT AS marginpercent_xtnumericrole,
       'curr'::TEXT AS cohist_commission_xtnumericrole,
       'curr'::TEXT AS basecommission_xtnumericrole
FROM (
SELECT cohist.*,
       COALESCE(cohead_id,-1) AS cohead_id,
       cust_id, cust_number, cust_name, cust_curr_id,
       custtype_id, custtype_code, custtype_descrip,
       salesrep_id, salesrep_number, salesrep_name,
       shipzone_id, shipzone_name, shipzone_descrip,
       saletype_code, saletype_descr,
       itemsite_id,
       warehous_id, warehous_code, warehous_descrip,
       item_id, item_number, item_descrip1, item_descrip2,
       (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
       COALESCE(item_number, cohist_misc_descrip) AS itemnumber,
       prodcat_id, prodcat_code,
       currtobase(cohist_curr_id, cohist_commission, cohist_invcdate) AS basecommission,
       currtobase(cohist_curr_id, cohist_unitprice, cohist_invcdate) AS baseunitprice,
       currtocurr(cohist_curr_id, cust_curr_id, cohist_unitprice, cohist_invcdate) AS custunitprice
FROM cohist JOIN custinfo ON (cust_id=cohist_cust_id)
            LEFT OUTER JOIN cohead ON (cohead_number=cohist_ordernumber)
            LEFT OUTER JOIN custtype ON (custtype_id=cust_custtype_id)
            LEFT OUTER JOIN salesrep ON (salesrep_id=cohist_salesrep_id)
            LEFT OUTER JOIN shiptoinfo ON (shipto_id=cohist_shipto_id)
            LEFT OUTER JOIN shipzone ON (shipzone_id=shipto_shipzone_id)
            LEFT OUTER JOIN saletype ON (saletype_id=cohist_saletype_id)
            JOIN itemsite ON (itemsite_id=cohist_itemsite_id)
            JOIN site() ON (warehous_id=itemsite_warehous_id)
            JOIN item ON (item_id=itemsite_item_id)
            JOIN prodcat ON (prodcat_id=item_prodcat_id)
     ) AS data;

REVOKE ALL ON TABLE saleshistory FROM PUBLIC;
GRANT  ALL ON TABLE saleshistory TO GROUP xtrole;

COMMENT ON VIEW saleshistory IS 'Single point for sales history calculations.'
;
