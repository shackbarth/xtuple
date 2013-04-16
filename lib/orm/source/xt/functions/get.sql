create or replace function xt.get(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }
  ret = data.retrieveRecord(dataHash);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.js_init();
select xt.get('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Contact",
  "id": 10,
  "prettyPrint": true
  }'
);
*/
