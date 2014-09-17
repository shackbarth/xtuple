SELECT dropIfExists('FUNCTION', 'createPurchaseToSale(integer, integer, boolean)', 'fixcountry');
SELECT dropIfExists('FUNCTION', 'createPurchaseToSale(integer, integer, boolean, numeric)', 'fixcountry');
SELECT dropIfExists('FUNCTION', 'createPurchaseToSale(integer, integer, boolean, numeric, date, numeric)', 'fixcountry');

CREATE OR REPLACE FUNCTION createPurchaseToSale(INTEGER, INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoitemId ALIAS FOR $1;
  pItemSourceId ALIAS FOR $2;
  pDropShip ALIAS FOR $3;

BEGIN

  RETURN createPurchaseToSale(pCoitemId, pItemSourceId, pDropShip, NULL, NULL, NULL);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION createPurchaseToSale(INTEGER, INTEGER, BOOLEAN, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoitemId ALIAS FOR $1;
  pItemSourceId ALIAS FOR $2;
  pDropShip ALIAS FOR $3;
  pPrice ALIAS FOR $4;

BEGIN

  RETURN createPurchaseToSale(pCoitemId, pItemSourceId, pDropShip, NULL, NULL, pPrice);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION createPurchaseToSale(INTEGER, INTEGER, BOOLEAN, NUMERIC, DATE, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoitemId ALIAS FOR $1;
  pItemSourceId ALIAS FOR $2;
  pDropShip ALIAS FOR $3;
  pQty ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pPrice ALIAS FOR $6;

BEGIN

  RETURN createPurchaseToSale(pCoitemId, pItemSourceId, pDropShip, pQty, pDueDate, pPrice, NULL);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION createPurchaseToSale(INTEGER, INTEGER, BOOLEAN, NUMERIC, DATE, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCoitemId ALIAS FOR $1;
  pItemSourceId ALIAS FOR $2;
  pDropShip ALIAS FOR $3;
  pQty ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pPrice ALIAS FOR $6;
  pPoheadId ALIAS FOR $7;

  _s RECORD;
  _w RECORD;
  _i RECORD;
  _shipto RECORD;
  _poheadid INTEGER := -1;
  _poitemid INTEGER := -1;
  _taxtypeid INTEGER := -1;
  _polinenumber INTEGER;
  _ponumber NUMERIC;
  _price NUMERIC;
  _temp INTEGER;

BEGIN

  -- Check for existing poitem for this coitem
  SELECT poitem_id INTO _poitemid
  FROM poitem
  WHERE (poitem_order_id=pCoitemId)
    AND (poitem_order_type='S');
  IF (FOUND) THEN
    RETURN _poitemid;
  END IF;

  SELECT *,
         COALESCE(roundQty(item_fractional, (coitem_qtyord * coitem_qty_invuomratio)), 0.0) AS orderqty
  INTO _s
  FROM coitem JOIN cohead ON (cohead_id = coitem_cohead_id)
              LEFT OUTER JOIN shiptoinfo ON (cohead_shipto_id = shipto_id)
              LEFT OUTER JOIN addr ON (shipto_addr_id = addr_id)
              LEFT OUTER JOIN cntct ON (shipto_cntct_id = cntct_id)
              LEFT OUTER JOIN itemsite ON (coitem_itemsite_id = itemsite_id)
              LEFT OUTER JOIN item ON (item_id = itemsite_item_id)
  WHERE (coitem_id = pCoitemId);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT * INTO _w
  FROM itemsite JOIN whsinfo ON (warehous_id = itemsite_warehous_id)
                LEFT OUTER JOIN addr ON (warehous_addr_id = addr_id)
                LEFT OUTER JOIN cntct ON (warehous_cntct_id = cntct_id)
  WHERE (itemsite_id = _s.itemsite_id);

  SELECT * INTO _i
  FROM itemsrc JOIN vendinfo ON (itemsrc_vend_id = vend_id)
               LEFT OUTER JOIN cntct ON (vend_cntct1_id = cntct_id)
               LEFT OUTER JOIN addr ON (vend_addr_id = addr_id)
  WHERE (itemsrc_id = pItemSourceId);
  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

  -- pPoheadId - NULL=add to existing PO if one exists
  --               -1=must create new PO
  --               >0=must add to existing specified PO
  IF (pDropShip) THEN
    SELECT COALESCE(pohead_id, -1) INTO _temp
    FROM pohead
    WHERE ( (pohead_status = 'U')
      AND (pohead_vend_id = _i.itemsrc_vend_id)
      AND (COALESCE(pohead_shiptoname, '') = COALESCE(_s.cohead_shiptoname, _s.shipto_name, ''))
      AND (COALESCE(pohead_shiptoaddress1, '') = COALESCE(_s.cohead_shiptoaddress1, _s.addr_line1, ''))
      AND (COALESCE(pohead_shiptoaddress2, '') = COALESCE(_s.cohead_shiptoaddress2, _s.addr_line2, ''))
      AND (COALESCE(pohead_shiptoaddress3, '') = COALESCE(_s.cohead_shiptoaddress3, _s.addr_line3, ''))
      AND (COALESCE(pohead_shiptocity, '') = COALESCE(_s.cohead_shiptocity, _s.addr_city, ''))
      AND (COALESCE(pohead_shiptostate, '') = COALESCE(_s.cohead_shiptostate, _s.addr_state, ''))
      AND (COALESCE(pohead_shiptozipcode, '') = COALESCE(_s.cohead_shiptozipcode, _s.addr_postalcode, ''))
      AND (COALESCE(pohead_shiptocountry, '') = COALESCE(_s.cohead_shiptocountry, _s.addr_country, ''))
      AND ((pohead_id=pPoheadId) OR (pPoheadid IS NULL)) );
  ELSE
    SELECT COALESCE(pohead_id, -1) INTO _temp
    FROM pohead
    WHERE ( (pohead_status = 'U')
      AND (pohead_vend_id = _i.itemsrc_vend_id)
      AND (COALESCE(pohead_shiptoaddress1, '') = COALESCE(_w.addr_line1, ''))
      AND (COALESCE(pohead_shiptoaddress2, '') = COALESCE(_w.addr_line2, ''))
      AND (COALESCE(pohead_shiptoaddress3, '') = COALESCE(_w.addr_line3, ''))
      AND (COALESCE(pohead_shiptocity, '') = COALESCE(_w.addr_city, ''))
      AND (COALESCE(pohead_shiptostate, '') = COALESCE(_w.addr_state, ''))
      AND (COALESCE(pohead_shiptozipcode, '') = COALESCE(_w.addr_postalcode, ''))
      AND (COALESCE(pohead_shiptocountry, '') = COALESCE(_w.addr_country, ''))
      AND ((pohead_id=pPoheadId) OR (pPoheadid IS NULL)) );
  END IF;

  IF (FOUND) THEN
    IF (pPoheadId = -1) THEN
      RAISE EXCEPTION 'Problem creating new PO';
    END IF;
    _poheadid := _temp;
    UPDATE pohead
    SET pohead_dropship = pDropShip
    WHERE (pohead_id = _poheadid);
  ELSE
    IF (pPoheadId > 0) THEN
      RAISE EXCEPTION 'Problem adding to existing PO';
    END IF;
    SELECT NEXTVAL('pohead_pohead_id_seq') INTO _poheadid;
    SELECT fetchPoNumber() INTO _ponumber;

    IF (pDropShip) THEN
      INSERT INTO pohead
        ( pohead_id, pohead_number, pohead_status, pohead_dropship,
          pohead_agent_username, pohead_vend_id, pohead_taxzone_id,
          pohead_orderdate, pohead_curr_id, pohead_cohead_id,
          pohead_warehous_id, pohead_shipvia,
          pohead_terms_id, pohead_shipto_cntct_id,
          pohead_shipto_cntct_honorific, pohead_shipto_cntct_first_name,
          pohead_shipto_cntct_middle, pohead_shipto_cntct_last_name,
          pohead_shipto_cntct_suffix, pohead_shipto_cntct_phone,
          pohead_shipto_cntct_title, pohead_shipto_cntct_fax, 
          pohead_shipto_cntct_email, pohead_shiptoaddress_id,
          pohead_shiptoname,
          pohead_shiptoaddress1,
          pohead_shiptoaddress2,
          pohead_shiptoaddress3,
          pohead_shiptocity, 
          pohead_shiptostate, pohead_shiptozipcode,
          pohead_shiptocountry, pohead_vend_cntct_id,
          pohead_vend_cntct_honorific, pohead_vend_cntct_first_name,
          pohead_vend_cntct_middle, pohead_vend_cntct_last_name,
          pohead_vend_cntct_suffix, pohead_vend_cntct_phone,
          pohead_vend_cntct_title, pohead_vend_cntct_fax,
          pohead_vend_cntct_email, pohead_vendaddress1,
          pohead_vendaddress2, pohead_vendaddress3,
          pohead_vendcity, pohead_vendstate,
          pohead_vendzipcode, pohead_vendcountry, pohead_comments )
      VALUES
        ( _poheadid, _ponumber, 'U', pDropShip,
          getEffectiveXtUser(), _i.itemsrc_vend_id, _i.vend_taxzone_id,
	  CURRENT_DATE, COALESCE(_i.vend_curr_id, basecurrid()), _s.cohead_id,
          COALESCE(_s.cohead_warehous_id, -1), COALESCE(_i.vend_shipvia, TEXT('')),
          COALESCE(_i.vend_terms_id, -1), COALESCE(_s.cohead_shipto_cntct_id, _s.shipto_cntct_id),
          COALESCE(_s.cohead_shipto_cntct_honorific, _s.cntct_honorific), COALESCE(_s.cohead_shipto_cntct_first_name, _s.cntct_first_name),
          COALESCE(_s.cohead_shipto_cntct_middle, _s.cntct_middle), COALESCE(_s.cohead_shipto_cntct_last_name, _s.cntct_last_name),
          COALESCE(_s.cohead_shipto_cntct_suffix, _s.cntct_suffix), COALESCE(_s.cohead_shipto_cntct_phone, _s.cntct_phone),
          COALESCE(_s.cohead_shipto_cntct_title, _s.cntct_title), COALESCE(_s.cohead_shipto_cntct_fax, _s.cntct_fax),
          COALESCE(_s.cohead_shipto_cntct_email, _s.cntct_email), COALESCE(_s.shipto_addr_id, _s.addr_id),
          COALESCE(_s.cohead_shiptoname, _s.shipto_name, ''),
          COALESCE(_s.cohead_shiptoaddress1, _s.addr_line1, ''),
          COALESCE(_s.cohead_shiptoaddress2, _s.addr_line2, ''),
          COALESCE(_s.cohead_shiptoaddress3, _s.addr_line3, ''),
          COALESCE(_s.cohead_shiptocity, _s.addr_city, ''),
          COALESCE(_s.cohead_shiptostate, _s.addr_state, ''), COALESCE(_s.cohead_shiptozipcode, _s.addr_postalcode, ''),
          COALESCE(_s.cohead_shiptocountry, _s.addr_country, ''), _i.cntct_id,
          COALESCE(_i.cntct_honorific, TEXT('')), COALESCE(_i.cntct_first_name, TEXT('')),
          COALESCE(_i.cntct_middle, TEXT('')), COALESCE(_i.cntct_last_name, TEXT('')),
          COALESCE(_i.cntct_suffix, TEXT('')), COALESCE(_i.cntct_phone, TEXT('')),
          COALESCE(_i.cntct_title, TEXT('')), COALESCE(_i.cntct_fax, TEXT('')),
          COALESCE(_i.cntct_email, TEXT('')), COALESCE(_i.addr_line1, TEXT('')),
          COALESCE(_i.addr_line2, TEXT('')), COALESCE(_i.addr_line3, TEXT('')),
          COALESCE(_i.addr_city, TEXT('')), COALESCE(_i.addr_state, TEXT('')),
          COALESCE(_i.addr_postalcode, TEXT('')), COALESCE(_i.addr_country, TEXT('')), COALESCE(_s.cohead_shipcomments, TEXT('')) );
    ELSE
      INSERT INTO pohead
        ( pohead_id, pohead_number, pohead_status, pohead_dropship,
          pohead_agent_username, pohead_vend_id, pohead_taxzone_id,
          pohead_orderdate, pohead_curr_id, pohead_cohead_id,
          pohead_warehous_id, pohead_shipvia,
          pohead_terms_id, pohead_shipto_cntct_id,
          pohead_shipto_cntct_honorific, pohead_shipto_cntct_first_name,
          pohead_shipto_cntct_middle, pohead_shipto_cntct_last_name,
          pohead_shipto_cntct_suffix, pohead_shipto_cntct_phone,
          pohead_shipto_cntct_title, pohead_shipto_cntct_fax, 
          pohead_shipto_cntct_email, pohead_shiptoaddress_id,
          pohead_shiptoaddress1,
          pohead_shiptoaddress2,
          pohead_shiptoaddress3,
          pohead_shiptocity, 
          pohead_shiptostate, pohead_shiptozipcode,
          pohead_shiptocountry, pohead_vend_cntct_id,
          pohead_vend_cntct_honorific, pohead_vend_cntct_first_name,
          pohead_vend_cntct_middle, pohead_vend_cntct_last_name,
          pohead_vend_cntct_suffix, pohead_vend_cntct_phone,
          pohead_vend_cntct_title, pohead_vend_cntct_fax,
          pohead_vend_cntct_email, pohead_vendaddress1,
          pohead_vendaddress2, pohead_vendaddress3,
          pohead_vendcity, pohead_vendstate,
          pohead_vendzipcode, pohead_vendcountry )
      VALUES
        ( _poheadid, _ponumber, 'U', pDropShip,
          getEffectiveXtUser(), _i.itemsrc_vend_id, _i.vend_taxzone_id,
	  CURRENT_DATE, COALESCE(_i.vend_curr_id, basecurrid()), _s.cohead_id,
          COALESCE(_s.cohead_warehous_id, -1), COALESCE(_i.vend_shipvia, TEXT('')),
          COALESCE(_i.vend_terms_id, -1), _w.cntct_id,
          _w.cntct_honorific, _w.cntct_first_name,
          _w.cntct_middle, _w.cntct_last_name,
          _w.cntct_suffix, _w.cntct_phone,
          _w.cntct_title, _w.cntct_fax,
          _w.cntct_email, _w.addr_id,
          COALESCE(_w.addr_line1, ''),
          COALESCE(_w.addr_line2, ''),
          COALESCE(_w.addr_line3, ''),
          COALESCE(_w.addr_city, ''),
          COALESCE(_w.addr_state, ''), COALESCE(_w.addr_postalcode, ''),
          COALESCE(_w.addr_country, ''), _i.cntct_id,
          COALESCE(_i.cntct_honorific, TEXT('')), COALESCE(_i.cntct_first_name, TEXT('')),
          COALESCE(_i.cntct_middle, TEXT('')), COALESCE(_i.cntct_last_name, TEXT('')),
          COALESCE(_i.cntct_suffix, TEXT('')), COALESCE(_i.cntct_phone, TEXT('')),
          COALESCE(_i.cntct_title, TEXT('')), COALESCE(_i.cntct_fax, TEXT('')),
          COALESCE(_i.cntct_email, TEXT('')), COALESCE(_i.addr_line1, TEXT('')),
          COALESCE(_i.addr_line2, TEXT('')), COALESCE(_i.addr_line3, TEXT('')),
          COALESCE(_i.addr_city, TEXT('')), COALESCE(_i.addr_state, TEXT('')),
          COALESCE(_i.addr_postalcode, TEXT('')), COALESCE(_i.addr_country, TEXT('')) );
    END IF;
  END IF;

  SELECT NEXTVAL('poitem_poitem_id_seq') INTO _poitemid;

  SELECT (COALESCE(MAX(poitem_linenumber), 0) + 1) INTO _polinenumber
  FROM poitem
  WHERE (poitem_pohead_id = _poheadid);

  SELECT COALESCE(itemtax_taxtype_id, -1) INTO _taxtypeid
  FROM itemtax
  WHERE (itemtax_item_id = _i.itemsrc_item_id);

  IF (pPrice IS NULL) THEN
    SELECT itemsrcPrice(pItemSourceId,
                        COALESCE(_s.cohead_warehous_id, -1),
                        pDropShip,
                        (COALESCE(pQty, _s.orderqty) / COALESCE(_i.itemsrc_invvendoruomratio, 1.00)),
                        COALESCE(_i.vend_curr_id, baseCurrId()),
                        CURRENT_DATE) INTO _price;
  ELSE
    _price := pPrice;
  END IF;
  raise notice '_price=%', _price;

  IF (pDropShip) THEN
    INSERT INTO poitem
      ( poitem_id, poitem_status, poitem_pohead_id, poitem_linenumber, 
        poitem_duedate, poitem_itemsite_id,
        poitem_vend_item_descrip, poitem_vend_uom,
        poitem_invvenduomratio, poitem_qty_ordered, 
        poitem_unitprice, poitem_vend_item_number, 
        poitem_itemsrc_id, poitem_order_id, poitem_order_type, poitem_prj_id, poitem_stdcost, 
        poitem_manuf_name, poitem_manuf_item_number, 
        poitem_manuf_item_descrip, poitem_taxtype_id, poitem_comments )
    VALUES
      ( _poitemid, 'U', _poheadid, _polinenumber,
        COALESCE(pDueDate, _s.coitem_scheddate), _s.coitem_itemsite_id,
        COALESCE(_i.itemsrc_vend_item_descrip, TEXT('')), COALESCE(_i.itemsrc_vend_uom, TEXT('')),
        COALESCE(_i.itemsrc_invvendoruomratio, 1.00), (COALESCE(pQty, _s.orderqty) / COALESCE(_i.itemsrc_invvendoruomratio, 1.00)),
        _price, COALESCE(_i.itemsrc_vend_item_number, TEXT('')),
        pItemSourceId, pCoitemId, 'S', _s.cohead_prj_id, stdcost(_i.itemsrc_item_id),
        COALESCE(_i.itemsrc_manuf_name, TEXT('')), COALESCE(_i.itemsrc_manuf_item_number, TEXT('')),
        COALESCE(_i.itemsrc_manuf_item_descrip, TEXT('')), _taxtypeid,
        COALESCE(_s.coitem_memo, TEXT('')));
  ELSE
    INSERT INTO poitem
      ( poitem_id, poitem_status, poitem_pohead_id, poitem_linenumber, 
        poitem_duedate, poitem_itemsite_id,
        poitem_vend_item_descrip, poitem_vend_uom,
        poitem_invvenduomratio, poitem_qty_ordered, 
        poitem_unitprice, poitem_vend_item_number, 
        poitem_itemsrc_id, poitem_order_id, poitem_order_type, poitem_prj_id, poitem_stdcost, 
        poitem_manuf_name, poitem_manuf_item_number, 
        poitem_manuf_item_descrip, poitem_taxtype_id, poitem_comments )
    VALUES
      ( _poitemid, 'U', _poheadid, _polinenumber,
        COALESCE(pDueDate, _s.coitem_scheddate), _s.coitem_itemsite_id,
        COALESCE(_i.itemsrc_vend_item_descrip, TEXT('')), COALESCE(_i.itemsrc_vend_uom, TEXT('')),
        COALESCE(_i.itemsrc_invvendoruomratio, 1.00), (COALESCE(pQty, _s.orderqty) / COALESCE(_i.itemsrc_invvendoruomratio, 1.00)),
        _price, COALESCE(_i.itemsrc_vend_item_number, TEXT('')),
        pItemSourceId, pCoitemId, 'S', _s.cohead_prj_id, stdcost(_i.itemsrc_item_id),
        COALESCE(_i.itemsrc_manuf_name, TEXT('')), COALESCE(_i.itemsrc_manuf_item_number, TEXT('')),
        COALESCE(_i.itemsrc_manuf_item_descrip, TEXT('')), _taxtypeid,
        COALESCE(_s.coitem_memo, TEXT('')));
  END IF;
  -- Copy characteristics from the coitem to the poitem
  INSERT INTO charass
    ( charass_target_type, charass_target_id, charass_char_id,
      charass_value, charass_default, charass_price )
  SELECT 'PI', _poitemid, charass_char_id,
         charass_value, charass_default, charass_price
  FROM charass
  WHERE ( (charass_target_type='SI')
    AND   (charass_target_id=pCoitemId) );

  UPDATE coitem
  SET coitem_order_type = 'P',
      coitem_order_id = _poitemid
  WHERE ( coitem_id = pCoitemId );

  -- Generate the PoItemCreatedBySo event notice
  PERFORM postEvent('PoItemCreatedBySo', 'P', poitem_id,
                    itemsite_warehous_id,
                    (pohead_number || '-'|| poitem_linenumber || ': ' || item_number),
                    NULL, NULL, NULL, NULL)
  FROM poitem JOIN pohead ON (pohead_id=poitem_pohead_id)
              JOIN itemsite ON (itemsite_id=poitem_itemsite_id)
              JOIN item ON (item_id=itemsite_item_id)
  WHERE (poitem_id=_poitemid)
    AND (poitem_duedate <= (CURRENT_DATE + itemsite_eventfence));

  RETURN _poitemid;

END;
$$ LANGUAGE plpgsql VOLATILE;
