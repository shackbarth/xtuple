CREATE OR REPLACE FUNCTION voidInvoice(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  _glSequence INTEGER := 0;
  _glJournal INTEGER := 0;
  _itemlocSeries INTEGER := 0;
  _aropenid INTEGER := 0;
  _invhistid INTEGER := 0;
  _amount NUMERIC;
  _roundedBase NUMERIC;
  _r RECORD;
  _p RECORD;
  _n RECORD;
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

--  Cache Invoice information
  SELECT invchead.*,
         findFreightAccount(invchead_cust_id) AS freightaccntid,
         findARAccount(invchead_cust_id) AS araccntid,
         aropen_id, cohist_unitcost,
         ( SELECT COALESCE(SUM(taxhist_tax), 0)
           FROM invcheadtax
           WHERE ( (taxhist_parent_id = invchead_id)
             AND   (taxhist_taxtype_id = getFreightTaxtypeId()) ) ) AS freighttax,
         ( SELECT COALESCE(SUM(taxhist_tax), 0)
           FROM invcheadtax
           WHERE ( (taxhist_parent_id = invchead_id)
             AND   (taxhist_taxtype_id = getAdjustmentTaxtypeId()) ) ) AS adjtax
       INTO _p 
  FROM invchead JOIN aropen ON (aropen_doctype='I' AND aropen_docnumber=invchead_invcnumber)
                JOIN cohist ON (cohist_doctype='I' AND cohist_invcnumber=invchead_invcnumber)
  WHERE (invchead_id=pInvcheadid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Invoice as invchead not found';
  END IF;
  IF (NOT _p.invchead_posted) THEN
    RETURN -10;
  END IF;

--  Cache AROpen Information
  SELECT aropen.* INTO _n
  FROM aropen
  WHERE ( (aropen_doctype='I')
    AND   (aropen_docnumber=_p.invchead_invcnumber) );
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Invoice as aropen not found';
  END IF;

--  Check for ARApplications
  SELECT arapply_id INTO _test
  FROM arapply
  WHERE (arapply_target_aropen_id=_n.aropen_id)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -20;
  END IF;

  SELECT fetchGLSequence() INTO _glSequence;
  SELECT fetchJournalNumber('AR-IN') INTO _glJournal;

  _glDate := COALESCE(_p.invchead_gldistdate, _p.invchead_invcdate);

-- the 1st MC iteration used the cohead_orderdate so we could get curr exch
-- gain/loss between the sales and invoice dates, but see issue 3892.  leave
-- this condition TRUE until we make this configurable or decide not to.
  IF TRUE THEN
      _firstExchDate := _p.invchead_invcdate;
  ELSE
-- can we save a select by using: _firstExchDate := _p.invchead_orderdate;
      SELECT cohead_orderdate INTO _firstExchDate
      FROM cohead
      WHERE (cohead_number = _p.invchead_ordernumber);
  END IF;

--  Start by handling taxes (reverse sense)
  FOR _r IN SELECT tax_sales_accnt_id, 
              round(sum(taxdetail_tax),2) AS tax,
              currToBase(_p.invchead_curr_id, round(sum(taxdetail_tax),2), _firstExchDate) AS taxbasevalue
            FROM tax 
             JOIN calculateTaxDetailSummary('I', _p.invchead_id, 'T') ON (taxdetail_tax_id=tax_id)
	    GROUP BY tax_id, tax_sales_accnt_id LOOP

    PERFORM insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                _r.tax_sales_accnt_id, 
                                (_r.taxbasevalue * -1.0),
                                _glDate, ('Void-' || _p.invchead_billto_name) );

    _totalAmount := _totalAmount + _r.tax;
    _totalRoundedBase := _totalRoundedBase + _r.taxbasevalue;  
  END LOOP;

--  March through the Non-Misc. Invcitems
  FOR _r IN SELECT *
            FROM invoiceitem
            WHERE ( (invcitem_invchead_id = _p.invchead_id)
              AND   (invcitem_item_id <> -1) ) LOOP

--  Cache the amount due for this line
    _amount := _r.extprice;

    IF (_amount > 0) THEN
--  Credit the Sales Account for the invcitem item (reverse sense)
      IF (_r.itemsite_id IS NULL) THEN
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
        PERFORM deleteGLSeries(_glSequence);
        RETURN -11;
      END IF;

      _roundedBase := round(currToBase(_p.invchead_curr_id, _amount, _firstExchDate), 2);
      SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 _tmpAccntId,
                                 (_roundedBase * -1.0),
                                 _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test;

      _totalAmount := (_totalAmount + _amount);
      _totalRoundedBase := _totalRoundedBase + _roundedBase;
      _commissionDue := (_commissionDue + (_amount * _p.invchead_commission));
    END IF;

    _totalAmount := _totalAmount;
    _totalRoundedBase := _totalRoundedBase;

  END LOOP;

--  March through the Misc. Invcitems
  FOR _r IN SELECT *
            FROM invoiceitem JOIN salescat ON (salescat_id = invcitem_salescat_id)
            WHERE ( (invcitem_item_id = -1)
              AND   (invcitem_invchead_id=_p.invchead_id) ) LOOP

--  Cache the amount due for this line and the commission due for such
    _amount := _r.extprice;

    IF (_amount > 0) THEN
--  Credit the Sales Account for the invcitem item (reverse sense)
      _roundedBase = round(currToBase(_p.invchead_curr_id, _amount,
                                      _firstExchDate), 2);
      SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 getPrjAccntId(_p.invchead_prj_id, _r.salescat_sales_accnt_id), 
                                 (_roundedBase * -1.0),
                                 _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test;

      IF (_test < 0) THEN
        PERFORM deleteGLSeries(_glSequence);
        RETURN _test;
      END IF;

      _totalAmount := (_totalAmount + _amount);
      _totalRoundedBase :=  _totalRoundedBase + _roundedBase;
      _commissionDue := (_commissionDue + (_amount * _p.invchead_commission));
    END IF;

  END LOOP;

--  Credit the Freight Account for Freight Charges (reverse sense)
  IF (_p.invchead_freight <> 0) THEN
    IF (_p.freightaccntid <> -1) THEN
      _roundedBase = round(currToBase(_p.invchead_curr_id, _p.invchead_freight,
                                      _firstExchDate), 2);
      SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 getPrjAccntId(_p.invchead_prj_id,_p.freightaccntid), 
                                 (_roundedBase * -1.0),
                                 _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test;

--  Cache the Freight Amount distributed
        _totalAmount := (_totalAmount + _p.invchead_freight);
        _totalRoundedBase := _totalRoundedBase + _roundedBase;
    ELSE
      _test := -14;
    END IF;

--  If the Freight Account was not found then punt
    IF (_test < 0) THEN
      PERFORM deleteGLSeries(_glSequence);
      RETURN _test;
    END IF;

  END IF;

--  Credit the Misc. Account for Miscellaneous Charges (reverse sense)
  IF (_p.invchead_misc_amount <> 0) THEN
    _roundedBase := round(currToBase(_p.invchead_curr_id, _p.invchead_misc_amount,
                                     _firstExchDate), 2);
    SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                               getPrjAccntId(_p.invchead_prj_id, _p.invchead_misc_accnt_id), 
                               (_roundedBase * -1.0),
                               _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test;

--  If the Misc. Charges Account was not found then punt
    IF (_test < 0) THEN
      PERFORM deleteGLSeries(_glSequence);
      RETURN _test;
    END IF;

--  Cache the Misc. Amount distributed
    _totalAmount := (_totalAmount + _p.invchead_misc_amount);
    _totalRoundedBase := _totalRoundedBase + _roundedBase;

  END IF;

-- ToDo: handle rounding errors (reverse sense)
    _exchGain := currGain(_p.invchead_curr_id, _totalAmount,
                          _firstExchDate, _glDate);
    IF (_exchGain <> 0) THEN
        SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                   getGainLossAccntId(_p.araccntid),
                                   round(_exchGain, 2),
                                   _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test ;
        IF (_test < 0) THEN
          PERFORM deleteGLSeries(_glSequence);
          RETURN _test;
        END IF;
    END IF;

--  Debit A/R for the total Amount (reverse sense)
  IF (_totalRoundedBase <> 0) THEN
    IF (_p.araccntid != -1) THEN
      SELECT insertIntoGLSeries( _glSequence, 'A/R', 'IN', _p.invchead_invcnumber,
                                 _p.araccntid,
                                 round(_totalRoundedBase, 2),
                                 _glDate, ('Void-' || _p.invchead_billto_name) ) INTO _test;
    ELSE
      PERFORM deleteGLSeries(_glSequence);
      RETURN _test;
    END IF;
  END IF;

--  Commit the GLSeries;
  SELECT postGLSeries(_glSequence, _glJournal) INTO _test;
  IF (_test < 0) THEN
    PERFORM deleteGLSeries(_glSequence);
    RETURN _test;
  END IF;

--  Delete sales history
  DELETE FROM cohisttax
  WHERE (taxhist_parent_id IN (SELECT cohist_id
                               FROM cohist
                               WHERE (cohist_doctype='I' AND cohist_invcnumber=_p.invchead_invcnumber)));

  DELETE FROM cohist
  WHERE (cohist_doctype='I' AND cohist_invcnumber=_p.invchead_invcnumber);

--  Create the Credit aropen item
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
  ( _aropenid, getEffectiveXtUser(), _glJournal,
    TRUE, FALSE,
    _p.invchead_cust_id, _p.invchead_ponumber,
    _p.invchead_invcnumber, _p.invchead_invcnumber, 'C',
    _p.invchead_invcdate, determineDueDate(_p.invchead_terms_id, _p.invchead_invcdate), _glDate, _p.invchead_terms_id,
    round(_totalAmount, 2), round(_totalAmount, 2), 
    _p.invchead_salesrep_id, _commissionDue, FALSE,
    _p.invchead_ordernumber::text, _p.invchead_notes, pInvcheadid,
    _p.invchead_curr_id );

--  Alter the Invoice A/R Open Item to reflect the application
    UPDATE aropen
    SET aropen_paid = round(_totalAmount, 2)
    WHERE (aropen_id=_p.aropen_id);

--  Record the application
    INSERT INTO arapply
    ( arapply_cust_id,
      arapply_source_aropen_id, arapply_source_doctype, arapply_source_docnumber,
      arapply_target_aropen_id, arapply_target_doctype, arapply_target_docnumber,
      arapply_fundstype, arapply_refnumber,
      arapply_applied, arapply_closed,
      arapply_postdate, arapply_distdate, arapply_journalnumber, arapply_curr_id )
    VALUES
    ( _p.invchead_cust_id,
      _aropenid, 'C', _p.invchead_invcnumber,
      _p.aropen_id, 'I', _p.invchead_invcnumber,
      '', '',
      round(_totalAmount, 2), TRUE,
      CURRENT_DATE, _p.invchead_invcdate, 0, _p.invchead_curr_id );

-- Handle the Inventory and G/L Transactions for any billed Inventory where invcitem_updateinv is true (reverse sense)
  FOR _r IN SELECT itemsite_id AS itemsite_id, invcitem_id,
                   (invcitem_billed * invcitem_qty_invuomratio) AS qty,
                   invchead_invcnumber, invchead_cust_id AS cust_id, item_number,
                   invchead_prj_id AS prj_id, invchead_saletype_id AS saletype_id,
                   invchead_shipzone_id AS shipzone_id
            FROM invchead JOIN invcitem ON ( (invcitem_invchead_id=invchead_id) AND
                                             (invcitem_billed <> 0) AND
                                             (invcitem_updateinv) )
                          JOIN itemsite ON ( (itemsite_item_id=invcitem_item_id) AND
                                             (itemsite_warehous_id=invcitem_warehous_id) )
                          JOIN item ON (item_id=invcitem_item_id)
            WHERE (invchead_id=_p.invchead_id) LOOP

--  Return billed stock to inventory
    IF (_itemlocSeries = 0) THEN
      SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
    END IF;
    SELECT postInvTrans( itemsite_id, 'SH', (_r.qty * -1.0),
                         'S/O', 'IN', _r.invchead_invcnumber, '',
                         ('Invoice Voided ' || _r.item_number),
                         getPrjAccntId(_r.prj_id, resolveCOSAccount(itemsite_id, _r.cust_id, _r.saletype_id, _r.shipzone_id)),
                         costcat_asset_accnt_id, _itemlocSeries, _glDate,
                         (_p.cohist_unitcost * _r.qty)) INTO _invhistid
    FROM itemsite JOIN costcat ON (itemsite_costcat_id=costcat_id)
    WHERE (itemsite_id=_r.itemsite_id);

  END LOOP;

--  Reopen Billing
  UPDATE shipitem
  SET shipitem_invoiced=FALSE,
      shipitem_invcitem_id=NULL
  WHERE (shipitem_invcitem_id IN (SELECT invcitem_id
                                  FROM invcitem
                                  WHERE (invcitem_invchead_id=_p.invchead_id)));
  UPDATE cobill
  SET cobill_invcnum=NULL,
      cobill_invcitem_id=NULL
  WHERE (cobill_invcitem_id IN (SELECT invcitem_id
                                FROM invcitem
                                WHERE (invcitem_invchead_id=_p.invchead_id)));
  UPDATE cobmisc
  SET cobmisc_posted=FALSE,
      cobmisc_invcnumber=NULL,
      cobmisc_invchead_id=NULL
  WHERE (cobmisc_invchead_id=_p.invchead_id);

--  Mark the invoice as voided
  UPDATE invchead
  SET invchead_void=TRUE,
      invchead_notes=(invchead_notes || 'Voided on ' || current_date || ' by ' || getEffectiveXtUser())
  WHERE (invchead_id=_p.invchead_id);
 
  RETURN _itemlocSeries;

END;
$$ LANGUAGE plpgsql;
