select xt.create_view('xt.orderiteminfo', $$

	SELECT 
		coitem.coitem_id AS orderitem_id, 
		'SO'::text AS orderitem_orderhead_type,
		cohead_number AS orderitem_orderhead_number,
		coitem.coitem_cohead_id AS orderitem_orderhead_id, 
		coitem.coitem_linenumber AS orderitem_linenumber, 
		coitem.coitem_status AS orderitem_status,
		coitem.coitem_itemsite_id AS orderitem_itemsite_id, 
		coitem.coitem_scheddate AS orderitem_scheddate, 
		coitem.coitem_qtyord AS orderitem_qty_ordered, 
		coitem.coitem_qtyshipped AS orderitem_qty_transacted, 
		coitem.coitem_qty_uom_id AS orderitem_qty_uom_id, 
		coitem.coitem_qty_invuomratio AS orderitem_qty_invuomratio, 
		coitem.coitem_unitcost AS orderitem_unitcost, 
		basecurrid() AS orderitem_unitcost_curr_id, 
		NULL::numeric AS orderitem_freight, 
		basecurrid() AS orderitem_freight_curr_id                           
	FROM coitem JOIN cohead ON coitem_cohead_id = cohead_id;

$$, false);
