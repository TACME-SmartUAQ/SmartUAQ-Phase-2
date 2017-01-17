// Alloy.Globals.SOADWebServiceUrl = "http://94.57.252.237:8080"; // not used for long time and never used in app also
var httpManager = require("httpManager");
var utilities = require("utilities");


//Checking for Development Env. and same time stop calling getEndPoints Web service call
//Alloy.Globals.SOAPLOOKUPServiceUrl = "http://94.57.252.234:7001"; // preogressive URL for SOAP Look Up - Development
//Alloy.Globals.webserviceUrl = "http://94.57.252.237";

// Alloy.Globals.SOAPLOOKUPServiceUrl = "http://83.111.136.7"; // new Staging SOAP LOOK UP URL - Staging
Alloy.Globals.serviceAuthentication = false;
Alloy.Globals.isReturnFromSocial = false;
Alloy.Globals.isNeedToNavigateNativeLogin = false;
Alloy.Globals.isWebSessionExpired = false;

Alloy.Globals.hideLoaderWhileReturnBackToApp = function(){
	if (Alloy.Globals.isReturnFromSocial == true){
		Alloy.Globals.hideLoading();
		Alloy.Globals.isReturnFromSocial = false;
	}
}; 
Alloy.Globals.SOAPLOOKUPServiceUrl = null;
Alloy.Globals.webserviceUrl = null;
Alloy.Globals.sitesUrl = null;

if (Ti.App.Properties.getString("webserviceUrl") && (Ti.App.Properties.getString("SOAPLOOKUPServiceUrl"))){
	Alloy.Globals.webserviceUrl = Ti.App.Properties.getString("webserviceUrl");
	Alloy.Globals.sitesUrl =  Ti.App.Properties.getString("sitesUrl");
	Alloy.Globals.SOAPLOOKUPServiceUrl = Ti.App.Properties.getString("SOAPLOOKUPServiceUrl");	
}
else
{
	Alloy.Globals.SOAPLOOKUPServiceUrl = null;
	Alloy.Globals.webserviceUrl = null;
	Alloy.Globals.sitesUrl  = null;
}


Alloy.Globals.HELPSCREEN_COUNT = 0;
/* Common functions start */

/* Service extensions*/
Alloy.Globals.isAppOpened = false;
Alloy.Globals.DEVICE_TOKEN = null;

Alloy.Globals.platformWidth = Ti.Platform.displayCaps.platformWidth;
Alloy.Globals.platformHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.isProduction = false;
Alloy.Globals.bottomMenu = null;
Alloy.Globals.isFavData = false;

if (Alloy.Globals.platformWidth > Alloy.Globals.platformHeight) {
	var temp = Alloy.Globals.platformWidth;
	Alloy.Globals.platformWidth = Alloy.Globals.platformHeight;
	Alloy.Globals.platformHeight = temp;
}

/* /// Removed dropbox folder and related files beacuse now registration is from web on : Wed, Sep-14
// DROPBOX code
Alloy.Globals.dropbox = require('dropbox');

// Getting the dropbox client
Alloy.Globals.createDropboxClient = function() {
	Alloy.Globals.client = Alloy.Globals.dropbox.createClient({
		app_key : Alloy.CFG.dropbox.key,
		app_secret : Alloy.CFG.dropbox.secret,
		root : Alloy.CFG.dropbox.root
	});
};
//Creating the dropbox client
Alloy.Globals.createDropboxClient();
*/


//This checks for the ios7 condition and return boolean.
var moment = require('alloy/moment');

/**
 * Alloy Width
 * @param {Number} value
 */

Alloy.Globals.GetWidth = function(value) {
	var temp = (value * 100) / 320;
	return parseInt((Alloy.Globals.platformWidth * temp) / 100);
};

/**
 * Get height
 * @param {Number} value
 */
Alloy.Globals.GetHeight = function(value) {
	var temp = (value * 100) / 480;
	return parseInt((Alloy.Globals.platformHeight * temp) / 100);
};


Alloy.Globals.path = (require('path')).path();
Alloy.Globals.currentWindowMain = "";
//Set current window as a main window. it is used for showing loading in current window
Alloy.Globals.SetMainWindow = function(win) {
	if (OS_ANDROID) {
		var actInd = Titanium.UI.Android.createProgressIndicator({
			height : 50,
			width : 10,
			message : 'Loading...'
		});
		Alloy.Globals.showLoading = function(message) {
			Ti.API.error("----" + message);
			actInd.message = message;
			actInd.show();
		};
		Alloy.Globals.hideLoading = function() {
			actInd.hide();
		};
	} else {
		var progressView = require('progressView');
		progressView.initWithWindow(win);

		Alloy.Globals.showLoading = function(message, isError) {
			progressView.show({
				text : message,
				error : isError,
			});
		};
		Alloy.Globals.changeLoading = function(message, success) {
			progressView.change({
				text : message,
				success : success
			});
		};
		Alloy.Globals.hideLoading = function() {
			progressView.hide();
		};
	}
};
var isWindowOpening = false;
/**
 * Open the window
 *
 * @param {Object} win
 * @param {Boolean} animation
 */
