// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XT.Record
  @version 0.1
*/
XT.CharacteristicAssignment = XT.Record.extend(
/** @scope XT.CharacteristicAssignment.prototype */ {

  className: 'XT.CharacteristicAssignment',

  target:         SC.Record.attr(Number),
  targetType:     SC.Record.attr(String),
  characteristic: SC.Record.toOne('XT.Characteristic'),
  value:          SC.Record.attr(String, {
    toType: function(record, key, value) {
      if(value) {
        var type = record.getPath('characteristic.type');
        if(type && type === XT.Characteristic.DATE) {
          value = SC.DateTime.parse(value, '%Y-%m-%d');
        }
      }
      return value;
    },
    fromType: function(record, key, value) {
      if(value) {
        var type = record.getPath('characteristic.type');
        if(type && type === XT.Characteristic.DATE) {
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

  validate: function() {
    var characteristic = this.get('characteristic');
    errors = this.get('validateErrors');
    nameErr = XT.errors.findProperty('code', 'xt1004');

    // Validate Characteristic
    this.updateErrors(nameErr, SC.none(characteristic));

    return errors;
  }.observes('characteristic')

}) ;
