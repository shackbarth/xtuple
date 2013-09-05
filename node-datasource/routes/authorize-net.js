/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, _:true, SYS:true */

(function () {
  "use strict";


  // sample invocation:
  // https://localhost/dev/credit-card?creditCard=b42fdf19-5e2e-45d8-a4f8-83fb6e6e7391&action=authorize&amount=5000&orderNumber=40000

  // qt implementation is here:
  //https://github.com/xtuple/qt-client/blob/master/guiclient/creditcardprocessor.cpp

  var data = require("./data"),
    async = require("async"),
    authorizeNet = require('paynode').use('authorizenet');

  exports.transact = function (req, res) {
    var uuid = req.query.creditCard,
      authorizeOnly = req.query.action === 'authorize',
      amount = Number(req.query.amount),
      creditCardModel = new SYS.CreditCard(),
      creditCardPaymentModel = new SYS.CreditCardPayment(),
      paymentLinkModel = new SYS.SalesOrderPayment(),
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
          customer: req.query.customerNumber,
          amount: amount,
          orderNumber: req.query.orderNumber,
          orderNumberSeq: 1, //TODO: this must be incremented in subsequent transactions
          wasPreauthorization: authorizeOnly,
          status: authorizeOnly ? SYS.CreditCardPayment.AUTHORIZED : SYS.CreditCardPayment.CHARGED,
          type: authorizeOnly ? SYS.CreditCardPayment.AUTHORIZED : SYS.CreditCardPayment.CHARGED,
          originalType: authorizeOnly ? SYS.CreditCardPayment.AUTHORIZED : SYS.CreditCardPayment.CHARGED
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

        data.firstName = rawData.name.split(' ').slice(0, -1).join(' ');
        data.lastName = rawData.name.split(' ').slice(-1).join(' ');

        return data;
      },
      apiCredentials = {},
      fetchAPICredentials = function (callback) {
        creditCardModel.dispatch("XM.System", "settings",
          [],
          {
            database: req.session.passport.user.organization,
            username: req.session.passport.user.id,
            success: function (response) {
              apiCredentials.authorizeNetLogin = response.CCLogin;
              apiCredentials.authorizeNetTransactionKey = response.CCPassword;
              apiCredentials.testMode = response.CCTest;

              // enforce Authorize.net only
              if (response.CCCompany !== 'Authorize.Net') {
                callback({responsereasontext: "Only Authorize.Net is currently supported."});
                return;
              }

              // validate the ccv here
              if (response.CCRequireCCV && !req.query.ccv) {
                callback({responsereasontext: "CCV is required"});
                return;
              }

              callback(null, response);
            },
            error: callback
          });
      },
      transactWithApi = function (callback) {
        var authorizeNetClient,
          creditCardData = adaptCreditCardData(creditCardModel.toJSON()),
          transactionObj = {
            "x_type": authorizeOnly ? "AUTH_ONLY" : "AUTH_CAPTURE",
            "x_method": "CC",
            "x_card_num": creditCardData.number,
            "x_exp_date": creditCardData.expiry,

            "x_amount": req.query.amount,
            "x_description": "Credit Card Transaction",

            "x_first_name": creditCardData.firstName,
            "x_last_name": creditCardData.lastName,
            "x_address": creditCardData.address,
            "x_state": creditCardData.state,
            "x_zip": creditCardData.zip
          };

        if (req.query.ccv) {
          transactionObj.x_card_code = req.query.ccv;
        }

        try {
          authorizeNetClient = authorizeNet.createClient({
            level: apiCredentials.testMode ? authorizeNet.levels.sandbox : authorizeNet.levels.live,
            login: apiCredentials.authorizeNetLogin,
            tran_key: apiCredentials.authorizeNetTransactionKey
          });
          authorizeNetClient.performAimTransaction(transactionObj)
          .on('success', callback)
          .on('failure', function (err, result) {
            callback(err || result);
          });
        } catch (error) {
          callback(error);
        }
      },
      postCreditIfCapture = function (callback) {
        if (authorizeOnly) {
          // we don't post credit if it's just an authorization
          callback();
          return;
        }
        creditCardModel.dispatch("XM.CreditCard", "postCashReceipt",
          [creditCardPaymentModel.id, Number(req.query.orderNumber), "cohead", amount],
          {
            database: req.session.passport.user.organization,
            username: req.session.passport.user.id,
            success: function (response) {
              callback(null, response);
            },
            error: callback
          });
      },
      initializePaymentLink = function (callback) {
        var changeId = function () {
          if (paymentLinkModel.id) {
            paymentLinkModel.off('change:id', changeId);
            callback();
          }
        };

        paymentLinkModel.on('change:uuid', changeId);
        paymentLinkModel.initialize(null, {
          isNew: true,
          database: req.session.passport.user.organization,
          username: req.session.passport.user.id
        });
      },
      savePaymentLink = function (callback) {
        paymentLinkModel.set({
          payment: creditCardPaymentModel,
          salesOrder: req.query.orderNumber,
          amount: amount
        });
        paymentLinkModel.save(null, {
          database: req.session.passport.user.organization,
          username: req.session.passport.user.id,
          success: function (model) {
            callback(null, model);
          },
          error: callback
        });
      },
      respondToClient = function (err, response) {
        if (err) {
          res.send({isError: true, error: err, message: err.responsereasontext});
        } else {
          res.send({data: true});
        }
      },
      finish = function (err, response) {
        if (err) {
          creditCardPaymentModel.set({
            status: SYS.CreditCardPayment.ERROR
          });
          creditCardPaymentModel.save(null, {
            database: req.session.passport.user.organization,
            username: req.session.passport.user.id,
            success: function (model) {
              // still want to error out here, really.
              respondToClient(err, response);
            },
            error: respondToClient
          });

        } else {
          respondToClient(err, response);
        }
      };

    async.series([
      fetchCreditCard,
      initializeCreditCardPayment,
      saveCreditCardPayment,
      fetchAPICredentials,
      transactWithApi,
      postCreditIfCapture,
      initializePaymentLink,
      savePaymentLink
    ], finish);


  };
}());
