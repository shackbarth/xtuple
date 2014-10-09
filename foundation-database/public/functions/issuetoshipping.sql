CREATE OR REPLACE FUNCTION issueToShipping(INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueToShipping('SO', $1, $2, 0, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION issueToShipping(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueToShipping('SO', $1, $2, $3, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION issueToShipping(TEXT, INTEGER, NUMERIC, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueToShipping($1, $2, $3, $4, $5, NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION issueToShipping(pordertype TEXT,
                                           pitemid INTEGER,
                                           pQty NUMERIC,
                                           pItemlocSeries INTEGER,
                                           pTimestamp TIMESTAMP WITH TIME ZONE,
                                           pinvhistid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemlocSeries        INTEGER;
  _timestamp            TIMESTAMP WITH TIME ZONE;
  _coholdtype           TEXT;
  _balance              NUMERIC;
  _invhistid            INTEGER;
  _shipheadid           INTEGER;
  _shipnumber           INTEGER;
  _cntctid              INTEGER;
  _p                    RECORD;
  _m                    RECORD;
  _value                NUMERIC;
  _warehouseid          INTEGER;
  _shipitemid           INTEGER;
  _freight              NUMERIC;

BEGIN

  IF (pTimestamp IS NULL) THEN
    _timestamp := CURRENT_TIMESTAMP;
  ELSE
    _timestamp := pTimestamp;
  END IF;

  IF (pItemlocSeries = 0) THEN
    _itemlocSeries := NEXTVAL('itemloc_series_seq');
  ELSE
    _itemlocSeries := pItemlocSeries;
  END IF;

  IF (pordertype = 'SO') THEN

    -- Check site security
    SELECT warehous_id INTO _warehouseid
    FROM coitem,itemsite,site()
    WHERE ((coitem_id=pitemid)
    AND (itemsite_id=coitem_itemsite_id)
    AND (warehous_id=itemsite_warehous_id));
          
    IF (NOT FOUND) THEN
      RETURN 0;
    END IF;

    -- Check for average cost items going negative
    IF ( SELECT ( (itemsite_costmethod='A') AND
                  ((itemsite_qtyonhand - round(pQty * coitem_qty_invuomratio, 6)) < 0.0) )
         FROM coitem JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
         WHERE (coitem_id=pitemid) ) THEN
      RETURN -20;
    END IF;

    -- Check auto registration
    IF ( SELECT COALESCE(itemsite_autoreg, FALSE)
         FROM coitem JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
         WHERE (coitem_id=pitemid) ) THEN
      SELECT COALESCE(crmacct_cntct_id_1, -1) INTO _cntctid
      FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id)
                  JOIN crmacct ON (crmacct_cust_id=cohead_cust_id)
      WHERE (coitem_id=pitemid);
      IF (_cntctid = -1) THEN
        RETURN -15;
      END IF;
    END IF; 
  
    -- Check Credit Hold
    SELECT cohead_holdtype INTO _coholdtype
    FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id)
    WHERE (coitem_id=pitemid);

    SELECT calcSalesOrderAmt(cohead_id) -
           COALESCE(SUM(currToCurr(aropenalloc_curr_id, cohead_curr_id,
                                   aropenalloc_amount, cohead_orderdate)),0) INTO _balance
    FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id)
                LEFT OUTER JOIN aropenalloc ON (aropenalloc_doctype='S' AND
                                                aropenalloc_doc_id=cohead_id)
    WHERE (coitem_id=pitemid)
    GROUP BY cohead_id;

    --RAISE NOTICE 'issueToShipping - order balance is %', _balance;
    IF ( (_coholdtype = 'C') AND (_balance > 0.0) ) THEN
      RETURN -12;
    ELSIF (_coholdtype = 'P') THEN
      RETURN -13;
    ELSIF (_coholdtype = 'R') THEN
      RETURN -14;
    END IF;

    SELECT shiphead_id INTO _shipheadid
    FROM shiphead, coitem JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
    WHERE ( (coitem_id=pitemid)
      AND   (shiphead_number=getOpenShipment(pordertype, coitem_cohead_id, itemsite_warehous_id)) );
    IF (NOT FOUND) THEN
      SELECT NEXTVAL('shiphead_shiphead_id_seq') INTO _shipheadid;

      _shipnumber := fetchShipmentNumber();
      IF (_shipnumber < 0) THEN
	RETURN -10;
      END IF;

      INSERT INTO shiphead
      ( shiphead_id, shiphead_number, shiphead_order_id, shiphead_order_type,
	shiphead_shipped,
	shiphead_sfstatus, shiphead_shipvia, shiphead_shipchrg_id,
	shiphead_freight, shiphead_freight_curr_id,
	shiphead_shipdate, shiphead_notes, shiphead_shipform_id )
      SELECT _shipheadid, _shipnumber, coitem_cohead_id, pordertype,
	     FALSE,
	     'N', cohead_shipvia,
	     CASE WHEN (cohead_shipchrg_id <= 0) THEN NULL
	          ELSE cohead_shipchrg_id
	     END,
	     cohead_freight, cohead_curr_id,
	     _timestamp::DATE, cohead_shipcomments,
	     CASE WHEN cohead_shipform_id = -1 THEN NULL
	          ELSE cohead_shipform_id
	     END
      FROM cohead, coitem
      WHERE ((coitem_cohead_id=cohead_id)
         AND (coitem_id=pitemid) );

      UPDATE pack
      SET pack_shiphead_id = _shipheadid,
	  pack_printed = FALSE
      FROM coitem
      WHERE ((pack_head_id=coitem_cohead_id)
	AND  (pack_shiphead_id IS NULL)
	AND  (pack_head_type='SO')
	AND  (coitem_id=pitemid));

    ELSE
      UPDATE pack
      SET pack_printed = FALSE
      FROM coitem
      WHERE ((pack_head_id=coitem_cohead_id)
	AND  (pack_shiphead_id=_shipheadid)
	AND  (pack_head_type='SO')
	AND  (coitem_id=pitemid));
    END IF;

    -- Handle g/l transaction
    SELECT postInvTrans( itemsite_id, 'SH', (pQty * coitem_qty_invuomratio),
			   'S/R', porderType,
			   formatSoNumber(coitem_id), shiphead_number,
                           ('Issue ' || item_number || ' to Shipping for customer ' || cohead_billtoname),
			   getPrjAccntId(cohead_prj_id, costcat_shipasset_accnt_id), costcat_asset_accnt_id,
			   _itemlocSeries, _timestamp, NULL, pinvhistid ) INTO _invhistid
    FROM coitem, cohead, itemsite, item, costcat, shiphead
    WHERE ( (coitem_cohead_id=cohead_id)
     AND (coitem_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (itemsite_costcat_id=costcat_id)
     AND (coitem_id=pitemid)
     AND (shiphead_id=_shipheadid) );

    SELECT (invhist_unitcost * invhist_invqty) INTO _value
    FROM invhist
    WHERE (invhist_id=_invhistid);

    _shipitemid := nextval('shipitem_shipitem_id_seq');
    INSERT INTO shipitem
    ( shipitem_id, shipitem_shiphead_id, shipitem_orderitem_id, shipitem_qty,
      shipitem_transdate, shipitem_trans_username, shipitem_invoiced,
      shipitem_value, shipitem_invhist_id )
    VALUES
    ( _shipitemid, _shipheadid, pitemid, pQty,
      _timestamp, getEffectiveXtUser(), FALSE,
      _value, 
      CASE WHEN _invhistid = -1 THEN
        NULL
      ELSE 
        _invhistid
      END );

    -- Handle reservation
    IF (fetchmetricbool('EnableSOReservations')) THEN
      -- Remember what was reserved so we can re-reserve if this issue is returned
      INSERT INTO shipitemrsrv 
        (shipitemrsrv_shipitem_id, shipitemrsrv_qty)
      SELECT _shipitemid, least(pQty,coitem_qtyreserved)
      FROM coitem
      WHERE ((coitem_id=pitemid)
      AND (coitem_qtyreserved > 0));

      -- Update sales order
      UPDATE coitem
        SET coitem_qtyreserved = noNeg(coitem_qtyreserved - pQty)
      WHERE(coitem_id=pitemid);
    END IF;

    -- Calculate shipment freight
    SELECT calcShipFreight(_shipheadid) INTO _freight;
    UPDATE shiphead SET shiphead_freight=_freight
    WHERE (shiphead_id=_shipheadid);

  ELSEIF (pordertype = 'TO') THEN

    -- Check site security
    IF (fetchMetricBool('MultiWhs')) THEN
      SELECT warehous_id INTO _warehouseid
      FROM toitem, tohead, site()
      WHERE ( (toitem_id=pitemid)
        AND   (tohead_id=toitem_tohead_id)
        AND   (warehous_id=tohead_src_warehous_id) );
          
      IF (NOT FOUND) THEN
        RETURN 0;
      END IF;
    END IF;

    SELECT postInvTrans( itemsite_id, 'SH', pQty, 'S/R',
			 pordertype, formatToNumber(toitem_id), '', 'Issue to Shipping',
			 costcat_shipasset_accnt_id, costcat_asset_accnt_id,
			 _itemlocSeries, _timestamp) INTO _invhistid
    FROM tohead, toitem, itemsite, costcat
    WHERE ((tohead_id=toitem_tohead_id)
      AND  (itemsite_item_id=toitem_item_id)
      AND  (itemsite_warehous_id=tohead_src_warehous_id)
      AND  (itemsite_costcat_id=costcat_id)
      AND  (toitem_id=pitemid) );

    SELECT (invhist_unitcost * invhist_invqty) INTO _value
    FROM invhist
    WHERE (invhist_id=_invhistid);

    SELECT shiphead_id INTO _shipheadid
    FROM shiphead, toitem JOIN tohead ON (tohead_id=toitem_tohead_id)
    WHERE ( (toitem_id=pitemid)
      AND   (shiphead_number=getOpenShipment(pordertype, tohead_id, tohead_src_warehous_id)) );

    IF (NOT FOUND) THEN
      _shipheadid := NEXTVAL('shiphead_shiphead_id_seq');

      _shipnumber := fetchShipmentNumber();
      IF (_shipnumber < 0) THEN
	RETURN -10;
      END IF;

      INSERT INTO shiphead
      ( shiphead_id, shiphead_number, shiphead_order_id, shiphead_order_type,
	shiphead_shipped,
	shiphead_sfstatus, shiphead_shipvia, shiphead_shipchrg_id,
	shiphead_freight, shiphead_freight_curr_id,
	shiphead_shipdate, shiphead_notes, shiphead_shipform_id )
      SELECT _shipheadid, _shipnumber, tohead_id, pordertype,
	     FALSE,
	     'N', tohead_shipvia, tohead_shipchrg_id,
	     tohead_freight + SUM(toitem_freight), tohead_freight_curr_id,
	     _timestamp::DATE, tohead_shipcomments, tohead_shipform_id
      FROM tohead, toitem
      WHERE ((toitem_tohead_id=tohead_id)
         AND (tohead_id IN (SELECT toitem_tohead_id
			    FROM toitem
			    WHERE (toitem_id=pitemid))) )
      GROUP BY tohead_id, tohead_shipvia, tohead_shipchrg_id, tohead_freight,
	       tohead_freight_curr_id, tohead_shipcomments, tohead_shipform_id;
    END IF;

    INSERT INTO shipitem
    ( shipitem_shiphead_id, shipitem_orderitem_id, shipitem_qty,
      shipitem_transdate, shipitem_trans_username, shipitem_invoiced,
      shipitem_value, shipitem_invhist_id )
    VALUES
    ( _shipheadid, pitemid, pQty,
      _timestamp, getEffectiveXtUser(), FALSE,
      _value, 
      CASE WHEN _invhistid = -1 THEN NULL
           ELSE _invhistid
      END
    );

  ELSE
    RETURN -11;
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE plpgsql;
