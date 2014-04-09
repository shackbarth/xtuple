
CREATE OR REPLACE FUNCTION createARCashDeposit(INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pDocNumber ALIAS FOR $2;
  pOrderNumber ALIAS FOR $3;
  pDocDate ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  pNotes ALIAS FOR $6;
  pJournalNumber ALIAS FOR $7;
  pCurrId ALIAS FOR $8;
  _prepaidaccntid INTEGER;
  _deferredaccntid INTEGER;
  _glSequence INTEGER;
  _aropenid INTEGER;

BEGIN

  IF (pAmount <= 0) THEN
    RETURN 0;
  END IF;

  _prepaidaccntid := findPrepaidAccount(pCustid);
  IF (_prepaidaccntid = -1) THEN
    RAISE EXCEPTION 'There was an error creating the Customer Deposit GL Transactions. No Prepaid Account is assigned.';
  END IF;

  _deferredaccntid := findDeferredAccount(pCustid);
  IF (_deferredaccntid = -1) THEN
    RAISE EXCEPTION 'There was an error creating the Customer Deposit GL Transactions. No Deferred Account is assigned.';
  END IF;

  SELECT NEXTVAL('aropen_aropen_id_seq') INTO _aropenid;

  SELECT insertGLTransaction( pJournalNumber, 'A/R', 'CD',
                              pDocNumber, pNotes, _deferredaccntid, _prepaidaccntid,
                              _aropenid,
                              round(currToBase(pCurrId, pAmount, pDocDate), 2),
                              pDocDate) INTO _glSequence;

  INSERT INTO aropen
  ( aropen_id, aropen_username, aropen_journalnumber,
    aropen_cust_id, aropen_docnumber, aropen_doctype, aropen_ordernumber,
    aropen_docdate, aropen_duedate, aropen_distdate, aropen_terms_id, aropen_salesrep_id,
    aropen_amount, aropen_paid, aropen_commission_due, aropen_commission_paid,
    aropen_applyto, aropen_ponumber, aropen_cobmisc_id,
    aropen_open, aropen_notes, aropen_rsncode_id,
    aropen_salescat_id, aropen_accnt_id, aropen_curr_id )
  VALUES
  ( _aropenid, getEffectiveXtUser(), pJournalNumber,
    pCustid, pDocNumber, 'R', pOrderNumber,
    pDocDate, pDocDate, pDocDate, -1, NULL,
    round(pAmount, 2), 0, 0.0, FALSE,
    '', '', -1,
    TRUE, pNotes, -1,
    -1, -1, pCurrId );

  RETURN _aropenid;

END;
$$ LANGUAGE 'plpgsql';

