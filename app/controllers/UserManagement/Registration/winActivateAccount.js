var utilities = require("utilities");
var httpManager = require("httpManager");

var args = arguments[0] || {};
$.lblNavTitle.text = Alloy.Globals.selectedLanguage.activateAcounttxt;
var langVar = "en";
langVar =  (Alloy.Globals.isEnglish)? "en" : "ar";
$.webView.url  = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/accountVerification?languagecode="+langVar;

var a = Ti.UI.createAlertDialog({
	title : Alloy.Globals.selectedLanguage.appTitle,
	message : Alloy.Globals.selectedLanguage.error_loading_eService_page,
	buttonNames : [Alloy.Globals.selectedLanguage.ok]
});
a.addEventListener('click', function(eA) {
	if (eA.index == 0){
		closeWindow();
	}
});

function winOpen(e) {}

function closeLeftPanel() {}

function winFocus(e) {}

function closeWindow() {
	$.winActivateAccount.close();
}



$.webView.addEventListener('beforeload', function(e) {
	Ti.API.info(' URL before load: ' + e.url);
});
$.webView.addEventListener('load', function(e) {
	//Alloy.Globals.hideLoading();
});
$.webView.addEventListener('error', function(e) {
	//Alloy.Globals.hideLoading();
	a.show();
});
if (OS_ANDROID){
	$.webView.addEventListener('sslerror', function(e) {
		Ti.API.info('SSL ERROR OCCUR:: '+JSON.stringify(e));
	});	
}