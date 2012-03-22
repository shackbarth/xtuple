create or replace function xt.commit_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  var dataHash = JSON.parse(data_hash),
      recordType = dataHash.recordType,
      encryptionKey = dataHash.encryptionKey,
      data = Object.create(XT.Data);

  delete dataHash.recordType;
  data.commitRecord(recordType, dataHash.dataHash, encryptionKey);

  return '{ "status":"ok" }';
  
$$ language plv8;
/*
select xt.commit_record(
 E'{"recordType":"XM.Contact",
    "dataHash":{
      "guid":12171,
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
      "owner":{
        "username":"admin",
        "isActive":true,
        "propername":"administrator",
        "type": "UserAccount",
        "dataState":"created"
      },
      "primaryEmail":"jdr@gmail.com",
      "address": null,
      "comments":[{
        "guid":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin", 
        "commentType":"3",
        "text":"booya!",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"created"
        },{
        "guid":739894,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin", 
        "commentType":"3",
        "text":"Now is the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"created"
        }
      ],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"created"
    }
  }'
);

select xt.commit_record(
 E'{"recordType":"XM.Contact",
    "dataHash":{
      "guid":12171,
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
      "owner":{
        "username":"postgres",
        "isActive":true,
        "propername":"",
        "type": "UserAccountInfo",
        "dataState":"read"
      },
      "primaryEmail":"jane@gmail.com",
      "address":{
        "guid":1,
        "line1":"Tremendous Toys Inc.",
        "line2":"101 Toys Place",
        "line3":"",
        "city":"Walnut Hills",
        "state":"VA",
        "postalcode":"22209",
        "country":"United States",
        "type": "AddressInfo",
        "dataState":"read"
      },
      "comments":[{
        "guid":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin", 
        "commentType":"3",
        "text":"booya!",
        "isPublic":false
        },{
        "guid":739894,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin", 
        "commentType":"3",
        "text":"Now is NOT the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"updated"
      }],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"updated"
    }
  }'
);

select xt.commit_record(
 E'{"recordType":"XM.Contact",
    "dataHash":{
      "guid":12171,
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
      "owner":{
        "username":"postgres",
        "isActive":true,
        "propername":"",
        "type": "UserAccountInfo",
        "dataState":"read"
      },
      "primaryEmail":"jane@gmail.com",
      "address":{
        "guid":1,
        "line1":"Tremendous Toys Inc.",
        "line2":"101 Toys Place",
        "line3":"",
        "city":"Walnut Hills",
        "state":"VA",
        "postalcode":"22209",
        "country":"United States",
        "type": "AddressInfo",
        "dataState":"read"
      },
      "comments":[{
        "dataState":"deleted",
        "guid":739893,
        "contact":12171,
        "created":"2011-12-21 12:47:12.756437-05",
        "createdBy":"admin", 
        "commentType":"3",
        "text":"booya!",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"read"
        },{
        "dataState":"deleted",
        "guid":739894,
        "contact":12171,
        "date":"2011-12-21 12:47:12.756437-05",
        "username":"admin", 
        "comment_type":"3",
        "text":"Now is the time for all good men...",
        "isPublic":false,
        "type": "ContactComment",
        "dataState":"read"
      }],
      "characteristics":[],
      "email":[],
      "type": "Contact",
      "dataState":"deleted"
    }
  }'
);
*/
