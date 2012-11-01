create or replace function xt.json_schema_properties(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      schemaTable = dataHash.table,
      column,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      schemaColumnInfo = {},
      ret = {};

  /* Loop through the ORM properties and get the columns. */
  for (var i = 0; i < dataHash.properties.length; i++) {
    if (!ret.properties) {
      /* Initialize properties. */
      ret.properties = {};
    }

    /* Add title and description properties. */
    /* For readability only, these should be first, therefore a redundant if. */
    if ((dataHash.properties[i].attr && dataHash.properties[i].attr.column)
      || (dataHash.properties[i].toOne)
      || (dataHash.properties[i].toMany)) {

      /* Initialize named properties. */
      ret.properties[dataHash.properties[i].name] = {};

// TODO convert camelcase to human readable label.
      ret.properties[dataHash.properties[i].name].title = dataHash.properties[i].name;

// TODO add description.
    }

    /* Basic property */
    if (dataHash.properties[i].attr && dataHash.properties[i].attr.column) {
      column = dataHash.properties[i].attr.column;

      /* Get column's PostgreSQL datatype info. */
      schemaColumnInfo = JSON.parse(XT.Schema.columnInfo(schemaTable, column));
      if (!schemaColumnInfo) return false;

      /* Loop through the returned schemaColumnInfo properties and add them. */
      for (var attrname in schemaColumnInfo) {
        ret.properties[dataHash.properties[i].name][attrname] = schemaColumnInfo[attrname];
      }
    }
    /* toOne property */
    else if (dataHash.properties[i].toOne) {
      // TODO Handle toOne properties.
      ret.properties[dataHash.properties[i].name].type = "object";
    }
    /* toMany property */
    else if (dataHash.properties[i].toMany) {
      // TODO Handle toMany properties.
      ret.properties[dataHash.properties[i].name].type = "array";

      if (dataHash.properties[i].toMany.isNested) {
        // TODO Handle toMany properties isNested === true.
        ret.properties[dataHash.properties[i].name].items = {"TODO": "TODO"};
      }
    }
    /* Error */
    else {
      // We should not get here.
      // TODO error?
    }
  }

  /* If this ORM has no column properties, we have an empty object, return false. */
  if (!ret.properties || !Object.keys(ret.properties).length > 0) return false;

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/* A single type of ORM.
select xt.json_schema_properties('{
  "nameSpace": "XM",
  "type": "Account",
  "prettyPrint": true
  }'
);
*/

/* All ORMs
select
  xt.json_schema_properties(orm_json)
from xt.orm;
*/
