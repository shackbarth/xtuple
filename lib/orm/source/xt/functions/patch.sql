create or replace function xt.patch(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      id = dataHash.id,
      version = dataHash.version,
      lock = dataHash.lock || {},
      nameSpace = dataHash.nameSpace,
      type = dataHash.type,
      recordType = nameSpace + '.' + recordType,
      encryptionKey = dataHash.encryptionKey,
      patches = dataHash.patches,
      data = Object.create(XT.Data),
      curr,
      record,
      key,
      orm,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  /* get the current version of the record */
  orm = XT.Orm.fetch(nameSpace, type);
  key = XT.Orm.primaryKey(orm);
  curr = data.retrieveRecord(recordType, id);

  /* throw error if the version is out of date */
  if (curr.version !== version) { plv8.elog(ERROR, "The version being patched is not current.") }

  /* apply the patch */
  record = XT.jsonpatch.apply(curr, patches);
  
  /* commit the record */
  data.commitRecord(recordType, record, encryptionKey);

  /* retrieve the modifed version */
  ret = data.retrieveRecord(recordType, id);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return JSON.stringify(ret);

$$ language plv8;
