CREATE OR REPLACE FUNCTION _itemCostTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  --Privilege Checks
  IF ( (TG_OP = 'INSERT') AND (NOT checkPrivilege('CreateCosts')) AND (NOT checkPrivilege('PostVouchers')) ) THEN
    RAISE EXCEPTION 'You do not have privileges to enter Item Costs.';
  END IF;

  IF ( (TG_OP = 'UPDATE') AND (NOT checkPrivilege('EnterActualCosts')) AND (NOT checkPrivilege('PostVouchers')) AND (NOT checkPrivilege('UpdateActualCosts')) AND (NOT checkPrivilege('PostActualCosts')) AND (NOT checkPrivilege('PostStandardCosts')) ) THEN
    RAISE EXCEPTION 'You do not have privileges to update Item Costs.';
  END IF;

  IF ( (TG_OP = 'DELETE') AND (NOT checkPrivilege('DeleteCosts')) ) THEN
    RAISE EXCEPTION 'You do not have privileges to delete Item Costs.';
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.itemcost_actcost <> OLD.itemcost_actcost OR
        NEW.itemcost_curr_id <> OLD.itemcost_curr_id) THEN
      INSERT INTO costhist
      ( costhist_item_id, costhist_costelem_id, costhist_type,
        costhist_lowlevel, costhist_username, costhist_date,
        costhist_oldcost, costhist_newcost,
        costhist_oldcurr_id, costhist_newcurr_id )
      VALUES
      ( NEW.itemcost_item_id, NEW.itemcost_costelem_id, 'A',
        NEW.itemcost_lowlevel, getEffectiveXtUser(), CURRENT_TIMESTAMP,
        OLD.itemcost_actcost, NEW.itemcost_actcost,
        OLD.itemcost_curr_id, NEW.itemcost_curr_id );
    END IF;

    IF (NEW.itemcost_stdcost <> OLD.itemcost_stdcost) THEN
      INSERT INTO costhist
      ( costhist_item_id, costhist_costelem_id, costhist_type,
        costhist_lowlevel, costhist_username, costhist_date,
        costhist_oldcost, costhist_newcost,
        costhist_oldcurr_id, costhist_newcurr_id )
      VALUES
      ( NEW.itemcost_item_id, NEW.itemcost_costelem_id, 'S',
        NEW.itemcost_lowlevel, getEffectiveXtUser(), CURRENT_TIMESTAMP,
        OLD.itemcost_stdcost, NEW.itemcost_stdcost,
        baseCurrId(), baseCurrId() );
    END IF;

    RETURN NEW;

  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO costhist
    ( costhist_item_id, costhist_costelem_id, costhist_type,
      costhist_lowlevel, costhist_username, costhist_date,
      costhist_oldcost, costhist_newcost,
      costhist_oldcurr_id, costhist_newcurr_id )
    VALUES
    ( NEW.itemcost_item_id, NEW.itemcost_costelem_id, 'N',
      NEW.itemcost_lowlevel, getEffectiveXtUser(), CURRENT_TIMESTAMP,
      0, NEW.itemcost_actcost,
      baseCurrId(), NEW.itemcost_curr_id );

    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO costhist
    ( costhist_item_id, costhist_costelem_id, costhist_type,
      costhist_lowlevel, costhist_username, costhist_date,
      costhist_oldcost, costhist_newcost,
      costhist_oldcurr_id, costhist_newcurr_id )
    VALUES
    ( OLD.itemcost_item_id, OLD.itemcost_costelem_id, 'D',
      OLD.itemcost_lowlevel, getEffectiveXtUser(), CURRENT_TIMESTAMP,
      OLD.itemcost_stdcost, 0,
      OLD.itemcost_curr_id, baseCurrId() );

    RETURN OLD;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS itemCostTrigger ON itemcost;
CREATE TRIGGER itemCostTrigger BEFORE INSERT OR UPDATE OR DELETE ON itemcost FOR EACH ROW EXECUTE PROCEDURE _itemCostTrigger();



CREATE OR REPLACE FUNCTION _itemCostAfterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemNumber TEXT;
  _maxCost NUMERIC;
  _oldStdCost NUMERIC;
  _oldActCost NUMERIC;
  _actualCost NUMERIC;
  _standardCost NUMERIC;

BEGIN

--  Create Event if Standard or Actual Cost is greater than Max Cost

IF NOT EXISTS(SELECT 1
     FROM evntnot
       JOIN evnttype ON (evnttype_id = evntnot_evnttype_id)
       JOIN usrpref ON (evntnot_username = usrpref_username)
     WHERE
          evnttype_name = 'CostExceedsMaxDesired'
          AND usrpref_name = 'active'
          AND usrpref_value = 't')
   THEN
     RETURN NEW;
END IF;

  SELECT item_number, item_maxcost, actcost(item_id), stdcost(item_id) INTO _itemNumber, _maxCost, _actualCost, _standardCost
  FROM item
  WHERE (item_id=NEW.itemcost_item_id);

  IF (_maxCost > 0.0) THEN
   -- IF (_standardCost > _maxCost)
      IF NOT EXISTS(SELECT 1 --COUNT(evntlog_id)
                    FROM
                      evntlog, evnttype
                      WHERE evntlog_evnttype_id = evnttype_id
                      AND evntlog_number LIKE
                          (_itemNumber || ' -Standard- New:' || '%')

                      AND (evntlog_dispatched IS NULL)
                      AND CAST(evntlog_evnttime AS DATE) = current_date

                      )
                      AND (_standardCost > _maxCost) THEN


      IF (TG_OP = 'INSERT') THEN
        _oldStdCost := 0;
        _oldActCost := 0;
      ELSE
        _oldStdCost := OLD.itemcost_stdcost;
        _oldActCost := OLD.itemcost_stdcost;
      END IF;
      PERFORM postEvent('CostExceedsMaxDesired', NULL, NEW.itemcost_item_id,
                        itemsite_warehous_id,
                        (_itemNumber || ' -Standard- ' ||
                         'New: ' || formatCost(_standardCost) ||
                         ' Max: '|| formatCost(_MaxCost)),
                        NEW.itemcost_stdcost, _oldStdCost,
                        NULL, NULL)
      FROM itemsite
      WHERE (itemsite_item_id=NEW.itemcost_item_id);
    END IF;
       IF NOT EXISTS(
                     SELECT 1 FROM
                      evntlog, evnttype
                      WHERE evntlog_evnttype_id = evnttype_id
                      AND evntlog_number LIKE
                          (_itemNumber || ' -Actual- New:' || '%')

                      AND (evntlog_dispatched IS NULL)
                      AND CAST(evntlog_evnttime AS DATE) = current_date
                      )

                 AND  (_actualCost > _maxCost)
          THEN

      PERFORM postEvent('CostExceedsMaxDesired', NULL, NEW.itemcost_item_id,
                        itemsite_warehous_id,
                        (_itemNumber || ' -Actual- ' ||
                         'New: ' || formatCost(_actualCost) ||
                         ' Max: '|| formatCost(_MaxCost)),
                        NEW.itemcost_actcost, _oldActCost,
                        NULL, NULL)
      FROM itemsite
      WHERE (itemsite_item_id=NEW.itemcost_item_id);
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS itemCostAfterTrigger ON itemcost;
CREATE TRIGGER itemCostAfterTrigger AFTER INSERT OR UPDATE ON itemcost FOR EACH ROW EXECUTE PROCEDURE _itemCostAfterTrigger();
