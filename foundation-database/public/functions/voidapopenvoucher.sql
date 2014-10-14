CREATE OR REPLACE FUNCTION voidApopenVoucher(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
BEGIN
  RETURN voidApopenVoucher(pApopenid, fetchJournalNumber('AP-VO'));
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION voidApopenVoucher(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  _apopenid INTEGER;
  _apcreditapplyid INTEGER;
  _reference    TEXT;
  _result INTEGER;
  _sequence INTEGER;
  _totalAmount_base NUMERIC;
  _totalAmount NUMERIC;
  _itemAmount_base NUMERIC;
  _itemAmount NUMERIC;
  _test INTEGER;
  _a RECORD;
  _d RECORD;
  _g RECORD;
  _p RECORD;
  _n RECORD;
  _r RECORD;
  _costx RECORD;
  _pExplain BOOLEAN;
  _pLowLevel BOOLEAN;
  _exchGainFreight NUMERIC;
  _firstExchDateFreight	DATE;
  _tmpTotal		NUMERIC;
  _glDate		DATE;

BEGIN

  _totalAmount_base := 0;
  _totalAmount := 0;
  SELECT fetchGLSequence() INTO _sequence;

--  Cache APOpen Information
  SELECT apopen.* INTO _n
  FROM apopen
  WHERE ( (apopen_doctype='V')
    AND   (apopen_id=pApopenid) );
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Voucher Id % as apopen not found [xtuple: voidAPOpenVoucher, -10, %]',
			pApopenid, pApopenid;
  END IF;

--  Cache Voucher Infomation
  SELECT vohead.*,
	 vend_number || '-' || vend_name || ' ' || vohead_reference
							  AS glnotes,
	 COALESCE(pohead_orderdate, vohead_docdate) AS pohead_orderdate,
	 COALESCE(pohead_curr_id, vohead_curr_id) AS pohead_curr_id INTO _p
  FROM vohead JOIN vendinfo ON (vend_id=vohead_vend_id)
              LEFT OUTER JOIN pohead ON (vohead_pohead_id = pohead_id)
  WHERE (vohead_number=_n.apopen_docnumber);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Voucher #% as vohead not found [xtuple: voidAPOpenVoucher, -20, %]',
			_n.apopen_docnumber, _n.apopen_docnumber;
  END IF;

--  Check for APApplications
  SELECT apapply_id INTO _test
  FROM apapply
  WHERE (apapply_target_apopen_id=_n.apopen_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Voucher #% as applications exist [xtuple: voidAPOpenVoucher, -30, %]',
			_n.apopen_docnumber, _n.apopen_docnumber;
  END IF;

  _glDate := COALESCE(_p.vohead_gldistdate, _p.vohead_distdate);

-- there is no currency gain/loss on items, see issue 3892,
-- but there might be on freight, which is first encountered at p/o receipt
  SELECT recv_date::DATE INTO _firstExchDateFreight
  FROM recv
  WHERE (recv_vohead_id = _p.vohead_id);

--  Start by handling taxes
  FOR _r IN SELECT tax_sales_accnt_id, 
              round(sum(taxdetail_tax),2) AS tax,
              currToBase(_p.vohead_curr_id, round(sum(taxdetail_tax),2), _p.vohead_docdate) AS taxbasevalue
            FROM tax 
             JOIN calculateTaxDetailSummary('VO', _p.vohead_id, 'T') ON (taxdetail_tax_id=tax_id)
	    GROUP BY tax_id, tax_sales_accnt_id LOOP

    PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', _p.vohead_number,
                                _r.tax_sales_accnt_id, 
                                (_r.taxbasevalue * -1),
                                _glDate, _p.glnotes );

    _totalAmount_base := (_totalAmount_base - _r.taxbasevalue);
    _totalAmount := (_totalAmount - _r.tax);
     
  END LOOP;

--  Loop through the vodist records for the passed vohead that
--  are posted against a P/O Item
  FOR _g IN SELECT DISTINCT poitem_id, voitem_qty, poitem_expcat_id,
                            poitem_invvenduomratio,
                            COALESCE(itemsite_id, -1) AS itemsiteid,
                            COALESCE(itemsite_costcat_id, -1) AS costcatid,
                            COALESCE(itemsite_item_id, -1) AS itemsite_item_id,
                            (SELECT SUM(value) 
                             FROM (
                                SELECT SUM(recv_value) AS value
                                FROM recv
                                WHERE (recv_voitem_id=voitem_id)
                             UNION
                                SELECT SUM(poreject_value)*-1 AS value
                                FROM poreject
                                WHERE (poreject_voitem_id=voitem_id)) as data)
                            AS value_base,
                            (poitem_freight_vouchered / poitem_qty_vouchered) * voitem_qty AS vouchered_freight,
                            currToBase(_p.pohead_curr_id, (poitem_freight_vouchered / poitem_qty_vouchered) * voitem_qty, _firstExchDateFreight ) AS vouchered_freight_base,
			    voitem_freight,
			    currToBase(_p.vohead_curr_id, voitem_freight,
                                       _p.vohead_distdate) AS voitem_freight_base
            FROM vodist, voitem,
                 poitem LEFT OUTER JOIN itemsite ON (poitem_itemsite_id=itemsite_id)
            WHERE ( (vodist_poitem_id=poitem_id)
             AND (voitem_poitem_id=poitem_id)
             AND (voitem_vohead_id=vodist_vohead_id)
             AND (vodist_vohead_id=_p.vohead_id)) LOOP

--  Grab the G/L Accounts
    IF (_g.costcatid = -1) THEN
      SELECT pp.accnt_id AS pp_accnt_id,
             lb.accnt_id AS lb_accnt_id INTO _a
      FROM expcat, accnt AS pp, accnt AS lb
      WHERE ( (expcat_purchprice_accnt_id=pp.accnt_id)
       AND (expcat_liability_accnt_id=lb.accnt_id)
       AND (expcat_id=_g.poitem_expcat_id) );
      IF (NOT FOUND) THEN
        RAISE EXCEPTION 'Cannot Void Voucher #% due to unassigned G/L Accounts [xtuple: voidAPOpenVoucher, -40, %]',
			_p.vohead_number, _p.vohead_number;
      END IF;
    ELSE
      SELECT pp.accnt_id AS pp_accnt_id,
             lb.accnt_id AS lb_accnt_id INTO _a
      FROM costcat, accnt AS pp, accnt AS lb
      WHERE ( (costcat_purchprice_accnt_id=pp.accnt_id)
       AND (costcat_liability_accnt_id=lb.accnt_id)
       AND (costcat_id=_g.costcatid) );
      IF (NOT FOUND) THEN
        RAISE EXCEPTION 'Cannot Void Voucher #% due to unassigned G/L Accounts [xtuple: voidAPOpenVoucher, -50, %]',
			_p.vohead_number, _p.vohead_number;
      END IF;
    END IF;

--  Clear the Item Amount accumulator
    _itemAmount_base := 0;
    _itemAmount := 0;

--  Figure out the total posted value for this line item
    FOR _d IN SELECT vodist_id, vodist_amount,
		     _p.vohead_curr_id, vodist_costelem_id,
		     currToBase(_p.vohead_curr_id, vodist_amount,
				_p.vohead_distdate) AS vodist_amount_base
              FROM vodist
              WHERE ( (vodist_vohead_id=_p.vohead_id)
               AND (vodist_poitem_id=_g.poitem_id) ) LOOP

       _pExplain := TRUE;
       SELECT * INTO _costx
         FROM itemcost
        WHERE ( (itemcost_item_id = _g.itemsite_item_id)
          AND   (itemcost_costelem_id = _d.vodist_costelem_id) );

       IF (FOUND) THEN
         _pExplain := _costx.itemcost_lowlevel;
       END IF;

--  Add the Distribution Amount to the Item Amount
      _itemAmount_base := _itemAmount_base + ROUND(_d.vodist_amount_base, 2);
      _itemAmount := _itemAmount + _d.vodist_amount;

    END LOOP;

--  Distribute from the clearing account
    PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', text(_p.vohead_number),
                                _a.lb_accnt_id,
                                round(_g.value_base + _g.vouchered_freight_base, 2),
                                _glDate, _p.glnotes );

--  Attribute the correct portion to currency gain/loss
    _exchGainFreight := 0;
    SELECT currGain(_p.pohead_curr_id, _g.vouchered_freight,
		    _firstExchDateFreight, _p.vohead_distdate )
		    INTO _exchGainFreight;
    IF (round(_exchGainFreight, 2) <> 0) THEN
      PERFORM insertIntoGLSeries(_sequence, 'A/P', 'VO',
                                 text(_p.vohead_number),
                                 getGainLossAccntId(_a.lb_accnt_id), round(_exchGainFreight, 2) * -1,
                                 _glDate, _p.glnotes);
    END IF;

--  Distribute the remaining variance to the Purchase Price Variance account
    IF (round(_itemAmount_base, 2) <> round(_g.value_base, 2)) THEN
      _tmpTotal := round(_itemAmount_base, 2) - round(_g.value_base, 2);
      PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', text(_p.vohead_number),
                                  _a.pp_accnt_id,
                                  _tmpTotal,
                                  _glDate, _p.glnotes );
    END IF;

