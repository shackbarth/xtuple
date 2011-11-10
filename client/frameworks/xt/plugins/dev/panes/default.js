
Dev.DefaultPane = XT.MainPane.extend({

  childViews: "container".w(),

  container: XT.View.design({
    layout: { top: 20, bottom: 20, left: 20, right: 20 },
    classNames: "dev-container".w(),
    childViews: "test1".w(),

  test1: SC.LabelView.design({
    layout: { top: 0, left: 0, right: 0, bottom: 0 },
    value: "SOME VALUE FROM DEV!"
    }) // test1 

    }) // container

}) ;
