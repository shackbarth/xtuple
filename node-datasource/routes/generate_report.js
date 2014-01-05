/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000
  /*
    TODO: fetch images from database
    TODO: translations
    TODO: get on 0.0.2

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

    // I'm sure this is already written somewhere else in our app.
    var traverseDots = function (data, key) {
      while (key.indexOf(".") >= 0) {
        data = data[key.prefix()];
        key = key.suffix();
      }
      return data[key];
    };

    /**
      Resolve the xTuple JSON convention for report element definition to the
      output expected from fluentReports by swapping in the data fields.
     */
    var marryData = function (detailDef, data, textOnly) {
      return _.map(detailDef, function (def) {
        var text = def.attr ? "~" + traverseDots(data, def.attr) : def.text;
        if (def.label === true) {
          text = ("_" + def.attr).loc() + ": " + text;
        } else if (def.label) {
          text = def.label + ": " + text;
        }
        if (textOnly) {
          return text;
        }

        // TODO: maybe support any attributes?
        return {
          data: text,
          width: def.width,
          align: def.align || 2 // default to "center"
        };
      });
    };

    /**
      Custom transformations depending on the element descriptions.
     */
    var transformElementData = function (def, data) {
      var textOnly;

      if (typeof def.definition === 'string') {
        // element: image, for example
        return def.definition;
      }

      // print elements (which is the default) only want strings as the definition
      textOnly = def.element === "print" || !def.element;
      return marryData(def.definition, data, textOnly);
    };

    /**
      The "element" (default to "print") is the method on the report
     object that we are going to call to draw the pdf
    */
    var printDefinition = function (report, data, definition) {
      _.each(definition, function (def) {
        var elementData = transformElementData(def, data);
        report[def.element || "print"](elementData, def.options);
      });
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
      var reportDefinitionColl = new SYS.ReportDefinitionCollection(),
        afterFetch = function () {
          if (reportDefinitionColl.getStatus() === XM.Model.READY_CLEAN) {
            reportDefinitionColl.off("statusChange", afterFetch);
            reportDefinition = JSON.parse(reportDefinitionColl.models[0].get("definition"));
            done();
          }
        };

      reportDefinitionColl.on("statusChange", afterFetch);
      reportDefinitionColl.fetch({
        query: {
          parameters: [{
            attribute: "recordType",
            value: req.query.nameSpace + "." + req.query.type
          }],
          rowLimit: 1,
          orderBy: [{
            attribute: "grade",
            descending: true
          }]
        },
        database: req.session.passport.user.organization,
        username: req.session.passport.user.id
      });
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
    var fetchData = function (done) {
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

    /**
      Generate the report by calling fluentReports.
     */
    var printReport = function (done) {

      var printHeader = function (report, data) {
        printDefinition(report, data, reportDefinition.headerElements);
      };

      var printDetail = function (report, data) {
        printDefinition(report, data, reportDefinition.detailElements);
      };

      var printFooter = function (report, data) {
        printDefinition(report, data, reportDefinition.footerElements);
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
      fetchData,
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

