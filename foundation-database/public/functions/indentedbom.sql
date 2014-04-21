CREATE OR REPLACE FUNCTION indentedBOM(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _revid INTEGER;

BEGIN

  SELECT getActiveRevId('BOM',pItemid) INTO _revid;

  RETURN indentedBOM(pItemid, _revid);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION indentedBOM(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevisionid ALIAS FOR $2;
  _bomworkid INTEGER;
  _indexid INTEGER;
  _r RECORD;
  _batchsize NUMERIC;

BEGIN

  -- Get the batch quantity
  SELECT COALESCE( (
    SELECT bomhead_batchsize
    FROM bomhead
    WHERE ((bomhead_item_id=pItemId)
    AND (bomhead_rev_id=pRevisionid)) LIMIT 1),1) INTO _batchsize;
 
--  Check on the temporary workspace
--  PERFORM maintainBOMWorkspace();

--  Grab a new index for this bomwork set
  SELECT NEXTVAL('misc_index_seq') INTO _indexid;

--  Step through all of the components of the passed pItemid
  FOR _r IN SELECT bomitem.*,
                   item_id,
                   itemuomtouom(item_id, item_inv_uom_id, NULL, (bomitem_qtyfxd/_batchsize + bomitem_qtyper) * (1 + bomitem_scrap), 'qtyper') AS qtyreq,
                   (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL)
                               * bomitem_qtyfxd) AS qtyfxd,
                   (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL)
                               * bomitem_qtyper) AS qtyper,
                   stdcost(item_id, bomitem_id) AS standardcost,
                   actcost(item_id, bomitem_id) AS actualcost
  FROM bomitem(pItemId, pRevisionid), item
  WHERE ( (bomitem_item_id=item_id) ) LOOP

--  Insert the component and bomitem parameters
    SELECT NEXTVAL('bomwork_bomwork_id_seq') INTO _bomworkid;
    INSERT INTO bomwork
    ( bomwork_id, bomwork_set_id, bomwork_parent_id, bomwork_level,
      bomwork_parent_seqnumber, bomwork_seqnumber,
      bomwork_item_id, bomwork_createwo, bomwork_qtyreq,
      bomwork_qtyfxd, bomwork_qtyper, bomwork_scrap, bomwork_issuemethod,
      bomwork_effective, bomwork_expires,
      bomwork_stdunitcost, bomwork_actunitcost,
      bomwork_char_id, bomwork_value, bomwork_notes, bomwork_ref,
      bomwork_bomitem_id, bomwork_ecn )
    VALUES
    ( _bomworkid, _indexid, -1, 1,
      0, _r.bomitem_seqnumber,
      _r.item_id, _r.bomitem_createwo, _r.qtyreq,
      _r.qtyfxd, _r.qtyper, _r.bomitem_scrap, _r.bomitem_issuemethod,
      _r.bomitem_effective, _r.bomitem_expires,
      _r.standardcost, _r.actualcost,
      _r.bomitem_char_id, _r.bomitem_value, _r.bomitem_notes, _r.bomitem_ref,
      _r.bomitem_id, _r.bomitem_ecn );

--  Explode the components of the current component
    PERFORM explodeBOM(_r.item_id, _bomworkid, 1);

  END LOOP;

--  Return a key to the result
  RETURN _indexid;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION indentedBOM(INTEGER, INTEGER, INTEGER, INTEGER) RETURNS SETOF bomdata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevisionid ALIAS FOR $2;
  pExpiredDays ALIAS FOR $3;
  pFutureDays ALIAS FOR $4;
  _row bomdata%ROWTYPE;
  _bomworksetid INTEGER;
  _x RECORD;
  _check CHAR(1);
  _inactive BOOLEAN := FALSE;
  _batchsize NUMERIC;
