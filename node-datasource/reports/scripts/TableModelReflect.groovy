import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import java.net.*;
import groovy.json.*;

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
                    if ( !(theClass.equals('java.lang.Integer')) && 
                         !(theClass.equals('java.math.BigDecimal')) && 
                         !(theClass.equals('java.util.ArrayList')) && 
                         !(theClass.equals('java.lang.Boolean')) && 
                         !(theClass.equals('java.lang.String'))) {
                        json[prefix + '.' + it.key] = 'java.lang.String'
                    }
                    else {
                        json[prefix + '.' + it.key] = theClass
                    }
            }
    
      }
      json
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
    TypedTableModel getModel(String urlParm,String keyParm, String childParm) {
     
        /***************************************************************
        Connect to Node with key and get data in json
        ***************************************************************/
        def URL url
        if (keyParm == null) { 
            url = new URL(urlParm)
        }
        else {
             url = new URL(urlParm + "?dataKey=" + keyParm)
        }
            
        HttpURLConnection connection = (HttpURLConnection) url.openConnection()
        connection.setRequestMethod("GET")
        connection.setRequestProperty("content-type", "application/json");
        // connection.setConnectTimeout(10000)
        connection.connect()
        def Object result
        def Object subResult
        def Object strings
        if (connection.responseCode == 200 || connection.responseCode == 201) {
            def slurper = new JsonSlurper()
            result = slurper.parseText(connection.content.text).data
            if (childParm != null) {
                result = result[0][childParm]
            }
           } else {
             DebugLog.log("Error Connecting to " + url)
        }
        
        /****************************************************************************
        Create a properties map with types of each property.  Merge results for every
        object as some objects may not have all properties.  Do not replace existing 
        keys with value Map and Integer with String as a null value has type String.
        When finished, remove Maps as these are not actualy columns
        ****************************************************************************/
        def rowMap = [:]
        def rowMapProperties = [:]
        for (int i; i < result.size(); i++) {
            rowMap = jsonProp(result[i], '')
            rowMap.each { it ->
                if (rowMapProperties[it.key]  != 'java.util.HashMap' && rowMapProperties[it.key]  != 'java.lang.Integer') {
                    rowMapProperties[it.key] = it.value
                }
            }
        }
        rowMapProperties = rowMapProperties.findAll{ it.value != 'java.util.HashMap'}
        
        
        /****************************************************************************
        Create a list of column keys to be used in TypedTabelModel
        ****************************************************************************/
        def String[] rowListColumns = new String[rowMapProperties.size()]
        def k= 0
        rowMapProperties.keySet().each{
            rowListColumns[k] = it
            k++
        }
        
        /****************************************************************************
        Create a list of column types.  We keep some unsupported types in
        this list so we can translate properties to Strings wehn we load rows  
        ****************************************************************************/
        def l = 0
        def Class[] rowListTypes = new Class[rowMapProperties.size()]
        rowListColumns.each{
             rowListTypes[l] = rowMapProperties[rowListColumns[l]] as Class
             l++
        }
        
        /****************************************************************************
        Now create a list of property types to be used in TypedTabelModel, 
        removing unsupported.  
        ****************************************************************************/
        def Class[] rowListReportTypes = new Class[rowMapProperties.size()]
        for (int n; n < rowListTypes.size(); n++) {
            if (rowListTypes[n].toString() == 'class java.lang.Boolean'  || rowListTypes[n].toString() == 'class java.util.ArrayList') {
                rowListReportTypes[n] = 'java.lang.String' as Class
             }
             else {
                rowListReportTypes[n] =  rowListTypes[n]
             }
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
                if (rowListTypes[m].toString() == 'class java.lang.Boolean'  || rowListTypes[m].toString() == 'class java.util.ArrayList') {
                        row[m] = prop.toString()
                }
                else if (prop != null) {
                    if( rowListTypes[m].toString() == 'class java.lang.String'){
                        }
                        
                    row[m] = rowListTypes[m].newInstance(prop)
                }
                else {
                    if (rowListTypes[m].toString() == 'class java.lang.Integer'  || rowListTypes[m].toString() == 'class java.lang.BigDecimal') {
                        row[m] = rowListTypes[m].newInstance(0)
                    }
                    else {
                        row[m] = rowListTypes[m].newInstance('')
                    }
                }
            }
         //   println row
            model.addRow(row)
        }
    return model
    }

}