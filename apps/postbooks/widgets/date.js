// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT */

Postbooks.DateWidget = SC.TextFieldWidget.extend({

  date: null,

  value: function() {
    var date = this.get('date');
    sc_assert(!date || date.kindOf(XT.DateTime));
    return date? date.toLocaleDateString() : "no date set";
  }.property('date'),

  valueForFieldEditor: function() {
    console.log('valueForFieldEditor');
    var date = this.get('date');
    sc_assert(!date || date.kindOf(XT.DateTime));
    console.log(date? date.toISO8601() : "(no date)");
    return date? date.toISO8601() : "";
  },

  takeValueFromFieldEditor: function(value) {
    console.log('takeValueFromFieldEditor', value);

    if (!value) this.set('date', null);
    else {
      var date = XT.DateTime.parse(value);
      // Only change our date if we actually were able to parse the user's 
      // date string.
      if (date) this.set('date', date);
    }
  }

});
