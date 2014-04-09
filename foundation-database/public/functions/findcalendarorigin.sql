
CREATE OR REPLACE FUNCTION findCalendarOrigin(INTEGER) RETURNS DATE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCalheadid ALIAS FOR $1;
  _originType CHAR(1);
  _origin DATE;

BEGIN

  SELECT calhead_origin INTO _originType
  FROM calhead
  WHERE (calhead_id=pCalheadid);

  IF (NOT FOUND) THEN
    _origin := NULL;

  ELSIF (_originType = ''D'') THEN
    _origin := CURRENT_DATE;

  ELSIF (_originType = ''E'') THEN
    _origin := (CURRENT_DATE + 1);

  ELSIF (_originType = ''W'') THEN
    _origin := (CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER);

  ELSIF (_originType = ''X'') THEN
    _origin := ((CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER) + INTERVAL ''1 week'');

  ELSIF (_originType = ''M'') THEN
    _origin := date_trunc(''month'', CURRENT_DATE);

  ELSIF (_originType = ''N'') THEN
    _origin := (date_trunc(''month'', CURRENT_DATE) + INTERVAL ''1 month'');

  ELSIF (_originType = ''L'') THEN
    _origin := (date_trunc(''year'', CURRENT_DATE) - INTERVAL ''1 year'');

  ELSIF (_originType = ''Y'') THEN
    _origin := date_trunc(''year'', CURRENT_DATE);

  ELSIF (_originType = ''Z'') THEN
    _origin := (date_trunc(''year'', CURRENT_DATE) + INTERVAL ''1 year'');

  ELSE
    _origin := NULL;
  END IF;

  RETURN _origin;

  END;
' LANGUAGE 'plpgsql';

