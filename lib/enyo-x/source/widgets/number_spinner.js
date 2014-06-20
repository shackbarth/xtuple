/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.NumberSpinnerWidget
    @extends XV.NumberWidget
   */
  enyo.kind(
    /** @lends XV.Number# */{
    name: "XV.NumberSpinnerWidget",
    kind: "XV.NumberWidget",
    published: {
      maxlength: 3,
      scale: XT.QTY_SCALE,
      formatting: true,
      showSlider: false,
      maxValue: 100,
      label: "",
      showLabel: true,
      type: "text"
    },
    classes: "xv-spinnerwidget",
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {controlClasses: 'enyo-inline', components: [
          {kind: "onyx.Slider", name: "slider", onChange: "sliderChanged", classes: "slider"},
          {kind: "onyx.InputDecorator", tag: "div", classes: "xv-icon-decorator", components: [
            {name: "input", kind: "onyx.Input",
              onchange: "inputChanged", onkeydown: "keyDown"},
            {components: [
              {kind: "onyx.IconButton", ontap: "increase",
                attributes: {tabIndex: "-1"}, classes: "icon-angle-up"},
              {kind: "onyx.IconButton", ontap: "decrease",
                attributes: {tabIndex: "-1"}, classes: "icon-angle-down"}
            ]}
          ]}
        ]}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.showSliderChanged();
    },
    /**
      Decreases the value of the input field by an increment of
      one until the value of 0.
    */
    decrease: function (inSender, inEvent) {
      var value = Math.max(parseInt(this.$.input.getValue() || 0, 10) - 1, 0);
      this.setValue(value);
      this.setSliderValue();
    },
    /**
      Increases the value of the input field by an increment of
      one at at maximum of the published maximum value.
    */
    increase: function (inSender, inEvent) {
      var value = Math.min(parseInt(this.$.input.getValue() || 0, 10) + 1, this.getMaxValue());
      this.setValue(value);
      this.setSliderValue();
    },
    /**
      Set the slider value equal to the value
      of the input field.
    */
    setSliderValue: function () {
      this.$.slider.setValue(this.$.input.getValue());
    },
    /**
      Inherit setValue from NumberWidget and set
      slider with value.
    */
    setValue: function (value, options) {
      this.inherited(arguments);
      this.setSliderValue();
    },
    showSliderChanged: function () {
      this.$.slider.setShowing(this.showSlider);
    },
    /**
      Set the input value equal to the value
      of the slider field.
    */
    sliderChanged: function (inSender, inEvent) {
      this.$.input.setValue(Math.round(this.$.slider.getValue()));
    }
  });

}());
