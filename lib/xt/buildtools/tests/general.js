
var _path       = require('path');
var _util       = require('util');

// pull in the package
var xtbt        = require('../index');

var clientRoot  = "/Users/cole/Devel/xtuple/git/clinuz/client";
var app         = "console";

var builder     = xtbt.builder;

builder.set('root', clientRoot);
builder.set('app', app);
builder.build();

builder.packages;
