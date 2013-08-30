/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, _:true, SYS:true */

(function () {
  "use strict";


// https://localhost/dev/credit-card?creditCard=b42fdf19-5e2e-45d8-a4f8-83fb6e6e7391&amount=500

// authorization only
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L442
// insert ccpay
// go to authorize.net
// insert copay

// auth and capture
// insert ccpay
// go to authorize.net
// postCCcashReceipt
// insert copay



//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L688
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1126
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1171
//https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp#L1193

  var data = require("./data"),
    async = require("async");

  exports.transact = function (req, res) {
    if (!X.authorizeNetClient) {
      res.send({isError: true, message: "Authorize.Net client has not been set up"});
      return;
    }

    var uuid = req.query.creditCard,
      creditCardModel = new SYS.CreditCard(),
      creditCardPaymentModel = new SYS.CreditCardPayment(),
      fetchCreditCard = function (callback) {
        creditCardModel.fetch({
          id: uuid,
          database: req.session.passport.user.organization,
          username: req.session.passport.user.id,
          success: function (model) {
            callback(null, model);
          },
          error: callback
        });
      },
      initializeCreditCardPayment = function (callback) {
        var changeId = function () {
          if (creditCardPaymentModel.id) {
            creditCardPaymentModel.off('change:id', changeId);
            callback();
          }
        };

        creditCardPaymentModel.on('change:id', changeId);
        creditCardPaymentModel.initialize(null, {
          isNew: true,
          database: req.session.passport.user.organization,
          username: req.session.passport.user.id
        });
      },
      saveCreditCardPayment = function (callback) {
        creditCardPaymentModel.set({
          creditCard: uuid,
          amount: Number(req.query.amount),
          wasPreauthorization: false, // TODO
          status: 'C', // TODO
          type: 'C', // TODO
          originalType: 'C' // TODO
        });
        creditCardPaymentModel.save(null, {
          database: req.session.passport.user.organization,
          username: req.session.passport.user.id,
          success: function (model) {
            callback(null, model);
          },
          error: callback
        });
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

        return data;
      },
      transactWithApi = function (callback) {
        var creditCardData = adaptCreditCardData(creditCardModel.toJSON());

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
          .on('success', callback)
          .on('failure', function (err, result) {
            callback(err || result);
          });
        } catch (error) {
          callback(error);
        }
      },
      respondToClient = function (err, response) {
        if (err) {
          res.send({isError: true, error: err});
        } else {
          res.send({data: response});
        }
      };

    async.series([
      fetchCreditCard,
      initializeCreditCardPayment,
      saveCreditCardPayment,
      transactWithApi


    ], respondToClient);


  };
}());
