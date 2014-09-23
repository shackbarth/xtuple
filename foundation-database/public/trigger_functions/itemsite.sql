CREATE OR REPLACE FUNCTION _itemsiteTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _r RECORD;

BEGIN

  -- Cache some information
  -- Added item_number as part of feature request 21645
  SELECT item_type, item_number INTO _r
  FROM item
  WHERE (item_id=NEW.itemsite_item_id);
 
-- Override values to avoid invalid data combinations
  IF (_r.item_type IN ('J','R','S')) THEN
    NEW.itemsite_planning_type := 'N';
  END IF;

  IF (_r.item_type = 'L') THEN
    NEW.itemsite_planning_type := 'S';
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF ( (NEW.itemsite_qtyonhand <> OLD.itemsite_qtyonhand) ) THEN
      IF (OLD.itemsite_freeze) THEN
        NEW.itemsite_qtyonhand := OLD.itemsite_qtyonhand;
      ELSE
        NEW.itemsite_datelastused := CURRENT_DATE;
      END IF;

      IF ( (NEW.itemsite_qtyonhand < 0) AND (OLD.itemsite_qtyonhand >= 0) AND (NEW.itemsite_eventfence > 0) ) THEN
        PERFORM postEvent('QOHBelowZero', 'I', NEW.itemsite_id,
                          warehous_id,
                          (item_number || '/' || warehous_code),
                          NULL, NULL, NULL, NULL)
        FROM item, whsinfo
        WHERE (item_id=NEW.itemsite_item_id)
          AND (warehous_id=NEW.itemsite_warehous_id);
      END IF;
    END IF;
    IF ( (NEW.itemsite_value <> OLD.itemsite_value) AND (OLD.itemsite_freeze) ) THEN
      NEW.itemsite_value := OLD.itemsite_value;
    END IF;
  END IF;

-- Added item_number to error messages displayed to fulfill Feature Request 21645
  IF (NEW.itemsite_qtyonhand < 0 AND NEW.itemsite_costmethod = 'A') THEN
    RAISE EXCEPTION 'Itemsite (%) is set to use average costing and is not allowed to have a negative quantity on hand.', 'ID: ' || NEW.itemsite_id || ', Item: ' || _r.item_number;
  ELSIF (NEW.itemsite_value < 0 AND NEW.itemsite_costmethod = 'A') THEN
    RAISE EXCEPTION 'This transaction results in a negative itemsite value.  Itemsite (%) is set to use average costing and is not allowed to have a negative value.', 'ID: ' || NEW.itemsite_id || ', Item: ' || _r.item_number;  END IF;

--  Handle the ChangeLog
  IF ( SELECT (metric_value='t')
       FROM metric
       WHERE (metric_name='ItemSiteChangeLog') ) THEN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'IS', NEW.itemsite_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN

        IF (OLD.itemsite_plancode_id <> NEW.itemsite_plancode_id) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Planner Code Changed from "' || oldplancode.plancode_code ||
                                 '" to "' || newplancode.plancode_code || '"' ) )
          FROM plancode AS oldplancode, plancode AS newplancode
          WHERE ( (oldplancode.plancode_id=OLD.itemsite_plancode_id)
           AND (newplancode.plancode_id=NEW.itemsite_plancode_id) );
        END IF;

        IF (NEW.itemsite_reorderlevel <> OLD.itemsite_reorderlevel) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Reorder Level Changed from ' || formatQty(OLD.itemsite_reorderlevel) ||
                                 ' to ' || formatQty(NEW.itemsite_reorderlevel ) ) );
        END IF;

        IF (NEW.itemsite_ordertoqty <> OLD.itemsite_ordertoqty) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Order Up To Changed from ' || formatQty(OLD.itemsite_ordertoqty) ||
                                 ' to ' || formatQty(NEW.itemsite_ordertoqty ) ) );
        END IF;

        IF (NEW.itemsite_leadtime <> OLD.itemsite_leadtime) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Itemsite Leadtime Changed from ' || formatQty(OLD.itemsite_leadtime) ||
                                 ' to ' || formatQty(NEW.itemsite_leadtime ) ) );
        END IF;

        IF (NEW.itemsite_abcclass <> OLD.itemsite_abcclass) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Itemsite ABC Class Changed from ' || COALESCE(OLD.itemsite_abcclass, 'None') ||
                                 ' to ' || COALESCE(NEW.itemsite_abcclass,'None') ) );
        END IF;

        IF (NEW.itemsite_controlmethod <> OLD.itemsite_controlmethod) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
                               ( 'Itemsite Control Method Changed from ' || COALESCE(OLD.itemsite_controlmethod,'None') ||
                                 ' to ' || COALESCE(NEW.itemsite_controlmethod,'None') ) );
        END IF;

        IF (OLD.itemsite_sold <> NEW.itemsite_sold) THEN
          PERFORM postComment( _cmnttypeid, 'IS', NEW.itemsite_id,
            CASE WHEN (NEW.itemsite_sold) THEN 'Sold Changed from FALSE to TRUE'
                                          ELSE 'Sold Changed from TRUE to FALSE'
            END );
        END IF;

        IF (OLD.itemsite_active <> NEW.itemsite_active) THEN
          IF (NEW.itemsite_active) THEN
            PERFORM postComment(_cmnttypeid, 'IS', NEW.itemsite_id, 'Activated');
          ELSE
            PERFORM postComment(_cmnttypeid, 'IS', NEW.itemsite_id, 'Deactivated');
          END IF;
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'itemsiteTrigger');
CREATE TRIGGER itemsiteTrigger BEFORE INSERT OR UPDATE ON itemsite FOR EACH ROW EXECUTE PROCEDURE _itemsiteTrigger();