--  Distribute the remaining freight variance to the Purchase Price Variance account
    IF (round(_g.voitem_freight_base + _exchGainFreight, 2) <> round(_g.vouchered_freight_base, 2)) THEN
      _tmpTotal := round(_g.voitem_freight_base + _exchGainFreight, 2) - round(_g.vouchered_freight_base, 2);
      PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', text(_p.vohead_number),
                                  _a.pp_accnt_id,
                                  _tmpTotal,
                                  _glDate, _p.glnotes );
    END IF;

--  Add the distribution amount to the total amount to distribute
    _totalAmount_base := (_totalAmount_base + _itemAmount_base + _g.voitem_freight_base);
    _totalAmount := (_totalAmount + _itemAmount + _g.voitem_freight);

--  Reverse the posting for all the Tagged Receivings for this P/O Item
    UPDATE recv
    SET recv_invoiced=FALSE,
        recv_recvcost_curr_id=basecurrid(),
        recv_recvcost=0,
        recv_vohead_id=NULL,
        recv_voitem_id=NULL
    FROM poitem
    WHERE ( (recv_orderitem_id=poitem_id)
      AND   (recv_order_type='PO')
      AND   (recv_orderitem_id=_g.poitem_id)
      AND   (recv_vohead_id=_p.vohead_id) );

