create or replace function xt.record_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var data = Object.create(XT.Data),
   table = TG_TABLE_SCHEMA + "." + TG_TABLE_NAME,
   oid = data.getTableOid(table),
   insert = TG_OP === 'INSERT',
   qry,
   sql,
   pkey;

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

   if (TG_OP === 'UPDATE') {
     /* find a version record, if found increment */
     sql = 'select ver_id, ver_version from xt.ver where ver_table_oid = $1 and ver_record_id = $2;';
     qry = plv8.execute(sql, [oid, NEW[pkey]]);
     if (qry.length) {
       sql = 'update xt.ver set ver_version = $1 where ver_id = $2;';
       plv8.execute(sql, [qry[0].ver_version + 1, qry[0].ver_id - 0]);
     } else {
       insert = true;
     }
   }

   /* create a new version record if applicable */
   if (insert) {
     sql = 'insert into xt.ver (ver_table_oid, ver_record_id, ver_version) values ($1, $2, 1);'
     plv8.execute(sql, [oid, NEW[pkey]]);

   /* delete version record if applicable */
   } else if (TG_OP === 'DELETE') {
     sql =  'delete from xt.ver where ver_table_oid = $1 and ver_record_id = $2';
     plv8.execute(sql, [oid, OLD[pkey]]);
     return OLD
   }
   
   return NEW;

$$ language plv8;
