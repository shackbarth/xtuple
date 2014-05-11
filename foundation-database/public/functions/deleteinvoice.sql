CREATE OR REPLACE FUNCTION deleteInvoice(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcheadid ALIAS FOR $1;
  _cobmiscid INTEGER := -1;

BEGIN
  UPDATE shipitem SET shipitem_invoiced=FALSE, shipitem_invcitem_id=NULL
  FROM invcitem
  WHERE ((shipitem_invoiced)
    AND  (shipitem_invcitem_id=invcitem_id)
    AND  (invcitem_invchead_id=pInvcheadid));

  UPDATE coitem SET coitem_status = 'O'
  WHERE ((coitem_status = 'C')
    AND  (coitem_id IN (SELECT cobill_coitem_id
            FROM cobill, invcitem
      WHERE ((cobill_invcitem_id=invcitem_id)
        AND  (invcitem_invchead_id=pInvcheadid)))));

  UPDATE invdetail SET invdetail_invcitem_id=NULL
  FROM invcitem
  WHERE ((invdetail_invcitem_id=invcitem_id)
    AND  (invcitem_invchead_id=pInvcheadid));

  -- Check for unposted cobmisc for the same S/O
  -- If found then consolidate
  SELECT cobmisc_id INTO _cobmiscid
  FROM cobmisc
  WHERE ((NOT cobmisc_posted)
    AND  (cobmisc_cohead_id IN (SELECT coitem_cohead_id
                                FROM invcitem JOIN coitem ON (coitem_id=invcitem_coitem_id)
                                WHERE (invcitem_invchead_id=pInvcheadid))))
  LIMIT 1;
  IF (FOUND) THEN
    UPDATE cobill SET cobill_invcnum=NULL, cobill_invcitem_id=NULL, cobill_cobmisc_id=_cobmiscid
    FROM invcitem
    WHERE ((cobill_invcitem_id=invcitem_id)
      AND  (invcitem_invchead_id=pInvcheadid));

    DELETE FROM cobmisc
    WHERE (cobmisc_invchead_id=pInvcheadid);
  ELSE
    UPDATE cobill SET cobill_invcnum=NULL, cobill_invcitem_id=NULL
    FROM invcitem
    WHERE ((cobill_invcitem_id=invcitem_id)
      AND  (invcitem_invchead_id=pInvcheadid));

    UPDATE cobmisc SET cobmisc_invcnumber=NULL, cobmisc_invchead_id=NULL,
         cobmisc_posted=FALSE
    WHERE (cobmisc_invchead_id=pInvcheadid);
  END IF;

  DELETE FROM aropenalloc
  WHERE (aropenalloc_doctype='I')
    AND (aropenalloc_doc_id=pInvcheadid);

  DELETE FROM charass
  WHERE (charass_target_type='INV')
    AND (charass_target_id=pInvcheadid);

  DELETE FROM invcitem
  WHERE (invcitem_invchead_id=pInvcheadid);

  DELETE FROM invchead
  WHERE (invchead_id=pInvcheadid);

  RETURN pInvcheadid;

END;
$$ LANGUAGE plpgsql;
