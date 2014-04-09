
CREATE OR REPLACE FUNCTION deleteSo(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid    ALIAS FOR $1;
BEGIN
  RETURN deleteSo(pSoheadid, NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deleteSo(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid	ALIAS FOR $1;
  pSonumber	ALIAS FOR $2;

  _r            RECORD;
  _coitemid     INTEGER;
  _result       INTEGER;
  _poStatus     INTEGER := 0;

BEGIN
-- Get cohead
  SELECT * INTO _r FROM cohead WHERE (cohead_id=pSoheadid);

   IF (NOT FOUND) THEN
     RETURN 0;
   END IF;

-- Cannot delete if credit card payments
  IF (EXISTS(SELECT ccpay_id
	     FROM ccpay, payco
	     WHERE ((ccpay_status IN ('C'))
	       AND  (ccpay_id=payco_ccpay_id)
	       AND  (payco_cohead_id=pSoheadid)))) THEN
    RETURN -1;
  END IF;

-- Cannot delete if credit card history
  IF (EXISTS(SELECT ccpay_id
	     FROM ccpay, payco
	     WHERE ((ccpay_status != 'C')
	       AND  (ccpay_id=payco_ccpay_id)
	       AND  (payco_cohead_id=pSoheadid)))) THEN
    RETURN -2;
  END IF;

-- Delete Sales Order Items
  FOR _coitemid IN
    SELECT coitem_id
    FROM coitem
    WHERE ( (coitem_cohead_id=pSoheadid)
      AND   (coitem_subnumber=0) ) LOOP

    SELECT deleteSoItem(_coitemid) INTO _result;
    IF (_result < 0) THEN
      IF (_result = -20) THEN
        _poStatus := _poStatus - 1;
      ELSE
        RETURN _result;
      END IF;
    END IF;

  END LOOP;

  DELETE FROM pack
  WHERE (pack_head_id=pSoheadid and pack_head_type = 'SO');

  DELETE FROM charass
  WHERE (charass_target_type='SO')
    AND (charass_target_id=pSoheadid);

  DELETE FROM cohead
  WHERE (cohead_id=pSoheadid);

  IF (fetchMetricBool('AutoCreateProjectsForOrders')) THEN
    PERFORM deleteProject(_r.cohead_prj_id);
  END IF;

  DELETE FROM aropenalloc
  WHERE ((aropenalloc_doctype='S')
    AND  (aropenalloc_doc_id=pSoheadid));

  IF ( (NOT _r.cohead_wasquote) AND (NOT _r.cohead_imported) ) THEN
    IF (COALESCE(pSonumber,'') != '') THEN
      _result = releaseSoNumber(pSonumber);
    ELSEIF (_r.cohead_number IS NOT NULL) THEN
      _result = releaseSoNumber(_r.cohead_number);
    END IF;
  END IF;

  IF (_poStatus < 0) THEN
    RETURN -20;
  ELSE
    RETURN 0;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

