CREATE OR REPLACE FUNCTION dropIfExists(TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN dropIfExists($1, $2, 'public');
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION dropIfExists(TEXT, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN dropIfExists($1, $2, $3, false);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION dropIfExists(TEXT, TEXT, TEXT, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pType         ALIAS FOR $1;
  pObject       ALIAS FOR $2;
  pSchema       ALIAS FOR $3;
  pCascade      ALIAS FOR $4;
  _table	TEXT;
  _query	TEXT;
BEGIN
  IF (UPPER(pType) = 'INDEX') THEN
    _query = 'DROP INDEX ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(pObject));
    
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_object OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSEIF (UPPER(pType) = 'TABLE') THEN
    _query = 'DROP TABLE ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(pObject)); 
    
    IF (pCascade) THEN
      _query = _query || ' CASCADE';
    END IF;

    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_table OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'VIEW') THEN
    _query = 'DROP VIEW ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(pObject));

    IF (pCascade) THEN
      _query = _query || ' CASCADE';
    END IF;
    
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_table OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'TRIGGER') THEN
    SELECT relname INTO _table
    FROM pg_trigger, pg_class
    WHERE ((tgrelid=pg_class.oid)
      AND  (UPPER(tgname)=UPPER(pObject)));
    IF (NOT FOUND) THEN
      _table := '[no table]';
    END IF;

    _query = 'DROP TRIGGER ' || quote_ident(LOWER(pObject)) ||
	     ' ON ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(_table));
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_object THEN
		RETURN 0;
	      WHEN undefined_table OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'FUNCTION') THEN
    _query = 'DROP FUNCTION ' || (LOWER(pSchema)) || '.' ||
                                   (LOWER(pObject));
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_object OR undefined_function OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'CONSTRAINT') THEN
    IF( (SELECT count(*)
           FROM pg_constraint, pg_class, pg_namespace
          WHERE((conrelid=pg_class.oid)
            AND (connamespace=pg_namespace.oid)
            AND (conname=pObject)
            AND (nspname=pSchema))
         ) > 1 ) THEN
      RAISE EXCEPTION 'dropIfExists called on constraint name that matches more than 1 constraint.';
    END IF;
    SELECT relname INTO _table
    FROM pg_constraint, pg_class, pg_namespace
    WHERE ((conrelid=pg_class.oid)
      AND  (connamespace=pg_namespace.oid)
      AND  (conname=pObject)
      AND  (nspname=pSchema));
    IF (NOT FOUND) THEN
      RETURN 0;
    END IF;
    _query = 'ALTER TABLE ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(_table))
             || ' DROP CONSTRAINT ' || quote_ident(LOWER(pObject));
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_table OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'SCHEMA') THEN
    _query = 'DROP SCHEMA ' || quote_ident(LOWER(pObject));
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN invalid_schema_name THEN
                RETURN 0;
              WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSIF (UPPER(pType) = 'TYPE') THEN
    _query = 'DROP TYPE ' || quote_ident(LOWER(pSchema)) || '.' ||
                               quote_ident(LOWER(pObject));
    IF (pCascade) THEN
      _query = _query || ' CASCADE';
    END IF;
    
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_object OR invalid_schema_name THEN
                RETURN 0;
              WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSE
    RAISE EXCEPTION 'dropIfExists(%, %): unknown pType %', pType, pObject, pType;
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION dropIfExists(TEXT, TEXT, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pType         ALIAS FOR $1;
  pObject       ALIAS FOR $2;
  pSchema       ALIAS FOR $3;
  pRelation     ALIAS FOR $4;
  _table        TEXT;
  _query	TEXT;
BEGIN
  IF (UPPER(pType) = 'CONSTRAINT') THEN
    SELECT relname INTO _table
    FROM pg_constraint, pg_class, pg_namespace
    WHERE ((conrelid=pg_class.oid)
      AND  (connamespace=pg_namespace.oid)
      AND  (conname=pObject)
      AND  (relname=pRelation)
      AND  (nspname=pSchema));
    IF (NOT FOUND) THEN
      RETURN 0;
    END IF;
    _query = 'ALTER TABLE ' || quote_ident(LOWER(pSchema)) || '.' || quote_ident(LOWER(pRelation))
             || ' DROP CONSTRAINT ' || quote_ident(LOWER(pObject));
    BEGIN
      EXECUTE _query;
    EXCEPTION WHEN undefined_table OR invalid_schema_name THEN
		RETURN 0;
	      WHEN OTHERS THEN RAISE EXCEPTION '% %', SQLSTATE, SQLERRM;
    END;

  ELSE
    RAISE EXCEPTION 'dropIfExists(%, %, %, %): pType % is not supported when relation is specified', pType, pObject, pSchema, pRelation, pType;
  END IF;

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';