CREATE OR REPLACE FUNCTION _itemsiteAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _state INTEGER;
  _wasLocationControl BOOLEAN;
  _isLocationControl BOOLEAN;
  _wasLotSerial BOOLEAN;
  _isLotSerial BOOLEAN;
  _wasPerishable BOOLEAN;
  _isPerishable BOOLEAN;
  _qty NUMERIC;
  _maint BOOLEAN;
  _cost NUMERIC;
  _variance NUMERIC;
  _application TEXT;

BEGIN
-- Cache Application
  SELECT fetchMetricText('Application') INTO _application;

-- Check if we are doing maintenance
  IF (TG_OP = 'INSERT') THEN
    _maint := TRUE;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF ((OLD.itemsite_item_id           != NEW.itemsite_item_id)
     OR (OLD.itemsite_warehous_id       != NEW.itemsite_warehous_id)
     OR (OLD.itemsite_reorderlevel      != NEW.itemsite_reorderlevel)
     OR (OLD.itemsite_ordertoqty        != NEW.itemsite_ordertoqty)
     OR (OLD.itemsite_cyclecountfreq    != NEW.itemsite_cyclecountfreq)
     OR (OLD.itemsite_planning_type     != NEW.itemsite_planning_type)
     OR (OLD.itemsite_posupply          != NEW.itemsite_posupply)
     OR (OLD.itemsite_wosupply          != NEW.itemsite_wosupply)
     OR (OLD.itemsite_loccntrl          != NEW.itemsite_loccntrl)
     OR (OLD.itemsite_safetystock       != NEW.itemsite_safetystock)
     OR (OLD.itemsite_minordqty         != NEW.itemsite_minordqty)
     OR (OLD.itemsite_multordqty        != NEW.itemsite_multordqty)
     OR (OLD.itemsite_leadtime          != NEW.itemsite_leadtime)
     OR (OLD.itemsite_abcclass          != NEW.itemsite_abcclass)
     OR (OLD.itemsite_controlmethod     != NEW.itemsite_controlmethod)
     OR (OLD.itemsite_active            != NEW.itemsite_active)
     OR (OLD.itemsite_plancode_id       != NEW.itemsite_plancode_id)
     OR (OLD.itemsite_costcat_id        != NEW.itemsite_costcat_id)
     OR (OLD.itemsite_eventfence        != NEW.itemsite_eventfence)
     OR (OLD.itemsite_sold              != NEW.itemsite_sold)
     OR (OLD.itemsite_stocked           != NEW.itemsite_stocked)
     OR (OLD.itemsite_location_id       != NEW.itemsite_location_id)
     OR (OLD.itemsite_recvlocation_id   != NEW.itemsite_recvlocation_id)
     OR (OLD.itemsite_issuelocation_id  != NEW.itemsite_issuelocation_id)
     OR (OLD.itemsite_location_dist     != NEW.itemsite_location_dist)
     OR (OLD.itemsite_recvlocation_dist != NEW.itemsite_recvlocation_dist)
     OR (OLD.itemsite_issuelocation_dist != NEW.itemsite_issuelocation_dist)
     OR (OLD.itemsite_useparams         != NEW.itemsite_useparams)
     OR (OLD.itemsite_useparamsmanual   != NEW.itemsite_useparamsmanual)
     OR (OLD.itemsite_soldranking       != NEW.itemsite_soldranking)
     OR (OLD.itemsite_createpr          != NEW.itemsite_createpr)
     OR (OLD.itemsite_location          != NEW.itemsite_location)
     OR (OLD.itemsite_location_comments != NEW.itemsite_location_comments)
     OR (OLD.itemsite_notes             != NEW.itemsite_notes)
     OR (OLD.itemsite_perishable        != NEW.itemsite_perishable)
     OR (OLD.itemsite_autoabcclass      != NEW.itemsite_autoabcclass)
     OR (OLD.itemsite_ordergroup        != NEW.itemsite_ordergroup)
     OR (OLD.itemsite_disallowblankwip  != NEW.itemsite_disallowblankwip)
     OR (OLD.itemsite_maxordqty         != NEW.itemsite_maxordqty)
     OR (OLD.itemsite_mps_timefence     != NEW.itemsite_mps_timefence)
     OR (OLD.itemsite_createwo          != NEW.itemsite_createwo)
     OR (OLD.itemsite_warrpurc          != NEW.itemsite_warrpurc)
     OR (OLD.itemsite_costmethod        != NEW.itemsite_costmethod)
     OR (OLD.itemsite_autoreg           != NEW.itemsite_autoreg)
     OR (OLD.itemsite_lsseq_id          != NEW.itemsite_lsseq_id) ) THEN
      IF (OLD.itemsite_item_id != NEW.itemsite_item_id) THEN
        RAISE EXCEPTION 'The item number on an itemsite may not be changed.';
      ELSIF (OLD.itemsite_warehous_id != NEW.itemsite_warehous_id) THEN
        RAISE EXCEPTION 'The warehouse code on an itemsite may not be changed.';
      END IF;
      _maint := TRUE;
    END IF;
  ELSE
    _maint := FALSE;
  END IF;

  IF (_maint) THEN -- Begin Maintenance
