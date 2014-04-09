CREATE OR REPLACE FUNCTION createWoMaterial(INTEGER, INTEGER, char(1), NUMERIC, NUMERIC, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pIssueMethod ALIAS FOR $3;
  pQtyFxd ALIAS FOR $4;
  pQtyPer ALIAS FOR $5;
  pScrap ALIAS FOR $6;
  _result INTEGER;
BEGIN
  SELECT createWoMaterial(pWoid, pItemsiteid, pIssueMethod, item_inv_uom_id, pQtyFxd, pQtyPer, pScrap)
    INTO _result
    FROM itemsite JOIN item ON (itemsite_item_id=item_id)
   WHERE(itemsite_id=pItemsiteid);
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWoMaterial(INTEGER, INTEGER, char(1), INTEGER, NUMERIC, NUMERIC, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pIssueMethod ALIAS FOR $3;
  pUomId ALIAS FOR $4;
  pQtyFxd ALIAS FOR $5;
  pQtyPer ALIAS FOR $6;
  pScrap ALIAS FOR $7;
  _womatlid INTEGER;

BEGIN

  SELECT createWoMaterial(pWoid,pItemsiteid,pIssueMethod,pUomId,pQtyFxd,pQtyPer,pScrap,-1, NULL, NULL) INTO _womatlid;

  RETURN _womatlid;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWoMaterial(INTEGER, INTEGER, char(1), INTEGER, NUMERIC, NUMERIC, NUMERIC, INTEGER, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pIssueMethod ALIAS FOR $3;
  pUomId ALIAS FOR $4;
  pQtyFxd ALIAS FOR $5;
  pQtyPer ALIAS FOR $6;
  pScrap ALIAS FOR $7;
  pBomitemId ALIAS FOR $8;
  pNotes ALIAS FOR $9;
  pRef ALIAS FOR $10;
  _womatlid INTEGER;

BEGIN

  SELECT createWoMaterial(pWoid,pItemsiteid,pIssueMethod,pUomId,pQtyFxd,pQtyPer,pScrap,pBomitemId,pNotes,pRef,NULL,NULL) INTO _womatlid;

  RETURN _womatlid;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWoMaterial(pWoid INTEGER,
                                            pItemsiteid INTEGER,
                                            pIssueMethod CHAR(1),
                                            pUomId INTEGER,
                                            pQtyFxd NUMERIC,
                                            pQtyPer NUMERIC,
                                            pScrap NUMERIC,
                                            pBomitemId INTEGER,
                                            pNotes TEXT,
                                            pRef TEXT,
                                            pWooperId INTEGER,
                                            pPickList BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _womatlid INTEGER;

BEGIN

  SELECT createWoMaterial(pWoid,
                          pItemsiteid,
                          pIssueMethod,
                          pUomId,
                          pQtyFxd,
                          pQtyPer,
                          pScrap,
                          pBomitemId,
                          pNotes,
                          pRef,
                          pWooperId,
                          pPickList,
                          0.0) INTO _womatlid;

  RETURN _womatlid;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWoMaterial(pWoid INTEGER,
                                            pItemsiteid INTEGER,
                                            pIssueMethod CHAR(1),
                                            pUomId INTEGER,
                                            pQtyFxd NUMERIC,
                                            pQtyPer NUMERIC,
                                            pScrap NUMERIC,
                                            pBomitemId INTEGER,
                                            pNotes TEXT,
                                            pRef TEXT,
                                            pWooperId INTEGER,
                                            pPickList BOOLEAN,
                                            pPrice NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _womatlid INTEGER;
  _p RECORD;

BEGIN

  _womatlid := (SELECT NEXTVAL('womatl_womatl_id_seq'));

  INSERT INTO womatl
  ( womatl_id, womatl_wo_id, womatl_itemsite_id,
    womatl_issuemethod, womatl_uom_id, womatl_qtyfxd,
    womatl_qtyper, womatl_scrap, womatl_qtyreq,
    womatl_qtyiss, womatl_qtywipscrap, womatl_wooper_id,
    womatl_bomitem_id, womatl_duedate, womatl_notes,
    womatl_ref, womatl_picklist, womatl_price )
  SELECT _womatlid, wo_id, pItemsiteid,
         pIssueMethod, pUomId, pQtyFxd,
         pQtyPer, pScrap, roundQty(item_fractional, (pQtyFxd + wo_qtyord * pQtyPer) * (1 + pScrap) ),
         0, 0, COALESCE(pWooperId, -1),
         pBomitemId, wo_startdate, pNotes,
         pRef, COALESCE(pPickList, item_picklist), pPrice 
  FROM wo, itemsite JOIN item ON (item_id=itemsite_item_id)
  WHERE ( (wo_id=pWoid)
   AND (itemsite_id=pItemsiteid) );

-- Handle all of the Phantom material requirements
  WHILE ( ( SELECT COUNT(*)
            FROM womatl, itemsite, item
            WHERE ( (womatl_itemsite_id=itemsite_id)
             AND (itemsite_item_id=item_id)
             AND (womatl_wo_id=pWoid)
             AND (item_type='F') ) ) > 0 ) LOOP

    FOR _p IN SELECT wo_qtyord, wo_startdate, womatl_id, womatl_wooper_id
              FROM wo, womatl, itemsite, item
              WHERE ( (womatl_itemsite_id=itemsite_id)
               AND (itemsite_item_id=item_id)
               AND (item_type='F')
               AND (womatl_wo_id=wo_id)
               AND (wo_id=pWoid) ) LOOP

      INSERT INTO womatl
      ( womatl_wo_id, womatl_itemsite_id, womatl_wooper_id,
        womatl_schedatwooper, womatl_duedate,
        womatl_uom_id, womatl_qtyfxd, womatl_qtyper, womatl_scrap,
        womatl_qtyreq,
        womatl_qtyiss, womatl_qtywipscrap,
        womatl_lastissue, womatl_lastreturn,
        womatl_cost, womatl_picklist, womatl_createwo,
        womatl_issuemethod, womatl_notes, womatl_ref )
      SELECT pWoid, cs.itemsite_id, _p.womatl_wooper_id,
             womatl_schedatwooper, womatl_duedate,
             bomitem_uom_id, bomitem_qtyfxd, (bomitem_qtyper * womatl_qtyper), bomitem_scrap,
             roundQty(itemuomfractionalbyuom(bomitem_item_id, bomitem_uom_id), 
                     ((bomitem_qtyfxd + _p.wo_qtyord * bomitem_qtyper) * womatl_qtyper * (1 + bomitem_scrap))),
             0, 0,
             startOfTime(), startOfTime(),
             0, ci.item_picklist, ( (ci.item_type='M') AND (bomitem_createwo) ),
             bomitem_issuemethod, bomitem_notes, bomitem_ref 
      FROM wo, womatl, bomitem, 
           itemsite AS cs, itemsite AS ps,
           item AS ci, item AS pi
      WHERE ( (womatl_itemsite_id=ps.itemsite_id)
       AND (womatl_wo_id=wo_id)
       AND (bomitem_parent_item_id=pi.item_id)
       AND (bomitem_item_id=ci.item_id)
       AND (ps.itemsite_warehous_id=cs.itemsite_warehous_id)
       AND (cs.itemsite_item_id=ci.item_id)
       AND (ps.itemsite_item_id=pi.item_id)
       AND (woEffectiveDate(_p.wo_startdate) BETWEEN bomitem_effective AND (bomitem_expires - 1))
       AND (womatl_id=_p.womatl_id));

      DELETE FROM womatl
      WHERE (womatl_id=_p.womatl_id);

    END LOOP;
  END LOOP;

  UPDATE wo
  SET wo_adhoc=TRUE
  WHERE (wo_id=pWoid);

  UPDATE wo
  SET wo_status='E'
  WHERE ( (wo_status='O')
   AND (wo_id=pWoid) );

  RETURN _womatlid;
END;
$$ LANGUAGE 'plpgsql';


