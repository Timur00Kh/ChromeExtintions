// ф-ция для дебага
function genericOnClickGoogle(info, tab) {
  var ISsrc = '';
  chrome.storage.local.get('ISsrc', function(items) {
    ISsrc = "http://images.google.com/searchbyimage?image_url=" + items.ISsrc.toString();
    console.log(ISsrc);
    chrome.tabs.create({"url": ISsrc});
  });
}

function genericOnClickYandex(info, tab) {
  var ISsrc = '';
  chrome.storage.local.get('ISsrc', function(items) {
    ISsrc = "https://yandex.ru/images/search?rpt=imageview&cbird=5&url=" + items.ISsrc.toString();
    console.log(ISsrc);
    chrome.tabs.create({"url": ISsrc});
  });
}

function genericOnClickImageSearchMode() {
  console.log("nothing to do yet");
}

// На каких элементах буит появлятся менюшка
var contexts = ["image","video"];

var parent = chrome.contextMenus.create({"title": "ImageSearcher", "contexts": ["image"]});
var child1 = chrome.contextMenus.create(
  {"title": "Search by Google", "parentId": parent, "onclick": genericOnClickGoogle, "contexts": ["image"]});
var child2 = chrome.contextMenus.create(
  {"title": "Search by Yandex", "parentId": parent, "onclick": genericOnClickYandex, "contexts": ["image"]});
var separator = chrome.contextMenus.create({"parentId": parent, "title": "separator","type": "separator", "contexts": ["image"]});
var mod2 = chrome.contextMenus.create(
{"title": "ImageSearch mode", "parentId": parent, "onclick": genericOnClickImageSearchMode, "contexts": contexts});

var mode = chrome.contextMenus.create({"title": "ImageSearch mode", "contexts": ["video"], "onclick": genericOnClickImageSearchMode});
