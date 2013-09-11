/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true */
var net = require("net");
//console.log("HERE");
var pipe = new net.Socket({ fd: 3 });
//process.send("123");
//console.log("pipe is", pipe);
pipe.on('data', function (buf) {
  "use strict";
  // do whatever
  console.log("here");
  process.exit(0);
  process.send("123");
});
process.stdin.on('data', function (chunk) {
  console.log("hoo");
});
console.log(process.stdio);
setTimeout(function () {
  console.log("hello");
  process.exit(7);
}, 2000);
/*
process.on('message', function (buffer) {
  "use strict";

  //var buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
  console.log("here");
  console.log(buffer.toString("hex"));
  process.send('\\x' + buffer.toString("hex"));
});
*/
