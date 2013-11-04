(function () {

  XT.extensions.billing.initParameters = function () {

    // ..........................................................
    // RECEIVABLE
    //

    enyo.kind({
      name: "XV.ReceivableListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_dateRange".loc()},
      ]
    });
  };

}());
