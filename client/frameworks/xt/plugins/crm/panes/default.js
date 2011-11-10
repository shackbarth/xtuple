
/* */

/** */
Crm.DefaultPane = XT.MainPane.extend(
  {


  name: "Crm",

  childViews: "test1".w(),

  test1: XT.View.design({
    layout: { width: 300, height: 300, centerX: 0, centerY: 0 },
    childViews: "some1".w(),
    some1: SC.LabelView.design({
      tagName: "h3",
      value: "someValueToShow"
    })
  })


}) ;
