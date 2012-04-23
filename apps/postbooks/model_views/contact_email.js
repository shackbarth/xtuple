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

XM.ContactEmail.RenderDetailListRow = function(context, width, height, index, object, isSelected) {
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  var K = Postbooks;
  context.font = "12pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillText(object.get('guid') + ': ' + object.get('email'), width/2, height/2);
};

XM.ContactEmail.CreateTileView = function(controller, title, isOverview) {
  // Nope, generate the default tile view on the fly.
  var view = Postbooks.TileView.create({
        layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

        mouseDown: function(evt) {
          SC.EndEditingTextLayer();

          if (!isOverview) {
            Postbooks.LoadModal('ContactEmail', "Back", controller.get('content'));
          }

          return true;
        },

        willRenderLayers: function(context) {
          context.fillStyle = base3;
          context.fillRect(0, 3, context.width, 38);

          context.fillStyle = base00;
          context.fillRect(20, 6, 32, 32);
 
          var K = Postbooks;
          context.font = "12pt "+K.TYPEFACE;
          context.fillStyle = 'black';
          context.textAlign = 'left';
          context.textBaseline = 'middle';

          context.fillText(title ? title : "_overview".loc(), 72, 22);
        }

      }),
      layers = view.get('layers'),
      y = 44,
      proto = XM.ContactEmail.prototype;

  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        left = 120, right = 12;

   if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
     continue;

   } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
     continue;

    } else if (property && property.isRecordAttribute) {
      if (property.isChildrenAttribute)    continue;
      else if (property.isChildAttribute)  continue;
      else if (property.isManyAttribute)   continue;
      else if (property.isSingleAttribute) continue;
      else if (property.isRecordAttribute) {
        var label = null, widget = null,
            typeClass = property.get('typeClass');

        if (typeClass === String) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: property.label + ':'
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            valueBinding: SC.Binding.from(key, controller)
          });
          y += 24;
        } else if (typeClass === Number) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: property.label + ':'
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return String(val);
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass.isNumeric) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: property.label + ':'
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return String(val);
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass === SC.DateTime) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: property.label + ':'
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return val? val.toISO8601() : "no date set";
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass === Boolean) {
          widget = SC.CheckboxWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            title: property.label,
            valueBinding: SC.Binding.transform(function(val) {
              return !!val;
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass === Array) {
          console.log('Unknown property type', 'Array');          
        } else if (typeClass === Object) {
          console.log('Unknown property type', 'Object');          
        } else {
          console.log('Unknown property type', typeClass.displayName? typeClass.displayName : typeClass);          
        }

        if (label)  layers.pushObject(label);
        if (widget) layers.pushObject(widget);
      }
    }
  }

  return view;
};
