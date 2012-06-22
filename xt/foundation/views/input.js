
enyo.kind({
  name: "XT.Input",
  kind: "Input",
  classes: "xt-input"
});

enyo.kind({
  name: "XT.Button",
  kind: "Button",
  classes: "xt-button",
  events: {
    onButtonTapped:""
  },
  handlers: {
    ontap: "buttonTapped"
  },
  buttonTapped: function() {
    this.doButtonTapped();
  }
});