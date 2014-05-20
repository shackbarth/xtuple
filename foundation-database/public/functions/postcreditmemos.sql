
CREATE OR REPLACE FUNCTION postCreditMemos(BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostUnprinted ALIAS FOR $1;
  _cmhead RECORD;
  _result INTEGER;
  _return INTEGER        := 0;
  _itemlocSeries INTEGER := 0;

BEGIN

  _itemlocSeries := 0;

  FOR _cmhead IN SELECT cmhead_id
                 FROM cmhead
                 WHERE ( (NOT cmhead_posted)
                   AND   (NOT cmhead_hold)
                   AND   (checkCreditMemoSitePrivs(cmhead_id))
                   AND   ((pPostUnprinted) OR (cmhead_printed)) ) LOOP

    SELECT postCreditMemo(_cmhead.cmhead_id, _itemlocSeries) INTO _result;
    IF (_result < _return) THEN
      _return := _result;
    END IF;

  END LOOP;

  RETURN _return;

END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postCreditMemos(BOOLEAN, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostUnprinted ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  _r RECORD;
  _itemlocSeries INTEGER := 0;

BEGIN

  _itemlocSeries := 0;

  FOR _r IN SELECT cmhead_id
            FROM cmhead
            WHERE ( (NOT cmhead_posted)
              AND   (NOT cmhead_hold)
              AND   (checkCreditMemoSitePrivs(cmhead_id))
              AND   ((pPostUnprinted) OR (cmhead_printed)) ) LOOP

    SELECT postCreditMemo(_r.cmhead_id, pJournalNumber, _itemlocSeries) INTO _itemlocSeries;

  END LOOP;

  RETURN _itemlocSeries;

END;
' LANGUAGE 'plpgsql';
