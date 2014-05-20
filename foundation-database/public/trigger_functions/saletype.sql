CREATE OR REPLACE FUNCTION _saletypeBeforeDeleteTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check TEXT;

BEGIN
--  Check to see if any sales orders are assigned to the passed saletype
  SELECT cohead_number INTO _check
  FROM cohead
  WHERE (cohead_saletype_id=OLD.saletype_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Assigned to Sales Order % and possibly more. [xtuple: deletesaletype, -1]', _check;
  END IF;

--  Check to see if any quotes are assigned to the passed saletype
  SELECT quhead_number INTO _check
  FROM quhead
  WHERE (quhead_saletype_id=OLD.saletype_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Assigned to Quote % and possibly more. [xtuple: deletesaletype, -2]', _check;
  END IF;

--  Check to see if any invoice are assigned to the passed saletype
  SELECT invchead_invcnumber INTO _check
  FROM invchead
  WHERE (invchead_saletype_id=OLD.saletype_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Assigned to Invoice % and possibly more. [xtuple: deletesaletype, -3]', _check;
  END IF;

--  Check to see if any credit memos are assigned to the passed saletype
  SELECT cmhead_number INTO _check
  FROM cmhead
  WHERE (cmhead_saletype_id=OLD.saletype_id)
  LIMIT 1;
  IF (FOUND) THEN
    RAISE EXCEPTION 'Assigned to Credit Memo % and possibly more. [xtuple: deletesaletype, -4]', _check;
  END IF;

--  Check to see if any return ruthorizations are assigned to the passed saletype
  IF (fetchMetricBool('EnableReturnAuth')) THEN
    SELECT rahead_number INTO _check
    FROM rahead
    WHERE (rahead_saletype_id=OLD.saletype_id)
    LIMIT 1;
    IF (FOUND) THEN
      RAISE EXCEPTION 'Assigned to Return Authorization % and possibly more returns. [xtuple: deleteSaleType, -5]', _check;
    END IF;
  END IF;

  RETURN OLD;
END;
$$	 LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'saletypeBeforeDeleteTrigger');
CREATE TRIGGER saletypeBeforeDeleteTrigger BEFORE DELETE ON saletype FOR EACH ROW EXECUTE PROCEDURE _saletypeBeforeDeleteTrigger();
