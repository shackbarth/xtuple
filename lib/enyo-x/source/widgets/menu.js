/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
	@name XV.MenuItem
    @class A button styled to look like a menu item, intended for use in an onyx.Menu.<br />
    For example, see the popup menu in {@link XV.RelationWidget}.<br />
    Derived from <a href="http://enyojs.com/api/#onyx.MenuItem">onyx.MenuItem</a>.
    @extends onyx.MenuItem
   */
  enyo.kind(
    /** @lends XV.MenuItem# */{
    name: "XV.MenuItem",
    kind: "onyx.MenuItem",
    classes: "xv-menuitem",

    disabledChanged: function () {
      this.addRemoveClass("disabled", this.disabled);
    },

    tap: function (inSender) {
      if (!this.disabled) { return this.inherited(arguments); }
    }
  });

  /**
    Used by container views to handle list actions.
  */
  XV.ListMenuManagerMixin = /** @lends XV.ListMenuManagerMixin# */{
    listActionSelected: function (inSender, inEvent) {
      var list = inEvent.originator.list,
        keys = _.keys(list.getSelection().selected),
        action = inEvent.originator.action,
        method = action.method,
        callback = function () {
          list.resetActions();
          _.each(keys, function (key) {
            list.deselect(key);
            list.renderRow(key);
          });
        },
        confirmed = function () {
          var Klass,
            model = list.getModel(keys[0]);
          if (action.isViewMethod) {
            list.$.listItem.doActionSelected({
              model: model,
              action: action,
              callback: callback
            });

          // If the list item model doesn't have the function being asked for, try the editable version
          // Either way, loop through selected models and perform method
          } else if (model instanceof XM.Info && !model[method]) {
            Klass = XT.getObjectByName(model.editableModel);
            _.each(keys, function (key) {
              model = list.getModel(key);
              Klass[method](model, callback);
            });
          } else {
            _.each(keys, function (key) {
              model = list.getModel(key);
              model[method](callback);
            });
          }
        };

      if (action.notify !== false) { // default to true if not specified
        // if the action requires a user OK, ask the user
        this.doNotify({
          type: XM.Model.QUESTION,
          message: action.notifyMessage || "_confirmAction".loc(),
          callback: function (response) {
            if (response.answer) {
              confirmed();
            }
          }
        });

      } else {
        // if the action does not require a user OK, just do the event
        confirmed();
      }
      return true;
    },
    showListItemMenu: function (inSender, inEvent) {
      var menu = this.$.listItemMenu;

      // reset the menu based on the list specific to this request
      menu.destroyClientControls();

      // then add whatever actions are applicable
      _.each(inEvent.actions, function (action) {
        var name = action.name,
          actPrivs = action.privilege ? action.privilege.split(" ") : [],
          isDisabled = false,
          component = _.find(menu.$, function (value, key) {
            // see if the component has already been created
            return key === name;
          });

        if (actPrivs.length) {
          isDisabled = !_.some(actPrivs, function (privilege) {
            return XT.session.privileges.get(privilege);
          });
        }

        if (component) {
          // if it's already been created just handle state
          component.setDisabled(isDisabled);

        } else {
          // otherwise if we are allowed, make it
          if (inEvent.actionPermissions[name]) {
            menu.createComponent({
              name: name,
              kind: 'XV.MenuItem',
              content: action.label || ("_" + name).loc(),
              action: action,
              disabled: isDisabled,
              list: inEvent.list
            });
          }
        } // else if it doesn't exist and we don't have permissions, do nothing
      
      });

      // If no menu items, let the user know something about the situation
      if (!menu.getClientControls().length) {
        menu.createComponent({
          name: "noActions",
          kind: 'XV.MenuItem',
          content: "_noEligibleActions".loc(),
          disabled: true
        });
      }

      menu.render();

      // convoluted code to help us deceive the Menu into thinking
      // that it's part of a MenuDecorator which is inside the
      // list.
      if (!inEvent.originator.hasNode()) {
        inEvent.originator.node = inEvent.originator.eventNode;
      }
      inEvent.originator.generated = true;
      menu.requestMenuShow(this, {activator: inEvent.originator});
      menu.adjustPosition();
    }
  };

}());
