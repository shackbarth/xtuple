//task 1
function getCombinations(input) {
  var result = [];
  var f = function(prefix, input) {
    for (var i = 0; i < input.length; i++) {
      result.push(prefix + '->' + input[i]);
      f(prefix + '->' + input[i], input.slice(i + 1));
    }
  }
  f('', input);

  //remove excess white space and add arrow notation
  for(var i = 0; i < result.length; ++i){
    if (result[i].charAt(0) === ' '){
        result[i] = result[i].substr(1);
    }

    if (result[i].charAt(0) === '-' && result[i].charAt(1) === '>'){
        result[i] = result[i].substr(2);
    }
  }

  return result;
}

//thanks Guffa @ stackOverflow for combination

//task 2
//add to userDepCheck dictionary in order to find
var userDepCheck = [
    {"fromExt": "foo", "toExt": "bar"},
    {"fromExt": "foo", "toExt": "baz"}
]

var depTree = ["foo","bar","baz"];

function prepareForCheck (thing) {
    var placeholder = []
    for(var i = 0; i < thing.length; ++i){
        placeholder.push((thing[i].fromExt + '->' + thing[i].toExt));
    }

    return placeholder;
}

function screenIllegalCombinations(combo, dep){
    //find intersection
    return findDep(combo, dep);
}

function findDep(a, b) {
    a = prepareForCheck(a); //where a is userDepCheck
    b = getCombinations(b); //where b is depTree

    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}
//thanks Paul S. @ stackOverflow for intersect

findDep(userDepCheck,depTree);
