CREATE OR REPLACE FUNCTION deleteIncident(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pincdtid    ALIAS FOR $1;
  _count      INTEGER := 0;
  _incdtnbr   INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO _count
  FROM todoitem
  WHERE (todoitem_incdt_id=pincdtid);
  IF (_count > 0) THEN
    RETURN -1;
  END IF;

  DELETE FROM comment
   WHERE((comment_source='INCDT')
     AND (comment_source_id=pincdtid));

  DELETE FROM incdthist
   WHERE (incdthist_incdt_id=pincdtid);

  DELETE FROM imageass
  WHERE ((imageass_source='INCDT')
     AND (imageass_source_id=pincdtid));

  DELETE FROM url
  WHERE ((url_source='INCDT')
     AND (url_source_id=pincdtid));

  SELECT incdt_number INTO _incdtnbr
  FROM incdt
  WHERE (incdt_id=pincdtid);

  DELETE FROM incdt
    WHERE (incdt_id=pincdtid);

-- Incident #11538 needs to be fully resolved before release can be implemented
--    PERFORM releaseIncidentNumber(_incdtnbr);

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
