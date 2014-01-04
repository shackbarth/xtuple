/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000
  /*
    TODO: fetch images from database


  */


  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path"),
    Report = require('fluentreports').Report,
    queryForData = require("./report").queryForData;

  var createTempDir = function (done) {
    fs.exists("./temp", function (exists) {
      if (exists) {
        done();
      } else {
        fs.mkdir("./temp", done);
      }
    });
  };



  exports.generateReport = function (req, res) {

    var pageHeader = "Invoice";
    var detailAttribute = "lineItems";
    // fluent expects the data to be in a single array with the head info copied redundantly
    // and the detail info having prefixed keys
    var transformDataStructure = function (data) {
      return _.map(data[detailAttribute], function (detail) {
        var pathedDetail = {};
        _.each(detail, function (detailValue, detailKey) {
          pathedDetail[detailAttribute + "." + detailKey] = detailValue;
        });
        return _.extend({}, data, pathedDetail);
      });
    };

    var reportData;
    var generateData = function (done) {
      var requestDetails = {
        nameSpace: req.query.nameSpace,
        type: req.query.type,
        id: req.query.id
      };
      var callback = function (result) {
        if (!result || result.isError) {
          done(result || "Invalid query");
          return;
        }
        reportData = transformDataStructure(result.data.data);
        console.log(reportData);
        done();
      };

      // step 1: get the data
      queryForData(req.session, requestDetails, callback);
    };

    // You don't have to pass in a report name; it will default to "report.pdf"
    var reportName = "demo1.pdf";
    var printReport = function (done) {

      /* "align" cribsheet:
        left: 1,
        right: 3,
        center: 2
      */

      var detail = function (report, data) {
        report.band([
          ["~" + data["lineItems.quantity"], 60, 2],
          [data["lineItems.quantityUnit"], 60, 2],
          [data["lineItems.item"].number, 60, 2],
          [data.currency, 120, 2],
          ["~" + data["lineItems.price"], 60, 2],
          [data["lineItems.extendedPrice"], 60, 2]
        ], {border: 1, width: 0, wrap: 1});
      };

      var header = function (report, data) {
        // TOP-RIGHT
        report.print([
          "Invoice",
          "Invoice Date: " + data.invoiceDate,
          "Order Date: " + data.orderDate
        ], {align: "right"});

        report.print("InvoiceNumber" + data.number, {fontBold: true});

        report.image("./temp/x.png", {x: 200, y: 0});
        report.newline();
        report.newline();
        report.newline();

        // Detail Header
        report.fontBold();
        report.band([
          {data: "Qty. Shipped", width: 60, align: 2},
          {data: "UOM", width: 60, align: 2},
          {data: 'Item Number', width: 60, align: 2},
          {data: 'Invoice Currency:', width: 90, align: 2},
          {data: data.currency, width: 30, align: 3},
          {data: 'Unit Price', width: 60, align: 3},
          {data: 'Ext. Price', width: 60, align: 3},
        ], {border: 0, width: 0});
        report.fontNormal();
        report.bandLine();
      };

      var footer = function (report, data) {
        report.print("baz", {fontBold: true});
      };

      var rpt = new Report("./temp/" + reportName)
          .autoPrint(false) // Optional
          .userdata({hi: 1})// Optional
          .data(reportData)        // REQUIRED
          .detail(detail) // Optional
          .footer(footer)
          .header(header)
          .fontSize(8); // Optional

      // Debug output is always nice (Optional, to help you see the structure)
      //rpt.printStructure();

      // This does the MAGIC...  :-)
      console.time("Rendered");
      rpt.render(function (err, name) {
        console.timeEnd("Rendered");
        if (err) {
          console.error("Report had an error", err);
        } else {
          console.log("Report is named:", name);
        }
        done(err, name);
      });
    };

    var sendReport = function (done) {
      fs.readFile(path.join("./temp", reportName), function (err, data) {
        if (err) {
          res.send({isError: true, error: err});
          return;
        }
        if (req.query.action === "email") {
          var mailContent = {
            from: "no-reply@xtuple.com",
            to: "shackbarth@xtuple.com",
            subject: "hi",
            text: "Here is your email",
            attachments: [{fileName: "./temp/" + reportName, contents: data, contentType: "application/pdf"}]
          };
          var callback = function (error, response) {
              if (error) {
                X.log("Email error", error);
                res.send({isError: true, message: "Error emailing"});
              } else {
                res.send({message: "Email success"});
              }
            };

          X.smtpTransport.sendMail(mailContent, callback);
          done();
          return;
        }
        res.header("Content-Type", "application/pdf");

        if (req.query.action === "download") {
          res.attachment("./temp/" + reportName);
        }
        res.send(data);
        done();
      });
    };

    async.series([
      createTempDir,
      generateData,
      printReport,
      sendReport
    ], function (err, results) {
      if (err) {
        res.send({isError: true, message: err.description});
      }
    });

  };

}());

