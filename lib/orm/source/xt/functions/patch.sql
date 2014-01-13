/**
    Procedure for applying patches to the database per http://tools.ietf.org/html/rfc6902

    @param {Text} Data hash that can parsed into a JavaScript object or array.
    @param {String} [dataHash.username] Username. Required.
    @param {String} [dataHash.nameSpace] Namespace. Required.
    @param {String} [dataHash.type] Type. Required.
    @param {Object} [dataHash.patches] Array of patches to be processed. Required
    @param {Number} [dataHash.etag] Record version for optimistic locking. Required.
    @param {Object} [dataHash.lock] Lock information for pessemistic locking.
    @param {Number} [dataHash.lock.key] Lock key for pessemistic locking.
    @param {String} [dataHash.encryptionKey] Encryption key.

    Sample usage:

    select xt.patch('{
      "username": "admin",
      "nameSpace":"XM",
      "type": "Contact",
      "id": "10009",
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
            "text": "We be jammin.",
            "isPublic": false,
            "created": "2013-04-26T12:57:57.896Z",
            "createdBy": "admin"
          }
        }
      ],
      "prettyPrint": true
    }');

    select xt.patch('[
      {
        "username": "admin",
        "nameSpace":"XM",
        "type": "Contact",
        "id": "10009",
        "etag": "0a1247ae-3d81-4006-d2a7-aea3ac4fdab8",
        "patches": [
          {
            "op":"replace",
            "path":"/firstName",
            "value":"Damien"
          }
        ],
        "prettyPrint": true
      },
      {
        "username": "admin",
        "nameSpace":"XM",
        "type": "Contact",
        "id": "10010",
        "etag": "38ba4d93-2fd0-4ce1-a250-3da1cf6b103c",
        "patches": [
          {
            "op":"replace",
            "path":"/firstName",
            "value":"Rohan"
          }
        ],
        "prettyPrint": true
      }     
    ]');
*/
create or replace function xt.patch(data_hash text) returns text as $$

return (function () {

  var dataArray = JSON.parse(data_hash),
    isArray = XT.typeOf(dataArray) === 'array',
    data = Object.create(XT.Data),
    result = [],
    options,
    patches,
    prettyPrint,
    orm,
    idKey,
    observer,
    prv,
    rec,
    ret;

  /* Make sure the input is an array */
  dataArray = isArray ? dataArray : [dataArray];

  try {
    /* Loop through each input and do the work */
    dataArray.forEach(function (dataHash) {
      options = JSON.parse(JSON.stringify(dataHash));
      patches = options.patches;
      prettyPrint = dataHash.prettyPrint ? 2 : null;

      dataHash.superUser = false;
      if (dataHash.username) { XT.username = dataHash.username; }

      orm = XT.Orm.fetch(dataHash.nameSpace, dataHash.type);
      idKey = XT.Orm.naturalKey(orm) || XT.Orm.primaryKey(orm);

      /* get the current version of the record */
      prv = data.retrieveRecord(dataHash);
      dataHash.includeKeys = true;
      dataHash.superUser = true;
      rec = data.retrieveRecord(dataHash);

      /* apply the patch */
      if (!XT.jsonpatch.apply(rec.data, dataHash.patches, true)) {
        plv8.elog(ERROR, 'Malformed patch document');
      }
      options.data = rec.data;

      /* commit the record */
      data.commitRecord(options);

      if(options.requery === false) {
        /* The requestor doesn't care to know what the record looks like now */
        ret = true;
      } else {
        /* calculate a patch of the modifed version */
        XT.jsonpatch.apply(prv.data, patches);
        observer = XT.jsonpatch.observe(prv.data);
        dataHash.includeKeys = false;
        dataHash.id = prv.data[idKey];
        ret = data.retrieveRecord(dataHash);
        observer.object = ret.data;
        delete ret.data;
        ret.patches = XT.jsonpatch.generate(observer);
      }
      /* Unset XT.username so it isn't cached for future queries. */
      XT.username = undefined;

      XT.message(200, "OK");
      result.push(ret);
    });

    return JSON.stringify(isArray ? result : result[0], null, prettyPrint);
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;

