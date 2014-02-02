//task 1
var getCombinations = function(input) {
  var result = [];
  var f = function(prefix, input) {

    for (var i = 0; i < input.length; i++) {
      result.push(prefix + ' ' + input[i]);
      f(prefix + ' ' + input[i], input.slice(i + 1));
    }
  }
  f('', input);

  return _.map(result, function(ele){return ele.trim().split(" ")});
}

//task 2
//add to fromTo dictionary in order to find
var fromTo = [ //user input
    {"fromExt": "foo", "toExt": "bar"},
    {"fromExt": "foo", "toExt": "baz"}
]

var depTree = ["foo","bar","baz"]; //user input

var depCheck = function(thing) {
    var placeholder = [];

    _.map(thing, function(ele){placeholder.push((ele.fromExt + ' ' + ele.toExt));})

    return _.map(placeholder, function(ele){return ele.split(" ")});
}

var findDep = function(a, b) {
    a = depCheck(a); //where a is fromTo
    b = getCombinations(b); //where b is depTree

    var array = [];

    _.map(a, function(eleLoo1){
      _.map(b, function(eleLoo2){
        if(_.isEqual(eleLoo1,eleLoo2)){array.push(eleLoo1);}
      })
    });

    return array;

}

findDep(fromTo,depTree);
