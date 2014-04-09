CREATE OR REPLACE FUNCTION packageIsEnabled(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT COUNT(*) >= 8
  FROM pg_inherits, pg_class, pg_namespace, pkghead
  WHERE ((inhrelid=pg_class.oid)
     AND (relnamespace=pg_namespace.oid)
     AND  (nspname=lower(pkghead_name))
     AND  (pkghead_id=$1));
$$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION packageIsEnabled(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT COUNT(*) >= 8
  FROM pg_inherits, pg_class, pg_namespace
  WHERE ((inhrelid=pg_class.oid)
     AND (relnamespace=pg_namespace.oid)
     AND  (nspname=lower($1)));
$$
LANGUAGE 'sql';
