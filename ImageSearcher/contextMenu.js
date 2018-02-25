var searchSystems = [
"http://images.google.com/searchbyimage?image_url=",
"https://yandex.ru/images/search?rpt=imageview&cbird=5&url=",
"https://whatanime.ga/?url="
];

function genericOnClick(info, tab) {
  console.log(info);
  console.log(tab);
  var src = info.srcUrl;

  if (info.srcUrl.indexOf(".webp") > 0 && info.linkUrl) {
    if (info.linkUrl.indexOf("youtube.com/watch?v") > 0) {
      src = "http://i1.ytimg.com/vi/" + info.linkUrl.substring(info.linkUrl.indexOf("=") + 1, info.linkUrl.length) + "/maxresdefault.jpg";
    } else {
      alert("inappropriate type( \nPls, use ImageSearch mode"); //TO DO
      return;
    }
  }
  if (info.srcUrl.substring(0, 4) == "data") {
    uploadBase64(info);
    return;
  }


  src = searchSystems[Number(info.menuItemId)] + src;
  console.log(src);
  chrome.tabs.create({"url": src});
}

function uploadBase64(info) {
  //powered by pictshare.net
  //https://github.com/chrisiaut/pictshare
  var arr = info.srcUrl.split(";");
  var arr2 = arr[0].split("/");
  var format = arr2[0];
  console.log("Uploading in format " + format);
  var xhr = new XMLHttpRequest();
  var url = "https://www.pictshare.net/backend.php";
  var params = "format=" + format + "&base64=" + info.srcUrl;
  console.log(params);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var resp = JSON.parse(xhr.responseText);
      if (resp.url) {
          console.log(resp);
          chrome.tabs.create({"url": searchSystems[Number(info.menuItemId)] + resp.url});
      }
    }
  }
  xhr.send(params);
}


function OnClickImageSearchMode() {
  chrome.tabs.executeScript(null, {file: "html2canvas.min.js"});
  chrome.tabs.executeScript(null, {file: "embed.js"});
}

// На каких элементах буит появлятся менюшка
var contexts = ["image","video"];


//ContextMenu
var parent = chrome.contextMenus.create({
  "title": "ImageSearcher", 
  "contexts": ["image"]
});
var child1 = chrome.contextMenus.create({
  "id": "0",
  "title": "Search by Google", 
  "parentId": parent, 
  "onclick": genericOnClick, 
  "contexts": ["image"]
});
var child2 = chrome.contextMenus.create({
  "id": "1",
  "title": "Search by Yandex", 
  "parentId": parent, 
  "onclick": genericOnClick, 
  "contexts": ["image"]
});
var separator = chrome.contextMenus.create({
  "parentId": parent, 
  "title": "separator",
  "type": "separator", 
  "contexts": ["image"]
});
var mod2 = chrome.contextMenus.create({
  "title": "ImageSearch mode", 
  "parentId": parent, 
  "onclick": OnClickImageSearchMode, 
  "contexts": contexts
});

var mode = chrome.contextMenus.create({
  "title": "ImageSearch mode", 
  "contexts": ["video"], 
  "onclick": OnClickImageSearchMode
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "execute_imagesearch_script") {
    OnClickImageSearchMode();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
  if (request.todo == "openNewTab") {
    chrome.tabs.create({"url": request.url});
  }
});