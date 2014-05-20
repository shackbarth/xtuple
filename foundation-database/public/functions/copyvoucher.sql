CREATE OR REPLACE FUNCTION copyVoucher(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoheadid ALIAS FOR $1;
  _voheadid INTEGER;
  _vonumber TEXT;
  _vodate DATE := COALESCE($2, CURRENT_DATE);
  _i RECORD;
  _l RECORD;
  _vodistid INTEGER;

BEGIN
  SELECT *
    INTO _i
    FROM vohead
   WHERE(vohead_id=pVoheadid);
  IF(NOT FOUND) THEN
    RETURN -1;
  END IF;

  _vonumber := fetchVoNumber();
  _voheadid := nextval('vohead_vohead_id_seq');

  INSERT INTO vohead
        (vohead_id,
         vohead_number, vohead_pohead_id,
         vohead_posted, vohead_duedate,
         vohead_invcnumber, vohead_amount,
         vohead_docdate, vohead_1099,
         vohead_distdate, vohead_reference,
         vohead_terms_id, vohead_vend_id,
         vohead_curr_id, vohead_adjtaxtype_id,
         vohead_freighttaxtype_id, vohead_gldistdate,
         vohead_misc, vohead_taxzone_id,
         vohead_taxtype_id, vohead_notes,
         vohead_recurring_vohead_id )
  VALUES(_voheadid,
         _vonumber, _i.vohead_pohead_id,
         false, determineDueDate(_i.vohead_terms_id, _vodate),
         _i.vohead_invcnumber, _i.vohead_amount,
         _vodate, _i.vohead_1099,
         _vodate, _i.vohead_reference,
         _i.vohead_terms_id, _i.vohead_vend_id,
         _i.vohead_curr_id, _i.vohead_adjtaxtype_id,
         _i.vohead_freighttaxtype_id, _vodate,
         _i.vohead_misc, _i.vohead_taxzone_id,
         _i.vohead_taxtype_id, _i.vohead_notes,
         _i.vohead_recurring_vohead_id);

  FOR _l IN SELECT *
            FROM vodist
            WHERE (vodist_vohead_id=pVoheadid) LOOP
    SELECT NEXTVAL('vodist_vodist_id_seq') INTO _vodistid;

    INSERT INTO vodist
        (vodist_id, vodist_poitem_id,
         vodist_vohead_id, vodist_costelem_id,
         vodist_accnt_id, vodist_amount,
         vodist_qty, vodist_expcat_id,
         vodist_tax_id, vodist_discountable,
         vodist_notes)
    VALUES
        (_vodistid, _l.vodist_poitem_id,
         _voheadid, _l.vodist_costelem_id,
         _l.vodist_accnt_id, _l.vodist_amount,
         _l.vodist_qty, _l.vodist_expcat_id,
         _l.vodist_tax_id, _l.vodist_discountable,
         _l.vodist_notes);

  END LOOP;

  RETURN _voheadid;
END;
$$ LANGUAGE 'plpgsql';
