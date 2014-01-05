/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000
  /*
    TODO: fetch images from database
    TODO: translations

  */


  //
  // DEPENDENCIES
  //

  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path"),
    Report = require('fluentreports').Report,
    queryForData = require("./report").queryForData;


  var generateReport = function (req, res) {

    //
    // VARIABLES THAT SPAN MULTIPLE STEPS
    //
    var reportDefinition;
    var reportData;
    var reportName = "demo1.pdf";

    //
    // HELPER FUNCTIONS FOR DATA TRANSFORMATION
    //

    /**
      We receive the data in the form we're familiar with: an object that represents the head,
      which has an array that represents item data (such as InvoiceLines).

      Fluent expects the data to be an array, which is the array of the line items with
      head info copied redundantly/

      As a convention we'll put a prefix in front of the keys of the item data.
    */
    var transformDataStructure = function (data) {
      return _.map(data[reportDefinition.detailAttribute], function (detail) {
        var pathedDetail = {};
        _.each(detail, function (detailValue, detailKey) {
          pathedDetail[reportDefinition.detailAttribute + "*" + detailKey] = detailValue;
        });
        return _.extend({}, data, pathedDetail);
      });
    };

    var transformBand = function (detailDef) {
      return _.map(detailDef, function (def) {
        return {
          data: def.text,
          width: def.width,
          align: 2
        };
      });
    };

    var traverseDots = function (data, key) {
      while (key.indexOf(".") >= 0) {
        data = data[key.prefix()];
        key = key.suffix();
      }
      return data[key];
    };

    /**
      Resolve the xTuple JSON convention for report element definition to the
      output expected from fluentReports
     */
    var getDetail = function (detailDef, data) {
      return _.map(detailDef, function (def) {
        return {
          data: "~" + traverseDots(data, def.attr), // TODO: no tildes
          width: def.width,
          align: def.align || 2 // default to "center"
        };
      });
    };

    /**
      Custom transformations for various element descriptions.
     */
    var transformElementData = function (def, data) {
      if (def.transform === "detail") {
        return getDetail(def.definition, data);

      } else if (def.element === "band") {
        return transformBand(def.definition);

      } else if (def.element === "print" || !def.element) {
        return _.map(def.definition, function (defElement) {
          var returnData = defElement.attr ? "~" + traverseDots(data, defElement.attr) : defElement.text;
          if (defElement.label === true) {
            returnData = ("_" + defElement.attr).loc() + ": " + returnData;
          } else if (defElement.label) {
            returnData = defElement.label + ": " + returnData;
          }
          return returnData;
        });

      } else {
        return def.definition;
      }
    };


    //
    // STEPS TO PERFORM ROUTE
    //

    /**
      Make a directory node-datasource/temp if none exists
     */
    var createTempDir = function (done) {
      fs.exists("./temp", function (exists) {
        if (exists) {
          done();
        } else {
          fs.mkdir("./temp", done);
        }
      });
    };

    /**
      Fetch the highest-grade report definition for this business object.
     */
    var fetchReportDefinition = function (done) {
      // TODO: actually go to the database
      reportDefinition = {
        pageHeader: "Invoice",
        detailAttribute: "lineItems", // TODO: this could be inferred
        defaultFontSize: 14,
        detailElements: [
          {
            element: "band",
            transform: "detail",
            definition: [
              {attr: "lineItems*quantity", width: 100},
              {attr: "lineItems*quantityUnit", width: 50},
              {attr: "lineItems*item.number", width: 100},
              {attr: "currency", width: 80},
              {attr: "lineItems*price", width: 100},
              {attr: "lineItems*extendedPrice", width: 100}
            ],
            options: {border: 1, width: 0, wrap: 1}
          }
        ],
        headerElements: [
          {
            definition: [
              {text: "Invoice"},
              {attr: "invoiceDate", label: true},
              {attr: "terms", label: true},
              {attr: "orderDate", label: true}
            ],
            options: {x: 350, y: 0, align: "right"}
          },
          {
            definition: [{text: "Customer Number: "}],
            options: {fontBold: true, x: 0, y: 150}
          },
          {
            definition: [{attr: "customer.number"}],
            options: {x: 250, y: 150}
          },
          {
            definition: [{text: "Invoice Number: "}],
            options: {fontBold: true, x: 0, y: 170}
          },
          {
            definition: [{attr: "number"}],
            options: {x: 250, y: 170}
          },
          {
            definition: [
              {text: "_billto".loc() + ": "}
            ],
            options: {x: 1, y: 200, width: 100, fontBold: true, align: "right"}
          },
          {
            definition: [
              {attr: "billtoName"},
              {attr: "billtoAddress1"},
              {attr: "billtoAddress2"},
              {attr: "billtoAddress3"},
              // TODO: make this go in one row
              {attr: "billtoCity"},
              {attr: "billtoState"},
              {attr: "billtoPostalCode"},
              {attr: "billtoCountry"},
              {attr: "billtoPhone"}
            ],
            options: {x: 100, y: 200, width: 250}
          },
          {
            element: "image",
            definition: "./temp/x.png",
            options: {x: 200, y: 0, width: 150}
          },
          {
            element: "fontBold"
          },
          {
            element: "band",
            definition: [
              {text: "Qty. Shipped", width: 100},
              {text: "UOM", width: 50},
              {text: "Item", width: 100},
              {text: "Currency", width: 80},
              {text: "Unit Price", width: 100},
              {text: "Ext. Price", width: 100}
            ],
            options: {border: 0, width: 0}
          },
          {
            element: "fontNormal"
          },
          {
            element: "bandLine"
          },
        ],
        footerElements: [
          {
            definition: [
              {attr: "subtotal", label: true},
              {attr: "taxTotal", label: true},
              {attr: "total", label: true}
            ],
            options: {align: "right"}
          }
        ]
      };

      done();
    };

    var fetchImages = function (done) {
      // TODO
      done();
    };

    var fetchBarcodes = function (done) {
      // TODO
      done();
    };

    /**
      Get the data for this business object.
     */
    var fetchData = function (req, done) {
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

    /**
      Generate the report by calling fluentReports.
     */
    var printReport = function (done) {

      /* "align" cribsheet:
        left: 1,
        right: 3,
        center: 2
      */


      var printHeader = function (report, data) {
        printGeneral(report, data, reportDefinition.headerElements);
      };

      var printDetail = function (report, data) {
        printGeneral(report, data, reportDefinition.detailElements);
      };

      var printFooter = function (report, data) {
        printGeneral(report, data, reportDefinition.footerElements);
      };

      var printGeneral = function (report, data, definition) {
        _.each(definition, function (def) {
          var elementData = transformElementData(def, data);
          report[def.element || "print"](elementData, def.options);
        });
      };

      var rpt = new Report("./temp/" + reportName)
          .data(reportData)
          .detail(printDetail)
          .footer(printFooter)
          .header(printHeader)
          .fontSize(reportDefinition.defaultFontSize);

      // Debug output is always nice (Optional, to help you see the structure)
      //rpt.printStructure();

      // This does the MAGIC...  :-)
      rpt.render(done);
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
      fetchReportDefinition,
      fetchImages,
      fetchBarcodes,
      function (done) {
        fetchData(req, done);
      },
      printReport,
      sendReport
    ], function (err, results) {
      if (err) {
        res.send({isError: true, message: err.description});
      }
    });
  };

  exports.generateReport = generateReport;

}());

