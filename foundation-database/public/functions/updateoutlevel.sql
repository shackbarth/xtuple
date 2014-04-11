CREATE OR REPLACE FUNCTION updateOUTLevel(INTEGER, INTEGER, INTEGER[]) RETURNS boolean AS '
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
  _outLevel NUMERIC;
  _averageUsage NUMERIC;

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
     AND (invhist_transtype IN (''SH'', ''IM'')) );

    _totalUsage := (_totalUsage + _usage);

    _totalDays := ( _totalDays + ( findPeriodEnd(_periodid) -
                                   findPeriodStart(_periodid) + 1 ) );

    _cursor := (_cursor + 1);
    _periodid = pPeriods[_cursor];
  END LOOP;

  IF (_totalDays > 0) THEN
    _outLevel := round(_totalUsage / _totalDays * pDays);

    IF (_outLevel > 0) THEN
      UPDATE itemsite
      SET itemsite_ordertoqty = _outLevel
      WHERE (itemsite_id=pItemsiteid);
    ELSE
      UPDATE itemsite
      SET itemsite_ordertoqty = 0
      WHERE (itemsite_id=pItemsiteid);
    END IF;

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;

END;
' LANGUAGE plpgsql;
