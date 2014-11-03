CREATE OR REPLACE FUNCTION assessFinanceCharge(pAropenid INTEGER,
                                               pAssessDate DATE,
                                               pAssessAmount NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _fc           RECORD;
  _ar           RECORD;
  _invcheadid   INTEGER;

BEGIN

  -- cache some information
  SELECT * INTO _fc FROM fincharg;
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'assessFinanceCharge, configuration not set.';
  END IF;

  SELECT * INTO _ar FROM aropen WHERE (aropen_id=pAropenid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'assessFinanceCharge, aropen not found.';
  END IF;

  -- create invoice head
  INSERT INTO invchead
    ( invchead_cust_id,
      invchead_shipto_id,
      invchead_ordernumber,
      invchead_orderdate,
      invchead_posted,
      invchead_printed,
      invchead_invcnumber,
      invchead_invcdate,
      invchead_shipdate,
      invchead_ponumber,
      invchead_shipvia,
      invchead_fob,
      invchead_billto_name,
      invchead_billto_address1,
      invchead_billto_address2,
      invchead_billto_address3,
      invchead_billto_city,
      invchead_billto_state,
      invchead_billto_zipcode,
      invchead_billto_phone,
      invchead_shipto_name,
      invchead_shipto_address1,
      invchead_shipto_address2,
      invchead_shipto_address3,
      invchead_shipto_city,
      invchead_shipto_state,
      invchead_shipto_zipcode,
      invchead_shipto_phone,
      invchead_salesrep_id,
      invchead_commission,
      invchead_terms_id,
      invchead_freight,
      invchead_misc_amount,
      invchead_misc_descrip,
      invchead_misc_accnt_id,
      invchead_payment,
      invchead_paymentref,
      invchead_notes,
      invchead_billto_country,
      invchead_shipto_country,
      invchead_prj_id,
      invchead_curr_id,
      invchead_gldistdate,
      invchead_recurring,
      invchead_recurring_interval,
      invchead_recurring_type,
      invchead_recurring_until,
      invchead_recurring_invchead_id,
      invchead_shipchrg_id,
      invchead_taxzone_id,
      invchead_void,
      invchead_saletype_id,
      invchead_shipzone_id )
  SELECT
      invchead_cust_id,
      invchead_shipto_id,
      invchead_ordernumber,
      invchead_orderdate,
      FALSE,
      FALSE,
      fetchInvcNumber(),
      pAssessDate,
      invchead_shipdate,
      invchead_ponumber,
      invchead_shipvia,
      invchead_fob,
      invchead_billto_name,
      invchead_billto_address1,
      invchead_billto_address2,
      invchead_billto_address3,
      invchead_billto_city,
      invchead_billto_state,
      invchead_billto_zipcode,
      invchead_billto_phone,
      invchead_shipto_name,
      invchead_shipto_address1,
      invchead_shipto_address2,
      invchead_shipto_address3,
      invchead_shipto_city,
      invchead_shipto_state,
      invchead_shipto_zipcode,
      invchead_shipto_phone,
      invchead_salesrep_id,
      0.0,
      invchead_terms_id,
      0.0,
      0.0,
      NULL,
      NULL,
      0.0,
      NULL,
      '',
      invchead_billto_country,
      invchead_shipto_country,
      invchead_prj_id,
      invchead_curr_id,
      NULL,
      FALSE,
      NULL,
      NULL,
      NULL,
      NULL,
      invchead_shipchrg_id,
      invchead_taxzone_id,
      invchead_void,
      invchead_saletype_id,
      invchead_shipzone_id
  FROM invchead
  WHERE (invchead_invcnumber=_ar.aropen_docnumber)
  RETURNING invchead_id INTO _invcheadid;

  -- create invoice item
  INSERT INTO invcitem
    ( invcitem_invchead_id,
      invcitem_linenumber,
      invcitem_item_id,
      invcitem_warehous_id,
      invcitem_custpn,
      invcitem_number,
      invcitem_descrip,
      invcitem_ordered,
      invcitem_billed,
      invcitem_custprice,
      invcitem_price,
      invcitem_notes,
      invcitem_salescat_id,
      invcitem_taxtype_id,
      invcitem_qty_uom_id,
      invcitem_qty_invuomratio,
      invcitem_price_uom_id,
      invcitem_price_invuomratio,
      invcitem_coitem_id,
      invcitem_updateinv,
      invcitem_rev_accnt_id )
  VALUES
    ( _invcheadid,
      1,
      -1,
      -1,
      NULL,
      _fc.fincharg_markoninvoice,
--    - enhance data shown in the item description for the invoice line to indicate which invoice is affected
--    - Feature Request 23344       
--      'Finance Charge Assessment',
      'Finance Charge Assessment - Invoice Number ' || _ar.aropen_docnumber || ' - Past Due Balance ' || (_ar.aropen_amount - _ar.aropen_paid) || ' Due Date - ' || _ar.aropen_duedate,
      1.0,
      1.0,
      pAssessAmount,
      pAssessAmount,
      '',
      _fc.fincharg_salescat_id,
      NULL,
      NULL,
      1.0,
      NULL,
      1.0,
      NULL,
      FALSE,
      _fc.fincharg_accnt_id );

  -- update aropen
  UPDATE aropen SET aropen_fincharg_date = pAssessDate,
                    aropen_fincharg_amount = COALESCE(aropen_fincharg_amount, 0.0) + pAssessAmount
  WHERE (aropen_id=pAropenid);


  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
