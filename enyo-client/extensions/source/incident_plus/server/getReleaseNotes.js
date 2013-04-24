/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var fs = require('fs');

(function () {
  "use strict";

  // To generate release notes for a given version, run this file
  // node getReleaseNotes.js
  // copy the console output, log into the production app,
  // and paste the code into the console.
  //
  // That will paste some documentation back at you, in markdown format.
  // Copy and paste that documentation into RELEASE.md.

  // TODO: This code could log into the production app itself to
  // run the code. It could even update the RELEASE.md file. That would
  // be pretty clever.

  var code = fs.readFileSync("./releaseNoteCode.js");

  // an excellent way to remind us to update the version number in our package.json
  // file at the end of every sprint.
  var version = JSON.parse(fs.readFileSync("../../../../../package.json")).version;
  var pertinentProjectId = 675; // TODO: abstract this
  var versionPrefix = "xt-mobile "; // TODO: abstract this

  console.log(code.toString());
  console.log("getReleaseNotes(" + pertinentProjectId + ",\"" + versionPrefix + version + "\");");

}());
