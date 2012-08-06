
// minifier: path aliases

enyo.path.addPaths({underscore: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/underscore/", backbone: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/backbone/", underscore: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/underscore/", backbone_relational: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/backbone_relational/", backbone: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/backbone/", underscore: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/underscore/", layout: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/layout/", onyx: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/onyx/", onyx: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/onyx/source/", globalize: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/globalize/", date_format: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/date_format/", "socket.io": "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/socket.io/", xt: "../source/xt/", xm: "../source/xm/", xv: "../source/xv/"});

// underscore-min.js

(function() {
function a(b, c, d) {
if (b === c) return 0 !== b || 1 / b == 1 / c;
if (null == b || null == c) return b === c;
b._chain && (b = b._wrapped), c._chain && (c = c._wrapped);
if (b.isEqual && v.isFunction(b.isEqual)) return b.isEqual(c);
if (c.isEqual && v.isFunction(c.isEqual)) return c.isEqual(b);
var e = i.call(b);
if (e != i.call(c)) return !1;
switch (e) {
case "[object String]":
return b == "" + c;
case "[object Number]":
return b != +b ? c != +c : 0 == b ? 1 / b == 1 / c : b == +c;
case "[object Date]":
case "[object Boolean]":
return +b == +c;
case "[object RegExp]":
return b.source == c.source && b.global == c.global && b.multiline == c.multiline && b.ignoreCase == c.ignoreCase;
}
if ("object" != typeof b || "object" != typeof c) return !1;
for (var f = d.length; f--; ) if (d[f] == b) return !0;
d.push(b);
var f = 0, g = !0;
if ("[object Array]" == e) {
if (f = b.length, g = f == c.length) for (; f-- && (g = f in b == f in c && a(b[f], c[f], d)); ) ;
} else {
if ("constructor" in b != "constructor" in c || b.constructor != c.constructor) return !1;
for (var h in b) if (v.has(b, h) && (f++, !(g = v.has(c, h) && a(b[h], c[h], d)))) break;
if (g) {
for (h in c) if (v.has(c, h) && !(f--)) break;
g = !f;
}
}
return d.pop(), g;
}
var b = this, c = b._, d = {}, e = Array.prototype, f = Object.prototype, g = e.slice, h = e.unshift, i = f.toString, j = f.hasOwnProperty, k = e.forEach, l = e.map, m = e.reduce, n = e.reduceRight, o = e.filter, p = e.every, q = e.some, r = e.indexOf, s = e.lastIndexOf, f = Array.isArray, t = Object.keys, u = Function.prototype.bind, v = function(a) {
return new G(a);
};
"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = v), exports._ = v) : b._ = v, v.VERSION = "1.3.3";
var w = v.each = v.forEach = function(a, b, c) {
if (a != null) if (k && a.forEach === k) a.forEach(b, c); else if (a.length === +a.length) {
for (var e = 0, f = a.length; e < f; e++) if (e in a && b.call(c, a[e], e, a) === d) break;
} else for (e in a) if (v.has(a, e) && b.call(c, a[e], e, a) === d) break;
};
v.map = v.collect = function(a, b, c) {
var d = [];
return a == null ? d : l && a.map === l ? a.map(b, c) : (w(a, function(a, e, f) {
d[d.length] = b.call(c, a, e, f);
}), a.length === +a.length && (d.length = a.length), d);
}, v.reduce = v.foldl = v.inject = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (m && a.reduce === m) return d && (b = v.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
w(a, function(a, f, g) {
e ? c = b.call(d, c, a, f, g) : (c = a, e = !0);
});
if (!e) throw new TypeError("Reduce of empty array with no initial value");
return c;
}, v.reduceRight = v.foldr = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (n && a.reduceRight === n) return d && (b = v.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
var f = v.toArray(a).reverse();
return d && !e && (b = v.bind(b, d)), e ? v.reduce(f, b, c, d) : v.reduce(f, b);
}, v.find = v.detect = function(a, b, c) {
var d;
return x(a, function(a, e, f) {
if (b.call(c, a, e, f)) return d = a, !0;
}), d;
}, v.filter = v.select = function(a, b, c) {
var d = [];
return a == null ? d : o && a.filter === o ? a.filter(b, c) : (w(a, function(a, e, f) {
b.call(c, a, e, f) && (d[d.length] = a);
}), d);
}, v.reject = function(a, b, c) {
var d = [];
return a == null ? d : (w(a, function(a, e, f) {
b.call(c, a, e, f) || (d[d.length] = a);
}), d);
}, v.every = v.all = function(a, b, c) {
var e = !0;
return a == null ? e : p && a.every === p ? a.every(b, c) : (w(a, function(a, f, g) {
if (!(e = e && b.call(c, a, f, g))) return d;
}), !!e);
};
var x = v.some = v.any = function(a, b, c) {
b || (b = v.identity);
var e = !1;
return a == null ? e : q && a.some === q ? a.some(b, c) : (w(a, function(a, f, g) {
if (e || (e = b.call(c, a, f, g))) return d;
}), !!e);
};
v.include = v.contains = function(a, b) {
var c = !1;
return a == null ? c : r && a.indexOf === r ? a.indexOf(b) != -1 : c = x(a, function(a) {
return a === b;
});
}, v.invoke = function(a, b) {
var c = g.call(arguments, 2);
return v.map(a, function(a) {
return (v.isFunction(b) ? b || a : a[b]).apply(a, c);
});
}, v.pluck = function(a, b) {
return v.map(a, function(a) {
return a[b];
});
}, v.max = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.max.apply(Math, a);
if (!b && v.isEmpty(a)) return -Infinity;
var d = {
computed: -Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e >= d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.min = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.min.apply(Math, a);
if (!b && v.isEmpty(a)) return Infinity;
var d = {
computed: Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e < d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.shuffle = function(a) {
var b = [], c;
return w(a, function(a, d) {
c = Math.floor(Math.random() * (d + 1)), b[d] = b[c], b[c] = a;
}), b;
}, v.sortBy = function(a, b, c) {
var d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return v.pluck(v.map(a, function(a, b, e) {
return {
value: a,
criteria: d.call(c, a, b, e)
};
}).sort(function(a, b) {
var c = a.criteria, d = b.criteria;
return c === void 0 ? 1 : d === void 0 ? -1 : c < d ? -1 : c > d ? 1 : 0;
}), "value");
}, v.groupBy = function(a, b) {
var c = {}, d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return w(a, function(a, b) {
var e = d(a, b);
(c[e] || (c[e] = [])).push(a);
}), c;
}, v.sortedIndex = function(a, b, c) {
c || (c = v.identity);
for (var d = 0, e = a.length; d < e; ) {
var f = d + e >> 1;
c(a[f]) < c(b) ? d = f + 1 : e = f;
}
return d;
}, v.toArray = function(a) {
return a ? v.isArray(a) || v.isArguments(a) ? g.call(a) : a.toArray && v.isFunction(a.toArray) ? a.toArray() : v.values(a) : [];
}, v.size = function(a) {
return v.isArray(a) ? a.length : v.keys(a).length;
}, v.first = v.head = v.take = function(a, b, c) {
return b != null && !c ? g.call(a, 0, b) : a[0];
}, v.initial = function(a, b, c) {
return g.call(a, 0, a.length - (b == null || c ? 1 : b));
}, v.last = function(a, b, c) {
return b != null && !c ? g.call(a, Math.max(a.length - b, 0)) : a[a.length - 1];
}, v.rest = v.tail = function(a, b, c) {
return g.call(a, b == null || c ? 1 : b);
}, v.compact = function(a) {
return v.filter(a, function(a) {
return !!a;
});
}, v.flatten = function(a, b) {
return v.reduce(a, function(a, c) {
return v.isArray(c) ? a.concat(b ? c : v.flatten(c)) : (a[a.length] = c, a);
}, []);
}, v.without = function(a) {
return v.difference(a, g.call(arguments, 1));
}, v.uniq = v.unique = function(a, b, c) {
var c = c ? v.map(a, c) : a, d = [];
return a.length < 3 && (b = !0), v.reduce(c, function(c, e, f) {
if (b ? v.last(c) !== e || !c.length : !v.include(c, e)) c.push(e), d.push(a[f]);
return c;
}, []), d;
}, v.union = function() {
return v.uniq(v.flatten(arguments, !0));
}, v.intersection = v.intersect = function(a) {
var b = g.call(arguments, 1);
return v.filter(v.uniq(a), function(a) {
return v.every(b, function(b) {
return v.indexOf(b, a) >= 0;
});
});
}, v.difference = function(a) {
var b = v.flatten(g.call(arguments, 1), !0);
return v.filter(a, function(a) {
return !v.include(b, a);
});
}, v.zip = function() {
for (var a = g.call(arguments), b = v.max(v.pluck(a, "length")), c = Array(b), d = 0; d < b; d++) c[d] = v.pluck(a, "" + d);
return c;
}, v.indexOf = function(a, b, c) {
if (a == null) return -1;
var d;
if (c) return c = v.sortedIndex(a, b), a[c] === b ? c : -1;
if (r && a.indexOf === r) return a.indexOf(b);
c = 0;
for (d = a.length; c < d; c++) if (c in a && a[c] === b) return c;
return -1;
}, v.lastIndexOf = function(a, b) {
if (a == null) return -1;
if (s && a.lastIndexOf === s) return a.lastIndexOf(b);
for (var c = a.length; c--; ) if (c in a && a[c] === b) return c;
return -1;
}, v.range = function(a, b, c) {
arguments.length <= 1 && (b = a || 0, a = 0);
for (var c = arguments[2] || 1, d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d); e < d; ) f[e++] = a, a += c;
return f;
};
var y = function() {};
v.bind = function(a, b) {
var c, d;
if (a.bind === u && u) return u.apply(a, g.call(arguments, 1));
if (!v.isFunction(a)) throw new TypeError;
return d = g.call(arguments, 2), c = function() {
if (this instanceof c) {
y.prototype = a.prototype;
var e = new y, f = a.apply(e, d.concat(g.call(arguments)));
return Object(f) === f ? f : e;
}
return a.apply(b, d.concat(g.call(arguments)));
};
}, v.bindAll = function(a) {
var b = g.call(arguments, 1);
return b.length == 0 && (b = v.functions(a)), w(b, function(b) {
a[b] = v.bind(a[b], a);
}), a;
}, v.memoize = function(a, b) {
var c = {};
return b || (b = v.identity), function() {
var d = b.apply(this, arguments);
return v.has(c, d) ? c[d] : c[d] = a.apply(this, arguments);
};
}, v.delay = function(a, b) {
var c = g.call(arguments, 2);
return setTimeout(function() {
return a.apply(null, c);
}, b);
}, v.defer = function(a) {
return v.delay.apply(v, [ a, 1 ].concat(g.call(arguments, 1)));
}, v.throttle = function(a, b) {
var c, d, e, f, g, h, i = v.debounce(function() {
g = f = !1;
}, b);
return function() {
return c = this, d = arguments, e || (e = setTimeout(function() {
e = null, g && a.apply(c, d), i();
}, b)), f ? g = !0 : h = a.apply(c, d), i(), f = !0, h;
};
}, v.debounce = function(a, b, c) {
var d;
return function() {
var e = this, f = arguments;
c && !d && a.apply(e, f), clearTimeout(d), d = setTimeout(function() {
d = null, c || a.apply(e, f);
}, b);
};
}, v.once = function(a) {
var b = !1, c;
return function() {
return b ? c : (b = !0, c = a.apply(this, arguments));
};
}, v.wrap = function(a, b) {
return function() {
var c = [ a ].concat(g.call(arguments, 0));
return b.apply(this, c);
};
}, v.compose = function() {
var a = arguments;
return function() {
for (var b = arguments, c = a.length - 1; c >= 0; c--) b = [ a[c].apply(this, b) ];
return b[0];
};
}, v.after = function(a, b) {
return a <= 0 ? b() : function() {
if (--a < 1) return b.apply(this, arguments);
};
}, v.keys = t || function(a) {
if (a !== Object(a)) throw new TypeError("Invalid object");
var b = [], c;
for (c in a) v.has(a, c) && (b[b.length] = c);
return b;
}, v.values = function(a) {
return v.map(a, v.identity);
}, v.functions = v.methods = function(a) {
var b = [], c;
for (c in a) v.isFunction(a[c]) && b.push(c);
return b.sort();
}, v.extend = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] = b[c];
}), a;
}, v.pick = function(a) {
var b = {};
return w(v.flatten(g.call(arguments, 1)), function(c) {
c in a && (b[c] = a[c]);
}), b;
}, v.defaults = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] == null && (a[c] = b[c]);
}), a;
}, v.clone = function(a) {
return v.isObject(a) ? v.isArray(a) ? a.slice() : v.extend({}, a) : a;
}, v.tap = function(a, b) {
return b(a), a;
}, v.isEqual = function(b, c) {
return a(b, c, []);
}, v.isEmpty = function(a) {
if (a == null) return !0;
if (v.isArray(a) || v.isString(a)) return a.length === 0;
for (var b in a) if (v.has(a, b)) return !1;
return !0;
}, v.isElement = function(a) {
return !!a && a.nodeType == 1;
}, v.isArray = f || function(a) {
return i.call(a) == "[object Array]";
}, v.isObject = function(a) {
return a === Object(a);
}, v.isArguments = function(a) {
return i.call(a) == "[object Arguments]";
}, v.isArguments(arguments) || (v.isArguments = function(a) {
return !!a && !!v.has(a, "callee");
}), v.isFunction = function(a) {
return i.call(a) == "[object Function]";
}, v.isString = function(a) {
return i.call(a) == "[object String]";
}, v.isNumber = function(a) {
return i.call(a) == "[object Number]";
}, v.isFinite = function(a) {
return v.isNumber(a) && isFinite(a);
}, v.isNaN = function(a) {
return a !== a;
}, v.isBoolean = function(a) {
return a === !0 || a === !1 || i.call(a) == "[object Boolean]";
}, v.isDate = function(a) {
return i.call(a) == "[object Date]";
}, v.isRegExp = function(a) {
return i.call(a) == "[object RegExp]";
}, v.isNull = function(a) {
return a === null;
}, v.isUndefined = function(a) {
return a === void 0;
}, v.has = function(a, b) {
return j.call(a, b);
}, v.noConflict = function() {
return b._ = c, this;
}, v.identity = function(a) {
return a;
}, v.times = function(a, b, c) {
for (var d = 0; d < a; d++) b.call(c, d);
}, v.escape = function(a) {
return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}, v.result = function(a, b) {
if (a == null) return null;
var c = a[b];
return v.isFunction(c) ? c.call(a) : c;
}, v.mixin = function(a) {
w(v.functions(a), function(b) {
I(b, v[b] = a[b]);
});
};
var z = 0;
v.uniqueId = function(a) {
var b = z++;
return a ? a + b : b;
}, v.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var A = /.^/, B = {
"\\": "\\",
"'": "'",
r: "\r",
n: "\n",
t: "	",
u2028: "\u2028",
u2029: "\u2029"
}, C;
for (C in B) B[B[C]] = C;
var D = /\\|'|\r|\n|\t|\u2028|\u2029/g, E = /\\(\\|'|r|n|t|u2028|u2029)/g, F = function(a) {
return a.replace(E, function(a, b) {
return B[b];
});
};
v.template = function(a, b, c) {
c = v.defaults(c || {}, v.templateSettings), a = "__p+='" + a.replace(D, function(a) {
return "\\" + B[a];
}).replace(c.escape || A, function(a, b) {
return "'+\n_.escape(" + F(b) + ")+\n'";
}).replace(c.interpolate || A, function(a, b) {
return "'+\n(" + F(b) + ")+\n'";
}).replace(c.evaluate || A, function(a, b) {
return "';\n" + F(b) + "\n;__p+='";
}) + "';\n", c.variable || (a = "with(obj||{}){\n" + a + "}\n");
var a = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + a + "return __p;\n", d = new Function(c.variable || "obj", "_", a);
return b ? d(b, v) : (b = function(a) {
return d.call(this, a, v);
}, b.source = "function(" + (c.variable || "obj") + "){\n" + a + "}", b);
}, v.chain = function(a) {
return v(a).chain();
};
var G = function(a) {
this._wrapped = a;
};
v.prototype = G.prototype;
var H = function(a, b) {
return b ? v(a).chain() : a;
}, I = function(a, b) {
G.prototype[a] = function() {
var a = g.call(arguments);
return h.call(a, this._wrapped), H(b.apply(v, a), this._chain);
};
};
v.mixin(v), w("pop,push,reverse,shift,sort,splice,unshift".split(","), function(a) {
var b = e[a];
G.prototype[a] = function() {
var c = this._wrapped;
b.apply(c, arguments);
var d = c.length;
return (a == "shift" || a == "splice") && d === 0 && delete c[0], H(c, this._chain);
};
}), w([ "concat", "join", "slice" ], function(a) {
var b = e[a];
G.prototype[a] = function() {
return H(b.apply(this._wrapped, arguments), this._chain);
};
}), G.prototype.chain = function() {
return this._chain = !0, this;
}, G.prototype.value = function() {
return this._wrapped;
};
}).call(this);

// underscore-min.js

(function() {
function a(b, c, d) {
if (b === c) return 0 !== b || 1 / b == 1 / c;
if (null == b || null == c) return b === c;
b._chain && (b = b._wrapped), c._chain && (c = c._wrapped);
if (b.isEqual && v.isFunction(b.isEqual)) return b.isEqual(c);
if (c.isEqual && v.isFunction(c.isEqual)) return c.isEqual(b);
var e = i.call(b);
if (e != i.call(c)) return !1;
switch (e) {
case "[object String]":
return b == "" + c;
case "[object Number]":
return b != +b ? c != +c : 0 == b ? 1 / b == 1 / c : b == +c;
case "[object Date]":
case "[object Boolean]":
return +b == +c;
case "[object RegExp]":
return b.source == c.source && b.global == c.global && b.multiline == c.multiline && b.ignoreCase == c.ignoreCase;
}
if ("object" != typeof b || "object" != typeof c) return !1;
for (var f = d.length; f--; ) if (d[f] == b) return !0;
d.push(b);
var f = 0, g = !0;
if ("[object Array]" == e) {
if (f = b.length, g = f == c.length) for (; f-- && (g = f in b == f in c && a(b[f], c[f], d)); ) ;
} else {
if ("constructor" in b != "constructor" in c || b.constructor != c.constructor) return !1;
for (var h in b) if (v.has(b, h) && (f++, !(g = v.has(c, h) && a(b[h], c[h], d)))) break;
if (g) {
for (h in c) if (v.has(c, h) && !(f--)) break;
g = !f;
}
}
return d.pop(), g;
}
var b = this, c = b._, d = {}, e = Array.prototype, f = Object.prototype, g = e.slice, h = e.unshift, i = f.toString, j = f.hasOwnProperty, k = e.forEach, l = e.map, m = e.reduce, n = e.reduceRight, o = e.filter, p = e.every, q = e.some, r = e.indexOf, s = e.lastIndexOf, f = Array.isArray, t = Object.keys, u = Function.prototype.bind, v = function(a) {
return new G(a);
};
"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = v), exports._ = v) : b._ = v, v.VERSION = "1.3.3";
var w = v.each = v.forEach = function(a, b, c) {
if (a != null) if (k && a.forEach === k) a.forEach(b, c); else if (a.length === +a.length) {
for (var e = 0, f = a.length; e < f; e++) if (e in a && b.call(c, a[e], e, a) === d) break;
} else for (e in a) if (v.has(a, e) && b.call(c, a[e], e, a) === d) break;
};
v.map = v.collect = function(a, b, c) {
var d = [];
return a == null ? d : l && a.map === l ? a.map(b, c) : (w(a, function(a, e, f) {
d[d.length] = b.call(c, a, e, f);
}), a.length === +a.length && (d.length = a.length), d);
}, v.reduce = v.foldl = v.inject = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (m && a.reduce === m) return d && (b = v.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
w(a, function(a, f, g) {
e ? c = b.call(d, c, a, f, g) : (c = a, e = !0);
});
if (!e) throw new TypeError("Reduce of empty array with no initial value");
return c;
}, v.reduceRight = v.foldr = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (n && a.reduceRight === n) return d && (b = v.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
var f = v.toArray(a).reverse();
return d && !e && (b = v.bind(b, d)), e ? v.reduce(f, b, c, d) : v.reduce(f, b);
}, v.find = v.detect = function(a, b, c) {
var d;
return x(a, function(a, e, f) {
if (b.call(c, a, e, f)) return d = a, !0;
}), d;
}, v.filter = v.select = function(a, b, c) {
var d = [];
return a == null ? d : o && a.filter === o ? a.filter(b, c) : (w(a, function(a, e, f) {
b.call(c, a, e, f) && (d[d.length] = a);
}), d);
}, v.reject = function(a, b, c) {
var d = [];
return a == null ? d : (w(a, function(a, e, f) {
b.call(c, a, e, f) || (d[d.length] = a);
}), d);
}, v.every = v.all = function(a, b, c) {
var e = !0;
return a == null ? e : p && a.every === p ? a.every(b, c) : (w(a, function(a, f, g) {
if (!(e = e && b.call(c, a, f, g))) return d;
}), !!e);
};
var x = v.some = v.any = function(a, b, c) {
b || (b = v.identity);
var e = !1;
return a == null ? e : q && a.some === q ? a.some(b, c) : (w(a, function(a, f, g) {
if (e || (e = b.call(c, a, f, g))) return d;
}), !!e);
};
v.include = v.contains = function(a, b) {
var c = !1;
return a == null ? c : r && a.indexOf === r ? a.indexOf(b) != -1 : c = x(a, function(a) {
return a === b;
});
}, v.invoke = function(a, b) {
var c = g.call(arguments, 2);
return v.map(a, function(a) {
return (v.isFunction(b) ? b || a : a[b]).apply(a, c);
});
}, v.pluck = function(a, b) {
return v.map(a, function(a) {
return a[b];
});
}, v.max = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.max.apply(Math, a);
if (!b && v.isEmpty(a)) return -Infinity;
var d = {
computed: -Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e >= d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.min = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.min.apply(Math, a);
if (!b && v.isEmpty(a)) return Infinity;
var d = {
computed: Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e < d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.shuffle = function(a) {
var b = [], c;
return w(a, function(a, d) {
c = Math.floor(Math.random() * (d + 1)), b[d] = b[c], b[c] = a;
}), b;
}, v.sortBy = function(a, b, c) {
var d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return v.pluck(v.map(a, function(a, b, e) {
return {
value: a,
criteria: d.call(c, a, b, e)
};
}).sort(function(a, b) {
var c = a.criteria, d = b.criteria;
return c === void 0 ? 1 : d === void 0 ? -1 : c < d ? -1 : c > d ? 1 : 0;
}), "value");
}, v.groupBy = function(a, b) {
var c = {}, d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return w(a, function(a, b) {
var e = d(a, b);
(c[e] || (c[e] = [])).push(a);
}), c;
}, v.sortedIndex = function(a, b, c) {
c || (c = v.identity);
for (var d = 0, e = a.length; d < e; ) {
var f = d + e >> 1;
c(a[f]) < c(b) ? d = f + 1 : e = f;
}
return d;
}, v.toArray = function(a) {
return a ? v.isArray(a) || v.isArguments(a) ? g.call(a) : a.toArray && v.isFunction(a.toArray) ? a.toArray() : v.values(a) : [];
}, v.size = function(a) {
return v.isArray(a) ? a.length : v.keys(a).length;
}, v.first = v.head = v.take = function(a, b, c) {
return b != null && !c ? g.call(a, 0, b) : a[0];
}, v.initial = function(a, b, c) {
return g.call(a, 0, a.length - (b == null || c ? 1 : b));
}, v.last = function(a, b, c) {
return b != null && !c ? g.call(a, Math.max(a.length - b, 0)) : a[a.length - 1];
}, v.rest = v.tail = function(a, b, c) {
return g.call(a, b == null || c ? 1 : b);
}, v.compact = function(a) {
return v.filter(a, function(a) {
return !!a;
});
}, v.flatten = function(a, b) {
return v.reduce(a, function(a, c) {
return v.isArray(c) ? a.concat(b ? c : v.flatten(c)) : (a[a.length] = c, a);
}, []);
}, v.without = function(a) {
return v.difference(a, g.call(arguments, 1));
}, v.uniq = v.unique = function(a, b, c) {
var c = c ? v.map(a, c) : a, d = [];
return a.length < 3 && (b = !0), v.reduce(c, function(c, e, f) {
if (b ? v.last(c) !== e || !c.length : !v.include(c, e)) c.push(e), d.push(a[f]);
return c;
}, []), d;
}, v.union = function() {
return v.uniq(v.flatten(arguments, !0));
}, v.intersection = v.intersect = function(a) {
var b = g.call(arguments, 1);
return v.filter(v.uniq(a), function(a) {
return v.every(b, function(b) {
return v.indexOf(b, a) >= 0;
});
});
}, v.difference = function(a) {
var b = v.flatten(g.call(arguments, 1), !0);
return v.filter(a, function(a) {
return !v.include(b, a);
});
}, v.zip = function() {
for (var a = g.call(arguments), b = v.max(v.pluck(a, "length")), c = Array(b), d = 0; d < b; d++) c[d] = v.pluck(a, "" + d);
return c;
}, v.indexOf = function(a, b, c) {
if (a == null) return -1;
var d;
if (c) return c = v.sortedIndex(a, b), a[c] === b ? c : -1;
if (r && a.indexOf === r) return a.indexOf(b);
c = 0;
for (d = a.length; c < d; c++) if (c in a && a[c] === b) return c;
return -1;
}, v.lastIndexOf = function(a, b) {
if (a == null) return -1;
if (s && a.lastIndexOf === s) return a.lastIndexOf(b);
for (var c = a.length; c--; ) if (c in a && a[c] === b) return c;
return -1;
}, v.range = function(a, b, c) {
arguments.length <= 1 && (b = a || 0, a = 0);
for (var c = arguments[2] || 1, d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d); e < d; ) f[e++] = a, a += c;
return f;
};
var y = function() {};
v.bind = function(a, b) {
var c, d;
if (a.bind === u && u) return u.apply(a, g.call(arguments, 1));
if (!v.isFunction(a)) throw new TypeError;
return d = g.call(arguments, 2), c = function() {
if (this instanceof c) {
y.prototype = a.prototype;
var e = new y, f = a.apply(e, d.concat(g.call(arguments)));
return Object(f) === f ? f : e;
}
return a.apply(b, d.concat(g.call(arguments)));
};
}, v.bindAll = function(a) {
var b = g.call(arguments, 1);
return b.length == 0 && (b = v.functions(a)), w(b, function(b) {
a[b] = v.bind(a[b], a);
}), a;
}, v.memoize = function(a, b) {
var c = {};
return b || (b = v.identity), function() {
var d = b.apply(this, arguments);
return v.has(c, d) ? c[d] : c[d] = a.apply(this, arguments);
};
}, v.delay = function(a, b) {
var c = g.call(arguments, 2);
return setTimeout(function() {
return a.apply(null, c);
}, b);
}, v.defer = function(a) {
return v.delay.apply(v, [ a, 1 ].concat(g.call(arguments, 1)));
}, v.throttle = function(a, b) {
var c, d, e, f, g, h, i = v.debounce(function() {
g = f = !1;
}, b);
return function() {
return c = this, d = arguments, e || (e = setTimeout(function() {
e = null, g && a.apply(c, d), i();
}, b)), f ? g = !0 : h = a.apply(c, d), i(), f = !0, h;
};
}, v.debounce = function(a, b, c) {
var d;
return function() {
var e = this, f = arguments;
c && !d && a.apply(e, f), clearTimeout(d), d = setTimeout(function() {
d = null, c || a.apply(e, f);
}, b);
};
}, v.once = function(a) {
var b = !1, c;
return function() {
return b ? c : (b = !0, c = a.apply(this, arguments));
};
}, v.wrap = function(a, b) {
return function() {
var c = [ a ].concat(g.call(arguments, 0));
return b.apply(this, c);
};
}, v.compose = function() {
var a = arguments;
return function() {
for (var b = arguments, c = a.length - 1; c >= 0; c--) b = [ a[c].apply(this, b) ];
return b[0];
};
}, v.after = function(a, b) {
return a <= 0 ? b() : function() {
if (--a < 1) return b.apply(this, arguments);
};
}, v.keys = t || function(a) {
if (a !== Object(a)) throw new TypeError("Invalid object");
var b = [], c;
for (c in a) v.has(a, c) && (b[b.length] = c);
return b;
}, v.values = function(a) {
return v.map(a, v.identity);
}, v.functions = v.methods = function(a) {
var b = [], c;
for (c in a) v.isFunction(a[c]) && b.push(c);
return b.sort();
}, v.extend = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] = b[c];
}), a;
}, v.pick = function(a) {
var b = {};
return w(v.flatten(g.call(arguments, 1)), function(c) {
c in a && (b[c] = a[c]);
}), b;
}, v.defaults = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] == null && (a[c] = b[c]);
}), a;
}, v.clone = function(a) {
return v.isObject(a) ? v.isArray(a) ? a.slice() : v.extend({}, a) : a;
}, v.tap = function(a, b) {
return b(a), a;
}, v.isEqual = function(b, c) {
return a(b, c, []);
}, v.isEmpty = function(a) {
if (a == null) return !0;
if (v.isArray(a) || v.isString(a)) return a.length === 0;
for (var b in a) if (v.has(a, b)) return !1;
return !0;
}, v.isElement = function(a) {
return !!a && a.nodeType == 1;
}, v.isArray = f || function(a) {
return i.call(a) == "[object Array]";
}, v.isObject = function(a) {
return a === Object(a);
}, v.isArguments = function(a) {
return i.call(a) == "[object Arguments]";
}, v.isArguments(arguments) || (v.isArguments = function(a) {
return !!a && !!v.has(a, "callee");
}), v.isFunction = function(a) {
return i.call(a) == "[object Function]";
}, v.isString = function(a) {
return i.call(a) == "[object String]";
}, v.isNumber = function(a) {
return i.call(a) == "[object Number]";
}, v.isFinite = function(a) {
return v.isNumber(a) && isFinite(a);
}, v.isNaN = function(a) {
return a !== a;
}, v.isBoolean = function(a) {
return a === !0 || a === !1 || i.call(a) == "[object Boolean]";
}, v.isDate = function(a) {
return i.call(a) == "[object Date]";
}, v.isRegExp = function(a) {
return i.call(a) == "[object RegExp]";
}, v.isNull = function(a) {
return a === null;
}, v.isUndefined = function(a) {
return a === void 0;
}, v.has = function(a, b) {
return j.call(a, b);
}, v.noConflict = function() {
return b._ = c, this;
}, v.identity = function(a) {
return a;
}, v.times = function(a, b, c) {
for (var d = 0; d < a; d++) b.call(c, d);
}, v.escape = function(a) {
return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}, v.result = function(a, b) {
if (a == null) return null;
var c = a[b];
return v.isFunction(c) ? c.call(a) : c;
}, v.mixin = function(a) {
w(v.functions(a), function(b) {
I(b, v[b] = a[b]);
});
};
var z = 0;
v.uniqueId = function(a) {
var b = z++;
return a ? a + b : b;
}, v.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var A = /.^/, B = {
"\\": "\\",
"'": "'",
r: "\r",
n: "\n",
t: "	",
u2028: "\u2028",
u2029: "\u2029"
}, C;
for (C in B) B[B[C]] = C;
var D = /\\|'|\r|\n|\t|\u2028|\u2029/g, E = /\\(\\|'|r|n|t|u2028|u2029)/g, F = function(a) {
return a.replace(E, function(a, b) {
return B[b];
});
};
v.template = function(a, b, c) {
c = v.defaults(c || {}, v.templateSettings), a = "__p+='" + a.replace(D, function(a) {
return "\\" + B[a];
}).replace(c.escape || A, function(a, b) {
return "'+\n_.escape(" + F(b) + ")+\n'";
}).replace(c.interpolate || A, function(a, b) {
return "'+\n(" + F(b) + ")+\n'";
}).replace(c.evaluate || A, function(a, b) {
return "';\n" + F(b) + "\n;__p+='";
}) + "';\n", c.variable || (a = "with(obj||{}){\n" + a + "}\n");
var a = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + a + "return __p;\n", d = new Function(c.variable || "obj", "_", a);
return b ? d(b, v) : (b = function(a) {
return d.call(this, a, v);
}, b.source = "function(" + (c.variable || "obj") + "){\n" + a + "}", b);
}, v.chain = function(a) {
return v(a).chain();
};
var G = function(a) {
this._wrapped = a;
};
v.prototype = G.prototype;
var H = function(a, b) {
return b ? v(a).chain() : a;
}, I = function(a, b) {
G.prototype[a] = function() {
var a = g.call(arguments);
return h.call(a, this._wrapped), H(b.apply(v, a), this._chain);
};
};
v.mixin(v), w("pop,push,reverse,shift,sort,splice,unshift".split(","), function(a) {
var b = e[a];
G.prototype[a] = function() {
var c = this._wrapped;
b.apply(c, arguments);
var d = c.length;
return (a == "shift" || a == "splice") && d === 0 && delete c[0], H(c, this._chain);
};
}), w([ "concat", "join", "slice" ], function(a) {
var b = e[a];
G.prototype[a] = function() {
return H(b.apply(this._wrapped, arguments), this._chain);
};
}), G.prototype.chain = function() {
return this._chain = !0, this;
}, G.prototype.value = function() {
return this._wrapped;
};
}).call(this);

// backbone.js

(function() {
var a = this, b = a.Backbone, c = Array.prototype.splice, d;
typeof exports != "undefined" ? d = exports : d = a.Backbone = {}, d.VERSION = "0.9.2";
var e = a._;
!e && typeof require != "undefined" && (e = require("underscore")), d.$ = a.jQuery || a.Zepto || a.ender, d.noConflict = function() {
return a.Backbone = b, this;
}, d.emulateHTTP = !1, d.emulateJSON = !1;
var f = /\s+/, g = d.Events = {
on: function(a, b, c) {
var d, e, g;
if (!b) return this;
a = a.split(f), d = this._callbacks || (this._callbacks = {});
while (e = a.shift()) g = d[e] || (d[e] = []), g.push(b, c);
return this;
},
off: function(a, b, c) {
var d, g, h, i;
if (!(g = this._callbacks)) return this;
if (!(a || b || c)) return delete this._callbacks, this;
a = a ? a.split(f) : e.keys(g);
while (d = a.shift()) {
if (!(h = g[d]) || !b && !c) {
delete g[d];
continue;
}
for (i = h.length - 2; i >= 0; i -= 2) b && h[i] !== b || c && h[i + 1] !== c || h.splice(i, 2);
}
return this;
},
trigger: function(a) {
var b, c, d, e, g, h, i, j;
if (!(c = this._callbacks)) return this;
j = [], a = a.split(f);
for (e = 1, g = arguments.length; e < g; e++) j[e - 1] = arguments[e];
while (b = a.shift()) {
if (i = c.all) i = i.slice();
if (d = c[b]) d = d.slice();
if (d) for (e = 0, g = d.length; e < g; e += 2) d[e].apply(d[e + 1] || this, j);
if (i) {
h = [ b ].concat(j);
for (e = 0, g = i.length; e < g; e += 2) i[e].apply(i[e + 1] || this, h);
}
}
return this;
}
};
g.bind = g.on, g.unbind = g.off;
var h = d.Model = function(a, b) {
var c;
a || (a = {}), b && b.collection && (this.collection = b.collection), b && b.parse && (a = this.parse(a));
if (c = z(this, "defaults")) a = e.extend({}, c, a);
this.attributes = {}, this._escapedAttributes = {}, this.cid = e.uniqueId("c"), this.changed = {}, this._silent = {}, this._pending = {}, this.set(a, {
silent: !0
}), this.changed = {}, this._silent = {}, this._pending = {}, this._previousAttributes = e.clone(this.attributes), this.initialize.apply(this, arguments);
};
e.extend(h.prototype, g, {
changed: null,
_silent: null,
_pending: null,
idAttribute: "id",
initialize: function() {},
toJSON: function(a) {
return e.clone(this.attributes);
},
sync: function() {
return d.sync.apply(this, arguments);
},
get: function(a) {
return this.attributes[a];
},
escape: function(a) {
var b;
if (b = this._escapedAttributes[a]) return b;
var c = this.get(a);
return this._escapedAttributes[a] = e.escape(c == null ? "" : "" + c);
},
has: function(a) {
return this.get(a) != null;
},
set: function(a, b, c) {
var d, f, g;
e.isObject(a) || a == null ? (d = a, c = b) : (d = {}, d[a] = b), c || (c = {});
if (!d) return this;
d instanceof h && (d = d.attributes);
if (c.unset) for (f in d) d[f] = void 0;
if (!this._validate(d, c)) return !1;
this.idAttribute in d && (this.id = d[this.idAttribute]);
var i = c.changes = {}, j = this.attributes, k = this._escapedAttributes, l = this._previousAttributes || {};
for (f in d) {
g = d[f];
if (!e.isEqual(j[f], g) || c.unset && e.has(j, f)) delete k[f], (c.silent ? this._silent : i)[f] = !0;
c.unset ? delete j[f] : j[f] = g, !e.isEqual(l[f], g) || e.has(j, f) !== e.has(l, f) ? (this.changed[f] = g, c.silent || (this._pending[f] = !0)) : (delete this.changed[f], delete this._pending[f]);
}
return c.silent || this.change(c), this;
},
unset: function(a, b) {
return b = e.extend({}, b, {
unset: !0
}), this.set(a, null, b);
},
clear: function(a) {
return a = e.extend({}, a, {
unset: !0
}), this.set(e.clone(this.attributes), a);
},
fetch: function(a) {
a = a ? e.clone(a) : {};
var b = this, c = a.success;
return a.success = function(d, e, f) {
if (!b.set(b.parse(d, f), a)) return !1;
c && c(b, d, a), b.trigger("sync", b, d, a);
}, a.error = d.wrapError(a.error, b, a), this.sync("read", this, a);
},
save: function(a, b, c) {
var f, g, h;
e.isObject(a) || a == null ? (f = a, c = b) : (f = {}, f[a] = b), c = c ? e.clone(c) : {};
if (c.wait) {
if (!this._validate(f, c)) return !1;
g = e.clone(this.attributes);
}
var i = e.extend({}, c, {
silent: !0
});
if (f && !this.set(f, c.wait ? i : c)) return !1;
if (!f && !this.isValid()) return !1;
var j = this, k = c.success;
c.success = function(a, b, d) {
h = !0;
var g = j.parse(a, d);
c.wait && (g = e.extend(f || {}, g));
if (!j.set(g, c)) return !1;
k && k(j, a, c), j.trigger("sync", j, a, c);
}, c.error = d.wrapError(c.error, j, c);
var l = this.sync(this.isNew() ? "create" : "update", this, c);
return !h && c.wait && (this.clear(i), this.set(g, i)), l;
},
destroy: function(a) {
a = a ? e.clone(a) : {};
var b = this, c = a.success, f = function() {
b.trigger("destroy", b, b.collection, a);
};
a.success = function(d) {
(a.wait || b.isNew()) && f(), c && c(b, d, a), b.isNew() || b.trigger("sync", b, d, a);
};
if (this.isNew()) return a.success(), !1;
a.error = d.wrapError(a.error, b, a);
var g = this.sync("delete", this, a);
return a.wait || f(), g;
},
url: function() {
var a = z(this, "urlRoot") || z(this.collection, "url") || A();
return this.isNew() ? a : a + (a.charAt(a.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id);
},
parse: function(a, b) {
return a;
},
clone: function() {
return new this.constructor(this.attributes);
},
isNew: function() {
return this.id == null;
},
change: function(a) {
a || (a = {});
var b = this._changing;
this._changing = !0;
for (var c in this._silent) this._pending[c] = !0;
var d = e.extend({}, a.changes, this._silent);
this._silent = {};
for (var c in d) this.trigger("change:" + c, this, this.get(c), a);
if (b) return this;
while (!e.isEmpty(this._pending)) {
this._pending = {}, this.trigger("change", this, a);
for (var c in this.changed) {
if (this._pending[c] || this._silent[c]) continue;
delete this.changed[c];
}
this._previousAttributes = e.clone(this.attributes);
}
return this._changing = !1, this;
},
hasChanged: function(a) {
return a == null ? !e.isEmpty(this.changed) : e.has(this.changed, a);
},
changedAttributes: function(a) {
if (!a) return this.hasChanged() ? e.clone(this.changed) : !1;
var b, c = !1, d = this._previousAttributes;
for (var f in a) {
if (e.isEqual(d[f], b = a[f])) continue;
(c || (c = {}))[f] = b;
}
return c;
},
previous: function(a) {
return a == null || !this._previousAttributes ? null : this._previousAttributes[a];
},
previousAttributes: function() {
return e.clone(this._previousAttributes);
},
isValid: function() {
return !this.validate || !this.validate(this.attributes);
},
_validate: function(a, b) {
if (b.silent || !this.validate) return !0;
a = e.extend({}, this.attributes, a);
var c = this.validate(a, b);
return c ? (b && b.error ? b.error(this, c, b) : this.trigger("error", this, c, b), !1) : !0;
}
});
var i = d.Collection = function(a, b) {
b || (b = {}), b.model && (this.model = b.model), b.comparator !== void 0 && (this.comparator = b.comparator), this._reset(), this.initialize.apply(this, arguments), a && this.reset(a, {
silent: !0,
parse: b.parse
});
};
e.extend(i.prototype, g, {
model: h,
initialize: function() {},
toJSON: function(a) {
return this.map(function(b) {
return b.toJSON(a);
});
},
sync: function() {
return d.sync.apply(this, arguments);
},
add: function(a, b) {
var d, f, g, h, i, j, k = {}, l = {}, m = [];
b || (b = {}), a = e.isArray(a) ? a.slice() : [ a ];
for (d = 0, g = a.length; d < g; d++) {
if (!(h = a[d] = this._prepareModel(a[d], b))) throw new Error("Can't add an invalid model to a collection");
i = h.cid, j = h.id;
if (k[i] || this._byCid[i] || j != null && (l[j] || this._byId[j])) {
m.push(d);
continue;
}
k[i] = l[j] = h;
}
d = m.length;
while (d--) m[d] = a.splice(m[d], 1)[0];
for (d = 0, g = a.length; d < g; d++) (h = a[d]).on("all", this._onModelEvent, this), this._byCid[h.cid] = h, h.id != null && (this._byId[h.id] = h);
this.length += g, f = b.at != null ? b.at : this.models.length, c.apply(this.models, [ f, 0 ].concat(a));
if (b.merge) for (d = 0, g = m.length; d < g; d++) (h = this._byId[m[d].id]) && h.set(m[d], b);
this.comparator && b.at == null && this.sort({
silent: !0
});
if (b.silent) return this;
for (d = 0, g = this.models.length; d < g; d++) {
if (!k[(h = this.models[d]).cid]) continue;
b.index = d, h.trigger("add", h, this, b);
}
return this;
},
remove: function(a, b) {
var c, d, f, g;
b || (b = {}), a = e.isArray(a) ? a.slice() : [ a ];
for (c = 0, d = a.length; c < d; c++) {
g = this.getByCid(a[c]) || this.get(a[c]);
if (!g) continue;
delete this._byId[g.id], delete this._byCid[g.cid], f = this.indexOf(g), this.models.splice(f, 1), this.length--, b.silent || (b.index = f, g.trigger("remove", g, this, b)), this._removeReference(g);
}
return this;
},
push: function(a, b) {
return a = this._prepareModel(a, b), this.add(a, b), a;
},
pop: function(a) {
var b = this.at(this.length - 1);
return this.remove(b, a), b;
},
unshift: function(a, b) {
return a = this._prepareModel(a, b), this.add(a, e.extend({
at: 0
}, b)), a;
},
shift: function(a) {
var b = this.at(0);
return this.remove(b, a), b;
},
slice: function(a, b) {
return this.models.slice(a, b);
},
get: function(a) {
return a == null ? void 0 : this._byId[a.id != null ? a.id : a];
},
getByCid: function(a) {
return a && this._byCid[a.cid || a];
},
at: function(a) {
return this.models[a];
},
where: function(a) {
return e.isEmpty(a) ? [] : this.filter(function(b) {
for (var c in a) if (a[c] !== b.get(c)) return !1;
return !0;
});
},
sort: function(a) {
a || (a = {});
if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
var b = e.bind(this.comparator, this);
return this.comparator.length === 1 ? this.models = this.sortBy(b) : this.models.sort(b), a.silent || this.trigger("reset", this, a), this;
},
pluck: function(a) {
return e.map(this.models, function(b) {
return b.get(a);
});
},
reset: function(a, b) {
a || (a = []), b || (b = {});
for (var c = 0, d = this.models.length; c < d; c++) this._removeReference(this.models[c]);
return this._reset(), this.add(a, e.extend({
silent: !0
}, b)), b.silent || this.trigger("reset", this, b), this;
},
fetch: function(a) {
a = a ? e.clone(a) : {}, a.parse === void 0 && (a.parse = !0);
var b = this, c = a.success;
return a.success = function(d, e, f) {
b[a.add ? "add" : "reset"](b.parse(d, f), a), c && c(b, d, a), b.trigger("sync", b, d, a);
}, a.error = d.wrapError(a.error, b, a), this.sync("read", this, a);
},
create: function(a, b) {
var c = this;
b = b ? e.clone(b) : {}, a = this._prepareModel(a, b);
if (!a) return !1;
b.wait || c.add(a, b);
var d = b.success;
return b.success = function(a, b, e) {
e.wait && c.add(a, e), d && d(a, b, e);
}, a.save(null, b), a;
},
parse: function(a, b) {
return a;
},
clone: function() {
return new this.constructor(this.models);
},
chain: function() {
return e(this.models).chain();
},
_reset: function(a) {
this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
},
_prepareModel: function(a, b) {
if (a instanceof h) return a.collection || (a.collection = this), a;
b || (b = {}), b.collection = this;
var c = new this.model(a, b);
return c._validate(c.attributes, b) ? c : !1;
},
_removeReference: function(a) {
this === a.collection && delete a.collection, a.off("all", this._onModelEvent, this);
},
_onModelEvent: function(a, b, c, d) {
if ((a === "add" || a === "remove") && c !== this) return;
a === "destroy" && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], b.id != null && (this._byId[b.id] = b)), this.trigger.apply(this, arguments);
}
});
var j = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
e.each(j, function(a) {
i.prototype[a] = function() {
return e[a].apply(e, [ this.models ].concat(e.toArray(arguments)));
};
});
var k = d.Router = function(a) {
a || (a = {}), a.routes && (this.routes = a.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
}, l = /:\w+/g, m = /\*\w+/g, n = /[-[\]{}()+?.,\\^$|#\s]/g;
e.extend(k.prototype, g, {
initialize: function() {},
route: function(a, b, c) {
return d.history || (d.history = new o), e.isRegExp(a) || (a = this._routeToRegExp(a)), c || (c = this[b]), d.history.route(a, e.bind(function(e) {
var f = this._extractParameters(a, e);
c && c.apply(this, f), this.trigger.apply(this, [ "route:" + b ].concat(f)), d.history.trigger("route", this, b, f);
}, this)), this;
},
navigate: function(a, b) {
d.history.navigate(a, b);
},
_bindRoutes: function() {
if (!this.routes) return;
var a = [];
for (var b in this.routes) a.unshift([ b, this.routes[b] ]);
for (var c = 0, d = a.length; c < d; c++) this.route(a[c][0], a[c][1], this[a[c][1]]);
},
_routeToRegExp: function(a) {
return a = a.replace(n, "\\$&").replace(l, "([^/]+)").replace(m, "(.*?)"), new RegExp("^" + a + "$");
},
_extractParameters: function(a, b) {
return a.exec(b).slice(1);
}
});
var o = d.History = function(b) {
this.handlers = [], e.bindAll(this, "checkUrl"), this.location = b && b.location || a.location, this.history = b && b.history || a.history;
}, p = /^[#\/]/, q = /msie [\w.]+/, r = /\/$/;
o.started = !1, e.extend(o.prototype, g, {
interval: 50,
getHash: function(a) {
var b = (a || this).location.href.match(/#(.*)$/);
return b ? b[1] : "";
},
getFragment: function(a, b) {
if (a == null) if (this._hasPushState || !this._wantsHashChange || b) {
a = this.location.pathname;
var c = this.options.root.replace(r, "");
a.indexOf(c) || (a = a.substr(c.length));
} else a = this.getHash();
return decodeURIComponent(a.replace(p, ""));
},
start: function(a) {
if (o.started) throw new Error("Backbone.history has already been started");
o.started = !0, this.options = e.extend({}, {
root: "/"
}, this.options, a), this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
var b = this.getFragment(), c = document.documentMode, f = q.exec(navigator.userAgent.toLowerCase()) && (!c || c <= 7);
r.test(this.options.root) || (this.options.root += "/"), f && this._wantsHashChange && (this.iframe = d.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(b)), this._hasPushState ? d.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !f ? d.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = b;
var g = this.location, h = g.pathname.replace(/[^/]$/, "$&/") === this.options.root && !g.search;
if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !h) return this.fragment = this.getFragment(null, !0), this.location.replace(this.options.root + this.location.search + "#" + this.fragment), !0;
this._wantsPushState && this._hasPushState && h && g.hash && (this.fragment = this.getHash().replace(p, ""), this.history.replaceState({}, document.title, g.protocol + "//" + g.host + this.options.root + this.fragment));
if (!this.options.silent) return this.loadUrl();
},
stop: function() {
d.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), o.started = !1;
},
route: function(a, b) {
this.handlers.unshift({
route: a,
callback: b
});
},
checkUrl: function(a) {
var b = this.getFragment();
b === this.fragment && this.iframe && (b = this.getFragment(this.getHash(this.iframe)));
if (b === this.fragment) return !1;
this.iframe && this.navigate(b), this.loadUrl() || this.loadUrl(this.getHash());
},
loadUrl: function(a) {
var b = this.fragment = this.getFragment(a), c = e.any(this.handlers, function(a) {
if (a.route.test(b)) return a.callback(b), !0;
});
return c;
},
navigate: function(a, b) {
if (!o.started) return !1;
if (!b || b === !0) b = {
trigger: b
};
var c = (a || "").replace(p, "");
if (this.fragment === c) return;
this.fragment = c;
var d = (c.indexOf(this.options.root) !== 0 ? this.options.root : "") + c;
if (this._hasPushState) this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, d); else {
if (!this._wantsHashChange) return this.location.assign(d);
this._updateHash(this.location, c, b.replace), this.iframe && c !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, c, b.replace));
}
b.trigger && this.loadUrl(a);
},
_updateHash: function(a, b, c) {
c ? a.replace(a.href.replace(/(javascript:|#).*$/, "") + "#" + b) : a.hash = b;
}
});
var s = d.View = function(a) {
this.cid = e.uniqueId("view"), this._configure(a || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
}, t = /^(\S+)\s*(.*)$/, u = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
e.extend(s.prototype, g, {
tagName: "div",
$: function(a) {
return this.$el.find(a);
},
initialize: function() {},
render: function() {
return this;
},
remove: function() {
return this.$el.remove(), this;
},
make: function(a, b, c) {
var e = document.createElement(a);
return b && d.$(e).attr(b), c != null && d.$(e).html(c), e;
},
setElement: function(a, b) {
return this.$el && this.undelegateEvents(), this.$el = a instanceof d.$ ? a : d.$(a), this.el = this.$el[0], b !== !1 && this.delegateEvents(), this;
},
delegateEvents: function(a) {
if (!a && !(a = z(this, "events"))) return;
this.undelegateEvents();
for (var b in a) {
var c = a[b];
e.isFunction(c) || (c = this[a[b]]);
if (!c) throw new Error('Method "' + a[b] + '" does not exist');
var d = b.match(t), f = d[1], g = d[2];
c = e.bind(c, this), f += ".delegateEvents" + this.cid, g === "" ? this.$el.bind(f, c) : this.$el.delegate(g, f, c);
}
},
undelegateEvents: function() {
this.$el.unbind(".delegateEvents" + this.cid);
},
_configure: function(a) {
this.options && (a = e.extend({}, this.options, a));
for (var b = 0, c = u.length; b < c; b++) {
var d = u[b];
a[d] && (this[d] = a[d]);
}
this.options = a;
},
_ensureElement: function() {
if (!this.el) {
var a = e.extend({}, z(this, "attributes"));
this.id && (a.id = this.id), this.className && (a["class"] = this.className), this.setElement(this.make(z(this, "tagName"), a), !1);
} else this.setElement(this.el, !1);
}
});
var v = function(a, b) {
return y(this, a, b);
};
h.extend = i.extend = k.extend = s.extend = v;
var w = {
create: "POST",
update: "PUT",
"delete": "DELETE",
read: "GET"
};
d.sync = function(a, b, c) {
var f = w[a];
c || (c = {});
var g = {
type: f,
dataType: "json"
};
return c.url || (g.url = z(b, "url") || A()), !c.data && b && (a === "create" || a === "update") && (g.contentType = "application/json", g.data = JSON.stringify(b)), d.emulateJSON && (g.contentType = "application/x-www-form-urlencoded", g.data = g.data ? {
model: g.data
} : {}), d.emulateHTTP && (f === "PUT" || f === "DELETE") && (d.emulateJSON && (g.data._method = f), g.type = "POST", g.beforeSend = function(a) {
a.setRequestHeader("X-HTTP-Method-Override", f);
}), g.type !== "GET" && !d.emulateJSON && (g.processData = !1), d.ajax(e.extend(g, c));
}, d.ajax = function() {
return d.$.ajax.apply(d.$, arguments);
}, d.wrapError = function(a, b, c) {
return function(d, e) {
e = d === b ? e : d, a ? a(b, e, c) : b.trigger("error", b, e, c);
};
};
var x = function() {}, y = function(a, b, c) {
var d;
return b && b.hasOwnProperty("constructor") ? d = b.constructor : d = function() {
a.apply(this, arguments);
}, e.extend(d, a), x.prototype = a.prototype, d.prototype = new x, b && e.extend(d.prototype, b), c && e.extend(d, c), d.prototype.constructor = d, d.__super__ = a.prototype, d;
}, z = function(a, b) {
return !a || !a[b] ? null : e.isFunction(a[b]) ? a[b]() : a[b];
}, A = function() {
throw new Error('A "url" property or function must be specified');
};
}).call(this);

// underscore-min.js

(function() {
function a(b, c, d) {
if (b === c) return 0 !== b || 1 / b == 1 / c;
if (null == b || null == c) return b === c;
b._chain && (b = b._wrapped), c._chain && (c = c._wrapped);
if (b.isEqual && v.isFunction(b.isEqual)) return b.isEqual(c);
if (c.isEqual && v.isFunction(c.isEqual)) return c.isEqual(b);
var e = i.call(b);
if (e != i.call(c)) return !1;
switch (e) {
case "[object String]":
return b == "" + c;
case "[object Number]":
return b != +b ? c != +c : 0 == b ? 1 / b == 1 / c : b == +c;
case "[object Date]":
case "[object Boolean]":
return +b == +c;
case "[object RegExp]":
return b.source == c.source && b.global == c.global && b.multiline == c.multiline && b.ignoreCase == c.ignoreCase;
}
if ("object" != typeof b || "object" != typeof c) return !1;
for (var f = d.length; f--; ) if (d[f] == b) return !0;
d.push(b);
var f = 0, g = !0;
if ("[object Array]" == e) {
if (f = b.length, g = f == c.length) for (; f-- && (g = f in b == f in c && a(b[f], c[f], d)); ) ;
} else {
if ("constructor" in b != "constructor" in c || b.constructor != c.constructor) return !1;
for (var h in b) if (v.has(b, h) && (f++, !(g = v.has(c, h) && a(b[h], c[h], d)))) break;
if (g) {
for (h in c) if (v.has(c, h) && !(f--)) break;
g = !f;
}
}
return d.pop(), g;
}
var b = this, c = b._, d = {}, e = Array.prototype, f = Object.prototype, g = e.slice, h = e.unshift, i = f.toString, j = f.hasOwnProperty, k = e.forEach, l = e.map, m = e.reduce, n = e.reduceRight, o = e.filter, p = e.every, q = e.some, r = e.indexOf, s = e.lastIndexOf, f = Array.isArray, t = Object.keys, u = Function.prototype.bind, v = function(a) {
return new G(a);
};
"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = v), exports._ = v) : b._ = v, v.VERSION = "1.3.3";
var w = v.each = v.forEach = function(a, b, c) {
if (a != null) if (k && a.forEach === k) a.forEach(b, c); else if (a.length === +a.length) {
for (var e = 0, f = a.length; e < f; e++) if (e in a && b.call(c, a[e], e, a) === d) break;
} else for (e in a) if (v.has(a, e) && b.call(c, a[e], e, a) === d) break;
};
v.map = v.collect = function(a, b, c) {
var d = [];
return a == null ? d : l && a.map === l ? a.map(b, c) : (w(a, function(a, e, f) {
d[d.length] = b.call(c, a, e, f);
}), a.length === +a.length && (d.length = a.length), d);
}, v.reduce = v.foldl = v.inject = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (m && a.reduce === m) return d && (b = v.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
w(a, function(a, f, g) {
e ? c = b.call(d, c, a, f, g) : (c = a, e = !0);
});
if (!e) throw new TypeError("Reduce of empty array with no initial value");
return c;
}, v.reduceRight = v.foldr = function(a, b, c, d) {
var e = arguments.length > 2;
a == null && (a = []);
if (n && a.reduceRight === n) return d && (b = v.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
var f = v.toArray(a).reverse();
return d && !e && (b = v.bind(b, d)), e ? v.reduce(f, b, c, d) : v.reduce(f, b);
}, v.find = v.detect = function(a, b, c) {
var d;
return x(a, function(a, e, f) {
if (b.call(c, a, e, f)) return d = a, !0;
}), d;
}, v.filter = v.select = function(a, b, c) {
var d = [];
return a == null ? d : o && a.filter === o ? a.filter(b, c) : (w(a, function(a, e, f) {
b.call(c, a, e, f) && (d[d.length] = a);
}), d);
}, v.reject = function(a, b, c) {
var d = [];
return a == null ? d : (w(a, function(a, e, f) {
b.call(c, a, e, f) || (d[d.length] = a);
}), d);
}, v.every = v.all = function(a, b, c) {
var e = !0;
return a == null ? e : p && a.every === p ? a.every(b, c) : (w(a, function(a, f, g) {
if (!(e = e && b.call(c, a, f, g))) return d;
}), !!e);
};
var x = v.some = v.any = function(a, b, c) {
b || (b = v.identity);
var e = !1;
return a == null ? e : q && a.some === q ? a.some(b, c) : (w(a, function(a, f, g) {
if (e || (e = b.call(c, a, f, g))) return d;
}), !!e);
};
v.include = v.contains = function(a, b) {
var c = !1;
return a == null ? c : r && a.indexOf === r ? a.indexOf(b) != -1 : c = x(a, function(a) {
return a === b;
});
}, v.invoke = function(a, b) {
var c = g.call(arguments, 2);
return v.map(a, function(a) {
return (v.isFunction(b) ? b || a : a[b]).apply(a, c);
});
}, v.pluck = function(a, b) {
return v.map(a, function(a) {
return a[b];
});
}, v.max = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.max.apply(Math, a);
if (!b && v.isEmpty(a)) return -Infinity;
var d = {
computed: -Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e >= d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.min = function(a, b, c) {
if (!b && v.isArray(a) && a[0] === +a[0]) return Math.min.apply(Math, a);
if (!b && v.isEmpty(a)) return Infinity;
var d = {
computed: Infinity
};
return w(a, function(a, e, f) {
e = b ? b.call(c, a, e, f) : a, e < d.computed && (d = {
value: a,
computed: e
});
}), d.value;
}, v.shuffle = function(a) {
var b = [], c;
return w(a, function(a, d) {
c = Math.floor(Math.random() * (d + 1)), b[d] = b[c], b[c] = a;
}), b;
}, v.sortBy = function(a, b, c) {
var d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return v.pluck(v.map(a, function(a, b, e) {
return {
value: a,
criteria: d.call(c, a, b, e)
};
}).sort(function(a, b) {
var c = a.criteria, d = b.criteria;
return c === void 0 ? 1 : d === void 0 ? -1 : c < d ? -1 : c > d ? 1 : 0;
}), "value");
}, v.groupBy = function(a, b) {
var c = {}, d = v.isFunction(b) ? b : function(a) {
return a[b];
};
return w(a, function(a, b) {
var e = d(a, b);
(c[e] || (c[e] = [])).push(a);
}), c;
}, v.sortedIndex = function(a, b, c) {
c || (c = v.identity);
for (var d = 0, e = a.length; d < e; ) {
var f = d + e >> 1;
c(a[f]) < c(b) ? d = f + 1 : e = f;
}
return d;
}, v.toArray = function(a) {
return a ? v.isArray(a) || v.isArguments(a) ? g.call(a) : a.toArray && v.isFunction(a.toArray) ? a.toArray() : v.values(a) : [];
}, v.size = function(a) {
return v.isArray(a) ? a.length : v.keys(a).length;
}, v.first = v.head = v.take = function(a, b, c) {
return b != null && !c ? g.call(a, 0, b) : a[0];
}, v.initial = function(a, b, c) {
return g.call(a, 0, a.length - (b == null || c ? 1 : b));
}, v.last = function(a, b, c) {
return b != null && !c ? g.call(a, Math.max(a.length - b, 0)) : a[a.length - 1];
}, v.rest = v.tail = function(a, b, c) {
return g.call(a, b == null || c ? 1 : b);
}, v.compact = function(a) {
return v.filter(a, function(a) {
return !!a;
});
}, v.flatten = function(a, b) {
return v.reduce(a, function(a, c) {
return v.isArray(c) ? a.concat(b ? c : v.flatten(c)) : (a[a.length] = c, a);
}, []);
}, v.without = function(a) {
return v.difference(a, g.call(arguments, 1));
}, v.uniq = v.unique = function(a, b, c) {
var c = c ? v.map(a, c) : a, d = [];
return a.length < 3 && (b = !0), v.reduce(c, function(c, e, f) {
if (b ? v.last(c) !== e || !c.length : !v.include(c, e)) c.push(e), d.push(a[f]);
return c;
}, []), d;
}, v.union = function() {
return v.uniq(v.flatten(arguments, !0));
}, v.intersection = v.intersect = function(a) {
var b = g.call(arguments, 1);
return v.filter(v.uniq(a), function(a) {
return v.every(b, function(b) {
return v.indexOf(b, a) >= 0;
});
});
}, v.difference = function(a) {
var b = v.flatten(g.call(arguments, 1), !0);
return v.filter(a, function(a) {
return !v.include(b, a);
});
}, v.zip = function() {
for (var a = g.call(arguments), b = v.max(v.pluck(a, "length")), c = Array(b), d = 0; d < b; d++) c[d] = v.pluck(a, "" + d);
return c;
}, v.indexOf = function(a, b, c) {
if (a == null) return -1;
var d;
if (c) return c = v.sortedIndex(a, b), a[c] === b ? c : -1;
if (r && a.indexOf === r) return a.indexOf(b);
c = 0;
for (d = a.length; c < d; c++) if (c in a && a[c] === b) return c;
return -1;
}, v.lastIndexOf = function(a, b) {
if (a == null) return -1;
if (s && a.lastIndexOf === s) return a.lastIndexOf(b);
for (var c = a.length; c--; ) if (c in a && a[c] === b) return c;
return -1;
}, v.range = function(a, b, c) {
arguments.length <= 1 && (b = a || 0, a = 0);
for (var c = arguments[2] || 1, d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d); e < d; ) f[e++] = a, a += c;
return f;
};
var y = function() {};
v.bind = function(a, b) {
var c, d;
if (a.bind === u && u) return u.apply(a, g.call(arguments, 1));
if (!v.isFunction(a)) throw new TypeError;
return d = g.call(arguments, 2), c = function() {
if (this instanceof c) {
y.prototype = a.prototype;
var e = new y, f = a.apply(e, d.concat(g.call(arguments)));
return Object(f) === f ? f : e;
}
return a.apply(b, d.concat(g.call(arguments)));
};
}, v.bindAll = function(a) {
var b = g.call(arguments, 1);
return b.length == 0 && (b = v.functions(a)), w(b, function(b) {
a[b] = v.bind(a[b], a);
}), a;
}, v.memoize = function(a, b) {
var c = {};
return b || (b = v.identity), function() {
var d = b.apply(this, arguments);
return v.has(c, d) ? c[d] : c[d] = a.apply(this, arguments);
};
}, v.delay = function(a, b) {
var c = g.call(arguments, 2);
return setTimeout(function() {
return a.apply(null, c);
}, b);
}, v.defer = function(a) {
return v.delay.apply(v, [ a, 1 ].concat(g.call(arguments, 1)));
}, v.throttle = function(a, b) {
var c, d, e, f, g, h, i = v.debounce(function() {
g = f = !1;
}, b);
return function() {
return c = this, d = arguments, e || (e = setTimeout(function() {
e = null, g && a.apply(c, d), i();
}, b)), f ? g = !0 : h = a.apply(c, d), i(), f = !0, h;
};
}, v.debounce = function(a, b, c) {
var d;
return function() {
var e = this, f = arguments;
c && !d && a.apply(e, f), clearTimeout(d), d = setTimeout(function() {
d = null, c || a.apply(e, f);
}, b);
};
}, v.once = function(a) {
var b = !1, c;
return function() {
return b ? c : (b = !0, c = a.apply(this, arguments));
};
}, v.wrap = function(a, b) {
return function() {
var c = [ a ].concat(g.call(arguments, 0));
return b.apply(this, c);
};
}, v.compose = function() {
var a = arguments;
return function() {
for (var b = arguments, c = a.length - 1; c >= 0; c--) b = [ a[c].apply(this, b) ];
return b[0];
};
}, v.after = function(a, b) {
return a <= 0 ? b() : function() {
if (--a < 1) return b.apply(this, arguments);
};
}, v.keys = t || function(a) {
if (a !== Object(a)) throw new TypeError("Invalid object");
var b = [], c;
for (c in a) v.has(a, c) && (b[b.length] = c);
return b;
}, v.values = function(a) {
return v.map(a, v.identity);
}, v.functions = v.methods = function(a) {
var b = [], c;
for (c in a) v.isFunction(a[c]) && b.push(c);
return b.sort();
}, v.extend = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] = b[c];
}), a;
}, v.pick = function(a) {
var b = {};
return w(v.flatten(g.call(arguments, 1)), function(c) {
c in a && (b[c] = a[c]);
}), b;
}, v.defaults = function(a) {
return w(g.call(arguments, 1), function(b) {
for (var c in b) a[c] == null && (a[c] = b[c]);
}), a;
}, v.clone = function(a) {
return v.isObject(a) ? v.isArray(a) ? a.slice() : v.extend({}, a) : a;
}, v.tap = function(a, b) {
return b(a), a;
}, v.isEqual = function(b, c) {
return a(b, c, []);
}, v.isEmpty = function(a) {
if (a == null) return !0;
if (v.isArray(a) || v.isString(a)) return a.length === 0;
for (var b in a) if (v.has(a, b)) return !1;
return !0;
}, v.isElement = function(a) {
return !!a && a.nodeType == 1;
}, v.isArray = f || function(a) {
return i.call(a) == "[object Array]";
}, v.isObject = function(a) {
return a === Object(a);
}, v.isArguments = function(a) {
return i.call(a) == "[object Arguments]";
}, v.isArguments(arguments) || (v.isArguments = function(a) {
return !!a && !!v.has(a, "callee");
}), v.isFunction = function(a) {
return i.call(a) == "[object Function]";
}, v.isString = function(a) {
return i.call(a) == "[object String]";
}, v.isNumber = function(a) {
return i.call(a) == "[object Number]";
}, v.isFinite = function(a) {
return v.isNumber(a) && isFinite(a);
}, v.isNaN = function(a) {
return a !== a;
}, v.isBoolean = function(a) {
return a === !0 || a === !1 || i.call(a) == "[object Boolean]";
}, v.isDate = function(a) {
return i.call(a) == "[object Date]";
}, v.isRegExp = function(a) {
return i.call(a) == "[object RegExp]";
}, v.isNull = function(a) {
return a === null;
}, v.isUndefined = function(a) {
return a === void 0;
}, v.has = function(a, b) {
return j.call(a, b);
}, v.noConflict = function() {
return b._ = c, this;
}, v.identity = function(a) {
return a;
}, v.times = function(a, b, c) {
for (var d = 0; d < a; d++) b.call(c, d);
}, v.escape = function(a) {
return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}, v.result = function(a, b) {
if (a == null) return null;
var c = a[b];
return v.isFunction(c) ? c.call(a) : c;
}, v.mixin = function(a) {
w(v.functions(a), function(b) {
I(b, v[b] = a[b]);
});
};
var z = 0;
v.uniqueId = function(a) {
var b = z++;
return a ? a + b : b;
}, v.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var A = /.^/, B = {
"\\": "\\",
"'": "'",
r: "\r",
n: "\n",
t: "	",
u2028: "\u2028",
u2029: "\u2029"
}, C;
for (C in B) B[B[C]] = C;
var D = /\\|'|\r|\n|\t|\u2028|\u2029/g, E = /\\(\\|'|r|n|t|u2028|u2029)/g, F = function(a) {
return a.replace(E, function(a, b) {
return B[b];
});
};
v.template = function(a, b, c) {
c = v.defaults(c || {}, v.templateSettings), a = "__p+='" + a.replace(D, function(a) {
return "\\" + B[a];
}).replace(c.escape || A, function(a, b) {
return "'+\n_.escape(" + F(b) + ")+\n'";
}).replace(c.interpolate || A, function(a, b) {
return "'+\n(" + F(b) + ")+\n'";
}).replace(c.evaluate || A, function(a, b) {
return "';\n" + F(b) + "\n;__p+='";
}) + "';\n", c.variable || (a = "with(obj||{}){\n" + a + "}\n");
var a = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + a + "return __p;\n", d = new Function(c.variable || "obj", "_", a);
return b ? d(b, v) : (b = function(a) {
return d.call(this, a, v);
}, b.source = "function(" + (c.variable || "obj") + "){\n" + a + "}", b);
}, v.chain = function(a) {
return v(a).chain();
};
var G = function(a) {
this._wrapped = a;
};
v.prototype = G.prototype;
var H = function(a, b) {
return b ? v(a).chain() : a;
}, I = function(a, b) {
G.prototype[a] = function() {
var a = g.call(arguments);
return h.call(a, this._wrapped), H(b.apply(v, a), this._chain);
};
};
v.mixin(v), w("pop,push,reverse,shift,sort,splice,unshift".split(","), function(a) {
var b = e[a];
G.prototype[a] = function() {
var c = this._wrapped;
b.apply(c, arguments);
var d = c.length;
return (a == "shift" || a == "splice") && d === 0 && delete c[0], H(c, this._chain);
};
}), w([ "concat", "join", "slice" ], function(a) {
var b = e[a];
G.prototype[a] = function() {
return H(b.apply(this._wrapped, arguments), this._chain);
};
}), G.prototype.chain = function() {
return this._chain = !0, this;
}, G.prototype.value = function() {
return this._wrapped;
};
}).call(this);

// backbone.js

(function() {
var a = this, b = a.Backbone, c = Array.prototype.splice, d;
typeof exports != "undefined" ? d = exports : d = a.Backbone = {}, d.VERSION = "0.9.2";
var e = a._;
!e && typeof require != "undefined" && (e = require("underscore")), d.$ = a.jQuery || a.Zepto || a.ender, d.noConflict = function() {
return a.Backbone = b, this;
}, d.emulateHTTP = !1, d.emulateJSON = !1;
var f = /\s+/, g = d.Events = {
on: function(a, b, c) {
var d, e, g;
if (!b) return this;
a = a.split(f), d = this._callbacks || (this._callbacks = {});
while (e = a.shift()) g = d[e] || (d[e] = []), g.push(b, c);
return this;
},
off: function(a, b, c) {
var d, g, h, i;
if (!(g = this._callbacks)) return this;
if (!(a || b || c)) return delete this._callbacks, this;
a = a ? a.split(f) : e.keys(g);
while (d = a.shift()) {
if (!(h = g[d]) || !b && !c) {
delete g[d];
continue;
}
for (i = h.length - 2; i >= 0; i -= 2) b && h[i] !== b || c && h[i + 1] !== c || h.splice(i, 2);
}
return this;
},
trigger: function(a) {
var b, c, d, e, g, h, i, j;
if (!(c = this._callbacks)) return this;
j = [], a = a.split(f);
for (e = 1, g = arguments.length; e < g; e++) j[e - 1] = arguments[e];
while (b = a.shift()) {
if (i = c.all) i = i.slice();
if (d = c[b]) d = d.slice();
if (d) for (e = 0, g = d.length; e < g; e += 2) d[e].apply(d[e + 1] || this, j);
if (i) {
h = [ b ].concat(j);
for (e = 0, g = i.length; e < g; e += 2) i[e].apply(i[e + 1] || this, h);
}
}
return this;
}
};
g.bind = g.on, g.unbind = g.off;
var h = d.Model = function(a, b) {
var c;
a || (a = {}), b && b.collection && (this.collection = b.collection), b && b.parse && (a = this.parse(a));
if (c = z(this, "defaults")) a = e.extend({}, c, a);
this.attributes = {}, this._escapedAttributes = {}, this.cid = e.uniqueId("c"), this.changed = {}, this._silent = {}, this._pending = {}, this.set(a, {
silent: !0
}), this.changed = {}, this._silent = {}, this._pending = {}, this._previousAttributes = e.clone(this.attributes), this.initialize.apply(this, arguments);
};
e.extend(h.prototype, g, {
changed: null,
_silent: null,
_pending: null,
idAttribute: "id",
initialize: function() {},
toJSON: function(a) {
return e.clone(this.attributes);
},
sync: function() {
return d.sync.apply(this, arguments);
},
get: function(a) {
return this.attributes[a];
},
escape: function(a) {
var b;
if (b = this._escapedAttributes[a]) return b;
var c = this.get(a);
return this._escapedAttributes[a] = e.escape(c == null ? "" : "" + c);
},
has: function(a) {
return this.get(a) != null;
},
set: function(a, b, c) {
var d, f, g;
e.isObject(a) || a == null ? (d = a, c = b) : (d = {}, d[a] = b), c || (c = {});
if (!d) return this;
d instanceof h && (d = d.attributes);
if (c.unset) for (f in d) d[f] = void 0;
if (!this._validate(d, c)) return !1;
this.idAttribute in d && (this.id = d[this.idAttribute]);
var i = c.changes = {}, j = this.attributes, k = this._escapedAttributes, l = this._previousAttributes || {};
for (f in d) {
g = d[f];
if (!e.isEqual(j[f], g) || c.unset && e.has(j, f)) delete k[f], (c.silent ? this._silent : i)[f] = !0;
c.unset ? delete j[f] : j[f] = g, !e.isEqual(l[f], g) || e.has(j, f) !== e.has(l, f) ? (this.changed[f] = g, c.silent || (this._pending[f] = !0)) : (delete this.changed[f], delete this._pending[f]);
}
return c.silent || this.change(c), this;
},
unset: function(a, b) {
return b = e.extend({}, b, {
unset: !0
}), this.set(a, null, b);
},
clear: function(a) {
return a = e.extend({}, a, {
unset: !0
}), this.set(e.clone(this.attributes), a);
},
fetch: function(a) {
a = a ? e.clone(a) : {};
var b = this, c = a.success;
return a.success = function(d, e, f) {
if (!b.set(b.parse(d, f), a)) return !1;
c && c(b, d, a), b.trigger("sync", b, d, a);
}, a.error = d.wrapError(a.error, b, a), this.sync("read", this, a);
},
save: function(a, b, c) {
var f, g, h;
e.isObject(a) || a == null ? (f = a, c = b) : (f = {}, f[a] = b), c = c ? e.clone(c) : {};
if (c.wait) {
if (!this._validate(f, c)) return !1;
g = e.clone(this.attributes);
}
var i = e.extend({}, c, {
silent: !0
});
if (f && !this.set(f, c.wait ? i : c)) return !1;
if (!f && !this.isValid()) return !1;
var j = this, k = c.success;
c.success = function(a, b, d) {
h = !0;
var g = j.parse(a, d);
c.wait && (g = e.extend(f || {}, g));
if (!j.set(g, c)) return !1;
k && k(j, a, c), j.trigger("sync", j, a, c);
}, c.error = d.wrapError(c.error, j, c);
var l = this.sync(this.isNew() ? "create" : "update", this, c);
return !h && c.wait && (this.clear(i), this.set(g, i)), l;
},
destroy: function(a) {
a = a ? e.clone(a) : {};
var b = this, c = a.success, f = function() {
b.trigger("destroy", b, b.collection, a);
};
a.success = function(d) {
(a.wait || b.isNew()) && f(), c && c(b, d, a), b.isNew() || b.trigger("sync", b, d, a);
};
if (this.isNew()) return a.success(), !1;
a.error = d.wrapError(a.error, b, a);
var g = this.sync("delete", this, a);
return a.wait || f(), g;
},
url: function() {
var a = z(this, "urlRoot") || z(this.collection, "url") || A();
return this.isNew() ? a : a + (a.charAt(a.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id);
},
parse: function(a, b) {
return a;
},
clone: function() {
return new this.constructor(this.attributes);
},
isNew: function() {
return this.id == null;
},
change: function(a) {
a || (a = {});
var b = this._changing;
this._changing = !0;
for (var c in this._silent) this._pending[c] = !0;
var d = e.extend({}, a.changes, this._silent);
this._silent = {};
for (var c in d) this.trigger("change:" + c, this, this.get(c), a);
if (b) return this;
while (!e.isEmpty(this._pending)) {
this._pending = {}, this.trigger("change", this, a);
for (var c in this.changed) {
if (this._pending[c] || this._silent[c]) continue;
delete this.changed[c];
}
this._previousAttributes = e.clone(this.attributes);
}
return this._changing = !1, this;
},
hasChanged: function(a) {
return a == null ? !e.isEmpty(this.changed) : e.has(this.changed, a);
},
changedAttributes: function(a) {
if (!a) return this.hasChanged() ? e.clone(this.changed) : !1;
var b, c = !1, d = this._previousAttributes;
for (var f in a) {
if (e.isEqual(d[f], b = a[f])) continue;
(c || (c = {}))[f] = b;
}
return c;
},
previous: function(a) {
return a == null || !this._previousAttributes ? null : this._previousAttributes[a];
},
previousAttributes: function() {
return e.clone(this._previousAttributes);
},
isValid: function() {
return !this.validate || !this.validate(this.attributes);
},
_validate: function(a, b) {
if (b.silent || !this.validate) return !0;
a = e.extend({}, this.attributes, a);
var c = this.validate(a, b);
return c ? (b && b.error ? b.error(this, c, b) : this.trigger("error", this, c, b), !1) : !0;
}
});
var i = d.Collection = function(a, b) {
b || (b = {}), b.model && (this.model = b.model), b.comparator !== void 0 && (this.comparator = b.comparator), this._reset(), this.initialize.apply(this, arguments), a && this.reset(a, {
silent: !0,
parse: b.parse
});
};
e.extend(i.prototype, g, {
model: h,
initialize: function() {},
toJSON: function(a) {
return this.map(function(b) {
return b.toJSON(a);
});
},
sync: function() {
return d.sync.apply(this, arguments);
},
add: function(a, b) {
var d, f, g, h, i, j, k = {}, l = {}, m = [];
b || (b = {}), a = e.isArray(a) ? a.slice() : [ a ];
for (d = 0, g = a.length; d < g; d++) {
if (!(h = a[d] = this._prepareModel(a[d], b))) throw new Error("Can't add an invalid model to a collection");
i = h.cid, j = h.id;
if (k[i] || this._byCid[i] || j != null && (l[j] || this._byId[j])) {
m.push(d);
continue;
}
k[i] = l[j] = h;
}
d = m.length;
while (d--) m[d] = a.splice(m[d], 1)[0];
for (d = 0, g = a.length; d < g; d++) (h = a[d]).on("all", this._onModelEvent, this), this._byCid[h.cid] = h, h.id != null && (this._byId[h.id] = h);
this.length += g, f = b.at != null ? b.at : this.models.length, c.apply(this.models, [ f, 0 ].concat(a));
if (b.merge) for (d = 0, g = m.length; d < g; d++) (h = this._byId[m[d].id]) && h.set(m[d], b);
this.comparator && b.at == null && this.sort({
silent: !0
});
if (b.silent) return this;
for (d = 0, g = this.models.length; d < g; d++) {
if (!k[(h = this.models[d]).cid]) continue;
b.index = d, h.trigger("add", h, this, b);
}
return this;
},
remove: function(a, b) {
var c, d, f, g;
b || (b = {}), a = e.isArray(a) ? a.slice() : [ a ];
for (c = 0, d = a.length; c < d; c++) {
g = this.getByCid(a[c]) || this.get(a[c]);
if (!g) continue;
delete this._byId[g.id], delete this._byCid[g.cid], f = this.indexOf(g), this.models.splice(f, 1), this.length--, b.silent || (b.index = f, g.trigger("remove", g, this, b)), this._removeReference(g);
}
return this;
},
push: function(a, b) {
return a = this._prepareModel(a, b), this.add(a, b), a;
},
pop: function(a) {
var b = this.at(this.length - 1);
return this.remove(b, a), b;
},
unshift: function(a, b) {
return a = this._prepareModel(a, b), this.add(a, e.extend({
at: 0
}, b)), a;
},
shift: function(a) {
var b = this.at(0);
return this.remove(b, a), b;
},
slice: function(a, b) {
return this.models.slice(a, b);
},
get: function(a) {
return a == null ? void 0 : this._byId[a.id != null ? a.id : a];
},
getByCid: function(a) {
return a && this._byCid[a.cid || a];
},
at: function(a) {
return this.models[a];
},
where: function(a) {
return e.isEmpty(a) ? [] : this.filter(function(b) {
for (var c in a) if (a[c] !== b.get(c)) return !1;
return !0;
});
},
sort: function(a) {
a || (a = {});
if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
var b = e.bind(this.comparator, this);
return this.comparator.length === 1 ? this.models = this.sortBy(b) : this.models.sort(b), a.silent || this.trigger("reset", this, a), this;
},
pluck: function(a) {
return e.map(this.models, function(b) {
return b.get(a);
});
},
reset: function(a, b) {
a || (a = []), b || (b = {});
for (var c = 0, d = this.models.length; c < d; c++) this._removeReference(this.models[c]);
return this._reset(), this.add(a, e.extend({
silent: !0
}, b)), b.silent || this.trigger("reset", this, b), this;
},
fetch: function(a) {
a = a ? e.clone(a) : {}, a.parse === void 0 && (a.parse = !0);
var b = this, c = a.success;
return a.success = function(d, e, f) {
b[a.add ? "add" : "reset"](b.parse(d, f), a), c && c(b, d, a), b.trigger("sync", b, d, a);
}, a.error = d.wrapError(a.error, b, a), this.sync("read", this, a);
},
create: function(a, b) {
var c = this;
b = b ? e.clone(b) : {}, a = this._prepareModel(a, b);
if (!a) return !1;
b.wait || c.add(a, b);
var d = b.success;
return b.success = function(a, b, e) {
e.wait && c.add(a, e), d && d(a, b, e);
}, a.save(null, b), a;
},
parse: function(a, b) {
return a;
},
clone: function() {
return new this.constructor(this.models);
},
chain: function() {
return e(this.models).chain();
},
_reset: function(a) {
this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
},
_prepareModel: function(a, b) {
if (a instanceof h) return a.collection || (a.collection = this), a;
b || (b = {}), b.collection = this;
var c = new this.model(a, b);
return c._validate(c.attributes, b) ? c : !1;
},
_removeReference: function(a) {
this === a.collection && delete a.collection, a.off("all", this._onModelEvent, this);
},
_onModelEvent: function(a, b, c, d) {
if ((a === "add" || a === "remove") && c !== this) return;
a === "destroy" && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], b.id != null && (this._byId[b.id] = b)), this.trigger.apply(this, arguments);
}
});
var j = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
e.each(j, function(a) {
i.prototype[a] = function() {
return e[a].apply(e, [ this.models ].concat(e.toArray(arguments)));
};
});
var k = d.Router = function(a) {
a || (a = {}), a.routes && (this.routes = a.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
}, l = /:\w+/g, m = /\*\w+/g, n = /[-[\]{}()+?.,\\^$|#\s]/g;
e.extend(k.prototype, g, {
initialize: function() {},
route: function(a, b, c) {
return d.history || (d.history = new o), e.isRegExp(a) || (a = this._routeToRegExp(a)), c || (c = this[b]), d.history.route(a, e.bind(function(e) {
var f = this._extractParameters(a, e);
c && c.apply(this, f), this.trigger.apply(this, [ "route:" + b ].concat(f)), d.history.trigger("route", this, b, f);
}, this)), this;
},
navigate: function(a, b) {
d.history.navigate(a, b);
},
_bindRoutes: function() {
if (!this.routes) return;
var a = [];
for (var b in this.routes) a.unshift([ b, this.routes[b] ]);
for (var c = 0, d = a.length; c < d; c++) this.route(a[c][0], a[c][1], this[a[c][1]]);
},
_routeToRegExp: function(a) {
return a = a.replace(n, "\\$&").replace(l, "([^/]+)").replace(m, "(.*?)"), new RegExp("^" + a + "$");
},
_extractParameters: function(a, b) {
return a.exec(b).slice(1);
}
});
var o = d.History = function(b) {
this.handlers = [], e.bindAll(this, "checkUrl"), this.location = b && b.location || a.location, this.history = b && b.history || a.history;
}, p = /^[#\/]/, q = /msie [\w.]+/, r = /\/$/;
o.started = !1, e.extend(o.prototype, g, {
interval: 50,
getHash: function(a) {
var b = (a || this).location.href.match(/#(.*)$/);
return b ? b[1] : "";
},
getFragment: function(a, b) {
if (a == null) if (this._hasPushState || !this._wantsHashChange || b) {
a = this.location.pathname;
var c = this.options.root.replace(r, "");
a.indexOf(c) || (a = a.substr(c.length));
} else a = this.getHash();
return decodeURIComponent(a.replace(p, ""));
},
start: function(a) {
if (o.started) throw new Error("Backbone.history has already been started");
o.started = !0, this.options = e.extend({}, {
root: "/"
}, this.options, a), this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
var b = this.getFragment(), c = document.documentMode, f = q.exec(navigator.userAgent.toLowerCase()) && (!c || c <= 7);
r.test(this.options.root) || (this.options.root += "/"), f && this._wantsHashChange && (this.iframe = d.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(b)), this._hasPushState ? d.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !f ? d.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = b;
var g = this.location, h = g.pathname.replace(/[^/]$/, "$&/") === this.options.root && !g.search;
if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !h) return this.fragment = this.getFragment(null, !0), this.location.replace(this.options.root + this.location.search + "#" + this.fragment), !0;
this._wantsPushState && this._hasPushState && h && g.hash && (this.fragment = this.getHash().replace(p, ""), this.history.replaceState({}, document.title, g.protocol + "//" + g.host + this.options.root + this.fragment));
if (!this.options.silent) return this.loadUrl();
},
stop: function() {
d.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), o.started = !1;
},
route: function(a, b) {
this.handlers.unshift({
route: a,
callback: b
});
},
checkUrl: function(a) {
var b = this.getFragment();
b === this.fragment && this.iframe && (b = this.getFragment(this.getHash(this.iframe)));
if (b === this.fragment) return !1;
this.iframe && this.navigate(b), this.loadUrl() || this.loadUrl(this.getHash());
},
loadUrl: function(a) {
var b = this.fragment = this.getFragment(a), c = e.any(this.handlers, function(a) {
if (a.route.test(b)) return a.callback(b), !0;
});
return c;
},
navigate: function(a, b) {
if (!o.started) return !1;
if (!b || b === !0) b = {
trigger: b
};
var c = (a || "").replace(p, "");
if (this.fragment === c) return;
this.fragment = c;
var d = (c.indexOf(this.options.root) !== 0 ? this.options.root : "") + c;
if (this._hasPushState) this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, d); else {
if (!this._wantsHashChange) return this.location.assign(d);
this._updateHash(this.location, c, b.replace), this.iframe && c !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, c, b.replace));
}
b.trigger && this.loadUrl(a);
},
_updateHash: function(a, b, c) {
c ? a.replace(a.href.replace(/(javascript:|#).*$/, "") + "#" + b) : a.hash = b;
}
});
var s = d.View = function(a) {
this.cid = e.uniqueId("view"), this._configure(a || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
}, t = /^(\S+)\s*(.*)$/, u = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
e.extend(s.prototype, g, {
tagName: "div",
$: function(a) {
return this.$el.find(a);
},
initialize: function() {},
render: function() {
return this;
},
remove: function() {
return this.$el.remove(), this;
},
make: function(a, b, c) {
var e = document.createElement(a);
return b && d.$(e).attr(b), c != null && d.$(e).html(c), e;
},
setElement: function(a, b) {
return this.$el && this.undelegateEvents(), this.$el = a instanceof d.$ ? a : d.$(a), this.el = this.$el[0], b !== !1 && this.delegateEvents(), this;
},
delegateEvents: function(a) {
if (!a && !(a = z(this, "events"))) return;
this.undelegateEvents();
for (var b in a) {
var c = a[b];
e.isFunction(c) || (c = this[a[b]]);
if (!c) throw new Error('Method "' + a[b] + '" does not exist');
var d = b.match(t), f = d[1], g = d[2];
c = e.bind(c, this), f += ".delegateEvents" + this.cid, g === "" ? this.$el.bind(f, c) : this.$el.delegate(g, f, c);
}
},
undelegateEvents: function() {
this.$el.unbind(".delegateEvents" + this.cid);
},
_configure: function(a) {
this.options && (a = e.extend({}, this.options, a));
for (var b = 0, c = u.length; b < c; b++) {
var d = u[b];
a[d] && (this[d] = a[d]);
}
this.options = a;
},
_ensureElement: function() {
if (!this.el) {
var a = e.extend({}, z(this, "attributes"));
this.id && (a.id = this.id), this.className && (a["class"] = this.className), this.setElement(this.make(z(this, "tagName"), a), !1);
} else this.setElement(this.el, !1);
}
});
var v = function(a, b) {
return y(this, a, b);
};
h.extend = i.extend = k.extend = s.extend = v;
var w = {
create: "POST",
update: "PUT",
"delete": "DELETE",
read: "GET"
};
d.sync = function(a, b, c) {
var f = w[a];
c || (c = {});
var g = {
type: f,
dataType: "json"
};
return c.url || (g.url = z(b, "url") || A()), !c.data && b && (a === "create" || a === "update") && (g.contentType = "application/json", g.data = JSON.stringify(b)), d.emulateJSON && (g.contentType = "application/x-www-form-urlencoded", g.data = g.data ? {
model: g.data
} : {}), d.emulateHTTP && (f === "PUT" || f === "DELETE") && (d.emulateJSON && (g.data._method = f), g.type = "POST", g.beforeSend = function(a) {
a.setRequestHeader("X-HTTP-Method-Override", f);
}), g.type !== "GET" && !d.emulateJSON && (g.processData = !1), d.ajax(e.extend(g, c));
}, d.ajax = function() {
return d.$.ajax.apply(d.$, arguments);
}, d.wrapError = function(a, b, c) {
return function(d, e) {
e = d === b ? e : d, a ? a(b, e, c) : b.trigger("error", b, e, c);
};
};
var x = function() {}, y = function(a, b, c) {
var d;
return b && b.hasOwnProperty("constructor") ? d = b.constructor : d = function() {
a.apply(this, arguments);
}, e.extend(d, a), x.prototype = a.prototype, d.prototype = new x, b && e.extend(d.prototype, b), c && e.extend(d, c), d.prototype.constructor = d, d.__super__ = a.prototype, d;
}, z = function(a, b) {
return !a || !a[b] ? null : e.isFunction(a[b]) ? a[b]() : a[b];
}, A = function() {
throw new Error('A "url" property or function must be specified');
};
}).call(this);

// backbone-relational.js

(function(a) {
"use strict";
var b, c, d;
typeof window == "undefined" ? (b = require("underscore"), c = require("backbone"), d = module.exports = c) : (b = window._, c = window.Backbone, d = window), c.Relational = {
showWarnings: !0
}, c.Semaphore = {
_permitsAvailable: null,
_permitsUsed: 0,
acquire: function() {
if (this._permitsAvailable && this._permitsUsed >= this._permitsAvailable) throw new Error("Max permits acquired");
this._permitsUsed++;
},
release: function() {
if (this._permitsUsed === 0) throw new Error("All permits released");
this._permitsUsed--;
},
isLocked: function() {
return this._permitsUsed > 0;
},
setAvailablePermits: function(a) {
if (this._permitsUsed > a) throw new Error("Available permits cannot be less than used permits");
this._permitsAvailable = a;
}
}, c.BlockingQueue = function() {
this._queue = [];
}, b.extend(c.BlockingQueue.prototype, c.Semaphore, {
_queue: null,
add: function(a) {
this.isBlocked() ? this._queue.push(a) : a();
},
process: function() {
while (this._queue && this._queue.length) this._queue.shift()();
},
block: function() {
this.acquire();
},
unblock: function() {
this.release(), this.isBlocked() || this.process();
},
isBlocked: function() {
return this.isLocked();
}
}), c.Relational.eventQueue = new c.BlockingQueue, c.Store = function() {
this._collections = [], this._reverseRelations = [], this._subModels = [], this._modelScopes = [ d ];
}, b.extend(c.Store.prototype, c.Events, {
addModelScope: function(a) {
this._modelScopes.push(a);
},
addSubModels: function(a, b) {
this._subModels.push({
superModelType: b,
subModels: a
});
},
setupSuperModel: function(a) {
b.find(this._subModels, function(c) {
return b.find(c.subModels, function(b, d) {
var e = this.getObjectByName(b);
if (a === e) return c.superModelType._subModels[d] = a, a._superModel = c.superModelType, a._subModelTypeValue = d, a._subModelTypeAttribute = c.superModelType.prototype.subModelTypeAttribute, !0;
}, this);
}, this);
},
addReverseRelation: function(a) {
var c = b.any(this._reverseRelations, function(c) {
return b.all(a, function(a, b) {
return a === c[b];
});
});
if (!c && a.model && a.type) {
this._reverseRelations.push(a);
var d = function(a, c) {
a.prototype.relations || (a.prototype.relations = []), a.prototype.relations.push(c), b.each(a._subModels, function(a) {
d(a, c);
}, this);
};
d(a.model, a), this.retroFitRelation(a);
}
},
retroFitRelation: function(a) {
var b = this.getCollection(a.model);
b.each(function(b) {
if (!(b instanceof a.model)) return;
new a.type(b, a);
}, this);
},
getCollection: function(a) {
a instanceof c.RelationalModel && (a = a.constructor);
var d = a;
while (d._superModel) d = d._superModel;
var e = b.detect(this._collections, function(a) {
return a.model === d;
});
return e || (e = this._createCollection(a)), e;
},
getObjectByName: function(a) {
var c = a.split("."), d = null;
return b.find(this._modelScopes, function(a) {
d = b.reduce(c, function(a, b) {
return a[b];
}, a);
if (d && d !== a) return !0;
}, this), d;
},
_createCollection: function(a) {
var b;
return a instanceof c.RelationalModel && (a = a.constructor), a.prototype instanceof c.RelationalModel && (b = new c.Collection, b.model = a, this._collections.push(b)), b;
},
resolveIdForItem: function(a, d) {
var e = b.isString(d) || b.isNumber(d) ? d : null;
return e == null && (d instanceof c.RelationalModel ? e = d.id : b.isObject(d) && (e = d[a.prototype.idAttribute])), e;
},
find: function(a, b) {
var c = this.resolveIdForItem(a, b), d = this.getCollection(a);
if (d) {
var e = d.get(c);
if (e instanceof a) return e;
}
return null;
},
register: function(a) {
var b = a.collection, c = this.getCollection(a);
c && c.add(a), a.bind("destroy", this.unregister, this), a.collection = b;
},
update: function(a) {
var b = this.getCollection(a);
b._onModelEvent("change:" + a.idAttribute, a, b);
},
unregister: function(a) {
a.unbind("destroy", this.unregister);
var b = this.getCollection(a);
b && b.remove(a);
}
}), c.Relational.store = new c.Store, c.Relation = function(a, d) {
this.instance = a, d = b.isObject(d) ? d : {}, this.reverseRelation = b.defaults(d.reverseRelation || {}, this.options.reverseRelation), this.reverseRelation.type = b.isString(this.reverseRelation.type) ? c[this.reverseRelation.type] || c.Relational.store.getObjectByName(this.reverseRelation.type) : this.reverseRelation.type, this.model = d.model || this.instance.constructor, this.options = b.defaults(d, this.options, c.Relation.prototype.options), this.key = this.options.key, this.keySource = this.options.keySource || this.key, this.keyDestination = this.options.keyDestination || this.keySource || this.key, this.relatedModel = this.options.relatedModel, b.isString(this.relatedModel) && (this.relatedModel = c.Relational.store.getObjectByName(this.relatedModel));
if (!this.checkPreconditions()) return !1;
a && (this.keyContents = this.instance.get(this.keySource), this.key !== this.keySource && this.instance.unset(this.keySource, {
silent: !0
}), this.instance._relations.push(this)), !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key && c.Relational.store.addReverseRelation(b.defaults({
isAutoRelation: !0,
model: this.relatedModel,
relatedModel: this.model,
reverseRelation: this.options
}, this.reverseRelation)), b.bindAll(this, "_modelRemovedFromCollection", "_relatedModelAdded", "_relatedModelRemoved"), a && (this.initialize(), c.Relational.store.getCollection(this.instance).bind("relational:remove", this._modelRemovedFromCollection), c.Relational.store.getCollection(this.relatedModel).bind("relational:add", this._relatedModelAdded).bind("relational:remove", this._relatedModelRemoved));
}, c.Relation.extend = c.Model.extend, b.extend(c.Relation.prototype, c.Events, c.Semaphore, {
options: {
createModels: !0,
includeInJSON: !0,
isAutoRelation: !1
},
instance: null,
key: null,
keyContents: null,
relatedModel: null,
reverseRelation: null,
related: null,
_relatedModelAdded: function(a, b, c) {
var d = this;
a.queue(function() {
d.tryAddRelated(a, c);
});
},
_relatedModelRemoved: function(a, b, c) {
this.removeRelated(a, c);
},
_modelRemovedFromCollection: function(a) {
a === this.instance && this.destroy();
},
checkPreconditions: function() {
var a = this.instance, d = this.key, e = this.model, f = this.relatedModel, g = c.Relational.showWarnings && typeof console != "undefined";
if (!e || !d || !f) return g && console.warn("Relation=%o; no model, key or relatedModel (%o, %o, %o)", this, e, d, f), !1;
if (e.prototype instanceof c.RelationalModel) {
if (f.prototype instanceof c.RelationalModel) {
if (this instanceof c.HasMany && this.reverseRelation.type === c.HasMany) return g && console.warn("Relation=%o; relation is a HasMany, and the reverseRelation is HasMany as well.", this), !1;
if (a && a._relations.length) {
var h = b.any(a._relations, function(a) {
var b = this.reverseRelation.key && a.reverseRelation.key;
return a.relatedModel === f && a.key === d && (!b || this.reverseRelation.key === a.reverseRelation.key);
}, this);
if (h) return g && console.warn("Relation=%o between instance=%o.%s and relatedModel=%o.%s already exists", this, a, d, f, this.reverseRelation.key), !1;
}
return !0;
}
return g && console.warn("Relation=%o; relatedModel does not inherit from Backbone.RelationalModel (%o)", this, f), !1;
}
return g && console.warn("Relation=%o; model does not inherit from Backbone.RelationalModel (%o)", this, a), !1;
},
setRelated: function(a, c) {
this.related = a, this.instance.acquire(), this.instance.set(this.key, a, b.defaults(c || {}, {
silent: !0
})), this.instance.release();
},
_isReverseRelation: function(a) {
return a.instance instanceof this.relatedModel && this.reverseRelation.key === a.key && this.key === a.reverseRelation.key ? !0 : !1;
},
getReverseRelations: function(a) {
var c = [], d = b.isUndefined(a) ? this.related && (this.related.models || [ this.related ]) : [ a ];
return b.each(d, function(a) {
b.each(a.getRelations(), function(a) {
this._isReverseRelation(a) && c.push(a);
}, this);
}, this), c;
},
sanitizeOptions: function(a) {
return a = a ? b.clone(a) : {}, a.silent && (a.silentChange = !0, delete a.silent), a;
},
unsanitizeOptions: function(a) {
return a = a ? b.clone(a) : {}, a.silentChange && (a.silent = !0, delete a.silentChange), a;
},
destroy: function() {
c.Relational.store.getCollection(this.instance).unbind("relational:remove", this._modelRemovedFromCollection), c.Relational.store.getCollection(this.relatedModel).unbind("relational:add", this._relatedModelAdded).unbind("relational:remove", this._relatedModelRemoved), b.each(this.getReverseRelations(), function(a) {
a.removeRelated(this.instance);
}, this);
}
}), c.HasOne = c.Relation.extend({
options: {
reverseRelation: {
type: "HasMany"
}
},
initialize: function() {
b.bindAll(this, "onChange"), this.instance.bind("relational:change:" + this.key, this.onChange);
var a = this.findRelated({
silent: !0
});
this.setRelated(a), b.each(this.getReverseRelations(), function(a) {
a.addRelated(this.instance);
}, this);
},
findRelated: function(a) {
var b = this.keyContents, c = null;
return b instanceof this.relatedModel ? c = b : b && (c = this.relatedModel.findOrCreate(b, {
create: this.options.createModels
})), c;
},
onChange: function(a, d, e) {
if (this.isLocked()) return;
this.acquire(), e = this.sanitizeOptions(e);
var f = b.isUndefined(e._related), g = f ? this.related : e._related;
if (f) {
this.keyContents = d;
if (d instanceof this.relatedModel) this.related = d; else if (d) {
var h = this.findRelated(e);
this.setRelated(h);
} else this.setRelated(null);
}
g && this.related !== g && b.each(this.getReverseRelations(g), function(a) {
a.removeRelated(this.instance, e);
}, this), b.each(this.getReverseRelations(), function(a) {
a.addRelated(this.instance, e);
}, this);
if (!e.silentChange && this.related !== g) {
var i = this;
c.Relational.eventQueue.add(function() {
i.instance.trigger("update:" + i.key, i.instance, i.related, e);
});
}
this.release();
},
tryAddRelated: function(a, b) {
if (this.related) return;
b = this.sanitizeOptions(b);
var d = this.keyContents;
if (d) {
var e = c.Relational.store.resolveIdForItem(this.relatedModel, d);
a.id === e && this.addRelated(a, b);
}
},
addRelated: function(a, b) {
if (a !== this.related) {
var c = this.related || null;
this.setRelated(a), this.onChange(this.instance, a, {
_related: c
});
}
},
removeRelated: function(a, b) {
if (!this.related) return;
if (a === this.related) {
var c = this.related || null;
this.setRelated(null), this.onChange(this.instance, a, {
_related: c
});
}
}
}), c.HasMany = c.Relation.extend({
collectionType: null,
options: {
reverseRelation: {
type: "HasOne"
},
collectionType: c.Collection,
collectionKey: !0,
collectionOptions: {}
},
initialize: function() {
b.bindAll(this, "onChange", "handleAddition", "handleRemoval", "handleReset"), this.instance.bind("relational:change:" + this.key, this.onChange), this.collectionType = this.options.collectionType, b.isString(this.collectionType) && (this.collectionType = c.Relational.store.getObjectByName(this.collectionType));
if (!this.collectionType.prototype instanceof c.Collection) throw new Error("collectionType must inherit from Backbone.Collection");
this.keyContents instanceof c.Collection ? this.setRelated(this._prepareCollection(this.keyContents)) : this.setRelated(this._prepareCollection()), this.findRelated({
silent: !0
});
},
_getCollectionOptions: function() {
return b.isFunction(this.options.collectionOptions) ? this.options.collectionOptions(this.instance) : this.options.collectionOptions;
},
_prepareCollection: function(a) {
this.related && this.related.unbind("relational:add", this.handleAddition).unbind("relational:remove", this.handleRemoval).unbind("relational:reset", this.handleReset);
if (!a || !(a instanceof c.Collection)) a = new this.collectionType([], this._getCollectionOptions());
a.model = this.relatedModel;
if (this.options.collectionKey) {
var b = this.options.collectionKey === !0 ? this.options.reverseRelation.key : this.options.collectionKey;
a[b] && a[b] !== this.instance ? c.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; collectionKey=%s already exists on collection=%o", this, b, this.options.collectionKey) : b && (a[b] = this.instance);
}
return a.bind("relational:add", this.handleAddition).bind("relational:remove", this.handleRemoval).bind("relational:reset", this.handleReset), a;
},
findRelated: function(a) {
if (this.keyContents) {
var d = [];
this.keyContents instanceof c.Collection ? d = this.keyContents.models : (this.keyContents = b.isArray(this.keyContents) ? this.keyContents : [ this.keyContents ], b.each(this.keyContents, function(a) {
var b = null;
a instanceof this.relatedModel ? b = a : b = this.relatedModel.findOrCreate(a, {
create: this.options.createModels
}), b && !this.related.getByCid(b) && !this.related.get(b) && d.push(b);
}, this)), d.length && (a = this.unsanitizeOptions(a), this.related.add(d, a));
}
},
onChange: function(a, d, e) {
e = this.sanitizeOptions(e), this.keyContents = d, b.each(this.getReverseRelations(), function(a) {
a.removeRelated(this.instance, e);
}, this);
if (d instanceof c.Collection) this._prepareCollection(d), this.related = d; else {
var f;
this.related instanceof c.Collection ? (f = this.related, f.remove(f.models)) : f = this._prepareCollection(), this.setRelated(f), this.findRelated(e);
}
b.each(this.getReverseRelations(), function(a) {
a.addRelated(this.instance, e);
}, this);
var g = this;
c.Relational.eventQueue.add(function() {
!e.silentChange && g.instance.trigger("update:" + g.key, g.instance, g.related, e);
});
},
tryAddRelated: function(a, d) {
d = this.sanitizeOptions(d);
if (!this.related.getByCid(a) && !this.related.get(a)) {
var e = b.any(this.keyContents, function(b) {
var d = c.Relational.store.resolveIdForItem(this.relatedModel, b);
return d && d === a.id;
}, this);
e && this.related.add(a, d);
}
},
handleAddition: function(a, d, e) {
if (!(a instanceof c.Model)) return;
e = this.sanitizeOptions(e), b.each(this.getReverseRelations(a), function(a) {
a.addRelated(this.instance, e);
}, this);
var f = this;
c.Relational.eventQueue.add(function() {
!e.silentChange && f.instance.trigger("add:" + f.key, a, f.related, e);
});
},
handleRemoval: function(a, d, e) {
if (!(a instanceof c.Model)) return;
e = this.sanitizeOptions(e), b.each(this.getReverseRelations(a), function(a) {
a.removeRelated(this.instance, e);
}, this);
var f = this;
c.Relational.eventQueue.add(function() {
!e.silentChange && f.instance.trigger("remove:" + f.key, a, f.related, e);
});
},
handleReset: function(a, b) {
b = this.sanitizeOptions(b);
var d = this;
c.Relational.eventQueue.add(function() {
!b.silentChange && d.instance.trigger("reset:" + d.key, d.related, b);
});
},
addRelated: function(a, b) {
var c = this;
b = this.unsanitizeOptions(b), a.queue(function() {
c.related && !c.related.getByCid(a) && !c.related.get(a) && c.related.add(a, b);
});
},
removeRelated: function(a, b) {
b = this.unsanitizeOptions(b), (this.related.getByCid(a) || this.related.get(a)) && this.related.remove(a, b);
}
}), c.RelationalModel = c.Model.extend({
relations: null,
_relations: null,
_isInitialized: !1,
_deferProcessing: !1,
_queue: null,
subModelTypeAttribute: "type",
subModelTypes: null,
constructor: function(a, d) {
var e = this;
if (d && d.collection) {
this._deferProcessing = !0;
var f = function(a) {
a === e && (e._deferProcessing = !1, e.processQueue(), d.collection.unbind("relational:add", f));
};
d.collection.bind("relational:add", f), b.defer(function() {
f(e);
});
}
this._queue = new c.BlockingQueue, this._queue.block(), c.Relational.eventQueue.block(), c.Model.apply(this, arguments), c.Relational.eventQueue.unblock();
},
trigger: function(a) {
if (a.length > 5 && "change" === a.substr(0, 6)) {
var b = this, d = arguments;
c.Relational.eventQueue.add(function() {
c.Model.prototype.trigger.apply(b, d);
});
} else c.Model.prototype.trigger.apply(this, arguments);
return this;
},
initializeRelations: function() {
this.acquire(), this._relations = [], b.each(this.relations, function(a) {
var d = b.isString(a.type) ? c[a.type] || c.Relational.store.getObjectByName(a.type) : a.type;
d && d.prototype instanceof c.Relation ? new d(this, a) : c.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; missing or invalid type!", a);
}, this), this._isInitialized = !0, this.release(), this.processQueue();
},
updateRelations: function(a) {
this._isInitialized && !this.isLocked() && b.each(this._relations, function(b) {
var c = this.attributes[b.keySource] || this.attributes[b.key];
b.related !== c && this.trigger("relational:change:" + b.key, this, c, a || {});
}, this);
},
queue: function(a) {
this._queue.add(a);
},
processQueue: function() {
this._isInitialized && !this._deferProcessing && this._queue.isBlocked() && this._queue.unblock();
},
getRelation: function(a) {
return b.detect(this._relations, function(b) {
if (b.key === a) return !0;
}, this);
},
getRelations: function() {
return this._relations;
},
fetchRelated: function(a, d, e) {
d || (d = {});
var f, g = [], h = this.getRelation(a), i = h && h.keyContents, j = i && b.select(b.isArray(i) ? i : [ i ], function(a) {
var b = c.Relational.store.resolveIdForItem(h.relatedModel, a);
return b && (e || !c.Relational.store.find(h.relatedModel, b));
}, this);
if (j && j.length) {
var k = b.map(j, function(a) {
var c;
if (b.isObject(a)) c = h.relatedModel.build(a); else {
var d = {};
d[h.relatedModel.prototype.idAttribute] = a, c = h.relatedModel.build(d);
}
return c;
}, this);
h.related instanceof c.Collection && b.isFunction(h.related.url) && (f = h.related.url(k));
if (f && f !== h.related.url()) {
var l = b.defaults({
error: function() {
var a = arguments;
b.each(k, function(b) {
b.trigger("destroy", b, b.collection, d), d.error && d.error.apply(b, a);
});
},
url: f
}, d, {
add: !0
});
g = [ h.related.fetch(l) ];
} else g = b.map(k, function(a) {
var c = b.defaults({
error: function() {
a.trigger("destroy", a, a.collection, d), d.error && d.error.apply(a, arguments);
}
}, d);
return a.fetch(c);
}, this);
}
return g;
},
set: function(a, d, e) {
c.Relational.eventQueue.block();
var f;
b.isObject(a) || a == null ? (f = a, e = d) : (f = {}, f[a] = d);
var g = c.Model.prototype.set.apply(this, arguments);
return !this._isInitialized && !this.isLocked() ? (this.constructor.initializeModelHierarchy(), c.Relational.store.register(this), this.initializeRelations()) : f && this.idAttribute in f && c.Relational.store.update(this), f && this.updateRelations(e), c.Relational.eventQueue.unblock(), g;
},
unset: function(a, b) {
c.Relational.eventQueue.block();
var d = c.Model.prototype.unset.apply(this, arguments);
return this.updateRelations(b), c.Relational.eventQueue.unblock(), d;
},
clear: function(a) {
c.Relational.eventQueue.block();
var b = c.Model.prototype.clear.apply(this, arguments);
return this.updateRelations(a), c.Relational.eventQueue.unblock(), b;
},
change: function(a) {
var b = this, d = arguments;
c.Relational.eventQueue.add(function() {
c.Model.prototype.change.apply(b, d);
});
},
clone: function() {
var a = b.clone(this.attributes);
return b.isUndefined(a[this.idAttribute]) || (a[this.idAttribute] = null), b.each(this.getRelations(), function(b) {
delete a[b.key];
}), new this.constructor(a);
},
toJSON: function() {
if (this.isLocked()) return this.id;
this.acquire();
var a = c.Model.prototype.toJSON.call(this);
return this.constructor._superModel && !(this.constructor._subModelTypeAttribute in a) && (a[this.constructor._subModelTypeAttribute] = this.constructor._subModelTypeValue), b.each(this._relations, function(d) {
var e = a[d.key];
if (d.options.includeInJSON === !0) e && b.isFunction(e.toJSON) ? a[d.keyDestination] = e.toJSON() : a[d.keyDestination] = null; else if (b.isString(d.options.includeInJSON)) e instanceof c.Collection ? a[d.keyDestination] = e.pluck(d.options.includeInJSON) : e instanceof c.Model ? a[d.keyDestination] = e.get(d.options.includeInJSON) : a[d.keyDestination] = null; else if (b.isArray(d.options.includeInJSON)) if (e instanceof c.Collection) {
var f = [];
e.each(function(a) {
var c = {};
b.each(d.options.includeInJSON, function(b) {
c[b] = a.get(b);
}), f.push(c);
}), a[d.keyDestination] = f;
} else if (e instanceof c.Model) {
var f = {};
b.each(d.options.includeInJSON, function(a) {
f[a] = e.get(a);
}), a[d.keyDestination] = f;
} else a[d.keyDestination] = null; else delete a[d.key];
d.keyDestination !== d.key && delete a[d.key];
}), this.release(), a;
}
}, {
setup: function(a) {
this.prototype.relations = (this.prototype.relations || []).slice(0), this._subModels = {}, this._superModel = null, this.prototype.hasOwnProperty("subModelTypes") ? c.Relational.store.addSubModels(this.prototype.subModelTypes, this) : this.prototype.subModelTypes = null, b.each(this.prototype.relations, function(a) {
a.model || (a.model = this);
if (a.reverseRelation && a.model === this) {
var d = !0;
if (b.isString(a.relatedModel)) {
var e = c.Relational.store.getObjectByName(a.relatedModel);
d = e && e.prototype instanceof c.RelationalModel;
}
var f = b.isString(a.type) ? c[a.type] || c.Relational.store.getObjectByName(a.type) : a.type;
d && f && f.prototype instanceof c.Relation && new f(null, a);
}
}, this);
},
build: function(a, b) {
var c = this;
this.initializeModelHierarchy();
if (this._subModels && this.prototype.subModelTypeAttribute in a) {
var d = a[this.prototype.subModelTypeAttribute], e = this._subModels[d];
e && (c = e);
}
return new c(a, b);
},
initializeModelHierarchy: function() {
if (b.isUndefined(this._superModel) || b.isNull(this._superModel)) {
c.Relational.store.setupSuperModel(this);
if (this._superModel) {
if (this._superModel.prototype.relations) {
var a = b.any(this.prototype.relations, function(a) {
return a.model && a.model !== this;
}, this);
a || (this.prototype.relations = this._superModel.prototype.relations.concat(this.prototype.relations));
}
} else this._superModel = !1;
}
this.prototype.subModelTypes && b.keys(this.prototype.subModelTypes).length !== b.keys(this._subModels).length && b.each(this.prototype.subModelTypes, function(a) {
var b = c.Relational.store.getObjectByName(a);
b && b.initializeModelHierarchy();
});
},
findOrCreate: function(a, d) {
var e = c.Relational.store.find(this, a);
if (b.isObject(a)) if (e) e.set(a, d); else if (!d || d && d.create !== !1) e = this.build(a, d);
return e;
}
}), b.extend(c.RelationalModel.prototype, c.Semaphore), c.Collection.prototype.__prepareModel = c.Collection.prototype._prepareModel, c.Collection.prototype._prepareModel = function(a, b) {
b || (b = {});
if (a instanceof c.Model) a.collection || (a.collection = this); else {
var d = a;
b.collection = this, typeof this.model.build != "undefined" ? a = this.model.build(d, b) : a = new this.model(d, b), a._validate(a.attributes, b) || (a = !1);
}
return a;
};
var e = c.Collection.prototype.__add = c.Collection.prototype.add;
c.Collection.prototype.add = function(a, d) {
d || (d = {}), b.isArray(a) || (a = [ a ]);
var f = [];
return b.each(a, function(a) {
if (!(a instanceof c.Model)) {
var b = c.Relational.store.find(this.model, a[this.model.prototype.idAttribute]);
b ? (b.set(b.parse ? b.parse(a) : a, d), a = b) : a = c.Collection.prototype._prepareModel.call(this, a, d);
}
a instanceof c.Model && !this.get(a) && !this.getByCid(a) && f.push(a);
}, this), f.length && (e.call(this, f, d), b.each(f, function(a) {
this.trigger("relational:add", a, this, d);
}, this)), this;
};
var f = c.Collection.prototype.__remove = c.Collection.prototype.remove;
c.Collection.prototype.remove = function(a, d) {
return d || (d = {}), b.isArray(a) ? a = a.slice(0) : a = [ a ], b.each(a, function(a) {
a = this.getByCid(a) || this.get(a), a instanceof c.Model && (f.call(this, a, d), this.trigger("relational:remove", a, this, d));
}, this), this;
};
var g = c.Collection.prototype.__reset = c.Collection.prototype.reset;
c.Collection.prototype.reset = function(a, b) {
return g.call(this, a, b), this.trigger("relational:reset", this, b), this;
};
var h = c.Collection.prototype.__sort = c.Collection.prototype.sort;
c.Collection.prototype.sort = function(a) {
return h.call(this, a), this.trigger("relational:reset", this, a), this;
};
var i = c.Collection.prototype.__trigger = c.Collection.prototype.trigger;
c.Collection.prototype.trigger = function(a) {
if (a === "add" || a === "remove" || a === "reset") {
var d = this, e = arguments;
a === "add" && (e = b.toArray(e), b.isObject(e[3]) && (e[3] = b.clone(e[3]))), c.Relational.eventQueue.add(function() {
i.apply(d, e);
});
} else i.apply(this, arguments);
return this;
}, c.RelationalModel.extend = function(a, b) {
var d = c.Model.extend.apply(this, arguments);
return d.setup(this), d;
};
})();

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var a = 0, b = this.container.children, c; c = b[a]; a++) if (c.fit && c.showing) return a;
},
getFitControl: function() {
var a = this.container.children, b = a[this.fitIndex];
return b && b.fit && b.showing || (this.fitIndex = this.calcFitIndex(), b = a[this.fitIndex]), b;
},
getLastControl: function() {
var a = this.container.children, b = a.length - 1, c = a[b];
while ((c = a[b]) && !c.showing) b--;
return c;
},
_reflow: function(a, b, c, d) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var e = this.getFitControl();
if (!e) return;
var f = 0, g = 0, h = 0, i, j = this.container.hasNode();
j && (i = enyo.FittableLayout.calcPaddingExtents(j), f = j[b] - (i[c] + i[d]));
var k = e.getBounds();
g = k[c] - (i && i[c] || 0);
var l = this.getLastControl();
if (l) {
var m = enyo.FittableLayout.getComputedStyleValue(l.hasNode(), "margin", d) || 0;
if (l != e) {
var n = l.getBounds(), o = k[c] + k[a], p = n[c] + n[a] + m;
h = p - o;
} else h = m;
}
var q = f - (g + h);
e.applyStyle(a, q + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
},
statics: {
_ieCssToPixelValue: function(a, b) {
var c = b, d = a.style, e = d.left, f = a.runtimeStyle && a.runtimeStyle.left;
return f && (a.runtimeStyle.left = a.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, f && (d.runtimeStyle.left = f), c;
},
_pxMatch: /px/i,
getComputedStyleValue: function(a, b, c, d) {
var e = d || enyo.dom.getComputedStyle(a);
if (e) return parseInt(e.getPropertyValue(b + "-" + c));
if (a && a.currentStyle) {
var f = a.currentStyle[b + enyo.cap(c)];
return f.match(this._pxMatch) || (f = this._ieCssToPixelValue(a, f)), parseInt(f);
}
return 0;
},
calcBoxExtents: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return {
top: this.getComputedStyleValue(a, b, "top", c),
right: this.getComputedStyleValue(a, b, "right", c),
bottom: this.getComputedStyleValue(a, b, "bottom", c),
left: this.getComputedStyleValue(a, b, "left", c)
};
},
calcPaddingExtents: function(a) {
return this.calcBoxExtents(a, "padding");
},
calcMarginExtents: function(a) {
return this.calcBoxExtents(a, "margin");
}
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
multiSelect: !1,
toggleSelected: !1
},
events: {
onSetupItem: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
setupItem: function(a) {
this.doSetupItem({
index: a,
selected: this.isSelected(a)
});
},
generateChildHtml: function() {
var a = "";
this.index = null;
for (var b = 0, c = 0; b < this.count; b++) c = this.rowOffset + (this.bottomUp ? this.count - b - 1 : b), this.setupItem(c), this.$.client.setAttribute("index", c), a += this.inherited(arguments), this.$.client.teardownRender();
return a;
},
previewDomEvent: function(a) {
var b = this.index = this.rowForEvent(a);
a.rowIndex = a.index = b, a.flyweight = this;
},
decorateEvent: function(a, b, c) {
var d = b && b.index != null ? b.index : this.index;
b && d != null && (b.index = d, b.flyweight = this), this.inherited(arguments);
},
tap: function(a, b) {
this.toggleSelected ? this.$.selection.toggle(b.index) : this.$.selection.select(b.index);
},
selectDeselect: function(a, b) {
this.renderRow(b.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(a) {
return this.getSelection().isSelected(a);
},
renderRow: function(a) {
var b = this.fetchRowNode(a);
b && (this.setupItem(a), b.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(a) {
if (this.hasNode()) {
var b = this.node.querySelectorAll('[index="' + a + '"]');
return b && b[0];
}
},
rowForEvent: function(a) {
var b = a.target, c = this.hasNode().id;
while (b && b.parentNode && b.id != c) {
var d = b.getAttribute && b.getAttribute("index");
if (d !== null) return Number(d);
b = b.parentNode;
}
return -1;
},
prepareRow: function(a) {
var b = this.fetchRowNode(a);
enyo.FlyweightRepeater.claimNode(this.$.client, b);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(a, b, c) {
b && (this.prepareRow(a), enyo.call(c || null, b), this.lockRow());
},
statics: {
claimNode: function(a, b) {
var c = b && b.querySelectorAll("#" + a.id);
c = c && c[0], a.generated = Boolean(c || !a.tag), a.node = c, a.node && a.rendered();
for (var d = 0, e = a.children, f; f = e[d]; d++) this.claimNode(f, b);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var a = 0; a < this.pageCount; a++) this.portSize += this.getPageHeight(a);
this.adjustPortSize();
},
generatePage: function(a, b) {
this.page = a;
var c = this.$.generator.rowOffset = this.rowsPerPage * this.page, d = this.$.generator.count = Math.min(this.count - c, this.rowsPerPage), e = this.$.generator.generateChildHtml();
b.setContent(e);
var f = b.getBounds().height;
!this.rowHeight && f > 0 && (this.rowHeight = Math.floor(f / d), this.updateMetrics());
if (!this.fixedHeight) {
var g = this.getPageHeight(a);
g != f && f > 0 && (this.pageHeights[a] = f, this.portSize += f - g);
}
},
update: function(a) {
var b = !1, c = this.positionToPageInfo(a), d = c.pos + this.scrollerHeight / 2, e = Math.floor(d / Math.max(c.height, this.scrollerHeight) + .5) + c.no, f = e % 2 == 0 ? e : e - 1;
this.p0 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page0), this.positionPage(f, this.$.page0), this.p0 = f, b = !0), f = e % 2 == 0 ? Math.max(1, e - 1) : e, this.p1 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page1), this.positionPage(f, this.$.page1), this.p1 = f, b = !0), b && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(a) {
this.update(this.calcPos(a));
},
calcPos: function(a) {
return this.bottomUp ? this.portSize - this.scrollerHeight - a : a;
},
adjustBottomPage: function() {
var a = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(a.pageNo, a);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var a = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", a + "px");
},
positionPage: function(a, b) {
b.pageNo = a;
var c = this.pageToPosition(a);
b.applyStyle(this.pageBound, c + "px");
},
pageToPosition: function(a) {
var b = 0, c = a;
while (c > 0) c--, b += this.getPageHeight(c);
return b;
},
positionToPageInfo: function(a) {
var b = -1, c = this.calcPos(a), d = this.defaultPageHeight;
while (c >= 0) b++, d = this.getPageHeight(b), c -= d;
return {
no: b,
height: d,
pos: c + d
};
},
isPageInRange: function(a) {
return a == Math.max(0, Math.min(this.pageCount - 1, a));
},
getPageHeight: function(a) {
return this.pageHeights[a] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(a, b) {
var c = this.inherited(arguments);
return this.update(this.getScrollTop()), c;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(a) {
this.update(a), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(a) {
this.setScrollTop(this.calcPos(a));
},
scrollToRow: function(a) {
var b = Math.floor(a / this.rowsPerPage), c = a % this.rowsPerPage, d = this.pageToPosition(b);
this.updateForPosition(d), d = this.pageToPosition(b), this.setScrollPosition(d);
if (b == this.p0 || b == this.p1) {
var e = this.$.generator.fetchRowNode(a);
if (e) {
var f = e.offsetTop;
this.bottomUp && (f = this.getPageHeight(b) - e.offsetHeight - f);
var g = this.getScrollPosition() + f;
this.setScrollPosition(g);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(a, b) {
return this.getSelection().select(a, b);
},
isSelected: function(a) {
return this.$.generator.isSelected(a);
},
renderRow: function(a) {
this.$.generator.renderRow(a);
},
prepareRow: function(a) {
this.$.generator.prepareRow(a);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(a, b, c) {
this.$.generator.performOnRow(a, b, c);
},
animateFinish: function(a) {
return this.twiddle(), !0;
},
twiddle: function() {
var a = this.getStrategy();
enyo.call(a, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScroll: "scrollHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var a = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, a), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(a, b) {
this.pully = b.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scrollHandler: function(a) {
this.completingPull && this.pully.setShowing(!1);
var b = this.getStrategy().$.scrollMath, c = b.y;
b.isInOverScroll() && c > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + c + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), c > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && c < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel()));
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var a = this.getStrategy().$.scrollMath;
a.setScrollY(a.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var a = this.getInitialStyleValue(this.hasNode(), this.boundary);
a.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return c ? c.getPropertyValue(b) : a && a.currentStyle ? a.currentStyle[b] : "0";
},
updateBounds: function(a, b) {
var c = {};
c[this.boundary] = a, this.setBounds(c, this.unit), this.setInlineStyles(a, b);
},
updateDragScalar: function() {
if (this.unit == "%") {
var a = this.getBounds()[this.dimension];
this.kDragScalar = a ? 100 / a : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var a = this.axis == "h";
this.dragMoveProp = a ? "dx" : "dy", this.shouldDragProp = a ? "horizontal" : "vertical", this.transform = a ? "translateX" : "translateY", this.dimension = a ? "width" : "height", this.boundary = a ? "left" : "top";
},
setInlineStyles: function(a, b) {
var c = {};
this.unitModifier ? (c[this.boundary] = this.percentToPixels(a, this.unitModifier), c[this.dimension] = this.unitModifier, this.setBounds(c)) : (b ? c[this.dimension] = b : c[this.boundary] = a, this.setBounds(c, this.unit));
},
valueChanged: function(a) {
var b = this.value;
this.isOob(b) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(b) : this.clampValue(b)), enyo.platform.android > 2 && (this.value ? (a === 0 || a === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(a) {
var b = this.calcMin(), c = this.calcMax();
return Math.max(b, Math.min(a, c));
},
dampValue: function(a) {
return this.dampBound(this.dampBound(a, this.min, 1), this.max, -1);
},
dampBound: function(a, b, c) {
var d = a;
return d * c < b * c && (d = b + (d - b) / 4), d;
},
percentToPixels: function(a, b) {
return Math.floor(b / 100 * a);
},
pixelsToPercent: function(a) {
var b = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return a / b * 100;
},
shouldDrag: function(a) {
return this.draggable && a[this.shouldDragProp];
},
isOob: function(a) {
return a > this.calcMax() || a < this.calcMin();
},
dragstart: function(a, b) {
if (this.shouldDrag(b)) return b.preventDefault(), this.$.animator.stop(), b.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(a, b) {
if (this.dragging) {
b.preventDefault();
var c = this.canTransform ? b[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(b[this.dragMoveProp]), d = this.drag0 + c, e = c - this.dragd0;
return this.dragd0 = c, e && (b.dragInfo.minimizing = e < 0), this.setValue(d), this.preventDragPropagation;
}
},
dragfinish: function(a, b) {
if (this.dragging) return this.dragging = !1, this.completeDrag(b), b.preventTap(), this.preventDragPropagation;
},
completeDrag: function(a) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(a.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(a, b) {
this.$.animator.play({
startValue: a,
endValue: b,
node: this.hasNode()
});
},
animateTo: function(a) {
this.play(this.value, a);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(a) {
a ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.doAnimateFinish(a), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c._arranger = null;
this.inherited(arguments);
},
arrange: function(a, b) {},
size: function() {},
start: function() {
var a = this.container.fromIndex, b = this.container.toIndex, c = this.container.transitionPoints = [ a ];
if (this.incrementalPoints) {
var d = Math.abs(b - a) - 2, e = a;
while (d >= 0) e += b < a ? -1 : 1, c.push(e), d--;
}
c.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(a) {
return a[this.canDragProp];
},
calcDragDirection: function(a) {
return a[this.dragDirectionProp];
},
calcDrag: function(a) {
return a[this.dragProp];
},
drag: function(a, b, c, d, e) {
var f = this.measureArrangementDelta(-a, b, c, d, e);
return f;
},
measureArrangementDelta: function(a, b, c, d, e) {
var f = this.calcArrangementDifference(b, c, d, e), g = f ? a / Math.abs(f) : 0;
return g *= this.container.fromIndex > this.container.toIndex ? -1 : 1, g;
},
calcArrangementDifference: function(a, b, c, d) {},
_arrange: function(a) {
var b = this.getOrderedControls(a);
this.arrange(b, a);
},
arrangeControl: function(a, b) {
a._arranger = enyo.mixin(a._arranger || {}, b);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) {
enyo.dom.accelerate(c, this.accelerated);
if (enyo.platform.safari) {
var d = c.children;
for (var e = 0, f; f = d[e]; e++) enyo.dom.accelerate(f, this.accelerated);
}
}
},
reflow: function() {
var a = this.container.hasNode();
this.containerBounds = a ? {
width: a.clientWidth,
height: a.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var a = this.container.arrangement;
if (a) for (var b = 0, c = this.container.getPanels(), d; d = c[b]; b++) this.flowControl(d, a[b]);
},
flowControl: function(a, b) {
enyo.Arranger.positionControl(a, b);
var c = b.opacity;
c != null && enyo.Arranger.opacifyControl(a, c);
},
getOrderedControls: function(a) {
var b = Math.floor(a), c = b - this.controlsIndex, d = c > 0, e = this.c$ || [];
for (var f = 0; f < Math.abs(c); f++) d ? e.push(e.shift()) : e.unshift(e.pop());
return this.controlsIndex = b, e;
},
statics: {
positionControl: function(a, b, c) {
var d = c || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var e = b.left, f = b.top, e = enyo.isString(e) ? e : e && e + d, f = enyo.isString(f) ? f : f && f + d;
enyo.dom.transform(a, {
translateX: e || null,
translateY: f || null
});
} else a.setBounds(b, c);
},
opacifyControl: function(a, b) {
var c = b;
c = c > .99 ? 1 : c < .01 ? 0 : c, enyo.platform.ie < 9 ? a.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + c * 100 + ")") : a.applyStyle("opacity", c);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(a, b, c, d) {
return this.containerBounds.width;
},
arrange: function(a, b) {
for (var c = 0, d, e, f; d = a[c]; c++) f = c == 0 ? 1 : 0, this.arrangeControl(d, {
opacity: f
});
},
start: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.opacifyControl(c, 1), c.showing || c.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
var e = this.container.fromIndex, b = this.container.toIndex;
this.container.transitionPoints = [ b + "." + e + ".s", b + "." + e + ".f" ];
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
arrange: function(a, b) {
var c = b.split("."), d = c[0], e = c[1], f = c[2] == "s", g = this.containerBounds.width;
for (var h = 0, i = this.container.getPanels(), j, k; j = i[h]; h++) k = g, e == h && (k = f ? 0 : -g), d == h && (k = f ? g : 0), e == h && e == d && (k = 0), this.arrangeControl(j, {
left: k
});
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var a = this.container.getPanels(), b = this.containerPadding = this.container.hasNode() ? enyo.FittableLayout.calcPaddingExtents(this.container.node) : {}, c = this.containerBounds;
c.height -= b.top + b.bottom, c.width -= b.left + b.right;
var d;
for (var e = 0, f = 0, g, h; h = a[e]; e++) g = enyo.FittableLayout.calcMarginExtents(h.hasNode()), h.width = h.getBounds().width, h.marginWidth = g.right + g.left, f += (h.fit ? 0 : h.width) + h.marginWidth, h.fit && (d = h);
if (d) {
var i = c.width - f;
d.width = i >= 0 ? i : d.width;
}
for (var e = 0, j = b.left, g, h; h = a[e]; e++) h.setBounds({
top: b.top,
bottom: b.bottom,
width: h.fit ? h.width : null
});
},
arrange: function(a, b) {
this.container.wrap ? this.arrangeWrap(a, b) : this.arrangeNoWrap(a, b);
},
arrangeNoWrap: function(a, b) {
var c = this.container.getPanels(), d = this.container.clamp(b), e = this.containerBounds.width;
for (var f = d, g = 0, h; h = c[f]; f++) {
g += h.width + h.marginWidth;
if (g > e) break;
}
var i = e - g, j = 0;
if (i > 0) {
var k = d;
for (var f = d - 1, l = 0, h; h = c[f]; f--) {
l += h.width + h.marginWidth;
if (i - l <= 0) {
j = i - l, d = f;
break;
}
}
}
for (var f = 0, m = this.containerPadding.left + j, n, h; h = c[f]; f++) n = h.width + h.marginWidth, f < d ? this.arrangeControl(h, {
left: -n
}) : (this.arrangeControl(h, {
left: Math.floor(m)
}), m += n);
},
arrangeWrap: function(a, b) {
for (var c = 0, d = this.containerPadding.left, e, f; f = a[c]; c++) this.arrangeControl(f, {
left: d
}), d += f.width + f.marginWidth;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e].left - d[e].left;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("top", null), c.applyStyle("bottom", null), c.applyStyle("left", null), c.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) c._fit && a != b.length - 1 && (c.applyStyle("width", null), c._fit = null);
},
arrange: function(a, b) {
var c = this.container.getPanels();
for (var d = 0, e = this.containerPadding.left, f, g; g = c[d]; d++) this.arrangeControl(g, {
left: e
}), d >= b && (e += g.width + g.marginWidth), d == c.length - 1 && b < 0 && this.arrangeControl(g, {
left: e - b
});
},
calcArrangementDifference: function(a, b, c, d) {
var e = this.container.getPanels().length - 1;
return Math.abs(d[e].left - b[e].left);
},
flowControl: function(a, b) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var c = this.container.getPanels(), d = c.length - 1, e = c[d];
a == e && this.fitControl(a, b.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var a = this.container.getPanels(), b = this.container.arrangement, c = a.length - 1, d = a[c];
this.fitControl(d, b[c].left);
}
},
fitControl: function(a, b) {
a._fit = !0, a.applyStyle("width", this.containerBounds.width - b + "px"), a.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var a = this.container.getPanels(), b = this.containerBounds[this.axisSize], c = b - this.margin - this.margin;
for (var d = 0, e, f; f = a[d]; d++) e = {}, e[this.axisSize] = c, e[this.offAxisSize] = "100%", f.setBounds(e);
},
arrange: function(a, b) {
var c = Math.floor(this.container.getPanels().length / 2), d = this.getOrderedControls(Math.floor(b) - c), e = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - e * c, g = (d.length - 1) / 2;
for (var h = 0, i, j, k; i = d[h]; h++) j = {}, j[this.axisPosition] = f, j.opacity = h == 0 || h == d.length - 1 ? 0 : 1, this.arrangeControl(i, j), f += e;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e][this.axisPosition] - d[e][this.axisPosition];
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(c, 1), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var a = this.container.getPanels(), b = this.containerBounds, c = this.controlWidth = b.width / 3, d = this.controlHeight = b.height / 3;
for (var e = 0, f; f = a[e]; e++) f.setBounds({
width: c,
height: d
});
},
arrange: function(a, b) {
var c = this.inc;
for (var d = 0, e = a.length, f; f = a[d]; d++) {
var g = Math.cos(d / e * 2 * Math.PI) * d * c + this.controlWidth, h = Math.sin(d / e * 2 * Math.PI) * d * c + this.controlHeight;
this.arrangeControl(f, {
left: g,
top: h
});
}
},
start: function() {
this.inherited(arguments);
var a = this.getOrderedControls(this.container.toIndex);
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", a.length - b);
},
calcArrangementDifference: function(a, b, c, d) {
return this.controlWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", null), enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var a = this.container.getPanels(), b = this.colWidth, c = this.colHeight;
for (var d = 0, e; e = a[d]; d++) e.setBounds({
width: b,
height: c
});
},
arrange: function(a, b) {
var c = this.colWidth, d = this.colHeight, e = Math.floor(this.containerBounds.width / c), f;
for (var g = 0, h = 0; h < a.length; g++) for (var i = 0; i < e && (f = a[h]); i++, h++) this.arrangeControl(f, {
left: c * i,
top: d * g
});
},
flowControl: function(a, b) {
this.inherited(arguments), enyo.Arranger.opacifyControl(a, b.top % this.colHeight != 0 ? .25 : 1);
},
calcArrangementDifference: function(a, b, c, d) {
return this.colWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.avoidFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
avoidFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(a) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(a) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var a = this.controlParent || this;
return a.children;
},
getActive: function() {
var a = this.getPanels();
return a[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(a) {
this.setPropertyValue("index", a, "indexChanged");
},
setIndexDirect: function(a) {
this.setIndex(a), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(a) {
var b = this.getPanels().length - 1;
return this.wrap ? a : Math.max(0, Math.min(a, b));
},
indexChanged: function(a) {
this.lastIndex = a, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(a) {
this.fraction = a.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(a, b) {
if (this.draggable && this.layout && this.layout.canDragEvent(b)) return b.preventDefault(), this.dragstartTransition(b), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(a, b) {
this.dragging && (b.preventDefault(), this.dragTransition(b));
},
dragfinish: function(a, b) {
this.dragging && (this.dragging = !1, b.preventTap(), this.dragfinishTransition(b));
},
dragstartTransition: function(a) {
if (!this.$.animator.isAnimating()) {
var b = this.fromIndex = this.index;
this.toIndex = b - (this.layout ? this.layout.calcDragDirection(a) : 0);
} else this.verifyDragTransition(a);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(a) {
var b = this.layout ? this.layout.calcDrag(a) : 0, c = this.transitionPoints, d = c[0], e = c[c.length - 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e), h = this.layout ? this.layout.drag(b, d, f, e, g) : 0, i = b && !h;
!i, this.fraction += h;
var j = this.fraction;
if (j > 1 || j < 0 || i) (j > 0 || i) && this.dragfinishTransition(a), this.dragstartTransition(a), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(a) {
this.verifyDragTransition(a), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(a) {
var b = this.layout ? this.layout.calcDragDirection(a) : 0, c = Math.min(this.fromIndex, this.toIndex), d = Math.max(this.fromIndex, this.toIndex);
if (b > 0) {
var e = c;
c = d, d = e;
}
c != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = c, this.toIndex = d;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var a = this.startTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.fromIndex || a.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var a = this.finishTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.lastIndex || a.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var a = this.transitionPoints, b = (this.fraction || 0) * (a.length - 1), c = Math.floor(b);
b -= c;
var d = a[c], e = a[c + 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e);
this.arrangement = f && g ? enyo.Panels.lerp(f, g, b) : f || g, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(a) {
return a != null && !this.arrangements[a] && this.layout && (this.layout._arrange(a), this.arrangements[a] = this.readArrangement(this.getPanels())), this.arrangements[a];
},
readArrangement: function(a) {
var b = [];
for (var c = 0, d = a, e; e = d[c]; c++) b.push(enyo.clone(e._arranger));
return b;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(a, b, c) {
var d = [];
for (var e = 0, f = enyo.keys(a), g; g = f[e]; e++) d.push(this.lerpObject(a[g], b[g], c));
return d;
},
lerpObject: function(a, b, c) {
var d = enyo.clone(a), e, f;
if (b) for (var g in a) e = a[g], f = b[g], e != f && (d[g] = e - (e - f) * c);
return d;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent(c);
this.$.client.render();
},
addTextNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent({
content: c
});
this.$.client.render();
},
tap: function(a, b) {
return this.onlyIconExpands ? b.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(a, b) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var a = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -a
});
},
_expand: function() {
this.addClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -a
});
}), 25);
},
expandedChanged: function(a) {
if (!this.expandable) this.expanded = !1; else {
var b = {
expanded: this.expanded
};
this.doExpand(b), b.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: ""
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged();
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(a, b) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(a, b) {
return !this.disabled;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v"
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var a = this.orient == "v", b = a ? "height" : "width", c = a ? "top" : "left";
this.applyStyle(b, null);
var d = this.hasNode()[a ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : d,
endValue: this.open ? d : 0,
dimension: b,
position: c
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(a) {
if (this.hasNode()) {
var b = a.dimension;
this.node.style[b] = this.domStyles[b] = a.value + "px";
}
var c = this.$.client.hasNode();
if (c) {
var d = a.position, e = this.open ? a.endValue : a.startValue;
c.style[d] = this.$.client.domStyles[d] = a.value - e + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
this.open || this.$.client.hide(), this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(a) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var b = this.getScrim();
if (a) {
var c = this.getScrimZIndex();
this._scrimZ = c, b.showAtZIndex(c);
} else b.hideAtZIndex(this._scrimZ);
enyo.call(b, "addRemoveClass", [ this.scrimClassName, b.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var a = this.defaultZ;
return this._zIndex ? a = this._zIndex : this.hasNode() && (a = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || a), this._zIndex = a;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
receiveFocus: function() {
this.addClass("onyx-focused");
},
receiveBlur: function() {
this.removeClass("onyx-focused");
},
disabledChange: function(a, b) {
this.addRemoveClass("onyx-disabled", b.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(a, b) {
this.requestHideTooltip(), b.originator.active && (this.menuActive = !0, this.activator = b.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(a) {
this.menuActive || this.inherited(arguments);
},
leave: function(a, b) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
showOnTop: !1,
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
itemActivated: function(a, b) {
return b.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestMenuShow: function(a, b) {
if (this.floating) {
var c = b.activator.hasNode();
if (c) {
var d = this.activatorOffset = this.getPageOffset(c);
this.applyPosition({
top: d.top + (this.showOnTop ? 0 : d.height),
left: d.left,
width: d.width
});
}
}
return this.show(), !0;
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
getPageOffset: function(a) {
var b = a.getBoundingClientRect(), c = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, d = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, e = b.height === undefined ? b.bottom - b.top : b.height, f = b.width === undefined ? b.right - b.left : b.width;
return {
top: b.top + c,
left: b.left + d,
height: e,
width: f
};
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var b = this.node.getBoundingClientRect(), c = b.height === undefined ? b.bottom - b.top : b.height, d = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, e = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = b.top + c > d && d - b.bottom < b.top - c, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var f = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: f.top - c + (this.showOnTop ? f.height : 0),
bottom: "auto"
}) : b.top < f.top && f.top + (a ? f.height : 0) + c < d && this.applyPosition({
top: f.top + (this.showOnTop ? 0 : f.height),
bottom: "auto"
});
}
b.right > e && (this.floating ? this.applyPosition({
left: f.left - (b.left + b.width - e)
}) : this.applyPosition({
left: -(b.right - e)
}));
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
tag: "div",
classes: "onyx-menu-item",
events: {
onSelect: ""
},
tap: function(a) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(a, b) {
this.waterfallDown("onChange", b);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(a, b) {
this.setContent(b.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null,
maxHeight: "200px"
},
events: {
onChange: ""
},
components: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
floating: !0,
showOnTop: !0,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.getScroller().setMaxHeight(this.maxHeight);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(a, b) {
return this.processActivatedItem(b.originator), this.inherited(arguments);
},
processActivatedItem: function(a) {
a.active && this.setSelected(a);
},
selectedChanged: function(a) {
a && a.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!1);
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "client",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var a = this.$.client.fetchRowNode(this.selected);
this.getScroller().scrollToNode(a, !this.menuUp);
},
countChanged: function() {
this.$.client.count = this.count;
},
processActivatedItem: function(a) {
this.item = a;
},
selectedChanged: function(a) {
if (!this.item) return;
a !== undefined && (this.item.removeClass("selected"), this.$.client.renderRow(a)), this.item.addClass("selected"), this.$.client.renderRow(this.selected), this.item.removeClass("selected");
var b = this.$.client.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: b && b.textContent || this.item.content
});
},
itemTap: function(a, b) {
this.setSelected(b.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(a, b) {
if (b.originator != this) return !0;
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
highlander: !0,
defaultKind: "onyx.RadioButton"
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(a) {
this.disabled || (this.setValue(a), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = b.dx;
return Math.abs(c) > 10 && (this.updateValue(c > 0), this.dragged = !0), !0;
}
},
dragfinish: function(a, b) {
this.dragging = !1, this.dragged && b.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
handlers: {
onHide: "render"
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(a) {
this.$.bar.removeClass(a), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var a = this.calcPercent(this.progress);
this.updateBarPosition(a);
},
clampValue: function(a, b, c) {
return Math.max(a, Math.min(c, b));
},
calcRatio: function(a) {
return (a - this.min) / (this.max - this.min);
},
calcPercent: function(a) {
return this.calcRatio(a) * 100;
},
updateBarPosition: function(a) {
this.$.bar.applyStyle("width", a + "%");
},
animateProgressTo: function(a) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: a,
node: this.hasNode()
});
},
progressAnimatorStep: function(a) {
return this.setProgress(a.value), !0;
},
progressAnimatorComplete: function(a) {
return this.doAnimateProgressFinish(a), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(a) {
enyo.indexOf(a, this.zStack) < 0 && this.zStack.push(a);
},
removeZIndex: function(a) {
enyo.remove(a, this.zStack);
},
showAtZIndex: function(a) {
this.addZIndex(a), a !== undefined && this.setZIndex(a), this.show();
},
hideAtZIndex: function(a) {
this.removeZIndex(a);
if (!this.zStack.length) this.hide(); else {
var b = this.zStack[this.zStack.length - 1];
this.setZIndex(b);
}
},
setZIndex: function(a) {
this.zIndex = a, this.applyStyle("z-index", a);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(a, b) {
this.instanceName = a, enyo.setObject(this.instanceName, this), this.props = b || {};
},
make: function() {
var a = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, a), a;
},
showAtZIndex: function(a) {
var b = this.make();
b.showAtZIndex(a);
},
hideAtZIndex: enyo.nop,
show: function() {
var a = this.make();
a.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var a = this.calcPercent(this.value);
this.updateKnobPosition(a), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(a) {
this.$.knob.applyStyle("left", a + "%");
},
calcKnobPosition: function(a) {
var b = a.clientX - this.hasNode().getBoundingClientRect().left;
return b / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = this.calcKnobPosition(b);
return this.setValue(c), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(a, b) {
return this.dragging = !1, b.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(a, b) {
if (this.tappable) {
var c = this.calcKnobPosition(b);
return this.tapped = !0, this.animateTo(c), !0;
}
},
animateTo: function(a) {
this.$.animator.play({
startValue: this.value,
endValue: a,
node: this.hasNode()
});
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(a), !0;
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(a, b) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
release: function(a, b) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
statics: {
addFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.setClassAttribute(a.getClassAttribute()) : a.addClass(b);
}), a.removeClass(b);
}
},
removeFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.removeClass(b) : a.setClassAttribute(a.getClassAttribute());
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
tools: [ {
name: "client",
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(a, b) {
this.addRemoveClass("active", b.originator.active);
},
popItem: function() {
var a = this.findCollapsibleItem();
if (a) {
this.movedClass && this.movedClass.length > 0 && !a.hasClass(this.movedClass) && a.addClass(this.movedClass), this.$.menu.addChild(a);
var b = this.$.menu.hasNode();
return b && a.hasNode() && a.insertNodeInParent(b), !0;
}
},
pushItem: function() {
var a = this.$.menu.children, b = a[0];
if (b) {
this.movedClass && this.movedClass.length > 0 && b.hasClass(this.movedClass) && b.removeClass(this.movedClass), this.$.client.addChild(b);
var c = this.$.client.hasNode();
if (c && b.hasNode()) {
var d = undefined, e;
for (var f = 0; f < this.$.client.children.length; f++) {
var g = this.$.client.children[f];
if (g.toolbarIndex != undefined && g.toolbarIndex != f) {
d = g, e = f;
break;
}
}
if (d && d.hasNode()) {
b.insertNodeInParent(c, d.node);
var h = this.$.client.children.pop();
this.$.client.children.splice(e, 0, h);
} else b.appendNodeToParent(c);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var a = this.$.client.children, b = a[a.length - 1].hasNode();
if (b) return b.offsetLeft + b.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var a = this.$.client.children;
for (var b = a.length - 1; c = a[b]; b--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = b);
}
}
});

// lib/globalize.js

(function(a, b) {
var c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
c = function(a) {
return new c.prototype.init(a);
}, typeof require != "undefined" && typeof exports != "undefined" && typeof module != "undefined" ? module.exports = c : a.Globalize = c, c.cultures = {}, c.prototype = {
constructor: c,
init: function(a) {
return this.cultures = c.cultures, this.cultureSelector = a, this;
}
}, c.prototype.init.prototype = c.prototype, c.cultures["default"] = {
name: "en",
englishName: "English",
nativeName: "English",
isRTL: !1,
language: "en",
numberFormat: {
pattern: [ "-n" ],
decimals: 2,
",": ",",
".": ".",
groupSizes: [ 3 ],
"+": "+",
"-": "-",
NaN: "NaN",
negativeInfinity: "-Infinity",
positiveInfinity: "Infinity",
percent: {
pattern: [ "-n %", "n %" ],
decimals: 2,
groupSizes: [ 3 ],
",": ",",
".": ".",
symbol: "%"
},
currency: {
pattern: [ "($n)", "$n" ],
decimals: 2,
groupSizes: [ 3 ],
",": ",",
".": ".",
symbol: "$"
}
},
calendars: {
standard: {
name: "Gregorian_USEnglish",
"/": "/",
":": ":",
firstDay: 0,
days: {
names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
},
months: {
names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
},
AM: [ "AM", "am", "AM" ],
PM: [ "PM", "pm", "PM" ],
eras: [ {
name: "A.D.",
start: null,
offset: 0
} ],
twoDigitYearMax: 2029,
patterns: {
d: "M/d/yyyy",
D: "dddd, MMMM dd, yyyy",
t: "h:mm tt",
T: "h:mm:ss tt",
f: "dddd, MMMM dd, yyyy h:mm tt",
F: "dddd, MMMM dd, yyyy h:mm:ss tt",
M: "MMMM dd",
Y: "yyyy MMMM",
S: "yyyy'-'MM'-'dd'T'HH':'mm':'ss"
}
}
},
messages: {}
}, c.cultures["default"].calendar = c.cultures["default"].calendars.standard, c.cultures.en = c.cultures["default"], c.cultureSelector = "en", d = /^0x[a-f0-9]+$/i, e = /^[+\-]?infinity$/i, f = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/, g = /^\s+|\s+$/g, h = function(a, b) {
if (a.indexOf) return a.indexOf(b);
for (var c = 0, d = a.length; c < d; c++) if (a[c] === b) return c;
return -1;
}, i = function(a, b) {
return a.substr(a.length - b.length) === b;
}, j = function() {
var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, n = arguments.length, o = !1;
typeof h == "boolean" && (o = h, h = arguments[1] || {}, i = 2), typeof h != "object" && !l(h) && (h = {});
for (; i < n; i++) if ((a = arguments[i]) != null) for (c in a) {
d = h[c], e = a[c];
if (h === e) continue;
o && e && (m(e) || (f = k(e))) ? (f ? (f = !1, g = d && k(d) ? d : []) : g = d && m(d) ? d : {}, h[c] = j(o, g, e)) : e !== b && (h[c] = e);
}
return h;
}, k = Array.isArray || function(a) {
return Object.prototype.toString.call(a) === "[object Array]";
}, l = function(a) {
return Object.prototype.toString.call(a) === "[object Function]";
}, m = function(a) {
return Object.prototype.toString.call(a) === "[object Object]";
}, n = function(a, b) {
return a.indexOf(b) === 0;
}, o = function(a) {
return (a + "").replace(g, "");
}, p = function(a) {
return isNaN(a) ? NaN : Math[a < 0 ? "ceil" : "floor"](a);
}, q = function(a, b, c) {
var d;
for (d = a.length; d < b; d += 1) a = c ? "0" + a : a + "0";
return a;
}, r = function(a, b) {
var c = 0, d = !1;
for (var e = 0, f = a.length; e < f; e++) {
var g = a.charAt(e);
switch (g) {
case "'":
d ? b.push("'") : c++, d = !1;
break;
case "\\":
d && b.push("\\"), d = !d;
break;
default:
b.push(g), d = !1;
}
}
return c;
}, s = function(a, b) {
b = b || "F";
var c, d = a.patterns, e = b.length;
if (e === 1) {
c = d[b];
if (!c) throw "Invalid date format string '" + b + "'.";
b = c;
} else e === 2 && b.charAt(0) === "%" && (b = b.charAt(1));
return b;
}, t = function(a, b, c) {
function y(a, b) {
var c, d = a + "";
return b > 1 && d.length < b ? (c = l[b - 2] + d, c.substr(c.length - b, b)) : (c = d, c);
}
function z() {
return m || n ? m : (m = o.test(b), n = !0, m);
}
function A(a, b) {
if (u) return u[b];
switch (b) {
case 0:
return a.getFullYear();
case 1:
return a.getMonth();
case 2:
return a.getDate();
default:
throw "Invalid part value " + b;
}
}
var d = c.calendar, e = d.convert, f;
if (!b || !b.length || b === "i") {
if (c && c.name.length) if (e) f = t(a, d.patterns.F, c); else {
var g = new Date(a.getTime()), h = w(a, d.eras);
g.setFullYear(x(a, d, h)), f = g.toLocaleString();
} else f = a.toString();
return f;
}
var i = d.eras, j = b === "s";
b = s(d, b), f = [];
var k, l = [ "0", "00", "000" ], m, n, o = /([^d]|^)(d|dd)([^d]|$)/g, p = 0, q = v(), u;
!j && e && (u = e.fromGregorian(a));
for (;;) {
var B = q.lastIndex, C = q.exec(b), D = b.slice(B, C ? C.index : b.length);
p += r(D, f);
if (!C) break;
if (p % 2) {
f.push(C[0]);
continue;
}
var E = C[0], F = E.length;
switch (E) {
case "ddd":
case "dddd":
var G = F === 3 ? d.days.namesAbbr : d.days.names;
f.push(G[a.getDay()]);
break;
case "d":
case "dd":
m = !0, f.push(y(A(a, 2), F));
break;
case "MMM":
case "MMMM":
var H = A(a, 1);
f.push(d.monthsGenitive && z() ? d.monthsGenitive[F === 3 ? "namesAbbr" : "names"][H] : d.months[F === 3 ? "namesAbbr" : "names"][H]);
break;
case "M":
case "MM":
f.push(y(A(a, 1) + 1, F));
break;
case "y":
case "yy":
case "yyyy":
H = u ? u[0] : x(a, d, w(a, i), j), F < 4 && (H %= 100), f.push(y(H, F));
break;
case "h":
case "hh":
k = a.getHours() % 12, k === 0 && (k = 12), f.push(y(k, F));
break;
case "H":
case "HH":
f.push(y(a.getHours(), F));
break;
case "m":
case "mm":
f.push(y(a.getMinutes(), F));
break;
case "s":
case "ss":
f.push(y(a.getSeconds(), F));
break;
case "t":
case "tt":
H = a.getHours() < 12 ? d.AM ? d.AM[0] : " " : d.PM ? d.PM[0] : " ", f.push(F === 1 ? H.charAt(0) : H);
break;
case "f":
case "ff":
case "fff":
f.push(y(a.getMilliseconds(), 3).substr(0, F));
break;
case "z":
case "zz":
k = a.getTimezoneOffset() / 60, f.push((k <= 0 ? "+" : "-") + y(Math.floor(Math.abs(k)), F));
break;
case "zzz":
k = a.getTimezoneOffset() / 60, f.push((k <= 0 ? "+" : "-") + y(Math.floor(Math.abs(k)), 2) + ":" + y(Math.abs(a.getTimezoneOffset() % 60), 2));
break;
case "g":
case "gg":
d.eras && f.push(d.eras[w(a, i)].name);
break;
case "/":
f.push(d["/"]);
break;
default:
throw "Invalid date format pattern '" + E + "'.";
}
}
return f.join("");
}, function() {
var a;
a = function(a, b, c) {
var d = c.groupSizes, e = d[0], f = 1, g = Math.pow(10, b), h = Math.round(a * g) / g;
isFinite(h) || (h = a), a = h;
var i = a + "", j = "", k = i.split(/e/i), l = k.length > 1 ? parseInt(k[1], 10) : 0;
i = k[0], k = i.split("."), i = k[0], j = k.length > 1 ? k[1] : "";
var m;
l > 0 ? (j = q(j, l, !1), i += j.slice(0, l), j = j.substr(l)) : l < 0 && (l = -l, i = q(i, l + 1, !0), j = i.slice(-l, i.length) + j, i = i.slice(0, -l)), b > 0 ? j = c["."] + (j.length > b ? j.slice(0, b) : q(j, b)) : j = "";
var n = i.length - 1, o = c[","], p = "";
while (n >= 0) {
if (e === 0 || e > n) return i.slice(0, n + 1) + (p.length ? o + p + j : j);
p = i.slice(n - e + 1, n + 1) + (p.length ? o + p : ""), n -= e, f < d.length && (e = d[f], f++);
}
return i.slice(0, n + 1) + o + p + j;
}, u = function(b, c, d) {
if (!isFinite(b)) return b === Infinity ? d.numberFormat.positiveInfinity : b === -Infinity ? d.numberFormat.negativeInfinity : d.numberFormat.NaN;
if (!c || c === "i") return d.name.length ? b.toLocaleString() : b.toString();
c = c || "D";
var e = d.numberFormat, f = Math.abs(b), g = -1, h;
c.length > 1 && (g = parseInt(c.slice(1), 10));
var i = c.charAt(0).toUpperCase(), j;
switch (i) {
case "D":
h = "n", f = p(f), g !== -1 && (f = q("" + f, g, !0)), b < 0 && (f = "-" + f);
break;
case "N":
j = e;
case "C":
j = j || e.currency;
case "P":
j = j || e.percent, h = b < 0 ? j.pattern[0] : j.pattern[1] || "n", g === -1 && (g = j.decimals), f = a(f * (i === "P" ? 100 : 1), g, j);
break;
default:
throw "Bad number format specifier: " + i;
}
var k = /n|\$|-|%/g, l = "";
for (;;) {
var m = k.lastIndex, n = k.exec(h);
l += h.slice(m, n ? n.index : h.length);
if (!n) break;
switch (n[0]) {
case "n":
l += f;
break;
case "$":
l += e.currency.symbol;
break;
case "-":
/[1-9]/.test(f) && (l += e["-"]);
break;
case "%":
l += e.percent.symbol;
}
}
return l;
};
}(), v = function() {
return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}, w = function(a, b) {
if (!b) return 0;
var c, d = a.getTime();
for (var e = 0, f = b.length; e < f; e++) {
c = b[e].start;
if (c === null || d >= c) return e;
}
return 0;
}, x = function(a, b, c, d) {
var e = a.getFullYear();
return !d && b.eras && (e -= b.eras[c].offset), e;
}, function() {
var a, b, c, d, e, f, g;
a = function(a, b) {
if (b < 100) {
var c = new Date, d = w(c), e = x(c, a, d), f = a.twoDigitYearMax;
f = typeof f == "string" ? (new Date).getFullYear() % 100 + parseInt(f, 10) : f, b += e - e % 100, b > f && (b -= 100);
}
return b;
}, b = function(a, b, c) {
var d, e = a.days, i = a._upperDays;
return i || (a._upperDays = i = [ g(e.names), g(e.namesAbbr), g(e.namesShort) ]), b = f(b), c ? (d = h(i[1], b), d === -1 && (d = h(i[2], b))) : d = h(i[0], b), d;
}, c = function(a, b, c) {
var d = a.months, e = a.monthsGenitive || a.months, i = a._upperMonths, j = a._upperMonthsGen;
i || (a._upperMonths = i = [ g(d.names), g(d.namesAbbr) ], a._upperMonthsGen = j = [ g(e.names), g(e.namesAbbr) ]), b = f(b);
var k = h(c ? i[1] : i[0], b);
return k < 0 && (k = h(c ? j[1] : j[0], b)), k;
}, d = function(a, b) {
var c = a._parseRegExp;
if (!c) a._parseRegExp = c = {}; else {
var d = c[b];
if (d) return d;
}
var e = s(a, b).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), f = [ "^" ], g = [], h = 0, i = 0, j = v(), k;
while ((k = j.exec(e)) !== null) {
var l = e.slice(h, k.index);
h = j.lastIndex, i += r(l, f);
if (i % 2) {
f.push(k[0]);
continue;
}
var m = k[0], n = m.length, o;
switch (m) {
case "dddd":
case "ddd":
case "MMMM":
case "MMM":
case "gg":
case "g":
o = "(\\D+)";
break;
case "tt":
case "t":
o = "(\\D*)";
break;
case "yyyy":
case "fff":
case "ff":
case "f":
o = "(\\d{" + n + "})";
break;
case "dd":
case "d":
case "MM":
case "M":
case "yy":
case "y":
case "HH":
case "H":
case "hh":
case "h":
case "mm":
case "m":
case "ss":
case "s":
o = "(\\d\\d?)";
break;
case "zzz":
o = "([+-]?\\d\\d?:\\d{2})";
break;
case "zz":
case "z":
o = "([+-]?\\d\\d?)";
break;
case "/":
o = "(\\/)";
break;
default:
throw "Invalid date format pattern '" + m + "'.";
}
o && f.push(o), g.push(k[0]);
}
r(e.slice(h), f), f.push("$");
var p = f.join("").replace(/\s+/g, "\\s+"), q = {
regExp: p,
groups: g
};
return c[b] = q;
}, e = function(a, b, c) {
return a < b || a > c;
}, f = function(a) {
return a.split("\u00a0").join(" ").toUpperCase();
}, g = function(a) {
var b = [];
for (var c = 0, d = a.length; c < d; c++) b[c] = f(a[c]);
return b;
}, y = function(f, g, h) {
f = o(f);
var i = h.calendar, j = d(i, g), k = (new RegExp(j.regExp)).exec(f);
if (k === null) return null;
var l = j.groups, m = null, p = null, q = null, r = null, s = null, t = 0, u, v = 0, w = 0, x = 0, y = null, z = !1;
for (var A = 0, B = l.length; A < B; A++) {
var C = k[A + 1];
if (C) {
var D = l[A], E = D.length, F = parseInt(C, 10);
switch (D) {
case "dd":
case "d":
r = F;
if (e(r, 1, 31)) return null;
break;
case "MMM":
case "MMMM":
q = c(i, C, E === 3);
if (e(q, 0, 11)) return null;
break;
case "M":
case "MM":
q = F - 1;
if (e(q, 0, 11)) return null;
break;
case "y":
case "yy":
case "yyyy":
p = E < 4 ? a(i, F) : F;
if (e(p, 0, 9999)) return null;
break;
case "h":
case "hh":
t = F, t === 12 && (t = 0);
if (e(t, 0, 11)) return null;
break;
case "H":
case "HH":
t = F;
if (e(t, 0, 23)) return null;
break;
case "m":
case "mm":
v = F;
if (e(v, 0, 59)) return null;
break;
case "s":
case "ss":
w = F;
if (e(w, 0, 59)) return null;
break;
case "tt":
case "t":
z = i.PM && (C === i.PM[0] || C === i.PM[1] || C === i.PM[2]);
if (!z && (!i.AM || C !== i.AM[0] && C !== i.AM[1] && C !== i.AM[2])) return null;
break;
case "f":
case "ff":
case "fff":
x = F * Math.pow(10, 3 - E);
if (e(x, 0, 999)) return null;
break;
case "ddd":
case "dddd":
s = b(i, C, E === 3);
if (e(s, 0, 6)) return null;
break;
case "zzz":
var G = C.split(/:/);
if (G.length !== 2) return null;
u = parseInt(G[0], 10);
if (e(u, -12, 13)) return null;
var H = parseInt(G[1], 10);
if (e(H, 0, 59)) return null;
y = u * 60 + (n(C, "-") ? -H : H);
break;
case "z":
case "zz":
u = F;
if (e(u, -12, 13)) return null;
y = u * 60;
break;
case "g":
case "gg":
var I = C;
if (!I || !i.eras) return null;
I = o(I.toLowerCase());
for (var J = 0, K = i.eras.length; J < K; J++) if (I === i.eras[J].name.toLowerCase()) {
m = J;
break;
}
if (m === null) return null;
}
}
}
var L = new Date, M, N = i.convert;
M = N ? N.fromGregorian(L)[0] : L.getFullYear(), p === null ? p = M : i.eras && (p += i.eras[m || 0].offset), q === null && (q = 0), r === null && (r = 1);
if (N) {
L = N.toGregorian(p, q, r);
if (L === null) return null;
} else {
L.setFullYear(p, q, r);
if (L.getDate() !== r) return null;
if (s !== null && L.getDay() !== s) return null;
}
z && t < 12 && (t += 12), L.setHours(t, v, w, x);
if (y !== null) {
var O = L.getMinutes() - (y + L.getTimezoneOffset());
L.setHours(L.getHours() + parseInt(O / 60, 10), O % 60);
}
return L;
};
}(), z = function(a, b, c) {
var d = b["-"], e = b["+"], f;
switch (c) {
case "n -":
d = " " + d, e = " " + e;
case "n-":
i(a, d) ? f = [ "-", a.substr(0, a.length - d.length) ] : i(a, e) && (f = [ "+", a.substr(0, a.length - e.length) ]);
break;
case "- n":
d += " ", e += " ";
case "-n":
n(a, d) ? f = [ "-", a.substr(d.length) ] : n(a, e) && (f = [ "+", a.substr(e.length) ]);
break;
case "(n)":
n(a, "(") && i(a, ")") && (f = [ "-", a.substr(1, a.length - 2) ]);
}
return f || [ "", a ];
}, c.prototype.findClosestCulture = function(a) {
return c.findClosestCulture.call(this, a);
}, c.prototype.format = function(a, b, d) {
return c.format.call(this, a, b, d);
}, c.prototype.localize = function(a, b) {
return c.localize.call(this, a, b);
}, c.prototype.parseInt = function(a, b, d) {
return c.parseInt.call(this, a, b, d);
}, c.prototype.parseFloat = function(a, b, d) {
return c.parseFloat.call(this, a, b, d);
}, c.prototype.culture = function(a) {
return c.culture.call(this, a);
}, c.addCultureInfo = function(a, b, c) {
var d = {}, e = !1;
typeof a != "string" ? (c = a, a = this.culture().name, d = this.cultures[a]) : typeof b != "string" ? (c = b, e = this.cultures[a] == null, d = this.cultures[a] || this.cultures["default"]) : (e = !0, d = this.cultures[b]), this.cultures[a] = j(!0, {}, d, c), e && (this.cultures[a].calendar = this.cultures[a].calendars.standard);
}, c.findClosestCulture = function(a) {
var b;
if (!a) return this.findClosestCulture(this.cultureSelector) || this.cultures["default"];
typeof a == "string" && (a = a.split(","));
if (k(a)) {
var c, d = this.cultures, e = a, f, g = e.length, h = [];
for (f = 0; f < g; f++) {
a = o(e[f]);
var i, j = a.split(";");
c = o(j[0]), j.length === 1 ? i = 1 : (a = o(j[1]), a.indexOf("q=") === 0 ? (a = a.substr(2), i = parseFloat(a), i = isNaN(i) ? 0 : i) : i = 1), h.push({
lang: c,
pri: i
});
}
h.sort(function(a, b) {
return a.pri < b.pri ? 1 : a.pri > b.pri ? -1 : 0;
});
for (f = 0; f < g; f++) {
c = h[f].lang, b = d[c];
if (b) return b;
}
for (f = 0; f < g; f++) {
c = h[f].lang;
do {
var l = c.lastIndexOf("-");
if (l === -1) break;
c = c.substr(0, l), b = d[c];
if (b) return b;
} while (1);
}
for (f = 0; f < g; f++) {
c = h[f].lang;
for (var m in d) {
var n = d[m];
if (n.language == c) return n;
}
}
} else if (typeof a == "object") return a;
return b || null;
}, c.format = function(a, b, c) {
var d = this.findClosestCulture(c);
return a instanceof Date ? a = t(a, b, d) : typeof a == "number" && (a = u(a, b, d)), a;
}, c.localize = function(a, b) {
return this.findClosestCulture(b).messages[a] || this.cultures["default"].messages[a];
}, c.parseDate = function(a, b, c) {
c = this.findClosestCulture(c);
var d, e, f;
if (b) {
typeof b == "string" && (b = [ b ]);
if (b.length) for (var g = 0, h = b.length; g < h; g++) {
var i = b[g];
if (i) {
d = y(a, i, c);
if (d) break;
}
}
} else {
f = c.calendar.patterns;
for (e in f) {
d = y(a, f[e], c);
if (d) break;
}
}
return d || null;
}, c.parseInt = function(a, b, d) {
return p(c.parseFloat(a, b, d));
}, c.parseFloat = function(a, b, c) {
typeof b != "number" && (c = b, b = 10);
var g = this.findClosestCulture(c), h = NaN, i = g.numberFormat;
a.indexOf(g.numberFormat.currency.symbol) > -1 && (a = a.replace(g.numberFormat.currency.symbol, ""), a = a.replace(g.numberFormat.currency["."], g.numberFormat["."])), a = o(a);
if (e.test(a)) h = parseFloat(a); else if (!b && d.test(a)) h = parseInt(a, 16); else {
var j = z(a, i, i.pattern[0]), k = j[0], l = j[1];
k === "" && i.pattern[0] !== "(n)" && (j = z(a, i, "(n)"), k = j[0], l = j[1]), k === "" && i.pattern[0] !== "-n" && (j = z(a, i, "-n"), k = j[0], l = j[1]), k = k || "+";
var m, n, p = l.indexOf("e");
p < 0 && (p = l.indexOf("E")), p < 0 ? (n = l, m = null) : (n = l.substr(0, p), m = l.substr(p + 1));
var q, r, s = i["."], t = n.indexOf(s);
t < 0 ? (q = n, r = null) : (q = n.substr(0, t), r = n.substr(t + s.length));
var u = i[","];
q = q.split(u).join("");
var v = u.replace(/\u00A0/g, " ");
u !== v && (q = q.split(v).join(""));
var w = k + q;
r !== null && (w += "." + r);
if (m !== null) {
var x = z(m, i, "-n");
w += "e" + (x[0] || "+") + x[1];
}
f.test(w) && (h = parseFloat(w));
}
return h;
}, c.culture = function(a) {
return typeof a != "undefined" && (this.cultureSelector = a), this.findClosestCulture(a) || this.cultures["default"];
};
})(this);

// DatePicker.js

enyo.kind({
name: "GTS.DatePicker",
kind: "enyo.Control",
classes: "gts-calendar",
published: {
value: null,
viewDate: null,
dowFormat: "ddd",
monthFormat: "mmmm yyyy"
},
events: {
onChange: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
kind: "onyx.Button",
content: "<<",
ontap: "monthBack"
}, {
name: "monthLabel",
tag: "strong",
classes: "month-label",
fit: !0
}, {
kind: "onyx.Button",
content: ">>",
ontap: "monthForward"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "sunday",
content: "Sun",
classes: "week-label"
}, {
name: "monday",
content: "Mon",
classes: "week-label"
}, {
name: "tuesday",
content: "Tue",
classes: "week-label"
}, {
name: "wednesday",
content: "Wed",
classes: "week-label"
}, {
name: "thursday",
content: "Thu",
classes: "week-label"
}, {
name: "friday",
content: "Fri",
classes: "week-label"
}, {
name: "saturday",
content: "Sat",
classes: "week-label"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row0col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row0col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row1col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row1col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row2col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row2col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row3col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row3col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row4col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row4col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "row5col0",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col1",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col2",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col3",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col4",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col5",
kind: "onyx.Button",
ontap: "dateHandler"
}, {
name: "row5col6",
kind: "onyx.Button",
ontap: "dateHandler"
} ]
}, {
kind: "FittableColumns",
style: "margin-top: 1em;",
components: [ {
name: "client",
fit: !0
}, {
kind: "onyx.Button",
content: "Today",
ontap: "resetDate"
} ]
} ],
constructor: function() {
this.inherited(arguments), this.viewDate = this.viewDate || new Date, this.value = this.value || new Date;
},
rendered: function() {
this.inherited(arguments);
if (dateFormat) {
var a = new Date(2011, 4, 1);
this.$.sunday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.monday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.tuesday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.wednesday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.thursday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.friday.setContent(dateFormat(a, this.dowFormat)), a.setDate(a.getDate() + 1), this.$.saturday.setContent(dateFormat(a, this.dowFormat));
}
var b = Math.round(10 * this.getBounds().width / 7) / 10;
this.$.sunday.applyStyle("width", b + "px"), this.$.monday.applyStyle("width", b + "px"), this.$.tuesday.applyStyle("width", b + "px"), this.$.wednesday.applyStyle("width", b + "px"), this.$.thursday.applyStyle("width", b + "px"), this.$.friday.applyStyle("width", b + "px"), this.$.saturday.applyStyle("width", b + "px"), this.valueChanged();
},
valueChanged: function() {
if (Object.prototype.toString.call(this.value) !== "[object Date]" || isNaN(this.value.getTime())) this.value = new Date;
this.viewDate.setTime(this.value.getTime()), this.renderCalendar();
},
viewDateChanged: function() {
this.renderCalendar();
},
renderCalendar: function() {
var a = Math.round(10 * this.getBounds().width / 7) / 10, b = new Date;
this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
var c = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 0), d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
c.setDate(c.getDate() - d.getDay() + 1), c.getTime() === d.getTime() && c.setDate(c.getDate() - 7);
var e = 0, f;
while (e < 6) c.getDate() === this.value.getDate() && c.getMonth() === this.value.getMonth() && c.getFullYear() === this.value.getFullYear() ? f = "onyx-blue" : c.getDate() === b.getDate() && c.getMonth() === b.getMonth() && c.getFullYear() === b.getFullYear() ? f = "onyx-affirmative" : c.getMonth() !== d.getMonth() ? f = "onyx-dark" : f = "", this.$["row" + e + "col" + c.getDay()].applyStyle("width", a + "px"), this.$["row" + e + "col" + c.getDay()].removeClass("onyx-affirmative"), this.$["row" + e + "col" + c.getDay()].removeClass("onyx-blue"), this.$["row" + e + "col" + c.getDay()].removeClass("onyx-dark"), this.$["row" + e + "col" + c.getDay()].addClass(f), this.$["row" + e + "col" + c.getDay()].setContent(c.getDate()), this.$["row" + e + "col" + c.getDay()].ts = c.getTime(), c.setDate(c.getDate() + 1), c.getDay() === 0 && e < 6 && e++;
dateFormat ? this.$.monthLabel.setContent(dateFormat(d, this.monthFormat)) : this.$.monthLabel.setContent(this.getMonthString(d.getMonth()));
},
monthBack: function() {
this.viewDate.setMonth(this.viewDate.getMonth() - 1), this.renderCalendar();
},
monthForward: function() {
this.viewDate.setMonth(this.viewDate.getMonth() + 1), this.renderCalendar();
},
resetDate: function() {
this.viewDate = new Date, this.value = new Date, this.renderCalendar(), this.doChange(this.value);
},
dateHandler: function(a, b) {
var c = new Date;
c.setTime(a.ts), this.value.setDate(c.getDate()), this.value.setMonth(c.getMonth()), this.value.setFullYear(c.getFullYear()), this.value.getMonth() != this.viewDate.getMonth() && (this.viewDate = new Date(this.value.getFullYear(), this.value.getMonth(), 1)), this.doChange(this.value), this.renderCalendar();
},
getMonthString: function(a) {
return [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ][a];
},
getDayString: function(a) {
return [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ][a];
}
});

// date.format.js

var dateFormat = function() {
var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, c = /[^-+\dA-Z]/g, d = function(a, b) {
a = String(a), b = b || 2;
while (a.length < b) a = "0" + a;
return a;
};
return function(e, f, g) {
var h = dateFormat;
arguments.length == 1 && Object.prototype.toString.call(e) == "[object String]" && !/\d/.test(e) && (f = e, e = undefined), e = e ? new Date(e) : new Date;
if (isNaN(e)) throw SyntaxError("invalid date");
f = String(h.masks[f] || f || h.masks["default"]), f.slice(0, 4) == "UTC:" && (f = f.slice(4), g = !0);
var i = g ? "getUTC" : "get", j = e[i + "Date"](), k = e[i + "Day"](), l = e[i + "Month"](), m = e[i + "FullYear"](), n = e[i + "Hours"](), o = e[i + "Minutes"](), p = e[i + "Seconds"](), q = e[i + "Milliseconds"](), r = g ? 0 : e.getTimezoneOffset(), s = {
d: j,
dd: d(j),
ddd: h.i18n.dayNames[k],
dddd: h.i18n.dayNames[k + 7],
m: l + 1,
mm: d(l + 1),
mmm: h.i18n.monthNames[l],
mmmm: h.i18n.monthNames[l + 12],
yy: String(m).slice(2),
yyyy: m,
h: n % 12 || 12,
hh: d(n % 12 || 12),
H: n,
HH: d(n),
M: o,
MM: d(o),
s: p,
ss: d(p),
l: d(q, 3),
L: d(q > 99 ? Math.round(q / 10) : q),
t: n < 12 ? "a" : "p",
tt: n < 12 ? "am" : "pm",
T: n < 12 ? "A" : "P",
TT: n < 12 ? "AM" : "PM",
Z: g ? "UTC" : (String(e).match(b) || [ "" ]).pop().replace(c, ""),
o: (r > 0 ? "-" : "+") + d(Math.floor(Math.abs(r) / 60) * 100 + Math.abs(r) % 60, 4),
S: [ "th", "st", "nd", "rd" ][j % 10 > 3 ? 0 : (j % 100 - j % 10 != 10) * j % 10]
};
return f.replace(a, function(a) {
return a in s ? s[a] : a.slice(1, a.length - 1);
});
};
}();

dateFormat.masks = {
"default": "ddd mmm dd yyyy HH:MM:ss",
shortDate: "m/d/yy",
mediumDate: "mmm d, yyyy",
longDate: "mmmm d, yyyy",
fullDate: "dddd, mmmm d, yyyy",
shortTime: "h:MM TT",
mediumTime: "h:MM:ss TT",
longTime: "h:MM:ss TT Z",
isoDate: "yyyy-mm-dd",
isoTime: "HH:MM:ss",
isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
}, dateFormat.i18n = {
dayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
}, Date.prototype.format = function(a, b) {
return dateFormat(this, a, b);
};

// socket.io.min.js

(function(a, b) {
var c = a;
c.version = "0.9.6", c.protocol = 1, c.transports = [], c.j = [], c.sockets = {}, c.connect = function(a, d) {
var e = c.util.parseUri(a), f, g;
b && b.location && (e.protocol = e.protocol || b.location.protocol.slice(0, -1), e.host = e.host || (b.document ? b.document.domain : b.location.hostname), e.port = e.port || b.location.port), f = c.util.uniqueUri(e);
var h = {
host: e.host,
secure: "https" == e.protocol,
port: e.port || ("https" == e.protocol ? 443 : 80),
query: e.query || ""
};
c.util.merge(h, d);
if (h["force new connection"] || !c.sockets[f]) g = new c.Socket(h);
return !h["force new connection"] && g && (c.sockets[f] = g), g = g || c.sockets[f], g.of(e.path.length > 1 ? e.path : "");
};
})("object" == typeof module ? module.exports : this.io = {}, this), function(a, b) {
var c = a.util = {}, d = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, e = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
c.parseUri = function(a) {
var b = d.exec(a || ""), c = {}, f = 14;
while (f--) c[e[f]] = b[f] || "";
return c;
}, c.uniqueUri = function(a) {
var c = a.protocol, d = a.host, e = a.port;
return "document" in b ? (d = d || document.domain, e = e || (c == "https" && document.location.protocol !== "https:" ? 443 : document.location.port)) : (d = d || "localhost", !e && c == "https" && (e = 443)), (c || "http") + "://" + d + ":" + (e || 80);
}, c.query = function(a, b) {
var d = c.chunkQuery(a || ""), e = [];
c.merge(d, c.chunkQuery(b || ""));
for (var f in d) d.hasOwnProperty(f) && e.push(f + "=" + d[f]);
return e.length ? "?" + e.join("&") : "";
}, c.chunkQuery = function(a) {
var b = {}, c = a.split("&"), d = 0, e = c.length, f;
for (; d < e; ++d) f = c[d].split("="), f[0] && (b[f[0]] = f[1]);
return b;
};
var f = !1;
c.load = function(a) {
if ("document" in b && document.readyState === "complete" || f) return a();
c.on(b, "load", a, !1);
}, c.on = function(a, b, c, d) {
a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener && a.addEventListener(b, c, d);
}, c.request = function(a) {
if (a && "undefined" != typeof XDomainRequest) return new XDomainRequest;
if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS)) return new XMLHttpRequest;
if (!a) try {
return new (window[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
} catch (b) {}
return null;
}, "undefined" != typeof window && c.load(function() {
f = !0;
}), c.defer = function(a) {
if (!c.ua.webkit || "undefined" != typeof importScripts) return a();
c.load(function() {
setTimeout(a, 100);
});
}, c.merge = function(a, b, d, e) {
var f = e || [], g = typeof d == "undefined" ? 2 : d, h;
for (h in b) b.hasOwnProperty(h) && c.indexOf(f, h) < 0 && (typeof a[h] != "object" || !g ? (a[h] = b[h], f.push(b[h])) : c.merge(a[h], b[h], g - 1, f));
return a;
}, c.mixin = function(a, b) {
c.merge(a.prototype, b.prototype);
}, c.inherit = function(a, b) {
function c() {}
c.prototype = b.prototype, a.prototype = new c;
}, c.isArray = Array.isArray || function(a) {
return Object.prototype.toString.call(a) === "[object Array]";
}, c.intersect = function(a, b) {
var d = [], e = a.length > b.length ? a : b, f = a.length > b.length ? b : a;
for (var g = 0, h = f.length; g < h; g++) ~c.indexOf(e, f[g]) && d.push(f[g]);
return d;
}, c.indexOf = function(a, b, c) {
for (var d = a.length, c = c < 0 ? c + d < 0 ? 0 : c + d : c || 0; c < d && a[c] !== b; c++) ;
return d <= c ? -1 : c;
}, c.toArray = function(a) {
var b = [];
for (var c = 0, d = a.length; c < d; c++) b.push(a[c]);
return b;
}, c.ua = {}, c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
try {
var a = new XMLHttpRequest;
} catch (b) {
return !1;
}
return a.withCredentials != undefined;
}(), c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent);
}("undefined" != typeof io ? io : module.exports, this), function(a, b) {
function c() {}
a.EventEmitter = c, c.prototype.on = function(a, c) {
return this.$events || (this.$events = {}), this.$events[a] ? b.util.isArray(this.$events[a]) ? this.$events[a].push(c) : this.$events[a] = [ this.$events[a], c ] : this.$events[a] = c, this;
}, c.prototype.addListener = c.prototype.on, c.prototype.once = function(a, b) {
function c() {
d.removeListener(a, c), b.apply(this, arguments);
}
var d = this;
return c.listener = b, this.on(a, c), this;
}, c.prototype.removeListener = function(a, c) {
if (this.$events && this.$events[a]) {
var d = this.$events[a];
if (b.util.isArray(d)) {
var e = -1;
for (var f = 0, g = d.length; f < g; f++) if (d[f] === c || d[f].listener && d[f].listener === c) {
e = f;
break;
}
if (e < 0) return this;
d.splice(e, 1), d.length || delete this.$events[a];
} else (d === c || d.listener && d.listener === c) && delete this.$events[a];
}
return this;
}, c.prototype.removeAllListeners = function(a) {
return this.$events && this.$events[a] && (this.$events[a] = null), this;
}, c.prototype.listeners = function(a) {
return this.$events || (this.$events = {}), this.$events[a] || (this.$events[a] = []), b.util.isArray(this.$events[a]) || (this.$events[a] = [ this.$events[a] ]), this.$events[a];
}, c.prototype.emit = function(a) {
if (!this.$events) return !1;
var c = this.$events[a];
if (!c) return !1;
var d = Array.prototype.slice.call(arguments, 1);
if ("function" == typeof c) c.apply(this, d); else {
if (!b.util.isArray(c)) return !1;
var e = c.slice();
for (var f = 0, g = e.length; f < g; f++) e[f].apply(this, d);
}
return !0;
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(exports, nativeJSON) {
function f(a) {
return a < 10 ? "0" + a : a;
}
function date(a, b) {
return isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + f(a.getUTCMonth() + 1) + "-" + f(a.getUTCDate()) + "T" + f(a.getUTCHours()) + ":" + f(a.getUTCMinutes()) + ":" + f(a.getUTCSeconds()) + "Z" : null;
}
function quote(a) {
return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
var b = meta[a];
return typeof b == "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + a + '"';
}
function str(a, b) {
var c, d, e, f, g = gap, h, i = b[a];
i instanceof Date && (i = date(a)), typeof rep == "function" && (i = rep.call(b, a, i));
switch (typeof i) {
case "string":
return quote(i);
case "number":
return isFinite(i) ? String(i) : "null";
case "boolean":
case "null":
return String(i);
case "object":
if (!i) return "null";
gap += indent, h = [];
if (Object.prototype.toString.apply(i) === "[object Array]") {
f = i.length;
for (c = 0; c < f; c += 1) h[c] = str(c, i) || "null";
return e = h.length === 0 ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e;
}
if (rep && typeof rep == "object") {
f = rep.length;
for (c = 0; c < f; c += 1) typeof rep[c] == "string" && (d = rep[c], e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
} else for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
return e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e;
}
}
"use strict";
if (nativeJSON && nativeJSON.parse) return exports.JSON = {
parse: nativeJSON.parse,
stringify: nativeJSON.stringify
};
var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
"\b": "\\b",
"	": "\\t",
"\n": "\\n",
"\f": "\\f",
"\r": "\\r",
'"': '\\"',
"\\": "\\\\"
}, rep;
JSON.stringify = function(a, b, c) {
var d;
gap = "", indent = "";
if (typeof c == "number") for (d = 0; d < c; d += 1) indent += " "; else typeof c == "string" && (indent = c);
rep = b;
if (!b || typeof b == "function" || typeof b == "object" && typeof b.length == "number") return str("", {
"": a
});
throw new Error("JSON.stringify");
}, JSON.parse = function(text, reviver) {
function walk(a, b) {
var c, d, e = a[b];
if (e && typeof e == "object") for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]);
return reviver.call(a, b, e);
}
var j;
text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
}));
if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
"": j
}, "") : j;
throw new SyntaxError("JSON.parse");
};
}("undefined" != typeof io ? io : module.exports, typeof JSON != "undefined" ? JSON : undefined), function(a, b) {
var c = a.parser = {}, d = c.packets = [ "disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop" ], e = c.reasons = [ "transport not supported", "client not handshaken", "unauthorized" ], f = c.advice = [ "reconnect" ], g = b.JSON, h = b.util.indexOf;
c.encodePacket = function(a) {
var b = h(d, a.type), c = a.id || "", i = a.endpoint || "", j = a.ack, k = null;
switch (a.type) {
case "error":
var l = a.reason ? h(e, a.reason) : "", m = a.advice ? h(f, a.advice) : "";
if (l !== "" || m !== "") k = l + (m !== "" ? "+" + m : "");
break;
case "message":
a.data !== "" && (k = a.data);
break;
case "event":
var n = {
name: a.name
};
a.args && a.args.length && (n.args = a.args), k = g.stringify(n);
break;
case "json":
k = g.stringify(a.data);
break;
case "connect":
a.qs && (k = a.qs);
break;
case "ack":
k = a.ackId + (a.args && a.args.length ? "+" + g.stringify(a.args) : "");
}
var o = [ b, c + (j == "data" ? "+" : ""), i ];
return k !== null && k !== undefined && o.push(k), o.join(":");
}, c.encodePayload = function(a) {
var b = "";
if (a.length == 1) return a[0];
for (var c = 0, d = a.length; c < d; c++) {
var e = a[c];
b += "\ufffd" + e.length + "\ufffd" + a[c];
}
return b;
};
var i = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
c.decodePacket = function(a) {
var b = a.match(i);
if (!b) return {};
var c = b[2] || "", a = b[5] || "", h = {
type: d[b[1]],
endpoint: b[4] || ""
};
c && (h.id = c, b[3] ? h.ack = "data" : h.ack = !0);
switch (h.type) {
case "error":
var b = a.split("+");
h.reason = e[b[0]] || "", h.advice = f[b[1]] || "";
break;
case "message":
h.data = a || "";
break;
case "event":
try {
var j = g.parse(a);
h.name = j.name, h.args = j.args;
} catch (k) {}
h.args = h.args || [];
break;
case "json":
try {
h.data = g.parse(a);
} catch (k) {}
break;
case "connect":
h.qs = a || "";
break;
case "ack":
var b = a.match(/^([0-9]+)(\+)?(.*)/);
if (b) {
h.ackId = b[1], h.args = [];
if (b[3]) try {
h.args = b[3] ? g.parse(b[3]) : [];
} catch (k) {}
}
break;
case "disconnect":
case "heartbeat":
}
return h;
}, c.decodePayload = function(a) {
if (a.charAt(0) == "\ufffd") {
var b = [];
for (var d = 1, e = ""; d < a.length; d++) a.charAt(d) == "\ufffd" ? (b.push(c.decodePacket(a.substr(d + 1).substr(0, e))), d += Number(e) + 1, e = "") : e += a.charAt(d);
return b;
}
return [ c.decodePacket(a) ];
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(a, b) {
function c(a, b) {
this.socket = a, this.sessid = b;
}
a.Transport = c, b.util.mixin(c, b.EventEmitter), c.prototype.onData = function(a) {
this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
if (a !== "") {
var c = b.parser.decodePayload(a);
if (c && c.length) for (var d = 0, e = c.length; d < e; d++) this.onPacket(c[d]);
}
return this;
}, c.prototype.onPacket = function(a) {
return this.socket.setHeartbeatTimeout(), a.type == "heartbeat" ? this.onHeartbeat() : (a.type == "connect" && a.endpoint == "" && this.onConnect(), a.type == "error" && a.advice == "reconnect" && (this.open = !1), this.socket.onPacket(a), this);
}, c.prototype.setCloseTimeout = function() {
if (!this.closeTimeout) {
var a = this;
this.closeTimeout = setTimeout(function() {
a.onDisconnect();
}, this.socket.closeTimeout);
}
}, c.prototype.onDisconnect = function() {
return this.close && this.open && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this;
}, c.prototype.onConnect = function() {
return this.socket.onConnect(), this;
}, c.prototype.clearCloseTimeout = function() {
this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null);
}, c.prototype.clearTimeouts = function() {
this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout);
}, c.prototype.packet = function(a) {
this.send(b.parser.encodePacket(a));
}, c.prototype.onHeartbeat = function(a) {
this.packet({
type: "heartbeat"
});
}, c.prototype.onOpen = function() {
this.open = !0, this.clearCloseTimeout(), this.socket.onOpen();
}, c.prototype.onClose = function() {
var a = this;
this.open = !1, this.socket.onClose(), this.onDisconnect();
}, c.prototype.prepareUrl = function() {
var a = this.socket.options;
return this.scheme() + "://" + a.host + ":" + a.port + "/" + a.resource + "/" + b.protocol + "/" + this.name + "/" + this.sessid;
}, c.prototype.ready = function(a, b) {
b.call(this);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(a, b, c) {
function d(a) {
this.options = {
port: 80,
secure: !1,
document: "document" in c ? document : !1,
resource: "socket.io",
transports: b.transports,
"connect timeout": 1e4,
"try multiple transports": !0,
reconnect: !0,
"reconnection delay": 500,
"reconnection limit": Infinity,
"reopen delay": 3e3,
"max reconnection attempts": 10,
"sync disconnect on unload": !0,
"auto connect": !0,
"flash policy port": 10843
}, b.util.merge(this.options, a), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1;
if (this.options["sync disconnect on unload"] && (!this.isXDomain() || b.util.ua.hasCORS)) {
var d = this;
b.util.on(c, "unload", function() {
d.disconnectSync();
}, !1);
}
this.options["auto connect"] && this.connect();
}
function e() {}
a.Socket = d, b.util.mixin(d, b.EventEmitter), d.prototype.of = function(a) {
return this.namespaces[a] || (this.namespaces[a] = new b.SocketNamespace(this, a), a !== "" && this.namespaces[a].packet({
type: "connect"
})), this.namespaces[a];
}, d.prototype.publish = function() {
this.emit.apply(this, arguments);
var a;
for (var b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments));
}, d.prototype.handshake = function(a) {
function c(b) {
b instanceof Error ? d.onError(b.message) : a.apply(null, b.split(":"));
}
var d = this, f = this.options, g = [ "http" + (f.secure ? "s" : "") + ":/", f.host + ":" + f.port, f.resource, b.protocol, b.util.query(this.options.query, "t=" + +(new Date)) ].join("/");
if (this.isXDomain() && !b.util.ua.hasCORS) {
var h = document.getElementsByTagName("script")[0], i = document.createElement("script");
i.src = g + "&jsonp=" + b.j.length, h.parentNode.insertBefore(i, h), b.j.push(function(a) {
c(a), i.parentNode.removeChild(i);
});
} else {
var j = b.util.request();
j.open("GET", g, !0), j.withCredentials = !0, j.onreadystatechange = function() {
j.readyState == 4 && (j.onreadystatechange = e, j.status == 200 ? c(j.responseText) : !d.reconnecting && d.onError(j.responseText));
}, j.send(null);
}
}, d.prototype.getTransport = function(a) {
var c = a || this.transports, d;
for (var e = 0, f; f = c[e]; e++) if (b.Transport[f] && b.Transport[f].check(this) && (!this.isXDomain() || b.Transport[f].xdomainCheck())) return new b.Transport[f](this, this.sessionid);
return null;
}, d.prototype.connect = function(a) {
if (this.connecting) return this;
var c = this;
return this.handshake(function(d, e, f, g) {
function h(a) {
c.transport && c.transport.clearTimeouts(), c.transport = c.getTransport(a);
if (!c.transport) return c.publish("connect_failed");
c.transport.ready(c, function() {
c.connecting = !0, c.publish("connecting", c.transport.name), c.transport.open(), c.options["connect timeout"] && (c.connectTimeoutTimer = setTimeout(function() {
if (!c.connected) {
c.connecting = !1;
if (c.options["try multiple transports"]) {
c.remainingTransports || (c.remainingTransports = c.transports.slice(0));
var a = c.remainingTransports;
while (a.length > 0 && a.splice(0, 1)[0] != c.transport.name) ;
a.length ? h(a) : c.publish("connect_failed");
}
}
}, c.options["connect timeout"]));
});
}
c.sessionid = d, c.closeTimeout = f * 1e3, c.heartbeatTimeout = e * 1e3, c.transports = g ? b.util.intersect(g.split(","), c.options.transports) : c.options.transports, c.setHeartbeatTimeout(), h(c.transports), c.once("connect", function() {
clearTimeout(c.connectTimeoutTimer), a && typeof a == "function" && a();
});
}), this;
}, d.prototype.setHeartbeatTimeout = function() {
clearTimeout(this.heartbeatTimeoutTimer);
var a = this;
this.heartbeatTimeoutTimer = setTimeout(function() {
a.transport.onClose();
}, this.heartbeatTimeout);
}, d.prototype.packet = function(a) {
return this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a), this;
}, d.prototype.setBuffer = function(a) {
this.doBuffer = a, !a && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = []);
}, d.prototype.disconnect = function() {
if (this.connected || this.connecting) this.open && this.of("").packet({
type: "disconnect"
}), this.onDisconnect("booted");
return this;
}, d.prototype.disconnectSync = function() {
var a = b.util.request(), c = this.resource + "/" + b.protocol + "/" + this.sessionid;
a.open("GET", c, !0), this.onDisconnect("booted");
}, d.prototype.isXDomain = function() {
var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
return this.options.host !== c.location.hostname || this.options.port != a;
}, d.prototype.onConnect = function() {
this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"));
}, d.prototype.onOpen = function() {
this.open = !0;
}, d.prototype.onClose = function() {
this.open = !1, clearTimeout(this.heartbeatTimeoutTimer);
}, d.prototype.onPacket = function(a) {
this.of(a.endpoint).onPacket(a);
}, d.prototype.onError = function(a) {
a && a.advice && a.advice === "reconnect" && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect && this.reconnect()), this.publish("error", a && a.reason ? a.reason : a);
}, d.prototype.onDisconnect = function(a) {
var b = this.connected, c = this.connecting;
this.connected = !1, this.connecting = !1, this.open = !1;
if (b || c) this.transport.close(), this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect());
}, d.prototype.reconnect = function() {
function a() {
if (c.connected) {
for (var a in c.namespaces) c.namespaces.hasOwnProperty(a) && "" !== a && c.namespaces[a].packet({
type: "connect"
});
c.publish("reconnect", c.transport.name, c.reconnectionAttempts);
}
clearTimeout(c.reconnectionTimer), c.removeListener("connect_failed", b), c.removeListener("connect", b), c.reconnecting = !1, delete c.reconnectionAttempts, delete c.reconnectionDelay, delete c.reconnectionTimer, delete c.redoTransports, c.options["try multiple transports"] = e;
}
function b() {
if (!c.reconnecting) return;
if (c.connected) return a();
if (c.connecting && c.reconnecting) return c.reconnectionTimer = setTimeout(b, 1e3);
c.reconnectionAttempts++ >= d ? c.redoTransports ? (c.publish("reconnect_failed"), a()) : (c.on("connect_failed", b), c.options["try multiple transports"] = !0, c.transport = c.getTransport(), c.redoTransports = !0, c.connect()) : (c.reconnectionDelay < f && (c.reconnectionDelay *= 2), c.connect(), c.publish("reconnecting", c.reconnectionDelay, c.reconnectionAttempts), c.reconnectionTimer = setTimeout(b, c.reconnectionDelay));
}
this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
var c = this, d = this.options["max reconnection attempts"], e = this.options["try multiple transports"], f = this.options["reconnection limit"];
this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(b, this.reconnectionDelay), this.on("connect", b);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(a, b) {
function c(a, b) {
this.socket = a, this.name = b || "", this.flags = {}, this.json = new d(this, "json"), this.ackPackets = 0, this.acks = {};
}
function d(a, b) {
this.namespace = a, this.name = b;
}
a.SocketNamespace = c, b.util.mixin(c, b.EventEmitter), c.prototype.$emit = b.EventEmitter.prototype.emit, c.prototype.of = function() {
return this.socket.of.apply(this.socket, arguments);
}, c.prototype.packet = function(a) {
return a.endpoint = this.name, this.socket.packet(a), this.flags = {}, this;
}, c.prototype.send = function(a, b) {
var c = {
type: this.flags.json ? "json" : "message",
data: a
};
return "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b), this.packet(c);
}, c.prototype.emit = function(a) {
var b = Array.prototype.slice.call(arguments, 1), c = b[b.length - 1], d = {
type: "event",
name: a
};
return "function" == typeof c && (d.id = ++this.ackPackets, d.ack = "data", this.acks[d.id] = c, b = b.slice(0, b.length - 1)), d.args = b, this.packet(d);
}, c.prototype.disconnect = function() {
return this.name === "" ? this.socket.disconnect() : (this.packet({
type: "disconnect"
}), this.$emit("disconnect")), this;
}, c.prototype.onPacket = function(a) {
function c() {
d.packet({
type: "ack",
args: b.util.toArray(arguments),
ackId: a.id
});
}
var d = this;
switch (a.type) {
case "connect":
this.$emit("connect");
break;
case "disconnect":
this.name === "" ? this.socket.onDisconnect(a.reason || "booted") : this.$emit("disconnect", a.reason);
break;
case "message":
case "json":
var e = [ "message", a.data ];
a.ack == "data" ? e.push(c) : a.ack && this.packet({
type: "ack",
ackId: a.id
}), this.$emit.apply(this, e);
break;
case "event":
var e = [ a.name ].concat(a.args);
a.ack == "data" && e.push(c), this.$emit.apply(this, e);
break;
case "ack":
this.acks[a.ackId] && (this.acks[a.ackId].apply(this, a.args), delete this.acks[a.ackId]);
break;
case "error":
a.advice ? this.socket.onError(a) : a.reason == "unauthorized" ? this.$emit("connect_failed", a.reason) : this.$emit("error", a.reason);
}
}, d.prototype.send = function() {
this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments);
}, d.prototype.emit = function() {
this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(a, b, c) {
function d(a) {
b.Transport.apply(this, arguments);
}
a.websocket = d, b.util.inherit(d, b.Transport), d.prototype.name = "websocket", d.prototype.open = function() {
var a = b.util.query(this.socket.options.query), d = this, e;
return e || (e = c.MozWebSocket || c.WebSocket), this.websocket = new e(this.prepareUrl() + a), this.websocket.onopen = function() {
d.onOpen(), d.socket.setBuffer(!1);
}, this.websocket.onmessage = function(a) {
d.onData(a.data);
}, this.websocket.onclose = function() {
d.onClose(), d.socket.setBuffer(!0);
}, this.websocket.onerror = function(a) {
d.onError(a);
}, this;
}, d.prototype.send = function(a) {
return this.websocket.send(a), this;
}, d.prototype.payload = function(a) {
for (var b = 0, c = a.length; b < c; b++) this.packet(a[b]);
return this;
}, d.prototype.close = function() {
return this.websocket.close(), this;
}, d.prototype.onError = function(a) {
this.socket.onError(a);
}, d.prototype.scheme = function() {
return this.socket.options.secure ? "wss" : "ws";
}, d.check = function() {
return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c;
}, d.xdomainCheck = function() {
return !0;
}, b.transports.push("websocket");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(a, b) {
function c() {
b.Transport.websocket.apply(this, arguments);
}
a.flashsocket = c, b.util.inherit(c, b.Transport.websocket), c.prototype.name = "flashsocket", c.prototype.open = function() {
var a = this, c = arguments;
return WebSocket.__addTask(function() {
b.Transport.websocket.prototype.open.apply(a, c);
}), this;
}, c.prototype.send = function() {
var a = this, c = arguments;
return WebSocket.__addTask(function() {
b.Transport.websocket.prototype.send.apply(a, c);
}), this;
}, c.prototype.close = function() {
return WebSocket.__tasks.length = 0, b.Transport.websocket.prototype.close.call(this), this;
}, c.prototype.ready = function(a, d) {
function e() {
var b = a.options, e = b["flash policy port"], g = [ "http" + (b.secure ? "s" : "") + ":/", b.host + ":" + b.port, b.resource, "static/flashsocket", "WebSocketMain" + (a.isXDomain() ? "Insecure" : "") + ".swf" ];
c.loaded || (typeof WEB_SOCKET_SWF_LOCATION == "undefined" && (WEB_SOCKET_SWF_LOCATION = g.join("/")), e !== 843 && WebSocket.loadFlashPolicyFile("xmlsocket://" + b.host + ":" + e), WebSocket.__initialize(), c.loaded = !0), d.call(f);
}
var f = this;
if (document.body) return e();
b.util.load(e);
}, c.check = function() {
return typeof WebSocket != "undefined" && "__initialize" in WebSocket && !!swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1;
}, c.xdomainCheck = function() {
return !0;
}, typeof window != "undefined" && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), b.transports.push("flashsocket");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);

if ("undefined" != typeof window) var swfobject = function() {
function a() {
if (P) return;
try {
var a = E.getElementsByTagName("body")[0].appendChild(q("span"));
a.parentNode.removeChild(a);
} catch (b) {
return;
}
P = !0;
var c = H.length;
for (var d = 0; d < c; d++) H[d]();
}
function b(a) {
P ? a() : H[H.length] = a;
}
function c(a) {
if (typeof D.addEventListener != w) D.addEventListener("load", a, !1); else if (typeof E.addEventListener != w) E.addEventListener("load", a, !1); else if (typeof D.attachEvent != w) r(D, "onload", a); else if (typeof D.onload == "function") {
var b = D.onload;
D.onload = function() {
b(), a();
};
} else D.onload = a;
}
function d() {
G ? e() : f();
}
function e() {
var a = E.getElementsByTagName("body")[0], b = q(x);
b.setAttribute("type", A);
var c = a.appendChild(b);
if (c) {
var d = 0;
(function() {
if (typeof c.GetVariable != w) {
var e = c.GetVariable("$version");
e && (e = e.split(" ")[1].split(","), U.pv = [ parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10) ]);
} else if (d < 10) {
d++, setTimeout(arguments.callee, 10);
return;
}
a.removeChild(b), c = null, f();
})();
} else f();
}
function f() {
var a = I.length;
if (a > 0) for (var b = 0; b < a; b++) {
var c = I[b].id, d = I[b].callbackFn, e = {
success: !1,
id: c
};
if (U.pv[0] > 0) {
var f = p(c);
if (f) if (s(I[b].swfVersion) && !(U.wk && U.wk < 312)) u(c, !0), d && (e.success = !0, e.ref = g(c), d(e)); else if (I[b].expressInstall && h()) {
var k = {};
k.data = I[b].expressInstall, k.width = f.getAttribute("width") || "0", k.height = f.getAttribute("height") || "0", f.getAttribute("class") && (k.styleclass = f.getAttribute("class")), f.getAttribute("align") && (k.align = f.getAttribute("align"));
var l = {}, m = f.getElementsByTagName("param"), n = m.length;
for (var o = 0; o < n; o++) m[o].getAttribute("name").toLowerCase() != "movie" && (l[m[o].getAttribute("name")] = m[o].getAttribute("value"));
i(k, l, c, d);
} else j(f), d && d(e);
} else {
u(c, !0);
if (d) {
var q = g(c);
q && typeof q.SetVariable != w && (e.success = !0, e.ref = q), d(e);
}
}
}
}
function g(a) {
var b = null, c = p(a);
if (c && c.nodeName == "OBJECT") if (typeof c.SetVariable != w) b = c; else {
var d = c.getElementsByTagName(x)[0];
d && (b = d);
}
return b;
}
function h() {
return !Q && s("6.0.65") && (U.win || U.mac) && !(U.wk && U.wk < 312);
}
function i(a, b, c, d) {
Q = !0, N = d || null, O = {
success: !1,
id: c
};
var e = p(c);
if (e) {
e.nodeName == "OBJECT" ? (L = k(e), M = null) : (L = e, M = c), a.id = B;
if (typeof a.width == w || !/%$/.test(a.width) && parseInt(a.width, 10) < 310) a.width = "310";
if (typeof a.height == w || !/%$/.test(a.height) && parseInt(a.height, 10) < 137) a.height = "137";
E.title = E.title.slice(0, 47) + " - Flash Player Installation";
var f = U.ie && U.win ? [ "Active" ].concat("").join("X") : "PlugIn", g = "MMredirectURL=" + D.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + f + "&MMdoctitle=" + E.title;
typeof b.flashvars != w ? b.flashvars += "&" + g : b.flashvars = g;
if (U.ie && U.win && e.readyState != 4) {
var h = q("div");
c += "SWFObjectNew", h.setAttribute("id", c), e.parentNode.insertBefore(h, e), e.style.display = "none", function() {
e.readyState == 4 ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10);
}();
}
l(a, b, c);
}
}
function j(a) {
if (U.ie && U.win && a.readyState != 4) {
var b = q("div");
a.parentNode.insertBefore(b, a), b.parentNode.replaceChild(k(a), b), a.style.display = "none", function() {
a.readyState == 4 ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10);
}();
} else a.parentNode.replaceChild(k(a), a);
}
function k(a) {
var b = q("div");
if (U.win && U.ie) b.innerHTML = a.innerHTML; else {
var c = a.getElementsByTagName(x)[0];
if (c) {
var d = c.childNodes;
if (d) {
var e = d.length;
for (var f = 0; f < e; f++) (d[f].nodeType != 1 || d[f].nodeName != "PARAM") && d[f].nodeType != 8 && b.appendChild(d[f].cloneNode(!0));
}
}
}
return b;
}
function l(a, b, c) {
var d, e = p(c);
if (U.wk && U.wk < 312) return d;
if (e) {
typeof a.id == w && (a.id = c);
if (U.ie && U.win) {
var f = "";
for (var g in a) a[g] != Object.prototype[g] && (g.toLowerCase() == "data" ? b.movie = a[g] : g.toLowerCase() == "styleclass" ? f += ' class="' + a[g] + '"' : g.toLowerCase() != "classid" && (f += " " + g + '="' + a[g] + '"'));
var h = "";
for (var i in b) b[i] != Object.prototype[i] && (h += '<param name="' + i + '" value="' + b[i] + '" />');
e.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>", J[J.length] = a.id, d = p(a.id);
} else {
var j = q(x);
j.setAttribute("type", A);
for (var k in a) a[k] != Object.prototype[k] && (k.toLowerCase() == "styleclass" ? j.setAttribute("class", a[k]) : k.toLowerCase() != "classid" && j.setAttribute(k, a[k]));
for (var l in b) b[l] != Object.prototype[l] && l.toLowerCase() != "movie" && m(j, l, b[l]);
e.parentNode.replaceChild(j, e), d = j;
}
}
return d;
}
function m(a, b, c) {
var d = q("param");
d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d);
}
function n(a) {
var b = p(a);
b && b.nodeName == "OBJECT" && (U.ie && U.win ? (b.style.display = "none", function() {
b.readyState == 4 ? o(a) : setTimeout(arguments.callee, 10);
}()) : b.parentNode.removeChild(b));
}
function o(a) {
var b = p(a);
if (b) {
for (var c in b) typeof b[c] == "function" && (b[c] = null);
b.parentNode.removeChild(b);
}
}
function p(a) {
var b = null;
try {
b = E.getElementById(a);
} catch (c) {}
return b;
}
function q(a) {
return E.createElement(a);
}
function r(a, b, c) {
a.attachEvent(b, c), K[K.length] = [ a, b, c ];
}
function s(a) {
var b = U.pv, c = a.split(".");
return c[0] = parseInt(c[0], 10), c[1] = parseInt(c[1], 10) || 0, c[2] = parseInt(c[2], 10) || 0, b[0] > c[0] || b[0] == c[0] && b[1] > c[1] || b[0] == c[0] && b[1] == c[1] && b[2] >= c[2] ? !0 : !1;
}
function t(a, b, c, d) {
if (U.ie && U.mac) return;
var e = E.getElementsByTagName("head")[0];
if (!e) return;
var f = c && typeof c == "string" ? c : "screen";
d && (R = null, S = null);
if (!R || S != f) {
var g = q("style");
g.setAttribute("type", "text/css"), g.setAttribute("media", f), R = e.appendChild(g), U.ie && U.win && typeof E.styleSheets != w && E.styleSheets.length > 0 && (R = E.styleSheets[E.styleSheets.length - 1]), S = f;
}
U.ie && U.win ? R && typeof R.addRule == x && R.addRule(a, b) : R && typeof E.createTextNode != w && R.appendChild(E.createTextNode(a + " {" + b + "}"));
}
function u(a, b) {
if (!T) return;
var c = b ? "visible" : "hidden";
P && p(a) ? p(a).style.visibility = c : t("#" + a, "visibility:" + c);
}
function v(a) {
var b = /[\\\"<>\.;]/, c = b.exec(a) != null;
return c && typeof encodeURIComponent != w ? encodeURIComponent(a) : a;
}
var w = "undefined", x = "object", y = "Shockwave Flash", z = "ShockwaveFlash.ShockwaveFlash", A = "application/x-shockwave-flash", B = "SWFObjectExprInst", C = "onreadystatechange", D = window, E = document, F = navigator, G = !1, H = [ d ], I = [], J = [], K = [], L, M, N, O, P = !1, Q = !1, R, S, T = !0, U = function() {
var a = typeof E.getElementById != w && typeof E.getElementsByTagName != w && typeof E.createElement != w, b = F.userAgent.toLowerCase(), c = F.platform.toLowerCase(), d = c ? /win/.test(c) : /win/.test(b), e = c ? /mac/.test(c) : /mac/.test(b), f = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, g = !1, h = [ 0, 0, 0 ], i = null;
if (typeof F.plugins != w && typeof F.plugins[y] == x) i = F.plugins[y].description, i && (typeof F.mimeTypes == w || !F.mimeTypes[A] || !!F.mimeTypes[A].enabledPlugin) && (G = !0, g = !1, i = i.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), h[0] = parseInt(i.replace(/^(.*)\..*$/, "$1"), 10), h[1] = parseInt(i.replace(/^.*\.(.*)\s.*$/, "$1"), 10), h[2] = /[a-zA-Z]/.test(i) ? parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof D[[ "Active" ].concat("Object").join("X")] != w) try {
var j = new (window[[ "Active" ].concat("Object").join("X")])(z);
j && (i = j.GetVariable("$version"), i && (g = !0, i = i.split(" ")[1].split(","), h = [ parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10) ]));
} catch (k) {}
return {
w3: a,
pv: h,
wk: f,
ie: g,
win: d,
mac: e
};
}(), V = function() {
if (!U.w3) return;
(typeof E.readyState != w && E.readyState == "complete" || typeof E.readyState == w && (E.getElementsByTagName("body")[0] || E.body)) && a(), P || (typeof E.addEventListener != w && E.addEventListener("DOMContentLoaded", a, !1), U.ie && U.win && (E.attachEvent(C, function() {
E.readyState == "complete" && (E.detachEvent(C, arguments.callee), a());
}), D == top && function() {
if (P) return;
try {
E.documentElement.doScroll("left");
} catch (b) {
setTimeout(arguments.callee, 0);
return;
}
a();
}()), U.wk && function() {
if (P) return;
if (!/loaded|complete/.test(E.readyState)) {
setTimeout(arguments.callee, 0);
return;
}
a();
}(), c(a));
}(), W = function() {
U.ie && U.win && window.attachEvent("onunload", function() {
var a = K.length;
for (var b = 0; b < a; b++) K[b][0].detachEvent(K[b][1], K[b][2]);
var c = J.length;
for (var d = 0; d < c; d++) n(J[d]);
for (var e in U) U[e] = null;
U = null;
for (var f in swfobject) swfobject[f] = null;
swfobject = null;
});
}();
return {
registerObject: function(a, b, c, d) {
if (U.w3 && a && b) {
var e = {};
e.id = a, e.swfVersion = b, e.expressInstall = c, e.callbackFn = d, I[I.length] = e, u(a, !1);
} else d && d({
success: !1,
id: a
});
},
getObjectById: function(a) {
if (U.w3) return g(a);
},
embedSWF: function(a, c, d, e, f, g, j, k, m, n) {
var o = {
success: !1,
id: c
};
U.w3 && !(U.wk && U.wk < 312) && a && c && d && e && f ? (u(c, !1), b(function() {
d += "", e += "";
var b = {};
if (m && typeof m === x) for (var p in m) b[p] = m[p];
b.data = a, b.width = d, b.height = e;
var q = {};
if (k && typeof k === x) for (var r in k) q[r] = k[r];
if (j && typeof j === x) for (var t in j) typeof q.flashvars != w ? q.flashvars += "&" + t + "=" + j[t] : q.flashvars = t + "=" + j[t];
if (s(f)) {
var v = l(b, q, c);
b.id == c && u(c, !0), o.success = !0, o.ref = v;
} else {
if (g && h()) {
b.data = g, i(b, q, c, n);
return;
}
u(c, !0);
}
n && n(o);
})) : n && n(o);
},
switchOffAutoHideShow: function() {
T = !1;
},
ua: U,
getFlashPlayerVersion: function() {
return {
major: U.pv[0],
minor: U.pv[1],
release: U.pv[2]
};
},
hasFlashPlayerVersion: s,
createSWF: function(a, b, c) {
return U.w3 ? l(a, b, c) : undefined;
},
showExpressInstall: function(a, b, c, d) {
U.w3 && h() && i(a, b, c, d);
},
removeSWF: function(a) {
U.w3 && n(a);
},
createCSS: function(a, b, c, d) {
U.w3 && t(a, b, c, d);
},
addDomLoadEvent: b,
addLoadEvent: c,
getQueryParamValue: function(a) {
var b = E.location.search || E.location.hash;
if (b) {
/\?/.test(b) && (b = b.split("?")[1]);
if (a == null) return v(b);
var c = b.split("&");
for (var d = 0; d < c.length; d++) if (c[d].substring(0, c[d].indexOf("=")) == a) return v(c[d].substring(c[d].indexOf("=") + 1));
}
return "";
},
expressInstallCallback: function() {
if (Q) {
var a = p(B);
a && L && (a.parentNode.replaceChild(L, a), M && (u(M, !0), U.ie && U.win && (L.style.display = "block")), N && N(O)), Q = !1;
}
}
};
}();

(function() {
if ("undefined" == typeof window || window.WebSocket) return;
var a = window.console;
if (!a || !a.log || !a.error) a = {
log: function() {},
error: function() {}
};
if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
a.error("Flash Player >= 10.0.0 is required.");
return;
}
location.protocol == "file:" && a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(a, b, c, d, e) {
var f = this;
f.__id = WebSocket.__nextId++, WebSocket.__instances[f.__id] = f, f.readyState = WebSocket.CONNECTING, f.bufferedAmount = 0, f.__events = {}, b ? typeof b == "string" && (b = [ b ]) : b = [], setTimeout(function() {
WebSocket.__addTask(function() {
WebSocket.__flash.create(f.__id, a, b, c || null, d || 0, e || null);
});
}, 0);
}, WebSocket.prototype.send = function(a) {
if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
var b = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
return b < 0 ? !0 : (this.bufferedAmount += b, !1);
}, WebSocket.prototype.close = function() {
if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) return;
this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id);
}, WebSocket.prototype.addEventListener = function(a, b, c) {
a in this.__events || (this.__events[a] = []), this.__events[a].push(b);
}, WebSocket.prototype.removeEventListener = function(a, b, c) {
if (!(a in this.__events)) return;
var d = this.__events[a];
for (var e = d.length - 1; e >= 0; --e) if (d[e] === b) {
d.splice(e, 1);
break;
}
}, WebSocket.prototype.dispatchEvent = function(a) {
var b = this.__events[a.type] || [];
for (var c = 0; c < b.length; ++c) b[c](a);
var d = this["on" + a.type];
d && d(a);
}, WebSocket.prototype.__handleEvent = function(a) {
"readyState" in a && (this.readyState = a.readyState), "protocol" in a && (this.protocol = a.protocol);
var b;
if (a.type == "open" || a.type == "error") b = this.__createSimpleEvent(a.type); else if (a.type == "close") b = this.__createSimpleEvent("close"); else {
if (a.type != "message") throw "unknown event type: " + a.type;
var c = decodeURIComponent(a.message);
b = this.__createMessageEvent("message", c);
}
this.dispatchEvent(b);
}, WebSocket.prototype.__createSimpleEvent = function(a) {
if (document.createEvent && window.Event) {
var b = document.createEvent("Event");
return b.initEvent(a, !1, !1), b;
}
return {
type: a,
bubbles: !1,
cancelable: !1
};
}, WebSocket.prototype.__createMessageEvent = function(a, b) {
if (document.createEvent && window.MessageEvent && !window.opera) {
var c = document.createEvent("MessageEvent");
return c.initMessageEvent("message", !1, !1, b, null, null, window, null), c;
}
return {
type: a,
data: b,
bubbles: !1,
cancelable: !1
};
}, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(a) {
WebSocket.__addTask(function() {
WebSocket.__flash.loadManualPolicyFile(a);
});
}, WebSocket.__initialize = function() {
if (WebSocket.__flash) return;
WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation);
if (!window.WEB_SOCKET_SWF_LOCATION) {
a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
return;
}
var b = document.createElement("div");
b.id = "webSocketContainer", b.style.position = "absolute", WebSocket.__isFlashLite() ? (b.style.left = "0px", b.style.top = "0px") : (b.style.left = "-100px", b.style.top = "-100px");
var c = document.createElement("div");
c.id = "webSocketFlash", b.appendChild(c), document.body.appendChild(b), swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
hasPriority: !0,
swliveconnect: !0,
allowScriptAccess: "always"
}, null, function(b) {
b.success || a.error("[WebSocket] swfobject.embedSWF failed");
});
}, WebSocket.__onFlashInitialized = function() {
setTimeout(function() {
WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
for (var a = 0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
WebSocket.__tasks = [];
}, 0);
}, WebSocket.__onFlashEvent = function() {
return setTimeout(function() {
try {
var b = WebSocket.__flash.receiveEvents();
for (var c = 0; c < b.length; ++c) WebSocket.__instances[b[c].webSocketId].__handleEvent(b[c]);
} catch (d) {
a.error(d);
}
}, 0), !0;
}, WebSocket.__log = function(b) {
a.log(decodeURIComponent(b));
}, WebSocket.__error = function(b) {
a.error(decodeURIComponent(b));
}, WebSocket.__addTask = function(a) {
WebSocket.__flash ? a() : WebSocket.__tasks.push(a);
}, WebSocket.__isFlashLite = function() {
if (!window.navigator || !window.navigator.mimeTypes) return !1;
var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
return !a || !a.enabledPlugin || !a.enabledPlugin.filename ? !1 : a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1;
}, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function() {
WebSocket.__initialize();
}, !1) : window.attachEvent("onload", function() {
WebSocket.__initialize();
}));
})(), function(a, b, c) {
function d(a) {
if (!a) return;
b.Transport.apply(this, arguments), this.sendBuffer = [];
}
function e() {}
a.XHR = d, b.util.inherit(d, b.Transport), d.prototype.open = function() {
return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this;
}, d.prototype.payload = function(a) {
var c = [];
for (var d = 0, e = a.length; d < e; d++) c.push(b.parser.encodePacket(a[d]));
this.send(b.parser.encodePayload(c));
}, d.prototype.send = function(a) {
return this.post(a), this;
}, d.prototype.post = function(a) {
function b() {
this.readyState == 4 && (this.onreadystatechange = e, f.posting = !1, this.status == 200 ? f.socket.setBuffer(!1) : f.onClose());
}
function d() {
this.onload = e, f.socket.setBuffer(!1);
}
var f = this;
this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = d : this.sendXHR.onreadystatechange = b, this.sendXHR.send(a);
}, d.prototype.close = function() {
return this.onClose(), this;
}, d.prototype.request = function(a) {
var c = b.util.request(this.socket.isXDomain()), d = b.util.query(this.socket.options.query, "t=" + +(new Date));
c.open(a || "GET", this.prepareUrl() + d, !0);
if (a == "POST") try {
c.setRequestHeader ? c.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : c.contentType = "text/plain";
} catch (e) {}
return c;
}, d.prototype.scheme = function() {
return this.socket.options.secure ? "https" : "http";
}, d.check = function(a, d) {
try {
var e = b.util.request(d), f = c.XDomainRequest && e instanceof XDomainRequest, g = a && a.options && a.options.secure ? "https:" : "http:", h = g != c.location.protocol;
if (e && (!f || !h)) return !0;
} catch (i) {}
return !1;
}, d.xdomainCheck = function() {
return d.check(null, !0);
};
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(a, b) {
function c(a) {
b.Transport.XHR.apply(this, arguments);
}
a.htmlfile = c, b.util.inherit(c, b.Transport.XHR), c.prototype.name = "htmlfile", c.prototype.get = function() {
this.doc = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
var a = this.doc.createElement("div");
a.className = "socketio", this.doc.body.appendChild(a), this.iframe = this.doc.createElement("iframe"), a.appendChild(this.iframe);
var c = this, d = b.util.query(this.socket.options.query, "t=" + +(new Date));
this.iframe.src = this.prepareUrl() + d, b.util.on(window, "unload", function() {
c.destroy();
});
}, c.prototype._ = function(a, b) {
this.onData(a);
try {
var c = b.getElementsByTagName("script")[0];
c.parentNode.removeChild(c);
} catch (d) {}
}, c.prototype.destroy = function() {
if (this.iframe) {
try {
this.iframe.src = "about:blank";
} catch (a) {}
this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage();
}
}, c.prototype.close = function() {
return this.destroy(), b.Transport.XHR.prototype.close.call(this);
}, c.check = function() {
if (typeof window != "undefined" && [ "Active" ].concat("Object").join("X") in window) try {
var a = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile");
return a && b.Transport.XHR.check();
} catch (c) {}
return !1;
}, c.xdomainCheck = function() {
return !1;
}, b.transports.push("htmlfile");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(a, b, c) {
function d() {
b.Transport.XHR.apply(this, arguments);
}
function e() {}
a["xhr-polling"] = d, b.util.inherit(d, b.Transport.XHR), b.util.merge(d, b.Transport.XHR), d.prototype.name = "xhr-polling", d.prototype.open = function() {
var a = this;
return b.Transport.XHR.prototype.open.call(a), !1;
}, d.prototype.get = function() {
function a() {
this.readyState == 4 && (this.onreadystatechange = e, this.status == 200 ? (f.onData(this.responseText), f.get()) : f.onClose());
}
function b() {
this.onload = e, this.onerror = e, f.onData(this.responseText), f.get();
}
function d() {
f.onClose();
}
if (!this.open) return;
var f = this;
this.xhr = this.request(), c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = b, this.xhr.onerror = d) : this.xhr.onreadystatechange = a, this.xhr.send(null);
}, d.prototype.onClose = function() {
b.Transport.XHR.prototype.onClose.call(this);
if (this.xhr) {
this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = e;
try {
this.xhr.abort();
} catch (a) {}
this.xhr = null;
}
}, d.prototype.ready = function(a, c) {
var d = this;
b.util.defer(function() {
c.call(d);
});
}, b.transports.push("xhr-polling");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(a, b, c) {
function d(a) {
b.Transport["xhr-polling"].apply(this, arguments), this.index = b.j.length;
var c = this;
b.j.push(function(a) {
c._(a);
});
}
var e = c.document && "MozAppearance" in c.document.documentElement.style;
a["jsonp-polling"] = d, b.util.inherit(d, b.Transport["xhr-polling"]), d.prototype.name = "jsonp-polling", d.prototype.post = function(a) {
function c() {
d(), e.socket.setBuffer(!1);
}
function d() {
e.iframe && e.form.removeChild(e.iframe);
try {
j = document.createElement('<iframe name="' + e.iframeId + '">');
} catch (a) {
j = document.createElement("iframe"), j.name = e.iframeId;
}
j.id = e.iframeId, e.form.appendChild(j), e.iframe = j;
}
var e = this, f = b.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
if (!this.form) {
var g = document.createElement("form"), h = document.createElement("textarea"), i = this.iframeId = "socketio_iframe_" + this.index, j;
g.className = "socketio", g.style.position = "absolute", g.style.top = "0px", g.style.left = "0px", g.style.display = "none", g.target = i, g.method = "POST", g.setAttribute("accept-charset", "utf-8"), h.name = "d", g.appendChild(h), document.body.appendChild(g), this.form = g, this.area = h;
}
this.form.action = this.prepareUrl() + f, d(), this.area.value = b.JSON.stringify(a);
try {
this.form.submit();
} catch (k) {}
this.iframe.attachEvent ? j.onreadystatechange = function() {
e.iframe.readyState == "complete" && c();
} : this.iframe.onload = c, this.socket.setBuffer(!0);
}, d.prototype.get = function() {
var a = this, c = document.createElement("script"), d = b.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
this.script && (this.script.parentNode.removeChild(this.script), this.script = null), c.async = !0, c.src = this.prepareUrl() + d, c.onerror = function() {
a.onClose();
};
var f = document.getElementsByTagName("script")[0];
f.parentNode.insertBefore(c, f), this.script = c, e && setTimeout(function() {
var a = document.createElement("iframe");
document.body.appendChild(a), document.body.removeChild(a);
}, 100);
}, d.prototype._ = function(a) {
return this.onData(a), this.open && this.get(), this;
}, d.prototype.ready = function(a, c) {
var d = this;
if (!e) return c.call(this);
b.util.load(function() {
c.call(d);
});
}, d.check = function() {
return "document" in c;
}, d.xdomainCheck = function() {
return !0;
}, b.transports.push("jsonp-polling");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);

// foundation.js

XT = {
MONEY_SCALE: 2,
QTY_SCALE: 6,
QTY_PER_SCALE: 7,
COST_SCALE: 6,
SALES_PRICE_SCALE: 4,
PURCHASE_PRICE_SCALE: 6,
EXTENDED_PRICE_SCALE: 4,
UNIT_RATIO_SCALE: 8,
PERCENT_SCALE: 4,
WEIGHT_SCALE: 2
}, XM = {}, _.extend(XT, {
K: function() {},
_date: new Date,
toReadableTimestamp: function(a) {
var b = XT._date || (XT._date = new Date);
return b.setTime(a), b.toLocaleTimeString();
},
getObjectByName: function(a) {
if (!a.split) return null;
var b = a.split("."), c, d, e = 0;
for (; e < b.length; ++e) {
d = b[e], c = c ? c[d] : window[d];
if (c === null || c === undefined) return null;
}
return c;
},
A: function(a) {
if (a === null || a === undefined) return [];
if (a.slice instanceof Function) return typeof a == "string" ? [ a ] : a.slice();
var b = [];
if (a.length) {
var c = a.length;
while (--c >= 0) b[c] = a[c];
return b;
}
return _.values(a);
}
}), XT.$A = XT.A, _.extend(XT, {
history: [],
addToHistory: function(a, b) {
for (var c = 0; c < this.history.length; c++) this.history[c].modelType === b.recordType && this.history[c].modelId === b.get("id") && (this.history.splice(c, 1), c--);
this.history.unshift({
modelType: b.recordType,
modelId: b.get("id"),
modelName: b.getValue(b.nameAttribute),
module: a
});
},
getHistory: function() {
return this.history;
}
}), XV = {};

// error.js

(function() {
"use strict", XT.Error = function() {}, XT.Error.prototype = {
code: null,
messageKey: null,
params: {},
message: function() {
var a = (this.messageKey || "").loc(), b, c;
for (b in this.params) this.params.hasOwnProperty(b) && (c = (this.params[b] || "_unknown").loc(), a = a.replace("{" + b + "}", c));
return a;
}
}, _.extend(XT.Error, {
clone: function(a, b) {
var c;
b = b || {};
if (a) {
c = _.find(XT.errors, function(b) {
return b.code === a;
});
if (!c) return !1;
}
return c = _.clone(c), c.params && (c.params = _.clone(c.params)), _.extend(c, b), XT.Error.create(c);
},
create: function(a) {
var b;
return a = a || {}, b = new XT.Error, _.extend(b, a), b;
}
});
var a = [ {
code: "xt1001",
params: {
error: null
},
messageKey: "_datasourceError"
}, {
code: "xt1002",
params: {
attr: null
},
messageKey: "_attributeNotInSchema"
}, {
code: "xt1003",
params: {
attr: null,
type: null
},
messageKey: "_attributeTypeMismatch"
}, {
code: "xt1004",
params: {
attr: null
},
messageKey: "_attributeIsRequired"
}, {
code: "xt1005",
messageKey: "_attributeReadOnly"
}, {
code: "xt1006",
params: {
attr: null,
length: null
},
messageKey: "_lengthInvalid"
}, {
code: "xt1007",
messageKey: "_recordNotFound"
}, {
code: "xt1008",
params: {
attr: null,
value: null
},
messageKey: "_valueExists"
}, {
code: "xt1009",
params: {
status: null
},
messageKey: "_recordStatusNotEditable"
}, {
code: "xt1010",
messageKey: "_canNotUpdate"
}, {
code: "xt2001",
messageKey: "_assignedToRequiredAssigned"
}, {
code: "xt2002",
messageKey: "_characteristicContextRequired"
}, {
code: "xt2003",
messageKey: "_duplicateValues"
}, {
code: "xt2004",
messageKey: "_nameRequired"
}, {
code: "xt2005",
messageKey: "_productCategoryRequiredOnSold"
}, {
code: "xt2006",
messageKey: "_recursiveParentDisallowed"
} ];
XT.errors = [], _.each(a, function(a) {
var b = XT.Error.create(a);
XT.errors.push(b);
});
})();

// log.js

XT.log = function() {
var a = XT.$A(arguments);
console.log.apply ? console.log.apply(console, a) : console.log(a.join(" "));
};

// datasource.js

(function() {
"use strict", XT.dataSource = {
datasourceUrl: document.location.hostname,
datasourcePort: 443,
isConnected: !1,
fetch: function(a) {
a = a ? _.clone(a) : {};
var b = this, c = {}, d = a.query.parameters, e, f = function(c) {
var d, e = {}, f;
if (c.isError) {
a && a.error && (e.error = c.reason.data.code, f = XT.Error.clone("xt1001", {
params: e
}), a.error.call(b, f));
return;
}
d = JSON.parse(c.data.rows[0].fetch), a && a.success && a.success.call(b, d);
}, g = function(b) {
var c = a.query.recordType, d = c ? XT.getObjectByName(c) : null, e = d ? d.prototype.relations : [], f = _.find(e, function(a) {
return a.key === b.attribute;
}), g;
b.value instanceof Date ? b.value = b.value.toJSON() : b.value instanceof XM.Model && (b.value = b.value.id), f && f.type === Backbone.HasOne && f.includeInJSON === !0 && (d = XT.getObjectByName(f.relatedModel), g = d.prototype.idAttribute, b.attribute = b.attribute + "." + g);
};
for (e in d) g(d[e]);
return c.requestType = "fetch", c.query = a.query, XT.Request.handle("function/fetch").notify(f).send(c);
},
retrieveRecord: function(a, b, c) {
var d = this, e = {}, f = function(a) {
var b, e = {}, f;
if (a.isError) {
c && c.error && (e.error = a.reason.data.code, f = XT.Error.clone("xt1001", {
params: e
}), c.error.call(d, f));
return;
}
b = JSON.parse(a.data.rows[0].retrieve_record);
if (_.isEmpty(b)) {
c && c.error && (f = XT.Error.clone("xt1007"), c.error.call(d, f));
return;
}
c && c.success && c.success.call(d, b);
};
return e.requestType = "retrieveRecord", e.recordType = a, e.id = b, XT.Request.handle("function/retrieveRecord").notify(f).send(e);
},
commitRecord: function(a, b) {
var c = this, d = {}, e = function(a) {
var d, e = {}, f;
if (a.isError) {
b && b.error && (e.error = a.reason.data.code, f = XT.Error.clone("xt1001", {
params: e
}), b.error.call(c, f));
return;
}
d = JSON.parse(a.data.rows[0].commit_record), b && b.success && b.success.call(c, d);
};
return d.requestType = "commitRecord", d.recordType = a.recordType, d.requery = b.requery, d.dataHash = a.changeSet(), XT.Request.handle("function/commitRecord").notify(e).send(d);
},
dispatch: function(a, b, c, d) {
var e = this, f = {
requestType: "dispatch",
className: a,
functionName: b,
parameters: c
}, g = function(a) {
var b, c = {}, f;
if (a.isError) {
d && d.error && (c.error = a.reason.data.code, f = XT.Error.clone("xt1001", {
params: c
}), d.error.call(e, f));
return;
}
b = JSON.parse(a.data.rows[0].dispatch), d && d.success && d.success.call(e, b);
};
return XT.Request.handle("function/dispatch").notify(g).send(f);
},
connect: function(a) {
if (this.isConnected) {
a && a instanceof Function && a();
return;
}
XT.log("Attempting to connect to the datasource");
var b = this.datasourceUrl, c = this.datasourcePort, d = "https://%@/clientsock".f(b), e = this, f = this.sockDidConnect, g = this.sockDidError;
this._sock = io.connect(d, {
port: c,
secure: !0
}), this._sock.on("connect", function() {}), this._sock.on("ok", function() {
f.call(e, a);
}), this._sock.on("error", function(b) {
g.call(e, b, a);
}), this._sock.on("debug", function(a) {
XT.log("SERVER DEBUG => ", a);
});
},
sockDidError: function(a, b) {
console.warn(a), b && b instanceof Function && b(a);
},
sockDidConnect: function(a) {
XT.log("Successfully connected to the datasource"), this.isConnected = !0, XT.session || (XT.session = Object.create(XT.Session), setTimeout(_.bind(XT.session.start, XT.session), 0)), a && a instanceof Function && a();
},
reset: function() {
if (!this.isConnected) return;
var a = this._sock;
a && (a.disconnect(), this.isConnected = !1), this.connect();
}
};
})();

// date.js

(function() {
"use strict", XT.date = {
convert: function(a) {
return a.constructor === Date ? a : a.constructor === Array ? new Date(a[0], a[1], a[2]) : a.constructor === Number ? new Date(a) : a.constructor === String ? new Date(a) : typeof a == "object" ? new Date(a.year, a.month, a.date) : NaN;
},
compare: function(a, b) {
return isFinite(a = this.convert(a).valueOf()) && isFinite(b = this.convert(b).valueOf()) ? (a > b) - (a < b) : NaN;
},
compareDate: function(a, b) {
if (!a || !b) return NaN;
var c = new Date(a.valueOf()), d = new Date(b.valueOf());
return c.setHours(0, 0, 0, 0), d.setHours(0, 0, 0, 0), this.compare(c, d);
},
inRange: function(a, b, c) {
return isFinite(a = this.convert(a).valueOf()) && isFinite(b = this.convert(b).valueOf()) && isFinite(c = this.convert(c).valueOf()) ? b <= a && a <= c : NaN;
}
};
})();

// math.js

(function() {
"use strict", XT.math = {
add: function(a, b, c) {
c = c || 0;
var d = Math.pow(10, c);
return Math.round(a * d + b * d) / d;
},
round: function(a, b) {
b = b || 0;
var c = Math.pow(10, b);
return Math.round(a * c) / c;
},
subtract: function(a, b, c) {
c = c || 0;
var d = Math.pow(10, c);
return Math.round(a * d - b * d) / d;
}
};
})();

// request.js

(function() {
"use strict", XT.Request = {
send: function(a) {
var b = XT.session.details, c = XT.dataSource._sock, d = this._notify, e = this._handle, f = {
payload: a
}, g;
return !!d && d instanceof Function ? g = function(a) {
d(_.extend(Object.create(XT.Response), a));
} : g = XT.K, f = _.extend(f, b), XT.log("Socket sending: %@".replace("%@", e), f), c.json.emit(e, f, g), this;
},
handle: function(a) {
return this._handle = a, this;
},
notify: function(a) {
var b = Array.prototype.slice.call(arguments).slice(1);
return this._notify = function(c) {
b.unshift(c), a.apply(null, b);
}, this;
}
};
})();

// response.js

(function() {
"use strict", XT.Response = {};
})();

// session.js

(function() {
"use strict", XT.Session = {
details: {},
availableSessions: [],
privileges: {},
settings: {},
schema: {},
SETTINGS: 1,
PRIVILEGES: 2,
SCHEMA: 4,
LOCALE: 8,
ALL: 15,
loadSessionObjects: function(a, b) {
var c = this, d, e, f, g, h, i;
return b && b.success && b.success instanceof Function ? i = b.success : i = XT.K, a === undefined && (a = this.ALL), a & this.PRIVILEGES && (d = b ? _.clone(b) : {}, d.success = function(a) {
e = new Backbone.Model, e.get = function(a) {
return _.isBoolean(a) ? a : Backbone.Model.prototype.get.call(this, a);
}, a.forEach(function(a) {
e.set(a.privilege, a.isGranted);
}), c.setPrivileges(e), i();
}, XT.dataSource.dispatch("XT.Session", "privileges", null, d)), a & this.SETTINGS && (f = b ? _.clone(b) : {}, f.success = function(a) {
g = new Backbone.Model, a.forEach(function(a) {
g.set(a.setting, a.value);
}), c.setSettings(g), i();
}, XT.dataSource.dispatch("XT.Session", "settings", null, f)), a & this.SCHEMA && (h = b ? _.clone(b) : {}, h.success = function(a) {
var b = new Backbone.Model(a), d, e, f, g;
c.setSchema(b);
for (d in b.attributes) if (b.attributes.hasOwnProperty(d)) {
f = b.attributes[d].relations || [];
if (f.length) {
e = XM.Model.getObjectByName("XM." + d);
if (e) {
e.prototype.relations = [];
for (g = 0; g < f.length; g++) {
if (f[g].type === "Backbone.HasOne") f[g].type = Backbone.HasOne; else {
if (f[g].type !== "Backbone.HasMany") continue;
f[g].type = Backbone.HasMany;
}
e.prototype.relations.push(f[g]);
}
}
}
}
i();
}, XT.dataSource.dispatch("XT.Session", "schema", "xm", h)), a & this.LOCALE && (XT.lang ? XT.locale.setLanguage(XT.lang) : XT.log("XT.session.loadSessionObjects(): could not find a valid language to load"), i && i instanceof Function && setTimeout(i, 1)), !0;
},
selectSession: function(a, b) {
var c = this, d = function(a) {
c._didAcquireSession.call(c, a, b);
};
XT.Request.handle("session/select").notify(d).send(a);
},
getAvailableSessions: function() {
return this.availableSessions;
},
getDetails: function() {
return this.details;
},
getSchema: function() {
return this.schema;
},
getSettings: function() {
return this.settings;
},
getPrivileges: function() {
return this.privileges;
},
setAvailableSessions: function(a) {
return this.availableSessions = a, this;
},
setDetails: function(a) {
return this.details = a, this;
},
setSchema: function(a) {
return this.schema = a, this;
},
setSettings: function(a) {
return this.settings = a, this;
},
setPrivileges: function(a) {
return this.privileges = a, this;
},
validateSession: function(a, b) {
var c = this, d = function(a) {
c._didValidateSession.call(c, a, b);
};
this.details = a, XT.Request.handle("session").notify(d).send(a);
},
_didValidateSession: function(a, b) {
var c = document.location.hostname;
if (a.code !== 1) return document.location = "https://%@/login".f(c);
this.setDetails(a.data), XT.getStartupManager().start(), b && b instanceof Function && b(a);
},
start: function() {
var a = enyo.getCookie("xtsessioncookie");
try {
a = JSON.parse(a), this.validateSession(a, function() {
XT.app.show();
});
} catch (b) {
XT.Session.logout();
}
},
logout: function() {
var a = document.location.hostname;
XT.Request.handle("function/logout").notify(function() {
document.location = "https://%@/login".f(a);
}).send();
},
DB_BOOLEAN: "B",
DB_STRING: "S",
DB_COMPOUND: "C",
DB_DATE: "D",
DB_NUMBER: "N",
DB_ARRAY: "A",
DB_BYTEA: "U",
DB_UNKNOWN: "X"
};
})();

// locale.js

(function() {
"use strict", XT.locale = {
hasStrings: !1,
strings: {},
lang: "",
getHasStrings: function() {
return this.hasStrings;
},
getLang: function() {
return this.lang;
},
getStrings: function() {
return this.strings;
},
setHasStrings: function(a) {
return this.hasStrings = a, this;
},
setLang: function(a) {
return this.lang = a, this;
},
setStrings: function(a) {
return this.strings = a, this;
},
setLanguage: function(a) {
if (this.getHasStrings()) return console.log("attempt to set a new language");
this.setLang(a.lang || "en"), this.setStrings(a.strings || {});
},
stringsChanged: function() {
var a = this.getStrings();
a && a instanceof Object && Object.keys(a).length > 0 ? this.setHasStrings(!0) : this.error("something is amiss");
},
loc: function(a) {
var b = this.getStrings();
return b[a] || a.toString();
}
}, XT.stringsFor = function(a, b) {
XT.lang ? console.log("XT.stringsFor(): request to write over current language") : XT.lang = {
lang: a,
strings: b
};
};
})();

// strings.js

XT.stringsFor("en_US", {
_abbreviation: "Abbreviation",
_abbreviationLong: "Abbreviation Long",
_abbreviationShort: "Abbreviation Short",
_account: "Account",
_accountNumber: "Account Number",
_accountNumberGeneration: "Account Number Generation",
_accountType: "Account Type",
_accounts: "Accounts",
_active: "Active",
_actual: "Actual",
_actualClose: "Actual Close",
_actualExpenses: "Actual Expenses",
_actualExpensesTotal: "Total Expenses Actual",
_actualHours: "Actual Hours",
_actualHoursTotal: "Total Hours Actual",
_additional: "Additional",
_address: "Address",
_address1: "Address1",
_address2: "Address2",
_addressCharacteristic: "Address Characteristic",
_addressComment: "Address Comment",
_alarms: "Alarms",
_altEmphasisColor: "Alt Emphasis Color",
_alternate: "Alternate",
_alternateAddresses: "Alternate Addresses",
_amount: "Amount",
_array: "Array",
_assignDate: "Assign Date",
_assigned: "Assigned",
_assignedTo: "Assigned To",
_assignedEndDate: "Assigned End Date",
_assignedStartDate: "Assigned Start Date",
_automatic: "Automatic",
_automaticAllowOverride: "Automatic Allow Override",
_back: "Back",
_balance: "Balance",
_balanceExpensesTotal: "Balance Expenses Total",
_balanceHoursTotal: "Balance Hours Total",
_boolean: "Boolean",
_budgetedExpenses: "Budgeted Expenses",
_budgetedExpensesTotal: "Total Expenses Budgeted",
_budgetedHours: "Budgeted Hours",
_budgetedHoursTotal: "Total Hours Budgeted",
_canCreateUsers: "Can Create Users",
_cancel: "Cancel",
_category: "Category",
_characteristic: "Characteristic",
_characteristicType: "Characteristic Type",
_characteristicOption: "Characteristic Option",
_characteristics: "Characteristics",
_child: "Child",
_city: "City",
_classCode: "Class Code",
_closeDate: "Close Date",
_closed: "Closed",
_code: "Code",
_commentType: "Comment Type",
_comments: "Comments",
_completed: "Completed",
_completedEndDate: "Completed End Date",
_completedStartDate: "Completed Start Date",
_commentsEditable: "Comments Editable",
_company: "Company",
_completeDate: "Complete Date",
_concept: "Concept",
_confirmed: "Confirmed",
_contact: "Contact",
_contactRelations: "Contacts",
_contacts: "Contacts",
_country: "Country",
_created: "Created",
_createdBy: "Created By",
_crm: "CRM",
_crmSetup: "CRM Setup",
_currency: "Currency",
_currencyAbbreviation: "Currency Abbreviation",
_currencyName: "Currency Name",
_currencyNumber: "Currency Number",
_currencySymbol: "Currency Symbol",
_dashboard: "Dashboard",
_data: "Data",
_dataState: "Data State",
_date: "Date",
_deactivate: "Deactivate",
_delete: "Delete",
_description: "Description",
_description1: "Description1",
_description2: "Description2",
_disableExport: "Disable Export",
_document: "Document",
_documentDate: "Document Date",
_documentNumber: "Document #",
_documentType: "Document Type",
_dueDate: "Due Date",
_dueDays: "Due Days",
_dueEndDate: "Due End Date",
_dueStartDate: "Due Start Date",
_duplicate: "Duplicate",
_effective: "Effective",
_email: "Email",
_emphasisColor: "Emphasis Color",
_enabled: "Enabled?",
_end: "End",
_endBalance: "End Balance",
_endDate: "End Date",
_ending: "Ending",
_endingLabel: "Ending Label",
_errorColor: "Error Color",
_eventRecipient: "Event Recipient",
_expiredColor: "Expired Color",
_expires: "Expires",
_extended: "Extended",
_extendedDescription: "Extended Description",
_extendedPriceScale: "Extended Price Scale",
_externalReference: "External Reference",
_fax: "Fax",
_feedback: "Feedback",
_file: "File",
_files: "Files",
_filter: "Filter",
_firstName: "First Name",
_for: "For",
_fractional: "Fractional",
_frequency: "Frequency",
_futureColor: "Future Color",
_grantedPrivileges: "Granted Privileges",
_grantedUserAccountRoles: "Granted User Account Roles",
_groupSequence: "Group Sequence",
_groups: "Groups",
_history: "History",
_home: "Home",
_honorific: "Honorific",
_hours: "Hours",
_hrs: "hrs.",
_image: "Image",
_images: "Images",
_incident: "Incident",
_incidentRelations: "Incidents",
_incidents: "Incidents",
_incidentStatus: "Status",
_incidentNumberGeneration: "Incident Number Generation",
_incidentsPublicByDefault: "Incidents public by default",
_incidentsShowPublicCheckbox: "Incidents show public checkbox",
_individual: "Individual",
_initials: "Initials",
_inProcess: "In Process",
_inventoryUnit: "Inventory Unit",
_isActive: "Active",
_isAddresses: "Addresses",
_isBase: "Base",
_isContacts: "Contacts",
_isDefault: "Default",
_isDeleted: "Deleted",
_isEvent: "Event",
_isFractional: "Fractional",
_isIncidents: "Incidents",
_isItemWeight: "Item Weight",
_isItems: "Items",
_isMessage: "Message",
_isOpen: "Open",
_isOpportunities: "Opportunities",
_isPosted: "Posted",
_isPrinted: "Printed",
_isPublic: "Public",
_isSold: "Sold",
_item: "Item",
_itemConversion: "Item Conversion",
_itemNumber: "Item Number",
_itemUnitConversion: "Item Unit Conversion",
_itemUnitType: "Item Unit Type",
_items: "Items",
_jobTitle: "Job Title",
_language: "Language",
_lastName: "Last Name",
_line1: "Line1",
_line2: "Line2",
_line3: "Line3",
_lineNumber: "Line Number",
_lines: "Lines",
_listPrice: "List Price",
_locale: "Locale",
_logout: "Logout",
_mainAddress: "Main Address",
_manual: "Manual",
_mask: "Mask",
_maximum: "Maximum",
_messageRecipient: "Message Recipient",
_middleName: "Middle Name",
_module: "Module",
_monthExpire: "Month Expire",
_multiple: "Multiple",
_name: "Name",
_neither: "Neither",
_new: "New",
_nextNumber: "Next #",
_nextCheckNumber: "Next Check Number",
_notes: "Notes",
_number: "Number",
_object: "Object",
_offset: "Offset",
_ok: "Ok",
_other: "Other",
_openBalance: "Open Balance",
_openDate: "Open Date",
_opportunities: "Opportunities",
_opportunity: "Opportunity",
_opportunityChangeLog: "Post Opportunity changes to Change Log",
_opportunityRelations: "Opportunities",
_opportunitySource: "Source",
_opportunityStage: "Stage",
_opportunityType: "Type",
_open: "Open",
_options: "Options",
_order: "Order",
_orderDate: "Order Date",
_orderNumber: "Order Number",
_ordered: "Ordered",
_owner: "Owner",
_overview: "Overview",
_paid: "Paid",
_parent: "Parent",
_password: "Password",
_path: "Path",
_pending: "Pending",
_percent: "Percent",
_period: "Period",
_phone: "Phone",
_postalCode: "Postal Code",
_price: "Price",
_priceUnit: "Price Unit",
_priceUnitRatio: "Price Unit Ratio",
_primaryContact: "Primary Contact",
_primaryEmail: "Primary Email",
_printed: "Printed",
_priority: "Priority",
_privilege: "Privilege",
_privileges: "Privileges",
_probability: "Probability",
_productCategory: "Product Category",
_profitCenter: "Profit Center",
_project: "Project",
_projectAssignedTo: "Project Assigned To",
_projectOwner: "Project Owner",
_projectRelations: "Projects",
_projectStatus: "Project Status",
_projectTask: "Project Task",
_projectTaskStatus: "Project Task Status",
_projects: "Projects",
_properName: "Proper Name",
_propername: "Propername",
_purchaseOrderNumber: "Purchase Order",
_purpose: "Purpose",
_resolved: "Resolved",
_qualifier: "Qualifier",
_quantity: "Quantity",
_recurrences: "Recurrences",
_recurring: "Recurring",
_reference: "Reference",
_relatedTo: "Related To",
_resolution: "Resolution",
_save: "Save",
_schedule: "Schedule",
_search: "Search",
_secondaryContact: "Secondary Contact",
_sense: "Sense",
_series: "Series",
_setup: "Setup",
_severity: "Severity",
_showCompleted: "Show Completed",
_showCompletedOnly: "Show Completed Only",
_showInactive: "Show Inactive",
_source: "Source",
_sourceType: "Source Type",
_start: "Start",
_startDate: "Start Date",
_startEndDate: "Start End Date",
_startStartDate: "Start Start Date",
_state: "State",
_states: "States",
_status: "Status",
_street: "Street",
_string: "String",
_suffix: "Suffix",
_summary: "Summary",
_symbol: "Symbol",
_target: "Target",
_targetClose: "Target Close",
_targetType: "Target Type",
_tasks: "Tasks",
_taxAuthority: "Tax Authority",
_text: "Text",
_time: "Time",
_toDo: "To Do",
_toDoRelations: "To Dos",
_toDoStatus: "To Do Status",
_toDos: "To Dos",
_total: "Total",
_totals: "Totals",
_toUnit: "To Unit",
_trigger: "Trigger",
_type: "Type",
_unit: "Unit",
_unitType: "Unit Type",
_unknown: "(unknown)",
_updated: "Updated",
_updatedBy: "Updated By",
_url: "Url",
_urls: "Urls",
_useDescription: "Use Description",
_userAccount: "User Account",
_userAccounts: "User Accounts",
_userAccountRole: "User Account Role",
_userAccountRoles: "User Account Roles",
_username: "Username",
_validator: "Validator",
_value: "Value",
_warningColor: "Warning Color",
_webAddress: "Web Address",
_xtuplePostbooks: "PostBooks",
_assignedToRequiredAssigned: "Assigned to is required when status is 'Assigned'",
_attributeIsRequired: "'{attr}' is required.",
_attributeTypeMismatch: "The value of '{attr}' must be type: {type}.",
_attributeNotInSchema: "'{attr}' does not exist in the schema.",
_attributeReadOnly: "Can not edit read only attribute(s).",
_canNotUpdate: "Insufficient privileges to edit the record.",
_characteristicContextRequired: "You must set at least one characteristic context to true.",
_datasourceError: "Data source error: {error}",
_duplicateValues: "Duplicate values are not allowed.",
_lengthInvalid: "Length of {attr} must be {length}.",
_nameRequired: "A name is required.",
_noAccountName: "No Account Name",
_noCategory: "No Category",
_noCloseTarget: "No Close Target",
_noContact: "No Contact",
_noDescription: "No Description",
_noEmail: "No Email",
_noJobTitle: "No Job Title",
_noName: "No Name",
_noNumber: "No Number",
_noPhone: "No Phone",
_noPriority: "No Priority",
_noSalesRep: "No Sales Rep",
_noSeverity: "No Severity",
_noStage: "No Stage",
_noTerms: "No Terms",
_noType: "No Type",
_productCategoryRequiredOnSold: "A Product Category is required for sold items.",
_recordNotFound: "Record not found.",
_recordStatusNotEditable: "Record with status of `{status}` is not editable.",
_recursiveParentDisallowed: "Record is not allowed to reference itself as the parent.",
_valueExists: "Record with {attr} of '{value}' already exists."
}), XT.locale.setLanguage(XT.lang);

// string.js

_.extend(String.prototype, {
camelize: function() {
var a = XT.$A(arguments);
return XT.String.camelize(this, a);
},
format: function() {
var a = XT.$A(arguments);
return XT.String.format(this, a);
},
f: function() {
var a = XT.$A(arguments);
return XT.String.format(this, a);
},
loc: function() {
var a = XT.$A(arguments);
return a.unshift(this), XT.String.loc.apply(XT.String, a);
},
trim: function() {
return XT.String.trim(this);
}
});

// string.js

XT.String = {
camelize: function(a) {
var b = a.replace(/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g, function(a, b, c) {
return c ? c.toUpperCase() : "";
}), c = b.charAt(0), d = c.toLowerCase();
return c !== d ? d + b.slice(1) : b;
},
loc: function(a) {
if (!XT.locale) return XT.warn("XT.String.loc(): attempt to localize string but no locale set"), a;
var b = XT.$A(arguments), c = XT.locale.loc(a);
b.shift();
if (!(b.length > 0)) return c;
try {
return XT.String.format(c, b);
} catch (d) {
XT.error("could not localize string, %@".f(a), d);
}
},
format: function(a, b) {
if (arguments.length === 0) return "";
if (arguments.length === 1) return a;
var c = 0, d, e;
for (; c < b.length; ++c) {
e = b[c];
if (!e) continue;
d = typeof e;
if (d === "object") a = XT.String.replaceKeys(a, e); else {
if (d !== "string" && d !== "number") continue;
a = a.replace(/\%@/, e);
}
}
return a;
},
replaceKeys: function(a, b) {
if (typeof a != "string") return "";
if (typeof b != "object") return a;
var c, d, e, f;
for (d in b) b.hasOwnProperty(d) && (e = "{" + d + "}", c = new RegExp(e, "g"), f = b[d], a = a.replace(c, f));
return a;
},
trim: function(b) {
return !!b && b instanceof String ? b.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : "";
}
};

// startup_task.js

(function() {
"use strict";
var a = XT.StartupTask = function(a) {
var b;
this._properties = {
taskName: "",
waitingList: [],
isComplete: !1,
task: null
};
for (b in a) a.hasOwnProperty(b) && (this._properties[b] = a[b]);
(!this.get("taskName") || this.get("taskName") === "") && this.set("taskName", _.uniqueId("xt_task_")), XT.getStartupManager().registerTask(this);
};
a.prototype.get = function(a) {
var b = this._properties, c = b[a];
return c;
}, a.prototype.set = function(a, b) {
var c = this._properties, d;
if (typeof a == "string" && b) c[a] = b; else if (a && !b) {
b = a;
for (d in b) b.hasOwnProperty(d) && this.set(d, b[d]);
}
return this;
}, a.prototype.checkWaitingList = function(a) {
var b = this.get("waitingList");
b && b.length > 0 && b.indexOf(a) > -1 && this.set("waitingList", b = _.without(b, a));
}, a.prototype.exec = function() {
if (this.get("isComplete")) return !0;
var a = this.get("task");
return !!a && a instanceof Function ? this.get("waitingList").length > 0 ? !1 : (a.call(this), !0) : (this.error("Could not execute without an actual task"), !1);
}, a.prototype.didComplete = function() {
this.set("isComplete", !0), XT.getStartupManager().taskDidComplete(this);
}, a.create = function(a) {
return new XT.StartupTask(a);
};
})(), function() {
"use strict";
var a = XT.StartupTaskManager = function() {
XT.getStartupManager = _.bind(function() {
return this;
}, this), this._properties = {
queue: [],
tasks: {},
completed: [],
isStarted: !1,
callbacks: []
};
}, b;
a.prototype.get = function(a) {
var b = this._properties, c = b[a];
return c;
}, a.prototype.set = function(a, b) {
var c = this._properties, d;
if (typeof a == "string" && b) c[a] = b; else if (a && !b) {
b = a;
for (d in b) b.hasOwnProperty(d) && this.set(d, b[d]);
}
return this;
}, a.prototype.registerTask = function(a) {
var b = a.get("taskName"), c = this.get("tasks"), d = this.get("queue");
c[b] || (c[b] = {
task: a
}), this.get("isStarted") ? a.exec() : d.push(a);
}, a.prototype.taskDidComplete = function(a) {
var b = a.get("taskName"), c = this.get("completed"), d = this.get("tasks"), e, f, g = Object.keys(d).length;
c.push(b);
for (e in d) d.hasOwnProperty(e) && (f = d[e], e = f.task, e.get("isComplete") || e.checkWaitingList(b));
g > c.length ? this.start() : this.allDone();
}, a.prototype.start = function() {
if (this.get("isStarted")) return !1;
var a = this.get("queue"), b = [], c, d, e = a.length;
if (!a || a.length <= 0) {
this.set("isStarted", !0);
return;
}
for (c = 0; c < e; c += 1) d = a.shift(), d.exec() || b.push(d);
b.length > 0 ? this.set("queue", b) : this.start();
}, a.prototype.registerCallback = function(a) {
var b = this.get("callbacks") || [];
b.push(a);
}, a.prototype.allDone = function() {
var a = this.get("callbacks") || [], b;
while (a.length > 0) b = a.shift(), b && b instanceof Function && b();
}, b = new XT.StartupTaskManager;
}();

// model.js

(function() {
"use strict", XM.Model = Backbone.RelationalModel.extend({
autoFetchId: !0,
lastError: null,
prime: null,
privileges: null,
readOnly: !1,
readOnlyAttributes: null,
nameAttribute: "name",
recordType: null,
requiredAttributes: null,
status: null,
canUpdate: function() {
return this.getClass().canUpdate(this);
},
canDelete: function() {
return this.getClass().canDelete(this);
},
changeSet: function() {
var a = this.toJSON(), b = function(a) {
var c = null, d, e, f;
if (a && a.dataState !== "read") {
c = {};
for (e in a) if (a[e] instanceof Array) {
c[e] = [];
for (d = 0; d < a[e].length; d++) f = b(a[e][d]), f && c[e].push(f);
} else c[e] = a[e];
}
return c;
};
return b(a);
},
didChange: function(a, b) {
a = a || {}, b = b || {};
var c = XM.Model, d = this.getStatus(), e;
if (b.force) return;
d === c.READY_CLEAN && this.setStatus(c.READY_DIRTY);
if (d & c.READY) for (e in this.changed) this.changed.hasOwnProperty(e) && this.prime[e] === undefined && (this.prime[e] = this.previous(e));
},
didDestroy: function() {
var a = XM.Model;
this.setStatus(a.DESTROYED_CLEAN), this.clear({
silent: !0
});
},
didError: function(a, b) {
a = a || {}, this.lastError = b, XT.log(b);
},
original: function(a) {
return this.prime[a] || this.get(a);
},
originalAttributes: function() {
return _.defaults(_.clone(this.prime), _.clone(this.attributes));
},
destroy: function(a) {
a = a ? _.clone(a) : {};
var b = this.getClass(), c = a.success, d = this, e, f = XM.Model, g = this.getParent(!0), h = [], i = function(a) {
_.each(a.relations, function(b) {
var c, d = a.attributes[b.key];
if (d && d.models && b.type === Backbone.HasMany) {
for (c = 0; c < d.models.length; c += 1) i(d.models[c]);
h = _.union(h, d.models);
}
});
};
return g && g.canUpdate(this) || !g && b.canDelete(this) ? (this.setStatus(f.DESTROYED_DIRTY, {
cascade: !0
}), this._wasNew = this.isNew(), !g && b.canDelete(this) ? (i(this), this.setStatus(f.BUSY_DESTROYING, {
cascade: !0
}), a.wait = !0, a.success = function(b) {
var e;
for (e = 0; e < h.length; e += 1) h[e].didDestroy();
XT.log("Destroy successful"), c && c(d, b, a);
}, e = Backbone.Model.prototype.destroy.call(this, a), delete this._wasNew, e) : !0) : (XT.log("Insufficient privileges to destroy"), !1);
},
fetch: function(a) {
a = a ? _.clone(a) : {};
var b = this, c = XM.Model, d = a.success, e = this.getClass();
return e.canRead() ? (this.setStatus(c.BUSY_FETCHING, {
cascade: !0
}), a.cascade = !0, a.success = function(e) {
b.setStatus(c.READY_CLEAN, a), XT.log("Fetch successful"), d && d(b, e, a);
}, Backbone.Model.prototype.fetch.call(this, a)) : (XT.log("Insufficient privileges to fetch"), !1);
},
fetchId: function(a) {
a = _.defaults(a ? _.clone(a) : {}, {
force: !0
});
var b = this, c;
this.id || (a.success = function(c) {
b.set(b.idAttribute, c, a);
}, XT.dataSource.dispatch("XM.Model", "fetchId", this.recordType, a)), a && a.cascade && _.each(this.relations, function(d) {
c = b.attributes[d.key], c && d.type === Backbone.HasMany && c.models && _.each(c.models, function(b) {
b.fetchId && b.fetchId(a);
});
});
},
findExisting: function(a, b, c) {
return this.getClass().findExisting.call(this, a, b, c);
},
getAttributeNames: function() {
return this.getClass().getAttributeNames.call(this);
},
getClass: function() {
return Backbone.Relational.store.getObjectByName(this.recordType);
},
getParent: function(a) {
var b, c, d = _.find(this.relations, function(a) {
if (a.reverseRelation && a.isAutoRelation) return !0;
});
return b = d && d.key ? this.get(d.key) : !1, b && a && (c = b.getParent(a)), c || b;
},
getStatus: function() {
return this.status;
},
getStatusString: function() {
var a = [], b = this.getStatus(), c;
for (c in XM.Model) XM.Model.hasOwnProperty(c) && c.match(/[A-Z_]$/) && XM.Model[c] === b && a.push(c);
return a.join(" ");
},
getValue: function(a) {
return _.has(this.attributes, a) ? this.attributes[a] : _.isFunction(this[a]) ? this[a]() : this[a];
},
initialize: function(a, b) {
a = a || {}, b = b || {};
var c, d = XM.Model;
if (_.isEmpty(this.recordType)) throw "No record type defined";
this.prime = {}, this.privileges = this.privileges || {}, this.readOnlyAttributes = this.readOnlyAttributes || [], this.requiredAttributes = this.requiredAttributes || [];
if (b.isNew) {
c = this.getClass();
if (!c.canCreate()) throw "Insufficent privileges to create a record.";
this.setStatus(d.READY_NEW, {
cascade: !0
}), this.autoFetchId && this.fetchId({
cascade: !0
});
} else b.force && this.setStatus(d.READY_CLEAN);
this.idAttribute && this.setReadOnly(this.idAttribute), this.idAttribute && !_.contains(this.requiredAttributes, this.idAttribute) && this.requiredAttributes.push(this.idAttribute), this.setReadOnly("type"), this.on("change", this.didChange), this.on("error", this.didError), this.on("destroy", this.didDestroy);
},
isNew: function() {
var a = XM.Model;
return this.getStatus() === a.READY_NEW || this._wasNew;
},
isDirty: function() {
var a = this.getStatus(), b = XM.Model;
return a === b.READY_NEW || a === b.READY_DIRTY;
},
isReadOnly: function(a) {
var b, c;
if (!_.isString(a) && !_.isObject(a) || this.readOnly) c = this.readOnly; else if (_.isObject(a)) {
for (b in a) a.hasOwnProperty(b) && _.contains(this.readOnlyAttributes, b) && (c = !0);
c = !1;
} else c = _.contains(this.readOnlyAttributes, a);
return c;
},
parse: function(a) {
var b = XT.Session, c, d, e = function(a) {
a = d(a);
}, f = function(a, b) {
var c = XT.session.getSchema().get(a).columns;
return _.find(c, function(a) {
return a.name === b;
});
};
return d = function(a) {
var g;
for (g in a) a.hasOwnProperty(g) && (_.isArray(a[g]) ? _.each(a[g], e) : _.isObject(a[g]) ? a[g] = d(a[g]) : (c = f(a.type, g), c && c.category && c.category === b.DB_DATE && a[g] !== null && (a[g] = new Date(a[g]))));
return a;
}, d(a);
},
save: function(a, b, c) {
c = c ? _.clone(c) : {};
var d = {}, e = this, f = XM.Model, g = c.success, h, i = this.getStatus();
if (this.getParent()) return XT.log("You must save on the root level model of this relation"), !1;
_.isObject(a) || _.isEmpty(a) ? (d = a, c = b ? _.clone(b) : {}) : _.isString(a) && (d[a] = b);
if (this.isDirty() || d) {
c.wait = !0, c.cascade = !0, c.success = function(a) {
e.setStatus(f.READY_CLEAN, c), XT.log("Save successful"), g && g(e, a, c);
};
if (_.isObject(a) || _.isEmpty(a)) b = c;
return this.setStatus(f.BUSY_COMMITTING, {
cascade: !0
}), h = Backbone.Model.prototype.save.call(this, a, b, c), h || this.setStatus(i, {
cascade: !0
}), h;
}
return XT.log("No changes to save"), !1;
},
setReadOnly: function(a, b) {
return _.isString(a) ? (b = _.isBoolean(b) ? b : !0, b && !_.contains(this.readOnlyAttributes, a) ? this.readOnlyAttributes.push(a) : !b && _.contains(this.readOnlyAttributes, a) && (this.readOnlyAttributes = _.without(this.readOnlyAttributes, a))) : (a = _.isBoolean(a) ? a : !0, this.readOnly = a), this;
},
setStatus: function(a, b) {
var c = XM.Model, d, e = this, f, g = {
force: !0
};
if (this.isLocked() || this.status === a) return;
this.acquire(), this.status = a, f = this.getParent();
if (a === c.READY_NEW || a === c.READY_CLEAN) this.prime = {};
return b && b.cascade && _.each(this.relations, function(c) {
d = e.attributes[c.key], d && d.models && c.type === Backbone.HasMany && _.each(d.models, function(c) {
c.setStatus && c.setStatus(a, b);
});
}), a === c.READY_NEW ? this.set("dataState", "create", g) : a === c.READY_CLEAN ? this.set("dataState", "read", g) : a === c.READY_DIRTY ? this.set("dataState", "update", g) : a === c.DESTROYED_DIRTY && this.set("dataState", "delete", g), f && f.trigger("change", this, a, b), this.release(), this.trigger("statusChange", this, a, b), this;
},
sync: function(a, b, c) {
c = c ? _.clone(c) : {};
var d = this, e = c.id || b.id, f = this.recordType, g, h = c.error;
c.error = function(a) {
var e = XM.Model;
d.setStatus(e.ERROR), h && h(b, a, c);
};
if (a === "read" && f && e && c.success) g = XT.dataSource.retrieveRecord(f, e, c); else if (a === "create" || a === "update" || a === "delete") g = XT.dataSource.commitRecord(b, c);
return g || !1;
},
validate: function(a, b) {
a = a || {}, b = b || {};
if (b.force) return;
var c = this, d, e, f = XM.Model, g = XT.Session, h = _.keys(a), i = _.pick(this.originalAttributes(), h), j = this.getStatus(), k, l, m, n, o = {}, p = this.recordType.replace(/\w+\./i, ""), q = XT.session.getSchema().get(p).columns, r = function(a, b, d) {
var e;
return e = _.find(c.relations, function(b) {
return b.key === a && b.type === d;
}), e ? _.isObject(b) : !1;
}, s = function(a) {
return _.find(q, function(b) {
return b.name === a;
});
};
if (j === f.ERROR || j === f.EMPTY || j & f.DESTROYED) return XT.Error.clone("xt1009", {
params: {
status: this.getStatusString()
}
});
for (k in a) if (a.hasOwnProperty(k) && !_.isNull(a[k]) && !_.isUndefined(a[k])) {
o.attr = ("_" + k).loc(), l = a[k], n = s(k), m = n ? n.category : !1;
switch (m) {
case g.DB_BYTEA:
case g.DB_UNKNOWN:
case g.DB_STRING:
if (!_.isString(l)) return o.type = "_string".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
case g.DB_NUMBER:
if (!_.isNumber(l) && !r(k, l, Backbone.HasOne)) return o.type = "_number".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
case g.DB_DATE:
if (!_.isDate(l)) return o.type = "_date".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
case g.DB_BOOLEAN:
if (!_.isBoolean(l)) return o.type = "_boolean".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
case g.DB_ARRAY:
if (!_.isArray(l) && !r(k, l, Backbone.HasMany)) return o.type = "_array".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
case g.DB_COMPOUND:
if (!_.isObject(l)) return o.type = "_object".loc(), XT.Error.clone("xt1003", {
params: o
});
break;
default:
return XT.Error.clone("xt1002", {
params: o
});
}
}
if (j === f.BUSY_COMMITTING) {
for (d = 0; d < this.requiredAttributes.length; d += 1) {
l = a[this.requiredAttributes[d]];
if (l === undefined || l === null) return o.attr = ("_" + this.requiredAttributes[d]).loc(), XT.Error.clone("xt1004", {
params: o
});
}
e = this.validateSave(a, b);
if (e) return e;
}
if (j & f.READY && !_.isEqual(a, i)) {
for (k in a) if (a[k] !== this.original(k) && this.isReadOnly(k)) return XT.Error.clone("xt1005");
if (!this.canUpdate()) return XT.Error.clone("xt1010");
}
return this.validateEdit(a, b);
},
validateEdit: function(a, b) {},
validateSave: function(a, b) {}
}), _.extend(XM.Model, {
canCreate: function() {
return XM.Model.canDo.call(this, "create");
},
canRead: function() {
var a = this.prototype.privileges, b = XT.session.privileges, c = !1;
return _.isEmpty(a) ? !0 : (b && b.get && (c = a.all && a.all.read ? b.get(a.all.read) : !1, c || (c = a.all && a.all.update ? b.get(a.all.update) : !1), c || (c = a.personal && a.personal.read ? b.get(a.personal.read) : !1), c || (c = a.personal && a.personal.update ? b.get(a.personal.update) : !1)), c);
},
canUpdate: function(a) {
return XM.Model.canDo.call(this, "update", a);
},
canDelete: function(a) {
return XM.Model.canDo.call(this, "delete", a);
},
canDo: function(a, b) {
var c = this.prototype.privileges, d = XT.session.privileges, e = !1, f = !1, g = XT.session.details.username, h, i, j;
if (_.isEmpty(c)) return !0;
d && d.get && (c.all && c.all[a] && (e = d.get(c.all[a])), !e && c.personal && c.personal[a] && (f = d.get(c.personal[a])));
if (!e && f && b) {
i = 0, j = c.personal && c.personal.properties ? c.personal.properties : [], f = !1;
while (!f && i < j.length) h = b.original(j[i]), h = typeof h == "object" ? h.get("username") : h, f = h === g, i += 1;
}
return e || f;
},
getAttributeNames: function() {
var a = this.recordType || this.prototype.recordType, b = a.replace(/\w+\./i, "");
return _.pluck(XT.session.getSchema().get(b).columns, "name");
},
getObjectByName: function(a) {
return Backbone.Relational.store.getObjectByName(a);
},
getSearchableAttributes: function() {
var a = this, b = this.prototype.recordType, c = b.split(".")[1], d = XT.session.getSchema().get(c), e = [], f, g, h, i, j, k = function(b) {
var c = a.prototype.relations, d = _.find(c, function(a) {
return a.key === b;
}).relatedModel;
return typeof d == "string" ? a.getObjectByName(d) : d;
};
for (h = 0; h < d.columns.length; h++) {
f = d.columns[h].name;
if (d.columns[h].category === "S") e.push(f); else if (d.columns[h].category === "C") {
j = k(f), g = j.getSearchableAttributes();
for (i = 0; i < g.length; i++) e.push(f + "." + g[i]);
}
}
return e;
},
findExisting: function(a, b, c) {
var d = this.recordType || this.prototype.recordType, e = [ d, a, b, this.id || -1 ];
return XT.dataSource.dispatch("XM.Model", "findExisting", e, c), XT.log("XM.Model.findExisting for: " + d), this;
},
findOrCreate: function(a, b) {
return b = b ? _.clone(b) : {}, b.force = !0, Backbone.RelationalModel.findOrCreate.call(this, a, b);
},
CLEAN: 1,
DIRTY: 2,
EMPTY: 256,
ERROR: 4096,
READY: 512,
READY_CLEAN: 513,
READY_DIRTY: 514,
READY_NEW: 515,
DESTROYED: 1024,
DESTROYED_CLEAN: 1025,
DESTROYED_DIRTY: 1026,
BUSY: 2048,
BUSY_FETCHING: 2052,
BUSY_COMMITTING: 2064,
BUSY_DESTROYING: 2112
}), XM.Model = XM.Model.extend({
status: XM.Model.EMPTY
});
var a = Backbone.Relation.prototype.setRelated;
Backbone.Relation.prototype.setRelated = function(b, c) {
c = c ? _.clone(c) : {}, c.force = !0, c.silent = !1, a.call(this, b, c);
}, Backbone.HasMany.prototype.handleAddition = function(a, b, c) {
b = b || {};
if (!(a instanceof Backbone.Model)) return;
var d = this;
c = this.sanitizeOptions(c), _.each(this.getReverseRelations(a), function(a) {
a.addRelated(this.instance, c);
}, this), Backbone.Relational.eventQueue.add(function() {
c.silentChange || (d.instance.trigger("add:" + d.key, a, d.related, c), d.instance.trigger("change", a, d.related, c));
});
};
})();

// collection.js

(function() {
"use strict", XM.Collection = Backbone.Collection.extend({
add: function(a, b) {
var c = Backbone.Collection.prototype.add.call(this, a, b), d, e = XM.Model;
for (d = 0; d < c.models.length; d += 1) c.models[d].setStatus(e.READY_CLEAN);
return c;
},
getObjectByName: function(a) {
return Backbone.Relational.store.getObjectByName(a);
},
fetch: function(a) {
return a = a ? _.clone(a) : {}, a.force = !0, Backbone.Collection.prototype.fetch.call(this, a);
},
sync: function(a, b, c) {
return c = c ? _.clone(c) : {}, c.query = c.query || {}, c.query.recordType = b.model.prototype.recordType, a === "read" && c.query.recordType && c.success ? XT.dataSource.fetch(c) : !1;
}
});
})();

// document.js

(function() {
"use strict", XM.Document = XM.Model.extend({
documentKey: "number",
enforceUpperKey: !0,
keyIsString: !0,
numberPolicy: null,
numberPolicySetting: null,
destroy: function() {
var a = XM.Model, b = this.getStatus();
b === a.READY_NEW && this._number && this.releaseNumber(), XM.Model.prototype.destroy.apply(this, arguments);
},
documentKeyDidChange: function(a, b, c) {
var d = XM.Model, e = this, f = this.getStatus(), g = b;
c = c || {}, this.keyIsString && b && b.toUpperCase && (g = g.toUpperCase());
if (c.force || !(f & d.READY)) return;
if (this.enforceUpperKey && b !== g) {
this.set(this.documentKey, g);
return;
}
f === d.READY_NEW && this._number && this._number !== b && this.releaseNumber(), b && this.isDirty() && !this._number && (c.success = function(a) {
var d, f = {};
a && (f.attr = ("_" + e.documentKey).loc(), f.value = b, d = XT.Error.clone("xt1008", {
params: f
}), e.trigger("error", e, d, c));
}, this.findExisting(this.documentKey, b, c));
},
initialize: function(a, b) {
XM.Model.prototype.initialize.call(this, a, b);
var c = XM.Document, d;
a = a || {}, this.numberPolicy || (this.numberPolicySetting && (d = XT.session.getSettings().get(this.numberPolicySetting)), this.numberPolicy = d || c.MANUAL_NUMBER), b && b.isNew && (this.numberPolicy === c.AUTO_NUMBER || this.numberPolicy === c.AUTO_OVERRIDE_NUMBER) && this.fetchNumber(), _.contains(this.requiredAttributes, this.documentKey) || this.requiredAttributes.push(this.documentKey), this.on("change:" + this.documentKey, this.documentKeyDidChange), this.on("statusChange", this.statusDidChange);
},
fetchNumber: function() {
var a = this, b = {};
return b.success = function(b) {
a._number = a.keyIsString && b.toString() ? b.toString() : b, a.set(a.documentKey, a._number, {
force: !0
});
}, XT.dataSource.dispatch("XM.Model", "fetchNumber", this.recordType, b), console.log("XM.Model.fetchNumber for: " + this.recordType), this;
},
releaseNumber: function() {
return XT.dataSource.dispatch("XM.Model", "releaseNumber", [ this.recordType, this._number ]), this._number = null, console.log("XM.Model.releaseNumber for: " + this.recordType), this;
},
save: function(a, b, c) {
var d = this, e = XM.Model, f = this.get(this.documentKey), g = this.original(this.documentKey), h = this.getStatus(), i = {};
h === e.READY_NEW && f && !this._number || h === e.READY_DIRTY && f !== g ? (i.success = function(e) {
var g, h = {};
e === 0 ? XM.Model.prototype.save.call(d, a, b, c) : (h.attr = ("_" + d.documentKey).loc(), h.value = f, g = XT.Error.clone("xt1008", {
params: h
}), d.trigger("error", d, g, c));
}, i.error = Backbone.wrapError(null, d, c), this.findExisting(this.documentKey, f, i)) : XM.Model.prototype.save.call(d, a, b, c);
},
statusDidChange: function() {
var a = XM.Model, b = XM.Document;
this.numberPolicy === b.AUTO_NUMBER && this.getStatus() === a.READY_CLEAN && this.setReadOnly(this.documentKey);
}
}), _.extend(XM.Document, {
MANUAL_NUMBER: "M",
AUTO_NUMBER: "A",
AUTO_OVERRIDE_NUMBER: "O"
});
})();

// comment.js

(function() {
"use strict", XM.CommentType = XM.Model.extend({
recordType: "XM.CommentType",
privileges: {
all: {
create: "MaintainCommentTypes",
read: !0,
update: "MaintainCommentTypes",
"delete": "MaintainCommentTypes"
}
},
defaults: {
commentsEditable: !1,
order: 0
},
requiredAttributes: [ "name", "commentType", "commentsEditable", "order" ]
}), XM.Comment = XM.Model.extend({
privileges: {
all: {
create: !0,
read: !0,
update: "EditOthersComments",
"delete": !1
},
personal: {
update: "EditOwnComments",
properties: [ "createdBy" ]
}
},
defaults: function() {
var a = {}, b = XT.session.getSettings().get("CommentPublicDefault");
return a.created = new Date, a.createdBy = XM.currentUser.get("username"), a.isPublic = b || !1, a;
},
isReadOnly: function() {
var a = this.get("commentType"), b = this.getStatus() === XM.Model.READY_NEW, c = b || a && a.get("commentsEditable");
return !c || XM.Model.prototype.isReadOnly.apply(this, arguments);
}
}), XM.CommentTypeCollection = XM.Collection.extend({
model: XM.CommentType
});
})();

// characteristic.js

(function() {
"use strict", XM.Characteristic = XM.Document.extend({
recordType: "XM.Characteristic",
documentKey: "name",
privileges: {
all: {
create: "MaintainCharacteristics",
read: !0,
update: "MaintainCharacteristics",
"delete": "MaintainCharacteristics"
}
},
defaults: {
characteristicType: 0,
isAddresses: !1,
isContacts: !1,
isItems: !1,
order: 0
},
requiredAttributes: [ "name", "characteristicType", "isAddresses", "isContacts", "isItems", "order" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:characteristicType", this.characteristicTypeDidChange), this.characteristicTypeDidChange();
},
characteristicTypeDidChange: function() {
var a = this.get("characteristicType");
switch (a) {
case XM.Characteristic.TEXT:
this.setReadOnly("options", !0), this.setReadOnly("mask", !1), this.setReadOnly("validator", !1);
break;
case XM.Characteristic.LIST:
this.setReadOnly("options", !1), this.setReadOnly("mask", !0), this.setReadOnly("validator", !0);
break;
default:
this.setReadOnly("options", !0), this.setReadOnly("mask", !0), this.setReadOnly("validator", !0);
}
},
statusDidChange: function() {
var a = this.getStatus(), b = XM.Model;
a !== b.READY_NEW && this.setReadOnly("characteristicType", !0), XM.Document.prototype.statusDidChange.apply(this, arguments);
},
validateSave: function() {
var a = this.get("options").models, b = [], c;
if (!(this.get("isItems") || this.get("isContacts") || this.get("isAddresses") || this.get("isAccounts"))) return XT.Error.clone("xt2002");
for (c = 0; c < a.length; c += 1) b.push(a[c].get("value"));
if (!_.isEqual(b, _.unique(b))) return XT.Error.clone("xt2003");
}
}), _.extend(XM.Characteristic, {
TEXT: 0,
LIST: 1,
DATE: 2
}), XM.CharacteristicOption = XM.Model.extend({
recordType: "XM.CharacteristicOption",
privileges: {
all: {
create: !0,
read: !0,
update: !1,
"delete": !0
}
},
defaults: {
order: 0
},
requiredAttributes: [ "order" ]
}), XM.CharacteristicAssignment = XM.Model.extend({
initialize: function() {
XM.Model.prototype.initialize.apply(this, arguments), this.on("change:characteristic", this.characteristicDidChange);
},
characteristicDidChange: function(a, b, c) {
var d = this.getStatus(), e = XM.Model;
if (c && c.force || !(d & e.READY)) return;
this.set("value", "");
}
}), XM.CharacteristicCollection = XM.Collection.extend({
model: XM.Characteristic
});
})();

// alarm.js

(function() {
"use strict", XM.Alarm = XM.Document.extend({
numberPolicy: XM.Document.AUTO_NUMBER,
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:offset change:qualifier change:time", this.alarmDidChange);
},
alarmDidChange: function(a, b, c) {
var d = this.getStatus(), e = XM.Model, f, g, h, i;
if (c && c.force || !(d & e.READY)) return;
f = this.get("offset"), g = this.get("qualifier"), h = this.get("time"), i = this.get("trigger");
if (f) switch (g) {
case "MB":
case "MA":
g.indexOf("B") !== -1 ? i.setMinutes(h.getMinutes() - f) : i.setMinutes(h.getMinutes() + f);
break;
case "HB":
case "HA":
g.indexOf("B") !== -1 ? i.setHours(h.getHours() - f) : i.setHours(h.getHours() + f);
break;
default:
g.indexOf("B") !== -1 ? i.setDate(h.getDate() - f) : i.setDate(h.getDate() + f);
} else i.setMinutes(h.getMinutes());
}
});
})();

// account.js

(function() {
"use strict", XM.AccountDocument = XM.Document.extend({
numberPolicySetting: "CRMAccountNumberGeneration",
requiredAttributes: [ "number" ],
documentKeyDidChange: function() {
var a = this.recordType;
this.recordType = "XM.Account", XM.Document.prototype.documentKeyDidChange.apply(this, arguments), this.recordType = a;
}
}), XM.Account = XM.AccountDocument.extend({
recordType: "XM.Account",
privileges: {
all: {
create: "MaintainAllCRMAccounts",
read: "ViewAllCRMAccounts",
update: "MaintainAllCRMAccounts",
"delete": "MaintainAllCRMAccounts"
},
personal: {
create: "MaintainPersonalCRMAccounts",
read: "ViewPersonalCRMAccounts",
update: "MaintainPersonalCRMAccounts",
"delete": "MaintainPersonalCRMAccounts",
properties: [ "owner" ]
}
},
defaults: {
owner: XM.currentUser,
isActive: !0,
accountType: "O"
},
requiredAttributes: [ "accountType", "isActive", "number", "name" ],
validateEdit: function(a) {
if (a.parent && a.parent.id === this.id) return XT.Error.clone("xt2006");
}
}), XM.AccountComment = XM.Comment.extend({
recordType: "XM.AccountComment"
}), XM.AccountCharacteristic = XM.CharacteristicAssignment.extend({
recordType: "XM.AccountCharacteristic"
}), XM.AccountAccount = XM.Model.extend({
recordType: "XM.AccountAccount",
isDocumentAssignment: !0
}), XM.AccountContact = XM.Model.extend({
recordType: "XM.AccountContact",
isDocumentAssignment: !0
}), XM.AccountItem = XM.Model.extend({
recordType: "XM.AccountItem",
isDocumentAssignment: !0
}), XM.AccountFile = XM.Model.extend({
recordType: "XM.AccountFile",
isDocumentAssignment: !0
}), XM.AccountImage = XM.Model.extend({
recordType: "XM.AccountImage",
isDocumentAssignment: !0
}), XM.AccountUrl = XM.Model.extend({
recordType: "XM.AccountUrl",
isDocumentAssignment: !0
}), XM.AccountProject = XM.Model.extend({
recordType: "XM.AccountProject",
isDocumentAssignment: !0
}), XM.AccountContactInfo = XM.Model.extend({
recordType: "XM.AccountContactInfo"
}), XM.AccountInfo = XM.Model.extend({
recordType: "XM.AccountInfo",
readOnly: !0,
privileges: {
all: {
create: !1,
read: "ViewAllCRMAccounts",
update: !1,
"delete": !1
},
personal: {
create: !1,
read: !0,
update: !1,
"delete": !0,
properties: [ "owner" ]
}
}
}), XM.AccountInfoCollection = XM.Collection.extend({
model: XM.AccountInfo
});
})();

// address.js

(function() {
"use strict", XM.Country = XM.Model.extend({
recordType: "XM.Country",
privileges: {
all: {
create: "MaintainCountries",
read: !0,
update: "MaintainCountries",
"delete": "MaintainCountries"
}
},
requiredAttributes: [ "abbreviation", "currencyAbbreviation", "name" ],
validateEdit: function(a) {
var b = {};
if (a.abbreviation && a.abbreviation.length !== 2) return b.attr = "_abbreviation".loc(), b.length = "2", XT.Error.clone("xt1006", {
params: b
});
if (a.currencyAbbreviation && a.currencyAbbreviation.length !== 3) return b.attr = "_currencyAbbreviation".loc(), b.length = "3", XT.Error.clone("xt1006", {
params: b
});
}
}), XM.State = XM.Model.extend({
recordType: "XM.State",
privileges: {
all: {
create: "MaintainStates",
read: !0,
update: "MaintainStates",
"delete": "MaintainStates"
}
},
requiredAttributes: [ "abbreviation", "country", "name" ]
}), XM.Address = XM.Document.extend({
recordType: "XM.Address",
numberPolicy: XM.Document.AUTO_NUMBER,
privileges: {
all: {
create: "MaintainAddresses",
read: "ViewAddresses",
update: "MaintainAddresses",
"delete": "MaintainAddresses"
}
},
format: function(a) {
return XM.Address.format(this, a);
},
formatShort: function() {
return XM.Address.formatShort(this);
},
useCount: function(a) {
return console.log("XM.Address.useCount for: " + this.id), XT.dataSource.dispatch("XM.Address", "useCount", this.id, a), this;
}
}), _.extend(XM.Address, {
findExisting: function(a, b, c, d, e, f, g, h) {
var i = {
type: "Address",
line1: a,
line2: b,
line3: c,
city: d,
state: e,
postalcode: f,
country: g
};
return XT.dataSource.dispatch("XM.Address", "findExisting", i, h), console.log("XM.Address.findExisting"), this;
},
format: function() {
var a = [], b, c, d, e, f, g, h, i, j, k = "", l;
if (typeof arguments[0] == "object") b = "", c = arguments[0].get("line1"), d = arguments[0].get("line2"), e = arguments[0].get("line3"), f = arguments[0].get("city"), g = arguments[0].get("state"), h = arguments[0].get("postalcode"), i = arguments[0].get("country"), j = (arguments[1] === undefined ? !1 : arguments[1]) ? "<br />" : "\n"; else {
if (typeof arguments[0] != "string") return !1;
b = arguments[0], c = arguments[1], d = arguments[2], e = arguments[3], f = arguments[4], g = arguments[5], h = arguments[6], i = arguments[7], j = (arguments[8] === undefined ? !1 : arguments[8]) ? "<br />" : "\n";
}
b && a.push(b), c && a.push(c), d && a.push(d), e && a.push(e);
if (f || g || h) l = (f || "") + (f && (g || h) ? ", " : "") + (g || "") + (g && h ? " " : "") + (h || ""), a.push(l);
return i && a.push(i), a.length && (k = a.join(j)), k;
},
formatShort: function(a) {
var b, c = a.get("city") || "", d = a.get("state") || "", e = a.get("country") || "";
return b = c + (c && d ? ", " : "") + d, b += (b ? " " : "") + e, b;
}
}), XM.AddressComment = XM.Model.extend({
recordType: "XM.AddressComment"
}), XM.AddressCharacteristic = XM.Model.extend({
recordType: "XM.AddressCharacteristic"
}), XM.AddressInfo = XM.Model.extend({
recordType: "XM.AddressInfo",
readOnly: !0,
privileges: {
all: {
create: !1,
read: !0,
update: !1,
"delete": !1
}
},
format: function(a) {
return XM.Address.format(this, a);
},
formatShort: function() {
return XM.Address.formatShort(this);
}
}), XM.AddressInfoCollection = XM.Collection.extend({
model: XM.AddressInfo
}), XM.CountryCollection = XM.Collection.extend({
model: XM.Country
}), XM.StateCollection = XM.Collection.extend({
model: XM.State
});
})();

// contact.js

(function() {
"use strict", XM.Honorific = XM.Document.extend({
recordType: "XM.Honorific",
documentKey: "code",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainTitles",
read: !0,
update: "MaintainTitles",
"delete": "MaintainTitles"
}
}
}), XM.Contact = XM.Document.extend({
recordType: "XM.Contact",
nameAttribute: "getName",
numberPolicy: XM.Document.AUTO_NUMBER,
defaults: {
owner: XM.currentUser,
isActive: !0
},
privileges: {
all: {
create: "MaintainAllContacts",
read: "ViewAllContacts",
update: "MaintainAllContacts",
"delete": "MaintainAllContacts"
},
personal: {
create: "MaintainPersonalContacts",
read: "ViewPersonalContacts",
update: "MaintainPersonalContacts",
"delete": "MaintainPersonalContacts",
properties: [ "owner" ]
}
},
getName: function() {
var a = [], b = this.get("firstName"), c = this.get("middleName"), d = this.get("lastName"), e = this.get("suffix");
return b && a.push(b), c && a.push(c), d && a.push(d), e && a.push(e), a.join(" ");
},
validateSave: function(a, b) {
if (!a.firstName && !a.lastName) return XT.Error.clone("xt2004");
}
}), XM.Contact = XM.Contact.extend(XM.ContactMixin), XM.ContactEmail = XM.Model.extend({
recordType: "XM.ContactEmail",
requiredAttributes: [ "email" ]
}), XM.ContactComment = XM.Comment.extend({
recordType: "XM.ContactComment"
}), XM.ContactCharacteristic = XM.Characteristic.extend({
recordType: "XM.ContactCharacteristic"
}), XM.ContactAccount = XM.Model.extend({
recordType: "XM.ContactAccount",
isDocumentAssignment: !0
}), XM.ContactContact = XM.Model.extend({
recordType: "XM.ContactContact",
isDocumentAssignment: !0
}), XM.ContactItem = XM.Model.extend({
recordType: "XM.ContactItem",
isDocumentAssignment: !0
}), XM.ContactFile = XM.Model.extend({
recordType: "XM.ContactFile",
isDocumentAssignment: !0
}), XM.ContactImage = XM.Model.extend({
recordType: "XM.ContactImage",
isDocumentAssignment: !0
}), XM.ContactUrl = XM.Model.extend({
recordType: "XM.ContactUrl",
isDocumentAssignment: !0
}), XM.ContactInfo = XM.Model.extend({
recordType: "XM.ContactInfo",
readOnly: !0
}), XM.HonorificCollection = XM.Collection.extend({
model: XM.Honorific
}), XM.ContactInfoCollection = XM.Collection.extend({
model: XM.ContactInfo
});
})();

// currency.js

(function() {
"use strict", XM.Currency = XM.Document.extend({
recordType: "XM.Currency",
privileges: {
all: {
create: "CreateNewCurrency",
read: !0,
update: "MaintainCurrencies",
"delete": "MaintainCurrencies"
}
},
documentKey: "name",
enforceUpperKey: !1,
defaults: {
isBase: !1
},
requiredAttributes: [ "abbreviation", "isBase", "name", "symbol" ],
abbreviationDidChange: function(a, b, c) {
var d = XM.Model, e = this, f = this.getStatus(), g = {};
if (c && c.force || !(f & d.READY)) return;
g.success = function(a) {
var d, f = {};
a && (f.attr = "_abbreviation".loc(), f.value = b, d = XT.Error.clone("xt1008", {
params: f
}), e.trigger("error", e, d, c));
}, this.findExisting("abbreviation", b, g);
},
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:abbreviation", this.abbreviationDidChange);
},
save: function(a, b, c) {
var d = this, e = XM.Model, f = this.get("abbreviation"), g = this.original("abbreviation"), h = this.getStatus(), i = {};
h === e.READY_NEW || h === e.READY_DIRTY && f !== g ? (i.success = function(e) {
var g, h = {};
e === 0 ? XM.Document.prototype.save.call(d, a, b, c) : (h.attr = "_abbreviation".loc(), h.value = f, g = XT.Error.clone("xt1008", {
params: h
}), d.trigger("error", d, g, c));
}, i.error = Backbone.wrapError(null, d, c), this.findExisting("abbreviation", f, i)) : XM.Document.prototype.save.call(d, a, b, c);
},
toString: function() {
return this.get("abbreviation") + " - " + this.get("symbol");
},
validateEdit: function(a) {
var b = {};
if (a.abbreviation && a.abbreviation.length !== 3) return b.attr = "_abbreviation".loc(), b.length = "3", XT.Error.clone("xt1006", {
params: b
});
}
}), XM.CurrencyCollection = XM.Collection.extend({
model: XM.Currency
});
})();

// file.js

(function() {
"use strict", XM.FileInfo = XM.Model.extend({
recordType: "XM.FileInfo"
});
})();

// image.js

(function() {
"use strict", XM.ImageInfo = XM.Model.extend({
recordType: "XM.ImageInfo"
});
})();

// incident.js

(function() {
"use strict", XM.IncidentCategory = XM.Document.extend({
recordType: "XM.IncidentCategory",
documentKey: "name",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainIncidentCategories",
read: !0,
update: "MaintainIncidentCategories",
"delete": "MaintainIncidentCategories"
}
},
defaults: {
order: 0
},
requiredAttributes: [ "order" ]
}), XM.IncidentSeverity = XM.Document.extend({
recordType: "XM.IncidentSeverity",
documentKey: "name",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainIncidentSeverities",
read: !0,
update: "MaintainIncidentSeverities",
"delete": "MaintainIncidentSeverities"
}
},
defaults: {
order: 0
},
requiredAttributes: [ "order" ]
}), XM.IncidentResolution = XM.Model.extend({
recordType: "XM.IncidentResolution",
documentKey: "name",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainIncidentResolutions",
read: !0,
update: "MaintainIncidentResolutions",
"delete": "MaintainIncidentResolutions"
}
},
defaults: {
order: 0
},
requiredAttributes: [ "order" ]
}), XM.IncidentStatus = {
getIncidentStatusString: function() {
var a = XM.Incident, b = this.get("status");
if (b === a.NEW) return "_new".loc();
if (b === a.FEEDBACK) return "_feedback".loc();
if (b === a.CONFIRMED) return "_confirmed".loc();
if (b === a.ASSIGNED) return "_assigned".loc();
if (b === a.RESOLVED) return "_resolved".loc();
if (b === a.CLOSED) return "_closed".loc();
}
}, XM.Incident = XM.Document.extend({
recordType: "XM.Incident",
nameAttribute: "number",
numberPolicy: XM.Document.AUTO_NUMBER,
keyIsString: !1,
privileges: {
all: {
create: "MaintainAllIncidents",
read: "ViewAllIncidents",
update: "MaintainAllIncidents",
"delete": "MaintainAllIncidents"
},
personal: {
create: "MaintainPersonalIncidents",
read: "ViewPersonalIncidents",
update: "MaintainPersonalIncidents",
"delete": "MaintainPersonalIncidents",
properties: [ "owner", "assignedTo" ]
}
},
defaults: function() {
return {
owner: XM.currentUser,
status: XM.Incident.NEW
};
},
requiredAttributes: [ "account", "category", "contact", "description" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:assignedTo", this.assignedToDidChange);
},
assignedToDidChange: function(a, b, c) {
var d = this.getStatus(), e = XM.Incident, f = XM.Model;
if (c && c.force || !(d & f.READY)) return;
b && this.set("incidentStatus", e.ASSIGNED);
},
validateSave: function() {
var a = XM.Incident;
if (this.get("status") === a.ASSIGNED && !this.get("assignedTo")) return XT.Error.clone("xt2001");
}
}), _.extend(XM.Incident, {
NEW: "N",
FEEDBACK: "F",
CONFIRMED: "C",
ASSIGNED: "A",
RESOLVED: "R",
CLOSED: "L"
}), XM.Incident = XM.Incident.extend(XM.IncidentStatus), XM.IncidentComment = XM.Comment.extend({
recordType: "XM.IncidentComment"
}), XM.IncidentCharacteristic = XM.Characteristic.extend({
recordType: "XM.IncidentCharacteristic"
}), XM.IncidentAlarm = XM.Alarm.extend({
recordType: "XM.IncidentAlarm"
}), XM.IncidentHistory = XM.Model.extend({
recordType: "XM.IncidentHistory"
}), XM.IncidentAccount = XM.Model.extend({
recordType: "XM.IncidentAccount",
isDocumentAssignment: !0
}), XM.IncidentContact = XM.Model.extend({
recordType: "XM.IncidentContact",
isDocumentAssignment: !0
}), XM.IncidentItem = XM.Model.extend({
recordType: "XM.IncidentItem",
isDocumentAssignment: !0
}), XM.IncidentFile = XM.Model.extend({
recordType: "XM.IncidentFile",
isDocumentAssignment: !0
}), XM.IncidentImage = XM.Model.extend({
recordType: "XM.IncidentImage",
isDocumentAssignment: !0
}), XM.IncidentUrl = XM.Model.extend({
recordType: "XM.IncidentUrl",
isDocumentAssignment: !0
}), XM.IncidentIncident = XM.Model.extend({
recordType: "XM.IncidentIncident",
isDocumentAssignment: !0
}), XM.IncidentRecurrence = XM.Model.extend({
recordType: "XM.IncidentRecurrence"
}), XM.IncidentInfo = XM.Model.extend({
recordType: "XM.IncidentInfo",
readOnly: !0
}), XM.IncidentInfo = XM.IncidentInfo.extend(XM.IncidentStatus), XM.IncidentCategoryCollection = XM.Collection.extend({
model: XM.IncidentCategory
}), XM.IncidentSeverityCollection = XM.Collection.extend({
model: XM.IncidentSeverity
}), XM.IncidentResolutionCollection = XM.Collection.extend({
model: XM.IncidentResolution
}), XM.IncidentInfoCollection = XM.Collection.extend({
model: XM.IncidentInfo
});
})();

// item.js

(function() {
"use strict", XM.ClassCode = XM.Document.extend({
recordType: "XM.ClassCode",
documentKey: "code",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainClassCodes",
read: !0,
update: "MaintainClassCodes",
"delete": "MaintainClassCodes"
}
}
}), XM.ProductCategory = XM.Document.extend({
recordType: "XM.ProductCategory",
documentKey: "code",
privileges: {
all: {
create: "MaintainProductCategories",
read: !0,
update: "MaintainProductCategories",
"delete": "MaintainProductCategories"
}
}
}), XM.emptyProductCategory = new XM.ProductCategory({
id: -1,
code: "EMPTY",
description: "Use for indicating no product category"
}), XM.Unit = XM.Document.extend({
recordType: "XM.Unit",
documentKey: "name",
privileges: {
all: {
create: "MaintainUOMs",
read: !0,
update: "MaintainUOMs",
"delete": "MaintainUOMs"
}
},
defaults: {
isWeight: !1
},
requiredAttributes: [ "isWeight" ]
}), XM.Item = XM.Document.extend({
recordType: "XM.Item",
privileges: {
all: {
create: "MaintainItemMasters",
read: "ViewItemMasters",
update: "MaintainItemMasters",
"delete": "MaintainItemMasters"
}
},
defaults: function() {
return {
description1: "",
description2: "",
isActive: !0,
isFractional: !1,
isSold: !0,
listPrice: 0,
productCategory: XM.emptyProductCategory
};
},
requiredAttributes: [ "classCode", "description1", "description2", "inventoryUnit", "isActive", "isFractional", "isSold", "listPrice", "priceUnit", "productCategory" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:inventoryUnit", this.inventoryUnitDidChange), this.on("change:isSold", this.isSoldDidChange), this.on("statusChange", this.isSoldDidChange);
},
inventoryUnitDidChange: function(a, b, c) {
var d = this.getStatus(), e = XM.Model;
if (c && c.force || !(d & e.READY)) return;
b && this.set("priceUnit", b);
},
isSoldDidChange: function() {
var a = XM.Model, b = !this.get("isSold") && !0;
this.getStatus() & a.READY && (this.setReadOnly("productCategory", b), this.setReadOnly("priceUnit", b), this.setReadOnly("listPrice", b));
},
statusDidChange: function() {
var a = XM.Model;
this.getStatus() === a.READY_CLEAN && (this.setReadOnly("number"), this.setReadOnly("inventoryUnit"));
},
validateSave: function() {
var a = this.get("isSold"), b = this.get("productCategory");
if (a && (b.id || -1) === -1) return XT.Error.clone("xt2005");
}
}), XM.ItemComment = XM.Comment.extend({
recordType: "XM.ItemComment"
}), XM.ItemCharacteristic = XM.Characteristic.extend({
recordType: "XM.ItemCharacteristic"
}), XM.ItemAccount = XM.Model.extend({
recordType: "XM.ItemAccount",
isDocumentAssignment: !0
}), XM.ItemContact = XM.Model.extend({
recordType: "XM.ItemContact",
isDocumentAssignment: !0
}), XM.ItemItem = XM.Model.extend({
recordType: "XM.ItemItem",
isDocumentAssignment: !0
}), XM.ItemFile = XM.Model.extend({
recordType: "XM.ItemFile",
isDocumentAssignment: !0
}), XM.ItemImage = XM.Model.extend({
recordType: "XM.ItemImage",
isDocumentAssignment: !0
}), XM.ItemUrl = XM.Model.extend({
recordType: "XM.ItemUrl",
isDocumentAssignment: !0
}), XM.ItemInfo = XM.Model.extend({
recordType: "XM.ItemInfo",
readOnly: !0
}), XM.ClassCodeCollection = XM.Collection.extend({
model: XM.ClassCode
}), XM.ProductCategoryCollection = XM.Collection.extend({
model: XM.ProductCategory
}), XM.UnitCollection = XM.Collection.extend({
model: XM.Unit
}), XM.ItemInfoCollection = XM.Collection.extend({
model: XM.ItemInfo
});
})();

// opportunity.js

(function() {
"use strict", XM.OpportunityType = XM.Document.extend({
recordType: "XM.OpportunityType",
documentKey: "name",
privileges: {
all: {
create: "MaintainOpportunityTypes",
read: !0,
update: "MaintainOpportunityTypes",
"delete": "MaintainOpportunityTypes"
}
}
}), XM.OpportunityStage = XM.Document.extend({
recordType: "XM.OpportunityStage",
documentKey: "name",
privileges: {
all: {
create: "MaintainOpportunityStages",
read: !0,
update: "MaintainOpportunityStages",
"delete": "MaintainOpportunityStages"
}
},
defaults: {
deactivate: !1
},
requiredAttributes: [ "deactivate" ]
}), XM.OpportunitySource = XM.Document.extend({
recordType: "XM.OpportunitySource",
documentKey: "name",
privileges: {
all: {
create: "MaintainOpportunitySources",
read: !0,
update: "MaintainOpportunitySources",
"delete": "MaintainOpportunitySources"
}
}
}), XM.Opportunity = XM.Document.extend({
recordType: "XM.Opportunity",
numberPolicy: XM.Document.AUTO_NUMBER,
defaults: {
isActive: !0
},
requiredAttributes: [ "account", "name", "isActive", "opportunityStage", "opportunitySource", "opportunityType" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:assignedTo", this.assignedToDidChange);
},
assignedToDidChange: function(a, b, c) {
var d = this.getStatus(), e = XM.Model, f, g;
if (c && c.force || !(d & e.READY)) return;
f = this.get("assignedTo"), g = this.get("assignDate"), f && !g && this.set("assignDate", new Date);
}
}), XM.OpportunityComment = XM.Comment.extend({
recordType: "XM.OpportunityComment"
}), XM.OpportunityCharacteristic = XM.Characteristic.extend({
recordType: "XM.OpportunityCharacteristic"
}), XM.OpportunityAccount = XM.Model.extend({
recordType: "XM.OpportunityAccount",
isDocumentAssignment: !0
}), XM.OpportunityContact = XM.Model.extend({
recordType: "XM.OpportunityContact",
isDocumentAssignment: !0
}), XM.OpportunityItem = XM.Model.extend({
recordType: "XM.OpportunityItem",
isDocumentAssignment: !0
}), XM.OpportunityFile = XM.Model.extend({
recordType: "XM.OpportunityFile",
isDocumentAssignment: !0
}), XM.OpportunityImage = XM.Model.extend({
recordType: "XM.OpportunityImage",
isDocumentAssignment: !0
}), XM.OpportunityUrl = XM.Model.extend({
recordType: "XM.OpportunityUrl",
isDocumentAssignment: !0
}), XM.OpportunityOpportunity = XM.Model.extend({
recordType: "XM.OpportunityOpportunity",
isDocumentAssignment: !0
}), XM.OpportunityInfo = XM.Model.extend({
recordType: "XM.OpportunityInfo",
readOnly: !0
}), XM.OpportunityTypeCollection = XM.Collection.extend({
model: XM.OpportunityType
}), XM.OpportunityStageCollection = XM.Collection.extend({
model: XM.OpportunityStage
}), XM.OpportunitySourceCollection = XM.Collection.extend({
model: XM.OpportunitySource
}), XM.OpportunityInfoCollection = XM.Collection.extend({
model: XM.OpportunityInfo
});
})();

// priority.js

(function() {
"use strict", XM.Priority = XM.Model.extend({
recordType: "XM.Priority",
privileges: {
all: {
create: "MaintainIncidentPriorities",
read: !0,
update: "MaintainIncidentPriorities",
"delete": "MaintainIncidentPriorities"
}
},
defaults: {
order: 0
},
requiredAttributes: [ "name" ]
}), XM.PriorityCollection = XM.Collection.extend({
model: XM.Priority
});
})();

// project.js

(function() {
"use strict", XM.ProjectStatus = {
getProjectStatusString: function() {
var a = XM.Project, b = this.get("status");
if (b === a.CONCEPT) return "_concept".loc();
if (b === a.IN_PROCESS) return "_inProcess".loc();
if (b === a.COMPLETED) return "_completed".loc();
}
}, XM.ProjectBase = XM.Document.extend({
defaults: function() {
var a = XM.Project, b = {
status: a.CONCEPT
};
return b;
},
privileges: {
all: {
create: "MaintainAllProjects",
read: "ViewAllProjects",
update: "MaintainAllProjects",
"delete": "MaintainAllProjects"
},
personal: {
create: "MaintainPersonalProjects",
read: "ViewPersonalProjects",
update: "MaintainPersonalProjects",
"delete": "MaintainPersonalProjects",
properties: [ "owner", "assignedTo" ]
}
},
requiredAttributes: [ "number", "status", "name", "dueDate" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:status", this.projectStatusDidChange);
},
statusDidChange: function() {
var a = XM.Model;
this.getStatus() === a.READY_CLEAN && this.setReadOnly("number");
},
projectStatusDidChange: function() {
var a = this.get("status"), b, c = XM.Project;
this.isDirty() && (b = (new Date).toISOString(), a === c.IN_PROCESS && !this.get("assignDate") ? this.set("assignDate", b) : a === c.COMPLETED && !this.get("completeDate") && this.set("completeDate", b));
}
}), XM.ProjectBase = XM.ProjectBase.extend(XM.ProjectStatus), XM.Project = XM.ProjectBase.extend({
recordType: "XM.Project",
defaults: function() {
var a = XM.ProjectBase.prototype.defaults.call(this);
return a.owner = a.assignedTo = XM.currentUser, a;
},
budgetedHoursTotal: 0,
actualHoursTotal: 0,
balanceHoursTotal: 0,
budgetedExpensesTotal: 0,
actualExpensesTotal: 0,
balanceExpensesTotal: 0,
copy: function(a, b) {
return XM.Project.copy(this, a, b);
},
initialize: function() {
XM.ProjectBase.prototype.initialize.apply(this, arguments), this.on("add:tasks remove:tasks", this.tasksDidChange);
},
tasksDidChange: function() {
var a = this, b;
this.budgetedHoursTotal = 0, this.actualHoursTotal = 0, this.budgetedExpensesTotal = 0, this.actualExpensesTotal = 0, _.each(this.get("tasks").models, function(b) {
a.budgetedHoursTotal = XT.math.add(a.budgetedHoursTotal, b.get("budgetedHours"), XT.QTY_SCALE), a.actualHoursTotal = XT.math.add(a.actualHoursTotal, b.get("actualHours"), XT.QTY_SCALE), a.budgetedExpensesTotal = XT.math.add(a.budgetedExpensesTotal, b.get("budgetedExpenses"), XT.MONEY_SCALE), a.actualExpensesTotal = XT.math.add(a.actualExpensesTotal, b.get("actualExpenses"), XT.MONEY_SCALE);
}), this.balanceHoursTotal = XT.math.subtract(this.budgetedHoursTotal, this.actualHoursTotal, XT.QTY_SCALE), this.balanceExpensesTotal = XT.math.subtract(this.budgetedExpensesTotal, this.actualExpensesTotal, XT.QTY_SCALE), b = {
budgetedHoursTotal: this.budgetedHoursTotal,
actualHoursTotal: this.actualHoursTotal,
budgetedExpensesTotal: this.budgetedExpensesTotal,
actualExpensesTotal: this.actualExpensesTotal,
balanceHoursTotal: this.balanceHoursTotal,
balanceExpensesTotal: this.balanceExpensesTotal
}, this.trigger("change", this, b);
}
}), _.extend(XM.Project, {
copy: function(a, b, c) {
if (a instanceof XM.Project == 0) return console.log("Passed object must be an instance of 'XM.Project'"), !1;
if (b === undefined) return console.log("Number is required"), !1;
var d, e, f, g = new Date(a.get("dueDate").valueOf()), h = XM.Project.prototype.idAttribute, i;
c = c || 0, g.setDate(g.getDate() + c), d = a.parse(JSON.parse(JSON.stringify(a.toJSON()))), _.extend(d, {
number: b,
dueDate: g
}), delete d[h], delete d.status, delete d.comments, delete d.recurrences, h = XM.ProjectTask.prototype.idAttribute, d.tasks && _.each(d.tasks, function(a) {
delete a[h], delete a.status, delete a.comments, delete a.alarms, g = new Date(a.dueDate.valueOf()), g.setDate(g.getDate() + c);
});
for (e in d) if (d.hasOwnProperty(e) && e !== "tasks" && _.isArray(d[e])) {
h = a.get(e).model.prototype.idAttribute;
for (f = 0; f < d[e].length; f += 1) delete d[e][f][h];
}
return i = new XM.Project(d, {
isNew: !0
}), i.documentKeyDidChange(), i;
},
CONCEPT: "P",
IN_PROCESS: "O",
COMPLETED: "C"
}), XM.ProjectTask = XM.ProjectBase.extend({
recordType: "XM.ProjectTask",
defaults: function() {
var a = XM.ProjectBase.prototype.defaults.call(this);
return _.extend(a, {
actualExpenses: 0,
actualHours: 0,
budgetedExpenses: 0,
budgetedHours: 0
}), a;
},
initialize: function() {
XM.ProjectBase.prototype.initialize.apply(this, arguments);
var a = "change:budgetedHours change:actualHours change:budgetedExpenses change:actualExpenses";
this.on(a, this.valuesDidChange), this.on("change:project", this.projectDidChange);
},
projectDidChange: function() {
var a = this.get("project"), b = XM.Model, c = this.getStatus();
a && c === b.READY_NEW && (this.set("owner", this.get("owner") || a.get("owner")), this.set("assignedTo", this.get("owner") || a.get("assignedTo")), this.set("startDate", this.get("startDate") || a.get("startDate")), this.set("assignDate", this.get("assignDate") || a.get("assignDate")), this.set("dueDate", this.get("dueDate") || a.get("dueDate")), this.set("completeDate", this.get("completeDate") || a.get("completeDate")));
},
valuesDidChange: function() {
var a = this.get("project");
a && a.tasksDidChange();
}
}), XM.ProjectComment = XM.Comment.extend({
recordType: "XM.ProjectComment"
}), XM.ProjectAccount = XM.Model.extend({
recordType: "XM.ProjectAccount",
isDocumentAssignment: !0
}), XM.ProjectContact = XM.Model.extend({
recordType: "XM.ProjectContact",
isDocumentAssignment: !0
}), XM.ProjectItem = XM.Model.extend({
recordType: "XM.ProjectItem",
isDocumentAssignment: !0
}), XM.ProjectFile = XM.Model.extend({
recordType: "XM.ProjectFile",
isDocumentAssignment: !0
}), XM.ProjectImage = XM.Model.extend({
recordType: "XM.ProjectImage",
isDocumentAssignment: !0
}), XM.ProjectUrl = XM.Model.extend({
recordType: "XM.ProjectUrl"
}), XM.ProjectProject = XM.Model.extend({
recordType: "XM.ProjectProject",
isDocumentAssignment: !0
}), XM.ProjectRecurrence = XM.Model.extend({
recordType: "XM.ProjectRecurrence"
}), XM.ProjectTaskComment = XM.Comment.extend({
recordType: "XM.ProjectTaskComment"
}), XM.ProjectTaskAlarm = XM.Alarm.extend({
recordType: "XM.ProjectTaskAlarm"
}), XM.ProjectInfo = XM.Model.extend({
recordType: "XM.ProjectInfo",
readOnly: !0
}), XM.ProjectInfo = XM.ProjectInfo.extend(XM.ProjectStatus), XM.ProjectInfoCollection = XM.Collection.extend({
model: XM.ProjectInfo
});
})();

// sales_rep.js

(function() {
"use strict", XM.SalesRep = XM.AccountDocument.extend({
recordType: "XM.SalesRep",
privileges: {
all: {
create: "MaintainSalesReps",
read: !0,
update: "MaintainSalesReps",
"delete": "MaintainSalesReps"
}
},
defaults: {
isActive: !0,
commission: 0
}
});
})();

// tax_authority.js

(function() {
"use strict", XM.TaxAuthority = XM.AccountDocument.extend({
recordType: "XM.TaxAuthority",
privileges: {
all: {
create: "MaintainTaxAuthorities",
read: "ViewTaxAuthorities",
update: "MaintainTaxAuthorities",
"delete": "MaintainTaxAuthorities"
}
}
});
})();

// to_do.js

(function() {
"use strict", XM.ToDoStatus = {
getToDoStatusString: function() {
var a = XM.ToDo, b = this.get("status");
if (b === a.PENDING) return "_pending".loc();
if (b === a.DEFERRED) return "_deferred".loc();
if (b === a.NEITHER) return "_neither".loc();
if (b === a.IN_PROCESS) return "_inProcess".loc();
if (b === a.COMPLETED) return "_completed".loc();
}
}, XM.ToDo = XM.Model.extend({
recordType: "XM.ToDo",
privileges: {
all: {
create: "MaintainAllToDoItems",
read: "ViewAllToDoItems",
update: "MaintainAllToDoItems",
"delete": "MaintainAllToDoItems"
},
personal: {
create: "MaintainPersonalToDoItems",
read: "ViewPersonalToDoItems",
update: "MaintainPersonalToDoItems",
"delete": "MaintainPersonalToDoItems",
properties: [ "owner", "assignedTo" ]
}
},
defaults: function() {
return {
isActive: !0,
owner: XM.currentUser,
assignedTo: XM.currentUser,
status: XM.ToDo.NEITHER
};
},
requiredAttributes: [ "dueDate", "name" ],
getToDoStatusProxy: function() {
var a = XM.ToDo;
return this._status || a.NEITHER;
},
initialize: function() {
XM.Model.prototype.initialize.apply(this, arguments), this.on("change:startDate change:completeDate", this.toDoStatusDidChange), this.on("change:status", this.toDoDidChange), this.on("changeStatus", this.toDoDidChange);
},
toDoDidChange: function() {
this.setToDoStatusProxy(this.get("status"));
},
toDoStatusDidChange: function(a, b, c) {
var d = this.getStatus(), e = this.getToDoStatusProxy(), f = this.get("startDate"), g = this.get("completeDate"), h = XM.ToDo, i = h.NEITHER;
if (c && c.force || !(d & XM.Model.READY)) return;
g ? (i = h.COMPLETED, this.setToDoStatusProxy(h.NEITHER)) : e === h.DEFERRED ? i = h.DEFERRED : e === h.PENDING ? i = h.PENDING : f && (i = h.IN_PROCESS), this.set("status", i);
},
setToDoStatusProxy: function(a) {
var b = XM.ToDo;
if (a === this._status) return this;
if (a === b.PENDING || a === b.DEFERRED) this._status = a; else {
if (this._status === b.NEITHER) return this;
this._status = b.NEITHER;
}
return this.toDoStatusDidChange(), this;
}
}), XM.ToDo = XM.ToDo.extend(XM.ToDoStatus), _.extend(XM.ToDo, {
PENDING: "P",
DEFERRED: "D",
NEITHER: "N",
IN_PROCESS: "I",
COMPLETED: "C"
}), XM.ToDoAccount = XM.Model.extend({
recordType: "XM.ToDoAccount",
isDocumentAssignment: !0
}), XM.ToDoAlarm = XM.Alarm.extend({
recordType: "XM.ToDoAlarm"
}), XM.ToDoComment = XM.Comment.extend({
recordType: "XM.ToDoComment"
}), XM.ToDoContact = XM.Model.extend({
recordType: "XM.ToDoContact",
isDocumentAssignment: !0
}), XM.ToDoItem = XM.Model.extend({
recordType: "XM.ToDoItem",
isDocumentAssignment: !0
}), XM.ToDoFile = XM.Model.extend({
recordType: "XM.ToDoFile",
isDocumentAssignment: !0
}), XM.ToDoImage = XM.Model.extend({
recordType: "XM.ToDoImage",
isDocumentAssignment: !0
}), XM.ToDoToDo = XM.Model.extend({
recordType: "XM.ToDoToDo",
isDocumentAssignment: !0
}), XM.ToDoUrl = XM.Model.extend({
recordType: "XM.ToDoUrl",
isDocumentAssignment: !0
}), XM.ToDoInfo = XM.Model.extend({
recordType: "XM.ToDoInfo"
}), XM.ToDoInfo = XM.ToDoInfo.extend(XM.ToDoStatus), XM.ToDoInfoCollection = XM.Collection.extend({
model: XM.ToDoInfo
});
})();

// url.js

(function() {
"use strict", XM.Url = XM.Model.extend({
recordType: "XM.Url"
});
})();

// user_account.js

(function() {
"use strict", XM.Language = XM.Document.extend({
recordType: "XM.Language",
documentKey: "name",
enforceUpperKey: !1,
readOnly: !0
}), XM.Locale = XM.Document.extend({
recordType: "XM.Locale",
documentKey: "code",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainLocales",
read: !0,
update: "MaintainLocales",
"delete": "MaintainLocales"
}
},
defaults: {
altEmphasisColor: "",
costScale: 2,
currencyScale: 2,
description: "",
emphasisColor: "",
errorColor: "",
expiredColor: "",
extendedPriceScale: 2,
futureColor: "",
percentScale: 2,
purchasePriceScale: 4,
quantityPerScale: 6,
quantityScale: 2,
salesPriceScale: 4,
unitRatioScale: 6,
warningColor: "",
weightScale: 2
},
requiredAttributes: [ "altEmphasisColor", "costScale", "currencyScale", "description", "emphasisColor", "errorColor", "expiredColor", "extendedPriceScale", "futureColor", "percentScale", "purchasePriceScale", "quantityPerScale", "quantityScale", "salesPriceScale", "unitRatioScale", "warningColor", "weightScale" ]
}), XM.Privilege = XM.Model.extend({
recordType: "XM.Privilege",
readOnly: !0
}), XM.UserAccountRole = XM.Document.extend({
recordType: "XM.UserAccountRole",
documentKey: "name",
privileges: {
all: {
create: "MaintainGroups",
read: "MaintainGroups",
update: "MaintainGroups",
"delete": "MaintainGroups"
}
}
}), XM.UserAccountRoleInfo = XM.Model.extend({
recordType: "UserAccountRole",
readOnly: !0
}), XM.UserAccountRolePrivilegeAssignment = XM.Document.extend({
recordType: "UserAccountRolePrivilegeAssignment"
}), XM.UserAccount = XM.AccountDocument.extend({
idAttribute: "username",
recordType: "XM.UserAccount",
documentKey: "username",
enforceUpperKey: !1,
privileges: {
all: {
create: "MaintainUsers",
read: "MaintainUsers",
update: "MaintainUsers",
"delete": !1
}
},
defaults: {
canCreateUsers: !1,
disableExport: !1,
isDatabaseUser: !1
},
requiredAttributes: [ "canCreateUsers", "disableExport", "isDatabaseUser" ]
}), XM.UserAccountPrivilegeAssignment = XM.Model.extend({
recordType: "XM.UserAccountPrivilegeAssignment",
privileges: {
all: {
create: !0,
read: !0,
update: !1,
"delete": !0
}
},
requiredAttributes: [ "userAccount", "privilege" ]
}), XM.UserAccountUserAccountRoleAssignment = XM.Document.extend({
recordType: "UserAccountUserAccountRoleAssignment"
}), XM.UserAccountInfo = XM.Model.extend({
idAttribute: "username",
recordType: "XM.UserAccountInfo",
readOnly: !0
}), XM.LanguageCollection = XM.Collection.extend({
model: XM.Language
}), XM.LocaleCollection = XM.Collection.extend({
model: XM.Locale
}), XM.PrivilegeCollection = XM.Collection.extend({
model: XM.Privilege
}), XM.UserAccountInfoCollection = XM.Collection.extend({
model: XM.UserAccountInfo
});
})();

// crm.js

(function() {
"use strict", XM.AccountToDo = XM.Model.extend({
recordType: "XM.AccountToDo",
isDocumentAssignment: !0
}), XM.AccountIncident = XM.Model.extend({
recordType: "XM.AccountIncident",
isDocumentAssignment: !0
}), XM.AccountOpportunity = XM.Model.extend({
recordType: "XM.AccountOpportunity",
isDocumentAssignment: !0
}), XM.AccountProject = XM.Model.extend({
recordType: "XM.AccountProject",
isDocumentAssignment: !0
}), XM.ContactToDo = XM.Model.extend({
recordType: "XM.ContactToDo",
isDocumentAssignment: !0
}), XM.ContactIncident = XM.Model.extend({
recordType: "XM.ContactIncident",
isDocumentAssignment: !0
}), XM.ContactOpportunity = XM.Model.extend({
recordType: "XM.ContactOpportunity",
isDocumentAssignment: !0
}), XM.ContactProject = XM.Model.extend({
recordType: "XM.ContactProject",
isDocumentAssignment: !0
}), XM.IncidentOpportunity = XM.Model.extend({
recordType: "XM.IncidentOpportunity",
isDocumentAssignment: !0
}), XM.IncidentProject = XM.Model.extend({
recordType: "XM.IncidentProject",
isDocumentAssignment: !0
}), XM.OpportunityIncident = XM.Model.extend({
recordType: "XM.OpportunityIncident",
isDocumentAssignment: !0
}), XM.OpportunityToDo = XM.Model.extend({
recordType: "XM.OpportunityToDo",
isDocumentAssignment: !0
}), XM.OpportunityProject = XM.Model.extend({
recordType: "XM.OpportunityProject",
isDocumentAssignment: !0
}), XM.IncidentToDo = XM.Model.extend({
recordType: "XM.IncidentToDo",
isDocumentAssignment: !0
}), XM.ProjectIncident = XM.Model.extend({
recordType: "XM.ProjectIncident",
isDocumentAssignment: !0
}), XM.ProjectOpportunity = XM.Model.extend({
recordType: "XM.ProjectOpportunity",
isDocumentAssignment: !0
}), XM.ProjectToDo = XM.Model.extend({
recordType: "XM.ProjectToDo",
isDocumentAssignment: !0
}), XM.ToDoIncident = XM.Model.extend({
recordType: "XM.ToDoIncident",
isDocumentAssignment: !0
}), XM.ToDoOpportunity = XM.Model.extend({
recordType: "XM.ToDoOpportunity",
isDocumentAssignment: !0
}), XM.ToDoProject = XM.Model.extend({
recordType: "XM.ToDoProject",
isDocumentAssignment: !0
});
})();

// startup.js

(function() {
"use strict", XT.StartupTask.create({
taskName: "loadSessionSettings",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.SETTINGS, a);
}
}), XT.StartupTask.create({
taskName: "loadSessionPrivileges",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.PRIVILEGES, a);
}
}), XT.StartupTask.create({
taskName: "loadSessionSchema",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.SCHEMA, a);
}
}), XT.StartupTask.create({
taskName: "loadSessionLocale",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.LOCALE, a);
}
}), XT.StartupTask.create({
taskName: "loadCurrentUser",
task: function() {
var a = {
success: _.bind(this.didComplete, this),
id: XT.session.details.username
};
XM.currentUser = new XM.UserAccountInfo, XM.currentUser.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadHonorifics",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.honorifics = new XM.HonorificCollection, XM.honorifics.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCommentTypes",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.commentTypes = new XM.CommentTypeCollection, XM.commentTypes.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCharacteristics",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.characteristics = new XM.CharacteristicCollection, XM.characteristics.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadLanguages",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.languages = new XM.LanguageCollection, XM.languages.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadLocales",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.locales = new XM.LocaleCollection, XM.locales.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadPrivileges",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.privileges = new XM.PrivilegeCollection, XM.privileges.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCurrencies",
task: function() {
var a = {
success: _.bind(function() {
XM.baseCurrency = _.find(XM.currencies.models, function(a) {
return a.get("isBase");
}), this.didComplete();
}, this)
};
XM.currencies = new XM.CurrencyCollection, XM.currencies.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCountries",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.countries = new XM.CountryCollection, XM.countries.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadStates",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.states = new XM.StateCollection, XM.states.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadUnits",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.units = new XM.UnitCollection, XM.units.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadClassCodes",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.classCodes = new XM.ClassCodeCollection, XM.classCodes.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadProductCategories",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.productCategories = new XM.ProductCategoryCollection, XM.productCategories.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadPriorities",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.priorities = new XM.PriorityCollection, XM.priorities.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentCategories",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.incidentCategories = new XM.IncidentCategoryCollection, XM.incidentCategories.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentResolutions",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.incidentResolutions = new XM.IncidentResolutionCollection, XM.incidentResolutions.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentSeverities",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.incidentSeverities = new XM.IncidentSeverityCollection, XM.incidentSeverities.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunityStages",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.opportunityStages = new XM.OpportunityStageCollection, XM.opportunityStages.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunityTypes",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.opportunityTypes = new XM.OpportunityTypeCollection, XM.opportunityTypes.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunitySources",
task: function() {
var a = {
success: _.bind(this.didComplete, this)
};
XM.opportunitySources = new XM.OpportunitySourceCollection, XM.opportunitySources.fetch(a);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
});
var a, b = [ {
id: "P",
name: "_concept".loc()
}, {
id: "O",
name: "_inProcess".loc()
}, {
id: "C",
name: "_completed".loc()
} ];
XM.ProjectStatusModel = Backbone.Model.extend({}), XM.ProjectStatusCollection = Backbone.Collection.extend({
model: XM.ProjectStatusModel
}), XM.projectStatuses = new XM.ProjectStatusCollection;
for (a = 0; a < b.length; a++) {
var c = new XM.ProjectStatusModel(b[a]);
XM.projectStatuses.add(c);
}
var d = [ {
id: "O",
name: "_organization".loc()
}, {
id: "I",
name: "_individual".loc()
} ];
XM.AccountTypeModel = Backbone.Model.extend({}), XM.AccountTypeCollection = Backbone.Collection.extend({
model: XM.AccountTypeModel
}), XM.accountTypes = new XM.AccountTypeCollection;
for (a = 0; a < d.length; a++) {
var e = new XM.AccountTypeModel(d[a]);
XM.accountTypes.add(e);
}
})();

// xv.js

(function() {
enyo.kind({
name: "XV.Util",
kind: enyo.Component,
published: {
workspacePanelDescriptor: null,
relationTitleFields: {},
history: []
},
create: function() {
this.inherited(arguments), this.setWorkspacePanelDescriptor({
"XM.Account": [ {
title: "Account Info",
fields: [ {
fieldName: "number"
}, {
fieldName: "name"
}, {
fieldName: "accountType",
kind: "XV.AccountTypeDropdown"
} ]
}, {
title: "Contact",
fields: []
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.UserAccount": [ {
title: "User Account Info",
fields: [ {
fieldName: "properName"
} ]
} ],
"XM.Contact": [ {
title: "Contact Info",
fields: [ {
fieldName: "firstName"
}, {
fieldName: "lastName"
}, {
fieldName: "jobTitle"
}, {
fieldName: "address",
kind: "XV.Address"
}, {
fieldName: "phone"
}, {
fieldName: "primaryEmail"
} ]
}, {
title: "Account Info",
fields: [ {
fieldName: "account",
kind: "XV.AccountRelationWidget"
} ]
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
modelType: "XM.ContactComment",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.ToDo": [ {
title: "ToDo Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
}, {
fieldName: "priority",
kind: "XV.PriorityDropdown"
}, {
fieldName: "incident",
kind: "XV.IncidentRelationWidget"
} ]
}, {
title: "Schedule",
fields: [ {
fieldName: "startDate",
kind: "XV.DateWidget"
}, {
fieldName: "dueDate",
kind: "XV.DateWidget"
}, {
fieldName: "assignDate",
kind: "XV.DateWidget"
}, {
fieldName: "completeDate",
kind: "XV.DateWidget"
} ]
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
modelType: "XM.ToDoComment",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.Opportunity": [ {
title: "Opportunity Info",
fields: [ {
fieldName: "number"
}, {
fieldName: "isActive",
kind: "XV.Checkbox"
}, {
fieldName: "name"
}, {
fieldName: "account",
kind: "XV.AccountRelationWidget"
}, {
fieldName: "opportunityStage",
kind: "XV.OpportunityStageDropdown"
}, {
fieldName: "opportunityType",
kind: "XV.OpportunityTypeDropdown"
}, {
fieldName: "opportunitySource",
kind: "XV.OpportunitySourceDropdown"
} ]
}, {
title: "Schedule",
fields: [ {
fieldName: "startDate",
kind: "XV.DateWidget"
}, {
fieldName: "assignDate",
kind: "XV.DateWidget"
}, {
fieldName: "targetClose",
kind: "XV.DateWidget"
}, {
fieldName: "actualClose",
kind: "XV.DateWidget"
} ]
}, {
title: "Notes",
location: "bottom",
fields: [ {
fieldName: "amount",
kind: "XV.MoneyWidget"
}, {
fieldName: "probability",
kind: "XV.PercentWidget"
}, {
fieldName: "notes"
} ]
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
modelType: "XM.OpportunityComment",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.Incident": [ {
title: "Incident Info",
fields: [ {
fieldName: "number"
}, {
fieldName: "description"
}, {
fieldName: "notes"
} ]
}, {
title: "Relationships",
fields: [ {
fieldName: "owner",
kind: "XV.UserAccountRelationWidget"
}, {
fieldName: "account",
kind: "XV.AccountRelationWidget"
}, {
fieldName: "item",
kind: "XV.ItemRelationWidget"
} ]
}, {
title: "Status",
fields: [ {
fieldName: "priority",
kind: "XV.PriorityDropdown"
} ]
}, {
title: "History",
kind: "XV.GridWidget",
objectName: "history",
modelType: "XM.IncidentHistory",
location: "bottom",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
kind: "XV.DateWidget"
}, {
fieldName: "description"
} ]
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
modelType: "XM.IncidentComment",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.Project": [ {
title: "Project Info",
fields: [ {
fieldName: "number",
placeholder: "Enter the project number"
}, {
fieldName: "name"
}, {
fieldName: "notes"
}, {
fieldName: "status",
kind: "XV.ProjectStatusDropdown"
} ]
}, {
title: "Summary",
location: "bottom",
fields: [ {
fieldName: "budgetedHoursTotal",
kind: "XV.Label"
}, {
fieldName: "actualHoursTotal",
kind: "XV.Label"
}, {
fieldName: "balanceHoursTotal",
kind: "XV.Label"
}, {
fieldName: "budgetedExpensesTotal",
kind: "XV.Label"
}, {
fieldName: "actualExpensesTotal",
kind: "XV.Label"
}, {
fieldName: "balanceExpensesTotal",
kind: "XV.Label"
} ]
}, {
title: "Schedule",
fields: [ {
fieldName: "owner",
kind: "XV.UserAccountRelationWidget"
}, {
fieldName: "assignedTo",
kind: "XV.UserAccountRelationWidget"
}, {
fieldName: "dueDate",
kind: "XV.DateWidget"
}, {
fieldName: "assignDate",
kind: "XV.DateWidget"
}, {
fieldName: "startDate",
kind: "XV.DateWidget"
}, {
fieldName: "completeDate",
kind: "XV.DateWidget"
} ]
}, {
title: "Tasks",
location: "bottom",
kind: "XV.GridWidget",
objectName: "tasks",
modelType: "XM.ProjectTask",
fields: [ {
label: "number",
fieldName: "number",
width: "120"
}, {
label: "name",
fieldName: "name",
width: "120"
}, {
label: "notes",
fieldName: "notes",
width: "220"
}, {
fieldName: "dueDate",
kind: "XV.Date",
width: "100"
}, {
label: "actualHours",
fieldName: "actualHours",
kind: "XV.Number",
width: "40"
}, {
label: "actualExpenses",
fieldName: "actualExpenses",
kind: "XV.Number",
width: "40"
} ]
}, {
title: "Comments",
location: "bottom",
kind: "XV.GridWidget",
objectName: "comments",
modelType: "XM.ProjectComment",
customization: {
disallowEdit: !0,
stampUser: !0,
stampDate: !0
},
fields: [ {
fieldName: "createdBy"
}, {
fieldName: "created",
label: "date",
kind: "XV.DateWidget"
}, {
fieldName: "commentType",
label: "type",
kind: "XV.CommentTypeDropdown"
}, {
fieldName: "text",
label: "text"
} ]
} ],
"XM.Honorific": [ {
title: "Honorific Info",
fields: [ {
fieldName: "code"
} ]
} ],
"XM.State": [ {
title: "State Info",
fields: [ {
fieldName: "abbreviation"
}, {
fieldName: "name"
} ]
} ],
"XM.Country": [ {
title: "Country Info",
fields: [ {
fieldName: "abbreviation"
}, {
fieldName: "name"
} ]
}, {
title: "Currency Info",
fields: [ {
fieldName: "currencyAbbreviation"
}, {
fieldName: "currencyName"
}, {
fieldName: "currencyNumber"
}, {
fieldName: "currencySymbol"
} ]
} ],
"XM.IncidentCategory": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
}, {
fieldName: "order",
kind: "XV.Number"
} ]
} ],
"XM.IncidentResolution": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
}, {
fieldName: "order",
kind: "XV.Number"
} ]
} ],
"XM.IncidentSeverity": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
}, {
fieldName: "order",
kind: "XV.Number"
} ]
} ],
"XM.Priority": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
}, {
fieldName: "order",
kind: "XV.Number"
} ]
} ],
"XM.OpportunitySource": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
} ]
} ],
"XM.OpportunityStage": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
} ]
} ],
"XM.OpportunityType": [ {
title: "Info",
fields: [ {
fieldName: "name"
}, {
fieldName: "description"
} ]
} ]
});
},
removeAllChildren: function(a) {
var b = a.children.length;
for (var c = 0; c < b; c++) a.removeChild(a.children[0]);
},
removeAll: function(a) {
var b = a.controls.length, c;
for (c = 0; c < b; c++) a.removeControl(a.controls[0]);
var d = a.children.length;
for (c = 0; c < d; c++) a.removeChild(a.children[0]);
},
formatModelName: function(a) {
return this.infoToMasterModelName(this.stripModelNamePrefix(a));
},
infoToMasterModelName: function(a) {
return a && a.indexOf("Info") >= 0 && (a = a.substring(0, a.length - 4)), a;
},
stripModelNamePrefix: function(a) {
return a && a.indexOf("XM") >= 0 && (a = a.substring(3)), a;
}
}), XV.util = new XV.Util;
})();

// label.js

(function() {
"use strict", enyo.kind({
name: "XV.Label",
kind: "enyo.Control",
style: "border: 0px;",
components: [ {
tag: "span",
name: "field",
style: "border: 0px; "
} ],
setValue: function(a) {
this.$.field.setContent(a);
}
});
})();

// input.js

(function() {
enyo.kind({
name: "XV.Input",
published: {
value: null
},
events: {
onValueChange: ""
},
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
} ],
inputChanged: function(a, b) {
var c = this.$.input.getValue(), d = this.validate(c);
d !== !1 ? this.setValue(d) : (this.setValue(null), this.valueChanged(""));
},
setDisabled: function(a) {
this.$.input.setDisabled(a);
},
setValue: function(a, b) {
b = b || {};
var c = this.getValue(), d;
c !== a && (this.value = a, this.valueChanged(a), d = {
value: a,
originator: this
}, b.silent || this.doValueChange(d));
},
validate: function(a) {
return a;
},
valueChanged: function(a) {
return this.$.input.setValue(a), a;
}
}), enyo.kind({
name: "XV.InputWidget",
kind: "XV.Input",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
} ]
} ]
});
})();

// button.js

(function() {
enyo.kind({
name: "XV.Button",
kind: "Button",
classes: "xt-button",
events: {
onButtonTapped: ""
},
handlers: {
ontap: "buttonTapped"
},
buttonTapped: function() {
this.doButtonTapped();
}
});
})();

// checkbox.js

(function() {
enyo.kind({
name: "XV.Checkbox",
kind: "onyx.Checkbox",
events: {
onValueChange: ""
},
handlers: {
onchange: "changed"
},
setValue: function(a, b) {
b = b || {}, this._silent = b.silent, this.inherited(arguments), this._silent = !1;
},
changed: function(a, b) {
this._silent || (b.value = this.getValue(), this.doValueChange(b));
}
});
})();

// number.js

(function() {
enyo.kind({
name: "XV.Number",
kind: "XV.Input",
published: {
scale: 0
},
setValue: function(a, b) {
a = _.isNumber(a) ? XT.math.round(a, this.getScale()) : null, XV.Input.prototype.setValue.call(this, a, b);
},
validate: function(a) {
return a = Number(a), isNaN(a) ? !1 : a;
},
valueChanged: function(a) {
return a = a ? Globalize.format(a, "n" + this.getScale()) : "", XV.Input.prototype.valueChanged.call(this, a);
}
}), enyo.kind({
name: "XV.NumberWidget",
kind: "XV.Number",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
} ]
} ]
}), enyo.kind({
name: "XV.Cost",
kind: "XV.Number",
published: {
scale: XT.COST_SCALE
}
}), enyo.kind({
name: "XV.CostWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.COST_SCALE
}
}), enyo.kind({
name: "XV.ExtendedPrice",
kind: "XV.Number",
published: {
scale: XT.EXTENDED_PRICE_SCALE
}
}), enyo.kind({
name: "XV.ExtendedPriceWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.EXTENDED_PRICE_SCALE
}
}), enyo.kind({
name: "XV.Money",
kind: "XV.Number",
published: {
scale: XT.MONEY_SCALE
}
}), enyo.kind({
name: "XV.MoneyWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.MONEY_SCALE
}
}), enyo.kind({
name: "XV.Percent",
kind: "XV.Number",
published: {
scale: XT.PERCENT_SCALE
}
}), enyo.kind({
name: "XV.PercentWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.PERCENT_SCALE
}
}), enyo.kind({
name: "XV.PurchasePrice",
kind: "XV.Number",
published: {
scale: XT.PURCHASE_PRICE_SCALE
}
}), enyo.kind({
name: "XV.PurchasePriceWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.PURCHASE_PRICE_SCALE
}
}), enyo.kind({
name: "XV.Quantity",
kind: "XV.Number",
published: {
scale: XT.QTY_SCALE
}
}), enyo.kind({
name: "XV.QuantityWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.QTY_SCALE
}
}), enyo.kind({
name: "XV.QuantityPer",
kind: "XV.Number",
published: {
scale: XT.QTY_PER_SCALE
}
}), enyo.kind({
name: "XV.QuantityPerWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.QTY_PER_SCALE
}
}), enyo.kind({
name: "XV.SalesPrice",
kind: "XV.Number",
published: {
scale: XT.SALES_PRICE_SCALE
}
}), enyo.kind({
name: "XV.SalesPriceWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.SALES_PRICE_SCALE
}
}), enyo.kind({
name: "XV.UnitRatio",
kind: "XV.Number",
published: {
scale: XT.UNIT_RATIO_SCALE
}
}), enyo.kind({
name: "XV.UnitRatioWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.UNIT_RATIO_SCALE
}
}), enyo.kind({
name: "XV.Weight",
kind: "XV.Number",
published: {
scale: XT.WEIGHT_SCALE
}
}), enyo.kind({
name: "XV.WeightWidget",
kind: "XV.NumberWidget",
published: {
scale: XT.WEIGHT_SCALE
}
});
})();

// dropdown.js

(function() {
enyo.kind({
name: "XV.DropdownWidget",
kind: "enyo.Control",
events: {
onValueChange: ""
},
published: {
value: null,
collection: null,
disabled: !1,
idAttribute: "id",
nameAttribute: "name",
valueAttribute: null
},
handlers: {
onSelect: "itemSelected"
},
components: [ {
kind: "onyx.PickerDecorator",
components: [ {}, {
name: "picker",
kind: "onyx.Picker"
} ]
} ],
collectionChanged: function() {
var a = this.getNameAttribute(), b = XT.getObjectByName(this.getCollection()), c, d, e, f = !1, g = this, h;
if (!b) {
if (f) {
XT.log("Could not find collection " + this.getCollection());
return;
}
e = function() {
f = !0, g.collectionChanged();
}, XT.getStartupManager().registerCallback(e);
return;
}
this.$.picker.createComponent({
idValue: "",
content: ""
});
for (c = 0; c < b.models.length; c++) h = b.models[c], d = h.get(a), this.$.picker.createComponent({
value: h,
content: d
});
this.render();
},
create: function() {
this.inherited(arguments), this.getCollection() && this.collectionChanged();
},
disabledChange: function(a, b) {
this.addRemoveClass("onyx-disabled", b.originator.disabled);
},
itemSelected: function(a, b) {
var c = this.$.picker.getSelected().value, d = this.getValueAttribute();
this.setValue(d ? c[d] : c);
},
setValue: function(a, b) {
b = b || {};
var c, d = this.getValue();
a !== d && (this._selectValue(a) || (a = null), a !== d && (this.value = a, b.silent || (c = {
originator: this,
value: a
}, this.doValueChange(c))));
},
_selectValue: function(a) {
if (!a) return;
a = this.getValueAttribute() ? a : a.id;
var b = _.find(this.$.picker.getComponents(), function(b) {
return (b.value ? b.value.id : null) === a;
});
return b ? (this.$.picker.setSelected(b), !0) : !1;
}
}), enyo.kind({
name: "XV.AccountTypeDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.accountTypes"
}
}), enyo.kind({
name: "XV.CommentTypeDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.commentTypes"
}
}), enyo.kind({
name: "XV.IncidentCategoryDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.incidentCategories"
}
}), enyo.kind({
name: "XV.IncidentResolutionDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.incidentResolutions"
}
}), enyo.kind({
name: "XV.IncidentSeverityDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.incidentSeverities"
}
}), enyo.kind({
name: "XV.OpportunitySourceDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.opportunitySources"
}
}), enyo.kind({
name: "XV.OpportunityStageDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.opportunityStages"
}
}), enyo.kind({
name: "XV.OpportunityTypeDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.opportunityTypes"
}
}), enyo.kind({
name: "XV.PriorityDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.priorities"
}
}), enyo.kind({
name: "XV.ProjectStatusDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.projectStatuses",
valueAttribute: "id"
}
});
})();

// address.js

(function() {
enyo.kind({
name: "XV.AddressWidget",
kind: enyo.Control,
published: {
model: null
},
events: {
onModelUpdate: ""
},
components: [ {
kind: "onyx.Input",
name: "line1Field",
disabled: !0
}, {
kind: "onyx.Input",
name: "line2Field",
disabled: !0
}, {
kind: "onyx.Input",
name: "line3Field",
disabled: !0
}, {
kind: "onyx.Input",
name: "cityField",
disabled: !0
} ],
setValue: function(a) {
this.setModel(a);
},
getValue: function() {
return this.getModel();
},
formatCity: function(a, b, c) {
return a + ", " + b + " " + c;
},
parseAddress: function(a) {
if (typeof a != "string") throw "Address is not a string.";
a = a.trim();
var b = {}, c = a.indexOf(",");
b.city = a.slice(0, c);
var d = a.substring(c + 2), e = d.lastIndexOf(" ");
return b.state = d.slice(0, e), b.zip = d.substring(e + 1), b;
},
modelChanged: function() {
this.$.line1Field.setValue(this.getModel() ? this.getModel().get("line1") : ""), this.$.line2Field.setValue(this.getModel() ? this.getModel().get("line2") : ""), this.$.line3Field.setValue(this.getModel() ? this.getModel().get("line3") : ""), this.$.cityField.setValue(this.getModel() ? this.formatCity(this.getModel().get("city"), this.getModel().get("state"), this.getModel().get("postalCode")) : "");
},
doAddressChanged: function(a, b) {
this.getModel().set({
line1: a.getValue()
});
},
doCityChanged: function(a, b) {
var c = this.parseAddress(a.getValue());
this.getModel().set({
city: c.city,
state: c.state,
postalCode: c.zip
}), this.doModelUpdate();
}
});
})();

// comments.js

(function() {
"use strict", enyo.kind({
name: "XV.CommentsWidget",
kind: enyo.Control,
published: {
collection: null,
descriptor: null,
fields: [ {
fieldName: "createdBy",
label: "creator",
type: "text"
}, {
fieldName: "created",
label: "date",
type: "date"
}, {
fieldName: "text",
label: "text",
type: "text"
} ]
},
events: {
onModelUpdate: ""
},
classes: "xv-widgets-comments",
style: "height: 200px; width: 700px; margin-right: 5px; font-size: 12px;",
components: [ {
kind: "onyx.GroupboxHeader",
name: "title",
classes: "xv-widgets-comments-title"
}, {
kind: "Repeater",
name: "commentsRepeater",
count: 1,
onSetupItem: "setupRow",
components: [ {
kind: "onyx.Groupbox",
classes: "onyx-toolbar-inline",
style: "background-color: white;",
name: "commentRow"
} ]
} ],
setupRow: function(a, b) {
var c = b.item.$.commentRow;
for (var d = 0; d < this.getFields().length; d++) {
var e = this.getFields()[d], f = ("_" + e.label).loc();
if (b.index === 0) this.createComponent({
container: c,
content: f,
style: "text-weight: bold; border-width: 0px;"
}); else {
var g = this.getCollection().at(b.index - 1), h = this.createComponent({
container: c,
placeholder: f,
style: "border: 0px;",
onchange: "doFieldChanged"
});
h.setContent(this.formatContent(g.get(e.fieldName), e.type));
}
}
},
formatContent: function(a, b) {
return b === "date" ? Globalize.format(a, "d") : a;
},
descriptorChanged: function() {
this.$.title.setContent(this.getDescriptor().title);
},
setValue: function(a) {
this.setCollection(a);
},
getValue: function() {
return this.getCollection();
},
collectionChanged: function() {
this.$.commentsRepeater.setCount(this.getCollection().length + 1), this.render();
},
doFieldChanged: function(a, b) {}
});
})();

// date.js

(function() {
enyo.kind({
name: "XV.Date",
kind: "XV.Input",
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
} ],
setValue: function(a, b) {
a = _.isDate(a) ? new Date(a.valueOf()) : null, XV.Input.prototype.setValue.call(this, a, b);
},
textToDate: function(a) {
var b = null, c = 864e5;
return a === "0" || a.indexOf("+") === 0 || a.indexOf("-") === 0 ? b = new Date((new Date).getTime() + a * c) : a.indexOf("#") === 0 ? (b = new Date, b.setMonth(0), b.setDate(a.substring(1))) : a.length && !isNaN(a) ? (b = new Date, b.setDate(a)) : a && (b = new Date(a)), b && (isNaN(b.getTime()) ? b = !1 : b.setHours(0, 0, 0, 0)), b;
},
validate: function(a) {
return a = this.textToDate(a), _.isDate(a) || _.isEmpty(a) ? a : !1;
},
valueChanged: function(a) {
return a ? (a = new Date(a.valueOf()), a.setMinutes(a.getTimezoneOffset()), a = Globalize.format(a, "d")) : a = "", XV.Input.prototype.valueChanged.call(this, a);
}
}), enyo.kind({
name: "XV.DateWidget",
kind: "XV.Date",
components: [ {
kind: "onyx.InputDecorator",
name: "decorator",
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
}, {
name: "icon",
kind: "Image",
src: "images/date-icon.jpg",
ontap: "iconTapped"
}, {
name: "datePickPopup",
kind: "onyx.Popup",
modal: !0,
components: [ {
kind: "GTS.DatePicker",
name: "datePick",
style: "",
onChange: "datePicked"
} ]
} ]
} ],
datePicked: function(a, b) {
this.setValue(b), this.$.datePickPopup.hide();
},
iconTapped: function() {
this.$.datePickPopup.show();
},
valueChanged: function(a) {
var b = a;
a = XV.Date.prototype.valueChanged.call(this, a), this.$.datePick.setValue(a ? b : new Date), this.$.datePick.render();
}
});
})();

// relation.js

(function() {
enyo.kind({
name: "XV.RelationWidget",
kind: enyo.Control,
published: {
value: null,
collection: null,
keyAttribute: "number",
nameAttribute: "name",
descripAttribute: ""
},
events: {
onValueChange: ""
},
components: [ {
kind: "onyx.InputDecorator",
style: "height: 27px",
components: [ {
name: "input",
kind: "onyx.Input",
onkeyup: "keyUp",
onkeydown: "keyDown",
onblur: "receiveBlur"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
kind: "onyx.IconButton",
src: "images/menu-icon-search.png"
}, {
name: "popupMenu",
kind: "onyx.Menu",
components: [ {
content: "_search".loc(),
value: "search"
}, {
content: "_open".loc(),
value: "open"
}, {
content: "_new".loc(),
value: "new"
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
style: "left: -200px; top: 25px;",
onSelect: "relationSelected",
components: [ {
kind: "onyx.Menu",
name: "autocompleteMenu",
modal: !1
} ]
} ]
}, {
name: "name",
content: ""
}, {
name: "description",
content: ""
} ],
autocomplete: function() {
var a = this.getKeyAttribute(), b = this.getValue() ? this.getValue().get(a) : "", c = this.$.input.getValue(), d;
c && c !== b ? (d = {
parameters: [ {
attribute: a,
operator: "BEGINS_WITH",
value: c,
rowLimit: 1
} ],
orderBy: [ {
attribute: a
} ]
}, this._collection.fetch({
success: enyo.bind(this, "_fetchSuccess"),
query: d
})) : c || this.setValue(null);
},
create: function() {
this.inherited(arguments), this.getCollection() && this.collectionChanged();
},
collectionChanged: function() {
var a = this.getCollection(), b = XM.Model.getObjectByName(a);
this._collection = new b;
},
itemSelected: function(a, b) {
var c = b.originator.value, d;
switch (c) {
case "search":
break;
case "open":
d = this.getValue(), this.bubble("workspace", {
eventName: "workspace",
options: d
});
break;
case "new":
d = new this._collection.model, this.bubble("workspace", {
eventName: "workspace",
options: d
});
}
},
keyDown: function(a, b) {
b.keyCode === 9 && (this.$.autocompleteMenu.hide(), this.autocomplete());
},
keyUp: function(a, b) {
var c, d = this.getKeyAttribute(), e = this.getValue() ? this.getValue().get(d) : "", f = this.$.input.getValue(), g = this.$.autocompleteMenu;
f && f !== e && b.keyCode !== 9 ? (c = {
parameters: [ {
attribute: d,
operator: "BEGINS_WITH",
value: f,
rowLimit: 10
} ],
orderBy: [ {
attribute: d
} ]
}, this._collection.fetch({
success: enyo.bind(this, "_collectionFetchSuccess"),
query: c
})) : g.hide();
},
receiveBlur: function(a, b) {
this.autocomplete();
},
relationSelected: function(a, b) {
return this.setValue(b.originator.model), this.$.autocompleteMenu.hide(), !0;
},
setValue: function(a, b) {
b = b || {};
var c = a ? a.id : null, d = this.value ? this.value.id : null, e = this.getKeyAttribute(), f = this.getNameAttribute(), g = this.getDescripAttribute(), h = "", i = "", j = "", k = {
value: a,
originator: this
};
this.value = a, a && a.get && (h = a.get(e) || "", i = a.get(f) || "", j = a.get(g) || ""), this.$.input.setValue(h), this.$.name.setContent(i), this.$.description.setContent(j), c !== d && !b.silent && this.doValueChange(k);
},
_collectionFetchSuccess: function() {
var a = this.getKeyAttribute(), b = this.$.autocompleteMenu, c, d;
b.destroyComponents(), b.controls = [], b.children = [];
if (this._collection.length) {
for (d = 0; d < this._collection.length; d++) c = this._collection.models[d], b.createComponent({
content: c.get(a),
model: c
});
b.reflow(), b.render(), b.show();
} else b.hide();
},
_fetchSuccess: function() {
var a = this._collection.length ? this._collection.models[0] : null;
this.setValue(a);
}
}), enyo.kind({
name: "XV.AccountRelationWidget",
kind: "XV.RelationWidget",
published: {
collection: "XM.AccountInfoCollection"
}
}), enyo.kind({
name: "XV.IncidentRelationWidget",
kind: "XV.RelationWidget",
published: {
collection: "XM.IncidentInfoCollection",
nameAttribute: "description"
}
}), enyo.kind({
name: "XV.ItemRelationWidget",
kind: "XV.RelationWidget",
published: {
collection: "XM.ItemInfoCollection",
nameAttribute: "description1",
descripAttribute: "description2"
}
}), enyo.kind({
name: "XV.UserAccountRelationWidget",
kind: "XV.RelationWidget",
published: {
collection: "XM.UserAccountInfoCollection",
keyAttribute: "username",
nameAttribute: "properName"
}
});
})();

// grid.js

(function() {
"use strict", enyo.kind({
name: "XV.GridWidget",
kind: enyo.Control,
published: {
collection: null,
descriptor: null,
customization: {}
},
events: {
onSubmodelUpdate: ""
},
style: "height: 200px; width: 900px; margin-right: 5px; font-size: 12px;",
components: [ {
kind: "onyx.GroupboxHeader",
name: "title"
}, {
kind: "Repeater",
name: "gridRepeater",
count: 0,
onSetupItem: "setupRow",
components: [ {
kind: "onyx.Groupbox",
classes: "onyx-toolbar-inline",
style: "background-color: white;",
name: "gridRow"
} ]
} ],
setupRow: function(a, b) {
var c = b.item.$.gridRow;
for (var d = 0; d < this.getDescriptor().fields.length; d++) {
var e = this.getDescriptor().fields[d], f = e.label ? e.label : e.fieldName, g = ("_" + f).loc();
if (b.index === 0) this.createComponent({
container: c,
content: g,
style: "text-weight: bold; border-width: 0px; width: " + e.width + "px;"
}); else {
var h = this.createComponent({
kind: e.fieldType || "XV.Input",
container: c,
name: e.fieldName + (b.index - 1),
placeholder: g,
style: "border: 0px; width: " + e.width + "px;",
onchange: "doFieldChanged"
});
e.collection && h.setCollection(e.collection);
if (this.getCollection().size() + 1 > b.index) {
var i = this.getCollection().at(b.index - 1);
h.setValue(i.get(e.fieldName), {
silent: !0
}), this.getCustomization().disallowEdit && h.setDisabled(!0);
} else this.getCustomization().stampUser && e.fieldName === "createdBy" && (h.setValue("<YOU>", {
silent: !0
}), h.setDisabled(!0)), this.getCustomization().stampDate && e.fieldName === "created" && (h.setValue("<NOW>", {
silent: !0
}), h.setDisabled(!0));
}
}
!this.getCustomization().disallowEdit && b.index !== 0 && b.index !== this.getCollection().size() + 1 && this.createComponent({
kind: "onyx.Button",
container: c,
name: "delete" + (b.index - 1),
content: "Delete",
onclick: "deleteRow"
}), this.getCollection() && b.index === this.getCollection().size() + 1 && c.applyStyle("border", "1px solid orange");
},
deleteRow: function(a, b) {
this.$.gridRepeater.removeChild(a.parent.parent), this.$.gridRepeater.render();
var c = a.getName(), d = c.match(/(\D+)(\d+)/), e = Number(d[2]);
this.getCollection().at(e).destroy(), this.doSubmodelUpdate();
},
descriptorChanged: function() {
var a = this.getDescriptor();
this.$.title.setContent(a.title), this.$.gridRepeater.setCount(1);
},
setValue: function(a) {
this.setCollection(a);
},
getValue: function() {
return this.getCollection();
},
collectionChanged: function() {
this.$.gridRepeater.setCount(this.getCollection().size() + 2);
},
doFieldChanged: function(a, b) {
var c = a.getName(), d = a.getValue(), e = c.match(/(\D+)(\d+)/), f = Number(e[2]), g = e[1], h = {};
h[g] = d;
if (f >= this.getCollection().size()) {
var i = XV.util.stripModelNamePrefix(this.getDescriptor().modelType), j = new XM[i](h, {
isNew: !0
});
for (var k = 0; k < j.requiredAttributes.length; k++) {
var l = j.requiredAttributes[k];
if (!j.get(l)) {
if (l === "dueDate") continue;
if (l === "id") continue;
var m = {};
m[l] = "", j.set(m);
}
}
this.getCollection().add(j);
} else this.getCollection().at(f).set(h);
this.doSubmodelUpdate();
}
});
})();

// parameter.js

(function() {
enyo.kind({
name: "XV.ParameterItem",
classes: "parameter-item",
published: {
value: "",
label: "",
attr: "",
operator: ""
},
events: {
onParameterChange: ""
},
handlers: {
onValueChange: "parameterChanged"
},
components: [ {
name: "label",
kind: "Control",
classes: "parameter-label"
}, {
name: "input",
classes: "parameter-item-input"
} ],
defaultKind: "XV.InputWidget",
create: function() {
this.inherited(arguments), this.valueChanged(), this.labelChanged(), !this.getOperator() && this.defaultKind === "XV.InputWidget" && this.setOperator("MATCHES");
},
labelChanged: function() {
this.$.label.setContent(this.label);
},
getParameter: function() {
var a;
return this.getValue() && (a = {
attribute: this.getAttr(),
operator: this.getOperator(),
value: this.getValue()
}), a;
},
getValue: function() {
return this.$.input.getValue();
},
parameterChanged: function() {
var a = {
value: this.getValue,
originator: this
};
return this.doParameterChange(a), !0;
},
valueChanged: function() {
this.$.input.setValue(this.value);
}
}), enyo.kind({
name: "XV.ParameterWidget",
kind: "FittableRows",
defaultKind: "XV.ParameterItem",
getParameters: function() {
var a, b, c = [];
for (a = 0; a < this.children.length; a++) b = this.children[a].getParameter(), b && c.push(b);
return c;
}
});
})();

// info_list.js

(function() {
enyo.kind({
name: "XV.InfoList",
kind: "Panels",
classes: "xt-info-list",
draggable: !1,
components: [ {
name: "loader",
classes: "xt-info-list-loader",
content: "Loading content..."
}, {
name: "error",
classes: "xt-info-list-error",
content: "There was an error"
}, {
name: "list",
kind: "XV.InfoListPrivate"
} ],
published: {
collection: null,
rowClass: "",
query: null,
parameterWidget: null
},
collectionChanged: function() {
var a = this.getCollection(), b;
typeof a == "string" && (b = XT.getObjectByName(a), a = this.collection = new b);
if (!a) {
this.setIndex(1);
return;
}
a.bind("change", enyo.bind(this, "_collectionChanged", a));
},
_collectionChanged: function(a) {
this.log();
},
_collectionFetchSuccess: function() {
this.log(), this.waterfall("onCollectionUpdated");
},
_collectionFetchError: function() {
this.log();
},
create: function() {
this.inherited(arguments), this.rowClassChanged(), this.collectionChanged();
},
rowClassChanged: function() {
this.$.list.setRowClass(this.getRowClass());
},
showingChanged: function() {
this.inherited(arguments), this.log(this.name, this.showing, this);
},
fetch: function(a) {
var b = this, c = this.getCollection(), d = this.getQuery(), e;
a = a ? _.clone(a) : {}, e = a.success, _.extend(a, {
success: function(a, c, d) {
b._collectionFetchSuccess(a, c, d), e && e(a, c, d);
},
error: enyo.bind(this, "_collectionFetchError"),
query: d
}), c.fetch(a);
}
}), enyo.kind({
name: "XV.InfoListPrivate",
kind: "List",
classes: "xt-info-list-private",
published: {
rowClass: "",
isFetching: !1,
isMore: !0
},
handlers: {
onSetupItem: "setupRow",
onCollectionUpdated: "collectionUpdated"
},
collectionUpdated: function() {
var a = this.parent.getCollection(), b = this.parent.getQuery(), c = b.rowOffset || 0, d = b.rowLimit || 0, e = a.length, f = d ? c + d <= e && this.getCount() !== a.length : !1;
this.setIsMore(f), this.setIsFetching(!1), this.setCount(a.length), c ? this.refresh() : this.reset(), this.parent.setIndex(2);
},
rowClassChanged: function() {
var a = this.getRowClass(), b, c;
a && XT.getObjectByName(a) && (b = {
name: "item",
kind: a
}, c = this.$.item, c && (this.removeComponent(c), c.destroy()), this.createComponent(b));
},
setupRow: function(a, b) {
var c = this.parent.getCollection(), d = this.$.item, e = b.index, f = c.models[e];
d && d.renderModel && d.renderModel(f);
}
}), enyo.kind({
name: "XV.InfoListRow",
classes: "xt-info-list-row",
published: {
leftColumn: [],
rightColumn: []
},
events: {
onInfoListRowTapped: ""
},
create: function() {
this.inherited(arguments);
var a = this.getLeftColumn(), b = this.getRightColumn(), c, d;
c = this.createComponent({
name: "leftColumn",
kind: "XV.InfoListRowColumn",
structure: a
}), d = this.createComponent({
name: "rightColumn",
kind: "XV.InfoListRowColumn",
structure: b
});
},
renderModel: function(a) {
var b = this.$, c, d, e, f, g, h;
for (c in b) if (b.hasOwnProperty(c)) {
e = b[c];
if (e.isLabel) continue;
if (c.indexOf(".") > -1) {
f = c.split("."), d = 0, g = a;
for (; d < f.length; ++d) {
g = g.getValue(f[d]);
if (g && g instanceof Date) break;
if (!g || typeof g != "object") {
if (typeof g == "string") break;
g = "";
break;
}
}
e.setContent(g);
} else g = a.getValue(c);
e.formatter && (h = this[e.formatter], h && h instanceof Function && (g = h(g, a, e))), g && g instanceof Date && (g = Globalize.format(g, "d")), e.setContent(g || e.placeholder || ""), g ? e.removeClass("empty") : e.addClass("empty");
}
},
tap: function(a, b) {
this.doInfoListRowTapped(b);
}
}), enyo.kind({
name: "XV.InfoListRowColumn",
classes: "xt-info-list-row-column",
published: {
structure: null
},
create: function() {
this.inherited(arguments);
var a = this.getStructure(), b = 0, c, d = this, e = enyo.bind(this, "createComponentFromArray", this.owner), f = enyo.bind(this, "createComponentFromObject", this.owner);
for (; b < a.length; ++b) c = a[b], c instanceof Array ? d = e(d, c) : typeof c == "object" && f(d, c);
},
createComponentFromArray: function(a, b, c) {
var d = b, e = c, f = e.slice(0).shift().width, g = 0, h, i;
d.kind !== "InfoListBasicColumn" && (i = d, d = d.createComponent({
kind: "XV.InfoListBasicColumn",
style: "width:" + f + "px;"
}));
for (; g < e.length; ++g) h = e[g], h instanceof Array ? d = this.createComponentFromArray(a, d, h, e.length) : typeof h == "object" && this.createComponentFromObject(a, d, h);
return i;
},
createComponentFromObject: function(a, b, c) {
var d = b, e = c;
d = d.createComponent({
kind: "XV.InfoListBasicCell"
}, e), a.$[e.name] || (a.$[e.name] = d);
}
}), enyo.kind({
name: "XV.InfoListBasicRow",
classes: "xt-info-list-basic-row"
}), enyo.kind({
name: "XV.InfoListBasicColumn",
classes: "xt-info-list-basic-column"
}), enyo.kind({
name: "XV.InfoListBasicCell",
classes: "xt-info-list-basic-cell"
}), enyo.kind({
name: "XV.AccountInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
attr: "isActive",
label: "_showInactive".loc(),
defaultKind: "XV.Checkbox",
getParameter: function() {
var a;
return this.getValue() || (a = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), a;
}
}, {
label: "_number".loc(),
attr: "number"
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_primaryContact".loc(),
attr: "primaryContact.name"
}, {
label: "_primaryEmail".loc(),
attr: "primaryContact.primaryEmail"
}, {
label: "_phone".loc(),
attr: [ "primaryContact.phone", "primaryContact.alternate", "primaryContact.fax" ]
}, {
label: "_street".loc(),
attr: [ "primaryContact.address.line1", "primaryContact.address.line2", "primaryContact.address.line3" ]
}, {
label: "_city".loc(),
attr: "primaryContact.address.city"
}, {
label: "_postalCode".loc(),
attr: "primaryContact.address.postalCode"
}, {
label: "_state".loc(),
attr: "primaryContact.address.state"
}, {
label: "_country".loc(),
attr: "primaryContact.address.country"
} ]
}), enyo.kind({
name: "XV.AccountInfoList",
kind: "XV.InfoList",
published: {
label: "_accounts".loc(),
collection: "XM.AccountInfoCollection",
query: {
orderBy: [ {
attribute: "number"
} ]
},
rowClass: "XV.AccountInfoCollectionRow",
parameterWidget: "XV.AccountInfoParameters"
}
}), enyo.kind({
name: "XV.AccountInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "number",
classes: "cell-key account-number"
}, {
name: "name",
classes: "account-name",
placeholder: "_noJobTitle".loc()
} ], [ {
width: 160
}, {
name: "primaryContact.phone",
classes: "cell-align-right account-primaryContact-phone"
}, {
name: "primaryContact.primaryEmail",
classes: "cell-align-right account-primaryContact-primaryEmail"
} ] ],
rightColumn: [ [ {
width: 320
}, {
name: "primaryContact.name",
classes: "cell-italic account-primaryContact-name",
placeholder: "_noContact".loc()
}, {
name: "primaryContact.address.formatShort",
classes: "account-primaryContact-address"
} ] ]
}), enyo.kind({
name: "XV.ContactInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
attr: "isActive",
label: "_showInactive".loc(),
defaultKind: "XV.Checkbox",
getParameter: function() {
var a;
return this.getValue() || (a = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), a;
}
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_primaryEmail".loc(),
attr: "primaryEmail"
}, {
label: "_phone".loc(),
attr: [ "phone", "alternate", "fax" ]
}, {
label: "_street".loc(),
attr: [ "address.line1", "address.line2", "address.line3" ]
}, {
label: "_city".loc(),
attr: "address.city"
}, {
label: "_state".loc(),
attr: "address.state"
}, {
label: "_postalCode".loc(),
attr: "address.postalCode"
}, {
label: "_country".loc(),
attr: "address.country"
} ]
}), enyo.kind({
name: "XV.ContactInfoList",
kind: "XV.InfoList",
published: {
label: "_contacts".loc(),
collection: "XM.ContactInfoCollection",
query: {
orderBy: [ {
attribute: "lastName"
}, {
attribute: "firstName"
} ]
},
rowClass: "XV.ContactInfoCollectionRow",
parameterWidget: "XV.ContactInfoParameters"
}
}), enyo.kind({
name: "XV.ContactInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "name",
classes: "cell-key contact-name"
}, {
name: "jobTitle",
classes: "contact-job-title",
placeholder: "_noJobTitle".loc()
} ], [ {
width: 160
}, {
name: "phone",
classes: "cell-align-right contact-phone"
}, {
name: "primaryEmail",
classes: "cell-align-right contact-email"
} ] ],
rightColumn: [ [ {
width: 320
}, {
name: "account.name",
classes: "cell-italic contact-account-name",
placeholder: "_noAccountName".loc()
}, {
name: "address.formatShort",
classes: "contact-account-name"
} ] ]
}), enyo.kind({
name: "XV.IncidentInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
label: "_number".loc(),
attr: "number",
getParameter: function() {
var a, b = this.getValue() - 0;
return b && _.isNumber(b) && (a = {
attribute: this.getAttr(),
operator: "=",
value: b
}), a;
}
}, {
label: "_account".loc(),
attr: "account",
defaultKind: "XV.AccountRelationWidget"
}, {
label: "_description".loc(),
attr: "description"
}, {
label: "_category".loc(),
attr: "category",
defaultKind: "XV.IncidentCategoryDropdown"
}, {
label: "_priority".loc(),
attr: "priority",
defaultKind: "XV.PriorityDropdown"
}, {
label: "_severity".loc(),
attr: "severity",
defaultKind: "XV.IncidentSeverityDropdown"
}, {
label: "_resolution".loc(),
attr: "resolution",
defaultKind: "XV.IncidentResolutionDropdown"
}, {
label: "_startDate".loc(),
attr: "created",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_endDate".loc(),
attr: "created",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
}), enyo.kind({
name: "XV.IncidentInfoList",
kind: "XV.InfoList",
published: {
label: "_incidents".loc(),
collection: "XM.IncidentInfoCollection",
rowClass: "XV.IncidentInfoCollectionRow",
parameterWidget: "XV.IncidentInfoParameters"
}
}), enyo.kind({
name: "XV.IncidentInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 245
}, {
name: "number",
classes: "cell-key incident-number"
}, {
name: "description",
classes: "cell incident-description"
} ], [ {
width: 75
}, {
name: "updated",
classes: "cell-align-right incident-updated",
formatter: "formatDate"
} ] ],
rightColumn: [ [ {
width: 165
}, {
name: "account.name",
classes: "cell-italic incident-account-name"
}, {
name: "contact.getName",
classes: "incident-contact-name"
} ], [ {
width: 75
}, {
name: "getIncidentStatusString",
classes: "incident-status"
}, {
name: "owner.username",
classes: "incident-owner-username"
} ], [ {
width: 75
}, {
name: "priority.name",
classes: "incident-priority",
placeholder: "_noPriority".loc()
}, {
name: "category.name",
classes: "incident-category",
placeholder: "_noCategory".loc()
} ] ],
formatDate: function(a, b, c) {
var d = new Date;
return XT.date.compareDate(a, d) ? c.removeClass("bold") : c.addClass("bold"), a;
}
}), enyo.kind({
name: "XV.OpportunityInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
label: "_showInactive".loc(),
attr: "isActive",
defaultKind: "XV.Checkbox",
getParameter: function() {
var a;
return this.getValue() || (a = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), a;
}
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_opportunityStage".loc(),
attr: "opportunityStage",
defaultKind: "XV.OpportunityStageDropdown"
}, {
label: "_opportunityType".loc(),
attr: "opportunityType",
defaultKind: "XV.OpportunityTypeDropdown"
}, {
label: "_opportunitySource".loc(),
attr: "opportunitySource",
defaultKind: "XV.OpportunitySourceDropdown"
} ]
}), enyo.kind({
name: "XV.OpportunityInfoList",
kind: "XV.InfoList",
published: {
collection: "XM.OpportunityInfoCollection",
label: "_opportunities".loc(),
rowClass: "XV.OpportunityInfoCollectionRow",
parameterWidget: "XV.OpportunityInfoParameters"
}
}), enyo.kind({
name: "XV.OpportunityInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 200
}, {
name: "number",
classes: "cell-key opportunity-number"
}, {
name: "name",
classes: "opportunity-description"
} ], [ {
width: 120
}, {
name: "targetClose",
classes: "cell-align-right",
formatter: "formatTargetClose",
placeholder: "_noCloseTarget".loc()
} ] ],
rightColumn: [ [ {
width: 165
}, {
name: "account.name",
classes: "cell-italic opportunity-account-name"
}, {
name: "contact.getName",
classes: "opportunity-contact-name",
placeholder: "_noContact".loc()
} ], [ {
width: 75
}, {
name: "opportunityStage.name",
classes: "opportunity-opportunityStage-name",
placeholder: "_noStage".loc()
}, {
name: "owner.username",
classes: "opportunity-owner-username"
} ], [ {
width: 75
}, {
name: "priority.name",
classes: "opportunity-priority-name",
placeholder: "_noPriority".loc()
}, {
name: "opportunityType.name",
classes: "opportunity-opportunityType-name",
placeholder: "_noType".loc()
} ] ],
formatTargetClose: function(a, b, c) {
var d = new Date;
return b.get("isActive") && a && XT.date.compareDate(a, d) < 1 ? c.addClass("error") : c.removeClass("error"), a;
}
}), enyo.kind({
name: "XV.ProjectInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
label: "_showCompleted".loc(),
attr: "status",
defaultKind: "XV.Checkbox",
getParameter: function() {
var a;
return this.getValue() || (a = {
attribute: this.getAttr(),
operator: "!=",
value: "C"
}), a;
}
}, {
label: "_number".loc(),
attr: "number"
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_startStartDate".loc(),
attr: "startDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_startEndDate".loc(),
attr: "startDate",
operator: "<=",
defaultKind: "XV.DateWidget"
}, {
label: "_assignedStartDate".loc(),
attr: "assignDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_assignedEndDate".loc(),
attr: "assignDate",
operator: "<=",
defaultKind: "XV.DateWidget"
}, {
label: "_dueStartDate".loc(),
attr: "dueDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_dueEndDate".loc(),
attr: "dueDate",
operator: "<=",
defaultKind: "XV.DateWidget"
}, {
label: "_completedStartDate".loc(),
attr: "completeDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_completedEndDate".loc(),
attr: "completeDate",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
}), enyo.kind({
name: "XV.ProjectInfoList",
kind: "XV.InfoList",
published: {
label: "_projects".loc(),
collection: "XM.ProjectInfoCollection",
query: {
orderBy: [ {
attribute: "number"
} ]
},
rowClass: "XV.ProjectInfoCollectionRow",
parameterWidget: "XV.ProjectInfoParameters"
}
}), enyo.kind({
name: "XV.ProjectInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 200
}, {
name: "number",
classes: "cell-key project-number"
}, {
name: "name",
classes: "project-name"
}, {
name: "account.name",
classes: "project-account-name"
} ], [ {
width: 120
}, {
name: "dueDate",
classes: "cell-align-right project-due-date",
formatter: "formatDueDate"
} ] ],
rightColumn: [ [ {
width: 70
}, {
name: "getProjectStatusString",
classes: "project-status"
}, {
name: "owner.username",
classes: "project-owner-username"
} ], [ {
width: 70
}, {
content: "budgeted:",
style: "text-align: right;",
isLabel: !0
}, {
content: "actual:",
style: "text-align: right;",
isLabel: !0
}, {
content: "balance:",
style: "text-align: right;",
isLabel: !0
} ], [ {
width: 80
}, {
name: "budgetedExpenses",
classes: "cell-align-right project-budgeted-expenses",
formatter: "formatExpenses"
}, {
name: "actualExpenses",
classes: "cell-align-right project-actual-expenses",
formatter: "formatExpenses"
}, {
name: "balanceExpenses",
classes: "cell-align-right project-balance-expenses",
formatter: "formatExpenses"
} ], [ {
width: 80
}, {
name: "budgetedHours",
classes: "cell-align-right project-budgeted-hours",
formatter: "formatHours"
}, {
name: "actualHours",
classes: "cell-align-right project-actual-hours",
formatter: "formatHours"
}, {
name: "balanceHours",
classes: "cell-align-right project-balance-hours",
formatter: "formatHours"
} ] ],
formatDueDate: function(a, b, c) {
var d = new Date, e = XM.Project;
return b.get("status") !== e.COMPLETED && XT.date.compareDate(a, d) < 1 ? c.addClass("error") : c.removeClass("error"), a;
},
formatHours: function(a, b, c) {
return Globalize.format(a, "n2") + " " + "_hrs".loc();
},
formatExpenses: function(a, b, c) {
return Globalize.format(a, "c" + XT.MONEY_SCALE);
}
}), enyo.kind({
name: "XV.ToDoInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
label: "_showCompleted".loc(),
attr: "status",
defaultKind: "XV.Checkbox",
getParameter: function() {
var a;
return this.getValue() || (a = {
attribute: this.getAttr(),
operator: "!=",
value: "C"
}), a;
}
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_startStartDate".loc(),
attr: "startDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_startEndDate".loc(),
attr: "startDate",
operator: "<=",
defaultKind: "XV.DateWidget"
}, {
label: "_dueStartDate".loc(),
attr: "dueDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_dueEndDate".loc(),
attr: "dueDate",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
}), enyo.kind({
name: "XV.ToDoInfoList",
kind: "XV.InfoList",
published: {
label: "_toDos".loc(),
collection: "XM.ToDoInfoCollection",
rowClass: "XV.ToDoInfoCollectionRow",
parameterWidget: "XV.ToDoInfoParameters"
}
}), enyo.kind({
name: "XV.ToDoInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 245
}, {
name: "name",
classes: "cell-key toDo-name"
}, {
name: "description",
classes: "cell toDo-description"
} ], [ {
width: 75
}, {
name: "dueDate",
classes: "cell-align-right toDo-dueDate",
formatter: "formatDueDate"
} ] ],
rightColumn: [ [ {
width: 165
}, {
name: "account.name",
classes: "cell-italic toDo-account-name",
placeholder: "_noAccountName".loc()
}, {
name: "contact.getName",
classes: "toDo-contact-name"
} ], [ {
width: 75
}, {
name: "getToDoStatusString",
classes: "toDo-status"
}, {
name: "assignedTo.username",
classes: "toDo-assignedTo-username"
} ], [ {
width: 75
}, {
name: "priority.name",
classes: "toDo-priority",
placeholder: "_noPriority".loc()
} ] ],
formatDueDate: function(a, b, c) {
var d = new Date, e = XM.ToDo;
return b.get("status") !== e.COMPLETED && XT.date.compareDate(a, d) < 1 ? c.addClass("error") : c.removeClass("error"), a;
}
}), enyo.kind({
name: "XV.UserAccountInfoList",
kind: "XV.InfoList",
published: {
label: "_userAccounts".loc(),
collection: "XM.UserAccountInfoCollection",
query: {
orderBy: [ {
attribute: "username"
} ]
},
rowClass: "XV.UserAccountInfoCollectionRow"
}
}), enyo.kind({
name: "XV.UserAccountInfoCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "username",
classes: "cell-key user-account-username"
} ], [ {
width: 160
}, {
name: "propername",
classes: "user-account-proper-name"
} ] ],
rightColumn: [ [ {
width: 320
}, {
name: "isActive",
classes: "cell-align-right user-account-active",
formatter: "formatActive"
} ] ],
formatActive: function(a) {
return a ? "_active".loc() : "";
}
}), enyo.kind({
name: "XV.HonorificList",
kind: "XV.InfoList",
published: {
label: "_honorific".loc(),
collection: "XM.HonorificCollection",
query: {
orderBy: [ {
attribute: "code"
} ]
},
rowClass: "XV.HonorificCollectionRow"
}
}), enyo.kind({
name: "XV.HonorificCollectionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "code",
classes: ""
} ] ]
}), enyo.kind({
name: "XV.StateList",
kind: "XV.InfoList",
published: {
label: "_state".loc(),
collection: "XM.StateCollection",
query: {
orderBy: [ {
attribute: "abbreviation"
} ]
},
rowClass: "XV.AbbreviationNameRow"
}
}), enyo.kind({
name: "XV.CountryList",
kind: "XV.InfoList",
published: {
label: "_country".loc(),
collection: "XM.CountryCollection",
query: {
orderBy: [ {
attribute: "name"
} ]
},
rowClass: "XV.AbbreviationNameRow"
}
}), enyo.kind({
name: "XV.AbbreviationNameRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "abbreviation",
classes: ""
} ], [ {
width: 160
}, {
name: "name",
classes: ""
} ] ]
}), enyo.kind({
name: "XV.NameDescriptionList",
kind: "XV.InfoList",
published: {
label: "",
collection: null,
query: {
orderBy: [ {
attribute: "order"
} ]
},
rowClass: "XV.NameDescriptionRow"
},
create: function() {
this.inherited(arguments);
var a = this.kind.substring(0, this.kind.length - 4).substring(3);
this.getLabel() || this.setLabel(("_" + a.camelize()).loc()), this.getCollection() || this.setCollection("XM." + a + "Collection");
}
}), enyo.kind({
name: "XV.IncidentCategoryList",
kind: "XV.NameDescriptionList"
}), enyo.kind({
name: "XV.IncidentResolutionList",
kind: "XV.NameDescriptionList"
}), enyo.kind({
name: "XV.IncidentSeverityList",
kind: "XV.NameDescriptionList"
}), enyo.kind({
name: "XV.PriorityList",
kind: "XV.NameDescriptionList"
}), enyo.kind({
name: "XV.OpportunitySourceList",
kind: "XV.NameDescriptionList",
published: {
query: {
orderBy: [ {
attribute: "id"
} ]
}
}
}), enyo.kind({
name: "XV.OpportunityStageList",
kind: "XV.NameDescriptionList",
published: {
query: {
orderBy: [ {
attribute: "id"
} ]
}
}
}), enyo.kind({
name: "XV.OpportunityTypeList",
kind: "XV.NameDescriptionList",
published: {
query: {
orderBy: [ {
attribute: "id"
} ]
}
}
}), enyo.kind({
name: "XV.NameDescriptionRow",
kind: "XV.InfoListRow",
leftColumn: [ [ {
width: 160
}, {
name: "name",
classes: ""
} ], [ {
width: 160
}, {
name: "description",
classes: ""
} ] ]
});
})();

// module.js

(function() {
var a = 50, b = 100;
enyo.kind({
name: "XV.Module",
kind: "Panels",
label: "",
classes: "app enyo-unselectable",
events: {
onInfoListAdded: "",
onTogglePullout: ""
},
handlers: {
onParameterChange: "requery",
onScroll: "didScroll",
onInfoListRowTapped: "doInfoListRowTapped"
},
showPullout: !0,
realtimeFit: !0,
arrangerKind: "CollapsingArranger",
selectedList: 0,
components: [ {
kind: "FittableRows",
classes: "left",
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.Button",
content: "_back".loc(),
ontap: "showDashboard"
}, {
kind: "Group",
defaultKind: "onyx.IconButton",
tag: null,
components: [ {
src: "images/menu-icon-search.png",
ontap: "showParameters"
}, {
src: "images/menu-icon-bookmark.png",
ontap: "showHistory"
} ]
}, {
name: "leftLabel"
} ]
}, {
name: "menu",
kind: "List",
fit: !0,
touch: !0,
onSetupItem: "setupItem",
components: [ {
name: "item",
classes: "item enyo-border-box",
ontap: "itemTap"
} ]
} ]
}, {
kind: "FittableRows",
components: [ {
kind: "FittableColumns",
noStretch: !0,
classes: "onyx-toolbar onyx-toolbar-inline",
components: [ {
kind: "onyx.Grabber"
}, {
kind: "Scroller",
thumb: !1,
fit: !0,
touch: !0,
vertical: "hidden",
style: "margin: 0;",
components: [ {
classes: "onyx-toolbar-inline",
style: "white-space: nowrap;"
}, {
name: "rightLabel",
style: "text-align: center"
} ]
}, {
kind: "onyx.Button",
content: "_new".loc(),
ontap: "newWorkspace"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "searchInput",
kind: "onyx.Input",
style: "width: 200px;",
placeholder: "Search",
onchange: "inputChanged"
}, {
kind: "Image",
src: "images/search-input-search.png"
} ]
}, {
kind: "onyx.Button",
content: "_logout".loc(),
ontap: "warnLogout"
}, {
name: "logoutWarningPopup",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
components: [ {
content: "Are you sure you want to log out?"
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Yes, logout",
ontap: "logout"
}, {
kind: "onyx.Button",
content: "No, don't logout.",
ontap: "closeLogoutWarningPopup"
} ]
} ]
}, {
name: "lists",
kind: "Panels",
arrangerKind: "LeftRightArranger",
margin: 0,
fit: !0,
onTransitionFinish: "didFinishTransition"
} ]
}, {
kind: "Signals",
onModelSave: "doRefreshInfoObject"
} ],
firstTime: !0,
fetched: {},
setupItem: function(a, b) {
var c = this.lists[b.index].name;
this.$.item.setContent(this.$.lists.$[c].getLabel()), this.$.item.addRemoveClass("onyx-selected", a.isSelected(b.index));
},
didBecomeActive: function() {
this.firstTime && (this.firstTime = !1, this.setList(0));
},
didFinishTransition: function(a, b) {
this.setList(a.index);
},
didScroll: function(a, c) {
if (c.originator.kindName !== "XV.InfoListPrivate") return;
var d = c.originator, e = d.getScrollBounds().maxTop - d.rowHeight * b, f = {};
d.getIsMore() && d.getScrollPosition() > e && !d.getIsFetching() && (d.setIsFetching(!0), f.showMore = !0, this.fetch(d.owner.name, f));
},
create: function() {
var a, b;
this.inherited(arguments), this.$.leftLabel.setContent(this.label);
for (a = 0; a < this.lists.length; a++) b = this.$.lists.createComponent(this.lists[a]), this.doInfoListAdded(b);
this.$.menu.setCount(this.lists.length);
},
inputChanged: function(a, b) {
var c = this.$.lists.getIndex(), d = this.lists[c].name;
this.fetched = {}, this.fetch(d);
},
itemTap: function(a, b) {
this.setList(b.index);
},
setList: function(a) {
if (this.firstTime) return;
var b = this.lists[a].name;
this.$.menu.isSelected(a) || this.$.menu.select(a), this.selectedList = a, this.$.lists.getIndex() !== a && this.$.lists.setIndex(a), this.$.rightLabel.setContent(this.$.lists.$[b].getLabel()), this.fetched[b] || this.fetch(b);
},
fetch: function(b, c) {
b = b || this.$.lists.getActive().name;
var d = this.$.lists.$[b], e = d.getQuery() || {}, f = this.$.searchInput.getValue(), g = XT.app.$.pullout.getItem(b), h = g ? g.getParameters() : [];
c = c ? _.clone(c) : {}, c.showMore = _.isBoolean(c.showMore) ? c.showMore : !1, f || h.length ? (e.parameters = [], f && (e.parameters = [ {
attribute: d.getCollection().model.getSearchableAttributes(),
operator: "MATCHES",
value: this.$.searchInput.getValue()
} ]), h && (e.parameters = e.parameters.concat(h))) : delete e.parameters, c.showMore ? (e.rowOffset += a, c.add = !0) : (e.rowOffset = 0, e.rowLimit = a), d.setQuery(e), d.fetch(c), this.fetched[b] = !0;
},
requery: function(a, b) {
this.fetch();
},
showDashboard: function() {
this.bubble("dashboard", {
eventName: "dashboard"
});
},
showHistory: function(a, b) {
var c = {
name: "history"
};
this.doTogglePullout(c);
},
showParameters: function(a, b) {
var c = this.$.lists.getActive();
this.doTogglePullout(c);
},
doInfoListRowTapped: function(a, b) {
var c = this.$.lists.index, d = this.$.lists.children[c], e = b.index, f = d.collection.models[e];
return this.bubble("workspace", {
eventName: "workspace",
options: f
}), !0;
},
newWorkspace: function(a, b) {
var c = this.$.lists.controls[this.selectedList].query.recordType, d = new (XM[XV.util.formatModelName(c)]);
d.initialize(null, {
isNew: !0
}), this.bubble("workspace", {
eventName: "workspace",
options: d
});
},
doRefreshInfoObject: function(a, b) {
var c = XV.util.stripModelNamePrefix(b.recordType).camelize(), d = this.name === "setup" ? c + "List" : c + "InfoList", e = this.$.lists.$[d];
if (!e) return;
var f = _.find(e.collection.models, function(a) {
return a.id === b.id;
});
if (!f) return;
f.fetch();
},
warnLogout: function() {
this.$.logoutWarningPopup.show();
},
closeLogoutWarningPopup: function() {
this.$.logoutWarningPopup.hide();
},
logout: function() {
this.$.logoutWarningPopup.hide(), XT.session.logout();
}
});
})();

// pullout.js

(function() {
enyo.kind({
name: "XV.Pullout",
kind: "enyo.Slideable",
classes: "pullout",
value: -100,
min: -100,
unit: "%",
events: {
onHistoryItemSelected: ""
},
published: {
selectedPanel: ""
},
components: [ {
name: "shadow",
classes: "pullout-shadow"
}, {
name: "grabber",
kind: "onyx.Grabber",
classes: "pullout-grabbutton",
ondragfinish: "grabberDragFinish"
}, {
kind: "FittableRows",
classes: "enyo-fit",
components: [ {
name: "client",
classes: "pullout-toolbar"
}, {
name: "pulloutItems",
fit: !0,
style: "position: relative;",
components: [ {
name: "history",
kind: "FittableRows",
showing: !1,
classes: "enyo-fit",
components: [ {
kind: "onyx.RadioGroup",
classes: "history-header",
components: [ {
content: "History",
active: !0
} ]
}, {
fit: !0,
name: "historyPanel",
kind: "Scroller",
classes: "history-scroller",
components: [ {
kind: "Repeater",
name: "historyList",
onSetupItem: "setupHistoryItem",
count: 0,
components: [ {
name: "historyItem"
} ]
} ]
} ]
} ]
} ]
} ],
grabberDragFinish: function() {
this.getSelectedPanel() || this.togglePullout("history");
},
refreshHistoryList: function() {
this.$.historyList.setCount(XT.getHistory().length);
},
setupHistoryItem: function(a, b) {
var c = b.item.$.historyItem, d = XT.getHistory()[b.index], e = ("_" + XV.util.stripModelNamePrefix(d.modelType).camelize()).loc();
this.createComponent({
container: c,
classes: "item enyo-border-box",
style: "color:white",
ontap: "doHistoryItemSelected",
content: e + ": " + d.modelName,
modelType: d.modelType,
modelId: d.modelId,
module: d.module
});
},
getItem: function(a) {
return this.$.pulloutItems.$[a] || this.$[a];
},
togglePullout: function(a) {
this.setSelectedPanel(a);
var b = this.getItem(a), c = this.$.pulloutItems.children, d;
if (b.showing && this.isAtMax()) this.animateToMin(); else {
this.animateToMax();
for (d = 0; d < c.length; d++) c[d].hide();
b.show(), b.resized();
}
}
});
})();

// screen_carousel.js

(function() {
enyo.kind({
name: "XV.ScreenCarousel",
kind: "Panels",
classes: "xt-screen-carousel enyo-unselectable",
draggable: !1,
published: {
currentView: "",
carouselEvents: null
},
previousView: "",
currentViewChanged: function() {
var a = this.children, b = this.getCurrentView(), c = this.$[b], d = a.indexOf(c), e = this.previousView;
if (d === -1) this.log(this.name, "Could not find requested view %@".f(b), this.children, c, this.$), e || e === null ? this.currentView = e : this.currentView = null; else {
if (d === this.getIndex()) return;
this.previousView = b, this.setIndex(d);
}
},
create: function() {
var a = this.getCarouselEvents(), b = this.handlers, c;
if (a) for (c in a) a.hasOwnProperty(c) && (b[c] = "handleCarouselEvent");
this.inherited(arguments);
},
handleCarouselEvent: function(a, b) {
var c = this.getCarouselEvents(), d = b.eventName, e = c[d];
if (e) {
this.setCurrentView(e);
var f = this.$[e];
b.options && f && f.setOptions && f.setOptions(b.options);
}
return !0;
},
completed: function() {
var a;
this.inherited(arguments), a = this.getActive(), a && a.didBecomeActive && a.didBecomeActive();
}
});
})();

// workspace.js

(function() {
enyo.kind({
name: "XV.WorkspacePanels",
kind: "FittableRows",
realtimeFit: !0,
wrap: !1,
classes: "panels enyo-border-box",
published: {
modelType: ""
},
events: {
onValueChanged: ""
},
components: [ {
kind: "Panels",
name: "topPanel",
style: "height: 300px;",
arrangerKind: "CarouselArranger"
}, {
kind: "Panels",
fit: !0,
name: "bottomPanel",
arrangerKind: "CarouselArranger"
} ],
updateLayout: function() {
var a, b, c, d, e;
for (var f = 0; f < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; f++) {
var g = XV.util.getWorkspacePanelDescriptor()[this.modelType][f];
if (g.kind) a = this.createComponent({
kind: g.kind || "XV.InputWidget",
container: g.location === "bottom" ? this.$.bottomPanel : this.$.topPanel,
name: g.title
}), g.customization && a.setCustomization(g.customization), a.setDescriptor(g); else {
a = this.createComponent({
kind: "onyx.Groupbox",
container: g.location === "bottom" ? this.$.bottomPanel : this.$.topPanel,
style: "min-height: 250px; width: 400px; background-color: white; margin-right: 5px;",
components: [ {
kind: "onyx.GroupboxHeader",
content: g.title
} ]
});
for (b = 0; b < g.fields.length; b++) {
c = g.fields[b], e = c.label ? "_" + c.label : "_" + c.fieldName, d = this.createComponent({
kind: "onyx.InputDecorator",
style: "font-size: 12px",
container: a,
components: [ {
tag: "span",
content: e.loc() + ": ",
style: "padding-right: 10px;"
} ]
});
var h = this.createComponent({
kind: c.kind || "XV.InputWidget",
style: "border: 0px; ",
name: c.fieldName,
container: d
});
c.collection && h.setCollection(c.collection);
}
}
}
this.render();
},
gotoBox: function(a) {
var b = 0, c = 0, d;
for (d = 0; d < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; d++) {
var e = XV.util.getWorkspacePanelDescriptor()[this.modelType][d];
if (e.title === a && e.location === "bottom") {
this.$.bottomPanel.setIndex(c);
return;
}
if (e.title === a) {
this.$.topPanel.setIndex(b);
return;
}
e.location === "bottom" ? c++ : b++;
}
},
updateFields: function(a) {
var b, c, d, e, f;
XT.log("update with model: " + a.get("type"));
for (b = 0; b < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; b++) {
var g = XV.util.getWorkspacePanelDescriptor()[this.modelType][b];
if (g.kind) this.$[g.title].setValue(a.getValue(g.objectName)); else for (c = 0; c < g.fields.length; c++) d = g.fields[c], e = g.fields[c].fieldName, f = a.getValue(e) || a.getValue(e) === 0 ? a.getValue(e) : "", e && this.$[e].setValue(f, {
silent: !0
});
}
}
}), enyo.kind({
name: "XV.Workspace",
kind: "Panels",
classes: "app enyo-unselectable",
realtimeFit: !0,
arrangerKind: "CollapsingArranger",
published: {
modelType: "",
model: null
},
events: {
onHistoryChanged: "",
onModelSave: ""
},
handlers: {
onValueChange: "valueChanged",
onSubmodelUpdate: "enableSaveButton"
},
components: [ {
kind: "FittableRows",
classes: "left",
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
name: "workspaceHeader"
}, {
kind: "onyx.MenuDecorator",
components: [ {
content: "_navigation".loc()
}, {
kind: "onyx.Tooltip",
content: "Tap to open..."
}, {
kind: "onyx.Menu",
name: "navigationMenu",
components: [ {
content: "Dashboard"
}, {
content: "CRM"
}, {
content: "Setup"
} ],
ontap: "navigationSelected"
} ]
} ]
}, {
kind: "Repeater",
fit: !0,
touch: !0,
onSetupItem: "setupItem",
name: "menuItems",
components: [ {
name: "item",
classes: "item enyo-border-box",
ontap: "itemTap"
} ]
} ]
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
content: ""
}, {
kind: "onyx.Button",
name: "saveButton",
disabled: !0,
content: "_save".loc(),
classes: "onyx-affirmative",
onclick: "save"
} ]
}, {
kind: "XV.WorkspacePanels",
name: "workspacePanels",
fit: !0
}, {
name: "exitWarningPopup",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
content: "You have unsaved changes. Are you sure you want to leave?"
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Leave without saving",
ontap: "forceExit"
}, {
kind: "onyx.Button",
content: "Save and leave",
ontap: "saveAndLeave"
}, {
kind: "onyx.Button",
content: "Don't leave",
ontap: "closeExitWarningPopup"
} ]
} ]
} ],
_exitDestination: null,
bubbleExit: function(a) {
this.bubble(a, {
eventName: a
});
},
closeExitWarningPopup: function() {
this.$.exitWarningPopup.hide();
},
enableSaveButton: function() {
this.$.saveButton.setDisabled(!1);
},
forceExit: function() {
this.closeExitWarningPopup(), this.bubbleExit(this._exitDestination);
},
itemTap: function(a, b) {
var c = XV.util.getWorkspacePanelDescriptor()[this.getModelType()][b.index];
this.$.workspacePanels.gotoBox(c.title);
},
modelDidChange: function(a, b, c) {
var d = a.getStatus(), e = a.getClass();
if (!(d & e.READY)) return;
XT.log("Loading model into workspace: " + JSON.stringify(a.toJSON())), XT.addToHistory("crm", a), this.doHistoryChanged(), this.$.workspacePanels.updateFields(a);
},
navigationSelected: function(a, b) {
var c = b.originator.content.toLowerCase(), d = this.getModel(), e = d.getStatus(), f = d.getClass();
if (e & f.DIRTY) {
this.$.exitWarningPopup.show(), this._exitDestination = c;
return;
}
this.bubbleExit(c);
},
save: function() {
this.getModel().save(), this.$.saveButton.setDisabled(!0);
var a = this.getModel().id, b = this.getModel().recordType;
enyo.Signals.send("onModelSave", {
id: a,
recordType: b
});
},
saveAndLeave: function() {
this.closeExitWarningPopup(), this.save(), this.bubbleExit(this._exitDestination);
},
setupItem: function(a, b) {
var c = XV.util.getWorkspacePanelDescriptor()[this.getModelType()][b.index].title;
return b.item.children[0].setContent(c), !0;
},
setOptions: function(a) {
var b, c, d, e;
this.wipe(), b = XV.util.infoToMasterModelName(a.recordType), this.setModelType(b);
var f = XV.util.stripModelNamePrefix(b).camelize();
this.$.workspaceHeader.setContent(("_" + f).loc()), this.setWorkspaceList(), this.$.menuItems.render(), this.$.workspacePanels.setModelType(b), this.$.workspacePanels.updateLayout(), c = Backbone.Relational.store.getObjectByName(b), d = a.id, e = new c, this.setModel(e), e.on("statusChange", enyo.bind(this, "modelDidChange")), d ? (e.fetch({
id: d
}), XT.log("Workspace is fetching " + b + " " + d)) : (e.initialize(null, {
isNew: !0
}), XT.log("Workspace is fetching new " + b));
},
setWorkspaceList: function() {
var a = XV.util.getWorkspacePanelDescriptor()[this.getModelType()];
this.$.menuItems.setCount(a.length);
},
valueChanged: function(a, b) {
var c = b.value, d = {}, e = this.getModel();
e && (d[b.originator.name] = c, e.set(d), this.enableSaveButton());
},
wipe: function() {
XV.util.removeAll(this.$.workspacePanels.$.topPanel), this.$.workspacePanels.$.topPanel.refresh(), XV.util.removeAll(this.$.workspacePanels.$.bottomPanel), this.$.workspacePanels.$.bottomPanel.refresh();
}
});
})();

// login.js

(function() {
var a = enyo.getCookie("xtsessioncookie"), b = document.location.hostname, c = document.location.pathname;
if (c.match(/login/g)) return;
try {
a = JSON.parse(a);
} catch (d) {
document.location = "https://%@/login".f(b);
}
})();

// postbooks.js

enyo.kind({
name: "XV.Postbooks",
kind: "Control",
classes: "xt-postbooks enyo-unselectable",
components: [ {
name: "container",
kind: "XV.PostbooksContainer"
} ],
getContainer: function() {
return this.$.container;
},
getActiveModule: function() {
return this.getContainer().getActive();
}
}), enyo.kind({
name: "XV.PostbooksContainer",
kind: "XV.ScreenCarousel",
classes: "xt-postbooks-container enyo-unselectable",
components: [ {
name: "dashboard",
kind: "XV.Dashboard"
}, {
name: "crm",
kind: "XV.Crm"
}, {
name: "billing",
kind: "XV.Billing"
}, {
name: "setup",
kind: "XV.Setup"
}, {
name: "workspace",
kind: "XV.Workspace"
} ],
carouselEvents: {
crm: "crm",
billing: "billing",
setup: "setup",
workspace: "workspace",
dashboard: "dashboard"
},
getModuleByName: function(a) {
return this.$[a];
},
applyWorkspace: function(a) {
this.setCurrentView("workspace"), this.$.workspace.setOptions(a);
}
});

// dashboard.js

(function() {
enyo.kind({
name: "XV.Dashboard",
kind: "Control",
classes: "xt-dashboard",
components: [ {
name: "container",
classes: "xt-dashboard-container",
components: [ {
name: "icons",
kind: "XV.DashboardIcons"
} ]
} ]
}), enyo.kind({
name: "XV.DashboardIcons",
classes: "xt-dashboard-icons",
create: function() {
this.inherited(arguments);
var a = this.children.length;
this.applyStyle("width", 134 * a + "px");
},
components: [ {
name: "crm",
kind: "XV.DashboardIcon"
}, {
name: "setup",
kind: "XV.DashboardIcon"
} ]
}), enyo.kind({
name: "XV.DashboardIcon",
kind: "Control",
classes: "xt-dashboard-icon",
tap: function() {
var a = this.name;
this.bubble(a, {
eventName: a
});
},
create: function() {
this.inherited(arguments);
var a = this.name, b = "%@Icon".f(a);
this.createComponent({
name: b,
kind: "Image",
classes: "xt-dashboard-icon-image",
src: "images/" + a + "-icon.png"
}), this.createComponent({
name: "%@Label".f(b),
content: a,
classes: "xt-dashboard-icon-label"
});
}
});
})();

// crm.js

(function() {
enyo.kind({
name: "XV.Crm",
kind: "XV.Module",
label: "_crm".loc(),
lists: [ {
name: "accountInfoList",
kind: "XV.AccountInfoList"
}, {
name: "contactInfoList",
kind: "XV.ContactInfoList"
}, {
name: "toDoInfoList",
kind: "XV.ToDoInfoList"
}, {
name: "opportunityInfoList",
kind: "XV.OpportunityInfoList"
}, {
name: "incidentInfoList",
kind: "XV.IncidentInfoList"
}, {
name: "projectInfoList",
kind: "XV.ProjectInfoList"
} ]
});
})();

// billing.js

(function() {
enyo.kind({
name: "XV.Billing",
kind: "XV.Module",
label: "_billing".loc(),
lists: []
});
})();

// setup.js

(function() {
enyo.kind({
name: "XV.Setup",
kind: "XV.Module",
label: "_setup".loc(),
lists: [ {
name: "stateList",
kind: "XV.StateList"
}, {
name: "countryList",
kind: "XV.CountryList"
}, {
name: "priorityList",
kind: "XV.PriorityList"
}, {
name: "honorificList",
kind: "XV.HonorificList"
}, {
name: "incidentCategoryList",
kind: "XV.IncidentCategoryList"
}, {
name: "incidentResoulutionList",
kind: "XV.IncidentResolutionList"
}, {
name: "incidentSeverityList",
kind: "XV.IncidentSeverityList"
}, {
name: "opportunitySourceList",
kind: "XV.OpportunitySourceList"
}, {
name: "opportunityStageList",
kind: "XV.OpportunityStageList"
}, {
name: "opportunityTypeList",
kind: "XV.OpportunityTypeList"
} ]
});
})();

// app.js

(function() {
enyo.kind({
name: "App",
fit: !0,
classes: "xt-app enyo-unselectable",
published: {
isStarted: !1
},
handlers: {
onInfoListAdded: "addPulloutItem",
onParameterChange: "parameterDidChange",
onTogglePullout: "togglePullout",
onHistoryChanged: "refreshHistoryPanel",
onHistoryItemSelected: "selectHistoryItem"
},
components: [ {
name: "postbooks",
kind: "XV.Postbooks",
onTransitionStart: "handlePullout"
}, {
name: "pullout",
kind: "XV.Pullout"
} ],
addPulloutItem: function(a, b) {
var c = {
name: b.name,
showing: !1
};
b.getParameterWidget && (c.kind = b.getParameterWidget()), c.kind && (this._pulloutItems === undefined && (this._pulloutItems = []), this._pulloutItems.push(c));
},
create: function() {
this.inherited(arguments);
var a = this._pulloutItems || [], b;
for (b = 0; b < a.length; b++) this.$.pullout.$.pulloutItems.createComponent(a[b]);
},
handlePullout: function(a, b) {
var c = a.$.container.getActive().showPullout || !1;
this.$.pullout.setShowing(c);
},
parameterDidChange: function(a, b) {
this.$.postbooks.getActiveModule().waterfall("onParameterChange", b);
},
togglePullout: function(a, b) {
this.$.pullout.togglePullout(b.name);
},
refreshHistoryPanel: function(a, b) {
this.$.pullout.refreshHistoryList();
},
selectHistoryItem: function(a, b) {
var c = b.module, d = b.modelId, e = b.modelType, f = {
recordType: e,
id: d
};
XT.log("Load from history: " + e + " " + d), this.$.postbooks.getContainer().applyWorkspace(f);
},
start: function() {
if (this.getIsStarted()) return;
XT.dataSource.connect(), XT.app = this, this.setIsStarted(!0);
},
show: function() {
this.getShowing() && this.getIsStarted() ? this.renderInto(document.body) : this.inherited(arguments);
}
});
})();
