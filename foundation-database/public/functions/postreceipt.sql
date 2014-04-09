-- Function: postreceipt(integer, integer)

-- DROP FUNCTION postreceipt(integer, integer);

CREATE OR REPLACE FUNCTION postreceipt(integer, integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  precvid		ALIAS FOR $1;
  _itemlocSeries	INTEGER := COALESCE($2, 0);
  _freightAccnt		INTEGER;
  _glDate		TIMESTAMP WITH TIME ZONE;
  _o			RECORD;
  _ordertypeabbr	TEXT;
  _r			RECORD;
  _ra			RECORD;
  _recvinvqty          NUMERIC := 0.00;
  _recvvalue		NUMERIC := 0.00;
  _pricevar            NUMERIC := 0.00;
  _tmp			INTEGER;
  _toitemitemid		INTEGER;
  _coheadid		INTEGER;
  _coitemid		INTEGER;
  _linenumber          INTEGER;
  _invhistid		INTEGER;
  _shipheadid		INTEGER;
  _ship               	BOOLEAN;
  _i			RECORD;

BEGIN
  SELECT recv_id, recv_order_type, recv_orderitem_id, recv_qty,
	 round(currToBase(recv_freight_curr_id, recv_freight, recv_date::DATE),
	       2) AS recv_freight_base,
	 recv_freight, recv_freight_curr_id, recv_date, recv_gldistdate,
	 itemsite_id, itemsite_item_id, item_inv_uom_id, itemsite_costmethod,
         itemsite_controlmethod, vend_name, item_number, item_fractional
	 INTO _r
  FROM recv LEFT OUTER JOIN itemsite ON (recv_itemsite_id=itemsite_id)
            LEFT OUTER JOIN item ON (itemsite_item_id=item_id)
            LEFT OUTER JOIN vendinfo ON (recv_vend_id=vend_id)
  WHERE ((recv_id=precvid)
    AND  (NOT recv_posted));

  IF (NOT FOUND) THEN
    IF (_itemlocSeries = 0) THEN
      RETURN -10;
    END IF;
    RETURN _itemlocSeries;

  ELSEIF (_r.recv_qty <= 0) THEN
    RETURN -11;

  ELSIF (_r.recv_order_type ='PO') THEN
    _ordertypeabbr := ('P/O for ' || _r.vend_name || ' for item ' || _r.item_number);

    SELECT pohead_number AS orderhead_number, poitem_id AS orderitem_id,
           poitem_linenumber AS orderitem_linenumber,
	   currToBase(pohead_curr_id,
                      COALESCE(recv_purchcost, poitem_unitprice),
		      recv_date::DATE) AS item_unitprice_base,
	   poitem_invvenduomratio AS invvenduomratio,
	   pohead_orderdate AS orderdate, pohead_dropship,
	   poitem_prj_id AS prj_id INTO _o
    FROM recv, pohead, poitem
    WHERE ((recv_orderitem_id=poitem_id)
      AND  (poitem_pohead_id=pohead_id)
      AND  (NOT recv_posted)
      AND  (recv_id=precvid));
  ELSIF (_r.recv_order_type ='RA') THEN
    _ordertypeabbr := 'R/A for item ' || _r.item_number;
    
    SELECT rahead_id AS orderhead_id, rahead_number AS orderhead_number, raitem_id AS orderitem_id,
           raitem_linenumber AS orderitem_linenumber,
	   currToBase(rahead_curr_id, raitem_unitprice,
		    recv_date::DATE) AS item_unitprice_base,
	   raitem_qty_invuomratio AS invvenduomratio,
	   rahead_authdate AS orderdate,
	   raitem_unitcost AS unitcost,
	   rahead_prj_id AS prj_id INTO _o
    FROM recv, rahead, raitem
    WHERE ((recv_orderitem_id=raitem_id)
      AND  (raitem_rahead_id=rahead_id)
      AND  (NOT recv_posted)
      AND  (recv_id=precvid));
  ELSIF (_r.recv_order_type ='TO') THEN
     _ordertypeabbr := 'T/O for item ' || _r.item_number;

    SELECT tohead_number AS orderhead_number, toitem_id AS orderitem_id,
           toitem_linenumber AS orderitem_linenumber,
	   toitem_stdcost AS item_unitprice_base,
	   1.0 AS invvenduomratio,
	   tohead_orderdate AS orderdate,
	   NULL AS prj_id INTO _o
    FROM recv, tohead, toitem
    WHERE ((recv_orderitem_id=toitem_id)
      AND  (toitem_tohead_id=tohead_id)
      AND  (NOT recv_posted)
      AND  (recv_id=precvid));
  ELSE
    RETURN -13;	-- don't know how to handle this order type
  END IF;

  IF (NOT FOUND) THEN
    IF (_itemlocSeries = 0) THEN
      RETURN -10;
    END IF;
    RETURN _itemlocSeries;
  END IF;

  IF (_itemlocSeries = 0) THEN
    _itemlocSeries := NEXTVAL('itemloc_series_seq');
  ELSEIF (_itemlocSeries < 0) THEN
    RETURN _itemlocSeries;
  END IF;

  _glDate := COALESCE(_r.recv_gldistdate, _r.recv_date);
  _recvinvqty := roundQty(_r.item_fractional, (_r.recv_qty * _o.invvenduomratio));

  IF ( (_r.recv_order_type = 'PO') AND
        (_r.itemsite_id = -1 OR _r.itemsite_id IS NULL OR _r.itemsite_controlmethod = 'N') ) THEN

    IF (_r.itemsite_id IS NOT NULL) THEN
      SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'), 
				  'S/R', _r.recv_order_type, _o.orderhead_number,
	  			  'Receive Non-Controlled Inventory from ' || _ordertypeabbr,
				   costcat_liability_accnt_id,
				   getPrjAccntId(_o.prj_id, costcat_exp_accnt_id), -1,
				   round((_o.item_unitprice_base * _r.recv_qty),2),
				   _glDate::DATE, false ) INTO _tmp
      FROM poitem, itemsite, costcat
      WHERE((poitem_itemsite_id=itemsite_id)
        AND (itemsite_costcat_id=costcat_id)
        AND (poitem_id=_o.orderitem_id));
    ELSE
      SELECT insertGLTransaction(fetchJournalNumber('GL-MISC'),
				  'S/R', _r.recv_order_type, _o.orderhead_number,
	  			  'Receive Non-Inventory from ' || 'P/O for ' || _r.vend_name || ' for ' || expcat_code,
				   expcat_liability_accnt_id,
				   getPrjAccntId(_o.prj_id, expcat_exp_accnt_id), -1,
				   round((_o.item_unitprice_base * _r.recv_qty),2),
				   _glDate::DATE, false ) INTO _tmp
      FROM poitem, expcat
      WHERE((poitem_expcat_id=expcat_id)
        AND (poitem_id=_o.orderitem_id));
    END IF;
      

    IF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
      RETURN _tmp;
    ELSE
      -- Posting to trial balance is deferred to prevent locking
      INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
      VALUES ( _tmp, _itemlocSeries );
      
    END IF;

    SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'),
				'S/R', _r.recv_order_type, _o.orderhead_number,
				'Receive Non-Inventory Freight from ' || _ordertypeabbr,
				 expcat_liability_accnt_id,
				 getPrjAccntId(_o.prj_id, expcat_freight_accnt_id), -1,
				 _r.recv_freight_base,
				 _glDate::DATE, false ),
	   expcat_freight_accnt_id INTO _tmp, _freightAccnt
    FROM poitem, expcat
    WHERE((poitem_expcat_id=expcat_id)
      AND (poitem_id=_o.orderitem_id));

    IF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
      RETURN _tmp;
    ELSE
      -- Posting to trial balance is deferred to prevent locking
      INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
      VALUES ( _tmp, _itemlocSeries );
    END IF;

    _recvvalue := ROUND((_o.item_unitprice_base * _r.recv_qty),2);

    UPDATE poitem
    SET poitem_qty_received = (poitem_qty_received + _r.recv_qty),
	poitem_freight_received = (poitem_freight_received + _r.recv_freight_base)
    WHERE (poitem_id=_o.orderitem_id);

  ELSEIF ( (_r.recv_order_type = 'RA') AND
           (_r.itemsite_id = -1 OR _r.itemsite_id IS NULL) ) THEN
    RAISE NOTICE 'itemsite controlmethod is %, cannot post receipt.', _r.itemsite_controlmethod;
    RETURN -14;	-- otherwise how do we get the accounts?

  ELSEIF ( (_r.recv_order_type = 'TO') AND
           (_r.itemsite_id = -1 OR _r.itemsite_id IS NULL) ) THEN
    RAISE NOTICE 'itemsite missing';
    RETURN -14;	-- otherwise how do we get the accounts?

  ELSE	-- not ELSIF: some code is shared between diff order types
    IF (_r.recv_order_type = 'PO') THEN
      SELECT postInvTrans( itemsite_id, 'RP'::TEXT,
			   _recvinvqty,
			   'S/R'::TEXT,
			   _r.recv_order_type::TEXT, _o.orderhead_number::TEXT || '-' || _o.orderitem_linenumber::TEXT,
			   ''::TEXT,
			   'Receive Inventory from ' || _ordertypeabbr,
			   costcat_asset_accnt_id, costcat_liability_accnt_id,
			   _itemlocSeries,
			   _glDate,
                           round((_o.item_unitprice_base * _r.recv_qty),2) -- always passing this in since it is ignored if it is not average costed item
			   ) INTO _tmp
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_r.itemsite_id) );
      IF (NOT FOUND) THEN
	RAISE EXCEPTION 'Could not post inventory transaction: no cost category found for itemsite_id %',
	  _r.itemsite_id;
      ELSIF (_tmp < -1) THEN -- less than -1 because -1 means it is a none controlled item
	IF(_tmp = -3) THEN
	  RETURN -12; -- The GL trans value was 0 which means we likely do not have a std cost
	END IF;
	RETURN _tmp;
      END IF;

      -- If the 'Purchase Price Variance on Receipt' option is true
      IF (fetchMetricBool('RecordPPVonReceipt')) THEN
        _invhistid := _tmp;
        -- Find the difference in the purchase price value expected from the P/O and the value of the transaction
        SELECT ((_o.item_unitprice_base * _r.recv_qty) - (invhist_value_after - invhist_value_before)) INTO _pricevar
        FROM invhist
        WHERE (invhist_id = _invhistid);

        -- If difference exists then
        IF (_pricevar <> 0.00) THEN
          -- Record an additional GL Transaction for the purchase price variance
          SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'),
				       'S/R', _r.recv_order_type, _o.orderhead_number,
                                      'Purchase price variance adjusted for P/O ' || _o.orderhead_number || ' for item ' || _r.item_number,
                                      costcat_liability_accnt_id,
                                      getPrjAccntId(_o.prj_id, costcat_purchprice_accnt_id), -1,
                                      _pricevar,
                                      _glDate::DATE, false ) INTO _tmp
          FROM itemsite, costcat
          WHERE ((itemsite_costcat_id=costcat_id)
             AND (itemsite_id=_r.itemsite_id) );
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

      SELECT insertGLTransaction(fetchJournalNumber('GL-MISC'),
				  'S/R', _r.recv_order_type, _o.orderhead_number,
				  'Receive Inventory Freight from ' || _o.orderhead_number || ' for item ' || _r.item_number,
				   costcat_liability_accnt_id,
				   getPrjAccntId(_o.prj_id, costcat_freight_accnt_id), -1,
				   _r.recv_freight_base,
				   _glDate::DATE, false ),
	     costcat_freight_accnt_id INTO _tmp, _freightAccnt
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_r.itemsite_id) );
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

      UPDATE poitem
      SET poitem_qty_received = (poitem_qty_received + _r.recv_qty),
	  poitem_freight_received = (poitem_freight_received + _r.recv_freight_base)
      WHERE (poitem_id=_o.orderitem_id);

    ELSIF (_r.recv_order_type = 'RA') THEN
      SELECT rahead.*, raitem.* INTO _ra
	    FROM rahead, raitem
        WHERE ((rahead_id=raitem_rahead_id)
        AND  (raitem_id=_r.recv_orderitem_id));

      IF (_r.itemsite_controlmethod = 'N') THEN
        SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'), 
                                    'S/R', _r.recv_order_type, _o.orderhead_number,
                                    'Receive Non-Controlled Inventory from ' || _ordertypeabbr,
                                    costcat_liability_accnt_id,
                                    getPrjAccntId(_o.prj_id, costcat_exp_accnt_id), -1,
                                    round((_o.item_unitprice_base * _r.recv_qty),2),
                                    _glDate::DATE, false ) INTO _tmp
        FROM itemsite JOIN costcat ON (costcat_id=itemsite_costcat_id)
        WHERE(itemsite_id=_r.itemsite_id);
        IF (NOT FOUND) THEN
          RAISE EXCEPTION 'Could not post inventory transaction: no cost category found for itemsite_id %', _r.itemsite_id;
