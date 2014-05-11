
CREATE OR REPLACE FUNCTION copyQuote(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  pSchedDate ALIAS FOR $2;
  _quheadid INTEGER;
  _qunumber TEXT;

BEGIN

  SELECT NEXTVAL('quhead_quhead_id_seq') INTO _quheadid;
  IF (fetchMetricText('QUNumberGeneration') = 'S') THEN
    SELECT fetchSoNumber() INTO _qunumber;
  ELSE
    SELECT fetchQuNumber() INTO _qunumber;
  END IF;

  INSERT INTO quhead
  ( quhead_id, quhead_number, quhead_cust_id, quhead_prj_id,
    quhead_quotedate, quhead_packdate, quhead_fob,
    quhead_warehous_id, quhead_terms_id, quhead_salesrep_id,
    quhead_custponumber, quhead_shipvia,
    quhead_shipto_id, quhead_shiptoname, quhead_shiptoaddress1, quhead_shiptoaddress2, quhead_shiptoaddress3,
    quhead_shiptocity, quhead_shiptostate, quhead_shiptozipcode, quhead_shiptophone, quhead_shiptocountry,
    quhead_billtoname, quhead_billtoaddress1, quhead_billtoaddress2, quhead_billtoaddress3,
    quhead_billtocity, quhead_billtostate, quhead_billtozip,
    quhead_misc_accnt_id, quhead_misc_descrip, quhead_misc, quhead_freight, quhead_commission,
    quhead_ordercomments, quhead_shipcomments,
    quhead_imported, quhead_curr_id, quhead_taxzone_id, quhead_taxtype_id, quhead_ophead_id, quhead_status,
    quhead_shipto_cntct_id, quhead_shipto_cntct_honorific, quhead_shipto_cntct_first_name, quhead_shipto_cntct_middle,
    quhead_shipto_cntct_last_name, quhead_shipto_cntct_suffix, quhead_shipto_cntct_phone, quhead_shipto_cntct_title,
    quhead_shipto_cntct_fax, quhead_shipto_cntct_email, quhead_billto_cntct_id, quhead_billto_cntct_honorific,
    quhead_billto_cntct_first_name, quhead_billto_cntct_middle, quhead_billto_cntct_last_name, quhead_billto_cntct_suffix,
    quhead_billto_cntct_phone, quhead_billto_cntct_title, quhead_billto_cntct_fax, quhead_billto_cntct_email )
  SELECT _quheadid, _qunumber, quhead_cust_id, quhead_prj_id,
         CURRENT_DATE, COALESCE(pSchedDate, quhead_packdate), quhead_fob,
         quhead_warehous_id, quhead_terms_id, quhead_salesrep_id,
         quhead_custponumber, quhead_shipvia,
         quhead_shipto_id, quhead_shiptoname, quhead_shiptoaddress1, quhead_shiptoaddress2, quhead_shiptoaddress3,
         quhead_shiptocity, quhead_shiptostate, quhead_shiptozipcode, quhead_shiptophone, quhead_shiptocountry,
         quhead_billtoname, quhead_billtoaddress1, quhead_billtoaddress2, quhead_billtoaddress3,
         quhead_billtocity, quhead_billtostate, quhead_billtozip,
         quhead_misc_accnt_id, quhead_misc_descrip, quhead_misc, quhead_freight, quhead_commission,
         quhead_ordercomments, quhead_shipcomments,
         FALSE, quhead_curr_id, quhead_taxzone_id, quhead_taxtype_id, quhead_ophead_id, 'O',
         quhead_shipto_cntct_id, quhead_shipto_cntct_honorific, quhead_shipto_cntct_first_name, quhead_shipto_cntct_middle,
         quhead_shipto_cntct_last_name, quhead_shipto_cntct_suffix, quhead_shipto_cntct_phone, quhead_shipto_cntct_title,
         quhead_shipto_cntct_fax, quhead_shipto_cntct_email, quhead_billto_cntct_id, quhead_billto_cntct_honorific,
         quhead_billto_cntct_first_name, quhead_billto_cntct_middle, quhead_billto_cntct_last_name, quhead_billto_cntct_suffix,
         quhead_billto_cntct_phone, quhead_billto_cntct_title, quhead_billto_cntct_fax, quhead_billto_cntct_email
  FROM quhead
  WHERE (quhead_id=pQuheadid);

  INSERT INTO quitem
  ( quitem_quhead_id, quitem_linenumber, quitem_itemsite_id,
    quitem_scheddate, quitem_promdate, quitem_qtyord,
    quitem_price, quitem_custprice, quitem_unitcost,
    quitem_qty_uom_id, quitem_price_uom_id,
    quitem_qty_invuomratio, quitem_price_invuomratio,
    quitem_memo, quitem_custpn, quitem_imported, quitem_taxtype_id,
    quitem_createorder, quitem_order_warehous_id, quitem_item_id, quitem_prcost,
    quitem_dropship, quitem_itemsrc_id, quitem_pricemode )
  SELECT _quheadid, quitem_linenumber, quitem_itemsite_id,
         COALESCE(pSchedDate, quitem_scheddate),
         quitem_promdate,
         quitem_qtyord,
         quitem_price, quitem_custprice, stdCost(itemsite_item_id),
         quitem_qty_uom_id, quitem_price_uom_id,
         quitem_qty_invuomratio, quitem_price_invuomratio,
         quitem_memo, quitem_custpn, FALSE, quitem_taxtype_id,
         quitem_createorder, quitem_order_warehous_id, quitem_item_id, quitem_prcost,
         quitem_dropship, quitem_itemsrc_id, quitem_pricemode
  FROM quitem, itemsite
  WHERE ( (quitem_itemsite_id=itemsite_id)
   AND (quitem_quhead_id=pQuheadid));

  INSERT INTO charass
        (charass_target_type, charass_target_id,
         charass_char_id, charass_value)
  SELECT charass_target_type, b.quitem_id,
         charass_char_id, charass_value
    FROM quitem a, charass, quitem b
   WHERE ((charass_target_type='SI')
     AND  (charass_target_id=a.quitem_id)
     AND  (a.quitem_quhead_id=pQuheadid)
     AND  (b.quitem_quhead_id=_quheadid)
     AND  (a.quitem_linenumber=b.quitem_linenumber)
     );

  RETURN _quheadid;

END;
$$ LANGUAGE 'plpgsql';

