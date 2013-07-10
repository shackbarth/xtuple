create or replace function xt.shipmentline_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

/* this doesn't account for shipitem_invoiced, shipitem_shipped */
	var qty = (NEW.shipitem_qty - OLD.shipitem_qty),
		sql1,
		sql2,
		query,
		itemlocseries;

	if (NEW.shipitem_shipped == false && NEW.shipitem_shipped == false) {
  	if (qty > 0) {
  		sql1 = "select issuetoshipping($1, $2) as itemlocseries",
			sql2 = "select postitemlocseries($1)";
		
			query = plv8.execute(sql1, [NEW.shipitem_orderitem_id, qty]);
			itemlocseries = query.length ? query[0].itemlocseries : null;
			plv8.execute(sql2, [itemlocseries]);
 		}
		if (qty < 0) {
  		sql1 = "select returnitemshipments($1)";
		
			query = plv8.execute(sql1, [NEW.shipitem_orderitem_id]);
		}
	}
	return NEW;

$$ language plv8;
