/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

// https://localhost/dev/oauth/generate-key?id=7

(function () {
  "use strict";

  var exec = require("child_process").exec,
    forge = require("node-forge"),
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
      genKey = function (model, result) {
        forge.pki.rsa.generateKeyPair({bits: 2048, workers: -1}, function (err, keypair) {
          if (err) {
            res.send({isError: true, message: "Error generating keypair: " + err.message, error: err});
            return;
          }

          fetchSuccess(model, result, keypair);
        });
      },
      sendP12 = function (keys) {
        // It's possible and much easier to generate the p12 file without a
        // cert. This example shows how to generate a cert if we actually need
        // to, but OAuth is working without.
        // @see: https://github.com/digitalbazaar/forge/blob/master/tests/nodejs-create-pkcs12.js#L11
        //var p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], 'notasecret'),
        var p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, null, 'notasecret'),
          p12Der = forge.asn1.toDer(p12Asn1).getBytes(),
          buffer = new Buffer(p12Der, 'binary');

        res.attachment(clientModel.get('clientName') + '.p12');
        res.send(new Buffer(buffer, 'base64'));
      },
      fetchSuccess = function (model, result, keys) {
        var publicKey = forge.pki.publicKeyToPem(keys.publicKey),
          saveSuccess = function (model, result) {
            sendP12(keys);
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
      success: genKey
    });

  };
}());
