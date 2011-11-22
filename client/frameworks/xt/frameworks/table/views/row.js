
/*globals XT */

/** @class

*/
XT.RowTemplate = XT.TemplateView.extend(
  /** @scope XT.RowTemplate.prototype */ {

  templateName: "default_row",
  
  _content: function() {
    this.log("My content changed! => %@".fmt(this.getPath("content.storeKey")));
  }.observes("*content"),
    
}) ;