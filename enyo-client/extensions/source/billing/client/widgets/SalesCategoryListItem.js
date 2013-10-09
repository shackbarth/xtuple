enyo.kind({
  name: "XV.SalesCategoryListItem",
  kind: "XV.ListItem",
  

  /**
   * @override
   */
  modelChanged: function () {
    this.$.name.setContent(this.model.get('name'));
    this.$.desc.setContent(this.model.get('description'));
  },
  handleDeactivateAction: function (inEvent) {
    var model = inEvent.model;

    model.on("all", enyo.bind(this, "handleDeactivateSuccess"));
    model.save({ isActive: false }, { patch: true });
  },
  handleDeactivateSuccess: function (model, value, options) {
    this.log(options);
  },
  handleDeactivateError: function (model, value, options) {

  }

});

