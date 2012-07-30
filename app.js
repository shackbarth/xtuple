/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, document:true */

(function () {
  
  enyo.kind({
    name: "App",
    fit: true,
    classes: "xt-app enyo-unselectable",
    published: {
      isStarted: false
    },
    components: [
      { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "enyo.Slideable", classes: "pullout",
        value: -100, min: -100, unit: '%', components: [
        {name: "shadow", classes: "pullout-shadow"},
        {name: "grabber", kind: "onyx.Grabber", classes: "pullout-grabbutton"},
        {name: "parameterWidget", kind: "XV.ParameterWidget"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.$.container.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    start: function () {
    
      if (this.getIsStarted()) { return; }
    
      // on application start, connect the datasource
      XT.dataSource.connect();
    
      // now that we've started, we need to render something
      // to the screen
      // TODO: is this really where this belongs?
      this.renderInto(document.body);
    
      // lets not allow this to happen again
      this.setIsStarted(true);
    }
  });

}());