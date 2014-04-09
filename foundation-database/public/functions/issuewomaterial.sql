CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  pMarkPush ALIAS FOR $4;
  _itemlocSeries INTEGER;

BEGIN
  RETURN issueWoMaterial(pWomatlid, pQty, pItemlocSeries,now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, INTEGER, BOOLEAN, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  pMarkPush ALIAS FOR $4;
  pGlDistTS ALIAS FOR $5;
  _itemlocSeries INTEGER;

BEGIN

  SELECT issueWoMaterial(pWomatlid, pQty, pItemlocSeries, pGlDistTS) INTO _itemlocSeries;

  IF (pMarkPush) THEN
    UPDATE womatl
    SET womatl_issuemethod='S'
    WHERE ((womatl_issuemethod='M')
     AND (womatl_id=pWomatlid));
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  _itemlocSeries INTEGER;

BEGIN

  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  RETURN issueWoMaterial(pWomatlid, pQty, _itemlocSeries);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  _p RECORD;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;

BEGIN
  RETURN issueWoMaterial(pWomatlid, pQty, pItemlocSeries, now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueWoMaterial($1, $2, $3, $4, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, INTEGER, TIMESTAMP WITH TIME ZONE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  pGlDistTS ALIAS FOR $4;
  pInvhistid ALIAS FOR $5;
  _p RECORD;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;

BEGIN

  SELECT item_id,
         itemsite_id AS c_itemsite_id,
         wo_itemsite_id AS p_itemsite_id,
         itemsite_loccntrl, itemsite_controlmethod,
         womatl_wo_id, womatl_qtyreq, itemsite_item_id, womatl_uom_id, wo_prj_id,
         roundQty(item_fractional, itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, pQty)) AS qty,
         formatWoNumber(wo_id) AS woNumber,
         CASE WHEN(itemsite_costmethod='J' AND item_type='P' AND poitem_id IS NOT NULL) THEN poitem_unitprice
              WHEN(itemsite_costmethod IN ('A','J')) THEN avgcost(itemsite_id)
              WHEN(itemsite_costmethod='S') THEN stdcost(itemsite_item_id)
              ELSE 0.0
         END AS cost,
         womatl_issuemethod AS issueMethod INTO _p
  FROM womatl JOIN wo ON (wo_id=womatl_wo_id)
              JOIN itemsite ON (itemsite_id=womatl_itemsite_id)
              JOIN item ON (item_id=itemsite_item_id)
              LEFT OUTER JOIN poitem ON (poitem_order_id=womatl_id AND poitem_order_type='W')
  WHERE (womatl_id=pWomatlid);

  IF (pQty < 0) THEN
    RETURN pItemlocSeries;
  END IF;

  IF (pItemlocSeries <> 0) THEN
    _itemlocSeries := pItemlocSeries;
  ELSE
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  END IF;
  SELECT postInvTrans( ci.itemsite_id, 'IM', _p.qty,
                      'W/O', 'WO', _p.woNumber, '',
                      ('Material ' || item_number || ' Issue to Work Order'),
                      getPrjAccntId(_p.wo_prj_id, pc.costcat_wip_accnt_id),
                      cc.costcat_asset_accnt_id, _itemlocSeries, pGlDistTS,
                      NULL, pInvhistid ) INTO _invhistid
  FROM itemsite AS ci, itemsite AS pi,
       costcat AS cc, costcat AS pc,
       item
  WHERE ( (ci.itemsite_costcat_id=cc.costcat_id)
   AND (pi.itemsite_costcat_id=pc.costcat_id)
   AND (ci.itemsite_id=_p.c_itemsite_id)
   AND (pi.itemsite_id=_p.p_itemsite_id)
   AND (ci.itemsite_item_id=item_id) );

--  Create linkage to the transaction created
  IF (_invhistid != -1) THEN
    INSERT INTO womatlpost (womatlpost_womatl_id,womatlpost_invhist_id)
                VALUES (pWomatlid,_invhistid);
  END IF;

--  Increase the parent W/O's WIP value by the value of the issued components
  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue + (_p.cost * _p.qty)),
      wo_postedvalue = (wo_postedvalue + (_p.cost * _p.qty))
  WHERE (wo_id=_p.womatl_wo_id);

  UPDATE womatl
  SET womatl_qtyiss = (womatl_qtyiss + itemuomtouom(_p.itemsite_item_id, NULL, _p.womatl_uom_id, _p.qty)),
      womatl_lastissue = pGlDistTS::DATE
  WHERE (womatl_id=pWomatlid);

  UPDATE wo
  SET wo_status='I'
  WHERE ( (wo_status <> 'I')
   AND (wo_id=_p.womatl_wo_id) );

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pMarkPush ALIAS FOR $3;
  _itemlocSeries INTEGER;

BEGIN
  RETURN issueWoMaterial(pWomatlid, pQty, pMarkPush, now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueWoMaterial(INTEGER, NUMERIC, BOOLEAN, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pMarkPush ALIAS FOR $3;
  pGlDistTS ALIAS FOR $4;
  _itemlocSeries INTEGER;

BEGIN

  SELECT issueWoMaterial(pWomatlid, pQty, 0, pGlDistTS) INTO _itemlocSeries;
  IF (_itemlocSeries < 0) THEN
    RETURN _itemlocSeries;
  END IF;

  IF (pMarkPush) THEN
    UPDATE womatl
    SET womatl_issuemethod='S'
    WHERE ((womatl_issuemethod='M')
     AND (womatl_id=pWomatlid));
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
