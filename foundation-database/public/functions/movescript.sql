CREATE OR REPLACE FUNCTION moveScript(INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pscriptid ALIAS FOR $1;
  poldpkgid ALIAS FOR $2;
  pnewpkgid ALIAS FOR $3;

  _deletestr    TEXT;
  _destination  TEXT;
  _insertstr    TEXT;
  _rows         INTEGER;
  _selectstr    TEXT;
  _source       TEXT;
  _record       RECORD;

BEGIN
  IF (poldpkgid = pnewpkgid) THEN
    RETURN 0;
  END IF;

  IF (poldpkgid = -1) THEN
    _source = 'public.script';
  ELSE
    SELECT pkghead_name || '.pkgscript' INTO _source
    FROM pkghead
    WHERE pkghead_id=poldpkgid;

    IF NOT FOUND THEN
      RETURN -1;
    END IF;
  END IF;

  IF (pnewpkgid = -1) THEN
    _destination = 'public.script';
  ELSE
    SELECT pkghead_name || '.pkgscript' INTO _destination
    FROM pkghead
    WHERE pkghead_id=pnewpkgid;

    IF NOT FOUND THEN
      RETURN -2;
    END IF;
  END IF;

  _selectstr := ' SELECT * FROM ' || _source ||
                ' WHERE script_id = ' || pscriptid;
  EXECUTE _selectstr INTO _record;

  _deletestr := 'DELETE FROM ONLY ' || _source || 
                ' WHERE script_id = ' || pscriptid;
  EXECUTE _deletestr;
  GET DIAGNOSTICS _rows = ROW_COUNT;
  RAISE NOTICE '% rows from %', _rows, _deletestr;
  IF (_rows < 1) THEN
    RETURN -3;
  ELSIF (_rows > 1) THEN
    RAISE EXCEPTION 'Tried to delete % scripts with the id % when there should be exactly 1',
                    _rows, pscriptid;
  END IF;

  _insertstr := 'INSERT INTO ' || _destination ||
                ' (script_id, script_name, script_order, script_enabled, ' ||
                '  script_source, script_notes) VALUES ('
                || _record.script_id      || ','
                || quote_literal(_record.script_name)    || ','
                || _record.script_order   || ','
                || _record.script_enabled || ','
                || quote_literal(_record.script_source)  || ','
                || quote_literal(_record.script_notes )  || ');'
                ;
  EXECUTE _insertstr;
  GET DIAGNOSTICS _rows = ROW_COUNT;
  RAISE NOTICE '% rows from %', _rows, _insertstr;
  IF (_rows < 1) THEN
    RETURN -4;
  ELSIF (_rows > 1) THEN
    RAISE EXCEPTION 'Tried to insert % scripts with the id % when there should be exactly 1',
                    _rows, pscriptid;
  END IF;

  RETURN pscriptid;

END;
$$ LANGUAGE 'plpgsql';
