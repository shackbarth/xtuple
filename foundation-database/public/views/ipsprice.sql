
SELECT dropIfExists('VIEW', 'ipsprice', 'public');
CREATE OR REPLACE VIEW ipsprice AS
  SELECT ipsitem_id AS ipsprice_id,
         'I' AS ipsprice_source,
         ipsitem_ipshead_id AS ipsprice_ipshead_id,
         ipsitem_item_id AS ipsprice_item_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         CASE WHEN (ipsitem_type='N') THEN (ipsitem_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) *
                                            iteminvpricerat(ipsitem_item_id)
              WHEN (ipsitem_type='D') THEN (item_listprice - (item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type='M') AND fetchMetricBool('Long30Markups')) THEN
               (stdCost(item_id) / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type='M') THEN (item_listcost + (item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
         END AS ipsprice_price,
         ipsitem_qtybreak AS ipsprice_uomqtybreak,
         ipsitem_qty_uom_id AS ipsprice_uomqtybreak_uom_id,
         CASE WHEN (ipsitem_type='N') THEN ipsitem_price
              WHEN (ipsitem_type='D') THEN (item_listprice - (item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type='M') AND fetchMetricBool('Long30Markups')) THEN
               (stdCost(item_id) / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type='M') THEN (item_listcost + (item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
         END AS ipsprice_uomprice,
         ipsitem_price_uom_id AS ipsprice_uomprice_uom_id,
         ipsitem_discntprcnt AS ipsprice_discountpercent,
         ipsitem_fixedamtdiscount AS ipsprice_discountfixed,
         ipsitem_type AS ipsprice_type
    FROM ipsiteminfo JOIN item ON (item_id=ipsitem_item_id)
   UNION
  SELECT ipsitem_id AS ipsprice_id,
         'P' AS ipsprice_source,
         ipsitem_ipshead_id AS ipsprice_ipshead_id,
         item_id AS ipsprice_item_id,
         ipsitem_qtybreak AS ipsprice_qtybreak,
         CASE WHEN (ipsitem_type='D') THEN (item_listprice - (item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type='M') AND fetchMetricBool('Long30Markups')) THEN
               (stdCost(item_id) / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type='M') THEN (item_listcost + (item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
         END AS ipsprice_price,
         ipsitem_qtybreak AS ipsprice_uomqtybreak,
         item_inv_uom_id AS ipsprice_uomqtybreak_uom_id,
         CASE WHEN (ipsitem_type='D') THEN (item_listprice - (item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type='M') AND fetchMetricBool('Long30Markups')) THEN
               (stdCost(item_id) / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type='M') THEN (item_listcost + (item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
         END AS ipsprice_uomprice,
         item_price_uom_id AS ipsprice_uomprice_uom_id,
         ipsitem_discntprcnt AS ipsprice_discountpercent,
         ipsitem_fixedamtdiscount AS ipsprice_discountfixed,
         ipsitem_type AS ipsprice_type
    FROM ipsiteminfo JOIN item ON (ipsitem_prodcat_id=item_prodcat_id);

REVOKE ALL ON TABLE ipsprice FROM PUBLIC;
GRANT ALL ON TABLE ipsprice TO GROUP xtrole;

