SELECT dropIfExists('TRIGGER', 'prTrigger');

CREATE OR REPLACE FUNCTION _prTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  --- clear the number from the issue cache
  PERFORM clearNumberIssue('PrNumber', NEW.pr_number);

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER prTrigger AFTER INSERT ON pr FOR EACH ROW EXECUTE PROCEDURE _prTrigger();
