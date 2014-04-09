CREATE OR REPLACE FUNCTION _uomconvupdate() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
 
  UPDATE itemuomconv
  SET itemuomconv_to_value = NEW.uomconv_to_value,
  itemuomconv_from_value = NEW.uomconv_from_value,
  itemuomconv_fractional = NEW.uomconv_fractional
  WHERE((itemuomconv_from_uom_id = NEW.uomconv_from_uom_id)
  AND (itemuomconv_to_uom_id = NEW.uomconv_to_uom_id));

RETURN NEW;

END; 
' LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'uomconvupdate');
CREATE TRIGGER uomconvupdate BEFORE UPDATE ON uomconv FOR EACH ROW EXECUTE PROCEDURE _uomconvupdate();
