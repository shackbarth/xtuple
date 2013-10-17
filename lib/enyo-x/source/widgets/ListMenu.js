(function () {

  enyo.kind({
    name: 'XV.ListMenu',
    classes: 'xv-list-menu',
    published: {
      loading: null,
    },
    components: [
    ],

    handlers: {
      onListMenuReady: 'listMenuReady'
    },

    events: {
    //  onListMenuTap: '',
     // onActionSelected: ''
    },

    showingChanged: function () {
      this.inherited(arguments);
      if (this.showing) return;

      // load the menu actions
    },

    gearTap: function (inSender, inEvent) {
      this.inherited(arguments);

      return true;
    },

    /**
     * Initialize the menu with the provided actions list.
     */
    actionsChanged: function () {
      this.log(this.actions);
      //this.$.menuItems.setCount(this.actions.length);
    },


    /**
     * Add an item (action) to the menu.
     */
    setupMenuItem: function (inSender, inEvent) {
      this.log(inEvent);

        // otherwise if we have permissions, make it
        /*
      var action = this.actions[inEvent.index],
        isDisabled = !inEvent.actionPermissions[name],
        component = _.find(menu.$, function (value, key) {
          // see if the component has already been created
          return key === name;
        });
      if (component) {
        // if it's already been created just handle state
        component.setDisabled(isDisabled);

      } else {
        menu.createComponent({
          name: name,
          kind: 'XV.MenuItem',
          content: action.label || ('_' + name).loc(),
          action: action,
          disabled: isDisabled
        });
      }
        */
      // else if it doesn't exist and we don't
      // have permissions, do nothing

      return true;
    },

    listActionSelected: function (inSender, inEvent) {
      this.log(inEvent);
      var list = this.$.contentPanels.getActive(),
        keys = _.keys(list.getSelection().selected),
        collection = list.getValue(),
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
            model = collection.at(keys[0]);
          if (action.isViewMethod) {
            list.$.listItem.doActionSelected({
              model: model,
              action: action
            });

          // If the list item model doesn't have the function being asked for, try the editable version
          // Either way, loop through selected models and perform method
          } else if (model instanceof XM.Info && !model[method]) {
            Klass = XT.getObjectByName(model.editableModel);
            _.each(keys, function (key) {
              model = collection.at(key);
              Klass[method](model, callback);
            });
          } else {
            _.each(keys, function (key) {
              model = collection.at(key);
              model[method](callback);
            });
          }
        };

      if (action.notify !== false) { // default to true if not specified
        // if the action requires a user OK, ask the user
        this.doNotify({
          type: XM.Model.QUESTION,
          message: action.notifyMessage || '_confirmAction'.loc(),
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
      this.log(inEvent);
      var menu = this.$.menu;

      // reset the menu based on the list specific to this request
      //menu.destroyClientControls();

      // then add whatever actions are applicable
      menu.render();

      // convoluted code to help us deceive the Menu into thinking
      // that it's part of a MenuDecorator which is inside the
      // list.
      if (!inEvent.originator.hasNode()) {
        inEvent.originator.node = inEvent.originator.eventNode;
      }
      inEvent.originator.generated = true;
      menu.requestMenuShow(this.parent.parent.parent,
          {activator: inEvent.originator});
      menu.adjustPosition();
    }

  });

})();

