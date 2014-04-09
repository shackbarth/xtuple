CREATE OR REPLACE FUNCTION grantAllModuleCmnttypeSource(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmnttypeid ALIAS FOR $1;
  pModuleName ALIAS FOR $2;
  _source RECORD;
  _sourceCounter INTEGER;

BEGIN

  _sourceCounter := 0;

  FOR _source IN SELECT source_id
                 FROM source 
                 WHERE (source_module=pModuleName) LOOP

    IF (SELECT grantCmnttypeSource(pCmnttypeid, _source.source_id)) THEN
      _sourceCounter := _sourceCounter + 1;
    END IF;

  END LOOP;

  RETURN _sourceCounter;

END;
$$ LANGUAGE 'plpgsql';

