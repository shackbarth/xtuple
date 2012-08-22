
// minifier: path aliases

enyo.path.addPaths({underscore: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/underscore/", backbone: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/backbone/", backbone_relational: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/backbone_relational/", layout: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/layout/", onyx: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/onyx/", onyx: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/onyx/source/", globalize: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/globalize/", date_format: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/date_format/", socket_io: "/Users/cole/Devel/xtuple/git/clinuz/client/enyo/tools/../../lib/socket_io/", xt: "../source/xt/", xm: "../source/xm/", xv: "../source/xv/"});

// underscore.js

(function() {
var e = this, t = e._, n = {}, r = Array.prototype, i = Object.prototype, s = Function.prototype, o = r.push, u = r.slice, a = r.unshift, f = i.toString, l = i.hasOwnProperty, c = r.forEach, h = r.map, p = r.reduce, d = r.reduceRight, v = r.filter, m = r.every, g = r.some, y = r.indexOf, b = r.lastIndexOf, w = Array.isArray, E = Object.keys, S = s.bind, x = function(e) {
return new q(e);
};
typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = x), exports._ = x) : e._ = x, x.VERSION = "1.3.3";
var T = x.each = x.forEach = function(e, t, r) {
if (e == null) return;
if (c && e.forEach === c) e.forEach(t, r); else if (e.length === +e.length) {
for (var i = 0, s = e.length; i < s; i++) if (t.call(r, e[i], i, e) === n) return;
} else for (var o in e) if (x.has(e, o) && t.call(r, e[o], o, e) === n) return;
};
x.map = x.collect = function(e, t, n) {
var r = [];
return e == null ? r : h && e.map === h ? e.map(t, n) : (T(e, function(e, i, s) {
r[r.length] = t.call(n, e, i, s);
}), r);
}, x.reduce = x.foldl = x.inject = function(e, t, n, r) {
var i = arguments.length > 2;
e == null && (e = []);
if (p && e.reduce === p) return r && (t = x.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
T(e, function(e, s, o) {
i ? n = t.call(r, n, e, s, o) : (n = e, i = !0);
});
if (!i) throw new TypeError("Reduce of empty array with no initial value");
return n;
}, x.reduceRight = x.foldr = function(e, t, n, r) {
var i = arguments.length > 2;
e == null && (e = []);
if (d && e.reduceRight === d) return r && (t = x.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
var s = x.toArray(e).reverse();
return r && !i && (t = x.bind(t, r)), i ? x.reduce(s, t, n, r) : x.reduce(s, t);
}, x.find = x.detect = function(e, t, n) {
var r;
return N(e, function(e, i, s) {
if (t.call(n, e, i, s)) return r = e, !0;
}), r;
}, x.filter = x.select = function(e, t, n) {
var r = [];
return e == null ? r : v && e.filter === v ? e.filter(t, n) : (T(e, function(e, i, s) {
t.call(n, e, i, s) && (r[r.length] = e);
}), r);
}, x.reject = function(e, t, n) {
var r = [];
return e == null ? r : (T(e, function(e, i, s) {
t.call(n, e, i, s) || (r[r.length] = e);
}), r);
}, x.every = x.all = function(e, t, r) {
var i = !0;
return e == null ? i : m && e.every === m ? e.every(t, r) : (T(e, function(e, s, o) {
if (!(i = i && t.call(r, e, s, o))) return n;
}), !!i);
};
var N = x.some = x.any = function(e, t, r) {
t || (t = x.identity);
var i = !1;
return e == null ? i : g && e.some === g ? e.some(t, r) : (T(e, function(e, s, o) {
if (i || (i = t.call(r, e, s, o))) return n;
}), !!i);
};
x.include = x.contains = function(e, t) {
var n = !1;
return e == null ? n : y && e.indexOf === y ? e.indexOf(t) != -1 : (n = N(e, function(e) {
return e === t;
}), n);
}, x.invoke = function(e, t) {
var n = u.call(arguments, 2);
return x.map(e, function(e) {
return (x.isFunction(t) ? t : e[t]).apply(e, n);
});
}, x.pluck = function(e, t) {
return x.map(e, function(e) {
return e[t];
});
}, x.max = function(e, t, n) {
if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
if (!t && x.isEmpty(e)) return -Infinity;
var r = {
computed: -Infinity
};
return T(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o >= r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, x.min = function(e, t, n) {
if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
if (!t && x.isEmpty(e)) return Infinity;
var r = {
computed: Infinity
};
return T(e, function(e, i, s) {
var o = t ? t.call(n, e, i, s) : e;
o < r.computed && (r = {
value: e,
computed: o
});
}), r.value;
}, x.shuffle = function(e) {
var t, n = 0, r = [];
return T(e, function(e) {
t = Math.floor(Math.random() * ++n), r[n - 1] = r[t], r[t] = e;
}), r;
}, x.sortBy = function(e, t, n) {
var r = C(e, t);
return x.pluck(x.map(e, function(e, t, i) {
return {
value: e,
criteria: r.call(n, e, t, i)
};
}).sort(function(e, t) {
var n = e.criteria, r = t.criteria;
return n === void 0 ? 1 : r === void 0 ? -1 : n < r ? -1 : n > r ? 1 : 0;
}), "value");
};
var C = function(e, t) {
return x.isFunction(t) ? t : function(e) {
return e[t];
};
}, k = function(e, t, n) {
var r = {}, i = C(e, t);
return T(e, function(e, t) {
var s = i(e, t);
n(r, s, e);
}), r;
};
x.groupBy = function(e, t) {
return k(e, t, function(e, t, n) {
(e[t] || (e[t] = [])).push(n);
});
}, x.countBy = function(e, t) {
return k(e, t, function(e, t, n) {
e[t] || (e[t] = 0), e[t]++;
});
}, x.sortedIndex = function(e, t, n) {
n || (n = x.identity);
var r = n(t), i = 0, s = e.length;
while (i < s) {
var o = i + s >> 1;
n(e[o]) < r ? i = o + 1 : s = o;
}
return i;
}, x.toArray = function(e) {
return e ? x.isArray(e) ? u.call(e) : x.isArguments(e) ? u.call(e) : e.toArray && x.isFunction(e.toArray) ? e.toArray() : x.values(e) : [];
}, x.size = function(e) {
return x.isArray(e) ? e.length : x.keys(e).length;
}, x.first = x.head = x.take = function(e, t, n) {
return t != null && !n ? u.call(e, 0, t) : e[0];
}, x.initial = function(e, t, n) {
return u.call(e, 0, e.length - (t == null || n ? 1 : t));
}, x.last = function(e, t, n) {
return t != null && !n ? u.call(e, Math.max(e.length - t, 0)) : e[e.length - 1];
}, x.rest = x.tail = function(e, t, n) {
return u.call(e, t == null || n ? 1 : t);
}, x.compact = function(e) {
return x.filter(e, function(e) {
return !!e;
});
};
var L = function(e, t, n) {
return T(e, function(e) {
x.isArray(e) ? t ? o.apply(n, e) : L(e, t, n) : n.push(e);
}), n;
};
x.flatten = function(e, t) {
return L(e, t, []);
}, x.without = function(e) {
return x.difference(e, u.call(arguments, 1));
}, x.uniq = x.unique = function(e, t, n) {
var r = n ? x.map(e, n) : e, i = [];
return x.reduce(r, function(n, r, s) {
if (t ? x.last(n) !== r || !n.length : !x.include(n, r)) n.push(r), i.push(e[s]);
return n;
}, []), i;
}, x.union = function() {
return x.uniq(L(arguments, !0, []));
}, x.intersection = function(e) {
var t = u.call(arguments, 1);
return x.filter(x.uniq(e), function(e) {
return x.every(t, function(t) {
return x.indexOf(t, e) >= 0;
});
});
}, x.difference = function(e) {
var t = L(u.call(arguments, 1), !0, []);
return x.filter(e, function(e) {
return !x.include(t, e);
});
}, x.zip = function() {
var e = u.call(arguments), t = x.max(x.pluck(e, "length")), n = new Array(t);
for (var r = 0; r < t; r++) n[r] = x.pluck(e, "" + r);
return n;
}, x.zipObject = function(e, t) {
var n = {};
for (var r = 0, i = e.length; r < i; r++) n[e[r]] = t[r];
return n;
}, x.indexOf = function(e, t, n) {
if (e == null) return -1;
var r, i;
if (n) return r = x.sortedIndex(e, t), e[r] === t ? r : -1;
if (y && e.indexOf === y) return e.indexOf(t);
for (r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
return -1;
}, x.lastIndexOf = function(e, t) {
if (e == null) return -1;
if (b && e.lastIndexOf === b) return e.lastIndexOf(t);
var n = e.length;
while (n--) if (e[n] === t) return n;
return -1;
}, x.range = function(e, t, n) {
arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = new Array(r);
while (i < r) s[i++] = e, e += n;
return s;
};
var A = function() {};
x.bind = function(t, n) {
var r, i;
if (t.bind === S && S) return S.apply(t, u.call(arguments, 1));
if (!x.isFunction(t)) throw new TypeError;
return i = u.call(arguments, 2), r = function() {
if (this instanceof r) {
A.prototype = t.prototype;
var e = new A, s = t.apply(e, i.concat(u.call(arguments)));
return Object(s) === s ? s : e;
}
return t.apply(n, i.concat(u.call(arguments)));
};
}, x.bindAll = function(e) {
var t = u.call(arguments, 1);
return t.length == 0 && (t = x.functions(e)), T(t, function(t) {
e[t] = x.bind(e[t], e);
}), e;
}, x.memoize = function(e, t) {
var n = {};
return t || (t = x.identity), function() {
var r = t.apply(this, arguments);
return x.has(n, r) ? n[r] : n[r] = e.apply(this, arguments);
};
}, x.delay = function(e, t) {
var n = u.call(arguments, 2);
return setTimeout(function() {
return e.apply(null, n);
}, t);
}, x.defer = function(e) {
return x.delay.apply(x, [ e, 1 ].concat(u.call(arguments, 1)));
}, x.throttle = function(e, t) {
var n, r, i, s, o, u, a = x.debounce(function() {
o = s = !1;
}, t);
return function() {
n = this, r = arguments;
var f = function() {
i = null, o && e.apply(n, r), a();
};
return i || (i = setTimeout(f, t)), s ? o = !0 : (s = !0, u = e.apply(n, r)), a(), u;
};
}, x.debounce = function(e, t, n) {
var r;
return function() {
var i = this, s = arguments, o = function() {
r = null, n || e.apply(i, s);
}, u = n && !r;
clearTimeout(r), r = setTimeout(o, t), u && e.apply(i, s);
};
}, x.once = function(e) {
var t = !1, n;
return function() {
return t ? n : (t = !0, n = e.apply(this, arguments));
};
}, x.wrap = function(e, t) {
return function() {
var n = [ e ].concat(u.call(arguments, 0));
return t.apply(this, n);
};
}, x.compose = function() {
var e = arguments;
return function() {
var t = arguments;
for (var n = e.length - 1; n >= 0; n--) t = [ e[n].apply(this, t) ];
return t[0];
};
}, x.after = function(e, t) {
return e <= 0 ? t() : function() {
if (--e < 1) return t.apply(this, arguments);
};
}, x.keys = E || function(e) {
if (e !== Object(e)) throw new TypeError("Invalid object");
var t = [];
for (var n in e) x.has(e, n) && (t[t.length] = n);
return t;
}, x.values = function(e) {
return x.map(e, x.identity);
}, x.functions = x.methods = function(e) {
var t = [];
for (var n in e) x.isFunction(e[n]) && t.push(n);
return t.sort();
}, x.extend = function(e) {
return T(u.call(arguments, 1), function(t) {
for (var n in t) e[n] = t[n];
}), e;
}, x.pick = function(e) {
var t = {};
return T(L(u.call(arguments, 1), !0, []), function(n) {
n in e && (t[n] = e[n]);
}), t;
}, x.defaults = function(e) {
return T(u.call(arguments, 1), function(t) {
for (var n in t) e[n] == null && (e[n] = t[n]);
}), e;
}, x.clone = function(e) {
return x.isObject(e) ? x.isArray(e) ? e.slice() : x.extend({}, e) : e;
}, x.tap = function(e, t) {
return t(e), e;
};
var O = function(e, t, n) {
if (e === t) return e !== 0 || 1 / e == 1 / t;
if (e == null || t == null) return e === t;
e._chain && (e = e._wrapped), t._chain && (t = t._wrapped);
if (e.isEqual && x.isFunction(e.isEqual)) return e.isEqual(t);
if (t.isEqual && x.isFunction(t.isEqual)) return t.isEqual(e);
var r = f.call(e);
if (r != f.call(t)) return !1;
switch (r) {
case "[object String]":
return e == String(t);
case "[object Number]":
return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
case "[object Date]":
case "[object Boolean]":
return +e == +t;
case "[object RegExp]":
return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase;
}
if (typeof e != "object" || typeof t != "object") return !1;
var i = n.length;
while (i--) if (n[i] == e) return !0;
n.push(e);
var s = 0, o = !0;
if (r == "[object Array]") {
s = e.length, o = s == t.length;
if (o) while (s--) if (!(o = s in e == s in t && O(e[s], t[s], n))) break;
} else {
if ("constructor" in e != "constructor" in t || e.constructor != t.constructor) return !1;
for (var u in e) if (x.has(e, u)) {
s++;
if (!(o = x.has(t, u) && O(e[u], t[u], n))) break;
}
if (o) {
for (u in t) if (x.has(t, u) && !(s--)) break;
o = !s;
}
}
return n.pop(), o;
};
x.isEqual = function(e, t) {
return O(e, t, []);
}, x.isEmpty = function(e) {
if (e == null) return !0;
if (x.isArray(e) || x.isString(e)) return e.length === 0;
for (var t in e) if (x.has(e, t)) return !1;
return !0;
}, x.isElement = function(e) {
return !!e && e.nodeType == 1;
}, x.isArray = w || function(e) {
return f.call(e) == "[object Array]";
}, x.isObject = function(e) {
return e === Object(e);
}, T([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(e) {
x["is" + e] = function(t) {
return f.call(t) == "[object " + e + "]";
};
}), x.isArguments(arguments) || (x.isArguments = function(e) {
return !!e && !!x.has(e, "callee");
}), x.isFinite = function(e) {
return x.isNumber(e) && isFinite(e);
}, x.isNaN = function(e) {
return e !== e;
}, x.isBoolean = function(e) {
return e === !0 || e === !1 || f.call(e) == "[object Boolean]";
}, x.isNull = function(e) {
return e === null;
}, x.isUndefined = function(e) {
return e === void 0;
}, x.has = function(e, t) {
return l.call(e, t);
}, x.noConflict = function() {
return e._ = t, this;
}, x.identity = function(e) {
return e;
}, x.times = function(e, t, n) {
for (var r = 0; r < e; r++) t.call(n, r);
};
var M = {
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#x27;",
"/": "&#x2F;"
}, _ = /[&<>"'\/]/g;
x.escape = function(e) {
return ("" + e).replace(_, function(e) {
return M[e];
});
}, x.result = function(e, t) {
if (e == null) return null;
var n = e[t];
return x.isFunction(n) ? n.call(e) : n;
}, x.mixin = function(e) {
T(x.functions(e), function(t) {
U(t, x[t] = e[t]);
});
};
var D = 0;
x.uniqueId = function(e) {
var t = D++;
return e ? e + t : t;
}, x.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
};
var P = /.^/, H = {
"\\": "\\",
"'": "'",
r: "\r",
n: "\n",
t: "	",
u2028: "\u2028",
u2029: "\u2029"
};
for (var B in H) H[H[B]] = B;
var j = /\\|'|\r|\n|\t|\u2028|\u2029/g, F = /\\(\\|'|r|n|t|u2028|u2029)/g, I = function(e) {
return e.replace(F, function(e, t) {
return H[t];
});
};
x.template = function(e, t, n) {
n = x.defaults(n || {}, x.templateSettings);
var r = "__p+='" + e.replace(j, function(e) {
return "\\" + H[e];
}).replace(n.escape || P, function(e, t) {
return "'+\n((__t=(" + I(t) + "))==null?'':_.escape(__t))+\n'";
}).replace(n.interpolate || P, function(e, t) {
return "'+\n((__t=(" + I(t) + "))==null?'':__t)+\n'";
}).replace(n.evaluate || P, function(e, t) {
return "';\n" + I(t) + "\n__p+='";
}) + "';\n";
n.variable || (r = "with(obj||{}){\n" + r + "}\n"), r = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'')};\n" + r + "return __p;\n";
var i = new Function(n.variable || "obj", "_", r);
if (t) return i(t, x);
var s = function(e) {
return i.call(this, e, x);
};
return s.source = "function(" + (n.variable || "obj") + "){\n" + r + "}", s;
}, x.chain = function(e) {
return x(e).chain();
};
var q = function(e) {
this._wrapped = e;
};
x.prototype = q.prototype;
var R = function(e, t) {
return t ? x(e).chain() : e;
}, U = function(e, t) {
q.prototype[e] = function() {
var e = u.call(arguments);
return a.call(e, this._wrapped), R(t.apply(x, e), this._chain);
};
};
x.mixin(x), T([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(e) {
var t = r[e];
q.prototype[e] = function() {
var n = this._wrapped;
return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], R(n, this._chain);
};
}), T([ "concat", "join", "slice" ], function(e) {
var t = r[e];
q.prototype[e] = function() {
return R(t.apply(this._wrapped, arguments), this._chain);
};
}), q.prototype.chain = function() {
return this._chain = !0, this;
}, q.prototype.value = function() {
return this._wrapped;
};
}).call(this);

// backbone.js

(function() {
var e = this, t = e.Backbone, n = Array.prototype.splice, r;
typeof exports != "undefined" ? r = exports : r = e.Backbone = {}, r.VERSION = "0.9.2";
var i = e._;
!i && typeof require != "undefined" && (i = require("underscore")), r.$ = e.jQuery || e.Zepto || e.ender, r.noConflict = function() {
return e.Backbone = t, this;
}, r.emulateHTTP = !1, r.emulateJSON = !1;
var s = /\s+/, o = r.Events = {
on: function(e, t, n) {
var r, i, o;
if (!t) return this;
e = e.split(s), r = this._callbacks || (this._callbacks = {});
while (i = e.shift()) o = r[i] || (r[i] = []), o.push(t, n);
return this;
},
off: function(e, t, n) {
var r, o, u, a;
if (!(o = this._callbacks)) return this;
if (!(e || t || n)) return delete this._callbacks, this;
e = e ? e.split(s) : i.keys(o);
while (r = e.shift()) {
if (!(u = o[r]) || !t && !n) {
delete o[r];
continue;
}
for (a = u.length - 2; a >= 0; a -= 2) t && u[a] !== t || n && u[a + 1] !== n || u.splice(a, 2);
}
return this;
},
trigger: function(e) {
var t, n, r, i, o, u, a, f;
if (!(n = this._callbacks)) return this;
f = [], e = e.split(s);
for (i = 1, o = arguments.length; i < o; i++) f[i - 1] = arguments[i];
while (t = e.shift()) {
if (a = n.all) a = a.slice();
if (r = n[t]) r = r.slice();
if (r) for (i = 0, o = r.length; i < o; i += 2) r[i].apply(r[i + 1] || this, f);
if (a) {
u = [ t ].concat(f);
for (i = 0, o = a.length; i < o; i += 2) a[i].apply(a[i + 1] || this, u);
}
}
return this;
}
};
o.bind = o.on, o.unbind = o.off;
var u = r.Model = function(e, t) {
var n;
e || (e = {}), t && t.collection && (this.collection = t.collection), t && t.parse && (e = this.parse(e));
if (n = N(this, "defaults")) e = i.extend({}, n, e);
this.attributes = {}, this._escapedAttributes = {}, this.cid = i.uniqueId("c"), this.changed = {}, this._silent = {}, this._pending = {}, this.set(e, {
silent: !0
}), this.changed = {}, this._silent = {}, this._pending = {}, this._previousAttributes = i.clone(this.attributes), this.initialize.apply(this, arguments);
};
i.extend(u.prototype, o, {
changed: null,
_silent: null,
_pending: null,
idAttribute: "id",
initialize: function() {},
toJSON: function(e) {
return i.clone(this.attributes);
},
sync: function() {
return r.sync.apply(this, arguments);
},
get: function(e) {
return this.attributes[e];
},
escape: function(e) {
var t;
if (t = this._escapedAttributes[e]) return t;
var n = this.get(e);
return this._escapedAttributes[e] = i.escape(n == null ? "" : "" + n);
},
has: function(e) {
return this.get(e) != null;
},
set: function(e, t, n) {
var r, s, o;
i.isObject(e) || e == null ? (r = e, n = t) : (r = {}, r[e] = t), n || (n = {});
if (!r) return this;
r instanceof u && (r = r.attributes);
if (n.unset) for (s in r) r[s] = void 0;
if (!this._validate(r, n)) return !1;
this.idAttribute in r && (this.id = r[this.idAttribute]);
var a = n.changes = {}, f = this.attributes, l = this._escapedAttributes, c = this._previousAttributes || {};
for (s in r) {
o = r[s];
if (!i.isEqual(f[s], o) || n.unset && i.has(f, s)) delete l[s], (n.silent ? this._silent : a)[s] = !0;
n.unset ? delete f[s] : f[s] = o, !i.isEqual(c[s], o) || i.has(f, s) !== i.has(c, s) ? (this.changed[s] = o, n.silent || (this._pending[s] = !0)) : (delete this.changed[s], delete this._pending[s]);
}
return n.silent || this.change(n), this;
},
unset: function(e, t) {
return t = i.extend({}, t, {
unset: !0
}), this.set(e, null, t);
},
clear: function(e) {
return e = i.extend({}, e, {
unset: !0
}), this.set(i.clone(this.attributes), e);
},
fetch: function(e) {
e = e ? i.clone(e) : {};
var t = this, n = e.success;
return e.success = function(r, i, s) {
if (!t.set(t.parse(r, s), e)) return !1;
n && n(t, r, e), t.trigger("sync", t, r, e);
}, e.error = r.wrapError(e.error, t, e), this.sync("read", this, e);
},
save: function(e, t, n) {
var s, o, u;
i.isObject(e) || e == null ? (s = e, n = t) : (s = {}, s[e] = t), n = n ? i.clone(n) : {};
if (n.wait) {
if (!this._validate(s, n)) return !1;
o = i.clone(this.attributes);
}
var a = i.extend({}, n, {
silent: !0
});
if (s && !this.set(s, n.wait ? a : n)) return !1;
if (!s && !this.isValid()) return !1;
var f = this, l = n.success;
n.success = function(e, t, r) {
u = !0;
var o = f.parse(e, r);
n.wait && (o = i.extend(s || {}, o));
if (!f.set(o, n)) return !1;
l && l(f, e, n), f.trigger("sync", f, e, n);
}, n.error = r.wrapError(n.error, f, n);
var c = this.sync(this.isNew() ? "create" : "update", this, n);
return !u && n.wait && (this.clear(a), this.set(o, a)), c;
},
destroy: function(e) {
e = e ? i.clone(e) : {};
var t = this, n = e.success, s = function() {
t.trigger("destroy", t, t.collection, e);
};
e.success = function(r) {
(e.wait || t.isNew()) && s(), n && n(t, r, e), t.isNew() || t.trigger("sync", t, r, e);
};
if (this.isNew()) return e.success(), !1;
e.error = r.wrapError(e.error, t, e);
var o = this.sync("delete", this, e);
return e.wait || s(), o;
},
url: function() {
var e = N(this, "urlRoot") || N(this.collection, "url") || C();
return this.isNew() ? e : e + (e.charAt(e.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id);
},
parse: function(e, t) {
return e;
},
clone: function() {
return new this.constructor(this.attributes);
},
isNew: function() {
return this.id == null;
},
change: function(e) {
e || (e = {});
var t = this._changing;
this._changing = !0;
for (var n in this._silent) this._pending[n] = !0;
var r = i.extend({}, e.changes, this._silent);
this._silent = {};
for (var n in r) this.trigger("change:" + n, this, this.get(n), e);
if (t) return this;
while (!i.isEmpty(this._pending)) {
this._pending = {}, this.trigger("change", this, e);
for (var n in this.changed) {
if (this._pending[n] || this._silent[n]) continue;
delete this.changed[n];
}
this._previousAttributes = i.clone(this.attributes);
}
return this._changing = !1, this;
},
hasChanged: function(e) {
return e == null ? !i.isEmpty(this.changed) : i.has(this.changed, e);
},
changedAttributes: function(e) {
if (!e) return this.hasChanged() ? i.clone(this.changed) : !1;
var t, n = !1, r = this._previousAttributes;
for (var s in e) {
if (i.isEqual(r[s], t = e[s])) continue;
(n || (n = {}))[s] = t;
}
return n;
},
previous: function(e) {
return e == null || !this._previousAttributes ? null : this._previousAttributes[e];
},
previousAttributes: function() {
return i.clone(this._previousAttributes);
},
isValid: function() {
return !this.validate || !this.validate(this.attributes);
},
_validate: function(e, t) {
if (t.silent || !this.validate) return !0;
e = i.extend({}, this.attributes, e);
var n = this.validate(e, t);
return n ? (t && t.error ? t.error(this, n, t) : this.trigger("error", this, n, t), !1) : !0;
}
});
var a = r.Collection = function(e, t) {
t || (t = {}), t.model && (this.model = t.model), t.comparator !== void 0 && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && this.reset(e, {
silent: !0,
parse: t.parse
});
};
i.extend(a.prototype, o, {
model: u,
initialize: function() {},
toJSON: function(e) {
return this.map(function(t) {
return t.toJSON(e);
});
},
sync: function() {
return r.sync.apply(this, arguments);
},
add: function(e, t) {
var r, s, o, u, a, f, l = {}, c = {}, h = [];
t || (t = {}), e = i.isArray(e) ? e.slice() : [ e ];
for (r = 0, o = e.length; r < o; r++) {
if (!(u = e[r] = this._prepareModel(e[r], t))) throw new Error("Can't add an invalid model to a collection");
a = u.cid, f = u.id;
if (l[a] || this._byCid[a] || f != null && (c[f] || this._byId[f])) {
h.push(r);
continue;
}
l[a] = c[f] = u;
}
r = h.length;
while (r--) h[r] = e.splice(h[r], 1)[0];
for (r = 0, o = e.length; r < o; r++) (u = e[r]).on("all", this._onModelEvent, this), this._byCid[u.cid] = u, u.id != null && (this._byId[u.id] = u);
this.length += o, s = t.at != null ? t.at : this.models.length, n.apply(this.models, [ s, 0 ].concat(e));
if (t.merge) for (r = 0, o = h.length; r < o; r++) (u = this._byId[h[r].id]) && u.set(h[r], t);
this.comparator && t.at == null && this.sort({
silent: !0
});
if (t.silent) return this;
for (r = 0, o = this.models.length; r < o; r++) {
if (!l[(u = this.models[r]).cid]) continue;
t.index = r, u.trigger("add", u, this, t);
}
return this;
},
remove: function(e, t) {
var n, r, s, o;
t || (t = {}), e = i.isArray(e) ? e.slice() : [ e ];
for (n = 0, r = e.length; n < r; n++) {
o = this.getByCid(e[n]) || this.get(e[n]);
if (!o) continue;
delete this._byId[o.id], delete this._byCid[o.cid], s = this.indexOf(o), this.models.splice(s, 1), this.length--, t.silent || (t.index = s, o.trigger("remove", o, this, t)), this._removeReference(o);
}
return this;
},
push: function(e, t) {
return e = this._prepareModel(e, t), this.add(e, t), e;
},
pop: function(e) {
var t = this.at(this.length - 1);
return this.remove(t, e), t;
},
unshift: function(e, t) {
return e = this._prepareModel(e, t), this.add(e, i.extend({
at: 0
}, t)), e;
},
shift: function(e) {
var t = this.at(0);
return this.remove(t, e), t;
},
slice: function(e, t) {
return this.models.slice(e, t);
},
get: function(e) {
return e == null ? void 0 : this._byId[e.id != null ? e.id : e];
},
getByCid: function(e) {
return e && this._byCid[e.cid || e];
},
at: function(e) {
return this.models[e];
},
where: function(e) {
return i.isEmpty(e) ? [] : this.filter(function(t) {
for (var n in e) if (e[n] !== t.get(n)) return !1;
return !0;
});
},
sort: function(e) {
e || (e = {});
if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
var t = i.bind(this.comparator, this);
return this.comparator.length === 1 ? this.models = this.sortBy(t) : this.models.sort(t), e.silent || this.trigger("reset", this, e), this;
},
pluck: function(e) {
return i.map(this.models, function(t) {
return t.get(e);
});
},
reset: function(e, t) {
e || (e = []), t || (t = {});
for (var n = 0, r = this.models.length; n < r; n++) this._removeReference(this.models[n]);
return this._reset(), this.add(e, i.extend({
silent: !0
}, t)), t.silent || this.trigger("reset", this, t), this;
},
fetch: function(e) {
e = e ? i.clone(e) : {}, e.parse === void 0 && (e.parse = !0);
var t = this, n = e.success;
return e.success = function(r, i, s) {
t[e.add ? "add" : "reset"](t.parse(r, s), e), n && n(t, r, e), t.trigger("sync", t, r, e);
}, e.error = r.wrapError(e.error, t, e), this.sync("read", this, e);
},
create: function(e, t) {
var n = this;
t = t ? i.clone(t) : {}, e = this._prepareModel(e, t);
if (!e) return !1;
t.wait || n.add(e, t);
var r = t.success;
return t.success = function(e, t, i) {
i.wait && n.add(e, i), r && r(e, t, i);
}, e.save(null, t), e;
},
parse: function(e, t) {
return e;
},
clone: function() {
return new this.constructor(this.models);
},
chain: function() {
return i(this.models).chain();
},
_reset: function(e) {
this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
},
_prepareModel: function(e, t) {
if (e instanceof u) return e.collection || (e.collection = this), e;
t || (t = {}), t.collection = this;
var n = new this.model(e, t);
return n._validate(n.attributes, t) ? n : !1;
},
_removeReference: function(e) {
this === e.collection && delete e.collection, e.off("all", this._onModelEvent, this);
},
_onModelEvent: function(e, t, n, r) {
if ((e === "add" || e === "remove") && n !== this) return;
e === "destroy" && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], t.id != null && (this._byId[t.id] = t)), this.trigger.apply(this, arguments);
}
});
var f = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
i.each(f, function(e) {
a.prototype[e] = function() {
return i[e].apply(i, [ this.models ].concat(i.toArray(arguments)));
};
});
var l = r.Router = function(e) {
e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
}, c = /:\w+/g, h = /\*\w+/g, p = /[-[\]{}()+?.,\\^$|#\s]/g;
i.extend(l.prototype, o, {
initialize: function() {},
route: function(e, t, n) {
return r.history || (r.history = new d), i.isRegExp(e) || (e = this._routeToRegExp(e)), n || (n = this[t]), r.history.route(e, i.bind(function(i) {
var s = this._extractParameters(e, i);
n && n.apply(this, s), this.trigger.apply(this, [ "route:" + t ].concat(s)), r.history.trigger("route", this, t, s);
}, this)), this;
},
navigate: function(e, t) {
r.history.navigate(e, t);
},
_bindRoutes: function() {
if (!this.routes) return;
var e = [];
for (var t in this.routes) e.unshift([ t, this.routes[t] ]);
for (var n = 0, r = e.length; n < r; n++) this.route(e[n][0], e[n][1], this[e[n][1]]);
},
_routeToRegExp: function(e) {
return e = e.replace(p, "\\$&").replace(c, "([^/]+)").replace(h, "(.*?)"), new RegExp("^" + e + "$");
},
_extractParameters: function(e, t) {
return e.exec(t).slice(1);
}
});
var d = r.History = function(t) {
this.handlers = [], i.bindAll(this, "checkUrl"), this.location = t && t.location || e.location, this.history = t && t.history || e.history;
}, v = /^[#\/]/, m = /msie [\w.]+/, g = /\/$/;
d.started = !1, i.extend(d.prototype, o, {
interval: 50,
getHash: function(e) {
var t = (e || this).location.href.match(/#(.*)$/);
return t ? t[1] : "";
},
getFragment: function(e, t) {
if (e == null) if (this._hasPushState || !this._wantsHashChange || t) {
e = this.location.pathname;
var n = this.options.root.replace(g, "");
e.indexOf(n) || (e = e.substr(n.length));
} else e = this.getHash();
return decodeURIComponent(e.replace(v, ""));
},
start: function(e) {
if (d.started) throw new Error("Backbone.history has already been started");
d.started = !0, this.options = i.extend({}, {
root: "/"
}, this.options, e), this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
var t = this.getFragment(), n = document.documentMode, s = m.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
g.test(this.options.root) || (this.options.root += "/"), s && this._wantsHashChange && (this.iframe = r.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(t)), this._hasPushState ? r.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !s ? r.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = t;
var o = this.location, u = o.pathname.replace(/[^/]$/, "$&/") === this.options.root && !o.search;
if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !u) return this.fragment = this.getFragment(null, !0), this.location.replace(this.options.root + this.location.search + "#" + this.fragment), !0;
this._wantsPushState && this._hasPushState && u && o.hash && (this.fragment = this.getHash().replace(v, ""), this.history.replaceState({}, document.title, o.protocol + "//" + o.host + this.options.root + this.fragment));
if (!this.options.silent) return this.loadUrl();
},
stop: function() {
r.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), d.started = !1;
},
route: function(e, t) {
this.handlers.unshift({
route: e,
callback: t
});
},
checkUrl: function(e) {
var t = this.getFragment();
t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe)));
if (t === this.fragment) return !1;
this.iframe && this.navigate(t), this.loadUrl() || this.loadUrl(this.getHash());
},
loadUrl: function(e) {
var t = this.fragment = this.getFragment(e), n = i.any(this.handlers, function(e) {
if (e.route.test(t)) return e.callback(t), !0;
});
return n;
},
navigate: function(e, t) {
if (!d.started) return !1;
if (!t || t === !0) t = {
trigger: t
};
var n = (e || "").replace(v, "");
if (this.fragment === n) return;
this.fragment = n;
var r = (n.indexOf(this.options.root) !== 0 ? this.options.root : "") + n;
if (this._hasPushState) this.history[t.replace ? "replaceState" : "pushState"]({}, document.title, r); else {
if (!this._wantsHashChange) return this.location.assign(r);
this._updateHash(this.location, n, t.replace), this.iframe && n !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, n, t.replace));
}
t.trigger && this.loadUrl(e);
},
_updateHash: function(e, t, n) {
n ? e.replace(e.href.replace(/(javascript:|#).*$/, "") + "#" + t) : e.hash = t;
}
});
var y = r.View = function(e) {
this.cid = i.uniqueId("view"), this._configure(e || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
}, b = /^(\S+)\s*(.*)$/, w = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
i.extend(y.prototype, o, {
tagName: "div",
$: function(e) {
return this.$el.find(e);
},
initialize: function() {},
render: function() {
return this;
},
remove: function() {
return this.$el.remove(), this;
},
make: function(e, t, n) {
var i = document.createElement(e);
return t && r.$(i).attr(t), n != null && r.$(i).html(n), i;
},
setElement: function(e, t) {
return this.$el && this.undelegateEvents(), this.$el = e instanceof r.$ ? e : r.$(e), this.el = this.$el[0], t !== !1 && this.delegateEvents(), this;
},
delegateEvents: function(e) {
if (!e && !(e = N(this, "events"))) return;
this.undelegateEvents();
for (var t in e) {
var n = e[t];
i.isFunction(n) || (n = this[e[t]]);
if (!n) throw new Error('Method "' + e[t] + '" does not exist');
var r = t.match(b), s = r[1], o = r[2];
n = i.bind(n, this), s += ".delegateEvents" + this.cid, o === "" ? this.$el.bind(s, n) : this.$el.delegate(o, s, n);
}
},
undelegateEvents: function() {
this.$el.unbind(".delegateEvents" + this.cid);
},
_configure: function(e) {
this.options && (e = i.extend({}, this.options, e));
for (var t = 0, n = w.length; t < n; t++) {
var r = w[t];
e[r] && (this[r] = e[r]);
}
this.options = e;
},
_ensureElement: function() {
if (!this.el) {
var e = i.extend({}, N(this, "attributes"));
this.id && (e.id = this.id), this.className && (e["class"] = this.className), this.setElement(this.make(N(this, "tagName"), e), !1);
} else this.setElement(this.el, !1);
}
});
var E = function(e, t) {
return T(this, e, t);
};
u.extend = a.extend = l.extend = y.extend = E;
var S = {
create: "POST",
update: "PUT",
"delete": "DELETE",
read: "GET"
};
r.sync = function(e, t, n) {
var s = S[e];
n || (n = {});
var o = {
type: s,
dataType: "json"
};
return n.url || (o.url = N(t, "url") || C()), !n.data && t && (e === "create" || e === "update") && (o.contentType = "application/json", o.data = JSON.stringify(t)), r.emulateJSON && (o.contentType = "application/x-www-form-urlencoded", o.data = o.data ? {
model: o.data
} : {}), r.emulateHTTP && (s === "PUT" || s === "DELETE") && (r.emulateJSON && (o.data._method = s), o.type = "POST", o.beforeSend = function(e) {
e.setRequestHeader("X-HTTP-Method-Override", s);
}), o.type !== "GET" && !r.emulateJSON && (o.processData = !1), r.ajax(i.extend(o, n));
}, r.ajax = function() {
return r.$.ajax.apply(r.$, arguments);
}, r.wrapError = function(e, t, n) {
return function(r, i) {
i = r === t ? i : r, e ? e(t, i, n) : t.trigger("error", t, i, n);
};
};
var x = function() {}, T = function(e, t, n) {
var r;
return t && t.hasOwnProperty("constructor") ? r = t.constructor : r = function() {
e.apply(this, arguments);
}, i.extend(r, e), x.prototype = e.prototype, r.prototype = new x, t && i.extend(r.prototype, t), n && i.extend(r, n), r.prototype.constructor = r, r.__super__ = e.prototype, r;
}, N = function(e, t) {
return !e || !e[t] ? null : i.isFunction(e[t]) ? e[t]() : e[t];
}, C = function() {
throw new Error('A "url" property or function must be specified');
};
}).call(this);

// backbone-relational.js

(function(e) {
"use strict";
var t, n, r;
typeof window == "undefined" ? (t = require("underscore"), n = require("backbone"), r = module.exports = n) : (t = window._, n = window.Backbone, r = window), n.Relational = {
showWarnings: !0
}, n.Semaphore = {
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
setAvailablePermits: function(e) {
if (this._permitsUsed > e) throw new Error("Available permits cannot be less than used permits");
this._permitsAvailable = e;
}
}, n.BlockingQueue = function() {
this._queue = [];
}, t.extend(n.BlockingQueue.prototype, n.Semaphore, {
_queue: null,
add: function(e) {
this.isBlocked() ? this._queue.push(e) : e();
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
}), n.Relational.eventQueue = new n.BlockingQueue, n.Store = function() {
this._collections = [], this._reverseRelations = [], this._subModels = [], this._modelScopes = [ r ];
}, t.extend(n.Store.prototype, n.Events, {
addModelScope: function(e) {
this._modelScopes.push(e);
},
addSubModels: function(e, t) {
this._subModels.push({
superModelType: t,
subModels: e
});
},
setupSuperModel: function(e) {
t.find(this._subModels, function(n) {
return t.find(n.subModels, function(t, r) {
var i = this.getObjectByName(t);
if (e === i) return n.superModelType._subModels[r] = e, e._superModel = n.superModelType, e._subModelTypeValue = r, e._subModelTypeAttribute = n.superModelType.prototype.subModelTypeAttribute, !0;
}, this);
}, this);
},
addReverseRelation: function(e) {
var n = t.any(this._reverseRelations, function(n) {
return t.all(e, function(e, t) {
return e === n[t];
});
});
if (!n && e.model && e.type) {
this._reverseRelations.push(e);
var r = function(e, n) {
e.prototype.relations || (e.prototype.relations = []), e.prototype.relations.push(n), t.each(e._subModels, function(e) {
r(e, n);
}, this);
};
r(e.model, e), this.retroFitRelation(e);
}
},
retroFitRelation: function(e) {
var t = this.getCollection(e.model);
t.each(function(t) {
if (!(t instanceof e.model)) return;
new e.type(t, e);
}, this);
},
getCollection: function(e) {
e instanceof n.RelationalModel && (e = e.constructor);
var r = e;
while (r._superModel) r = r._superModel;
var i = t.detect(this._collections, function(e) {
return e.model === r;
});
return i || (i = this._createCollection(e)), i;
},
getObjectByName: function(e) {
var n = e.split("."), r = null;
return t.find(this._modelScopes, function(e) {
r = t.reduce(n, function(e, t) {
return e[t];
}, e);
if (r && r !== e) return !0;
}, this), r;
},
_createCollection: function(e) {
var t;
return e instanceof n.RelationalModel && (e = e.constructor), e.prototype instanceof n.RelationalModel && (t = new n.Collection, t.model = e, this._collections.push(t)), t;
},
resolveIdForItem: function(e, r) {
var i = t.isString(r) || t.isNumber(r) ? r : null;
return i == null && (r instanceof n.RelationalModel ? i = r.id : t.isObject(r) && (i = r[e.prototype.idAttribute])), i;
},
find: function(e, t) {
var n = this.resolveIdForItem(e, t), r = this.getCollection(e);
if (r) {
var i = r.get(n);
if (i instanceof e) return i;
}
return null;
},
register: function(e) {
var t = e.collection, n = this.getCollection(e);
n && n.add(e), e.bind("destroy", this.unregister, this), e.collection = t;
},
update: function(e) {
var t = this.getCollection(e);
t._onModelEvent("change:" + e.idAttribute, e, t);
},
unregister: function(e) {
e.unbind("destroy", this.unregister);
var t = this.getCollection(e);
t && t.remove(e);
}
}), n.Relational.store = new n.Store, n.Relation = function(e, r) {
this.instance = e, r = t.isObject(r) ? r : {}, this.reverseRelation = t.defaults(r.reverseRelation || {}, this.options.reverseRelation), this.reverseRelation.type = t.isString(this.reverseRelation.type) ? n[this.reverseRelation.type] || n.Relational.store.getObjectByName(this.reverseRelation.type) : this.reverseRelation.type, this.model = r.model || this.instance.constructor, this.options = t.defaults(r, this.options, n.Relation.prototype.options), this.key = this.options.key, this.keySource = this.options.keySource || this.key, this.keyDestination = this.options.keyDestination || this.keySource || this.key, this.relatedModel = this.options.relatedModel, t.isString(this.relatedModel) && (this.relatedModel = n.Relational.store.getObjectByName(this.relatedModel));
if (!this.checkPreconditions()) return !1;
e && (this.keyContents = this.instance.get(this.keySource), this.key !== this.keySource && this.instance.unset(this.keySource, {
silent: !0
}), this.instance._relations.push(this)), !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key && n.Relational.store.addReverseRelation(t.defaults({
isAutoRelation: !0,
model: this.relatedModel,
relatedModel: this.model,
reverseRelation: this.options
}, this.reverseRelation)), t.bindAll(this, "_modelRemovedFromCollection", "_relatedModelAdded", "_relatedModelRemoved"), e && (this.initialize(), n.Relational.store.getCollection(this.instance).bind("relational:remove", this._modelRemovedFromCollection), n.Relational.store.getCollection(this.relatedModel).bind("relational:add", this._relatedModelAdded).bind("relational:remove", this._relatedModelRemoved));
}, n.Relation.extend = n.Model.extend, t.extend(n.Relation.prototype, n.Events, n.Semaphore, {
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
_relatedModelAdded: function(e, t, n) {
var r = this;
e.queue(function() {
r.tryAddRelated(e, n);
});
},
_relatedModelRemoved: function(e, t, n) {
this.removeRelated(e, n);
},
_modelRemovedFromCollection: function(e) {
e === this.instance && this.destroy();
},
checkPreconditions: function() {
var e = this.instance, r = this.key, i = this.model, s = this.relatedModel, o = n.Relational.showWarnings && typeof console != "undefined";
if (!i || !r || !s) return o && console.warn("Relation=%o; no model, key or relatedModel (%o, %o, %o)", this, i, r, s), !1;
if (i.prototype instanceof n.RelationalModel) {
if (s.prototype instanceof n.RelationalModel) {
if (this instanceof n.HasMany && this.reverseRelation.type === n.HasMany) return o && console.warn("Relation=%o; relation is a HasMany, and the reverseRelation is HasMany as well.", this), !1;
if (e && e._relations.length) {
var u = t.any(e._relations, function(e) {
var t = this.reverseRelation.key && e.reverseRelation.key;
return e.relatedModel === s && e.key === r && (!t || this.reverseRelation.key === e.reverseRelation.key);
}, this);
if (u) return o && console.warn("Relation=%o between instance=%o.%s and relatedModel=%o.%s already exists", this, e, r, s, this.reverseRelation.key), !1;
}
return !0;
}
return o && console.warn("Relation=%o; relatedModel does not inherit from Backbone.RelationalModel (%o)", this, s), !1;
}
return o && console.warn("Relation=%o; model does not inherit from Backbone.RelationalModel (%o)", this, e), !1;
},
setRelated: function(e, n) {
this.related = e, this.instance.acquire(), this.instance.set(this.key, e, t.defaults(n || {}, {
silent: !0
})), this.instance.release();
},
_isReverseRelation: function(e) {
return e.instance instanceof this.relatedModel && this.reverseRelation.key === e.key && this.key === e.reverseRelation.key ? !0 : !1;
},
getReverseRelations: function(e) {
var n = [], r = t.isUndefined(e) ? this.related && (this.related.models || [ this.related ]) : [ e ];
return t.each(r, function(e) {
t.each(e.getRelations(), function(e) {
this._isReverseRelation(e) && n.push(e);
}, this);
}, this), n;
},
sanitizeOptions: function(e) {
return e = e ? t.clone(e) : {}, e.silent && (e.silentChange = !0, delete e.silent), e;
},
unsanitizeOptions: function(e) {
return e = e ? t.clone(e) : {}, e.silentChange && (e.silent = !0, delete e.silentChange), e;
},
destroy: function() {
n.Relational.store.getCollection(this.instance).unbind("relational:remove", this._modelRemovedFromCollection), n.Relational.store.getCollection(this.relatedModel).unbind("relational:add", this._relatedModelAdded).unbind("relational:remove", this._relatedModelRemoved), t.each(this.getReverseRelations(), function(e) {
e.removeRelated(this.instance);
}, this);
}
}), n.HasOne = n.Relation.extend({
options: {
reverseRelation: {
type: "HasMany"
}
},
initialize: function() {
t.bindAll(this, "onChange"), this.instance.bind("relational:change:" + this.key, this.onChange);
var e = this.findRelated({
silent: !0
});
this.setRelated(e), t.each(this.getReverseRelations(), function(e) {
e.addRelated(this.instance);
}, this);
},
findRelated: function(e) {
var t = this.keyContents, n = null;
return t instanceof this.relatedModel ? n = t : t && (n = this.relatedModel.findOrCreate(t, {
create: this.options.createModels
})), n;
},
onChange: function(e, r, i) {
if (this.isLocked()) return;
this.acquire(), i = this.sanitizeOptions(i);
var s = t.isUndefined(i._related), o = s ? this.related : i._related;
if (s) {
this.keyContents = r;
if (r instanceof this.relatedModel) this.related = r; else if (r) {
var u = this.findRelated(i);
this.setRelated(u);
} else this.setRelated(null);
}
o && this.related !== o && t.each(this.getReverseRelations(o), function(e) {
e.removeRelated(this.instance, i);
}, this), t.each(this.getReverseRelations(), function(e) {
e.addRelated(this.instance, i);
}, this);
if (!i.silentChange && this.related !== o) {
var a = this;
n.Relational.eventQueue.add(function() {
a.instance.trigger("update:" + a.key, a.instance, a.related, i);
});
}
this.release();
},
tryAddRelated: function(e, t) {
if (this.related) return;
t = this.sanitizeOptions(t);
var r = this.keyContents;
if (r) {
var i = n.Relational.store.resolveIdForItem(this.relatedModel, r);
e.id === i && this.addRelated(e, t);
}
},
addRelated: function(e, t) {
if (e !== this.related) {
var n = this.related || null;
this.setRelated(e), this.onChange(this.instance, e, {
_related: n
});
}
},
removeRelated: function(e, t) {
if (!this.related) return;
if (e === this.related) {
var n = this.related || null;
this.setRelated(null), this.onChange(this.instance, e, {
_related: n
});
}
}
}), n.HasMany = n.Relation.extend({
collectionType: null,
options: {
reverseRelation: {
type: "HasOne"
},
collectionType: n.Collection,
collectionKey: !0,
collectionOptions: {}
},
initialize: function() {
t.bindAll(this, "onChange", "handleAddition", "handleRemoval", "handleReset"), this.instance.bind("relational:change:" + this.key, this.onChange), this.collectionType = this.options.collectionType, t.isString(this.collectionType) && (this.collectionType = n.Relational.store.getObjectByName(this.collectionType));
if (!this.collectionType.prototype instanceof n.Collection) throw new Error("collectionType must inherit from Backbone.Collection");
this.keyContents instanceof n.Collection ? this.setRelated(this._prepareCollection(this.keyContents)) : this.setRelated(this._prepareCollection()), this.findRelated({
silent: !0
});
},
_getCollectionOptions: function() {
return t.isFunction(this.options.collectionOptions) ? this.options.collectionOptions(this.instance) : this.options.collectionOptions;
},
_prepareCollection: function(e) {
this.related && this.related.unbind("relational:add", this.handleAddition).unbind("relational:remove", this.handleRemoval).unbind("relational:reset", this.handleReset);
if (!e || !(e instanceof n.Collection)) e = new this.collectionType([], this._getCollectionOptions());
e.model = this.relatedModel;
if (this.options.collectionKey) {
var t = this.options.collectionKey === !0 ? this.options.reverseRelation.key : this.options.collectionKey;
e[t] && e[t] !== this.instance ? n.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; collectionKey=%s already exists on collection=%o", this, t, this.options.collectionKey) : t && (e[t] = this.instance);
}
return e.bind("relational:add", this.handleAddition).bind("relational:remove", this.handleRemoval).bind("relational:reset", this.handleReset), e;
},
findRelated: function(e) {
if (this.keyContents) {
var r = [];
this.keyContents instanceof n.Collection ? r = this.keyContents.models : (this.keyContents = t.isArray(this.keyContents) ? this.keyContents : [ this.keyContents ], t.each(this.keyContents, function(e) {
var t = null;
e instanceof this.relatedModel ? t = e : t = this.relatedModel.findOrCreate(e, {
create: this.options.createModels
}), t && !this.related.getByCid(t) && !this.related.get(t) && r.push(t);
}, this)), r.length && (e = this.unsanitizeOptions(e), this.related.add(r, e));
}
},
onChange: function(e, r, i) {
i = this.sanitizeOptions(i), this.keyContents = r, t.each(this.getReverseRelations(), function(e) {
e.removeRelated(this.instance, i);
}, this);
if (r instanceof n.Collection) this._prepareCollection(r), this.related = r; else {
var s;
this.related instanceof n.Collection ? (s = this.related, s.remove(s.models)) : s = this._prepareCollection(), this.setRelated(s), this.findRelated(i);
}
t.each(this.getReverseRelations(), function(e) {
e.addRelated(this.instance, i);
}, this);
var o = this;
n.Relational.eventQueue.add(function() {
!i.silentChange && o.instance.trigger("update:" + o.key, o.instance, o.related, i);
});
},
tryAddRelated: function(e, r) {
r = this.sanitizeOptions(r);
if (!this.related.getByCid(e) && !this.related.get(e)) {
var i = t.any(this.keyContents, function(t) {
var r = n.Relational.store.resolveIdForItem(this.relatedModel, t);
return r && r === e.id;
}, this);
i && this.related.add(e, r);
}
},
handleAddition: function(e, r, i) {
if (!(e instanceof n.Model)) return;
i = this.sanitizeOptions(i), t.each(this.getReverseRelations(e), function(e) {
e.addRelated(this.instance, i);
}, this);
var s = this;
n.Relational.eventQueue.add(function() {
!i.silentChange && s.instance.trigger("add:" + s.key, e, s.related, i);
});
},
handleRemoval: function(e, r, i) {
if (!(e instanceof n.Model)) return;
i = this.sanitizeOptions(i), t.each(this.getReverseRelations(e), function(e) {
e.removeRelated(this.instance, i);
}, this);
var s = this;
n.Relational.eventQueue.add(function() {
!i.silentChange && s.instance.trigger("remove:" + s.key, e, s.related, i);
});
},
handleReset: function(e, t) {
t = this.sanitizeOptions(t);
var r = this;
n.Relational.eventQueue.add(function() {
!t.silentChange && r.instance.trigger("reset:" + r.key, r.related, t);
});
},
addRelated: function(e, t) {
var n = this;
t = this.unsanitizeOptions(t), e.queue(function() {
n.related && !n.related.getByCid(e) && !n.related.get(e) && n.related.add(e, t);
});
},
removeRelated: function(e, t) {
t = this.unsanitizeOptions(t), (this.related.getByCid(e) || this.related.get(e)) && this.related.remove(e, t);
}
}), n.RelationalModel = n.Model.extend({
relations: null,
_relations: null,
_isInitialized: !1,
_deferProcessing: !1,
_queue: null,
subModelTypeAttribute: "type",
subModelTypes: null,
constructor: function(e, r) {
var i = this;
if (r && r.collection) {
this._deferProcessing = !0;
var s = function(e) {
e === i && (i._deferProcessing = !1, i.processQueue(), r.collection.unbind("relational:add", s));
};
r.collection.bind("relational:add", s), t.defer(function() {
s(i);
});
}
this._queue = new n.BlockingQueue, this._queue.block(), n.Relational.eventQueue.block(), n.Model.apply(this, arguments), n.Relational.eventQueue.unblock();
},
trigger: function(e) {
if (e.length > 5 && "change" === e.substr(0, 6)) {
var t = this, r = arguments;
n.Relational.eventQueue.add(function() {
n.Model.prototype.trigger.apply(t, r);
});
} else n.Model.prototype.trigger.apply(this, arguments);
return this;
},
initializeRelations: function() {
this.acquire(), this._relations = [], t.each(this.relations, function(e) {
var r = t.isString(e.type) ? n[e.type] || n.Relational.store.getObjectByName(e.type) : e.type;
r && r.prototype instanceof n.Relation ? new r(this, e) : n.Relational.showWarnings && typeof console != "undefined" && console.warn("Relation=%o; missing or invalid type!", e);
}, this), this._isInitialized = !0, this.release(), this.processQueue();
},
updateRelations: function(e) {
this._isInitialized && !this.isLocked() && t.each(this._relations, function(t) {
var n = this.attributes[t.keySource] || this.attributes[t.key];
t.related !== n && this.trigger("relational:change:" + t.key, this, n, e || {});
}, this);
},
queue: function(e) {
this._queue.add(e);
},
processQueue: function() {
this._isInitialized && !this._deferProcessing && this._queue.isBlocked() && this._queue.unblock();
},
getRelation: function(e) {
return t.detect(this._relations, function(t) {
if (t.key === e) return !0;
}, this);
},
getRelations: function() {
return this._relations;
},
fetchRelated: function(e, r, i) {
r || (r = {});
var s, o = [], u = this.getRelation(e), a = u && u.keyContents, f = a && t.select(t.isArray(a) ? a : [ a ], function(e) {
var t = n.Relational.store.resolveIdForItem(u.relatedModel, e);
return t && (i || !n.Relational.store.find(u.relatedModel, t));
}, this);
if (f && f.length) {
var l = t.map(f, function(e) {
var n;
if (t.isObject(e)) n = u.relatedModel.build(e); else {
var r = {};
r[u.relatedModel.prototype.idAttribute] = e, n = u.relatedModel.build(r);
}
return n;
}, this);
u.related instanceof n.Collection && t.isFunction(u.related.url) && (s = u.related.url(l));
if (s && s !== u.related.url()) {
var c = t.defaults({
error: function() {
var e = arguments;
t.each(l, function(t) {
t.trigger("destroy", t, t.collection, r), r.error && r.error.apply(t, e);
});
},
url: s
}, r, {
add: !0
});
o = [ u.related.fetch(c) ];
} else o = t.map(l, function(e) {
var n = t.defaults({
error: function() {
e.trigger("destroy", e, e.collection, r), r.error && r.error.apply(e, arguments);
}
}, r);
return e.fetch(n);
}, this);
}
return o;
},
set: function(e, r, i) {
n.Relational.eventQueue.block();
var s;
t.isObject(e) || e == null ? (s = e, i = r) : (s = {}, s[e] = r);
var o = n.Model.prototype.set.apply(this, arguments);
return !this._isInitialized && !this.isLocked() ? (this.constructor.initializeModelHierarchy(), n.Relational.store.register(this), this.initializeRelations()) : s && this.idAttribute in s && n.Relational.store.update(this), s && this.updateRelations(i), n.Relational.eventQueue.unblock(), o;
},
unset: function(e, t) {
n.Relational.eventQueue.block();
var r = n.Model.prototype.unset.apply(this, arguments);
return this.updateRelations(t), n.Relational.eventQueue.unblock(), r;
},
clear: function(e) {
n.Relational.eventQueue.block();
var t = n.Model.prototype.clear.apply(this, arguments);
return this.updateRelations(e), n.Relational.eventQueue.unblock(), t;
},
change: function(e) {
var t = this, r = arguments;
n.Relational.eventQueue.add(function() {
n.Model.prototype.change.apply(t, r);
});
},
clone: function() {
var e = t.clone(this.attributes);
return t.isUndefined(e[this.idAttribute]) || (e[this.idAttribute] = null), t.each(this.getRelations(), function(t) {
delete e[t.key];
}), new this.constructor(e);
},
toJSON: function() {
if (this.isLocked()) return this.id;
this.acquire();
var e = n.Model.prototype.toJSON.call(this);
return this.constructor._superModel && !(this.constructor._subModelTypeAttribute in e) && (e[this.constructor._subModelTypeAttribute] = this.constructor._subModelTypeValue), t.each(this._relations, function(r) {
var i = e[r.key];
if (r.options.includeInJSON === !0) i && t.isFunction(i.toJSON) ? e[r.keyDestination] = i.toJSON() : e[r.keyDestination] = null; else if (t.isString(r.options.includeInJSON)) i instanceof n.Collection ? e[r.keyDestination] = i.pluck(r.options.includeInJSON) : i instanceof n.Model ? e[r.keyDestination] = i.get(r.options.includeInJSON) : e[r.keyDestination] = null; else if (t.isArray(r.options.includeInJSON)) if (i instanceof n.Collection) {
var s = [];
i.each(function(e) {
var n = {};
t.each(r.options.includeInJSON, function(t) {
n[t] = e.get(t);
}), s.push(n);
}), e[r.keyDestination] = s;
} else if (i instanceof n.Model) {
var s = {};
t.each(r.options.includeInJSON, function(e) {
s[e] = i.get(e);
}), e[r.keyDestination] = s;
} else e[r.keyDestination] = null; else delete e[r.key];
r.keyDestination !== r.key && delete e[r.key];
}), this.release(), e;
}
}, {
setup: function(e) {
this.prototype.relations = (this.prototype.relations || []).slice(0), this._subModels = {}, this._superModel = null, this.prototype.hasOwnProperty("subModelTypes") ? n.Relational.store.addSubModels(this.prototype.subModelTypes, this) : this.prototype.subModelTypes = null, t.each(this.prototype.relations, function(e) {
e.model || (e.model = this);
if (e.reverseRelation && e.model === this) {
var r = !0;
if (t.isString(e.relatedModel)) {
var i = n.Relational.store.getObjectByName(e.relatedModel);
r = i && i.prototype instanceof n.RelationalModel;
}
var s = t.isString(e.type) ? n[e.type] || n.Relational.store.getObjectByName(e.type) : e.type;
r && s && s.prototype instanceof n.Relation && new s(null, e);
}
}, this);
},
build: function(e, t) {
var n = this;
this.initializeModelHierarchy();
if (this._subModels && this.prototype.subModelTypeAttribute in e) {
var r = e[this.prototype.subModelTypeAttribute], i = this._subModels[r];
i && (n = i);
}
return new n(e, t);
},
initializeModelHierarchy: function() {
if (t.isUndefined(this._superModel) || t.isNull(this._superModel)) {
n.Relational.store.setupSuperModel(this);
if (this._superModel) {
if (this._superModel.prototype.relations) {
var e = t.any(this.prototype.relations, function(e) {
return e.model && e.model !== this;
}, this);
e || (this.prototype.relations = this._superModel.prototype.relations.concat(this.prototype.relations));
}
} else this._superModel = !1;
}
this.prototype.subModelTypes && t.keys(this.prototype.subModelTypes).length !== t.keys(this._subModels).length && t.each(this.prototype.subModelTypes, function(e) {
var t = n.Relational.store.getObjectByName(e);
t && t.initializeModelHierarchy();
});
},
findOrCreate: function(e, r) {
var i = n.Relational.store.find(this, e);
if (t.isObject(e)) if (i) i.set(e, r); else if (!r || r && r.create !== !1) i = this.build(e, r);
return i;
}
}), t.extend(n.RelationalModel.prototype, n.Semaphore), n.Collection.prototype.__prepareModel = n.Collection.prototype._prepareModel, n.Collection.prototype._prepareModel = function(e, t) {
t || (t = {});
if (e instanceof n.Model) e.collection || (e.collection = this); else {
var r = e;
t.collection = this, typeof this.model.build != "undefined" ? e = this.model.build(r, t) : e = new this.model(r, t), e._validate(e.attributes, t) || (e = !1);
}
return e;
};
var i = n.Collection.prototype.__add = n.Collection.prototype.add;
n.Collection.prototype.add = function(e, r) {
r || (r = {}), t.isArray(e) || (e = [ e ]);
var s = [];
return t.each(e, function(e) {
if (!(e instanceof n.Model)) {
var t = n.Relational.store.find(this.model, e[this.model.prototype.idAttribute]);
t ? (t.set(t.parse ? t.parse(e) : e, r), e = t) : e = n.Collection.prototype._prepareModel.call(this, e, r);
}
e instanceof n.Model && !this.get(e) && !this.getByCid(e) && s.push(e);
}, this), s.length && (i.call(this, s, r), t.each(s, function(e) {
this.trigger("relational:add", e, this, r);
}, this)), this;
};
var s = n.Collection.prototype.__remove = n.Collection.prototype.remove;
n.Collection.prototype.remove = function(e, r) {
return r || (r = {}), t.isArray(e) ? e = e.slice(0) : e = [ e ], t.each(e, function(e) {
e = this.getByCid(e) || this.get(e), e instanceof n.Model && (s.call(this, e, r), this.trigger("relational:remove", e, this, r));
}, this), this;
};
var o = n.Collection.prototype.__reset = n.Collection.prototype.reset;
n.Collection.prototype.reset = function(e, t) {
return o.call(this, e, t), this.trigger("relational:reset", this, t), this;
};
var u = n.Collection.prototype.__sort = n.Collection.prototype.sort;
n.Collection.prototype.sort = function(e) {
return u.call(this, e), this.trigger("relational:reset", this, e), this;
};
var a = n.Collection.prototype.__trigger = n.Collection.prototype.trigger;
n.Collection.prototype.trigger = function(e) {
if (e === "add" || e === "remove" || e === "reset") {
var r = this, i = arguments;
e === "add" && (i = t.toArray(i), t.isObject(i[3]) && (i[3] = t.clone(i[3]))), n.Relational.eventQueue.add(function() {
a.apply(r, i);
});
} else a.apply(this, arguments);
return this;
}, n.RelationalModel.extend = function(e, t) {
var r = n.Model.extend.apply(this, arguments);
return r.setup(this), r;
};
})();

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.FittableLayout.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.FittableLayout.getComputedStyleValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
},
statics: {
_ieCssToPixelValue: function(e, t) {
var n = t, r = e.style, i = r.left, s = e.runtimeStyle && e.runtimeStyle.left;
return s && (e.runtimeStyle.left = e.currentStyle.left), r.left = n, n = r.pixelLeft, r.left = i, s && (r.runtimeStyle.left = s), n;
},
_pxMatch: /px/i,
getComputedStyleValue: function(e, t, n, r) {
var i = r || enyo.dom.getComputedStyle(e);
if (i) return parseInt(i.getPropertyValue(t + "-" + n));
if (e && e.currentStyle) {
var s = e.currentStyle[t + enyo.cap(n)];
return s.match(this._pxMatch) || (s = this._ieCssToPixelValue(e, s)), parseInt(s);
}
return 0;
},
calcBoxExtents: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return {
top: this.getComputedStyleValue(e, t, "top", n),
right: this.getComputedStyleValue(e, t, "right", n),
bottom: this.getComputedStyleValue(e, t, "bottom", n),
left: this.getComputedStyleValue(e, t, "left", n)
};
},
calcPaddingExtents: function(e) {
return this.calcBoxExtents(e, "padding");
},
calcMarginExtents: function(e) {
return this.calcBoxExtents(e, "margin");
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
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
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
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 == 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 == 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
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
select: function(e, t) {
return this.getSelection().select(e, t);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
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
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scrollHandler: function(e) {
this.completingPull && this.pully.setShowing(!1);
var t = this.getStrategy().$.scrollMath, n = t.y;
t.isInOverScroll() && n > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + n + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), n > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && n < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel()));
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
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
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
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
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
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
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
calcArrangementDifference: function(e, t, n, r) {},
_arrange: function(e) {
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var i = t.left, s = t.top, i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r;
enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n == 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex, t = this.container.toIndex;
this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
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
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.FittableLayout.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var r;
for (var i = 0, s = 0, o, u; u = e[i]; i++) o = enyo.FittableLayout.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (r = u);
if (r) {
var a = n.width - s;
r.width = a >= 0 ? a : r.width;
}
for (var i = 0, f = t.left, o, u; u = e[i]; i++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n = this.container.getPanels(), r = this.container.clamp(t), i = this.containerBounds.width;
for (var s = r, o = 0, u; u = n[s]; s++) {
o += u.width + u.marginWidth;
if (o > i) break;
}
var a = i - o, f = 0;
if (a > 0) {
var l = r;
for (var s = r - 1, c = 0, u; u = n[s]; s--) {
c += u.width + u.marginWidth;
if (a - c <= 0) {
f = a - c, r = s;
break;
}
}
}
for (var s = 0, h = this.containerPadding.left + f, p, u; u = n[s]; s++) p = u.width + u.marginWidth, s < r ? this.arrangeControl(u, {
left: -p
}) : (this.arrangeControl(u, {
left: Math.floor(h)
}), h += p);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
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
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o; o = n[r]; r++) this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
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
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
arrange: function(e, t) {
var n = Math.floor(this.container.getPanels().length / 2), r = this.getOrderedControls(Math.floor(t) - n), i = this.containerBounds[this.axisSize] - this.margin - this.margin, s = this.margin - i * n, o = (r.length - 1) / 2;
for (var u = 0, a, f, l; a = r[u]; u++) f = {}, f[this.axisPosition] = s, f.opacity = u === 0 || u == r.length - 1 ? 0 : 1, this.arrangeControl(a, f), s += i;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
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
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
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
removeControl: function(e) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
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
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels();
return e[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
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
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
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
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
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
downHandler: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(e, t) {
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
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
var e = this.orient == "v" ? "height" : "width", t = this.hasNode();
t && (t.style[e] = this.$.client.domStyles[e] = null);
}
this.container && this.container.resized();
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
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
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
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
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
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
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
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
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
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
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
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
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
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var t = this.node.getBoundingClientRect(), n = t.height === undefined ? t.bottom - t.top : t.height, r = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, i = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = t.top + n > r && r - t.bottom < t.top - n, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var s = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: s.top - n + (this.showOnTop ? s.height : 0),
bottom: "auto"
}) : t.top < s.top && s.top + (e ? s.height : 0) + n < r && this.applyPosition({
top: s.top + (this.showOnTop ? 0 : s.height),
bottom: "auto"
});
}
t.right > i && (this.floating ? this.applyPosition({
left: s.left - (t.left + t.width - i)
}) : this.applyPosition({
left: -(t.right - i)
})), t.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -t.left
}) : this.applyPosition({
right: t.left
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
tap: function(e) {
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
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.setContent(t.content);
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
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
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
var e = this.$.client.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.client.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.client.renderRow(e)), this.item.addClass("selected"), this.$.client.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.client.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
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
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
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
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
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
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
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
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
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
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
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
hold: function(e, t) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
statics: {
addFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.setClassAttribute(e.getClassAttribute()) : e.addClass(t);
}), e.removeClass(t);
}
},
removeFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.removeClass(t) : e.setClassAttribute(e.getClassAttribute());
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
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r = undefined, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex != undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
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
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = t);
}
}
});

// lib/globalize.js

(function(e, t) {
var n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N;
n = function(e) {
return new n.prototype.init(e);
}, typeof require != "undefined" && typeof exports != "undefined" && typeof module != "undefined" ? module.exports = n : e.Globalize = n, n.cultures = {}, n.prototype = {
constructor: n,
init: function(e) {
return this.cultures = n.cultures, this.cultureSelector = e, this;
}
}, n.prototype.init.prototype = n.prototype, n.cultures["default"] = {
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
}, n.cultures["default"].calendar = n.cultures["default"].calendars.standard, n.cultures.en = n.cultures["default"], n.cultureSelector = "en", r = /^0x[a-f0-9]+$/i, i = /^[+\-]?infinity$/i, s = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/, o = /^\s+|\s+$/g, u = function(e, t) {
if (e.indexOf) return e.indexOf(t);
for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
return -1;
}, a = function(e, t) {
return e.substr(e.length - t.length) === t;
}, f = function() {
var e, n, r, i, s, o, u = arguments[0] || {}, a = 1, p = arguments.length, d = !1;
typeof u == "boolean" && (d = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !c(u) && (u = {});
for (; a < p; a++) if ((e = arguments[a]) != null) for (n in e) {
r = u[n], i = e[n];
if (u === i) continue;
d && i && (h(i) || (s = l(i))) ? (s ? (s = !1, o = r && l(r) ? r : []) : o = r && h(r) ? r : {}, u[n] = f(d, o, i)) : i !== t && (u[n] = i);
}
return u;
}, l = Array.isArray || function(e) {
return Object.prototype.toString.call(e) === "[object Array]";
}, c = function(e) {
return Object.prototype.toString.call(e) === "[object Function]";
}, h = function(e) {
return Object.prototype.toString.call(e) === "[object Object]";
}, p = function(e, t) {
return e.indexOf(t) === 0;
}, d = function(e) {
return (e + "").replace(o, "");
}, v = function(e) {
return isNaN(e) ? NaN : Math[e < 0 ? "ceil" : "floor"](e);
}, m = function(e, t, n) {
var r;
for (r = e.length; r < t; r += 1) e = n ? "0" + e : e + "0";
return e;
}, g = function(e, t) {
var n = 0, r = !1;
for (var i = 0, s = e.length; i < s; i++) {
var o = e.charAt(i);
switch (o) {
case "'":
r ? t.push("'") : n++, r = !1;
break;
case "\\":
r && t.push("\\"), r = !r;
break;
default:
t.push(o), r = !1;
}
}
return n;
}, y = function(e, t) {
t = t || "F";
var n, r = e.patterns, i = t.length;
if (i === 1) {
n = r[t];
if (!n) throw "Invalid date format string '" + t + "'.";
t = n;
} else i === 2 && t.charAt(0) === "%" && (t = t.charAt(1));
return t;
}, b = function(e, t, n) {
function T(e, t) {
var n, r = e + "";
return t > 1 && r.length < t ? (n = c[t - 2] + r, n.substr(n.length - t, t)) : (n = r, n);
}
function N() {
return h || p ? h : (h = d.test(t), p = !0, h);
}
function C(e, t) {
if (w) return w[t];
switch (t) {
case 0:
return e.getFullYear();
case 1:
return e.getMonth();
case 2:
return e.getDate();
default:
throw "Invalid part value " + t;
}
}
var r = n.calendar, i = r.convert, s;
if (!t || !t.length || t === "i") {
if (n && n.name.length) if (i) s = b(e, r.patterns.F, n); else {
var o = new Date(e.getTime()), u = S(e, r.eras);
o.setFullYear(x(e, r, u)), s = o.toLocaleString();
} else s = e.toString();
return s;
}
var a = r.eras, f = t === "s";
t = y(r, t), s = [];
var l, c = [ "0", "00", "000" ], h, p, d = /([^d]|^)(d|dd)([^d]|$)/g, v = 0, m = E(), w;
!f && i && (w = i.fromGregorian(e));
for (;;) {
var k = m.lastIndex, L = m.exec(t), A = t.slice(k, L ? L.index : t.length);
v += g(A, s);
if (!L) break;
if (v % 2) {
s.push(L[0]);
continue;
}
var O = L[0], M = O.length;
switch (O) {
case "ddd":
case "dddd":
var _ = M === 3 ? r.days.namesAbbr : r.days.names;
s.push(_[e.getDay()]);
break;
case "d":
case "dd":
h = !0, s.push(T(C(e, 2), M));
break;
case "MMM":
case "MMMM":
var D = C(e, 1);
s.push(r.monthsGenitive && N() ? r.monthsGenitive[M === 3 ? "namesAbbr" : "names"][D] : r.months[M === 3 ? "namesAbbr" : "names"][D]);
break;
case "M":
case "MM":
s.push(T(C(e, 1) + 1, M));
break;
case "y":
case "yy":
case "yyyy":
D = w ? w[0] : x(e, r, S(e, a), f), M < 4 && (D %= 100), s.push(T(D, M));
break;
case "h":
case "hh":
l = e.getHours() % 12, l === 0 && (l = 12), s.push(T(l, M));
break;
case "H":
case "HH":
s.push(T(e.getHours(), M));
break;
case "m":
case "mm":
s.push(T(e.getMinutes(), M));
break;
case "s":
case "ss":
s.push(T(e.getSeconds(), M));
break;
case "t":
case "tt":
D = e.getHours() < 12 ? r.AM ? r.AM[0] : " " : r.PM ? r.PM[0] : " ", s.push(M === 1 ? D.charAt(0) : D);
break;
case "f":
case "ff":
case "fff":
s.push(T(e.getMilliseconds(), 3).substr(0, M));
break;
case "z":
case "zz":
l = e.getTimezoneOffset() / 60, s.push((l <= 0 ? "+" : "-") + T(Math.floor(Math.abs(l)), M));
break;
case "zzz":
l = e.getTimezoneOffset() / 60, s.push((l <= 0 ? "+" : "-") + T(Math.floor(Math.abs(l)), 2) + ":" + T(Math.abs(e.getTimezoneOffset() % 60), 2));
break;
case "g":
case "gg":
r.eras && s.push(r.eras[S(e, a)].name);
break;
case "/":
s.push(r["/"]);
break;
default:
throw "Invalid date format pattern '" + O + "'.";
}
}
return s.join("");
}, function() {
var e;
e = function(e, t, n) {
var r = n.groupSizes, i = r[0], s = 1, o = Math.pow(10, t), u = Math.round(e * o) / o;
isFinite(u) || (u = e), e = u;
var a = e + "", f = "", l = a.split(/e/i), c = l.length > 1 ? parseInt(l[1], 10) : 0;
a = l[0], l = a.split("."), a = l[0], f = l.length > 1 ? l[1] : "";
var h;
c > 0 ? (f = m(f, c, !1), a += f.slice(0, c), f = f.substr(c)) : c < 0 && (c = -c, a = m(a, c + 1, !0), f = a.slice(-c, a.length) + f, a = a.slice(0, -c)), t > 0 ? f = n["."] + (f.length > t ? f.slice(0, t) : m(f, t)) : f = "";
var p = a.length - 1, d = n[","], v = "";
while (p >= 0) {
if (i === 0 || i > p) return a.slice(0, p + 1) + (v.length ? d + v + f : f);
v = a.slice(p - i + 1, p + 1) + (v.length ? d + v : ""), p -= i, s < r.length && (i = r[s], s++);
}
return a.slice(0, p + 1) + d + v + f;
}, w = function(t, n, r) {
if (!isFinite(t)) return t === Infinity ? r.numberFormat.positiveInfinity : t === -Infinity ? r.numberFormat.negativeInfinity : r.numberFormat.NaN;
if (!n || n === "i") return r.name.length ? t.toLocaleString() : t.toString();
n = n || "D";
var i = r.numberFormat, s = Math.abs(t), o = -1, u;
n.length > 1 && (o = parseInt(n.slice(1), 10));
var a = n.charAt(0).toUpperCase(), f;
switch (a) {
case "D":
u = "n", s = v(s), o !== -1 && (s = m("" + s, o, !0)), t < 0 && (s = "-" + s);
break;
case "N":
f = i;
case "C":
f = f || i.currency;
case "P":
f = f || i.percent, u = t < 0 ? f.pattern[0] : f.pattern[1] || "n", o === -1 && (o = f.decimals), s = e(s * (a === "P" ? 100 : 1), o, f);
break;
default:
throw "Bad number format specifier: " + a;
}
var l = /n|\$|-|%/g, c = "";
for (;;) {
var h = l.lastIndex, p = l.exec(u);
c += u.slice(h, p ? p.index : u.length);
if (!p) break;
switch (p[0]) {
case "n":
c += s;
break;
case "$":
c += i.currency.symbol;
break;
case "-":
/[1-9]/.test(s) && (c += i["-"]);
break;
case "%":
c += i.percent.symbol;
}
}
return c;
};
}(), E = function() {
return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}, S = function(e, t) {
if (!t) return 0;
var n, r = e.getTime();
for (var i = 0, s = t.length; i < s; i++) {
n = t[i].start;
if (n === null || r >= n) return i;
}
return 0;
}, x = function(e, t, n, r) {
var i = e.getFullYear();
return !r && t.eras && (i -= t.eras[n].offset), i;
}, function() {
var e, t, n, r, i, s, o;
e = function(e, t) {
if (t < 100) {
var n = new Date, r = S(n), i = x(n, e, r), s = e.twoDigitYearMax;
s = typeof s == "string" ? (new Date).getFullYear() % 100 + parseInt(s, 10) : s, t += i - i % 100, t > s && (t -= 100);
}
return t;
}, t = function(e, t, n) {
var r, i = e.days, a = e._upperDays;
return a || (e._upperDays = a = [ o(i.names), o(i.namesAbbr), o(i.namesShort) ]), t = s(t), n ? (r = u(a[1], t), r === -1 && (r = u(a[2], t))) : r = u(a[0], t), r;
}, n = function(e, t, n) {
var r = e.months, i = e.monthsGenitive || e.months, a = e._upperMonths, f = e._upperMonthsGen;
a || (e._upperMonths = a = [ o(r.names), o(r.namesAbbr) ], e._upperMonthsGen = f = [ o(i.names), o(i.namesAbbr) ]), t = s(t);
var l = u(n ? a[1] : a[0], t);
return l < 0 && (l = u(n ? f[1] : f[0], t)), l;
}, r = function(e, t) {
var n = e._parseRegExp;
if (!n) e._parseRegExp = n = {}; else {
var r = n[t];
if (r) return r;
}
var i = y(e, t).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), s = [ "^" ], o = [], u = 0, a = 0, f = E(), l;
while ((l = f.exec(i)) !== null) {
var c = i.slice(u, l.index);
u = f.lastIndex, a += g(c, s);
if (a % 2) {
s.push(l[0]);
continue;
}
var h = l[0], p = h.length, d;
switch (h) {
case "dddd":
case "ddd":
case "MMMM":
case "MMM":
case "gg":
case "g":
d = "(\\D+)";
break;
case "tt":
case "t":
d = "(\\D*)";
break;
case "yyyy":
case "fff":
case "ff":
case "f":
d = "(\\d{" + p + "})";
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
d = "(\\d\\d?)";
break;
case "zzz":
d = "([+-]?\\d\\d?:\\d{2})";
break;
case "zz":
case "z":
d = "([+-]?\\d\\d?)";
break;
case "/":
d = "(\\/)";
break;
default:
throw "Invalid date format pattern '" + h + "'.";
}
d && s.push(d), o.push(l[0]);
}
g(i.slice(u), s), s.push("$");
var v = s.join("").replace(/\s+/g, "\\s+"), m = {
regExp: v,
groups: o
};
return n[t] = m;
}, i = function(e, t, n) {
return e < t || e > n;
}, s = function(e) {
return e.split("\u00a0").join(" ").toUpperCase();
}, o = function(e) {
var t = [];
for (var n = 0, r = e.length; n < r; n++) t[n] = s(e[n]);
return t;
}, T = function(s, o, u) {
s = d(s);
var a = u.calendar, f = r(a, o), l = (new RegExp(f.regExp)).exec(s);
if (l === null) return null;
var c = f.groups, h = null, v = null, m = null, g = null, y = null, b = 0, w, E = 0, S = 0, x = 0, T = null, N = !1;
for (var C = 0, k = c.length; C < k; C++) {
var L = l[C + 1];
if (L) {
var A = c[C], O = A.length, M = parseInt(L, 10);
switch (A) {
case "dd":
case "d":
g = M;
if (i(g, 1, 31)) return null;
break;
case "MMM":
case "MMMM":
m = n(a, L, O === 3);
if (i(m, 0, 11)) return null;
break;
case "M":
case "MM":
m = M - 1;
if (i(m, 0, 11)) return null;
break;
case "y":
case "yy":
case "yyyy":
v = O < 4 ? e(a, M) : M;
if (i(v, 0, 9999)) return null;
break;
case "h":
case "hh":
b = M, b === 12 && (b = 0);
if (i(b, 0, 11)) return null;
break;
case "H":
case "HH":
b = M;
if (i(b, 0, 23)) return null;
break;
case "m":
case "mm":
E = M;
if (i(E, 0, 59)) return null;
break;
case "s":
case "ss":
S = M;
if (i(S, 0, 59)) return null;
break;
case "tt":
case "t":
N = a.PM && (L === a.PM[0] || L === a.PM[1] || L === a.PM[2]);
if (!N && (!a.AM || L !== a.AM[0] && L !== a.AM[1] && L !== a.AM[2])) return null;
break;
case "f":
case "ff":
case "fff":
x = M * Math.pow(10, 3 - O);
if (i(x, 0, 999)) return null;
break;
case "ddd":
case "dddd":
y = t(a, L, O === 3);
if (i(y, 0, 6)) return null;
break;
case "zzz":
var _ = L.split(/:/);
if (_.length !== 2) return null;
w = parseInt(_[0], 10);
if (i(w, -12, 13)) return null;
var D = parseInt(_[1], 10);
if (i(D, 0, 59)) return null;
T = w * 60 + (p(L, "-") ? -D : D);
break;
case "z":
case "zz":
w = M;
if (i(w, -12, 13)) return null;
T = w * 60;
break;
case "g":
case "gg":
var P = L;
if (!P || !a.eras) return null;
P = d(P.toLowerCase());
for (var H = 0, B = a.eras.length; H < B; H++) if (P === a.eras[H].name.toLowerCase()) {
h = H;
break;
}
if (h === null) return null;
}
}
}
var j = new Date, F, I = a.convert;
F = I ? I.fromGregorian(j)[0] : j.getFullYear(), v === null ? v = F : a.eras && (v += a.eras[h || 0].offset), m === null && (m = 0), g === null && (g = 1);
if (I) {
j = I.toGregorian(v, m, g);
if (j === null) return null;
} else {
j.setFullYear(v, m, g);
if (j.getDate() !== g) return null;
if (y !== null && j.getDay() !== y) return null;
}
N && b < 12 && (b += 12), j.setHours(b, E, S, x);
if (T !== null) {
var q = j.getMinutes() - (T + j.getTimezoneOffset());
j.setHours(j.getHours() + parseInt(q / 60, 10), q % 60);
}
return j;
};
}(), N = function(e, t, n) {
var r = t["-"], i = t["+"], s;
switch (n) {
case "n -":
r = " " + r, i = " " + i;
case "n-":
a(e, r) ? s = [ "-", e.substr(0, e.length - r.length) ] : a(e, i) && (s = [ "+", e.substr(0, e.length - i.length) ]);
break;
case "- n":
r += " ", i += " ";
case "-n":
p(e, r) ? s = [ "-", e.substr(r.length) ] : p(e, i) && (s = [ "+", e.substr(i.length) ]);
break;
case "(n)":
p(e, "(") && a(e, ")") && (s = [ "-", e.substr(1, e.length - 2) ]);
}
return s || [ "", e ];
}, n.prototype.findClosestCulture = function(e) {
return n.findClosestCulture.call(this, e);
}, n.prototype.format = function(e, t, r) {
return n.format.call(this, e, t, r);
}, n.prototype.localize = function(e, t) {
return n.localize.call(this, e, t);
}, n.prototype.parseInt = function(e, t, r) {
return n.parseInt.call(this, e, t, r);
}, n.prototype.parseFloat = function(e, t, r) {
return n.parseFloat.call(this, e, t, r);
}, n.prototype.culture = function(e) {
return n.culture.call(this, e);
}, n.addCultureInfo = function(e, t, n) {
var r = {}, i = !1;
typeof e != "string" ? (n = e, e = this.culture().name, r = this.cultures[e]) : typeof t != "string" ? (n = t, i = this.cultures[e] == null, r = this.cultures[e] || this.cultures["default"]) : (i = !0, r = this.cultures[t]), this.cultures[e] = f(!0, {}, r, n), i && (this.cultures[e].calendar = this.cultures[e].calendars.standard);
}, n.findClosestCulture = function(e) {
var t;
if (!e) return this.findClosestCulture(this.cultureSelector) || this.cultures["default"];
typeof e == "string" && (e = e.split(","));
if (l(e)) {
var n, r = this.cultures, i = e, s, o = i.length, u = [];
for (s = 0; s < o; s++) {
e = d(i[s]);
var a, f = e.split(";");
n = d(f[0]), f.length === 1 ? a = 1 : (e = d(f[1]), e.indexOf("q=") === 0 ? (e = e.substr(2), a = parseFloat(e), a = isNaN(a) ? 0 : a) : a = 1), u.push({
lang: n,
pri: a
});
}
u.sort(function(e, t) {
return e.pri < t.pri ? 1 : e.pri > t.pri ? -1 : 0;
});
for (s = 0; s < o; s++) {
n = u[s].lang, t = r[n];
if (t) return t;
}
for (s = 0; s < o; s++) {
n = u[s].lang;
do {
var c = n.lastIndexOf("-");
if (c === -1) break;
n = n.substr(0, c), t = r[n];
if (t) return t;
} while (1);
}
for (s = 0; s < o; s++) {
n = u[s].lang;
for (var h in r) {
var p = r[h];
if (p.language == n) return p;
}
}
} else if (typeof e == "object") return e;
return t || null;
}, n.format = function(e, t, n) {
var r = this.findClosestCulture(n);
return e instanceof Date ? e = b(e, t, r) : typeof e == "number" && (e = w(e, t, r)), e;
}, n.localize = function(e, t) {
return this.findClosestCulture(t).messages[e] || this.cultures["default"].messages[e];
}, n.parseDate = function(e, t, n) {
n = this.findClosestCulture(n);
var r, i, s;
if (t) {
typeof t == "string" && (t = [ t ]);
if (t.length) for (var o = 0, u = t.length; o < u; o++) {
var a = t[o];
if (a) {
r = T(e, a, n);
if (r) break;
}
}
} else {
s = n.calendar.patterns;
for (i in s) {
r = T(e, s[i], n);
if (r) break;
}
}
return r || null;
}, n.parseInt = function(e, t, r) {
return v(n.parseFloat(e, t, r));
}, n.parseFloat = function(e, t, n) {
typeof t != "number" && (n = t, t = 10);
var o = this.findClosestCulture(n), u = NaN, a = o.numberFormat;
e.indexOf(o.numberFormat.currency.symbol) > -1 && (e = e.replace(o.numberFormat.currency.symbol, ""), e = e.replace(o.numberFormat.currency["."], o.numberFormat["."])), e = d(e);
if (i.test(e)) u = parseFloat(e); else if (!t && r.test(e)) u = parseInt(e, 16); else {
var f = N(e, a, a.pattern[0]), l = f[0], c = f[1];
l === "" && a.pattern[0] !== "(n)" && (f = N(e, a, "(n)"), l = f[0], c = f[1]), l === "" && a.pattern[0] !== "-n" && (f = N(e, a, "-n"), l = f[0], c = f[1]), l = l || "+";
var h, p, v = c.indexOf("e");
v < 0 && (v = c.indexOf("E")), v < 0 ? (p = c, h = null) : (p = c.substr(0, v), h = c.substr(v + 1));
var m, g, y = a["."], b = p.indexOf(y);
b < 0 ? (m = p, g = null) : (m = p.substr(0, b), g = p.substr(b + y.length));
var w = a[","];
m = m.split(w).join("");
var E = w.replace(/\u00A0/g, " ");
w !== E && (m = m.split(E).join(""));
var S = l + m;
g !== null && (S += "." + g);
if (h !== null) {
var x = N(h, a, "-n");
S += "e" + (x[0] || "+") + x[1];
}
s.test(S) && (u = parseFloat(S));
}
return u;
}, n.culture = function(e) {
return typeof e != "undefined" && (this.cultureSelector = e), this.findClosestCulture(e) || this.cultures["default"];
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
var e = new Date(2011, 4, 1);
this.$.sunday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.monday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.tuesday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.wednesday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.thursday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.friday.setContent(dateFormat(e, this.dowFormat)), e.setDate(e.getDate() + 1), this.$.saturday.setContent(dateFormat(e, this.dowFormat));
}
var t = Math.round(10 * this.getBounds().width / 7) / 10;
this.$.sunday.applyStyle("width", t + "px"), this.$.monday.applyStyle("width", t + "px"), this.$.tuesday.applyStyle("width", t + "px"), this.$.wednesday.applyStyle("width", t + "px"), this.$.thursday.applyStyle("width", t + "px"), this.$.friday.applyStyle("width", t + "px"), this.$.saturday.applyStyle("width", t + "px"), this.valueChanged();
},
valueChanged: function() {
if (Object.prototype.toString.call(this.value) !== "[object Date]" || isNaN(this.value.getTime())) this.value = new Date;
this.viewDate.setTime(this.value.getTime()), this.renderCalendar();
},
viewDateChanged: function() {
this.renderCalendar();
},
renderCalendar: function() {
var e = Math.round(10 * this.getBounds().width / 7) / 10, t = new Date;
this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
var n = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 0), r = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
n.setDate(n.getDate() - r.getDay() + 1), n.getTime() === r.getTime() && n.setDate(n.getDate() - 7);
var i = 0, s;
while (i < 6) n.getDate() === this.value.getDate() && n.getMonth() === this.value.getMonth() && n.getFullYear() === this.value.getFullYear() ? s = "onyx-blue" : n.getDate() === t.getDate() && n.getMonth() === t.getMonth() && n.getFullYear() === t.getFullYear() ? s = "onyx-affirmative" : n.getMonth() !== r.getMonth() ? s = "onyx-dark" : s = "", this.$["row" + i + "col" + n.getDay()].applyStyle("width", e + "px"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-affirmative"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-blue"), this.$["row" + i + "col" + n.getDay()].removeClass("onyx-dark"), this.$["row" + i + "col" + n.getDay()].addClass(s), this.$["row" + i + "col" + n.getDay()].setContent(n.getDate()), this.$["row" + i + "col" + n.getDay()].ts = n.getTime(), n.setDate(n.getDate() + 1), n.getDay() === 0 && i < 6 && i++;
dateFormat ? this.$.monthLabel.setContent(dateFormat(r, this.monthFormat)) : this.$.monthLabel.setContent(this.getMonthString(r.getMonth()));
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
dateHandler: function(e, t) {
var n = new Date;
n.setTime(e.ts), this.value.setDate(n.getDate()), this.value.setMonth(n.getMonth()), this.value.setFullYear(n.getFullYear()), this.value.getMonth() != this.viewDate.getMonth() && (this.viewDate = new Date(this.value.getFullYear(), this.value.getMonth(), 1)), this.doChange(this.value), this.renderCalendar();
},
getMonthString: function(e) {
return [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ][e];
},
getDayString: function(e) {
return [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ][e];
}
});

// date_format.js

var dateFormat = function() {
var e = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, t = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, n = /[^-+\dA-Z]/g, r = function(e, t) {
e = String(e), t = t || 2;
while (e.length < t) e = "0" + e;
return e;
};
return function(i, s, o) {
var u = dateFormat;
arguments.length == 1 && Object.prototype.toString.call(i) == "[object String]" && !/\d/.test(i) && (s = i, i = undefined), i = i ? new Date(i) : new Date;
if (isNaN(i)) throw SyntaxError("invalid date");
s = String(u.masks[s] || s || u.masks["default"]), s.slice(0, 4) == "UTC:" && (s = s.slice(4), o = !0);
var a = o ? "getUTC" : "get", f = i[a + "Date"](), l = i[a + "Day"](), c = i[a + "Month"](), h = i[a + "FullYear"](), p = i[a + "Hours"](), d = i[a + "Minutes"](), v = i[a + "Seconds"](), m = i[a + "Milliseconds"](), g = o ? 0 : i.getTimezoneOffset(), y = {
d: f,
dd: r(f),
ddd: u.i18n.dayNames[l],
dddd: u.i18n.dayNames[l + 7],
m: c + 1,
mm: r(c + 1),
mmm: u.i18n.monthNames[c],
mmmm: u.i18n.monthNames[c + 12],
yy: String(h).slice(2),
yyyy: h,
h: p % 12 || 12,
hh: r(p % 12 || 12),
H: p,
HH: r(p),
M: d,
MM: r(d),
s: v,
ss: r(v),
l: r(m, 3),
L: r(m > 99 ? Math.round(m / 10) : m),
t: p < 12 ? "a" : "p",
tt: p < 12 ? "am" : "pm",
T: p < 12 ? "A" : "P",
TT: p < 12 ? "AM" : "PM",
Z: o ? "UTC" : (String(i).match(t) || [ "" ]).pop().replace(n, ""),
o: (g > 0 ? "-" : "+") + r(Math.floor(Math.abs(g) / 60) * 100 + Math.abs(g) % 60, 4),
S: [ "th", "st", "nd", "rd" ][f % 10 > 3 ? 0 : (f % 100 - f % 10 != 10) * f % 10]
};
return s.replace(e, function(e) {
return e in y ? y[e] : e.slice(1, e.length - 1);
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
}, Date.prototype.format = function(e, t) {
return dateFormat(this, e, t);
};

// socket.io.min.js

(function(e, t) {
var n = e;
n.version = "0.9.6", n.protocol = 1, n.transports = [], n.j = [], n.sockets = {}, n.connect = function(e, r) {
var i = n.util.parseUri(e), s, o;
t && t.location && (i.protocol = i.protocol || t.location.protocol.slice(0, -1), i.host = i.host || (t.document ? t.document.domain : t.location.hostname), i.port = i.port || t.location.port), s = n.util.uniqueUri(i);
var u = {
host: i.host,
secure: "https" == i.protocol,
port: i.port || ("https" == i.protocol ? 443 : 80),
query: i.query || ""
};
n.util.merge(u, r);
if (u["force new connection"] || !n.sockets[s]) o = new n.Socket(u);
return !u["force new connection"] && o && (n.sockets[s] = o), o = o || n.sockets[s], o.of(i.path.length > 1 ? i.path : "");
};
})("object" == typeof module ? module.exports : this.io = {}, this), function(e, t) {
var n = e.util = {}, r = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, i = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
n.parseUri = function(e) {
var t = r.exec(e || ""), n = {}, s = 14;
while (s--) n[i[s]] = t[s] || "";
return n;
}, n.uniqueUri = function(e) {
var n = e.protocol, r = e.host, i = e.port;
return "document" in t ? (r = r || document.domain, i = i || (n == "https" && document.location.protocol !== "https:" ? 443 : document.location.port)) : (r = r || "localhost", !i && n == "https" && (i = 443)), (n || "http") + "://" + r + ":" + (i || 80);
}, n.query = function(e, t) {
var r = n.chunkQuery(e || ""), i = [];
n.merge(r, n.chunkQuery(t || ""));
for (var s in r) r.hasOwnProperty(s) && i.push(s + "=" + r[s]);
return i.length ? "?" + i.join("&") : "";
}, n.chunkQuery = function(e) {
var t = {}, n = e.split("&"), r = 0, i = n.length, s;
for (; r < i; ++r) s = n[r].split("="), s[0] && (t[s[0]] = s[1]);
return t;
};
var s = !1;
n.load = function(e) {
if ("document" in t && document.readyState === "complete" || s) return e();
n.on(t, "load", e, !1);
}, n.on = function(e, t, n, r) {
e.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener && e.addEventListener(t, n, r);
}, n.request = function(e) {
if (e && "undefined" != typeof XDomainRequest) return new XDomainRequest;
if ("undefined" != typeof XMLHttpRequest && (!e || n.ua.hasCORS)) return new XMLHttpRequest;
if (!e) try {
return new (window[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
} catch (t) {}
return null;
}, "undefined" != typeof window && n.load(function() {
s = !0;
}), n.defer = function(e) {
if (!n.ua.webkit || "undefined" != typeof importScripts) return e();
n.load(function() {
setTimeout(e, 100);
});
}, n.merge = function(e, t, r, i) {
var s = i || [], o = typeof r == "undefined" ? 2 : r, u;
for (u in t) t.hasOwnProperty(u) && n.indexOf(s, u) < 0 && (typeof e[u] != "object" || !o ? (e[u] = t[u], s.push(t[u])) : n.merge(e[u], t[u], o - 1, s));
return e;
}, n.mixin = function(e, t) {
n.merge(e.prototype, t.prototype);
}, n.inherit = function(e, t) {
function n() {}
n.prototype = t.prototype, e.prototype = new n;
}, n.isArray = Array.isArray || function(e) {
return Object.prototype.toString.call(e) === "[object Array]";
}, n.intersect = function(e, t) {
var r = [], i = e.length > t.length ? e : t, s = e.length > t.length ? t : e;
for (var o = 0, u = s.length; o < u; o++) ~n.indexOf(i, s[o]) && r.push(s[o]);
return r;
}, n.indexOf = function(e, t, n) {
for (var r = e.length, n = n < 0 ? n + r < 0 ? 0 : n + r : n || 0; n < r && e[n] !== t; n++) ;
return r <= n ? -1 : n;
}, n.toArray = function(e) {
var t = [];
for (var n = 0, r = e.length; n < r; n++) t.push(e[n]);
return t;
}, n.ua = {}, n.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
try {
var e = new XMLHttpRequest;
} catch (t) {
return !1;
}
return e.withCredentials != undefined;
}(), n.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent);
}("undefined" != typeof io ? io : module.exports, this), function(e, t) {
function n() {}
e.EventEmitter = n, n.prototype.on = function(e, n) {
return this.$events || (this.$events = {}), this.$events[e] ? t.util.isArray(this.$events[e]) ? this.$events[e].push(n) : this.$events[e] = [ this.$events[e], n ] : this.$events[e] = n, this;
}, n.prototype.addListener = n.prototype.on, n.prototype.once = function(e, t) {
function n() {
r.removeListener(e, n), t.apply(this, arguments);
}
var r = this;
return n.listener = t, this.on(e, n), this;
}, n.prototype.removeListener = function(e, n) {
if (this.$events && this.$events[e]) {
var r = this.$events[e];
if (t.util.isArray(r)) {
var i = -1;
for (var s = 0, o = r.length; s < o; s++) if (r[s] === n || r[s].listener && r[s].listener === n) {
i = s;
break;
}
if (i < 0) return this;
r.splice(i, 1), r.length || delete this.$events[e];
} else (r === n || r.listener && r.listener === n) && delete this.$events[e];
}
return this;
}, n.prototype.removeAllListeners = function(e) {
return this.$events && this.$events[e] && (this.$events[e] = null), this;
}, n.prototype.listeners = function(e) {
return this.$events || (this.$events = {}), this.$events[e] || (this.$events[e] = []), t.util.isArray(this.$events[e]) || (this.$events[e] = [ this.$events[e] ]), this.$events[e];
}, n.prototype.emit = function(e) {
if (!this.$events) return !1;
var n = this.$events[e];
if (!n) return !1;
var r = Array.prototype.slice.call(arguments, 1);
if ("function" == typeof n) n.apply(this, r); else {
if (!t.util.isArray(n)) return !1;
var i = n.slice();
for (var s = 0, o = i.length; s < o; s++) i[s].apply(this, r);
}
return !0;
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(exports, nativeJSON) {
function f(e) {
return e < 10 ? "0" + e : e;
}
function date(e, t) {
return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null;
}
function quote(e) {
return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
var t = meta[e];
return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + e + '"';
}
function str(e, t) {
var n, r, i, s, o = gap, u, a = t[e];
a instanceof Date && (a = date(e)), typeof rep == "function" && (a = rep.call(t, e, a));
switch (typeof a) {
case "string":
return quote(a);
case "number":
return isFinite(a) ? String(a) : "null";
case "boolean":
case "null":
return String(a);
case "object":
if (!a) return "null";
gap += indent, u = [];
if (Object.prototype.toString.apply(a) === "[object Array]") {
s = a.length;
for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i;
}
if (rep && typeof rep == "object") {
s = rep.length;
for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
} else for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i;
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
JSON.stringify = function(e, t, n) {
var r;
gap = "", indent = "";
if (typeof n == "number") for (r = 0; r < n; r += 1) indent += " "; else typeof n == "string" && (indent = n);
rep = t;
if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
"": e
});
throw new Error("JSON.stringify");
}, JSON.parse = function(text, reviver) {
function walk(e, t) {
var n, r, i = e[t];
if (i && typeof i == "object") for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
return reviver.call(e, t, i);
}
var j;
text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
}));
if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
"": j
}, "") : j;
throw new SyntaxError("JSON.parse");
};
}("undefined" != typeof io ? io : module.exports, typeof JSON != "undefined" ? JSON : undefined), function(e, t) {
var n = e.parser = {}, r = n.packets = [ "disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop" ], i = n.reasons = [ "transport not supported", "client not handshaken", "unauthorized" ], s = n.advice = [ "reconnect" ], o = t.JSON, u = t.util.indexOf;
n.encodePacket = function(e) {
var t = u(r, e.type), n = e.id || "", a = e.endpoint || "", l = e.ack, c = null;
switch (e.type) {
case "error":
var p = e.reason ? u(i, e.reason) : "", v = e.advice ? u(s, e.advice) : "";
if (p !== "" || v !== "") c = p + (v !== "" ? "+" + v : "");
break;
case "message":
e.data !== "" && (c = e.data);
break;
case "event":
var m = {
name: e.name
};
e.args && e.args.length && (m.args = e.args), c = o.stringify(m);
break;
case "json":
c = o.stringify(e.data);
break;
case "connect":
e.qs && (c = e.qs);
break;
case "ack":
c = e.ackId + (e.args && e.args.length ? "+" + o.stringify(e.args) : "");
}
var y = [ t, n + (l == "data" ? "+" : ""), a ];
return c !== null && c !== undefined && y.push(c), y.join(":");
}, n.encodePayload = function(e) {
var t = "";
if (e.length == 1) return e[0];
for (var n = 0, r = e.length; n < r; n++) {
var i = e[n];
t += "\ufffd" + i.length + "\ufffd" + e[n];
}
return t;
};
var a = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
n.decodePacket = function(e) {
var t = e.match(a);
if (!t) return {};
var n = t[2] || "", e = t[5] || "", u = {
type: r[t[1]],
endpoint: t[4] || ""
};
n && (u.id = n, t[3] ? u.ack = "data" : u.ack = !0);
switch (u.type) {
case "error":
var t = e.split("+");
u.reason = i[t[0]] || "", u.advice = s[t[1]] || "";
break;
case "message":
u.data = e || "";
break;
case "event":
try {
var l = o.parse(e);
u.name = l.name, u.args = l.args;
} catch (c) {}
u.args = u.args || [];
break;
case "json":
try {
u.data = o.parse(e);
} catch (c) {}
break;
case "connect":
u.qs = e || "";
break;
case "ack":
var t = e.match(/^([0-9]+)(\+)?(.*)/);
if (t) {
u.ackId = t[1], u.args = [];
if (t[3]) try {
u.args = t[3] ? o.parse(t[3]) : [];
} catch (c) {}
}
break;
case "disconnect":
case "heartbeat":
}
return u;
}, n.decodePayload = function(e) {
if (e.charAt(0) == "\ufffd") {
var t = [];
for (var r = 1, i = ""; r < e.length; r++) e.charAt(r) == "\ufffd" ? (t.push(n.decodePacket(e.substr(r + 1).substr(0, i))), r += Number(i) + 1, i = "") : i += e.charAt(r);
return t;
}
return [ n.decodePacket(e) ];
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(e, t) {
function n(e, t) {
this.socket = e, this.sessid = t;
}
e.Transport = n, t.util.mixin(n, t.EventEmitter), n.prototype.onData = function(e) {
this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
if (e !== "") {
var n = t.parser.decodePayload(e);
if (n && n.length) for (var r = 0, i = n.length; r < i; r++) this.onPacket(n[r]);
}
return this;
}, n.prototype.onPacket = function(e) {
return this.socket.setHeartbeatTimeout(), e.type == "heartbeat" ? this.onHeartbeat() : (e.type == "connect" && e.endpoint == "" && this.onConnect(), e.type == "error" && e.advice == "reconnect" && (this.open = !1), this.socket.onPacket(e), this);
}, n.prototype.setCloseTimeout = function() {
if (!this.closeTimeout) {
var e = this;
this.closeTimeout = setTimeout(function() {
e.onDisconnect();
}, this.socket.closeTimeout);
}
}, n.prototype.onDisconnect = function() {
return this.close && this.open && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this;
}, n.prototype.onConnect = function() {
return this.socket.onConnect(), this;
}, n.prototype.clearCloseTimeout = function() {
this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null);
}, n.prototype.clearTimeouts = function() {
this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout);
}, n.prototype.packet = function(e) {
this.send(t.parser.encodePacket(e));
}, n.prototype.onHeartbeat = function(e) {
this.packet({
type: "heartbeat"
});
}, n.prototype.onOpen = function() {
this.open = !0, this.clearCloseTimeout(), this.socket.onOpen();
}, n.prototype.onClose = function() {
var e = this;
this.open = !1, this.socket.onClose(), this.onDisconnect();
}, n.prototype.prepareUrl = function() {
var e = this.socket.options;
return this.scheme() + "://" + e.host + ":" + e.port + "/" + e.resource + "/" + t.protocol + "/" + this.name + "/" + this.sessid;
}, n.prototype.ready = function(e, t) {
t.call(this);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(e, t, n) {
function r(e) {
this.options = {
port: 80,
secure: !1,
document: "document" in n ? document : !1,
resource: "socket.io",
transports: t.transports,
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
}, t.util.merge(this.options, e), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1;
if (this.options["sync disconnect on unload"] && (!this.isXDomain() || t.util.ua.hasCORS)) {
var r = this;
t.util.on(n, "unload", function() {
r.disconnectSync();
}, !1);
}
this.options["auto connect"] && this.connect();
}
function i() {}
e.Socket = r, t.util.mixin(r, t.EventEmitter), r.prototype.of = function(e) {
return this.namespaces[e] || (this.namespaces[e] = new t.SocketNamespace(this, e), e !== "" && this.namespaces[e].packet({
type: "connect"
})), this.namespaces[e];
}, r.prototype.publish = function() {
this.emit.apply(this, arguments);
var e;
for (var t in this.namespaces) this.namespaces.hasOwnProperty(t) && (e = this.of(t), e.$emit.apply(e, arguments));
}, r.prototype.handshake = function(e) {
function n(t) {
t instanceof Error ? r.onError(t.message) : e.apply(null, t.split(":"));
}
var r = this, s = this.options, o = [ "http" + (s.secure ? "s" : "") + ":/", s.host + ":" + s.port, s.resource, t.protocol, t.util.query(this.options.query, "t=" + +(new Date)) ].join("/");
if (this.isXDomain() && !t.util.ua.hasCORS) {
var u = document.getElementsByTagName("script")[0], a = document.createElement("script");
a.src = o + "&jsonp=" + t.j.length, u.parentNode.insertBefore(a, u), t.j.push(function(e) {
n(e), a.parentNode.removeChild(a);
});
} else {
var f = t.util.request();
f.open("GET", o, !0), f.withCredentials = !0, f.onreadystatechange = function() {
f.readyState == 4 && (f.onreadystatechange = i, f.status == 200 ? n(f.responseText) : !r.reconnecting && r.onError(f.responseText));
}, f.send(null);
}
}, r.prototype.getTransport = function(e) {
var n = e || this.transports, r;
for (var i = 0, s; s = n[i]; i++) if (t.Transport[s] && t.Transport[s].check(this) && (!this.isXDomain() || t.Transport[s].xdomainCheck())) return new t.Transport[s](this, this.sessionid);
return null;
}, r.prototype.connect = function(e) {
if (this.connecting) return this;
var n = this;
return this.handshake(function(r, i, s, o) {
function u(e) {
n.transport && n.transport.clearTimeouts(), n.transport = n.getTransport(e);
if (!n.transport) return n.publish("connect_failed");
n.transport.ready(n, function() {
n.connecting = !0, n.publish("connecting", n.transport.name), n.transport.open(), n.options["connect timeout"] && (n.connectTimeoutTimer = setTimeout(function() {
if (!n.connected) {
n.connecting = !1;
if (n.options["try multiple transports"]) {
n.remainingTransports || (n.remainingTransports = n.transports.slice(0));
var e = n.remainingTransports;
while (e.length > 0 && e.splice(0, 1)[0] != n.transport.name) ;
e.length ? u(e) : n.publish("connect_failed");
}
}
}, n.options["connect timeout"]));
});
}
n.sessionid = r, n.closeTimeout = s * 1e3, n.heartbeatTimeout = i * 1e3, n.transports = o ? t.util.intersect(o.split(","), n.options.transports) : n.options.transports, n.setHeartbeatTimeout(), u(n.transports), n.once("connect", function() {
clearTimeout(n.connectTimeoutTimer), e && typeof e == "function" && e();
});
}), this;
}, r.prototype.setHeartbeatTimeout = function() {
clearTimeout(this.heartbeatTimeoutTimer);
var e = this;
this.heartbeatTimeoutTimer = setTimeout(function() {
e.transport.onClose();
}, this.heartbeatTimeout);
}, r.prototype.packet = function(e) {
return this.connected && !this.doBuffer ? this.transport.packet(e) : this.buffer.push(e), this;
}, r.prototype.setBuffer = function(e) {
this.doBuffer = e, !e && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = []);
}, r.prototype.disconnect = function() {
if (this.connected || this.connecting) this.open && this.of("").packet({
type: "disconnect"
}), this.onDisconnect("booted");
return this;
}, r.prototype.disconnectSync = function() {
var e = t.util.request(), n = this.resource + "/" + t.protocol + "/" + this.sessionid;
e.open("GET", n, !0), this.onDisconnect("booted");
}, r.prototype.isXDomain = function() {
var e = n.location.port || ("https:" == n.location.protocol ? 443 : 80);
return this.options.host !== n.location.hostname || this.options.port != e;
}, r.prototype.onConnect = function() {
this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"));
}, r.prototype.onOpen = function() {
this.open = !0;
}, r.prototype.onClose = function() {
this.open = !1, clearTimeout(this.heartbeatTimeoutTimer);
}, r.prototype.onPacket = function(e) {
this.of(e.endpoint).onPacket(e);
}, r.prototype.onError = function(e) {
e && e.advice && e.advice === "reconnect" && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect && this.reconnect()), this.publish("error", e && e.reason ? e.reason : e);
}, r.prototype.onDisconnect = function(e) {
var t = this.connected, n = this.connecting;
this.connected = !1, this.connecting = !1, this.open = !1;
if (t || n) this.transport.close(), this.transport.clearTimeouts(), t && (this.publish("disconnect", e), "booted" != e && this.options.reconnect && !this.reconnecting && this.reconnect());
}, r.prototype.reconnect = function() {
function e() {
if (n.connected) {
for (var e in n.namespaces) n.namespaces.hasOwnProperty(e) && "" !== e && n.namespaces[e].packet({
type: "connect"
});
n.publish("reconnect", n.transport.name, n.reconnectionAttempts);
}
clearTimeout(n.reconnectionTimer), n.removeListener("connect_failed", t), n.removeListener("connect", t), n.reconnecting = !1, delete n.reconnectionAttempts, delete n.reconnectionDelay, delete n.reconnectionTimer, delete n.redoTransports, n.options["try multiple transports"] = i;
}
function t() {
if (!n.reconnecting) return;
if (n.connected) return e();
if (n.connecting && n.reconnecting) return n.reconnectionTimer = setTimeout(t, 1e3);
n.reconnectionAttempts++ >= r ? n.redoTransports ? (n.publish("reconnect_failed"), e()) : (n.on("connect_failed", t), n.options["try multiple transports"] = !0, n.transport = n.getTransport(), n.redoTransports = !0, n.connect()) : (n.reconnectionDelay < s && (n.reconnectionDelay *= 2), n.connect(), n.publish("reconnecting", n.reconnectionDelay, n.reconnectionAttempts), n.reconnectionTimer = setTimeout(t, n.reconnectionDelay));
}
this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
var n = this, r = this.options["max reconnection attempts"], i = this.options["try multiple transports"], s = this.options["reconnection limit"];
this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(t, this.reconnectionDelay), this.on("connect", t);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(e, t) {
function n(e, t) {
this.socket = e, this.name = t || "", this.flags = {}, this.json = new r(this, "json"), this.ackPackets = 0, this.acks = {};
}
function r(e, t) {
this.namespace = e, this.name = t;
}
e.SocketNamespace = n, t.util.mixin(n, t.EventEmitter), n.prototype.$emit = t.EventEmitter.prototype.emit, n.prototype.of = function() {
return this.socket.of.apply(this.socket, arguments);
}, n.prototype.packet = function(e) {
return e.endpoint = this.name, this.socket.packet(e), this.flags = {}, this;
}, n.prototype.send = function(e, t) {
var n = {
type: this.flags.json ? "json" : "message",
data: e
};
return "function" == typeof t && (n.id = ++this.ackPackets, n.ack = !0, this.acks[n.id] = t), this.packet(n);
}, n.prototype.emit = function(e) {
var t = Array.prototype.slice.call(arguments, 1), n = t[t.length - 1], r = {
type: "event",
name: e
};
return "function" == typeof n && (r.id = ++this.ackPackets, r.ack = "data", this.acks[r.id] = n, t = t.slice(0, t.length - 1)), r.args = t, this.packet(r);
}, n.prototype.disconnect = function() {
return this.name === "" ? this.socket.disconnect() : (this.packet({
type: "disconnect"
}), this.$emit("disconnect")), this;
}, n.prototype.onPacket = function(e) {
function n() {
r.packet({
type: "ack",
args: t.util.toArray(arguments),
ackId: e.id
});
}
var r = this;
switch (e.type) {
case "connect":
this.$emit("connect");
break;
case "disconnect":
this.name === "" ? this.socket.onDisconnect(e.reason || "booted") : this.$emit("disconnect", e.reason);
break;
case "message":
case "json":
var i = [ "message", e.data ];
e.ack == "data" ? i.push(n) : e.ack && this.packet({
type: "ack",
ackId: e.id
}), this.$emit.apply(this, i);
break;
case "event":
var i = [ e.name ].concat(e.args);
e.ack == "data" && i.push(n), this.$emit.apply(this, i);
break;
case "ack":
this.acks[e.ackId] && (this.acks[e.ackId].apply(this, e.args), delete this.acks[e.ackId]);
break;
case "error":
e.advice ? this.socket.onError(e) : e.reason == "unauthorized" ? this.$emit("connect_failed", e.reason) : this.$emit("error", e.reason);
}
}, r.prototype.send = function() {
this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments);
}, r.prototype.emit = function() {
this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments);
};
}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(e, t, n) {
function r(e) {
t.Transport.apply(this, arguments);
}
e.websocket = r, t.util.inherit(r, t.Transport), r.prototype.name = "websocket", r.prototype.open = function() {
var e = t.util.query(this.socket.options.query), r = this, i;
return i || (i = n.MozWebSocket || n.WebSocket), this.websocket = new i(this.prepareUrl() + e), this.websocket.onopen = function() {
r.onOpen(), r.socket.setBuffer(!1);
}, this.websocket.onmessage = function(e) {
r.onData(e.data);
}, this.websocket.onclose = function() {
r.onClose(), r.socket.setBuffer(!0);
}, this.websocket.onerror = function(e) {
r.onError(e);
}, this;
}, r.prototype.send = function(e) {
return this.websocket.send(e), this;
}, r.prototype.payload = function(e) {
for (var t = 0, n = e.length; t < n; t++) this.packet(e[t]);
return this;
}, r.prototype.close = function() {
return this.websocket.close(), this;
}, r.prototype.onError = function(e) {
this.socket.onError(e);
}, r.prototype.scheme = function() {
return this.socket.options.secure ? "wss" : "ws";
}, r.check = function() {
return "WebSocket" in n && !("__addTask" in WebSocket) || "MozWebSocket" in n;
}, r.xdomainCheck = function() {
return !0;
}, t.transports.push("websocket");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(e, t) {
function n() {
t.Transport.websocket.apply(this, arguments);
}
e.flashsocket = n, t.util.inherit(n, t.Transport.websocket), n.prototype.name = "flashsocket", n.prototype.open = function() {
var e = this, n = arguments;
return WebSocket.__addTask(function() {
t.Transport.websocket.prototype.open.apply(e, n);
}), this;
}, n.prototype.send = function() {
var e = this, n = arguments;
return WebSocket.__addTask(function() {
t.Transport.websocket.prototype.send.apply(e, n);
}), this;
}, n.prototype.close = function() {
return WebSocket.__tasks.length = 0, t.Transport.websocket.prototype.close.call(this), this;
}, n.prototype.ready = function(e, r) {
function i() {
var t = e.options, i = t["flash policy port"], o = [ "http" + (t.secure ? "s" : "") + ":/", t.host + ":" + t.port, t.resource, "static/flashsocket", "WebSocketMain" + (e.isXDomain() ? "Insecure" : "") + ".swf" ];
n.loaded || (typeof WEB_SOCKET_SWF_LOCATION == "undefined" && (WEB_SOCKET_SWF_LOCATION = o.join("/")), i !== 843 && WebSocket.loadFlashPolicyFile("xmlsocket://" + t.host + ":" + i), WebSocket.__initialize(), n.loaded = !0), r.call(s);
}
var s = this;
if (document.body) return i();
t.util.load(i);
}, n.check = function() {
return typeof WebSocket != "undefined" && "__initialize" in WebSocket && !!swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1;
}, n.xdomainCheck = function() {
return !0;
}, typeof window != "undefined" && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), t.transports.push("flashsocket");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);

if ("undefined" != typeof window) var swfobject = function() {
function e() {
if (R) return;
try {
var e = O.getElementsByTagName("body")[0].appendChild(m("span"));
e.parentNode.removeChild(e);
} catch (t) {
return;
}
R = !0;
var n = D.length;
for (var r = 0; r < n; r++) D[r]();
}
function t(e) {
R ? e() : D[D.length] = e;
}
function n(e) {
if (typeof A.addEventListener != S) A.addEventListener("load", e, !1); else if (typeof O.addEventListener != S) O.addEventListener("load", e, !1); else if (typeof A.attachEvent != S) g(A, "onload", e); else if (typeof A.onload == "function") {
var t = A.onload;
A.onload = function() {
t(), e();
};
} else A.onload = e;
}
function r() {
_ ? i() : s();
}
function i() {
var e = O.getElementsByTagName("body")[0], t = m(x);
t.setAttribute("type", C);
var n = e.appendChild(t);
if (n) {
var r = 0;
(function() {
if (typeof n.GetVariable != S) {
var i = n.GetVariable("$version");
i && (i = i.split(" ")[1].split(","), V.pv = [ parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10) ]);
} else if (r < 10) {
r++, setTimeout(arguments.callee, 10);
return;
}
e.removeChild(t), n = null, s();
})();
} else s();
}
function s() {
var e = P.length;
if (e > 0) for (var t = 0; t < e; t++) {
var n = P[t].id, r = P[t].callbackFn, i = {
success: !1,
id: n
};
if (V.pv[0] > 0) {
var s = v(n);
if (s) if (y(P[t].swfVersion) && !(V.wk && V.wk < 312)) w(n, !0), r && (i.success = !0, i.ref = o(n), r(i)); else if (P[t].expressInstall && u()) {
var l = {};
l.data = P[t].expressInstall, l.width = s.getAttribute("width") || "0", l.height = s.getAttribute("height") || "0", s.getAttribute("class") && (l.styleclass = s.getAttribute("class")), s.getAttribute("align") && (l.align = s.getAttribute("align"));
var c = {}, h = s.getElementsByTagName("param"), p = h.length;
for (var d = 0; d < p; d++) h[d].getAttribute("name").toLowerCase() != "movie" && (c[h[d].getAttribute("name")] = h[d].getAttribute("value"));
a(l, c, n, r);
} else f(s), r && r(i);
} else {
w(n, !0);
if (r) {
var m = o(n);
m && typeof m.SetVariable != S && (i.success = !0, i.ref = m), r(i);
}
}
}
}
function o(e) {
var t = null, n = v(e);
if (n && n.nodeName == "OBJECT") if (typeof n.SetVariable != S) t = n; else {
var r = n.getElementsByTagName(x)[0];
r && (t = r);
}
return t;
}
function u() {
return !U && y("6.0.65") && (V.win || V.mac) && !(V.wk && V.wk < 312);
}
function a(e, t, n, r) {
U = !0, I = r || null, q = {
success: !1,
id: n
};
var i = v(n);
if (i) {
i.nodeName == "OBJECT" ? (j = l(i), F = null) : (j = i, F = n), e.id = k;
if (typeof e.width == S || !/%$/.test(e.width) && parseInt(e.width, 10) < 310) e.width = "310";
if (typeof e.height == S || !/%$/.test(e.height) && parseInt(e.height, 10) < 137) e.height = "137";
O.title = O.title.slice(0, 47) + " - Flash Player Installation";
var s = V.ie && V.win ? [ "Active" ].concat("").join("X") : "PlugIn", o = "MMredirectURL=" + A.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + s + "&MMdoctitle=" + O.title;
typeof t.flashvars != S ? t.flashvars += "&" + o : t.flashvars = o;
if (V.ie && V.win && i.readyState != 4) {
var u = m("div");
n += "SWFObjectNew", u.setAttribute("id", n), i.parentNode.insertBefore(u, i), i.style.display = "none", function() {
i.readyState == 4 ? i.parentNode.removeChild(i) : setTimeout(arguments.callee, 10);
}();
}
c(e, t, n);
}
}
function f(e) {
if (V.ie && V.win && e.readyState != 4) {
var t = m("div");
e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(l(e), t), e.style.display = "none", function() {
e.readyState == 4 ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10);
}();
} else e.parentNode.replaceChild(l(e), e);
}
function l(e) {
var t = m("div");
if (V.win && V.ie) t.innerHTML = e.innerHTML; else {
var n = e.getElementsByTagName(x)[0];
if (n) {
var r = n.childNodes;
if (r) {
var i = r.length;
for (var s = 0; s < i; s++) (r[s].nodeType != 1 || r[s].nodeName != "PARAM") && r[s].nodeType != 8 && t.appendChild(r[s].cloneNode(!0));
}
}
}
return t;
}
function c(e, t, n) {
var r, i = v(n);
if (V.wk && V.wk < 312) return r;
if (i) {
typeof e.id == S && (e.id = n);
if (V.ie && V.win) {
var s = "";
for (var o in e) e[o] != Object.prototype[o] && (o.toLowerCase() == "data" ? t.movie = e[o] : o.toLowerCase() == "styleclass" ? s += ' class="' + e[o] + '"' : o.toLowerCase() != "classid" && (s += " " + o + '="' + e[o] + '"'));
var u = "";
for (var a in t) t[a] != Object.prototype[a] && (u += '<param name="' + a + '" value="' + t[a] + '" />');
i.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + s + ">" + u + "</object>", H[H.length] = e.id, r = v(e.id);
} else {
var f = m(x);
f.setAttribute("type", C);
for (var l in e) e[l] != Object.prototype[l] && (l.toLowerCase() == "styleclass" ? f.setAttribute("class", e[l]) : l.toLowerCase() != "classid" && f.setAttribute(l, e[l]));
for (var c in t) t[c] != Object.prototype[c] && c.toLowerCase() != "movie" && h(f, c, t[c]);
i.parentNode.replaceChild(f, i), r = f;
}
}
return r;
}
function h(e, t, n) {
var r = m("param");
r.setAttribute("name", t), r.setAttribute("value", n), e.appendChild(r);
}
function p(e) {
var t = v(e);
t && t.nodeName == "OBJECT" && (V.ie && V.win ? (t.style.display = "none", function() {
t.readyState == 4 ? d(e) : setTimeout(arguments.callee, 10);
}()) : t.parentNode.removeChild(t));
}
function d(e) {
var t = v(e);
if (t) {
for (var n in t) typeof t[n] == "function" && (t[n] = null);
t.parentNode.removeChild(t);
}
}
function v(e) {
var t = null;
try {
t = O.getElementById(e);
} catch (n) {}
return t;
}
function m(e) {
return O.createElement(e);
}
function g(e, t, n) {
e.attachEvent(t, n), B[B.length] = [ e, t, n ];
}
function y(e) {
var t = V.pv, n = e.split(".");
return n[0] = parseInt(n[0], 10), n[1] = parseInt(n[1], 10) || 0, n[2] = parseInt(n[2], 10) || 0, t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1;
}
function b(e, t, n, r) {
if (V.ie && V.mac) return;
var i = O.getElementsByTagName("head")[0];
if (!i) return;
var s = n && typeof n == "string" ? n : "screen";
r && (z = null, W = null);
if (!z || W != s) {
var o = m("style");
o.setAttribute("type", "text/css"), o.setAttribute("media", s), z = i.appendChild(o), V.ie && V.win && typeof O.styleSheets != S && O.styleSheets.length > 0 && (z = O.styleSheets[O.styleSheets.length - 1]), W = s;
}
V.ie && V.win ? z && typeof z.addRule == x && z.addRule(e, t) : z && typeof O.createTextNode != S && z.appendChild(O.createTextNode(e + " {" + t + "}"));
}
function w(e, t) {
if (!X) return;
var n = t ? "visible" : "hidden";
R && v(e) ? v(e).style.visibility = n : b("#" + e, "visibility:" + n);
}
function E(e) {
var t = /[\\\"<>\.;]/, n = t.exec(e) != null;
return n && typeof encodeURIComponent != S ? encodeURIComponent(e) : e;
}
var S = "undefined", x = "object", T = "Shockwave Flash", N = "ShockwaveFlash.ShockwaveFlash", C = "application/x-shockwave-flash", k = "SWFObjectExprInst", L = "onreadystatechange", A = window, O = document, M = navigator, _ = !1, D = [ r ], P = [], H = [], B = [], j, F, I, q, R = !1, U = !1, z, W, X = !0, V = function() {
var e = typeof O.getElementById != S && typeof O.getElementsByTagName != S && typeof O.createElement != S, t = M.userAgent.toLowerCase(), n = M.platform.toLowerCase(), r = n ? /win/.test(n) : /win/.test(t), i = n ? /mac/.test(n) : /mac/.test(t), s = /webkit/.test(t) ? parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, o = !1, u = [ 0, 0, 0 ], a = null;
if (typeof M.plugins != S && typeof M.plugins[T] == x) a = M.plugins[T].description, a && (typeof M.mimeTypes == S || !M.mimeTypes[C] || !!M.mimeTypes[C].enabledPlugin) && (_ = !0, o = !1, a = a.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), u[0] = parseInt(a.replace(/^(.*)\..*$/, "$1"), 10), u[1] = parseInt(a.replace(/^.*\.(.*)\s.*$/, "$1"), 10), u[2] = /[a-zA-Z]/.test(a) ? parseInt(a.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof A[[ "Active" ].concat("Object").join("X")] != S) try {
var f = new (window[[ "Active" ].concat("Object").join("X")])(N);
f && (a = f.GetVariable("$version"), a && (o = !0, a = a.split(" ")[1].split(","), u = [ parseInt(a[0], 10), parseInt(a[1], 10), parseInt(a[2], 10) ]));
} catch (l) {}
return {
w3: e,
pv: u,
wk: s,
ie: o,
win: r,
mac: i
};
}(), $ = function() {
if (!V.w3) return;
(typeof O.readyState != S && O.readyState == "complete" || typeof O.readyState == S && (O.getElementsByTagName("body")[0] || O.body)) && e(), R || (typeof O.addEventListener != S && O.addEventListener("DOMContentLoaded", e, !1), V.ie && V.win && (O.attachEvent(L, function() {
O.readyState == "complete" && (O.detachEvent(L, arguments.callee), e());
}), A == top && function() {
if (R) return;
try {
O.documentElement.doScroll("left");
} catch (t) {
setTimeout(arguments.callee, 0);
return;
}
e();
}()), V.wk && function() {
if (R) return;
if (!/loaded|complete/.test(O.readyState)) {
setTimeout(arguments.callee, 0);
return;
}
e();
}(), n(e));
}(), J = function() {
V.ie && V.win && window.attachEvent("onunload", function() {
var e = B.length;
for (var t = 0; t < e; t++) B[t][0].detachEvent(B[t][1], B[t][2]);
var n = H.length;
for (var r = 0; r < n; r++) p(H[r]);
for (var i in V) V[i] = null;
V = null;
for (var s in swfobject) swfobject[s] = null;
swfobject = null;
});
}();
return {
registerObject: function(e, t, n, r) {
if (V.w3 && e && t) {
var i = {};
i.id = e, i.swfVersion = t, i.expressInstall = n, i.callbackFn = r, P[P.length] = i, w(e, !1);
} else r && r({
success: !1,
id: e
});
},
getObjectById: function(e) {
if (V.w3) return o(e);
},
embedSWF: function(e, n, r, i, s, o, f, l, h, p) {
var d = {
success: !1,
id: n
};
V.w3 && !(V.wk && V.wk < 312) && e && n && r && i && s ? (w(n, !1), t(function() {
r += "", i += "";
var t = {};
if (h && typeof h === x) for (var v in h) t[v] = h[v];
t.data = e, t.width = r, t.height = i;
var m = {};
if (l && typeof l === x) for (var g in l) m[g] = l[g];
if (f && typeof f === x) for (var b in f) typeof m.flashvars != S ? m.flashvars += "&" + b + "=" + f[b] : m.flashvars = b + "=" + f[b];
if (y(s)) {
var E = c(t, m, n);
t.id == n && w(n, !0), d.success = !0, d.ref = E;
} else {
if (o && u()) {
t.data = o, a(t, m, n, p);
return;
}
w(n, !0);
}
p && p(d);
})) : p && p(d);
},
switchOffAutoHideShow: function() {
X = !1;
},
ua: V,
getFlashPlayerVersion: function() {
return {
major: V.pv[0],
minor: V.pv[1],
release: V.pv[2]
};
},
hasFlashPlayerVersion: y,
createSWF: function(e, t, n) {
return V.w3 ? c(e, t, n) : undefined;
},
showExpressInstall: function(e, t, n, r) {
V.w3 && u() && a(e, t, n, r);
},
removeSWF: function(e) {
V.w3 && p(e);
},
createCSS: function(e, t, n, r) {
V.w3 && b(e, t, n, r);
},
addDomLoadEvent: t,
addLoadEvent: n,
getQueryParamValue: function(e) {
var t = O.location.search || O.location.hash;
if (t) {
/\?/.test(t) && (t = t.split("?")[1]);
if (e == null) return E(t);
var n = t.split("&");
for (var r = 0; r < n.length; r++) if (n[r].substring(0, n[r].indexOf("=")) == e) return E(n[r].substring(n[r].indexOf("=") + 1));
}
return "";
},
expressInstallCallback: function() {
if (U) {
var e = v(k);
e && j && (e.parentNode.replaceChild(j, e), F && (w(F, !0), V.ie && V.win && (j.style.display = "block")), I && I(q)), U = !1;
}
}
};
}();

(function() {
if ("undefined" == typeof window || window.WebSocket) return;
var e = window.console;
if (!e || !e.log || !e.error) e = {
log: function() {},
error: function() {}
};
if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
e.error("Flash Player >= 10.0.0 is required.");
return;
}
location.protocol == "file:" && e.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(e, t, n, r, i) {
var s = this;
s.__id = WebSocket.__nextId++, WebSocket.__instances[s.__id] = s, s.readyState = WebSocket.CONNECTING, s.bufferedAmount = 0, s.__events = {}, t ? typeof t == "string" && (t = [ t ]) : t = [], setTimeout(function() {
WebSocket.__addTask(function() {
WebSocket.__flash.create(s.__id, e, t, n || null, r || 0, i || null);
});
}, 0);
}, WebSocket.prototype.send = function(e) {
if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
var t = WebSocket.__flash.send(this.__id, encodeURIComponent(e));
return t < 0 ? !0 : (this.bufferedAmount += t, !1);
}, WebSocket.prototype.close = function() {
if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) return;
this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id);
}, WebSocket.prototype.addEventListener = function(e, t, n) {
e in this.__events || (this.__events[e] = []), this.__events[e].push(t);
}, WebSocket.prototype.removeEventListener = function(e, t, n) {
if (!(e in this.__events)) return;
var r = this.__events[e];
for (var i = r.length - 1; i >= 0; --i) if (r[i] === t) {
r.splice(i, 1);
break;
}
}, WebSocket.prototype.dispatchEvent = function(e) {
var t = this.__events[e.type] || [];
for (var n = 0; n < t.length; ++n) t[n](e);
var r = this["on" + e.type];
r && r(e);
}, WebSocket.prototype.__handleEvent = function(e) {
"readyState" in e && (this.readyState = e.readyState), "protocol" in e && (this.protocol = e.protocol);
var t;
if (e.type == "open" || e.type == "error") t = this.__createSimpleEvent(e.type); else if (e.type == "close") t = this.__createSimpleEvent("close"); else {
if (e.type != "message") throw "unknown event type: " + e.type;
var n = decodeURIComponent(e.message);
t = this.__createMessageEvent("message", n);
}
this.dispatchEvent(t);
}, WebSocket.prototype.__createSimpleEvent = function(e) {
if (document.createEvent && window.Event) {
var t = document.createEvent("Event");
return t.initEvent(e, !1, !1), t;
}
return {
type: e,
bubbles: !1,
cancelable: !1
};
}, WebSocket.prototype.__createMessageEvent = function(e, t) {
if (document.createEvent && window.MessageEvent && !window.opera) {
var n = document.createEvent("MessageEvent");
return n.initMessageEvent("message", !1, !1, t, null, null, window, null), n;
}
return {
type: e,
data: t,
bubbles: !1,
cancelable: !1
};
}, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(e) {
WebSocket.__addTask(function() {
WebSocket.__flash.loadManualPolicyFile(e);
});
}, WebSocket.__initialize = function() {
if (WebSocket.__flash) return;
WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation);
if (!window.WEB_SOCKET_SWF_LOCATION) {
e.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
return;
}
var t = document.createElement("div");
t.id = "webSocketContainer", t.style.position = "absolute", WebSocket.__isFlashLite() ? (t.style.left = "0px", t.style.top = "0px") : (t.style.left = "-100px", t.style.top = "-100px");
var n = document.createElement("div");
n.id = "webSocketFlash", t.appendChild(n), document.body.appendChild(t), swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
hasPriority: !0,
swliveconnect: !0,
allowScriptAccess: "always"
}, null, function(t) {
t.success || e.error("[WebSocket] swfobject.embedSWF failed");
});
}, WebSocket.__onFlashInitialized = function() {
setTimeout(function() {
WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
for (var e = 0; e < WebSocket.__tasks.length; ++e) WebSocket.__tasks[e]();
WebSocket.__tasks = [];
}, 0);
}, WebSocket.__onFlashEvent = function() {
return setTimeout(function() {
try {
var t = WebSocket.__flash.receiveEvents();
for (var n = 0; n < t.length; ++n) WebSocket.__instances[t[n].webSocketId].__handleEvent(t[n]);
} catch (r) {
e.error(r);
}
}, 0), !0;
}, WebSocket.__log = function(t) {
e.log(decodeURIComponent(t));
}, WebSocket.__error = function(t) {
e.error(decodeURIComponent(t));
}, WebSocket.__addTask = function(e) {
WebSocket.__flash ? e() : WebSocket.__tasks.push(e);
}, WebSocket.__isFlashLite = function() {
if (!window.navigator || !window.navigator.mimeTypes) return !1;
var e = window.navigator.mimeTypes["application/x-shockwave-flash"];
return !e || !e.enabledPlugin || !e.enabledPlugin.filename ? !1 : e.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1;
}, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function() {
WebSocket.__initialize();
}, !1) : window.attachEvent("onload", function() {
WebSocket.__initialize();
}));
})(), function(e, t, n) {
function r(e) {
if (!e) return;
t.Transport.apply(this, arguments), this.sendBuffer = [];
}
function i() {}
e.XHR = r, t.util.inherit(r, t.Transport), r.prototype.open = function() {
return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this;
}, r.prototype.payload = function(e) {
var n = [];
for (var r = 0, i = e.length; r < i; r++) n.push(t.parser.encodePacket(e[r]));
this.send(t.parser.encodePayload(n));
}, r.prototype.send = function(e) {
return this.post(e), this;
}, r.prototype.post = function(e) {
function t() {
this.readyState == 4 && (this.onreadystatechange = i, s.posting = !1, this.status == 200 ? s.socket.setBuffer(!1) : s.onClose());
}
function r() {
this.onload = i, s.socket.setBuffer(!1);
}
var s = this;
this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), n.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = r : this.sendXHR.onreadystatechange = t, this.sendXHR.send(e);
}, r.prototype.close = function() {
return this.onClose(), this;
}, r.prototype.request = function(e) {
var n = t.util.request(this.socket.isXDomain()), r = t.util.query(this.socket.options.query, "t=" + +(new Date));
n.open(e || "GET", this.prepareUrl() + r, !0);
if (e == "POST") try {
n.setRequestHeader ? n.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : n.contentType = "text/plain";
} catch (i) {}
return n;
}, r.prototype.scheme = function() {
return this.socket.options.secure ? "https" : "http";
}, r.check = function(e, r) {
try {
var i = t.util.request(r), s = n.XDomainRequest && i instanceof XDomainRequest, o = e && e.options && e.options.secure ? "https:" : "http:", u = o != n.location.protocol;
if (i && (!s || !u)) return !0;
} catch (a) {}
return !1;
}, r.xdomainCheck = function() {
return r.check(null, !0);
};
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(e, t) {
function n(e) {
t.Transport.XHR.apply(this, arguments);
}
e.htmlfile = n, t.util.inherit(n, t.Transport.XHR), n.prototype.name = "htmlfile", n.prototype.get = function() {
this.doc = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
var e = this.doc.createElement("div");
e.className = "socketio", this.doc.body.appendChild(e), this.iframe = this.doc.createElement("iframe"), e.appendChild(this.iframe);
var n = this, r = t.util.query(this.socket.options.query, "t=" + +(new Date));
this.iframe.src = this.prepareUrl() + r, t.util.on(window, "unload", function() {
n.destroy();
});
}, n.prototype._ = function(e, t) {
this.onData(e);
try {
var n = t.getElementsByTagName("script")[0];
n.parentNode.removeChild(n);
} catch (r) {}
}, n.prototype.destroy = function() {
if (this.iframe) {
try {
this.iframe.src = "about:blank";
} catch (e) {}
this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage();
}
}, n.prototype.close = function() {
return this.destroy(), t.Transport.XHR.prototype.close.call(this);
}, n.check = function() {
if (typeof window != "undefined" && [ "Active" ].concat("Object").join("X") in window) try {
var e = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile");
return e && t.Transport.XHR.check();
} catch (n) {}
return !1;
}, n.xdomainCheck = function() {
return !1;
}, t.transports.push("htmlfile");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), function(e, t, n) {
function r() {
t.Transport.XHR.apply(this, arguments);
}
function i() {}
e["xhr-polling"] = r, t.util.inherit(r, t.Transport.XHR), t.util.merge(r, t.Transport.XHR), r.prototype.name = "xhr-polling", r.prototype.open = function() {
var e = this;
return t.Transport.XHR.prototype.open.call(e), !1;
}, r.prototype.get = function() {
function e() {
this.readyState == 4 && (this.onreadystatechange = i, this.status == 200 ? (s.onData(this.responseText), s.get()) : s.onClose());
}
function t() {
this.onload = i, this.onerror = i, s.onData(this.responseText), s.get();
}
function r() {
s.onClose();
}
if (!this.open) return;
var s = this;
this.xhr = this.request(), n.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = t, this.xhr.onerror = r) : this.xhr.onreadystatechange = e, this.xhr.send(null);
}, r.prototype.onClose = function() {
t.Transport.XHR.prototype.onClose.call(this);
if (this.xhr) {
this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = i;
try {
this.xhr.abort();
} catch (e) {}
this.xhr = null;
}
}, r.prototype.ready = function(e, n) {
var r = this;
t.util.defer(function() {
n.call(r);
});
}, t.transports.push("xhr-polling");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function(e, t, n) {
function r(e) {
t.Transport["xhr-polling"].apply(this, arguments), this.index = t.j.length;
var n = this;
t.j.push(function(e) {
n._(e);
});
}
var i = n.document && "MozAppearance" in n.document.documentElement.style;
e["jsonp-polling"] = r, t.util.inherit(r, t.Transport["xhr-polling"]), r.prototype.name = "jsonp-polling", r.prototype.post = function(e) {
function n() {
r(), i.socket.setBuffer(!1);
}
function r() {
i.iframe && i.form.removeChild(i.iframe);
try {
f = document.createElement('<iframe name="' + i.iframeId + '">');
} catch (e) {
f = document.createElement("iframe"), f.name = i.iframeId;
}
f.id = i.iframeId, i.form.appendChild(f), i.iframe = f;
}
var i = this, s = t.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
if (!this.form) {
var o = document.createElement("form"), u = document.createElement("textarea"), a = this.iframeId = "socketio_iframe_" + this.index, f;
o.className = "socketio", o.style.position = "absolute", o.style.top = "0px", o.style.left = "0px", o.style.display = "none", o.target = a, o.method = "POST", o.setAttribute("accept-charset", "utf-8"), u.name = "d", o.appendChild(u), document.body.appendChild(o), this.form = o, this.area = u;
}
this.form.action = this.prepareUrl() + s, r(), this.area.value = t.JSON.stringify(e);
try {
this.form.submit();
} catch (l) {}
this.iframe.attachEvent ? f.onreadystatechange = function() {
i.iframe.readyState == "complete" && n();
} : this.iframe.onload = n, this.socket.setBuffer(!0);
}, r.prototype.get = function() {
var e = this, n = document.createElement("script"), r = t.util.query(this.socket.options.query, "t=" + +(new Date) + "&i=" + this.index);
this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.prepareUrl() + r, n.onerror = function() {
e.onClose();
};
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(n, s), this.script = n, i && setTimeout(function() {
var e = document.createElement("iframe");
document.body.appendChild(e), document.body.removeChild(e);
}, 100);
}, r.prototype._ = function(e) {
return this.onData(e), this.open && this.get(), this;
}, r.prototype.ready = function(e, n) {
var r = this;
if (!i) return n.call(this);
t.util.load(function() {
n.call(r);
});
}, r.check = function() {
return "document" in n;
}, r.xdomainCheck = function() {
return !0;
}, t.transports.push("jsonp-polling");
}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);

// core.js

(function() {
var e = window.DOCUMENT_HOSTNAME = document.location.hostname;
window.relocate = function() {
document.location = "https://%@/login".f(e);
};
})();

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
toReadableTimestamp: function(e) {
var t = XT._date || (XT._date = new Date);
return t.setTime(e), t.toLocaleTimeString();
},
getObjectByName: function(e) {
if (!e.split) return null;
var t = e.split("."), n, r, i = 0;
for (; i < t.length; ++i) {
r = t[i], n = n ? n[r] : window[r];
if (n === null || n === undefined) return null;
}
return n;
},
A: function(e) {
if (e === null || e === undefined) return [];
if (e.slice instanceof Function) return typeof e == "string" ? [ e ] : e.slice();
var t = [];
if (e.length) {
var n = e.length;
while (--n >= 0) t[n] = e[n];
return t;
}
return _.values(e);
}
}), XT.$A = XT.A, _.extend(XT, {
history: [],
addToHistory: function(e, t) {
for (var n = 0; n < this.history.length; n++) this.history[n].modelType === t.recordType && this.history[n].modelId === t.get("id") && (this.history.splice(n, 1), n--);
this.history.unshift({
modelType: t.recordType,
modelId: t.get("id"),
modelName: t.getValue(t.nameAttribute),
workspaceType: e
});
},
getHistory: function() {
return this.history;
}
}), XV = {};

// error.js

(function() {
"use strict";
XT.Error = function() {}, XT.Error.prototype = {
code: null,
messageKey: null,
params: {},
message: function() {
var e = (this.messageKey || "").loc(), t, n;
for (t in this.params) this.params.hasOwnProperty(t) && (n = (this.params[t] || "_unknown").loc(), e = e.replace("{" + t + "}", n));
return e;
}
}, _.extend(XT.Error, {
clone: function(e, t) {
var n;
t = t || {};
if (e) {
n = _.find(XT.errors, function(t) {
return t.code === e;
});
if (!n) return !1;
}
return n = _.clone(n), n.params && (n.params = _.clone(n.params)), _.extend(n, t), XT.Error.create(n);
},
create: function(e) {
var t;
return e = e || {}, t = new XT.Error, _.extend(t, e), t;
}
});
var e = [ {
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
}, {
code: "xt2007",
messageKey: "_addressShared"
} ];
XT.errors = [], _.each(e, function(e) {
var t = XT.Error.create(e);
XT.errors.push(t);
});
})();

// log.js

XT.log = function() {
var e = XT.$A(arguments);
console.log.apply ? console.log.apply(console, e) : console.log(e.join(" "));
};

// datasource.js

(function() {
"use strict";
XT.dataSource = {
datasourceUrl: DOCUMENT_HOSTNAME,
datasourcePort: 443,
isConnected: !1,
fetch: function(e) {
e = e ? _.clone(e) : {};
var t = this, n = {}, r = e.query.parameters, i, s = function(n) {
var r, i = {}, s;
if (n.isError) {
e && e.error && (i.error = n.reason.data.code, s = XT.Error.clone("xt1001", {
params: i
}), e.error.call(t, s));
return;
}
r = JSON.parse(n.data.rows[0].fetch), e && e.success && e.success.call(t, r);
}, o = function(t) {
var n = e.query.recordType, r = n ? XT.getObjectByName(n) : null, i = r ? r.prototype.relations : [], s = _.find(i, function(e) {
return e.key === t.attribute;
}), o;
t.value instanceof Date ? t.value = t.value.toJSON() : t.value instanceof XM.Model && (t.value = t.value.id), s && s.type === Backbone.HasOne && s.includeInJSON === !0 && (r = XT.getObjectByName(s.relatedModel), o = r.prototype.idAttribute, t.attribute = t.attribute + "." + o);
};
for (i in r) o(r[i]);
return n.requestType = "fetch", n.query = e.query, XT.Request.handle("function/fetch").notify(s).send(n);
},
retrieveRecord: function(e, t, n) {
var r = this, i = {}, s = function(e) {
var t, i = {}, s;
if (e.isError) {
n && n.error && (i.error = e.reason.data.code, s = XT.Error.clone("xt1001", {
params: i
}), n.error.call(r, s));
return;
}
t = JSON.parse(e.data.rows[0].retrieve_record);
if (_.isEmpty(t)) {
n && n.error && (s = XT.Error.clone("xt1007"), n.error.call(r, s));
return;
}
n && n.success && n.success.call(r, t);
};
return i.requestType = "retrieveRecord", i.recordType = e, i.id = t, XT.Request.handle("function/retrieveRecord").notify(s).send(i);
},
commitRecord: function(e, t) {
var n = this, r = {}, i = function(e) {
var r, i = {}, s;
if (e.isError) {
t && t.error && (i.error = e.reason.data.code, s = XT.Error.clone("xt1001", {
params: i
}), t.error.call(n, s));
return;
}
r = JSON.parse(e.data.rows[0].commit_record), t && t.success && t.success.call(n, r);
};
return r.requestType = "commitRecord", r.recordType = e.recordType, r.requery = t.requery, r.dataHash = e.changeSet(), XT.Request.handle("function/commitRecord").notify(i).send(r);
},
dispatch: function(e, t, n, r) {
var i = this, s = {
requestType: "dispatch",
className: e,
functionName: t,
parameters: n
}, o = function(e) {
var t, n = {}, s;
if (e.isError) {
r && r.error && (n.error = e.reason.data.code, s = XT.Error.clone("xt1001", {
params: n
}), r.error.call(i, s));
return;
}
t = JSON.parse(e.data.rows[0].dispatch), r && r.success && r.success.call(i, t);
};
return XT.Request.handle("function/dispatch").notify(o).send(s);
},
connect: function(e) {
if (this.isConnected) {
e && e instanceof Function && e();
return;
}
XT.log("Attempting to connect to the datasource");
var t = this.datasourceUrl, n = this.datasourcePort, r = "https://%@/clientsock".f(t), i = this, s = this.sockDidConnect, o = this.sockDidError;
this._sock = io.connect(r, {
port: n,
secure: !0
}), this._sock.on("connect", function() {}), this._sock.on("ok", function() {
s.call(i, e);
}), this._sock.on("error", function(t) {
o.call(i, t, e);
}), this._sock.on("debug", function(e) {
XT.log("SERVER DEBUG => ", e);
});
},
sockDidError: function(e, t) {
console.warn(e), t && t instanceof Function && t(e);
},
sockDidConnect: function(e) {
XT.log("Successfully connected to the datasource"), this.isConnected = !0, XT.session || (XT.session = Object.create(XT.Session), setTimeout(_.bind(XT.session.start, XT.session), 0)), e && e instanceof Function && e();
},
reset: function() {
if (!this.isConnected) return;
var e = this._sock;
e && (e.disconnect(), this.isConnected = !1), this.connect();
}
};
})();

// date.js

(function() {
"use strict";
XT.date = {
convert: function(e) {
return e.constructor === Date ? e : e.constructor === Array ? new Date(e[0], e[1], e[2]) : e.constructor === Number ? new Date(e) : e.constructor === String ? new Date(e) : typeof e == "object" ? new Date(e.year, e.month, e.date) : NaN;
},
compare: function(e, t) {
return isFinite(e = this.convert(e).valueOf()) && isFinite(t = this.convert(t).valueOf()) ? (e > t) - (e < t) : NaN;
},
compareDate: function(e, t) {
if (!e || !t) return NaN;
var n = new Date(e.valueOf()), r = new Date(t.valueOf());
return n.setHours(0, 0, 0, 0), r.setHours(0, 0, 0, 0), this.compare(n, r);
},
inRange: function(e, t, n) {
return isFinite(e = this.convert(e).valueOf()) && isFinite(t = this.convert(t).valueOf()) && isFinite(n = this.convert(n).valueOf()) ? t <= e && e <= n : NaN;
}
};
})();

// math.js

(function() {
"use strict";
XT.math = {
add: function(e, t, n) {
n = n || 0;
var r = Math.pow(10, n);
return Math.round(e * r + t * r) / r;
},
round: function(e, t) {
t = t || 0;
var n = Math.pow(10, t);
return Math.round(e * n) / n;
},
subtract: function(e, t, n) {
n = n || 0;
var r = Math.pow(10, n);
return Math.round(e * r - t * r) / r;
}
};
})();

// request.js

(function() {
"use strict";
XT.Request = {
send: function(e) {
var t = XT.session.details, n = XT.dataSource._sock, r = this._notify, i = this._handle, s = {
payload: e
}, o;
return !!r && r instanceof Function ? o = function(e) {
r(_.extend(Object.create(XT.Response), e));
} : o = XT.K, s = _.extend(s, t), XT.log("Socket sending: %@".replace("%@", i), s), n.json.emit(i, s, o), this;
},
handle: function(e) {
return this._handle = e, this;
},
notify: function(e) {
var t = Array.prototype.slice.call(arguments).slice(1);
return this._notify = function(n) {
t.unshift(n), e.apply(null, t);
}, this;
}
};
})();

// response.js

(function() {
"use strict";
XT.Response = {};
})();

// session.js

(function() {
"use strict";
XT.Session = {
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
loadSessionObjects: function(e, t) {
var n = this, r, i, s, o, u, a;
return t && t.success && t.success instanceof Function ? a = t.success : a = XT.K, e === undefined && (e = this.ALL), e & this.PRIVILEGES && (r = t ? _.clone(t) : {}, r.success = function(e) {
i = new Backbone.Model, i.get = function(e) {
return _.isBoolean(e) ? e : Backbone.Model.prototype.get.call(this, e);
}, e.forEach(function(e) {
i.set(e.privilege, e.isGranted);
}), n.setPrivileges(i), a();
}, XT.dataSource.dispatch("XT.Session", "privileges", null, r)), e & this.SETTINGS && (s = t ? _.clone(t) : {}, s.success = function(e) {
o = new Backbone.Model, e.forEach(function(e) {
o.set(e.setting, e.value);
}), n.setSettings(o), a();
}, XT.dataSource.dispatch("XT.Session", "settings", null, s)), e & this.SCHEMA && (u = t ? _.clone(t) : {}, u.success = function(e) {
var t = new Backbone.Model(e), r, s, o, u;
n.setSchema(t);
for (r in t.attributes) if (t.attributes.hasOwnProperty(r)) {
s = XM.Model.getObjectByName("XM." + r);
if (s) {
o = t.attributes[r].relations || [];
if (o.length) {
s.prototype.relations = [];
for (u = 0; u < o.length; u++) {
if (o[u].type === "Backbone.HasOne") o[u].type = Backbone.HasOne; else {
if (o[u].type !== "Backbone.HasMany") continue;
o[u].type = Backbone.HasMany;
}
s.prototype.relations.push(o[u]);
}
}
i = t.attributes[r].privileges, i && (s.prototype.privileges = i);
}
}
a();
}, XT.dataSource.dispatch("XT.Session", "schema", "xm", u)), e & this.LOCALE && (XT.lang ? XT.locale.setLanguage(XT.lang) : XT.log("XT.session.loadSessionObjects(): could not find a valid language to load"), a && a instanceof Function && setTimeout(a, 1)), !0;
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
setAvailableSessions: function(e) {
return this.availableSessions = e, this;
},
setDetails: function(e) {
return this.details = e, this;
},
setSchema: function(e) {
return this.schema = e, this;
},
setSettings: function(e) {
return this.settings = e, this;
},
setPrivileges: function(e) {
return this.privileges = e, this;
},
validateSession: function(e, t) {
var n = this, r = function(e) {
n._didValidateSession.call(n, e, t);
};
this.details = e, XT.Request.handle("session").notify(r).send(e);
},
_didValidateSession: function(e, t) {
if (e.code !== 1) return relocate();
this.setDetails(e.data), XT.getStartupManager().start(), t && t instanceof Function && t(e);
},
start: function() {
var e = enyo.getCookie("xtsessioncookie");
try {
e = JSON.parse(e), this.validateSession(e, function() {
XT.app.show();
});
} catch (t) {
XT.Session.logout();
}
},
logout: function() {
XT.Request.handle("function/logout").notify(function() {
relocate();
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
"use strict";
XT.locale = {
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
setHasStrings: function(e) {
return this.hasStrings = e, this;
},
setLang: function(e) {
return this.lang = e, this;
},
setStrings: function(e) {
return this.strings = e, this;
},
setLanguage: function(e) {
if (this.getHasStrings()) return console.log("attempt to set a new language");
this.setLang(e.lang || "en"), this.setStrings(e.strings || {});
},
stringsChanged: function() {
var e = this.getStrings();
e && e instanceof Object && Object.keys(e).length > 0 ? this.setHasStrings(!0) : this.error("something is amiss");
},
loc: function(e) {
var t = this.getStrings();
return t[e] || e.toString();
}
}, XT.stringsFor = function(e, t) {
XT.lang ? console.log("XT.stringsFor(): request to write over current language") : XT.lang = {
lang: e,
strings: t
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
_advancedSearch: "Advanced Search",
_alarms: "Alarms",
_altEmphasisColor: "Alt Emphasis Color",
_alternate: "Alternate",
_alternateAddresses: "Alternate Addresses",
_amount: "Amount",
_apply: "Apply",
_array: "Array",
_assignDate: "Assign Date",
_assigned: "Assigned",
_assignedTo: "Assigned To",
_automatic: "Automatic",
_automaticAllowOverride: "Automatic Allow Override",
_back: "Back",
_balance: "Balance",
_balanceExpensesTotal: "Balance Expenses Total",
_balanceHoursTotal: "Balance Hours Total",
_boolean: "Boolean",
_budgeted: "Budgeted",
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
_commentsEditable: "Comments Editable",
_company: "Company",
_completeDate: "Complete Date",
_concept: "Concept",
_confirmed: "Confirmed",
_contact: "Contact",
_contactRelations: "Contacts",
_contacts: "Contacts",
_countries: "Countries",
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
_deferred: "Deferred",
_delete: "Delete",
_description: "Description",
_description1: "Description1",
_description2: "Description2",
_discard: "Discard",
_disableExport: "Disable Export",
_document: "Document",
_documentDate: "Document Date",
_documentNumber: "Document #",
_documentType: "Document Type",
_dueDate: "Due Date",
_dueDays: "Due Days",
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
_error: "Error",
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
_honorifics: "Honorifics",
_hours: "Hours",
_hrs: "hrs.",
_image: "Image",
_images: "Images",
_incident: "Incident",
_incidentRelations: "Incidents",
_incidents: "Incidents",
_incidentCategories: "Incident Categories",
_incidentCategory: "Incident Category",
_incidentResolution: "Incident Resolution",
_incidentResolutions: "Incident Resolutions",
_incidentSeverities: "Incident Severities",
_incidentSeverity: "Incident Severity",
_incidentStatus: "Status",
_incidentNumberGeneration: "Incident Number Generation",
_incidentsPublicByDefault: "Incidents public by default",
_incidentsShowPublicCheckbox: "Incidents show public checkbox",
_individual: "Individual",
_information: "Information",
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
_menu: "Menu",
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
_none: "None",
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
_opportunitySource: "Opportunity Source",
_opportunitySources: "Opportunity Sources",
_opportunityStage: "Opportunity Stage",
_opportunityStages: "Opportunity Stages",
_opportunityType: "Opportunity Type",
_opportunityTypes: "Opportunity Types",
_open: "Open",
_options: "Options",
_order: "Order",
_orderDate: "Order Date",
_orderNumber: "Order Number",
_ordered: "Ordered",
_organization: "Organization",
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
_priorities: "Priorities",
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
_required: "Required",
_resolved: "Resolved",
_qualifier: "Qualifier",
_quantity: "Quantity",
_recurrences: "Recurrences",
_recurring: "Recurring",
_reference: "Reference",
_refresh: "Refresh",
_relatedTo: "Related To",
_relationships: "Relationships",
_resolution: "Resolution",
_save: "Save",
_saveAndNew: "Save and New",
_schedule: "Schedule",
_search: "Search",
_secondaryContact: "Secondary Contact",
_sense: "Sense",
_series: "Series",
_setup: "Setup",
_severity: "Severity",
_showCompleted: "Show Complete",
_showCompletedOnly: "Show Complete Only",
_showInactive: "Show Inactive",
_source: "Source",
_sourceType: "Source Type",
_stage: "Stage",
_start: "Start",
_startDate: "Start Date",
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
_welcome: "Welcome",
_xtuplePostbooks: "PostBooks",
_addressShared: "There are multiple records sharing this Address.",
_assignedToRequiredAssigned: "Assigned to is required when status is 'Assigned'",
_attributeIsRequired: "{attr} is required.",
_attributeTypeMismatch: "The value of '{attr}' must be type: {type}.",
_attributeNotInSchema: "'{attr}' does not exist in the schema.",
_attributeReadOnly: "Can not edit read only attribute(s).",
_canNotUpdate: "Insufficient privileges to edit the record.",
_changeAll: "Change All",
_changeOne: "Change only this one",
_characteristicContextRequired: "You must set at least one characteristic context to true.",
_datasourceError: "Data source error: {error}",
_duplicateValues: "Duplicate values are not allowed.",
_lengthInvalid: "Length of {attr} must be {length}.",
_logoutConfirmation: "Are you sure you want to log out?",
_nameRequired: "A name is required.",
_noAccountName: "No Account Name",
_noAddress: "No Address",
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
_unsavedChanges: "You have unsaved changes. Do you want to save your work?",
_valueExists: "Record with {attr} of '{value}' already exists.",
_whatToDo: "What would you like to do?"
}), XT.locale.setLanguage(XT.lang);

// string.js

_.extend(String.prototype, {
camelize: function() {
var e = XT.$A(arguments);
return XT.String.camelize(this, e);
},
format: function() {
var e = XT.$A(arguments);
return XT.String.format(this, e);
},
f: function() {
var e = XT.$A(arguments);
return XT.String.format(this, e);
},
loc: function() {
var e = XT.$A(arguments);
return e.unshift(this), XT.String.loc.apply(XT.String, e);
},
trim: function() {
return XT.String.trim(this);
},
pluralize: function() {
return owl.pluralize(this);
}
});

// pluralize.js

typeof owl == "undefined" && (owl = {}), owl.pluralize = function() {
function t(e, t) {
return t.match(/^[A-Z]/) ? e.charAt(0).toUpperCase() + e.slice(1) : e;
}
function n(e) {
e = e.split(",");
var t = e.length, n = {};
for (var r = 0; r < t; r++) n[e[r]] = 1;
return n;
}
function o(n, o, u) {
if (n === "") return "";
if (o === 1) return n;
if (typeof u == "string") return u;
var a = n.toLowerCase();
if (a in e) return t(e[a], n);
if (n.match(/^[A-Z]$/)) return n + "'s";
if (n.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i)) return n;
if (n.match(/^[A-Z][a-z]*ese$/)) return n;
if (a in r) return n;
if (a in i) return t(i[a], n);
var f = s.length;
for (var l = 0; l < f; l++) {
var c = s[l];
if (n.match(c[0])) return n.replace(c[0], c[1]);
}
return n + "s";
}
var e = {}, r = n("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle"), i = {
I: "we",
he: "they",
it: "they",
me: "us",
you: "you",
him: "them",
them: "them",
myself: "ourselves",
yourself: "yourselves",
himself: "themselves",
herself: "themselves",
itself: "themselves",
themself: "themselves",
oneself: "oneselves",
child: "children",
dwarf: "dwarfs",
mongoose: "mongooses",
mythos: "mythoi",
ox: "oxen",
soliloquy: "soliloquies",
trilby: "trilbys",
person: "people",
forum: "forums",
syllabus: "syllabi",
alumnus: "alumni",
genus: "genera",
viscus: "viscera",
stigma: "stigmata"
}, s = [ [ /man$/i, "men" ], [ /([lm])ouse$/i, "$1ice" ], [ /tooth$/i, "teeth" ], [ /goose$/i, "geese" ], [ /foot$/i, "feet" ], [ /zoon$/i, "zoa" ], [ /([tcsx])is$/i, "$1es" ], [ /ix$/i, "ices" ], [ /^(cod|mur|sil|vert)ex$/i, "$1ices" ], [ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, "$1a" ], [ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, "$1a" ], [ /^(alumn|alg|vertebr)a$/i, "$1ae" ], [ /([cs]h|ss|x)$/i, "$1es" ], [ /([aeo]l|[^d]ea|ar)f$/i, "$1ves" ], [ /([nlw]i)fe$/i, "$1ves" ], [ /([aeiou])y$/i, "$1ys" ], [ /(^[A-Z][a-z]*)y$/, "$1ys" ], [ /y$/i, "ies" ], [ /([aeiou])o$/i, "$1os" ], [ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, "$1os" ], [ /o$/i, "oes" ], [ /s$/i, "ses" ] ];
return o.define = function(t, n) {
e[t.toLowerCase()] = n;
}, o;
}();

// string.js

XT.String = {
camelize: function(e) {
var t = e.replace(/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g, function(e, t, n) {
return n ? n.toUpperCase() : "";
}), n = t.charAt(0), r = n.toLowerCase();
return n !== r ? r + t.slice(1) : t;
},
loc: function(e) {
if (!XT.locale) return XT.warn("XT.String.loc(): attempt to localize string but no locale set"), e;
var t = XT.$A(arguments), n = XT.locale.loc(e);
t.shift();
if (!(t.length > 0)) return n;
try {
return XT.String.format(n, t);
} catch (r) {
XT.error("could not localize string, %@".f(e), r);
}
},
format: function(e, t) {
if (arguments.length === 0) return "";
if (arguments.length === 1) return e;
var n = 0, r, i;
for (; n < t.length; ++n) {
i = t[n];
if (!i) continue;
r = typeof i;
if (r === "object") e = XT.String.replaceKeys(e, i); else {
if (r !== "string" && r !== "number") continue;
e = e.replace(/\%@/, i);
}
}
return e;
},
replaceKeys: function(e, t) {
if (typeof e != "string") return "";
if (typeof t != "object") return e;
var n, r, i, s;
for (r in t) t.hasOwnProperty(r) && (i = "{" + r + "}", n = new RegExp(i, "g"), s = t[r], e = e.replace(n, s));
return e;
},
trim: function(t) {
return !!t && t instanceof String ? t.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : "";
},
suffix: function(e) {
while (e.indexOf(".") > 0) e = e.substring(e.indexOf(".") + 1);
return e;
}
};

// startup_task.js

(function() {
"use strict";
var e = XT.StartupTask = function(e) {
var t;
this._properties = {
taskName: "",
waitingList: [],
isComplete: !1,
task: null
};
for (t in e) e.hasOwnProperty(t) && (this._properties[t] = e[t]);
(!this.get("taskName") || this.get("taskName") === "") && this.set("taskName", _.uniqueId("xt_task_")), XT.getStartupManager().registerTask(this);
};
e.prototype.get = function(e) {
var t = this._properties, n = t[e];
return n;
}, e.prototype.set = function(e, t) {
var n = this._properties, r;
if (typeof e == "string" && t) n[e] = t; else if (e && !t) {
t = e;
for (r in t) t.hasOwnProperty(r) && this.set(r, t[r]);
}
return this;
}, e.prototype.checkWaitingList = function(e) {
var t = this.get("waitingList");
t && t.length > 0 && t.indexOf(e) > -1 && this.set("waitingList", t = _.without(t, e));
}, e.prototype.exec = function() {
if (this.get("isComplete")) return !0;
var e = this.get("task");
return !!e && e instanceof Function ? this.get("waitingList").length > 0 ? !1 : (e.call(this), !0) : (this.error("Could not execute without an actual task"), !1);
}, e.prototype.didComplete = function() {
this.set("isComplete", !0), XT.getStartupManager().taskDidComplete(this);
}, e.create = function(e) {
return new XT.StartupTask(e);
};
})(), function() {
"use strict";
var e = XT.StartupTaskManager = function() {
XT.getStartupManager = _.bind(function() {
return this;
}, this), this._properties = {
queue: [],
tasks: {},
completed: [],
isStarted: !1,
callbacks: [],
eachCallbacks: []
};
}, t;
e.prototype.get = function(e) {
var t = this._properties, n = t[e];
return n;
}, e.prototype.set = function(e, t) {
var n = this._properties, r;
if (typeof e == "string" && t) n[e] = t; else if (e && !t) {
t = e;
for (r in t) t.hasOwnProperty(r) && this.set(r, t[r]);
}
return this;
}, e.prototype.registerTask = function(e) {
var t = e.get("taskName"), n = this.get("tasks"), r = this.get("queue");
n[t] || (n[t] = {
task: e
}), this.get("isStarted") ? e.exec() : r.push(e);
}, e.prototype.taskDidComplete = function(e) {
var t = e.get("taskName"), n = this.get("completed"), r = this.get("eachCallbacks") || [], i, s, o = this.get("tasks"), u, a, f = Object.keys(o).length;
n.push(t);
for (i = 0; i < r.length; i++) s = r[i], s && s instanceof Function && s();
for (u in o) o.hasOwnProperty(u) && (a = o[u], u = a.task, u.get("isComplete") || u.checkWaitingList(t));
f > n.length ? this.start() : this.allDone();
}, e.prototype.start = function() {
if (this.get("isStarted")) return !1;
var e = this.get("queue"), t = [], n, r, i = e.length;
if (!e || e.length <= 0) {
this.set("isStarted", !0);
return;
}
for (n = 0; n < i; n += 1) r = e.shift(), r.exec() || t.push(r);
t.length > 0 ? this.set("queue", t) : this.start();
}, e.prototype.registerCallback = function(e, t) {
var n = t ? this.get("eachCallbacks") : this.get("callbacks");
n.push(e);
}, e.prototype.allDone = function() {
var e = this.get("callbacks") || [], t;
while (e.length > 0) t = e.shift(), t && t instanceof Function && t();
}, t = new XT.StartupTaskManager;
}();

// model.js

(function() {
"use strict";
XM.Model = Backbone.RelationalModel.extend({
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
var e = this.toJSON(), t = function(e) {
var n = null, r, i, s;
if (e && e.dataState !== "read") {
n = {};
for (i in e) if (e[i] instanceof Array) {
n[i] = [];
for (r = 0; r < e[i].length; r++) s = t(e[i][r]), s && n[i].push(s);
} else n[i] = e[i];
}
return n;
};
return t(e);
},
didChange: function(e, t) {
e = e || {}, t = t || {};
var n = XM.Model, r = this.getStatus(), i;
if (t.force) return;
if (r & n.READY) for (i in this.changed) this.changed.hasOwnProperty(i) && this.prime[i] === undefined && (this.prime[i] = this.previous(i));
r === n.READY_CLEAN && this.setStatus(n.READY_DIRTY);
},
didDestroy: function() {
var e = XM.Model;
this.setStatus(e.DESTROYED_CLEAN), this.clear({
silent: !0
});
},
didError: function(e, t) {
e = e || {}, this.lastError = t, XT.log(t);
},
isValid: function() {
var e = {
validateSave: !0
};
return !this.validate || !this.validate(this.attributes, e);
},
original: function(e) {
return this.prime[e] || this.get(e);
},
originalAttributes: function() {
return _.defaults(_.clone(this.prime), _.clone(this.attributes));
},
destroy: function(e) {
e = e ? _.clone(e) : {};
var t = this.getClass(), n = t.canDelete(this), r = e.success, i = this, s, o = XM.Model, u = this.getParent(!0), a = [], f = function(e) {
_.each(e.relations, function(t) {
var n, r = e.attributes[t.key];
if (r && r.models && t.type === Backbone.HasMany) {
for (n = 0; n < r.models.length; n += 1) f(r.models[n]);
a = _.union(a, r.models);
}
});
};
return u && u.canUpdate(this) || !u && n ? (this.setStatus(o.DESTROYED_DIRTY, {
cascade: !0
}), this._wasNew = this.isNew(), !u && n ? (f(this), this.setStatus(o.BUSY_DESTROYING, {
cascade: !0
}), e.wait = !0, e.success = function(t) {
var n;
for (n = 0; n < a.length; n += 1) a[n].didDestroy();
XT.log("Destroy successful"), r && r(i, t, e);
}, s = Backbone.Model.prototype.destroy.call(this, e), delete this._wasNew, s) : !0) : (XT.log("Insufficient privileges to destroy"), !1);
},
fetch: function(e) {
e = e ? _.clone(e) : {};
var t = this, n = XM.Model, r = e.success, i = this.getClass();
return i.canRead() ? (this.setStatus(n.BUSY_FETCHING, {
cascade: !0
}), e.cascade = !0, e.success = function(i) {
t.setStatus(n.READY_CLEAN, e), XT.log("Fetch successful"), r && r(t, i, e);
}, Backbone.Model.prototype.fetch.call(this, e)) : (XT.log("Insufficient privileges to fetch"), !1);
},
fetchId: function(e) {
e = _.defaults(e ? _.clone(e) : {}, {
force: !0
});
var t = this, n;
this.id || (e.success = function(n) {
e.force = !0, t.set(t.idAttribute, n, e);
}, XT.dataSource.dispatch("XM.Model", "fetchId", this.recordType, e)), e && e.cascade && _.each(this.relations, function(r) {
n = t.attributes[r.key], n && r.type === Backbone.HasMany && n.models && _.each(n.models, function(t) {
t.fetchId && t.fetchId(e);
});
});
},
findExisting: function(e, t, n) {
return this.getClass().findExisting.call(this, e, t, n);
},
getAttributeNames: function() {
return this.getClass().getAttributeNames.call(this);
},
getClass: function() {
return Backbone.Relational.store.getObjectByName(this.recordType);
},
getParent: function(e) {
var t, n, r = _.find(this.relations, function(e) {
if (e.reverseRelation && e.isAutoRelation) return !0;
});
return t = r && r.key ? this.get(r.key) : !1, t && e && (n = t.getParent(e)), n || t;
},
getStatus: function() {
return this.status;
},
getStatusString: function() {
var e = [], t = this.getStatus(), n;
for (n in XM.Model) XM.Model.hasOwnProperty(n) && n.match(/[A-Z_]$/) && XM.Model[n] === t && e.push(n);
return e.join(" ");
},
getValue: function(e) {
var t, n, r;
if (e.indexOf(".") !== -1) {
t = e.split("."), n = this;
for (r = 0; r < t.length; r++) {
n = n.getValue(t[r]);
if (n && n instanceof Date) break;
if (n && typeof n == "object") continue;
if (typeof n == "string") break;
n = "";
break;
}
return n;
}
return _.has(this.attributes, e) ? this.attributes[e] : _.isFunction(this[e]) ? this[e]() : this[e];
},
initialize: function(e, t) {
e = e || {}, t = t || {};
var n, r = XM.Model, i = this.getStatus();
if (_.isEmpty(this.recordType)) throw "No record type defined";
if (i !== r.EMPTY) throw "Model may only be intialized from a status of EMPTY.";
this.prime = {}, this.privileges = this.privileges || {}, this.readOnlyAttributes = this.readOnlyAttributes ? this.readOnlyAttributes.slice(0) : [], this.requiredAttributes = this.requiredAttributes ? this.requiredAttributes.slice(0) : [];
if (t.isNew) {
n = this.getClass();
if (!n.canCreate()) throw "Insufficent privileges to create a record.";
this.setStatus(r.READY_NEW, {
cascade: !0
}), this.autoFetchId && this.fetchId({
cascade: !0
});
} else t.force && this.setStatus(r.READY_CLEAN);
this.idAttribute && this.setReadOnly(this.idAttribute), this.idAttribute && !_.contains(this.requiredAttributes, this.idAttribute) && this.requiredAttributes.push(this.idAttribute), this.setReadOnly("type"), this.on("change", this.didChange), this.on("error", this.didError), this.on("destroy", this.didDestroy);
},
isNew: function() {
var e = XM.Model;
return this.getStatus() === e.READY_NEW || this._wasNew || !1;
},
isDirty: function() {
var e = this.getStatus(), t = XM.Model;
return e === t.READY_NEW || e === t.READY_DIRTY;
},
isReadOnly: function(e) {
var t, n;
if (!_.isString(e) && !_.isObject(e) || this.readOnly) n = this.readOnly; else if (_.isObject(e)) {
for (t in e) e.hasOwnProperty(t) && _.contains(this.readOnlyAttributes, t) && (n = !0);
n = !1;
} else n = _.contains(this.readOnlyAttributes, e);
return n;
},
isRequired: function(e) {
return _.contains(this.requiredAttributes, e);
},
parse: function(e) {
var t = XT.Session, n, r, i = function(e) {
e = r(e);
}, s = function(e, t) {
var n = XT.session.getSchema().get(e).columns;
return _.find(n, function(e) {
return e.name === t;
});
};
return r = function(e) {
var o;
for (o in e) e.hasOwnProperty(o) && (_.isArray(e[o]) ? _.each(e[o], i) : _.isObject(e[o]) ? e[o] = r(e[o]) : (n = s(e.type, o), n && n.category && n.category === t.DB_DATE && e[o] !== null && (e[o] = new Date(e[o]))));
return e;
}, r(e);
},
save: function(e, t, n) {
n = n ? _.clone(n) : {};
var r = {}, i = this, s = XM.Model, o, u, a = this.getStatus();
if (this.getParent()) return XT.log("You must save on the root level model of this relation"), !1;
_.isObject(e) || _.isEmpty(e) ? (r = e, n = t ? _.clone(t) : {}) : _.isString(e) && (r[e] = t);
if (this.isDirty() || r) {
o = n.success, n.wait = !0, n.cascade = !0, n.validateSave = !0, n.success = function(e) {
i.setStatus(s.READY_CLEAN, n), XT.log("Save successful"), o && o(i, e, n);
};
if (_.isObject(e) || _.isEmpty(e)) t = n;
return this.setStatus(s.BUSY_COMMITTING, {
cascade: !0
}), u = Backbone.Model.prototype.save.call(this, e, t, n), u || this.setStatus(a, {
cascade: !0
}), u;
}
return XT.log("No changes to save"), !1;
},
setReadOnly: function(e, t) {
return _.isString(e) ? (t = _.isBoolean(t) ? t : !0, t && !_.contains(this.readOnlyAttributes, e) ? this.readOnlyAttributes.push(e) : !t && _.contains(this.readOnlyAttributes, e) && (this.readOnlyAttributes = _.without(this.readOnlyAttributes, e))) : (e = _.isBoolean(e) ? e : !0, this.readOnly = e), this;
},
setStatus: function(e, t) {
var n = XM.Model, r, i = this, s, o = {
force: !0
};
if (this.isLocked() || this.status === e) return;
this.acquire(), this.status = e, s = this.getParent();
if (e === n.READY_NEW || e === n.READY_CLEAN) this.prime = {};
return t && t.cascade && _.each(this.relations, function(n) {
r = i.attributes[n.key], r && r.models && n.type === Backbone.HasMany && _.each(r.models, function(n) {
n.setStatus && n.setStatus(e, t);
});
}), e === n.READY_NEW ? this.set("dataState", "create", o) : e === n.READY_CLEAN ? this.set("dataState", "read", o) : e === n.READY_DIRTY ? this.set("dataState", "update", o) : e === n.DESTROYED_DIRTY && this.set("dataState", "delete", o), s && s.trigger("change", this, e, t), this.release(), this.trigger("statusChange", this, e, t), this;
},
sync: function(e, t, n) {
n = n ? _.clone(n) : {};
var r = this, i = n.id || t.id, s = this.recordType, o, u = n.error;
n.error = function(e) {
var i = XM.Model;
r.setStatus(i.ERROR), u && u(t, e, n);
};
if (e === "read" && s && i && n.success) o = XT.dataSource.retrieveRecord(s, i, n); else if (e === "create" || e === "update" || e === "delete") o = XT.dataSource.commitRecord(t, n);
return o || !1;
},
validate: function(e, t) {
e = e || {}, t = t || {};
if (t.force) return;
var n = this, r, i, s = XM.Model, o = XT.Session, u = _.keys(e), a = _.pick(this.originalAttributes(), u), f = this.getStatus(), l, c, h, p, d = {}, v = this.recordType.replace(/\w+\./i, ""), m = XT.session.getSchema().get(v).columns, g = function(e, t, r) {
var i;
return i = _.find(n.relations, function(t) {
return t.key === e && t.type === r;
}), i ? _.isObject(t) : !1;
}, y = function(e) {
return _.find(m, function(t) {
return t.name === e;
});
};
if (f === s.ERROR || f === s.EMPTY || f & s.DESTROYED) return XT.Error.clone("xt1009", {
params: {
status: this.getStatusString()
}
});
for (l in e) if (e.hasOwnProperty(l) && !_.isNull(e[l]) && !_.isUndefined(e[l])) {
d.attr = ("_" + l).loc(), c = e[l], p = y(l), h = p ? p.category : !1;
switch (h) {
case o.DB_BYTEA:
case o.DB_UNKNOWN:
case o.DB_STRING:
if (!_.isString(c)) return d.type = "_string".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
case o.DB_NUMBER:
if (!_.isNumber(c) && !g(l, c, Backbone.HasOne)) return d.type = "_number".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
case o.DB_DATE:
if (!_.isDate(c)) return d.type = "_date".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
case o.DB_BOOLEAN:
if (!_.isBoolean(c)) return d.type = "_boolean".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
case o.DB_ARRAY:
if (!_.isArray(c) && !g(l, c, Backbone.HasMany)) return d.type = "_array".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
case o.DB_COMPOUND:
if (!_.isObject(c)) return d.type = "_object".loc(), XT.Error.clone("xt1003", {
params: d
});
break;
default:
return XT.Error.clone("xt1002", {
params: d
});
}
}
if (t.validateSave) {
for (r = 0; r < this.requiredAttributes.length; r += 1) {
c = e[this.requiredAttributes[r]];
if (c === undefined || c === null) return d.attr = ("_" + this.requiredAttributes[r]).loc(), XT.Error.clone("xt1004", {
params: d
});
}
i = this.validateSave(e, t);
if (i) return i;
}
if (f & s.READY && !_.isEqual(e, a)) {
for (l in e) if (e[l] !== this.original(l) && this.isReadOnly(l)) return XT.Error.clone("xt1005");
if (!this.canUpdate()) return XT.Error.clone("xt1010");
}
return this.validateEdit(e, t);
},
validateEdit: function(e, t) {},
validateSave: function(e, t) {}
}), _.extend(XM.Model, {
canCreate: function() {
return XM.Model.canDo.call(this, "create");
},
canRead: function() {
var e = this.prototype.privileges, t = XT.session.privileges, n = !1;
return _.isEmpty(e) ? !0 : (t && t.get && (n = e.all && e.all.read ? t.get(e.all.read) : !1, n || (n = e.all && e.all.update ? t.get(e.all.update) : !1), n || (n = e.personal && e.personal.read ? t.get(e.personal.read) : !1), n || (n = e.personal && e.personal.update ? t.get(e.personal.update) : !1)), n);
},
canUpdate: function(e) {
return XM.Model.canDo.call(this, "update", e);
},
canDelete: function(e) {
return XM.Model.canDo.call(this, "delete", e);
},
canDo: function(e, t) {
var n = this.prototype.privileges, r = XT.session.privileges, i = !1, s = !1, o = XT.session.details.username, u, a, f, l = XM.Model, c = t && t.getStatus ? t.getStatus() : l.READY;
if (!(c & l.READY)) return !1;
if (_.isEmpty(n)) return !0;
r && r.get && (n.all && n.all[e] && (i = r.get(n.all[e])), !i && n.personal && n.personal[e] && (s = r.get(n.personal[e])));
if (!i && s && t) {
a = 0, f = n.personal && n.personal.properties ? n.personal.properties : [], s = !1;
while (!s && a < f.length) u = t.original(f[a]), u = typeof u == "object" ? u.get("username") : u, s = u === o, a += 1;
}
return i || s;
},
getAttributeNames: function() {
var e = this.recordType || this.prototype.recordType, t = e.replace(/\w+\./i, "");
return _.pluck(XT.session.getSchema().get(t).columns, "name");
},
getObjectByName: function(e) {
return Backbone.Relational.store.getObjectByName(e);
},
getSearchableAttributes: function() {
var e = this.prototype.recordType, t = e.split(".")[1], n = XT.session.getSchema().get(t), r = [], i, s;
for (s = 0; s < n.columns.length; s++) i = n.columns[s].name, n.columns[s].category === "S" && r.push(i);
return r;
},
findExisting: function(e, t, n) {
var r = this.recordType || this.prototype.recordType, i = [ r, e, t, this.id || -1 ];
return XT.dataSource.dispatch("XM.Model", "findExisting", i, n), XT.log("XM.Model.findExisting for: " + r), this;
},
findOrCreate: function(e, t) {
return t = t ? _.clone(t) : {}, t.force = !0, Backbone.RelationalModel.findOrCreate.call(this, e, t);
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
var e = Backbone.Relation.prototype.setRelated;
Backbone.Relation.prototype.setRelated = function(t, n) {
n = n ? _.clone(n) : {}, n.force = !0, n.silent = !1, e.call(this, t, n);
}, Backbone.HasMany.prototype.handleAddition = function(e, t, n) {
t = t || {};
if (!(e instanceof Backbone.Model)) return;
var r = this;
n = this.sanitizeOptions(n), _.each(this.getReverseRelations(e), function(e) {
e.addRelated(this.instance, n);
}, this), Backbone.Relational.eventQueue.add(function() {
n.silentChange || (r.instance.trigger("add:" + r.key, e, r.related, n), r.instance.trigger("change", e, r.related, n));
});
};
})();

// collection.js

(function() {
"use strict";
XM.Collection = Backbone.Collection.extend({
add: function(e, t) {
var n = Backbone.Collection.prototype.add.call(this, e, t), r, i = XM.Model;
for (r = 0; r < n.models.length; r += 1) n.models[r].setStatus(i.READY_CLEAN);
return n;
},
getObjectByName: function(e) {
return Backbone.Relational.store.getObjectByName(e);
},
fetch: function(e) {
return e = e ? _.clone(e) : this.orderAttribute ? {
query: this.orderAttribute
} : {}, e.force = !0, Backbone.Collection.prototype.fetch.call(this, e);
},
sync: function(e, t, n) {
return n = n ? _.clone(n) : {}, n.query = n.query || {}, n.query.recordType = t.model.prototype.recordType, e === "read" && n.query.recordType && n.success ? XT.dataSource.fetch(n) : !1;
},
orderAttribute: null
});
})();

// document.js

(function() {
"use strict";
XM.Document = XM.Model.extend({
documentKey: "number",
enforceUpperKey: !0,
keyIsString: !0,
numberPolicy: null,
numberPolicySetting: null,
destroy: function() {
var e = XM.Model, t = this.getStatus();
t === e.READY_NEW && this._number && this.releaseNumber(), XM.Model.prototype.destroy.apply(this, arguments);
},
documentKeyDidChange: function(e, t, n) {
var r = XM.Model, i = this, s = this.getStatus(), o = t;
n = n || {}, this.keyIsString && t && t.toUpperCase && (o = o.toUpperCase());
if (n.force || !(s & r.READY)) return;
if (this.enforceUpperKey && t !== o) {
this.set(this.documentKey, o);
return;
}
s === r.READY_NEW && this._number && this._number !== t && this.releaseNumber(), t && this.isDirty() && !this._number && (n.success = function(e) {
var r, s = {};
e && (s.attr = ("_" + i.documentKey).loc(), s.value = t, r = XT.Error.clone("xt1008", {
params: s
}), i.trigger("error", i, r, n));
}, this.findExisting(this.documentKey, t, n));
},
initialize: function(e, t) {
XM.Model.prototype.initialize.call(this, e, t);
var n = XM.Document, r;
e = e || {}, this.numberPolicy || (this.numberPolicySetting && (r = XT.session.getSettings().get(this.numberPolicySetting)), this.numberPolicy = r || n.MANUAL_NUMBER), t && t.isNew && (this.numberPolicy === n.AUTO_NUMBER || this.numberPolicy === n.AUTO_OVERRIDE_NUMBER) && this.fetchNumber(), _.contains(this.requiredAttributes, this.documentKey) || this.requiredAttributes.push(this.documentKey), this.on("change:" + this.documentKey, this.documentKeyDidChange), this.on("statusChange", this.statusDidChange);
},
fetchNumber: function() {
var e = this, t = {};
return t.success = function(t) {
e._number = e.keyIsString && t.toString() ? t.toString() : t, e.set(e.documentKey, e._number, {
force: !0
});
}, XT.dataSource.dispatch("XM.Model", "fetchNumber", this.recordType, t), console.log("XM.Model.fetchNumber for: " + this.recordType), this;
},
releaseNumber: function() {
return XT.dataSource.dispatch("XM.Model", "releaseNumber", [ this.recordType, this._number ]), this._number = null, console.log("XM.Model.releaseNumber for: " + this.recordType), this;
},
save: function(e, t, n) {
var r = this, i = XM.Model, s = this.get(this.documentKey), o = this.original(this.documentKey), u = this.getStatus(), a = {};
u === i.READY_NEW && s && !this._number || u === i.READY_DIRTY && s !== o ? (a.success = function(i) {
var o, u = {};
i === 0 ? XM.Model.prototype.save.call(r, e, t, n) : (u.attr = ("_" + r.documentKey).loc(), u.value = s, o = XT.Error.clone("xt1008", {
params: u
}), r.trigger("error", r, o, n));
}, a.error = Backbone.wrapError(null, r, n), this.findExisting(this.documentKey, s, a)) : XM.Model.prototype.save.call(r, e, t, n);
},
statusDidChange: function() {
var e = XM.Model, t = XM.Document;
this.numberPolicy === t.AUTO_NUMBER && this.getStatus() === e.READY_CLEAN && this.setReadOnly(this.documentKey);
}
}), _.extend(XM.Document, {
MANUAL_NUMBER: "M",
AUTO_NUMBER: "A",
AUTO_OVERRIDE_NUMBER: "O"
});
})();

// comment.js

(function() {
"use strict";
XM.CommentType = XM.Model.extend({
recordType: "XM.CommentType",
defaults: {
commentsEditable: !1,
order: 0
},
requiredAttributes: [ "name", "commentType", "commentsEditable", "order" ]
}), XM.Comment = XM.Model.extend({
readOnlyAttributes: [ "created", "createdBy" ],
defaults: function() {
var e = {}, t = XT.session.getSettings().get("CommentPublicDefault");
return e.created = new Date, e.createdBy = XM.currentUser.get("username"), e.isPublic = t || !1, e;
},
initialize: function(e, t) {
XM.Model.prototype.initialize.apply(this, arguments), this.on("statusChange", this.statusChanged), this.statusChanged();
},
isReadOnly: function() {
var e = this.get("commentType"), t = this.getStatus() === XM.Model.READY_NEW, n = t || e && e.get("commentsEditable");
return !n || XM.Model.prototype.isReadOnly.apply(this, arguments);
},
statusChanged: function() {
var e = this.getStatus(), t = XM.Model;
e === t.READY_CLEAN && this.setReadOnly("commentType");
}
}), XM.CommentTypeCollection = XM.Collection.extend({
model: XM.CommentType
});
})();

// characteristic.js

(function() {
"use strict";
XM.Characteristic = XM.Document.extend({
recordType: "XM.Characteristic",
documentKey: "name",
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
var e = this.get("characteristicType");
switch (e) {
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
var e = this.getStatus(), t = XM.Model;
e !== t.READY_NEW && this.setReadOnly("characteristicType", !0), XM.Document.prototype.statusDidChange.apply(this, arguments);
},
validateSave: function() {
var e = this.get("options").models, t = [], n;
if (!(this.get("isItems") || this.get("isContacts") || this.get("isAddresses") || this.get("isAccounts"))) return XT.Error.clone("xt2002");
for (n = 0; n < e.length; n += 1) t.push(e[n].get("value"));
if (!_.isEqual(t, _.unique(t))) return XT.Error.clone("xt2003");
}
}), _.extend(XM.Characteristic, {
TEXT: 0,
LIST: 1,
DATE: 2
}), XM.CharacteristicOption = XM.Model.extend({
recordType: "XM.CharacteristicOption",
defaults: {
order: 0
},
requiredAttributes: [ "order" ]
}), XM.CharacteristicAssignment = XM.Model.extend({
initialize: function() {
XM.Model.prototype.initialize.apply(this, arguments), this.on("change:characteristic", this.characteristicDidChange);
},
characteristicDidChange: function(e, t, n) {
var r = this.getStatus(), i = XM.Model;
if (n && n.force || !(r & i.READY)) return;
this.set("value", "");
}
}), XM.CharacteristicCollection = XM.Collection.extend({
model: XM.Characteristic
});
})();

// alarm.js

(function() {
"use strict";
XM.Alarm = XM.Document.extend({
numberPolicy: XM.Document.AUTO_NUMBER,
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:offset change:qualifier change:time", this.alarmDidChange);
},
alarmDidChange: function(e, t, n) {
var r = this.getStatus(), i = XM.Model, s, o, u, a;
if (n && n.force || !(r & i.READY)) return;
s = this.get("offset"), o = this.get("qualifier"), u = this.get("time"), a = this.get("trigger");
if (s) switch (o) {
case "MB":
case "MA":
o.indexOf("B") !== -1 ? a.setMinutes(u.getMinutes() - s) : a.setMinutes(u.getMinutes() + s);
break;
case "HB":
case "HA":
o.indexOf("B") !== -1 ? a.setHours(u.getHours() - s) : a.setHours(u.getHours() + s);
break;
default:
o.indexOf("B") !== -1 ? a.setDate(u.getDate() - s) : a.setDate(u.getDate() + s);
} else a.setMinutes(u.getMinutes());
}
});
})();

// account.js

(function() {
"use strict";
XM.AccountDocument = XM.Document.extend({
numberPolicySetting: "CRMAccountNumberGeneration",
requiredAttributes: [ "number" ],
documentKeyDidChange: function() {
var e = this.recordType;
this.recordType = "XM.Account", XM.Document.prototype.documentKeyDidChange.apply(this, arguments), this.recordType = e;
}
}), XM.Account = XM.AccountDocument.extend({
recordType: "XM.Account",
defaults: {
owner: XM.currentUser,
isActive: !0,
accountType: "O"
},
requiredAttributes: [ "accountType", "isActive", "number", "name" ],
validateEdit: function(e) {
if (e.parent && e.parent.id === this.id) return XT.Error.clone("xt2006");
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
readOnly: !0
}), XM.AccountInfoCollection = XM.Collection.extend({
model: XM.AccountInfo
});
})();

// address.js

(function() {
"use strict";
XM.Country = XM.Model.extend({
recordType: "XM.Country",
requiredAttributes: [ "abbreviation", "currencyAbbreviation", "name" ],
validateEdit: function(e) {
var t = {};
if (e.abbreviation && e.abbreviation.length !== 2) return t.attr = "_abbreviation".loc(), t.length = "2", XT.Error.clone("xt1006", {
params: t
});
if (e.currencyAbbreviation && e.currencyAbbreviation.length !== 3) return t.attr = "_currencyAbbreviation".loc(), t.length = "3", XT.Error.clone("xt1006", {
params: t
});
}
}), XM.State = XM.Model.extend({
recordType: "XM.State",
requiredAttributes: [ "abbreviation", "country", "name" ]
}), XM.Address = XM.Document.extend({
recordType: "XM.Address",
numberPolicy: XM.Document.AUTO_NUMBER,
format: function(e) {
return XM.Address.format(this, e);
},
formatShort: function() {
return XM.Address.formatShort(this);
},
useCount: function(e) {
return console.log("XM.Address.useCount for: " + this.id), XT.dataSource.dispatch("XM.Address", "useCount", this.id, e), this;
}
}), _.extend(XM.Address, {
findExisting: function(e, t, n, r, i, s, o, u) {
var a = {
type: "Address",
line1: e,
line2: t,
line3: n,
city: r,
state: i,
postalcode: s,
country: o
};
return XT.dataSource.dispatch("XM.Address", "findExisting", a, u), console.log("XM.Address.findExisting"), this;
},
format: function() {
var e = [], t, n, r, i, s, o, u, a, f, l = "", c;
if (typeof arguments[0] == "object") t = "", n = arguments[0].get("line1"), r = arguments[0].get("line2"), i = arguments[0].get("line3"), s = arguments[0].get("city"), o = arguments[0].get("state"), u = arguments[0].get("postalCode"), a = arguments[0].get("country"), f = (arguments[1] === undefined ? !1 : arguments[1]) ? "<br />" : "\n"; else {
if (typeof arguments[0] != "string") return !1;
t = arguments[0], n = arguments[1], r = arguments[2], i = arguments[3], s = arguments[4], o = arguments[5], u = arguments[6], a = arguments[7], f = (arguments[8] === undefined ? !1 : arguments[8]) ? "<br />" : "\n";
}
t && e.push(t), n && e.push(n), r && e.push(r), i && e.push(i);
if (s || o || u) c = (s || "") + (s && (o || u) ? ", " : "") + (o || "") + (o && u ? " " : "") + (u || ""), e.push(c);
return a && e.push(a), e.length && (l = e.join(f)), l;
},
formatShort: function(e) {
var t, n, r, i;
return typeof e == "object" ? (n = e.get("city") || "", r = e.get("state") || "", i = e.get("country") || "") : (n = arguments[0] || "", r = arguments[1] || "", i = arguments[2] || ""), t = n + (n && r ? ", " : "") + r, t += (t ? " " : "") + i, t;
},
CHANGE_ONE: 0,
CHANGE_ALL: 1
}), XM.AddressComment = XM.Model.extend({
recordType: "XM.AddressComment"
}), XM.AddressCharacteristic = XM.Model.extend({
recordType: "XM.AddressCharacteristic"
}), XM.AddressInfo = XM.Document.extend({
recordType: "XM.AddressInfo",
numberPolicy: XM.Document.AUTO_NUMBER,
copy: function() {
var e = _.clone(this.attributes);
return delete e.id, delete e.dataState, delete e.number, delete e.type, delete e.isActive, new XM.AddressInfo(e, {
isNew: !0
});
},
format: function(e) {
return XM.Address.format(this, e);
},
formatShort: function() {
return XM.Address.formatShort(this);
},
isEmpty: function() {
return _.isEmpty(this.get("line1")) && _.isEmpty(this.get("line2")) && _.isEmpty(this.get("line3")) && _.isEmpty(this.get("city")) && _.isEmpty(this.get("state")) && _.isEmpty(this.get("postalCode")) && _.isEmpty(this.get("country"));
},
useCount: function(e) {
return console.log("XM.Address.useCount for: " + this.id), XT.dataSource.dispatch("XM.Address", "useCount", this.id, e), this;
}
}), XM.AddressCheckMixin = {
addressChanged: function() {
var e = this.get("address"), t = e ? e.getStatus() : !1, n = this.getStatus(), r = XM.Model;
t === r.READY_DIRTY && n === r.READY_CLEAN && this.setStatus(r.READY_DIRTY);
},
didChange: function() {
var e, t = this;
XM.Document.prototype.didChange.apply(this, arguments), this.changed.address && (e = this.previous("address"), e && e.off("change", this.addressChanged, t), e = this.get("address"), e && e.on("change", this.addressChanged, t));
},
destroy: function() {
var e = this.get("address");
e.isNew() && e.releaseNumber(), XM.Document.prototype.destroy.apply(this, arguments);
},
initialize: function(e, t) {
XM.Document.prototype.initialize.apply(this, arguments), t && t.isNew && this.get("address") === null && this.set("address", new XM.AddressInfo(null, {
isNew: !0
}));
},
save: function(e, t, n) {
var r = this, i = this.get("address"), s = i ? i.getStatus() : !1, o = this.isNew() ? 0 : 1, u = {}, a = {}, f = {}, l = this.isValid(), c = XM.Model;
if (l && i && s !== c.READY_CLEAN) {
_.isObject(e) || _.isEmpty(e) ? n = t ? _.clone(t) : {} : n = n ? _.clone(n) : {}, u.success = function(i) {
XM.Document.prototype.save.call(r, e, t, n);
};
if (i.isEmpty()) i.isNew() && i.releaseNumber(), this.set("address", null); else {
if (i.isDirty() && !n.existingChecked) {
a.success = function(s) {
s && (i.set("id", s, {
force: !0
}), i.status = c.READY_CLEAN), n.existingChecked = !0;
if (_.isObject(e) || _.isEmpty(e)) t = n;
r.save(e, t, n);
}, XM.Address.findExisting(i.get("line1"), i.get("line2"), i.get("line3"), i.get("city"), i.get("state"), i.get("postalCode"), i.get("country"), a);
return;
}
if (i.isNew()) {
i.save(null, u);
return;
}
if (i.isDirty()) {
f.success = function(e) {
var t, s = XM.Address, a, f;
if (e > o) {
if (!_.isNumber(n.address)) {
t = XT.Error.clone("xt2007"), r.trigger("error", r, t, n);
return;
}
if (n.address !== s.CHANGE_ALL) {
a = function() {
var e = f.id, t = f.get("number");
e && t && (f.off("change:id change:number", a), r.set("address", f), f.save(null, u));
}, f = i.copy(), f.on("change:id change:number", a), a();
return;
}
}
i.save(null, u);
}, i.useCount(f);
return;
}
}
}
XM.Document.prototype.save.call(r, e, t, n);
}
}, XM.AddressInfoCollection = XM.Collection.extend({
model: XM.AddressInfo
}), XM.CountryCollection = XM.Collection.extend({
model: XM.Country
}), XM.StateCollection = XM.Collection.extend({
model: XM.State
});
})();

// contact.js

(function() {
"use strict";
XM.Honorific = XM.Document.extend({
recordType: "XM.Honorific",
documentKey: "code",
enforceUpperKey: !1
}), XM.Contact = XM.Document.extend({
recordType: "XM.Contact",
nameAttribute: "getName",
numberPolicy: XM.Document.AUTO_NUMBER,
defaults: {
owner: XM.currentUser,
isActive: !0
},
getName: function() {
var e = [], t = this.get("firstName"), n = this.get("middleName"), r = this.get("lastName"), i = this.get("suffix");
return t && e.push(t), n && e.push(n), r && e.push(r), i && e.push(i), e.join(" ");
},
validateSave: function(e, t) {
if (!e.firstName && !e.lastName) return XT.Error.clone("xt2004");
}
}), XM.Contact = XM.Contact.extend(XM.AddressCheckMixin), XM.ContactEmail = XM.Model.extend({
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
"use strict";
XM.Currency = XM.Document.extend({
recordType: "XM.Currency",
documentKey: "name",
enforceUpperKey: !1,
defaults: {
isBase: !1
},
requiredAttributes: [ "abbreviation", "isBase", "name", "symbol" ],
abbreviationDidChange: function(e, t, n) {
var r = XM.Model, i = this, s = this.getStatus(), o = {};
if (n && n.force || !(s & r.READY)) return;
o.success = function(e) {
var r, s = {};
e && (s.attr = "_abbreviation".loc(), s.value = t, r = XT.Error.clone("xt1008", {
params: s
}), i.trigger("error", i, r, n));
}, this.findExisting("abbreviation", t, o);
},
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:abbreviation", this.abbreviationDidChange);
},
save: function(e, t, n) {
var r = this, i = XM.Model, s = this.get("abbreviation"), o = this.original("abbreviation"), u = this.getStatus(), a = {};
u === i.READY_NEW || u === i.READY_DIRTY && s !== o ? (a.success = function(i) {
var o, u = {};
i === 0 ? XM.Document.prototype.save.call(r, e, t, n) : (u.attr = "_abbreviation".loc(), u.value = s, o = XT.Error.clone("xt1008", {
params: u
}), r.trigger("error", r, o, n));
}, a.error = Backbone.wrapError(null, r, n), this.findExisting("abbreviation", s, a)) : XM.Document.prototype.save.call(r, e, t, n);
},
toString: function() {
return this.get("abbreviation") + " - " + this.get("symbol");
},
validateEdit: function(e) {
var t = {};
if (e.abbreviation && e.abbreviation.length !== 3) return t.attr = "_abbreviation".loc(), t.length = "3", XT.Error.clone("xt1006", {
params: t
});
}
}), XM.CurrencyCollection = XM.Collection.extend({
model: XM.Currency
});
})();

// file.js

(function() {
"use strict";
XM.FileInfo = XM.Model.extend({
recordType: "XM.FileInfo"
});
})();

// image.js

(function() {
"use strict";
XM.ImageInfo = XM.Model.extend({
recordType: "XM.ImageInfo"
});
})();

// incident.js

(function() {
"use strict";
XM.IncidentCategory = XM.Document.extend({
recordType: "XM.IncidentCategory",
documentKey: "name",
enforceUpperKey: !1,
defaults: {
order: 0
},
requiredAttributes: [ "order" ],
orderAttribute: {
orderBy: [ {
attribute: "order"
} ]
}
}), XM.IncidentSeverity = XM.Document.extend({
recordType: "XM.IncidentSeverity",
documentKey: "name",
enforceUpperKey: !1,
defaults: {
order: 0
},
requiredAttributes: [ "order" ],
orderAttribute: {
orderBy: [ {
attribute: "order"
} ]
}
}), XM.IncidentResolution = XM.Model.extend({
recordType: "XM.IncidentResolution",
documentKey: "name",
enforceUpperKey: !1,
defaults: {
order: 0
},
requiredAttributes: [ "order" ],
orderAttribute: {
orderBy: [ {
attribute: "order"
} ]
}
}), XM.IncidentStatus = {
getIncidentStatusString: function() {
var e = XM.Incident, t = this.get("status");
if (t === e.NEW) return "_new".loc();
if (t === e.FEEDBACK) return "_feedback".loc();
if (t === e.CONFIRMED) return "_confirmed".loc();
if (t === e.ASSIGNED) return "_assigned".loc();
if (t === e.RESOLVED) return "_resolved".loc();
if (t === e.CLOSED) return "_closed".loc();
}
}, XM.Incident = XM.Document.extend({
recordType: "XM.Incident",
nameAttribute: "number",
numberPolicy: XM.Document.AUTO_NUMBER,
keyIsString: !1,
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
assignedToDidChange: function(e, t, n) {
var r = this.getStatus(), i = XM.Incident, s = XM.Model;
if (n && n.force || !(r & s.READY)) return;
t && this.set("incidentStatus", i.ASSIGNED);
},
validateSave: function() {
var e = XM.Incident;
if (this.get("status") === e.ASSIGNED && !this.get("assignedTo")) return XT.Error.clone("xt2001");
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
"use strict";
XM.ClassCode = XM.Document.extend({
recordType: "XM.ClassCode",
documentKey: "code",
enforceUpperKey: !1
}), XM.ProductCategory = XM.Document.extend({
recordType: "XM.ProductCategory",
documentKey: "code"
}), XM.emptyProductCategory = new XM.ProductCategory({
id: -1,
code: "EMPTY",
description: "Use for indicating no product category"
}), XM.Unit = XM.Document.extend({
recordType: "XM.Unit",
documentKey: "name",
defaults: {
isWeight: !1
},
requiredAttributes: [ "isWeight" ]
}), XM.Item = XM.Document.extend({
recordType: "XM.Item",
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
inventoryUnitDidChange: function(e, t, n) {
var r = this.getStatus(), i = XM.Model;
if (n && n.force || !(r & i.READY)) return;
t && this.set("priceUnit", t);
},
isSoldDidChange: function() {
var e = XM.Model, t = !this.get("isSold") && !0;
this.getStatus() & e.READY && (this.setReadOnly("productCategory", t), this.setReadOnly("priceUnit", t), this.setReadOnly("listPrice", t));
},
statusDidChange: function() {
var e = XM.Model;
this.getStatus() === e.READY_CLEAN && (this.setReadOnly("number"), this.setReadOnly("inventoryUnit"));
},
validateSave: function() {
var e = this.get("isSold"), t = this.get("productCategory");
if (e && (t.id || -1) === -1) return XT.Error.clone("xt2005");
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
"use strict";
XM.OpportunityType = XM.Document.extend({
recordType: "XM.OpportunityType",
documentKey: "name"
}), XM.OpportunityStage = XM.Document.extend({
recordType: "XM.OpportunityStage",
documentKey: "name",
defaults: {
deactivate: !1
},
requiredAttributes: [ "deactivate" ]
}), XM.OpportunitySource = XM.Document.extend({
recordType: "XM.OpportunitySource",
documentKey: "name"
}), XM.Opportunity = XM.Document.extend({
recordType: "XM.Opportunity",
numberPolicy: XM.Document.AUTO_NUMBER,
defaults: {
owner: XM.currentUser,
isActive: !0
},
requiredAttributes: [ "account", "name", "isActive", "opportunityStage", "opportunitySource", "opportunityType" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:assignedTo", this.assignedToDidChange);
},
assignedToDidChange: function(e, t, n) {
var r = this.getStatus(), i = XM.Model, s, o;
if (n && n.force || !(r & i.READY)) return;
s = this.get("assignedTo"), o = this.get("assignDate"), s && !o && this.set("assignDate", new Date);
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
"use strict";
XM.Priority = XM.Model.extend({
recordType: "XM.Priority",
defaults: {
order: 0
},
requiredAttributes: [ "name" ]
}), XM.PriorityCollection = XM.Collection.extend({
model: XM.Priority,
orderAttribute: {
orderBy: [ {
attribute: "order"
} ]
}
});
})();

// project.js

(function() {
"use strict";
XM.ProjectStatus = {
getProjectStatusString: function() {
var e = XM.Project, t = this.get("status");
if (t === e.CONCEPT) return "_concept".loc();
if (t === e.IN_PROCESS) return "_inProcess".loc();
if (t === e.COMPLETED) return "_completed".loc();
}
}, XM.ProjectBase = XM.Document.extend({
defaults: function() {
var e = XM.Project, t = {
status: e.CONCEPT
};
return t;
},
requiredAttributes: [ "number", "status", "name", "dueDate" ],
initialize: function() {
XM.Document.prototype.initialize.apply(this, arguments), this.on("change:status", this.projectStatusDidChange);
},
statusDidChange: function() {
var e = XM.Model;
this.getStatus() === e.READY_CLEAN && this.setReadOnly("number");
},
projectStatusDidChange: function() {
var e = this.get("status"), t, n = XM.Project;
this.isDirty() && (t = (new Date).toISOString(), e === n.IN_PROCESS && !this.get("assignDate") ? this.set("assignDate", t) : e === n.COMPLETED && !this.get("completeDate") && this.set("completeDate", t));
}
}), XM.ProjectBase = XM.ProjectBase.extend(XM.ProjectStatus), XM.Project = XM.ProjectBase.extend({
recordType: "XM.Project",
defaults: function() {
var e = XM.ProjectBase.prototype.defaults.call(this);
return e.owner = e.assignedTo = XM.currentUser, e;
},
budgetedHoursTotal: 0,
actualHoursTotal: 0,
balanceHoursTotal: 0,
budgetedExpensesTotal: 0,
actualExpensesTotal: 0,
balanceExpensesTotal: 0,
copy: function(e) {
return XM.Project.copy(this, e);
},
initialize: function() {
XM.ProjectBase.prototype.initialize.apply(this, arguments), this.on("add:tasks remove:tasks", this.tasksDidChange);
},
tasksDidChange: function() {
var e = this, t;
this.budgetedHoursTotal = 0, this.actualHoursTotal = 0, this.budgetedExpensesTotal = 0, this.actualExpensesTotal = 0, _.each(this.get("tasks").models, function(t) {
e.budgetedHoursTotal = XT.math.add(e.budgetedHoursTotal, t.get("budgetedHours"), XT.QTY_SCALE), e.actualHoursTotal = XT.math.add(e.actualHoursTotal, t.get("actualHours"), XT.QTY_SCALE), e.budgetedExpensesTotal = XT.math.add(e.budgetedExpensesTotal, t.get("budgetedExpenses"), XT.MONEY_SCALE), e.actualExpensesTotal = XT.math.add(e.actualExpensesTotal, t.get("actualExpenses"), XT.MONEY_SCALE);
}), this.balanceHoursTotal = XT.math.subtract(this.budgetedHoursTotal, this.actualHoursTotal, XT.QTY_SCALE), this.balanceExpensesTotal = XT.math.subtract(this.budgetedExpensesTotal, this.actualExpensesTotal, XT.QTY_SCALE), t = {
budgetedHoursTotal: this.budgetedHoursTotal,
actualHoursTotal: this.actualHoursTotal,
budgetedExpensesTotal: this.budgetedExpensesTotal,
actualExpensesTotal: this.actualExpensesTotal,
balanceHoursTotal: this.balanceHoursTotal,
balanceExpensesTotal: this.balanceExpensesTotal
}, this.trigger("change", this, t);
}
}), _.extend(XM.Project, {
copy: function(e, t) {
var n = t.number, r = t.offset;
if (e instanceof XM.Project == 0) return console.log("Passed object must be an instance of 'XM.Project'"), !1;
if (n === undefined) return console.log("Number is required"), !1;
var i, s, o, u = new Date(e.get("dueDate").valueOf()), a = XM.Project.prototype.idAttribute, f;
r = r || 0, u.setDate(u.getDate() + r), i = e.parse(JSON.parse(JSON.stringify(e.toJSON()))), _.extend(i, {
number: n,
dueDate: u
}), delete i[a], delete i.status, delete i.comments, delete i.recurrences, a = XM.ProjectTask.prototype.idAttribute, i.tasks && _.each(i.tasks, function(e) {
delete e[a], delete e.status, delete e.comments, delete e.alarms, u = new Date(e.dueDate.valueOf()), u.setDate(u.getDate() + r);
});
for (s in i) if (i.hasOwnProperty(s) && s !== "tasks" && _.isArray(i[s])) {
a = e.get(s).model.prototype.idAttribute;
for (o = 0; o < i[s].length; o += 1) delete i[s][o][a];
}
return f = new XM.Project(i, {
isNew: !0
}), f.documentKeyDidChange(), f;
},
CONCEPT: "P",
IN_PROCESS: "O",
COMPLETED: "C"
}), XM.ProjectTask = XM.ProjectBase.extend({
recordType: "XM.ProjectTask",
defaults: function() {
var e = XM.ProjectBase.prototype.defaults.call(this);
return _.extend(e, {
actualExpenses: 0,
actualHours: 0,
budgetedExpenses: 0,
budgetedHours: 0
}), e;
},
initialize: function() {
XM.ProjectBase.prototype.initialize.apply(this, arguments);
var e = "change:budgetedHours change:actualHours change:budgetedExpenses change:actualExpenses";
this.on(e, this.valuesDidChange), this.on("change:project", this.projectDidChange);
},
projectDidChange: function() {
var e = this.get("project"), t = XM.Model, n = this.getStatus();
e && n === t.READY_NEW && (this.set("owner", this.get("owner") || e.get("owner")), this.set("assignedTo", this.get("owner") || e.get("assignedTo")), this.set("startDate", this.get("startDate") || e.get("startDate")), this.set("assignDate", this.get("assignDate") || e.get("assignDate")), this.set("dueDate", this.get("dueDate") || e.get("dueDate")), this.set("completeDate", this.get("completeDate") || e.get("completeDate")));
},
valuesDidChange: function() {
var e = this.get("project");
e && e.tasksDidChange();
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
"use strict";
XM.SalesRep = XM.AccountDocument.extend({
recordType: "XM.SalesRep",
defaults: {
isActive: !0,
commission: 0
}
});
})();

// tax_authority.js

(function() {
"use strict";
XM.TaxAuthority = XM.AccountDocument.extend({
recordType: "XM.TaxAuthority"
});
})();

// to_do.js

(function() {
"use strict";
XM.ToDoStatus = {
getToDoStatusString: function() {
var e = XM.ToDo, t = this.get("status");
if (t === e.PENDING) return "_pending".loc();
if (t === e.DEFERRED) return "_deferred".loc();
if (t === e.NEITHER) return "_neither".loc();
if (t === e.IN_PROCESS) return "_inProcess".loc();
if (t === e.COMPLETED) return "_completed".loc();
}
}, XM.ToDo = XM.Model.extend({
recordType: "XM.ToDo",
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
var e = XM.ToDo;
return this._status || e.NEITHER;
},
initialize: function() {
XM.Model.prototype.initialize.apply(this, arguments), this.on("change:startDate change:completeDate", this.toDoStatusDidChange), this.on("change:status", this.toDoDidChange), this.on("changeStatus", this.toDoDidChange);
},
toDoDidChange: function() {
this.setToDoStatusProxy(this.get("status"));
},
toDoStatusDidChange: function(e, t, n) {
var r = this.getStatus(), i = this.getToDoStatusProxy(), s = this.get("startDate"), o = this.get("completeDate"), u = XM.ToDo, a = u.NEITHER;
if (n && n.force || !(r & XM.Model.READY)) return;
o ? (a = u.COMPLETED, this.setToDoStatusProxy(u.NEITHER)) : i === u.DEFERRED ? a = u.DEFERRED : i === u.PENDING ? a = u.PENDING : s && (a = u.IN_PROCESS), this.set("status", a);
},
setToDoStatusProxy: function(e) {
var t = XM.ToDo;
if (e === this._status) return this;
if (e === t.PENDING || e === t.DEFERRED) this._status = e; else {
if (this._status === t.NEITHER) return this;
this._status = t.NEITHER;
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
"use strict";
XM.Url = XM.Model.extend({
recordType: "XM.Url"
});
})();

// user_account.js

(function() {
"use strict";
XM.Language = XM.Document.extend({
recordType: "XM.Language",
documentKey: "name",
enforceUpperKey: !1,
readOnly: !0
}), XM.Locale = XM.Document.extend({
recordType: "XM.Locale",
documentKey: "code",
enforceUpperKey: !1,
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
documentKey: "name"
}), XM.UserAccountRoleInfo = XM.Model.extend({
recordType: "XM.UserAccountRoleInfo",
readOnly: !0
}), XM.UserAccountRolePrivilegeAssignment = XM.Document.extend({
recordType: "XM.UserAccountRolePrivilegeAssignment"
}), XM.UserAccount = XM.AccountDocument.extend({
idAttribute: "username",
recordType: "XM.UserAccount",
documentKey: "username",
enforceUpperKey: !1,
defaults: {
disableExport: !1,
isDatabaseUser: !1
},
requiredAttributes: [ "disableExport", "isDatabaseUser" ]
}), XM.UserAccountPrivilegeAssignment = XM.Model.extend({
recordType: "XM.UserAccountPrivilegeAssignment",
requiredAttributes: [ "userAccount", "privilege" ]
}), XM.UserAccountUserAccountRoleAssignment = XM.Document.extend({
recordType: "XM.UserAccountUserAccountRoleAssignment"
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
}), XM.UserAccountRoleCollection = XM.Collection.extend({
model: XM.UserAccountRole
}), XM.UserAccountRoleInfoCollection = XM.Collection.extend({
model: XM.UserAccountRoleInfo
}), XM.UserAccountInfoCollection = XM.Collection.extend({
model: XM.UserAccountInfo
});
})();

// crm.js

(function() {
"use strict";
XM.AccountToDo = XM.Model.extend({
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
"use strict";
XT.StartupTask.create({
taskName: "loadSessionSettings",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.SETTINGS, e);
}
}), XT.StartupTask.create({
taskName: "loadSessionPrivileges",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.PRIVILEGES, e);
}
}), XT.StartupTask.create({
taskName: "loadSessionSchema",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.SCHEMA, e);
}
}), XT.StartupTask.create({
taskName: "loadSessionLocale",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XT.session.loadSessionObjects(XT.session.LOCALE, e);
}
}), XT.StartupTask.create({
taskName: "loadCurrentUser",
task: function() {
var e = {
success: _.bind(this.didComplete, this),
id: XT.session.details.username
};
XM.currentUser = new XM.UserAccountInfo, XM.currentUser.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadHonorifics",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.honorifics = new XM.HonorificCollection, XM.honorifics.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCommentTypes",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.commentTypes = new XM.CommentTypeCollection, XM.commentTypes.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCharacteristics",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.characteristics = new XM.CharacteristicCollection, XM.characteristics.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadLanguages",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.languages = new XM.LanguageCollection, XM.languages.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadLocales",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.locales = new XM.LocaleCollection, XM.locales.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadPrivileges",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.privileges = new XM.PrivilegeCollection, XM.privileges.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCurrencies",
task: function() {
var e = {
success: _.bind(function() {
XM.baseCurrency = _.find(XM.currencies.models, function(e) {
return e.get("isBase");
}), this.didComplete();
}, this)
};
XM.currencies = new XM.CurrencyCollection, XM.currencies.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadCountries",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.countries = new XM.CountryCollection, XM.countries.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadStates",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.states = new XM.StateCollection, XM.states.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadUnits",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.units = new XM.UnitCollection, XM.units.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadClassCodes",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.classCodes = new XM.ClassCodeCollection, XM.classCodes.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadProductCategories",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.productCategories = new XM.ProductCategoryCollection, XM.productCategories.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadPriorities",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.priorities = new XM.PriorityCollection, XM.priorities.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentCategories",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.incidentCategories = new XM.IncidentCategoryCollection, XM.incidentCategories.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentResolutions",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.incidentResolutions = new XM.IncidentResolutionCollection, XM.incidentResolutions.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadIncidentSeverities",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.incidentSeverities = new XM.IncidentSeverityCollection, XM.incidentSeverities.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunityStages",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.opportunityStages = new XM.OpportunityStageCollection, XM.opportunityStages.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunityTypes",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.opportunityTypes = new XM.OpportunityTypeCollection, XM.opportunityTypes.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
}), XT.StartupTask.create({
taskName: "loadOpportunitySources",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.opportunitySources = new XM.OpportunitySourceCollection, XM.opportunitySources.fetch(e);
},
waitingList: [ "loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges" ]
});
var e, t = [ {
id: "N",
name: "_new".loc()
}, {
id: "F",
name: "_feedback".loc()
}, {
id: "C",
name: "_confirmed".loc()
}, {
id: "R",
name: "_resolved".loc()
}, {
id: "L",
name: "_closed".loc()
} ];
XM.IncidentStatusModel = Backbone.Model.extend(), XM.IncidentStatusCollection = Backbone.Collection.extend({
model: XM.IncidentStatusModel
}), XM.incidentStatuses = new XM.IncidentStatusCollection;
for (e = 0; e < t.length; e++) {
var n = new XM.IncidentStatusModel(t[e]);
XM.incidentStatuses.add(n);
}
var r = [ {
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
for (e = 0; e < r.length; e++) {
var i = new XM.ProjectStatusModel(r[e]);
XM.projectStatuses.add(i);
}
var s = [ {
id: "O",
name: "_organization".loc()
}, {
id: "I",
name: "_individual".loc()
} ];
XM.AccountTypeModel = Backbone.Model.extend({}), XM.AccountTypeCollection = Backbone.Collection.extend({
model: XM.AccountTypeModel
}), XM.accountTypes = new XM.AccountTypeCollection;
for (e = 0; e < s.length; e++) {
var o = new XM.AccountTypeModel(s[e]);
XM.accountTypes.add(o);
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
removeAllChildren: function(e) {
var t = e.children.length;
for (var n = 0; n < t; n++) e.removeChild(e.children[0]);
},
removeAll: function(e) {
var t = e.controls.length, n;
for (n = 0; n < t; n++) e.removeControl(e.controls[0]);
var r = e.children.length;
for (n = 0; n < r; n++) e.removeChild(e.children[0]);
},
formatModelName: function(e) {
return this.infoToMasterModelName(this.stripModelNamePrefix(e));
},
infoToMasterModelName: function(e) {
return e && e.indexOf("Info") >= 0 && (e = e.substring(0, e.length - 4)), e;
},
stripModelNamePrefix: function(e) {
return e && e.indexOf("XM") >= 0 && (e = e.substring(3)), e;
}
}), XV.util = new XV.Util;
})();

// menu.js

(function() {
enyo.kind({
name: "XV.MenuItem",
kind: "onyx.MenuItem",
classes: "xv-menuitem",
published: {
disabled: !1
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
tap: function(e) {
if (!this.disabled) return this.inherited(arguments);
}
});
})();

// label.js

(function() {
"use strict";
enyo.kind({
name: "XV.Label",
kind: "enyo.Control",
style: "border: 0px;",
components: [ {
tag: "span",
name: "field",
style: "border: 0px; "
} ],
setValue: function(e) {
this.$.field.setContent(e);
}
});
})();

// input.js

(function() {
enyo.kind({
name: "XV.Input",
classes: "xv-input",
published: {
attr: null,
value: null,
disabled: !1
},
events: {
onValueChange: ""
},
components: [ {
name: "input",
kind: "onyx.Input",
classes: "xv-subinput",
onchange: "inputChanged"
} ],
clear: function(e) {
this.setValue("", e);
},
create: function() {
this.inherited(arguments), this.disabledChanged();
},
disabledChanged: function() {
this.$.input.setDisabled(this.getDisabled());
},
inputChanged: function(e, t) {
var n = this.$.input.getValue(), r = this.validate(n);
r !== !1 ? this.setValue(r) : (this.setValue(null), this.valueChanged(""));
},
setValue: function(e, t) {
t = t || {};
var n = this.getValue(), r;
n !== e && (this.value = e, this.valueChanged(e), r = {
value: e,
originator: this
}, t.silent || this.doValueChange(r));
},
validate: function(e) {
return e;
},
valueChanged: function(e) {
return this.$.input.setValue(e || ""), e;
},
setInputStyle: function(e) {
this.$.input.setStyle(e);
},
setDisabled: function(e) {
this.$.input.setDisabled(e);
}
}), enyo.kind({
name: "XV.InputWidget",
kind: "XV.Input",
classes: "xv-inputwidget",
published: {
label: "",
placeholder: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-label"
}, {
kind: "onyx.InputDecorator",
fit: !0,
classes: "xv-input-decorator",
components: [ {
name: "input",
kind: "onyx.Input",
classes: "xv-subinput",
onchange: "inputChanged"
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.labelChanged(), this.placeholderChanged();
},
labelChanged: function() {
var e = this.getLabel() || ("_" + this.attr || "").loc();
this.$.label.setContent(e + ":");
},
placeholderChanged: function() {
var e = this.getPlaceholder();
this.$.input.setPlaceholder(e);
}
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
published: {
attr: null
},
events: {
onValueChange: ""
},
handlers: {
onchange: "changed"
},
clear: function(e) {
this.setValue(!1, e);
},
setValue: function(e, t) {
t = t || {}, this._silent = t.silent, this.inherited(arguments), this._silent = !1;
},
changed: function(e, t) {
this._silent || (t.value = this.getValue(), this.doValueChange(t));
}
}), enyo.kind({
name: "XV.CheckboxWidget",
kind: "XV.Input",
classes: "xv-inputwidget xv-checkboxwidget",
published: {
label: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-decorated-label"
}, {
kind: "onyx.InputDecorator",
classes: "xv-input-decorator",
components: [ {
name: "input",
kind: "onyx.Checkbox",
onchange: "inputChanged"
} ]
} ]
} ],
clear: function(e) {
this.setValue(!1, e);
},
create: function() {
this.inherited(arguments), this.labelChanged();
},
inputChanged: function(e, t) {
var n = this.$.input.getValue();
this.setValue(n);
},
labelChanged: function() {
var e = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
this.$.label.setContent(e);
},
valueChanged: function(e) {
return this.$.input.setValue(e), e;
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
setValue: function(e, t) {
e = _.isNumber(e) ? XT.math.round(e, this.getScale()) : null, XV.Input.prototype.setValue.call(this, e, t);
},
validate: function(e) {
return e = Number(e), isNaN(e) ? !1 : e;
},
valueChanged: function(e) {
return e = e || e === 0 ? Globalize.format(e, "n" + this.getScale()) : "", XV.Input.prototype.valueChanged.call(this, e);
}
}), enyo.kind({
name: "XV.NumberWidget",
kind: "XV.Number",
classes: "xv-inputwidget xv-numberwidget",
published: {
label: "",
placeholder: ""
},
components: [ {
kind: "onyx.InputDecorator",
classes: "xv-input-decorator",
components: [ {
name: "label",
content: "",
classes: "xv-label"
}, {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged"
} ]
} ],
create: function() {
this.inherited(arguments), this.labelChanged();
},
labelChanged: function() {
var e = (this.getLabel() || ("_" + this.attr + "").loc()) + ":";
this.$.label.setContent(e);
},
placeholderChanged: function() {
var e = this.getPlaceholder();
this.$.input.setPlaceholder(e);
}
});
})();

// text_area.js

(function() {
enyo.kind({
name: "XV.TextArea",
kind: "XV.Input",
classes: "xv-inputwidget xv-textarea",
published: {
attr: null,
placeholder: ""
},
components: [ {
name: "input",
kind: "onyx.TextArea",
classes: "xv-textarea-input",
onchange: "inputChanged"
} ],
placeholderChanged: function() {
var e = this.getPlaceholder();
this.$.input.setPlaceholder(e);
}
});
})();

// dropdown.js

(function() {
enyo.kind({
name: "XV.DropdownWidget",
kind: "enyo.Control",
classes: "xv-dropdownwidget",
events: {
onValueChange: ""
},
published: {
attr: null,
label: "",
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
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-dropdown-label"
}, {
kind: "onyx.InputDecorator",
classes: "xv-input-decorator",
components: [ {
kind: "onyx.PickerDecorator",
components: [ {
content: "_none".loc(),
classes: "xv-picker"
}, {
name: "picker",
kind: "onyx.Picker"
} ]
} ]
} ]
} ],
clear: function(e) {
this.setValue(null, e);
},
collectionChanged: function() {
var e = this.getNameAttribute(), t = XT.getObjectByName(this.getCollection()), n, r, i, s = !1, o = this, u;
if (!t) {
if (s) {
XT.log("Could not find collection " + this.getCollection());
return;
}
i = function() {
s = !0, o.collectionChanged();
}, XT.getStartupManager().registerCallback(i);
return;
}
this.$.picker.createComponent({
value: null,
content: "_none".loc()
});
for (n = 0; n < t.models.length; n++) u = t.models[n], r = u.get(e), this.$.picker.createComponent({
value: u,
content: r
});
this.render();
},
create: function() {
this.inherited(arguments), this.getCollection() && this.collectionChanged(), this.labelChanged();
},
disabledChanged: function(e, t) {
this.$.pickerButton.setDisabled(this.getDisabled());
},
itemSelected: function(e, t) {
var n = this.$.picker.getSelected().value, r = this.getValueAttribute();
this.setValue(r ? n[r] : n);
},
labelChanged: function() {
var e = this.getLabel() || (this.attr ? ("_" + this.attr).loc() + ":" : "");
this.$.label.setShowing(e), this.$.label.setContent(e);
},
setValue: function(e, t) {
t = t || {};
var n, r = this.getValue();
e !== r && (this._selectValue(e) || (e = null), e !== r && (this.value = e, t.silent || (n = {
originator: this,
value: e
}, this.doValueChange(n))));
},
_selectValue: function(e) {
e = !e || this.getValueAttribute() ? e : e.id;
var t = _.find(this.$.picker.getComponents(), function(t) {
if (t.kind === "onyx.MenuItem") return (t.value ? t.value.id : null) === e;
});
return t || (e = null), this.$.picker.setSelected(t), e;
}
});
})();

// address.js

(function() {
enyo.kind({
name: "XV.AddressWidget",
kind: "FittableRows",
classes: "xv-addresswidget",
published: {
attr: null,
value: null
},
events: {
onModelUpdate: ""
},
handlers: {
onfocus: "receiveFocus"
},
components: [ {
kind: "enyo.TextArea",
name: "viewer",
showing: !0,
fit: !0,
classes: "xv-addresswidget-viewer",
placeholder: "_none".loc()
}, {
kind: "onyx.InputDecorator",
name: "editor",
showing: !1,
fit: !0,
classes: "xv-addresswidget-editor",
components: [ {
kind: "onyx.Input",
name: "line1",
showing: !1,
placeholder: "_street".loc(),
style: "display: block;"
}, {
kind: "onyx.Input",
name: "line2",
showing: !1,
style: "display: block;"
}, {
kind: "onyx.Input",
name: "line3",
showing: !1,
style: "display: block;"
}, {
kind: "onyx.Input",
name: "city",
placeholder: "_city".loc(),
showing: !1,
style: "width: 126px;"
}, {
kind: "onyx.Input",
name: "state",
placeholder: "_state".loc(),
showing: !1,
style: "width: 76px;"
}, {
kind: "onyx.Input",
name: "postalCode",
showing: !1,
placeholder: "_postalCode".loc(),
style: "width: 126px;"
}, {
kind: "onyx.Input",
name: "country",
showing: !1,
placeholder: "_country".loc(),
style: "display: block;"
} ]
} ],
receiveBlur: function(e, t) {
this._wasIn && (this.$.viewer.show(), this.$.editor.hide(), this.$.line1.hide(), this.$.line2.hide(), this.$.line3.hide(), this.$.city.hide(), this.$.state.hide(), this.$.postalCode.hide(), this.$.country.hide(), this._wasIn = !1);
switch (t.originator) {
case this.$.line1:
case this.$.line2:
case this.$.line3:
case this.$.city:
case this.$.state:
case this.$.postalCode:
case this.$.country:
this._wasIn = !0;
}
},
receiveFocus: function(e, t) {
this._alert || (alert("Editing of addresses is not supported yet."), this._alert = !0);
},
valueChanged: function() {
var e = this.getValue(), t = e.get("line1") || "", n = e.get("line2") || "", r = e.get("line3") || "", i = e.get("city") || "", s = e.get("state") || "", o = e.get("postalCode") || "", u = e.get("country") || "", a = XM.Address.format(e);
this.$.line1.setValue(t), this.$.line2.setValue(n), this.$.line3.setValue(r), this.$.city.setValue(i), this.$.state.setValue(s), this.$.postalCode.setValue(o), this.$.country.setValue(u), this.$.viewer.setValue(a);
}
});
})();

// comments.js

(function() {
"use strict";
enyo.kind({
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
setupRow: function(e, t) {
var n = t.item.$.commentRow;
for (var r = 0; r < this.getFields().length; r++) {
var i = this.getFields()[r], s = ("_" + i.label).loc();
if (t.index === 0) this.createComponent({
container: n,
content: s,
style: "text-weight: bold; border-width: 0px;"
}); else {
var o = this.getCollection().at(t.index - 1), u = this.createComponent({
container: n,
placeholder: s,
style: "border: 0px;",
onchange: "doFieldChanged"
});
u.setContent(this.formatContent(o.get(i.fieldName), i.type));
}
}
},
formatContent: function(e, t) {
return t === "date" ? Globalize.format(e, "d") : e;
},
descriptorChanged: function() {
this.$.title.setContent(this.getDescriptor().title);
},
setValue: function(e) {
this.setCollection(e);
},
getValue: function() {
return this.getCollection();
},
collectionChanged: function() {
this.$.commentsRepeater.setCount(this.getCollection().length + 1), this.render();
},
doFieldChanged: function(e, t) {}
});
})();

// date.js

(function() {
enyo.kind({
name: "XV.Date",
kind: "XV.Input",
setValue: function(e, t) {
e = _.isDate(e) ? new Date(e.valueOf()) : null, XV.Input.prototype.setValue.call(this, e, t);
},
textToDate: function(e) {
var t = null, n = 864e5;
return e === "0" || e.indexOf("+") === 0 || e.indexOf("-") === 0 ? t = new Date((new Date).getTime() + e * n) : e.indexOf("#") === 0 ? (t = new Date, t.setMonth(0), t.setDate(e.substring(1))) : e.length && !isNaN(e) ? (t = new Date, t.setDate(e)) : e && (t = new Date(e)), t && (isNaN(t.getTime()) ? t = !1 : t.setHours(0, 0, 0, 0)), t;
},
validate: function(e) {
return e = this.textToDate(e), _.isDate(e) || _.isEmpty(e) ? e : !1;
},
valueChanged: function(e) {
return e ? (e = new Date(e.valueOf()), e.setMinutes(e.getTimezoneOffset()), e = Globalize.format(e, "d")) : e = "", XV.Input.prototype.valueChanged.call(this, e);
}
}), enyo.kind({
name: "XV.DateWidget",
kind: "XV.Date",
classes: "xv-inputwidget xv-datewidget",
published: {
label: "",
placeholder: ""
},
components: [ {
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-decorated-label"
}, {
kind: "onyx.InputDecorator",
name: "decorator",
classes: "xv-input-decorator",
components: [ {
name: "input",
kind: "onyx.Input",
onchange: "inputChanged",
classes: "xv-subinput"
}, {
name: "icon",
kind: "onyx.IconButton",
ontap: "iconTapped",
src: "assets/date-icon.png"
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
} ]
} ],
create: function() {
this.inherited(arguments), this.labelChanged();
},
datePicked: function(e, t) {
this.setValue(t), this.$.datePickPopup.hide();
},
iconTapped: function() {
this.$.datePickPopup.show();
},
labelChanged: function() {
var e = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
this.$.label.setContent(e);
},
placeholderChanged: function() {
var e = this.getPlaceholder();
this.$.input.setPlaceholder(e);
},
valueChanged: function(e) {
var t = e;
e = XV.Date.prototype.valueChanged.call(this, e), this.$.datePick.setValue(e ? t : new Date), this.$.datePick.render();
}
});
})();

// relation.js

(function() {
enyo.kind({
name: "XV.RelationWidget",
kind: enyo.Control,
classes: "xv-inputwidget xv-relationwidget",
published: {
attr: null,
label: "",
placeholder: "",
value: null,
list: "",
disabled: !1,
keyAttribute: "number",
nameAttribute: "name",
descripAttribute: ""
},
events: {
onSearch: "",
onValueChange: "",
onWorkspace: ""
},
handlers: {
onModelChange: "modelChanged"
},
components: [ {
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-decorated-label"
}, {
kind: "onyx.InputDecorator",
classes: "xv-input-decorator",
components: [ {
name: "input",
kind: "onyx.Input",
classes: "xv-subinput",
onkeyup: "keyUp",
onkeydown: "keyDown",
onblur: "receiveBlur"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
kind: "onyx.IconButton",
src: "assets/relation-icon-search.png"
}, {
name: "popupMenu",
floating: !0,
kind: "onyx.Menu",
components: [ {
kind: "XV.MenuItem",
name: "searchItem",
content: "_search".loc()
}, {
kind: "XV.MenuItem",
name: "openItem",
content: "_open".loc(),
disabled: !0
}, {
kind: "XV.MenuItem",
name: "newItem",
content: "_new".loc(),
disabled: !0
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
classes: "xv-relationwidget-completer",
onSelect: "relationSelected",
components: [ {
kind: "onyx.Menu",
name: "autocompleteMenu",
modal: !1
} ]
} ]
} ]
}, {
name: "name",
classes: "xv-relationwidget-description"
}, {
name: "description",
classes: "xv-relationwidget-description"
} ],
autocomplete: function() {
var e = this.getKeyAttribute(), t = this.getValue() ? this.getValue().get(e) : "", n = this.$.input.getValue(), r;
n && n !== t ? (r = {
parameters: [ {
attribute: e,
operator: "BEGINS_WITH",
value: n
} ],
rowLimit: 1,
orderBy: [ {
attribute: e
} ]
}, this._collection.fetch({
success: enyo.bind(this, "_fetchSuccess"),
query: r
})) : n || this.setValue(null);
},
clear: function(e) {
this.setValue(null, e);
},
create: function() {
this.inherited(arguments), this.listChanged(), this.labelChanged(), this.disabledChanged();
},
disabledChanged: function() {
var e = this.getDisabled();
this.$.input.setDisabled(e), this.$.name.addRemoveClass("disabled", e), this.$.description.addRemoveClass("disabled", e);
},
itemSelected: function(e, t) {
var n = this, r = t.originator, i = this.getList(), s = this.getValue(), o = s ? s.id : null, u = this._List ? this._List.prototype.workspace : null, a;
switch (r.name) {
case "searchItem":
a = function(e) {
n.setValue(e);
}, this.doSearch({
list: i,
searchText: this.$.input.getValue(),
callback: a
});
break;
case "openItem":
this.doWorkspace({
workspace: u,
id: o
});
break;
case "newItem":
a = function(e) {
var t = n._collection.model, r = new t({
id: e.id
}), i = {};
i.success = function() {
n.setValue(r);
}, r.fetch(i);
}, this.doWorkspace({
workspace: u,
callback: a
});
}
},
keyDown: function(e, t) {
t.keyCode === 9 && (this.$.autocompleteMenu.hide(), this.autocomplete());
},
keyUp: function(e, t) {
var n, r = this.getKeyAttribute(), i = this.getValue() ? this.getValue().get(r) : "", s = this.$.input.getValue(), o = this.$.autocompleteMenu;
s && s !== i && t.keyCode !== 9 ? (n = {
parameters: [ {
attribute: r,
operator: "BEGINS_WITH",
value: s
} ],
rowLimit: 10,
orderBy: [ {
attribute: r
} ]
}, this._collection.fetch({
success: enyo.bind(this, "_collectionFetchSuccess"),
query: n
})) : o.hide();
},
labelChanged: function() {
var e = this.getLabel() || ("_" + this.attr || "").loc();
this.$.label.setContent(e + ":");
},
listChanged: function() {
var e = this.getList(), t;
delete this._List, delete this._Workspace;
if (!e) return;
this._List = XT.getObjectByName(e), this._Workspace = this._List.prototype.workspace ? XT.getObjectByName(this._List.prototype.workspace) : null, t = this._List.prototype.collection ? XT.getObjectByName(this._List.prototype.collection) : null;
if (!t) return;
this._collection = new t;
},
modelChanged: function(e, t) {
var n = this, r = this._List, i = r && r.prototype.workspace ? XT.getObjectByName(r.prototype.workspace) : null, s = {}, o = this.getValue();
if (!r || !i || !o) return;
i.prototype.model === t.model && o.id === t.id && (s.success = function() {
n.setValue(o);
}, o.fetch(s));
},
placeholderChanged: function() {
var e = this.getPlaceholder();
this.$.input.setPlaceholder(e);
},
receiveBlur: function(e, t) {
this.autocomplete();
},
relationSelected: function(e, t) {
return this.setValue(t.originator.model), this.$.autocompleteMenu.hide(), !0;
},
setValue: function(e, t) {
t = t || {};
var n = this, r = e ? e.id : null, i = this.value ? this.value.id : null, s = this.getKeyAttribute(), o = this.getNameAttribute(), u = this.getDescripAttribute(), a = {
value: e,
originator: this
}, f = "", l = "", c = "", h = this._Workspace, p = h && h.prototype.model ? XT.getObjectByName(h.prototype.model) : null, d = p ? p.prototype.recordType : null, v = function() {
var e = {}, t = {};
r && (e.success = function(e) {
n.destroyed || n.$.openItem.setDisabled(!e);
}, t.recordType = d, t.id = r, XT.dataSource.dispatch("XM.Model", "canRead", t, e), n.$.newItem.setDisabled(!p.canCreate()));
};
this.value = e, e && e.get && (f = e.get(s) || "", l = e.get(o) || "", c = e.get(u) || ""), this.$.input.setValue(f), this.$.name.setShowing(l), this.$.name.setContent(l), this.$.description.setShowing(c), this.$.description.setContent(c), r !== i && !t.silent && this.doValueChange(a), n.$.openItem.setShowing(h), n.$.newItem.setShowing(h), n.$.openItem.setDisabled(!0), n.$.newItem.setDisabled(!0), p && h && (XT.session ? v() : XT.getStartupManager().registerCallback(v));
},
_collectionFetchSuccess: function() {
var e = this.getKeyAttribute(), t = this.$.autocompleteMenu, n, r;
t.destroyComponents(), t.controls = [], t.children = [];
if (this._collection.length) {
for (r = 0; r < this._collection.length; r++) n = this._collection.models[r], t.createComponent({
content: n.get(e),
model: n
});
t.reflow(), t.render(), t.show();
} else t.hide();
},
_fetchSuccess: function() {
var e = this._collection.length ? this._collection.models[0] : null;
this.setValue(e);
}
});
})();

// grid.js

(function() {
"use strict";
enyo.kind({
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
setupRow: function(e, t) {
var n = t.item.$.gridRow;
for (var r = 0; r < this.getDescriptor().fields.length; r++) {
var i = this.getDescriptor().fields[r], s = i.label ? i.label : i.fieldName, o = ("_" + s).loc();
if (t.index === 0) this.createComponent({
container: n,
content: o,
style: "text-weight: bold; border-width: 0px; width: " + i.width + "px;"
}); else {
var u = this.createComponent({
kind: i.fieldType || "XV.Input",
container: n,
name: i.fieldName + (t.index - 1),
placeholder: o,
style: "border: 0px; width: " + i.width + "px;",
onchange: "doFieldChanged"
});
i.collection && u.setCollection(i.collection);
if (this.getCollection().size() + 1 > t.index) {
var a = this.getCollection().at(t.index - 1);
u.setValue(a.get(i.fieldName), {
silent: !0
}), this.getCustomization().disallowEdit && u.setDisabled(!0);
} else this.getCustomization().stampUser && i.fieldName === "createdBy" && (u.setValue("<YOU>", {
silent: !0
}), u.setDisabled(!0)), this.getCustomization().stampDate && i.fieldName === "created" && (u.setValue("<NOW>", {
silent: !0
}), u.setDisabled(!0));
}
}
!this.getCustomization().disallowEdit && t.index !== 0 && t.index !== this.getCollection().size() + 1 && this.createComponent({
kind: "onyx.Button",
container: n,
name: "delete" + (t.index - 1),
content: "Delete",
onclick: "deleteRow"
}), this.getCollection() && t.index === this.getCollection().size() + 1 && n.applyStyle("border", "1px solid orange");
},
deleteRow: function(e, t) {
this.$.gridRepeater.removeChild(e.parent.parent), this.$.gridRepeater.render();
var n = e.getName(), r = n.match(/(\D+)(\d+)/), i = Number(r[2]);
this.getCollection().at(i).destroy(), this.doSubmodelUpdate();
},
descriptorChanged: function() {
var e = this.getDescriptor();
this.$.title.setContent(e.title), this.$.gridRepeater.setCount(1);
},
setValue: function(e) {
this.setCollection(e);
},
getValue: function() {
return this.getCollection();
},
collectionChanged: function() {
this.$.gridRepeater.setCount(this.getCollection().size() + 2);
},
doFieldChanged: function(e, t) {
var n = e.getName(), r = e.getValue(), i = n.match(/(\D+)(\d+)/), s = Number(i[2]), o = i[1], u = {};
u[o] = r;
if (s >= this.getCollection().size()) {
var a = XV.util.stripModelNamePrefix(this.getDescriptor().modelType), f = new XM[a](u, {
isNew: !0
});
for (var l = 0; l < f.requiredAttributes.length; l++) {
var c = f.requiredAttributes[l];
if (!f.get(c)) {
if (c === "dueDate") continue;
if (c === "id") continue;
var h = {};
h[c] = "", f.set(h);
}
}
this.getCollection().add(f);
} else this.getCollection().at(s).set(u);
this.doSubmodelUpdate();
}
});
})();

// parameter.js

(function() {
enyo.kind({
name: "XV.ParameterItem",
classes: "xv-parameter-item",
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
name: "input",
classes: "xv-parameter-item-input"
} ],
defaultKind: "XV.InputWidget",
create: function() {
this.inherited(arguments), this.valueChanged(), this.labelChanged(), !this.getOperator() && this.defaultKind === "XV.InputWidget" && this.setOperator("MATCHES");
},
labelChanged: function() {
this.$.input.setLabel(this.label);
},
getParameter: function() {
var e;
return this.getValue() && (e = {
attribute: this.getAttr(),
operator: this.getOperator(),
value: this.getValue()
}), e;
},
getValue: function() {
return this.$.input.getValue();
},
parameterChanged: function() {
var e = {
value: this.getValue,
originator: this
};
return this.doParameterChange(e), !0;
},
valueChanged: function() {
this.$.input.setValue(this.value);
}
}), enyo.kind({
name: "XV.ParameterWidget",
kind: "FittableRows",
classes: "xv-groupbox",
defaultKind: "XV.ParameterItem",
getParameters: function() {
var e, t, n = [], r;
for (e = 0; e < this.children.length; e++) r = this.children[e], t = r && r.getParameter ? r.getParameter() : null, t && n.push(t);
return n;
}
});
})();

// list.js

(function() {
var e = 50, t = 100;
enyo.kind({
name: "XV.ListItem",
classes: "xv-list-item",
ontap: "itemTap"
}), enyo.kind({
name: "XV.ListColumn",
classes: "xv-list-column"
}), enyo.kind({
name: "XV.ListAttr",
classes: "xv-list-attr",
published: {
attr: ""
}
}), enyo.kind({
name: "XV.List",
kind: "List",
classes: "xv-list",
published: {
label: "",
collection: null,
query: null,
isFetching: !1,
isMore: !0,
parameterWidget: null,
workspace: null
},
events: {
onItemTap: "",
onWorkspace: ""
},
fixedHeight: !0,
handlers: {
onModelChange: "modelChanged",
onSetupItem: "setupItem"
},
collectionChanged: function() {
var e = this.getCollection(), t = e ? XT.getObjectByName(e) : !1;
delete this._collection;
if (!t) return;
t && (this._collection = new t);
},
create: function() {
this.inherited(arguments), this.collectionChanged();
},
getModel: function(e) {
return this._collection.models[e];
},
getSearchableAttributes: function() {
return this._collection.model.getSearchableAttributes();
},
fetch: function(t) {
var n = this, r = this.getQuery() || {}, i;
t = t ? _.clone(t) : {}, t.showMore = _.isBoolean(t.showMore) ? t.showMore : !1, i = t.success, t.showMore ? (r.rowOffset += e, t.add = !0) : (r.rowOffset = 0, r.rowLimit = e), _.extend(t, {
success: function(e, t, r) {
n.fetched(), i && i(e, t, r);
},
query: r
}), this._collection.fetch(t);
},
fetched: function() {
var e = this.getQuery() || {}, t = e.rowOffset || 0, n = e.rowLimit || 0, r = this._collection.length, i = n ? t + n <= r && this.getCount() !== r : !1, s = 50 > r ? r : 50;
this.setIsMore(i), this.setIsFetching(!1), this.setCount(r), s !== this.rowsPerPage && this.setRowsPerPage(s), t ? this.refresh() : this.reset();
},
itemTap: function(e, t) {
t.list = this, this.doItemTap(t);
},
modelChanged: function(e, t) {
var n = this, r = this.getWorkspace(), i = {}, s;
r = r ? XT.getObjectByName(r) : null, r && r.prototype.model === t.model && this._collection && (s = this._collection.get(t.id), s && (i.success = function() {
n.refresh();
}, s.fetch(i)));
},
queryChanged: function() {
var e = this.getQuery();
this._collection && e.orderBy && (this._collection.comparator = function(t, n) {
var r, i, s, o;
for (o = 0; o < e.orderBy.length; o++) {
s = e.orderBy[o].attribute, r = t.get(s), i = n.get(s);
if (r !== i) return r > i ? 1 : -1;
}
return 0;
});
},
scroll: function(e, n) {
var r = this.inherited(arguments), i = this.getScrollBounds().maxTop - this.rowHeight * t, s = {};
return this.getIsMore() && this.getScrollPosition() > i && !this.fetching && (this.setIsFetching(!0), s.showMore = !0, this.fetch(s)), r;
},
setupItem: function(e, t) {
var n = this._collection.models[t.index], r, i, s, o, u;
for (r in this.$) this.$.hasOwnProperty(r) && this.$[r].getAttr && (s = this.$[r], i = !1, n.getValue ? o = n.getValue(this.$[r].getAttr()) : o = n.get(this.$[r].getAttr()), u = s.formatter, !o && s.placeholder && (o = s.placeholder, i = !0), u && (o = this[u](o, s, n)), o && o instanceof Date && (o = Globalize.format(o, "d")), s.setContent(o), s.addRemoveClass("placeholder", i));
},
setQuery: function() {
var e = _.clone(this.query);
this.inherited(arguments), _.isEqual(e, this.query) && this.queryChanged();
}
});
})();

// navigator.js

(function() {
var e = 0, t = 1;
enyo.kind({
name: "XV.Navigator",
kind: "Panels",
classes: "app enyo-unselectable",
published: {
modules: []
},
events: {
onListAdded: "",
onTogglePullout: "",
onWorkspace: ""
},
handlers: {
onParameterChange: "requery",
onItemTap: "itemTap"
},
showPullout: !0,
arrangerKind: "CollapsingArranger",
components: [ {
kind: "FittableRows",
classes: "left",
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.Button",
name: "backButton",
content: "_logout".loc(),
ontap: "backTapped"
}, {
kind: "Group",
name: "iconButtonGroup",
defaultKind: "onyx.IconButton",
tag: null,
components: [ {
name: "historyIconButton",
src: "assets/menu-icon-bookmark.png",
ontap: "showHistory"
}, {
name: "searchIconButton",
src: "assets/menu-icon-search.png",
ontap: "showParameters",
showing: !1
} ]
}, {
kind: "onyx.Popup",
name: "logoutPopup",
centered: !0,
modal: !0,
floating: !0,
components: [ {
content: "_logoutConfirmation".loc()
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "_ok".loc(),
ontap: "logout"
}, {
kind: "onyx.Button",
content: "_cancel".loc(),
ontap: "closeLogoutPopup",
classes: "onyx-blue"
} ]
} ]
}, {
name: "menuPanels",
kind: "Panels",
draggable: !1,
fit: !0,
margin: 0,
components: [ {
name: "moduleMenu",
kind: "List",
touch: !0,
onSetupItem: "setupModuleMenuItem",
components: [ {
name: "moduleItem",
classes: "item enyo-border-box"
} ]
}, {
name: "panelMenu",
kind: "List",
touch: !0,
onSetupItem: "setupPanelMenuItem",
components: [ {
name: "listItem",
classes: "item enyo-border-box"
} ]
}, {} ]
} ]
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.MoreToolbar",
name: "contentToolbar",
components: [ {
kind: "onyx.Grabber"
}, {
name: "rightLabel",
style: "text-align: center"
}, {
name: "search",
kind: "onyx.InputDecorator",
style: "float: right;",
showing: !1,
components: [ {
name: "searchInput",
kind: "onyx.Input",
style: "width: 200px;",
placeholder: "Search",
onchange: "inputChanged"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
}, {
name: "newButton",
kind: "onyx.Button",
content: "_new".loc(),
ontap: "newRecord",
style: "float: right;",
showing: !1
} ]
}, {
name: "contentPanels",
kind: "Panels",
margin: 0,
fit: !0,
draggable: !1,
panelCount: 0
} ]
} ],
fetched: {},
activate: function() {
this.setMenuPanel(e);
},
backTapped: function() {
var t = this.$.menuPanels.getIndex();
t === e ? this.warnLogout() : this.setMenuPanel(e);
},
create: function() {
this.inherited(arguments);
var e = this.getModules() || [], t, n, r, i;
for (r = 0; r < e.length; r++) {
t = e[r].panels || [];
for (i = 0; i < t.length; i++) t[i].index = this.$.contentPanels.panelCount++, n = this.$.contentPanels.createComponent(t[i]), n instanceof XV.List && this.doListAdded(n);
}
this.$.moduleMenu.setCount(e.length);
},
getSelectedModule: function(e) {
return this._selectedModule;
},
fetch: function(e) {
e = e ? _.clone(e) : {};
var t = e.index || this.$.contentPanels.getIndex(), n = this.$.contentPanels.getPanels()[t], r = n ? n.name : "", i, s, o, u;
if (!n instanceof XV.List) return;
this.fetched[t] = !0, i = n.getQuery() || {}, s = this.$.searchInput.getValue(), o = XT.app ? XT.app.getPullout().getItem(r) : null, u = o ? o.getParameters() : [], e.showMore = _.isBoolean(e.showMore) ? e.showMore : !1, s || u.length ? (i.parameters = [], s && (i.parameters = [ {
attribute: n.getSearchableAttributes(),
operator: "MATCHES",
value: this.$.searchInput.getValue()
} ]), u && (i.parameters = i.parameters.concat(u))) : delete i.parameters, n.setQuery(i), n.fetch(e);
},
inputChanged: function(e, t) {
this.fetched = {}, this.fetch();
},
itemTap: function(e, t) {
var n = t.list, r = n ? n.getWorkspace() : null, i = n ? n.getModel(t.index).id : null;
r && this.doWorkspace({
workspace: r,
id: i
});
},
newRecord: function(e, t) {
var n = this.$.contentPanels.getActive(), r = n instanceof XV.List ? n.getWorkspace() : null, i;
if (!n instanceof XV.List) return;
return i = function(e) {
var t = n._collection.model, r = new t({
id: e.id
}), i = {};
i.success = function() {
n._collection.add(r), n.setCount(n._collection.length), n.refresh();
}, r.fetch(i);
}, r && this.doWorkspace({
workspace: r,
callback: i
}), !0;
},
requery: function(e, t) {
this.fetch();
},
setContentPanel: function(e) {
var t = this.getSelectedModule(), n = t && t.panels ? t.panels[e].index : -1, r = n > -1 ? this.$.contentPanels.getPanels()[n] : null, i = r && r.label ? r.label : "";
if (!r) return;
this.$.panelMenu.isSelected(e) || this.$.panelMenu.select(e), this.$.contentPanels.getIndex() !== n && this.$.contentPanels.setIndex(n), this.$.rightLabel.setContent(i), r.fetch && !this.fetched[n] && this.fetch();
},
setMenuPanel: function(e) {
var t = e ? "_back".loc() : "_logout".loc();
this.$.menuPanels.setIndex(e), this.$.menuPanels.getActive().select(0), this.setContentPanel(0), this.$.backButton.setContent(t), this.$.newButton.setShowing(e), this.$.search.setShowing(e), this.$.searchIconButton.setShowing(e);
},
setModule: function(e) {
var n = this.getModules()[e], r = n.panels || [], i = n.hasSubmenu !== !1 && r.length;
n !== this._selectedModule && (this._selectedModule = n, i && (this.$.panelMenu.setCount(r.length), this.$.panelMenu.render(), this.setMenuPanel(t)));
},
setupModuleMenuItem: function(e, t) {
var n = t.index, r = this.modules[n].label, i = e.isSelected(n);
this.$.moduleItem.setContent(r), this.$.moduleItem.addRemoveClass("onyx-selected", i), i && this.setModule(n);
},
setupPanelMenuItem: function(e, t) {
var n = this.getSelectedModule(), r = t.index, i = e.isSelected(r), s, o, u;
s = n.panels[r], o = s && s.name ? n.panels[r].name : "", s = this.$.contentPanels.$[o], u = s && s.getLabel ? s.getLabel() : "", this.$.listItem.setContent(u), this.$.listItem.addRemoveClass("onyx-selected", i), i && this.setContentPanel(r);
},
showHistory: function(e, t) {
var n = {
name: "history"
};
this.doTogglePullout(n);
},
showParameters: function(e, t) {
var n = this.$.contentPanels.getActive();
this.doTogglePullout(n);
},
warnLogout: function() {
this.$.logoutPopup.show();
},
closeLogoutPopup: function() {
this.$.logoutPopup.hide();
},
logout: function() {
this.$.logoutPopup.hide(), XT.session.logout();
},
setActiveIconButton: function(e) {
var t = null;
e === "search" ? t = this.$.searchIconButton : e === "history" && (t = this.$.historyIconButton), this.$.iconButtonGroup.setActive(t);
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
classes: "xv-pullout-header",
name: "pulloutHeader",
content: ""
}, {
name: "pulloutItems",
fit: !0,
kind: "Scroller",
style: "position: relative;",
components: [ {
fit: !0,
name: "history",
kind: "Scroller",
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
} ],
grabberDragFinish: function() {
this.getSelectedPanel() || this.togglePullout("history");
},
refreshHistoryList: function() {
this.$.historyList.setCount(XT.getHistory().length);
},
setupHistoryItem: function(e, t) {
var n = t.item.$.historyItem, r = XT.getHistory()[t.index], i = ("_" + XV.util.stripModelNamePrefix(r.modelType).camelize()).loc();
this.createComponent({
container: n,
classes: "item enyo-border-box",
style: "color:white",
ontap: "doHistoryItemSelected",
content: i + ": " + r.modelName,
modelType: r.modelType,
id: r.modelId,
workspace: r.workspaceType
});
},
getItem: function(e) {
return this.$.pulloutItems.$[e] || this.$[e];
},
togglePullout: function(e) {
var t = this.getItem(e), n = this.$.pulloutItems.children[0].children, r;
e === "history" ? this.$.pulloutHeader.setContent("_history".loc()) : this.$.pulloutHeader.setContent("_advancedSearch".loc()), this.setSelectedPanel(e);
if (t && t.showing && this.isAtMax()) this.animateToMin(); else {
for (r = 0; r < n.length; r++) n[r].hide();
t.show(), t.resized(), this.isAtMax() || (this.render(), this.animateToMax());
}
}
});
})();

// workspace.js

(function() {
enyo.kind({
name: "XV.Workspace",
kind: "FittableRows",
published: {
title: "_none".loc(),
model: "",
callback: null
},
events: {
onError: "",
onModelChange: "",
onStatusChange: "",
onTitleChange: "",
onHistoryChange: ""
},
handlers: {
onValueChange: "valueChanged"
},
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
name: "name"
}, {
kind: "XV.InputWidget",
name: "description"
} ]
} ]
} ],
attributesChanged: function(e, t) {
t = t || {};
var n = this, r, i, s = XM.Model, o = e.getStatus(), u = t.changes, a = !e.canUpdate() || !(o & s.READY), f, l, c, h = function(e) {
return _.find(n.$, function(t) {
return t.attr === e;
});
};
for (r in u) u.hasOwnProperty(r) && (i = e.get(r), l = e.isReadOnly(r), c = e.isRequired(r), f = h(r), f && (f.setPlaceholder && c && !f.getPlaceholder() && f.setPlaceholder("_required".loc()), f.setValue && !(o & s.BUSY) && f.setValue(i, {
silent: !0
}), f.setDisabled && f.setDisabled(a || l)));
},
clear: function() {
var e = this._model ? this._model.getAttributeNames() : [], t, n;
for (n = 0; n < e.length; n++) t = e[n], this.$[t] && this.$[t].clear && this.$[t].clear({
silent: !0
});
},
create: function() {
this.inherited(arguments), this.titleChanged(), this.modelChanged();
},
destroy: function() {
this.setModel(null), this.inherited(arguments);
},
error: function(e, t) {
var n = {
originator: this,
model: e,
error: t
};
this.doError(n);
},
fetch: function(e) {
if (!this._model) return;
this._model.fetch({
id: e
});
},
isDirty: function() {
return this._model ? this._model.isDirty() : !1;
},
modelChanged: function() {
var e = this.getModel(), t = e ? XT.getObjectByName(e) : null, n, r = this;
this._model && (this._model.off(), this._model.isNew() && this._model.destroy(), delete this._model);
if (!t) return;
if (!XT.session) {
n = function() {
r.modelChanged();
}, XT.getStartupManager().registerCallback(n);
return;
}
this._model = new t, this._model.on("change", this.attributesChanged, this), this._model.on("statusChange", this.statusChanged, this), this._model.on("error", this.error, this);
},
newRecord: function() {
this.modelChanged(), this._model.initialize(null, {
isNew: !0
}), this.clear();
},
requery: function() {
this.fetch(this._model.id);
},
save: function(e) {
e = e || {};
var t = this, n = e.success, r = {
originator: this,
model: this.getModel(),
id: this._model.id
};
e.success = function(e, i, s) {
t.doModelChange(r), t.callback && t.callback(e), n && n(e, i, s);
}, this._model.save(null, e);
},
statusChanged: function(e, t, n) {
n = n || {};
var r = {
model: e
}, i = e.getAttributeNames(), s = {}, o;
e.id && (XT.addToHistory(this.kind, e), this.doHistoryChange(this));
for (o = 0; o < i.length; o++) s[i[o]] = !0;
n.changes = s, this.attributesChanged(e, n), this.doStatusChange(r);
},
titleChanged: function() {
var e = {
title: this.getTitle(),
originator: this
};
this.doTitleChange(e);
},
valueChanged: function(e, t) {
var n = {};
n[t.originator.attr] = t.value, this._model.set(n);
}
}), enyo.kind({
name: "XV.WorkspaceContainer",
kind: "Panels",
arrangerKind: "CollapsingArranger",
classes: "app enyo-unselectable",
published: {
menuItems: []
},
events: {
onPrevious: ""
},
handlers: {
onError: "errorNotify",
onStatusChange: "statusChanged",
onTitleChange: "titleChanged"
},
components: [ {
kind: "FittableRows",
name: "navigationPanel",
classes: "left",
components: [ {
kind: "onyx.Toolbar",
name: "menuToolbar",
components: [ {
kind: "onyx.Button",
name: "backButton",
content: "_back".loc(),
onclick: "close"
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
name: "contentPanel",
components: [ {
kind: "onyx.MoreToolbar",
name: "contentToolbar",
components: [ {
kind: "onyx.Grabber"
}, {
name: "title",
style: "text-align: center;"
}, {
kind: "onyx.Button",
name: "saveButton",
disabled: !0,
style: "float: right; background-color: #35A8EE;",
content: "_save".loc(),
onclick: "saveAndClose"
}, {
kind: "onyx.Button",
name: "saveAndNewButton",
disabled: !0,
style: "float: right;",
content: "_saveAndNew".loc(),
onclick: "saveAndNew"
}, {
kind: "onyx.Button",
name: "applyButton",
disabled: !0,
style: "float: right;",
content: "_apply".loc(),
onclick: "save"
}, {
kind: "onyx.Button",
name: "refreshButton",
disabled: !0,
content: "_refresh".loc(),
onclick: "requery",
style: "float: right;"
} ]
}, {
kind: "onyx.Popup",
name: "unsavedPopup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
content: "_unsavedChanges".loc()
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "_discard".loc(),
ontap: "unsavedDiscard"
}, {
kind: "onyx.Button",
content: "_cancel".loc(),
ontap: "unsavedCancel"
}, {
kind: "onyx.Button",
content: "_save".loc(),
ontap: "unsavedSave",
classes: "onyx-blue"
} ]
}, {
kind: "onyx.Popup",
name: "errorPopup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
name: "errorMessage",
content: "_error".loc()
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "_ok".loc(),
ontap: "errorOk",
classes: "onyx-blue"
} ]
} ]
} ],
close: function(e) {
e = e || {};
if (!e.force && this.$.workspace.isDirty()) {
this.$.unsavedPopup.close = !0, this.$.unsavedPopup.show();
return;
}
this.doPrevious();
},
destroyWorkspace: function() {
var e = this.$.workspace;
e && (this.removeComponent(e), e.destroy());
},
errorNotify: function(e, t) {
var n = t.error.message();
this.$.errorMessage.setContent(n), this.$.errorPopup.render(), this.$.errorPopup.show();
},
errorOk: function() {
this.$.errorPopup.hide();
},
itemTap: function(e, t) {
var n = this.$.workspace, r = this.getMenuItems()[t.index], i, s, o;
for (i in n.$) if (n.$.hasOwnProperty(i) && n.$[i] instanceof enyo.Panels) {
o = n.$[i].getPanels();
for (s = 0; s < o.length; s++) if (o[s] === r) {
n.$[i].setIndex(s);
break;
}
}
},
newRecord: function() {
this.$.workspace.newRecord();
},
requery: function(e) {
e = e || {};
if (!e.force && this.$.workspace.isDirty()) {
this.$.unsavedPopup.close = !1, this.$.unsavedPopup.show();
return;
}
this.$.workspace.requery();
},
save: function(e) {
this.$.workspace.save(e);
},
saveAndNew: function() {
var e = this, t = {}, n = function() {
e.newRecord();
};
t.success = n, this.save(t);
},
saveAndClose: function() {
var e = this, t = {}, n = function() {
e.close();
};
t.success = n, this.save(t);
},
setupItem: function(e, t) {
var n = this.getMenuItems()[t.index], r = "_menu".loc() + t.index, i = n.getTitle ? n.getTitle() || r : n.title ? n.title || r : r;
this.$.item.setContent(i), this.$.item.box = n, this.$.item.addRemoveClass("onyx-selected", e.isSelected(t.index));
},
setWorkspace: function(e, t, n) {
var r = [], i;
e && (this.destroyWorkspace(), e = {
name: "workspace",
container: this.$.contentPanel,
kind: e,
fit: !0,
callback: n
}, e = this.createComponent(e), t ? e.fetch(t) : e.newRecord(), this.render()), this.$.menu.setCount(0);
for (i in e.$) e.$.hasOwnProperty(i) && e.$[i] instanceof enyo.Panels && (r = r.concat(e.$[i].getPanels()));
this.setMenuItems(r), this.$.menu.setCount(r.length), this.$.menu.render();
},
statusChanged: function(e, t) {
var n = t.model, r = XM.Model, i = n.getStatus(), s = i !== r.READY_CLEAN && i !== r.READY_DIRTY, o = n.canUpdate() && !n.isReadOnly(), u = !n.isDirty() || !o;
this.$.refreshButton.setDisabled(s), this.$.applyButton.setDisabled(u), this.$.saveAndNewButton.setDisabled(u), this.$.saveButton.setDisabled(u);
},
titleChanged: function(e, t) {
var n = t.title || "";
return this.$.title.setContent(n), !0;
},
unsavedCancel: function() {
this.$.unsavedPopup.hide();
},
unsavedDiscard: function() {
var e = {
force: !0
};
this.$.unsavedPopup.hide(), this.close(e);
},
unsavedSave: function() {
this.$.unsavedPopup.hide(), this.$.unsavedPopup.close ? this.saveAndClose() : this.save();
}
});
})();

// groupbox.js

(function() {
enyo.kind({
name: "XV.Groupbox",
kind: "Scroller",
horizontal: "hidden",
classes: "xv-groupbox",
published: {
title: "_overview".loc()
}
});
})();

// repeater_box.js

(function() {
enyo.kind({
name: "XV.RepeaterBox",
kind: "XV.Groupbox",
published: {
attr: null,
columns: [],
collection: null,
recordType: null
},
handlers: {
onDeleteRow: "deleteRow"
},
classes: "xv-repeater-box xv-groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
classes: "xv-repeater-box-title",
name: "title",
content: "Title"
}, {
kind: "onyx.Groupbox",
classes: "onyx-toolbar-inline xv-repeater-box-header",
name: "headerRow"
}, {
kind: "Repeater",
name: "repeater",
count: 0,
onSetupItem: "setupRow",
components: [ {
kind: "XV.RepeaterBoxRow",
name: "repeaterRow"
} ]
}, {
kind: "onyx.Button",
name: "newRowButton",
onclick: "newRow",
content: "Add New"
} ],
create: function() {
this.inherited(arguments), this.$.title.setContent(("_" + this.attr || "").loc()), this.getColumns() && this.showLabels();
},
columnsChanged: function() {
this.showLabels();
},
showLabels: function() {
for (var e = 0; e < this.getColumns().length; e++) {
var t = this.getColumns()[e], n = ("_" + XT.String.suffix(t.name)).loc();
this.createComponent({
container: this.$.headerRow,
content: n,
classes: t.classes ? t.classes + " xv-label" : "xv-label"
});
}
},
newRow: function() {
var e = XT.String.suffix(this.getRecordType()), t = new XM[e](null, {
isNew: !0
});
this.getCollection().add(t), this.$.repeater.setCount(this.getCollection().size());
},
setupRow: function(e, t) {
var n = t.item.$.repeaterRow;
n.setColumns(this.getColumns());
var r = this.getCollection().at(t.index);
n.setModel(r), r.getStatus() & XM.Model.DESTROYED && n.setDeleted(!0);
},
setValue: function(e, t) {
this.setCollection(e), this.$.repeater.setCount(this.getCollection().size());
},
collectionChanged: function() {
this.getCollection().model.canCreate() || this.$.newRowButton.setDisabled(!0);
},
deleteRow: function(e, t) {
t.originator.parent.getModel().destroy(), this.$.repeater.setCount(this.getCollection().size());
}
});
})();

// repeater_box_row.js

(function() {
enyo.kind({
name: "XV.RepeaterBoxRow",
kind: "onyx.Groupbox",
classes: "onyx-toolbar-inline xv-repeater-box-row",
published: {
columns: [],
model: null
},
events: {
onDeleteRow: ""
},
handlers: {
onValueChange: "fieldChanged"
},
modelChanged: function(e, t) {
for (var n = 0; n < this.getColumns().length; n++) {
var r = this.getColumns()[n], i = ("_" + XT.String.suffix(r.name)).loc(), s = this.createComponent({
kind: r.kind,
name: XT.String.suffix(r.name),
placeholder: i,
classes: r.classes
});
r.collection && s.setCollection(r.collection), s.setValue(this.getModel().get(XT.String.suffix(r.name)), {
silent: !0
}), (this.getModel().isReadOnly() || !this.getModel().canUpdate()) && this.setDisabled(!0);
}
!this.getModel().isReadOnly() && this.getModel().canDelete() && this.createComponent({
kind: "onyx.Button",
name: "deleteButton",
classes: "xv-delete-button",
content: "x",
ontap: "deleteRow"
});
},
setValue: function(e, t) {
this.setModel(e);
},
fieldChanged: function(e, t) {
var n = e.getName(), r = e.getValue(), i = {};
return i[n] = r, this.getModel().set(i), !0;
},
deleteRow: function(e, t) {
this.setStyle("background-color:purple"), this.doDeleteRow(t);
},
setDeleted: function(e) {
var t, n = e ? "text-decoration: line-through" : "text-decoration: none";
for (i = 0; i < this.getComponents().length; i++) t = this.getComponents()[i], t.setInputStyle ? t.setInputStyle(n) : XT.log("setInputStyle not supported on widget");
this.setDisabled(e);
},
setDisabled: function(e) {
var t, n;
for (t = 0; t < this.getComponents().length; t++) n = this.getComponents()[t], n.setDisabled ? n.setDisabled(e) : XT.log("setDisabled not supported on widget");
}
});
})();

// comment_box.js

(function() {
enyo.kind({
name: "XV.CommentBox",
kind: "XV.RepeaterBox",
classes: "xv-comment-box",
published: {
title: "_comments".loc(),
columns: [ {
kind: "XV.TextArea",
name: "comments.text",
classes: "xv-comment-box-text"
}, {
kind: "XV.Input",
name: "comments.createdBy",
classes: "xv-comment-box-createdBy"
}, {
kind: "XV.Date",
name: "comments.created",
classes: "xv-comment-box-created"
}, {
kind: "XV.CommentTypeDropdown",
name: "comments.commentType",
classes: "xv-comment-box-comment-type"
} ]
}
});
})();

// assignment_box.js

(function() {
enyo.kind({
name: "XV.AssignmentBox",
kind: "XV.Groupbox",
classes: "xv-assignment-box",
handlers: {
onValueChange: "checkboxChange"
},
published: {
title: "",
type: "",
cacheName: "",
assignedCollection: null,
assignedIds: null,
totalCollection: null,
totalCollectionName: "",
segments: null,
segmentedCollections: null,
translateLabels: !0
},
components: [ {
kind: "Repeater",
name: "segmentRepeater",
fit: !0,
onSetupItem: "setupSegment",
segmentIndex: 0,
components: [ {
kind: "onyx.GroupboxHeader",
name: "segmentHeader",
content: ""
}, {
kind: "Repeater",
name: "checkboxRepeater",
fit: !0,
onSetupItem: "setupCheckbox",
components: [ {
kind: "XV.CheckboxWidget",
name: "checkbox"
} ]
} ]
} ],
assignedCollectionChanged: function() {
this.mapIds();
},
checkboxChange: function(e, t) {
var n = this, r = t.originator.name, i = t.value, s, o;
try {
var u = t.originator.$.input.checked, a = t.originator.parent.parent.parent.indexInContainer(), f = t.originator.parent.indexInContainer();
} catch (l) {
XT.log("Crazy hack failed. Not bothering with it.");
}
if (i) {
var s = _.filter(this.getTotalCollection().models, function(e) {
return e.get("name") === r;
})[0];
XT.log("WTF1?: " + this.$.segmentRepeater.children[a].children[1].children[f].$.checkbox.$.input.checked), o = this.getAssignmentModel(s), XT.log("WTF2?: " + this.$.segmentRepeater.children[a].children[1].children[f].$.checkbox.$.input.checked), this.getAssignedCollection().add(o);
} else s = _.filter(this.getAssignedCollection().models, function(e) {
return !(e.getStatus() & XM.Model.DESTROYED) && e.get(n.getType()) && e.get(n.getType()).get("name") === r;
})[0], s || XT.log("No model to destroy. This is probably a bug."), s.destroy();
try {
u != this.$.segmentRepeater.children[a].children[1].children[f].$.checkbox.$.input.checked && (XT.log("applying hack: setting checkbox to " + u), this.$.segmentRepeater.children[a].children[1].children[f].$.checkbox.$.input.checked = u, this.render());
} catch (l) {
XT.log("Crazy hack failed. Not bothering with it.");
}
return !0;
},
create: function() {
this.inherited(arguments);
var e, t = this;
this.setSegmentedCollections([]);
for (e = 0; e < this.getSegments().length; e++) this.getSegmentedCollections()[e] = new (XM[this.getTotalCollectionName()]), this.getSegmentedCollections()[e].comparator = function(e) {
return e.get("name");
};
if (XM[this.getCacheName()]) this.setTotalCollection(XM[this.getCacheName()]), this.segmentizeTotalCollection(); else {
this.setTotalCollection(new (XM[this.getTotalCollectionName()]));
var n = {
success: function() {
t.segmentizeTotalCollection();
}
};
this.getTotalCollection().fetch(n);
}
},
getAssignmentModel: function() {
return null;
},
mapIds: function() {
var e = this;
this.setAssignedIds(this.getAssignedCollection().map(function(t) {
return t.get(e.getType()) ? t.get(e.getType()).get("id") : null;
}));
},
setupSegment: function(e, t) {
var n = t.index, r = t.item, i = r.$.segmentHeader;
if (t.originator.name !== "segmentRepeater") return;
return e.segmentIndex = n, i.setContent(this.getSegments()[n]), r.$.checkboxRepeater.setCount(this.getSegmentedCollections()[n].length), !0;
},
setupCheckbox: function(e, t) {
var n = t.item.indexInContainer(), r = e.parent.parent, i = r.segmentIndex, s = this.getSegmentedCollections()[i].at(n), o = t.item.$.checkbox, u = this.getTranslateLabels() ? ("_" + s.get("name")).loc() : s.get("name");
return o.setLabel(u), o.setName(s.get("name")), _.indexOf(this.getAssignedIds(), s.get("id")) >= 0 && o.setValue(!0, {
silent: !0
}), !0;
},
setValue: function(e) {
this.setAssignedCollection(e), this.tryToRender();
},
segmentizeTotalCollection: function() {
var e, t, n, r;
for (e = 0; e < this.getTotalCollection().length; e++) {
n = this.getTotalCollection().models[e], r = n.get("module");
for (t = 0; t < this.getSegments().length; t++) (this.getSegments().length === 1 || r === this.getSegments()[t]) && this.getSegmentedCollections()[t].add(n);
}
this.tryToRender();
},
tryToRender: function() {
this.getAssignedCollection() && this.getSegmentedCollections()[0] && this.$.segmentRepeater.setCount(this.getSegments().length);
}
});
})();

// search.js

(function() {
enyo.kind({
name: "XV.SearchContainer",
kind: "Panels",
classes: "app enyo-unselectable",
published: {
callback: null
},
events: {
onPrevious: ""
},
handlers: {
onItemTap: "itemTap",
onParameterChange: "requery"
},
arrangerKind: "CollapsingArranger",
components: [ {
name: "parameterPanel",
kind: "FittableRows",
classes: "left",
components: [ {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.Button",
name: "backButton",
content: "_back".loc(),
ontap: "close"
} ]
}, {
name: "leftTitle",
content: "_advancedSearch".loc(),
classes: "xv-parameter-title"
} ]
}, {
name: "listPanel",
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
name: "contentToolbar",
components: [ {
kind: "onyx.Grabber"
}, {
name: "rightLabel",
content: "_search".loc(),
style: "text-align: center"
}, {
name: "search",
kind: "onyx.InputDecorator",
style: "float: right;",
components: [ {
name: "searchInput",
kind: "onyx.Input",
style: "width: 200px;",
placeholder: "Search",
onchange: "requery"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
} ]
} ]
} ],
init: !1,
close: function(e) {
this.doPrevious();
},
itemTap: function(e, t) {
var n = t.list, r = n ? n.getModel(t.index) : null;
r && (this.callback && this.callback(r), this.close());
},
fetch: function(e) {
if (!this.init) return;
e = e ? _.clone(e) : {};
var t = this.$.list, n, r, i, s;
if (!t) return;
n = t.getQuery() || {}, r = this.$.searchInput.getValue(), i = this.$.parameterWidget, s = i ? i.getParameters() : [], e.showMore = _.isBoolean(e.showMore) ? e.showMore : !1, r || s.length ? (n.parameters = [], r && (n.parameters = [ {
attribute: t.getSearchableAttributes(),
operator: "MATCHES",
value: this.$.searchInput.getValue()
} ]), s && (n.parameters = n.parameters.concat(s))) : delete n.parameters, t.setQuery(n), t.fetch(e);
},
requery: function(e, t) {
return this.fetch(), !0;
},
setList: function(e, t) {
var n;
n = this.createComponent({
name: "list",
container: this.$.listPanel,
kind: e,
fit: !0
}), this.$.rightLabel.setContent(n.label), this.setCallback(t), n && this.createComponent({
name: "parameterWidget",
container: this.$.parameterPanel,
kind: n.getParameterWidget(),
fit: !0
}), this.init = !0, this.render();
},
setSearchText: function(e) {
this.$.searchInput.setValue(e);
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
handlers: {
onTransitionStart: "start"
},
previousView: "",
currentViewChanged: function() {
var e = this.children, t = this.getCurrentView(), n = this.$[t], r = e.indexOf(n), i = this.previousView;
if (r === -1) this.log(this.name, "Could not find requested view %@".f(t), this.children, n, this.$), i || i === null ? this.currentView = i : this.currentView = null; else {
if (r === this.getIndex()) return;
this.previousView = t, this.setIndex(r);
}
},
create: function() {
var e = this.getCarouselEvents(), t = this.handlers, n;
if (e) for (n in e) e.hasOwnProperty(n) && (t[n] = "handleCarouselEvent");
this.inherited(arguments);
},
handleCarouselEvent: function(e, t) {
var n = this.getCarouselEvents(), r = t.eventName, i = n[r], s = this.getActive().name;
return i && (this.setCurrentView(i), t.previous = s, this.$[i].waterfall("onPanelChange", t)), !0;
},
completed: function() {
var e;
this.inherited(arguments), e = this.getActive(), e && e.activated && e.activated();
},
start: function() {
var e;
this.inherited(arguments), e = this.getActive(), e && e.willActivate && e.willActivate();
}
});
})();

// number.js

(function() {
enyo.kind({
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
name: "XV.AccountTypeDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.accountTypes",
valueAttribute: "id"
}
}), enyo.kind({
name: "XV.CommentTypeDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.commentTypes"
}
}), enyo.kind({
name: "XV.CountryDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.countries"
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
name: "XV.IncidentStatusDropdown",
kind: "XV.DropdownWidget",
published: {
collection: "XM.incidentStatuses",
valueAttribute: "id"
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

// relation.js

(function() {
enyo.kind({
name: "XV.AccountWidget",
kind: "XV.RelationWidget",
list: "XV.AccountList"
}), enyo.kind({
name: "XV.ContactWidget",
kind: "XV.RelationWidget",
label: "_name".loc(),
list: "XV.ContactList",
keyAttribute: "name",
nameAttribute: "jobTitle",
descripAttribute: "phone",
components: [ {
kind: "FittableColumns",
components: [ {
name: "label",
content: "",
classes: "xv-decorated-label"
}, {
kind: "onyx.InputDecorator",
classes: "xv-input-decorator",
components: [ {
name: "input",
kind: "onyx.Input",
classes: "xv-subinput",
onkeyup: "keyUp",
onkeydown: "keyDown",
onblur: "receiveBlur"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
kind: "onyx.IconButton",
src: "assets/relation-icon-search.png"
}, {
name: "popupMenu",
floating: !0,
kind: "onyx.Menu",
components: [ {
kind: "XV.MenuItem",
name: "searchItem",
content: "_search".loc()
}, {
kind: "XV.MenuItem",
name: "openItem",
content: "_open".loc(),
disabled: !0
}, {
kind: "XV.MenuItem",
name: "newItem",
content: "_new".loc(),
disabled: !0
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
classes: "xv-relationwidget-completer",
onSelect: "relationSelected",
components: [ {
kind: "onyx.Menu",
name: "autocompleteMenu",
modal: !1
} ]
} ]
} ]
}, {
kind: "FittableColumns",
components: [ {
name: "labels",
classes: "xv-relationwidget-column left",
components: [ {
name: "jobTitleLabel",
content: "_jobTitle".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
}, {
name: "phoneLabel",
content: "_phone".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
}, {
name: "alternateLabel",
content: "_alternate".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
}, {
name: "faxLabel",
content: "_fax".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
}, {
name: "primaryEmailLabel",
content: "_email".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
}, {
name: "webAddressLabel",
content: "_phone".loc() + ":",
classes: "xv-relationwidget-description label",
showing: !1
} ]
}, {
name: "data",
fit: !0,
components: [ {
name: "name",
classes: "xv-relationwidget-description hasLabel"
}, {
name: "description",
classes: "xv-relationwidget-description hasLabel"
}, {
name: "alternate",
classes: "xv-relationwidget-description hasLabel"
}, {
name: "fax",
classes: "xv-relationwidget-description hasLabel"
}, {
name: "primaryEmail",
ontap: "sendMail",
classes: "xv-relationwidget-description hasLabel hyperlink"
}, {
name: "webAddress",
ontap: "openWindow",
classes: "xv-relationwidget-description hasLabel hyperlink"
} ]
} ]
} ],
disabledChanged: function() {
this.inherited(arguments);
var e = this.getDisabled();
this.$.phone && (this.$.jobTitle.addRemoveClass("disabled", e), this.$.phone.addRemoveClass("disabled", e), this.$.alternate.addRemoveClass("disabled", e), this.$.fax.addRemoveClass("disabled", e), this.$.primaryEmail.addRemoveClass("disabled", e), this.$.webAddress.addRemoveClass("disabled", e));
},
setValue: function(e, t) {
this.inherited(arguments);
if (!e) return;
var n = e.get("jobTitle"), r = e.get("phone"), i = e.get("alternate"), s = e.get("fax"), o = e.get("primaryEmail"), u = e.get("webAddress");
e && e.get && (this.$.jobTitleLabel.setShowing(n), this.$.phoneLabel.setShowing(r), this.$.alternate.setShowing(i), this.$.alternate.setContent(i), this.$.alternateLabel.setShowing(i), this.$.fax.setShowing(s), this.$.fax.setContent(s), this.$.faxLabel.setShowing(s), this.$.primaryEmail.setShowing(o), this.$.primaryEmail.setContent(o), this.$.primaryEmailLabel.setShowing(o), this.$.webAddress.setShowing(u), this.$.webAddress.setContent(u), this.$.webAddressLabel.setShowing(u));
},
openWindow: function() {
var e = this.value ? this.value.get("webAddress") : null;
return e && window.open("http://" + e), !0;
},
sendMail: function() {
var e = this.value ? this.value.get("primaryEmail") : null, t;
return e && (t = window.open("mailto:" + e), t.close()), !0;
}
}), enyo.kind({
name: "XV.IncidentWidget",
kind: "XV.RelationWidget",
list: "XV.IncidentList",
nameAttribute: "description"
}), enyo.kind({
name: "XV.ItemWidget",
kind: "XV.RelationWidget",
list: "XV.ItemList",
nameAttribute: "description1",
descripAttribute: "description2"
}), enyo.kind({
name: "XV.UserAccountWidget",
kind: "XV.RelationWidget",
list: "XV.UserAccountList",
keyAttribute: "username",
nameAttribute: "properName"
});
})();

// list.js

(function() {
enyo.kind({
name: "XV.AccountList",
kind: "XV.List",
label: "_accounts".loc(),
collection: "XM.AccountInfoCollection",
query: {
orderBy: [ {
attribute: "number"
} ]
},
parameterWidget: "XV.AccountInfoParameters",
workspace: "XV.AccountWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "primaryContact.phone",
fit: !0,
classes: "right"
} ]
}, {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "name"
}, {
kind: "XV.ListAttr",
attr: "primaryContact.primaryEmail",
ontap: "sendMail",
classes: "right hyperlink"
} ]
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "primaryContact.name",
classes: "italic",
placeholder: "_noContact".loc()
}, {
kind: "XV.ListAttr",
attr: "primaryContact.address.formatShort"
} ]
} ]
} ]
} ],
sendMail: function(e, t) {
var n = this.getModel(t.index), r = n ? n.getValue("primaryContact.primaryEmail") : null, i;
return r && (i = window.open("mailto:" + r), i.close()), !0;
}
}), enyo.kind({
name: "XV.ContactList",
kind: "XV.List",
label: "_contacts".loc(),
collection: "XM.ContactInfoCollection",
query: {
orderBy: [ {
attribute: "lastName"
}, {
attribute: "firstName"
}, {
attribute: "primaryEmail"
}, {
attribute: "id"
} ]
},
parameterWidget: "XV.ContactInfoParameters",
workspace: "XV.ContactWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "firstName",
formatter: "formatFirstName"
}, {
kind: "XV.ListAttr",
attr: "lastName",
fit: !0,
classes: "bold",
style: "padding-left: 0px;"
} ]
}, {
kind: "XV.ListAttr",
attr: "phone",
fit: !0,
classes: "right"
} ]
}, {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "jobTitle",
placeholder: "_noJobTitle".loc()
}, {
kind: "XV.ListAttr",
attr: "primaryEmail",
ontap: "sendMail",
classes: "right hyperlink",
fit: !0
} ]
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "account.name",
classes: "italic",
placeholder: "_noAccountName".loc()
}, {
kind: "XV.ListAttr",
attr: "address.formatShort"
} ]
} ]
} ]
} ],
formatFirstName: function(e, t, n) {
return t.addRemoveClass("bold", _.isEmpty(n.get("lastName").trim())), e;
},
sendMail: function(e, t) {
var n = this.getModel(t.index), r = n ? n.getValue("primaryEmail") : null, i;
return r && (i = window.open("mailto:" + r), i.close()), !0;
}
}), enyo.kind({
name: "XV.IncidentList",
kind: "XV.List",
label: "_incidents".loc(),
collection: "XM.IncidentInfoCollection",
query: {
orderBy: [ {
attribute: "created"
} ]
},
parameterWidget: "XV.IncidentInfoParameters",
workspace: "XV.IncidentWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "updated",
fit: !0,
formatter: "formatDate",
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "description"
} ]
}, {
kind: "XV.ListColumn",
classes: "second",
components: [ {
kind: "XV.ListAttr",
attr: "account.name",
classes: "italic"
}, {
kind: "XV.ListAttr",
attr: "contact.name"
} ]
}, {
kind: "XV.ListColumn",
classes: "third",
components: [ {
kind: "XV.ListAttr",
attr: "getIncidentStatusString"
}, {
kind: "XV.ListAttr",
attr: "owner.username"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "priority.name",
placeholder: "_noPriority".loc()
}, {
kind: "XV.ListAttr",
attr: "category.name",
placeholder: "_noCategory".loc()
} ]
} ]
} ]
} ],
formatDate: function(e, t, n) {
var r = !XT.date.compareDate(e, new Date);
return t.addRemoveClass("bold", r), e;
}
}), enyo.kind({
name: "XV.ItemList",
kind: "XV.List",
label: "_items".loc(),
collection: "XM.ItemInfoCollection",
query: {
orderBy: [ {
attribute: "number"
} ]
},
parameterWidget: "XV.ItemInfoParameters",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "inventoryUnit.name",
fit: !0,
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "description1"
} ]
} ]
} ]
} ]
}), enyo.kind({
name: "XV.OpportunityList",
kind: "XV.List",
collection: "XM.OpportunityInfoCollection",
query: {
orderBy: [ {
attribute: "targetClose"
}, {
attribute: "name"
}, {
attribute: "id"
} ]
},
label: "_opportunities".loc(),
parameterWidget: "XV.OpportunityInfoParameters",
workspace: "XV.OpportunityWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "targetClose",
fit: !0,
formatter: "formatTargetClose",
placeholder: "_noCloseTarget".loc(),
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "name"
} ]
}, {
kind: "XV.ListColumn",
classes: "second",
components: [ {
kind: "XV.ListAttr",
attr: "account.name",
classes: "italic",
placeholder: "_noAccountName".loc()
}, {
kind: "XV.ListAttr",
attr: "contact.name"
} ]
}, {
kind: "XV.ListColumn",
classes: "third",
components: [ {
kind: "XV.ListAttr",
attr: "opportunityStage.name",
placeholder: "_noStage".loc()
}, {
kind: "XV.ListAttr",
attr: "owner.username"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "priority.name",
placeholder: "_noPriority".loc()
}, {
kind: "XV.ListAttr",
attr: "opportunityType.name",
placeholder: "_noType".loc()
} ]
} ]
} ]
} ],
formatTargetClose: function(e, t, n) {
var r = n && n.get("isActive") && XT.date.compareDate(e, new Date) < 1;
return t.addRemoveClass("error", r), e;
}
}), enyo.kind({
name: "XV.ProjectList",
kind: "XV.List",
label: "_projects".loc(),
collection: "XM.ProjectInfoCollection",
query: {
orderBy: [ {
attribute: "number"
} ]
},
parameterWidget: "XV.ProjectInfoParameters",
workspace: "XV.ProjectWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "dueDate",
fit: !0,
formatter: "formatDueDate",
placeholder: "_noCloseTarget".loc(),
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "name"
}, {
kind: "XV.ListAttr",
attr: "account.name"
} ]
}, {
kind: "XV.ListColumn",
classes: "third",
components: [ {
kind: "XV.ListAttr",
attr: "getProjectStatusString",
placeholder: "_noAccountName".loc()
}, {
kind: "XV.ListAttr",
attr: "owner.username"
} ]
}, {
kind: "XV.ListColumn",
style: "width: 80;",
components: [ {
content: "_budgeted".loc() + ":",
classes: "xv-list-attr",
style: "text-align: right;"
}, {
content: "_actual".loc() + ":",
classes: "xv-list-attr",
style: "text-align: right;"
}, {
content: "_balance".loc() + ":",
classes: "xv-list-attr",
style: "text-align: right;"
} ]
}, {
kind: "XV.ListColumn",
classes: "money",
components: [ {
kind: "XV.ListAttr",
attr: "budgetedExpenses",
classes: "text-align-right",
formatter: "formatExpenses"
}, {
kind: "XV.ListAttr",
attr: "actualExpenses",
classes: "text-align-right",
formatter: "formatExpenses"
}, {
kind: "XV.ListAttr",
attr: "balanceExpenses",
classes: "text-align-right",
formatter: "formatExpenses"
} ]
}, {
kind: "XV.ListColumn",
classes: "money",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "budgetedHours",
classes: "text-align-right",
formatter: "formatHours"
}, {
kind: "XV.ListAttr",
attr: "actualHours",
classes: "text-align-right",
formatter: "formatHours"
}, {
kind: "XV.ListAttr",
attr: "balanceHours",
classes: "text-align-right",
formatter: "formatHours"
} ]
} ]
} ]
} ],
formatDueDate: function(e, t, n) {
var r = new Date, i = XM.Project, s = n.get("status") !== i.COMPLETED && XT.date.compareDate(e, r) < 1;
return t.addRemoveClass("error", s), e;
},
formatHours: function(e, t, n) {
return t.addRemoveClass("error", e < 0), Globalize.format(e, "n2") + " " + "_hrs".loc();
},
formatExpenses: function(e, t, n) {
return t.addRemoveClass("error", e < 0), Globalize.format(e, "c" + XT.MONEY_SCALE);
}
}), enyo.kind({
name: "XV.ToDoList",
kind: "XV.List",
label: "_toDos".loc(),
collection: "XM.ToDoInfoCollection",
parameterWidget: "XV.ToDoInfoParameters",
query: {
orderBy: [ {
attribute: "dueDate"
}, {
attribute: "name"
} ]
},
workspace: "XV.ToDoWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "name",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "dueDate",
fit: !0,
formatter: "formatDueDate",
placeholder: "_noDueDate".loc(),
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "description",
placeholder: "_noDescription".loc()
} ]
}, {
kind: "XV.ListColumn",
classes: "second",
components: [ {
kind: "XV.ListAttr",
attr: "account.name",
classes: "italic",
placeholder: "_noAccountName".loc()
}, {
kind: "XV.ListAttr",
attr: "contact.name"
} ]
}, {
kind: "XV.ListColumn",
classes: "third",
components: [ {
kind: "XV.ListAttr",
attr: "getToDoStatusString"
}, {
kind: "XV.ListAttr",
attr: "owner.username"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "priority.name",
placeholder: "_noPriority".loc()
} ]
} ]
} ]
} ],
formatDueDate: function(e, t, n) {
var r = new Date, i = XM.ToDo, s = n.get("status") !== i.COMPLETED && XT.date.compareDate(e, r) < 1;
return t.addRemoveClass("error", s), e;
}
}), enyo.kind({
name: "XV.UserAccountList",
kind: "XV.List",
label: "_userAccounts".loc(),
collection: "XM.UserAccountInfoCollection",
query: {
orderBy: [ {
attribute: "username"
} ]
},
workspace: "XV.UserAccountWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "short",
components: [ {
kind: "XV.ListAttr",
attr: "username",
classes: "bold"
} ]
}, {
kind: "XV.ListColumn",
classes: "short",
components: [ {
kind: "XV.ListAttr",
attr: "propername"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "isActive",
formatter: "formatActive"
} ]
} ]
} ]
} ],
formatActive: function(e, t, n) {
return e ? "_active".loc() : "";
}
}), enyo.kind({
name: "XV.HonorificList",
kind: "XV.List",
label: "_honorifics".loc(),
collection: "XM.HonorificCollection",
query: {
orderBy: [ {
attribute: "code"
} ]
},
workspace: "XV.HonorificWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "XV.ListColumn",
classes: "last",
components: [ {
kind: "XV.ListAttr",
attr: "code",
classes: "bold"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.AbbreviationList",
kind: "XV.List",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "short",
components: [ {
kind: "XV.ListAttr",
attr: "abbreviation",
classes: "bold"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "name"
} ]
} ]
} ]
} ]
}), enyo.kind({
name: "XV.StateList",
kind: "XV.AbbreviationList",
label: "_states".loc(),
collection: "XM.StateCollection",
query: {
orderBy: [ {
attribute: "abbreviation"
} ]
},
workspace: "XV.StateWorkspace"
}), enyo.kind({
name: "XV.CountryList",
kind: "XV.AbbreviationList",
label: "_countries".loc(),
collection: "XM.CountryCollection",
query: {
orderBy: [ {
attribute: "abbreviation"
} ]
},
workspace: "XV.CountryWorkspace"
}), enyo.kind({
name: "XV.NameDescriptionList",
kind: "XV.List",
query: {
orderBy: [ {
attribute: "name"
} ]
},
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "short",
components: [ {
kind: "XV.ListAttr",
attr: "name",
classes: "bold"
} ]
}, {
kind: "XV.ListColumn",
classes: "last",
fit: !0,
components: [ {
kind: "XV.ListAttr",
attr: "description"
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
var e = this.kind.substring(0, this.kind.length - 4).substring(3);
if (!this.getLabel()) {
var t = "_" + e.camelize().pluralize();
this.setLabel(t.loc());
}
this.getCollection() || this.setCollection("XM." + e + "Collection"), this.getWorkspace() || this.setWorkspace("XV." + e + "Workspace");
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
attribute: "name"
} ]
}
}
}), enyo.kind({
name: "XV.OpportunityStageList",
kind: "XV.NameDescriptionList",
published: {
query: {
orderBy: [ {
attribute: "name"
} ]
}
}
}), enyo.kind({
name: "XV.OpportunityTypeList",
kind: "XV.NameDescriptionList",
published: {
query: {
orderBy: [ {
attribute: "name"
} ]
}
}
}), enyo.kind({
name: "XV.UserAccountRoleList",
kind: "XV.NameDescriptionList",
collection: "XM.UserAccountRoleInfoCollection"
});
})();

// parameter.js

(function() {
enyo.kind({
name: "XV.AccountInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_account".loc()
}, {
attr: "isActive",
label: "_showInactive".loc(),
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), e;
}
}, {
label: "_number".loc(),
attr: "number"
}, {
label: "_name".loc(),
attr: "name"
}, {
kind: "onyx.GroupboxHeader",
content: "_contact".loc()
}, {
label: "_primaryContact".loc(),
attr: "primaryContact.name"
}, {
label: "_primaryEmail".loc(),
attr: "primaryContact.primaryEmail"
}, {
kind: "onyx.GroupboxHeader",
content: "_address".loc()
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
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccount".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
} ]
}), enyo.kind({
name: "XV.ContactInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_contact".loc()
}, {
attr: "isActive",
label: "_showInactive".loc(),
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), e;
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
kind: "onyx.GroupboxHeader",
content: "_address".loc()
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
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccount".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
} ]
}), enyo.kind({
name: "XV.IncidentInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_incident".loc()
}, {
label: "_number".loc(),
attr: "number",
getParameter: function() {
var e, t = this.getValue() - 0;
return t && _.isNumber(t) && (e = {
attribute: this.getAttr(),
operator: "=",
value: t
}), e;
}
}, {
label: "_description".loc(),
attr: "description"
}, {
label: "_category".loc(),
attr: "category",
defaultKind: "XV.IncidentCategoryDropdown"
}, {
label: "_account".loc(),
attr: "account",
defaultKind: "XV.AccountWidget"
}, {
label: "_contact".loc(),
attr: "contact",
defaultKind: "XV.ContactWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_status".loc()
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
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
}, {
label: "_assignedTo".loc(),
attr: "assignedTo",
defaultKind: "XV.UserAccountWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_created".loc()
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
name: "XV.ItemInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_item".loc()
}, {
attr: "isActive",
label: "_showInactive".loc(),
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), e;
}
}, {
label: "_number".loc(),
attr: "number"
}, {
label: "_description".loc(),
attr: [ "description1", "description2" ]
} ]
}), enyo.kind({
name: "XV.OpportunityInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_opportunity".loc()
}, {
label: "_showInactive".loc(),
attr: "isActive",
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "=",
value: !0
}), e;
}
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_account".loc(),
attr: "account",
defaultKind: "XV.AccountWidget"
}, {
label: "_contact".loc(),
attr: "contact",
defaultKind: "XV.ContactWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_status".loc()
}, {
label: "_stage".loc(),
attr: "opportunityStage",
defaultKind: "XV.OpportunityStageDropdown"
}, {
label: "_priority".loc(),
attr: "priority",
defaultKind: "XV.PriorityDropdown"
}, {
label: "_type".loc(),
attr: "opportunityType",
defaultKind: "XV.OpportunityTypeDropdown"
}, {
label: "_source".loc(),
attr: "opportunitySource",
defaultKind: "XV.OpportunitySourceDropdown"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
}, {
label: "_assignedTo".loc(),
attr: "assignedTo",
defaultKind: "XV.UserAccountWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_targetClose".loc()
}, {
label: "_startDate".loc(),
attr: "targetClose",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_endDate".loc(),
attr: "targetClose",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
}), enyo.kind({
name: "XV.ProjectInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_project".loc()
}, {
label: "_showCompleted".loc(),
attr: "status",
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "!=",
value: "C"
}), e;
}
}, {
label: "_number".loc(),
attr: "number"
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_account".loc(),
attr: "account",
defaultKind: "XV.AccountWidget"
}, {
label: "_contact".loc(),
attr: "contact",
defaultKind: "XV.ContactWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_status".loc()
}, {
label: "_status".loc(),
attr: "status",
defaultKind: "XV.ProjectStatusDropdown"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
}, {
label: "_assignedTo".loc(),
attr: "assignedTo",
defaultKind: "XV.UserAccountWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_dueDate".loc()
}, {
label: "_startDate".loc(),
attr: "dueDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_endDate".loc(),
attr: "dueDate",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
}), enyo.kind({
name: "XV.ToDoInfoParameters",
kind: "XV.ParameterWidget",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_toDo".loc()
}, {
label: "_showCompleted".loc(),
attr: "status",
defaultKind: "XV.CheckboxWidget",
getParameter: function() {
var e;
return this.getValue() || (e = {
attribute: this.getAttr(),
operator: "!=",
value: "C"
}), e;
}
}, {
label: "_name".loc(),
attr: "name"
}, {
label: "_description".loc(),
attr: "description"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
label: "_owner".loc(),
attr: "owner",
defaultKind: "XV.UserAccountWidget"
}, {
label: "_assignedTo".loc(),
attr: "assignedTo",
defaultKind: "XV.UserAccountWidget"
}, {
kind: "onyx.GroupboxHeader",
content: "_dueDate".loc()
}, {
label: "_startDate".loc(),
attr: "dueDate",
operator: ">=",
defaultKind: "XV.DateWidget"
}, {
label: "_endDate".loc(),
attr: "dueDate",
operator: "<=",
defaultKind: "XV.DateWidget"
} ]
});
})();

// workspace.js

(function() {
enyo.kind({
name: "XV.OrderedReferenceWorkspace",
kind: "XV.Workspace",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "description"
}, {
kind: "XV.NumberWidget",
attr: "order"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.AccountWorkspace",
kind: "XV.Workspace",
title: "_account".loc(),
model: "XM.Account",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "number"
}, {
kind: "XV.CheckboxWidget",
attr: "isActive"
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.AccountTypeDropdown",
attr: "accountType"
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
}, {
kind: "onyx.GroupboxHeader",
content: "_primaryContact".loc()
}, {
kind: "XV.ContactWidget",
attr: "primaryContact"
}, {
kind: "onyx.GroupboxHeader",
content: "_secondaryContact".loc()
}, {
kind: "XV.ContactWidget",
attr: "secondaryContact"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.AccountCommentBox",
attr: "comments"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.ContactWorkspace",
kind: "XV.Workspace",
title: "_contact".loc(),
model: "XM.Contact",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "number"
}, {
kind: "XV.CheckboxWidget",
attr: "isActive"
}, {
kind: "onyx.GroupboxHeader",
content: "_name".loc()
}, {
kind: "XV.InputWidget",
attr: "firstName"
}, {
kind: "XV.InputWidget",
attr: "middleName"
}, {
kind: "XV.InputWidget",
attr: "lastName"
}, {
kind: "XV.InputWidget",
attr: "suffix"
}, {
kind: "onyx.GroupboxHeader",
content: "_address".loc()
}, {
kind: "XV.AddressWidget",
attr: "address"
}, {
kind: "onyx.GroupboxHeader",
content: "_information".loc()
}, {
kind: "XV.InputWidget",
attr: "jobTitle"
}, {
kind: "XV.InputWidget",
attr: "primaryEmail"
}, {
kind: "XV.InputWidget",
attr: "phone"
}, {
kind: "XV.InputWidget",
attr: "alternate"
}, {
kind: "XV.InputWidget",
attr: "fax"
}, {
kind: "onyx.GroupboxHeader",
content: "_relationships".loc()
}, {
kind: "XV.AccountWidget",
attr: "account"
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.ContactCommentBox",
attr: "comments"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.CountryWorkspace",
kind: "XV.Workspace",
title: "_country".loc(),
model: "XM.Country",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "abbreviation"
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "currencyName"
}, {
kind: "XV.InputWidget",
attr: "currencySymbol"
}, {
kind: "XV.InputWidget",
attr: "currencyAbbreviation"
}, {
kind: "XV.InputWidget",
attr: "currencyNumber"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.HonorificWorkspace",
kind: "XV.Workspace",
title: "_honorific".loc(),
model: "XM.Honorific",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "code"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.IncidentWorkspace",
kind: "XV.Workspace",
title: "_incident".loc(),
model: "XM.Incident",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "number"
}, {
kind: "XV.InputWidget",
attr: "description"
}, {
kind: "XV.AccountWidget",
attr: "account"
}, {
kind: "XV.ContactWidget",
attr: "contact"
}, {
kind: "XV.IncidentCategoryDropdown",
attr: "category"
}, {
kind: "onyx.GroupboxHeader",
content: "_status".loc()
}, {
kind: "XV.IncidentStatusDropdown",
attr: "status"
}, {
kind: "XV.PriorityDropdown",
attr: "priority"
}, {
kind: "XV.IncidentSeverityDropdown",
attr: "severity"
}, {
kind: "XV.IncidentResolutionDropdown",
attr: "resolution"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
}, {
kind: "XV.UserAccountWidget",
attr: "assignedTo"
}, {
kind: "onyx.GroupboxHeader",
content: "_relationships".loc()
}, {
kind: "XV.ItemWidget",
attr: "item"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.IncidentCommentBox",
attr: "comments"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.IncidentCategoryWorkspace",
kind: "XV.OrderedReferenceWorkspace",
title: "_incidentCategory".loc(),
model: "XM.IncidentCategory"
}), enyo.kind({
name: "XV.IncidentResolutionWorkspace",
kind: "XV.OrderedReferenceWorkspace",
title: "_incidentResolution".loc(),
model: "XM.IncidentResolution"
}), enyo.kind({
name: "XV.IncidentSeverityWorkspace",
kind: "XV.OrderedReferenceWorkspace",
title: "_incidentSeverity".loc(),
model: "XM.IncidentSeverity"
}), enyo.kind({
name: "XV.OpportunityWorkspace",
kind: "XV.Workspace",
title: "_opportunity".loc(),
model: "XM.Opportunity",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "number"
}, {
kind: "XV.CheckboxWidget",
attr: "isActive"
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.AccountWidget",
attr: "account"
}, {
kind: "XV.ContactWidget",
attr: "contact"
}, {
kind: "XV.MoneyWidget",
attr: "amount"
}, {
kind: "XV.PercentWidget",
attr: "probability"
}, {
kind: "onyx.GroupboxHeader",
content: "_status".loc()
}, {
kind: "XV.OpportunityStageDropdown",
attr: "opportunityStage",
label: "_stage".loc()
}, {
kind: "XV.PriorityDropdown",
attr: "priority"
}, {
kind: "XV.OpportunityTypeDropdown",
attr: "opportunityType",
label: "_type".loc()
}, {
kind: "XV.OpportunitySourceDropdown",
attr: "opportunitySource",
label: "_source".loc()
}, {
kind: "onyx.GroupboxHeader",
content: "_schedule".loc()
}, {
kind: "XV.DateWidget",
attr: "targetClose"
}, {
kind: "XV.DateWidget",
attr: "startDate"
}, {
kind: "XV.DateWidget",
attr: "assignDate"
}, {
kind: "XV.DateWidget",
attr: "actualClose"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
}, {
kind: "XV.UserAccountWidget",
attr: "assignedTo"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.OpportunityCommentBox",
attr: "comments"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.OpportunitySourceWorkspace",
kind: "XV.Workspace",
title: "_opportunitySource".loc(),
model: "XM.OpportunitySource"
}), enyo.kind({
name: "XV.OpportunityStageWorkspace",
kind: "XV.Workspace",
title: "_opportunityStage".loc(),
model: "XM.OpportunityStage"
}), enyo.kind({
name: "XV.OpportunityTypeWorkspace",
kind: "XV.Workspace",
title: "_opportunityType".loc(),
model: "XM.OpportunityType"
}), enyo.kind({
name: "XV.PriorityWorkspace",
kind: "XV.OrderedReferenceWorkspace",
title: "_priority".loc(),
model: "XM.Priority"
}), enyo.kind({
name: "XV.ProjectWorkspace",
kind: "XV.Workspace",
title: "_project".loc(),
model: "XM.Project",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
classes: "xv-top-panel",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "number"
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.ProjectStatusDropdown",
attr: "status"
}, {
kind: "onyx.GroupboxHeader",
content: "_schedule".loc()
}, {
kind: "XV.DateWidget",
attr: "dueDate"
}, {
kind: "XV.DateWidget",
attr: "startDate"
}, {
kind: "XV.DateWidget",
attr: "assignDate"
}, {
kind: "XV.DateWidget",
attr: "completeDate"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
}, {
kind: "XV.UserAccountWidget",
attr: "assignedTo"
}, {
kind: "onyx.GroupboxHeader",
content: "_relationships".loc()
}, {
kind: "XV.AccountWidget",
attr: "account"
}, {
kind: "XV.ContactWidget",
attr: "contact"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.ProjectCommentBox",
attr: "comments"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_tasks".loc(),
components: [ {
kind: "XV.ProjectTaskRepeaterBox",
attr: "tasks"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.StateWorkspace",
kind: "XV.Workspace",
title: "_state".loc(),
model: "XM.State",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "abbreviation"
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.CountryDropdown",
attr: "country"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.ToDoWorkspace",
kind: "XV.Workspace",
title: "_toDo".loc(),
model: "XM.ToDo",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "description"
}, {
kind: "XV.PriorityDropdown",
attr: "priority"
}, {
kind: "onyx.GroupboxHeader",
content: "_schedule".loc()
}, {
kind: "XV.DateWidget",
attr: "dueDate"
}, {
kind: "XV.DateWidget",
attr: "startDate"
}, {
kind: "XV.DateWidget",
attr: "assignDate"
}, {
kind: "XV.DateWidget",
attr: "completeDate"
}, {
kind: "onyx.GroupboxHeader",
content: "_userAccounts".loc()
}, {
kind: "XV.UserAccountWidget",
attr: "owner"
}, {
kind: "XV.UserAccountWidget",
attr: "assignedTo"
}, {
kind: "onyx.GroupboxHeader",
content: "_relationships".loc()
}, {
kind: "XV.AccountWidget",
attr: "account"
}, {
kind: "XV.ContactWidget",
attr: "contact"
} ]
}, {
kind: "XV.Groupbox",
title: "_notes".loc(),
components: [ {
kind: "onyx.GroupboxHeader",
content: "_notes".loc()
}, {
kind: "XV.TextArea",
attr: "notes"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
title: "_comments".loc(),
components: [ {
kind: "XV.ToDoCommentBox",
attr: "comments"
} ]
} ]
} ]
}), enyo.kind({
name: "XV.UserAccountWorkspace",
kind: "XV.Workspace",
title: "_userAccount".loc(),
model: "XM.UserAccount",
handlers: {
onRefreshPrivileges: "refreshPrivileges"
},
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
classes: "xv-top-panel",
components: [ {
kind: "XV.UserAccountRoleGroupbox",
name: "grantedUserAccountRoles"
}, {
kind: "XV.UserAccountPrivilegeGroupbox",
name: "grantedPrivileges"
}, {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.CheckboxWidget",
attr: "isActive"
}, {
kind: "XV.InputWidget",
attr: "properName"
}, {
kind: "XV.InputWidget",
attr: "initials"
}, {
kind: "XV.InputWidget",
attr: "email"
} ]
} ]
} ],
refreshPrivileges: function(e, t) {
this.$.grantedPrivileges.mapIds(), this.$.grantedPrivileges.tryToRender();
}
}), enyo.kind({
name: "XV.UserAccountRoleWorkspace",
kind: "XV.Workspace",
title: "_userAccountRole".loc(),
model: "XM.UserAccountRole",
components: [ {
kind: "Panels",
name: "topPanel",
arrangerKind: "CarouselArranger",
fit: !0,
classes: "xv-top-panel",
components: [ {
kind: "XV.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "description"
} ]
}, {
kind: "XV.UserAccountRolePrivilegeGroupbox",
attr: "grantedPrivileges"
} ]
} ]
});
})();

// repeater_box.js

(function() {
enyo.kind({
name: "XV.ProjectTaskRepeaterBox",
kind: "XV.RepeaterBox",
published: {
recordType: "XM.ProjectTask",
columns: [ {
kind: "XV.Input",
name: "tasks.number"
}, {
kind: "XV.Input",
name: "tasks.name"
}, {
kind: "XV.Input",
name: "tasks.notes",
classes: "xv-wide-entry"
}, {
kind: "XV.DateWidget",
name: "tasks.dueDate"
}, {
kind: "XV.Number",
name: "tasks.actualHours"
}, {
kind: "XV.Number",
name: "tasks.actualExpenses"
} ]
}
}), enyo.kind({
name: "XV.AccountCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.AccountComment"
}
}), enyo.kind({
name: "XV.ContactCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.ContactComment"
}
}), enyo.kind({
name: "XV.IncidentCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.OpportunityComment"
}
}), enyo.kind({
name: "XV.OpportunityCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.OpportunityComment"
}
}), enyo.kind({
name: "XV.ProjectCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.ProjectComment"
}
}), enyo.kind({
name: "XV.ToDoCommentBox",
kind: "XV.CommentBox",
published: {
recordType: "XM.ToDoComment"
}
});
})();

// assignment_box.js

(function() {
enyo.kind({
name: "XV.UserAccountRoleGroupbox",
kind: "XV.AssignmentBox",
events: {
onRefreshPrivileges: ""
},
segments: [ "Roles" ],
title: "_roles".loc(),
translateLabels: !1,
totalCollectionName: "UserAccountRoleCollection",
type: "userAccountRole",
checkboxChange: function(e, t) {
return this.inherited(arguments), this.doRefreshPrivileges(), !0;
},
getAssignmentModel: function(e) {
return new XM.UserAccountUserAccountRoleAssignment({
userAccountRole: e,
type: "UserAccountUserAccountRoleAssignment",
userAccount: this.getAssignedCollection().userAccount
}, {
isNew: !0
});
}
}), enyo.kind({
name: "XV.UserAccountPrivilegeGroupbox",
kind: "XV.AssignmentBox",
published: {
idsFromRoles: null
},
cacheName: "privileges",
segments: [ "System", "CRM" ],
title: "_privileges".loc(),
totalCollectionName: "PrivilegeCollection",
type: "privilege",
getAssignmentModel: function(e) {
return new XM.UserAccountPrivilegeAssignment({
privilege: e,
type: "UserAccountPrivilegeAssignment",
userAccount: this.getAssignedCollection().userAccount
}, {
isNew: !0
});
},
mapIds: function() {
this.inherited(arguments);
var e = this.getAssignedCollection().userAccount.get("grantedUserAccountRoles"), t = e.map(function(e) {
return e.getStatus() & XM.Model.DESTROYED ? [] : e.get("userAccountRole").get("grantedPrivileges");
}), n = _.map(t, function(e) {
return e.map(function(e) {
var t = e.get("privilege");
return t ? t.get("id") : null;
});
}), r = _.uniq(_.flatten(n));
this.setIdsFromRoles(r);
},
setupCheckbox: function(e, t) {
this.inherited(arguments);
var n = t.item.indexInContainer(), r = e.parent.parent, i = r.segmentIndex, s = this.getSegmentedCollections()[i].at(n), o = t.item.$.checkbox;
this.disableCheckbox(o, _.indexOf(this.getIdsFromRoles(), s.get("id")) >= 0);
},
disableCheckbox: function(e, t) {
t && !e.$.input.checked ? e.$.input.addClass("xv-half-check") : e.$.input.removeClass("xv-half-check");
}
}), enyo.kind({
name: "XV.UserAccountRolePrivilegeGroupbox",
kind: "XV.UserAccountPrivilegeGroupbox",
getAssignmentModel: function(e) {
return new XM.UserAccountRolePrivilegeAssignment({
privilege: e,
type: "UserAccountRolePrivilegeAssignment",
userAccountRole: this.getAssignedCollection().user_account_role,
user_account_role: this.getAssignedCollection().user_account_role
}, {
isNew: !0
});
}
});
})();

// login.js

(function() {
var e = enyo.getCookie("xtsessioncookie"), t = document.location.hostname, n = document.location.pathname;
if (n.match(/login/g)) return;
try {
e = JSON.parse(e);
} catch (r) {
document.location = "https://%@/login".f(t);
}
})();

// postbooks.js

enyo.kind({
name: "XV.Postbooks",
kind: "Panels",
arrangerKind: "CardArranger",
draggable: !1,
classes: "xt-postbooks enyo-unselectable",
handlers: {
onPrevious: "previous",
onSearch: "addSearch",
onWorkspace: "addWorkspacePanel"
},
components: [ {
name: "startup",
classes: "xv-startup-panel",
style: "background: #333;",
components: [ {
classes: "xv-startup-divider",
content: "Loading application data..."
}, {
name: "startupProgressBar",
kind: "onyx.ProgressBar",
classes: "xv-startup-progress",
progress: 0
} ]
}, {
name: "navigator",
kind: "XV.Navigator",
modules: [ {
name: "welcome",
label: "_welcome".loc(),
hasSubmenu: !1,
panels: [ {
name: "welcomePage",
content: "Welcome"
} ]
}, {
name: "crm",
label: "_crm".loc(),
panels: [ {
name: "accountList",
kind: "XV.AccountList"
}, {
name: "contactList",
kind: "XV.ContactList"
}, {
name: "toDoList",
kind: "XV.ToDoList"
}, {
name: "opportunityList",
kind: "XV.OpportunityList"
}, {
name: "incidentList",
kind: "XV.IncidentList"
}, {
name: "projectList",
kind: "XV.ProjectList"
} ]
}, {
name: "setup",
label: "_setup".loc(),
panels: [ {
name: "userAccountList",
kind: "XV.UserAccountList"
}, {
name: "userAccountRoleList",
kind: "XV.UserAccountRoleList"
}, {
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
} ]
} ],
addSearch: function(e, t) {
var n;
t.list && (n = this.createComponent({
kind: "XV.SearchContainer"
}), n.render(), this.reflow(), n.setList(t.list), n.setSearchText(t.searchText), n.setCallback(t.callback), n.fetch(), this.next());
},
addWorkspacePanel: function(e, t) {
var n;
t.workspace && (n = this.createComponent({
kind: "XV.WorkspaceContainer"
}), n.render(), this.reflow(), n.setWorkspace(t.workspace, t.id, t.callback), this.next());
},
getNavigator: function() {
return this.$.navigator;
},
getStartupProgressBar: function() {
return this.$.startupProgressBar;
},
previous: function() {
var e = this.getActive(), t = this.getPanels().length - 1;
this.setIndex(t), e.destroy();
}
});

// crm.js

(function() {})();

// setup.js

(function() {})();

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
onListAdded: "addPulloutItem",
onModelChange: "modelChanged",
onParameterChange: "parameterDidChange",
onTogglePullout: "togglePullout",
onHistoryChange: "refreshHistoryPanel",
onHistoryItemSelected: "selectHistoryItem",
onAnimateProgressFinish: "dataLoaded"
},
components: [ {
name: "postbooks",
kind: "XV.Postbooks",
onTransitionStart: "handlePullout"
}, {
name: "pullout",
kind: "XV.Pullout",
onAnimateFinish: "pulloutAnimateFinish"
} ],
addPulloutItem: function(e, t) {
var n = {
name: t.name,
showing: !1
};
t.getParameterWidget && (n.kind = t.getParameterWidget()), n.kind && (this._pulloutItems === undefined && (this._pulloutItems = []), this._pulloutItems.push(n));
},
create: function() {
this.inherited(arguments);
var e = this._pulloutItems || [], t, n;
for (n = 0; n < e.length; n++) t = e[n], t.container = this.$.pullout.$.pulloutItems, this.$.pullout.createComponent(t);
XT.app = this;
},
getPullout: function() {
return this.$.pullout;
},
handlePullout: function(e, t) {
var n = e.getActive().showPullout || !1;
this.$.pullout.setShowing(n);
},
modelChanged: function(e, t) {
this.$.postbooks.waterfall("onModelChange", t);
},
parameterDidChange: function(e, t) {
this.getIsStarted() && this.$.postbooks.getNavigator().waterfall("onParameterChange", t);
},
pulloutAnimateFinish: function(e, t) {
var n;
e.value === e.max ? this.$.pullout.getSelectedPanel() === "history" ? n = "history" : n = "search" : e.value === e.min && (n = null), this.$.postbooks.getNavigator().setActiveIconButton(n);
},
refreshHistoryPanel: function(e, t) {
this.$.pullout.refreshHistoryList();
},
selectHistoryItem: function(e, t) {
XT.log("Load from history: " + t.workspace + " " + t.id), t.eventName = "onWorkspace", this.waterfall("onWorkspace", t);
},
dataLoaded: function() {
XT.app.$.postbooks.next(), XT.app.$.postbooks.getNavigator().activate();
},
start: function() {
if (this.getIsStarted()) return;
XT.app = this;
var e = XT.getStartupManager(), t = XT.app.$.postbooks.getStartupProgressBar(), n = function() {
var n = e.get("completed").length;
t.animateProgressTo(n);
};
e.registerCallback(n, !0), XT.dataSource.connect(), t.setMax(e.get("queue").length + e.get("completed").length), this.setIsStarted(!0);
},
show: function() {
this.getShowing() && this.getIsStarted() ? this.renderInto(document.body) : this.inherited(arguments);
},
togglePullout: function(e, t) {
this.$.pullout.togglePullout(t.name);
}
});
})();
