create or replace function private.commit_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select private.init_js()');

  var dataHash = JSON.parse(data_hash),
      recordType = dataHash.recordType, 
      map = XT.fetchMap(recordType.replace((/\w+\./i),'')),
      data = Object.create(XT.Data),
      debug = false;

  delete dataHash.recordType;

  if(data.checkPrivileges(map, dataHash)) { 
    data.commitRecord(recordType, dataHash);
    return '{ "status":"ok" }';
  }
  
  throw new Error("Access Denied.");
  
$$ language plv8;
/*
select private.commit_record(
 E'{"recordType":"XM.Contact", 
    "dataState":"created",
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
      "dataState":"read",
      "username":"admin",
      "isActive":true,
      "propername":"administrator"
    },
    "primaryEmail":"jdr@gmail.com",
    "address": null,
    "comments":[{
      "dataState":"created",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"created",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
      }
    ],
    "characteristics":[],
    "email":[]
  }'
);

select private.commit_record(
 E'{"recordType":"XM.Contact",
    "dataState":"updated",
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
      "dataState":"read",
      "username":"postgres",
      "isActive":true,
      "propername":""
    },
    "primaryEmail":"jane@gmail.com",
    "address":{
      "dataState":"read",
      "guid":1,
      "line1":"Tremendous Toys Inc.",
      "line2":"101 Toys Place",
      "line3":"",
      "city":"Walnut Hills",
      "state":"VA",
      "postalcode":"22209",
      "country":"United States"
    },
    "comments":[{
      "dataState":"updated",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"updated",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
    }],
    "characteristics":[],
    "email":[]
  }'
);

select private.commit_record(
 E'{"recordType":"XM.Contact",
    "dataState":"deleted",
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
      "dataState":"deleted",
      "username":"postgres",
      "isActive":true,
      "propername":""
    },
    "primaryEmail":"jane@gmail.com",
    "address":{
      "dataState":"deleted",
      "guid":1,
      "line1":"Tremendous Toys Inc.",
      "line2":"101 Toys Place",
      "line3":"",
      "city":"Walnut Hills",
      "state":"VA",
      "postalcode":"22209",
      "country":"United States"
    },
    "comments":[{
      "dataState":"deleted",
      "guid":739893,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"booya!",
      "isPublic":false
      },{
      "dataState":"deleted",
      "guid":739894,
      "contact":12171,
      "date":"2011-12-21 12:47:12.756437-05",
      "username":"admin", 
      "comment_type":"3",
      "text":"Now is the time for all good men...",
      "isPublic":false
    }],
    "characteristics":[],
    "email":[]
  }'
);
*/
