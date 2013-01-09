enyo.kind({
	name: "NumberWidgetTest",
	kind: enyo.TestSuite,
	testSetterAndGetter: function () {
      var numberWidget = this.createComponent({kind: "XV.NumberWidget"});
      numberWidget.setValue("13");
      var error = (numberWidget.getValue() === 13) ? "" : "Got " + numberWidget.getValue() + ", expected 13";
      this.finish(error);
	}
})
