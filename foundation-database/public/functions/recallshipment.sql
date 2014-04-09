CREATE OR REPLACE FUNCTION recallShipment(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN recallShipment($1, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION recallShipment(INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pshipheadid		ALIAS FOR $1;
  _timestamp		TIMESTAMP WITH TIME ZONE := $2;
  _allInvoiced		BOOLEAN;
  _invoicePosted	BOOLEAN;
  _in                   RECORD;
  _co			RECORD;
  _cobill		RECORD;
  _h			RECORD;
  _result               INTEGER;
  _invhistid		INTEGER;
  _itemlocSeries	INTEGER;
  _qty			NUMERIC;
  _qtyToBill		NUMERIC;
  _shiphead		RECORD;
  _to			RECORD;
  _ti			RECORD;
  _value                NUMERIC;

BEGIN

  IF (_timestamp IS NULL) THEN
    _timestamp := CURRENT_TIMESTAMP;
  END IF;

  SELECT * INTO _shiphead
  FROM shiphead
  WHERE (shiphead_id=pshipheadid);
  IF (NOT FOUND OR NOT _shiphead.shiphead_shipped) THEN
    RETURN -1;
  END IF;

  IF (_shiphead.shiphead_order_type = 'SO') THEN
    SELECT cohead_number AS head_number, cohead_cust_id AS cust_id, cohead_prj_id AS prj_id,
           cohead_saletype_id AS saletype_id, cohead_shipzone_id AS shipzone_id INTO _h
      FROM cohead
     WHERE (cohead_id=_shiphead.shiphead_order_id);
    IF (NOT FOUND) THEN
      RETURN -1;
    END IF;

    SELECT COALESCE(BOOL_AND(shipitem_invoiced), FALSE) INTO _allInvoiced
     FROM cobill, shipitem
    WHERE ((cobill_coitem_id=shipitem_orderitem_id)
      AND  (shipitem_shiphead_id=pshipheadid));

    IF (_allInvoiced AND NOT checkPrivilege('RecallInvoicedShipment')) THEN
      RETURN -2;
    END IF;

    -- Check for any associated posted Invoices
    SELECT COALESCE(BOOL_AND(invchead_posted), FALSE) INTO _invoicePosted
    FROM shipitem JOIN invcitem ON (invcitem_id=shipitem_invcitem_id)
                  JOIN invchead ON (invchead_id=invcitem_invchead_id)
    WHERE (shipitem_shiphead_id=pshipheadid);

    IF (_invoicePosted) THEN
      RETURN -4;
    END IF;

    -- Delete any associated unposted Invoices
    FOR _in IN SELECT DISTINCT invchead_id
                 FROM shipitem JOIN invcitem ON (invcitem_id=shipitem_invcitem_id)
                               JOIN invchead ON ( (invchead_id=invcitem_invchead_id) AND
                                                  (NOT invchead_posted) )
                WHERE (shipitem_shiphead_id=pshipheadid) LOOP
      SELECT deleteInvoice(_in.invchead_id) INTO _result;
      IF (_result < 0) THEN
        RETURN _result;
      END IF;
    END LOOP;

    FOR _co IN SELECT coitem_id, coitem_itemsite_id, coitem_qty_invuomratio, coitem_warranty, coitem_cos_accnt_id,
                   itemsite_controlmethod
                 FROM coitem
                  JOIN itemsite ON (coitem_itemsite_id=itemsite_id)
                WHERE(coitem_id IN (SELECT shipitem_orderitem_id
                                      FROM shipitem, shiphead
                                     WHERE((shipitem_shiphead_id=shiphead_id)
                                       AND (shiphead_shipped)
                                       AND (shiphead_id=pshipheadid)))) FOR UPDATE LOOP

      SELECT SUM(shipitem_qty),SUM(COALESCE(shipitem_value, 0)) INTO _qty, _value
      FROM shipitem
      WHERE ( (shipitem_orderitem_id=_co.coitem_id)
       AND (shipitem_shiphead_id=pshipheadid) );

      UPDATE coitem
      SET coitem_qtyshipped = (coitem_qtyshipped - _qty)
      WHERE (coitem_id=_co.coitem_id);

      _qtyToBill := _qty;
      FOR _cobill IN SELECT cobill_id, cobill_qty
			 FROM cobill, shipitem
			WHERE ((cobill_coitem_id=shipitem_orderitem_id)
			  AND  (shipitem_shiphead_id=pshipheadid)
			  AND  (cobill_coitem_id=_co.coitem_id)) FOR UPDATE LOOP

        IF (noNeg(_cobill.cobill_qty - _qtyToBill) = 0) THEN
          DELETE FROM cobill WHERE (cobill_id=_cobill.cobill_id);
        ELSE
	  UPDATE cobill
	  SET cobill_qty = noNeg(cobill_qty - _qtyToBill)
	  WHERE (cobill_id=_cobill.cobill_id);
	END IF;

	_qtyToBill = _qtyToBill - _cobill.cobill_qty;
	EXIT WHEN (_qtyToBill <= 0.0);
      END LOOP;

  --  Check to see if all of the cobills have been deleted for this cobmisc
      IF (EXISTS(SELECT cobmisc_id
                 FROM cobmisc JOIN cobill ON (cobill_cobmisc_id=cobmisc_id)
                 WHERE (cobmisc_cohead_id=_shiphead.shiphead_order_id AND NOT cobmisc_posted))) THEN
  --  Lines exist, update the freight
        UPDATE cobmisc SET cobmisc_freight = (cobmisc_freight - _shiphead.shiphead_freight)
        WHERE (cobmisc_cohead_id=_shiphead.shiphead_order_id AND NOT cobmisc_posted);
      ELSE
  --  No lines exist, delete the cobmisc
        DELETE FROM cobmisc
        WHERE (cobmisc_cohead_id=_shiphead.shiphead_order_id AND NOT cobmisc_posted);
      END IF;

  --  Distribute to G/L, debit Shipping Asset, credit COS
      IF (_co.itemsite_controlmethod != 'N') THEN
        PERFORM insertGLTransaction( 'S/R', _shiphead.shiphead_order_type,
	  			   _h.head_number::TEXT, 'Recall Shipment',
                                   CASE WHEN(COALESCE(_co.coitem_cos_accnt_id, -1) != -1)
                                          THEN getPrjAccntId(_h.prj_id, _co.coitem_cos_accnt_id)
                                        WHEN(_co.coitem_warranty = TRUE)
                                          THEN getPrjAccntId(_h.prj_id, resolveCOWAccount(itemsite_id, _h.cust_id, _h.saletype_id, _h.shipzone_id))
				        ELSE getPrjAccntId(_h.prj_id, resolveCOSAccount(itemsite_id, _h.cust_id, _h.saletype_id, _h.shipzone_id))
                                   END,
                                   getPrjAccntId(_h.prj_id,costcat_shipasset_accnt_id), -1,
				   _value,
				   _timestamp::DATE )
        FROM itemsite, costcat
        WHERE ( (itemsite_costcat_id=costcat_id)
         AND (itemsite_id=_co.coitem_itemsite_id) );
       END IF;

    END LOOP;

-- Kit billing selection
-- Set kit billing qty to zero since kits are shipped complete
    FOR _cobill IN SELECT cobill_id, cobill_qty
                   FROM shipitem JOIN coitem sub ON (sub.coitem_id=shipitem_orderitem_id)
                                 JOIN coitem kit ON (kit.coitem_id <> sub.coitem_id AND
                                                     kit.coitem_cohead_id = sub.coitem_cohead_id AND
                                                     kit.coitem_linenumber = sub.coitem_linenumber AND
                                                     kit.coitem_subnumber = 0)
                                 JOIN cobill ON (cobill_coitem_id=kit.coitem_id)
                   WHERE (shipitem_shiphead_id=pshipheadid)
                     AND (sub.coitem_subnumber > 0)
                   GROUP BY cobill_id, cobill_qty
    LOOP
      UPDATE cobill SET cobill_qty = 0.0
      WHERE (cobill_id=_cobill.cobill_id);
    END LOOP;

  ELSEIF (_shiphead.shiphead_order_type = 'TO') THEN
    SELECT * INTO _to
      FROM tohead
     WHERE (tohead_id=_shiphead.shiphead_order_id);
    IF (NOT FOUND) THEN
      RETURN -1;
    END IF;
    IF (_to.tohead_status = 'C') THEN
      RETURN -6;
    END IF;

    FOR _ti IN SELECT toitem_id,
                      sis.itemsite_id AS src_itemsite_id,
                      tis.itemsite_id AS trns_itemsite_id,
                      scc.costcat_shipasset_accnt_id AS src_shipasset_accnt_id,
                      tcc.costcat_asset_accnt_id AS trns_asset_accnt_id,
                      itemcost(tis.itemsite_id) AS trns_cost,
                      SUM(shipitem_qty) AS recall_qty
               FROM shipitem JOIN toitem ON (toitem_id=shipitem_orderitem_id)
                             JOIN itemsite sis ON (sis.itemsite_item_id=toitem_item_id AND sis.itemsite_warehous_id=_to.tohead_src_warehous_id)
                             JOIN itemsite tis ON (tis.itemsite_item_id=toitem_item_id AND tis.itemsite_warehous_id=_to.tohead_trns_warehous_id)
                             JOIN costcat scc ON (scc.costcat_id=sis.itemsite_costcat_id)
                             JOIN costcat tcc ON (tcc.costcat_id=tis.itemsite_costcat_id)
               WHERE (shipitem_shiphead_id=pshipheadid)
               GROUP BY toitem_id, sis.itemsite_id, tis.itemsite_id,
                        scc.costcat_shipasset_accnt_id, tcc.costcat_asset_accnt_id
    LOOP

      _itemlocSeries := NEXTVAL('itemloc_series_seq');
      
      SELECT postInvTrans(_ti.src_itemsite_id, 'TS', (_ti.recall_qty * -1.0), 'I/M',
			  _shiphead.shiphead_order_type, formatToNumber(_ti.toitem_id),
			  _to.tohead_number,
			  'Recall TO Shipment To Src Warehouse',
			  _ti.trns_asset_accnt_id,
			  _ti.src_shipasset_accnt_id,
			  _itemlocSeries, _timestamp,
                          (_ti.trns_cost * _ti.recall_qty * -1.0)) INTO _invhistid;

      IF (_invhistid < 0) THEN
	RETURN _invhistid;
      END IF;

      -- post the inventory history if lot/serial or location control
      PERFORM postItemlocseries(_itemlocSeries);

      -- record inventory history and qoh changes at transit warehouse but
      -- there is only one g/l account to touch
      SELECT postInvTrans(_ti.trns_itemsite_id, 'TR', (_ti.recall_qty * -1.0), 'I/M',
			  _shiphead.shiphead_order_type, formatToNumber(_ti.toitem_id),
			  _to.tohead_number,
			  'Recall TO Shipment From Transit Warehouse',
			  _ti.trns_asset_accnt_id,
			  _ti.trns_asset_accnt_id,
			  _itemlocSeries, _timestamp,
                          (_ti.trns_cost * _ti.recall_qty * -1.0)) INTO _invhistid;

      IF (_invhistid < 0) THEN
	RETURN _invhistid;
      END IF;

      -- post the inventory history if lot/serial or location control
      PERFORM postItemlocseries(_itemlocSeries);

      UPDATE toitem
      SET toitem_qty_shipped = (toitem_qty_shipped - _ti.recall_qty)
      WHERE (toitem_id=_ti.toitem_id);

      UPDATE shipitem SET shipitem_shipdate=NULL,
                          shipitem_shipped=FALSE,
                          shipitem_value=(shipitem_qty * _ti.trns_cost)
      WHERE ((shipitem_orderitem_id=_ti.toitem_id)
        AND  (shipitem_shiphead_id=pshipheadid));

      DELETE FROM recv
	WHERE ((recv_orderitem_id=_ti.toitem_id)
	  AND  (recv_order_type='TO')
	  AND  (NOT recv_posted));

    END LOOP;

  END IF;

  UPDATE shiphead
  SET shiphead_shipped=FALSE
  WHERE (shiphead_id=pshipheadid);

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
