#!/usr/bin/env node

var _fs     = require('fs');
var _path   = require('path');
var _exec   = require('child_process').exec;

var XT      = {};

XT.fileContents = function(path) {
  var contents;
  try {
    contents = _fs.readFileSync(path, "utf8");
  } catch(err) {
    console.error("Could not retrieve file contents for " + path, err);
    process.exit(-1);
  }
  return contents;
};




// retrieve the known map of required third-party modules
XT.required = XT.fileContents(_path.join(__dirname, "required.json"));

// parse the JSON
try {
  XT.required = JSON.parse(XT.required);
} catch (err) {
  console.error("Could not parse the required json file", err);
  process.exit(-1);
}

console.log("Attempting to setup any dependencies, please wait until " +
  "all child processes have returned");

// ...
for (var libName in XT.required) {
  if (XT.required.hasOwnProperty(libName)) {
    var lib = XT.required[libName];
    var basePath = _path.join(__dirname, "lib");
    var path = _path.join(basePath, libName);
    var packagePath = _path.join(path, "package.js");
    var child;
    var callback = (function(lib, packagePath, libName){
      return function() {
        var packageFile = [];
        var entries = [];
        if (!_path.existsSync(packagePath)) {
          if (lib.entries) {
            packageFile.push("enyo.depends(");
            lib.entries.forEach(function(entry) {
              entries.push("  \"" + entry + "\"");
            });
            entries = entries.join(",\n");
            packageFile.push(entries);
            packageFile.push(");");

            packageFile = packageFile.join("\n");
            console.log("Writing package.js file for " + libName);
            _fs.writeFileSync(packagePath, packageFile, "utf8");
          }
        }
      };
    })(lib, packagePath, libName);
    console.log("Attempting to setup " + libName);
    process.chdir(basePath);
    if (!_path.existsSync(path)) {
      child = _exec("git clone " + lib.origin + " " + libName, { cwd: basePath }, function(){});
      child.once("exit", callback);
    }
  }
}








