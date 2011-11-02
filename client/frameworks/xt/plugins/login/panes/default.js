
/*globals Login */

/** @class


*/
Login.DefaultPane = XT.MainPane.extend(
  /** @scope Login.DefaultPane.prototype */ {

  childViews: "helloWorld".w(),

  helloWorld: SC.LabelView.design({
    value: "HELLO WORLDY WORLD!"
  })

}) ;
