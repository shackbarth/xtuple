
XT.TableDelegate = {

  /**
    Walk like a duck?
  */
  isTableDelegate: YES,

  /**
    The scroll target for the CScroller.
  */
  scrollTarget: function() {
    return this.get("_xt_id") + "-table-body";
  }.property("_xt_id"),

  /** @private
    Overload the render method so that it fires and event that is
    handled by the statechart, that way the view will only render when
    it is supposed to.
  */
  render: function(context) { 

    // grab the content
    var content = this.get("content");
  
    if(!content || content.get("length") <= 0) return; 

    this.msg("rendering", YES);

    // begin the outermost table container that should be able to
    // fill up the given space and wrap the markup-table
    context.push(
      '<div id="' + this.get("_xt_id") + '" class="xt-wrapper xt-common">'
    );

    // push the pre-created header to the context
    // context.push(
    //   this.get("_xt_header")
    // );

    // 
    context.push(
      '<div id="' + (this.get("_xt_id") + "-table-body") + '" class="xt-body-container">'
    );

    // begin the table definition
    context.push(
      '<table cellpadding="0" cellspacing="0" border="0" class="xt-table xt-common" id="' + this.get("_xt_id") + '-body">'
    );

    // grab the columns we should render
    var columns = this.get("columns");

    this.msg("content length => %@".fmt(content.get("length")), YES);

    // iterate over the content (records) and pass
    // references to the column render functions
    // so they can render the appropriate data for
    // the cell
    for(var i=0, len=content.get("length"); i<len; ++i) {

      context.push(
        '<tr class="xt-table-row" xtsid="' + content.objectAt(i).storeKey + '">',
          '<td class="xt-table-data-cell">'
      );

      var columnsMarkup = "";
      var container = this.template("xt_container");

      // iterate over columns and render them
      columns.forEach(function(column) {

        // call their render function explicity and pass the context
        // column.render(context, content.objectAt(i), i % 2 == 0);
        columnsMarkup += column.render(content.objectAt(i));
      });

      container = container.replace(/\{\{columns\}\}/, columnsMarkup);

      context.push( container );

      context.push(
          '</td>',
          '<td align="center" valign="middle" class="xt-table-selector-cell">'
      );

      // need to push selection arrow containing cell
      context.push(
            '<span class="xt-selection-arrow"></span>'
      );

      context.push(
          '</td>',

          // place a spacer...
          '<td class="xt-right-side-spacer xt-common">&nbsp;</td>',

        '</tr>'
      );
    }

    // close 'er off we're all done here
    context.push(

          // close the table
          '</table>',

        // end the markup table
        '</div>',

      // end the outer container
      '</div>'
    );

    // help out by letting it know there weren't any to worry about
    this._didRenderChildViews = YES;
     var self = this;

      setTimeout(
        function() {
          self.$(".xt-has-hint").tipTip({ attribute: "hint" });
          self.$("span.xt-selection-arrow").click(function() {
            var se = SC.Event.simulateEvent($(this).closest("tr"), "dbleclick");
            self.doubleClick(se);
          })
        }, 200
      );
  },
  
  update: function(jquery) {

    // @note Pretty certain there is a MUCH better way of doing this...
  
    // ideally this is more efficient then re-rendering the whole view
    // grab the selection
    // var selection = this.getPath("tableController.selection");
    var selection = this.get("selection");

    // find all the selected rows and remove selection
    this.$(".xt-selected-row", jquery).each(function() {
      $(this).removeClass("xt-selected-row");
    });

    // if there is no new selection(s) we're done
    if(selection.get("length") === 0) {
      return YES;
    } else {
      var self = this;
      selection.forEach(function(record) {
        var xtsid = record.storeKey;
        var row = this.$("tr[xtsid='" + xtsid + "']", jquery)[ 0 ];
        if(row) {
          $(row).addClass("xt-selected-row");
        }
      }, self);
    }

    // now make sure we run the method to show the selection state of the rows
    this.sendEvent("rowsUpdated");
  },

  /** @private */
  willDestroyLayer: function() {

    // need to unregister for scroller events...
    // this._cs_unregister("#" + this.get("_xt_id") + "-table-body");
    this._cs_unregister();
  },

  /** @private */
  template: function(tpl) {
    var template = SC.TEMPLATES.get(tpl);
    // var template = SC.TEMPLATES.get("xt_%@".fmt(this.get("index")));
    return template ? template.rawTemplate : null ;
  },



  // MUCH OF THESE EVENT HANDLERS COULD BE ABSTRACTED!


  click: function(e) {

    // use the determined method to stop propagation and
    // prevent the default action of the click
    // using CScroll...
    this._cs_events.prevent(e);

    // this is the event target (NOT the CScroll target)
    var target = e.target;

    // need to find the top level row of the current element
    var row = $(target).closest("tr");

    // need to extract the storeKey attribute (`xtsid`)
    var storeKey = $(row).attr("xtsid");

    if(storeKey && !isNaN(storeKey)) {
      this.sendEvent("select", storeKey);
    } else { console.warn("Attempt to select a record but storeKey was invalid"); }
  },

  doubleClick: function(e) {

    console.warn("caught double click => ", e);

    // prevent defaults and propagation
    this._cs_events.prevent(e);

    var target = e.target;

    var row = $(target).closest("tr");

    var storeKey = $(row).attr("xtsid");

    if(storeKey && !isNaN(storeKey)) {

      var action = this.get("actionOnSelect");

      if(!action) {
        console.warn("No double click action defined for table");
        return YES;
      }

      var targetResponder = this.get("target") || null;

      if(!targetResponder) {
        // this.get("pane").sendEvent(action, this.get("tableController").recordFromStoreKey(storeKey));
        this.get("pane").sendEvent(action, this.recordFromStoreKey(storeKey));
      // } else { targetResponder.sendEvent(action, this.get("tableController").recordFromStoreKey(storeKey)); } 
      } else { targetResponder.sendEvent(action, this.recordFromStoreKey(storeKey)); } 

    } else { console.warn("Attempt to select a record but storeKey was invalid", e); }

  },

  rowsUpdated: function() {
    
    // find ALL of the rows and iterate over them to find
    // ones that are selected
    this.$("tr").each(function() {
      var highlight = $(".xt-selection-highlight", $(this))[ 0 ];
      if($(this).hasClass("xt-selected-row")) {

        // if it already has it don't do anything
        if(highlight) return;
          
        // create new element
        highlight = $("<div></div>").hide();

        // add the classes to it
        $(highlight).addClass("xt-selection-highlight");

        // grab calculated dimensions
        // @note This is valid because of box-sizing = border-box
        var _h = $(this).height();

        // grab the offset for it from the parent
        var _offset = $(this).position().top;

        $(highlight).height(_h);

        // this is the fixed offset from the top of the parent (the table container)
        // and this only works because of the way CScroll works by moving the div position
        // absolutely ...
        $(highlight).css("top", _offset);

        // add it to the dom!
        $(this).append(highlight);

        $(highlight).show();

      } else {

        // if this was a previous selection need to remove the
        // div that is highlighting it
        if(highlight) $(highlight).remove();
      }
    });

  },
};