Alloy.Globals.openWindow = function(win, animation) {
	if (isWindowOpening)
		return;
	isWindowOpening = true;
	var st = setTimeout(function() {
		isWindowOpening = false;
	}, 1000);

	Alloy.Globals.currentWindow = win.id;
	if (animation == true) {
		if (OS_IOS) {
			Alloy.Globals.tab.open(win, {
				transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		} else {
			win.open({
				activityEnterAnimation : Titanium.App.Android.R.anim.anim_slide_in_left,
				activityExitAnimation : Titanium.App.Android.R.anim.anim_slide_out_left
			});
		}
	} else {
		if (OS_IOS) {
			Alloy.Globals.tab.open(win);
		} else {
			win.open();
		}
	}

};

/**
 * Close the window
 * @param {Object} window
 * @param {Boolean} isAnim
 */
Alloy.Globals.closeWindow = function(win, isAnim) {
	if (isAnim == undefined || isAnim == null) {
		isAnim = true;
	}
	if (OS_IOS) {
		Alloy.Globals.tab.close(win, {
			animated : isAnim
		});
	} else {
		win.close();
	}
	win = null;
};

var isIOS7Plus = function() {
	// This function Checks whether the Operating system version is 7 in IPhone or not.This function is for Iphone only.
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0], 10);
		if (major >= 7) {
			return true;
		}
	}
	return false;
};

Alloy.Globals.isIOS7Plus = isIOS7Plus();

Alloy.Globals.changeLanguage = function(language) {

	if (language == "english") {
		Alloy.Globals.selectedLanguage = (require('english')).language();
		Alloy.Globals.language = "english";
		Alloy.Globals.languageCode = "en";
		Alloy.Globals.isEnglish = true;
		Alloy.Globals.isArabic = false;
		Ti.App.Properties.setBool("isEnglishSelected", true);
	} else {
		Alloy.Globals.selectedLanguage = (require('arabic')).language();
		Alloy.Globals.language = "arabic";
		Alloy.Globals.languageCode = "ar";
		Alloy.Globals.isEnglish = false;
		Alloy.Globals.isArabic = true;
		Ti.App.Properties.setBool("isEnglishSelected", false);
	}
	Ti.API.info('Alloy.Globals.language == ' + Alloy.Globals.language);
	Ti.App.Properties.setBool("isLanguageSelected", true);
	Alloy.Globals.path = (require('path')).path();
};
Alloy.Globals.arrWindows = [];

Alloy.Globals.gotoHome = function() {
	//Function is just used for going from particular window to the home screen window for "Practice RTA Theory Test".
	if (OS_IOS) {
		for (var i = 0; i <= Alloy.Globals.arrWindows.length - 1; i++) {

			Alloy.Globals.arrWindows[i].close({
				animated : true
			});

		}
	} else {
		for (var i = Alloy.Globals.arrWindows.length - 1; i >= 0; i--) {

			Alloy.Globals.arrWindows[i].close({
				animated : true
			});
		}
	}
};





