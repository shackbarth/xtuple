// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');

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

Postbooks.LoadExclusiveModal = function(className, backButtonTitle, instance, parentObjectController, arrayController) {
  console.log('Postbooks.LoadExclusiveModal(', className, backButtonTitle, ')');
  var context = SC.Object.create({
    title: ("_" + className.camelize()).loc(),
    backButtonTitle: backButtonTitle,
    backButtonAction: 'popContext',
    store: instance.store,
    instance: instance,
    callback: function() {
      arrayController.set('selection', SC.SelectionSet.create().freeze());
    }
  });

  var baseClass = XM[className];

  sc_assert(baseClass);
  sc_assert(baseClass.isClass);
  sc_assert(baseClass.subclassOf(XT.Record));

  var controller, tiles = [];

  var modal = SC.LayoutSurface.create({
    didCreateElement: function(div) {
      arguments.callee.base.apply(this, arguments);
      if (SC.isTouch()) {
        div.style.webkitBackfaceVisibility = 'hidden';
        div.style.webkitTransform = 'translate3d(0,0,0)';
      }
    },

    viewportSizeDidChange: function(viewport) {
      console.log('viewportSizeDidChange');
      this.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    }
  });

  modal.set('backgroundColor', 'rgb(95,98,96)');

  var klass = parentObjectController.get('content').constructor;
  var overview = Postbooks.CreateTileViewForClass(klass, parentObjectController, klass.prototype.className.slice(3), true, false);
  overview.set('layout', { top: 0, left: 0, width: 320, height: 320 });

  overview.mouseDown = null; // don't want the action

  modal.get('subsurfaces').pushObject(overview);

  var list = Postbooks.TileListView.create({
    layout: { top: 320, left: 0, width: 320, bottom: 0 },

    rowHeight: baseClass.ListRowHeight !== undefined? baseClass.ListRowHeight : 60,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', arrayController).oneWay(),
    selectionBinding: SC.Binding.from('selection', arrayController),

    baseClass: baseClass,

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundColor = 'clear'; // 'rgba(70,70,70,0.5)';
      style.color = 'black';
      style.padding = '6px';
      style.borderStyle = 'solid ';
      style.borderWidth = '1px';
      // style.borderRadius = '5px'; // doesn't work properly in Chrome; avoid for now
      style.borderColor = this.get('isEnabled') ? 'rgb(252,188,126)' : 'grey'; // this.get('borderColor');
      style.outline = 'none';
      style.boxShadow = 'none';
    },

    willRenderLayers: function(ctx) {
      var content = this.get('content');

      if (content && content.get('length') === 0) {
        var w = ctx.width, h = ctx.height;

        var text = 'No records.',
            status = content? content.get('status') : null;

        if (status && status === SC.Record.BUSY_LOADING) {
          text = "_loading".loc();
        }

        // Clear background.
        ctx.clearRect(0, 0, w, h);

        // Draw view name.
        ctx.fillStyle = 'rgba(70,70,70,0.5)';
        
        var K = Postbooks;
        ctx.font = "11pt "+K.TYPEFACE;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
      }
    },

    renderRow: klass.RenderRecordListRow? klass.RenderRecordListRow : Postbooks.DefaultListRenderRow
  });

  var sel = SC.SelectionSet.create();
  sel.addObject(instance);
  arrayController.set('selection', sel.freeze());

  modal.get('subsurfaces').pushObject(list);

  controller = context[className+'ObjectController'] = SC.ObjectController.create({
    contentBinding: SC.Binding.from('selection', arrayController).single()
  });
  sc_assert(controller);
  sc_assert(controller.kindOf(SC.ObjectController));

  window.c = controller;

  var proto = baseClass.prototype,
      properties = [];

  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key];

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      continue;
    } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
      continue;
    } else if (property && property.isRecordAttribute) {
      if (property.isChildrenAttribute)    continue;
      else if (property.isChildAttribute)  continue;
      else if (property.isManyAttribute)   continue;
      else if (property.isSingleAttribute) continue;

      properties.push(key);
    }
  }

  var detailView = SC.View.create({
        layout: { top: 200, width: 450, bottom: 200, centerX: 160 },
        didCreateElement: function(el) {
          arguments.callee.base.apply(this, arguments);
          var style = el.style;
          style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
          style.backgroundPosition = 'left top';
          style.backgroundRepeat = 'repeat';
        },

        clearBackground: true,

        willRenderLayers: function(context) { 
          var title = baseClass.prototype.className.slice(3).humanize().titleize(),
              w = context.width, h = context.height;

          // title text
          var K = Postbooks;
          context.font = "12pt "+K.TYPEFACE;
          context.fillStyle = 'white';
          context.textAlign = 'left';
          context.textBaseline = 'middle';

          if (title) context.fillText(title, 18, 19  );
        }
      }),
      layers = detailView.get('layers'),
      K = Postbooks,
      y = 42;

  properties.forEach(function(key) {
    if (key === 'spacer') {
      y += 12;
    } else {
      var property = proto[key],
          left = 120, right = 12,
          label = null, widget = null,
          title = ("_"+key).loc();

      if (property.isRecordAttribute) {    
        var typeClass = property.get('typeClass');
        // if (key === 'project') debugger;

        if (typeClass === String) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          if (key === 'incidentStatus') {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller),
              items: XM.Incident.statusItems,
              itemTitleKey: 'title',
              itemValueKey: 'value'
            });
          } else {
            widget = SC.TextFieldWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller)
            });
          }
          y += 24 + K.SPACING;
        } else if (property.isSingleAttribute) { // just for now so we can see layout impact
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          if (typeClass === XM.IncidentCategory) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentCategoryRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.Priority) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createPriorityRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.IncidentResolution) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentResolutionRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.IncidentSeverity) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentSeverityRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else {
            widget = SC.TextFieldWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.transform(function(val) {
                return String(val);
              }).from(key, controller)
            });
          }
          y += 24 + K.SPACING;
        } else if (property.isChildAttribute) { // just for now so we can see layout impact
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          if (typeClass === XM.ItemInfo) {
            widget = Postbooks.RelationWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              displayKey: 'description1',
              controller: controller,
              controllerKey: key,
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller)
            });
          } else {
            widget = Postbooks.RelationWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              displayKey: 'name',
              controller: controller,
              controllerKey: key,
              isEnabledBinding: SC.Binding.from('isEditable', controller),
              valueBinding: SC.Binding.from(key, controller)
            });
          }
          y += 24 + K.SPACING;
        } else if (typeClass === Number) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          // FIXME: Re-enable this!
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            isEnabled: key==='number'? false : true,
            valueBinding: SC.Binding.transform(function(val) {
              return String(val);
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass.isNumeric) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            isEnabledBinding: SC.Binding.from('isEditable', controller),
            valueBinding: SC.Binding.transform(function(val) {
              return val? val.toLocaleString() : "";
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === XT.DateTime) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          widget = Postbooks.DateWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            isEnabledBinding: SC.Binding.from('isEditable', controller),
            dateBinding: SC.Binding.from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === Boolean) {
          widget = SC.CheckboxWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            title: ("_"+key).loc(),
            isEnabledBinding: SC.Binding.from('isEditable', controller),
            valueBinding: SC.Binding.transform(function(val) {
              return !!val;
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === Array) {
          console.log('Unknown property type', 'Array');          
        } else if (typeClass === Object) {
          console.log('Unknown property type', 'Object');          
        } else {
          console.log('Unknown property type', typeClass.displayName? typeClass.displayName : typeClass);          
        }
      }

      if (label)  layers.pushObject(label);
      if (widget) layers.pushObject(widget);
    }
  });

  detailView.set('backgroundColor', 'rgb(66,66,66)');

  modal.get('subsurfaces').pushObject(detailView);

  context.set('surface', modal);

  var viewport = SC.app.computeViewportSize();
  modal.set('frame', SC.MakeRect(viewport.width, 44, viewport.width-64, viewport.height - 52));

  Postbooks.pushContext(context);
  SC.app.addSurface(modal);
  setTimeout(function() {
    SC.RunLoop.begin();
    modal.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    SC.RunLoop.end();
  },0);
};
