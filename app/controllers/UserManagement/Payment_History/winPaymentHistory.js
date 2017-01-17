var utilities = require("utilities");

var args = arguments[0] || {};
$.lblNavTitle.text = Alloy.Globals.selectedLanguage.viewMyPayment;

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
	 Alloy.Globals.userInfo === false;
	 closeWindow();
	 Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : true}).getView());
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
	
	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.viewMyPayment;
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winPaymentHistory);
		return;
	}
	if (Alloy.Globals.isEnglish) {
		Ti.API.info('Reload web page due to language change to english');
		$.webView.url  = Alloy.Globals.webserviceUrl+"/PortalWorkspace/faces/paymentHistory?languagecode=en&isnative=true";
	} else {
		Ti.API.info('Reload web page due to language change to arabic');
		$.webView.url  = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/paymentHistory?languagecode=ar&isnative=true";
	}
	$.webView.reload();
}

function winOpen(e) {
	Alloy.Globals.currentWindow = e.source.id;
	Alloy.Globals.arrWindows.push($.winPaymentHistory);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
}

function closeLeftPanel() {
	// put the code into comment - start
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	// put the code into comment - start

	Alloy.Globals.bottomMenu = $.backView;
	//$.viewBottomMenu.addInnerMenu();

	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	
	changeLanguage();
	/*if (Alloy.Globals.url){
		$.webView.url = Alloy.Globals.url;	
	}*/
}

function closeWindow() {
	// if (args.isFromMenu) {
		// Alloy.Globals.gotoHome();
		// return;
	// }
	try{
		Alloy.Globals.arrWindows.pop($.winPaymentHistory);
		$.winPaymentHistory.close();
	}catch(e){
		Ti.API.info('Window closing error..');
		$.winPaymentHistory.close();
	}
	
}



$.webView.addEventListener('beforeload', function(e) {
	Ti.API.info(' URL before load: ' + e.url);
	//Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var url = e.url;
	
	/*if (url.indexOf("jsessionid") != "-1" || url.indexOf("jsessionid") != -1) {
		 Alloy.Globals.hideLoading();
         $.webView.stopLoading();
	     var res = url.split("jsessionid");
	     Ti.API.info('session in url' + JSON.stringify(res[1]));
	     $.webView.url = "http://192.168.1.164:8001/UAQWorkspace/faces/serviceCatalogue";
	     $.webView.reload();
	     return;
	  
	}*/ // 
	if (url.indexOf("serviceCatalogue?") != "-1" || url.indexOf("serviceCatalogue?") != -1) {
		 //Alloy.Globals.serviceAuthentication = true;
		 //callLoginpage();
		 // return;	  
	}
	if (url.indexOf("loginPage.") != "-1" || url.indexOf("loginPage.") != -1) {
		// Alloy.Globals.hideLoading();
        // $.webView.stopLoading();
        // callLoginpage();
         
	    // return;
	  
	}

	
	if (url.indexOf("loginPage") != "-1" || url.indexOf("loginPage") != -1) {
		//Alloy.Globals.hideLoading();
		$.webView.stopLoading();
		Alloy.Globals.currentWindowMain == "";
		setTimeout(function(){
			//Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {title:"logout"}).getView());
			Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : false}).getView());
		},1000);
	   
		closeWindow();
	}
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

//Alloy.Globals.returnbackURL=null;