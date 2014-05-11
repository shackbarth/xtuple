CREATE OR REPLACE FUNCTION _cashRcptTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check      BOOLEAN;
  _checkId    INTEGER;
  _currId     INTEGER;
  _bankCurrId INTEGER;
  _currrate   NUMERIC;

BEGIN

  -- Checks
  -- Start with privileges
  IF (TG_OP = 'INSERT') THEN
    SELECT checkPrivilege('MaintainCashReceipts') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION 'You do not have privileges to add new Cash Receipts.';
    END IF;
  ELSE
    SELECT checkPrivilege('MaintainCashReceipts') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION 'You do not have privileges to alter a Cash Receipt.';
    END IF;
  END IF;

  -- Currency must be same as Bank Currency
  IF (TG_OP = 'INSERT') THEN
    _currId = COALESCE(NEW.cashrcpt_curr_id, basecurrid());

     --- clear the number from the issue cache
    PERFORM clearNumberIssue('CashRcptNumber', NEW.cashrcpt_number);
  ELSE
    _currId = NEW.cashrcpt_curr_id;
  END IF;

-- get the base exchange rate for the dist date
  IF (NEW.cashrcpt_curr_rate IS NULL) THEN
    SELECT curr_rate INTO _currrate
    FROM curr_rate
    WHERE ( (NEW.cashrcpt_curr_id=curr_id)
      AND ( NEW.cashrcpt_distdate BETWEEN curr_effective 
                                 AND curr_expires) );
    IF (FOUND) THEN
      NEW.cashrcpt_curr_rate := _currrate;
    ELSE
      RAISE EXCEPTION 'Currency exchange rate not found';
    END IF;
  END IF;

  -- Create CashReceiptPosted Event
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.cashrcpt_posted=FALSE AND NEW.cashrcpt_posted=TRUE) THEN
      PERFORM postEvent('CashReceiptPosted', NULL, NEW.cashrcpt_id,
                        NULL,
                        (cust_number || '-' ||
                        NEW.cashrcpt_docnumber || ' ' ||
                        currConcat(NEW.cashrcpt_curr_id) ||
                        formatMoney(NEW.cashrcpt_amount)),
                        NULL, NULL, NULL, NULL)
      FROM custinfo
      WHERE (cust_id=NEW.cashrcpt_cust_id);
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cashRcptTrigger');
CREATE TRIGGER cashRcptTrigger BEFORE INSERT OR UPDATE ON cashrcpt FOR EACH ROW EXECUTE PROCEDURE _cashRcptTrigger();
