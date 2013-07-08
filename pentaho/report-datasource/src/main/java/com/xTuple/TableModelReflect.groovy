package com.xTuple;

import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import java.net.*;
import groovy.json.*;
//import org.pentaho.reporting.libraries.base.util.DebugLog;

/******************************************************************************************
To configure logging, remove <appender-ref ref="CONSOLE"/> from /resources/log4j.xml
in order to make FILE the default.  The file is at {user.home}/.pentaho/logs/prd.  Use
DebugLog.log().

Based on problems in Groovy 1.8 (used by report designer).  Groovy 1.8 does not recognize
decimals as BigDecimal (it does in release 2.1).  Instead, it recognizes them as String. 
Also as null is recognized as String it was necessary to convert Integers to Sting also.

******************************************************************************************/

class TableModelReflect{

    /***************************************************************
    Recurse through the Map structure and put leaves in a Map.  The 
    property name has ancestor's name prefixed.  The value is the 
    class.  Convention for null structures should be {} not null.
    ***************************************************************/
    def jsonProp(struct, prefix) { 
    
      def json = [:]
      struct.each { it ->

             if (it.value.getClass() == java.util.HashMap) {             
                    json[prefix + '.' + it.key] = it.value.getClass().toString().minus('class ')
                    def childJson = [:]
                    childJson = jsonProp(it.value, prefix + '.' + it.key)
                    childJson.each{ childIt ->
                        json[childIt.key] = childIt.value
                    }
            }
            else {
                    def theClass =  it.value.getClass().toString().minus('class ')
                    json[prefix + '.' + it.key] = theClass
            }
    
      }
      return json

    }

    /***************************************************************
    Find value within Map based on key .parent.child.grandchild etc
    ***************************************************************/
    def findProp(struct, keyTokens) {
        if ( struct == null) {
            return null
        }
        if (keyTokens.size == 1) {
            return struct[keyTokens[0]]
        }
        else {
            def child = struct[keyTokens[0]]
            keyTokens.remove(0)
            return findProp(child, keyTokens)
        }
    }


    /****************************************************************************
    Get TypedTableModel based on key from Node server 
    ****************************************************************************/
    TypedTableModel getModel(String urlParm,String keyParm, String orgParm, String childParm) {
     
        /***************************************************************
        Connect to Node with key and get data in json
        ***************************************************************/
        def URL url
        if (keyParm == null) { 
            url = new URL(urlParm)
        }
        else {
             url = new URL(urlParm + orgParm + "/data-from-key?datakey=" + keyParm)
        }
		
		System.out.print("Connect to...............: " + url);
            
        HttpURLConnection connection = (HttpURLConnection) url.openConnection()
        connection.setRequestMethod("GET")
        connection.setRequestProperty("content-type", "application/json");
        TrustModifier.relaxHostChecking(connection);
        // connection.setConnectTimeout(10000)
        connection.connect()
        def Object result
        def Object strings
        if (connection.responseCode == 200 || connection.responseCode == 201) {
            def slurper = new JsonSlurper()
            result = slurper.parseText(connection.content.text).data
            
            if (result == null) {
               throw new Exception("Null data from node datasource: " + url)
            }            
 
           } else {
               throw new Exception("Connect to node datasource: " + url + " failed, response code: " + connection.responseCode)
        }

        /****************************************************************************
        If this is a list report we get a data:[] ArrayList.  Otherwise convert 
        data:{} to ArrayList.  If there is a childParm, get the child ArrayList
        ****************************************************************************/
        if (result.getClass() != java.util.ArrayList)
        {
            result = [result];
        }
        if (childParm != null) {
            result = result[0][childParm]
        }
        
        /****************************************************************************
        Create a properties map with types of each property.  Merge results for every
        object as some objects may not have all properties.  Do not replace existing 
        keys with value Map and Integer with String as a null value has type String.  
        Do not replace BigDecimal with Integer as numbers may not have decimal point,
        but be BigDecimal. When finished, remove Maps as these are not actualy columns
        ****************************************************************************/
        def rowMap = [:]
        def rowMapProperties = [:]
        for (int i; i < result.size(); i++) {
            rowMap = jsonProp(result[i], '')
            rowMap.each { it ->
                if ((rowMapProperties[it.key]  != 'java.util.HashMap' && rowMapProperties[it.key]  != 'java.math.BigDecimal') &&
                   !( rowMapProperties[it.key] == 'java.lang.Integer' && it.value == 'java.lang.String')) {
                    rowMapProperties[it.key] = it.value
                }
            }
        }
        rowMapProperties = rowMapProperties.findAll{ it.value != 'java.util.HashMap'}
        
        /****************************************************************************
        Create a list of column keys to be used in TypedTabelModel and
        ****************************************************************************/
        def String[] rowListColumns = new String[rowMapProperties.size()]
        def k= 0
        rowMapProperties.keySet().each{
            rowListColumns[k] = it
            k++
        }
        
        /****************************************************************************
        Create a list of column types.  We keep some unsupported types in
        this list so we can translate properties to Strings wehn we load rows.
        Get casting exception if we try:
        rowListTypes[l] = rowMapProperties[rowListColumns[l]] as Class 
        so we use brute force switch  
        ****************************************************************************/
        def l = 0
        def String[] rowListTypes = new String[rowMapProperties.size()]
        rowListColumns.each{
            rowListTypes[l] = rowMapProperties[rowListColumns[l]] 
            l++
        }
        
        /****************************************************************************
        Now create a list of property types to be used in TypedTabelModel, 
        removing unsupported.
        ****************************************************************************/
        def Class[] rowListReportTypes = new Class[rowMapProperties.size()]
        for (int n; n < rowListTypes.size(); n++) {
            rowListReportTypes[n] = 'java.lang.String'
        }
        
        /****************************************************************************
        Create a set of rows for the TypedTabelModel.  For each structure in result,
        for each column, find the property in the stucture and place it in row.
        Boolean and Arrays must be changed to String and nulls must be given a value.   
        ****************************************************************************/
        TypedTableModel model = new TypedTableModel(rowListColumns,  rowListReportTypes)
        def Object[] row
        def j = 0  //this looks funny but groovy can't find j
        for (; j < result.size(); j++) {
            row = new Object [rowListColumns.size()]
            for(int m; m < rowListColumns.size(); m++) {
                def keyTokens = rowListColumns[m].tokenize('.')
                def prop = findProp(result[j], keyTokens)
                
                 if( rowListTypes[m].toString() =='java.math.BigDecimal'){
                     if (prop == null) {
                         prop = 0
                     }
                     def bigDec = new BigDecimal(prop)
                     bigDec = bigDec.setScale(3, BigDecimal.ROUND_UP)
                     //Groovy is defaulting to float.  So force it to create a 3 precision BigDecimal  
                     row[m] = bigDec.toString()
                 }
                 else if (prop.toString().indexOf(',') > -1) {
                     row[m] = '"' + prop.toString() + '"'
                 }
                 else if (prop == null) {
                     row[m] = ""
                     }
                 else {
                    row[m] = prop.toString()
                 }

            }

            model.addRow(row)
        }
    return model
    }

}