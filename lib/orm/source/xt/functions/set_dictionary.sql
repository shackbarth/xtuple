drop function if exists xt.set_dictionary(text, text, text);

create or replace function xt.set_dictionary(strings text, context text, language text) 
    returns boolean volatile as $$

  var isDatabase = (context === '_database_') ? true : false,
    sqlExtension = "select ext_id from xt.ext where ext_name = $1",
    extensionId = null,
    sqlCount = "select count(*) as count from xt.dict where dict_language_name = $3 " +
      "and (dict_ext_id = $1 or (dict_ext_id is null and $1 is null)) and dict_is_database = $2;",
    count,
    /* TODO: set user and date */
    sqlUpdate = "update xt.dict set dict_strings = $1 " +
      "where dict_language_name = $4 " +
      "and (dict_ext_id = $2 or (dict_ext_id is null and $2 is null)) and dict_is_database = $3;",
    sqlInsert = "insert into xt.dict " +
      "(dict_language_name, dict_strings, dict_ext_id, dict_is_database) " +
      " values ($4, $1, $2, $3);";

  /* determine the extension ID, or null if it's core */
  if (context !== '_database_' && context !== '_core_') {
    extensionId = plv8.execute(sqlExtension, [context])[0].ext_id;
  }

  count = plv8.execute(sqlCount, [extensionId, isDatabase, language])[0].count;
  if(count > 0) {
    plv8.execute(sqlUpdate, [strings, extensionId, isDatabase, language]);
  } else {
    plv8.execute(sqlInsert, [strings, extensionId, isDatabase, language]);
  }

$$ language plv8;