--        ELSIF (_tmp < -1) THEN
--          RETURN _tmp;
        END IF;
      ELSE
        SELECT postInvTrans(_r.itemsite_id, 'RR',
                            _recvinvqty,
                            'S/R',
                            _r.recv_order_type, _ra.rahead_number::TEXT || '-' || _ra.raitem_linenumber::TEXT,
                            '',
                            'Receive Inventory from ' || _ordertypeabbr,
                            costcat_asset_accnt_id,
                            CASE WHEN(COALESCE(_ra.raitem_cos_accnt_id, -1) != -1) THEN 
                                  getPrjAccntId(_o.prj_id, _ra.raitem_cos_accnt_id)
                                 WHEN (_ra.raitem_warranty) THEN 
                                  getPrjAccntId(_o.prj_id, resolveCOWAccount(_r.itemsite_id, _ra.rahead_cust_id, _ra.rahead_saletype_id, _ra.rahead_shipzone_id))
                                 ELSE
                                  getPrjAccntId(_o.prj_id, resolveCORAccount(_r.itemsite_id, _ra.rahead_cust_id, _ra.rahead_saletype_id, _ra.rahead_shipzone_id))
                            END,
                            _itemlocSeries, _glDate, COALESCE(_o.unitcost,stdcost(itemsite_item_id)) * _recvinvqty) INTO _tmp
        FROM itemsite, costcat
        WHERE ( (itemsite_costcat_id=costcat_id)
         AND (itemsite_id=_r.itemsite_id) );

        IF (NOT FOUND) THEN
          RAISE EXCEPTION 'Could not post inventory transaction: no cost category found for itemsite_id %', _r.itemsite_id;
        ELSIF (_tmp < -1) THEN -- less than -1 because -1 means it is a none controlled item
          IF(_tmp = -3) THEN
            RAISE NOTICE 'The GL trans value was 0 which means we likely do not have a std cost';
            RETURN -12; -- The GL trans value was 0 which means we likely do not have a std cost
          END IF;
          RETURN _tmp;
        END IF;
      END IF;

      INSERT INTO rahist (rahist_itemsite_id, rahist_date,
			  rahist_descrip,
			  rahist_qty, rahist_uom_id,
			  rahist_source, rahist_source_id, rahist_rahead_id
	  ) VALUES (_r.itemsite_id, _glDate,
		      'Receive Inventory from ' || _ordertypeabbr,
		      _recvinvqty, _r.item_inv_uom_id,
		      'RR', _r.recv_id, _ra.rahead_id
	          );

      SELECT insertGLTransaction(fetchJournalNumber('GL-MISC'),
				  'S/R', _r.recv_order_type, _o.orderhead_number,
				  'Receive Inventory Freight from ' || _o.orderhead_number || ' for item ' || _r.item_number,
				   costcat_liability_accnt_id,
				   getPrjAccntId(_o.prj_id, costcat_freight_accnt_id), -1,
				   _r.recv_freight_base,
				   _glDate::DATE, false ),
	     costcat_freight_accnt_id INTO _tmp, _freightAccnt
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_r.itemsite_id) );
      IF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
	    RETURN _tmp;
      ELSE
        -- Posting to trial balance is deferred to prevent locking
        INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
        VALUES ( _tmp, _itemlocSeries );
      END IF;

      INSERT INTO rahist (rahist_date, rahist_descrip,
			  rahist_source, rahist_source_id,
			  rahist_curr_id, rahist_amount,
			  rahist_rahead_id
	  ) VALUES (_glDate, 'Receive Inventory Freight from ' || _ordertypeabbr,
		  'RR', _r.recv_id, _r.recv_freight_curr_id, _r.recv_freight,
		  _ra.rahead_id
	  );

      UPDATE raitem
      SET raitem_qtyreceived = (raitem_qtyreceived + _r.recv_qty)
      WHERE (raitem_id=_o.orderitem_id);
      
