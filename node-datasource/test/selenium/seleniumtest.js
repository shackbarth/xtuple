/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
//------- This is the main executable file to run the selenium scripts -----
(function () {
  "use strict";
  var test = require('./sauce-arguments.js'),
    input = require('./lib/utils.js'),
    browsername = process.argv[2],
    osname = process.argv[3],
    bflag = false,
    oflag = false,
    availbrowsers = ['firefox', 'chrome', 'internet explorer', 'safari', 'ipad', 'iphone', 'android'],
    availenvis = ['Mac 10.6', 'Mac 10.8', 'Linux', 'Windows XP', 'Windows 7', 'Ubuntu', 'Windows 8'],
    version = process.argv[4],
    i,
    j,
    stdin,
    requestVersion,
    verifyCombination,
    testIfValid,
    verifyAndTest;

  requestVersion = function (callback) {
    var stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding('utf8');
    process.stdout.write('Please enter the browser version: ');
    stdin.on('data', function (key) {
      version = key;
      callback(version);
    });
  };

  verifyCombination = function (bname, osname, callback) {
    var valid = false,
      combinations = ['chrome-Windows XP',
        'chrome-Windows 7',
        'chrome-Mac 10.6',
        'chrome-Mac 10.8',
        'chrome-Ubuntu',
        'firefox-Windows XP',
        'firefox-Windows 7',
        'firefox-Windows 8',
        'firefox-Mac 10.6',
        'firefox-Ubuntu',
        'safari-Mac 10.6',
        'internet explorer-Windows 8',
        'ipad-Mac 10.6',
        'iphone-Mac 10.6',
        'ipad-Mac 10.8',
        'iphone-Mac 10.8',
        'android-Linux'],
      ccombination = bname + '-' + osname;

    for (i = 0; i < combinations.length; i = i + 1) {
      if (ccombination === combinations[i]) {
        valid = true;
        callback(valid);
      }
    }

    if (valid === false) {
      console.log("\x1b[31mPlease enter a valid Browser - OS combination. \nPress '1' to see the valid Browser-OS combinations or any other key to exit\x1b[0m");
      stdin = process.stdin;
      stdin.resume();
      stdin.setEncoding('utf8');
      stdin.on('data', function (key) {
        if (key === 1) {
          for (j = 0; j < combinations.length; j = j + 1) {
            process.stdout.write(combinations[j] + '\n');
          }
          process.exit();
        } else {
          process.exit();
        }
      });
    }
  };

  try {
    testIfValid = function (valid) {
      if (valid) {
        test.starttest(browsername, osname, version);
      }
    };
    verifyAndTest = function (version) {
      verifyCombination(browsername, osname, testIfValid);
    };

    for (i = 0; i < availbrowsers.length; i = i + 1) {
      if (availbrowsers[i] === browsername) {
        bflag = true; //-- flag for valid browser name
        for (j = 0; j < availenvis.length; j = j + 1) {
          if (availenvis[j] === osname) {
            oflag = true; //---flag for valid osname
            if (((osname === "Mac 10.6") || (osname === "Mac 10.8") || (osname === "Linux")) && ((typeof version) === 'undefined')) {
              console.log('Please enter the browser version: ');
              input.input(verifyAndTest);
            } else {
              verifyCombination(browsername, osname, testIfValid);
            }
            break;
          }
        }
      }
    }
    if (!bflag) {
      throw "Please enter a valid browser name";
    }
    if (!oflag) {
      throw "Please enter a valid OS name";
    }
  } catch (e) {
    console.log(e);
  }
}());
