
CREATE OR REPLACE FUNCTION convertQuoteToInvoice(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  _qunumber TEXT;
  _ponumber TEXT;
  _iheadid INTEGER;
  _iitemid INTEGER;
  _orderid INTEGER;
  _ordertype CHARACTER(1);
  _creditstatus	TEXT;
  _usespos BOOLEAN := false;
  _blanketpos BOOLEAN := true;
  _showConvertedQuote BOOLEAN := false;
  _prospectid	INTEGER;
  _r RECORD;
  _inNum TEXT;

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

-- Get Credit Stat, Uses POs and Blanket POs

  SELECT cust_creditstatus, cust_usespos, cust_blanketpos
    INTO _creditstatus, _usespos, _blanketpos
  FROM quhead, custinfo
  WHERE ((quhead_cust_id=cust_id)
    AND  (quhead_id=pQuheadid));

-- Check to see if customer or prospect

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
  ELSIF (_creditstatus = 'H' AND NOT hasPriv('CreateSOForHoldCustomer')) THEN
    RETURN -4;
  ELSIF (_creditstatus = 'W' AND NOT hasPriv('CreateSOForWarnCustomer')) THEN
    RETURN -5;
  END IF;

-- PO/blanket PO checks
  IF (_usespos) THEN
    SELECT quhead_number, COALESCE(quhead_custponumber, ''), invchead_id INTO _qunumber, _ponumber, _iheadid
    FROM quhead LEFT OUTER JOIN invchead ON ( (invchead_cust_id=quhead_cust_id) AND
                                              (UPPER(invchead_ponumber)=UPPER(quhead_custponumber)) )
    WHERE (quhead_id=pQuheadid);
    IF (_ponumber = '') THEN
      RAISE EXCEPTION 'Customer PO required for Quote % [xtuple: convertQuote, -7, %]',
                      _qunumber, _qunumber;
    END IF;
  
    IF ( (NOT _blanketpos) AND (_iheadid IS NOT NULL) ) THEN
      RAISE EXCEPTION 'Duplicate Customer PO % for Quote % [xtuple: convertQuote, -8, %, %]',
                      _ponumber, _qunumber,
                      _ponumber, _qunumber;
    END IF;
  END IF;
  

  IF (_usespos) THEN
    SELECT quhead_number INTO _qunumber
    FROM quhead
    WHERE (quhead_id=pQuheadid)
      AND (COALESCE(quhead_custponumber, '') = '');
    IF (FOUND) THEN
      RAISE EXCEPTION 'Customer PO required for Quote % [xtuple: convertQuote, -7, %]',
                      _qunumber, _qunumber;
    END IF;
  END IF;
  
  IF ( (_usespos) AND (NOT _blanketpos) ) THEN
    SELECT quhead_number, quhead_custponumber INTO _qunumber, _ponumber
    FROM quhead JOIN invchead ON ( (invchead_cust_id=quhead_cust_id) AND
                                   (UPPER(invchead_ponumber)=UPPER(quhead_custponumber)) )
    WHERE (quhead_id=pQuheadid);
    IF (FOUND) THEN
      RAISE EXCEPTION 'Duplicate Customer PO % for Quote % [xtuple: convertQuote, -8, %, %]',
                      _ponumber, _qunumber,
                      _ponumber, _qunumber;
    END IF;
  END IF;
  
--Check to see if an invoice exists with the quote number
  
  PERFORM quhead_number, invchead_id 
  FROM quhead, invchead 
  WHERE quhead_id = pQuheadid
  AND invchead_invcnumber = quhead_number;

-- If it does then get a new Invoice number otherwise use the quote number as the invoice number

  IF (FOUND) THEN
    SELECT fetchinvcnumber() INTO _inNum;
  ELSE
    SELECT quhead_number INTO _inNum
    FROM quhead
    WHERE quhead_id = pQuheadid;
  END IF;

--Insert quote info into invoice tables

  SELECT NEXTVAL('invchead_invchead_id_seq') INTO _iheadid;
  INSERT INTO invchead
  ( invchead_ordernumber, invchead_shipdate, invchead_recurring,
    invchead_id, invchead_invcnumber, invchead_cust_id,
    invchead_orderdate, invchead_ponumber, 
    invchead_billto_name, invchead_billto_address1,
    invchead_billto_address2, invchead_billto_address3,
    invchead_billto_city, invchead_billto_state, invchead_billto_zipcode, invchead_billto_country,
    invchead_shipto_id, invchead_shipto_name, invchead_shipto_address1,
    invchead_shipto_address2, invchead_shipto_address3,
    invchead_shipto_city, invchead_shipto_state, invchead_shipto_zipcode, invchead_shipto_country, 
    invchead_salesrep_id, invchead_commission,
    invchead_terms_id, invchead_shipchrg_id, invchead_fob, invchead_shipvia,
    invchead_notes, invchead_freight, 
    invchead_misc_amount, invchead_misc_accnt_id, invchead_misc_descrip,
    invchead_prj_id, invchead_curr_id, invchead_taxzone_id,
    invchead_posted, invchead_printed, invchead_invcdate,
    invchead_saletype_id, invchead_shipzone_id
    --invchead_taxtype_id,
    --invchead_shipto_cntct_id, invchead_shipto_cntct_honorific, invchead_shipto_cntct_first_name,
    --invchead_shipto_cntct_middle, invchead_shipto_cntct_last_name, invchead_shipto_cntct_suffix,
    --invchead_shipto_cntct_phone, invchead_shipto_cntct_title, invchead_shipto_cntct_fax, 
    --invchead_shipto_cntct_email,
    --invchead_billto_cntct_id, invchead_billto_cntct_honorific,
    --invchead_billto_cntct_first_name, invchead_billto_cntct_middle, invchead_billto_cntct_last_name, 
    --invchead_billto_cntct_suffix, invchead_billto_cntct_phone, invchead_billto_cntct_title, 
    --invchead_billto_cntct_fax, invchead_billto_cntct_email, 
    --invchead_ophead_id,
    --invchead_calcfreight 
    )
  SELECT quhead_number, quhead_packdate, 'f',
         _iheadid, _inNum, quhead_cust_id,
         CURRENT_DATE, quhead_custponumber, 
         quhead_billtoname, quhead_billtoaddress1,
         quhead_billtoaddress2, quhead_billtoaddress3,
         quhead_billtocity, quhead_billtostate, quhead_billtozip, quhead_billtocountry,
         quhead_shipto_id, quhead_shiptoname, quhead_shiptoaddress1,
         quhead_shiptoaddress2, quhead_shiptoaddress3,
         quhead_shiptocity, quhead_shiptostate, quhead_shiptozipcode, quhead_shiptocountry,
         quhead_salesrep_id, quhead_commission,
         quhead_terms_id, cust_shipchrg_id, quhead_fob, quhead_shipvia,
         quhead_ordercomments,  quhead_freight,
         quhead_misc, quhead_misc_accnt_id, quhead_misc_descrip,
         quhead_prj_id, quhead_curr_id, quhead_taxzone_id,
         'f','f',current_date,
         quhead_saletype_id, quhead_shipzone_id
         --quhead_shipto_cntct_id, quhead_shipto_cntct_honorific,
	 --quhead_shipto_cntct_first_name, quhead_shipto_cntct_middle, quhead_shipto_cntct_last_name,
	 --quhead_shipto_cntct_suffix, quhead_shipto_cntct_phone, quhead_shipto_cntct_title,
	 --quhead_shipto_cntct_fax, quhead_shipto_cntct_email, quhead_billto_cntct_id,
	 --quhead_billto_cntct_honorific, quhead_billto_cntct_first_name, quhead_billto_cntct_middle,
	 --quhead_billto_cntct_last_name, quhead_billto_cntct_suffix, quhead_billto_cntct_phone,
	 --quhead_billto_cntct_title, quhead_billto_cntct_fax, quhead_billto_cntct_email, quhead_ophead_id,
         --quhead_calcfreight
  FROM quhead JOIN custinfo ON (cust_id=quhead_cust_id)
  WHERE (quhead_id=pQuheadid);

-- Attachments on Invoice not supported but leaving this in for future use:
/*
  UPDATE url SET url_source_id = _iheadid,
                 url_source = 'I'
  WHERE ((url_source='Q') AND (url_source_id = pQuheadid));

  UPDATE imageass SET imageass_source_id = _iheadid,
                      imageass_source = 'I'
  WHERE ((imageass_source='Q') AND (imageass_source_id = pQuheadid));

  UPDATE docass SET docass_source_id = _iheadid,
                    docass_source_type = 'I'
  WHERE ((docass_source_type='Q') AND (docass_source_id = pQuheadid));
*/


-- Comments not supported on Invoice but leaving this in for future use:

/*  
  INSERT INTO comment
  ( comment_cmnttype_id, comment_source, comment_source_id, comment_date, comment_user, comment_text, comment_public )
  SELECT comment_cmnttype_id, 'I', _iheadid, comment_date, comment_user, ('Quote-' || comment_text), comment_public
  FROM comment
  WHERE ( (comment_source='Q')
    AND   (comment_source_id=pQuheadid) );
*/

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
            WHERE (quhead_id=pQuheadid) LOOP

    SELECT NEXTVAL('invcitem_invcitem_id_seq') INTO _iitemid;

    INSERT INTO invcitem
    ( invcitem_id, invcitem_invchead_id, invcitem_linenumber, 
      invcitem_item_id,
      invcitem_warehous_id,
      --invcitem_status, 
      --invcitem_scheddate, invcitem_promdate,
      invcitem_price, invcitem_custprice, 
      invcitem_ordered, invcitem_billed,
      invcitem_qty_uom_id, invcitem_qty_invuomratio,
      invcitem_price_uom_id, invcitem_price_invuomratio,
      invcitem_custpn, invcitem_notes, invcitem_taxtype_id )
    VALUES
    ( _iitemid, _iheadid, _r.quitem_linenumber, 
      (SELECT itemsite_item_id FROM itemsite WHERE itemsite_id = _r.quitem_itemsite_id),
      (SELECT itemsite_warehous_id FROM itemsite WHERE itemsite_id = _r.quitem_itemsite_id),
      --'O', 
      --_r.quitem_scheddate, _r.quitem_promdate,
      _r.quitem_price, _r.quitem_custprice,
      _r.quitem_qtyord, _r.quitem_qtyord,
      _r.quitem_qty_uom_id, _r.quitem_qty_invuomratio,
      _r.quitem_price_uom_id, _r.quitem_price_invuomratio,
      _r.quitem_custpn, _r.quitem_memo, _r.quitem_taxtype_id );

    IF (fetchMetricBool('enablextcommissionission')) THEN
      PERFORM xtcommission.getSalesReps(quhead_cust_id, quhead_shipto_id,
                                        _r.itemsite_item_id, _r.quhead_saletype_id,
                                        _r.quitem_price, _r.quitem_custprice,
                                        _iitemid, 'InvoiceItem')
      FROM quhead
      WHERE (quhead_id=pQuheadid);
    END IF;

-- Chracteristics not supported on Invoice but leaving in for future use:

/*
    INSERT INTO charass
          (charass_target_type, charass_target_id, charass_char_id, charass_value, charass_default, charass_price)
    SELECT 'SI', _iitemid, charass_char_id, charass_value, charass_default, charass_price
      FROM charass
     WHERE ((charass_target_type='QI')
       AND  (charass_target_id=_r.quitem_id));
*/


-- Comments not supported but leaving in for future use

/*
    INSERT INTO comment
    ( comment_cmnttype_id, comment_source, comment_source_id, comment_date, comment_user, comment_text )
    SELECT comment_cmnttype_id, 'SI', _iitemid, comment_date, comment_user, ('Quote-' || comment_text)
    FROM comment
    WHERE ( (comment_source='QI')
      AND   (comment_source_id=_r.quitem_id) );
*/

    _orderid := -1;
    _ordertype := '';
    IF (_r.quitem_createorder) THEN

      IF (_r.item_type IN ('M')) THEN
        SELECT createWo( CAST(_r.quhead_number AS INTEGER), supply.itemsite_id, 1, (_r.quitem_qtyord * _r.quitem_qty_invuomratio),
                         _r.itemsite_leadtime, _r.quitem_scheddate, _r.quitem_memo, 'Q', _iitemid, _r.quhead_prj_id ) INTO _orderId
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
        SELECT createPr( CAST(_r.quhead_number AS INTEGER), _r.quitem_itemsite_id, (_r.quitem_qtyord * _r.quitem_qty_invuomratio),
                         _r.quitem_scheddate, '', 'S', _iitemid ) INTO _orderId;
        _orderType := 'R';
        UPDATE pr SET pr_prj_id=_r.quhead_prj_id WHERE pr_id=_orderId;
      ELSIF ( (_r.item_type IN ('P', 'O')) AND (_r.itemsite_createsopo) ) THEN
        IF (_r.quitem_prcost=0) THEN
-- For now quote to invoice/dropship will not be supported but with the creation of a createPurchaseToQuote() version of createPurchaseToSale()
-- it can be
--          SELECT createPurchaseToSale(_iitemid, _r.itemsrcid, _r.quitem_dropship) INTO _orderId;
            RAISE EXCEPTION 'Quote contains one or more dropship items that may not be converted from a Quote to an Invoice';
        ELSE
-- For now quote to invoice/dropship will not be supported but with the creation of a createPurchaseToQuote() version of createPurchaseToSale()
-- it can be
--          SELECT createPurchaseToSale(_iitemid, _r.itemsrcid, _r.quitem_dropship, _r.quitem_prcost) INTO _orderId;
            RAISE EXCEPTION 'Quote contains one or more dropship items that may not be converted from a Quote to an Invoice';
        END IF;
        _orderType := 'P';
      END IF;

--      UPDATE invcitem SET invcitem_order_type=_ordertype, invcitem_order_id=_orderid
--      WHERE (invcitem_id=_iitemid);

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

  RETURN _iheadid;

END;
$$
  LANGUAGE plpgsql VOLATILE
  COST 100;

