create or replace function xt.sc_model_gen(class_name text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  var body   =  "// ==========================================================================\n"
             +  "// Project:   xTuple Postbooks - Business Management System Framework        \n"
             +  "// Copyright: ©{year} OpenMFG LLC, d/b/a xTuple                                \n"
             +  "// ==========================================================================\n"
             +  "/*globals XM */\n"
             + "\n"
             + "/** \n"
             + "  @class\n"
             + "\n"
             + "  This code is automatically generated and will be over-written. Do not edit directly. \n"
             + "\n"
             + "  @extends XM.Record\n"
             + "*/\n"
             + "\n"
             + "{className} = XM.Record.extend(\n"
             + "/** @scope {className}.prototype */ {\n"
             + "\n"
             + "  className: '{className2}',\n"
             + "\n"
             + "  {nestedRecordNamespace}\n"
             + "\n"
             + "  // ..........................................................\n"
             + "  // PRIVILEGES\n"
             + "  //\n"
             + "\n"
             + "  {privileges}\n"
             + "\n"
             + "  // ..........................................................\n"
             + "  // ATTRIBUTES\n"
             + "  //\n"
             + "  {attributes}\n"
             + "\n"
             + "});",

  attribute =  "\n  /**\n  @type {type}\n  */\n  {name}: SC.Record.{method}({type2}{extra})",
  nameSpace = class_name.beforeDot(),
  type = class_name.afterDot(),
  orm = XT.Orm.fetch(nameSpace, type), d = new Date(),
  nestedRecordNamespace, privileges, attributes = [];

  if(!orm) throw new Error('Model ' + class_name + ' not found.');

  buildAttributes = function(orm) {
    for(var i = 0; i < orm.properties.length; i++) {
      var prop = orm.properties[i],
          type =  prop.attr ? prop.attr.type : prop.toOne ?  prop.toOne.type : prop.toMany.type,
          type2 = type,
          method =  prop.attr ? 'attr' : prop.toOne ? 'toOne' : 'toMany',
          obj = prop.attr ? prop.attr : prop.toOne ? prop.toOne : prop.toMany,
          extra = '',     
          name = prop.name, attr;

      if(obj.isNested) {
        extra = ', {\n    isNested: true';
        extra = extra + (prop.toMany ? (",\n    inverse: '" + (prop.toMany.inverse ? prop.toMany.inverse + "'" : "'guid'") + '\n  }') : '\n  }');
      }

      if(type !== 'String' && type !== 'Number' && type !== 'Date' && type !== 'Boolean') {
        type =  nameSpace + '.' + type;
        type2 = "'" + type + "'";
      }
      
      attr = attribute.replace(/{type}/, type)
                      .replace(/{name}/, name)
                      .replace(/{method}/, method)
                      .replace(/{type2}/, type2)
                      .replace(/{extra}/, extra);

      if(obj.isVisible !== false) attributes.push(attr);
    }
  }

  buildAttributes(orm);

  hasNested = function(orm) {
    for(var i = 0; i < orm.properties.length; i++) {
      if((orm.properties[i].toMany && orm.properties[i].toMany.isNested) || 
         (orm.properties[i].toOne && orm.properties[i].toOne.isNested))
         return true;
    }

    for(var i = 0; i < orm.extensions.length; i++) {
      if(hasNested(orm.extensions[i])) return true;
    }

    return false;
  }

  if(!orm) return false;

  nestedRecordNamespace = hasNested(orm) ? "nestedRecordNamespace: " + nameSpace + ',' : ''; 

  privileges = orm.privileges ? "privileges:" + JSON.stringify(orm.privileges, null, 2).replace(/\n/g,'\n  ') + ',' : '';
  
  body = body.replace(/{year}/, d.getFullYear())
             .replace(/{className}/g, class_name.replace(/\./, '._'))
             .replace(/{className2}/g, class_name)
             .replace(/{nestedRecordNamespace}/, nestedRecordNamespace)
             .replace(/{privileges}/, privileges)
             .replace(/{attributes}/, attributes.join(',\n'));
 
  return body;

$$ language plv8;