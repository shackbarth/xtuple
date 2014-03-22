/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, issue:true */

(function () {
  "use strict";

 /**
  OLAP Catalog Object

  @class
  @extends X.Object
 */
  X.olapCatalog = X.Object.extend({
  
    className: "X.olapCatalog",
    hostname: X.options.biServer.bihost || "localhost",
    port: X.options.biServer.port || 8080,
    
    xmlaConnect: new X.xmla.Xmla({
        async: true,
        properties: {
            DataSourceInfo: "Provider=Mondrian;DataSource=Pentaho",
            Catalog: X.options.biServer.catalog || "xTuple",
          },
          listeners: {
            events: X.xmla.Xmla.EVENT_ERROR,
            handler: function (eventName, eventData, xmla) {
                X.log(
                    "xmla error occurred: " + eventData.exception.message + " (" + eventData.exception.code + ")" +
                    (eventData.exception.code ===  X.xmla.Xmla.Exception.HTTP_ERROR_CDE ?
                    "\nstatus: " + eventData.exception.data.status + "; statusText: " + eventData.exception.data.statusText
                    : "")
                    );
              }
          }
        })
      });
}());