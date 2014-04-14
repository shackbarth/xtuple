CREATE OR REPLACE FUNCTION singlelevelBOM(INTEGER, INTEGER, INTEGER, INTEGER) RETURNS SETOF bomdata AS $$
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
  _inactive BOOLEAN;
  _batchsize NUMERIC;

BEGIN

  _inactive := FALSE;

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
    AND (bomhead_rev_id=pRevisionid))),1) INTO _batchsize;
 
  IF NOT (_inactive) THEN
    FOR _x IN
        SELECT bomitem_id, bomitem_seqnumber, bomitem_seqnumber AS f_bomitem_seqnumber,
               item_id, item_number, uom_name,
               item_descrip1, item_descrip2,
               (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
               (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyfxd) AS qtyfxd,
               (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyper) AS qtyper,
               bomitem_scrap, bomitem_createwo,
               CASE WHEN (bomitem_issuemethod='S') THEN 'Push'
                 WHEN (bomitem_issuemethod='L') THEN 'Pull'
                 WHEN (bomitem_issuemethod='M') THEN 'Mixed'
                 ELSE 'Special'
               END AS issuemethod,
               bomitem_effective, bomitem_expires,
               CASE WHEN (bomitem_expires <= CURRENT_DATE) THEN TRUE
                 ELSE FALSE
               END AS expired,
               CASE WHEN (bomitem_effective > CURRENT_DATE) THEN TRUE
                 ELSE FALSE
               END AS future,
               actcost(bomitem_item_id, bomitem_id) AS actunitcost,
               stdcost(bomitem_item_id, bomitem_id) AS stdunitcost,
               CASE WHEN item_type NOT IN ('R','T') THEN
                 itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL,
                              (bomitem_qtyfxd/_batchsize + bomitem_qtyper) * (1 + bomitem_scrap), 'qtyper') * actcost(bomitem_item_id, bomitem_id)
               ELSE 0.0 END AS actextendedcost,
               CASE WHEN item_type NOT IN ('R','T') THEN
                 itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL,
                              (bomitem_qtyfxd/_batchsize + bomitem_qtyper) * (1 + bomitem_scrap), 'qtyper') * stdcost(bomitem_item_id, bomitem_id)
               ELSE 0.0 END AS stdextendedcost,
               bomitem_char_id, bomitem_value, bomitem_notes, bomitem_ref 
       FROM bomitem(pItemid,pRevisionid), item, uom 
       WHERE ( (item_inv_uom_id=uom_id)
       AND (bomitem_item_id=item_id)
       AND (bomitem_expires > (CURRENT_DATE - pExpiredDays))
       AND (bomitem_effective <= (CURRENT_DATE + pFutureDays)) )
       UNION
       SELECT -1, -1, NULL, -1, costelem_type AS bomdata_item_number, '',
              '', '',
              '',
              NULL,
              NULL,
              NULL, NULL,
              NULL,
              NULL, NULL,
              false,false,
              currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE) AS actunitcost,
              itemcost_stdcost AS stdunitcost,
              currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE) AS actextendedcost,
              itemcost_stdcost AS stdextendedcost,
              NULL, NULL, NULL, NULL
       FROM itemcost, costelem 
       WHERE ( (itemcost_costelem_id=costelem_id)
       AND (NOT itemcost_lowlevel)
       AND (itemcost_item_id=pItemid) )
       ORDER BY bomitem_seqnumber, bomitem_effective, item_number
    LOOP
        _row.bomdata_bomitem_id := _x.bomitem_id;
        _row.bomdata_bomwork_seqnumber := _x.f_bomitem_seqnumber;
        _row.bomdata_item_id := _x.item_id;
        _row.bomdata_item_number := _x.item_number;
        _row.bomdata_uom_name := _x.uom_name;
        _row.bomdata_item_descrip1 := _x.item_descrip1;
        _row.bomdata_item_descrip2 := _x.item_descrip2;
        _row.bomdata_itemdescription := _x.itemdescription;
        _row.bomdata_batchsize := _batchsize;
        _row.bomdata_qtyfxd := _x.qtyfxd;
        _row.bomdata_qtyper := _x.qtyper;
        _row.bomdata_scrap := _x.bomitem_scrap;
        _row.bomdata_createchild := _x.bomitem_createwo;
        _row.bomdata_issuemethod := _x.issuemethod;
        _row.bomdata_effective := _x.bomitem_effective;
        _row.bomdata_expires := _x.bomitem_expires;
        _row.bomdata_expired := _x.expired;
        _row.bomdata_future := _x.future;
        _row.bomdata_actunitcost := _x.actunitcost;
        _row.bomdata_stdunitcost := _x.stdunitcost;
        _row.bomdata_actextendedcost := _x.actextendedcost;
        _row.bomdata_stdextendedcost := _x.stdextendedcost;
        _row.bomdata_char_id := _x.bomitem_char_id;
        _row.bomdata_value := _x.bomitem_value;
        _row.bomdata_notes := _x.bomitem_notes;
        _row.bomdata_ref := _x.bomitem_ref;
        RETURN NEXT _row;
    END LOOP;

   ELSE

