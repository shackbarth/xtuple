SELECT dropIfExists('view', 'creditMemoEditList'); 

CREATE VIEW creditMemoEditList AS
-- Total A/R
SELECT cmhead_id AS orderid, -2 AS itemid,
             ('C/M-' || formatCreditMemoNumber(cmhead_id)) AS documentnumber,
             cust_number,
             cmhead_billtoname AS billtoname,
             cmhead_number::TEXT AS ordernumber, -1 AS linenumber,
             '' AS item, '' AS itemdescrip, '' AS iteminvuom,
             '' AS qtytobill,
             '' AS price,
             formatMoney( calcCmheadAmt(cmhead_id) +
                          cmhead_freight +
                          cmhead_misc +
                          calcCmheadTax(cmhead_id) ) AS extprice,
             'Credit' AS sence,
             COALESCE( ( SELECT formatGLAccountLong(accnt_id)
                         FROM accnt
                         WHERE (accnt_id=findARAccount(cust_id)) ), 'Not Assigned') AS account
FROM custinfo, cmhead
WHERE ( (cmhead_cust_id=cust_id)
 AND (cmhead_cust_id=cust_id)
 AND (NOT cmhead_posted)
 AND (NOT cmhead_hold) )

-- Freight
UNION SELECT cmhead_id AS orderid, -1 AS itemid,
             '' AS documentnumber,
             '' AS cust_number,
             '' AS billtoname,
             cmhead_number::TEXT AS ordernumber,
             -1 AS linenumber,
             'Freight' AS item, 'Freight Charge' AS itemdescrip, '' AS iteminvuom,
             '' AS qtytobill,
             formatMoney(cmhead_freight) AS price,
             formatMoney(cmhead_freight) AS extprice,
             'Debit' AS sence,
             CASE WHEN (accnt_id IS NULL) THEN 'Not Assigned'
                  ELSE formatGLAccountLong(accnt_id)
             END AS account
FROM cmhead LEFT OUTER JOIN accnt ON (accnt_id=findFreightAccount(cmhead_cust_id))
WHERE ( (NOT cmhead_posted)
 AND (NOT cmhead_hold)
 AND (cmhead_freight <> 0) )

-- Misc. Charges
UNION SELECT cmhead_id AS orderid, -1 AS itemid,
             '' AS documentnumber,
             '' AS cust_number,
             '' AS billtoname,
             cmhead_number::TEXT AS ordernumber,
             -1 AS linenumber,
             'Misc. Charge' AS item, cmhead_misc_descrip AS itemdescrip, '' AS iteminvuom,
             '' AS qtytobill,
             formatMoney(cmhead_misc) AS price,
             formatMoney(cmhead_misc) AS extprice,
             'Debit' AS sence,
             formatGLAccountLong(cmhead_misc_accnt_id)
FROM cmhead
WHERE ( (NOT cmhead_posted)
 AND (NOT cmhead_hold)
 AND (cmhead_misc <> 0) )

-- Freight Tax and Tax Adjustments
UNION SELECT cmhead_id AS orderid, -1 AS itemid,
             '' AS documentnumber,
             '' AS cust_number,
             '' AS billtoname,
             cmhead_number::TEXT AS ordernumber,
             -1 AS linenumber,
             'Sales Tax' AS item, tax_descrip AS itemdescrip, '' AS iteminvuom,
             '' AS qtytobill,
             formatMoney(taxhist_tax * -1.0) AS price,
             formatMoney(taxhist_tax * -1.0) AS extprice,
             'Debit' AS sence,
             CASE WHEN (accnt_id IS NULL) THEN 'Not Assigned'
                  ELSE (formatGLAccountLong(accnt_id) || ' - ' || accnt_descrip)
             END AS account
FROM cmhead JOIN cmheadtax ON (taxhist_parent_id=cmhead_id)
            JOIN tax ON (tax_id=taxhist_tax_id)
            LEFT OUTER JOIN accnt ON (accnt_id=tax_sales_accnt_id)
WHERE ( (NOT cmhead_posted)
 AND (NOT cmhead_hold) )

-- Cmitem tax
UNION SELECT cmhead_id AS orderid, -1 AS itemid,
             '' AS documentnumber,
             '' AS cust_number,
             '' AS billtoname,
             cmhead_number::TEXT AS ordernumber,
             -1 AS linenumber,
             'Sales Tax' AS item, tax_descrip AS itemdescrip, '' AS iteminvuom,
             '' AS qtytobill,
             formatMoney(taxhist_tax * -1.0) AS price,
             formatMoney(taxhist_tax * -1.0) AS extprice,
             'Debit' AS sence,
             CASE WHEN (accnt_id IS NULL) THEN 'Not Assigned'
                  ELSE (formatGLAccountLong(accnt_id) || ' - ' || accnt_descrip)
             END AS account
FROM cmhead JOIN cmitem ON (cmitem_cmhead_id=cmhead_id)
            JOIN cmitemtax ON (taxhist_parent_id=cmitem_id)
            JOIN tax ON (tax_id=taxhist_tax_id)
            LEFT OUTER JOIN accnt ON (accnt_id=tax_sales_accnt_id)
WHERE ( (NOT cmhead_posted)
 AND (NOT cmhead_hold) )

-- Cmitem
UNION SELECT cmhead_id AS orderid, cmitem_id AS itemid,
             '' AS documentnumber,
             '' AS cust_number,
             '' AS billtoname,
             cmhead_number::TEXT AS ordernumber,
             cmitem_linenumber AS linenumber,
             item_number AS item, item_descrip1 AS itemdescrip, uom_name AS iteminvuom,
             formatQty(COALESCE((cmitem_qtycredit * cmitem_qty_invuomratio), 0)) AS qtytobill,
             formatPrice(COALESCE((cmitem_unitprice / cmitem_price_invuomratio), 0)) AS price,
             formatMoney(COALESCE(round((cmitem_qtycredit * cmitem_qty_invuomratio) *
                                        (cmitem_unitprice / cmitem_price_invuomratio), 2), 0)) AS extprice,
             'Debit' AS sence,
             COALESCE( ( SELECT formatGLAccountLong(accnt_id)
                         FROM accnt, salesaccnt
                         WHERE ((salesaccnt_sales_accnt_id=accnt_id)
                          AND (salesaccnt_id=findSalesAccnt(cmitem_itemsite_id, 'IS', cmhead_cust_id,
                                                            cmhead_saletype_id, cmhead_shipzone_id)))), 'Not Assigned') AS account
FROM item, itemsite, cmhead, cmitem, uom
WHERE ( (cmitem_cmhead_id=cmhead_id)
 AND (cmitem_itemsite_id=itemsite_id)
 AND (itemsite_item_id=item_id)
 AND (item_inv_uom_id=uom_id)
 AND (NOT cmhead_posted)
 AND (NOT cmhead_hold) )

ORDER BY ordernumber, linenumber;

REVOKE ALL ON creditMemoEditList FROM PUBLIC;
GRANT ALL ON creditMemoEditList TO GROUP xtrole;

