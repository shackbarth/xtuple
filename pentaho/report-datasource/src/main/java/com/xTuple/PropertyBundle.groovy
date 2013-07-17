package com.xTuple;

import java.util.ResourceBundle;

class PropertyBundle{

	String getProperty(String key) {

		String value = null;
	        ResourceBundle resource = ResourceBundle.getBundle("xTupleConfig");
		if (resource != null) {
			value = resource.getObject(key);
		}
		return value;
	}
}
