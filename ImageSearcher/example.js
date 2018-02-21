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

function genericOnClick() {
  console.log("nothing to do yet");
}

// На каких элементах буит появлятся менюшка
var contexts = ["image","video"];

var parent = chrome.contextMenus.create({"title": "ImageSearcher", "contexts": contexts});
var child1 = chrome.contextMenus.create(
  {"title": "Search by Google", "parentId": parent, "onclick": genericOnClickGoogle, "contexts": contexts});
var child2 = chrome.contextMenus.create(
  {"title": "Search by Yandex", "parentId": parent, "onclick": genericOnClickYandex, "contexts": contexts});
var separator = chrome.contextMenus.create({"parentId": parent, "title": "separator","type": "separator", "contexts": contexts});
var mod2 = chrome.contextMenus.create(
{"title": "ImageSearch mode", "parentId": parent, "onclick": genericOnClick, "contexts": contexts});
