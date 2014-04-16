CREATE OR REPLACE FUNCTION voidPostedCheck(INTEGER, INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCheckid		ALIAS FOR $1;
  pJournalNumber	ALIAS FOR $2;
  pVoidDate		ALIAS FOR $3;
  _amount_base		NUMERIC := 0;
  _result               INTEGER;
  _apopenid		INTEGER;
  _credit_glaccnt	INTEGER;
  _docnumber		TEXT;
  _exchGain		NUMERIC := 0;
  _exchGainTmp		NUMERIC := 0;
  _gltransNote		TEXT;
  _p			RECORD;
  _r			RECORD;
  _sequence		INTEGER;
  _amount_check         NUMERIC := 0;

BEGIN

  SELECT fetchGLSequence() INTO _sequence;

  SELECT checkhead.*,
         checkhead_amount / checkhead_curr_rate AS checkhead_amount_base,
         bankaccnt_accnt_id AS bankaccntid,
         findPrepaidAccount(checkhead_recip_id) AS prepaidaccntid,
	 checkrecip.* INTO _p
  FROM bankaccnt, checkhead LEFT OUTER JOIN
       checkrecip ON ((checkrecip_type=checkhead_recip_type)
		  AND (checkrecip_id=checkhead_recip_id))
  WHERE ((checkhead_bankaccnt_id=bankaccnt_id)
    AND  (checkhead_id=pCheckid));

  IF (NOT _p.checkhead_posted) THEN
    RETURN -10;
  END IF;

  IF (_p.checkrecip_id IS NULL) THEN	-- outer join failed
    RETURN -11;
  END IF;

  -- Cannot void if already reconciled
  SELECT trans_id INTO _result
  FROM ( SELECT gltrans_id AS trans_id
         FROM gltrans
              LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='GL' AND bankrecitem_source_id=gltrans_id)
         WHERE ( (gltrans_doctype='CK')
           AND   (gltrans_misc_id=_p.checkhead_id)
           AND   ((gltrans_rec) OR (bankrecitem_id IS NOT NULL)) )
         UNION ALL
         SELECT sltrans_id AS trans_id
         FROM sltrans
              LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='GL' AND bankrecitem_source_id=sltrans_id)
         WHERE ( (sltrans_doctype='CK')
           AND   (sltrans_misc_id=_p.checkhead_id)
           AND   ((sltrans_rec) OR (bankrecitem_id IS NOT NULL)) )
       ) AS data;
  IF (FOUND) THEN
    RETURN -14;
  END IF;

  _gltransNote := 'Void Posted Check #' || _p.checkhead_number || ' ' ||
		  _p.checkrecip_number || '-' || _p.checkrecip_name;

  IF (_p.checkhead_misc) THEN
    IF (COALESCE(_p.checkhead_expcat_id, -1) < 0) THEN
      IF (_p.checkhead_recip_type = 'V') THEN
	PERFORM createAPDebitMemo(_p.checkhead_recip_id, pJournalNumber,
				  CAST(fetchAPMemoNumber() AS text), '',
				  pVoidDate, _p.checkhead_amount,
				  _gltransNote || ' '|| _p.checkhead_notes,
				  -1, pVoidDate, -1, _p.checkhead_curr_id );
	_credit_glaccnt := findAPPrepaidAccount(_p.checkhead_recip_id);

      ELSIF (_p.checkhead_recip_type = 'C') THEN
	PERFORM createARCreditMemo(NULL, _p.checkhead_recip_id,
				  fetchARMemoNumber(), '', 
				  pVoidDate, _p.checkhead_amount,
				  _gltransNote || ' '|| _p.checkhead_notes,
				  -1, -1, -1, pVoidDate, -1, NULL, 0.0,
				  pJournalNumber, _p.checkhead_curr_id );
	_credit_glaccnt := _p.prepaidaccntid;

      ELSIF (_p.checkhead_recip_type = 'T') THEN
	-- TODO: should we create a debit memo for the tax authority? how?
	_credit_glaccnt := _p.checkrecip_accnt_id;

      END IF; -- recip type

    ELSE
      SELECT expcat_exp_accnt_id INTO _credit_glaccnt
      FROM expcat
      WHERE (expcat_id=_p.checkhead_expcat_id);
      IF (NOT FOUND) THEN
        RETURN -12;
      END IF;
    END IF;

    IF (COALESCE(_credit_glaccnt, -1) < 0) THEN
      RETURN -13;
    END IF;

    PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source, 'CK',
				text(_p.checkhead_number),
				_credit_glaccnt,
				round(_p.checkhead_amount_base, 2),
				pVoidDate, _gltransNote, pCheckid);

    _amount_base := _p.checkhead_amount_base;

  ELSE
    FOR _r IN SELECT checkitem_amount, checkitem_discount,
                     CASE WHEN (checkitem_apopen_id IS NOT NULL AND apopen_doctype='C') THEN
                            checkitem_amount / apopen_curr_rate * -1.0
                          WHEN (checkitem_apopen_id IS NOT NULL) THEN
                            checkitem_amount / apopen_curr_rate
                          ELSE
                            currToBase(checkitem_curr_id,
                                       checkitem_amount,
                                       COALESCE(checkitem_docdate, _p.checkhead_checkdate)) 
                     END AS checkitem_amount_base,
                     currTocurr(checkitem_curr_id, _p.checkhead_curr_id,
                                CASE WHEN (checkitem_apopen_id IS NOT NULL AND apopen_doctype='C') THEN
                                          checkitem_amount * -1.0
                                     ELSE checkitem_amount END,
                                  _p.checkhead_checkdate) AS amount_check,
                     apopen_id, apopen_doctype, apopen_docnumber, apopen_curr_rate, apopen_docdate,
                     aropen_id, aropen_doctype, aropen_docnumber,
                     checkitem_curr_id, checkitem_curr_rate,
                     COALESCE(checkitem_docdate, _p.checkhead_checkdate) AS docdate
              FROM (checkitem LEFT OUTER JOIN
		    apopen ON (checkitem_apopen_id=apopen_id)) LEFT OUTER JOIN
		    aropen ON (checkitem_aropen_id=aropen_id)
              WHERE (checkitem_checkhead_id=pcheckid) LOOP

      _exchGainTmp := 0;
      IF (_r.apopen_id IS NOT NULL) THEN
	-- undo the APDiscount Credit Memo if a discount was taken
        IF(_r.checkitem_discount > 0) THEN
          SELECT NEXTVAL('apopen_apopen_id_seq') INTO _apopenid;
          SELECT fetchAPMemoNumber() INTO _docnumber;
          INSERT INTO apopen
          ( apopen_id, apopen_username, apopen_journalnumber,
            apopen_vend_id, apopen_docnumber, apopen_doctype, apopen_ponumber,
            apopen_docdate, apopen_duedate, apopen_distdate, apopen_terms_id,
            apopen_amount, apopen_paid, apopen_open,
	    apopen_notes,
	    apopen_accnt_id, apopen_curr_id, apopen_discount, apopen_curr_rate,
            apopen_closedate )
          VALUES
          ( _apopenid, getEffectiveXtUser(), pJournalNumber,
            _p.checkhead_recip_id, _docnumber, 'D', '',
            pVoidDate, pVoidDate, pVoidDate, -1,
            _r.checkitem_discount, _r.checkitem_discount, FALSE,
            ('Reverse Posted Discount ' || _r.apopen_doctype || ' ' ||
	      _r.apopen_docnumber),
	    -1, _p.checkhead_curr_id, TRUE, _r.apopen_curr_rate,
            current_date );


          PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source,
                                      'DS', _r.apopen_docnumber,
                                      findAPDiscountAccount(_p.checkhead_recip_id),
                                      round(_r.checkitem_discount / _r.apopen_curr_rate, 2) * -1,
                                      pVoidDate, _gltransNote, pCheckid);

          PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source,
                                      'DS', _r.apopen_docnumber,
                                      findAPAccount(_p.checkhead_recip_id),
                                      round(_r.checkitem_discount / _r.apopen_curr_rate, 2),
                                      pVoidDate, _gltransNote, pCheckid);

	  --  Post the application
          INSERT INTO apapply
          ( apapply_vend_id, apapply_postdate, apapply_username,
            apapply_source_apopen_id, apapply_source_doctype, apapply_source_docnumber,
            apapply_target_apopen_id, apapply_target_doctype, apapply_target_docnumber,
            apapply_journalnumber, apapply_amount, apapply_curr_id )
          VALUES
          ( _p.checkhead_recip_id, pVoidDate, getEffectiveXtUser(),
            _apopenid, 'D', _docnumber,
            _r.apopen_id, _r.apopen_doctype, _r.apopen_docnumber,
            pJournalNumber, (_r.checkitem_discount * -1), _r.checkitem_curr_id );
        END IF; -- discount was taken

        UPDATE apopen
       SET apopen_paid = round(apopen_paid -
				(_r.checkitem_amount + noNeg(_r.checkitem_discount)), 2),
            apopen_open = round(apopen_amount, 2) >
			  round(apopen_paid -
				(_r.checkitem_amount + noNeg(_r.checkitem_discount)), 2),
            apopen_closedate = CASE WHEN (round(apopen_amount, 2) >
			                  round(apopen_paid -
				           (_r.checkitem_amount + noNeg(_r.checkitem_discount)))) THEN NULL ELSE apopen_closedate END
        WHERE (apopen_id=_r.apopen_id);

	--  Post the application
        INSERT INTO apapply
        ( apapply_vend_id, apapply_postdate, apapply_username,
          apapply_source_apopen_id, apapply_source_doctype, apapply_source_docnumber,
          apapply_target_apopen_id, apapply_target_doctype, apapply_target_docnumber,
          apapply_journalnumber, apapply_amount, apapply_curr_id )
        VALUES
        ( _p.checkhead_recip_id, pVoidDate, getEffectiveXtUser(),
          -1, 'K', _p.checkhead_number,
          _r.apopen_id, _r.apopen_doctype, _r.apopen_docnumber,
          pJournalNumber, (_r.checkitem_amount * -1), _r.checkitem_curr_id );
      END IF; -- if check item's apopen_id is not null

      IF (_r.aropen_id IS NOT NULL) THEN
        UPDATE aropen
        SET aropen_paid = round(aropen_paid -_r.checkitem_amount, 2),
            aropen_open = round(aropen_amount, 2) >
			  round(aropen_paid - _r.checkitem_amount, 2)
        WHERE (aropen_id=_r.aropen_id);

	--  Post the application
        INSERT INTO arapply
        ( arapply_cust_id, arapply_postdate, arapply_distdate, arapply_username,
          arapply_source_aropen_id, arapply_source_doctype, arapply_source_docnumber,
          arapply_target_aropen_id, arapply_target_doctype, arapply_target_docnumber,
          arapply_journalnumber, arapply_applied, arapply_curr_id )
        VALUES
        ( _p.checkhead_recip_id, pVoidDate, pVoidDate, getEffectiveXtUser(),
          -1, 'K', _p.checkhead_number,
          _r.aropen_id, _r.aropen_doctype, _r.aropen_docnumber,
          pJournalNumber, (_r.checkitem_amount * -1), _r.checkitem_curr_id );

      END IF; -- if check item's aropen_id is not null

