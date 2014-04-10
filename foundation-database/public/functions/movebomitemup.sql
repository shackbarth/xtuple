CREATE OR REPLACE FUNCTION moveBomitemUp(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBomitemid ALIAS FOR $1;
  _nextBomitem RECORD;

BEGIN

  SELECT nextbomitem.bomitem_seqnumber AS next_seqnumber,
         thisbomitem.bomitem_seqnumber AS this_seqnumber,
         thisbomitem.bomitem_parent_item_id AS parent_item_id,
         thisbomitem.bomitem_rev_id AS rev_id
          INTO _nextBomitem
  FROM bomitem AS nextbomitem, bomitem AS thisbomitem
  WHERE ((nextbomitem.bomitem_seqnumber < thisbomitem.bomitem_seqnumber)
   AND (nextbomitem.bomitem_parent_item_id=thisbomitem.bomitem_parent_item_id)
   AND (nextbomitem.bomitem_rev_id=thisbomitem.bomitem_rev_id)
   AND (thisbomitem.bomitem_id=pBomitemid))
  ORDER BY next_seqnumber DESC
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the seqnumber of the current bomitem and the next bomitem
--  There is the potential for multiple bomitems with the same seqnumber

    UPDATE bomitem
    SET bomitem_seqnumber=0
    WHERE (bomitem_seqnumber=_nextBomitem.next_seqnumber)
      AND (bomitem_parent_item_id=_nextBomitem.parent_item_id)
      AND (bomitem_rev_id=_nextBomitem.rev_id);

    UPDATE bomitem 
    SET bomitem_seqnumber=_nextBomitem.next_seqnumber
    WHERE (bomitem_seqnumber=_nextBomitem.this_seqnumber)
      AND (bomitem_parent_item_id=_nextBomitem.parent_item_id)
      AND (bomitem_rev_id=_nextBomitem.rev_id);

    UPDATE bomitem
    SET bomitem_seqnumber=_nextBomitem.this_seqnumber
    WHERE (bomitem_seqnumber=0)
      AND (bomitem_parent_item_id=_nextBomitem.parent_item_id)
      AND (bomitem_rev_id=_nextBomitem.rev_id);
  END IF;

  RETURN 1;

END;
' LANGUAGE 'plpgsql';

