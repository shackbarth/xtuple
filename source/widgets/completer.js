/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @class
    @name XV.Completer
    @extends onyx.Picker
   */
  enyo.kind(/** @lends XV.Completer# */{
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
    },
    buildList: function (key, value, models) {
      var regexp = new RegExp("^" + value, "i"),
        model,
        list,
        item,
        i;
      this.destroyClientControls();
      if (models && models.length) {
        list = _.filter(models, function (model) {
          var item = model.get(key) || "";
          return item.match(regexp);
        });

        for (i = 0; i < list.length; i++) {
          model = list[i];
          item = model.get(key);
          if (item) {
            this.createComponent({
              content: model.get(key),
              model: model
            });
          }
        }
        this.render();
      }
    }
  });

}());
