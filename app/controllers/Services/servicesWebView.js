//var utilities = require("utilities");
//var httpManager = require("httpManager");
var args = arguments[0] || {};
$.lblNavTitle.text = Alloy.Globals.selectedLanguage.services;

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

/*
// clean the cache directory
var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "/");
cacheDir.deleteDirectory(true);
Ti.API.info('Delete Cache directory: ');

var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
var tempDir = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory);
var cachepDir = Titanium.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory);
// output a directory listing
Ti.API.info('AppData list after rename = ' + dir.getDirectoryListing());
Ti.API.info('Temp list after rename = ' + tempDir.getDirectoryListing());
Ti.API.info('Cache list after rename = ' + cachepDir.getDirectoryListing());
*/

function callLoginpage(){
	Ti.API.info('called');
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
	
	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.services;
	
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winServices);
		return;
	}
	if (Alloy.Globals.isEnglish) {
		Ti.API.info('Load webview in english language');
		$.webView.url  = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/serviceCatalogue?languagecode=en&isnative=true";
	} else {
		Ti.API.info('Load webview in Arabic language');
		$.webView.url  = Alloy.Globals.webserviceUrl + "/PortalWorkspace/faces/serviceCatalogue?languagecode=ar&isnative=true";
	}
	$.webView.reload();
}

function winOpen(e) {
	Alloy.Globals.arrWindows.push($.winServices);
	// put the code into comment - start
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());

	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	//$.viewBottomMenu.getView().viewBack = $.backView;

	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	// put the code into comment - end	
}

function closeLeftPanel() {
	// put the code into comment - start
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	Alloy.Globals.currentWindow = $.winServices;
	// put the code into comment - start
	/*$.viewBottomMenu.addInnerMenu();
	Alloy.Globals.bottomMenu = $.backView;*/
	changeLanguage();
	// put the code into comment - start
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	// put the code into comment - end
	// if (Alloy.Globals.url){
		// $.webView.url = Alloy.Globals.url;
		
	// }
}

function closeWindow() {
	try{
		Alloy.Globals.arrWindows.pop($.winServices);
		$.winServices.close();
	}catch(e){
		Ti.API.info('Window closing error..');
		$.winServices.close();
	}
}



$.webView.addEventListener('beforeload', function(e) {
	
	//Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	Ti.API.info(' URL before load: ' + e.url);
	var url = e.url;
	if (url.indexOf("loginPage") != -1) {
		//Alloy.Globals.hideLoading();
		$.webView.stopLoading();
		Alloy.Globals.currentWindowMain == "";
		setTimeout(function(){
			//Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {title:"logout"}).getView());
			Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : false}).getView());
		},1000);
	    
		closeWindow();
	}
	else if (url.indexOf("opennewwindow=true") != -1) {
		$.webView.stopLoading();
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
				$.webView.stopLoading();
				if (isImage == true){
					Alloy.Globals.showAttachment(url);
				}
				else{
					Ti.Platform.openURL("https://docs.google.com/gview?embedded=true&url=" + Ti.Network.encodeURIComponent(url));
				}	
			}
		},1500);
	}
	
});

///// My implementation
/*$.webView.addEventListener('load', function(e) {
	//Alloy.Globals.hideLoading();
	var isDoLogout = false;
	try{
	    Ti.API.info('User is loggedin??? :'+Alloy.Globals.userInfo);
		
		// checked user is loggedin or not..?
		if (Alloy.Globals.userInfo === true){
			// get cookies
			var cookies = $.webView.evalJS("document.cookie").split("; ");
		    // length of cookies
		    Ti.API.info( "# of cookies : " + cookies.length);
		    if (cookies.length > 0){
		    	//Ti.API.info('****************** '+ cookies["uaqportalauth"]);
		    	for (i = 0; i <= cookies.length - 1; i++) {
			    	Ti.API.info( "cookie==>"+cookies[i]);
			    	/// check for valid cookies:- if invalid then expired and do logout
			    	if (cookies[i] == "uaqportalauth=valid"){
			    		Ti.API.info('You are active');
			    		isDoLogout = false;
			    		break;
			    	}
			    	else{
			    		isDoLogout = true;
			    	}
			    }
			    Ti.API.info('BEFORE DO OPERATION: '+isDoLogout);
			    if (isDoLogout == true){
			    	Alloy.Globals.isWebSessionExpired = true;
					$.viewLeftPanel.doAutomaticUserLogout("service");
			    }
			    else{
			    	Ti.API.info('You are still logged in...');
			    }
		    }
		}
		else{
			Ti.API.info('You are not logged in so no need to handle session logout...');
		}
	}
	catch(e){
		Ti.API.info('Cookie not found... EvaluationJS problem..');
	}
});*/


