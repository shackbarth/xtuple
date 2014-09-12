CREATE OR REPLACE FUNCTION postInvTrans(pItemsiteId    INTEGER,
                                        pTransType     TEXT,
                                        pQty           NUMERIC,
                                        pModule        TEXT,
                                        pOrderType     TEXT,
                                        pOrderNumber   TEXT,
                                        pDocNumber     TEXT,
                                        pComments      TEXT,
                                        pDebitid       INTEGER,
                                        pCreditid      INTEGER,
                                        pItemlocSeries INTEGER,
                                        pTimestamp     TIMESTAMP WITH TIME ZONE
                                                       DEFAULT CURRENT_TIMESTAMP,
                                        pCostOvrld     NUMERIC DEFAULT NULL,
                                        pInvhistid     INTEGER DEFAULT NULL)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- pInvhistid is the original transaction to be returned, reversed, etc.
DECLARE
  _creditid	     INTEGER;
  _debitid	     INTEGER;
  _glreturn	     INTEGER;
  _invhistid	     INTEGER;
  _itemlocdistid     INTEGER;
  _r		     RECORD;
  _sense	     INTEGER;  -- direction in which to adjust inventory QOH
  _t		     RECORD;
  _timestamp         TIMESTAMP WITH TIME ZONE;
  _xferwhsid	     INTEGER;

