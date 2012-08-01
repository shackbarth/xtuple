#!/usr/bin/env node

var _fs     = require('fs');
var _path   = require('path');
var _exec   = require('child_process').exec;

var XT      = {};

XT.enyoVersion = "2.0-GA";

XT.fileContents = function (path) {
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

// ...wow this got ugly fast, how dumb, oh well
for (var libName in XT.required) {
  if (XT.required.hasOwnProperty(libName)) {
    var lib = XT.required[libName];
    var basePath = _path.join(__dirname, "lib");
    var path = _path.join(basePath, libName);
    var packagePath = _path.join(path, "package.js");
    var child;
    var callback = (function (lib, packagePath, libName, path) {
      return function () {
        var packageFile = [];
        var entries = [];
        if (!_path.existsSync(packagePath)) {
          if (lib.entries) {
            packageFile.push("enyo.depends(");
            lib.entries.forEach(function (entry) {
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
        if (lib.tag) {
          process.chdir(path);
          var child = _exec("git checkout " + lib.tag, function (err, stdout, stderr) {
            if (err) {
              console.error("Could not checkout the requested tag for " + libName, err);
            } else { console.log("Checked out the requested tag " + lib.tag + " for " + libName); }
          });
        }
      };
    })(lib, packagePath, libName, path);
    console.log("Attempting to setup " + libName);
    process.chdir(basePath);
    if (!_path.existsSync(path)) {
      child = _exec("git clone " + lib.origin + " " + libName, { cwd: basePath }, function (){});
      child.once("exit", callback);
    } else { callback(); }
  }
}

if (!_path.existsSync(_path.join(__dirname, "enyo"))) {
  if (process.cwd() !== __dirname) {
    process.chdir(__dirname);
  }
  console.log("Pulling enyo source into project");
  var child = _exec("git clone git@github.com:enyojs/enyo.git", function (){});
  child.once("exit", function () {
    process.chdir(_path.join(__dirname, "enyo"));
    var sub = _exec("git checkout " + XT.enyoVersion, function (){});
    sub.once("exit", function () {
      process.chdir(__dirname);
      console.log("Enyo has been setup");
    });
  });
}

XT.packagePath = _path.join(__dirname, "package.js");
XT.packageContent = [];
XT.packagesContent = [];
if (_path.existsSync(XT.packagePath)) {
  _fs.unlinkSync(XT.packagePath);
  XT.packageContent.push("enyo.depends(");
  Object.keys(XT.required).forEach(function (libName) {
    XT.packagesContent.push("  \"$lib/" + libName + "\"");
  });

  // arbitrary collection...
  XT.packagesContent.push("  \"$lib/date_format\"");
  XT.packagesContent.push("  \"$lib/socket.io\"");
  XT.packagesContent.push("  \"xt\"");
  XT.packagesContent.push("  \"xm\"");
  XT.packagesContent.push("  \"xv\"");
  XT.packagesContent.push("  \"app.js\"");

  XT.packagesContent = XT.packagesContent.join(",\n");
  XT.packageContent.push(XT.packagesContent);
  XT.packageContent.push(");");
  XT.packageContent = XT.packageContent.join("\n");
  _fs.writeFileSync(XT.packagePath, XT.packageContent, "utf8");
  console.log("Rewrote project's package.js file");
}