//// Aziz implementation
$.webView.addEventListener('load', function(e) {
    //Alloy.Globals.hideLoading();
    var isDoLogout = false;
    try{
    	if (e.url.indexOf("https://g2testi.edirhamg2.ae") != -1){
    		Ti.API.info('Payment site found so return to check cookie');
    		return;
    	}
    	
        Ti.API.info('User is loggedin??? :'+Alloy.Globals.userInfo);
        var cookies = $.webView.evalJS("document.cookie").split("; ");
        //alert(cookies.length);
        // checked user is loggedin or not..?
        if (Alloy.Globals.userInfo === true){
        	Ti.API.info('URL is : '+ e.url);
            // get cookies
            if ($.webView.evalJS("document.cookie").indexOf("uaqportalauth=valid") != -1){
                Ti.API.info('You are active');
                isDoLogout = false;
            }
            else{
                isDoLogout = true;
            }
            
            Ti.API.info('BEFORE DO OPERATION: '+isDoLogout);
            if (isDoLogout == true){
                Alloy.Globals.isWebSessionExpired = true;
                $.viewLeftPanel.doAutomaticUserLogout("service");
            }
            else{
                Ti.API.info('You are still logged in...');
            }
	    }else{
	    	Ti.API.info('You are not logged in so no need to handle session logout... Just handle the cookies for this URL: '+ Alloy.Globals.webserviceUrl);
	    	
	    	/// this funcking is not working....
	    	//Ti.Network.createHTTPClient().clearCookies(Alloy.Globals.webserviceUrl);
			//Ti.Network.removeHTTPCookiesForDomain(Alloy.Globals.webserviceUrl);
			
	    	/*var req = Titanium.Network.createHTTPClient();  
			req.open("GET","https://stg.uaq.ae"); 
			req.onload = function() {
			    // process response
			};
			req.send();
			req.clearCookies("https://stg.uaq.ae"); // THE FIX.
	    	*/
	    	/*Ti.API.info( "B4 # of cookies : " + cookies.length);
			var cookies = $.webView.evalJS("document.cookie").split("; ");
		    if (cookies.length > 0){
		    	//Ti.API.info('****************** '+ cookies["uaqportalauth"]);
		    	for (i = 0; i <= cookies.length - 1; i++) {
			    	Ti.API.info( "cookie==>"+cookies[i]);
			    	//$.webView.evalJS("document.cookie =" +cookies[i]+ "+= =; expires=-1;");
			    	/// check for valid cookies:- if invalid then expired and do logout
			    	//deleteCookie(cookies[i].split("=")[0]);
			    }
			 }*/
			 // length of cookies
			 //Ti.API.info( " AFTR # of cookies : " + cookies.length);
			//loader.removeAllSystemCookies();
			//loader.removeAllHTTPCookies();
			
			//Ti.API.info('cookies path: '+Titanium.Network.Cookie.getPath());
			//Ti.API.info('cookies domain: '+Titanium.Network.Cookie.getDomain());
			
			//alert( "# of cookies : " + cookies.length);
			
			
			/*var cookiesPath = Ti.Filesystem.applicationDataDirectory+'/Library/Cookies';
			Ti.API.info('Coookiee path: '+cookiesPath);
			
			var fileCookies = Ti.Filesystem.getFile(cookiesPath);
			Ti.API.info('Coookiee files: '+JSON.stringify(fileCookies));
			Ti.API.info('Coookiee file path: '+fileCookies.nativePath);
			
			if(fileCookies.exists()) 
			{
				Ti.API.info('YESS>>>> FOUND');
				fileCookies.deleteFile();
				fileCookies.deleteDirectory(true);
			}
			else
				Ti.API.info('Could not find the cookie delete path');*/
				
				
				
			///// This shit code is not working for clearig cookies from the system.
			/*var webViewCacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "webviewCache");
			Ti.API.info('CACHE DIR');
			Ti.API.info("cacheDiroctory=" + Ti.Filesystem.applicationCacheDirectory);
			Ti.API.info('CONTENTS');
			Ti.API.info(webViewCacheDir.getDirectoryListing());
			Ti.API.info('Array length before: ' + webViewCacheDir.getDirectoryListing().length);
			webViewCacheDir.deleteDirectory(true);
			Ti.API.info('Array length after: ' + webViewCacheDir.getDirectoryListing().length);
			*/
			
	    }
	}
    catch(e){
        Ti.API.info('Cookie not found... EvaluationJS problem..');
    }
});

/*function deleteCookie(name){
  setCookie(name,"",-1);
}
function setCookie(name, value, expirydays) {
 var d = new Date();
 d.setTime(d.getTime() + (expirydays*24*60*60*1000));
 var expires = "expires="+ d.toUTCString();
 $.webView.evalJS("document.cookie") = name + "=" + value + "; " + expires;
}*/

$.webView.addEventListener('error', function(e) {
	//Alloy.Globals.hideLoading();
	a.show();
});
if (OS_ANDROID){
	$.webView.addEventListener('sslerror', function(e) {
		Ti.API.info('SSL ERROR OCCUR:: '+JSON.stringify(e));
	});	
}
