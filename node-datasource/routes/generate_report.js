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

  var getDetailHeader = function (detailDef) {
    return _.map(detailDef, function (def) {
      return {
        data: def.label || def.attr,
        width: def.width,
        align: 2
      };
    });
  };



  exports.generateReport = function (req, res) {

    // TODO: move these to json descriptor in database
    var pageHeader = "Invoice";
    var detailAttribute = "lineItems";
    var _detailDef = [
      {attr: "quantity", label: "Qty. Shipped", width: 100},
      {attr: "quantityUnit", label: "UOM", width: 50},
      {attr: "item.number", label: "Item", width: 100},
      {attr: "parent.currency", label: "Currency", width: 80},
      {attr: "price", label: "Unit Price", width: 100},
      {attr: "extendedPrice", label: "Ext. Price", width: 100}
    ];

    // fluent expects the data to be in a single array with the head info copied redundantly
    // and the detail info having prefixed keys
    var transformDataStructure = function (data) {
      return _.map(data[detailAttribute], function (detail) {
        var pathedDetail = {};
        _.each(detail, function (detailValue, detailKey) {
          pathedDetail[detailAttribute + "_" + detailKey] = detailValue;
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

      var getDetail = function (detailDef, data) {
        return _.map(detailDef, function (def) {
          var key,
            fieldData;

          // inelegant, but works
          // handles cases like "parent.currency", "item.number", "quantityUnit"
          if (def.attr.indexOf("parent.") === 0) {
            key = def.attr.substring("parent.".length);
          } else {
            key = detailAttribute + "_" + def.attr;
          }
          if (key.indexOf(".") >= 0) {
            fieldData = data;
            while (key.indexOf(".") >= 0) {
              fieldData = fieldData[key.prefix()];
              key = key.suffix();
            }
            fieldData = fieldData[key];
          } else {
            fieldData = data[key];
          }

          return {
            data: "~" + fieldData, // TODO: no tildes
            width: def.width,
            align: 2
          };
        });
      };


      var printDetail = function (report, data) {
        var detail = getDetail(_detailDef, data);
        report.band(detail, {border: 1, width: 0, wrap: 1});
      };

      var printHeader = function (report, data) {
        // TOP-RIGHT
        report.print([
          "Invoice",
          "Invoice Date: " + data.invoiceDate,
          "Terms: " + data.terms,
          "Order Date: " + data.orderDate
        ], {x: 350, y: 0, align: "right"});

        report.print("InvoiceNumber" + data.number, {fontBold: true});

        report.image("./temp/x.png", {x: 200, y: 0, width: 150});
        report.newline();
        report.newline();
        report.newline();
        report.newline();
        report.newline();
        report.newline();

        // Detail Header
        report.fontBold();
        report.band(getDetailHeader(_detailDef), {border: 0, width: 0});
        report.fontNormal();
        report.bandLine();
      };

      var printFooter = function (report, data) {
        report.print([
          "Subtotal: " + data.subtotal,
          "Taxes: " + data.taxTotal,
          "Total: " + data.total
        ], {y: 400, align: "right"});
      };

      var rpt = new Report("./temp/" + reportName)
          .autoPrint(true) // Optional
          .userdata({hi: 1})// Optional
          .data(reportData)        // REQUIRED
          .detail(printDetail)
          .footer(printFooter)
          .header(printHeader)
          .fontSize(14); // Optional

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

