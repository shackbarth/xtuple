CREATE OR REPLACE FUNCTION isDBA(TEXT DEFAULT NULL) RETURNS BOOLEAN AS $$
  SELECT (datdba=pg_roles.oid OR rolsuper) AS issuper
    FROM pg_database, pg_roles
  WHERE ((datname=current_database())
     AND (rolname=COALESCE($1, getEffectiveXtUser())));
$$ LANGUAGE SQL;
