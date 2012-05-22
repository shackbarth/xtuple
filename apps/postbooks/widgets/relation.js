// ==========================================================================
// Project:   Blossom - Modern, Cross-Platform Application Framework
// Copyleft: ©2012 Fohr Motion Picture Studios. All lefts reserved.
// License:   Licensed under the GPLv3 license (see BLOSSOM-LICENSE).
// ==========================================================================
/*globals Postbooks sc_assert formatter linebreak XT XM */

sc_require('sprites');

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
var blue =     "#248bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";
var black =    "black";

Postbooks.RelationWidget = SC.Widget.extend(SC.Control, {

  isTextField: true,

  __trace__: true,
  __traceMouseEvents__: false,

  recordType: null,
  store: null,
  recordArray: [],

  _recordArray: null,
  _recordArrayDidChange: function() {
    console.log("Postbooks.RelationWidget#_recordArrayDidChange()");
    var cur  = this.get('recordArray'),
        last = this._recordArray,
        func = this._recordArrayLengthDidChange;
  
    if (last === cur) return this; // nothing to do
  
    // teardown old observer
    sc_assert(last? last.isEnumerable : true);
    if (last) last.removeObserver('length', this, func);
  
    // save new cached values 
    this._recordArray = cur;
  
    // setup new observers
    sc_assert(cur? cur.isEnumerable : true);
    if (cur) cur.addObserver('length', this, func);
  
    // process the changes
    this._recordArrayLengthDidChange();
  }.observes('recordArray'),
  
  _recordArrayLengthDidChange: function() {
    this.tryToPerform('recordArrayLengthDidChange');
  },

  init: function() {
    arguments.callee.base.apply(this, arguments);
    var isEnabled = this.get('isEnabled');
    this.__behaviorKey__ = isEnabled? 'Enabled' : 'Disabled';

    sc_assert(this.get('recordType'));
    sc_assert(this.get('store'));

    var that = this, menuView;
    menuView = this._menuView = Postbooks.RelationWidgetMenuView.create({
      value: null,

      target: that,

      _sc_backgroundColor: 'rgb(70,70,70)',

      isEnabled: this.get('isEnabled'),
      isEnabledBinding: SC.Binding.from('isEnabled', this).oneWay().noDelay(),

      items: [{
        title: "_Search…".loc(),
        value: 'search',
        enabled: true
      }, {
        title: "_Open…".loc(),
        value: 'open',
        enabled: true
      }// , {
      //         title: "_New…".loc(),
      //         value: 'new',
      //         enabled: true
      //       }
      ],
    
      itemTitleKey: 'title',
      itemValueKey: 'value',
      itemIsEnabledKey: 'enabled'
    });

    var arrayController = SC.ArrayController.create({
      contentBinding: SC.Binding.from('recordArray', this).multiple().oneWay()
    });

    this._autcomplete = SC.ListView.create({
      rowHeight: 30,
      contentBinding: SC.Binding.from('arrangedObjects', arrayController).multiple().oneWay(),
      selectionBinding: SC.Binding.from('selection', arrayController).oneWay(),
      renderRow: Postbooks.DefaultRecordListRenderRow
    });

    this._valueDidChange();
    this._recordArrayDidChange();
  },

  isEnabledDidChange: function() {
    this.dispatchAction('isEnabledDidChange');
  }.observes('isEnabled'),

  isFirstResponderDidChange: function() {
    var action = this.get('isInputResponder') ? 'didBecomeFirstResponder' : 'didResignFirstResponder';
    this.dispatchAction(action);
  }.observes('isFirstResponder'),

  'Enabled': function(evt) {
    switch (evt.type) {
      case 'defaultTransition':
        if (this.get('isFirstResponder')) {
          this.transition('Editor');
        } else {
          this.transition('Inactive');
        }
        break;
      case 'enter':
        break;
      case 'exit':
        break;
      case 'isEnabledDidChange':
        if (!this.get('isEnabled')) this.transition('Disabled');
        break;
    }
  }.behavior(),

  'Disabled': function(evt) {
    switch (evt.type) {
      case 'defaultTransition':
        break;
      case 'enter':
        break;
      case 'exit':
        break;
      case 'isEnabledDidChange':
        if (this.get('isEnabled')) this.transition('Enabled');
        break;
    }
  }.behavior(),

  'Inactive': function(evt) {
    switch (evt.type) {
      case 'mouseDown':
        var bounds = this.get('bounds');
        if (evt.hitPoint.x > bounds.width - 20) {
          var menuView = this._menuView,
              frame = menuView.get('frame');

          frame.x = evt.clientX - evt.hitPoint.x + bounds.width - 16;
          frame.y = evt.clientY - evt.hitPoint.y - 24;
          frame.width = menuView.measuredWidth;
          frame.height = menuView.measuredHeight;

          return this.transition('Pop Up');

        } else {
          return this.transition('Editor');
        }
        break;

      case 'didBecomeFirstResponder':
        return this.transition('Editor');
    }
  }.behavior('Enabled'),

  'Active': function(evt) {
    switch (evt.type) {
      case 'enter':
        if (!this.get('isFirstResponder')) this.becomeFirstResponder();
        return;
      case 'exit':
        if (this.get('isFirstResponder')) this.resignFirstResponder();
        return;
    }
  }.behavior('Enabled'),

  'Editor': function(evt) {
    switch (evt.type) {
      case 'enter':
        // debugger;
        this._searchCache = {};
        SC.app.set('inputSurface', this.get('surface'));
        var that = this;
        setTimeout(function() {
          SC.RunLoop.begin();
          SC.OpenFieldEditorFor(that);
          SC.RunLoop.end();
        }, 0);
        return;
      case 'exit':
        SC.app.set('inputSurface', null);
        SC.CloseFieldEditor();
        this._searchCache = null;
        return;
      case 'defaultTransition':
        return this.transition('Not Typing');
      case 'mouseDown':
        // evt is not on a layer, so no evt.hitPoint property. Do the fiddling
        // to give it one.
        evt.type = 'mousedown'; // Required.
        this.get('surface').updateEventForLayer(evt, this);

        var bounds = this.get('bounds');

        if (evt.hitPoint.x > bounds.width - 20) {
          var menuView = this._menuView,
              frame = menuView.get('frame');
        
          frame.x = evt.clientX - evt.hitPoint.x + bounds.width - 16;
          frame.y = evt.clientY - evt.hitPoint.y - 24;
          frame.width = menuView.measuredWidth;
          frame.height = menuView.measuredHeight;
        
          return this.transition('Pop Up');
        }
        break;
      case 'fieldEditorDidClose':
        return this.transition('Inactive');
      case 'didResignFirstResponder':
        return this.transition('Inactive');
    }
  }.behavior('Active'),

  'Pop Up': function(evt) {
    var menuView = this._menuView;
    switch (evt.type) {
      case 'enter':
        menuView.triggerLayoutAndRendering();
        SC.app.addSurface(menuView);
        SC.app.set('menuSurface', menuView);
        return;
      case 'exit':
        SC.app.set('menuSurface', null);
        SC.app.removeSurface(menuView);
        return;
      case 'search':
        return this.transition('Search');
      case 'open':
        return this.transition('Open');
      case 'new':
        // return this.transition('New');
      case 'popUpMenuDidClose':
        return this.transition('Inactive');
    }
  }.behavior('Active'),

  'Not Typing': function(evt) {
    if (evt.type === 'keyUp') {
      this.transition('Typing');
    }
  }.behavior('Editor'),

  'Typing': function(evt) {
    if (evt.type === 'defaultTransition') {
      var value = SC.activeEditor.get('value');
      if (value && value.length > 0) {
        this.transition('Text');
      } else {
        this.transition('No Text');
      }
    }
  }.behavior('Editor'),

  'No Text': function(evt) {
    if (evt.type === 'keyUp') {
      this.transition('Typing');
    }
  }.behavior('Typing'),

  'Text': function(evt) {
    if (evt.type === 'defaultTransition') {
      this.transition('Create or Retrieve Search');

    } else if (evt.type === 'keyUp') {
      var value = SC.activeEditor.get('value');
      if (!value || (value && value.length === 0)) {
        this.transition('No Text');
      }
    } else if (evt.type === 'recordArrayLengthDidChange') {
      var len = this.getPath('recordArray.length');
      if (len === 0) {
        this.transition('No Matches');
      } else {
        this.transition('Has Matches');
      }
    }
  }.behavior('Typing'),

  createOrRetrieveSearch: function() {
    var value = SC.activeEditor.get('value');
    sc_assert(value);
    sc_assert(value.length > 0);

    var ra = this._searchCache[value];
    if (!ra) {
      var recordType = this.get('recordType');
      if (recordType.prototype.className.slice(-4) === 'Info') {
        recordType = XM[recordType.prototype.className.slice(3,-4)];
      }
      var q = SC.Query.remote(recordType, {
        conditions: "name BEGINS_WITH {value}",
        orderBy: 'name ASC',
        parameters: { value: value },
        rowOffset: 0,
        rowLimit: 10
      });
      ra = this._searchCache[value] = XT.store.find(q);
    }

    // We don't want to be dispatching when we set this.
    var that = this;
    setTimeout(function() {
      SC.RunLoop.begin();
      that.set('recordArray', ra);
      window.ra = ra;
      SC.RunLoop.end();
    }, 0);
  },

  'Create or Retrieve Search': function(evt) {
    var value = SC.activeEditor.get('value') || "";
    switch (evt.type) {
      case 'enter':
        if (value && value.length > 0) {
          this.createOrRetrieveSearch();
        }
        break;
      case 'keyUp':
        if (!value || (value && value.length === 0)) {
          this.transition('No Text');
        } else if (value && value.length > 0) {
          this.createOrRetrieveSearch();
        }
        break;
    }
  }.behavior('Text'),

  'No Matches': function(evt) {
    
  }.behavior('Text'),

  'Has Matches': function(evt) {
    var autocomplete = this._autcomplete,
        recordArray = this.get('recordArray');

    switch (evt.type) {
      case 'enter':
        sc_assert(recordArray);
        sc_assert(recordArray.get('length') > 0);

        var f = this.get('frame'),
            b = SC.psurfaces[this.get('surface').__id__].__element__.getBoundingClientRect();

        var frame = autocomplete.get('frame');
        frame.x = f.x + b.left;
        frame.y = f.y + b.top + f.height;
        frame.width = 200;
        frame.height = recordArray.get('length') * 30;
        SC.app.addSurface(autocomplete);
        break;
      case 'exit':
      SC.app.removeSurface(autocomplete);
        break;
    }
  }.behavior('Text'),

  'Modal': function(evt) {
    
  }.behavior('Enabled'),

  'Search': function(evt) {
    
  }.behavior('Modal'),

  'Open': function(evt) {
    if (evt.type === 'enter') {
      var klass = this.get('recordType'),
          record = this.get('value'),
          instanceKlass, instance;

      if (!record) return; // Nothing to open.

      if (klass.prototype.className.slice(-4) === 'Info') {
        instanceKlass = XM[klass.prototype.className.slice(3, -4)];
      } else {
        instanceKlass = klass;
      }

      console.log("Opening existing record of type:", instanceKlass.prototype.className);

      instance = XT.store.chain().find(instanceKlass, record.get('id'));

      var that = this;
      if (instance.get('status') !== SC.Record.READY_CLEAN) {
        console.log('delaying loading relation until it is ready (loaded)');
        instance.addObserver('status', instance, function observer() {
          var status = instance.get('status');
          // console.log('observer called, status is', instance.statusString());

          if (status === SC.Record.READY_CLEAN) {
            instance.removeObserver('status', instance, observer);
            Postbooks.LoadRelation(instanceKlass.prototype.className.slice(3), "_back".loc(), instance, function() {
              console.log('calling callback');
              that.tryToPerform('close');
            });
          }
        });
      } else {
        console.log('loading relation immediately');
        Postbooks.LoadRelation(instanceKlass.prototype.className.slice(3), "_back".loc(), instance, function() {
          console.log('calling callback');
          that.tryToPerform('close');
        });
      }
    } else if (evt.type === 'close') {
      return this.transition('Editor');
    }
  }.behavior('Modal'),

  // 'New': function(evt) {
  //   if (evt.type === 'enter') {
  //     var klass = this.get('recordType'),
  //         controller = this.get('controller'),
  //         controllerKey = this.get('controllerKey'),
  //         instanceKlass, instance;
  // 
  //     if (klass.prototype.className.slice(-4) === 'Info') {
  //       instanceKlass = XM[klass.prototype.className.slice(3, -4)];
  //     } else {
  //       instanceKlass = klass;
  //     }
  // 
  //     console.log("Creating new record of type:", instanceKlass.prototype.className);
  // 
  //     instance = XT.store.chain().createRecord(instanceKlass, {});
  //     instance.normalize();
  // 
  //     var that = this;
  //     Postbooks.LoadRelation(instanceKlass.prototype.className.slice(3), "_back".loc(), instance, function() {
  //       var rec = XT.store.materializeRecord(instance.storeKey);
  //       console.log(rec.statusString());
  // 
  //       if (rec.get('status') === SC.Record.READY_CLEAN) {
  //         debugger;
  //         controller.set(controllerKey, controller.getPath('content.store').find(klass, rec.get('id')));
  //       } else {
  //         rec.addObserver('status', rec, function observer() {
  //           var status = rec.get('status');
  //           // console.log('observer called, status is', instance.statusString());
  // 
  //           if (status === SC.Record.READY_CLEAN) {
  //             debugger;
  //             rec.removeObserver('status', rec, observer);
  //             controller.set(controllerKey, controller.get('content').store.find(klass, rec.get('id')));
  //           }
  //         });
  //       }
  //       that.tryToPerform('close');
  //     });
  //   } else if (evt.type === 'close') {
  //     return this.transition('Editor');
  //   }
  // }.behavior('Modal'),

  displayProperties: 'value'.w(),

  font: "10pt Helvetica, sans",
  color: base03,
  backgroundColor: base3,
  textBaseline: 'top',
  textAlign: 'left',
  tolerance: 10,
  lineHeight: 18,

  _textPropertiesDidChange: function() {
    var surface = this.get('surface');
    if (surface) surface.triggerLayoutAndRendering();
  }.observes('font', 'color', 'backgroundColor', 'textBaseline',
             'textBaseline', 'tolerance', 'lineHeight'),

  value: null, // should be a String or null

  _value: null,
  _valueDidChange: function() {
    var value = this.get('value');
    if (value !== this._value) {
      this._value = value;
      if (value) {
        var surface = this.get('surface');
        if (surface) surface.triggerLayoutAndRendering();
      }
    }
  }.observes('value'),

  behavior: function(key, val) {
    sc_assert(val === undefined, "This property is read-only.");
    return this;
  }.property().cacheable(),

  // ..........................................................
  // IS ENABLED SUPPORT
  //

  /**
    Set to true when the item is enabled.   Note that changing this value
    will also alter the isVisibleInWindow property for this view and any
    child views.

    Note that if you apply the SC.Control mixin, changing this property will
    also automatically add or remove a 'disabled' CSS class name as well.

    This property is observable and bindable.

    @property {Boolean}
  */
  isEnabled: true,
  isEnabledBindingDefault: SC.Binding.oneWay().bool(),

  /** @private
    Observes the isEnabled property and resigns first responder if set to false.
    This will avoid cases where, for example, a disabled text field retains
    its focus rings.

    @observes isEnabled
  */
  _isEnabledDidChange: function() {
    if (!this.get('isEnabled') && this.get('isFirstResponder')) {
      this.resignFirstResponder();
    }
  }.observes('isEnabled'),

  // _didBecomeInputResponder: function() {
  //   // console.log('SC.TextFieldWidget#_didBecomeInputResponder');
  //   if (this.get('isInputResponder')) {
  //     SC.OpenFieldEditorFor(this);
  //   }
  // }.observes('isInputResponder'),

  // mouseDown: function(evt) {
  //   console.log('Postbooks.RelationWidget#mouseDown');
  //   // debugger;
  //   SC.app.set('inputSurface', this.get('surface'));
  //   if (!this.get('isFirstResponder')) this.becomeFirstResponder();
  //   else if (this.get('isInputResponder')) {
  //     SC.OpenFieldEditorFor(this);
  //   }
  //   return true;
  // },

  color: function() {
    return this.get('isEnabled')? black : 'rgba(0,43,54,0.5)';
  }.property('isEnabled'),

  backgroundColor: function() {
    return this.get('isEnabled')? white : base3;
  }.property('isEnabled'),

  borderColor: function() {
    return this.get('isEnabled')? 'rgb(128,128,128)' : 'rgba(0,43,54,0.5)';
  }.property('isEnabled'),

  borderWidth: 1,

  render: function(ctx) {
    var bounds = this.get('bounds'),
        h = bounds.height, w = bounds.width,
        isEnabled = this.get('isEnabled');

    // Always clear the rect in case someone wants transparency.
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = this.get('backgroundColor');
    SC.CreateRoundRectPath(ctx, 0.5, 0.5, w-1, h-1, 5);
    ctx.fill();

    // Draw the text.
    ctx.textBaseline = this.get('textBaseline');
    ctx.font = this.get('font');
    ctx.fillStyle = this.get('color');
    var val = this.get('value');
    if (val) {
      var displayKey = this.get('displayKey');
      if (displayKey) val = val.get(displayKey);
    }
    if (val && val.elide) val = val.elide(ctx, w - 23);
    ctx.fillText(val || '', 4, 3);

    // Draw the box.
    ctx.strokeStyle = this.get('borderColor');
    SC.CreateRoundRectPath(ctx, 0.5, 0.5, w-1, h-1, 5);
    ctx.lineWidth = this.get('borderWidth');
    ctx.stroke();

    // Draw the icon.
    var img = Postbooks.createImageForSprite('triangle-down-large');
    ctx.drawImage(img, w-17, 6);
  },

  computeSupersurface: function() {
    var surface = this.get('surface');
    sc_assert(surface);
    while (surface.isLeafSurface) surface = surface.get('supersurface');
    sc_assert(surface);
    return surface;
  },

  computeFrameInSupersurface: function() {
    // Determine our position relative to our immediate surface.  This is a 
    // little bit involved and involves a few levels of indirection.
    var surface = this.get('surface'),
        surfaceFrame = surface.get('frame'),
        textFrame = this.get('frame'),
        x = textFrame.x, y = textFrame.y,
        superlayer = this.get('superlayer'), frame;

    // `textFrame` must be expressed in the coordinate space of `surfaceFrame`
    // (its currently expressed in terms of its superlayer OR its surface). 
    // Walk up the layer tree until we no longer have a superlayer, taking into 
    // account the frames on the way up.
    var rootLayer = superlayer;
    while (superlayer) {
      rootLayer = superlayer;
      frame = superlayer.get('frame');
      x += frame.x;
      y += frame.y;
      superlayer = superlayer.get('superlayer');
    }

    // FIXME: Also need to take into acccount the accumulated layer transform.

    var rowOffsetForLayerTree = 0;
    if (surface.rowOffsetForLayerTree) rowOffsetForLayerTree = surface.rowOffsetForLayerTree(rootLayer);

    return SC.MakeRect(
        surfaceFrame.x + x,
        surfaceFrame.y + y + rowOffsetForLayerTree,
        textFrame.width,
        textFrame.height
      );
  },

  valueForFieldEditor: function() {
    var value = this.get('value');
    if (value) value = value.get(this.get('displayKey'));
    return value;
  },

  takeValueFromFieldEditor: function(value) {
    console.log('takeValueFromFieldEditor', value);
  },

  styleInputElement: function(input) {
    var style = input.style,
        frame = this.computeFrameInSupersurface();

    input.value = this.valueForFieldEditor();

    style.display = 'block';
    style.border  = this.get('borderWidth') + 'px';
    style.borderStyle = 'solid ';
    style.borderRadius = '5px';
    style.borderColor = 'rgb(252,102,32)'; // this.get('borderColor');
    style.font = this.get('font');
    style.color = this.get('color');
    style.backgroundColor = this.get('backgroundColor');
    style.backgroundImage = Postbooks.createDataUrlForSprite('triangle-down-large');
    style.backgroundPosition = 'right center';
    style.backgroundRepeat = 'no-repeat';
    style.outline = 'none'; // FIXME: This breaks other users of the field editor.
    if (this.get('isEnabled')) {
      style.boxShadow = '0px 0px 3px 1px ' + 'rgb(252,102,32)' + ', 0px 0px 1px 0px ' + 'rgb(128,128,128)' + ' inset';
    } else style.boxShadow = 'none';

    // Without the 'px' ending, these do nothing in WebKit.
    style.paddingTop = '0px';
    style.paddingLeft = '2px';
    style.paddingRight = '20px';
    style.top    = frame.y      + 'px';
    style.left   = frame.x      + 'px';
    style.width  = frame.width  + 'px';
    style.height = frame.height + 'px';
  },

  setSelectionForInputElement: function(input) {
    var value = this.valueForFieldEditor();
    input.setSelectionRange(0, value? value.length : 0);
  }

});