-- Privilege Checks
    IF ( NOT checkPrivilege('MaintainItemSites') ) THEN
       RAISE EXCEPTION 'You do not have privileges to maintain Item Sites.';
    END IF;
    
-- Override values to avoid invalid data combinations
    IF (NOT NEW.itemsite_posupply) THEN
      UPDATE itemsite SET
        itemsite_createpr = FALSE
      WHERE (itemsite_id=NEW.itemsite_id);
    END IF;
    IF (NOT NEW.itemsite_wosupply) THEN
      UPDATE itemsite SET
        itemsite_createwo = FALSE
      WHERE (itemsite_id=NEW.itemsite_id);
    END IF;

    IF (NEW.itemsite_controlmethod NOT IN ('S','L')) THEN
      UPDATE itemsite SET
        itemsite_perishable = FALSE,
        itemsite_warrpurc = FALSE,
        itemsite_autoreg = FALSE,
        itemsite_lsseq_id = NULL
      WHERE (itemsite_id=NEW.itemsite_id);
    END IF;

    IF (NOT NEW.itemsite_loccntrl) THEN
      UPDATE itemsite SET
        itemsite_disallowblankwip = FALSE
      WHERE (itemsite_id=NEW.itemsite_id);
    END IF;

    IF (NOT NEW.itemsite_useparams) THEN
      UPDATE itemsite SET
        itemsite_reorderlevel    = 0,
        itemsite_ordertoqty      = 0,
        itemsite_minordqty       = 0,
        itemsite_maxordqty       = 0,
        itemsite_multordqty      = 0,
        itemsite_useparamsmanual = FALSE
      WHERE (itemsite_id = NEW.itemsite_id);
    END IF;
    
