(function () {

  /**
   * Decorate the presentation of a Model.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: "XV.ModelDecorator",
    classes: 'xv-model-decorator',
    published: {
      model: null,
      view: null,
      template: null
    },
    handlers: {
      onAfterViewBind: 'handleAfterViewBind'
    },

    create: function () {
      this.inherited(arguments);
      var controls = this.getClientControls();

      if (controls.length !== 1) {
        console.warn('XV.ModelDecorator must parent exactly one child.');
        return;
      }

      controls[0].decorated = true;
    },

    /**
     * @abstract
     * Decorate the components. Subkind must implement.
     */
    decorate: function (control) { }

  });
})();
