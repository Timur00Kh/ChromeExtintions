console.log("ImageSearcher has started")

document.addEventListener('mousedown', clicked, false);

function clicked(e) {
    if (e.button != 2) return;
    var ISsrc = e.target.getAttribute("src").toString();
    if (ISsrc.indexOf("//") == 0) ISsrc = ISsrc.substring(2, ISsrc.length);
    if (e.target.nodeName == "IMG") {
        console.log(ISsrc);
    	chrome.storage.local.set({'ISsrc': ISsrc});
    }
    if (e.target.nodeName == "VIDEO") {
    	console.log(ISsrc);
    	chrome.storage.local.set({'ISsrc': ISsrc});
    }
}