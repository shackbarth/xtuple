/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initLists = function () {

    enyo.kind({
      name: "XV.SalesCategoryList",
      kind: "XV.List",
      label: "_salesCategories".loc(),
      collection: "XM.SalesCategoryCollection",
      query: {
        orderBy: [
          {attribute: 'isActive'},
          {attribute: 'name'}
        ]
      },
      actions: [{
        name: "deactivate",
        prerequisite: "hasDeactivateActionPrerequisite",
        method: "handleDeactivateAction",
        isViewMethod: true
      }],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "XV.ListAttr", attr: "name", isKey: true},
              {kind: "XV.ListAttr", attr: "description"}
            ]},
            {kind: "XV.ListAttr", attr: "isActive"}
          ]}
        ]}
      ],
      handleDeactivateAction: function (inEvent) {
        var model = inEvent.model;

        this.log(inEvent);

        model.on("all", enyo.bind(this, "handleDeactivateSuccess"));
        model.save("isActive", false);
      },
      handleDeactivateSuccess: function (model, value, options) {
        this.log(model);
      }
    });

    XV.registerModelList("XM.SalesCategory", "XV.SalesCategoryList");
  };

}());

