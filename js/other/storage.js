//Wrapper for localStorage getItem, so that data can be retrieved in various types.
function findValue(key) {
	try {
	  if (window.localStorage.getItem(key) != null) {
		return JSON.parse(window.localStorage.getItem(key));
	  }
	} catch (error) {
	  //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
	  if (window.globalStorage[location.hostname].getItem(key) != null) {
		return JSON.parse(window.globalStorage[location.hostname].getItem(key));
	  }
	}
	return null;
}

//Wrapper for localStorage setItem, so that data can be set in various types.
function setValue(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
	}
}

//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		window.globalStorage[location.hostname].removeItem(key);
	}
}

//Wrapper for localStorage, so that data can be retrieved in various types.
function listValues() {
	return Object.keys(window.localStorage);
}