-- Expire date doesn't mean anything once the RA is received 
-- WARNING: INSERTING 'NULL' MIGHT CAUSE PROBLEMS!!
      UPDATE rahead
      SET rahead_expiredate = NULL
      WHERE (rahead_id=_o.orderhead_id);

--  Look for 'ship' lines
    SELECT (count(*) > 0) INTO _ship
    FROM raitem
    WHERE ((raitem_disposition = 'S')
     AND (raitem_new_coitem_id IS NULL)
     AND (raitem_rahead_id=_ra.rahead_id));

--  If receiving a qty on a shippable and upon receipt item, create coitem
      IF ((_ra.rahead_timing='R') AND
          (_ship OR (
          (_ra.raitem_disposition IN ('P','V')) AND
          (_ra.raitem_new_coitem_id IS NULL) AND
          (_ra.raitem_qtyauthorized > 0)))) THEN

          IF (_ra.rahead_new_cohead_id IS NOT NULL) THEN
            _coheadid = _ra.rahead_new_cohead_id;
          ELSE  
--  No header, so create a Sales Order header first.
            SELECT nextval('cohead_cohead_id_seq') INTO _coheadid;

            INSERT INTO cohead (
              cohead_id,cohead_number,cohead_cust_id,cohead_custponumber,
              cohead_orderdate,cohead_salesrep_id,cohead_terms_id,
              cohead_shipvia,cohead_shipto_id,cohead_shiptoname,
              cohead_shiptoaddress1,cohead_shiptoaddress2,cohead_shiptoaddress3,
              cohead_shiptocity,cohead_shiptostate,cohead_shiptozipcode,
              cohead_shiptocountry,cohead_freight,cohead_shiptophone,
              cohead_shipto_cntct_id, cohead_shipto_cntct_honorific,
              cohead_shipto_cntct_first_name, cohead_shipto_cntct_middle,
              cohead_shipto_cntct_last_name, cohead_shipto_cntct_suffix,
              cohead_shipto_cntct_phone, cohead_shipto_cntct_title,
              cohead_shipto_cntct_fax, cohead_shipto_cntct_email,
              cohead_shipchrg_id, cohead_shipform_id,cohead_billtoname,
              cohead_billtoaddress1,cohead_billtoaddress2,cohead_billtoaddress3,
              cohead_billtocity,cohead_billtostate,cohead_billtozipcode,
              cohead_billtocountry,cohead_misc_accnt_id,cohead_misc_descrip,
              cohead_commission,cohead_holdtype,cohead_prj_id,cohead_shipcomplete,
              cohead_curr_id,cohead_taxzone_id,cohead_saletype_id,cohead_shipzone_id)
            SELECT _coheadid,fetchsonumber(),rahead_cust_id,rahead_custponumber,
              current_date,rahead_salesrep_id,COALESCE(cohead_terms_id,cust_terms_id),
              COALESCE(cohead_shipvia,cust_shipvia),rahead_shipto_id,rahead_shipto_name,
              rahead_shipto_address1,rahead_shipto_address2,rahead_shipto_address3,
              rahead_shipto_city,rahead_shipto_state,rahead_shipto_zipcode,
              rahead_shipto_country,0,COALESCE(cohead_shiptophone,''),
              cntct_id, cntct_honorific,
              cntct_first_name, cntct_middle,
              cntct_last_name, cntct_suffix,
              cntct_phone, cntct_title,
              cntct_fax, cntct_email,
              COALESCE(cohead_shipchrg_id,cust_shipchrg_id),
              COALESCE(cohead_shipform_id,cust_shipform_id),
              rahead_billtoname,rahead_billtoaddress1,rahead_billtoaddress2,rahead_billtoaddress3,
              rahead_billtocity,rahead_billtostate,rahead_billtozip,
              rahead_billtocountry,NULL,'',rahead_commission, 'N', rahead_prj_id,
              COALESCE(cohead_shipcomplete,
                CASE WHEN cust_partialship THEN 
                  false 
                ELSE true
                END),rahead_curr_id,rahead_taxzone_id,rahead_saletype_id,rahead_shipzone_id
            FROM rahead
              JOIN custinfo ON (rahead_cust_id=cust_id)
              LEFT OUTER JOIN cohead ON (rahead_orig_cohead_id=cohead_id)
              LEFT OUTER JOIN shiptoinfo ON (rahead_shipto_id=shipto_id)
              LEFT OUTER JOIN cntct ON (shipto_cntct_id=cntct_id)
            WHERE (rahead_id=_ra.rahead_id);

            UPDATE rahead SET rahead_new_cohead_id=_coheadid WHERE rahead_id=_ra.rahead_id;
            
          END IF;
                  
