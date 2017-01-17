var utilities = require("utilities");
var httpManager = require("httpManager");
var args = arguments[0] || {};
$.lblNavTitle.text = Alloy.Globals.selectedLanguage.capRegister;
var langVar = "en";
langVar =  (Alloy.Globals.isEnglish)? "en" : "ar";
$.webView.url  = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/registration?languagecode="+langVar+"&isnative=true";
// $.webView.url  = "http://192.168.1.164:7101/PortalWorkspace/faces/registration";

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
function callLoginpage(){
	Ti.API.info('called');
	 Alloy.Globals.userInfo === false;
	 closeWindow();
	 Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : true}).getView());
     Ti.API.info('call end');
}
function winOpen(e) {}
function closeLeftPanel() {}
function winFocus(e) {}
function closeWindow() {
	$.winRegister.close();
}
$.webView.addEventListener('beforeload', function(e) {
	
	Ti.API.info(' URL before load: ' + e.url);
	var url = e.url;
	if (url.indexOf("opennewwindow=true") != "-1"){
		$.webView.stopLoading();
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		setTimeout(function(){
			Alloy.Globals.hideLoading();
			Alloy.Globals.showAttachment(url);	
		},1500);
		
	}
});
$.webView.addEventListener('load', function(e) {
	Alloy.Globals.hideLoading();
	Ti.API.info(' URL before load: ' + e.url);
	//if (e.url.indexOf("opennewwindow=true") != "-1"){
		//$.webView.goBack();
	//}
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
