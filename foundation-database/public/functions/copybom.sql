CREATE OR REPLACE FUNCTION copyBOM(pSItemid       INTEGER,
                                   pTItemid       INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER;

BEGIN

  SELECT copyBOM (pSItemid, PTItemid, FALSE) into _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION copyBOM(pSItemid       INTEGER,
                                   pTItemid       INTEGER,
                                   pCopyUsedAt    BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _bh RECORD;
  _bi RECORD;
  _bomheadfound BOOLEAN := FALSE;
  _bomheadid INTEGER;
  _bomitemid INTEGER;
  _bomworksetid INTEGER;
  _temp INTEGER;
  _schedatwooper BOOLEAN;
  _booitemseqid INTEGER;

BEGIN

--  Cache source bomhead
  SELECT * INTO _bh
  FROM bomhead
  WHERE ((bomhead_item_id=pSItemid)
    AND  (bomhead_rev_id=getActiveRevID('BOM', pSItemid)));

--  bomhead may not exist
--  IF (NOT FOUND) THEN
--    RETURN -1;
--  END IF;
    IF (FOUND) THEN
      _bomheadfound := TRUE;
    END IF;

--  Make sure that source bomitems exist
  SELECT bomitem_id INTO _bomitemid
  FROM bomitem
  WHERE ((bomitem_parent_item_id=pSItemid)
    AND  (bomitem_rev_id=getActiveRevID('BOM', pSItemid)))
  LIMIT 1;

  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

--  Make sure that target bomitems do not exist
  SELECT bomitem_id INTO _bomitemid
  FROM bomitem
  WHERE ((bomitem_parent_item_id=pTItemid)
    AND  (bomitem_rev_id= -1))
  LIMIT 1;

  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Make sure that the parent is not used in the component at some level
  IF ( SELECT (item_type IN ('M', 'F'))
       FROM item
       WHERE (item_id=pSItemid) ) THEN
    SELECT indentedWhereUsed(pTItemid) INTO _bomworksetid;
    SELECT bomwork_id INTO _temp
    FROM bomwork
    WHERE ( (bomwork_set_id=_bomworksetid)
     AND (bomwork_item_id=pSItemid) )
    LIMIT 1;
    IF (FOUND) THEN
      PERFORM deleteBOMWorkset(_bomworksetid);
      RETURN -4;
    END IF;
    PERFORM deleteBOMWorkset(_bomworksetid);
  END IF;

--  Check for existing target bomhead
  SELECT bomhead_id INTO _bomheadid
  FROM bomhead
  WHERE ((bomhead_item_id=pTItemid)
    AND  (bomhead_rev_id= -1));

  IF (NOT FOUND) THEN
    IF (_bomheadfound) THEN
      INSERT INTO bomhead
      ( bomhead_item_id, bomhead_serial, bomhead_docnum,
        bomhead_batchsize, bomhead_requiredqtyper )
      VALUES
      ( pTItemid, _bh.bomhead_serial, _bh.bomhead_docnum,
        _bh.bomhead_batchsize, _bh.bomhead_requiredqtyper );
    END IF;
  END IF;

  FOR _bi IN SELECT bomitem.*
             FROM bomitem(pSItemid) 
             WHERE (bomitem_expires>CURRENT_DATE) LOOP

    SELECT NEXTVAL('bomitem_bomitem_id_seq') INTO _bomitemid;

    IF (pCopyUsedAt) THEN
      _schedatwooper := _bi.bomitem_schedatwooper;
      _booitemseqid := _bi.bomitem_booitem_seq_id;
    ELSE
      _schedatwooper := FALSE;
      _booitemseqid := -1;
    END IF;

    INSERT INTO bomitem
    ( bomitem_id, bomitem_parent_item_id, bomitem_seqnumber, bomitem_item_id,
      bomitem_uom_id, bomitem_qtyfxd, bomitem_qtyper, bomitem_scrap, bomitem_schedatwooper,
      bomitem_booitem_seq_id,
      bomitem_effective, bomitem_expires, bomitem_ecn,
      bomitem_createwo, bomitem_issuemethod, bomitem_moddate, bomitem_subtype,
      bomitem_notes, bomitem_ref )
    VALUES
    ( _bomitemid, pTItemid, _bi.bomitem_seqnumber, _bi.bomitem_item_id,
      _bi.bomitem_uom_id, _bi.bomitem_qtyfxd, _bi.bomitem_qtyper, _bi.bomitem_scrap, _schedatwooper,
      _booitemseqid,
      CURRENT_DATE, _bi.bomitem_expires, _bi.bomitem_ecn,
      _bi.bomitem_createwo, _bi.bomitem_issuemethod, CURRENT_DATE, _bi.bomitem_subtype,
      _bi.bomitem_notes, _bi.bomitem_ref );

    INSERT INTO bomitemsub
    ( bomitemsub_bomitem_id, bomitemsub_item_id,
      bomitemsub_uomratio, bomitemsub_rank )
    SELECT _bomitemid, bomitemsub_item_id,
           bomitemsub_uomratio, bomitemsub_rank
    FROM bomitemsub
    WHERE (bomitemsub_bomitem_id=_bi.bomitem_id);

  END LOOP;

  RETURN pTItemid;

END;
$$ LANGUAGE 'plpgsql';
