
SELECT dropIfExists('view', 'orderitem');
CREATE VIEW orderitem AS
  SELECT poitem_id		AS orderitem_id,
	 'PO'			AS orderitem_orderhead_type,
	 poitem_pohead_id	AS orderitem_orderhead_id,
	 poitem_linenumber	AS orderitem_linenumber,
	 poitem_status		AS orderitem_status,
	 poitem_itemsite_id	AS orderitem_itemsite_id,
	 poitem_duedate		AS orderitem_scheddate,
	 poitem_qty_ordered	AS orderitem_qty_ordered,
	 poitem_qty_returned	AS orderitem_qty_shipped,
	 poitem_qty_received	AS orderitem_qty_received,
	 uom_id			AS orderitem_qty_uom_id,
	 poitem_invvenduomratio	AS orderitem_qty_invuomratio,
	 poitem_unitprice	AS orderitem_unitcost,
	 pohead_curr_id         AS orderitem_unitcost_curr_id,
	 poitem_freight		AS orderitem_freight,
	 poitem_freight_received AS orderitem_freight_received,
	 pohead_curr_id         AS orderitem_freight_curr_id

  FROM poitem LEFT OUTER JOIN pohead ON (poitem_pohead_id=pohead_id)
              LEFT OUTER JOIN uom ON (uom_name=poitem_vend_uom)
  UNION ALL
  SELECT coitem_id		AS orderitem_id,
	 'SO'			AS orderitem_orderhead_type,
	 coitem_cohead_id	AS orderitem_orderhead_id,
	 coitem_linenumber	AS orderitem_linenumber,
	 coitem_status		AS orderitem_status,
	 coitem_itemsite_id	AS orderitem_itemsite_id,
	 coitem_scheddate	AS orderitem_scheddate,
	 coitem_qtyord		AS orderitem_qty_ordered,
	 coitem_qtyshipped	AS orderitem_qty_shipped,
	 coitem_qtyreturned	AS orderitem_qty_received,
	 coitem_qty_uom_id	AS orderitem_qty_uom_id,
	 coitem_qty_invuomratio	AS orderitem_qty_invuomratio,
	 coitem_unitcost	AS orderitem_unitcost,
	 basecurrid()		AS orderitem_unitcost_curr_id,
	 NULL			AS orderitem_freight,
	 NULL			AS orderitem_freight_received,
	 basecurrid()		AS orderitem_freight_curr_id
  FROM coitem
  UNION ALL
  SELECT quitem_id		AS orderitem_id,
	 'QU'			AS orderitem_orderhead_type,
	 quitem_quhead_id	AS orderitem_orderhead_id,
	 quitem_linenumber	AS orderitem_linenumber,
	 'O'			AS orderitem_status,
	 quitem_itemsite_id	AS orderitem_itemsite_id,
	 quitem_scheddate	AS orderitem_scheddate,
	 quitem_qtyord		AS orderitem_qty_ordered,
	 0			AS orderitem_qty_shipped,
	 0			AS orderitem_qty_received,
	 quitem_qty_uom_id	AS orderitem_qty_uom_id,
	 quitem_qty_invuomratio	AS orderitem_qty_invuomratio,
	 quitem_unitcost	AS orderitem_unitcost,
	 basecurrid()		AS orderitem_unitcost_curr_id,
	 NULL			AS orderitem_freight,
	 NULL			AS orderitem_freight_received,
	 basecurrid()		AS orderitem_freight_curr_id
  FROM quitem;

REVOKE ALL ON TABLE orderitem FROM PUBLIC;
GRANT  ALL ON TABLE orderitem TO GROUP xtrole;

COMMENT ON VIEW orderitem IS 'Union of all order line items for use by widgets and stored procedures which process multiple types of order';
