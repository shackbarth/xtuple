CREATE OR REPLACE FUNCTION changePoitemDueDate(pPoitemid INTEGER,
                                               pDate DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN changePoitemDueDate(pPoitemid, pDate, false);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION changePoitemDueDate(pPoitemid INTEGER,
                                               pDate DATE,
                                               pBySO BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  IF ( ( SELECT (poitem_status IN ('C'))
         FROM poitem
         WHERE (poitem_id=pPoitemid) ) ) THEN
    RETURN -1;
  END IF;

  UPDATE poitem
  SET poitem_duedate=pDate
  WHERE (poitem_id=pPoitemid);

  IF (pBySO) THEN
    --Generate the PoItemUpdatedBySo event
    PERFORM postEvent('PoItemUpdatedBySo', 'P', poitem_id,
                      itemsite_warehous_id,
                      (pohead_number || '-'|| poitem_linenumber || ': ' || item_number),
                      NULL, NULL, NULL, NULL)
    FROM poitem JOIN pohead ON (pohead_id=poitem_pohead_id)
                JOIN itemsite ON (itemsite_id=poitem_itemsite_id)
                JOIN item ON (item_id=itemsite_item_id)
    WHERE (poitem_id=pPoitemid)
      AND (poitem_duedate <= (CURRENT_DATE + itemsite_eventfence));
  END IF;

  RETURN pPoitemid;

END;
$$ LANGUAGE 'plpgsql';
