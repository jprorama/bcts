// Global data structure for tracking window + tab associations
// This is needed because there is not an event to take action prior to
// a close event.  The the onRemoved event happens after the window is
// closed, but then the tabs to save are gone.
//
// Adapted from Sept 2012 post by Rob W:
// https://stackoverflow.com/a/12228586

// The windows data structure is maintained as tabs are opened and
// organizes tabs according to their windowId and index location of tab
// in that window. When a window is closed the tabs associated with the
// window are saved to a bookmark folder. 
var windows = {}; 

function recordTabs(tabId, changeInfo, tab) {

    console.log("Record tab url");

    // Note: this event is fired twice:
    // Once with `changeInfo.status` = "loading" and another time with "complete"

    // don't record privacy mode tabs
    if ( ! tab.incognito ) {
	// capture the info need to create a bookmark
	let tabBookmarkInfo = { url: tab.url,
				title: tab.title,
				windowId: tab.windowId };

	// update the the windows+tabs data structure
	// each window id has an array of tabs, each with bookmark info
	if ( windows[tab.windowId] ) {
	    let tablist = windows[tab.windowId];
	    tablist[tab.index] = tabBookmarkInfo;
	    window[tab.windowId] = tablist;
	}
	else {
	    let tabList = [ tabBookmarkInfo ];
	    windows[tab.windowId] = tabList;
	}
    }
}

function bookmarkTabSet(windowId) {

    console.log("Saving tabs for window: " + windowId)

    function saveTabs(node) {
	//after creating this new bookmark folder, go through each tab and bookmark each one
	for (var i = tabList.length - 1 ; i >= 0; i--) {
	    browser.bookmarks.create({parentId: node.id, title: tabList[i].title, url: tabList[i].url})
	}

    }
    
    var dateString = returnDate("y", true);
    var tabList = windows[windowId];
				     
    browser.bookmarks.create({title: dateString}).then(saveTabs)

    delete windows[windowId];
}

// Example onChanged event call backs from MDN bookmarks JavaScript API ref
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/onChanged
//
// Used to debug events and observe data values
function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log("Updated tab: " + tabId);
    console.log("Changed attributes: ");
    console.log(changeInfo);
    console.log("New tab Info: ");
    console.log(tabInfo);

    if (changeInfo.url) {
	console.log("Tab: " + tabId +
                    " URL changed to " + changeInfo.url);
    }
}

function urlInfo(tabId, changeInfo, tabInfo) {
  if (changeInfo.url) {
    console.log("Tab: " + tabId +
                " URL changed to " + changeInfo.url);
  }
}


// Debug and discovery callbacks to observe state
browser.tabs.onUpdated.addListener(handleUpdated);

browser.tabs.onUpdated.addListener(urlInfo);

// Callback to maintain window+tab info and save tab bookmarks after
// window is closed
browser.tabs.onUpdated.addListener(recordTabs);

browser.windows.onRemoved.addListener(bookmarkTabSet);


// Build the list of currently open windows and their tabs
// Supports loading this extension after browser is already running.
// Window browsing logic comes from MDN example code for tabs and windows
//
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/windows/getAll
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/query
//
function logTabsForWindows(windowInfoArray) {

    function logTabs(tabs) {
	for (let tab of tabs) {

	    // capture the info need to create a bookmark
	    let tabBookmarkInfo = { url: tab.url,
				    title: tab.title};

	    // update the the windows+tabs data structure
	    // each window id has an array of tabs, each with bookmark info
	    if ( windows[tab.windowId] ) {
		let tablist = windows[tab.windowId];
		tablist[tab.index] = tabBookmarkInfo;
		window[tab.windowId] = tablist;
	    }
	    else {
		let tabList = [ tabBookmarkInfo ];
		windows[tab.windowId] = tabList;
	    }
	}
    }

    for (let windowInfo of windowInfoArray) {
	console.log(`Window: ${windowInfo.id}`);
	console.log(windowInfo.tabs.map((tab) => {return tab.url}));

	browser.tabs.query({windowId: windowInfo.id}).then(logTabs, onError);
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener((tab) => {
    var getting = browser.windows.getAll({
	populate: true,
	windowTypes: ["normal"]
    });
    getting.then(logTabsForWindows, onError);
});
