// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

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

XM.Contact.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks;
  // Rect
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {
    // Contact Name
    var val = object.get('name');
    context.font = (val? "bold " : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noName".loc(), 15, 15);
    
    // Account Name
    context.save();
    val = object.getPath('account.name');
    context.font = (val? "" : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noAccountName".loc() , 15, 35);
    context.restore();
    
    // Title
    context.save();
    val = object.get('jobTitle');
    context.font = "italic 8pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noJobTitle".loc() , 15, 55);
    context.restore();
    
    // Phone
    context.save();
    val = object.get('phone');
    context.font = (val? "" : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noPhone".loc(), 255, 15);
    context.restore();
    
    // Email
    context.save();
    val = object.getPath('primaryEmail');
    context.font = (val? "" : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'blue' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noEmail".loc() , 255, 35);
    context.restore();
    
    // Title
    context.save();
    var city = object.getPath('address.city') || '',
        state = object.getPath('address.state') || '';
    val = city+(city && state? ', ' : '')+state;
    context.font = (val? "" : "italic ")+"8pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val , 255, 55);
    context.restore();
    
  // 2 Row format
  } else {
    // Contact Name
    var val = object.get('name');
    context.font = (val? "bold " : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noName".loc(), 15, 15);

    // Phone
    context.save();
    val = object.get('phone');
    context.font = (val? "" : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noPhone".loc(), 200, 15);
    context.restore();
    
    // Email
    context.save();
    val = object.getPath('primaryEmail');
    context.font = (val? "" : "italic ")+"10pt Helvetica";
    context.fillStyle = val? 'blue' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noEmail".loc() , 400, 15);
    context.restore();
 
    // Title
    context.save();
    val = object.get('jobTitle');
    context.font = (val? "" : "italic ")+"8pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noJobTitle".loc() , 15, 35);
    context.restore();
          
    // Account Name
    context.save();
    val = object.getPath('account.name');
    context.font = (val? "" : "italic ")+"8pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val? val : "_noAccountName".loc() , 200, 35);
    context.restore();
    
    // Title
    context.save();
    var city = object.getPath('address.city') || '',
        state = object.getPath('address.state') || '';
    val = city+(city && state? ', ' : '')+state;
    context.font = "italic 8pt Helvetica";
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(val , 400, 35);
    context.restore();
  }

};

XM.Contact.RecordListView = Postbooks.RecordListView.extend({
  
  updateDisplay: function() {
    var w = this._sc_context.w,
        K = Postbooks;
    this.setIfChanged('rowHeight', w < K.PORTRAIT_LIST_WIDTH ? K.HEIGHT_3_ROW : K.HEIGHT_2_ROW);
    arguments.callee.base.apply(this, arguments);
  },
  
  renderRow: XM.Contact.RenderRecordListRow

});
