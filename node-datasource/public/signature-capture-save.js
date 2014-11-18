var saveSignature;

(function () {

  // thx http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  saveSignature = function (data, callback) {
    var org = getUrlParameter("org");
    var salesOrderId = getUrlParameter("id");
    var salesOrderEtag;
    var salesOrderData;
    var root = location.protocol + "//" + location.host + "/" + org + "/browser-api/v1/resources/";
    var fileId;

    var reader = new FileReader(),
      readBlob = function (done) {
        reader.onload = function () {
          done();
        };
        reader.readAsBinaryString(data); // async
      },
      saveFile = function (done) {
        // XXX TODO localization
        var filename =  "SalesOrder".replace(/ /g, "") + salesOrderId + "Signature";

        var data = {
          data: reader.result,
          name: filename,
          description: filename.toLowerCase() + ".png"
        };

        var url = root + "file";
        var success = function (resp) {
          if (_.isString(resp)) {
            // probably the login page
            window.location = "/logout";
            return done(true);
          }
          fileId = resp.data.id;
          done();
        };
        $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: success
        });
      },
      fetchSalesOrder = function (done) {
        var url = root + "sales-order/" + salesOrderId;
        var success = function (resp) {
          salesOrderData = resp.data.data;
          salesOrderEtag = resp.data.etag;
          done();
        };
        $.ajax({
          type: "GET",
          url: url,
          success: success
        });
      },
      createDocumentAssociation = function (done) {
        var url = root + "sales-order/" + salesOrderId;
        var observer = jsonpatch.observe(salesOrderData);
        salesOrderData.documents.push({
          //source: salesOrderId,
          sourceType: "S",
          targetType: "FILE",
          target: {uuid: fileId},
          purpose: "S"
        });

        var patch = jsonpatch.generate(observer);
        var success = function (resp) {
          done();
        };
        $.ajax({
          type: "PATCH",
          url: url,
          data: {patches: patch, etag: salesOrderEtag},
          success: success
        });
      };

    async.series([
      readBlob,
      saveFile,
      fetchSalesOrder,
      createDocumentAssociation
    ], callback);
  };

}());
