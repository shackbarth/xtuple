(function () {

  enyo.kind({
    name: 'XV.SalesCategoryListItem',
    kind: 'XV.ListItem',
    view: 'XM.SalesCategoryView',

    published: {
      model: null
    },

    /**
     * @see XM.SalesCategoryView
     * @listens XM.SalesCategoryView#events
     */
    handlers: {
      'onCanDeactivateChange': 'handleCanDeactivateChange',
      'onIsActiveChange':      'handleIsActiveChange' 
    },

    /**
     * @listens onCanDeactivateChange
     */
    handleCanDeactivateChange: function (inModel, inValue) {
      this.log(arguments);
    },
    /**
     * @listens onIsActiveChange
     */
    handleIsActiveChange: function (inModel, inValue) {
      this.log(arguments);

    },



    /**
     * When a model is set on this component, bind to it.
     * TODO promote into some superclass
     */
    modelChanged: function () {
      if (!model) return;

      new XT.getObjectByName(this.view)({
        model: this.model,
        $el: this,
        el: this.hasNode(),
      });
    }
  });

})();
