var args = arguments[0] || {};
//Require files....
var utilities = require("utilities");
var httpManager = require("httpManager");
// Activity indicator: use : While loading the help screens
var actHelp = Ti.UI.createActivityIndicator({
	color: 'white',
	font: {fontFamily:'Helvetica Neue', fontSize:15, fontWeight:'bold'},
	message: Alloy.Globals.selectedLanguage.helpscreensloading,
	style: 3, height:Ti.UI.SIZE, width:Ti.UI.SIZE,
	left:"5dp", bottom:"30dp", zIndex:465
});

$.webViewLogout.url = Alloy.Globals.webserviceUrl+"/PortalWorkspace/logout";

//Chnage language function
function changeLanguage(){
	$.textfieldUserName.hintText = Alloy.Globals.selectedLanguage.userName;
	$.textfieldPassword.hintText = Alloy.Globals.selectedLanguage.password;
}
/// User Registration function/Event
function UserRegistration(){
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Alloy.Globals.showInternetMsg($.winLogin);
	}
	else{
		if(Ti.App.Properties.getString("isTermsCondtionSet") == true || Ti.App.Properties.getString("isTermsCondtionSet") == "true"){
			Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winRegistration').getView());
		}
		else{
			Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winTermsCondition').getView());	
		}
	}
}
//Activate account Function/Event
function activateAccount(){ 
	//Ti.API.info('current window' + Alloy.Globals.currentWindow);
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Alloy.Globals.showInternetMsg($.winLogin);
		return;
	}
    Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winActivateAccount', {title:"Activate"}).getView());
}
//SKIP Login function/Event
function SkipLogin(){
	Ti.App.Properties.setBool("isSecondTime",true);
	Ti.App.Properties.setString("username", null);
	if(args.isFromLeftPanel){
		$.winLogin.close();	
	}else if(Ti.App.Properties.getString("isMenuDirection") != undefined){
		Alloy.Globals.userInfo = false;
		Alloy.Globals.openWindow(Alloy.createController('winHome',Ti.App.Properties.getString("isMenuDirection")).getView());
	}else {
		Alloy.Globals.userInfo = false;
		Alloy.Globals.openWindow(Alloy.createController('common/winMenuSelection').getView());
	}
}
///// Submit login webservice call
function SubmitLogin(){
	Ti.App.Properties.setBool("isSecondTime",true);
	var username = $.textfieldUserName.value;
	var password = $.textfieldPassword.value;
	
	username = username.replace(/&(?!amp;)/g, '&amp;'​);
	password = password.replace(/&(?!amp;)/g, '&amp;'​);
	username = username.toLowerCase();
	
	Ti.API.info('caps change username ====='+username);
	if(username === "" || password === ""){
		var alertmsg = (username === "")? Alloy.Globals.selectedLanguage.plzEnterUserName : Alloy.Globals.selectedLanguage.plzEnterPassword;
		utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, alertmsg);
	}
	else{
       Ti.App.Properties.setString("username", username);
       Ti.App.Properties.setString("password", $.textfieldPassword.value);
       
       call_web_serivce_updateRegistrationWithUser();
	}
}
///// open a forgot username window.... function/event
function showForgotUsernamePopup(){
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Alloy.Globals.showInternetMsg($.winLogin);
		return;
	}
	Alloy.Globals.openWindow(Alloy.createController("UserManagement/winForgotUsername").getView());
}
///// open a forgot password window.... function/event
function showForgotPopup(){
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Alloy.Globals.showInternetMsg($.winLogin);
		return;
	}
	Alloy.Globals.openWindow(Alloy.createController("UserManagement/winForgotPassword").getView());
}
//////window OPEN function/event
function winOpen(){
	Alloy.Globals.currentWindowMain == "winLogin";
	
	//Ti.API.info('RETURN URL: 1111111::: '+Alloy.Globals.returnbackURL);
	
	if (OS_ANDROID && Alloy.Globals.returnbackURL)
	{
		//Ti.API.info('PROPERTY USER DATA:'+ JSON.stringify(Ti.App.Properties.getObject("LoginDetaisObj")));
		
		//$.textfieldUserName.value = Ti.App.Properties.getObject("LoginDetaisObj").username;
		//$.textfieldPassword.value = Ti.App.Properties.getObject("LoginDetaisObj").password;
		
		//$.textfieldUserName.value = Ti.App.Properties.getString("username");
		
		//if (Alloy.Globals.returnbackURL == "cancelPayment")
			//return;
		
		/*setTimeout(function(){
			Alloy.Globals.openWindow(Alloy.createController("Services/servicesWebView", {url : Alloy.Globals.returnbackURL}).getView());
		},1000);*/
	}
	else if (OS_IOS){
		if (Alloy.Globals.isAppOpened == false){
			Ti.API.info('ARGUMENTS: '+JSON.stringify(Titanium.App.getArguments()) +'ISOPENED -- Val---?????????'+Alloy.Globals.isAppOpened);
			var resumedAppData = Titanium.App.getArguments();
			if (resumedAppData.UIApplicationLaunchOptionsRemoteNotificationKey && resumedAppData.UIApplicationLaunchOptionsRemoteNotificationKey.custom_message) 
			{
				var customMsg = JSON.parse(resumedAppData.UIApplicationLaunchOptionsRemoteNotificationKey.custom_message);
					if (parseInt(customMsg.nTypeId)==5)
						Ti.API.info('NO NEED TO OPEN LOGIN SCREEN TWICE..');
					else
						Alloy.Globals.navigateToScreen(customMsg);
			}
		}
	}
	//$.textfieldUserName.value="aaziz";
	//$.textfieldPassword.value="welcome1!";
	
	//$.textfieldUserName.value="nk";
	//$.textfieldPassword.value="123NK@123!";
	
	setTimeout(function(){
		Alloy.Globals.isAppOpened = true;
		Ti.API.info('IS APP OPENED:(LOGIN.js): '+Alloy.Globals.isAppOpened);
	},2000);
}
//////make a web service call for update User with registration
function call_web_serivce_updateRegistrationWithUser()
{
	try{
		httpManager.updateRegistrationWithUser(function(result){
			Ti.API.info(' RESPONSE OF call_web_serivce_updateRegistrationWithUser  :::: ' + result);
			Alloy.Globals.serviceAuthentication = true;
			
			if (result.status == "success"){
				Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {"title":"login"}).getView());
			}
			else{
				Ti.API.info('DEVICE IS NOT REGISTRED FOR RECEIVEING PUSH NOTIFICATION..');
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.not_reg_push_error, null);
				Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {title:"login"}).getView());
			}
		},$.textfieldUserName.value.toLowerCase());
	}
	catch(e){
		Ti.API.info(' Error in making call of update Registration with user web service call'+ JSON.stringify(e));
	}
};
////Confirm aler dialog in android while exiting screen
if(OS_ANDROID)
{
	$.winLogin.addEventListener("androidback", function(){
		if(args.isFromLeftPanel==false){
			var alert = Ti.UI.createAlertDialog({
				title : Alloy.Globals.selectedLanguage.appTitle,
				message : Alloy.Globals.selectedLanguage.exitConfirm,
				buttonNames : [Alloy.Globals.selectedLanguage.no, Alloy.Globals.selectedLanguage.yes]
			});
			alert.addEventListener('click', function(e) {
				if (e.index == 1) {
					$.winLogin.close();
				}
			});
			alert.show();
		}
		else{
			$.winLogin.close();
		}
	});
}
//call chnage language function....
changeLanguage();
////////////////////////////////////////////////////////////////////////////////////////////////
//////////// SHOWING HELP SCREEN ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///helpscreen function : call itself /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
Ti.API.info('is APP opened second Time>>>>>>??? : '+Ti.App.Properties.getBool("isSecondTime"));

