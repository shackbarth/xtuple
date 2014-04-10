SELECT dropIfExists('FUNCTION', 'orderhead()');
SELECT dropIfExists('TYPE', 'ordhead');

CREATE TYPE ordhead AS (
  orderhead_id integer,
  orderhead_type text,
  orderhead_number text,
  orderhead_status text,
  orderhead_orderdate date,
  orderhead_linecount integer,
  orderhead_from_id integer,
  orderhead_from text,
  orderhead_to_id integer,
  orderhead_to text,
  orderhead_curr_id integer,
  orderhead_agent_username text,
  orderhead_shipvia text
  );