Postbooks.RelationWidgetMenuView = SC.View.extend({

  _cornerRadius: 9,

  /**
    The value of the selected menu item.

    The RelationWidgetMenuView's value will always be the value of the 
    currently selected button.  Setting this value will change the selected 
    button. If you set this value to something that has no matching button, 
    then no buttons will be selected.

    @field {Object}
  */
  value: null,

  /**
    Set to true to enabled the select widget menu view, false to disabled it.
  */
  isEnabled: true,

  /**
    If true, clicking a selected button again will deselect it, setting the
    select widget menu's value to null.  Defaults to false.
  */
  allowsEmptySelection: false,

  /**
    If true, then clicking on a menu item will not deselect the other menu 
    items, it will simply add or remove it from the selection.
  */
  allowsMultipleSelection: false,

  /**
    If true, titles will be localized before display.
  */
  localize: true,

  // ..........................................................
  // MENU ITEMS DEFINITION
  //

  /**
    The array of items to display.  This can be a simple array of strings,
    objects or hashes.  If you pass objects or hashes, you must also set the
    various itemKey properties to tell the RelationWidgetMenuView how to 
    extract the information it needs.

    @property {Array}
  */
  items: [],

  /**
    The key that contains the title for each item.

    @property {String}
  */
  itemTitleKey: null,

  /**
    The key that contains the value for each item.

    @property {String}
  */
  itemValueKey: null,

  /**
    A key that determines if this item in particular is enabled.  Note if the
    control in general is not enabled, no items will be enabled, even if the
    item's enabled property returns true.

    @property {String}
  */
  itemIsEnabledKey: null,

  /**
    The key that contains the icon for each item.  If omitted, no icons will
    be displayed.

    @property {String}
  */
  itemIconKey: null,

  /**
    The key that contains the desired width for each item.  If omitted, the
    width will autosize.

    @property {String}
  */
  itemWidthKey: null,

  /**
    The key that contains the action for this item.  If defined, then
    selecting this item will fire the action in addition to changing the
    value.  See also itemTargetKey.

    @property {String}
  */
  itemActionKey: null,

  /**
    The key that contains the target for this item.  If this and itemActionKey
    are defined, then this will be the target of the action fired.

    @property {String}
  */
  itemTargetKey: null,

  /**
    The key that contains the key equivalent for each item.  If defined then
    pressing that key equivalent will be like selecting the tab.  Also,
    pressing the Alt or Option key for 3 seconds will display the key
    equivalent in the tab.
  */
  itemKeyEquivalentKey: null,

  /**
    The array of itemKeys that will be searched to build the displayItems
    array.  This is used internally by the class.  You will not generally
    need to access or edit this array.

    @property {Array}
  */
  itemKeys: 'itemTitleKey itemValueKey itemIsEnabledKey itemIconKey itemWidthKey itemToolTipKey'.w(),

  /**
    This computed property is generated from the items array based on the
    itemKey properties that you set.  The return value is an array of arrays
    that contain private information used by the RelationWidgetMenuView to 
    render.

    You will not generally need to access or edit this property.

    @property {Array}
  */
  displayItems: function() {
    var items = this.get('items'), loc = this.get('localize'),
      keys=null, itemType, cur, ret = [], max = items.get('length'), idx,
      item, fetchKeys = Postbooks._relationWidgetMenuView_fetchKeys, fetchItem = Postbooks._relationWidgetMenuView_fetchItem;

    // loop through items and collect data
    for(idx=0;idx<max;idx++) {
      item = items.objectAt(idx) ;
      if (SC.none(item)) continue; //skip is null or undefined

      // if the item is a string, build the array using defaults...
      itemType = SC.typeOf(item);
      if (itemType === SC.T_STRING) {
        cur = [item.humanize().titleize(), item, true, null, null,  null, idx] ;

      // if the item is not an array, try to use the itemKeys.
      } else if (itemType !== SC.T_ARRAY) {
        // get the itemKeys the first time
        if (keys===null) {
          keys = this.itemKeys.map(fetchKeys,this);
        }

        // now loop through the keys and try to get the values on the item
        cur = keys.map(fetchItem, item);
        cur[cur.length] = idx; // save current index

        // special case 1...if title key is null, try to make into string
        if (!keys[0] && item.toString) cur[0] = item.toString();

        // special case 2...if value key is null, use item itself
        if (!keys[1]) cur[1] = item;

        // special case 3...if isEnabled is null, default to yes.
        if (!keys[2]) cur[2] = true ;
      }

      // finally, be sure to loc the title if needed
      if (loc && cur[0]) cur[0] = cur[0].loc();

      // finally, be sure to loc the toolTip if needed
      if (loc && cur[5] && SC.typeOf(cur[5]) === SC.T_STRING) cur[5] = cur[5].loc();

      // add to return array
      ret[ret.length] = cur;
    }

    // all done, return!
    return ret ;
  }.property('items', 'itemTitleKey', 'itemValueKey', 'itemIsEnabledKey',
             'localize', 'itemIconKey', 'itemWidthKey', 'itemToolTipKey'),

  // ..........................................................
  // EVENT HANDLING
  //

  /** @private
    Remove the active class on mouseExited if mouse is down.
  */
  mouseExited: function(evt) {
    var active = this._activeMenuItem;

    document.body.style.cursor = "default";
    if (active) {
      active.set('isActive', false);
      this._activeMenuItem = null;
    }
    return true;
  },

  /** @private
    If mouse was down and we renter the button area, set the active state 
    again.
  */
  mouseEntered: function(evt) {
    var menuItem = evt.layer,
        old = this._activeMenuItem;

    if (old) old.set('isActive', false);
    if (menuItem && menuItem.get('isEnabled') && this.get('isEnabled')) {
      document.body.style.cursor = "pointer";
      this._activeMenuItem = menuItem;
      menuItem.set('isActive', true);
    }
    return true;
  },

  /** @private
    If mouse was down and we renter the button area, set the active state 
    again.
  */
  mouseMoved: function(evt) {
    var old = this._activeMenuItem,
        cur = evt.layer;

    if (old === cur) return true;

    if (old) old.set('isActive', false);
    this._activeMenuItem = cur;
    if (cur && cur.get('isEnabled') && this.get('isEnabled')) {
      document.body.style.cursor = "pointer";
      this._activeMenuItem = cur;
      cur.set('isActive', true);
    }
    return true;
  },

  mouseDown: function(evt) {
    var active = this._activeMenuItem,
        ret = false;

    if (active) active.set('isActive', false);
    this._activeMenuItem = null;

    // Nothing to do if we're not enabled.
    if (!this.get('isEnabled')) {
      ret = true;

    // Nothing to do if no menu item was active.
    } else if (!active) {
      ret = true;

    // Okay, we need to deal with the mouseDown event.
    } else {
      sc_assert(active);
      var menuItem = evt.layer;

      // Nothing to do if we didn't click an enable menu item.
      if (!menuItem.get('isEnabled')) {
        ret = true;

      // Okay, the mouse went up over an enable menu item.  We need to 
      // update our value with it's value, select it, and unselected the 
      // currently selected menu item.
      } else {
        var index = this.get('layers').indexOf(menuItem),
            item = this.get('displayItems').objectAt(index);

        sc_assert(index >= 0);
        sc_assert(item);

        // Update our 'value' property.  _valueDidChange() will handle 
        // updating the radio button's isSelected values.
        this.set('value', item[1]);

        // Let our SelectWidget know.
        this.target.tryToPerform(item[1]);

        ret = true;
      }
    }

    SC.app.set('menuSurface', null);
    SC.app.removeSurface(this);

    return ret;
  },

  didLoseMenuSurfaceTo: function(surface) {
    this.target.tryToPerform('popUpMenuDidClose');
  },

  acceptsFirstResponder: false,

  /** If the items array itself changes, add/remove observer on item... */
  _itemsDidChange: function() {
    var func = this._itemContentDidChange,
        old = this._items,
        cur = this.get('items');

    if (old === cur) return;

    if (old) old.removeObserver('[]', this, func);
    this._items = cur;
    if (cur) cur.addObserver('[]', this, func);

    this._itemContentDidChange();
  }.observes('items'),

  /**
    Invoked whenever the item array or an item in the array is changed.  
    This method will reginerate the list of items.
  */
  _itemContentDidChange: function() {
    var displayItems = this.get('displayItems'),
        value = this.get('value'),
        isEnabled = this.get('isEnabled'),
        font = this.get('font');

    // console.log(displayItems);

    var menuItems = [], len = displayItems.length, last = len-1,
        y = 6, padding = 50, height = 24, maxWidth = 0;

    displayItems.forEach(function(item, idx) {
      var width = Math.ceil(SC.MeasureText(font, item[0]).width + padding); // Magic!
      if (width % 2 !== 0) width++;

      var menuItem = Postbooks.RelationMenuItemLayer.create({
        layout: { left: 0, right: 0, top: y, height: 24 },
        title: item[0],
        isEnabled: item[2],
        isSelected: item[1] === value? true : false,
        font: font
      });
      menuItems.push(menuItem);

      maxWidth = Math.max(maxWidth, width);
      y += height;
    });

    y += 6;

    this.set('layers', menuItems);
    this.set('measuredWidth', maxWidth);
    this.set('measuredHeight', y);
    this._triggerSublayerLayout = true;
  },

  updateLayout: function() {
    // console.log('Postbooks.RelationWidgetMenuView#updateLayout()', SC.guidFor(this));
    if (this._triggerSublayerLayout) {
      this._triggerSublayerLayout = false;
      this.get('layers').invoke('triggerLayout');
    }
    arguments.callee.base.apply(this, arguments);
  },

  font: "11pt Helvetica",

  measuredWidth: 10,

  measuredHeight: 10,

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this._itemsDidChange() ;
  }

});