-- Now enter the line item(s)
        IF (_ra.raitem_disposition IN ('P','V')) AND
           (_ra.raitem_new_coitem_id IS NULL) AND
           (_ra.raitem_qtyauthorized > 0) THEN
           
          SELECT nextval('coitem_coitem_id_seq') INTO _coitemid;

          SELECT COALESCE(MAX(coitem_linenumber),0)+1 INTO _linenumber
          FROM coitem
          WHERE (coitem_cohead_id=_coheadid);
      
          INSERT INTO coitem (
            coitem_id,coitem_cohead_id,coitem_linenumber,coitem_itemsite_id,
            coitem_status,coitem_scheddate,coitem_promdate, coitem_qtyord,
            coitem_unitcost,coitem_price,coitem_custprice,coitem_qtyshipped,
            coitem_order_id,coitem_memo,coitem_qtyreturned,
            coitem_taxtype_id,coitem_qty_uom_id,coitem_qty_invuomratio,
            coitem_price_uom_id,coitem_price_invuomratio,coitem_warranty,
            coitem_cos_accnt_id,coitem_order_type, coitem_custpn)
          SELECT _coitemid,_coheadid,_linenumber,_ra.raitem_coitem_itemsite_id,
              'O',_ra.raitem_scheddate,_ra.raitem_scheddate,_ra.raitem_qtyauthorized,
              stdcost(itemsite_item_id),COALESCE(_ra.raitem_saleprice,0),0,0,
              -1,_ra.raitem_notes,0,
              _ra.raitem_taxtype_id,_ra.raitem_qty_uom_id,_ra.raitem_qty_invuomratio,
              _ra.raitem_price_uom_id,_ra.raitem_price_invuomratio,_ra.raitem_warranty,
              _ra.raitem_cos_accnt_id,
              CASE WHEN itemsite_createwo THEN 'W' ELSE NULL END, _ra.raitem_custpn
          FROM itemsite
          WHERE (itemsite_id=_ra.raitem_coitem_itemsite_id);

          UPDATE raitem SET raitem_new_coitem_id=_coitemid WHERE (raitem_id=_ra.raitem_id);
        END IF;
        
        -- Create items to ship that have no direct relation to receipts.
        IF (_ship) THEN
          FOR _i IN
            SELECT raitem_id FROM raitem
            WHERE ((raitem_rahead_id=_ra.rahead_id)
              AND (raitem_disposition = 'S')
              AND (raitem_new_coitem_id IS NULL))
          LOOP

            SELECT nextval('coitem_coitem_id_seq') INTO _coitemid;

            SELECT COALESCE(MAX(coitem_linenumber),0)+1 INTO _linenumber
              FROM coitem
            WHERE (coitem_cohead_id=_coheadid);
      
            INSERT INTO coitem (
              coitem_id,coitem_cohead_id,coitem_linenumber,coitem_itemsite_id,
              coitem_status,coitem_scheddate,coitem_promdate, coitem_qtyord,
              coitem_unitcost,coitem_price,coitem_custprice,coitem_qtyshipped,
              coitem_order_id,coitem_memo,coitem_qtyreturned,
              coitem_taxtype_id,coitem_qty_uom_id,coitem_qty_invuomratio,
              coitem_price_uom_id,coitem_price_invuomratio,coitem_warranty,
              coitem_cos_accnt_id,coitem_order_type,coitem_custpn)
            SELECT _coitemid,_coheadid,_linenumber,raitem_coitem_itemsite_id,
              'O',raitem_scheddate,raitem_scheddate,raitem_qtyauthorized,
              stdcost(itemsite_item_id),COALESCE(raitem_saleprice,0),0,0,
              -1,raitem_notes,0,
              raitem_taxtype_id,raitem_qty_uom_id,raitem_qty_invuomratio,
              raitem_price_uom_id,raitem_price_invuomratio,raitem_warranty,
              raitem_cos_accnt_id,
              CASE WHEN itemsite_createwo THEN 'W' ELSE NULL END,raitem_custpn
            FROM raitem
              JOIN itemsite ON (itemsite_id=raitem_itemsite_id)
            WHERE (raitem_id=_i.raitem_id);
                        
            UPDATE raitem SET raitem_new_coitem_id=_coitemid WHERE (raitem_id=_i.raitem_id);

          END LOOP;
        END IF;
      END IF;


    ELSIF (_r.recv_order_type = 'TO' AND fetchMetricBool('MultiWhs')) THEN
      SELECT interWarehouseTransfer(toitem_item_id, tohead_trns_warehous_id,
            tohead_dest_warehous_id, _r.recv_qty, 
            'TO', formatToNumber(toitem_id), 'Receive from Transit To Dest Warehouse', _itemlocSeries, _glDate ) INTO _tmp
      FROM tohead, toitem
      WHERE ((tohead_id=toitem_tohead_id)
        AND  (toitem_id=_r.recv_orderitem_id));     

      IF (_tmp < 0) THEN
	    RETURN _tmp;
      END IF;

      SELECT insertGLTransaction(fetchJournalNumber('GL-MISC'), 
				  'S/R', _r.recv_order_type, _o.orderhead_number,
				  'Receive Inventory Freight from ' || _o.orderhead_number || ' for item ' || _r.item_number,
				   costcat_toliability_accnt_id,
				   costcat_freight_accnt_id, -1,
				   _r.recv_freight_base,
				   _glDate::DATE, false ),
	     costcat_freight_accnt_id INTO _tmp, _freightAccnt
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_r.itemsite_id) );
      IF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
	    RETURN _tmp;
      ELSE
        -- Posting to trial balance is deferred to prevent locking
        INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
        VALUES ( _tmp, _itemlocSeries );
      END IF;

      UPDATE toitem
      SET toitem_qty_received = (toitem_qty_received + _r.recv_qty),
	  toitem_freight_received = (toitem_freight_received +
				      currToCurr(_r.recv_freight_curr_id,
						 toitem_freight_curr_id,
						 _r.recv_freight, _glDate::DATE))
      WHERE (toitem_id=_o.orderitem_id);

    END IF;
    IF(_r.itemsite_costmethod='A') THEN
      _recvvalue := ROUND((_o.item_unitprice_base * _r.recv_qty),2);
    ELSIF (fetchMetricBool('RecordPPVonReceipt')) THEN
      _recvvalue := ROUND((_o.item_unitprice_base * _r.recv_qty), 2);
    ELSE
      _recvvalue := ROUND(stdcost(_r.itemsite_item_id) * _recvinvqty, 2);
    END IF;
  END IF;

  UPDATE recv
  SET recv_value=_recvvalue, recv_recvcost=_recvvalue / recv_qty, recv_posted=TRUE, recv_gldistdate=_glDate::DATE
  WHERE (recv_id=precvid);
  
  IF (_r.recv_order_type = 'PO') THEN
    -- If this is a drop-shipped PO, then Issue the item to Shipping and Ship the item
    IF (_o.pohead_dropship = TRUE) THEN

      -- Generate the PoItemDropShipped event
      PERFORM postEvent('PoItemDropShipped', 'P', poitem_id,
                        itemsite_warehous_id,
                        (pohead_number || '-' || poitem_linenumber || ': ' || item_number),
                        NULL, NULL, NULL, NULL)
      FROM poitem JOIN itemsite ON (itemsite_id=poitem_itemsite_id)
                  JOIN item ON (item_id=itemsite_item_id)
                  JOIN pohead ON (pohead_id=poitem_pohead_id)
      WHERE (poitem_id=_o.orderitem_id)
        AND (poitem_duedate <= (CURRENT_DATE + itemsite_eventfence));

    END IF;
  END IF;
  RETURN _itemlocSeries;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION postreceipt(integer, integer)
  OWNER TO admin;
