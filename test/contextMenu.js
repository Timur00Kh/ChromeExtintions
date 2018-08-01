function OnClickImageSearchMode(info, tab) {
  console.log(info);
  console.log(tab);
  console.log('=============================================');
}


var mod2 = chrome.contextMenus.create({
  "title": "debag", 
  "onclick": OnClickImageSearchMode, 
  "contexts": ["all"]
});