BEGIN

  --  Cache item and itemsite info  
  SELECT CASE WHEN(itemsite_costmethod IN ('A','J')) THEN COALESCE(abs(pCostOvrld / pQty), avgcost(itemsite_id))
              ELSE stdCost(itemsite_item_id)
         END AS cost,
         itemsite_costmethod,
         itemsite_qtyonhand,
	 itemsite_warehous_id,
         ( (item_type = 'R') OR (itemsite_controlmethod = 'N') ) AS nocontrol,
         (itemsite_controlmethod IN ('L', 'S')) AS lotserial,
         (itemsite_loccntrl) AS loccntrl,
         itemsite_freeze AS frozen INTO _r
  FROM itemsite JOIN item ON (item_id=itemsite_item_id)
  WHERE (itemsite_id=pItemsiteid);

  --Post the Inventory Transactions
  IF (_r.nocontrol) THEN
    RETURN -1; -- non-fatal error so dont throw an exception?
  END IF;

  IF (COALESCE(pItemlocSeries,0) = 0) THEN
    RAISE EXCEPTION 'Transaction series must be provided';
  END IF;

  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;

  IF ((pTimestamp IS NULL) OR (CAST(pTimestamp AS date)=CURRENT_DATE)) THEN
    _timestamp := CURRENT_TIMESTAMP;
  ELSE
    _timestamp := pTimestamp;
  END IF;

  IF (pTransType = 'TS' OR pTransType = 'TR') THEN
    SELECT * INTO _t FROM tohead WHERE (tohead_number=pDocNumber);
    IF (pTransType = 'TS') THEN
      _xferwhsid := CASE
          WHEN (_t.tohead_src_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_trns_warehous_id
          WHEN (_t.tohead_trns_warehous_id=_r.itemsite_warehous_id AND pComments ~* 'recall') THEN _t.tohead_src_warehous_id
          WHEN (_t.tohead_trns_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_dest_warehous_id
          WHEN (_t.tohead_dest_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_trns_warehous_id
          ELSE NULL
          END;
    ELSIF (pTransType = 'TR') THEN
      _xferwhsid := CASE
          WHEN (_t.tohead_src_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_trns_warehous_id
          WHEN (_t.tohead_trns_warehous_id=_r.itemsite_warehous_id AND pComments ~* 'recall') THEN _t.tohead_dest_warehous_id
          WHEN (_t.tohead_trns_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_src_warehous_id
          WHEN (_t.tohead_dest_warehous_id=_r.itemsite_warehous_id) THEN _t.tohead_trns_warehous_id
          ELSE NULL
          END;
    END IF;
  END IF;


  -- increase inventory: AD RM RT RP RR RS RX RB TR
  -- decrease inventory: IM IB IT SH SI EX RI
  -- TS and TR are special: shipShipment and recallShipment should not change
  -- QOH at the Transfer Order src whs (as this was done by issueToShipping)
  -- but postReceipt should change QOH at the transit whs
  IF (pTransType='TS') THEN
    _sense := CASE WHEN (SELECT tohead_trns_warehous_id=_r.itemsite_warehous_id
                         FROM tohead
                         WHERE (tohead_number=pDocNumber)) THEN -1
                         ELSE 0
                         END;
  ELSIF (pTransType='TR') THEN
    _sense := CASE WHEN (SELECT tohead_src_warehous_id=_r.itemsite_warehous_id
                         FROM tohead
                         WHERE (tohead_number=pDocNumber)) THEN 0
                         ELSE 1
                         END;
  ELSIF (pTransType IN ('IM', 'IB', 'IT', 'SH', 'SI', 'EX', 'RI')) THEN
    _sense := -1;

  ELSE
    _sense := 1;
  END IF;

  IF((_r.itemsite_costmethod='A') AND (_r.itemsite_qtyonhand + round(_sense * pQty, 6)) < 0) THEN
    -- Can not let average costed itemsites go negative
    RAISE EXCEPTION 'This transaction will cause an Average Costed item to go negative which is not allowed [xtuple: postinvtrans, -2]';
  END IF;

  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id, invhist_transtype, invhist_transdate,
      invhist_invqty, invhist_qoh_before,
      invhist_qoh_after,
      invhist_costmethod, invhist_value_before, invhist_value_after,
      invhist_ordtype, invhist_ordnumber, invhist_docnumber, invhist_comments,
      invhist_invuom, invhist_unitcost, invhist_xfer_warehous_id, invhist_posted,
      invhist_series )
  SELECT
    _invhistid, itemsite_id, pTransType, _timestamp,
    pQty, itemsite_qtyonhand,
    (itemsite_qtyonhand + (_sense * pQty)),
    itemsite_costmethod, itemsite_value,
    -- sanity check to ensure that value = 0 when qtyonhand = 0
    CASE WHEN ((itemsite_qtyonhand + (_sense * pQty))) = 0.0 THEN 0.0
         ELSE itemsite_value + (_r.cost * _sense * pQty)
    END,
    pOrderType, pOrderNumber, pDocNumber, pComments,
    uom_name, _r.cost, _xferwhsid, FALSE, pItemlocSeries
  FROM itemsite, item, uom
  WHERE ( (itemsite_item_id=item_id)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_id=pItemsiteid) );

  IF (pCreditid IN (SELECT accnt_id FROM accnt)) THEN
    _creditid = pCreditid;
  ELSE
    SELECT warehous_default_accnt_id INTO _creditid
    FROM itemsite, whsinfo
    WHERE ( (itemsite_warehous_id=warehous_id)
      AND  (itemsite_id=pItemsiteid) );
  END IF;

  IF (pDebitid IN (SELECT accnt_id FROM accnt)) THEN
    _debitid = pDebitid;
  ELSE
    SELECT warehous_default_accnt_id INTO _debitid
    FROM itemsite, whsinfo
    WHERE ( (itemsite_warehous_id=warehous_id)
      AND  (itemsite_id=pItemsiteid) );
  END IF;

  --  Post the G/L Transaction
  IF (_creditid <> _debitid) THEN
    SELECT insertGLTransaction(pModule, pOrderType, pOrderNumber, pComments,
                               _creditid, _debitid, _invhistid,
                               (_r.cost * pQty), _timestamp::DATE, FALSE) INTO _glreturn;
  END IF;

  --  Distribute this if this itemsite is controlled
  IF ( _r.lotserial OR _r.loccntrl ) THEN

    _itemlocdistid := nextval('itemlocdist_itemlocdist_id_seq');
    INSERT INTO itemlocdist
    ( itemlocdist_id,
      itemlocdist_itemsite_id,
      itemlocdist_source_type,
      itemlocdist_reqlotserial,
      itemlocdist_distlotserial,
      itemlocdist_expiration,
      itemlocdist_qty,
      itemlocdist_series,
      itemlocdist_invhist_id,
      itemlocdist_order_type,
      itemlocdist_order_id )
    SELECT _itemlocdistid,
           pItemsiteid,
           'O',
           (((pQty * _sense) > 0)  AND _r.lotserial),
           ((pQty * _sense) < 0),
           endOfTime(),
           (_sense * pQty),
           pItemlocSeries,
           _invhistid,
           pOrderType, 
           CASE WHEN pOrderType='SO' THEN getSalesLineItemId(pOrderNumber)
                ELSE NULL
           END;

    -- populate distributions if invhist_id parameter passed to undo
    IF (pInvhistid IS NOT NULL) THEN
      INSERT INTO itemlocdist
        ( itemlocdist_itemlocdist_id, itemlocdist_source_type, itemlocdist_source_id,
          itemlocdist_itemsite_id, itemlocdist_ls_id, itemlocdist_expiration,
          itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id ) 
      SELECT _itemlocdistid, 'L', COALESCE(invdetail_location_id, -1),
             invhist_itemsite_id, invdetail_ls_id,  COALESCE(invdetail_expiration, endoftime()),
             (invdetail_qty * -1.0), pItemlocSeries, _invhistid
      FROM invhist JOIN invdetail ON (invdetail_invhist_id=invhist_id)
      WHERE (invhist_id=pInvhistid);

      IF ( _r.lotserial)  THEN          
        INSERT INTO lsdetail 
          ( lsdetail_itemsite_id, lsdetail_ls_id, lsdetail_created,
            lsdetail_source_type, lsdetail_source_id, lsdetail_source_number ) 
        SELECT invhist_itemsite_id, invdetail_ls_id, CURRENT_TIMESTAMP,
               'I', _itemlocdistid, ''
        FROM invhist JOIN invdetail ON (invdetail_invhist_id=invhist_id)
        WHERE (invhist_id=pInvhistid);
      END IF;

      PERFORM distributeitemlocseries(pItemlocSeries);
      
    END IF;

  END IF;   -- end of distributions

  -- These records will be used for posting G/L transactions to trial balance after records committed.
  -- If we try to do it now concurrency locking prevents any transactions while
  -- user enters item distribution information.  Cant have that.
  INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
  VALUES ( _glreturn, pItemlocSeries );

  RETURN _invhistid;

END;
$$ LANGUAGE 'plpgsql';
