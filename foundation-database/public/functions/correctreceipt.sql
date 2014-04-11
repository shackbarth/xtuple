CREATE OR REPLACE FUNCTION correctReceipt(INTEGER, NUMERIC, NUMERIC, INTEGER, INTEGER, DATE) RETURNS INTEGER AS $$
BEGIN
  RETURN correctReceipt($1, $2, $3, $4, $5, $6, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION correctReceipt(INTEGER, NUMERIC, NUMERIC, INTEGER, INTEGER, DATE, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  precvid		ALIAS FOR $1;
  pQty			ALIAS FOR $2;
  pFreight		ALIAS FOR $3;
  _itemlocSeries	INTEGER := COALESCE($4, 0);
  _currid		INTEGER := $5;
  pEffective		ALIAS FOR $6;
  pRecvCost		ALIAS FOR $7;
  _freight		NUMERIC;
  _qty			NUMERIC;
  _invhistid		INTEGER;
  _o			RECORD;
  _r			RECORD;
  _recvcost		NUMERIC;
  _tmp        INTEGER;
  _pricevar             NUMERIC := 0.00;
  _journalNumber INTEGER := fetchJournalNumber('GL-MISC');

BEGIN
  SELECT recv_qty, recv_date::DATE AS recv_date, recv_freight_curr_id,
	 recv_orderitem_id,
	 round(currToCurr(recv_freight_curr_id,
			  COALESCE(_currid, recv_freight_curr_id),
         recv_freight, recv_date::DATE),2) AS recv_freight,
         recv_posted, recv_order_type,
         COALESCE(itemsite_id, -1) AS itemsiteid,
	 itemsite_item_id, itemsite_costmethod, itemsite_controlmethod,
	 (recv_splitfrom_id IS NOT NULL
	 OR (SELECT (count(*) > 0) 
	     FROM recv
	     WHERE (recv_splitfrom_id=recv_id))) AS split INTO _r
  FROM recv LEFT OUTER JOIN itemsite ON (recv_itemsite_id=itemsite_id)
  WHERE (recv_id=precvid);

  IF (NOT FOUND) THEN
    RETURN _itemlocSeries;
  END IF;

  IF (NOT _r.recv_order_type IN ('PO', 'RA', 'TO')) THEN
    RETURN -11;
  END IF;

  IF (_r.split) THEN
    RETURN -12;
  END IF;

  SELECT currToBase(orderitem_unitcost_curr_id, orderitem_unitcost,
		    _r.recv_date::DATE) AS unitprice_base,
	 orderhead_number, orderitem_linenumber,
	 orderhead_curr_id AS freight_curr_id,
	 orderitem_orderhead_type,
	 orderitem_qty_invuomratio INTO _o
  FROM orderhead, orderitem
  WHERE ((orderhead_id=orderitem_orderhead_id)
    AND  (orderhead_type=orderitem_orderhead_type)
    AND  (orderitem_id=_r.recv_orderitem_id)
    AND  (orderitem_orderhead_type=_r.recv_order_type));

  IF (NOT FOUND) THEN
    RETURN _itemlocSeries;
  END IF;

  -- Default to _o.orderitem_unitcost if recv_purchcost is not supplied
  -- Note: this should never happen, a value is always supplied
  if (pRecvCost IS NULL) THEN
    _recvcost := _o.orderitem_unitcost;
  ELSE
    -- Note: if the receipt has already been posted, pRecvCost will always 
    --       equal the original recv_purchcost (cannot be modified in GUI)
    _recvcost := pRecvCost; 
  END IF;

  IF (_r.recv_posted) THEN
    _qty := (pQty - _r.recv_qty);
    IF (_qty <> 0) THEN
      IF (_r.itemsiteid = -1) THEN
        PERFORM insertGLTransaction( _journalNumber,'S/R',
                                     _r.recv_order_type,
                                     _o.orderhead_number,
                                     'Receive Non-Inventory from ' || _r.recv_order_type,
                                     expcat_liability_accnt_id,
                                     getPrjAccntId(poitem_prj_id, expcat_exp_accnt_id),
                                     -1,
                                     ROUND(_o.unitprice_base * _qty, 2),
                                     pEffective )
        FROM poitem, expcat
        WHERE ((poitem_expcat_id=expcat_id)
          AND  (poitem_id=_r.recv_orderitem_id)
          AND  (_o.orderitem_orderhead_type='PO'));

        UPDATE recv
        SET recv_qty=pQty,
            recv_value=(recv_value + ROUND(_o.unitprice_base * _qty, 2)),
            recv_date = pEffective
        WHERE (recv_id=precvid);
      ELSEIF (_r.itemsite_controlmethod = 'N') THEN
        PERFORM insertGLTransaction( _journalNumber,'S/R',
                                     _r.recv_order_type,
                                     _o.orderhead_number,
                                     'Receive Non-Controlled Inventory from ' || _r.recv_order_type,
                                     costcat_liability_accnt_id,
                                     getPrjAccntId(poitem_prj_id, costcat_exp_accnt_id),
                                     -1,
                                     ROUND(_o.unitprice_base * _qty, 2),
                                     pEffective )
        FROM poitem, itemsite, costcat
        WHERE ((poitem_itemsite_id=itemsite_id)
          AND  (itemsite_costcat_id=costcat_id)
          AND  (poitem_id=_r.recv_orderitem_id)
          AND  (_o.orderitem_orderhead_type='PO'));

        UPDATE recv
        SET recv_qty=pQty,
            recv_value=(recv_value + ROUND(_o.unitprice_base * _qty, 2)),
            recv_date = pEffective
        WHERE (recv_id=precvid);
      ELSE
        IF (_itemlocSeries = 0 OR _itemlocSeries IS NULL) THEN
          _itemlocSeries := NEXTVAL('itemloc_series_seq');
        END IF;

  SELECT postInvTrans( itemsite_id, 'RP',
			     (_qty * _o.orderitem_qty_invuomratio),
			     'S/R', _r.recv_order_type,
			     _o.orderhead_number::TEXT || '-' || _o.orderitem_linenumber::TEXT, '',
			     'Receive Inventory from ' || _r.recv_order_type,
			     costcat_asset_accnt_id,
			     costcat_liability_accnt_id,
			     _itemlocSeries, pEffective,
           ROUND(_recvcost * _qty, 2) -- alway passing since it is ignored if not average costed item
                           ) INTO _tmp
	FROM itemsite, costcat
	WHERE ((itemsite_costcat_id=costcat_id)
    AND  (itemsite_id=_r.itemsiteid) );

        IF(_r.itemsite_costmethod='A') THEN
	  UPDATE recv
	     SET recv_qty=pQty,
	         recv_value=(recv_value + _recvcost * _qty * _o.orderitem_qty_invuomratio),
                 recv_date = pEffective
	   WHERE(recv_id=precvid);
        ELSE
	  UPDATE recv
	     SET recv_qty=pQty,
	         recv_value=(recv_value + stdcost(_r.itemsite_item_id) * _qty * _o.orderitem_qty_invuomratio),
                 recv_date = pEffective
	   WHERE(recv_id=precvid);
        END IF;
    END IF;

      IF (_r.recv_order_type = 'PO') THEN
	UPDATE poitem
	SET poitem_qty_received=(poitem_qty_received + _qty)
	WHERE (poitem_id=_r.recv_orderitem_id);
      ELSIF (_r.recv_order_type = 'RA' AND fetchMetricBool('EnableReturnAuth')) THEN
	UPDATE raitem
	SET raitem_qtyreceived=(raitem_qtyreceived + _qty)
	WHERE (raitem_id=_r.recv_orderitem_id);
      ELSIF (_r.recv_order_type = 'TO' AND fetchMetricBool('MultiWhs')) THEN
	UPDATE toitem
	SET toitem_qty_received=(toitem_qty_received + _qty)
	WHERE (toitem_id=_r.recv_orderitem_id);
      END IF;

    END IF;

       IF (fetchMetricBool('RecordPPVonReceipt')) THEN -- If the 'Purchase Price Variance on Receipt' option is true
         _invhistid := _tmp;
         -- Find the difference in the purchase price value expected from the P/O and the value of the transaction
         SELECT (((currToBase(pohead_curr_id,
         COALESCE(recv_purchcost, poitem_unitprice),
         recv_date::DATE)) * _qty) - (invhist_value_after - invhist_value_before)) INTO _pricevar
         FROM invhist, recv, pohead, poitem
         WHERE ((recv_orderitem_id=poitem_id)
           AND  (poitem_pohead_id=pohead_id)
           AND  (recv_id=precvid)
           AND  (invhist_id = _invhistid));

         -- If difference exists then
         IF (_pricevar <> 0.00) THEN
           -- Record an additional GL Transaction for the purchase price variance
           SELECT insertGLTransaction( _journalNumber,
                'S/R', _r.recv_order_type, _o.orderhead_number,
                                       'Purchase price variance adjusted for P/O ' || _o.orderhead_number || ' for item ' || _o.orderitem_linenumber::TEXT,
                                       costcat_liability_accnt_id,
                                       getPrjAccntId(poitem_prj_id, costcat_purchprice_accnt_id), -1,
                                       _pricevar,
                                       pEffective, false ) INTO _tmp
           FROM itemsite, costcat, poitem, recv
           WHERE ((itemsite_costcat_id=costcat_id)
              AND (recv_id=precvid)
              AND (recv_orderitem_id=poitem_id)
              AND (itemsite_id=recv_itemsite_id) );
           IF (NOT FOUND) THEN
             RAISE EXCEPTION 'Could not insert G/L transaction: no cost category found for itemsite_id %',
             _r.itemsite_id;
           ELSIF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
             RETURN _tmp;
           ELSE
             -- Posting to trial balance is deferred to prevent locking
             INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
             VALUES ( _tmp, _itemlocSeries );
           END IF;
         END IF;
       END IF;

    _freight := (pFreight - _r.recv_freight);
    IF (_freight <> 0) THEN

      IF (_r.itemsiteid = -1) THEN
  PERFORM insertGLTransaction( _journalNumber,'S/R', _r.recv_order_type,
				     _o.orderhead_number,
				    'Receive Non-Inventory Freight from ' || _r.recv_order_type,
             expcat_liability_accnt_id, getPrjAccntId(poitem_prj_id, expcat_freight_accnt_id), -1,
				      ROUND(currToBase(_currid, _freight,
						    pEffective), 2),
				     pEffective )
	FROM poitem, expcat
	WHERE ((poitem_expcat_id=expcat_id)
	  AND  (poitem_id=_r.recv_orderitem_id)
	  AND  (_r.recv_order_type='PO'));
      ELSE
  PERFORM insertGLTransaction(_journalNumber,'S/R', _r.recv_order_type,
				    _o.orderhead_number, 
				    'Receive Non-Inventory Freight from ' ||
							    _r.recv_order_type,
				   costcat_liability_accnt_id,
				   costcat_freight_accnt_id, -1,
				   round(currToBase(_currid, _freight,
						    pEffective), 2),
				   pEffective )
	FROM itemsite, costcat
	WHERE ( (itemsite_costcat_id=costcat_id)
	  AND   (itemsite_id=_r.itemsiteid) );
      END IF;

      IF (_r.recv_order_type = 'PO') THEN
	UPDATE poitem
	SET poitem_freight_received=(poitem_freight_received +
				   currToCurr(_currid, _o.freight_curr_id,
					      _freight, pEffective))
	WHERE (poitem_id=_r.recv_orderitem_id);

      -- raitem does not track freight

      ELSEIF (_r.recv_order_type = 'TO' AND fetchMetricBool('MultiWhs')) THEN
	UPDATE toitem
	SET toitem_freight_received=(toitem_freight_received +
				   currToCurr(_currid, _o.freight_curr_id,
					      _freight, pEffective))
	WHERE (toitem_id=_r.recv_orderitem_id);
      END IF;

      UPDATE recv
      SET recv_freight=currToCurr(_currid, recv_freight_curr_id, pFreight,
				  pEffective),
	  recv_date = pEffective
      WHERE (recv_id=precvid);
    END IF;

  ELSE

-- Receipt not posted yet
    UPDATE recv SET recv_qty=pQty, recv_freight=pFreight, recv_purchcost=_recvcost WHERE recv_id=precvid;
  END IF;

RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
