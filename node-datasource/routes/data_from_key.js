/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS: true */

(function () {
  "use strict";
  /**
  @name XV.DataFromKey
  @class XV.DataFromKey
  We've stored report data in a temporary table with a key. Return the data to anyone who has the
  appropriate key.
  */
  exports.dataFromKey = function (req, res) {

    var dataKey = (req.query && req.query.datakey) || -1,
      tempDataModel = new SYS.BiCache({key: dataKey});

    tempDataModel.fetch({success: function (model, result) {
      if (!model.get("data")) {
        res.send({isError: true, message: "Data not found"});
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({
        data: JSON.parse(model.get("data")).data,
        locale: JSON.parse(model.get("locale")),
        schema: JSON.parse(model.get("schema")),
        query: JSON.parse(model.get("query"))
      }));

    },
    error: function (model, err) {
      console.log("error", model);
      if (err.code === 'xt1007') {
        res.send({isError: true, message: "Record not found"});
      } else {
        res.send({isError: true, message: "Error"});
      }
    },
    database: req.params.org });
  };

}());
