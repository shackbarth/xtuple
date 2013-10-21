/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initWorkspaces = function () {

    enyo.kind({
      name: "XV.SalesCategoryWorkspace",
      kind: "XV.Workspace",
      view: "XM.SalesCategoryView",
      title: "_salesCategory".loc(),

      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.CheckboxWidget", name: 'isActive', attr: "isActive", disabled: true}
            ]}
          ]}
        ]}
      ],

      /**
       * @see XM.SalesCategoryView
       * @listens XM.SalesCategoryView#events
       */
      handlers: {
        onCanDeactivateChange: 'canDeactivateChanged',
        onModelReadyClean:     'modelReady'
      },

      /**
       * @listens onModelReadyClean
       */
      modelReady: function (inSender, inEvent) {
        if (this.value.get('isActive')) {
          inEvent.result.canDeactivate();
        }
        else {
          this.$.isActive.setDisabled(!this.value.canEdit('isActive'));
        }

        return true;
      },

      /**
       * @listens onCanDeactivateChange
       */
      canDeactivateChanged: function (inSender, canDeactivate) {
        this.$.isActive.setDisabled(!canDeactivate);

        return true;
      }
    });

    XV.registerModelWorkspace("XM.SalesCategory", "XV.SalesCategoryWorkspace");
  };
}());
