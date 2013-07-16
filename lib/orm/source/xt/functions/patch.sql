/**
    Procedure for applying patches to the database per http://tools.ietf.org/html/rfc6902

    @param {Text} Data hash that can parsed into a JavaScript object.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.patches] Array of patches to be processed. Required
    @param {Number} [dataHash.etag] Record version for optimistic locking. Required.
    @param {Object} [dataHash.lock] Lock information for pessemistic locking.
    @param {Number} [dataHash.lock.key] Lock key for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.

    Sample usage:
    select xt.js_init();
    select xt.patch('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "99999",
      "etag": "5972fbbf-416d-43c8-9fd5-b30093093897",
      "patches": [
        {
          "op":"replace",
          "path":"/firstName",
          "value":"Damien"
        }
        ,
        {
          "op": "add",
          "path": "/comments/3",
          "value": {
            "uuid": "bb5a834a-b816-481c-ab17-0637a999b511",
            "commentType": "General",
            "text": "Get back to where you once belong.",
            "isPublic": false,
            "created": "2013-04-26T12:57:57.896Z",
            "createdBy": "admin"
          }
        }
      ],
      "prettyPrint": true
    }');
*/
create or replace function xt.patch(data_hash text) returns text as $$
  try {
    var dataHash = JSON.parse(data_hash),
      data = Object.create(XT.Data),
      orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type),
      idKey = XT.Orm.naturalKey(orm) || XT.Orm.primaryKey(orm),
      options = JSON.parse(JSON.stringify(dataHash)),
      patches = options.patches,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      observer,
      prv,
      rec,
      ret;

    dataHash.superUser = false;
    if (dataHash.username) { XT.username = dataHash.username; }

    /* get the current version of the record */
    prv = data.retrieveRecord(dataHash);
    dataHash.includeKeys = true;
    rec = data.retrieveRecord(dataHash);

    /* apply the patch */
    if (!XT.jsonpatch.apply(rec.data, dataHash.patches, true)) {
      plv8.elog(ERROR, 'Malformed patch document');
    }
    options.data = rec.data;

    /* commit the record */
    data.commitRecord(options);

    /* calculate a patch of the modifed version */
    XT.jsonpatch.apply(prv.data, patches);
    observer = XT.jsonpatch.observe(prv.data);
    dataHash.includeKeys = false;
    dataHash.id = prv.data[idKey];
    ret = data.retrieveRecord(dataHash);
    observer.object = ret.data;
    delete ret.data;
    ret.patches = XT.jsonpatch.generate(observer);

    /* Unset XT.username so it isn't cached for future queries. */
    XT.username = undefined;

    XT.message(200, "OK");
    return JSON.stringify(ret, null, prettyPrint);
  } catch (err) {
    XT.error(err);
  }

$$ language plv8;

