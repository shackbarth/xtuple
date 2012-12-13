/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, _:true, document:true */

(function () {

  enyo.kind({
    name: "App",
    kind: "XV.App",
    components: [
      { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "XV.Pullout", onAnimateFinish: "pulloutAnimateFinish" }
    ]
  });
  
}());
