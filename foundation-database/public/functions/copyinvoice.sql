CREATE OR REPLACE FUNCTION copyInvoice(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  _invcheadid INTEGER;
  _invcnumber TEXT;
  _invcdate DATE := COALESCE($2, CURRENT_DATE);
  _i RECORD;
  _l RECORD;
  _invcitemid INTEGER;

BEGIN
  SELECT *
    INTO _i
    FROM invchead
   WHERE(invchead_id=pInvcheadid);
  IF(NOT FOUND) THEN
    RETURN -1;
  END IF;

  _invcnumber := fetchInvcNumber();
  _invcheadid := nextval('invchead_invchead_id_seq');

  INSERT INTO invchead
        (invchead_id,
         invchead_cust_id, invchead_shipto_id,
         invchead_ordernumber, invchead_orderdate,
         invchead_posted, invchead_printed,
         invchead_invcnumber, invchead_invcdate, invchead_shipdate,
         invchead_ponumber, invchead_shipvia,
         invchead_fob, invchead_billto_name,
         invchead_billto_address1, invchead_billto_address2,
         invchead_billto_address3, invchead_billto_city,
         invchead_billto_state, invchead_billto_zipcode,
         invchead_billto_phone, invchead_shipto_name,
         invchead_shipto_address1, invchead_shipto_address2,
         invchead_shipto_address3, invchead_shipto_city,
         invchead_shipto_state, invchead_shipto_zipcode,
         invchead_shipto_phone, invchead_salesrep_id,
         invchead_commission,
         invchead_terms_id, invchead_freight,
         invchead_misc_amount,
         invchead_misc_descrip, invchead_misc_accnt_id,
         invchead_payment, invchead_paymentref,
         invchead_notes,
         invchead_billto_country, invchead_shipto_country,
         invchead_prj_id, invchead_curr_id,
         invchead_taxzone_id,
         invchead_recurring_invchead_id,
         invchead_saletype_id, invchead_shipzone_id)
  VALUES(_invcheadid,
         _i.invchead_cust_id, _i.invchead_shipto_id,
         _i.invchead_ordernumber, _i.invchead_orderdate,
         false, false,
         _invcnumber, _invcdate, _i.invchead_shipdate,
         _i.invchead_ponumber, _i.invchead_shipvia,
         _i.invchead_fob, _i.invchead_billto_name,
         _i.invchead_billto_address1, _i.invchead_billto_address2,
         _i.invchead_billto_address3, _i.invchead_billto_city,
         _i.invchead_billto_state, _i.invchead_billto_zipcode,
         _i.invchead_billto_phone, _i.invchead_shipto_name,
         _i.invchead_shipto_address1, _i.invchead_shipto_address2,
         _i.invchead_shipto_address3, _i.invchead_shipto_city,
         _i.invchead_shipto_state, _i.invchead_shipto_zipcode,
         _i.invchead_shipto_phone, _i.invchead_salesrep_id,
         _i.invchead_commission,
         _i.invchead_terms_id, _i.invchead_freight,
         _i.invchead_misc_amount,
         _i.invchead_misc_descrip, _i.invchead_misc_accnt_id,
         _i.invchead_payment, _i.invchead_paymentref,
         _i.invchead_notes,
         _i.invchead_billto_country, _i.invchead_shipto_country,
         _i.invchead_prj_id, _i.invchead_curr_id,
         _i.invchead_taxzone_id,
         _i.invchead_recurring_invchead_id,
         _i.invchead_saletype_id, _i.invchead_shipzone_id);

  FOR _l IN SELECT *
            FROM invcitem
            WHERE (invcitem_invchead_id=pInvcheadid) LOOP
    SELECT NEXTVAL('invcitem_invcitem_id_seq') INTO _invcitemid;

    INSERT INTO invcitem
        (invcitem_id, invcitem_invchead_id,
         invcitem_linenumber, invcitem_item_id,
         invcitem_warehous_id, invcitem_custpn,
         invcitem_number, invcitem_descrip,
         invcitem_ordered, invcitem_billed,
         invcitem_custprice, invcitem_price,
         invcitem_notes, invcitem_salescat_id,
         invcitem_taxtype_id,
         invcitem_qty_uom_id, invcitem_qty_invuomratio,
         invcitem_price_uom_id, invcitem_price_invuomratio,
         invcitem_coitem_id)
    VALUES
        (_invcitemid, _invcheadid,
         _l.invcitem_linenumber, _l.invcitem_item_id,
         _l.invcitem_warehous_id, _l.invcitem_custpn,
         _l.invcitem_number, _l.invcitem_descrip,
         _l.invcitem_ordered, _l.invcitem_billed,
         _l.invcitem_custprice, _l.invcitem_price,
         _l.invcitem_notes, _l.invcitem_salescat_id,
         _l.invcitem_taxtype_id,
         _l.invcitem_qty_uom_id, _l.invcitem_qty_invuomratio,
         _l.invcitem_price_uom_id, _l.invcitem_price_invuomratio,
         _l.invcitem_coitem_id);

  END LOOP;

  RETURN _invcheadid;
END;
$$ LANGUAGE 'plpgsql';