/*
* push Notification implementation : Nikunj
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////PUSH NOTIFICATIONS (iOS & ANDROID)/////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
Alloy.Globals.AllNotificationLabelCounter = null;
Alloy.Globals.NotificationCounterNews = null;
// Alloy.Globals.NotificationCounterEservices = null;
Alloy.Globals.NotificationCounterEvents = null;
Alloy.Globals.NotificationCounterFunerals = null;
Alloy.Globals.storedAllNotificationData = null;
var CloudPush = null;
 // Ti.App.Properties.setObject("LoginDetaisObj", null);
// TO do : Future if automatic login perform if user logged in then remove this
// var deviceToken = null;
var Cloud = require("ti.cloud");
//getting and checking device token: wheather we have already a device token or not.?
try {
	if ((Ti.App.Properties.getString('deviceToken') == null) || (Ti.App.Properties.getString('deviceToken') == undefined) || (Ti.App.Properties.getString('deviceToken') == "")) {
		Ti.API.info('NO DID NOT GET THE DEVICE TOKEN FROM PROPERTIES');
		Alloy.Globals.DEVICE_TOKEN = null;
	} else {
		Ti.API.info('YES GOT THE DEVICE TOKEN FROM PROPERTIES' + Ti.App.Properties.getString('deviceToken'));
		Alloy.Globals.DEVICE_TOKEN = Ti.App.Properties.getString('deviceToken');
	}
} catch(e) {
	Ti.API.info('Error in getting Device Token from Properties');
}
// getting and setting the push swith state. If enabled then swtich should indicate Push Notification is On otherwise OFF
if (Ti.App.Properties.hasProperty('isPushEnabled')) {
	if (Ti.App.Properties.getBool('isPushEnabled') == true)
		Alloy.Globals.pushEnabled = true;
	else
		Alloy.Globals.pushEnabled = false;
} else {
	Alloy.Globals.pushEnabled = true;
}

// Initialization of modules and variables
var returnURL;
var activity;
Alloy.Globals.returnbackURL = null;
if (OS_ANDROID) {
	
	Ti.API.info('111111111: '+ JSON.stringify(Ti.Android.currentActivity));
	Ti.API.info('222222222: '+ JSON.stringify(Ti.Android.currentActivity.intent));
	Ti.API.info('333333333: '+ JSON.stringify(Ti.Android.currentActivity.intent.getData()));
	
	try{
		var returnURL = Ti.Android.currentActivity.intent.getData();
	
		if (returnURL=="" || returnURL== null || returnURL==undefined){
        	Ti.API.info('EMPTY LAUNCH URL');
        	//Ti.App.Properties.setObject("LoginDetaisObj", null);
        }
		else if(returnURL == 'smartuaq://') {
        	Ti.API.info('USER HAS CANCEL THE PAYMENT TRANSACTION PROCCESS.......ANDROID');
        	Alloy.Globals.returnbackURL = 'cancelPayment';
        	//Ti.API.info('PROPERTY USER Info is : ' + JSON.stringify(Ti.App.Properties.getObject("LoginDetaisObj")));
        }
        else if(returnURL.match("smartuaq") == "smartuaq"){
        	returnURL = returnURL.replace("smartuaq://?", Ti.App.Properties.getString("webserviceUrl"));
			Ti.API.info('PREPARED URL is : ' + returnURL);
			//Ti.API.info('PROPERTY USER Info is : ' + JSON.stringify(Ti.App.Properties.getObject("LoginDetaisObj")));
			Alloy.Globals.returnbackURL = returnURL;
        }
        else{
        	Ti.API.info('COULDNOT RECEIVE ANY SCHEMA DATA');
        	//Ti.App.Properties.setObject("LoginDetaisObj", null);
        }
        
	var activity = Ti.Android.currentActivity;
    	activity.onCreate = function(e){
    		Ti.API.info('ACTIVITY ON CRAETE: '+ JSON.stringify(e));
    		Alloy.Globals.isAppOpened = false;
    	};
	}
	catch(e){
		Ti.API.info('&&&&&&&&& ERROR IN RETURNED URL &&&&&&&&&&&&&&&&'+JSON.stringify(e));
	}
	
	//// Android Push code. /////////
	
	CloudPush = require('ti.cloudpush');
	CloudPush.debug = true;
	CloudPush.enabled = true;
	CloudPush.focusAppOnPush = false; //when notification comes app automatically launch
	CloudPush.showAppOnTrayClick = true; //Launch app when clicking on tray notification
	CloudPush.showTrayNotificationsWhenFocused = false; //when notification comes app automatically launch
	CloudPush.showTrayNotification = true; // will show notifiction in Tray
	CloudPush.singleCallback = true;
		
	CloudPush.addEventListener('callback', function(evt) {
		try
		{
			// alert('Alloy.Globals.isAppOpened == '+Alloy.Globals.isAppOpened);
			if (Alloy.Globals.isAppOpened == false)
			{
				var neededData = JSON.parse(evt.payload);
				var jsonMsg = neededData.android.custom_message_json;
				setTimeout(function(){
					if (parseInt(jsonMsg.nTypeId)==5)
						Ti.API.info('NO NEED TO NAVIAGTE.. JUST STAY ON LOGIN.');
					else
						Alloy.Globals.navigateToScreen(jsonMsg);
				},500);
			}
			else if (Alloy.Globals.isAppOpened == true)
			{
				receivePush(evt);
			}
		}
		catch(e)
		{
			Ti.API.info('ERROR IN ESTABLISHING TRY...CATCH OF Push CallBack function.......');
		}
	});
	CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
		Ti.API.info('Tray Click Launched App (app was not running)');
		//receivePush(evt);
		// alert('trayClickLaunchedApp');
		var neededData = JSON.parse(evt.payload);
		var jsonMsg = neededData.android.custom_message_json;
			Alloy.Globals.navigateToScreen(jsonMsg);
	});
	CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
		Ti.API.info('Tray Click Focused App (app was already running)');
		//receivePush(evt);
		//alert('trayClickFocusedApp');
		if (Alloy.Globals.isAppOpened == false){
			var neededData = JSON.parse(evt.payload);
			var jsonMsg = neededData.android.custom_message_json;
			Alloy.Globals.navigateToScreen(jsonMsg);
		}
	});
	Ti.API.info(' Cloud Push Module for Android is : ' + CloudPush);
}
else
{
	//Ti.App.Properties.setObject("LoginDetaisObj", null);
}
// Niikunj : For getting device token for ios
var getDeviceToken_IOS = function() {
	try {
		if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
			Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
				Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
				Ti.Network.registerForPushNotifications({
					success : deviceTokenSuccess,
					error : deviceTokenError,
					callback : receivePush_ios
				});
			});
			Ti.App.iOS.registerUserNotificationSettings({
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
		} else {
			Ti.Network.registerForPushNotifications({
				types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
				success : deviceTokenSuccess,
				error : deviceTokenError,
				callback : receivePush_ios
			});
		}
	} catch(e) {
		Ti.API.info('##### ERROR IN getDeviceToken_IOS ######### ' + JSON.stringify(e));
	}
};
// Niikunj : For getting device registration id for android
var getDeviceToken_ANDROID = function() {
	try {
		CloudPush.retrieveDeviceToken({
			success : deviceTokenSuccess,
			error : deviceTokenError
		});
	} catch(e) {
		Ti.API.info('##### ERROR  getDeviceToken_ANDROID######### ' + JSON.stringify(e));
	}
};
// Save the device token for subsequent API calls
var deviceTokenSuccess = function(e) {
	try {
		Ti.API.info(' DEVICE TOKEN: ' + JSON.stringify(e));
		// alert(e.deviceToken);
		Alloy.Globals.DEVICE_TOKEN = e.deviceToken;
		if (Alloy.Globals.DEVICE_TOKEN) {
			Cloud.PushNotifications.subscribeToken({
				device_token : Alloy.Globals.DEVICE_TOKEN,
				channel : ( OS_IOS ? 'iphone' : 'android'),
				type : Ti.Platform.name == 'android' ? 'android' : 'ios'
			}, function(e) {
				if (e.success) {
					Ti.API.info('Subscribed successfully push notification from chanel');
					// alert(JSON.stringify(e));
				} else {
					Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					// alert(JSON.stringify(e));
				}
				sendDeviceTokenToServer();
			});
		} else
			return;
	} catch(e) {
		Ti.API.info('##### ERROR  In Subscribe Device token for Push Notification ' + JSON.stringify(e));
	}
};

var deviceTokenError = function(e) {
	try {
	Alloy.Globals.DEVICE_TOKEN = null;
	Ti.App.Properties.setString('deviceToken', null);
	utilities.showAlert(Alloy.Globals.selectedLanguage.device_regi_error);
	} catch(e) {
		Ti.API.info('##### ERROR  In Subscribe Device token for Push Notification ' );
	}
};


//GET ENDPOINT URLs  and then get the device token and then it goes to send device token to server
if (Ti.Network.online) 
{
	try{
			httpManager.getEndPointDetails(function(response){
			if (response==null || response == undefined || response==""){
				Ti.API.info('EMPTY RESPOSE');
				return;
			}
			Alloy.Globals.webserviceUrl = response.infoURL;
			Alloy.Globals.sitesUrl = response.sitesWebServiceURL;
			
			
			Alloy.Globals.SOAPLOOKUPServiceUrl = response.soaURL;
			// Now do all the stuff for push notification if device is registered or not?
		     //Ti.API.info('webservice URL' + Alloy.Globals.SOAPLOOKUPServiceUrl);
		     
		     Ti.API.info('webservice URL (infoURL)::  ' + Alloy.Globals.webserviceUrl);
		     Ti.API.info('webservice URL (sitesWebServiceURL):: ' + Alloy.Globals.sitesUrl);
		     Ti.API.info('webservice URL (SOAURL):: ' + Alloy.Globals.SOAPLOOKUPServiceUrl);
		     
		     Alloy.Globals.HELPSCREEN_COUNT = response.helpScreenCount;
		     
		     Ti.App.Properties.setString("webserviceUrl", Alloy.Globals.webserviceUrl);
		     //Ti.App.Properties.setString("sitesUrl", Alloy.Globals.sitesUrl);
		     Ti.App.Properties.setString("SOAPLOOKUPServiceUrl", Alloy.Globals.SOAPLOOKUPServiceUrl);
		     
			if (Alloy.Globals.DEVICE_TOKEN == null)
				( OS_IOS ? getDeviceToken_IOS() : getDeviceToken_ANDROID());
			else
				Ti.API.info(' We have already device token so no need to send to server everytime...!!!!');
			});
		// }
		// else
		// {
			// Ti.API.info(' WEB SERVICE URL is: '+ Alloy.Globals.webserviceUrl);
			// Ti.API.info(' SOA SERVICE URL is: '+ Alloy.Globals.SOAPLOOKUPServiceUrl);
		// }
	}
	catch(e){
		Ti.API.info(' ERROR IN GETTING RESPONSE OF getEndPointDetails : '+ JSON.stringify(e));
	};
}
else 
{   
	Ti.API.info('INTERNET IS NOT CONNECTED 2 GET END POINTS...');
	/*try {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
	} catch(e) {
		//utilities.showAlert("Internet connection is required.");
	};*/
}


