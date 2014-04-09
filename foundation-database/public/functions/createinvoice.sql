
CREATE OR REPLACE FUNCTION createInvoice(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCobmiscid ALIAS FOR $1;
  _invcheadid INTEGER;
  _invcitemid INTEGER;
  _qtyToInvoice	NUMERIC;
  _r		RECORD;
  _s		RECORD;
  _lastlinenumber INTEGER := 1;
  
BEGIN

  IF ( ( SELECT cobmisc_posted
         FROM cobmisc
         WHERE (cobmisc_id=pCobmiscid) ) ) THEN
    RETURN -1;
  END IF;

  SELECT NEXTVAL('invchead_invchead_id_seq') INTO _invcheadid;

--  Give this selection a number if it has not been assigned one
  UPDATE cobmisc
  SET cobmisc_invcnumber=fetchInvcNumber()
  WHERE ( (cobmisc_invcnumber IS NULL)
   AND (cobmisc_id=pCobmiscid) );

--  Create the Invoice header
  INSERT INTO invchead
  ( 
	invchead_id,invchead_cust_id,invchead_shipto_id,invchead_ordernumber,invchead_orderdate,
	invchead_posted,invchead_printed,invchead_invcnumber,invchead_invcdate,invchead_shipdate,
	invchead_ponumber,invchead_shipvia,invchead_fob,invchead_billto_name,invchead_billto_address1,
	invchead_billto_address2,invchead_billto_address3,invchead_billto_city,invchead_billto_state,invchead_billto_zipcode,
	invchead_billto_phone,invchead_billto_country,invchead_shipto_name,invchead_shipto_address1,invchead_shipto_address2,
	invchead_shipto_address3,invchead_shipto_city,invchead_shipto_state,invchead_shipto_zipcode,invchead_shipto_phone,
	invchead_shipto_country,invchead_salesrep_id,invchead_commission,invchead_terms_id,invchead_freight,
	invchead_misc_amount,invchead_misc_descrip,invchead_misc_accnt_id,invchead_payment,
	invchead_paymentref,invchead_notes,invchead_prj_id,invchead_curr_id,
	invchead_taxzone_id, invchead_shipchrg_id,
        invchead_saletype_id, invchead_shipzone_id
   )
  SELECT 
	_invcheadid,cohead_cust_id,cohead_shipto_id,cohead_number,cohead_orderdate,
	FALSE,FALSE,cobmisc_invcnumber,cobmisc_invcdate,cobmisc_shipdate,
	cohead_custponumber,cobmisc_shipvia,cohead_fob,cohead_billtoname,cohead_billtoaddress1,
	cohead_billtoaddress2,cohead_billtoaddress3,cohead_billtocity,cohead_billtostate,cohead_billtozipcode,
	cntct_phone AS cust_phone,cohead_billtocountry,cohead_shiptoname,cohead_shiptoaddress1,cohead_shiptoaddress2,
	cohead_shiptoaddress3,cohead_shiptocity,cohead_shiptostate,cohead_shiptozipcode,cohead_shipto_cntct_phone,
	cohead_shiptocountry,cohead_salesrep_id,COALESCE(cohead_commission,0),cohead_terms_id,cobmisc_freight,
	COALESCE(cobmisc_misc, 0.00),cobmisc_misc_descrip,cobmisc_misc_accnt_id,cobmisc_payment,
	cobmisc_paymentref,cobmisc_notes,cohead_prj_id,cobmisc_curr_id,
	cobmisc_taxzone_id, cohead_shipchrg_id,
        cohead_saletype_id, cohead_shipzone_id
    FROM cobmisc, cohead, custinfo
    LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
  WHERE ( (cobmisc_cohead_id=cohead_id)
   AND (cohead_cust_id=cust_id)
   AND (cobmisc_id=pCobmiscid) );

	INSERT INTO invcheadtax(taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id, taxhist_basis, 
			taxhist_basis_tax_id, taxhist_sequence, taxhist_percent, taxhist_amount, taxhist_tax, taxhist_docdate)
        SELECT _invcheadid,taxhist_taxtype_id, taxhist_tax_id, taxhist_basis, 
			taxhist_basis_tax_id, taxhist_sequence, taxhist_percent, taxhist_amount, taxhist_tax, taxhist_docdate
        FROM cobmisctax 
	WHERE taxhist_parent_id = pCobmiscid 
	AND taxhist_taxtype_id = getadjustmenttaxtypeid();

--  Create the Invoice Characteristic Assignments
    INSERT INTO charass
          (charass_target_type, charass_target_id, charass_char_id, charass_value, charass_default, charass_price)
    SELECT 'INV', _invcheadid, charass_char_id, charass_value, charass_default, charass_price
      FROM cobmisc JOIN cohead ON (cohead_id=cobmisc_cohead_id)
                   JOIN charass ON ((charass_target_type='SO') AND (charass_target_id=cohead_id))
                   JOIN char ON (char_id=charass_char_id AND char_invoices)
    WHERE (cobmisc_id=pCobmiscid);

--  Create the Invoice items
  FOR _r IN SELECT coitem_id, coitem_linenumber, coitem_subnumber, coitem_custpn,
                   coitem_qtyord, cobill_qty,
                   coitem_qty_uom_id, coitem_qty_invuomratio,
                   coitem_custprice, coitem_price,
                   coitem_price_uom_id, coitem_price_invuomratio,
                   coitem_memo, coitem_rev_accnt_id,
                   itemsite_item_id, itemsite_warehous_id,
                   cobill_taxtype_id,
                   formatSoItemNumber(coitem_id) AS ordnumber
            FROM coitem, cobill, itemsite
            WHERE ( (cobill_coitem_id=coitem_id)
             AND (coitem_itemsite_id=itemsite_id)
             AND (cobill_cobmisc_id=pCobmiscid) )
            ORDER BY coitem_linenumber, coitem_subnumber LOOP

    SELECT NEXTVAL('invcitem_invcitem_id_seq') INTO _invcitemid;
    INSERT INTO invcitem
    ( invcitem_id, invcitem_invchead_id,
      invcitem_linenumber, invcitem_item_id, invcitem_warehous_id,
      invcitem_custpn, invcitem_number, invcitem_descrip,
      invcitem_ordered, invcitem_billed,
      invcitem_qty_uom_id, invcitem_qty_invuomratio,
      invcitem_custprice, invcitem_price,
      invcitem_price_uom_id, invcitem_price_invuomratio,
      invcitem_notes, invcitem_taxtype_id,
      invcitem_coitem_id, invcitem_rev_accnt_id )
    VALUES
    ( _invcitemid, _invcheadid,
      _lastlinenumber,
      _r.itemsite_item_id, _r.itemsite_warehous_id,
      _r.coitem_custpn, '', '',
      _r.coitem_qtyord, _r.cobill_qty,
      _r.coitem_qty_uom_id, _r.coitem_qty_invuomratio,
      _r.coitem_custprice, _r.coitem_price,
      _r.coitem_price_uom_id, _r.coitem_price_invuomratio,
      _r.coitem_memo, _r.cobill_taxtype_id,
      _r.coitem_id, _r.coitem_rev_accnt_id );

--  Find and mark any Lot/Serial invdetail records associated with this bill
    UPDATE invdetail SET invdetail_invcitem_id = _invcitemid
     WHERE (invdetail_id IN (SELECT invdetail_id
                               FROM invhist JOIN invdetail ON (invdetail_invhist_id=invhist_id)
                              WHERE ( (invhist_ordnumber = _r.ordnumber)
                                AND   (invhist_ordtype = 'SO')
                                AND   (invhist_transtype = 'SH')
                                AND   (invdetail_invcitem_id IS NULL) ) ));

--  Mark any shipped, uninvoiced shipitems for the current coitem as invoiced
    _qtyToInvoice :=  _r.cobill_qty;
    FOR _s IN SELECT shipitem.*, shipitem_qty = _r.cobill_qty AS matched
	      FROM shipitem, shiphead
	      WHERE ((shipitem_shiphead_id=shiphead_id)
	        AND  (shipitem_orderitem_id=_r.coitem_id)
	        AND  (shiphead_shipped)
		AND  (shiphead_order_type='SO')
	        AND  (NOT shipitem_invoiced))
	      ORDER BY matched DESC, shipitem_qty DESC FOR UPDATE LOOP
      IF (_qtyToInvoice >= _s.shipitem_qty) THEN
	UPDATE shipitem
	SET shipitem_invoiced=TRUE, shipitem_invcitem_id=_invcitemid
	WHERE (shipitem_id=_s.shipitem_id);
	_qtyToInvoice := _qtyToInvoice - _s.shipitem_qty;
      END IF;
      IF (_qtyToInvoice <= 0) THEN
	EXIT;
      END IF;
    END LOOP;

    UPDATE cobill SET cobill_invcnum=cobmisc_invcnumber,
		      cobill_invcitem_id=invcitem_id
    FROM invcitem, coitem, cobmisc
    WHERE ((invcitem_linenumber=_lastlinenumber)
      AND  (coitem_id=cobill_coitem_id)
      AND  (cobmisc_id=cobill_cobmisc_id)
      AND  (cobill_cobmisc_id=pCobmiscid)
      AND  (invcitem_invchead_id=_invcheadid));
    
    _lastlinenumber := _lastlinenumber + 1;

  END LOOP;

--  Close all requested coitem's
  IF ( ( SELECT cobmisc_closeorder
         FROM cobmisc
         WHERE (cobmisc_id=pCobmiscid) ) ) THEN
    UPDATE coitem
    SET coitem_status='C'
    FROM cobmisc
    WHERE ( (coitem_status NOT IN ('C', 'X'))
     AND (coitem_cohead_id=cobmisc_cohead_id)
     AND (cobmisc_id=pCobmiscid) );
  ELSE
    UPDATE coitem
    SET coitem_status='C'
    FROM cobill
    WHERE ( (cobill_coitem_id=coitem_id)
     AND (coitem_status <> 'X')
     AND (cobill_toclose)
     AND (cobill_cobmisc_id=pCobmiscid) );
  END IF;

--  Mark the cobmisc as posted
  UPDATE cobmisc
  SET cobmisc_posted=TRUE, cobmisc_invchead_id=_invcheadid
  WHERE (cobmisc_id=pCobmiscid);

--  All done
  RETURN _invcheadid;

END;
$$ LANGUAGE 'plpgsql';

