
CREATE OR REPLACE FUNCTION convertQuote(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  _qunumber TEXT;
  _ponumber TEXT;
  _soheadid INTEGER;
  _soitemid INTEGER;
  _orderid INTEGER;
  _ordertype CHARACTER(1);
  _creditstatus	TEXT;
  _usespos BOOLEAN := false;
  _blanketpos BOOLEAN := true;
  _showConvertedQuote BOOLEAN := false;
  _prospectid	INTEGER;
  _r RECORD;
  _soNum TEXT;

BEGIN

-- Check to make sure the quote has not expired
  IF (SELECT COALESCE(quhead_expire, endOfTime()) < CURRENT_DATE
        FROM quhead
       WHERE(quhead_id=pQuheadid)) THEN
    RETURN -6;
  END IF;

--  Check to make sure that all of the quote items have a valid itemsite
  SELECT quitem_id INTO _r
    FROM quitem LEFT OUTER JOIN itemsite ON (quitem_itemsite_id=itemsite_id)
   WHERE ((itemsite_id IS NULL)
     AND  (quitem_quhead_id=pQuheadid));
  IF (FOUND) THEN
    PERFORM postEvent('CannotConvertQuote', 'Q', quhead_id,
                      quhead_warehous_id, quhead_number,
                      NULL, NULL, NULL, NULL)
    FROM quhead
    WHERE (quhead_id=pQuheadid);

    RETURN -1;
  END IF;

  SELECT cust_creditstatus, cust_usespos, cust_blanketpos
    INTO _creditstatus, _usespos, _blanketpos
  FROM quhead, custinfo
  WHERE ((quhead_cust_id=cust_id)
    AND  (quhead_id=pQuheadid));

  IF (NOT FOUND) THEN
    SELECT prospect_id INTO _prospectid
    FROM quhead, prospect
    WHERE ((quhead_cust_id=prospect_id)
      AND  (quhead_id=pQuheadid));
    IF (NOT FOUND) THEN
      RETURN -2;
    ELSE
      RETURN -3;
    END IF;
  ELSIF (_creditstatus = 'H' AND NOT checkPrivilege('CreateSOForHoldCustomer')) THEN
    RETURN -4;
  ELSIF (_creditstatus = 'W' AND NOT checkPrivilege('CreateSOForWarnCustomer')) THEN
    RETURN -5;
  END IF;

  IF (_usespos) THEN
    SELECT quhead_number, COALESCE(quhead_custponumber, ''), cohead_id INTO _qunumber, _ponumber, _soheadid
    FROM quhead LEFT OUTER JOIN cohead ON ( (cohead_cust_id=quhead_cust_id) AND
                                            (UPPER(cohead_custponumber)=UPPER(quhead_custponumber)) )
    WHERE (quhead_id=pQuheadid);
    IF (_ponumber = '') THEN
      RAISE EXCEPTION 'Customer PO required for Quote % [xtuple: convertQuote, -7, %]',
                      _qunumber, _qunumber;
    END IF;
  
    IF ( (NOT _blanketpos) AND (_soheadid IS NOT NULL) ) THEN
      RAISE EXCEPTION 'Duplicate Customer PO % for Quote % [xtuple: convertQuote, -8, %, %]',
                      _ponumber, _qunumber,
                      _ponumber, _qunumber;
    END IF;
  END IF;
  
  PERFORM quhead_number, cohead_id 
  FROM quhead, cohead 
  WHERE quhead_id = pQuheadid
  AND cohead_number = quhead_number;

  IF (FOUND) THEN
    SELECT fetchSoNumber() INTO _soNum;
  ELSE
    SELECT quhead_number INTO _soNum
    FROM quhead
    WHERE quhead_id = pQuheadid;
  END IF;

  SELECT NEXTVAL('cohead_cohead_id_seq') INTO _soheadid;
  INSERT INTO cohead
  ( cohead_id, cohead_number, cohead_cust_id,
    cohead_orderdate, cohead_packdate,
    cohead_custponumber, cohead_warehous_id,
    cohead_billtoname, cohead_billtoaddress1,
    cohead_billtoaddress2, cohead_billtoaddress3,
    cohead_billtocity, cohead_billtostate, cohead_billtozipcode,
    cohead_billtocountry,
    cohead_shipto_id, cohead_shiptoname, cohead_shiptoaddress1,
    cohead_shiptoaddress2, cohead_shiptoaddress3,
    cohead_shiptocity, cohead_shiptostate, cohead_shiptozipcode,
    cohead_shiptocountry,
    cohead_salesrep_id, cohead_commission,
    cohead_terms_id, cohead_shipchrg_id, cohead_shipform_id,
    cohead_fob, cohead_shipvia,
    cohead_ordercomments, cohead_shipcomments,
    cohead_freight, cohead_misc, cohead_misc_accnt_id, cohead_misc_descrip,
    cohead_holdtype, cohead_wasquote, cohead_quote_number, cohead_prj_id,
    cohead_curr_id, cohead_taxzone_id, cohead_taxtype_id,
    cohead_shipto_cntct_id, cohead_shipto_cntct_honorific, cohead_shipto_cntct_first_name,
    cohead_shipto_cntct_middle, cohead_shipto_cntct_last_name, cohead_shipto_cntct_suffix,
    cohead_shipto_cntct_phone, cohead_shipto_cntct_title, cohead_shipto_cntct_fax, 
    cohead_shipto_cntct_email,
    cohead_billto_cntct_id, cohead_billto_cntct_honorific,
    cohead_billto_cntct_first_name, cohead_billto_cntct_middle, cohead_billto_cntct_last_name, 
    cohead_billto_cntct_suffix, cohead_billto_cntct_phone, cohead_billto_cntct_title, 
    cohead_billto_cntct_fax, cohead_billto_cntct_email, cohead_ophead_id,
    cohead_calcfreight, cohead_saletype_id, cohead_shipzone_id )
  SELECT _soheadid, _soNum, quhead_cust_id,
         CURRENT_DATE, quhead_packdate,
         quhead_custponumber, quhead_warehous_id,
         quhead_billtoname, quhead_billtoaddress1,
         quhead_billtoaddress2, quhead_billtoaddress3,
         quhead_billtocity, quhead_billtostate, quhead_billtozip,
         quhead_billtocountry,
         quhead_shipto_id, quhead_shiptoname, quhead_shiptoaddress1,
         quhead_shiptoaddress2, quhead_shiptoaddress3,
         quhead_shiptocity, quhead_shiptostate, quhead_shiptozipcode,
         quhead_shiptocountry,
         quhead_salesrep_id, quhead_commission,
         quhead_terms_id, cust_shipchrg_id, cust_shipform_id,
         quhead_fob, quhead_shipvia,
         quhead_ordercomments, quhead_shipcomments,
         quhead_freight, quhead_misc, quhead_misc_accnt_id, quhead_misc_descrip,
         'N', TRUE, quhead_number, quhead_prj_id,
	 quhead_curr_id, quhead_taxzone_id, quhead_taxtype_id,
	 quhead_shipto_cntct_id, quhead_shipto_cntct_honorific,
	 quhead_shipto_cntct_first_name, quhead_shipto_cntct_middle, quhead_shipto_cntct_last_name,
	 quhead_shipto_cntct_suffix, quhead_shipto_cntct_phone, quhead_shipto_cntct_title,
	 quhead_shipto_cntct_fax, quhead_shipto_cntct_email, quhead_billto_cntct_id,
	 quhead_billto_cntct_honorific, quhead_billto_cntct_first_name, quhead_billto_cntct_middle,
	 quhead_billto_cntct_last_name, quhead_billto_cntct_suffix, quhead_billto_cntct_phone,
	 quhead_billto_cntct_title, quhead_billto_cntct_fax, quhead_billto_cntct_email, quhead_ophead_id,
         quhead_calcfreight, quhead_saletype_id, quhead_shipzone_id
  FROM quhead JOIN custinfo ON (cust_id=quhead_cust_id)
  WHERE (quhead_id=pQuheadid);

  -- Move Documents
  UPDATE url SET url_source_id = _soheadid,
                 url_source = 'S'
  WHERE ((url_source='Q') AND (url_source_id = pQuheadid));

  UPDATE imageass SET imageass_source_id = _soheadid,
                      imageass_source = 'S'
  WHERE ((imageass_source='Q') AND (imageass_source_id = pQuheadid));

  UPDATE docass SET docass_source_id = _soheadid,
                    docass_source_type = 'S'
  WHERE ((docass_source_type='Q') AND (docass_source_id = pQuheadid));

  -- Move Email
  IF (fetchMetricBool('EnableBatchManager')) THEN
    UPDATE xtbatch.emlassc SET emlassc_type='S',
                               emlassc_assc_id=_soheadid
    WHERE ((emlassc_type='Q') AND (emlassc_assc_id=pQuheadid));
  END IF;

  -- Copy Characteristics
  INSERT INTO charass
        (charass_target_type, charass_target_id, charass_char_id, charass_value, charass_default, charass_price)
  SELECT 'SO', _soheadid, charass_char_id, charass_value, charass_default, charass_price
    FROM charass
   WHERE ((charass_target_type='QU')
     AND  (charass_target_id=pQuheadid));

  -- Copy Comments
  INSERT INTO comment
  ( comment_cmnttype_id, comment_source, comment_source_id, comment_date, comment_user, comment_text, comment_public )
  SELECT comment_cmnttype_id, 'S', _soheadid, comment_date, comment_user, ('Quote-' || comment_text), comment_public
  FROM comment
  WHERE ( (comment_source='Q')
    AND   (comment_source_id=pQuheadid) );

  FOR _r IN SELECT quitem.*,
                   quhead_number, quhead_prj_id, quhead_saletype_id,
                   itemsite_item_id, itemsite_leadtime,
                   itemsite_createsopo, itemsite_createsopr,
                   item_type, COALESCE(quitem_itemsrc_id, itemsrc_id, -1) AS itemsrcid
            FROM quhead JOIN quitem ON (quitem_quhead_id=quhead_id)
                        JOIN itemsite ON (itemsite_id=quitem_itemsite_id)
                        JOIN item ON (item_id=itemsite_item_id)
                        LEFT OUTER JOIN itemsrc ON ( (itemsrc_item_id=item_id) AND
                                                     (itemsrc_default) )
            WHERE (quhead_id=pQuheadid)
            ORDER BY quitem_linenumber LOOP

    SELECT NEXTVAL('coitem_coitem_id_seq') INTO _soitemid;

    INSERT INTO coitem
    ( coitem_id, coitem_cohead_id, coitem_linenumber, coitem_itemsite_id,
      coitem_status, coitem_scheddate, coitem_promdate,
      coitem_price, coitem_custprice, 
      coitem_qtyord, coitem_qtyshipped, coitem_qtyreturned,
      coitem_qty_uom_id, coitem_qty_invuomratio,
      coitem_price_uom_id, coitem_price_invuomratio,
      coitem_unitcost, coitem_prcost,
      coitem_custpn, coitem_memo, coitem_taxtype_id, coitem_order_id )
    VALUES
    ( _soitemid, _soheadid, _r.quitem_linenumber, _r.quitem_itemsite_id,
      'O', _r.quitem_scheddate, _r.quitem_promdate,
      _r.quitem_price, _r.quitem_custprice,
      _r.quitem_qtyord, 0, 0,
      _r.quitem_qty_uom_id, _r.quitem_qty_invuomratio,
      _r.quitem_price_uom_id, _r.quitem_price_invuomratio,
      stdcost(_r.itemsite_item_id), _r.quitem_prcost,
      _r.quitem_custpn, _r.quitem_memo, _r.quitem_taxtype_id, -1 );

    IF (fetchMetricBool('enablextcommissionission')) THEN
      PERFORM xtcommission.getSalesReps(quhead_cust_id, quhead_shipto_id,
                                        _r.itemsite_item_id, _r.quhead_saletype_id,
                                        _r.quitem_price, _r.quitem_custprice,
                                        _soitemid, 'SalesItem')
      FROM quhead
      WHERE (quhead_id=pQuheadid);
    END IF;

    -- Copy Characteristics
    INSERT INTO charass
          (charass_target_type, charass_target_id, charass_char_id, charass_value, charass_default, charass_price)
    SELECT 'SI', _soitemid, charass_char_id, charass_value, charass_default, charass_price
      FROM charass
     WHERE ((charass_target_type='QI')
       AND  (charass_target_id=_r.quitem_id));

    -- Copy Comments
    INSERT INTO comment
    ( comment_cmnttype_id, comment_source, comment_source_id, comment_date, comment_user, comment_text )
    SELECT comment_cmnttype_id, 'SI', _soitemid, comment_date, comment_user, ('Quote-' || comment_text)
    FROM comment
    WHERE ( (comment_source='QI')
      AND   (comment_source_id=_r.quitem_id) );

    _orderid := -1;
    _ordertype := '';
    IF (_r.quitem_createorder) THEN

      IF (_r.item_type IN ('M')) THEN
        SELECT createWo( CAST(_soNum AS INTEGER), supply.itemsite_id, 1,
                         (_r.quitem_qtyord * _r.quitem_qty_invuomratio),
                         _r.itemsite_leadtime, _r.quitem_scheddate, _r.quitem_memo,
                         'S', _soitemid, _r.quhead_prj_id ) INTO _orderId
        FROM itemsite sold, itemsite supply
        WHERE ((sold.itemsite_item_id=supply.itemsite_item_id)
         AND (supply.itemsite_warehous_id=_r.quitem_order_warehous_id)
         AND (sold.itemsite_id=_r.quitem_itemsite_id) );
        _orderType := 'W';

        INSERT INTO charass
              (charass_target_type, charass_target_id, charass_char_id, charass_value)
        SELECT 'W', _orderId, charass_char_id, charass_value
          FROM charass
         WHERE ((charass_target_type='QI')
           AND  (charass_target_id=_r.quitem_id));

      ELSIF ( (_r.item_type IN ('P', 'O')) AND (_r.itemsite_createsopr) ) THEN
        SELECT createPr( CAST(_soNum AS INTEGER), _r.quitem_itemsite_id,
                         (_r.quitem_qtyord * _r.quitem_qty_invuomratio),
                         _r.quitem_scheddate, '', 'S', _soitemid ) INTO _orderId;
        _orderType := 'R';
        UPDATE pr SET pr_prj_id=_r.quhead_prj_id WHERE pr_id=_orderId;
      ELSIF ( (_r.item_type IN ('P', 'O')) AND (_r.itemsite_createsopo) ) THEN
        IF (_r.quitem_prcost=0) THEN
          SELECT createPurchaseToSale(_soitemid, _r.itemsrcid, _r.quitem_dropship) INTO _orderId;
        ELSE
          SELECT createPurchaseToSale(_soitemid, _r.itemsrcid, _r.quitem_dropship, _r.quitem_prcost) INTO _orderId;
        END IF;
        _orderType := 'P';
      END IF;

      UPDATE coitem SET coitem_order_type=_ordertype, coitem_order_id=_orderid
      WHERE (coitem_id=_soitemid);

    END IF;

  END LOOP;

  SELECT metric_value INTO _showConvertedQuote
  FROM metric WHERE metric_name = 'ShowQuotesAfterSO';

  IF (_showConvertedQuote) THEN
    UPDATE quhead
    SET quhead_status= 'C'
    WHERE (quhead_id = pQuheadid);
  ELSE
  PERFORM deleteQuote(pQuheadid);
  END IF;

  RETURN _soheadid;

END;
$$ LANGUAGE 'plpgsql';