// actual code for device UDID pass : /*(OS_IOS?deviceToken:Titanium.Platform.id)*/
var sendDeviceTokenToServer = function() {
	// URL format for calling this web service ;
	//http://94.57.252.246:8080/pushnotification/register/{deviceuid}/{appname}/{appversion}/{devicetoken}/{devicename}/{devicemodel}/{deviceversion}/{pushbadge}/{pushalert}/{pushsound}/{imeino}/{devicetype}/{userid}/{subscription}/{source}
	
	//Live IP/ URL
	var url = Alloy.Globals.webserviceUrl + "/uaqws/pushnotification/register/" + (OS_IOS?Alloy.Globals.DEVICE_TOKEN:Titanium.Platform.id) + "/SmartUAQ/1.0/" + Alloy.Globals.DEVICE_TOKEN + "/" + ( OS_IOS ? 'iPhone' : 'Android') + "/" + Ti.Platform.manufacturer+"-"+Titanium.Platform.username + "/" + Titanium.Platform.version + "/0/0/0/0000/" + ( OS_IOS ? 2 : 1) + "/0/true/ecs";
	
	// Raheem local IP - For Testing
	// var url =  "http://192.168.1.85:8080/uaqws/pushnotification/register/" + (OS_IOS?Alloy.Globals.DEVICE_TOKEN:Titanium.Platform.id) + "/SmartUAQ/1.0/" + Alloy.Globals.DEVICE_TOKEN + "/" + ( OS_IOS ? 'iPhone' : 'Android') + "/" + Ti.Platform.manufacturer+"-"+Titanium.Platform.username + "/" + Titanium.Platform.version + "/0/0/0/0000/" + ( OS_IOS ? 2 : 1) + "/0/true/ecs";
	httpManager.sendDeviceTokenToServer(url);
};
var returnPushAlertTitle = function(categoryId){
	return	(categoryId == "1" ? 
				Alloy.Globals.selectedLanguage.generic : (categoryId == "2" ? 
				Alloy.Globals.selectedLanguage.news : (categoryId == "3" ? 
				Alloy.Globals.selectedLanguage.events : (categoryId == "4" ? 
				Alloy.Globals.selectedLanguage.funeral : Alloy.Globals.selectedLanguage.services))));
};
var receivePush_ios = function(e){
	Ti.API.info('CAME TO UNUSAL PUSH CODE');
};
// Process incoming push notifications when U get the push notification message on device
var receivePush = function(e) {
	try {
		if (e == "" || e == null || e == undefined) {
			Ti.API.info("************** Empty notification received ************** ");
			return;
		}
		Ti.Media.vibrate();
		var jsonMsg = null;
		var categoryId = null;
		var dialog = Ti.UI.createAlertDialog({
			title : "",
			message : "",
			// buttonNames : [Alloy.Globals.selectedLanguage.view, Alloy.Globals.selectedLanguage.dismiss],
			buttonNames : ["View", "Dismiss"],
			cancel : 1
		});
		//do operatio on received push data......
		if (OS_IOS) {

			Ti.API.info('%%%%iOS%%%%% PUSH RECEIVED: %%%%%%%%% ' + JSON.stringify(e));
			var parsedJsonData = JSON.parse(e.data.custom_message);
			Ti.API.info('Custom DATA for PUSH: ' + parsedJsonData);
			
			// categoryId = parsedJsonData.nTypeId;
			// Ti.API.info('CATEGORY ID: ' + categoryId);
			// var pushMsg = e.data.aps.alert;
			//var notificationTypeIdValue = parsedJsonData.notification_type_id_value;
			//Ti.API.info('CATEGORY ID: ' + notificationTypeIdValue);
			// var pushNotificationMessage = parsedJsonData.mText;
			// Ti.API.info('NOTIFICATION MESSAGE: ' + pushNotificationMessage);

			dialog.setTitle(returnPushAlertTitle(parsedJsonData.nTypeId));
			dialog.setMessage(parsedJsonData.mText);
			jsonMsg = parsedJsonData;

		} else {
			try {

				Ti.API.info('#####ANDROID######### PUSH RECEIVED: ############## ' + JSON.stringify(e));

				var neededData = JSON.parse(e.payload);
				// categoryId = neededData.android.custom_message_json.nTypeId;
				dialog.setTitle(returnPushAlertTitle(neededData.android.custom_message_json.nTypeId));
				dialog.setMessage(neededData.android.custom_message_json.mText);
				jsonMsg = neededData.android.custom_message_json;

			} catch(e) {
				Ti.API.info('######### ERROR IN LAUNCHING ACTIVITY FOR PUSH ##########' + JSON.stringify(e));
			}
		}
		dialog.addEventListener("click", function(evAlert) {
			if (evAlert.index == 0) 
			{
				if (jsonMsg == null)
					Ti.API.info('RECEIVED PUSH BUT WITHOUT JSON DATA...!!!!');
				else
					Alloy.Globals.navigateToScreen(jsonMsg);
			} 
			else 
			{
				Alloy.Globals.hideLoading();
				setTimeout(function(){
					//Ti.App.fireEvent('loadNbindNotificationDataInTable');
					Ti.API.info('YOu have Clicked on DISMISS, imstead of to read the messsage..');
				},750);
				
			}
		});
		dialog.show();
		dialog = null;

	} catch(e) {
		Ti.API.info('######### ERROR IN HANDLING RECEIVE PUSH ##########' + JSON.stringify(e));
	}
};

