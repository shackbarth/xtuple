CREATE OR REPLACE FUNCTION setNextNumber(TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  psequence	ALIAS FOR $1;
  pnumber	ALIAS FOR $2;
  _orderseqid	INTEGER;

BEGIN
  SELECT orderseq_id INTO _orderseqid
  FROM orderseq
  WHERE (orderseq_name=psequence);

  IF (NOT FOUND) THEN
    INSERT INTO orderseq (orderseq_name, orderseq_number,
			  orderseq_table, orderseq_numcol)
		  VALUES (psequence,     pnumber,
			  CASE WHEN (psequence='APMemoNumber') THEN 'apopen'
			       WHEN (psequence='ARMemoNumber') THEN 'aropen'
			       WHEN (psequence='CmNumber') THEN 'cmhead'
			       WHEN (psequence='IncidentNumber') THEN 'incdt'
			       WHEN (psequence='InvcNumber') THEN 'invchead'
			       WHEN (psequence='JournalNumber') THEN 'gltrans'
			       WHEN (psequence='PlanNumber') THEN 'planord'
			       WHEN (psequence='PoNumber') THEN 'pohead'
			       WHEN (psequence='PrNumber') THEN 'pr'
			       WHEN (psequence='QuNumber') THEN 'quhead'
			       WHEN (psequence='ShipmentNumber') THEN 'shiphead'
			       WHEN (psequence='SoNumber') THEN 'cohead'
			       WHEN (psequence='ToNumber') THEN 'tohead'
			       WHEN (psequence='VcNumber') THEN 'vohead'
			       WHEN (psequence='WoNumber') THEN 'wo'
			       ELSE ''
			  END,
			  CASE WHEN (psequence='APMemoNumber') THEN 'apopen_docnumber'
			       WHEN (psequence='ARMemoNumber') THEN 'aropen_docnumber'
			       WHEN (psequence='CmNumber') THEN 'cmhead_number'
			       WHEN (psequence='IncidentNumber') THEN 'incdt_number'
			       WHEN (psequence='InvcNumber') THEN 'invchead_invcnumber'
			       WHEN (psequence='JournalNumber') THEN 'gltrans_journalnumber'
			       WHEN (psequence='PlanNumber') THEN 'planord_number'
			       WHEN (psequence='PoNumber') THEN 'pohead_number'
			       WHEN (psequence='PrNumber') THEN 'pr_number'
			       WHEN (psequence='QuNumber') THEN 'quhead_number'
			       WHEN (psequence='ShipmentNumber') THEN 'shiphead_number'
			       WHEN (psequence='SoNumber') THEN 'cohead_number'
			       WHEN (psequence='ToNumber') THEN 'tohead_number'
			       WHEN (psequence='VcNumber') THEN 'vohead_number'
			       WHEN (psequence='WoNumber') THEN 'wo_number'
			       ELSE ''
			  END
			  );
  ELSE
    UPDATE orderseq
    SET orderseq_number=pnumber
    WHERE (orderseq_name=psequence);
  END IF;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
