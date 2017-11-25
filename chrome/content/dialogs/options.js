var caKasprzakJakeBctsOptions =
{

	//initOptions: called when options are first brought up, this initializes the options menu
	initOptions : function () { 
	   
		//retrieve the current preferences and initialize the menu so that the currently selected options appear to be selected initially
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                    getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("extensions.bcts.");

		var dateFormat = prefs.getCharPref("dateFormat");
		var includeTime = prefs.getBoolPref("includeTime");
		
		var selectedDateFormat = document.getElementById(dateFormat);
		var dateFormats = document.getElementById("dateFormat");
		
		var bookmarkOnClosingWindow = prefs.getBoolPref("bookmarkOnClosingWindow");
		
		var numOfFormats = dateFormats.itemCount;
		
		for (var i=0; i<numOfFormats; i++) {
			
			if (dateFormats.getItemAtIndex(i).id == dateFormat) {
				
				dateFormats.selectedIndex = i;
			}
		}
		
		var includeTimeCB = document.getElementById("includeTime");
		
		includeTimeCB.checked = includeTime;	

		var bookmarkOnClosingWindowCB = document.getElementById("bookmarkOnClosingWindow");
		
		bookmarkOnClosingWindowCB.checked = bookmarkOnClosingWindow;
		
	},


	//saveOptions: called when OK is clicked to save the options that the user selected
	saveOptions : function () { 
		
		//retrieve the values of items selected in the options menu and save them
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                    getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("extensions.bcts.");

		var dateFormats = document.getElementById("dateFormat");
		
		var index = dateFormats.selectedIndex;
		
		prefs.setCharPref("dateFormat", dateFormats.getItemAtIndex(index).id);
		
		var includeTimeCB = document.getElementById("includeTime");
		
		prefs.setBoolPref("includeTime", includeTimeCB.checked);
		
		var bookmarkOnClosingWindowCB = document.getElementById("bookmarkOnClosingWindow");
		
		prefs.setBoolPref("bookmarkOnClosingWindow", bookmarkOnClosingWindowCB.checked);
		
	}

} //caKasprzakJakeBctsOptions