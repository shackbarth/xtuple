/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, _:true, document:true */

(function () {

  enyo.kind({
    name: "App",
    kind: "XV.App",
    keyCapturePatterns: [
      {method: "captureMagstripe", start: [16, 53, 16, 66], end: [191, 13]}
    ],
    components: [
      { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "XV.Pullout", onAnimateFinish: "pulloutAnimateFinish" },
      { name: "signals", kind: enyo.Signals, onkeydown: "handleKeyDown" }
    ],
    captureMagstripe: function (input) {
      console.log("deal with ", input);
    }
  });

}());
