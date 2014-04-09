
CREATE OR REPLACE FUNCTION postBankAdjustment(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankadjid ALIAS FOR $1;
  _sequence INTEGER;
  _r RECORD;

BEGIN

--  Post the G/L transaction
  SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'), 'G/L', 'AD',
                              bankadj_docnumber, (bankadjtype_name || '-' || bankadj_notes),
                              bankadjtype_accnt_id, bankaccnt_accnt_id, bankadj_id,
                              round(currToBase(bankaccnt_curr_id,
                                         CASE WHEN(bankadjtype_iscredit) THEN
                                             (bankadj_amount * -1)
                                         ELSE bankadj_amount END,
                                         bankadj_date), 2),
                              bankadj_date, TRUE, TRUE ) INTO _sequence
    FROM bankadj, bankaccnt, bankadjtype
   WHERE ( (bankadj_bankaccnt_id=bankaccnt_id)
     AND   (bankadj_bankadjtype_id=bankadjtype_id)
     AND   (NOT bankadj_posted)
     AND   (bankadj_id=pBankadjid) );
  IF ( NOT FOUND ) THEN
    RETURN -1;
  END IF;

  IF (_sequence >= 0) THEN
--  Update the bankadj record with this sequence and mark it posted
    UPDATE bankadj
       SET bankadj_sequence = _sequence,
           bankadj_posted = TRUE
     WHERE bankadj_id=pBankadjid;
  END IF;

  RETURN _sequence;

END;
$$ LANGUAGE plpgsql;

