/**
  Functions to apply JSON patches per http://tools.ietf.org/html/rfc6902
  Thanks: https://github.com/Starcounter-Jack/JSON-Patch.git
*/
select xt.install_js('XT','jsonpatch','xtuple', $$
var jsonpatch;
(function (jsonpatch) {
    var objOps = {
        add: function (obj, key) {
            obj[key] = this.value;
        },
        remove: function (obj, key) {
            delete obj[key];
        },
        replace: function (obj, key) {
            obj[key] = this.value;
        },
        move: function (obj, key, tree) {
            var temp = {
                op: "_get",
                path: this.from
            };
            apply(tree, [
                temp
            ], undefined);
            apply(tree, [
                {
                    op: "remove",
                    path: this.from
                }
            ], undefined);
            apply(tree, [
                {
                    op: "add",
                    path: this.path,
                    value: temp.value
                }
            ]);
        },
        copy: function (obj, key, tree) {
            var temp = {
                op: "_get",
                path: this.from
            };
            apply(tree, [
                temp
            ], undefined);
            apply(tree, [
                {
                    op: "add",
                    path: this.path,
                    value: temp.value
                }
            ]);
        },
        test: function (obj, key) {
            if(JSON.stringify(obj[key]) != JSON.stringify(this.value)) {
                throw "";
            }
        },
        _get: function (obj, key) {
            this.value = obj[key];
        }
    };
    var arrOps = {
        add: function (arr, i, tree, stateful) {
            arr.splice(i, 0, this.value);
            if (stateful) { updateState(this.value, "create"); }
        },
        remove: function (arr, i, tree, stateful) {
          if (stateful) {
            updateState(arr[i], "delete");
          } else {
            arr.splice(i, 1);
          }
        },
        replace: function (arr, i, tree, stateful) {
            arr[i] = this.value;
            if (stateful) { updateState(this.value); }
        },
        move: objOps.move,
        copy: objOps.copy,
        test: objOps.test,
        _get: objOps._get
    };
    var beforeDict = {};
    function observe(obj) {
        var patches = [];
        var root = obj;
        var observer = {};
        beforeDict[obj] = JSON.parse(JSON.stringify(obj));
        observer.patches = patches;
        observer.object = obj;
        return _observe(observer, obj, patches);
    }
    jsonpatch.observe = observe;
    /// Listen to changes on an object tree, accumulate patches
    function _observe(observer, obj, patches) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                var v = obj[key];
                if(v && typeof (v) === "object") {
                    _observe(observer, v, patches)//path+key);
                    ;
                }
            }
        }
        return observer;
    }
    function generate(observer) {
        var mirror = beforeDict[observer.object];
        _generate(mirror, observer.object, observer.patches, "");
        return observer.patches;
    }
    jsonpatch.generate = generate;
    // Dirty check if obj is different from mirror, generate patches and update mirror
    function _generate(mirror, obj, patches, path) {
        obj = JSON.parse(JSON.stringify(obj));
        var newKeys = Object.keys(obj);
        var oldKeys = Object.keys(mirror);
        var changed = false;
        var deleted = false;
        var added = false;
        for(var t = 0; t < oldKeys.length; t++) {
            var key = oldKeys[t];
            var oldVal = mirror[key];
            if(obj.hasOwnProperty(key)) {
                var newVal = obj[key];
                if(oldVal instanceof Object && newVal instanceof Object) {
                    _generate(oldVal, newVal, patches, path + "/" + key);
                } else {
                    if(oldVal != newVal) {
                        changed = true;
                        patches.push({
                            op: "replace",
                            path: path + "/" + key,
                            value: newVal
                        });
                        mirror[key] = newVal;
                    }
                }
            } else {
                patches.push({
                    op: "remove",
                    path: path + "/" + key
                });
                deleted = true// property has been deleted
                ;
            }
        }
        if(!deleted && newKeys.length == oldKeys.length) {
            return;
        }
        for(var t = 0; t < newKeys.length; t++) {
            var key = newKeys[t];
            if(!mirror.hasOwnProperty(key)) {
                patches.push({
                    op: "add",
                    path: path + "/" + key,
                    value: obj[key]
                });
            }
        }
    }
    /// Apply a json-patch operation on an object tree
    /// stateful is an XTUPLE option
    function apply(tree, patches, stateful) {
        try  {
            patches.forEach(function (patch) {
                // Find the object
                var keys = patch.path.split('/');
                keys.shift()// Remove empty element
                ;
                var obj = tree;
                var t = 0;
                var len = keys.length;
                while(true) {
                    if(obj instanceof Array) {
                        var index = parseInt(keys[t], 10);
                        t++;
                        if(t >= len) {
                            arrOps[patch.op].call(patch, obj, index, tree, stateful)// Apply patch
                            ;
                            break;
                        }
                        obj = obj[index];
                    } else {
                        var key = keys[t];
                        if(key.indexOf('~') != -1) {
                            key = key.replace('~1', '/').replace('~0', '~');
                        }// escape chars

                        t++;
                        if (stateful) { updateState(obj); }
                        if(t >= len) {
                            objOps[patch.op].call(patch, obj, key, tree)// Apply patch
                            ;
                            break;
                        }
                        obj = obj[key];
                    }
                }
            });
        } catch (e) {
            return false;
        }
        return true;
    }
    jsonpatch.apply = apply;

    // XTUPLE CODE
    XT.jsonpatch = jsonpatch

    function updateState(obj, state) {
      state = state || "update";
      var prop,
        i;
      obj.dataState = state;
      if (state !== "update") {
        for (prop in obj) {
          if (obj.hasOwnProperty(prop) && Array.isArray(obj[prop])) {
            for (i = 0; i < obj[prop].length; i++) {
              updateState(obj[prop][i], state);
            }
          }
        }
      }
    }
    jsonpatch.updateState = updateState;

})(jsonpatch || (jsonpatch = {}));
//@ sourceMappingURL=json-patch-duplex.js.map
$$ );