Alloy.Globals.navigateToScreen = function(customeMessage) {
	Ti.API.info(' SCREEN DATA IS 222: ' + JSON.stringify(customeMessage));
	//2=NEWS : Landing to News Details Page
	//3=EVENTS : Landing to Event Details page
	//4=FUNERALS : Landing to Funerals listing screen
	//5=eServices; Landing to eService detail screen
	try 
	{
		if (customeMessage.mid) {
			// Ti.App.Properties.setString("oldMessageHistory",customeMessage.mText);
			if (parseInt(customeMessage.nTypeId) == 5){
				openMyRequestScreen(customeMessage);
			}
			else{
				try{
					httpManager.markNotificationMessageAsRead(function(response) {
						if (parseInt(customeMessage.nTypeId) == 2){
							openNewsDetailScreen(customeMessage);
						} 
						else if (parseInt(customeMessage.nTypeId) == 3){
							openEventDetailScreen(customeMessage);
						} 
						else if (parseInt(customeMessage.nTypeId) == 4){
							openFuneralListingScreen(customeMessage);
						} 
						else{
							Ti.API.info('INVALID TYPE OF NOTIFICATION');
						}
					}, customeMessage.mid, 0);
				}
				catch(e){
					Ti.API.info('An Error occur while doing the message MARK as READ');
				}
			}
		}
		else
			Ti.API.info('$$$$$$$$$ ERROR $$$$$$$$$$ ::: We are anable to get messages Ids to make mark as read');
	}
	catch(e) {
		Ti.API.info('%%%%%% ERROR IN CALLING FUNCTION mark message as Read %%%%%%%%');
	}
};

