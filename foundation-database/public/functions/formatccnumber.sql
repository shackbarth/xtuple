CREATE OR REPLACE FUNCTION formatccnumber(text)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCcardnum ALIAS FOR $1;
  card_length INTEGER;
  output_cardnum TEXT;

BEGIN

  card_length := length(pCcardnum);

  IF (card_length = 13) THEN
    output_cardnum := ''*********'' || substr(pCcardnum, 10, 4);  
  END IF;

  IF (card_length = 14) THEN
    output_cardnum := ''**********'' || substr(pCcardnum, 11, 4);  
  END IF;

  IF (card_length = 15) THEN
    output_cardnum := ''***********'' || substr(pCcardnum, 12, 4);  
  END IF;

  IF (card_length = 16) THEN
    output_cardnum := ''************'' || substr(pCcardnum, 13, 4);  
  END IF;

  RETURN output_cardnum;

END;
'
  LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION formatccnumber(bytea)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCcardnum ALIAS FOR $1;
  card_length INTEGER;
  output_cardnum TEXT;

BEGIN

  card_length := length(pCcardnum);

  IF (card_length = 13) THEN
    output_cardnum := ''*********'' || substr(pCcardnum, 10, 4);  
  END IF;

  IF (card_length = 14) THEN
    output_cardnum := ''**********'' || substr(pCcardnum, 11, 4);  
  END IF;

  IF (card_length = 15) THEN
    output_cardnum := ''***********'' || substr(pCcardnum, 12, 4);  
  END IF;

  IF (card_length = 16) THEN
    output_cardnum := ''************'' || substr(pCcardnum, 13, 4);  
  END IF;

  RETURN output_cardnum;

END;
'
  LANGUAGE 'plpgsql';
