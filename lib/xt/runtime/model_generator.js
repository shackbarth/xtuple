
/**
*/
XT.modelGenerator = XT.Object.create(
  /** @lends XT.modelGenerator.prototype */ {

  /** @private */
  init: function() { 
    var fs = XT.fs.__fs__,
        path = __dirname,
        superpath = XT.fs.join(path, 'super.tpl'),
        subpath = XT.fs.join(path, 'sub.tpl'),
        superclass, subclass;

    try {
      this.__supertpl = superclass = fs.readFileSync(superpath, 'utf8');
      this.__subtpl = subclass = fs.readFileSync(subpath, 'utf8');
    } catch(err) { issue(XT.fatal(err)); }
  },

  generate: function(orm, superclass) {

    var namespace = orm.nameSpace || '',
        type = orm.type || '',
        date = new Date(), 
        isSuperclass = superclass ? YES : NO,
        body = isSuperclass ? this.__supertpl : this.__subtpl,
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
      fileName: type.decamelize()
    });

    return body;
  },

  writeFiles: function(models, superclass, socket) {
    var root = superclass ? XT.MODELSDIRECTORY : XT.SUBMODELSDIRECTORY,
        files = XT.keys(models), i, path, file, model;
    for(i=0; i<files.length; ++i) {
      file = files[i];
      model = models[file];
      path = XT.fs.join(XT.fs.basePath, root, file);
      try {
        if(socket) socket.send("writing %@".f(XT.fs.shorten(path, 3)));
        XT.fs.writeFile(path, model);
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
        attributes = [], prop, type, type2, method, obj, extra, name, attr;
    for(i=0; i<orm.properties.length; ++i) {
      prop = orm.properties[i];
      type = prop.attr ? prop.attr.type : prop.toOne ? prop.toOne.type : prop.toMany.type;
      type2 = type;
      method = prop.attr ? 'attr' : prop.toOne ? 'toOne' : 'toMany';
      obj = prop.attr ? prop.attr : prop.toOne ? prop.toOne : prop.toMany;
      extra = '';
      name = prop.name;

      if(obj.isNested) {
        extra = ', {\n    isNested: true';
        extra += (prop.toMany ? (",\n    inverse: '" + (prop.toMany.inverse ? prop.toMany.inverse + "'" : "guid'") + "\n  }") : "\n  }");
      }

      if(type === 'Date')
      {
        type2 = 'SC.DateTime';
        extra = ", {\n    format: '%Y-%m-%d'\n  }";
      } else if(type !== 'String' && type !== 'Number' && type !== 'Boolean') {
        type = type.pre(namespace.suf('.'));
        type2 = "'%@'".f(type);
      }

      attr = attribute.f({
        type: type,
        name: name,
        type2: type2,
        method: method,
        extra: extra
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

  __attrtpl: "\n  /**\n    @type {type}\n  */\n  {name}: SC.Record.{method}({type2}{extra})",

  className: 'XT.modelGenerator' 

});

