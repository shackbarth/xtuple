
XT.log = function() {
  var args = XT.$A(arguments);
  if (console.log.apply) {
    console.log.apply(console, args);
  } else {
    console.log(args.join(" "));
  }
};