-- Integrity check

    -- Both insert and update
    IF ( (NEW.itemsite_controlmethod IN ('S', 'L')) AND
         (NEW.itemsite_location_dist OR NEW.itemsite_recvlocation_dist OR NEW.itemsite_issuelocation_dist) ) THEN
      RAISE EXCEPTION 'You cannot auto-distribute Lot/Serial controlled Item Sites.';
    END IF;

    IF (TG_OP = 'INSERT') THEN
      -- Handle MLC logic
      IF ( (NEW.itemsite_loccntrl) AND (NEW.itemsite_warehous_id IS NOT NULL) ) THEN
        IF (SELECT count(*)=0
            FROM location
            WHERE ((location_warehous_id=NEW.itemsite_warehous_id)
            AND ( (NOT location_restrict) OR
                ( (location_restrict) AND
                (location_id IN ( SELECT locitem_location_id
                                  FROM locitem
                                  WHERE (locitem_item_id=NEW.itemsite_item_id) ) ) ) ))) THEN
          RAISE EXCEPTION 'You must first create at least one valid
	    		  Location for this Item Site before it may be
	   	          multiply located.';
        END IF;
      END IF;

      --This could be made a table constraint later, but do not want to create a big problem
      --for users with problematic legacy data over a relatively trivial problem for now,
      --so we will just check moving forword.
      IF (NEW.itemsite_stocked AND NEW.itemsite_reorderlevel<=0) THEN
        RAISE EXCEPTION 'Stocked items must have postive reorder level specified.';
      END IF;
    END IF;

    IF (TG_OP = 'UPDATE') THEN
      --This could be made a table constraint later, but do not want to create a big problem
      --for users with problematic legacy data over a relatively trivial problem for now,
      --so we will just check moving forword.
      IF ((NEW.itemsite_stocked)
        AND (NEW.itemsite_stocked != OLD.itemsite_stocked) --Avoid checking unless explicitly changed
        AND (NEW.itemsite_reorderlevel<=0)) THEN
        RAISE EXCEPTION 'Stocked items must have postive reorder level specified.';
      END IF;
    END IF;
  
    IF (TG_OP = 'UPDATE') THEN
  
-- Integrity check
      IF (NOT OLD.itemsite_loccntrl AND NEW.itemsite_loccntrl) THEN
        IF (SELECT count(*)=0
          FROM location
          WHERE ((location_warehous_id=NEW.itemsite_warehous_id)
          AND ( (NOT location_restrict) OR
              ( (location_restrict) AND
              (location_id IN ( SELECT locitem_location_id
                                FROM locitem
                                WHERE (locitem_item_id=NEW.itemsite_item_id) ) ) ) ))) THEN
           RAISE EXCEPTION 'You must first create at least one valid
			  Location for this Item Site before it may be
		          multiply located.';
        END IF;
      END IF;
   
-- Update detail records based on control method changes 
      _wasLocationControl := OLD.itemsite_loccntrl;
      _isLocationControl := NEW.itemsite_loccntrl;
      _wasLotSerial := OLD.itemsite_controlmethod IN ('S','L');
      _isLotSerial := NEW.itemsite_controlmethod IN ('S','L'); 
      _wasPerishable := OLD.itemsite_perishable;
      _isPerishable := NEW.itemsite_perishable;
      _state := 0;
    
      IF ( (_wasLocationControl) AND (_isLocationControl) ) THEN
        _state := 10;
      ELSIF ( (NOT _wasLocationControl) AND (NOT _isLocationControl) ) THEN
        _state := 20;
      ELSIF ( (NOT _wasLocationControl) AND (_isLocationControl) ) THEN
        _state := 30;
      ELSIF ( (_wasLocationControl) AND (NOT _isLocationControl) ) THEN
        _state := 40;
      END IF;

      IF ( (_wasLotSerial) AND (_isLotSerial) ) THEN
        _state := _state + 1;
      ELSIF ( (NOT _wasLotSerial) AND (NOT _isLotSerial) ) THEN
        _state := _state + 2;
      ELSIF ( (NOT _wasLotSerial) AND (_isLotSerial) ) THEN
        _state := _state + 3;
      ELSIF ( (_wasLotSerial) AND (NOT _isLotSerial) ) THEN
        _state := _state + 4;
      END IF;

      IF ( (_application = 'Standard') AND (_state IN (41, 43, 14, 34, 24, 42, 44)) ) THEN
        -- Check for Reservations
        IF (SELECT COUNT(*) > 0
            FROM itemloc JOIN reserve ON (reserve_supply_id=itemloc_id AND reserve_supply_type='I')
            WHERE (itemloc_itemsite_id=OLD.itemsite_id)) THEN
          RAISE EXCEPTION 'Sales Order Reservations by Location exist for this Item Site';
        END IF;
      END IF;

      IF (_state IN (41, 43)) THEN
        PERFORM consolidateLotSerial(OLD.itemsite_id);
      ELSIF (_state IN (14, 34)) THEN
        PERFORM consolidateLocations(OLD.itemsite_id);
      ELSIF (_state IN (24, 42, 44)) THEN

        RAISE NOTICE 'Deleting item site detail records,';

        DELETE FROM itemloc
        WHERE (itemloc_itemsite_id=OLD.itemsite_id);
      END IF;

     IF (NEW.itemsite_qtyonhand != 0) THEN
