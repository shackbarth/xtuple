CREATE OR REPLACE FUNCTION getItemTaxType(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pTaxzoneid ALIAS FOR $2;
  _taxtypeid INTEGER;
BEGIN
  SELECT itemtax_taxtype_id
    INTO _taxtypeid
    FROM itemtax
   WHERE ((itemtax_item_id=pItemid)
     AND  (itemtax_taxzone_id=pTaxzoneid));
  IF (NOT FOUND) THEN
    SELECT itemtax_taxtype_id
      INTO _taxtypeid
      FROM itemtax
     WHERE ((itemtax_item_id=pItemid)
       AND  (itemtax_taxzone_id IS NULL));
    IF (NOT FOUND) THEN
      RETURN NULL;
    END IF;
  END IF;

  RETURN _taxtypeid;
END;
$$ LANGUAGE 'plpgsql';
