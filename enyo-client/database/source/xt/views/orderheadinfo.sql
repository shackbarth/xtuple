select xt.create_view('xt.orderheadinfo', $$

  SELECT DISTINCT 
    data.orderhead_id, 
    data.orderhead_type, 
    data.orderhead_number, 
    data.orderhead_status, 
    data.orderhead_orderdate, 
    data.orderhead_scheddate, 
    data.orderhead_linecount, 
    data.orderhead_forname1, 
    data.orderhead_forname2, 
    data.orderhead_curr_id, 
    data.orderhead_assignedto_username, 
    data.orderhead_shipvia
  FROM (         
    SELECT wo_id AS orderhead_id, 
      'WO'::text AS orderhead_type, 
      formatwonumber(wo_id) AS orderhead_number, 
      wo_status AS orderhead_status, 
      wo_startdate AS orderhead_orderdate, 
      wo_duedate AS orderhead_scheddate, 
      ( SELECT count(*) AS count
        FROM womatl 
        WHERE womatl_wo_id = wo_id AND womatl_issuemethod <> 'L'
      ) AS orderhead_linecount, 
      item_number AS orderhead_forname1, 
      item_descrip1 AS orderhead_forname2, 
     	basecurrid() AS orderhead_curr_id, 
      ''::text AS orderhead_assignedto_username, 
      ''::text AS orderhead_shipvia 
    FROM wo
      JOIN itemsite ON wo_itemsite_id = itemsite_id
      JOIN item ON itemsite_item_id = item_id
  UNION ALL 
    SELECT 
      cohead.cohead_id AS orderhead_id, 
      'SO'::text AS orderhead_type, 
      cohead.cohead_number AS orderhead_number, 
      cohead.cohead_status AS orderhead_status, 
      cohead.cohead_orderdate AS orderhead_orderdate, 
      getSoSchedDate(cohead_id) AS orderhead_scheddate, 
      ( SELECT count(*) AS count
        FROM coitem
        WHERE coitem.coitem_cohead_id = cohead.cohead_id
			) AS orderhead_linecount, 
			cohead_billtoname AS orderhead_forname1, 
			cohead_shiptoname AS orderhead_forname2, 
			cohead.cohead_curr_id AS orderhead_curr_id, 
			''::text AS orderhead_assignedto_username, 
			cohead.cohead_shipvia AS orderhead_shipvia               
		FROM cohead) data
	ORDER BY orderhead_scheddate asc;

$$, false);

