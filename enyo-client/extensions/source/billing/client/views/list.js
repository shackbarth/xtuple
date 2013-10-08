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
          {attribute: 'name'}
        ]
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "XV.ListAttr", attr: "name", isKey: true},
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelList("XM.SalesCategory", "XV.SalesCategoryList");
  };

}());