// function :: open News Detail screen
var openNewsDetailScreen = function(customeMessage) {

	try {
		// track the notificationTypeIdValue from this customeMessage as " customeMessage.nTypeIdVal " and pass it to inplace of static value "1437027860961"
		if (Alloy.Globals.currentWindow == "winNewsDetail" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined))
			Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].close();

		httpManager.getNewsDetails(function(response) {
			if (response == null || response == "" || response == undefined) {
				utilities.showAlert(Alloy.selectedLanguage.no_details_found);
				return;
			}
			Alloy.Globals.openWindow(Alloy.createController("News/winNewsDetail", response).getView());
		}, customeMessage.nTypeIdVal);
		// },"1437027860961");
	} catch(e) {
		Ti.API.info('@@@@@@@ ERROR IN OPENING NEWS DETAIL SCREEN AT THE TIME OF CALLING NAVIGATE TO SCREEN FUNCTION...');
	}

};

// function :: open Event Detail screen
var openEventDetailScreen = function(customeMessage) {

	try {
		Ti.API.info('nTypeIdVal: ' + customeMessage.nTypeIdVal);

		if (Alloy.Globals.currentWindow == "winEventsDetail" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined))
			Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].close();

		httpManager.getEventDetails(function(response) {
			Ti.API.info(' PASSED nTypeIdVal: ' + customeMessage.nTypeIdVal);
			if (response == null || response == "" || response == undefined) {
				utilities.showAlert(Alloy.selectedLanguage.no_details_found);
				return;
			}
			Alloy.Globals.openWindow(Alloy.createController("Events/winEventsDetail", response).getView());
		}, customeMessage.nTypeIdVal);
		// },"1437027869987");
	} catch(e) {
		Ti.API.info('@@@@@@@ ERROR IN OPENING EVENT DETAIL SCREEN AT THE TIME OF CALLING NAVIGATE TO SCREEN FUNCTION...');
	}
	// track the notificationTypeIdValue from this customeMessage as " customeMessage.nTypeIdVal " and pass it to inplace of static value "1437027869987"
};

