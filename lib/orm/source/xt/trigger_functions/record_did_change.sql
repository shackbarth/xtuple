create or replace function xt.record_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

 var data = Object.create(XT.Data),
   table = TG_TABLE_SCHEMA + "." + TG_TABLE_NAME,
   oid = data.getTableOid(table),
   insert = TG_OP === 'INSERT',
   qry,
   shareParams,
   shareSql,
   sourceCode,
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
     sql = 'select ver_id from xt.ver where ver_table_oid = $1 and ver_record_id = $2;';
     qry = plv8.execute(sql, [oid, NEW[pkey]]);
     if (qry.length) {
       sql = 'update xt.ver set ver_etag = $1::uuid where ver_id = $2;';
       plv8.execute(sql, [ XT.generateUUID(), qry[0].ver_id - 0]);
     } else {
       insert = true;
     }
   }

   /* create a new version record if applicable */
   if (insert) {
     sql = 'insert into xt.ver (ver_table_oid, ver_record_id, ver_etag) values ($1, $2, $3::uuid);'
     plv8.execute(sql, [oid, NEW[pkey], XT.generateUUID()]);

     /* Add the user that's creating this record to the xt.obj_share. */
     if (NEW.obj_uuid && XT.username) {
       /* TODO: Should they get update and delete access? */
       shareSql = 'insert into xt.obj_share (obj_share_target_uuid, obj_share_username, obj_share_read) values ($1, $2, $3);'
       shareParams = [
         NEW.obj_uuid,
         XT.username,
         true
       ];

       if (DEBUG) {
         XT.debug('Record Insert user share sql =', shareSql);
         XT.debug('Record Insert user share values =', shareParams);
       }

       plv8.execute(shareSql, shareParams);
     }

   /* delete version record if applicable */
   } else if (TG_OP === 'DELETE') {
     sql =  'delete from xt.ver where ver_table_oid = $1 and ver_record_id = $2';
     plv8.execute(sql, [oid, OLD[pkey]]);
     return OLD
   }

   return NEW;

}());

$$ language plv8;
