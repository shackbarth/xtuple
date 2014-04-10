CREATE OR REPLACE FUNCTION formatCCdashes(text, text)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCCard ALIAS FOR $1;
  pCCardType ALIAS FOR $2;
  _returnCard text;
  card_length integer;

BEGIN

  IF (pCCardType = ''A'')  THEN
    _returnCard := pCCard;
    RETURN _returnCard;
  END IF;

  card_length := length(pCcard);

  if (card_length = 16) THEN
    _returnCard := substr(pCCard, 1, 4) || ''-'' || substr(pCCard, 5, 4) || ''-'' || substr(pCCard, 9, 4) || ''-'' || substr(pCCard, 13, 4);
  ELSE
    _returnCard := substr(pCCard, 1, 4) || ''-'' || substr(pCCard, 5, 4) || ''-'' || substr(pCCard, 9, 4) || ''-'' || substr(pCCard, 13, 1);
  END IF;

  RETURN _returnCard;

END;
'
  LANGUAGE 'plpgsql';
