select xt.create_view('xt.pickordersinfo', $$

SELECT DISTINCT 
  'SO' AS order_type,
  cohead_id AS order_id,
	cohead_id,
	NULL::INTEGER AS wo_id,
  cohead_number AS order_number,
  getSoSchedDate(cohead_id) AS order_scheddate, 
  getSoStatus(cohead_id) AS order_status,
  cohead_shipcomments AS order_comments,
  firstline(cohead_ordercomments) AS order_notes,
	'' AS order_assignedto 
FROM cohead 
WHERE  cohead_status = 'O'

UNION ALL

SELECT  DISTINCT 
  'WO' AS order_type,
  wo_id AS order_id,
	NULL::INTEGER AS cohead_id,
	wo_id,
  wo_number::text AS order_number,
  wo_duedate AS order_scheddate,
  wo_status AS order_status,
  '' AS order_comments,
  wo_prodnotes AS order_notes,
	'' AS order_assignedto
FROM wo
WHERE wo_status <> 'C'
ORDER BY order_scheddate ASC;
$$, false);

