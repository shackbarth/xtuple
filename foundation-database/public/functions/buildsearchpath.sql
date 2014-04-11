CREATE OR REPLACE FUNCTION buildSearchPath() RETURNS TEXT AS $$
DECLARE
  _path   TEXT    := '';
  _schema TEXT;
  _seq    INTEGER;
BEGIN
  -- get the schemas as ordered by the administrator
  SELECT concatagg(quote_ident(schemaord_name) || ',') INTO _path
    FROM (SELECT schemaord_name
            FROM schemaord
            LEFT OUTER JOIN pkghead ON (schemaord_name=pkghead_name)
           WHERE (pkghead_id IS NULL
               OR (pkghead_id IS NOT NULL AND packageisenabled(pkghead_id)))
           ORDER BY schemaord_order
         ) AS xtspq;

  -- add others that we think/know we need
  -- TODO: is there a reason not to include public, api, or packages?
  FOR _schema, _seq IN
      SELECT pkghead_name AS schema, 0 AS seq
        FROM pkghead
       WHERE packageisenabled(pkghead_id)
      UNION ALL
      SELECT 'public', 1
      UNION ALL
      SELECT 'api', 2
      ORDER BY seq, schema
  LOOP
    IF (_path !~* (E'(^|\\W)' || _schema || E'(\\W|$)')) THEN
      _path := _path || ',' || quote_ident(_schema);
    END IF;
  END LOOP;

  -- remove extraneous spaces and commas
  _path = BTRIM(REGEXP_REPLACE(_path, '( ?, ?)+', ',', 'g'),
                ', ');

  RAISE DEBUG 'buildSearchPath() returning %', _path;

  RETURN _path;
END;
$$
LANGUAGE 'plpgsql';

COMMENT ON FUNCTION buildSearchPath() IS
'buildSearchPath() examines the schemaord and pkghead tables to build a search
path string. It ensures that public, api, and all enabled packages are included
even if they are not listed in the schemaord table.
It returns the constructed search_path but does not set it.';
