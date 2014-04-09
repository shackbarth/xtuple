
CREATE OR REPLACE FUNCTION updateReorderLevel(INTEGER, INTEGER, INTEGER[]) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pDays ALIAS FOR $2;
  pPeriods ALIAS FOR $3;
  _cursor INTEGER;
  _periodid INTEGER;
  _usage NUMERIC;
  _totalUsage NUMERIC;
  _totalDays INTEGER;
  _reorderLevel INTEGER;
  _averageUsage NUMERIC;
  _result	TEXT;

BEGIN

  _cursor := 1;
  _totalUsage := 0;
  _totalDays := 0;

  _periodid = pPeriods[_cursor];
  WHILE (_periodid IS NOT NULL) LOOP
    SELECT COALESCE(SUM(invhist_invqty), 0) INTO _usage
    FROM invhist
    WHERE ( (invhist_itemsite_id=pItemsiteid)
     AND ( invhist_transdate::DATE BETWEEN findPeriodStart(_periodid)
                                   AND findPeriodEnd(_periodid) )
     AND (invhist_transtype IN ('SH', 'IM')) );

    _totalUsage := (_totalUsage + _usage);

    _totalDays := ( _totalDays + ( findPeriodEnd(_periodid) -
                                   findPeriodStart(_periodid) + 1 ) );

    _cursor := (_cursor + 1);
    _periodid = pPeriods[_cursor];
  END LOOP;

  IF (_totalDays > 0) THEN
    _reorderLevel := round(_totalUsage / _totalDays * pDays);

    SELECT itemsite_stocked INTO _result from itemsite WHERE (itemsite_id=pItemsiteid);
    IF (_reorderLevel = 0 AND _result='t') THEN
      _reorderLevel := 1;
    END IF;
    
    IF (_reorderLevel > 0) THEN
      UPDATE itemsite
      SET itemsite_reorderlevel = _reorderLevel
      WHERE (itemsite_id=pItemsiteid);
    ELSE
      UPDATE itemsite
      SET itemsite_reorderlevel = 0
      WHERE (itemsite_id=pItemsiteid);
    END IF;

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION updateReorderLevel(INTEGER[], INTEGER, BOOLEAN, INTEGER[]) RETURNS SETOF reordlvl AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteids 		ALIAS FOR $1;
  pDays 		ALIAS FOR $2;
  pAddLeadtime		ALIAS FOR $3;
  pPeriodIds 		ALIAS FOR $4;
  _icursor 		INTEGER := 1;
  _pcursor 		INTEGER := 1;
  _totalUsage 		NUMERIC := 0;
  _totalDays 		INTEGER := 0;
  _reorderLevel 	INTEGER := 0;
  _result		TEXT;
  _usage		NUMERIC;
  _averageUsage 	NUMERIC;
  _row reordlvl		%ROWTYPE;

BEGIN
  -- Validate
  IF (pItemsiteIds[1] IS NULL OR pPeriodIds[1] IS NULL) THEN
    RETURN;
  END IF;
  
  -- Calculate total days
  FOR _pcursor IN 1..ARRAY_UPPER(pPeriodIds,1) 
  LOOP
    _totalDays := ( _totalDays + ( findPeriodEnd(pPeriodIds[_pcursor]) -
                                      findPeriodStart(pPeriodIds[_pcursor]) + 1 ) );
  END LOOP;

  --  Loop through each itemsite id
  FOR _icursor IN 1..ARRAY_UPPER(pItemsiteIds,1)
  LOOP
      -- Get itemsite data
    SELECT itemsite_id,
      item_id,
      warehous_code,
      item_number,
      item_descrip1,
      itemsite_leadtime,
      0,
      itemsite_reorderlevel,
      0,
      0,
      0
      INTO _row
    FROM itemsite
      JOIN item ON (itemsite_item_id=item_id)
      JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
    WHERE (itemsite_id=pItemsiteIds[_icursor]);

    IF (FOUND) THEN
      IF (pAddLeadtime) THEN
        _row.reordlvl_daysofstock := pDays + _row.reordlvl_leadtime;
      ELSE
        _row.reordlvl_daysofstock := pDays;
      END IF;
      
      --  Loop through each period id
      FOR _pcursor IN 1..ARRAY_UPPER(pPeriodIds,1) 
      LOOP
        -- Sum days and usage shipping and inventory transactions
        SELECT COALESCE(SUM(invhist_invqty), 0) INTO _usage
        FROM invhist
        WHERE ( (invhist_itemsite_id=pItemsiteIds[_icursor])
         AND ( invhist_transdate::DATE BETWEEN findPeriodStart(pPeriodIds[_pcursor])
                                       AND findPeriodEnd(pPeriodIds[_pcursor]) )
         AND (invhist_transtype IN ('SH', 'IM')) );

        _totalUsage := (_totalUsage + _usage);

      END LOOP;

      -- Calculate reorder level
      IF (_totalDays > 0) THEN
        _reorderLevel := round(_totalUsage / _totalDays * _row.reordlvl_daysofstock);
      END IF;
  
      IF (_reorderLevel <= 0) THEN
        _reorderLevel := 0;
      END IF;

      SELECT itemsite_stocked INTO _result from itemsite WHERE (itemsite_id=pItemsiteIds[_icursor]);
      IF (_reorderLevel = 0 AND _result='t') THEN
        _reorderLevel := 1;
      END IF;

      -- Set values
      _row.reordlvl_total_days		:= _totalDays;
      _row.reordlvl_total_usage	:= _totalUsage;
      _row.reordlvl_calc_level		:= _reorderLevel;

      -- Return result
      RETURN NEXT _row;
    END IF;

    _usage		:= 0;
    _averageUsage	:= 0;
    _totalUsage		:= 0;
    _reorderLevel	:= 0;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

