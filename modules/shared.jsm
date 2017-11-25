var EXPORTED_SYMBOLS = ["returnDate", "bookmarkTabs"];

//returnDate: given information on what is set in the options, return the string that is to be the bookmark title
//dateFormat: character that indicates what the date format will be
//includeTime: boolean value on whether or not the time is to be included in the string to be returned
function returnDate(dateFormat, includeTime) {
	
	var dateObj = new Date();
	
	//the string that will be returned by this function
	var dateString;
	
	var month = dateObj.getMonth() + 1;
	var defaultString = dateObj.toString().substr(0,15);
	
	month = (month >= 10) ? month : "0" + month;
	
	var day = (dateObj.getDate() >= 10) ? dateObj.getDate() : "0" + dateObj.getDate();
	
	switch (dateFormat) {
		
		case 'o':
			dateString = defaultString
			break;
		case 'm':
			dateString = month + "-" + day + "-" + dateObj.getFullYear();
			break;
		case 'd':
			dateString = day + "-" + month + "-" + dateObj.getFullYear();
			break;
		case 'y':
			dateString = dateObj.getFullYear() + "-" + month + "-" + day;
			break;
		default:
			dateString = defaultString;
			break;
	}
	
	//add the time to the string if it is specified that it must be included, and ensure the format of the time is correct
	if (includeTime) {
		
		var hours;
		var minutes;
		var seconds;
		
		hours = (dateObj.getHours() >= 10) ? dateObj.getHours() : "0" + dateObj.getHours();
		minutes = (dateObj.getMinutes() >= 10) ? dateObj.getMinutes() : "0" + dateObj.getMinutes();
		seconds = (dateObj.getSeconds() >= 10) ? dateObj.getSeconds() : "0" + dateObj.getSeconds();
		
		dateString = dateString + " " + hours + ":" + minutes + ":" + seconds;
	}
	
	return dateString;
}

//bookmarkTabs: the function that actually bookmarks all tabs
//dateString: the name of the folder for storing the bookmarks
//theBrowsers: array of information on each tab
//folder: the folder to which the new bookmark folder is to be added 	
function bookmarkTabs(dateString, theBrowsers, folder) {	
	
	var bookmarks = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
							   .getService(Components.interfaces.nsINavBookmarksService);
	
	var folderId = bookmarks.createFolder(
				folder, 
				dateString,
				bookmarks.DEFAULT_INDEX);
	
	//after creating this new bookmark folder, go through each tab and bookmark each one
	for (var i = 0; i < theBrowsers.length; i++) {
			
		var webNav = theBrowsers[i].webNavigation;
		
		var url = webNav.currentURI.spec;
		try {
			pageTitle = webNav.document.title  || url;
		} 
		catch (e) {
			pageTitle = url;
		}
		
		var bookmarkURI = Components.classes["@mozilla.org/network/io-service;1"]
		  .getService(Components.interfaces.nsIIOService)
		  .newURI(url, null, null);
		
		var bookmarkId = bookmarks.insertBookmark(
		  folderId, 
		  bookmarkURI,  
		  i, 
		  pageTitle);
		
	}

}