// function :: open Funeral Listing screen
var openFuneralListingScreen = function(customeMessage) {
	Ti.API.info('GOING TO OPEN JANAZAH LANDING SCREEN.....!');
	try {
		if (Alloy.Globals.currentWindow == "winJnazahLanding" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined))
			Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].close();

		Alloy.Globals.openWindow(Alloy.createController("Jnazah/winJnazahLanding").getView());
	} catch(e) {
		Ti.API.info('@@@@@@@ ERROR IN OPENING FUNERAL LISTING SCREEN AT THE TIME OF CALLING NAVIGATE TO SCREEN FUNCTION...');
		Alloy.Globals.openWindow(Alloy.createController("Jnazah/winJnazahLanding").getView());
	}
};


// function :: open My Request screen
var openMyRequestScreen = function(customeMessage){
	try {
		if (Alloy.Globals.isAppOpened == true){
			//Ti.API.info('USER DATA @ RECEIVING eSERVICES PUSH' + Ti.App.Properties.getObject("LoginDetaisObj"));
			Ti.API.info('USER DATA @ RECEIVING eSERVICES PUSH' + Ti.App.Properties.getString("username"));
			
			//if (Ti.App.Properties.getObject("LoginDetaisObj") == null || Ti.App.Properties.getObject("LoginDetaisObj") == undefined || Ti.App.Properties.getObject("LoginDetaisObj") == "") {
			if (Ti.App.Properties.getString("username") == null || Ti.App.Properties.getString("username") == undefined || Ti.App.Properties.getString("username") == "") {
				if (Alloy.Globals.currentWindow == "winLogin" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined)){
					Ti.API.info('Already U r on Loginscreen....');
				}
				else{
					Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin", {isFromLeftPanel : true}).getView());
				}
			}
			else {
				if (Alloy.Globals.currentWindow == "winMyServices" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined))
					Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].close();
					
				httpManager.markNotificationMessageAsRead(function() {
					setTimeout(function(){
						var data = {"response":"", "idToExpand":customeMessage.nTypeIdVal, "isNoRecord":"", url : ""};
						Alloy.Globals.openWindow(Alloy.createController("Services/MyServices/winMyServices", data).getView());					
					},300);
				}, customeMessage.mid, Ti.App.Properties.getString("username"));
			}
		}
		else{
			Ti.API.info('APP IS JUST NOW OPENED SO NO NEED TO OPEN LOGIN SCREEN AGAIN BCOZ ITS ALREADY OPENED....');
		}
	}
	catch(e) {
		Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin", {isFromLeftPanel : true}).getView());
	}
};

// Alloy.Globals.myService = "";
/*Ti.App.addEventListener('pause', function(e) {
	// Alloy.Globals.url = "";
	var path = Titanium.Filesystem.applicationDataDirectory;
var searchKey = path.search(‘Documents’);
path = path.substring(0,searchKey);
path = path + ‘Library/Cookies/‘
alert(path);
	
	Ti.API.info('PAUSED APP' + JSON.stringify(e) +'	WITH APP IS OPENED? '+Alloy.Globals.isAppOpened);
});*/

Ti.App.addEventListener('resume', function(e) {
	Alloy.Globals.hideLoading();
	Ti.API.info(' RESUME APP' + JSON.stringify(e)+'	WITH APP IS OPENED? '+Alloy.Globals.isAppOpened);
});
if (OS_IOS){
	Ti.App.iOS.addEventListener('remotenotificationaction', function(e) {
		Ti.API.info('eeeeeeobj: for remote notification:'+JSON.stringify(e));
	});
	Ti.App.iOS.addEventListener('notification', function(e) { 
		Ti.API.info('notification (eeeeeeeeeeeeee) OBJ:; '+ JSON.stringify(e));
	});
	// Monitor silent push notifications
	Ti.App.iOS.addEventListener('silentpush', function(e){
		Ti.API.info('silent push (eeeeeeeeeeeeee) OBJ:; '+ JSON.stringify(e));
		// var firstTime=false;
		var parseJsonMsg = JSON.parse(e.custom_message);
		if (Alloy.Globals.isAppOpened == true){
			// Ti.App.Properties.setString("oldMessageHistory",e.handlerId);
			// if (e.handlerId != Ti.App.Properties.getString("oldMessageHistory")){
				var dialogPush = Ti.UI.createAlertDialog({
					title : returnPushAlertTitle(parseJsonMsg.nTypeId),
					message : parseJsonMsg.mText,
					buttonNames : ["View", "Dismiss"],
					cancel : 1
				});
				dialogPush.addEventListener("click", function(evAlert) {
					if (evAlert.index == 0) {
						Alloy.Globals.navigateToScreen(parseJsonMsg);
					} 
					else {
						Ti.App.fireEvent('loadNbindNotificationDataInTable');
					}
				});
				dialogPush.show();
		}
	});
}

