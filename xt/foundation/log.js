
XT.log = function() {
  if (console.log.apply) {
    console.log.apply(arguments);
  } else {
    console.log(XT.$A(arguments).join(" "));
  }
};