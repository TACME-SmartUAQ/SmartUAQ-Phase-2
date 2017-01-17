//var utilities = require("utilities");
//var httpManager = require("httpManager");
var args = arguments[0] || {};
Ti.API.info('Args is: '+JSON.stringify(args));
var title = arguments[0].title;
$.lblNavTitle.text = Alloy.Globals.selectedLanguage.login;
//$.webView.url = args.url;
var langVar = "en";
langVar =  (Alloy.Globals.isEnglish)? "en" : "ar";

if(title == "login"){
	var username = Ti.App.Properties.getString("username");
	var password = Ti.App.Properties.getString("password");
	Ti.API.info('Username : '+ username+"	Password : "+password);
	$.webView.url  = Alloy.Globals.webserviceUrl+"/PortalWorkspace/authenticate?username="+username+"&password="+password+"&isnative=true&languagecode="+langVar;
	
} 
else {
	$.webView.url = Alloy.Globals.webserviceUrl+"/PortalWorkspace/logout";
}

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

function winOpen(e) {
	Alloy.Globals.currentWindow = e.source.id;
	Alloy.Globals.arrWindows.push($.winWebviewActiveSession);
}
function winFocus(){
	$.actInd.message = Alloy.Globals.selectedLanguage.please_wait;
	$.actInd.show();
}
function winBlur(){
	$.actInd.hide();
}
function closeWindow() {
	try{
		Alloy.Globals.arrWindows.pop($.winWebviewActiveSession);
		$.winWebviewActiveSession.close();
	}catch(e){
		Ti.API.info('Window closing error..');
		$.winWebviewActiveSession.close();
	}
}
/////Webview events
$.webView.addEventListener('beforeload', function(e) {
	Ti.API.info('URL for Webview: ' + e.url);
	var url = e.url;
	if ((url.indexOf("serviceCatalogue?")!=-1)){
		Ti.API.info('URL for Webview 22qq: ' + e.url);
		Alloy.Globals.serviceAuthentication = true;
		Alloy.Globals.userInfo = true;
		setTimeout(function(){
		 //Alloy.Globals.openWindow(Alloy.createController('winHome','left').getView());
			if(Ti.App.Properties.hasProperty("isMenuDirection")){
				Alloy.Globals.openWindow(Alloy.createController('winHome',Ti.App.Properties.getString("isMenuDirection")).getView());
			}else{
				Alloy.Globals.openWindow(Alloy.createController('common/winMenuSelection').getView());
			}	
		},1000);
		
		//$.winWebviewActiveSession.close();
	   //Ti.API.info('URL for Webview AA: ' + e.url);
	} else if ((url.indexOf("loginPage")!=-1)){
		setTimeout(function(){
		 	Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : false}).getView()); 
		 },1000);
		closeWindow();	        
	}
	
	/*if (parseInt(url.indexOf("serviceCatalogue?")) == 45) {
		 Alloy.Globals.hideLoading();
         $.webView.stopLoading();
		 //callLoginpage();
		 //Alloy.Globals.arrWindows.pop($.winWebviewActiveSession);
		 //$.winWebviewActiveSession.close();
		 Alloy.Globals.openWindow(Alloy.createController('winHome',Ti.App.Properties.getString("isMenuDirection")).getView());
		 return; 
	}
	
	if (url.indexOf("loginPage.jspx") != "-1" || url.indexOf("loginPage.jspx") != -1) {
		Alloy.Globals.hideLoading();
         $.webView.stopLoading();
		 Alloy.Globals.arrWindows.pop($.winWebviewActiveSession);
		 $.winWebviewActiveSession.close();
		 return;
	}*/
});

function alertForloginuser(cond){
	var titleAl = "";
	var messageAl = "";
	
	if(cond == 1){
		messageAl = "Invalid user name or password";
	}
	else if(cond == 2){
		messageAl = "Account not approved";
	}else if(cond == 3){
		messageAl = "Account not active";
	}
	
	var userValidation = Ti.UI.createAlertDialog({
	title : Alloy.Globals.selectedLanguage.appTitle,
	message : messageAl,
	//buttonNames : [Alloy.Globals.selectedLanguage.ok]
    });
    userValidation.show();
}

$.webView.addEventListener('load', function(e) {
	var url = e.url;
	
	Ti.API.info('URL for Webview 22: ' + e.url);
	
	if ((url.indexOf("loginPage.jspx?error=1")!=-1)){
		alertForloginuser(1);
		$.winWebviewActiveSession.close();
	} else if ((url.indexOf("/loginPage.jspx?error=2")!=-1)){
		alertForloginuser(2);
		$.winWebviewActiveSession.close();
	}else if ((url.indexOf("loginPage.jspx?error=3")!=-1)){
		alertForloginuser(3);
		$.winWebviewActiveSession.close();
	}
});
$.webView.addEventListener('error', function(e) {Alloy.Globals.hideLoading();a.show();});
Ti.App.addEventListener("destroyWebActivity", function(){
	if ($.webView!= null){
		$.webView = null;
		$.winWebviewActiveSession.close();
	}
	else{
		Ti.API.info('No need to close ');
	}
});
//Check SSL 
if (OS_ANDROID){
	$.webView.addEventListener('sslerror', function(e) {
		Ti.API.info('SSL ERROR OCCUR:: '+JSON.stringify(e));
	});	
}