--  calculate currency gain/loss
      IF (_r.apopen_id IS NOT NULL) THEN
        IF (_p.checkhead_curr_id = _r.checkitem_curr_id) THEN
          IF (_r.apopen_docdate > _p.checkhead_checkdate) THEN
            _exchGainTmp := ((_r.checkitem_amount/_p.checkhead_curr_rate) - (_r.checkitem_amount / _r.apopen_curr_rate)) * -1;
          ELSE
            _exchGainTmp := ((_r.checkitem_amount / _r.apopen_curr_rate) - (_r.checkitem_amount/_p.checkhead_curr_rate));
          END IF;
        ELSE
          -- unusual condition where bank overridden and different currency from voucher
          -- this does not work for all situations
          --IF (_r.apopen_docdate > _p.checkhead_checkdate) THEN
          --  _exchGainTmp := ((_r.checkitem_amount/_r.checkitem_curr_rate) - (_r.checkitem_amount / _r.apopen_curr_rate)) * -1;
          --ELSE
          --  _exchGainTmp := ((_r.checkitem_amount / _r.apopen_curr_rate) - (_r.checkitem_amount/_r.checkitem_curr_rate));
          --END IF;
          _exchGainTmp := 0.0;
        END IF;
      ELSE
        SELECT arCurrGain(_r.aropen_id,_r.checkitem_curr_id, _r.checkitem_amount,
                        _p.checkhead_checkdate)
              INTO _exchGainTmp;
      END IF;
      _exchGain := _exchGain + _exchGainTmp;

      PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source,
				  'CK', text(_p.checkhead_number),
                                  _p.checkrecip_accnt_id,
                                  round(_r.checkitem_amount_base, 2),
                                  pVoidDate, _gltransNote, pCheckid);
      IF (_exchGainTmp <> 0) THEN
          PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source,
				      'CK', text(_p.checkhead_number),
				      getGainLossAccntId(_p.checkrecip_accnt_id),
				      round(_exchGainTmp, 2) * -1,
				      pVoidDate, _gltransNote, pCheckid);
      END IF;

      _amount_check := (_amount_check + _r.amount_check);
      _amount_base := (_amount_base + _r.checkitem_amount_base);

    END LOOP;

    IF( (_amount_check - _p.checkhead_amount) <> 0.0 ) THEN 
      _exchGainTmp :=  (_amount_check - _p.checkhead_amount) / _p.checkhead_curr_rate;
      _exchGain := _exchGain + _exchGainTmp;
    END IF;

    --  ensure that the check balances, attribute rounding errors to gain/loss
    IF round(_amount_base, 2) - round(_exchGain, 2) <> round(_p.checkhead_amount_base, 2) THEN
      IF round(_amount_base - _exchGain, 2) = round(_p.checkhead_amount_base, 2) THEN
	PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source,
				    'CK',
				    text(_p.checkhead_number), getGainLossAccntId(_p.bankaccntid),
				    (round(_amount_base, 2) -
				     round(_exchGain, 2) -
				     round(_p.checkhead_amount_base, 2)) * -1,
				    pVoidDate, _gltransNote, pCheckid);
      ELSE
	RAISE EXCEPTION 'checkhead_id % does not balance (% - % <> %)', pCheckid,
	      _amount_base, _exchGain, _p.checkhead_amount_base;
      END IF;
    END IF;
  END IF;

  PERFORM insertIntoGLSeries( _sequence, _p.checkrecip_gltrans_source, 'CK',
			      text(_p.checkhead_number),
                              _p.bankaccntid,
			      round(_p.checkhead_amount_base, 2) * -1,
                              pVoidDate, _gltransNote, pCheckid);

  PERFORM postGLSeries(_sequence, pJournalNumber);

  UPDATE gltrans
     SET gltrans_misc_id=pCheckid
   WHERE gltrans_sequence=_sequence;

  UPDATE checkhead
  SET checkhead_posted=false,
      checkhead_void=true,
      checkhead_journalnumber=pJournalNumber
  WHERE (checkhead_id=pCheckid);

  RETURN pJournalNumber;

END;
$$ LANGUAGE 'plpgsql';
