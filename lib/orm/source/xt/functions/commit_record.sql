create or replace function xt.commit_record(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      recordType = dataHash.recordType,
      encryptionKey = dataHash.encryptionKey,
      data = Object.create(XT.Data),
      key,
      orm,
      ret;

  if (dataHash.username) { XT.username = dataHash.username; }

  delete dataHash.recordType;
  data.commitRecord(recordType, dataHash.dataHash, encryptionKey);
  orm = XT.Orm.fetch(recordType.beforeDot(), recordType.afterDot());
  key = XT.Orm.primaryKey(orm);
  ret = data.retrieveRecord(recordType, dataHash.dataHash[key]);

  /* Unset XT.username so it isn't cached for future queries. */
  XT.username = undefined;

  return JSON.stringify(ret);

$$ language plv8;
/*
select xt.js_init();
select xt.commit_record(
 $${"username": "admin",
    "recordType":"XM.Contact",
    "dataHash":{
      "id":12171,
      "number":"14832",
      "honorific":"Mr.",
      "firstName":"John",
      "middleName":"D",
      "lastName":"Rockefeller",
      "suffix":"",
      "isActive":true,
      "jobTitle":"Founder",
      "initials":"JDR","isActive":true,
      "phone":"555-555-5555",
      "alternate":"555-444-4445",
      "fax":"555-333-3333",
      "webAddress":"www.xtuple.com",
      "notes":"A famous person",
      "owner":"admin",
      "primaryEmail":"jdr@gmail.com",
      "address": null,
      "comments":[{
        "id":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin",
        "commentType": 3,
        "text":"booya!",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"create"
        },{
        "id":739894,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin",
        "commentType": 3,
        "text":"Now is the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"create"
        }
      ],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"create"
    }
  }$$
);

select xt.commit_record(
 $${"username": "admin",
    "recordType":"XM.Contact",
    "dataHash":{
      "id":12171,
      "number":"14832",
      "honorific":"Mrs.",
      "firstName":"Jane",
      "middleName":"L",
      "lastName":"Knight",
      "suffix":"",
      "isActive":true,
      "jobTitle":"Heiress to a fortune",
      "initials":"JLK","isActive":true,
      "phone":"555-555-5551",
      "alternate":"555-444-4441",
      "fax":"555-333-3331",
      "webAddress":
      "www.xtuple.com",
      "notes":"A distinguished person",
      "owner":"admin",
      "primaryEmail":"jane@gmail.com",
      "address": 1,
      "comments":[{
        "id":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin",
        "commentType": 3,
        "text":"booya!",
        "isPublic":false,
        "dataState":"update"
        },{
        "id":739894,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin",
        "commentType": 3,
        "text":"Now is NOT the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"update"
      }],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"update"
    }
  }$$
);

select xt.commit_record(
 $${"username": "admin",
    "recordType":"XM.Contact",
    "dataHash":{
      "id":12171,
      "number":"14832",
      "honorific":"Mrs.",
      "firstName":"Jane",
      "middleName":"L",
      "lastName":"Knight",
      "suffix":"",
      "isActive":true,
      "jobTitle":"Heiress to a fortune",
      "initials":"JLK","isActive":true,
      "phone":"555-555-5551",
      "alternate":"555-444-4441",
      "fax":"555-333-3331",
      "webAddress":
      "www.xtuple.com",
      "notes":"A distinguished person",
      "owner":"admin",
      "primaryEmail":"jane@gmail.com",
      "address": 1,
      "comments":[{
        "dataState":"delete",
        "id":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin",
        "commentType": 3,
        "text":"booya!",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"read"
        },{
        "dataState":"delete",
        "id":739894,
        "contact":12171,
        "date":"2011-12-21 12:47:12.756437-05",
        "username":"admin",
        "comment_type": 3,
        "text":"Now is the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"read"
      }],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"delete"
    }
  }$$);
*/
