#!/usr/bin/env node

var _path =         require('path');

// grab the build tools
var Builder =       require('../build-tools');

// setup some variables for convenience

//..........................................
// FOR DEVELOPMENT ONLY
//

var databaseUser = 'admin';
var databaseUserPassword = 'Assemble!Aurora';
var databaseOrganization = 'aurora';

//..........................................
// PROJECT SETTINGS
//

// path to the project structure json file
var projectStructure = _path.join(__dirname, 'postbooks.json');

// mode that determines how the project is built and served
// can be development, production or inlined although
// inlined is broken and will be removed
var projectMode = 'development';

// the path to the project root, in this case, "client"
var projectRoot = _path.join(__dirname);

// mode that determines how packages are handled
// can be normal or inlined (loads them as core packages)
var projectPackageMode = 'normal';

// the title to display for the application
var projectTitle = 'Postbooks (development)';

// the directory for the builder to use for its static-served
// files (the client index and additional js/css scripts if any)
// and images...etc
var projectWWW = _path.join(__dirname, 'www');

//..........................................
// DATASOURCE SETTINGS
//

// the url to the datasource/responder for the client to
// communicate with
var datasourceHost = 'asteroidbelt.xtuple.com';

// the port on which the client is to connect to the datasource
var datasourceHostPort = 9000;

//..........................................
// BUILDER SETTINGS
//

// the url to the builder for the client to communicate with
// note that localhost can't work if you're serving the application
// publicly
var builderHost = '192.168.1.68';

// the port for the client to use to request the client application
var builderHostPort = 4020;

// the socket namespace for the client to specify
var builderHostNamespace = 'build';

//..........................................
// DEVELOPMENT MODE ONLY SETTINGS
//

// to print the complete project tree and relationships
// on startup (for reference)
var printTreeOnBuild = true;

// to include a complete list of sorted files in the client
// index for review
var sortedFilesListInIndex = true;

// start 'er up
var builder = new Builder({

  // DEVELOPPMENT ONLY
  databaseUser: databaseUser,
  databaseUserPassword: databaseUserPassword,
  databaseOrganization: databaseOrganization,

  projectRoot: projectRoot,
  projectMode: projectMode,
  projectPackageMode: projectPackageMode,
  projectStructure: projectStructure,
  projectTitle: projectTitle,
  projectWWW: projectWWW,
  datasourceHost: datasourceHost,
  datasourceHostPort: datasourceHostPort,
  builderHost: builderHost,
  builderHostPort: 4020,
  builderHostNamespace: builderHostNamespace,
  printTreeOnBuild: printTreeOnBuild,
  sortedFilesListInIndex: sortedFilesListInIndex 
});

builder.serve();
