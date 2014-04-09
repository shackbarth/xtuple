SELECT dropIfExists('view', 'coship');

CREATE VIEW coship AS
  SELECT shipitem_id		AS coship_id,
	 shipitem_orderitem_id	AS coship_coitem_id,
	 shipitem_shipdate	AS coship_shipdate,
	 shipitem_qty		AS coship_qty,
	 shipitem_transdate	AS coship_transdate,
	 shipitem_shipped	AS coship_shipped,
	 shipitem_invoiced	AS coship_invoiced,
	 shipitem_shiphead_id	AS coship_cosmisc_id,
	 shipitem_trans_username AS coship_trans_username,
	 shipitem_invcitem_id	AS coship_invcitem_id
  FROM shipitem, shiphead
  WHERE ((shipitem_shiphead_id=shiphead_id)
    AND  (shiphead_order_type='SO'));
REVOKE ALL ON TABLE coship FROM PUBLIC;
GRANT  ALL ON TABLE coship TO GROUP xtrole;