--  Reverse the posting for all the Tagged Rejections for this P/O Item
    UPDATE poreject
    SET poreject_invoiced=FALSE,
        poreject_vohead_id=NULL,
        poreject_voitem_id=NULL
    WHERE ( (poreject_poitem_id=_g.poitem_id)
      AND   (poreject_vohead_id=_p.vohead_id) );

--  Update the qty and freight vouchered fields
    UPDATE poitem
       SET poitem_qty_vouchered = (poitem_qty_vouchered - _g.voitem_qty),
           poitem_freight_vouchered = (poitem_freight_vouchered - _g.voitem_freight)
    WHERE (poitem_id=_g.poitem_id);

  END LOOP;

--  Loop through the vodist records for the passed vohead that
--  are not posted against a P/O Item
--  Skip the tax distributions
  FOR _d IN SELECT vodist_id,
		   currToBase(_p.vohead_curr_id, vodist_amount,
			      _p.vohead_distdate) AS vodist_amount_base,
		   vodist_amount,
		   vodist_accnt_id, vodist_expcat_id
            FROM vodist
            WHERE ( (vodist_vohead_id=_p.vohead_id)
              AND   (vodist_poitem_id=-1)
              AND   (vodist_tax_id=-1) ) LOOP

--  Distribute from the misc. account
    IF (_d.vodist_accnt_id = -1) THEN
      PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', text(_p.vohead_number),
                                  expcat_exp_accnt_id,
                                  round(_d.vodist_amount_base, 2),
                                  _glDate, _p.glnotes )
      FROM expcat
      WHERE (expcat_id=_d.vodist_expcat_id);
    ELSE
      PERFORM insertIntoGLSeries( _sequence, 'A/P', 'VO', text(_p.vohead_number),
                                  _d.vodist_accnt_id,
                                  round(_d.vodist_amount_base, 2),
                                  _glDate, _p.glnotes );
    END IF;

