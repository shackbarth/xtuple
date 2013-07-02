drop function if exists xt.insert_client(text, text, text, text);

create or replace function xt.insert_client(code text, extension text, version text, language text) returns boolean as $$

  var extSql = "select ext_id from xt.ext where ext_name = $1",
    extId,
    sql = "insert into xt.clientcode (clientcode_code, clientcode_ext_id, clientcode_version, clientcode_language) values ($1, $2, $3, $4);";

  if(extension === '_core') {
    extId = null;
  } else {
    extId = plv8.execute(extSql, [extension])[0].ext_id;
  }

  plv8.execute(sql, [code, extId, version, language]);
  return true;

$$ language plv8;
