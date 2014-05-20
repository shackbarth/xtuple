SELECT dropIfExists('view', 'creditmemoitem'); 
CREATE VIEW creditmemoitem AS
SELECT cmitem.*, itemsite_item_id AS item_id,
       COALESCE((cmitem_qtycredit * cmitem_qty_invuomratio), 0) AS qty,
       COALESCE((cmitem_unitprice / cmitem_price_invuomratio), 0) AS unitprice,
       COALESCE(round((cmitem_qtycredit * cmitem_qty_invuomratio) *
                      (cmitem_unitprice / cmitem_price_invuomratio), 2), 0) AS extprice,
       currToBase(cmhead_curr_id,
                  COALESCE(round((cmitem_qtycredit * cmitem_qty_invuomratio) *
                                 (cmitem_unitprice / cmitem_price_invuomratio), 2), 0),
                  cmhead_docdate) AS baseextprice,
       ( SELECT COALESCE(SUM(taxhist_tax), 0)
         FROM cmitemtax
         WHERE (taxhist_parent_id = cmitem_id) ) AS tax,
       CASE WHEN (itemsite_costmethod='A') THEN avgCost(itemsite_id)
            ELSE stdCost(itemsite_item_id)
       END AS unitcost
FROM cmitem JOIN cmhead ON (cmhead_id = cmitem_cmhead_id)
            LEFT OUTER JOIN itemsite ON (itemsite_id=cmitem_itemsite_id);

REVOKE ALL ON TABLE creditmemoitem FROM PUBLIC;
GRANT  ALL ON TABLE creditmemoitem TO GROUP xtrole;

COMMENT ON VIEW creditmemoitem IS 'Single point for credit memo item (cmitem) calculations.'
;
