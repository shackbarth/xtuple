Report Flow
-----------

The route for a print action requests a report from the BI Server with a URL like:

'''
http://localhost:8080/pentaho/content/reporting/reportviewer/report.html
?solution=erpbi-reports
&path=test
&name=ContactList.prpt
&locale=en_US
&userid=joe
&password=password
&org=dev&datakey=igwwd2us28hhncd
'''

The route caches the data for the report and assigns a cache key.  When the report “ContactList.prpt” executes in BI Server the datakey is used to request the data from the datasource.  The report uses a scriptable datasource (in GROOVY) to retrieve data in a table format from the json message.  For example, for a list of contacts the following data might be sent:

'''
{"data":[{"id":32,
	"isActive":true,
	"name":"Admin Admin",
	"firstName":"Admin",
	"lastName":null,
	"address":{"id":40,"number":"38","isActive":true,"line1":"327 Cherry Hill 	Lane","line2":"","line3":"","city":"Virginia Beach","state":"VA","postalCode":"22522","country":"United 	States","type":"AddressInfo","dataState":"read"},
	"owner":null,
	"account":{"id":19,"number":"ADMIN","name":"Administrator","isActive":true,
		"owner":{"username":"admin","propername":"Administrator","email":"insert email 				here","disableExport":false,"type":"UserAccountRelation","dataState":"read"},
	"type":"AccountRelation","dataState":"read"},		
	"characteristics":[],
	"accountParent":null}]
,"recordType":"XM.ContactListItem"}
'''

To retrieve the data in a table format, the scriptable data source would use the following script:

'''
import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import java.net.*;
import groovy.json.*;
import com.xTuple.TableModelReflect;
import com.xTuple.PropertyBundle;

def String datakey = dataRow.get("datakey")
def String org = dataRow.get("org")
def String datasource = dataRow.get("datasource")
def bundle = new PropertyBundle()
def String proto = bundle.getProperty('_protocol')
def TableModelReflect reflect = new TableModelReflect()
return reflect.getModel(proto + datasource + "/", datakey, org, null)
'''

The script calls getModel of the TableModelReflect script to return a TypedTableModel to the report.  The getModel method takes  “URL”, “Key”, "Organization" and “Child” parameters.   If Child is null, the the array at the top level is used (“data” in the above json).  If child in not null, a child array is used (e.g.  data[0].[characteristics] in the above json).  The getModel method uses reflection on the json structure to construct a complete set of column names (from property names) and correct types (from property values).  

Report Development
------------------

Add a scriptable data source in the Groovy language.  As the report will be tested in the Report Designer it will not be able the use URL parameters and they must be hard coded:

'''
import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import java.net.*;
import groovy.json.*;
import com.xTuple.TableModelReflect;
import com.xTuple.PropertyBundle;

def String datakey = dataRow.get("datakey")
def String org = dataRow.get("org")
def String datasource = dataRow.get("datasource")
def bundle = new PropertyBundle()
def String proto = bundle.getProperty('_protocol')
def TableModelReflect reflect = new TableModelReflect()
return reflect.getModel("https://localhost/", "key value", "org value", null)
'''

Use  the “preview” action to check the script and return a set of column names.  All header labels must be localizable.  Use resource labels with a resource identifier of “strings”.  If the resource does not exist, add it to strings.properties and strings_en_US.properties.

To publish a report on BI Server use:

"""
URL: http://localhost:8080/pentaho
user: joe
password: password
location: erpbi-reports/test
publish password: admin  
"""