CREATE OR REPLACE FUNCTION _cntslipTrigger() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _p RECORD;
  _comments TEXT;
  _temp TEXT;

BEGIN
  IF (TG_OP = ''DELETE'') THEN
    SELECT itemsite_loccntrl, itemsite_controlmethod,
           cntslip_posted, cntslip_lotserial, cntslip_comments,
           cntslip_number, cntslip_qty INTO _p
      FROM cntslip, invcnt, itemsite
     WHERE ( (cntslip_cnttag_id=invcnt_id)
       AND   (invcnt_itemsite_id=itemsite_id)
       AND   (cntslip_id=OLD.cntslip_id) );

    IF(_p.cntslip_posted) THEN
      SELECT ( ''
Count Slip #'' || _p.cntslip_number ||
             '' deleted '' || formatQty(_p.cntslip_qty) ) INTO _comments;

--  Add the Location name if the itemsite is MLC
      IF (_p.itemsite_loccntrl) THEN
        SELECT ( '', Location:'' || location_name ) INTO _temp
          FROM location, cntslip
         WHERE ( (cntslip_location_id=location_id)
           AND   (cntslip_id=OLD.cntslip_id) );

        _comments := (_comments || _temp);
      END IF;

--  Add the Lot/Serial if the itemsite is Lot or Serial controlled
      IF (_p.itemsite_controlmethod = ''L'') THEN
        _comments := (_comments || ( '', Lot #:'' || _p.cntslip_lotserial));
      ELSIF (_p.itemsite_controlmethod = ''S'') THEN
        _comments := (_comments || ( '', Serial #:'' || _p.cntslip_lotserial));
      END IF;

      _comments := (_comments || '' '' || _p.cntslip_comments);

      UPDATE invcnt
         SET invcnt_qoh_after = ( COALESCE(invcnt_qoh_after, 0) - cntslip_qty),
             invcnt_comments = (invcnt_comments || _comments)
        FROM cntslip
       WHERE ( (cntslip_cnttag_id=invcnt_id)
         AND   (NOT invcnt_posted)
         AND   (cntslip_id=OLD.cntslip_id) );

    END IF;

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS cntslipTrigger ON cntslip;
CREATE TRIGGER cntslipTrigger BEFORE INSERT OR UPDATE OR DELETE ON cntslip FOR EACH ROW EXECUTE PROCEDURE _cntslipTrigger();