BEGIN

  IF (pRevisionid != -1) THEN
    --Is this a deactivated revision?
    SELECT rev_status INTO _check
    FROM rev
    WHERE ((rev_id=pRevisionid)
    AND (rev_status='I'));
    IF (FOUND) THEN
      _inactive := TRUE;
    END IF;
  END IF;
 
  -- Get the batch quantity
  SELECT COALESCE( (
    SELECT bomhead_batchsize
    FROM bomhead
    WHERE ((bomhead_item_id=pItemId)
    AND (bomhead_rev_id=pRevisionid)) LIMIT 1),1) INTO _batchsize;
 
  IF NOT (_inactive) THEN

    --We can explode this out based on current data
    SELECT indentedBOM(pItemid, pRevisionid) INTO _bomworksetid;  

    FOR _x IN
        SELECT bomwork_id, bomwork_parent_id, bomwork_level,
               bomworkSequence(bomwork_id) AS seq_ord,
               bomwork_seqnumber, item_id, item_number, uom_name,
               item_descrip1, item_descrip2,
               (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
               bomwork_qtyreq, bomwork_qtyfxd, bomwork_qtyper, bomwork_scrap, bomwork_createwo,
       CASE WHEN (bomwork_issuemethod='S') THEN 'Push'
            WHEN (bomwork_issuemethod='L') THEN 'Pull'
            WHEN (bomwork_issuemethod='M') THEN 'Mixed'
            ELSE 'Special'
       END AS issuemethod,
       bomwork_effective, bomwork_expires,
       (bomwork_expires <= CURRENT_DATE) AS expired,
       (bomwork_effective > CURRENT_DATE) AS future,
       bomwork_actunitcost AS actunitcost,
       bomwork_stdunitcost AS stdunitcost,
       CASE WHEN item_type NOT IN ('R','T') THEN
         itemuomtouom(item_id, item_inv_uom_id, NULL, (bomwork_qtyfxd/_batchsize + bomwork_qtyper) * (1 + bomwork_scrap), 'qtyper') * bomwork_actunitcost
       ELSE 0.0 END AS actextendedcost,
       CASE WHEN item_type NOT IN ('R','T') THEN
         itemuomtouom(item_id, item_inv_uom_id, NULL, (bomwork_qtyfxd/_batchsize + bomwork_qtyper) * (1 + bomwork_scrap), 'qtyper') * bomwork_stdunitcost
       ELSE 0.0 END AS stdextendedcost,
       bomwork_char_id,
       bomwork_value, bomwork_notes, bomwork_ref,
       bomwork_bomitem_id, bomwork_ecn
       FROM bomwork, item, uom 
       WHERE ( (bomwork_item_id=item_id)
       AND (item_inv_uom_id=uom_id)
       AND (bomwork_set_id=_bomworksetid) )
       AND (bomwork_expires > (CURRENT_DATE - pExpiredDays))
       AND (bomwork_effective <= (CURRENT_DATE + pFutureDays))
       UNION
       SELECT -1, -1, 1,
              '0',
              NULL,-1, costelem_type AS bomdata_item_number, '',
              '', '',
              '',
              NULL, NULL, NULL, NULL, NULL,
              '',
              NULL, NULL,
              false,
              false,
              currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE) AS actunitcost,
              itemcost_stdcost AS stdunitcost,
              currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE) AS actextendedcost,
              itemcost_stdcost AS stdextendedcost,
              NULL,
              NULL,NULL,NULL,
              NULL,NULL
       FROM itemcost, costelem 
       WHERE ( (itemcost_costelem_id=costelem_id)
       AND (NOT itemcost_lowlevel)
       AND (itemcost_item_id=pItemid) )
       ORDER BY seq_ord
    LOOP
        _row.bomdata_bomwork_id := _x.bomwork_id;
        _row.bomdata_bomwork_parent_id := _x.bomwork_parent_id;
        _row.bomdata_bomwork_level := _x.bomwork_level;
        _row.bomdata_bomwork_seqnumber := _x.bomwork_seqnumber;
        _row.bomdata_bomitem_id := _x.bomwork_bomitem_id;
        _row.bomdata_item_id := _x.item_id;
        _row.bomdata_item_number := _x.item_number;
        _row.bomdata_uom_name := _x.uom_name;
        _row.bomdata_item_descrip1 := _x.item_descrip1;
        _row.bomdata_item_descrip2 := _x.item_descrip2;
        _row.bomdata_itemdescription := _x.itemdescription;
        _row.bomdata_batchsize := _batchsize;
        _row.bomdata_qtyreq := _x.bomwork_qtyreq;
        _row.bomdata_qtyfxd := _x.bomwork_qtyfxd;
        _row.bomdata_qtyper := _x.bomwork_qtyper;
        _row.bomdata_scrap := _x.bomwork_scrap;
        _row.bomdata_createchild := _x.bomwork_createwo;
        _row.bomdata_issuemethod := _x.issuemethod;
        _row.bomdata_effective := _x.bomwork_effective;
        _row.bomdata_expires := _x.bomwork_expires;
        _row.bomdata_expired := _x.expired;
        _row.bomdata_future := _x.future;
        _row.bomdata_actunitcost := _x.actunitcost;
        _row.bomdata_stdunitcost := _x.stdunitcost;
        _row.bomdata_actextendedcost := _x.actextendedcost;
        _row.bomdata_stdextendedcost := _x.stdextendedcost;
        _row.bomdata_ecn := _x.bomwork_ecn;
        _row.bomdata_char_id := _x.bomwork_char_id;
        _row.bomdata_value := _x.bomwork_value;
        _row.bomdata_notes := _x.bomwork_notes;
        _row.bomdata_ref := _x.bomwork_ref;
        RETURN NEXT _row;
    END LOOP;
    
    PERFORM deleteBOMWorkset(_bomworksetid);

  ELSE

