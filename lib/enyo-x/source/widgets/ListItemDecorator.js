(function () {

  /**
   * List Item Decorator.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: 'XV.ListItemDecorator',
    kind: 'XV.ModelDecorator',
    classes: 'xv-listitem-decorator',

    handlers: {
      onSetupCell: 'setupCell'
    },

    /**
     * @override
     */
    decorate: function (control) {

    },

    /**
     * @listens onSetupCell
     */
    setupCell: function(inSender, inCell) {
      this.decorate(inCell);
    }
  });
})();