// Helpers defined here to avoid creating lots of closures...
Postbooks._relationWidgetMenuView_fetchKeys = function(k) { return this.get(k); };
Postbooks._relationWidgetMenuView_fetchItem = function(k) {
  if (!k) return null;
  return this.get ? this.get(k) : this[k];
};

/** @private */
Postbooks.RelationMenuItemLayer = SC.Layer.extend(SC.Control, {

  isEnabled: true,

  title: null,

  font: null,

  render: function(ctx) {
    // console.log('SC.SelectMenuItemLayer#render()', SC.guidFor(this));
    var title = this.get('title') || "",
        selected = this.get('isSelected'),
        disabled = !this.get('isEnabled'),
        mixed = (selected === SC.MIXED_STATE),
        active = this.get('isActive'),
        font = this.get('font'),
        bounds = this.get('bounds'),
        w = bounds.width, h = bounds.height;

    selected = (selected && (selected !== SC.MIXED_STATE));

    ctx.beginPath();
    ctx.moveTo(1, 0.5);
    ctx.lineTo(w-2, 0.5);
    ctx.lineTo(w-2, h);
    ctx.lineTo(1, h);
    ctx.closePath();

    var lingrad = ctx.createLinearGradient(0,0,0,h);
    lingrad.addColorStop(0, 'rgb(252,188,126)');
    lingrad.addColorStop(0.9, 'rgb(255,102,0)');
    lingrad.addColorStop(1, 'rgb(255,178,128)');

    if ((disabled && !selected) || (disabled && !active && !selected)) {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'rgb(70,70,70)';
      ctx.fill();

      ctx.fillStyle = 'rgb(70,70,70)';
      ctx.strokeStyle = 'rgb(70,70,70)';

    } else if (disabled && selected) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = lingrad;
      ctx.fill();

      ctx.fillStyle = 'rgb(0,0,0,0.5)';
      ctx.strokeStyle = 'rgb(0,0,0,0.5)';

    } else if (active) {
      ctx.fillStyle = lingrad;
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';

    } else {
      // console.log('rendering normally');
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'rgb(70,70,70)';
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
    }

    // Draw Title
    ctx.font = "10pt Helvetica";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText(title, 15, h/2);

    if (this.get('isSpacer')) {
      ctx.beginPath();
      ctx.moveTo(1, Math.floor(h/2)+0.5);
      ctx.lineTo(w-1, Math.floor(h/2)+0.5);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'grey';
      ctx.stroke();
    }

    // Draw Checkbox
    // ctx.translate(2, 0);
    // if ((selected && !active)) {
    //   // Draw the check mark.
    //   ctx.beginPath();
    //   ctx.moveTo(8.5, 17);
    //   ctx.lineTo(3.5, 13.5);
    //   ctx.lineTo(5.5, 12.5);
    //   ctx.lineTo(8.5, 16);
    //   ctx.lineTo(12.5, 7);
    //   ctx.lineTo(14, 9);
    //   ctx.lineTo(8.5, 17);
    //   ctx.closePath();
    //   ctx.fillStyle = (active || disabled)? base3 : base03;
    //   ctx.fill();
    //   ctx.strokeStyle = (active || disabled)? base3 : base03;
    //   ctx.lineCap = 'round';
    //   ctx.lineWidth = 0.5;
    //   ctx.stroke();
    // }
  }

});
