/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */
  var async = require("async"),
    fs = require("fs"),
    path = require("path"),
    Report = require('fluentreports').Report,
    queryForData = require("./report").queryForData;

  // https://localhost:8543/qatest/generate-report?nameSpace=XM&type=Invoice&id=60000

  exports.generateReport = function (req, res) {

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
        reportData = result.data.data;
        done();
      };

      // step 1: get the data
      queryForData(req.session, requestDetails, callback);
    };

    // You don't have to pass in a report name; it will default to "report.pdf"
    var reportName = "demo1.pdf";
    var printReport = function (done) {
      var mydata = [
          {name: "John Doe", week: 20, day: "Monday\nis- this is some long text that shouldn't\noverflow the text container but be wrapped", hours: 4},
          {name: "John Doe", week: 20, day: "Tuesday", hours: 8},
          {name: "John Doe", week: 20, day: "Wednesday", hours: 8},
          {name: "John Doe", week: 21, day: "Thursday", hours: 2},
          {name: "John Doe", week: 21, day: "Friday", hours: 8},
          {name: "Jane Doe", week: 20, day: "Monday", hours: 5},
          {name: "Jane Doe", week: 20, day: "Tuesday", hours: 8},
          {name: "Jane Doe", week: 21, day: "Wednesday", hours: 7},
          {name: "Jane Doe", week: 21, day: "Thursday", hours: 8},
          {name: "Jane Doe", week: 21, day: "Friday", hours: 8},


          {name: "John Doe", week: 22, day: "Monday", hours: 4},
          {name: "John Doe", week: 22, day: "Tuesday", hours: 8},
          {name: "John Doe", week: 22, day: "Wednesday", hours: 8},
          {name: "John Doe", week: 23, day: "Thursday", hours: 2},
          {name: "John Doe", week: 23, day: "Friday", hours: 8},
          {name: "Jane Doe", week: 22, day: "Monday", hours: 5},
          {name: "Jane Doe", week: 22, day: "Tuesday", hours: 8},
          {name: "Jane Doe", week: 23, day: "Wednesday", hours: 7},
          {name: "Jane Doe", week: 23, day: "Thursday", hours: 8},
          {name: "Jane Doe", week: 23, day: "Friday", hours: 8},

          {name: "John Doe", week: 25, day: "Monday", hours: 4},
          {name: "John Doe", week: 25, day: "Tuesday", hours: 8},
          {name: "John Doe", week: 25, day: "Wednesday", hours: 8},
          {name: "John Doe", week: 26, day: "Thursday", hours: 2},
          {name: "John Doe", week: 26, day: "Friday", hours: 8},
          {name: "Jane Doe", week: 25, day: "Monday", hours: 5},
          {name: "Jane Doe", week: 25, day: "Tuesday", hours: 8},
          {name: "Jane Doe", week: 26, day: "Wednesday", hours: 7},
          {name: "Jane Doe", week: 26, day: "Thursday\nis- this is some long text that shouldn't\noverflow the text container but be wrapped", hours: 8},
          {name: "Jane Doe", week: 26, day: "Friday\nis- this is some long text that shouldn't\noverflow the text container but be wrapped", hours: 8}
        ];

      var daydetail = function (report, data) {
        report.band([
          ["", 80],
          [data.day, 100],
          [data.hours, 100, 3]
        ], {border: 1, width: 0, wrap: 1});
      };

      var namefooter = function (report, data, state) {
        report.band([
          ["Totals for " + data.name, 180],
          [report.totals.hours, 100, 3]
        ]);
        report.newLine();
      };

      var nameheader = function (report, data) {
        report.print(data.name, {fontBold: true});
      };

      var weekdetail = function (report, data) {
        report.print(["Week Number: " + data.week], {x: 100});
      };

      var totalFormatter = function (data, callback) {
       // if (data.hours) { data.hours = ': ' + data.hours; }
        callback(null, data);
      };


      var rpt = new Report(reportName)
              .autoPrint(false) // Optional
          .pageHeader(["Employee Hours"])// Optional
          .finalSummary(["Total Hours:", "hours", 3])// Optional
          .userdata({hi: 1})// Optional
          .data(mydata)        // REQUIRED
          .sum("hours")        // Optional
          .detail(daydetail) // Optional
          .totalFormatter(totalFormatter) // Optional
          .fontSize(8); // Optional

      rpt.groupBy("name")
          .sum("hours")
          .header(nameheader)
          .footer(namefooter)
          .groupBy("week")
             .header(weekdetail);

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

