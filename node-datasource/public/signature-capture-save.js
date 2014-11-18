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
    var id = getUrlParameter("id");
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
        var root = location.protocol + "//" + location.host + "/" + org;
        var filename =  "SalesOrder".replace(/ /g, "") + id + "Signature";

        var data = {
          data: reader.result,
          name: filename,
          description: filename.toLowerCase() + ".png"
        };

        var url = root + "/browser-api/v1/resources/file";
        var success = function (resp) {
          console.log("success", arguments);
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
      createDocumentAssociation = function (done) {
        console.log("file id is", fileId);
        /*
        var docAss = new XM.SalesOrderFile();
        docAss.initialize(null, {isNew: true});
        docAss.set({
          file: fileRelation,
          purpose: "S"
        });
        salesOrder.get("files").add(docAss);
        */
        done();
      };

    async.series([
      readBlob,
      saveFile,
      createDocumentAssociation
    ], callback);
  };

}());
