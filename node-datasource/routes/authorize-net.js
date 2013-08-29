/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";


// https://localhost/dev/credit-card?creditCard=b42fdf19-5e2e-45d8-a4f8-83fb6e6e7391&amount=500

//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L442
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L688
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1126
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1171
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1193

  var data = require("./data");




  exports.transact = function (req, res) {
    if (!X.authorizeNetClient) {
      res.send({isError: true, message: "Authorize.Net client has not been set up"});
      return;
    }

    var uuid = req.query.creditCard,
      creditCardQueryPayload = {
        nameSpace: "XM",
        type: "CreditCard",
        id: uuid,
        username: req.session.passport.user.id
      },
      adaptCreditCardData = function (rawData) {
        var data = JSON.parse(JSON.stringify(rawData)),
          monthExpiry = rawData.monthExpired,
          yearExpiry = rawData.yearExpired,
          address,
          expiry;

        if (monthExpiry.length === 1) {
          monthExpiry = "0" + monthExpiry;
        }
        if (yearExpiry.length > 2) {
          yearExpiry = yearExpiry.substring(yearExpiry.length - 2);
        }
        expiry = monthExpiry + yearExpiry;
        address = rawData.address1;

        if (rawData.address2) {
          address = address + " " + rawData.address2;
        }
        data.expiry = expiry;
        data.address = address;

        data.number = "4111111111111111"; //TODO: get the raw data

        return data;
      },
      performTransaction = function (result) {
        var creditCardData = adaptCreditCardData(result.data.data);

        try {
          X.authorizeNetClient.performAimTransaction({
            "x_type": "AUTH_CAPTURE",
            "x_method": "CC",
            "x_card_num": creditCardData.number,
            "x_exp_date": creditCardData.expiry,

            "x_amount": req.query.amount,
            "x_description": "Sample Transaction",

            "x_first_name": creditCardData.name, // TODO split space
            "x_last_name": creditCardData.name,
            "x_address": creditCardData.address,
            "x_state": creditCardData.state,
            "x_zip": creditCardData.zip
          })
          .on('success', function (err, result) {
            res.send({data: result});
          })
          .on('failure', function (err, result) {
            res.send({isError: true, error: err || result});
          });
        } catch (error) {
          res.send({isError: true, error: error});
        }
      };

    data.queryDatabase("get", creditCardQueryPayload, req.session, performTransaction);
  };
}());
