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

  //remove excess white space
  for(var i = 0; i < result.length; ++i){
    if (result[i].charAt(0) === ' '){
        result[i] = result[i].substr(1);
    }
  }

  return stringToArray(result);
}

//converts array of strings into array of arrays.
var stringToArray = function(result){
  var newArray = []
  for(var i = 0; i < result.length; ++i){
    newArray.push(result[i].split(" "));
  }

  return newArray;
}//credit http://codereview.stackexchange.com/a/7042 for combination

//task 2
//add to fromTo dictionary in order to find
var fromTo = [ //user input
    {"fromExt": "foo", "toExt": "bar"},
    {"fromExt": "foo", "toExt": "baz"}
]

var depTree = ["foo","bar","baz"]; //user input

var depCheck = function(thing) {
    var placeholder = []
    for(var i = 0; i < thing.length; ++i){
        placeholder.push((thing[i].fromExt + ' ' + thing[i].toExt));
    }

    return stringToArray(placeholder);
}

var findDep = function(a, b) {
    a = depCheck(a); //where a is fromTo
    b = getCombinations(b); //where b is depTree

    var array = []
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if (arrayEquivalence(a[i],b[j])){
          array.push(a[i]);
        }
      };
    };

    return array;

}

function arrayEquivalence(a, b) {
  if (a === b) {return true;}
  if (a == null || b == null) {return false;}
  if (a.length != b.length) {return false;}

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  } return true;
} //credit http://stackoverflow.com/a/16436975 for concept


findDep(fromTo,depTree);
