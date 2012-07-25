/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XT.TestSuite",
    kind: "enyo.TestSuite",
    test123: function () {
      this.finish("error1");
    }
  });
}());


    /*

  var testObj = XT.app.$.num;

  testObj.setValue("10");
  console.log(typeof testObj.getValue() === 'number');
  console.log(typeof testObj.value === 'string');

  testObj.setValue(4.5);
  console.log(testObj.getValue() === 4.5);
  console.log(testObj.value === "4.5" || testObj.value === 4.5); // we don't care which one

  testObj.setValue('');
  console.log(testObj.getValue() === null);
  console.log(testObj.value === '');

  testObj.setValue(null);
  console.log(testObj.getValue() === null);

  testObj.setValue("-4.3");
  console.log(testObj.getValue() === -4.3);
  console.log(testObj.value === "-4.3");

  testObj.setValue("inval");
  console.log(testObj.getValue() === null);



    */
