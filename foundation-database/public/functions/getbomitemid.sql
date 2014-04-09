CREATE OR REPLACE FUNCTION getBomitemId(text,text,text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemNumber ALIAS FOR $1;
  pRevision ALIAS FOR $2;
  pSeqNumber ALIAS FOR $3;
  _returnVal INTEGER;
  
BEGIN
  IF ((pItemNumber IS NULL) OR (pSeqNumber IS NULL) OR (pItemNumber = '''') OR (pSeqNumber = '''') ) THEN
    RETURN NULL;
  END IF;

  SELECT bomitem_id INTO _returnVal
  FROM bomitem(getItemId(pItemNumber),COALESCE(getRevId(''BOM'',pItemNumber,pRevision)))
  WHERE (bomitem_seqnumber=pSeqNumber);
    
  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION ''Sequence % on Bill of Material % Revision % not found.'', pSeqNumber, pItemNumber, pRevision;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
