CREATE OR REPLACE FUNCTION deleteexpiredips() RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN

  FOR _r IN SELECT ipshead_id
    FROM ipshead
    WHERE (ipshead_expires <= current_date)
  LOOP

    DELETE FROM ipsass
      WHERE (ipsass_ipshead_id=_r.ipshead_id);
    DELETE FROM ipsiteminfo
      WHERE (ipsitem_ipshead_id=_r.ipshead_id);
    DELETE FROM ipsfreight
      WHERE (ipsfreight_ipshead_id=_r.ipshead_id);
    DELETE FROM ipshead
      WHERE (ipshead_id=_r.ipshead_id);
  END LOOP;

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';
