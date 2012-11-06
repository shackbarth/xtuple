#!/usr/bin/env node

var crypt = require("crypto");
var salt = "[PUTASALTHERE]";
var password = "[PUTAPASSWORDHERE]";

console.log(crypt.createHash('md5').update(salt + password).digest('hex'));
