/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  //
  // DEPENDENCIES
  //

  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path"),
    ipp = require("ipp"),
    Report = require('fluentreports').Report,
    qr = require('qr-image'),
    queryForData = require("./export").queryForData;

  /**
    Generates a report using fluentReports

    @property req.query.nameSpace
    @property req.query.type
    @property req.query.id
    @property req.query.action

    Sample URL:
    https://localhost:8443/dev/generate-report?nameSpace=XM&type=Invoice&id=60000&action=print

   */
  var generateReport = function (req, res) {

    //
    // VARIABLES THAT SPAN MULTIPLE STEPS
    //
    var reportDefinition,
      rawData = {}, // raw data object
      reportData, // array with report data
      username = req.session.passport.user.id,
      databaseName = req.session.passport.user.organization,
      // TODO: introduce pseudorandomness (maybe a timestamp) to avoid collisions
      reportName = req.query.type.toLowerCase() + req.query.id + ".pdf",
      auxilliaryInfo = req.query.auxilliaryInfo,
      workingDir = path.join(__dirname, "../temp", databaseName),
      reportPath = path.join(workingDir, reportName),
      imageFilenameMap = {},
      translations;

    //
    // HELPER FUNCTIONS FOR DATA TRANSFORMATION
    //

    /**
      We receive the data in the form we're familiar with: an object that represents the head,
      which has an array that represents item data (such as InvoiceLines).

      Fluent expects the data to be just an array, which is the array of the line items with
      head info copied redundantly.

      As a convention we'll put a * as prefix in front of the keys of the item data.

      This function performs both these transformtations on the data object.
    */
    var transformDataStructure = function (data) {
      // TODO: detailAttribute could be inferred by looking at whatever comes before the *
      // in the detailElements definition.

      if (!reportDefinition.settings.detailAttribute) {
        // no children, so no transformation is necessary
        return [data];
      }

      return _.map(data[reportDefinition.settings.detailAttribute], function (detail) {
        var pathedDetail = {};
        _.each(detail, function (detailValue, detailKey) {
          pathedDetail[reportDefinition.settings.detailAttribute + "*" + detailKey] = detailValue;
        });
        return _.extend({}, data, pathedDetail);
      });
    };

    /**
      Helper function to translate strings
     */
    var loc = function (s) {
      return translations[s] || s;
    };

    /**
      Resolve the xTuple JSON convention for report element definition to the
      output expected from fluentReports by swapping in the data fields.

      FluentReports wants its definition key to be a string in some cases (see the
      textOnly parameter), and in other cases in the "data" attribute of an object.

      The xTuple standard is to use "text" or "attr" instead of data. Text means text,
      attr refers to the attribute name on the data object. This function accepts either
      and crams the appropriate value into "data" for fluent (or just returns the string).
     */
    var marryData = function (detailDef, data, textOnly) {

      return _.map(detailDef, function (def) {
        var text = def.attr ? XT.String.traverseDots(data, def.attr) : loc(def.text);
        if (def.text && def.label === true) {
          // label=true on text just means add a colon
          text = text + ": ";
        } else if (def.label === true) {
          // label=true on an attr means add the attr name as a label
          text = loc("_" + def.attr) + ": " + text;
        } else if (def.label) {
          // custom label
          text = loc(def.label) + ": " + text;
        }
        if (textOnly) {
          return text;
        }

        // TODO: maybe support any attributes? Right now we ignore all but these three
        var obj = {
          data: text,
          width: def.width,
          align: def.align || 2 // default to "center"
        };

        return obj;
      });
    };

    /**
      Custom transformations depending on the element descriptions.

      TODO: support more custom transforms like def.transform === 'address' which would need
      to do stuff like smash city state zip into one line. The function to do this can't live
      in the json definition, but we can support a set of custom transformations here
      that can be referred to in the json definition.
     */
    var transformElementData = function (def, data) {
      var textOnly,
        mapSource,
        params;

      if (def.transform) {
        params = marryData(def.definition, data, true);
        return transformFunctions[def.transform].apply(this, params);
      }

      if (def.element === 'image') {
        // if the image is not found, we don't want to print it
        mapSource = _.isString(def.definition) ? def.definition : (def.definition[0].attr || def.definition[0].text);
        if (!imageFilenameMap[mapSource]) {
          return "";
        }

        // we save the images under a different name than they're described in the definition
        return path.join(workingDir, imageFilenameMap[mapSource]);
      }

      // these elements are expecting a parameter that is a number, not
      if (def.element === 'bandLine' || def.element === 'fontSize' ||
        def.element === 'margins') {
        return def.size;
      }

      // "print" elements (aka the default) only want strings as the definition
      textOnly = def.element === "print" || !def.element;

      return marryData(def.definition, data, textOnly);
    };

    var formatAddress = function (name, address1, address2, address3, city, state, code, country) {
      var address = [];
      if (name) { address.push(name); }
      if (address1) {address.push(address1); }
      if (address2) {address.push(address2); }
      if (address3) {address.push(address3); }
      if (city || state || code) {
        var cityStateZip = (city || '') +
              (city && (state || code) ? ' '  : '') +
              (state || '') +
              (state && code ? ' '  : '') +
              (code || '');
        address.push(cityStateZip);
      }
      if (country) { address.push(country); }
      return address;
    };

    // this is very similar to a function on the XM.Location model
    var formatArbl = function (aisle, rack, bin, location) {
      return [_.filter(arguments, function (item) {
        return !_.isEmpty(item);
      }).join("-")];
    };

    var formatFullName = function (firstName, lastName, honorific, suffix) {
      var fullName = [];
      if (honorific) { fullName.push(honorific +  ' '); }
      fullName.push(firstName + ' ' + lastName);
      if (suffix) { fullName.push(' ' + suffix); }
      return fullName;
    };

    var transformFunctions = {
      fullname: formatFullName,
      address: formatAddress,
      arbl: formatArbl
    };

    /**
      The "element" (default to "print") is the method on the report
      object that we are going to call to draw the pdf. That's the magic
      that lets us represent the fluentReport functions as json objects.
    */
    var printDefinition = function (report, data, definition) {
      _.each(definition, function (def) {
        var elementData = transformElementData(def, data);
        if (elementData) {
          // debug
          // console.log(elementData);
          report[def.element || "print"](elementData, def.options);
        }
      });
    };

    //
    // WAYS TO RETURN TO THE USER
    //

    /**
      Stream the pdf to the browser (on a separate tab, presumably)
     */
    var responseDisplay = function (res, data, done) {
      res.header("Content-Type", "application/pdf");
      res.send(data);
      done();
    };

    /**
      Stream the pdf to the user as a download
     */
    var responseDownload = function (res, data, done) {
      res.header("Content-Type", "application/pdf");
      res.attachment(reportPath);
      res.send(data);
      done();
    };

    /**
      Send an email
     */
    var responseEmail = function (res, data, done) {

      var emailProfile;
      var fetchEmailProfile = function (done) {
        var emailProfileId = reportData[0].customer.emailProfile,
          statusChanged = function (model, status, options) {
            if (status === XM.Model.READY_CLEAN) {
              emailProfile.off("statusChange", statusChanged);
              done();
            }
          };
        if (!emailProfileId) {
          done({isError: true, message: "Error: no email profile associated with customer"});
          return;
        }
        emailProfile = new SYS.CustomerEmailProfile();
        emailProfile.on("statusChange", statusChanged);
        emailProfile.fetch({
          id: emailProfileId,
          database: databaseName,
          username: username
        });
      };

      var sendEmail = function (done) {
        var formattedContent = {},
          callback = function (error, response) {
            if (error) {
              X.log("Email error", error);
              res.send({isError: true, message: "Error emailing"});
              done();
            } else {
              res.send({message: "Email success"});
              done();
            }
          };

        // populate the template
        _.each(emailProfile.attributes, function (value, key, list) {
          if (typeof value === 'string') {
            formattedContent[key] = XT.String.formatBraces(reportData[0], value);
          }
        });

        formattedContent.text = formattedContent.body;
        formattedContent.attachments = [{fileName: reportPath, contents: data, contentType: "application/pdf"}];

        X.smtpTransport.sendMail(formattedContent, callback);
      };

      async.series([
        fetchEmailProfile,
        sendEmail
      ], done);
    };

    /**
      Silent-print to a printer registered in the node-datasource.
     */
    var responsePrint = function (res, data, done) {
      var printer = ipp.Printer(X.options.datasource.printer),
        msg = {
          "operation-attributes-tag": {
            "job-name": "Silent Print",
            "document-format": "application/pdf"
          },
          data: data
        };

      printer.execute("Print-Job", msg, function (error, result) {
        if (error) {
          X.log("Print error", error);
          res.send({isError: true, message: "Error printing"});
          done();
        } else {
          res.send({message: "Print Success"});
          done();
        }
      });
    };

    // Convenience hash to avoid if-else
    var responseFunctions = {
      display: responseDisplay,
      download: responseDownload,
      email: responseEmail,
      print: responsePrint
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
      Make a directory node-datasource/temp/orgname if none exists
     */
    var createTempOrgDir = function (done) {
      fs.exists("./temp/" + databaseName, function (exists) {
        if (exists) {
          done();
        } else {
          fs.mkdir("./temp/" + databaseName, done);
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
            if (reportDefinitionColl.models[0]) {
              reportDefinition = JSON.parse(reportDefinitionColl.models[0].get("definition"));
            } else {
              done({description: "Report Definition not found."});
              return;
            }
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
        database: databaseName,
        username: username
      });
    };

    //
    // Helper function for fetchImages
    //
    var queryDatabaseForImages = function (imageNames, done) {
      var fileCollection = new SYS.FileCollection(),
        afterFetch = function () {
          if (fileCollection.getStatus() === XM.Model.READY_CLEAN) {
            fileCollection.off("statusChange", afterFetch);
            done(null, fileCollection);
          }
        };

      fileCollection.on("statusChange", afterFetch);
      fileCollection.fetch({
        query: {
          parameters: [{
            attribute: "name",
            operator: "ANY",
            value: imageNames
          }]
        },
        database: databaseName,
        username: username
      });
    };

    //
    // Helper function for writing image
    //
    var writeImageToFilesystem = function (fileModel, done) {
      // XXX this might be an expensive synchronous operation
      var buffer = new Buffer(fileModel.get("data"));

      imageFilenameMap[fileModel.get("name")] = fileModel.get("description");
      fs.writeFile(path.join(workingDir, fileModel.get("description")), buffer, done);
    };

    /**
      We support an image element in the json definition. The definition of that element
      is a string that is the name of an XM.File. We fetch these files and put them in the
      temp directory for future use.
     */
    var fetchImages = function (done) {
      //
      // Figure out what images we need to fetch, if any
      //
      var allElements = _.flatten(_.union(reportDefinition.headerElements,
          reportDefinition.detailElements, reportDefinition.footerElements)),
        allImages = _.unique(_.pluck(_.filter(allElements, function (el) {
          return el.element === "image" && el.imageType !== "qr";
        }), "definition"));
        // thanks Jeremy

      if (allImages.length === 0) {
        // no need to try to fetch no images
        done();
        return;
      }

      //
      // TODO: use the working dir as a cache
      //

      //
      // Get the images
      //
      queryDatabaseForImages(allImages, function (err, fileCollection) {
        //
        // Write the images to the filesystem
        //

        async.map(fileCollection.models, writeImageToFilesystem, done);
      });
    };

    /**
      Fetch the remit to name and address information, but only if it
      is needed.
    */
    var fetchRemitTo = function (done) {
      var allElements = _.flatten(reportDefinition.headerElements),
        definitions = _.flatten(_.compact(_.pluck(allElements, "definition"))),
        remitToFields = _.findWhere(definitions, {attr: 'remitto.name'});

      if (!remitToFields || remitToFields.length === 0) {
        // no need to try to fetch
        done();
        return;
      }

      var requestDetails = {
        nameSpace: "XM",
        type: "RemitTo",
        id: 1
      };
      var callback = function (result) {
        if (!result || result.isError) {
          done(result || "Invalid query");
          return;
        }
        // Add the remit to data to the raw
        // data object
        rawData.remitto = result.data.data;
        done();
      };
      queryForData(req.session, requestDetails, callback);
    };


    /*
     Elements can be defined by attr or text
     {
       "element": "image",
       "imageType": "qr",
       "definition": [{"attr": "billtoName"}],
       "options": {"x": 200, "y": 180}
    },
    {
       "element": "image",
       "imageType": "qr",
       "definition": [{"text": "_invoiceNumber"}],
       "options": {"x": 0, "y": 195}
     },
    */
    var createQrCodes = function (done) {
      //
      // Figure out what images we need to fetch, if any
      //
      var allElements = _.flatten(_.union(reportDefinition.headerElements,
          reportDefinition.detailElements, reportDefinition.footerElements)),
        allQrElements = _.unique(_.pluck(_.where(allElements, {element: "image", imageType: "qr"}), "definition")),
        marriedQrElements = _.map(allQrElements, function (el) {
          return {
            source: el[0].attr || el[0].text,
            target: marryData(el, reportData[0])[0].data
          };
        });
        // thanks Jeremy

      if (allQrElements.length === 0) {
        // no need to try to fetch no images
        done();
        return;
      }

      async.eachSeries(marriedQrElements, function (element, next) {
        var targetFilename = element.target.replace(/\W+/g, "") + ".png",
        qr_svg = qr.image(element.target, { type: 'png' }),
        writeStream = fs.createWriteStream(path.join(workingDir, targetFilename));

        qr_svg.pipe(writeStream);
        writeStream.on("finish", function () {
          imageFilenameMap[element.source] = targetFilename;
          next();
        });

      }, done);
    };

    /**
      Fetch all the translatable strings in the user's language for use
      when we render.
      XXX cribbed from locale route
      TODO: these could be cached
     */
    var fetchTranslations = function (done) {
      var sql = 'select xt.post($${"nameSpace":"XT","type":"Session",' +
         '"dispatch":{"functionName":"locale","parameters":null},"username":"%@"}$$)'
         .f(req.session.passport.user.username),
        org = req.session.passport.user.organization,
        queryOptions = XT.dataSource.getAdminCredentials(org),
        dataObj;

      XT.dataSource.query(sql, queryOptions, function (err, results) {
        var localeObj;
        if (err) {
          done(err);
          return;
        }
        localeObj = JSON.parse(results.rows[0].post);
        // the translations come back in an array, with one object per extension.
        // cram them all into one object
        translations = _.reduce(localeObj.strings, function (memo, extStrings) {
          return _.extend(memo, extStrings);
        }, {});
        done();
      });
    };

    /**
      Get the data for this business object.
      TODO: support lists (i.e. no id)
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
        rawData = _.extend(rawData, result.data.data);
        if (auxilliaryInfo) {
          rawData = _.extend(rawData, JSON.parse(auxilliaryInfo));
        }
        reportData = transformDataStructure(rawData);
        //console.log(reportData);
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
        if (reportDefinition.settings.pageBreakDetail) {
          // TODO: don't want to break after the last page
          reportDefinition.detailElements.push({element: "newPage"});
        }
        printDefinition(report, data, reportDefinition.detailElements);
      };

      var printFooter = function (report, data) {
        printDefinition(report, data, reportDefinition.footerElements);
      };

      var printPageFooter = function (report, data) {
        printDefinition(report, data, reportDefinition.pageFooterElements);
      };

      var rpt = new Report(reportPath)
        .data(reportData)
        .detail(printDetail)
        .pageFooter(printPageFooter)
        .fontSize(reportDefinition.settings.defaultFontSize)
        .margins(reportDefinition.settings.defaultMarginSize);

      rpt.groupBy(req.query.id)
        .header(printHeader)
        .footer(printFooter);

      rpt.render(done);
    };

    /**
      Dispatch the report however the client wants it
        -Email
        -Silent Print
        -Stream download
        -Display to browser
    */
    var sendReport = function (done) {
      fs.readFile(reportPath, function (err, data) {
        if (err) {
          res.send({isError: true, error: err});
          return;
        }
        // Send the appropriate response back the client
        responseFunctions[req.query.action || "display"](res, data, done);
      });
    };

    /**
     TODO
     Do we want to clean these all up every time? Do we want to cache them? Do we want to worry
     about files getting left there if the route crashes before cleanup?
     */
    var cleanUpFiles = function (done) {
      // TODO
      done();
    };

    //
    // Actually perform the operations, one at a time
    //

    async.series([
      createTempDir,
      createTempOrgDir,
      fetchReportDefinition,
      fetchRemitTo,
      fetchTranslations,
      fetchData,
      fetchImages,
      createQrCodes,
      printReport,
      sendReport,
      cleanUpFiles
    ], function (err, results) {
      if (err) {
        res.send({isError: true, message: err.description});
      }
    });
  };

  exports.generateReport = generateReport;

}());
