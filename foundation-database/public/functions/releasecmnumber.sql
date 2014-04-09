CREATE OR REPLACE FUNCTION releaseCMNumber(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT releaseNumber('CmNumber', $1) > 0;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION releaseCMNumber(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT releaseNumber('CmNumber', $1::INTEGER) > 0;
$$ LANGUAGE sql;

