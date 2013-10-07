/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initWorkspaces = function () {

    enyo.kind({
      name: "XV.BillingWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_billing".loc(),
      model: "XM.Billing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
                classes: "in-panel", components: [
              // TODO decorate
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.SalesCategoryWorkspace",
      kind: "XV.Workspace",
      title: "_salesCategory".loc(),
      model: "XM.SalesCategory",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.CheckboxWidget", attr: "isActive"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.SalesCategory", "XV.SalesCategoryWorkspace");
  };

}());
