

enyo.kind({
  name: "XT.ModuleMenu",
  kind: "FittableRows",
  classes: "xt-module-menu",
  published: {
    selection: null
  },
  create: function() {
    this.inherited(arguments);
    this.selection = this.createComponent({
      kind: "Selection"
    });
  },
  handlers: {
    onSelect: "onSelect",
    onDeselect: "onDeselect"
  },
  onSelect: function() {
    var child = this.getSelectedChild();

    this.log(child);

    if (child) {
      child.addClass("selected");
    }
  },
  onDeselect: function() {
    var selected = this.getSelection().lastSelected;
    var child = this.getChildByIndex(selected);

    this.log(selected, child);

    if (child) {
      child.removeClass("selected");
    }
  },
  getSelectedChild: function() {
    var children = this.children;
    var selection = this.getSelection();
    var idx = 0;
    var child;
    for (; idx < children.length; ++idx) {
      child = children[idx];
      if (selection.isSelected(child.getIndex())) {
        return child;
      }
    }
  },
  getChildByIndex: function(inSelected) {
    var children = this.children;
    var idx = 0;
    var child;
    for (; idx < children.length; ++idx) {
      child = children[idx];
      if (child.getIndex() === inSelected) {
        return child;
      }
    }
    return null;
  }
});
