/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true */
var net = require("net");
var pipe = new net.Socket({ fd: 3 });
pipe.pause();
pipe.on('data', function (buffer) {
  "use strict";
  console.log(buffer.toString("hex"));
  process.exit(0);
});
pipe.resume();
