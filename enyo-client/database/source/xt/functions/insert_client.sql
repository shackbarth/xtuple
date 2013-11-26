drop function if exists xt.insert_client(text, text, text, text);

create or replace function xt.insert_client(code text, extension text, version text, language text) returns boolean as $$

  var extSql = "select ext_id from xt.ext where ext_name = $1",
    extRow,
    extId,
    existingSql = "select clientcode_id from xt.clientcode " +
      " where (clientcode_ext_id = $1 or (clientcode_ext_id is null and $1 is null))" +
      " and clientcode_version = $2 and clientcode_language = $3",
    existingResults,
    existingId,
    insertSql = "insert into xt.clientcode " +
      "(clientcode_code, clientcode_ext_id, clientcode_version, clientcode_language) " +
      "values ($1, $2, $3, $4);";
    updateSql = "update xt.clientcode " +
      "set clientcode_code = $1, clientcode_ext_id = $2, clientcode_version = $3, clientcode_language = $4, obj_uuid = xt.uuid_generate_v4() " +
      "where clientcode_id = $5;";

  if(extension === '_core') {
    extId = null;
  } else {
    extRow = plv8.execute(extSql, [extension])[0];
    if (!extRow) {
      plv8.elog(ERROR, "Cannot find extension " + extension + ". Make sure " +
        "the name in register.sql is identical to the directory name.");
      return false;
    }
    extId = extRow.ext_id;

  }

  existingResults = plv8.execute(existingSql, [extId, version, language]);
  existingId = existingResults.length && existingResults[0].clientcode_id;

  if(existingId) {
    plv8.execute(updateSql, [code, extId, version, language, existingId]);
  } else {
    plv8.execute(insertSql, [code, extId, version, language]);
  }
  return true;

$$ language plv8;
