#!/usr/bin/python2.7

# ===================================================
# Generate at least normalized models from a target
# schema for either client/server (node).
#
# @note Written for Python 2.7.1
# 
# @author W. Cole Davis
# @release 10/26/2011
# ===================================================

import psycopg2
import argparse

from psycopg2 import extras

# Setup the options parser to handle any CLI arguments
# supplied by the user.
parser = argparse.ArgumentParser(description="""
  Generate normalized models from all tables in a specific
  schema for a particular platform. Additional features
  may be added in the future to allow more freedom with
  options and outputs.
""")

# Supply the arguments to the parser
parser.add_argument(
  "-s, --schema", dest="schema", help="the target schema, default=public", default="public"
)
parser.add_argument(
  "-d, --database", dest="db", help="the database to examine, default=dev", default="dev"
)
parser.add_argument(
  "-H, --host", dest="host", help="the host for the database, default=dev.xtuple.com", default="dev.xtuple.com"
)
parser.add_argument(
  "-p, --port", dest="port", help="the port for the database, default=7000", type=int, default=7000 
)
parser.add_argument(
  "-P, --password", dest="password", help="the password for the database user", required=True
)
parser.add_argument(
  "-u, --user", dest="user", help="the username for the database user", required=True
)

# Parse the arguments supplied to the script
args = parser.parse_args()

query = """
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
WHERE schemaname='%s'
  AND attnum > 0
  AND NOT attisdropped;
""" % (args.schema)

conn_string = "dbname='%s' user='%s' password='%s' host='%s' port='%d'" % (
  args.db, args.user, args.password, args.host, args.port
)

try:
  conn = psycopg2.connect(conn_string)
except:
  print "Could not connect to the database with provided credentials"
  print conn_string
  exit(-1)

# Grab the driver-cursor (not the same as PostgreSQL cursor!)
cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
cur.execute(query)

rows = cur.fetchall()
for row in rows:
    print row.keys()





exit(0)
