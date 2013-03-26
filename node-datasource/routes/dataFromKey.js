/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    We've stored report data in a temporary table with a key. Return the data to anyone who has the
    appropriate key.
   */
  exports.dataFromKey = function (req, res) {

    var dataKey = (req.query && req.query.dataKey) || -1,
      tempDataModel = new XM.BiCache({key: dataKey});

    tempDataModel.fetch({success: function (model, result) {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({
        data: JSON.parse(model.get("data")),
        query: JSON.parse(model.get("query"))
      }));

      // this message will self-destruct in 1 second...
      // TODO: makes more sense to sweep out old records. We'll have
      // to do that anyway.
      //model.destroy({
      //  success: function () {
      //    console.log("destroy success")
      //  },
      //  error: function () {
      //    console.log("destroy error")
      //  }
      //});
    }, error: function (model, err) {
      console.log("error", model);
      if (err.code === 'xt1007') {
        res.send({isError: true, message: "Record not found"});
      } else {
        res.send({isError: true, message: "Error"});
      }
    }});
  };

}());
