/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true */
var net = require("net");
var data = [], dataLen = 0, totalDataLen;

// this implementation would be simplified considerably if the pipe's end() would work the way I would expect
var lengthPipe = new net.Socket({ fd: 4 });
lengthPipe.pause();
lengthPipe.on('data', function (chunk) {
  "use strict";
  totalDataLen = Number(chunk);
  process.stdout.write("havelength");
});
lengthPipe.resume();

var pipe = new net.Socket({ fd: 3 });
pipe.pause();
pipe.on('data', function (chunk) {
  "use strict";
  data.push(chunk);
  dataLen += chunk.length;
  if (dataLen === totalDataLen) {
    var buffer = new Buffer(dataLen);
    for (var i = 0, len = data.length, pos = 0; i < len; i++) {
      data[i].copy(buffer, pos);
      pos += data[i].length;
    }
    process.stdout.write(buffer.toString("hex"));
    process.stdout.write("__done__");
  }
});
pipe.resume();
