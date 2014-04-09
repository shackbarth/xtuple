CREATE OR REPLACE FUNCTION returnWoMaterialBatch(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  _itemlocSeries INTEGER;
  _woid INTEGER;
  _r RECORD;

BEGIN

  SELECT wo_id INTO _woid
  FROM wo
  WHERE ( (wo_status IN ('E','I'))
   AND (wo_id=pWoid) );

  IF (FOUND) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;

    FOR _r IN SELECT womatl_id, 
                CASE WHEN wo_qtyord >= 0 THEN
                  womatl_qtyiss
                ELSE
                  ((womatl_qtyreq - womatl_qtyiss) * -1)
                END AS qty
              FROM wo, womatl, itemsite
              WHERE ((wo_id=womatl_wo_id)
              AND (womatl_itemsite_id=itemsite_id)
              AND ( (wo_qtyord < 0) OR (womatl_issuemethod IN ('S','M')) )
              AND (womatl_wo_id=pWoid)) LOOP

      IF (_r.qty != 0) THEN
        PERFORM returnWoMaterial(_r.womatl_id, _r.qty, _itemlocSeries, now());
      END IF;

    END LOOP;

--  Reset the W/O Status to E
    UPDATE wo
    SET wo_status='E'
    WHERE (wo_id=pWoid);

    RETURN _itemlocSeries;

  ELSE 
    RETURN -1;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
