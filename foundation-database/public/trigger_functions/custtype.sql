CREATE OR REPLACE FUNCTION _custtypeTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check      BOOLEAN;
  _code       TEXT;

BEGIN

--  Checks
  IF (TG_OP IN ('INSERT','UPDATE')) THEN

    IF (LENGTH(COALESCE(NEW.custtype_code, ''))=0) THEN
      RAISE EXCEPTION 'You must supply a valid Customer Type Code.';
    END IF;

    SELECT custtype_code INTO _code
    FROM custtype
    WHERE ( (UPPER(custtype_code)=UPPER(NEW.custtype_code))
      AND (custtype_id<>NEW.custtype_id) );
    IF (FOUND) THEN
      RAISE EXCEPTION 'The Customer Type Code entered cannot be used as it is in use.';
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

SELECT dropIfExists('TRIGGER', 'custtypeTrigger');
CREATE TRIGGER custtypeTrigger BEFORE INSERT OR UPDATE ON custtype FOR EACH ROW EXECUTE PROCEDURE _custtypeTrigger();

CREATE OR REPLACE FUNCTION _custtypeAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (SELECT fetchMetricValue('DefaultCustType') = OLD.custtype_id) THEN
    RAISE EXCEPTION 'Cannot delete the default Customer Type [xtuple: custtype, -1, %]',
                    OLD.custtype_code;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS custtypeAfterDeleteTrigger ON custtype;
CREATE TRIGGER custtypeAfterDeleteTrigger AFTER DELETE ON custtype
  FOR EACH ROW EXECUTE PROCEDURE _custtypeAfterDeleteTrigger();
