select xt.create_view('xt.pickordersinfo', $$

SELECT DISTINCT 
  'SO' AS order_type,
  cohead_id AS order_id,
  cohead_number AS order_number,
  getSoSchedDate(cohead_id) AS order_scheddate, 
  getSoStatus(cohead_id) AS order_status,
  cohead_billtoname AS order_info,
  cohead_shiptoname AS order_info2,
  cohead_shipcomments AS order_comments,
  firstline(cohead_ordercomments) AS order_notes,
	order_qtyremaining_total('SO', cohead_id) AS order_totalqty_remaining,
	'' AS order_assignedto 
FROM cohead 
WHERE  cohead_status = 'O'

UNION ALL

SELECT  DISTINCT 
  'WO' AS order_type,
	wo_id,
  wo_number::text AS order_number,
  wo_duedate AS order_scheddate,
  wo_status AS order_status,
  item_number AS order_info,
  item_descrip1 AS order_info2,
  '' AS order_comments,
  wo_prodnotes AS order_notes,
	order_qtyremaining_total('WO', wo_id) AS order_totalqty_remaining,
	'' AS order_assignedto
FROM wo
  JOIN itemsite ON wo_itemsite_id = itemsite_id 
  JOIN item ON itemsite_item_id = item_id
WHERE wo_status <> 'C'
ORDER BY order_scheddate ASC;
$$, false);

