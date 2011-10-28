SELECT
  tablename AS table,
  attname AS column,
  typname AS type,
  attnum AS order,
  attnotnull AND NOT atthasdef AS required,
  COALESCE(
    description ~* 'deprecated', false
  ) AS deprecated,
  TRIM(
    quote_literal('"''') FROM
      SUBSTRING(
        pg_catalog.pg_get_expr(adbin, adrelid) FROM
        '[' || quote_literal('"''') ||
        '].*[' || quote_literal('"''') || ' ]'
      )
  ) AS sequence,
  ARRAY[attnum] <@ conkey AS "constrained"
FROM
  pg_tables
LEFT JOIN
  pg_class ON tablename=pg_class.relname
LEFT OUTER JOIN
  pg_attribute ON pg_class.oid=pg_attribute.attrelid
LEFT JOIN
  pg_type ON pg_attribute.atttypid=pg_type.oid
LEFT JOIN
  pg_namespace ON relnamespace=pg_namespace.oid
LEFT OUTER JOIN
  pg_description ON (
    attrelid=pg_description.objoid
      AND attnum=pg_description.objsubid
  )
LEFT OUTER JOIN
  pg_attrdef ON (
    adrelid = attrelid
    AND adnum = attnum
    AND pg_catalog.pg_get_expr(adbin, adrelid) ~ 'nextval'
  )
LEFT OUTER JOIN
  pg_constraint ON (
    pg_class.oid=conrelid
    AND contype='p'
    AND ARRAY[attnum] <@ conkey
  )
WHERE schemaname='public'
  AND attnum > 0
  AND NOT attisdropped;
