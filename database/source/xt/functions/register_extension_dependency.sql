drop function if exists xt.register_extension_dependency(text, text);

create or replace function xt.register_extension_dependency(from_extension text, to_extension text) returns boolean volatile as $$

  var sqlResolve,
    fromResults,
    fromId,
    toResults,
    toId,
    sqlCount,
    count,
    sqlInsertl

  sqlResolve = "select ext_id from xt.ext where ext_name = $1;";
  fromResults = plv8.execute(sqlResolve, [ from_extension ]);
  fromId = fromResults[0].ext_id;
  toResults = plv8.execute(sqlResolve, [ to_extension ]);
  if (!toResults || toResults.length === 0) {
    plv8.elog(ERROR, "Cannot find extension", to_extension, "to register as a dependency");
  }
  toId = toResults[0].ext_id;
  sqlCount = "select count(*) as count from xt.extdep where extdep_from_ext_id = $1 AND extdep_to_ext_id = $2;";
  count = plv8.execute(sqlCount, [ fromId, toId ])[0].count;
  sqlInsert = "insert into xt.extdep (extdep_from_ext_id, extdep_to_ext_id) values ($1, $2)"; 

  if(count > 0) {
    return false;
  }

  plv8.execute(sqlInsert, [fromId, toId]);
  return true;

$$ language plv8;

