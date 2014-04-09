CREATE OR REPLACE FUNCTION deleteGlSeries(INTEGER, TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSequence ALIAS FOR $1;
  pNotes ALIAS FOR $2;
  _trialbalid INTEGER;
  _count INTEGER;
  _r RECORD;

BEGIN

--  March through all of the G/L Transactions for the passed sequence
  FOR _r IN SELECT gltrans_id, gltrans_date, gltrans_accnt_id, gltrans_amount, gltrans_posted, gltrans_rec,
                   accnt_forwardupdate, period_id, period_closed, period_freeze
            FROM accnt, gltrans LEFT OUTER JOIN period ON (gltrans_date BETWEEN period_start AND period_end)
            WHERE ( (gltrans_accnt_id=accnt_id)
             AND (NOT gltrans_deleted)
             AND (gltrans_sequence=pSequence) ) LOOP

--  If we can post into a Trial Balance, do so
    IF ( (NOT _r.period_closed) AND 
       ( (NOT _r.period_freeze) OR (checkPrivilege('PostFrozenPeriod')) ) AND
       (  NOT _r.gltrans_rec) AND
       ( _r.gltrans_posted ) ) THEN

--  Try to find an existing trialbal
      SELECT trialbal_id INTO _trialbalid
      FROM trialbal
      WHERE ( (trialbal_period_id=_r.period_id)
       AND (trialbal_accnt_id=_r.gltrans_accnt_id) );

      GET DIAGNOSTICS _count = ROW_COUNT;
      IF (_count > 0) THEN

--  We found a trialbal, update it with the G/L Transaction
--  Note - two stage update to avoid any funny value caching logic
        IF (_r.gltrans_amount > 0) THEN
          UPDATE trialbal
          SET trialbal_credits = (trialbal_credits - _r.gltrans_amount)
          WHERE (trialbal_id=_trialbalid);
        ELSE
          UPDATE trialbal
          SET trialbal_debits = (trialbal_debits - (_r.gltrans_amount * -1))
          WHERE (trialbal_id=_trialbalid);
        END IF;

        UPDATE trialbal
        SET trialbal_ending = (trialbal_beginning - trialbal_debits + trialbal_credits),
            trialbal_dirty=TRUE
        WHERE (trialbal_id=_trialbalid);

      ELSE
        RAISE EXCEPTION 'Can not delete G/L Series.  Trial balance record not found.';
      END IF;

--  Forward update if we should
      IF (_r.accnt_forwardupdate AND fetchmetricbool('ManualForwardUpdate')) THEN
        PERFORM forwardUpdateTrialBalance(_trialbalid);
      END IF;

--  Delete any bank reconciliation records if this was marked cleared but non reconciled
    DELETE FROM bankrecitem
    WHERE ((bankrecitem_source='GL')
    AND (bankrecitem_source_id=_r.gltrans_id));

--  Unflag any journals as posted as a result of this series
    UPDATE sltrans SET
      sltrans_posted=false,
      sltrans_gltrans_journalnumber=null
    FROM gltrans
    WHERE ((gltrans_sequence=pSequence)
    AND (sltrans_gltrans_journalnumber=gltrans_journalnumber));
    
--  Mark the G/L Transaction as deleted
      UPDATE gltrans SET
        gltrans_posted=false,
        gltrans_deleted=true,
        gltrans_notes=gltrans_notes || E'\n' || pNotes
      WHERE (gltrans_id=_r.gltrans_id);

    ELSIF (_r.period_freeze) THEN
        RAISE EXCEPTION 'Can not delete a G/L Transaction in a frozen period';
    ELSIF (_r.period_closed) THEN
        RAISE EXCEPTION 'Can not delete a G/L Transaction on account % in a closed period', formatGlAccount(_r.gltrans_accnt_id);
    ELSIF (_r.gltrans_rec) THEN
        RAISE EXCEPTION 'Can not delete a G/L Transaction that has been reconciled';
    ELSIF (NOT _r.gltrans_posted) THEN
        RAISE EXCEPTION 'Can not delete a G/L Transaction that has not been posted to Trial Balance';
    END IF;

  END LOOP;

  RETURN true;

END;
$$ LANGUAGE 'plpgsql';