var showHelpScreen = function(){
	try{
		if (Ti.App.Properties.getBool("isSecondTime") == true){
			$.winLogin.remove($.scrllableviewHelpScreen);
			$.winLogin.remove($.lblFinishRight5);
			$.winLogin.remove(actHelp);
		}
		else{
			if (Ti.Network.online){
				if (Alloy.Globals.HELPSCREEN_COUNT==0 || Alloy.Globals.HELPSCREEN_COUNT==null){
					$.winLogin.remove($.scrllableviewHelpScreen);
					$.winLogin.remove($.lblFinishRight5);
					$.winLogin.remove(actHelp);
				}
				else{
					actHelp.show();
					$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.next;
					var helpScreenViews = [];
					for (var i=0; i<Alloy.Globals.HELPSCREEN_COUNT; i++){
						var imgHelp = Ti.UI.createImageView({
							height:"100%",
							width:"100%",
							defaultImage:Alloy.Globals.path.bg,
							image:Alloy.Globals.sitesUrl + "/img/mhelp/help_"+ (Alloy.Globals.isEnglish?"en/":"ar/") + parseInt(i+1) +".png"
						});
						imgHelp.addEventListener("load",function(){
							actHelp.hide();
						});
						imgHelp.add(actHelp);
						helpScreenViews.push(imgHelp);
					}
					$.scrllableviewHelpScreen.setViews(helpScreenViews);
					$.scrllableviewHelpScreen.animate({opacity:1, duration:1000},function(){
						actHelp.show();
						$.lblFinishRight5.animate({opacity:1, duration:2000});
					});
				}
			}
			else
			{
				//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
				Ti.API.info('NOT CONNECTED TO INTERNET');
				//Alloy.Globals.showInternetMsg($.winLogin);
			}
		}
	}
	catch(e){
		Ti.API.info('Error in showHelp screen function');
	}
}();

///Close helpscreen on clicking on Label(End)
var currentPage = 0;
var _eventCloseHelpScreen = function(){
	try{
		if ($.lblFinishRight5.text == Alloy.Globals.selectedLanguage.end){
			$.lblFinishRight5.animate({opacity:0, duration:500},function(){
				$.scrllableviewHelpScreen.animate({opacity:0, duration:500},function(){
					$.winLogin.remove($.scrllableviewHelpScreen);
					$.winLogin.remove($.lblFinishRight5);
					$.winLogin.remove(actHelp);
				});
			});	
		}
		else{
			$.scrllableviewHelpScreen.scrollToView(currentPage+1);
		}
	}
	catch(e){
		Ti.API.info('Error in close Help screen....');
	}
	
};
//Managing Next & End Label
function _eventScrollableViewScroll(e){
	try{
		currentPage = e.currentPage;
		if (currentPage==Alloy.Globals.HELPSCREEN_COUNT-1){
			$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.end;
		}
		else
		{
			$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.next;
		}
	}
	catch(e){
		Ti.API.info('Error in Scrollableview Scroll....');
	}
}
//add activity indicator in window.
$.winLogin.add(actHelp);
