
CREATE OR REPLACE FUNCTION roundSale(pSale NUMERIC) RETURNS NUMERIC IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _scale INTEGER;

BEGIN
  IF (pSale IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT locale_salesprice_scale INTO _scale
  FROM locale
  WHERE (locale_id=getUsrLocaleId());

  RETURN ROUND(pSale, _scale);

END;
$$ LANGUAGE 'plpgsql';

