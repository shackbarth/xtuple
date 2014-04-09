--SELECT dropIfExists('FUNCTION', 'deleteQuote(integer)', 'public');
--SELECT dropIfExists('FUNCTION', 'deleteQuote(integer, integer)', 'public');

CREATE OR REPLACE FUNCTION deleteQuote(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
BEGIN
  RETURN deleteQuote(pQuheadid, NULL::TEXT);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION deleteQuote(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  pQuoteNumber	ALIAS FOR $2;
BEGIN
  RETURN deleteQuote(pQuheadid, pQuoteNumber::TEXT);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION deleteQuote(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid	ALIAS FOR $1;
  pQuoteNumber	ALIAS FOR $2;

  _quNumberScheme	TEXT;
  _quoteNumber		TEXT;
  _quitemid             INTEGER;
  _result               INTEGER;

BEGIN

  SELECT fetchMetricText('QUNumberGeneration') INTO _quNumberScheme;

  IF (pQuoteNumber IS NULL) THEN
    SELECT quhead_number INTO _quoteNumber
    FROM quhead
    WHERE (quhead_id=pQuheadid);
  ELSE
    _quoteNumber := pQuoteNumber;
  END IF;

  PERFORM deleteQuoteItem(quitem_id)
  FROM quitem
  WHERE (quitem_quhead_id=pQuheadid);

  DELETE FROM charass
  WHERE (charass_target_type='QU')
    AND (charass_target_id=pQuheadid);

  DELETE FROM quhead
  WHERE (quhead_id=pQuheadid);

  IF (_quoteNumber IS NOT NULL) THEN
    IF (_quNumberScheme IN ('A', 'O')) THEN
      -- do not release quote # if quote converted to sales order
      IF (NOT EXISTS (SELECT cohead_id
		      FROM cohead
		      WHERE (cohead_number=_quoteNumber))) THEN
	_result = releaseQuNumber(_quoteNumber);
      END IF;
    ELSEIF (_quNumberScheme = 'S') THEN
      _result = releaseSoNumber(_quoteNumber);
    END IF;
  END IF;

  -- Don't care about result of release number
  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
