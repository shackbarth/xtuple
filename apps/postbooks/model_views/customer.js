// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Customer = {};
Postbooks.Customer.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.get('billingContact');
  var address = contact? contact.get('address') : null;
  address = address? address.formatShort() : '';
  
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
  
  // Billing Contact Phone
  var phoneWidth = 0;
  val = contact? contact.get('phone') : '';
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val) val = val.elide(context, 195);
  context.fillText(val, 315, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
  
  // Number
  val = object.get('number');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val.elide(context, 295 - phoneWidth);
  context.fillText(val, 15, 15);
  
  // Billing Contact Email
  var emailWidth = 0;
  val = contact? contact.get('primaryEmail') : '';
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'blue';
  context.fillText(val, 315, 35);
  if (val) emailWidth = context.measureText(val).width + 5; 
   
  // Name
  val = object.get('name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  if (address) val = val.elide(context, 300 - emailWidth);
  context.fillText(val? val : "_noName".loc(), 15, 35);

  // Billing Contact Name
  val = contact? contact.get('name') : '';
  context.font = "italic 8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  val = val? val : "_noContact".loc();
  context.fillText(val, 325, 15);
  
  // Primary Contact Location
  val = address;
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 325, 35);

};

Postbooks.Customer.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Customer.Tiles()');
  
  var klass = XM.Customer,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // Additional
  properties = 'number name customerType isActive spacer salesRep commission taxZone currency'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_overview".loc(), properties));
  
  // Terms
  properties = 'terms discount creditStatus spacer balanceMethod creditLimit creditLimitCurrency creditRating graceDays'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_terms".loc(), properties));

  // Billing Contact
  tiles.push(Postbooks.Customer.CreateBillingContactTileView(controller));
  
  // Correspondence Contact
  tiles.push(Postbooks.Customer.CreateCorrespondenceContactTileView(controller));
  
  // Sales
  properties = 'isFreeFormBillto isFreeFormShipto shipVia shipCharge'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_sales".loc(), properties));
  
  return tiles;

};

Postbooks.Customer.CreateBillingContactTileView = function(controller) {
 console.log('Postbooks.Customer.CreateOverviewTileView(', controller, ')');

 var proto = XM.Customer.prototype,
     key, property, objectKlass, objectController;

 key = 'billingContact';
 property = proto[key];
 objectKlass = property.get('typeClass');
 objectController = SC.ObjectController.create({
   contentBinding: SC.Binding.from(key, controller).single().oneWay()
 });

 return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_billingContact".loc());

};

Postbooks.Customer.CreateCorrespondenceContactTileView = function(controller) {
 console.log('Postbooks.Customer.CreateOverviewTileView(', controller, ')');

 var proto = XM.Customer.prototype,
     key, property, objectKlass, objectController;

 key = 'correspondenceContact';
 property = proto[key];
 objectKlass = property.get('typeClass');
 objectController = SC.ObjectController.create({
   contentBinding: SC.Binding.from(key, controller).single().oneWay()
 });

 return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_correspondenceContact".loc());

};

