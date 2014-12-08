CREATE OR REPLACE FUNCTION deleteItemSite(pItemsiteid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER;
  _lotserial BOOLEAN;
  _bbom BOOLEAN;
  _mfg BOOLEAN;
  _standard BOOLEAN;

BEGIN

  IF ( ( SELECT (itemsite_qtyonhand <> 0)
         FROM itemsite
         WHERE (itemsite_id=pItemsiteid) ) ) THEN
    RETURN -9;
  END IF;

  SELECT metric_value='t' INTO _bbom
    FROM metric
   WHERE (metric_name='BBOM');

  SELECT metric_value='t' INTO _lotserial
    FROM metric
   WHERE (metric_name='LotSerialControl');

  SELECT metric_value NOT IN ('PostBooks', 'Standard') INTO _mfg
    FROM metric
   WHERE (metric_name='Application');

  SELECT metric_value='Standard' INTO _standard
    FROM metric
   WHERE (metric_name='Application');

  SELECT invhist_id INTO _result
  FROM invhist
  WHERE (invhist_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  IF (_lotserial) THEN
    SELECT lsdetail_id INTO _result
    FROM lsdetail
    WHERE (lsdetail_itemsite_id=pItemsiteid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -1;
    END IF;
  END IF;

  SELECT wo_id INTO _result
  FROM wo
  WHERE (wo_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  SELECT womatl_id INTO _result
  FROM womatl
  WHERE (womatl_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  SELECT womatlvar_id INTO _result
  FROM womatlvar
  WHERE ( (womatlvar_parent_itemsite_id=pItemsiteid)
   OR (womatlvar_component_itemsite_id=pItemsiteid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  IF (_bbom) THEN
    SELECT brdvar_id INTO _result
    FROM xtmfg.brdvar
    WHERE ( (brdvar_itemsite_id=pItemsiteid)
     OR (brdvar_parent_itemsite_id=pItemsiteid) )
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -2;
    END IF;
  END IF;

  SELECT coitem_id INTO _result
  FROM coitem
  WHERE (coitem_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  SELECT cohist_id INTO _result
  FROM cohist
  WHERE (cohist_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  SELECT quitem_id INTO _result
  FROM quitem
  WHERE (quitem_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  SELECT cmitem_id INTO _result
  FROM cmitem
  WHERE (cmitem_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;


  SELECT poitem_id INTO _result
  FROM poitem
  WHERE (poitem_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  SELECT recv_id INTO _result
  FROM recv
  WHERE (recv_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  SELECT poreject_id INTO _result
  FROM poreject
  WHERE (poreject_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  SELECT pr_id INTO _result
  FROM pr
  WHERE (pr_itemsite_id=pItemsiteid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  IF (_mfg OR _standard) THEN
    SELECT planord_id INTO _result
    FROM planord
    WHERE (planord_itemsite_id=pItemsiteid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -5;
    END IF;
  END IF;

  IF (_mfg) THEN
    SELECT pschitem_id INTO _result
    FROM xtmfg.pschitem
    WHERE (pschitem_itemsite_id=pItemsiteid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -6;
    END IF;

    SELECT woopervar_id INTO _result
    FROM xtmfg.woopervar
    WHERE (woopervar_parent_itemsite_id=pItemsiteid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -2;
    END IF;
    
  END IF;

  IF (_mfg OR _standard) THEN
    SELECT itemsite_id INTO _result
    FROM itemsite
    WHERE (itemsite_supply_itemsite_id=pItemsiteid)
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -7;
    END IF;
  END IF;

  DELETE FROM invcnt
  WHERE (invcnt_itemsite_id=pItemsiteid);

  DELETE FROM itemloc
  WHERE (itemloc_itemsite_id=pItemsiteid);
  DELETE FROM itemlocdist
  WHERE (itemlocdist_itemsite_id=pItemsiteid);

  IF (_bbom) THEN
    DELETE FROM xtmfg.brddist
    WHERE (brddist_itemsite_id=pItemsiteid);
  END IF;

  DELETE FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