-- Use historical snapshot for inactive revisions
    FOR _x IN
        SELECT bomitem_id, bomitem_seqnumber, bomitem_seqnumber AS f_bomitem_seqnumber,
               item_id, item_number, uom_name,
               item_descrip1, item_descrip2,
               (item_descrip1 || ' ' || item_descrip2) AS itemdescription,
               (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyfxd) AS qtyfxd,
               (itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * bomitem_qtyper) AS qtyper,
               bomitem_scrap, bomitem_createwo,
               CASE WHEN (bomitem_issuemethod='S') THEN 'Push'
                 WHEN (bomitem_issuemethod='L') THEN 'Pull'
                 WHEN (bomitem_issuemethod='M') THEN 'Mixed'
                 ELSE 'Special'
               END AS issuemethod,
               bomitem_effective, bomitem_expires,
               CASE WHEN (bomitem_expires <= CURRENT_DATE) THEN TRUE
                 ELSE FALSE
               END AS expired,
               CASE WHEN (bomitem_effective > CURRENT_DATE) THEN TRUE
                 ELSE FALSE
               END AS future,
               actcost(bomitem_item_id) AS actunitcost,
               stdcost(bomitem_item_id) AS stdunitcost,
               CASE WHEN item_type NOT IN ('R','T') THEN
                 itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL,
                              (bomitem_qtyfxd/_batchsize + bomitem_qtyper) * (1 + bomitem_scrap), 'qtyper') * actcost(bomitem_item_id)
               ELSE 0.0 END AS actextendedcost,
               CASE WHEN item_type NOT IN ('R','T') THEN
                 itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL,
                              (bomitem_qtyfxd/_batchsize + bomitem_qtyper) * (1 + bomitem_scrap), 'qtyper') * stdcost(bomitem_item_id)
               ELSE 0.0 END AS stdextendedcost,
               bomitem_char_id, bomitem_value, bomitem_notes, bomitem_ref 
       FROM bomitem(pItemid,pRevisionid), item, uom 
       WHERE ( (item_inv_uom_id=uom_id)
       AND (bomitem_item_id=item_id)
       AND (bomitem_expires > (CURRENT_DATE - pExpiredDays))
       AND (bomitem_effective <= (CURRENT_DATE + pFutureDays)) )
       UNION
       SELECT -1, -1, NULL, -1, costelem_type AS bomdata_item_number, '',
              '', '',
              '',
              NULL,
              NULL,
              NULL, NULL,
              NULL,
              NULL, NULL,
              false,false,
              bomhist_actunitcost AS actunitcost,
              bomhist_stdunitcost AS stdunitcost,
              bomhist_actunitcost AS actextendedcost,
              bomhist_stdunitcost AS stdextendedcost,
              NULL, NULL, NULL, NULL
       FROM bomhist, costelem 
       WHERE ( (bomhist_item_id=costelem_id)
       AND (bomhist_item_type='E')
       AND (bomhist_rev_id=pRevisionid) )
       ORDER BY bomitem_seqnumber, bomitem_effective, item_number
    LOOP
        _row.bomdata_bomitem_id := _x.bomitem_id;
        _row.bomdata_bomwork_seqnumber := _x.f_bomitem_seqnumber;
        _row.bomdata_item_id := _x.item_id;
        _row.bomdata_item_number := _x.item_number;
        _row.bomdata_uom_name := _x.uom_name;
        _row.bomdata_item_descrip1 := _x.item_descrip1;
        _row.bomdata_item_descrip2 := _x.item_descrip2;
        _row.bomdata_itemdescription := _x.itemdescription;
        _row.bomdata_batchsize := _batchsize;
        _row.bomdata_qtyfxd := _x.qtyfxd;
        _row.bomdata_qtyper := _x.qtyper;
        _row.bomdata_scrap := _x.bomitem_scrap;
        _row.bomdata_createchild := _x.bomitem_createwo;
        _row.bomdata_issuemethod := _x.issuemethod;
        _row.bomdata_effective := _x.bomitem_effective;
        _row.bomdata_expires := _x.bomitem_expires;
        _row.bomdata_expired := _x.expired;
        _row.bomdata_future := _x.future;
        _row.bomdata_actunitcost := _x.actunitcost;
        _row.bomdata_stdunitcost := _x.stdunitcost;
        _row.bomdata_actextendedcost := _x.actextendedcost;
        _row.bomdata_stdextendedcost := _x.stdextendedcost;
        _row.bomdata_char_id := _x.bomitem_char_id;
        _row.bomdata_value := _x.bomitem_value;
        _row.bomdata_notes := _x.bomitem_notes;
        _row.bomdata_ref := _x.bomitem_ref;
        RETURN NEXT _row;
    END LOOP;
  END IF;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';
