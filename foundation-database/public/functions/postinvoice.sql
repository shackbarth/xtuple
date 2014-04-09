CREATE OR REPLACE FUNCTION postInvoice(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  _return INTEGER;

BEGIN

  SELECT postInvoice(pInvcheadid, fetchJournalNumber('AR-IN')) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postInvoice(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  _itemlocSeries INTEGER;
  _return INTEGER;

BEGIN

  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  SELECT postInvoice(pInvcheadid, pJournalNumber, _itemlocseries) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postInvoice(INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  _aropenid INTEGER;
  _cohistid INTEGER;
  _itemlocSeries INTEGER := 0;
  _invhistid INTEGER := 0;
  _amount NUMERIC;
  _roundedBase NUMERIC;
  _sequence INTEGER;
  _r RECORD;
  _p RECORD;
  _test INTEGER;
  _totalAmount          NUMERIC := 0;
  _totalRoundedBase     NUMERIC := 0;
  _totalAmountBase      NUMERIC := 0;
  _appliedAmount        NUMERIC := 0;
  _commissionDue        NUMERIC := 0;
  _tmpAccntId INTEGER;
  _tmpCurrId  INTEGER;
  _firstExchDate        DATE;
  _glDate		DATE;
  _exchGain             NUMERIC := 0;

BEGIN

  IF ( ( SELECT invchead_posted
         FROM invchead
         WHERE (invchead_id=pInvcheadid) ) ) THEN
    RETURN -10;
  END IF;

--  Cache some parameters
  SELECT invchead.*, fetchGLSequence() AS sequence,
         findFreightAccount(invchead_cust_id) AS freightaccntid,
         findARAccount(invchead_cust_id) AS araccntid,
         ( SELECT COALESCE(SUM(taxhist_tax), 0)
           FROM invcheadtax
           WHERE ( (taxhist_parent_id = invchead_id)
             AND   (taxhist_taxtype_id = getFreightTaxtypeId()) ) ) AS freighttax,
         ( SELECT COALESCE(SUM(taxhist_tax), 0)
           FROM invcheadtax
           WHERE ( (taxhist_parent_id = invchead_id)
             AND   (taxhist_taxtype_id = getAdjustmentTaxtypeId()) ) ) AS adjtax
       INTO _p 
  FROM invchead
  WHERE (invchead_id=pInvcheadid);

  _itemlocSeries = pItemlocSeries;

  _glDate := COALESCE(_p.invchead_gldistdate, _p.invchead_invcdate);

  IF (_p.invchead_salesrep_id < 0) THEN
    RAISE NOTICE 'Patch negative invchead_salesrep_id until invchead_salesrep_id is a true fkey';
    _p.invchead_salesrep_id := NULL;
  END IF;

-- the 1st MC iteration used the cohead_orderdate so we could get curr exch
-- gain/loss between the sales and invoice dates, but see issue 3892.  leave
-- this condition TRUE until we make this configurable or decide not to.
  IF TRUE THEN
      _firstExchDate := _p.invchead_invcdate;
  ELSE
-- can we save a select by using: _firstExchDate := _p.invchead_orderdate;
      SELECT cohead_orderdate INTO _firstExchDate
      FROM cohead JOIN invchead ON (cohead_number = invchead_ordernumber)
      WHERE (invchead_id = pInvcheadid);
  END IF;

--  Start by handling taxes
  FOR _r IN SELECT tax_sales_accnt_id, 
              round(sum(taxdetail_tax),2) AS tax,
              currToBase(_p.invchead_curr_id, round(sum(taxdetail_tax),2), _firstExchDate) AS taxbasevalue
            FROM tax 
             JOIN calculateTaxDetailSummary('I', pInvcheadid, 'T') ON (taxdetail_tax_id=tax_id)
	    GROUP BY tax_id, tax_sales_accnt_id LOOP

    PERFORM insertIntoGLSeries( _p.sequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                _r.tax_sales_accnt_id, 
                                _r.taxbasevalue,
                                _glDate, _p.invchead_billto_name );

    _totalAmount := _totalAmount + _r.tax;
    _totalRoundedBase := _totalRoundedBase + _r.taxbasevalue;  
  END LOOP;

-- Update item tax records with posting data
    UPDATE invcitemtax SET 
      taxhist_docdate=_firstExchDate,
      taxhist_distdate=_glDate,
      taxhist_curr_id=_p.invchead_curr_id,
      taxhist_curr_rate=curr_rate,
      taxhist_journalnumber=pJournalNumber
    FROM invchead
     JOIN invcitem ON (invchead_id=invcitem_invchead_id), 
     curr_rate
    WHERE ((invchead_id=pInvcheadId)
      AND (taxhist_parent_id=invcitem_id)
      AND (_p.invchead_curr_id=curr_id)
      AND ( _firstExchDate BETWEEN curr_effective 
                           AND curr_expires) );

-- Update Invchead taxes (Freight and Adjustments) with posting data
    UPDATE invcheadtax SET 
      taxhist_docdate=_firstExchDate,
      taxhist_distdate=_glDate,
      taxhist_curr_id=_p.invchead_curr_id,
      taxhist_curr_rate=curr_rate,
      taxhist_journalnumber=pJournalNumber
    FROM curr_rate
    WHERE ((taxhist_parent_id=pInvcheadid)
      AND (_p.invchead_curr_id=curr_id)
      AND ( _firstExchDate BETWEEN curr_effective 
                           AND curr_expires) );

--  March through the Non-Misc. Invcitems
  FOR _r IN SELECT *
            FROM invoiceitem
            WHERE ( (invcitem_invchead_id = pInvcheadid)
              AND   (invcitem_item_id <> -1) ) LOOP

--  Cache the amount due for this line
    _amount := _r.extprice;

    IF (_amount > 0) THEN
--  Credit the Sales Account for the invcitem item
      IF (_r.invcitem_rev_accnt_id IS NOT NULL) THEN
        SELECT getPrjAccntId(_p.invchead_prj_id, _r.invcitem_rev_accnt_id)
	INTO _tmpAccntId;
      ELSEIF (_r.itemsite_id IS NULL) THEN
	SELECT getPrjAccntId(_p.invchead_prj_id, salesaccnt_sales_accnt_id) 
	INTO _tmpAccntId
	FROM salesaccnt
	WHERE (salesaccnt_id=findSalesAccnt(_r.invcitem_item_id, 'I', _p.invchead_cust_id,
                                            _p.invchead_saletype_id, _p.invchead_shipzone_id));
      ELSE
	SELECT getPrjAccntId(_p.invchead_prj_id, salesaccnt_sales_accnt_id) 
	INTO _tmpAccntId
	FROM salesaccnt
	WHERE (salesaccnt_id=findSalesAccnt(_r.itemsite_id, 'IS', _p.invchead_cust_id,
                                            _p.invchead_saletype_id, _p.invchead_shipzone_id));
      END IF;

--  If the Sales Account Assignment was not found then punt
      IF (NOT FOUND) THEN
        PERFORM deleteGLSeries(_p.sequence);
        DELETE FROM cohist
         WHERE ((cohist_sequence=_p.sequence)
           AND  (cohist_invcnumber=_p.invchead_invcnumber));
        RETURN -11;
      END IF;

      _roundedBase := round(currToBase(_p.invchead_curr_id, _amount, _firstExchDate), 2);
      SELECT insertIntoGLSeries( _p.sequence, 'A/R', 'IN',
                                 _p.invchead_invcnumber, _tmpAccntId,
                                 _roundedBase, _glDate, _p.invchead_billto_name ) INTO _test;

      _totalAmount := (_totalAmount + _amount);
      _totalRoundedBase := _totalRoundedBase + _roundedBase;
      _commissionDue := (_commissionDue + (_amount * _p.invchead_commission));
    END IF;

    _totalAmount := _totalAmount;
    _totalRoundedBase := _totalRoundedBase;

--  Record Sales History for this S/O Item
    SELECT nextval('cohist_cohist_id_seq') INTO _cohistid;
    INSERT INTO cohist
    ( cohist_id, cohist_cust_id, cohist_itemsite_id, cohist_shipto_id,
      cohist_shipdate, cohist_shipvia,
      cohist_ordernumber, cohist_ponumber, cohist_orderdate,
      cohist_doctype, cohist_invcnumber, cohist_invcdate,
      cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
      cohist_salesrep_id, cohist_commission, cohist_commissionpaid,
      cohist_billtoname, cohist_billtoaddress1,
      cohist_billtoaddress2, cohist_billtoaddress3,
      cohist_billtocity, cohist_billtostate, cohist_billtozip,
      cohist_shiptoname, cohist_shiptoaddress1,
      cohist_shiptoaddress2, cohist_shiptoaddress3,
      cohist_shiptocity, cohist_shiptostate, cohist_shiptozip,
      cohist_curr_id, cohist_sequence, cohist_taxtype_id, cohist_taxzone_id,
      cohist_shipzone_id, cohist_saletype_id )
    VALUES
    ( _cohistid, _p.invchead_cust_id, _r.itemsite_id, _p.invchead_shipto_id,
      _p.invchead_shipdate, _p.invchead_shipvia,
      COALESCE(_p.invchead_ordernumber, _r.cohead_number), _p.invchead_ponumber, _p.invchead_orderdate,
      'I', _p.invchead_invcnumber, _p.invchead_invcdate,
      _r.qty, _r.unitprice, _r.unitcost,
      _p.invchead_salesrep_id, (_p.invchead_commission * _r.extprice), FALSE,
      _p.invchead_billto_name, _p.invchead_billto_address1,
      _p.invchead_billto_address2, _p.invchead_billto_address3,
      _p.invchead_billto_city, _p.invchead_billto_state, _p.invchead_billto_zipcode,
      _p.invchead_shipto_name, _p.invchead_shipto_address1,
      _p.invchead_shipto_address2, _p.invchead_shipto_address3,
      _p.invchead_shipto_city, _p.invchead_shipto_state,
      _p.invchead_shipto_zipcode, _p.invchead_curr_id,
      _p.sequence, _r.invcitem_taxtype_id, _p.invchead_taxzone_id,
      _p.invchead_shipzone_id, _p.invchead_saletype_id );
    INSERT INTO cohisttax
    ( taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id,
      taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
      taxhist_percent, taxhist_amount, taxhist_tax,
      taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
      taxhist_journalnumber )
    SELECT _cohistid, taxhist_taxtype_id, taxhist_tax_id,
           taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
           taxhist_percent, taxhist_amount, taxhist_tax,
           taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
           taxhist_journalnumber
    FROM invcitemtax
    WHERE (taxhist_parent_id=_r.invcitem_id);

  END LOOP;

--  March through the Misc. Invcitems
  FOR _r IN SELECT *
            FROM invoiceitem JOIN salescat ON (salescat_id = invcitem_salescat_id)
            WHERE ( (invcitem_item_id = -1)
              AND   (invcitem_invchead_id=pInvcheadid) ) LOOP

--  Cache the amount due for this line and the commission due for such
    _amount := _r.extprice;

    IF (_amount > 0) THEN
--  Credit the Sales Account for the invcitem item
      _roundedBase = round(currToBase(_p.invchead_curr_id, _amount,
                                      _firstExchDate), 2);
      SELECT insertIntoGLSeries( _p.sequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 getPrjAccntId(_p.invchead_prj_id, COALESCE(_r.invcitem_rev_accnt_id, _r.salescat_sales_accnt_id)), 
                                 _roundedBase,
                                 _glDate, _p.invchead_billto_name ) INTO _test;
      IF (_test < 0) THEN
        PERFORM deleteGLSeries(_p.sequence);
        DELETE FROM cohist
         WHERE ((cohist_sequence=_p.sequence)
           AND  (cohist_invcnumber=_p.invchead_invcnumber));
        RETURN _test;
      END IF;

      _totalAmount := (_totalAmount + _amount);
      _totalRoundedBase :=  _totalRoundedBase + _roundedBase;
      _commissionDue := (_commissionDue + (_amount * _p.invchead_commission));
    END IF;

--  Record Sales History for this S/O Item
    SELECT nextval('cohist_cohist_id_seq') INTO _cohistid;
    INSERT INTO cohist
    ( cohist_id, cohist_cust_id, cohist_itemsite_id, cohist_shipto_id,
      cohist_misc_type, cohist_misc_descrip,
      cohist_shipdate, cohist_shipvia,
      cohist_ordernumber, cohist_ponumber, cohist_orderdate,
      cohist_doctype, cohist_invcnumber, cohist_invcdate,
      cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
      cohist_salesrep_id, cohist_commission, cohist_commissionpaid,
      cohist_billtoname, cohist_billtoaddress1,
      cohist_billtoaddress2, cohist_billtoaddress3,
      cohist_billtocity, cohist_billtostate, cohist_billtozip,
      cohist_shiptoname, cohist_shiptoaddress1,
      cohist_shiptoaddress2, cohist_shiptoaddress3,
      cohist_shiptocity, cohist_shiptostate, cohist_shiptozip,
      cohist_curr_id, cohist_sequence, cohist_taxtype_id, cohist_taxzone_id,
      cohist_shipzone_id, cohist_saletype_id )
    VALUES
    ( _cohistid, _p.invchead_cust_id, -1, _p.invchead_shipto_id,
      'M', (_r.invcitem_number || '-' || _r.invcitem_descrip),
      _p.invchead_shipdate, _p.invchead_shipvia,
      COALESCE(_p.invchead_ordernumber, _r.cohead_number), _p.invchead_ponumber, _p.invchead_orderdate,
      'I', _p.invchead_invcnumber, _p.invchead_invcdate,
      _r.qty, _r.unitprice, 0,
      _p.invchead_salesrep_id, (_p.invchead_commission * _r.extprice), FALSE,
      _p.invchead_billto_name, _p.invchead_billto_address1,
      _p.invchead_billto_address2, _p.invchead_billto_address3,
      _p.invchead_billto_city, _p.invchead_billto_state, _p.invchead_billto_zipcode,
      _p.invchead_shipto_name, _p.invchead_shipto_address1,
      _p.invchead_shipto_address2, _p.invchead_shipto_address3,
      _p.invchead_shipto_city, _p.invchead_shipto_state,
      _p.invchead_shipto_zipcode, _p.invchead_curr_id,
      _p.sequence, _r.invcitem_taxtype_id, _p.invchead_taxzone_id,
      _p.invchead_shipzone_id, _p.invchead_saletype_id );
    INSERT INTO cohisttax
    ( taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id,
      taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
      taxhist_percent, taxhist_amount, taxhist_tax,
      taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
      taxhist_journalnumber )
    SELECT _cohistid, taxhist_taxtype_id, taxhist_tax_id,
           taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
           taxhist_percent, taxhist_amount, taxhist_tax,
           taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
           taxhist_journalnumber
    FROM invcitemtax
    WHERE (taxhist_parent_id=_r.invcitem_id);

  END LOOP;

--  Credit the Freight Account for Freight Charges
  IF (_p.invchead_freight <> 0) THEN
    IF (_p.freightaccntid <> -1) THEN
      _roundedBase = round(currToBase(_p.invchead_curr_id, _p.invchead_freight,
                                      _firstExchDate), 2);
      SELECT insertIntoGLSeries( _p.sequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 getPrjAccntId(_p.invchead_prj_id,_p.freightaccntid), 
                                 _roundedBase,
                                 _glDate, _p.invchead_billto_name ) INTO _test;

--  Cache the Freight Amount distributed
        _totalAmount := (_totalAmount + _p.invchead_freight);
        _totalRoundedBase := _totalRoundedBase + _roundedBase;
    ELSE
      _test := -14;
    END IF;

--  If the Freight Account was not found then punt
    IF (_test < 0) THEN
      PERFORM deleteGLSeries(_p.sequence);
      DELETE FROM cohist
       WHERE ((cohist_sequence=_p.sequence)
         AND  (cohist_invcnumber=_p.invchead_invcnumber));
      RETURN _test;
    END IF;

--  Record Sales History for the Freight
    SELECT nextval('cohist_cohist_id_seq') INTO _cohistid;
    INSERT INTO cohist
    ( cohist_id, cohist_cust_id, cohist_itemsite_id, cohist_shipto_id,
      cohist_misc_type, cohist_misc_descrip,
      cohist_shipdate, cohist_shipvia,
      cohist_ordernumber, cohist_ponumber, cohist_orderdate,
      cohist_doctype, cohist_invcnumber, cohist_invcdate,
      cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
      cohist_salesrep_id, cohist_commission, cohist_commissionpaid,
      cohist_billtoname, cohist_billtoaddress1,
      cohist_billtoaddress2, cohist_billtoaddress3,
      cohist_billtocity, cohist_billtostate, cohist_billtozip,
      cohist_shiptoname, cohist_shiptoaddress1,
      cohist_shiptoaddress2, cohist_shiptoaddress3,
      cohist_shiptocity, cohist_shiptostate, cohist_shiptozip,
      cohist_curr_id, cohist_sequence, cohist_taxtype_id, cohist_taxzone_id,
      cohist_shipzone_id, cohist_saletype_id )
    VALUES
    ( _cohistid, _p.invchead_cust_id, -1, _p.invchead_shipto_id,
      'F', 'Freight',
      _p.invchead_shipdate, _p.invchead_shipvia,
      _p.invchead_ordernumber, _p.invchead_ponumber, _p.invchead_orderdate,
      'I', _p.invchead_invcnumber, _p.invchead_invcdate,
      1, _p.invchead_freight, _p.invchead_freight,
      _p.invchead_salesrep_id, 0, FALSE,
      _p.invchead_billto_name, _p.invchead_billto_address1,
      _p.invchead_billto_address2, _p.invchead_billto_address3,
      _p.invchead_billto_city, _p.invchead_billto_state, _p.invchead_billto_zipcode,
      _p.invchead_shipto_name, _p.invchead_shipto_address1,
      _p.invchead_shipto_address2, _p.invchead_shipto_address3,
      _p.invchead_shipto_city, _p.invchead_shipto_state,
      _p.invchead_shipto_zipcode, _p.invchead_curr_id,
      _p.sequence, getFreightTaxtypeId(), _p.invchead_taxzone_id,
      _p.invchead_shipzone_id, _p.invchead_saletype_id );
    INSERT INTO cohisttax
    ( taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id,
      taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
      taxhist_percent, taxhist_amount, taxhist_tax,
      taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
      taxhist_journalnumber )
    SELECT _cohistid, taxhist_taxtype_id, taxhist_tax_id,
           taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
           taxhist_percent, taxhist_amount, taxhist_tax,
           taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
           taxhist_journalnumber
    FROM invcheadtax
    WHERE ( (taxhist_parent_id=_p.invchead_id)
      AND   (taxhist_taxtype_id=getFreightTaxtypeId()) );

  END IF;

--  Credit the Misc. Account for Miscellaneous Charges
  IF (_p.invchead_misc_amount <> 0) THEN
    _roundedBase := round(currToBase(_p.invchead_curr_id, _p.invchead_misc_amount,
                                     _firstExchDate), 2);
    SELECT insertIntoGLSeries( _p.sequence, 'A/R', 'IN', _p.invchead_invcnumber,
                               getPrjAccntId(_p.invchead_prj_id, _p.invchead_misc_accnt_id), 
                               _roundedBase,
                               _glDate, _p.invchead_billto_name ) INTO _test;

--  If the Misc. Charges Account was not found then punt
    IF (_test < 0) THEN
      PERFORM deleteGLSeries(_p.sequence);
      DELETE FROM cohist
       WHERE ((cohist_sequence=_p.sequence)
         AND  (cohist_invcnumber=_p.invchead_invcnumber));
      RETURN _test;
    END IF;

--  Cache the Misc. Amount distributed
    _totalAmount := (_totalAmount + _p.invchead_misc_amount);
    _totalRoundedBase := _totalRoundedBase + _roundedBase;

--  Record Sales History for the Misc. Charge
    INSERT INTO cohist
    ( cohist_cust_id, cohist_itemsite_id, cohist_shipto_id,
      cohist_misc_type, cohist_misc_descrip, cohist_misc_id,
      cohist_shipdate, cohist_shipvia,
      cohist_ordernumber, cohist_ponumber, cohist_orderdate,
      cohist_doctype, cohist_invcnumber, cohist_invcdate,
      cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
      cohist_salesrep_id, cohist_commission, cohist_commissionpaid,
      cohist_billtoname, cohist_billtoaddress1,
      cohist_billtoaddress2, cohist_billtoaddress3,
      cohist_billtocity, cohist_billtostate, cohist_billtozip,
      cohist_shiptoname, cohist_shiptoaddress1,
      cohist_shiptoaddress2, cohist_shiptoaddress3,
      cohist_shiptocity, cohist_shiptostate, cohist_shiptozip,
      cohist_curr_id, cohist_sequence,
      cohist_shipzone_id, cohist_saletype_id )
    VALUES
    ( _p.invchead_cust_id, -1, _p.invchead_shipto_id,
      'M', _p.invchead_misc_descrip, _p.invchead_misc_accnt_id,
      _p.invchead_shipdate, _p.invchead_shipvia,
      _p.invchead_ordernumber, _p.invchead_ponumber, _p.invchead_orderdate,
      'I', _p.invchead_invcnumber, _p.invchead_invcdate,
      1, _p.invchead_misc_amount, _p.invchead_misc_amount,
      _p.invchead_salesrep_id, 0, FALSE,
      _p.invchead_billto_name, _p.invchead_billto_address1,
      _p.invchead_billto_address2, _p.invchead_billto_address3,
      _p.invchead_billto_city, _p.invchead_billto_state, _p.invchead_billto_zipcode,
      _p.invchead_shipto_name, _p.invchead_shipto_address1,
      _p.invchead_shipto_address2, _p.invchead_shipto_address3,
      _p.invchead_shipto_city, _p.invchead_shipto_state,
      _p.invchead_shipto_zipcode, _p.invchead_curr_id,
      _p.sequence,
      _p.invchead_shipzone_id, _p.invchead_saletype_id );

  END IF;

--  Record Sales History for the Tax Adjustment
  IF (_p.adjtax <> 0) THEN
    SELECT nextval('cohist_cohist_id_seq') INTO _cohistid;
    INSERT INTO cohist
    ( cohist_id, cohist_cust_id, cohist_itemsite_id, cohist_shipto_id,
      cohist_misc_type, cohist_misc_descrip,
      cohist_shipdate, cohist_shipvia,
      cohist_ordernumber, cohist_ponumber, cohist_orderdate,
      cohist_doctype, cohist_invcnumber, cohist_invcdate,
      cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
      cohist_salesrep_id, cohist_commission, cohist_commissionpaid,
      cohist_billtoname, cohist_billtoaddress1,
      cohist_billtoaddress2, cohist_billtoaddress3,
      cohist_billtocity, cohist_billtostate, cohist_billtozip,
      cohist_shiptoname, cohist_shiptoaddress1,
      cohist_shiptoaddress2, cohist_shiptoaddress3,
      cohist_shiptocity, cohist_shiptostate, cohist_shiptozip,
      cohist_curr_id, cohist_sequence, cohist_taxtype_id, cohist_taxzone_id,
      cohist_shipzone_id, cohist_saletype_id )
    VALUES
    ( _cohistid, _p.invchead_cust_id, -1, _p.invchead_shipto_id,
      'T', 'Misc Tax Adjustment',
      _p.invchead_shipdate, _p.invchead_shipvia,
      _p.invchead_ordernumber, _p.invchead_ponumber, _p.invchead_orderdate,
      'I', _p.invchead_invcnumber, _p.invchead_invcdate,
      1, 0.0, 0.0,
      _p.invchead_salesrep_id, 0, FALSE,
      _p.invchead_billto_name, _p.invchead_billto_address1,
      _p.invchead_billto_address2, _p.invchead_billto_address3,
      _p.invchead_billto_city, _p.invchead_billto_state, _p.invchead_billto_zipcode,
      _p.invchead_shipto_name, _p.invchead_shipto_address1,
      _p.invchead_shipto_address2, _p.invchead_shipto_address3,
      _p.invchead_shipto_city, _p.invchead_shipto_state,
      _p.invchead_shipto_zipcode, _p.invchead_curr_id,
      _p.sequence, getAdjustmentTaxtypeId(), _p.invchead_taxzone_id,
      _p.invchead_shipzone_id, _p.invchead_saletype_id );
    INSERT INTO cohisttax
    ( taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id,
      taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
      taxhist_percent, taxhist_amount, taxhist_tax,
      taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
      taxhist_journalnumber )
    SELECT _cohistid, taxhist_taxtype_id, taxhist_tax_id,
           taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
           taxhist_percent, taxhist_amount, taxhist_tax,
           taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
           taxhist_journalnumber
    FROM invcheadtax
    WHERE ( (taxhist_parent_id=_p.invchead_id)
      AND   (taxhist_taxtype_id=getAdjustmentTaxtypeId()) );

  END IF;

-- ToDo: handle rounding errors
    _exchGain := currGain(_p.invchead_curr_id, _totalAmount,
                          _firstExchDate, _glDate);
    IF (_exchGain <> 0) THEN
        SELECT insertIntoGLSeries( _p.sequence, 'A/R', 'IN',
                                   _p.invchead_invcnumber, getGainLossAccntId(_p.araccntid),
                                   round(_exchGain, 2) * -1,
                                   _glDate, _p.invchead_billto_name ) INTO _test ;
        IF (_test < 0) THEN
          PERFORM deleteGLSeries(_p.sequence);
          DELETE FROM cohist
           WHERE ((cohist_sequence=_p.sequence)
             AND  (cohist_invcnumber=_p.invchead_invcnumber));
          RETURN _test;
        END IF;
    END IF;

--  Debit A/R for the total Amount
  IF (_totalRoundedBase <> 0) THEN
    IF (_p.araccntid != -1) THEN
      PERFORM insertIntoGLSeries( _p.sequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                  _p.araccntid, round(_totalRoundedBase * -1, 2),
                                  _glDate, _p.invchead_billto_name );
    ELSE
      PERFORM deleteGLSeries(_p.sequence);
      DELETE FROM cohist
       WHERE ((cohist_sequence=_p.sequence)
         AND  (cohist_invcnumber=_p.invchead_invcnumber));
      RETURN -17;
    END IF;
  END IF;

--  Commit the GLSeries;
  SELECT postGLSeries(_p.sequence, pJournalNumber) INTO _test;
  IF (_test < 0) THEN
    PERFORM deleteGLSeries(_p.sequence);
    DELETE FROM cohist
     WHERE ((cohist_sequence=_p.sequence)
       AND  (cohist_invcnumber=_p.invchead_invcnumber));
    RETURN _test;
  END IF;

--  Create the Invoice aropen item
  SELECT nextval('aropen_aropen_id_seq') INTO _aropenid;
  INSERT INTO aropen
  ( aropen_id, aropen_username, aropen_journalnumber,
    aropen_open, aropen_posted,
    aropen_cust_id, aropen_ponumber,
    aropen_docnumber, aropen_applyto, aropen_doctype,
    aropen_docdate, aropen_duedate, aropen_distdate, aropen_terms_id,
    aropen_amount, aropen_paid,
    aropen_salesrep_id, aropen_commission_due, aropen_commission_paid,
    aropen_ordernumber, aropen_notes, aropen_cobmisc_id,
    aropen_curr_id )
  VALUES
  ( _aropenid, getEffectiveXtUser(), pJournalNumber,
    TRUE, FALSE,
    _p.invchead_cust_id, _p.invchead_ponumber,
    _p.invchead_invcnumber, _p.invchead_invcnumber, 'I',
    _p.invchead_invcdate, determineDueDate(_p.invchead_terms_id, _p.invchead_invcdate), _glDate, _p.invchead_terms_id,
    round(_totalAmount, 2), 0, 
    _p.invchead_salesrep_id, _commissionDue, FALSE,
    _p.invchead_ordernumber::text, _p.invchead_notes, pInvcheadid,
    _p.invchead_curr_id );

-- Handle the Inventory and G/L Transactions for any billed Inventory where invcitem_updateinv is true
  FOR _r IN SELECT itemsite_id AS itemsite_id, invcitem_id,
                   (invcitem_billed * invcitem_qty_invuomratio) AS qty,
                   invchead_invcnumber, invchead_cust_id AS cust_id, item_number,
                   invchead_saletype_id AS saletype_id, invchead_shipzone_id AS shipzone_id,
                   invchead_prj_id, itemsite_costmethod
            FROM invchead JOIN invcitem ON ( (invcitem_invchead_id=invchead_id) AND
                                             (invcitem_billed <> 0) AND
                                             (invcitem_updateinv) )
                          JOIN itemsite ON ( (itemsite_item_id=invcitem_item_id) AND
                                             (itemsite_warehous_id=invcitem_warehous_id) )
                          JOIN item ON (item_id=invcitem_item_id)
            WHERE (invchead_id=pInvcheadid) LOOP

--  Issue billed stock from inventory
    IF (_itemlocSeries = 0) THEN
      _itemlocSeries := NEXTVAL('itemloc_series_seq');
    END IF;
    IF (_r.itemsite_costmethod != 'J') THEN
      SELECT postInvTrans(itemsite_id, 'SH', _r.qty,
                         'S/O', 'IN', _r.invchead_invcnumber, '',
                         ('Invoice Billed ' || _r.item_number),
                         getPrjAccntId(_r.invchead_prj_id, resolveCOSAccount(itemsite_id, _r.cust_id, _r.saletype_id, _r.shipzone_id)),
                         costcat_asset_accnt_id, _itemlocSeries, _glDate) INTO _invhistid
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_r.itemsite_id) );
    ELSE
      RAISE DEBUG 'postInvoice(%, %, %) tried to postInvTrans a %-costed item',
                  pInvcheadid, pJournalNumber, pItemlocSeries,
                  _r.itemsite_costmethod;
    END IF;

  END LOOP;

--  Mark the invoice as posted
  UPDATE invchead
  SET invchead_posted=TRUE, invchead_gldistdate=_glDate
  WHERE (invchead_id=pInvcheadid);
 
  IF (_totalAmount > 0) THEN
    -- get a list of allocated CMs
    FOR _r IN SELECT aropen_id,
		     CASE WHEN((aropen_amount - aropen_paid) >=
                                aropenalloc_amount / (1 / aropen_curr_rate / 
                                currRate(aropenalloc_curr_id,_firstExchDate))) THEN
			      aropenalloc_amount / (1 / aropen_curr_rate / 
                                currRate(aropenalloc_curr_id,_firstExchDate))
			  ELSE (aropen_amount - aropen_paid)
		     END AS balance,
		     aropen_curr_id, aropen_curr_rate,
		     aropenalloc_doctype, aropenalloc_doc_id
                FROM aropenalloc, aropen
               WHERE ( (aropenalloc_aropen_id=aropen_id)
                 AND   ((aropenalloc_doctype='S' AND aropenalloc_doc_id=(SELECT cohead_id
                                                                           FROM cohead
                                                                          WHERE cohead_number=_p.invchead_ordernumber)) OR
                        (aropenalloc_doctype='I' AND aropenalloc_doc_id=_p.invchead_id)) ) LOOP

      _appliedAmount := _r.balance;
      IF (_totalAmount < _appliedAmount / (1 / currRate(_r.aropen_curr_id,_firstExchDate) /
                        _r.aropen_curr_rate)) THEN
        _appliedAmount := _totalAmount;
	_tmpCurrId := _p.invchead_curr_id;
      ELSE
	_tmpCurrId := _r.aropen_curr_id;
      END IF;

      -- ignore if no appliable balance
      IF (_appliedAmount > 0) THEN
        -- create an arcreditapply record linking the source c/m and the target invoice
        -- for an amount that is equal to the balance on the invoice or the balance on
        -- c/m whichever is greater.
        INSERT INTO arcreditapply
              (arcreditapply_source_aropen_id, arcreditapply_target_aropen_id,
	       arcreditapply_amount, arcreditapply_curr_id, arcreditapply_reftype, arcreditapply_ref_id)
        VALUES(_r.aropen_id, _aropenid, _appliedAmount, _tmpCurrId, 'S',  _r.aropenalloc_doc_id);

        -- call postARCreditMemoApplication(aropen_id of C/M)
        SELECT postARCreditMemoApplication(_r.aropen_id) into _test;

        -- if no error decrement the balance and contiue on
        IF (_test >= 0) THEN
          _totalAmount := _totalAmount - currToCurr(_tmpCurrId, _p.invchead_curr_id,
						    _appliedAmount, _firstExchDate);
        END IF;

        -- delete the allocation
        DELETE FROM aropenalloc
        WHERE (aropenalloc_doctype='I')
          AND (aropenalloc_doc_id=_p.invchead_id);

      END IF;
    END LOOP;
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE plpgsql;
