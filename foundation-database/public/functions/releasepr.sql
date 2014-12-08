
CREATE OR REPLACE FUNCTION releasePR(pPrId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _pr RECORD;
  _w RECORD;
  _i RECORD;
  _rows INTEGER := 0;
  _itemsrcid INTEGER := -1;
  _poheadid INTEGER := -1;
  _poitemid INTEGER := -1;
  _taxtypeid INTEGER := -1;
  _polinenumber INTEGER;
  _ponumber NUMERIC;
  _price NUMERIC;

BEGIN

  -- Cache information
  SELECT *,
         CASE WHEN(pr_order_type='W') THEN pr_order_id
              ELSE -1
         END AS parentwo,
         CASE WHEN(pr_order_type='S') THEN pr_order_id
              ELSE -1
         END AS parentso
  INTO _pr
  FROM pr LEFT OUTER JOIN itemsite ON (pr_itemsite_id = itemsite_id)
          LEFT OUTER JOIN item ON (item_id = itemsite_item_id)
          LEFT OUTER JOIN prj ON (prj_id = pr_prj_id)
  WHERE (pr_id = pPrId);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT * INTO _w
  FROM itemsite JOIN whsinfo ON (warehous_id = itemsite_warehous_id)
                LEFT OUTER JOIN addr ON (warehous_addr_id = addr_id)
                LEFT OUTER JOIN cntct ON (warehous_cntct_id = cntct_id)
  WHERE (itemsite_id = _pr.itemsite_id);

  -- Must either be a single itemsrc or a default itemsrc
  SELECT itemsrc_id INTO _itemsrcid
  FROM itemsrc
  WHERE (itemsrc_item_id = _pr.item_id)
    AND (_pr.pr_duedate BETWEEN COALESCE(itemsrc_effective, startOfTime()) AND COALESCE(itemsrc_expires, endOfTime()))
    AND (itemsrc_default);
  IF (NOT FOUND) THEN
    SELECT MAX(itemsrc_id), count(*) INTO _itemsrcid, _rows
    FROM itemsrc
    WHERE (itemsrc_item_id = _pr.item_id)
      AND (_pr.pr_duedate BETWEEN COALESCE(itemsrc_effective, startOfTime()) AND COALESCE(itemsrc_expires, endOfTime()))
    GROUP BY itemsrc_item_id;
    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;
    IF (_rows > 1) THEN
      RETURN -2;
    END IF;
  END IF;
    
  SELECT * INTO _i
  FROM itemsrc JOIN vendinfo ON (itemsrc_vend_id = vend_id)
               LEFT OUTER JOIN cntct ON (vend_cntct1_id = cntct_id)
               LEFT OUTER JOIN addr ON (vend_addr_id = addr_id)
  WHERE (itemsrc_id = _itemsrcid);

  RAISE NOTICE 'releasepr selected itemsrc_id = % for pr = %', _itemsrcid, _pr.pr_id;

  -- Find matching unreleased PO
  SELECT COALESCE(pohead_id, -1) INTO _poheadid
  FROM pohead
  WHERE ( (pohead_status = 'U')
    AND (pohead_vend_id = _i.itemsrc_vend_id)
    AND (COALESCE(pohead_shiptoaddress1, '') = COALESCE(_w.addr_line1, ''))
    AND (COALESCE(pohead_shiptoaddress2, '') = COALESCE(_w.addr_line2, ''))
    AND (COALESCE(pohead_shiptoaddress3, '') = COALESCE(_w.addr_line3, ''))
    AND (COALESCE(pohead_shiptocity, '') = COALESCE(_w.addr_city, ''))
    AND (COALESCE(pohead_shiptostate, '') = COALESCE(_w.addr_state, ''))
    AND (COALESCE(pohead_shiptozipcode, '') = COALESCE(_w.addr_postalcode, ''))
    AND (COALESCE(pohead_shiptocountry, '') = COALESCE(_w.addr_country, '')) );

  IF (NOT FOUND) THEN
    -- Create new PO
    SELECT NEXTVAL('pohead_pohead_id_seq') INTO _poheadid;
    SELECT fetchPoNumber() INTO _ponumber;

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
      ( _poheadid, _ponumber, 'U', FALSE,
        getEffectiveXtUser(), _i.itemsrc_vend_id, _i.vend_taxzone_id,
        CURRENT_DATE, COALESCE(_i.vend_curr_id, basecurrid()), NULL,
        COALESCE(_pr.itemsite_warehous_id, -1), COALESCE(_i.vend_shipvia, TEXT('')),
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

  SELECT NEXTVAL('poitem_poitem_id_seq') INTO _poitemid;

  SELECT (COALESCE(MAX(poitem_linenumber), 0) + 1) INTO _polinenumber
  FROM poitem
  WHERE (poitem_pohead_id = _poheadid);

  SELECT COALESCE(itemtax_taxtype_id, -1) INTO _taxtypeid
  FROM itemtax
  WHERE (itemtax_item_id = _i.itemsrc_item_id);

  SELECT itemsrcPrice(_i.itemsrc_id,
                      COALESCE(_pr.itemsite_warehous_id, -1),
                      FALSE,
                      (_pr.pr_qtyreq / COALESCE(_i.itemsrc_invvendoruomratio, 1.00)),
                      COALESCE(_i.vend_curr_id, baseCurrId()),
                      CURRENT_DATE) INTO _price;

  -- Create PO Item
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
      _pr.pr_duedate, _pr.itemsite_id,
      COALESCE(_i.itemsrc_vend_item_descrip, TEXT('')), COALESCE(_i.itemsrc_vend_uom, TEXT('')),
      COALESCE(_i.itemsrc_invvendoruomratio, 1.00), (_pr.pr_qtyreq / COALESCE(_i.itemsrc_invvendoruomratio, 1.00)),
      _price, COALESCE(_i.itemsrc_vend_item_number, TEXT('')),
      _i.itemsrc_id, _pr.pr_order_id, _pr.pr_order_type, _pr.prj_id, stdcost(_i.itemsrc_item_id),
      COALESCE(_i.itemsrc_manuf_name, TEXT('')), COALESCE(_i.itemsrc_manuf_item_number, TEXT('')),
      COALESCE(_i.itemsrc_manuf_item_descrip, TEXT('')), _taxtypeid,
      COALESCE(_pr.pr_releasenote, TEXT('')));

  -- Copy characteristics from the pr to the poitem
  INSERT INTO charass
    ( charass_target_type, charass_target_id, charass_char_id,
      charass_value, charass_default, charass_price )
  SELECT 'PI', _poitemid, charass_char_id,
         charass_value, charass_default, charass_price
  FROM charass
  WHERE ( (charass_target_type='PR')
    AND   (charass_target_id=pPrId) );

  -- Delete the PR
  PERFORM deletePr(pPrId);

  RETURN _poitemid;

END;
$$ LANGUAGE 'plpgsql' VOLATILE;
