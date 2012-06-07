// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT */

Postbooks.ToOneSelectWidget = SC.SelectWidget;

Postbooks.SelectWidgetMenuView = SC.SelectWidgetMenuView.extend({

  // Copied from SC.SelectWidgetMenuView
  mouseDown: function(evt) {
    var active = this._sc_activeMenuItem,
        ret = false;

    if (active) active.set('isActive', false);
    this._sc_activeMenuItem = null;

    // Nothing to do if we're not enabled.
    if (!this.get('isEnabled')) {
      ret = true;

    // Nothing to do if no menu item was active.
    } else if (!active) {
      ret = true;

    // Okay, we need to deal with the mouseDown event.
    } else {
      sc_assert(active);
      var menuItem = evt.layer;

      // Nothing to do if we didn't click an enable menu item.
      if (!menuItem.get('isEnabled')) {
        ret = true;

      // Okay, the mouse went up over an enable menu item.  We need to 
      // update our value with it's value, select it, and unselected the 
      // currently selected menu item.
      } else {
        var index = this.get('layers').indexOf(menuItem),
            item = this.get('displayItems').objectAt(index);

        sc_assert(index >= 0);
        sc_assert(item);

        if (item[1].isClass) {
          // alert('This is where you load the list editor modal.');
          Postbooks.LoadListEditorModal(item[1]);
        } else {
          // Update our 'value' property.  _sc_valueDidChange() will handle 
          // updating the radio button's isSelected values.
          this.set('value', item[1]);

          // Let our SelectWidget know.
          this.get('action').call(this);
        }

        ret = true;
      }
    }

    SC.app.popMenuSurface(null);
    SC.app.removeSurface(this);

    return ret;
  },

  displayItems: function() {
    var ret = arguments.callee.base.apply(this, arguments);

    // spacer
    ret.push(['', null, true, null, null,  null, ret.length-1, true]);

    ret.push(['Edit List…', this.getPath('selectWidget.recordType'), true, null, null,  null, ret.length-1, false]);

    return ret ;
  }.property('items', 'itemTitleKey', 'itemValueKey', 'itemIsEnabledKey', 'localize')

});

Postbooks.EditableToOneSelectWidget = Postbooks.ToOneSelectWidget.extend({

  menuViewClass: Postbooks.SelectWidgetMenuView,

  recordType: null,

  displayItems: function() {
    var ret = arguments.callee.base.apply(this, arguments);

    // spacer
    ret.push(['', null, true, null, null,  null, ret.length-1, true]);

    ret.push(['Edit List…', this.get('recordType'), true, null, null,  null, ret.length-1, false]);

    return ret ;
  }.property('items', 'itemTitleKey', 'itemValueKey', 'itemIsEnabledKey', 'localize')

});