-- Use historical snapshot for inactive revisions
    FOR _x IN
        SELECT bomhist_id, bomhist_parent_id, bomhist_level,
               bomhistSequence(bomhist_seq_id) AS seq_ord,
               bomhist_seqnumber, item_id, item_number, uom_name,
               item_descrip1, item_descrip2,
               (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
               bomhist_qtyreq, bomhist_qtyfxd, bomhist_qtyper, bomhist_scrap,
               bomhist_createwo,
       CASE WHEN (bomhist_issuemethod='S') THEN 'Push'
            WHEN (bomhist_issuemethod='L') THEN 'Pull'
            WHEN (bomhist_issuemethod='M') THEN 'Mixed'
            ELSE 'Special'
       END AS issuemethod,
       bomhist_effective, bomhist_expires,
       (bomhist_expires <= CURRENT_DATE) AS expired,
       (bomhist_effective > CURRENT_DATE) AS future,
       bomhist_actunitcost AS actunitcost,
       bomhist_stdunitcost AS stdunitcost,
       CASE WHEN item_type NOT IN ('R','T') THEN
         (bomhist_qtyfxd/_batchsize + bomhist_qtyper) * (1 + bomhist_scrap) * bomhist_actunitcost
       ELSE 0 END AS actextendedcost,
       CASE WHEN item_type NOT IN ('R','T') THEN
         (bomhist_qtyfxd/_batchsize + bomhist_qtyper) * (1 + bomhist_scrap) * bomhist_stdunitcost
       ELSE 0 END AS stdextendedcost,
       bomhist_char_id, bomhist_value, bomhist_notes, bomhist_ref 
       FROM bomhist, item, uom 
       WHERE ( (bomhist_item_id=item_id)
       AND (item_inv_uom_id=uom_id)
       AND (bomhist_rev_id=pRevisionid) )
       AND (bomhist_expires > (CURRENT_DATE - pExpiredDays))
       AND (bomhist_effective <= (CURRENT_DATE + pFutureDays))
       UNION
       SELECT -1, -1, 1,
              '0',
              NULL,-1, costelem_type AS bomdata_item_number, '',
              '', '',
              '',
              NULL, NULL, NULL, NULL,
              false,
              '', NULL, NULL,
              false,
              false,
              bomhist_actunitcost AS actunitcost,
              bomhist_stdunitcost AS stdunitcost,
              bomhist_actunitcost AS actextendedcost,
              bomhist_stdunitcost AS stdextendedcost,
              NULL,NULL,NULL,NULL 
       FROM bomhist, costelem 
       WHERE ((bomhist_rev_id=pRevisionid)
       AND (costelem_id=bomhist_item_id))
       ORDER BY seq_ord
    LOOP
        _row.bomdata_bomwork_id := _x.bomhist_id;
        _row.bomdata_bomwork_parent_id := _x.bomhist_parent_id;
        _row.bomdata_bomwork_level := _x.bomhist_level;
        _row.bomdata_bomwork_seqnumber := _x.bomhist_seqnumber;
        _row.bomdata_bomitem_id := -1;
        _row.bomdata_item_id := _x.item_id;
        _row.bomdata_item_number := _x.item_number;
        _row.bomdata_uom_name := _x.uom_name;
        _row.bomdata_item_descrip1 := _x.item_descrip1;
        _row.bomdata_item_descrip2 := _x.item_descrip2;
        _row.bomdata_itemdescription := _x.itemdescription;
        _row.bomdata_batchsize := _batchsize;
        _row.bomdata_qtyreq := _x.bomhist_qtyreq;
        _row.bomdata_qtyfxd := _x.bomhist_qtyfxd;
        _row.bomdata_qtyper := _x.bomhist_qtyper;
        _row.bomdata_scrap := _x.bomhist_scrap;
        _row.bomdata_createchild := _x.bomhist_createwo;
        _row.bomdata_issuemethod := _x.issuemethod;
        _row.bomdata_effective := _x.bomhist_effective;
        _row.bomdata_expires := _x.bomhist_expires;
        _row.bomdata_expired := _x.expired;
        _row.bomdata_future := _x.future;
        _row.bomdata_actunitcost := _x.actunitcost;
        _row.bomdata_stdunitcost := _x.stdunitcost;
        _row.bomdata_actextendedcost := _x.actextendedcost;
        _row.bomdata_stdextendedcost := _x.stdextendedcost;
        _row.bomdata_ecn := '';
        _row.bomdata_char_id := _x.bomhist_char_id;
        _row.bomdata_value := _x.bomhist_value;
        _row.bomdata_notes := _x.bomhist_notes;
        _row.bomdata_ref := _x.bomhist_ref;
        RETURN NEXT _row;
    END LOOP;
  END IF;   

  RETURN;
END;
$$ LANGUAGE 'plpgsql';
