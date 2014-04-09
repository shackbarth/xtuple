
CREATE OR REPLACE FUNCTION postIntoTrialBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  _trialbalid INTEGER;
  _r RECORD;

BEGIN

--  March through all of the G/L Transactions for the passed sequence that are not posted
  FOR _r IN SELECT gltrans_id, gltrans_date, gltrans_accnt_id, gltrans_amount,
                   accnt_forwardupdate, period_id, period_closed, period_freeze
            FROM accnt, gltrans LEFT OUTER JOIN period ON (gltrans_date BETWEEN period_start AND period_end)
            WHERE ( (gltrans_accnt_id=accnt_id)
             AND (NOT gltrans_posted)
             AND (NOT gltrans_deleted)
             AND (gltrans_sequence=pSequence) ) LOOP

--  If we can post into a Trial Balance, do so
    IF ( (NOT _r.period_closed) AND ( (NOT _r.period_freeze) OR (checkPrivilege('PostFrozenPeriod')) ) ) THEN

--  Try to find an existing trialbal
      SELECT trialbal_id INTO _trialbalid
      FROM trialbal
      WHERE ( (trialbal_period_id=_r.period_id)
       AND (trialbal_accnt_id=_r.gltrans_accnt_id) );
      IF (FOUND) THEN

--  We found a trialbal, update it with the G/L Transaction
--  Note - two stage update to avoid any funny value caching logic
        IF (_r.gltrans_amount > 0) THEN
          UPDATE trialbal
          SET trialbal_credits = (trialbal_credits + _r.gltrans_amount)
          WHERE (trialbal_id=_trialbalid);
        ELSE
          UPDATE trialbal
          SET trialbal_debits = (trialbal_debits + (_r.gltrans_amount * -1))
          WHERE (trialbal_id=_trialbalid);
        END IF;

        UPDATE trialbal
        SET trialbal_ending = (trialbal_beginning - trialbal_debits + trialbal_credits),
            trialbal_dirty=TRUE
        WHERE (trialbal_id=_trialbalid);
      ELSE

--  No existing trialbal, make one
        SELECT NEXTVAL('trialbal_trialbal_id_seq') INTO _trialbalid;
        INSERT INTO trialbal
        ( trialbal_id, trialbal_accnt_id, trialbal_period_id,
          trialbal_beginning, trialbal_dirty,
          trialbal_ending,
          trialbal_credits,
          trialbal_debits )
        VALUES
        ( _trialbalid, _r.gltrans_accnt_id, _r.period_id,
          0, TRUE,
          _r.gltrans_amount,
          CASE WHEN (_r.gltrans_amount > 0) THEN _r.gltrans_amount
               ELSE 0
          END,
          CASE WHEN (_r.gltrans_amount < 0) THEN (_r.gltrans_amount * -1)
               ELSE 0
          END );
      END IF;

--  Forward update if we should
      IF (_r.accnt_forwardupdate AND fetchmetricbool('ManualForwardUpdate')) THEN
        PERFORM forwardUpdateTrialBalance(_trialbalid);
      END IF;

--  Mark the G/L Transaction as posted
      UPDATE gltrans
      SET gltrans_posted=TRUE
      WHERE (gltrans_id=_r.gltrans_id);

    END IF;

  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

