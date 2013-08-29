/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";


  exports.transact = function (req, res) {
    if (!X.authorizeNetClient) {
      res.send({isError: true, message: "Authorize.Net client has not been set up"});
      return;
    }
    X.authorizeNetClient.performAimTransaction({
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
      res.send({data: result});
    })
    .on('failure', function (err, result) {
      res.send({isError: true, error: err});
    });


  };
}());
