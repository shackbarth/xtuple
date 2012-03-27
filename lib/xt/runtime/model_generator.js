
/**
*/
XT.modelGenerator = XT.Object.create(
  /** @lends XT.modelGenerator.prototype */ {

  /** @private */
  init: function() { 
    var fs = XT.fs.__fs__,
        path = __dirname,
        mixinpath = XT.fs.join(path, 'mixin.tpl'),
        subpath = XT.fs.join(path, 'sub.tpl'),
        mixinclass, subclass;

    try {
      this.__mixintpl = mixinclass = fs.readFileSync(mixinpath, 'utf8');
      this.__subtpl = subclass = fs.readFileSync(subpath, 'utf8');
    } catch(err) { issue(XT.fatal(err)); }
  },

  generate: function(orm, mixinclass) {

    var namespace = orm.nameSpace || '',
        type = orm.type || '',
        date = new Date(), 
        isMixinclass = mixinclass ? YES : NO,
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
      targetDirectory: XT.fs.join(XT.MODELSDIRECTORY, orm.writePath)
    });

    return body;
  },

  writeFiles: function(models, mixinclass, socket) {
    var root = mixinclass ? XT.MODELSDIRECTORY : XT.SUBMODELSDIRECTORY,
        path = XT.fs.__path__,
        fs = XT.fs.__fs__,
        files = XT.keys(models), i, pathTo, file, model, parts, stat, ext, end;
    for(i=0; i<files.length; ++i) {
      file = files[i];
      model = models[file];

      if(!mixinclass) {
        pathTo = path.basename(file).slice(1);
        pathTo = path.join(XT.fs.basePath, root, pathTo);
        try {
          fs.writeFileSync(pathTo, model);
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
      pathTo = XT.fs.join(XT.fs.basePath, root);
      try {
        if(socket) socket.send("writing %@".f(XT.fs.shorten(file, 3)));
        parts.forEach(function(part, idx) {
          try {
            pathTo = XT.fs.join(pathTo, part);
            ext = path.extname(pathTo);
            stat = fs.statSync(pathTo);
            if(stat) {
              if(ext === '' && stat.isDirectory()) {
                if(part === 'mixins') {
                  var prev = pathTo.split('/').slice(0,-1).join('/'),
                      nodePath = path.join(prev, 'node');
                  if(!fs.existsSync(nodePath)) {
                    fs.mkdirSync(nodePath);
                    fs.writeFileSync(path.join(nodePath, 'package.json'),
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
                fs.writeFileSync(pathTo, model);
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
              fs.mkdirSync(pathTo);
              if(parts[idx+1] && parts[idx+1] === 'mixins') {

                // we know we're at the correct level to add a node
                // directory and package.json file
                var nodePath = path.join(pathTo, 'node');
                fs.mkdirSync(nodePath);
                fs.writeFileSync(path.join(nodePath, 'package.json'),
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
                fs.writeFileSync(pathTo, model);
              } else {
                issue(XT.warning("end of path to generated file not valid "+
                  "=> %@ from => %@".f(part, file)));
              }
            }
          }
        });
        //XT.fs.writeFile(path, model);
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

      // handle type
      if(type === 'Date')
      {
        type2 = 'SC.DateTime';
        if(!obj.useIsoDate) {
          attprops.push("format: '%Y-%m-%d'");
          attprops.push("useIsoDate: false");
        } else attprops.push("useIsoDate: true");
      } else if(type !== 'String' && type !== 'Number' && type !== 'Boolean') {
        type = type.pre(namespace.suf('.'));
        type2 = "'%@'".f(type);
      }
      
      // handle required
      if(obj.isRequired) attprops.push('isRequired: true');
      
      // handle defaults
      if(obj.defaultValue) {
        if (obj.defaultValue === 'currentDate') def = 'defaultValue: function() {\n      return SC.DateTime.create();\n    }'
        else if (obj.defaultValue === 'currentTime') def = 'defaultValue: function() {\n      return SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601);\n    }';
        else if (obj.defaultValue === 'currentUser') def = 'defaultValue: function() {\n      return arguments[0].getPath("store.dataSource").session.userName;\n    }';
        else if (obj.defaultValue === 'baseCurrency') def = 'defaultValue: function() {\n      return XM.Currency.BASE;\n    }';
        else if (XT.typeOf(obj.defaultValue) === XT.T_BOOLEAN || XT.typeOf(obj.defaultValue) === XT.T_NUMBER) {
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

      if(obj.isVisible !== NO) attributes.push(attr);
    }
    return attributes;
  },

  hasNested: function(orm) {

    if(!orm || !orm.properties) return NO;

    var i, prop;
    for(i=0; i<orm.properties.length; ++i) {
      prop = orm.properties[i];
      if((prop.toMany && prop.toMany.isNested) ||
          (prop.toOne && prop.toOne.isNested))
        return YES;
    }

    if(orm.extensions) {
      for(i=0; i<orm.extensions.length; ++i)
        if(this.hasNested(orm.extensions[i])) return YES;
    }

    return NO;
  },

  __attrtpl: "\n  /**\n    @type {type}\n  */\n  {name}: SC.Record.{method}({type2}{attprops})",

  className: 'XT.modelGenerator' 

});

