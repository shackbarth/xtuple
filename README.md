#Postgres Object Relational Map System

This repository contains the database object definitions for an embedded ORM system running through the PLV8 javascript engine.

##Prerequisites

 * [PostgreSQL] (http://www.postgresql.org/) -- `v9.1.0`
 * [plV8js] (http://www.pgxn.org/dist/plv8/) -- `1.2`
   - [v8] (http://github.com/v8/v8) -- `v3.6.2`
 * [NodeJS] (http://nodejs.org/) -- `v.0.6.18`

##Instructions

Build and install PostgreSQL from source.

Optional: If you want to use data encryption, in the `contrib/crypto` directory `sudo make install`. 

Build the v8 library then copy the `libv8*` shared libraries to `/usr/local/lib`.  

Build the plv8js PostgreSQL extension via `make; sudo make install` (make sure to check instructions).  

Add the following to the bottom of the postgresq.conf file:
  `custom_variable_classes = 'plv8'`

##Use

In order to use any of the functionality provided by this project you must run the following sql statement: `select xt.js_init();`

The main purpose of this project is to provide an Object Relational Map (ORM) structure and APIs to retreive and manipulate records as json objects, and to make function calls on the database. Some examples are provided below. More may be found in the source files.

##Retrieve a Record

    select xt.retrieve_record('{
      "recordType":"XM.Contact", 
      "id": 1,
      "prettyPrint": true
      }'
    );

##Commit a Record

      select xt.commit_record(
      E'{"recordType":"XM.Contact",
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
            "owner":{
              "username":"admin",
              "isActive":true,
              "propername":"administrator",
              "type": "UserAccount",
             "dataState":"create"
           },
          "primaryEmail":"jdr@gmail.com",
          "address": null,
          "comments":[{
             "id":739893,
             "contact":12171,
             "created":"2011-12-21 12:47:12.756437-05",
             "createdBy":"admin", 
             "commentType":"3",
             "text":"booya!",
             "isPublic":false,
             "type": "ContactComment",
             "dataState":"create"
         },{
            "id":739894,
            "contact":12171,
            "created":"2011-12-21 12:47:12.756437-05",
            "createdBy":"admin", 
            "commentType":"3",
            "text":"Now is the time for all good men...",
            "isPublic":false,
            "type": "ContactComment",
            "dataState":"create"
        }],
         "characteristics":[],
         "email":[],
         "type": "Contact",
         "dataState":"create"
         }
       }'
      );

##Fetch Multiple Records

      select xt.fetch($${ "query":{
                         "recordType":"XM.ItemInfo",
                         "parameters":[{
                           "attribute": "number",
                           "operator": "BEGINS_WITH",
                           "value": "B"
                          }], 
                         "prettyPrint": true
                         }
                       }$$);`
                       
##Dispatch a function

      select xt.dispatch($${"requestType":"dispatch",
                            "className":"XT.Record",
                            "functionName":"fetchId",
                            "parameters":"XM.Address"
                           }$$);`
