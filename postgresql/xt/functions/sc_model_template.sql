create or replace function xt.sc_model_template(class_name text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  var body   =  "// ==========================================================================\n"
             +  "// Project:   xTuple Postbooks - Business Management System Framework        \n"
             +  "// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                                \n"
             +  "// ==========================================================================\n"
             +  "/*globals XM */\n"
             + "\n"
             + "/** \n"
             + "  @class\n"
             + "\n"
             + "  (Document your Model here)\n"
             + "\n"
             + "  @extends XM.Record\n"
             + "  @version 0.1\n"
             + "*/\n"
             + "\n"
             + "{className} = XM.Record.extend(,\n"
             + "/** @scope {className}.prototype */ {\n"
             + "\n"
             + "  className: '{className}',\n"
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
             + "  // ..........................................................\n"
             + "  // CALCULATED PROPERTIES\n"
             + "  //\n"
             + "\n"
             + "\n"
             + "  // ..........................................................\n"
             + "  // OBSERVERS\n"
             + "  //\n"
             + "\n"
             + "});",

  attribute =  "\n  /**\n  @type {type}\n  */\n  {name}: SC.Record.{method}({type2}{extra})",
  nameSpace = class_name.beforeDot(),
  type = class_name.afterDot(),
  orm = XT.Orm.fetch(nameSpace, type),
  nestedRecordNamespace, privileges, attributes = [];

  buildAttributes = function(orm) {
    for(var i = 0; i < orm.properties.length; i++) {
      var prop = orm.properties[i],
          type =  prop.attr ? prop.attr.type : prop.toOne ?  prop.toOne.type : prop.toMany.type,
          type2 = type,
          method =  prop.attr ? 'attr' : prop.toOne ? 'toOne' : 'toMany',
          obj = prop.attr ? prop.attr : prop.toOne ? prop.toOne : prop.toMany,
          extra = obj.isNested ? ',\n    isNested: true\n  ' : '',
          name = prop.name, attr;

      if(type !== 'String' && type !== 'Number' && type !== 'Date' && type !== 'Boolean') {
        type =  nameSpace + '.' + type;
        type2 = "'" + type + "'";
      }
      
      attr = attribute.replace(/{type}/, type)
                      .replace(/{name}/, name)
                      .replace(/{method}/, method)
                      .replace(/{type2}/, type2)
                      .replace(/{extra}/, extra);

      attributes.push(attr);
    }
/*
    if(orm.extensions) {
      for(var i = 0; i < orm.extensions.length; i++) {
        buildAttributes(orm.extensions[i]);
      }
    }
*/
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
  
  body = body.replace(/{className}/g, class_name)
             .replace(/{nestedRecordNamespace}/, nestedRecordNamespace)
             .replace(/{privileges}/, privileges)
             .replace(/{attributes}/, attributes.join(',\n'));
 
  return body;

$$ language plv8;