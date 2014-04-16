CREATE OR REPLACE FUNCTION getQuoteLineItemId(text,integer) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuoteNumber ALIAS FOR $1;
  pLineNumber ALIAS FOR $2;
  _returnVal INTEGER;
BEGIN
  IF ((pQuoteNumber IS NULL) OR (pLineNumber IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT quitem_id INTO _returnVal
  FROM quhead, quitem
  WHERE ((quhead_number=pQuoteNumber)
  AND (quhead_id=quitem_quhead_id)
  AND (quitem_linenumber=pLineNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Quote Line Item %-%not found.'', pQuoteNumber,pLineNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
