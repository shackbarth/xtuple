
CREATE OR REPLACE FUNCTION _periodAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _idoffirst INTEGER;
  _test      INTEGER;
BEGIN
  -- This trigger can easily cause an infinite loop
  -- because of this we have to be very careful to not
  -- do an update on the period table if no updates
  -- are absolutely needed so we don't just keep
  -- trigger ourselves again and again

  -- Figure out which period is the first one
  SELECT period_id
    INTO _idoffirst
    FROM period
   ORDER BY period_start
   LIMIT 1;

  -- If we didn't find anything there is nothing to do
  IF( NOT FOUND ) THEN
    RETURN NEW;
  END IF;

  -- do a select to see if there is at least one record that needs to be
  -- updated. If we do not find any then we can just leave without
  -- causing a retrigger of ourselves
  SELECT period_id
    INTO _test
    FROM period
   WHERE((COALESCE(period_initial, true) AND (NOT period_id=_idoffirst))
      OR ((NOT COALESCE(period_initial, false)) AND (period_id=_idoffirst)))
   LIMIT 1;

  -- Nothing to update - get out of here
  IF( NOT FOUND ) THEN
    RETURN NEW;
  END IF;

  -- Update all the period records that already have the initial flag
  -- set and the one that we know should be the first.
  -- We don't have to be as careful here since we have already ruled
  -- out if don't need to update already.
  UPDATE period
     SET period_initial = (_idoffirst=period_id)
   WHERE((COALESCE(period_initial, true))
      OR (period_id=_idoffirst));

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'periodAfterTrigger');
CREATE TRIGGER periodAfterTrigger AFTER INSERT OR UPDATE OR DELETE ON period FOR EACH STATEMENT EXECUTE PROCEDURE _periodAfterTrigger();

