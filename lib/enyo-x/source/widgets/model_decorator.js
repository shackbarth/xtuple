(function () {

  XV.ModelAttributeFormatters = {
    formatters: {
      'Date': function (inModel, inCell, inValue) {
        inCell.setContent(moment(inValue).format('MM/DD/YYYY'));
      },
      'Money': function (inModel, inCell, inValue) {
        inCell.setContent(inModel.get('currency').get('symbol') + inValue);
      }
    }
  };

  /**
   * Decorate the presentation of a Model.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: "XV.ModelDecorator",
    classes: 'xv-model-decorator',
    statics: {
      /**
       * Getter for nested attr strings, e.g. foo.bar.x.y
       */
      getValue: function (path, model) {
        return path && _.reduce(path.split('.'), function (memo, token) {
          return memo.get(token);
        }, model);
      },
      /**
       * Get a CSS class name from a model's attribute.
       */
      classFromAttribute: function (attr) {
        return 'xm-attribute-' + attr.replace('.', '-');
      },
      classFromType: function (type) {
        return 'xm-attributetype-' + type.toLowerCase();
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
   * @extends XV.ModelDecorator
   * @mixes XV.ModelAttributeFormatters
   */
  enyo.kind(
    enyo.mixin(XV.ModelAttributeFormatters, /** @lends XV.ListItemDecorator# */{

    name: 'XV.ListItemDecorator',
    kind: 'XV.ModelDecorator',
    classes: 'xv-listitem-decorator',

    handlers: {
      onSetupCell: 'setupCell',
      onIsActiveChange: 'isActiveChanged'
    },

    isActiveChanged: function () {
      this.control.addRemoveClass('isActive', this.isActive);
    },

    /**
     * @listens onSetupCell
     */
    setupCell: function (inSender, inCell) {
      var model = this.control.value,
        attr = inCell.attributes.attr,
        formatter = inCell.attributes.formatter,
        type = model.getAttributeType(attr);

      inCell.addClass('xv-list-column');
      inCell.addClass('xv-list-attr');
      inCell.addClass(XV.ModelDecorator.classFromAttribute(attr));
      inCell.addRemoveClass('xm-attribute-id', model.idAttribute === attr);
      inCell.isKey = (model.idAttribute === attr);

      if (type) {
        inCell.addClass(XV.ModelDecorator.classFromType(type));
      }

      if (formatter && _.isFunction(this.control[formatter])) {
        this.control[formatter](model, inCell);
      }
      else if (type && this.formatters[type]) {
        this.formatters[type](model, inCell, model.get(attr));
      }
    }
  }));
})();
