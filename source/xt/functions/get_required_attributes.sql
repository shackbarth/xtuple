create or replace function xt.get_required_attributes(data_hash text) returns text as $$

  var dataLoad = JSON.parse(data_hash),
      /* Load ORM if this function was called with a basic hash. */
      dataHash = dataLoad.properties ? dataLoad : XT.Orm.fetch(dataLoad.nameSpace, dataLoad.type),
      schemaTable = dataHash.table,
      column,
      prettyPrint = dataLoad.prettyPrint ? 2 : null,
      schemaColumnInfo = {},
      ret = [];

  if (!dataHash.properties) return false;

  /* Loop through the ORM properties and get the columns. */
  for (var i = 0; i < dataHash.properties.length; i++) {

    /* Basic property */
    if (dataHash.properties[i].attr && dataHash.properties[i].attr.column) {
      column = dataHash.properties[i].attr.column;

      /* Get column's PostgreSQL datatype info. */
      schemaColumnInfo = XT.Schema.columnInfo(schemaTable, column);
      if (!schemaColumnInfo) return false;

      /* Get required from the returned schemaColumnInfo properties. */
      if (schemaColumnInfo.required) {
        ret.push(dataHash.properties[i].name);
      }

      /* Add required override based off of ORM's property. */
      if (dataHash.properties[i].attr.required) {
        ret.push(dataHash.properties[i].name);
      }
    }
    /* toOne property */
    else if (dataHash.properties[i].toOne) {
      /* Add required override based off of ORM's property. */
      if (dataHash.properties[i].toOne.required) {
        ret.push(dataHash.properties[i].name);
      }
    }
    /* toMany property */
    else if (dataHash.properties[i].toMany) {
      /* Add required override based off of ORM's property. */
      if (dataHash.properties[i].toMany.required) {
        ret.push(dataHash.properties[i].name);
      }
    }
    /* Error */
    else {
      /* You broke it. We should not be here. */
      throw new Error("Invalid ORM property. Unable to generate requiredAttributes from this ORM.");
    }
  }

  /* If this ORM has no column properties, we have an empty object, return false. */
  if (!ret.length > 0) return false;

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/* A single type of ORM.
select xt.get_required_attributes('{
  "nameSpace": "XM",
  "type": "Account",
  "prettyPrint": true
  }'
);
*/

/* All ORMs
select
  xt.get_required_attributes(orm_json)
from xt.orm;
*/
