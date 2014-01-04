/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000
  /*
    TODO: fetch images from database


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


  //
  // HELPER FUNCTIONS FOR DATA TRANSFORMATION
  //

  // TODO: move these to json descriptor in database


  // fluent expects the data to be in a single array with the head info copied redundantly
  // and the detail info having prefixed keys
  var transformDataStructure = function (data) {
    return _.map(data[reportDefinition.detailAttribute], function (detail) {
      var pathedDetail = {};
      _.each(detail, function (detailValue, detailKey) {
        pathedDetail[reportDefinition.detailAttribute + "_" + detailKey] = detailValue;
      });
      return _.extend({}, data, pathedDetail);
    });
  };

  // Probably temporary
  var getDetailHeader = function (detailDef) {
    return _.map(detailDef, function (def) {
      return {
        data: def.text,
        width: def.width,
        align: 2
      };
    });
  };

  var getDetail = function (detailDef, data) {
    return _.map(detailDef, function (def) {
      var key,
        fieldData;

      // inelegant, but works
      // handles cases like "parent.currency", "item.number", "quantityUnit"
      if (def.attr.indexOf("parent.") === 0) {
        key = def.attr.substring("parent.".length);
      } else {
        key = reportDefinition.detailAttribute + "_" + def.attr;
      }
      console.log("data is", data);
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


  var transformElementData = function (def, data) {
    if (def.transform === "detailHeader") {
      console.log("def is", def.definition);
      return getDetailHeader(def.definition);

    } else if (def.transform === "detail") {
      return getDetail(def.definition, data);

    } else if (def.element === "print") {
      return _.map(def.definition, function (defElement) {
        var returnData = defElement.attr ? data[defElement.attr] : defElement.text;
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

  var createTempDir = function (done) {
    fs.exists("./temp", function (exists) {
      if (exists) {
        done();
      } else {
        fs.mkdir("./temp", done);
      }
    });
  };

  var reportData;
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
      done();
    };

    queryForData(req.session, requestDetails, callback);
  };

  var reportDefinition;
  var fetchReportDefinition = function (done) {
    // TODO: actually go to the database
    reportDefinition = {
      pageHeader: "Invoice",
      detailAttribute: "lineItems",
      defaultFontSize: 14,
      detailElements: [
        {
          element: "band",
          transform: "detail",
          definition: [
            {attr: "quantity", label: "Qty. Shipped", width: 100},
            {attr: "quantityUnit", label: "UOM", width: 50},
            {attr: "item.number", label: "Item", width: 100},
            {attr: "parent.currency", label: "Currency", width: 80},
            {attr: "price", label: "Unit Price", width: 100},
            {attr: "extendedPrice", label: "Ext. Price", width: 100}
          ],
          options: {border: 1, width: 0, wrap: 1}
        }
      ],
      headerElements: [
        {
          element: "print",
          definition: [
            {text: "Invoice"},
            {attr: "invoiceDate", label: true},
            {attr: "terms", label: true},
            {attr: "orderDate", label: true}
          ],
          options: {x: 350, y: 0, align: "right"}
        },
        {
          element: "print",
          definition: [
            {attr: "number", label: "Invoice Number"},
          ],
          options: {fontBold: true, x: 200, y: 150}
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
          transform: "detailHeader",
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
          element: "print",
          definition: [
            {attr: "subtotal", label: true},
            {attr: "taxTotal", label: true},
            {attr: "total", label: true}
          ],
          options: {y: 400, align: "right"}
        }
      ]
    };

    done();
  };

  // You don't have to pass in a report name; it will default to "report.pdf"
  var reportName = "demo1.pdf";
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
        report[def.element](elementData, def.options);
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


  exports.generateReport = function (req, res) {

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

}());

