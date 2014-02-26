package com.xTuple
import org.pentaho.reporting.engine.classic.core.util.TypedTableModel;
import java.net.*;
import groovy.json.*;
import com.xTuple.TableModelReflect;
import com.xTuple.PropertyBundle;

class Main {

	static void main(def args) {
		def TableModelKey rest = new TableModelKey()
//		TypedTableModel ttm = rest.getModel("http://localhost:8888", null, "dev", "quote", "Quote", null)
		
TypedTableModel ttm = rest.getModel("192.168.56.101/", "1xph8452bw486w2", "dev", "to-do", "ToDo", null)
		
//		TypedTableModel ttm = rest.getModel("http://localhost:8888", null, "dev", "quote", "QuoteLine", "lineItems")
	}
}