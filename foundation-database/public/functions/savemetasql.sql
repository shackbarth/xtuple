CREATE OR REPLACE FUNCTION saveMetasql(TEXT, TEXT, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN saveMetasql($1, $2, $3, $4, true, NULL, 0);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION saveMetasql(TEXT,TEXT,TEXT,TEXT,BOOL) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN saveMetasql($1, $2, $3, $4, $5, NULL, 0);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION saveMetasql(TEXT,TEXT,TEXT,TEXT,BOOL,TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN saveMetasql($1, $2, $3, $4, $5, $6, 0);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION saveMetasql(TEXT,TEXT,TEXT,TEXT,BOOL,TEXT,INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pGroup	ALIAS FOR $1;
  pName 	ALIAS FOR $2;
  pNotes	ALIAS FOR $3;
  pQuery	ALIAS FOR $4;
  pSystem       ALIAS FOR $5;
  pSchema       ALIAS FOR $6;
  pGrade        ALIAS FOR $7;
  _metasqlid	INTEGER;
  _debug        BOOL    := false;
  _grade        INTEGER;
  _insertstr    TEXT;
  _table        TEXT;
  
BEGIN

  --See if Query already exists
  SELECT metasql_id INTO _metasqlid
  FROM metasql
  WHERE ((metasql_group=pGroup)
     AND (metasql_name=pName)
     AND (metasql_grade=pGrade));

  IF (FOUND) THEN
    IF (_debug) THEN RAISE NOTICE 'update metasql'; END IF;
    UPDATE metasql SET
      metasql_group=pGroup,
      metasql_name=pName,
      metasql_notes=pNotes,
      metasql_query=pQuery
    WHERE (metasql_id=_metasqlid);
  ELSE
    IF (COALESCE(pSchema, 'public') = 'public' OR
        TRIM(pSchema) = '') THEN
      _table := 'metasql';
    ELSE
      _table := pSchema || '.pkgmetasql';
    END IF;

    IF (pGrade IS NULL) THEN
      SELECT MAX(metasql_grade) + 1 INTO _grade
      FROM metasql
      WHERE ((metasql_group=pGroup)
         AND (metasql_name=pName));
    ELSE
      _grade := pGrade;
    END IF;

    _insertstr := 'INSERT INTO ' || _table ||
                  ' (metasql_group, metasql_name, metasql_notes, ' ||
                  '  metasql_query, metasql_grade) VALUES (' ||
                  COALESCE(quote_literal(pGroup),'NULL') || ',' || COALESCE(quote_literal(pName), 'NULL') || ',' ||
                  COALESCE(quote_literal(pNotes), 'NULL') || ',' || COALESCE(quote_literal(pQuery), 'NULL') ||',' ||
                  COALESCE(quote_literal(_grade), 'NULL') || ') RETURNING metasql_id;' ;

    IF (_debug) THEN RAISE NOTICE '%', _insertstr; END IF;
    EXECUTE _insertstr INTO _metasqlid;
  END IF;
 
  RETURN _metasqlid;
END;
$$ LANGUAGE 'plpgsql';
