
CREATE OR REPLACE FUNCTION createPriv(text, text, text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pModule ALIAS FOR $1;
  pName   ALIAS FOR $2;
  pDesc   ALIAS FOR $3;
  _id     INTEGER;
BEGIN

  SELECT priv_id
    INTO _id
    FROM priv
   WHERE(priv_name=pName);

  IF (FOUND) THEN
    UPDATE priv
       SET priv_module=pModule,
           priv_descrip=pDesc
     WHERE(priv_id=_id);
  ELSE
    SELECT nextval(''priv_priv_id_seq'') INTO _id;
    INSERT INTO priv
          (priv_id, priv_module, priv_name, priv_descrip)
    VALUES(_id, pModule, pName, pDesc);
  END IF;

  RETURN _id;
END;
' LANGUAGE 'plpgsql';
