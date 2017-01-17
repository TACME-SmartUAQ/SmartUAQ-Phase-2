var utilities = require("utilities");
var httpManager = require("httpManager");

var args = arguments[0] || {};
Ti.API.info('REQ. No to Expand; ' + args.idToExpand);

$.lblNavTitle.text = Alloy.Globals.selectedLanguage.myservices;

var a = Ti.UI.createAlertDialog({
	title : Alloy.Globals.selectedLanguage.appTitle,
	message : Alloy.Globals.selectedLanguage.error_loading_eService_page,
	buttonNames : [Alloy.Globals.selectedLanguage.ok]
});
a.addEventListener('click', function(eA) {
	if (eA.index == 0) {
		closeWindow();
	}
});

function callLoginpage() {
	Ti.API.info('called');
	Alloy.Globals.userInfo === false;
	closeWindow();
	Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin", {
		isFromLeftPanel : true
	}).getView());

	Ti.API.info('call end');
}

var preLang = null;
function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;

	$.viewLeftPanel.setLanguage();
	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();

	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.myservices;
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winMyServices);
		return;
	}
	
	try {
		if (args.idToExpand == "" || args.idToExpand == undefined || args.idToExpand == null)
			$.webviewMyRequest.url = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/myRequests?languagecode=" + (Alloy.Globals.isEnglish ? "en" : "ar")+"&isnative=true";
		else
			$.webviewMyRequest.url = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/myRequests?languagecode=" + (Alloy.Globals.isEnglish ? "en" : "ar") + "&requestno=" + args.idToExpand+"&isnative=true";
	} catch(e) {
		Ti.API.info('Error in initial preparing Url.... Lets load with basic URL');
		$.webviewMyRequest.url = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/myRequests?languagecode=en&isnative=true";
	}
	$.webviewMyRequest.reload();
}

function winOpen(e) {
	Alloy.Globals.currentWindow = "winMyServices";
	Alloy.Globals.arrWindows.push($.winMyServices);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	changeLanguage();
}

function closeLeftPanel() {
	// put the code into comment - start
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	//Alloy.Globals.bottomMenu = $.backView;
	//$.viewBottomMenu.addInnerMenu();

	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
}

function closeWindow() {
	// if (args.isFromMenu) {
	// Alloy.Globals.gotoHome();
	// return;
	// }

	try {
		Alloy.Globals.arrWindows.pop($.winMyServices);
		$.winMyServices.close();
	} catch(e) {
		Ti.API.info('Window closing error..');
		$.winMyServices.close();
	}
}

$.webviewMyRequest.addEventListener('beforeload', function(e) {
	//Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	Ti.API.info(' URL before load: ' + e.url);
	var url = e.url;
	if (url.indexOf("loginPage") != "-1" || url.indexOf("loginPage") != -1) {
		$.webviewMyRequest.stopLoading();
		Alloy.Globals.currentWindowMain == "";
		setTimeout(function() {
			Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin", {
				isFromLeftPanel : false
			}).getView());
		}, 1000);
		closeWindow();
	} else if (url.indexOf("opennewwindow=true") != "-1") {
		$.webviewMyRequest.stopLoading();
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		Ti.API.info('<<<<<<<<<<<<<<<<<<<<< FOUND ATTACHMENT >>>>>>>>>>>>>>>>>>>>>>>>>');
		Ti.API.info('URL is ; ' + url);
		
		setTimeout(function(){
			if (OS_IOS){
				Alloy.Globals.hideLoading();
				Alloy.Globals.showAttachment(url);
			}
			else{
				var isImage = Alloy.Globals.isAttachmentIsImageOrHTML(url);
				Alloy.Globals.hideLoading();
				$.webviewMyRequest.stopLoading();
				if (isImage == true){
					Alloy.Globals.showAttachment(url);
				}
				else{
					Ti.Platform.openURL("https://docs.google.com/gview?embedded=true&url=" + Ti.Network.encodeURIComponent(url));
				}	
			}
		},1500);
		
	}
	/*else if (e.url.indexOf("opennewwindow=true") != "-1") {
		//$.webviewMyRequest.goBack();
		Ti.API.info('Loaded attachment URL we need to go back but they forcefully removed');
	}*/
});
$.webviewMyRequest.addEventListener('load', function(e) {
	Ti.API.info('Webview is loaded with : '+e.url);
	Alloy.Globals.hideLoading();
});

$.webviewMyRequest.addEventListener('error', function(e) {
	Alloy.Globals.hideLoading();
	a.show();
});
if (OS_ANDROID) {
	$.webviewMyRequest.addEventListener('sslerror', function(e) {
		Ti.API.info('SSL ERROR OCCUR:: ' + JSON.stringify(e));
	});
}
