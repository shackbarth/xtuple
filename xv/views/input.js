
enyo.kind({
  name: "XV.Input",
  kind: "Input",
  classes: "xt-input"
});

enyo.kind({
  name: "XV.Button",
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