/**
    Procedure for applying patches to the database per http://tools.ietf.org/html/rfc6902
    
    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {String} [dataHash.id] Id. If not provided, one will be created automatically.
    @param {Object} [dataHash.data] Data payload representing record(s) to create. Required
    @param {Number} [dataHash.version] Record version for optimistic locking. Required.
    @param {Number} [dataHash.lock] Lock information for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.
*/
create or replace function xt.post(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
    data = Object.create(XT.Data),
    orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type),
    pkey = XT.Orm.primaryKey(orm),
    prettyPrint = dataHash.prettyPrint ? 2 : null,
    prv = JSON.parse(JSON.stringify(dataHash.data)),
    sql = "select nextval('" + orm.idSequenceName + "');",
    observer,
    rec,
    ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* set status */
  XT.jsonpatch.updateState(dataHash.data, "create");

  /* set id if not provided */
  if (!dataHash.id) {
    dataHash.id = dataHash.data[pkey] || plv8.execute(sql)[0].nextval;
  }

  if (!dataHash.data[pkey]) {
    dataHash.data[pkey] = dataHash.id;
  }
  
  /* commit the record */
  data.commitRecord(dataHash);

  /* calculate a patch of the modifed version */
  observer = XT.jsonpatch.observe(prv);
  ret = data.retrieveRecord(dataHash);
  observer.object = ret.data;
  delete ret.data;
  ret.patches = XT.jsonpatch.generate(observer);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;

/*
select xt.js_init();
select xt.post('{
  "username": "admin",
  "nameSpace":"XM",
  "type": "Contact",
  "data" : {
    "number": "10009",
    "firstName": "Bob",
    "lastName": "Marley"
  },
  "prettyPrint": true
}');
*/