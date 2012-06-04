// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT XM */

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

Postbooks.ComboBoxWidget = SC.Widget.extend(SC.Control, {

  isTextField: true,

  __trace__: true,
  __traceMouseEvents__: false,

  recordType: null,
  store: null,
  recordArray: [],

  _recordArray: null,
  _recordArrayDidChange: function() {
    console.log("Postbooks.ComboBoxWidget#_recordArrayDidChange()");
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

  arrayController: null,

  init: function() {
    arguments.callee.base.apply(this, arguments);
    var isEnabled = this.get('isEnabled');
    this.__behaviorKey__ = isEnabled? 'Enabled' : 'Disabled';

    sc_assert(this.get('recordType'));
    sc_assert(this.get('store'));

    var that = this,
        arrayController;

    arrayController = this.arrayController = SC.ArrayController.create({
      contentBinding: SC.Binding.from('recordArray', this).multiple().oneWay()
    });

    this._autocomplete = SC.ListView.create({
      rowHeight: 30,
      contentBinding: SC.Binding.from('arrangedObjects', arrayController).multiple().oneWay(),
      selectionBinding: SC.Binding.from('selection', arrayController).oneWay(),
      renderRow: function(context, width, height, index, object, isSelected) {
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

        context.fillText(object.get(that.get('searchKey')), width/2, height/2);
      },
      mouseDown: function(evt) {
        arguments.callee.base.apply(this, arguments);
        var rec = this.get('content').objectAt(this._rowIndex);
        if (rec) that.tryToPerform('chooseRecord', rec);
      }
    });

    this._valueDidChange();
    this._recordArrayDidChange();
  },

  isEnabledDidChange: function() {
    this.dispatchAction('isEnabledDidChange');
  }.observes('isEnabled'),

  isFirstResponderDidChange: function() {
    // console.log('Postbooks.ComboBoxWidget#isFirstResponderDidChange()', SC.guidFor(this));
    var action = this.get('isFirstResponder') ? 'didBecomeFirstResponder' : 'didResignFirstResponder';
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
          return this.transition('Show All Matches');

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
        this._ignoreValueFromField = false;
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
          var autocomplete = this._autocomplete,
              frame = autocomplete.get('frame');
        
          frame.x = evt.clientX - evt.hitPoint.x + bounds.width - 16;
          frame.y = evt.clientY - evt.hitPoint.y - 24;
          frame.width = autocomplete.measuredWidth;
          frame.height = autocomplete.measuredHeight;
        
          return this.transition('Show All Matches');
        }
        break;
      case 'fieldEditorDidClose':
        if (!this._ignoreValueFromField) this.set('value', evt.arg1 || '');
        return this.transition('Inactive');
      case 'didResignFirstResponder':
        return this.transition('Inactive');
    }
  }.behavior('Active'),

  'Pop Up': function(evt) {
    var autocomplete = this._autocomplete;
    switch (evt.type) {
      case 'enter':
        autocomplete.triggerLayoutAndRendering();
        SC.app.addSurface(autocomplete);
        SC.app.set('menuSurface', autocomplete);
        return;
      case 'exit':
        SC.app.set('menuSurface', null);
        SC.app.removeSurface(autocomplete);
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
    } else if (evt.type === 'fieldEditorDidClose') {
      this.set('value', '');
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
    var value = SC.activeEditor.get('value') || '',
        q, ra, recordType = this.get('recordType'),
        searchKey = this.get('searchKey');

    if (value.length > 0) {
      ra = this._searchCache[value];
      if (!ra) {
        sc_assert(typeof searchKey === 'string');
        sc_assert(searchKey.length > 1);
        q = SC.Query.local(recordType, {
          conditions: searchKey+" BEGINS_WITH {value}",
          orderBy: searchKey+' ASC',
          parameters: { value: value }
        });
        ra = this._searchCache[value] = XT.store.find(q);
      }

      // We don't want to be dispatching when we set this.
      var that = this;
      setTimeout(function() {
        SC.RunLoop.begin();
        that.set('recordArray', ra);
        console.log('setting selection to empty');
        var sel = that.arrayController.get('selection'),
            rec = sel? sel.firstObject() : null;

        if (sel && rec) sel.removeObject(rec);
        that.tryToPerform('recordArrayLengthDidChange');
        window.ra = ra;
        SC.RunLoop.end();
      }, 0);
    }

  },

  'Create or Retrieve Search': function(evt) {
    var value = this.get('value') || "";
    switch (evt.type) {
      case 'enter':
        this.createOrRetrieveSearch();
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

  'Show All Matches': function(evt) {
    var autocomplete = this._autocomplete,
        recordArray = this.get('recordArray'),
        sel, len, rec, idx, indexSet,
        that = this;

    switch (evt.type) {
      case 'enter':
        var q, ra, recordType = this.get('recordType'),
            searchKey = this.get('searchKey');

        // Show all matches.
        ra = this._allMatches;
        if (!ra) {
          q = SC.Query.local(recordType, {
            orderBy: searchKey+' ASC'
          });
          ra = this._allMatches = XT.store.find(q);
        }

        this.set('recordArray', ra);

        var f = this.get('frame'),
            b = SC.psurfaces[this.get('surface').__id__].__element__.getBoundingClientRect();

        var frame = autocomplete.get('frame');
        frame.x = f.x + b.left;
        frame.y = f.y + b.top + f.height;
        frame.width = 200;
        frame.height = ra.get('length') * 30;
        SC.app.addSurface(autocomplete);
        break;
      case 'exit':
        SC.app.removeSurface(autocomplete);
        break;
      case 'chooseRecord':
        rec = evt.arg1;
        if (rec) {
          this.set('value', rec.get(this.get('searchKey')));
          this._ignoreValueFromField = true;
        }
        break;
      case 'keyDown':
        if (evt.which === 13 || evt.which === 9) { // Enter, Tab, and Shift-Tab
          sel = this.arrayController.get('selection');

          if (sel.get('length') === 0) {
            // Choose the top item.
            rec = this.arrayController.objectAt(0);
          } else {
            rec = sel.firstObject();
          }

          if (rec) {
            this.set('value', rec.get(this.get('searchKey')));
            this._ignoreValueFromField = true;
          }

        } else if (evt.which === 38) { // Up Arrow
          sel = this.arrayController.get('selection');
          len = sel.get('length');
          indexSet = sel.indexSetForSource(this.arrayController);
          idx = indexSet? indexSet.min() : 0;

          if (len === 0) {
            // Select the last object
            rec = this.arrayController.lastObject();
            if (rec) sel.addObject(rec);
          } else if (idx === 0) {
            // Select the object at the end
            rec = this.arrayController.lastObject();
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          } else {
            // Select the object above the current object.
            rec = this.arrayController.objectAt(idx-1);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          }

        } else if (evt.which === 40) { // Down Arrow
          sel = this.arrayController.get('selection');
          len = sel.get('length');
          indexSet = sel.indexSetForSource(this.arrayController);
          idx = indexSet? indexSet.min() : 0;

          if (len === 0) {
            // Select the first object
            rec = this.arrayController.objectAt(0);
            if (rec) sel.addObject(rec);
          } else if (idx === this.arrayController.get('length') - 1) {
            // Select the object at the beginning
            rec = this.arrayController.objectAt(0);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          } else {
            // Select the object below the current object.
            rec = this.arrayController.objectAt(idx+1);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          }

        }
        break;
      case 'keyUp':
        var c = evt.which;
        if (c === 38 || c === 40 || c === 13 || c === 9) return;

        var value = this.get('value') || '';
        if (value.length === 0) {
          this.transition('No Text');
        } else {
          this.transition('Create or Retrieve Search');
        }
        break;
    }
  }.behavior('Text'),

  'Has Matches': function(evt) {
    var autocomplete = this._autocomplete,
        recordArray = this.get('recordArray'),
        sel, len, rec, idx, indexSet,
        that = this;

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

        this._hm_value = SC.activeEditor.get('value');
        break;
      case 'exit':
        SC.app.removeSurface(autocomplete);
        this._hm_value = null;
        break;
      case 'chooseRecord':
        rec = evt.arg1;
        if (rec) {
          this.set('value', rec.get(this.get('searchKey')));
          this._ignoreValueFromField = true;
        }
        break;
      case 'keyDown':
        if (evt.which === 13 || evt.which === 9) { // Enter, Tab, and Shift-Tab
          sel = this.arrayController.get('selection');

          if (sel.get('length') === 0) {
            // Choose the top item.
            rec = this.arrayController.objectAt(0);
          } else {
            rec = sel.firstObject();
          }

          if (rec) {
            // Now we need to get the info version of this object, and 
            // assign it.
            this.set('value', rec.get(this.get('searchKey')));
            this._ignoreValueFromField = true;
          }

        } else if (evt.which === 38) { // Up Arrow
          sel = this.arrayController.get('selection');
          len = sel.get('length');
          indexSet = sel.indexSetForSource(this.arrayController);
          idx = indexSet? indexSet.min() : 0;

          if (len === 0) {
            // Select the last object
            rec = this.arrayController.lastObject();
            if (rec) sel.addObject(rec);
          } else if (idx === 0) {
            // Select the object at the end
            rec = this.arrayController.lastObject();
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          } else {
            // Select the object above the current object.
            rec = this.arrayController.objectAt(idx-1);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          }

        } else if (evt.which === 40) { // Down Arrow
          sel = this.arrayController.get('selection');
          len = sel.get('length');
          indexSet = sel.indexSetForSource(this.arrayController);
          idx = indexSet? indexSet.min() : 0;

          if (len === 0) {
            // Select the first object
            rec = this.arrayController.objectAt(0);
            if (rec) sel.addObject(rec);
          } else if (idx === this.arrayController.get('length') - 1) {
            // Select the object at the beginning
            rec = this.arrayController.objectAt(0);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          } else {
            // Select the object below the current object.
            rec = this.arrayController.objectAt(idx+1);
            sel.removeObject(this.arrayController.objectAt(idx));
            if (sel) sel.addObject(rec);
          }

        }
        break;
      case 'keyUp':
        var c = evt.which;
        if (c === 38 || c === 40 || c === 13 || c === 9) return;

        var value = SC.activeEditor.get('value');
        if (value.length === 0) {
          this.transition('No Text');
        } else if (value !== this._hm_value) {
          this.transition('Create or Retrieve Search');
        }
        break;
    }
  }.behavior('Text'),

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
  //   console.log('Postbooks.ComboBoxWidget#mouseDown');
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
    return this.get('value') || "";
  },

  takeValueFromFieldEditor: function(value) {
    // console.log('takeValueFromFieldEditor', value);
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
    style.textAlight = 'left';
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
