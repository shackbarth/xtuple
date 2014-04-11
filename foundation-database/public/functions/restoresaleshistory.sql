CREATE OR REPLACE FUNCTION restoreSalesHistory(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAsohistid ALIAS FOR $1;

BEGIN

  INSERT INTO cohist ( cohist_id,
                       cohist_cust_id,
                       cohist_itemsite_id,
                       cohist_shipdate,
                       cohist_invcdate,
                       cohist_duedate,
                       cohist_promisedate,
                       cohist_ordernumber,
                       cohist_invcnumber,
                       cohist_qtyshipped,
                       cohist_unitprice,
                       cohist_unitcost,
                       cohist_billtoname,
                       cohist_billtoaddress1,
                       cohist_billtoaddress2,
                       cohist_billtoaddress3,
                       cohist_billtocity,
                       cohist_billtostate,
                       cohist_billtozip,
                       cohist_shiptoname,
                       cohist_shiptoaddress1,
                       cohist_shiptoaddress2,
                       cohist_shiptoaddress3,
                       cohist_shiptocity,
                       cohist_shiptostate,
                       cohist_shiptozip,
                       cohist_shipto_id,
                       cohist_shipvia,
                       cohist_salesrep_id,
                       cohist_misc_type,
                       cohist_misc_descrip,
                       cohist_misc_id,
                       cohist_commission,
                       cohist_commissionpaid,
                       cohist_doctype,
                       cohist_orderdate,
                       cohist_imported,
                       cohist_ponumber,
                       cohist_curr_id,
                       cohist_taxtype_id,
                       cohist_taxzone_id )
  SELECT asohist_id,
         CASE asohist_cust_id WHEN -1 THEN NULL ELSE asohist_cust_id END,
         asohist_itemsite_id,
         asohist_shipdate,
         asohist_invcdate,
         asohist_duedate,
         asohist_promisedate,
         asohist_ordernumber,
         asohist_invcnumber,
         asohist_qtyshipped,
         asohist_unitprice,
         asohist_unitcost,
         asohist_billtoname,
         asohist_billtoaddress1,
         asohist_billtoaddress2,
         asohist_billtoaddress3,
         asohist_billtocity,
         asohist_billtostate,
         asohist_billtozip,
         asohist_shiptoname,
         asohist_shiptoaddress1,
         asohist_shiptoaddress2,
         asohist_shiptoaddress3,
         asohist_shiptocity,
         asohist_shiptostate,
         asohist_shiptozip,
         asohist_shipto_id,
         asohist_shipvia,
         CASE asohist_salesrep_id WHEN -1 THEN NULL ELSE asohist_salesrep_id END,
         asohist_misc_type,
         asohist_misc_descrip,
         asohist_misc_id,
         asohist_commission,
         asohist_commissionpaid,
         asohist_doctype,
         asohist_orderdate,
         asohist_imported,
         asohist_ponumber,
	 asohist_curr_id,
         asohist_taxtype_id,
         asohist_taxzone_id
  FROM asohist
  WHERE (asohist_id=pAsohistid);

  INSERT INTO cohisttax ( taxhist_id,
                          taxhist_parent_id,
                          taxhist_taxtype_id,
                          taxhist_tax_id,
                          taxhist_basis,
                          taxhist_basis_tax_id,
                          taxhist_sequence,
                          taxhist_percent,
                          taxhist_amount,
                          taxhist_tax,
                          taxhist_docdate,
                          taxhist_distdate,
                          taxhist_curr_id,
                          taxhist_curr_rate,
                          taxhist_journalnumber )
  SELECT taxhist_id,
         taxhist_parent_id,
         taxhist_taxtype_id,
         taxhist_tax_id,
         taxhist_basis,
         taxhist_basis_tax_id,
         taxhist_sequence,
         taxhist_percent,
         taxhist_amount,
         taxhist_tax,
         taxhist_docdate,
         taxhist_distdate,
         taxhist_curr_id,
         taxhist_curr_rate,
         taxhist_journalnumber
  FROM asohisttax
  WHERE (taxhist_parent_id=pAsohistid);

  DELETE FROM asohisttax
  WHERE (taxhist_parent_id=pAsohistid);

  DELETE FROM asohist
  WHERE (asohist_id=pAsohistid);

  RETURN pAsohistid;

END;
$$ LANGUAGE plpgsql;
