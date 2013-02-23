Report Flow

The route for a print action requests a report from the BI Server with a URL like:
http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/report.html
?solution=erpbi-reports
&path=test
&name=ContactList.prpt
&locale=en_US
&userid=joe
&password=password
&dataKey=igwwd2us28hhncd
The route caches the data for the report and assigns a cache key.  When the report 
“ContactList.prpt” executes in BI Server the dataKey is used to request the data from node.
The report uses a scriptable datasource to retrieve data in a table format from the 
json message sent by node.  For example, for a list of contacts the following data 
might be sent:

{"data":[{"id":32,
	"isActive":true,
	"name":"Admin Admin",
	"firstName":"Admin",
	"lastName":null,
	"address":{"id":40,"number":"38","isActive":true,"line1":"327 Cherry Hill"},
	"owner":null,
	"account":{"id":19,"number":"ADMIN","name":"Administrator","isActive":true,
		"owner":{"username":"admin","propername":"Administrator"},
	"type":"AccountRelation","dataState":"read"},		
	"characteristics":[],
	"accountParent":null}]
,"recordType":"XM.ContactListItem"}

To retrieve the data in a table format, the scriptable data source would use the following script:

import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import groovy.json.*;
import TableModelReflect.*
def String dataKey = dataRow.get("dataKey")
def TableModelReflect reflect = new TableModelReflect()
return reflect.getModel("https://maxhammer.xtuple.com/dataFromKey",
					dataKey, 
					null)

The script calls getModel of the TableModelReflect script to return a TypedTableModel to the report.  
The getModel method takes  “URL”, “Key” and “Child” parameters.   If Child is null, the 
array at the top level is used (“data” in the above json).  If child in not null, a child array is used 
(e.g.  data[0].[characteristics] in the above json)  The getModel method uses reflection on the json 
structure to construct a complete set of column names (from property names) and correct types 
(from property values).  
