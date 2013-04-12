create or replace function xt.record_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var qry,
   sql,
   pkey,
   rec,
   id;

   /* find the primary key */
   sql = 'select pg_attribute.attname as key ' +
         'from pg_attribute, pg_class ' +
         'where pg_class.relnamespace = (' +
         ' select oid ' +
         ' from pg_namespace ' +
         ' where pg_namespace.nspname = $1) ' +
         '  and pg_class.oid in ( ' +
         '    select indexrelid ' +
         '    from pg_index ' +
         '    where indisprimary = true ' +
         '      and indrelid in ( ' +
         '        select oid ' +
         '        from pg_class ' + 
         '        where lower(relname) = $2)) ' +
         ' and pg_attribute.attrelid = pg_class.oid ' +
         ' and pg_attribute.attisdropped = false ';
   qry = plv8.execute(sql, [TG_TABLE_SCHEMA, TG_TABLE_NAME]);
   if (qry.length === 0) { throw "No primary key on table " + table; };
   if (qry.length > 1) { throw "Compound primary keys not supported for " + table; };
   pkey = qry[0].key;

   /* set up variables */
   rec= TG_OP === 'DELETE' ? OLD : NEW;
   id = rec[pkey];
   sql = 'select xt.update_version($1,$2,$3,$4);'

   /* perform update */
   plv8.execute(sql, [TG_TABLE_SCHEMA, TG_TABLE_NAME, id, TG_OP]);
   return rec

$$ language plv8;
