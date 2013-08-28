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

class TableModelKey{

    /***************************************************************
    Recurse through the Map structure and put leaves in a Map.  The 
    property name has ancestor's name prefixed.  The value is the 
    class.  Convention for null structures should be {} not null.
    ***************************************************************/
    def jsonProp(struct, position, prefix) { 
    
      def json = [:]
	  def schema = struct[position]["properties"]
      schema.each { it ->
		  
		  // Ignore arrays as we can't put an array in a report field.
		  if (it.value["items"] == null) {
		  
		  	 // If an object, recurse and add children
             if (it.value["type"].toString().toLowerCase() == "object") {             
                    //json[prefix + '.' + it.key] = it.value.getClass().toString().minus('class ')
                    def childJson = [:]
                    childJson = jsonProp(struct, it.value["\$ref"].toString(), prefix + '.' + it.key)
                    childJson.each{ childIt ->
                        json[childIt.key] = childIt.value
                    }
            }
			// If not an object, add it with correct Java class understood by reports.
            else {
					if (it.value["type"].toString().toLowerCase() == "string") { 
						json[prefix + '.' + it.key] = "java.lang.String"
					}
					else if (it.value["type"].toString().toLowerCase() == "boolean") { 
						json[prefix + '.' + it.key] = "java.lang.Boolean"
					}
					else if (it.value["type"].toString().toLowerCase() == "integer") {
						json[prefix + '.' + it.key] = "java.lang.Integer"
					}
					else if (it.value["type"].toString().toLowerCase() == "number") {
						json[prefix + '.' + it.key] = "java.math.BigDecimal"
					}
            }
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
    TypedTableModel getModel(String urlParm, String keyParm, String orgParm, String discoveryParm, String reportParm, String childParm) {
		
		/***************************************************************
		 Get protocol and SSL option from properties file
		***************************************************************/
		def bundle = new PropertyBundle()
		def String proto = bundle.getProperty('_protocol')
		def String trustAllCerts = bundle.getProperty('_trustAllCerts')
     
        /***************************************************************
        Connect to node-datasource data-from-key and get data in json
        ***************************************************************/
		
		// Accept mock up test url with no key for testing
        def URL url
        if (keyParm == null) { 
            url = new URL(urlParm + "/data")
        }
        else {
             url = new URL(proto + urlParm + orgParm + "/data-from-key?datakey=" + keyParm)
        }

		//  Get data from data-from-key        
        System.out.print("\nReport connecting to .....: " + url);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection()
        connection.setRequestMethod("GET")
        connection.setRequestProperty("content-type", "application/json");
		if (trustAllCerts == "true") {
			System.out.print("\nDanger!..............trusting all SSL Certs, see _trustAllCerts property");
			TrustModifier.relaxHostChecking(connection);
		}
        connection.connect()
        def Object result
        if (connection.responseCode == 200 || connection.responseCode == 201) {
            def slurper = new JsonSlurper()
            result = slurper.parseText(connection.content.text).data
            
            if (result == null) {
               throw new Exception("Null data from data-from-key: " + url)
            }            
 
           } else {
               throw new Exception("Connect to data-from-key: " + url + " failed, response code: " + connection.responseCode)
        }
		   
		/***************************************************************
		  Connect to node-datasource and get REST discovery document to
		  to use for report schema
		***************************************************************/
		
		// Accept mock up test url for testing
		def URL urlRest
		if (keyParm == null) {
			urlRest = new URL(urlParm + "/rest")
		}
		else {
			 urlRest = new URL(proto + urlParm + orgParm + "/discovery/v1alpha1/apis/" + discoveryParm + "/v1alpha1/rest")
		}
		
		//  Get REST discovery document                   
        HttpURLConnection connectionRest = (HttpURLConnection) urlRest.openConnection()
        connectionRest.setRequestMethod("GET")
        connectionRest.setRequestProperty("content-type", "application/json");
		if (trustAllCerts == "true") {
			TrustModifier.relaxHostChecking(connectionRest);
		}
        connectionRest.connect()
        def Object resultRest

        if (connectionRest.responseCode == 200 || connectionRest.responseCode == 201) {
            def slurper = new JsonSlurper()
            resultRest = slurper.parseText(connectionRest.content.text).schemas
            
            if (resultRest == null) {
               throw new Exception("Null data from REST Discovery: " + urlRest)
            }            
 
           } else {
               throw new Exception("Connect to REST Discovery: " + urlRest + " failed, response code: " + connectionRest.responseCode)
        }

		/****************************************************************************
			Create a properties map to use a basis for the report schema.  Each property
			has a name in form name.name.name.etc representing the hierarchy.  The 
			value is the type.
			
			To Do:  All types can be String once we format data-from-key before sending
		****************************************************************************/
		def rowMapProperties = jsonProp(resultRest, reportParm, '')
		
		System.out.print("\nschema: " + rowMapProperties);
		
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
				System.out.print("\nfind prop: " + result[j] + " " + keyTokens)
                def prop = findProp(result[j], keyTokens)
                 if (prop == null) {
                     row[m] = ""
                     }
                 else {
                    row[m] = prop.toString()
					System.out.print("\nadd prop: " + prop.toString())
                 }

            }
            model.addRow(row)
			System.out.print("row: " + row)
        }
    return model
    }

}