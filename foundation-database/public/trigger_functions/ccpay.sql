CREATE OR REPLACE FUNCTION _ccpayBeforeTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cardType TEXT;

BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- If ccpay_ccard_id is set, we don't care if ccpay_card_type is set,
    -- we want to get the Card Type from ccard.
    IF (NEW.ccpay_ccard_id IS NOT NULL) THEN
      SELECT ccard_type INTO _cardType
      FROM ccard
      WHERE ccard_id = NEW.ccpay_ccard_id;

      IF (_cardType IS NOT NULL) THEN
        NEW.ccpay_card_type = _cardType;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$   LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'ccpayBeforeTrigger');
CREATE TRIGGER ccpayBeforeTrigger BEFORE INSERT OR UPDATE ON ccpay FOR EACH ROW EXECUTE PROCEDURE _ccpayBeforeTrigger();
