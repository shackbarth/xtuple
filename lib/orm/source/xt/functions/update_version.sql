/**
  Update version information for a record.

  @param{String} Schema name
  @param{String} Table name
  @param{Number} Record Id
  @param{String} Operation: INSERT, UPDATE or DELETE
*/
create or replace function xt.update_version(schema_name text, table_name text, id integer, operation text) returns boolean as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 var data = Object.create(XT.Data),
   table = schema_name + "." + table_name,
   oid = data.getTableOid(table),
   insert = operation === 'INSERT',
   qry,
   sql;

   if (operation === 'UPDATE') {
     /* find a version record, if found increment */
     sql = 'select ver_id, ver_version from xt.ver where ver_table_oid = $1 and ver_record_id = $2;';
     qry = plv8.execute(sql, [oid, id]);
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
     plv8.execute(sql, [oid, id]);

   /* delete version record if applicable */
   } else if (operation === 'DELETE') {
     sql =  'delete from xt.ver where ver_table_oid = $1 and ver_record_id = $2';
     plv8.execute(sql, [oid, id]);
   }
   
   return true;

$$ language plv8;
