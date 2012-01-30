
/*globals XT */

/** @class

*/
XT.RowTemplate = XT.TemplateView.extend(
  /** @scope XT.RowTemplate.prototype */ {

  templateName: "default_row",
  
  click: function() {
    this.get("table").select(this);
    return YES;
  },
  
  isSelected: NO
    
}) ;