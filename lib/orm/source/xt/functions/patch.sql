create or replace function xt.patch(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      options = JSON.parse(JSON.stringify(dataHash)),
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      observer,
      rec,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* get the current version of the record */
  rec = data.retrieveRecord(dataHash);

  /* start observing for changes */
  observer = XT.jsonpatch.observe(rec.data);

  /* apply the patch */
  XT.jsonpatch.apply(rec.data, dataHash.data, true);
  options.data = rec.data;

  /* commit the record */
  data.commitRecord(options);

  /* calculate a patch of the modifed version */
  ret = data.retrieveRecord(dataHash);
  observer.object = ret.data;
  ret.data = XT.jsonpatch.generate(observer);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;

/*
select xt.js_init();
select xt.get('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Quote",
  "id": 351,
  "prettyPrint": true
  }'
);
select xt.patch('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Quote",
  "id": 351,
  "version": 6,
  "data" : [{"op":"replace","path":"/data/status","value":"C"}],
  "prettyPrint": true
  }'
);
*/