--  Add the Distribution Amount to the Total Amount
    _totalAmount_base := _totalAmount_base + ROUND(_d.vodist_amount_base, 2);
    _totalAmount := _totalAmount + _d.vodist_amount;

  END LOOP;

  SELECT insertIntoGLSeries( _sequence, 'A/P', 'VO', text(vohead_number),
                             accnt_id, round(_totalAmount_base, 2) * -1,
                             _glDate, _p.glnotes ) INTO _test
  FROM vohead LEFT OUTER JOIN accnt ON (accnt_id=findAPAccount(vohead_vend_id))
  WHERE ( (findAPAccount(vohead_vend_id)=0 OR accnt_id > 0) -- G/L interface might be disabled
    AND   (vohead_id=_p.vohead_id) );
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot Void Voucher #% due to an unassigned A/P Account [xtuple: voidAPOpenVoucher, -60, %]',
			_p.vohead_number, _p.vohead_number;
  END IF;

  PERFORM postGLSeries(_sequence, pJournalNumber);

--  Create the A/P Open Item
  SELECT NEXTVAL('apopen_apopen_id_seq') INTO _apopenid;
  _reference := ('Void Voucher #' || _n.apopen_docnumber);
  INSERT INTO apopen
  ( apopen_id, apopen_username, apopen_journalnumber,
    apopen_vend_id, apopen_docnumber, apopen_doctype, apopen_ponumber,
    apopen_docdate, apopen_duedate, apopen_distdate, apopen_terms_id, apopen_curr_id,
    apopen_amount, apopen_paid, apopen_open, apopen_notes, apopen_discount, apopen_curr_rate )
  SELECT _apopenid, getEffectiveXtUser(), pJournalnumber,
         apopen_vend_id, apopen_docnumber, 'C', apopen_ponumber,
         _glDate, _glDate, _glDate, -1, apopen_curr_id,
         apopen_amount - apopen_paid, 0, TRUE, _reference, TRUE, apopen_curr_rate
    FROM apopen
   WHERE (apopen_id=_n.apopen_id);

  SELECT apcreditapply_id INTO _apcreditapplyid
    FROM apcreditapply
   WHERE ( (apcreditapply_source_apopen_id=_apopenid)
     AND   (apcreditapply_target_apopen_id=_n.apopen_id) );
  IF (FOUND) THEN
    UPDATE apcreditapply
       SET apcreditapply_amount=_n.apopen_amount-_n.apopen_paid
     WHERE (apcreditapply_id=_apcreditapplyid);
  ELSE
    SELECT nextval('apcreditapply_apcreditapply_id_seq') INTO _apcreditapplyid;
    INSERT INTO apcreditapply
           ( apcreditapply_id, apcreditapply_source_apopen_id,
             apcreditapply_target_apopen_id, apcreditapply_amount,
             apcreditapply_curr_id )
    VALUES ( _apcreditapplyid, _apopenid, _n.apopen_id, _n.apopen_amount-_n.apopen_paid, _n.apopen_curr_id );
  END IF;

  SELECT postAPCreditMemoApplication(_apopenid) INTO _result;

  IF (_result < 0) THEN
    RAISE EXCEPTION 'Credit application failed with result % [xtuple: voidAPOpenVoucher, -70, %]',
			_result, _result;
  END IF;

--  Reopen all of the P/O Items that were closed by this Voucher
  UPDATE poitem
  SET poitem_status='O'
  FROM voitem
  WHERE ( (voitem_poitem_id=poitem_id)
    AND   (voitem_close)
    AND   (voitem_vohead_id=_p.vohead_id) );

--  Reopen the P/O
  UPDATE pohead
  SET pohead_status='O'
  WHERE (pohead_id=_p.vohead_pohead_id);

--  Mark as voided
  UPDATE apopen
  SET apopen_void=TRUE
  WHERE (apopen_id=_n.apopen_id);

  RETURN pJournalNumber;

END;
$$ LANGUAGE 'plpgsql';
