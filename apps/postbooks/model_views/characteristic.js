// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

var base03 =   "#002b36";
var base02 =   "#073642";
var base01 =   "#586e75";
var base00 =   "#657b83";
var base0 =    "#839496";
var base1 =    "#93a1a1";
var base2 =    "#eee8d5";
var base3 =    "#fdf6e3";
var yellow =   "#b58900";
var orange =   "#cb4b16";
var red =      "#dc322f";
var magenta =  "#d33682";
var violet =   "#6c71c4";
var blue =     "#268bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";

Postbooks.ContactCharacteristic = {};

Postbooks.ContactCharacteristic.CreateTileListView = function(controller) {
  console.log('Postbooks.ContactCharacteristic.CreateTileListView()');

  var klass = XM.ContactCharacteristic;

  // Nope, generate the default tile view on the fly.
  var list = Postbooks.CharacteristicsListView.create({
    layout: { top: 0, left: 0, right: 0, bottom: 0 },
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    baseClass: klass,

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal(klass.prototype.className.slice(3), "Back", instance);
      
        // Deselect our row after the modal transition ends.
        setTimeout(function() {
          SC.RunLoop.begin();
          that.get('content').deselectObject(instance);
          SC.RunLoop.end();
        }, 250);
      }
    }
  });

  return list;
};