--  Handle detail creation
--  Create itemloc records if they do not exist
       IF (_state IN (23, 32, 33)) THEN
          INSERT INTO itemloc 
            ( itemloc_itemsite_id, itemloc_location_id,
              itemloc_expiration, itemloc_qty )
            VALUES
            ( NEW.itemsite_id, -1,
              endOfTime(), NEW.itemsite_qtyonhand );
        END IF;

--  Handle Location distribution
        IF (_state IN (31, 32, 33, 34)) THEN
          IF (SELECT (COUNT(*)=1)
              FROM location
              WHERE ((location_id=NEW.itemsite_location_id)
              AND (location_warehous_id=NEW.itemsite_warehous_id)
              AND ( (NOT location_restrict) OR
                  ( (location_restrict) AND
                  (location_id IN ( SELECT locitem_location_id
                                    FROM locitem
                                    WHERE (locitem_item_id=NEW.itemsite_item_id) ) ) ) ))) THEN
           PERFORM initialDistribution(NEW.itemsite_id, NEW.itemsite_location_id);
          ELSE
            RAISE EXCEPTION 'A valid default location must be selected to distribute existing inventory to.';
          END IF;
        END IF;

--  Handle Lot/Serial distribution
        IF ( (_state = 13) OR (_state = 23) OR (_state = 33) OR (_state = 43) ) THEN
          RAISE NOTICE 'You should now use the Reassign Lot/Serial # window to assign Lot/Serial #s.';
        END IF;
      END IF;  
      IF (OLD.itemsite_costmethod='A' AND NEW.itemsite_costmethod='S') THEN
        -- TODO: Average costing cost method change
        SELECT stdcost(NEW.itemsite_item_id) * NEW.itemsite_qtyonhand
          INTO _cost;
        _variance := _cost - NEW.itemsite_value;
        NEW.itemsite_value := _cost;
        IF(_variance <> 0.0) THEN
          PERFORM insertGLTransaction( 'P/D', '', '', 'Itemsite converted from Average to Standard cost.',
                                       costcat_invcost_accnt_id, costcat_asset_accnt_id, NEW.itemsite_id,
                                      _variance, CURRENT_DATE )
             FROM costcat
            WHERE(costcat_id=NEW.itemsite_costcat_id);
          UPDATE itemsite SET itemsite_value = _cost WHERE (itemsite_id = NEW.itemsite_id);
        END IF;
      END IF;
    END IF;

--  Handle Perishable
    IF ( (_application = 'Standard') AND (_wasPerishable) AND (NOT _isPerishable) ) THEN
      UPDATE itemloc SET itemloc_expiration = endOfTime()
      WHERE (itemloc_itemsite_id = OLD.itemsite_id);
      PERFORM consolidateLotSerial(OLD.itemsite_id);
    END IF;

--  If Planning Type changed to None then delete all Planned Orders
    IF ( (_application = 'Standard') AND (TG_OP = 'UPDATE') ) THEN
      IF (NEW.itemsite_planning_type = 'N' AND OLD.itemsite_planning_type <> 'N') THEN
        PERFORM deletePlannedOrder(planord_id, TRUE)
        FROM planord
        WHERE (planord_itemsite_id=NEW.itemsite_id);
      END IF;
    END IF;
    
  END IF;  -- End Maintenance

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'itemsiteAfterTrigger');
CREATE TRIGGER itemsiteAfterTrigger AFTER INSERT OR UPDATE ON itemsite FOR EACH ROW EXECUTE PROCEDURE _itemsiteAfterTrigger();