Alloy.Globals.markPublicNotificationAsRead = function(catId){
	try{
		if (Alloy.Globals.storedAllNotificationData.length == 0){
			Ti.API.info('NO NOTIFICATION TO SET MARK AS READ........!!! Cheers');
			return;
		}
		var msgIds = utilities.exctractIdsForCategory(catId);
		
		if (msgIds=="empty"){
			Ti.API.info('$$$$$$$$$ NO PUBLIC NOTIFICATION TO SET MARK AS READ  $$$$$$$$$$');
			return;
		}
		
		httpManager.markNotificationMessageAsRead(function(response){
			Ti.API.info('RES. FROM MARK MSG AS READ.......'+response);
		},msgIds, 0);
	}
	catch(e){
		Ti.API.info('%%%%%% ERROR IN CALLING FUNCTION markPublicNotificationAsRead %%%%%%%%' + JSON.stringify(e));
	}
};

////// SHOW ATTACHMENT IN DIALOG(WINDOW) IN WEBVIEW : Registration, My Request page......
Alloy.Globals.showAttachment = function(attachmentURL){
	Ti.API.info('FOUND PDF ATTACHMENT');
	var winAttach = Titanium.UI.createWindow({
		height:"100%",
		width: "100%",
		orientationModes: [Titanium.UI.PORTRAIT],
		backgroundColor:"#d9d9d9"
	});
	
	var viewParent = Ti.UI.createView({
		bottom:"1%",
		top:"30",
		//borderColor:"#4d4d4d",
		borderColor:"black",
		borderRadius:5,
		borderWidth:3,
		width:"99%",
		backgroundColor:"#e6e6e6"
	});
	
	var btnClose = Ti.UI.createButton({
		title:Alloy.Globals.selectedLanguage.close,
		right:5,
		width:75,
		top:5,
		height:35,
		fontFamily:{fontSize:12, fontFamily:"Arial", fontWeight:"bold"}
	});
	btnClose.addEventListener('click',function(e){
		Ti.API.info('button clicked');
	   	winAttach.close();
	});
	var webviewAttach = Ti.UI.createWebView({
		bottom:0,
		width:"100%",
		top:42,
		left:5,
		borderRadius:5,
		right:5,
		url:attachmentURL,
		hideLoadIndicator:false,
		loading:true
	});
	Ti.API.info('ATTCHMENT :::: '+webviewAttach.url);
	viewParent.add(btnClose);
	viewParent.add(webviewAttach);
	winAttach.add(viewParent);
	winAttach.open();
};
////////////// ////////////// ////////////// ////////////// ////////////// 
////////////// INTERNET TOAST MESSAGE : GLOBAL ::::///////////////////
////////////// ////////////// ////////////// ////////////// //////
Alloy.Globals.showInternetMsg = function(win){
	if (OS_ANDROID){
		var toast = Ti.UI.createNotification({
		    message:Alloy.Globals.selectedLanguage.internet_err,
		    duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();	
	}
	else{
		var viewParent = Ti.UI.createView({
			height:"100%",
			width:"99%",
			backgroundColor:"transparent"
		});
		
		var lblInternet = Ti.UI.createLabel({
			color:"white",
			backgroundColor:"black",
			width:Ti.UI.SIZE,
			borderColor:"white",
			borderRadius:5,
			height:50,
			opacity:0,
			textAlign:'center',
			fontFamily:{fontSize:13, fontFamily:"Arial", fontWeight:"bold"},
			bottom:"10%",
			text:"   "+Alloy.Globals.selectedLanguage.internet_err+"   "
		});
		viewParent.add(lblInternet);
		win.add(viewParent);
		lblInternet.animate({opacity:1, duration:400},function(){
			setTimeout(function(){
				lblInternet.animate({opacity:0, duration:300},function(){
					win.remove(viewParent);
				});
			},2000);
		});
	}
};
/////////////////////////////////////
Alloy.Globals.isAttachmentIsImageOrHTML = function(stringPass) {
	if (stringPass.indexOf("format=image/jpeg") != -1) {
		return true;
	}
	if (stringPass.indexOf("format=image/jpg") != -1) {
		return true;
	}
	if (stringPass.indexOf("format=image/png") != -1) {
		return true;
	}
	if (stringPass.indexOf("format=image/gif") != -1) {
		return true;
	}
	if (stringPass.indexOf("format=image/bmp") != -1) {
		return true;
	}
	if (stringPass.indexOf(".html") != -1) {
		return true;
	}
	return false;
};