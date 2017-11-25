Components.utils.import("resource://bcts/modules/shared.jsm");

var caKasprzakJakeBctsBookmarkTabDialog =
{
	//bookmark: called when OK is clicked on the dialog box for bookmarking all tabs
	bookmark : function () { 
	
		try { 
			
			//variable for storing data in each tab
			var theBrowsers;
			
			//what the bookmark folder title is to be
			var dateString;
			
			var gb = window.opener.getBrowser();
			theBrowsers = gb.browsers;
			
			//the folder in which the new folder is to be added
			var folderString = document.getElementById("folderPicker").value;
			
			var bookmarks = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
										   .getService(Components.interfaces.nsINavBookmarksService);
			
			//the folder to which a bookmark folder is to be added
			var folder;
			
			switch (folderString) {
				case "bookmarks.bookmarksMenuFolder":
					folder = bookmarks.bookmarksMenuFolder;
					break;
				case "bookmarks.toolbarFolder":
					folder = bookmarks.toolbarFolder;
					break;
				default:
					folder = bookmarks.unfiledBookmarksFolder;
			}
			
			dateString = document.getElementById("namePicker").value;
			
			bookmarkTabs(dateString, theBrowsers, folder);
			
		}
		catch(err) { alert("Error occurred in extension:"+ err) }
	
	},
	
	//initMainDialog: this initializes the data that is to be initially in the text box when adding bookmarks
	initMainDialog : function () { 

		var dateString;
		
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                    getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("extensions.bcts.");
		
		var dateFormat = prefs.getCharPref("dateFormat");
		var includeTime = prefs.getBoolPref("includeTime");
		
		dateString = returnDate(dateFormat, includeTime);
		
		document.getElementById("namePicker").removeAttribute('selectedItem');
		
		document.getElementById("namePicker").value = dateString;
		
		document.getElementById("namePicker").selectionStart = dateString.length; 
		document.getElementById("namePicker").selectionEnd = dateString.length;
		
		document.getElementById("namePicker").focus();
		
	}
	
}