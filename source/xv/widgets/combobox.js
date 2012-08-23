/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.CompleterPicker",
    kind: "onyx.Picker",
    adjustPosition: function (belowActivator) {
      var r;
      if (this.showing && this.hasNode()) {
        this.removeClass("onyx-menu-up");

        //reset the left position before we get the bounding rect for proper horizontal calculation
        if (!this.floating) { this.applyPosition({left: "auto"}); }

        var b = this.node.getBoundingClientRect();
        var bHeight = (b.height === undefined) ? (b.bottom - b.top) : b.height;
        var innerHeight = (window.innerHeight === undefined) ? document.documentElement.clientHeight : window.innerHeight;
        var innerWidth = (window.innerWidth === undefined) ? document.documentElement.clientWidth : window.innerWidth;

        //position the menu above the activator if it's getting cut off, but only if there's more room above than below
        this.menuUp = (b.top + bHeight > innerHeight) && ((innerHeight - b.bottom) < (b.top - bHeight));
        this.addRemoveClass("onyx-menu-up", this.menuUp);

        //if floating, adjust the vertical positioning
        if (this.floating) {
          r = this.activatorOffset;
          //if the menu doesn't fit below the activator, move it up
          if (this.menuUp) {
            this.applyPosition({top: (r.top - bHeight + (this.showOnTop ? r.height : 0)), bottom: "auto"});
          } else {
            //if the top of the menu is above the top of the activator and there's room to move it down, do so
            if ((b.top < r.top) && (r.top + (belowActivator ? r.height : 0) + bHeight < innerHeight))
            {
              this.applyPosition({top: r.top + (this.showOnTop ? 0 : r.height), bottom: "auto"});
            }
          }
        }

        //adjust the horizontal positioning to keep the menu from being cut off on the right
        if ((b.right) > innerWidth) {
          if (this.floating) {
            this.applyPosition({left: r.left - (b.left + b.width - innerWidth)});
          } else {
            this.applyPosition({left: - (b.right - innerWidth)});
          }
        }

        //finally prevent the menu from being cut off on the left
        if (b.left < 0) {
          if (this.floating) {
            this.applyPosition({left: 0, right: "auto"});
          } else {
            //handle the situation where a non-floating menu is right or left aligned
            if (this.getComputedStyleValue("right") === "auto") {
              this.applyPosition({left: -b.left});
            } else {
              this.applyPosition({right: b.left});
            }
          }
        }
      }
    }
  });

  enyo.kind({
    name: "XV.Combobox",
    kind: "XV.Input",
    classes: "xv-combobox",
    published: {
      keyAttribute: "name",
      collection: "XM.countries"
    },
    events: {
      onSearch: ""
    },
    components: [
      {name: "decorator", kind: "onyx.InputDecorator",
        classes: "xv-input-decorator", components: [
        {name: "input", kind: "onyx.Input", classes: "xv-subinput",
          onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur"},
        {kind: "onyx.IconButton", src: "assets/relation-icon-search.png",
          ontap: "togglePicker"},
        {name: "autocompleteMenu", kind: "XV.CompleterPicker", style: "width: 100px;",
          classes: "xv-combobox-picker"
        }
      ]}
    ],
    autocomplete: function () {
      var key = this.getKeyAttribute(),
        value = this.$.input.getValue(),
        models = this._collection ? this._collection.models : null,
        regexp = value ? new RegExp("^" + value, "i") : null,
        res;

      if (models && models.length && regexp) {
        res = _.find(models, function (model) {
          var value = model.get(key) || "";
          return value.match(regexp);
        });
      }
      if (res) { this.setValue(res.get(key)); }
    },
    buildList: function () {
     // return;
      var key = this.getKeyAttribute(),
        regexp = new RegExp("^" + this.$.input.getValue(), "i"),
        menu = this.$.autocompleteMenu,
        models = this._collection ? this._collection.models : null,
        model,
        list,
        i;
    //  menu.destroyComponents();
   //   menu.controls = [];
     // menu.children = [];
      // filter here...
      if (models && models.length) {
        list = _.filter(models, function (model) {
          var value = model.get(key) || "";
          return value.match(regexp);
        });

        for (i = 0; i < list.length; i++) {
          model = list[i];
          menu.createComponent({
            content: model.get(key)
          });
        }
        menu.reflow();
        menu.render();
   //     menu.show();
      } else {
   //     menu.hide();
      }
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.buildList();
    },
    keyDown: function (inSender, inEvent) {
      // If tabbed out...
      if (inEvent.keyCode === 9) {
        this.$.autocompleteMenu.hide();
        this.autocomplete();
      }
    },
    keyUp: function (inSender, inEvent) {
     // this.buildList();
    },
    collectionChanged: function () {
      var that = this,
        callback;
      this._collection = XT.getObjectByName(this.collection);
      // If we don't have data yet, try again after start up tasks complete
      if (!this._collection) {
        callback = function () {
          that.collectionChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }
    },
    itemSelected: function (inSender, inEvent) {
      this.setValue(inEvent.originator.content);
      this.$.autocompleteMenu.hide();
      return true;
    },
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    togglePicker: function (inSender, inEvent) {
      inEvent.activator = this;
      var picker = this.$.autocompleteMenu;
      if (picker.showing) {
        picker.waterfall("onRequestHideMenu", inEvent);
      } else {
        picker.waterfall("onRequestShowMenu", inEvent);
      }
    }

  });

}());
