
CREATE OR REPLACE FUNCTION roundQty(pFractional BOOLEAN,
                                    pQty NUMERIC) RETURNS NUMERIC IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _scale INTEGER;

BEGIN
  SELECT locale_qty_scale INTO _scale
  FROM locale
  WHERE (locale_id=getUsrLocaleId());

  IF (pFractional) THEN
    RETURN ROUND(pQty, _scale);
  ELSE
    IF (TRUNC(pQty) < ROUND(pQty, _scale)) THEN
      RETURN (TRUNC(pQty) + 1);
    ELSE
      RETURN TRUNC(pQty);
    END IF;
  END IF;
END;
$$ LANGUAGE 'plpgsql';

