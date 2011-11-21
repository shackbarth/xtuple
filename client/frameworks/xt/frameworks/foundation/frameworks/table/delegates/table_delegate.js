
/*globals XT */

sc_require("views/column");

/** @delegate

*/
XT.TableDelegate = {
  

  //.....................................
  // Properties
  //

  /** @property
    Walk like a duck?
  */
  isTableDelegate: YES,  

  //.....................................
  // Methods
  // 

  /** @private */
  render: function(context) {
    
    var content = this.get("content");

    // for occassions when there is not content, just present a message
    // and return
    if(!content || content.get("length") <= 0 || SC.none(content))
      return context.begin("div").addClass("no-content").push("No content to display").end();

    // grab some variables
    var tid = this.get("tableId"),
        cid = tid+"-container",
        len = content.get("length");
        
    // so that this will work in IE (for now) we are using standard table layout

    // table container begin
    context.push('<div id='+cid+' class="container">');

    // table container end
    context.push('</div>');
  },

  /** @private */
  update: function(jquery) {

  },
    
} ;
