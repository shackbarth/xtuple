
Postbooks.main = function main() {

  XT.PostbooksStatechart.initStatechart();

  Postbooks.getPath("mainPage.mainPane").attach();
};

function main() { Postbooks.main(); }
