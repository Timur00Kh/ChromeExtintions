console.log("ImageSearcher has started")

document.addEventListener('mousedown', clicked, false);

function clicked(e) {
    if (e.button != 2) return;
    if (e.target.nodeName == "IMG") {
    	console.log(e.target.getAttribute("src"));
    	var ISsrc = e.target.getAttribute("src");
    	chrome.storage.local.set({'ISsrc': ISsrc});
    }
    if (e.target.nodeName == "VIDEO") {
    	console.log(e.target.getAttribute("src"));
    	var ISsrc = e.target.getAttribute("src");
    	chrome.storage.local.set({'ISsrc': ISsrc});
    }
}