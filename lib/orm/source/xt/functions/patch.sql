create or replace function xt.patch(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      curr,
      value,
      key,
      orm,
      ret,
      observer;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* get the current version of the record */
  orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type);
  key = XT.Orm.primaryKey(orm);
  curr = data.retrieveRecord(recordType, dataHash.id);

  /* start observing for changes */
  observer = XT.jsonpatch.observe(curr.data);

  /* apply the patch */
  value = XT.jsonpatch.apply(curr, dataHash.data, true);
  
  /* commit the record */
  data.commitRecord(value);

  /* calculate a patch of the modifed version */
  ret = data.retrieveRecord(recordType, dataHash.id);
  observer.object = ret.data;
  ret.data = XT.jsonpatch.generate(observer);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return dataHash.prettyPrint ? JSON.stringify(ret) : JSON.stringify(ret, null, 2);

$$ language plv8;

/*
select xt.js_init();
select xt.patch('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Quote",
  "id": 351,
  "data" : [{"op":"replace","path":"/data/status","value":"C"}]
  "prettyPrint": true
  }'
);
*/