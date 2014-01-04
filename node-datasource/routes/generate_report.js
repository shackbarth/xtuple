/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */
  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path"),
    Report = require('fluentreports').Report,
    queryForData = require("./report").queryForData;

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000

  exports.generateReport = function (req, res) {

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
      var mydata = [
        {quantityUnit: "Tuesday", price: 8}
      ];

      var detail = function (report, data) {
        report.band([
          ["", 80],
          [data["lineItems.quantityUnit"], 100],
          ["Price" + data["lineItems.price"], 100, 3]
        ], {border: 1, width: 0, wrap: 1});
      };

      var namefooter = function (report, data, state) {
        report.band([
          ["Totals for " + data.name, 180],
          [report.totals.hours, 100, 3]
        ]);
        report.newLine();
      };

      var header = function (report, data) {
        console.log("data number", data.number, typeof data.number);
        report.print("InvoiceNumber" + data.number, {fontBold: true});
      };
      var footer = function (report, data) {
        report.print("baz", {fontBold: true});
      };

      var rpt = new Report(reportName)
          .autoPrint(false) // Optional
          .pageHeader(["Employee Hours"])// Optional
          .userdata({hi: 1})// Optional
          .data(reportData)        // REQUIRED
          .sum("hours")        // Optional
          .detail(detail) // Optional
          .footer(footer)
          .header(header)
          .fontSize(8); // Optional

      // Debug output is always nice (Optional, to help you see the structure)
      rpt.printStructure();


      // This does the MAGIC...  :-)
      console.time("Rendered");
      var a = rpt.render(function (err, name) {
          console.timeEnd("Rendered");
          if (err) {
            console.error("Report had an error", err);
          } else {
            console.log("Report is named:", name);
          }
          done(err, name);
        }
      );

    };

    var sendReport = function (done) {
      fs.readFile(path.join(".", reportName), function (err, data) {
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
            attachments: [{fileName: reportName, contents: data, contentType: "application/pdf"}]
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
          res.attachment(reportName);
        }
        res.send(data);
        done();
      });
    };

    async.series([
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

