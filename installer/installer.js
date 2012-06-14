#!/usr/bin/env node

/*globals XT, require */

require('../../datasource/lib/xt/foundation');
require('../../datasource/lib/xt/database');
require('../../datasource/lib/xt/server');

require('./lib/dev');
require('./lib/orm');
require('./lib/model_generator');

// temporary settings fixed to aurora dev database
var settings = {
  user: 'admin',
  password: 'Assemble!Aurora',
  hostname: 'asteroidbelt.xtuple.com',
  port: 19689
};

for (var key in settings) {
  if (!settings.hasOwnProperty(key)) {
    continue;
  }
  XT.database[key] = settings[key];
}