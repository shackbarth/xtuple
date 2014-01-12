drop function if exists xt.set_dictionary(text, text, text);

create or replace function xt.set_dictionary(strings text, context text, language text) 
    returns boolean volatile as $$

return (function () {

  var isDatabase = (context === '_database_') ? true : false,
    isFramework = (context === '_framework_') ? true : false,
    sqlExtension = "select ext_id from xt.ext where ext_name = $1",
    extensions,
    extensionId = null,
    sqlCount = "select count(*) as count from xt.dict where dict_language_name = $1 " +
      "and (dict_ext_id = $2 or (dict_ext_id is null and $2 is null)) and dict_is_database = $3 " +
      "and dict_is_framework = $4;",
    count,
    /* TODO: set user and date */
    sqlUpdate = "update xt.dict set dict_strings = $1 " +
      "where dict_language_name = $2 " +
      "and (dict_ext_id = $3 or (dict_ext_id is null and $3 is null)) " +
      "and dict_is_database = $4 and dict_is_framework = $5;",
    sqlInsert = "insert into xt.dict " +
      "(dict_strings, dict_language_name, dict_ext_id, dict_is_database, dict_is_framework) " +
      " values ($1, $2, $3, $4, $5);";

  /* determine the extension ID, or null if it's core */
  if (context !== '_database_' && context !== '_core_' && context !== '_framework_') {
    extensions = plv8.execute(sqlExtension, [context]);
    if (extensions.length === 0) {
      /* The extension in the translation file is not registered in the db. 
        Do not bother to import it */
      return;
    }
    extensionId = extensions[0].ext_id;
  }

  count = plv8.execute(sqlCount, [language, extensionId, isDatabase, isFramework])[0].count;
  if(count > 0) {
    plv8.execute(sqlUpdate, [strings, language, extensionId, isDatabase, isFramework]);
  } else {
    plv8.execute(sqlInsert, [strings, language, extensionId, isDatabase, isFramework]);
  }

}());

$$ language plv8;
