CREATE OR REPLACE FUNCTION copyItemSite(pItemsiteid INTEGER,
                                        pDestWhsid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.

BEGIN

  RETURN copyItemSite(pItemsiteid, pDestWhsid, NULL);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION copyItemSite(pItemsiteid INTEGER,
                                        pDestWhsid INTEGER,
                                        pDestItemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _destwhs  whsinfo%ROWTYPE;
  _new    itemsite%ROWTYPE;
  _supplywarehousid INTEGER := NULL;

BEGIN
  -- make a copy of the old itemsite
  SELECT * INTO _new
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  -- if there is no dest warehouse then perhaps the user is manually copying it
  IF (pDestWhsid IS NOT NULL) THEN
    SELECT * INTO _destwhs
    FROM whsinfo
    WHERE (warehous_id=pDestWhsid);
    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;
  END IF;

  IF (NOT checkPrivilege('MaintainItemSites')) THEN
    RETURN -3;
  END IF;

  SELECT itemsite_id INTO _new.itemsite_id
  FROM itemsite
  WHERE ((itemsite_item_id=COALESCE(pDestItemid, _new.itemsite_item_id))
    AND  (itemsite_warehous_id=pDestWhsid OR
    (itemsite_warehous_id IS NULL AND pDestWhsid IS NULL)));
  IF (FOUND) THEN
    RETURN _new.itemsite_id;
  END IF;

  -- find supply itemsite
  IF (_new.itemsite_supply_itemsite_id IS NOT NULL) THEN
    SELECT itemsite_warehous_id INTO _supplywarehousid
    FROM itemsite
    WHERE (itemsite_id=_new.itemsite_supply_itemsite_id);
    IF (FOUND) THEN
      SELECT itemsite_id INTO _new.itemsite_supply_itemsite_id
      FROM itemsite
      WHERE (itemsite_warehous_id=_supplywarehousid)
        AND (itemsite_item_id=pDestItemid);
    END IF;
  END IF;

  -- now override the things we know have to change
  _new.itemsite_id                   := NEXTVAL('itemsite_itemsite_id_seq');
  _new.itemsite_warehous_id          := pDestWhsid;
  _new.itemsite_qtyonhand            := 0;
  _new.itemsite_value                := 0;
  _new.itemsite_datelastcount        := NULL;
  _new.itemsite_datelastused         := NULL;
  _new.itemsite_location_id          := -1;
  _new.itemsite_recvlocation_id      := -1;
  _new.itemsite_issuelocation_id     := -1;
  _new.itemsite_location_dist        := FALSE;
  _new.itemsite_recvlocation_dist    := FALSE;
  _new.itemsite_issuelocation_dist   := FALSE;

  IF (_destwhs.warehous_transit) THEN
    _new.itemsite_reorderlevel         := 0;
    _new.itemsite_ordertoqty         := 0;
    _new.itemsite_soldranking        := NULL;
    _new.itemsite_posupply           := FALSE;
    _new.itemsite_wosupply           := FALSE;
    _new.itemsite_loccntrl           := FALSE;
    _new.itemsite_safetystock        := 0;
    _new.itemsite_minordqty          := 0;
    _new.itemsite_multordqty         := 0;
    _new.itemsite_leadtime           := 0;
    _new.itemsite_controlmethod      := 'R';
    IF(_new.itemsite_costmethod='N') THEN
      _new.itemsite_costmethod       := 'S';
    END IF;
    _new.itemsite_active             := TRUE;
    -- ? _new.itemsite_plancode_id   := -1;
    -- ? _new.itemsite_costcat_id    := -1;
    _new.itemsite_eventfence         := 1;
    _new.itemsite_sold               := FALSE;
    _new.itemsite_stocked            := FALSE;
    _new.itemsite_location_id        := -1;
    _new.itemsite_useparams          := FALSE;
    _new.itemsite_useparamsmanual    := FALSE;
    _new.itemsite_createpr           := FALSE;
    _new.itemsite_location           := NULL;
    _new.itemsite_location_comments  := NULL;
    _new.itemsite_notes              := 'Transit Warehouse';
    _new.itemsite_createwo           := FALSE;
    _new.itemsite_costcat_id         := _destwhs.warehous_costcat_id;
    _new.itemsite_supply_itemsite_id := NULL;
  END IF;

  INSERT INTO itemsite (
    itemsite_id,                     itemsite_item_id,
    itemsite_warehous_id,            itemsite_qtyonhand,
    itemsite_costmethod,             itemsite_value,
    itemsite_reorderlevel,           itemsite_ordertoqty,
    itemsite_cyclecountfreq,         itemsite_datelastcount,
    itemsite_datelastused,
    itemsite_posupply,               itemsite_wosupply,
    itemsite_loccntrl,
    itemsite_safetystock,            itemsite_minordqty,
    itemsite_multordqty,             itemsite_leadtime,
    itemsite_abcclass,               itemsite_issuemethod,
    itemsite_controlmethod,          itemsite_active,
    itemsite_plancode_id,            itemsite_costcat_id,
    itemsite_eventfence,             itemsite_sold,
    itemsite_stocked,                itemsite_freeze,
    itemsite_location_id,
    itemsite_useparams,              itemsite_useparamsmanual,
    itemsite_soldranking,            itemsite_createpr,
    itemsite_location,               itemsite_location_comments,
    itemsite_notes,                  itemsite_perishable,
    itemsite_autoabcclass,
    itemsite_ordergroup,             itemsite_disallowblankwip,
    itemsite_maxordqty,              itemsite_mps_timefence,
    itemsite_createwo,               itemsite_warrpurc,
    itemsite_autoreg,
    itemsite_planning_type,          itemsite_supply_itemsite_id,
    itemsite_createsopr,             itemsite_createsopo,
    itemsite_dropship,
    itemsite_recvlocation_id,        itemsite_issuelocation_id,
    itemsite_location_dist,          itemsite_recvlocation_dist,
    itemsite_issuelocation_dist
  ) VALUES (
    _new.itemsite_id,                COALESCE(pDestItemid, _new.itemsite_item_id),
    _new.itemsite_warehous_id,         _new.itemsite_qtyonhand,
    _new.itemsite_costmethod,        _new.itemsite_value,
    _new.itemsite_reorderlevel,      _new.itemsite_ordertoqty,
    _new.itemsite_cyclecountfreq,    _new.itemsite_datelastcount,
    _new.itemsite_datelastused,
    _new.itemsite_posupply,          _new.itemsite_wosupply,
    _new.itemsite_loccntrl,
    _new.itemsite_safetystock,         _new.itemsite_minordqty,
    _new.itemsite_multordqty,        _new.itemsite_leadtime,
    _new.itemsite_abcclass,          _new.itemsite_issuemethod,
    _new.itemsite_controlmethod,     _new.itemsite_active,
    _new.itemsite_plancode_id,         _new.itemsite_costcat_id,
    _new.itemsite_eventfence,        _new.itemsite_sold,
    _new.itemsite_stocked,           _new.itemsite_freeze,
    _new.itemsite_location_id,
    _new.itemsite_useparams,         _new.itemsite_useparamsmanual,
    _new.itemsite_soldranking,         _new.itemsite_createpr,
    _new.itemsite_location,          _new.itemsite_location_comments,
    _new.itemsite_notes,             _new.itemsite_perishable,
    _new.itemsite_autoabcclass,
    _new.itemsite_ordergroup,        _new.itemsite_disallowblankwip,
    _new.itemsite_maxordqty,         _new.itemsite_mps_timefence,
    _new.itemsite_createwo,          _new.itemsite_warrpurc,
    _new.itemsite_autoreg,
    _new.itemsite_planning_type,     _new.itemsite_supply_itemsite_id,
    _new.itemsite_createsopr,        _new.itemsite_createsopo,
    _new.itemsite_dropship,
    _new.itemsite_recvlocation_id,   _new.itemsite_issuelocation_id,
    _new.itemsite_location_dist,     _new.itemsite_recvlocation_dist,
    _new.itemsite_issuelocation_dist
    );

  RETURN _new.itemsite_id;
END;
$$ LANGUAGE plpgsql;