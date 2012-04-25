// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  @extends XT.Record
*/
XM.CharacteristicAssignment = XT.Record.extend(
  /** @scope XM.CharacteristicAssignment.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  value: SC.Record.attr(String, {
    toType: function(record, key, value) {
      if(value) {
        var type = record.getPath('characteristic.characteristicType');
        if(type && type === XM.Characteristic.DATE) {
          value = XT.DateTime.parse(value, '%Y-%m-%d');
        }
      }
      return value;
    },
    fromType: function(record, key, value) {
      if(value) {
        var type = record.getPath('characteristic.characteristicType');
        if(type && type === XM.Characteristic.DATE) {
          value = value.toFormattedString('%Y-%m-%d'); }
      }
      return value;
    }
  }),

  // ..........................................................
  // OBSERVERS
  //

  characteristicDidChange: function() {
    var characteristic = this.get('characteristic');

    if(this._oldChar && this._oldChar != characteristic) {
      this.set('value', '');
    };

    this._oldChar = characteristic;

  }.observes('characeteristic'),

}) ;
