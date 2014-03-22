/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Completer
    @class Renders a list of items that can be selected from a menu.<br />
    Used to create the autocomplete list for {@link XV.Combobox}.<br />
    Derived from <a href="http://enyojs.com/api/#onyx.Picker">onyx.Picker</a>.<br />
    Note: Each item in the list is an onyx.MenuItem,
    so an onSelect event with the item can be listened to by a client application to determine which picker item was selected.
    @extends onyx.Picker
   */
  enyo.kind(
    /** @lends XV.Completer# */{
    name: "XV.Completer",
    kind: "onyx.Picker",
    classes: "xv-combobox-picker",
    // Hack: make sure picker is always on top ('floating' doesn't work)
    style: "width: 100px; z-index: 999;",
    modal: false,
    /**
      Unfortunately this is a copy of code from menu. It makes adjustments to account for the
      height of the completer widget so the menu doesn't cover over typing area.
    */
    adjustPosition: function (belowActivator) {
      var r,
        rHeight;
      if (this.showing && this.hasNode()) {
        this.removeClass("onyx-menu-up");

        //Reset the left position before we get the bounding rect for proper horizontal calculation.
        if (!this.floating) { this.applyPosition({left: "auto"}); }

        var b = this.node.getBoundingClientRect();
        var bHeight = (b.height === undefined) ? (b.bottom - b.top) : b.height;
        var innerHeight = (window.innerHeight === undefined) ? document.documentElement.clientHeight : window.innerHeight;
        var innerWidth = (window.innerWidth === undefined) ? document.documentElement.clientWidth : window.innerWidth;

        //Position the menu above the activator if it's getting cut off, but only if there's more room above than below.
        this.menuUp = (b.top + bHeight > innerHeight) && ((innerHeight - b.bottom) < (b.top - bHeight));
        this.addRemoveClass("onyx-menu-up", this.menuUp);

        //If floating, adjust the vertical positioning.
        if (this.floating) {
          r = this.activatorOffset;
          rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
          //if the menu doesn't fit below the activator, move it up
          if (this.menuUp) {
            this.applyPosition({top: (r.top - rHeight - bHeight + (this.showOnTop ? r.height : 0)), bottom: "auto"});
          } else {
            //if the top of the menu is above the top of the activator and there's room to move it down, do so
            if ((b.top < r.top) && (r.top + (belowActivator ? r.height : 0) + bHeight < innerHeight))
            {
              this.applyPosition({top: r.top + rHeight + (this.showOnTop ? 0 : r.height), bottom: "auto"});
            }
          }
        }

        //Adjust the horizontal positioning to keep the menu from being cut off on the right.
        if ((b.right) > innerWidth) {
          if (this.floating) {
            this.applyPosition({left: r.left - (b.left + b.width - innerWidth)});
          } else {
            this.applyPosition({left: - (b.right - innerWidth)});
          }
        }

        //Finally prevent the menu from being cut off on the left.
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
    },
    /**
      @param {String} key The name of the attribute that we're going to display
      @param {String} value The value of the input box that we use to filter the results
      @param {Array} models All the models
      @param {String} sidecarKey We allow a second attribute to be shown in the dropdown
        that is not part of the input field.
    */
    buildList: function (key, value, models, sidecarKey, skipFilter) {
      key = _.isString(key) ? [key] : key;
      var regexp = new RegExp("^" + value, "i"),
        model,
        list,
        item,
        itemContent,
        i,
        n;
      this.destroyClientControls();
      if (models && models.length) {
        list = skipFilter ? models : _.filter(models, function (model) {
          for (n = 0; n < key.length; n++) {
            item = model.getValue(key[n]) || "";
            if (item.match(regexp)) { return true; }
          }
          return false;
        });

        for (i = 0; i < list.length; i++) {
          model = list[i];
          item = model.getValue(key[0]);
          if (item) {
            itemContent = model.getValue(key[0]);
            if (sidecarKey) {
              itemContent = itemContent +
                " <span class='xv-completer-sidecar'>[" +
                model.getValue(sidecarKey) +
                "]</span>";
            }
            this.createComponent({
              content: itemContent,
              allowHtml: true,
              model: model
            });
          }
        }
        this.render();
      }
    }
  });

}());
