CREATE OR REPLACE FUNCTION copyPO(INTEGER, INTEGER, DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSrcid		ALIAS FOR $1;
  pVendid		ALIAS FOR $2;
  pOrderdate		ALIAS FOR $3;
  pRecheckVendinfo	ALIAS FOR $4;

  _tgtid		INTEGER;
  _orderdate		DATE;
  _head			RECORD;
  _itemsrc		RECORD;
  _lineitem		RECORD;
  _qty			NUMERIC;
  _unitprice		NUMERIC;
  _uomratio		NUMERIC;
  _vend_restrictpurch	BOOLEAN;

BEGIN
  SELECT * INTO _head FROM pohead WHERE pohead_id = pSrcid;
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;
  IF (_head.pohead_vend_id != pVendid) THEN
    RETURN -2;		-- not supported now but should be in the future
  END IF;		-- when enabled, set pRecheckVendinfo if vendors don't match

  IF (pOrderdate IS NULL) THEN
    _orderdate := CURRENT_DATE;
  ELSE
    _orderdate := pOrderdate;
  END IF;

  INSERT INTO pohead (pohead_status, pohead_number,
		      pohead_orderdate, pohead_vend_id,
		      pohead_fob, pohead_shipvia,
		      pohead_freight, pohead_printed,
		      pohead_terms_id, pohead_warehous_id,
		      pohead_vendaddr_id, pohead_agent_username,
		      pohead_curr_id, pohead_saved,
                      pohead_taxtype_id, pohead_taxzone_id,
                      pohead_dropship, pohead_vend_cntct_id,
                      pohead_vend_cntct_honorific, pohead_vend_cntct_first_name,
                      pohead_vend_cntct_middle, pohead_vend_cntct_last_name,
                      pohead_vend_cntct_suffix, pohead_vend_cntct_phone,
                      pohead_vend_cntct_title, pohead_vend_cntct_fax,
                      pohead_vend_cntct_email, pohead_vendaddress1,
                      pohead_vendaddress2, pohead_vendaddress3,
                      pohead_vendcity, pohead_vendstate,
                      pohead_vendzipcode, pohead_vendcountry,
                      pohead_shipto_cntct_id,
                      pohead_shipto_cntct_honorific, pohead_shipto_cntct_first_name,
                      pohead_shipto_cntct_middle, pohead_shipto_cntct_last_name,
                      pohead_shipto_cntct_suffix, pohead_shipto_cntct_phone,
                      pohead_shipto_cntct_title, pohead_shipto_cntct_fax,
                      pohead_shipto_cntct_email, pohead_shiptoaddress_id,
                      pohead_shiptoaddress1,
                      pohead_shiptoaddress2, pohead_shiptoaddress3,
                      pohead_shiptocity, pohead_shiptostate,
                      pohead_shiptozipcode, pohead_shiptocountry
	      ) VALUES (
		      'U', fetchPoNumber(),
		      _orderdate, _head.pohead_vend_id,
		      _head.pohead_fob, _head.pohead_shipvia,
		      _head.pohead_freight, false,
		      _head.pohead_terms_id, _head.pohead_warehous_id,
		      _head.pohead_vendaddr_id, _head.pohead_agent_username,
		      _head.pohead_curr_id, true,
                      _head.pohead_taxtype_id, _head.pohead_taxzone_id,
                      false, _head.pohead_vend_cntct_id,
                      _head.pohead_vend_cntct_honorific, _head.pohead_vend_cntct_first_name,
                      _head.pohead_vend_cntct_middle, _head.pohead_vend_cntct_last_name,
                      _head.pohead_vend_cntct_suffix, _head.pohead_vend_cntct_phone,
                      _head.pohead_vend_cntct_title, _head.pohead_vend_cntct_fax,
                      _head.pohead_vend_cntct_email, _head.pohead_vendaddress1,
                      _head.pohead_vendaddress2, _head.pohead_vendaddress3,
                      _head.pohead_vendcity, _head.pohead_vendstate,
                      _head.pohead_vendzipcode, _head.pohead_vendcountry,
                      _head.pohead_shipto_cntct_id,
                      _head.pohead_shipto_cntct_honorific, _head.pohead_shipto_cntct_first_name,
                      _head.pohead_shipto_cntct_middle, _head.pohead_shipto_cntct_last_name,
                      _head.pohead_shipto_cntct_suffix, _head.pohead_shipto_cntct_phone,
                      _head.pohead_shipto_cntct_title, _head.pohead_shipto_cntct_fax,
                      _head.pohead_shipto_cntct_email, _head.pohead_shiptoaddress_id,
                      _head.pohead_shiptoaddress1,
                      _head.pohead_shiptoaddress2, _head.pohead_shiptoaddress3,
                      _head.pohead_shiptocity, _head.pohead_shiptostate,
                      _head.pohead_shiptozipcode, _head.pohead_shiptocountry);

  _tgtid := CURRVAL('pohead_pohead_id_seq');

  IF (pRecheckVendinfo) THEN
    SELECT vend_restrictpurch INTO _vend_restrictpurch
      FROM vendinfo WHERE (vend_id = pVendid);

    FOR _lineitem IN SELECT *
		  FROM poitem 
		  WHERE (poitem_pohead_id = pSrcid) LOOP

      SELECT * INTO _itemsrc
      FROM itemsrc, itemsite
      WHERE (itemsrc_active
        AND  (itemsrc_id = _lineitem.poitem_itemsrc_id)
	AND  (itemsite_id = _lineitem.poitem_itemsite_id));
      IF (NOT FOUND AND _vend_restrictpurch) THEN
	RETURN -3;
      END IF;

      -- handle changes to the uom ratio and consequent qty changes
      _uomratio := COALESCE(_itemsrc.itemsrc_invvendoruomratio, _lineitem.poitem_invvenduomratio);
      IF (_itemsrc.itemsrc_invvendoruomratio IS NULL
	  OR _itemsrc.itemsrc_invvendoruomratio != _lineitem.poitem_invvenduomratio) THEN
	_qty := _lineitem.poitem_qty_ordered;

      ELSE
	_qty := _lineitem.poitem_qty_ordered * _lineitem.poitem_invvenduomratio /
					       _itemsrc.itemsrc_invvendoruomratio;
	IF (_itemsrc.itemsrc_minordqty IS NOT NULL) THEN
	  IF (_qty < _itemsrc.itemsrc_minordqty) THEN
	    _qty := _itemsrc.itemsrc_minordqty;
	  ELSIF (_itemsrc.itemsrc_multordqty > 0
		   AND _qty % _itemsrc.itemsrc_multordqty > 0) THEN
	    _qty = _qty % _itemsrc.itemsrc_multordqty + _itemsrc.itemsrc_multordqty;
	  END IF;
	END IF;
      END IF;

      IF (_itemsrc.itemsrc_id IS NULL) THEN
	_unitprice = _lineitem.poitem_unitprice;
      ELSE
        SELECT itemsrcPrice(_itemsrc.itemsrc_id, _head.pohead_warehous_id, _head.pohead_dropship,
                            _lineitem.poitem_qty_ordered, _head.pohead_curr_id, CURRENT_DATE) INTO _unitprice;
	IF (_unitprice IS NULL) THEN
	  RETURN -4;
	END IF;
      END IF;

      INSERT INTO poitem (poitem_status, poitem_pohead_id, poitem_linenumber,
			  poitem_duedate,
			  poitem_itemsite_id,
			  poitem_vend_item_descrip,
			  poitem_vend_uom,
			  poitem_invvenduomratio,
			  poitem_qty_ordered, poitem_unitprice,
			  poitem_vend_item_number,
			  poitem_comments, poitem_expcat_id,
			  poitem_itemsrc_id,
			  poitem_freight,
			  poitem_stdcost,
			  poitem_manuf_name,
			  poitem_manuf_item_number,
			  poitem_manuf_item_descrip,
                          poitem_taxtype_id
		    ) VALUES (
			  'U', _tgtid, _lineitem.poitem_linenumber,
			  _orderdate + COALESCE(_itemsrc.itemsrc_leadtime, 0),
			  _lineitem.poitem_itemsite_id,
			  COALESCE(_itemsrc.itemsrc_vend_item_descrip,
				   _lineitem.poitem_vend_item_descrip),
			  COALESCE(_itemsrc.itemsrc_vend_uom, _lineitem.poitem_vend_uom),
			  COALESCE(_itemsrc.itemsrc_invvendoruomratio,
				   _lineitem.poitem_invvenduomratio),
			  _qty, _unitprice,
			  COALESCE(_itemsrc.itemsrc_vend_item_number,
				   _lineitem.poitem_vend_item_number),
			  _lineitem.poitem_comments, _lineitem.poitem_expcat_id,
			  COALESCE(_itemsrc.itemsrc_id, -1),
			  _lineitem.poitem_freight,
			  stdcost(_itemsrc.itemsite_item_id),
			  COALESCE(_itemsrc.itemsrc_manuf_name,
				   _lineitem.poitem_manuf_name),
		          COALESCE(_itemsrc.itemsrc_manuf_item_number,
				   _lineitem.poitem_manuf_item_number),
			  COALESCE(_itemsrc.itemsrc_manuf_item_descrip,
				   _lineitem.poitem_manuf_item_descrip),
                          _lineitem.poitem_taxtype_id);

    END LOOP;
  ELSE
    INSERT INTO poitem (poitem_status, poitem_pohead_id, poitem_linenumber,
			poitem_duedate, poitem_itemsite_id,
			poitem_vend_item_descrip, poitem_vend_uom,
			poitem_invvenduomratio, poitem_qty_ordered,
			poitem_unitprice,
			poitem_vend_item_number, poitem_comments,
			poitem_expcat_id, poitem_itemsrc_id, poitem_freight,
			poitem_stdcost, poitem_manuf_name, 
			poitem_manuf_item_number, poitem_manuf_item_descrip,
                        poitem_taxtype_id
		) SELECT 'U', _tgtid, poitem_linenumber,
			_orderdate + COALESCE(itemsrc_leadtime, 0), poitem_itemsite_id,
			poitem_vend_item_descrip, poitem_vend_uom,
			poitem_invvenduomratio, poitem_qty_ordered,
			poitem_unitprice,
			poitem_vend_item_number, poitem_comments,
			poitem_expcat_id, poitem_itemsrc_id, poitem_freight,
			stdcost(itemsite_item_id), poitem_manuf_name,
			poitem_manuf_item_number, poitem_manuf_item_descrip,
                        poitem_taxtype_id
		  FROM poitem
		    LEFT OUTER JOIN itemsrc ON (itemsrc_id=poitem_itemsrc_id)
		    LEFT OUTER JOIN itemsite ON (itemsite_id=poitem_itemsite_id)
		  WHERE (poitem_pohead_id = pSrcid);
  END IF;

  -- Todo: recalculate tax?

  RETURN _tgtid;

END;
$$ LANGUAGE 'plpgsql';
