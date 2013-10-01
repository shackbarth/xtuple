drop function if exists xt.set_dictionary_strings(text, text);

create or replace function xt.set_dictionary(strings text, context text) 
    returns boolean volatile as $$

  var sqlEnglish = "select dict_id from xt.dict where dict_language_name = 'en_US';",
    sqlCreateEnglish = "insert into xt.dict (dict_language_name) values ('en_US');",
    englishRow,
    englishId,
    sqlSelect = "select * from xt.dictentry where dictentry_dict_id = $1;",
    dbStrings,
    isDatabase = (context === '_database_') ? true : false,
    sqlExtension = "select ext_id from xt.ext where ext_name = $1",
    extensionId = null,
    inputStrings = JSON.parse(strings),
    key,
    value,
    dbTranslation,
    i,
    sqlUpdate = "update xt.dictentry set dictentry_translation = $1 " +
      "where dictentry_dict_id = $2 and dictentry_key = $3;",
    sqlInsert = "insert into xt.dictentry " +
      "(dictentry_dict_id, dictentry_key, dictentry_translation, dictentry_ext_id, dictentry_is_database) " +
      " values ($1, $2, $3, $4, $5);";
    englishRow = plv8.execute(sqlEnglish);

  /* determine the extension Id, or null if it's core */
  if (context !== '_database_' && context !== '_null_') {
    extensionId = plv8.execute(sqlExtension, [context])[0].ext_id;
  }

  /* determine the ID of the english language dictionary */
  if(englishRow.length > 0) {
    englishId = englishRow[0].dict_id;
  } else {
    /* need to make the english dictionary */
    englishRow = plv8.execute(sqlEnglish);
    englishId = englishRow[0].dict_id;
  }

  /* Get the translations that are currently in the dictionary */
  dbStrings = plv8.execute(sqlSelect, [ englishId ]);
  /* Turn those translations into an object */
  var dataKeys = {};
  for (i = 0; i < dbStrings.length; i++) {
    dataKeys[dbStrings[i].dictentry_key] = dbStrings[i].dictentry_translation;
  }

  /* for each input, see if it's already in the dictionary, and act appropriately */
  for (key in inputStrings) {
    if(inputStrings.hasOwnProperty(key)) {
      value = inputStrings[key];
      dbTranslation = dataKeys[key];
      if (dbTranslation && dbTranslation === value) {
        /* we already have this one. do nothing. */
      } else if (dbTranslation) {
        /* the translation has been updated */
        dataKeys[key] = value;
        plv8.execute(sqlUpdate, [value, englishId, key]);
      } else {
        /* new translation */
        dataKeys[key] = value;
        plv8.execute(sqlInsert, [englishId, key, value, extensionId, isDatabase]);
      }
    }
  }

$$ language plv8;
