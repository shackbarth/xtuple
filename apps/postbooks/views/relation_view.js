// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM XT sc_assert */

// Postbooks.RelationView = SC.TextFieldWidget.extend({
// 
//   __trace__: true,
// 
//   init: function() {
//     arguments.callee.base.apply(this, arguments);
//     var isEnabled = this.get('isEnabled');
//     this.__behaviorKey__ = isEnabled? 'Enabled' : 'Disabled';
//   },
// 
//   isEnabledDidChange: function() {
//     this.dispatchEvent(SC.Event.create({
//       type: 'isEnabledDidChange'
//     }));
//   }.observes('isEnabled'),
// 
//   'Enabled': function(evt) {
//     switch (evt.type) {
//       case 'defaultTransition':
//         if (this.get('isFirstResponder')) {
//           this.transition('Editor');
//         } else {
//           this.transition('Inactive');
//         }
//         break;
//       case 'enter':
//         break;
//       case 'exit':
//         break;
//       case 'isEnabledDidChange':
//         if (!this.get('isEnabled')) this.transition('Disabled');
//         break;
//     }
//   }.behavior(),
// 
//   'Disabled': function(evt) {
//     switch (evt.type) {
//       case 'defaultTransition':
//         break;
//       case 'enter':
//         break;
//       case 'exit':
//         break;
//       case 'isEnabledDidChange':
//         if (this.get('isEnabled')) this.transition('Enabled');
//         break;
//     }
//   }.behavior(),
// 
//   'Inactive': function(evt) {
//     
//   }.behavior('Enabled'),
// 
//   'Active': function(evt) {
//     
//   }.behavior('Enabled'),
// 
//   'Editor': function(evt) {
//     
//   }.behavior('Active')
// 
// });
