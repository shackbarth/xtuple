#XTUPLE DATASOURCE

> DOCUMENTATION MAY BE INCOMPLETE AND IS UPDATED AS OFTEN AS POSSIBLE  

> This software serves a specific purpose and is highly volatile. No support of any kind will be offered at this time. The Datasource makes use of the xTuple Node.js Framework that is embedded in this project.  

##Requirements

__Currently the Datasource requires a *nix environment to run__. It is _no yet decided_ whether this is a permanent limitation. There is no timeline to change this dependency at this time.  

##Prerequisites

* [Node.js](https://github.com/joyent/node) -- `v0.6.9`
* [MongoDB](https://github.com/mongodb/mongo) -- `2.1.2` _development_

##Instructions

Clone this repository into the desired location. It should be on the same level as the xTuple [database](https://github.com/xtuple/database) repository in the filesystem (not necessary if custom configuration is used or if there is no intention of using the database ORM installer).  

From the project root, simply `./server` or `./server -c [path-to-custom-configuration]`. As it stands, the default configuration is not completely filled-out. It is __highly recommended__ that a copy of the `./lib/config.js` file be made and modified as necessary and use the `-c` flag to use this file.  

The startup bash script will use npm to install dependencies in the correct location. Should any issues occur that require reinstallation of these modules they are located at `./lib/xt/node_modules` and this directory should be completely removed.

##Configuration

The configuration file is fairly straight-forward. It is designed such that any component of the Datasource module stack is named and any properties under that component name will be directly applied to that module. For example 

```javascript
  database: {

    // the port to connect to the database
    port: 5432,

    // the hostname/url/ip of the database
    hostname: 'localhost',

    //.........................
    // TEMPORARY DATABASE OPTIONS THAT WILL BE
    // REPLACED FOR MULTIPLE ENTRY

    user: 'admin',
    password: '',
    organization: ''
  },
```

All of the properties in this hash will be directly applied to the named module `database` in the XT namespace. Thus, `XT.database` will contain the `port`, `hostname`, `user`, `password` and `organization` properties as provided.