/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  var authorizenet = require('paynode').use('authorizenet');

  exports.transact = function (req, res) {
    var client = authorizenet.createClient({
      level: authorizenet.levels.sandbox,
      login: '9N8T3NK4q6vk',
      tran_key: '2jmpG96xM59QAJ4d'
    });
    client.performAimTransaction({
      "x_type": "AUTH_CAPTURE",
      "x_method": "CC",
      "x_card_num": "4111111111111111",
      "x_exp_date": "0115",

      "x_amount": "19.99",
      "x_description": "Sample Transaction",

      "x_first_name": "John",
      "x_last_name": "Doe",
      "x_address": "1234 Street",
      "x_state": "WA",
      "x_zip": "98004"
    })
    .on('success', function (err, result) {
      // do something to handle a successful transaction
      res.send(result);
    })
    .on('failure', function (err, result) {
      // do something to handle a failed transaction
      res.send(err);
    });


  };
}());
