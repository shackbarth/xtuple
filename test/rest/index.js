/* global rest */
var G = require('googleapis'),
  _ = require('underscore'),
  Mocha = require('mocha'),
  creds = require('../lib/login_data').data,
  path = require('path'),
  fs = require('fs'),

  // Load rest tests.
  tests = {
    discovery: './discovery'
  };

global.rest = { };

(function () {
  'use strict';

  var database = creds.org,
    host = creds.webaddress || "https://localhost",
    delimiter = host.charAt(host.length - 1) === "/" ? "" : "/",
    discoveryPath = host + delimiter + database + "/discovery/v1alpha1/apis/v1alpha1/rest",
    api = {
      name: 'xtuple',
      version: 'v1alpha1',
      opts: {
        baseDiscoveryUrl: discoveryPath
      }
    },
    mocha = new Mocha();

  // XXX
  // google's api doesn't allow for the '/apis/' part of our URL
  // https://github.com/google/google-api-nodejs-client/issues/113
  G.generateDiscoveryUrl = function(api) {
    return discoveryPath;
  };

  // XXX name: 'xtuple' isn't strictly correct for our api, but it should be.
  // name shouldn't be 'v1alpha1'
  G.discover('xtuple', 'v1alpha1', api).execute(function (err, client) {
    // XXX
    // https://github.com/google/google-api-nodejs-client/issues/114
    client[database].apiMeta.basePath = client[database].apiMeta.servicePath;

    rest.database = database;
    rest.api = api;
    rest.client = client;

    fs.readdirSync(__dirname).filter(function (file) {
      return file.substr(-3) === '.js' && file != 'index.js';
    }).forEach(function (file) {
      mocha.addFile(path.join(__dirname, file));
    });
    mocha.reporter('spec').run();
  });
})();
