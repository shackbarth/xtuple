
CREATE OR REPLACE FUNCTION postEvent(pEvnttypename TEXT,
                                     pOrdtype TEXT,
                                     pOrdid INTEGER,
                                     pWhsid INTEGER,
                                     pNumber TEXT,
                                     pNewValue NUMERIC,
                                     pOldValue NUMERIC,
                                     pNewDate DATE,
                                     pOldDate DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _evnttypeid INTEGER;
  _whsid INTEGER;

BEGIN
  -- Find event type
  SELECT evnttype_id INTO _evnttypeid
  FROM evnttype
  WHERE (evnttype_name=pEvnttypename);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Event type % not found.', pEvnttypename;
  END IF;

  IF (pWhsid IS NULL) THEN
    -- Find user preferred warehouse
    SELECT usrpref_value  INTO _whsid
    FROM usrpref
    WHERE usrpref_username = getEffectiveXtUser()
      AND usrpref_name = 'PreferredWarehouse';
  ELSE
    _whsid := pWhsid;
  END IF;

  INSERT INTO evntlog ( evntlog_evnttime, evntlog_evnttype_id,
                        evntlog_ordtype, evntlog_ord_id,
                        evntlog_warehous_id, evntlog_number,
                        evntlog_newvalue, evntlog_oldvalue,
                        evntlog_newdate, evntlog_olddate,
                        evntlog_username )
  SELECT CURRENT_TIMESTAMP, evnttype_id,
         pOrdtype, pOrdid,
         _whsid, pNumber,
         pNewValue, pOldValue,
         pNewDate, pOldDate,
         evntnot_username
  FROM evnttype JOIN evntnot ON ( (evntnot_evnttype_id=evnttype_id) AND
                                  (evntnot_warehous_id=_whsid) )
  WHERE (evnttype_id=_evnttypeid);

  RETURN 0;

END
$$ LANGUAGE 'plpgsql';
