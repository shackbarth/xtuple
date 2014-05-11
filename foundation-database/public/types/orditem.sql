SELECT dropIfExists('FUNCTION', 'orderitem()');
SELECT dropIfExists('TYPE', 'orditem');

CREATE TYPE orditem AS (
  orderitem_id integer,
  orderitem_orderhead_type text,
  orderitem_orderhead_id integer,
  orderitem_linenumber integer,
  orderitem_status text,
  orderitem_itemsite_id integer,
  orderitem_scheddate date,
  orderitem_qty_ordered numeric,
  orderitem_qty_shipped numeric,
  orderitem_qty_received numeric,
  orderitem_qty_uom_id integer,
  orderitem_qty_invuomratio numeric,
  orderitem_unitcost numeric,
  orderitem_unitcost_curr_id integer,
  orderitem_freight numeric,
  orderitem_freight_received numeric,
  orderitem_freight_curr_id integer
  );
