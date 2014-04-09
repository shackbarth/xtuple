CREATE OR REPLACE FUNCTION explodeBOM(INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pParentid ALIAS FOR $2;
  pLevel ALIAS FOR $3;
  _revid INTEGER;

BEGIN

  SELECT getActiveRevId('BOM',pItemid) INTO _revid;

  RETURN explodeBOM(pItemid, _revid, pParentid, pLevel);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION explodeBOM(INTEGER, INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevisionid ALIAS FOR $2;
  pParentid ALIAS FOR $3;
  pLevel ALIAS FOR $4;
  _bomworkid INTEGER;
  _level INTEGER;
  _p RECORD;
  _r RECORD;
  _temp TEXT;

BEGIN

  _level := (pLevel + 1);

--  Cache some parameters about the parent
  SELECT bomwork_item_id, bomwork_set_id, bomwork_qtyreq,
         bomwork_seqnumber, bomwork_effective, bomwork_expires INTO _p
  FROM bomwork
  WHERE (bomwork_id=pParentid);

--  Step through all of the components of the parent component
  FOR _r IN SELECT bomitem.*,
                   item_id,
                   (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyfxd) AS qtyfxd,
                   (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyper) AS qtyper,
                   CASE WHEN (_p.bomwork_effective > bomitem_effective) THEN _p.bomwork_effective
                        ELSE bomitem_effective
                   END AS effective,
                   CASE WHEN (_p.bomwork_expires < bomitem_expires) THEN _p.bomwork_expires
                        ELSE bomitem_expires
                   END AS expires,
                   stdcost(item_id, bomitem_id) AS standardcost, actcost(item_id, bomitem_id) AS actualcost
  FROM bomitem(pItemid, pRevisionid), item
  WHERE ( (bomitem_item_id=item_id)
  AND (bomitem_expires > _p.bomwork_effective) ) LOOP

--  Insert the current component and some bomitem parameters into the bomwork set
    SELECT NEXTVAL('bomwork_bomwork_id_seq') INTO _bomworkid;
    INSERT INTO bomwork
    ( bomwork_id, bomwork_set_id, bomwork_parent_id, bomwork_level,
      bomwork_parent_seqnumber, bomwork_seqnumber,
      bomwork_item_id, bomwork_createwo, bomwork_qtyreq,
      bomwork_qtyfxd, bomwork_qtyper, bomwork_scrap, bomwork_issuemethod,
      bomwork_effective, bomwork_expires,
      bomwork_stdunitcost, bomwork_actunitcost, 
      bomwork_notes, bomwork_ref,
      bomwork_bomitem_id, bomwork_ecn )
    VALUES
    ( _bomworkid, _p.bomwork_set_id, pParentid, _level,
      _p.bomwork_seqnumber, _r.bomitem_seqnumber,
      _r.item_id, _r.bomitem_createwo, (_p.bomwork_qtyreq * _r.qtyper + _r.qtyfxd),
      _r.qtyfxd, _r.qtyper, _r.bomitem_scrap, _r.bomitem_issuemethod,
      _r.effective, _r.expires,
      _r.standardcost, _r.actualcost,
      _r.bomitem_notes, _r.bomitem_ref,
      _r.bomitem_id, _r.bomitem_ecn );

--  Recursively repeat for this component's components
    PERFORM explodeBOM(_r.item_id, _bomworkid, _level);
  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
