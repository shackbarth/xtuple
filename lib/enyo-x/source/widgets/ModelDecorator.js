(function () {

  /**
   * Decorate the presentation of a Model.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: "XV.ModelDecorator",
    classes: 'xv-model-decorator',
    statics: {
      /**
       * Get a CSS class name from a model's attribute.
       */
      classFromAttribute: function (attr) {
        return 'xm-attribute-' + attr;
      }
    },
    published: {
      control: null
    },
    
    create: function () {
      this.inherited(arguments);
      var controls = this.getClientControls();

      if (controls.length !== 1) {
        console.warn('XV.ModelDecorator must parent exactly one child.');
        return;
      }
      this.control = controls[0];
      this.control.decorated = true;
    }
  });

  /**
   * List Item Decorator.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: 'XV.ListItemDecorator',
    kind: 'XV.ModelDecorator',
    classes: 'xv-listitem-decorator',

    handlers: {
      onSetupCell: 'setupCell',
      onSetupItem: 'setupItem'
    },

    itemTap: function (inSender, inEvent) {
      //this.log(inEvent);
      //this.control.addRemoveClass
    },

    setupItem: function (inSender, inEvent) {
      this.control.addRemoveClass('item-selected', inEvent.selected);
      return true;
    },

    decorate: function () {

    },

    /**
     * @listens onSetupCell
     */
    setupCell: function (inSender, inCell) {
      var model = this.control.model,
        attr = inCell.attributes.attr;

      inCell.addClass('xv-list-column');
      inCell.addClass('xv-list-attr');
      inCell.addClass(XV.ModelDecorator.classFromAttribute(attr));
      inCell.addRemoveClass('xm-attribute-id', model.idAttribute === attr);
    }
  });

})();
