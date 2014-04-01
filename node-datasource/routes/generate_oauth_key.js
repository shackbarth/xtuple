/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

// https://localhost/dev/oauth/generate-key?id=7

(function () {
  "use strict";

  var ursa = require("ursa"),
    exec = require("child_process").exec,
    spawn = require("child_process").spawn,
    async = require("async"),
    path = require("path"),
    fs = require("fs");

  /**
    Fetch the requested oauth2client model, validate the request,
    generate a keypair whose public key will be saved with the
    model and whose private key is returned to the browser.
   */
  exports.generateKey = function (req, res) {
    var clientModel = new SYS.Oauth2client(),
      id = req.query.id,
      // generic error function for both the fetch and the save
      error = function (model, err) {
        console.log("oauth2client error ", arguments);
        res.send({isError: true, error: err});
      },
      convertToP12 = function (publicKey, privateKey) {
        var filenamePrefix = path.join(process.cwd(), "lib/private/temp_" + id),
          publicKeyFilename = filenamePrefix + "_public_key.pem",
          csrFilename = filenamePrefix + "_csr.pem",
          certFilename = filenamePrefix + "_cert.pem",
          privateKeyFilename = filenamePrefix + "_private_key.pem",
          p12Filename = filenamePrefix + ".p12",
          attachmentFilename = publicKey.substring(0, publicKey.indexOf("-----END")) + ".p12",
          csrExec = "openssl req -new -key %@ -out %@".f(privateKeyFilename, csrFilename),
          p12contents;

        async.series([
          function (callback) { fs.writeFile(publicKeyFilename, publicKey, callback); },
          function (callback) { fs.writeFile(privateKeyFilename, privateKey, callback); },
          function (callback) {
            var child = exec(csrExec, callback);
            // blow through command-line questions
            child.stdin.setEncoding = 'utf-8';
            child.stdin.write("\n\n\n\n\n\n\n\n\n");
            //child.stdin.write("US\nVirginia\nNorfolk\nxTuple\n\n\n\n\n");
            child.stdin.end();
          },
          function (callback) {
            var certSpawn = spawn("openssl",
              ["x509", "-req", "-in", csrFilename, "-signkey", privateKeyFilename, "-out", certFilename]);
            certSpawn.on('close', function (code) {
              callback(null, code);
            });
          },
          function (callback) {
            var child = spawn("openssl",
              ["pkcs12", "-export", "-in", certFilename, "-inkey", privateKeyFilename, "-out", p12Filename, "-password", "pass:notasecret"]);

            child.on('close', function (code) {
              callback(null, code);
            });
          },
          function (callback) {
            fs.readFile(p12Filename, function (err, contents) {
              p12contents = contents;
              callback(err, contents);
            });
          },
          function (callback) { fs.unlink(publicKeyFilename, callback); },
          function (callback) { fs.unlink(privateKeyFilename, callback); },
          function (callback) { fs.unlink(csrFilename, callback); },
          function (callback) { fs.unlink(certFilename, callback); },
          function (callback) { fs.unlink(p12Filename, callback); }
        ],
        function (err, results) {
          if (err) {
            res.send({isError: true, message: "Error generating p12 key: " + err.message, error: err});
            return;
          }
          res.attachment(attachmentFilename);
          res.send(new Buffer(p12contents));
        });
      },
      fetchSuccess = function (model, result) {
        var keypair = ursa.generatePrivateKey(),
          privateKey = keypair.toPrivatePem().toString(),
          publicKey = keypair.toPublicPem().toString(),
          saveSuccess = function (model, result) {
            convertToP12(publicKey, privateKey);
          };

        // Cursory validation: this should be a jwt bearer and the
        // public key field should not have already been set.
        if (clientModel.get("clientType" !== "jwt bearer") ||
            clientModel.get("clientX509PubCert")) {
          res.send({isError: true, message: "Invalid request"});
          return;
        }

        clientModel.set("clientX509PubCert", publicKey);
        clientModel.save(null, {
          error: error,
          username: req.session.passport.user.username,
          database: req.session.passport.user.organization,
          success: saveSuccess
        });
      };

    clientModel.fetch({
      id: id,
      username: req.session.passport.user.username,
      database: req.session.passport.user.organization,
      error: error,
      success: fetchSuccess
    });

  };
}());
