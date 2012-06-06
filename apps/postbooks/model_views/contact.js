// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');
sc_require('views/carousel');
sc_require('views/tile_view');

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

Postbooks.Contact = {};

Postbooks.Contact.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  // Rect
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();
  
  context.textAlign = 'left';
  context.textBaseline = 'middle';
 
  // Phone
  var phoneWidth = 0;
  val = object.get('phone') || '';
  context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val && val.elide) val = val.elide(context, 195);
  context.fillText(val, 315, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
    
  // Contact Name
  var firstName = object.get('firstName');
  var lastName = object.get('lastName');
  var firstNameWidth = 0;
  if (!lastName && firstName) {
    lastName = firstName;
    firstName = null;
  }
  if (firstName && lastName) {
    val = firstName;
    context.font = "10pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    if (val && val.elide) val = val.elide(context, 300-phoneWidth);
    context.fillText(val, 15, 15);
    firstNameWidth = context.measureText(val).width + 5;  
  }
  if (lastName) {
    val = lastName;
    context.font = "bold 10pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    if (val && val.elide) val = val.elide(context, 300-firstNameWidth-phoneWidth);
    context.fillText(val, 15+firstNameWidth, 15);
  } else  {
    context.font = "italic 10pt "+K.TYPEFACE;
    context.fillStyle = base1;
    context.textAlign = 'left';
    context.fillText("_noName".loc(), 15, 15);
  }
  

  // Email
  var emailWidth = 0;
  val = object.getPath('primaryEmail') || '';
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'blue';
  context.textAlign = 'right';
  context.fillText(val , 315, 35);
  if (val) emailWidth = context.measureText(val).width + 5;
  
  // Title
  val = object.get('jobTitle');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val? val : "_noJobTitle".loc();
  if (val && val.elide) val = val.elide(context, 305 - emailWidth);
  context.fillText(val , 15, 35);

  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val? val : "_noAccountName".loc();
  context.fillText(val , 325, 15);

  // Location
  val = object.get('address');
  val = val? val.formatShort() : '';
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val , 325, 35);

};

Postbooks.Contact.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Contact.Tiles()');
  
  var klass = XM.Contact,
      tiles = [],
      proto = klass.prototype,
      properties = [], commands = [];

  // overview
  properties = ' isActive number spacer honorific firstName middleName lastName suffix jobTitle '.w();
  commands = [{
      title: "\u2699",
      value: null,
      enabled: true
    }, {
      title: "_delete".loc(),
      value: 'delete',
      enabled: true
  }];
  tiles.push(Postbooks.CreateTileView(klass, controller, null, properties, commands, true));

  // details
  properties = 'phone alternate fax spacer primaryEmail webAddress spacer account owner '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_details".loc(), properties));
  
  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  //to-many relationships
  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        title = ("_"+key).loc();

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      tiles.push(Postbooks.CreateTileListViewForClass(arrayKlass, arrayController, title, controller, arrayController));
    }
  }

  return tiles;
};

