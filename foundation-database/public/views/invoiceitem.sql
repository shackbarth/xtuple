SELECT dropIfExists('view', 'invoiceitem'); 
CREATE VIEW invoiceitem AS
SELECT invcitem.*, itemsite_id, cohead_number,
       COALESCE((invcitem_billed * invcitem_qty_invuomratio), 0) AS qty,
       COALESCE((invcitem_price / invcitem_price_invuomratio), 0) AS unitprice,
       COALESCE(round((invcitem_billed * invcitem_qty_invuomratio) *
                      (invcitem_price / invcitem_price_invuomratio), 2), 0) AS extprice,
       currToBase(invchead_curr_id,
                  COALESCE(round((invcitem_billed * invcitem_qty_invuomratio) *
                                 (invcitem_price / invcitem_price_invuomratio), 2), 0),
                  invchead_invcdate) AS baseextprice,
       ( SELECT COALESCE(SUM(taxhist_tax), 0)
         FROM invcitemtax
         WHERE (taxhist_parent_id = invcitem_id) ) AS tax,
       ( SELECT COALESCE(SUM(shipitem_value), (itemCost(itemsite_id) * invcitem_billed), 0)
         FROM shipitem
         WHERE (shipitem_invcitem_id = invcitem_id) ) / 
         (CASE WHEN (invcitem_billed != 0) THEN
           (invcitem_billed * invcitem_qty_invuomratio) 
         ELSE 1 END) AS unitcost
FROM invcitem JOIN invchead ON (invchead_id = invcitem_invchead_id)
              LEFT OUTER JOIN coitem ON (coitem_id=invcitem_coitem_id)
              LEFT OUTER JOIN cohead ON (cohead_id=coitem_cohead_id)
              LEFT OUTER JOIN itemsite ON ( (itemsite_item_id = invcitem_item_id)
                                       AND  (itemsite_warehous_id = invcitem_warehous_id) );

REVOKE ALL ON TABLE invoiceitem FROM PUBLIC;
GRANT  ALL ON TABLE invoiceitem TO GROUP xtrole;

COMMENT ON VIEW invoiceitem IS 'Single point for invoice item (invcitem) calculations.'
;
