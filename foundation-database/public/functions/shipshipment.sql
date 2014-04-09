CREATE OR REPLACE FUNCTION shipShipment(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT shipShipment($1, CURRENT_TIMESTAMP);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION shipShipment(INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pshipheadid		ALIAS FOR $1;
  _timestamp		TIMESTAMP WITH TIME ZONE := $2;

  _billedQty		NUMERIC;
  _c			RECORD;
  _coholdtype		TEXT;
  _gldate		DATE;
  _invhistid		INTEGER;
  _itemlocSeries	INTEGER;
  _lineitemsToClose     INTEGER[];
  _newQty		NUMERIC;
  _result		INTEGER;
  _s			RECORD;
  _shipcomplete		BOOLEAN;
  _shiphead		RECORD;
  _ti			RECORD;
  _to			RECORD;
  _variance           	NUMERIC;
  _k                    RECORD;

BEGIN

  IF (_timestamp IS NULL) THEN
    _timestamp := CURRENT_TIMESTAMP;
  END IF;
  _gldate := _timestamp::DATE;

  SELECT * INTO _shiphead
  FROM shiphead WHERE (shiphead_id=pshipheadid);
  IF (NOT FOUND) THEN
    RETURN -50;
  END IF;

  IF (_shiphead.shiphead_order_type = 'SO') THEN

    SELECT cohead_shipcomplete, cohead_holdtype INTO _shipcomplete, _coholdtype
      FROM cohead, shiphead
     WHERE ((shiphead_order_id=cohead_id)
       AND  (NOT shiphead_shipped)
       AND  (shiphead_order_type=_shiphead.shiphead_order_type)
       AND  (shiphead_id=pshipheadid));

    IF (_coholdtype = 'C') THEN
      RETURN -12;
    ELSIF (_coholdtype = 'P') THEN
      RETURN -13;
    ELSIF (_coholdtype = 'R') THEN
      RETURN -14;
    ELSIF (_coholdtype = 'S') THEN
      RETURN -15;
    END IF;

---Must Ship Kit components (coitem_subnumber <> 0 complete---------------
    IF ((
         --  Test to see if order's customer accepts backorders and partials 
         --  If not then test for shipping kit components complete 
        SELECT cohead_number
        FROM shiphead, cohead, custinfo
        WHERE 
          (shiphead_order_id = cohead_id) AND
          (cohead_cust_id = cust_id) AND
          (shiphead_order_type = 'SO') AND 
          (cust_partialship) AND
          (cust_backorder) AND
          (shiphead_id = pshipheadid)
         ) IS NULL) THEN
      FOR _k IN SELECT (coitem_qtyord -
			(COALESCE(SUM(shipitem_qty),0) +
			 (coitem_qtyshipped - coitem_qtyreturned))) AS remain
		  FROM (coitem LEFT OUTER JOIN (itemsite JOIN item ON (itemsite_item_id=item_id)) ON (coitem_itemsite_id=itemsite_id)) LEFT OUTER JOIN
		       shipitem ON (shipitem_orderitem_id=coitem_id
		                AND shipitem_shiphead_id=pshipheadid)
		 WHERE ((coitem_status NOT IN ('C','X'))
                   AND  (item_type != 'K')
		   AND  (coitem_cohead_id=_shiphead.shiphead_order_id)
                   AND  (coitem_subnumber <> 0)
		   )
	      GROUP BY coitem_id, coitem_qtyshipped, coitem_qtyord,
		       coitem_qtyreturned LOOP
	IF (_k.remain > 0) THEN
	  RAISE EXCEPTION 'Kit component item not shipped complete.  Kits must be shipped and shipped complete or closed on the order.';
	END IF;
      END LOOP;
    END IF;
---End--------------------------------------------------------------------

    IF ( _shipcomplete ) THEN
      FOR _c IN SELECT (coitem_qtyord -
			(COALESCE(SUM(shipitem_qty),0) +
			 (coitem_qtyshipped - coitem_qtyreturned))) AS remain
		  FROM (coitem LEFT OUTER JOIN (itemsite JOIN item ON (itemsite_item_id=item_id)) ON (coitem_itemsite_id=itemsite_id)) LEFT OUTER JOIN
		       shipitem ON (shipitem_orderitem_id=coitem_id
		                AND shipitem_shiphead_id=pshipheadid)
		 WHERE ((coitem_status<>'X')
                   AND  (item_type != 'K')
		   AND  (coitem_cohead_id=_shiphead.shiphead_order_id))
	      GROUP BY coitem_id, coitem_qtyshipped, coitem_qtyord,
		       coitem_qtyreturned LOOP
	IF (_c.remain > 0) THEN
	  RETURN -99;
	END IF;
      END LOOP;
    END IF;

    FOR _c IN SELECT coitem_id, cohead_number, cohead_cust_id, cohead_billtoname, cohead_prj_id,
                     cohead_saletype_id, cohead_shipzone_id,
		     itemsite_id, itemsite_item_id,
                     coitem_qty_invuomratio,
                     coitem_warranty, coitem_cos_accnt_id,
		     SUM(shipitem_qty) AS _qty,
                     SUM(shipitem_value) AS _value
	      FROM coitem, cohead, shiphead, shipitem, itemsite
	      WHERE ( (coitem_cohead_id=cohead_id)
	       AND (coitem_itemsite_id=itemsite_id)
	       AND (shiphead_order_id=cohead_id)
	       AND (shipitem_shiphead_id=shiphead_id)
	       AND (shipitem_orderitem_id=coitem_id)
	       AND (NOT shiphead_shipped)
	       AND (shiphead_id=pshipheadid) )
	      GROUP BY coitem_id, coitem_qty_invuomratio, cohead_number, cohead_cust_id, cohead_billtoname,
           itemsite_id, itemsite_item_id, coitem_warranty, coitem_cos_accnt_id, cohead_prj_id, cohead_saletype_id, cohead_shipzone_id
    LOOP

      IF _c._value > 0 THEN
  --    Distribute to G/L, credit Shipping Asset, debit COS
	SELECT MIN(insertGLTransaction( 'S/R', 'SH', _shiphead.shiphead_number,
                                        ('Ship Order ' || _c.cohead_number || ' for Customer ' || _c.cohead_billtoname),
                                        getPrjAccntId(_c.cohead_prj_id, costcat_shipasset_accnt_id),
                                        CASE WHEN (COALESCE(_c.coitem_cos_accnt_id, -1) != -1)
                                               THEN getPrjAccntId(_c.cohead_prj_id, _c.coitem_cos_accnt_id)
                                             WHEN (_c.coitem_warranty=TRUE)
                                               THEN getPrjAccntId(_c.cohead_prj_id, resolveCOWAccount(itemsite_id, _c.cohead_cust_id, _c.cohead_saletype_id, _c.cohead_shipzone_id))
                                             ELSE getPrjAccntId(_c.cohead_prj_id, resolveCOSAccount(itemsite_id, _c.cohead_cust_id, _c.cohead_saletype_id, _c.cohead_shipzone_id))
                                        END,
                                        -1, _c._value, _gldate )) INTO _result
	FROM itemsite, costcat
	WHERE ( (itemsite_costcat_id=costcat_id)
	AND (itemsite_id=_c.itemsite_id) );

	IF (_result < 0 AND _result != -3) THEN -- ignore -3 as it just means it's not posting a 0 value
	  RETURN _result;
	END IF;

      END IF;

      UPDATE coitem
      SET coitem_qtyshipped = (coitem_qtyshipped + _c._qty)
      WHERE (coitem_id=_c.coitem_id);

      -- check to see if we have more invoiced than shipped items
      -- if we do we will need to mark some of these records as invoiced
      SELECT noNeg(( SELECT COALESCE(SUM(cobill_qty), 0.0)
		     FROM cobill, cobmisc, coitem
		     WHERE ( (cobill_cobmisc_id=cobmisc_id)
		      AND (cobmisc_cohead_id=coitem_cohead_id)
		      AND (cobill_coitem_id=coitem_id)
		      AND (cobmisc_posted)
		      AND (coitem_id=_c.coitem_id) )
		   ) - ( SELECT COALESCE(SUM(shipitem_qty), 0.0)
			 FROM shipitem, shiphead, coitem
			 WHERE ( (shipitem_shiphead_id=shiphead_id)
			  AND (shiphead_order_id=coitem_cohead_id)
			  AND (shipitem_orderitem_id=coitem_id)
			  AND (shiphead_order_type=_shiphead.shiphead_order_type)
			  AND (shiphead_shipped)
			  AND (coitem_id=_c.coitem_id) )
		       ) ) INTO _billedQty;

      IF (_billedQty > 0.0) THEN
	FOR _s IN SELECT shipitem_id, shipitem_qty
		  FROM shipitem, shiphead
		  WHERE ( (shipitem_shiphead_id=shiphead_id)
		   AND (shipitem_orderitem_id=_c.coitem_id)
		   AND (shiphead_order_type=_shiphead.shiphead_order_type)
		   AND (NOT shiphead_shipped)
		   AND (shiphead_id=pshipheadid) )
		  ORDER BY shipitem_qty LOOP

	  IF (_billedQty > 0.0) THEN

	    IF (_billedQty >= _s.shipitem_qty) THEN
	      UPDATE shipitem SET shipitem_invoiced=TRUE WHERE shipitem_id=_s.shipitem_id;
              -- must wait to close coitems until after shiphead_shipped -> true
              _lineitemsToClose := _lineitemsToClose || _c.coitem_id;
	    ELSE
	      _newQty := _s.shipitem_qty - _billedQty;
	      UPDATE shipitem SET shipitem_invoiced=TRUE, shipitem_qty=_billedQty WHERE shipitem_id=_s.shipitem_id;
	      INSERT INTO shipitem ( shipitem_orderitem_id, shipitem_shipdate,
		shipitem_qty, shipitem_transdate, shipitem_invoiced,
		shipitem_shiphead_id, shipitem_trans_username)
	      SELECT shipitem_orderitem_id, shipitem_shipdate,
		_newQty, shipitem_transdate, FALSE,
		shipitem_shiphead_id, shipitem_trans_username
	      FROM shipitem
	      WHERE (shipitem_id=_s.shipitem_id);
	    END IF;

	    _billedQty := _billedQty - _s.shipitem_qty;
	  END IF;
	END LOOP;

      END IF;
    END LOOP;

  ELSEIF (_shiphead.shiphead_order_type = 'TO') THEN
    IF (_shiphead.shiphead_shipped) THEN
      RETURN -8;
    END IF;

    SELECT tohead.* INTO _to
      FROM tohead
     WHERE (tohead_id=_shiphead.shiphead_order_id);

    IF ( _to.tohead_shipcomplete ) THEN
      -- use sufficientInventory...()?
      FOR _ti IN SELECT (toitem_qty_ordered -
			 (COALESCE(SUM(shipitem_qty),0) + toitem_qty_shipped)) AS remain
		  FROM toitem LEFT OUTER JOIN
		       shipitem ON (shipitem_orderitem_id=toitem_id)
		 WHERE ((toitem_status<>'X')
		   AND  (toitem_tohead_id=_shiphead.shiphead_order_id))
	      GROUP BY toitem_qty_shipped, toitem_qty_ordered LOOP
	IF (_ti.remain > 0) THEN
	  RETURN -99;
	END IF;
      END LOOP;
    END IF;

    FOR _ti IN SELECT toitem_id, toitem_item_id, SUM(shipitem_qty) AS qty, SUM(shipitem_value) AS value
		FROM toitem, shipitem
		WHERE ((toitem_tohead_id=_to.tohead_id)
		  AND  (shipitem_orderitem_id=toitem_id)
		  AND  (shipitem_shiphead_id=pshipheadid))
		GROUP BY toitem_id, toitem_item_id LOOP

      IF (NOT EXISTS(SELECT itemsite_id
		     FROM itemsite
		     WHERE ((itemsite_item_id=_ti.toitem_item_id)
		     AND  (itemsite_warehous_id = _to.tohead_trns_warehous_id))
		     )) THEN
	RETURN -6;
      END IF;

      _itemlocSeries := NEXTVAL('itemloc_series_seq');

      SELECT postInvTrans(si.itemsite_id, 'TS', _ti.qty,
                          'I/M', _shiphead.shiphead_order_type,
                          formatToNumber(_ti.toitem_id), _to.tohead_number,
			  'Ship from Src to Transit Warehouse',
			  tc.costcat_asset_accnt_id,
			  sc.costcat_shipasset_accnt_id,
			  _itemlocSeries, _timestamp, _ti.value) INTO _invhistid
      FROM itemsite AS ti, costcat AS tc,
	   itemsite AS si, costcat AS sc
      WHERE ( (ti.itemsite_costcat_id=tc.costcat_id)
        AND  (si.itemsite_costcat_id=sc.costcat_id)
        AND  (ti.itemsite_item_id=_ti.toitem_item_id)
        AND  (si.itemsite_item_id=_ti.toitem_item_id)
        AND  (ti.itemsite_warehous_id=_to.tohead_trns_warehous_id)
        AND  (si.itemsite_warehous_id=_to.tohead_src_warehous_id) );

      --We do not need to distribute lot/serial info for transit, post trans and discard dist detail
      PERFORM postIntoTrialBalance(itemlocpost_glseq) FROM itemlocpost WHERE (itemlocpost_itemlocseries=_itemlocSeries);
      IF (_invhistid > 0) THEN
        PERFORM postInvHist(_invhistid);
      END IF;
      DELETE FROM itemlocdist WHERE (itemlocdist_series=_itemlocSeries);
      DELETE FROM itemlocpost WHERE (itemlocpost_itemlocSeries=_itemlocSeries);

      IF (_result < 0) THEN
	RETURN _result;
      END IF;

      -- record inventory history and qoh changes at transit warehouse but
      -- there is only one g/l account to touch
      SELECT postInvTrans(ti.itemsite_id, 'TR', _ti.qty,
                          'I/M', _shiphead.shiphead_order_type,
                          formatToNumber(_ti.toitem_id), _to.tohead_number,
			  'Receive into Transit from Src Warehouse',
			  tc.costcat_asset_accnt_id,
			  tc.costcat_asset_accnt_id,
			  _itemlocSeries, _timestamp, 
			  _ti.value) INTO _invhistid
      FROM itemsite AS ti, costcat AS tc
      WHERE ((ti.itemsite_costcat_id=tc.costcat_id)
        AND  (ti.itemsite_item_id=_ti.toitem_item_id)
        AND  (ti.itemsite_warehous_id=_to.tohead_trns_warehous_id));
      --We do not need to distribute lot/serial info for transit, post trans and discard dist detail
      PERFORM postIntoTrialBalance(itemlocpost_glseq) FROM itemlocpost WHERE (itemlocpost_itemlocseries=_itemlocSeries);
      IF (_invhistid > 0) THEN
        PERFORM postInvHist(_invhistid);
      END IF;
      DELETE FROM itemlocdist WHERE (itemlocdist_series=_itemlocSeries);
      DELETE FROM itemlocpost WHERE (itemlocpost_itemlocSeries=_itemlocSeries);

      --See if there was a change in values during the transfer, if so record the variance
      SELECT (invhist_invqty * invhist_unitcost - _ti.value) INTO _variance
      FROM invhist
      WHERE (invhist_id=_invhistid);

      IF (_variance > 0) THEN
        PERFORM insertGLTransaction( 'S/R', _shiphead.shiphead_order_type, _to.tohead_number, 
                                     'Transfer Order - Transfer Variance',
                                     tc.costcat_invcost_accnt_id, tc.costcat_asset_accnt_id, _invhistid,
                                     _variance,
                                     CAST(_timestamp AS DATE) )
        FROM itemsite AS ti, costcat AS tc
        WHERE ( (ti.itemsite_costcat_id=tc.costcat_id)
        AND  (ti.itemsite_item_id=_ti.toitem_item_id)
        AND  (ti.itemsite_warehous_id=_to.tohead_trns_warehous_id) );
      END IF;

      IF (_result < 0) THEN
	RETURN _result;
      END IF;

      UPDATE shipitem SET shipitem_shipdate=_timestamp, shipitem_shipped=TRUE
      WHERE ((shipitem_orderitem_id=_ti.toitem_id)
        AND  (shipitem_shiphead_id=pshipheadid));

      UPDATE toitem
      SET toitem_qty_shipped = (toitem_qty_shipped + _ti.qty)
      WHERE (toitem_id=_ti.toitem_id);
    END LOOP;
  END IF;

  UPDATE shiphead
  SET shiphead_shipped=TRUE, shiphead_shipdate=_gldate
  WHERE (shiphead_id=pshipheadid);

  -- now try to close line items that are fully shipped and invoiced
  IF (_shiphead.shiphead_order_type = 'SO') THEN
    UPDATE coitem SET coitem_status='C'
    WHERE ((coitem_id = ANY (_lineitemsToClose))
      AND  (coitem_qtyshipped >= coitem_qtyord));
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
