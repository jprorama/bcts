Components.utils.import("resource://bcts/modules/shared.jsm");

var caKasprzakJakeBcts =
{

	//openDialog: simply opens a dialog for bookmarking all tabs
	openDialog : function () { 

		window.openDialog('chrome://bcts/content/dialogs/bookmarkTabDialog.xul','bctsDialog', "centerscreen,chrome,dialog,resizable,modal");

	},
	
	//bookmark: the function for bookmarking all tabs without opening a dialog
	bookmark : function () {
		
		try {
			
			//variable for storing data on each tab
			var theBrowsers;
			
			//what the bookmark folder title is to be by default
			var dateString;
			
			//the folder to which a bookmark folder is to be added
			var folder;
			
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].
			                    getService(Components.interfaces.nsIPrefService);
			prefs = prefs.getBranch("extensions.bcts.");
			
			var bookmarks = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
		                               .getService(Components.interfaces.nsINavBookmarksService);
			
			//retrieve information on tab contents, the location to which bookmarks are to be saved, and the name of the folder that will contain these bookmarks
			//then actually bookmark the tabs by calling the method for doing so
			
			theBrowsers = gBrowser.browsers;
			var dateFormat = prefs.getCharPref("dateFormat");
			var includeTime = prefs.getBoolPref("includeTime");
			
			dateString = returnDate(dateFormat, includeTime);
			
			folder = bookmarks.bookmarksMenuFolder;
			
			bookmarkTabs(dateString, theBrowsers, folder);
			
		}
		catch(err) { alert("Error occurred in extension:"+ err) }
		
	},

	//unload: event handler called when a window is closed
	//Bookmarks all tabs if the user chose the option to do so when a window is closed
	unload : function (evt) { 

		var prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                    getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("extensions.bcts.");
		
		var bookmarkOnClosingWindow = prefs.getBoolPref("bookmarkOnClosingWindow");
		
		if (bookmarkOnClosingWindow) {
			caKasprzakJakeBcts.bookmark();
		}
		
		window.removeEventListener("unload", caKasprzakJakeBcts.unload, false);
		
	},

	//init: simply adds an event handler that responds to browser windows being closed
	init: function() {
	
		window.addEventListener("unload", function() { caKasprzakJakeBcts.unload(); }, false); 
		
	}

} //caKasprzakJakeBcts

window.addEventListener("load", function() {
    caKasprzakJakeBcts.init();	
}, false);