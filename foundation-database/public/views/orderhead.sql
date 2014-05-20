
SELECT dropIfExists('view', 'orderhead');
CREATE VIEW orderhead AS
  SELECT DISTINCT * FROM (
  SELECT pohead_id		AS orderhead_id,
	 'PO'::text		AS orderhead_type,
	 pohead_number		AS orderhead_number,
	 pohead_status		AS orderhead_status,
	 pohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM poitem
	   WHERE poitem_pohead_id=pohead_id) AS orderhead_linecount,
	 pohead_vend_id		AS orderhead_from_id,
	 vend_name		AS orderhead_from,
	 NULL::int		AS orderhead_to_id,
	 ''::text		AS orderhead_to,
	 pohead_curr_id		AS orderhead_curr_id,
	 pohead_agent_username	AS orderhead_agent_username,
	 pohead_shipvia		AS orderhead_shipvia
  FROM pohead LEFT OUTER JOIN vendinfo ON (pohead_vend_id=vend_id)
  UNION ALL
  SELECT cohead_id		AS orderhead_id,
	 'SO'::text		AS orderhead_type,
  	 cohead_number		AS orderhead_number,
	 cohead_status		AS orderhead_status,
	 cohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	  FROM coitem
	  WHERE coitem_cohead_id=cohead_id) AS orderhead_linecount,
	 NULL			AS orderhead_from_id,
	 ''::text		AS orderhead_from,
	 cohead_cust_id		AS orderhead_to_id,
	 CASE 
	   WHEN (length(cohead_shiptoname) > 0) THEN
	     cohead_shiptoname
	   ELSE cohead_billtoname
	 END     		AS orderhead_to,
	 cohead_curr_id		AS orderhead_curr_id,
	 ''::text		AS orderhead_agent_username,
	 cohead_shipvia		AS orderhead_shipvia
  FROM cohead) AS data;

REVOKE ALL ON TABLE orderhead FROM PUBLIC;
GRANT  ALL ON TABLE orderhead TO GROUP xtrole;

COMMENT ON VIEW orderhead IS 'Union of all orders for use by widgets and stored procedures which process multiple types of order';
