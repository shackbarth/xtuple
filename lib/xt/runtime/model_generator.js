
if(XT.mode !== 'develop') return;

var _fs     = require('fs');
var _path   = require('path');

/**
*/
XT.modelGenerator = XT.Object.create(
  /** @lends XT.modelGenerator.prototype */ {

  /** @private */
  init: function() { 
    var path = __dirname;
    var mixinpath = _path.join(path, 'mixin.tpl');
    var subpath = _path.join(path, 'sub.tpl');
    var mixinclass, subclass;

    try {
      this.__mixintpl = mixinclass = _fs.readFileSync(mixinpath, 'utf8');
      this.__subtpl = subclass = _fs.readFileSync(subpath, 'utf8');
    } catch(err) { issue(XT.fatal(err)); }

    // go ahead and set these now
    XT.MODELSDIRECTORY = XT.opts['generated-models-directory'];
    XT.SUBMODELSDIRECTORY = XT.opts['generated-subclass-models-directory'];
  },

  generate: function(orm, mixinclass) {

    var namespace = orm.nameSpace || '',
        type = orm.type || '',
        date = new Date(), 
        isMixinclass = mixinclass ? true : false,
        body = isMixinclass ? this.__mixintpl : this.__subtpl,
        attributes, nestedRecordNamespace;

    attributes = this.buildAttributes(orm);
    nestedRecordNamespace = this.hasNested(orm) ? "nestedRecordNamespace: %@,".f(namespace) : '';
    privileges = orm.privileges ? "privileges: %@".f(
      JSON.stringify(orm.privileges, null, 2).replace(/\n/g,'\n  ') + ',') : '';
    body = body.f({
      year: date.getFullYear(),
      className: "%@._%@".f(namespace, type),
      className2: "%@.%@".f(namespace, type),
      nestedRecordNamespace: nestedRecordNamespace,
      privileges: privileges,
      attributes: attributes.join(',\n'),
      fileName: type.decamelize(),
      targetDirectory: _path.join(XT.MODELSDIRECTORY, orm.writePath)
    });

    return body;
  },

  writeFiles: function(models, mixinclass, socket) {
    var root = mixinclass ? XT.MODELSDIRECTORY : XT.SUBMODELSDIRECTORY,
        files = Object.keys(models), i, pathTo, file, model, parts, stat, ext, end;
    for(i=0; i<files.length; ++i) {
      file = files[i];
      model = models[file];

      if(!mixinclass) {
        pathTo = _path.basename(file).slice(1);
        pathTo = _path.join(XT.basePath, root, pathTo);
        try {
          _fs.writeFileSync(pathTo, model);
        } catch(err) { 
          issue(XT.warning("could not write subclass file => %@".f(pathTo)+
            ": " + err.message));
        }
        continue;
      }

      parts = file.split('/'); 
      end = parts.pop();
      parts.push('mixins');
      parts.push(end); 
      pathTo = _path.join(XT.basePath, root);

      try {
        if(socket) socket.send("writing %@".f(XT.shorten(file, 3)));
        parts.forEach(function(part, idx) {
          try {
            pathTo = _path.join(pathTo, part);
            ext = _path.extname(pathTo);
            stat = _fs.statSync(pathTo);

            if(stat) {
              if(ext === '' && stat.isDirectory()) {
                if(part === 'mixins') {
                  var prev = pathTo.split('/').slice(0,-1).join('/'),
                      nodePath = _path.join(prev, 'node');
                  if(!_fs.existsSync(nodePath)) {
                    _fs.mkdirSync(nodePath);
                    _fs.writeFileSync(_path.join(nodePath, 'package.json'),
                      '{\n'+
                      // '  "type": "core"\n'+
                      '  "type": "lazy"'+
                      (!~nodePath.indexOf('core') ? ',\n  "dependencies": [\n'+
                        '    "__core__"' +
                        '  ]\n' : '\n') +
                      '}\n'
                    ); 
                  }
                }
                return;
              } else if(ext !== '' && stat.isFile()) {
                issue(XT.warning("overwriting file => %@".f(file)));
                _fs.writeFileSync(pathTo, model);
              } else {
                issue(XT.warning("mismatch someone in filename and type when "+
                  "attempting to write generated model, filename => %@".f(file)+
                  " with the failing parts => %@".f(pathTo)));
                return;
              }

            }
          } catch(err) {
            if(ext === '') {

              // we assume this is a directory? 
              _fs.mkdirSync(pathTo);
              if(parts[idx+1] && parts[idx+1] === 'mixins') {

                // we know we're at the correct level to add a node
                // directory and package.json file
                var nodePath = _path.join(pathTo, 'node');
                _fs.mkdirSync(nodePath);
                _fs.writeFileSync(_path.join(nodePath, 'package.json'),
                  '{\n'+
                  // '  "type": "core"\n'+
                  '  "type": "lazy"'+
                      (!~nodePath.indexOf('core') ? ',\n  "dependencies": [\n'+
                        '    "__core__"\n' +
                        '  ]\n' : '\n') +
                  '}\n'
                ); 
              }
            } else {

              // we assume this is the file?
              if(idx === parts.length-1) {
                _fs.writeFileSync(pathTo, model);
              } else {
                issue(XT.warning("end of path to generated file not valid "+
                  "=> %@ from => %@".f(part, file)));
              }
            }
          }
        });
      } catch(err) {
        if(socket)
          socket.json.emit('error', {
            message: err.message,
            context: file
          });
        else
          issue(XT.warning(err));
        continue;
      }
    }
  },

  buildAttributes: function(orm) {

    if(!orm || !orm.properties) return [];

    var attribute = this.__attrtpl,
        namespace = orm.nameSpace,
        attributes = [], prop, type, type2, method, obj, attprops, name, attr;
    for(i=0; i<orm.properties.length; ++i) {
      prop = orm.properties[i];
      type = prop.attr ? prop.attr.type : prop.toOne ? prop.toOne.type : prop.toMany.type;
      type2 = type;
      method = prop.attr ? 'attr' : prop.toOne ? 'toOne' : 'toMany';
      obj = prop.attr ? prop.attr : prop.toOne ? prop.toOne : prop.toMany;
      attprops = [];
      name = prop.name;

      // handle nested
      if(obj.isNested) {
        attprops.push('isNested: true');
        var inverse = prop.toMany ? "inverse: '" + (prop.toMany.inverse ? prop.toMany.inverse + "'" : "guid'") : null;
        if (inverse) attprops.push(inverse);
      }

      var stdtypes = ['String', 'Number', 'Boolean', 'Money', 'Quantity', 'QuantityPer', 'Cost', 'SalesPrice', 'PurchasePrice', 'ExtendedPrice', 'UnitRatio', 'Percent', 'Weight']
      // handle type
      if(type === 'Date')
      {
        type2 = 'SC.DateTime';
        if(!obj.useIsoDate) {
          attprops.push("format: '%Y-%m-%d'");
          attprops.push("useIsoDate: false");
        } else attprops.push("useIsoDate: true");
      // if not a standard type, must be a complex type
      } else if(stdtypes.indexOf(type) == -1) {
        type = type.pre(namespace.suf('.'));
        type2 = "'%@'".f(type);
      }
      
      // handle required
      if(obj.isRequired) attprops.push('isRequired: true');
      
      // handle defaults
      if(obj.defaultValue !== undefined && obj.defaultValue !== null) {
        if (obj.defaultValue === 'currentDate') {
          if(!obj.useIsoDate) def = "defaultValue: function() {\n      return SC.DateTime.create().toFormattedString('%Y-%m-%d');\n    }";
          else def = "defaultValue: function() {\n      return SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601);\n    }";
        } else if (obj.isNested && obj.defaultValue === 'currentUser') {
          def = "defaultValue: function() {\n"
              + "      var record = arguments[0],\n"
              + "          status = record.get('status'),\n"
              + "          ret;\n"
              + "      if (status = SC.Record.READY_NEW) {\n"
              + "        XM.UserAccountInfo.setCurrentUser(record, '{name}');\n"
              + "        ret = '_loading'.loc();\n"
              + "      }\n"
              + "    }";
          def = def.replace(/{name}/, name);
        } else if (obj.defaultValue === 'currentUser') {
          def = 'defaultValue: function() {\n      return arguments[0].getPath("store.dataSource").session.userName;\n    }';
        } else if (obj.defaultValue === 'baseCurrency') {
          def = 'defaultValue: function() {\n      return XM.Currency.BASE;\n    }';
        } else if (XT.typeOf(obj.defaultValue) === XT.T_BOOLEAN || XT.typeOf(obj.defaultValue) === XT.T_NUMBER) {
          def = 'defaultValue: ' + obj.defaultValue;
        }
        else def = 'defaultValue: \'' + obj.defaultValue + '\'';
        attprops.push(def);
      }
      
      // add label
      if(name !== 'guid') {
        label = "label: '" + "_" + name + "'.loc()";
        attprops.push(label);
      }
      
      // build the properties
      propstr = attprops.length ? ', {\n    ' + attprops.join(',\n    ') + '\n}'.replace(/\n/g,'\n  ') : '';

      // build the attribute
      attr = attribute.f({
        type: type,
        name: name,
        type2: type2,
        method: method,
        attprops: propstr
      });

      if(obj.isVisible !== false) attributes.push(attr);
    }
    return attributes;
  },

  hasNested: function(orm) {

    if(!orm || !orm.properties) return false;

    var i, prop;
    for(i=0; i<orm.properties.length; ++i) {
      prop = orm.properties[i];
      if((prop.toMany && prop.toMany.isNested) ||
          (prop.toOne && prop.toOne.isNested))
        return true;
    }

    if(orm.extensions) {
      for(i=0; i<orm.extensions.length; ++i)
        if(this.hasNested(orm.extensions[i])) return true;
    }

    return false;
  },

  __attrtpl: "\n  /**\n    @type {type}\n  */\n  {name}: SC.Record.{method}({type2}{attprops})",

  className: 'XT.modelGenerator' 

});

