
CREATE OR REPLACE FUNCTION orderhead() RETURNS SETOF ordhead AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _row ordhead%ROWTYPE;
  _query TEXT;
BEGIN

  _query := '
  SELECT DISTINCT * FROM (
  SELECT pohead_id		AS orderhead_id,
	 ''PO''			AS orderhead_type,
	 pohead_number		AS orderhead_number,
	 pohead_status		AS orderhead_status,
	 pohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM poitem
	   WHERE poitem_pohead_id=pohead_id) AS orderhead_linecount,
	 pohead_vend_id		AS orderhead_from_id,
	 vend_name		AS orderhead_from,
	 NULL			AS orderhead_to_id,
	 ''''			AS orderhead_to,
	 pohead_curr_id		AS orderhead_curr_id,
	 pohead_agent_username	AS orderhead_agent_username,
	 pohead_shipvia		AS orderhead_shipvia
  FROM pohead LEFT OUTER JOIN vendinfo ON (pohead_vend_id=vend_id)
  UNION
  SELECT cohead_id		AS orderhead_id,
	 ''SO''			AS orderhead_type,
	 cohead_number		AS orderhead_number,
	 COALESCE(coitem_status,''C'') AS orderhead_status,
	 cohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM coitem
	   WHERE coitem_cohead_id=cohead_id) AS orderhead_linecount,
	 NULL			AS orderhead_from_id,
	 ''''			AS orderhead_from,
	 cohead_cust_id		AS orderhead_to_id,
	 cust_name		AS orderhead_to,
	 cohead_curr_id		AS orderhead_curr_id,
	 ''''			AS orderhead_agent_username,
	 cohead_shipvia		AS orderhead_shipvia
  FROM cohead LEFT OUTER JOIN custinfo ON (cohead_cust_id=cust_id)
              LEFT OUTER JOIN coitem ON ((cohead_id=coitem_cohead_id)
                                     AND (coitem_status=''O''))';

  IF (fetchmetricbool('MultiWhs')) THEN
    _query := _query || '
    UNION
    SELECT tohead_id		AS orderhead_id,
	 ''TO''			AS orderhead_type,
  	 tohead_number		AS orderhead_number,
	 tohead_status		AS orderhead_status,
	 tohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM toitem
	   WHERE toitem_tohead_id=tohead_id) AS orderhead_linecount,
	 tohead_src_warehous_id	 AS orderhead_from_id,
	 tohead_srcname		AS orderhead_from,
	 tohead_dest_warehous_id AS orderhead_to_id,
	 tohead_destname	AS orderhead_to,
	 tohead_freight_curr_id	AS orderhead_curr_id,
	 tohead_agent_username	AS orderhead_agent_username,
	 tohead_shipvia		AS orderhead_shipvia
    FROM tohead';
  END IF;

  IF (fetchmetricbool('EnableReturnAuth')) THEN
    _query := _query || '
  UNION
    SELECT rahead_id		AS orderhead_id,
	 ''RA''			AS orderhead_type,
	 rahead_number		AS orderhead_number,
	 COALESCE(raitem_status,''C'') AS orderhead_status,
	 rahead_authdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM raitem
	   WHERE raitem_rahead_id=rahead_id) AS orderhead_linecount,
	 rahead_cust_id		AS orderhead_from_id,
	 cust_name		AS orderhead_from,
	 NULL			AS orderhead_to_id,
	 ''''			AS orderhead_to,
	 rahead_curr_id		AS orderhead_curr_id,
	 ''''			AS orderhead_agent_username,
	 ''''			AS orderhead_shipvia
    FROM rahead LEFT OUTER JOIN custinfo ON (rahead_cust_id=cust_id)
              LEFT OUTER JOIN raitem ON ((rahead_id=raitem_rahead_id)
                                     AND (raitem_status=''O''))';
  END IF;

  _query := _query || ') AS data ORDER BY orderhead_type, orderhead_number ;';
  
  FOR _row IN EXECUTE _query
  LOOP
    RETURN NEXT _row;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

