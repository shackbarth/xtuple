CREATE OR REPLACE FUNCTION implodeWo(INTEGER, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  implodeChildren ALIAS FOR $2;
  resultCode INTEGER;
  _wotcCnt   INTEGER;
  _routings  BOOLEAN;

BEGIN
  SELECT metric_value=''t'' INTO _routings
         FROM metric
         WHERE (metric_name=''Routings'');

  IF ((SELECT wo_id
       FROM wo
       WHERE ((wo_status=''E'')
        AND (wo_id=pWoid))) IS NULL) THEN
    RETURN 0;
  END IF;

  IF (_routings) THEN
    SELECT count(*) INTO _wotcCnt
    FROM xtmfg.wotc
    WHERE (wotc_wo_id=pWoid);
    IF (_wotcCnt > 0) THEN
      RETURN -1;
    END IF;
  END IF;

--  Delete any created P/R''s for this W/O
  PERFORM deletePr(''W'', womatl_id)
  FROM womatl
  WHERE (womatl_wo_id=pWoid);

  DELETE FROM womatl
  WHERE (womatl_id IN ( SELECT womatl_id
                        FROM womatl, wo
                        WHERE ((womatl_wo_id=wo_id)
                         AND (wo_status=''E'')
                         AND (wo_id=pWoid)) ));

  IF _routings THEN

    DELETE FROM xtmfg.wooper
    WHERE (wooper_id IN ( SELECT wooper_id
                          FROM xtmfg.wooper, wo
                          WHERE ((wooper_wo_id=wo_id)
                           AND (wo_status=''E'')
                           AND (wo_id=pWoid)) ));
  END IF;

  UPDATE wo
  SET wo_status=''O''
  WHERE (wo_id=pWoid);

  IF (implodeChildren) THEN
    resultCode := (SELECT MAX(implodeWo(wo_id, TRUE))
                   FROM wo
                   WHERE ((wo_ordtype=''W'')
                    AND (wo_ordid=pWoid)));

    resultCode := (SELECT MAX(deleteWo(wo_id, TRUE))
                   FROM wo
                   WHERE ((wo_ordtype=''W'')
                    AND (wo_ordid=pWoid)));
  END IF;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
