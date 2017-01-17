var args = arguments[0] || {};
var httpManager = require('httpManager');
var utilities = require("utilities");
// var callFirstTime = true;
var arrMediaTypes = [Ti.Media.MEDIA_TYPE_PHOTO];

var arrOptions = [];

var mediaOptionDialogLeft = Titanium.UI.createOptionDialog({
	options : arrOptions,
	cancel : 2,
});
function pushEffect(obj){
	obj.animate({opacity:0,duration:500},function(){
		obj.opacity=1;
	});
}
mediaOptionDialogLeft.addEventListener('click', function(e) {
	var ind = e.index;
	if (ind == 0) {
		showCameraLeftPanel();
	} else if (ind == 1) {
		choosePhotoGalleryLeftPanel();
	}
});

//Alloy.Globals.userInfo = Ti.App.Properties.getObject("userInfo", null);
if(Alloy.Globals.userInfo === false){
	$.labelLogout.text = Alloy.Globals.selectedLanguage.login;
	// $.labelEdit.visible = false;
} else {
	$.labelLogout.text = Alloy.Globals.selectedLanguage.logout;
	// $.labelEdit.visible = false;
}

if (Alloy.Globals.userInfo === false) {
	
	//$.viewMiddle.top="6%";
	$.viewBottom.top="-10%";
	//hide the myrequest menu
	$.viewServices.width = 0;
	$.viewServices.height = 0;
	$.hideLineService.width = 0;
	$.hideLineService.height = 0;
	//hide the payment history menu
	$.viewPaymentHistory.width = 0;
	$.viewPaymentHistory.height = 0;
	
} else {
	
	//$.viewMiddle.top="3%";
	$.viewBottom.top=0;
	//show the myrequest menu
	$.viewServices.width = "100%";
	$.viewServices.height = "12%";
	$.hideLineService.width = "100%";
	$.hideLineService.height = "0.5%";
	//show the payment history menu
	$.viewPaymentHistory.width = "100%";
	$.viewPaymentHistory.height = "12%";
}
function _eventClickViewPayment(){
	pushEffect($.labelPaymentHistory);
	
	if (Alloy.Globals.currentWindow == "winPaymentHistory")
		return;
		
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Ti.App.fireEvent("showInternetToast");
		return;
	}
	Alloy.Globals.openWindow(Alloy.createController("UserManagement/Payment_History/winPaymentHistory").getView());
}

Ti.App.addEventListener('openLoginpage', function(e) {
  Ti.API.info('event fires +++++');
  Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{
			isFromLeftPanel : true
		}).getView());
  //doLogin();
});

function doLogin(){
	Alloy.Globals.currentWindowMain == "";
	
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Ti.App.fireEvent("showInternetToast");
		return;
	}

	if(Alloy.Globals.userInfo === false){
		 Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin",{isFromLeftPanel : true}).getView()); 
	} 
	else{
		changeProfile();
		$.viewBottom.top="-10%";
		//hide the myrequest menu
		$.labelLogout.text = Alloy.Globals.selectedLanguage.login;
		$.viewServices.width = 0;
		$.viewServices.height = 0;
		$.hideLineService.width = 0;
		$.hideLineService.height = 0;
		//hide the payment history menu
		$.viewPaymentHistory.width = 0;
		$.viewPaymentHistory.height = 0;
	    Alloy.Globals.userInfo = false;
	   Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {title:"logout"}).getView());
	   
		//Ti.App.Properties.removeProperty("Alloy.Globals.userInfo");
		
		/*httpManager.userLogout(function(response) {
		    if(response == "Success")
			{
				Alloy.Globals.userInfo === false;
		        changeProfile();
		        //Alloy.Globals.openWindow(Alloy.createController('UserManagement/winLogin').getView());
		        Alloy.Globals.openWindow(Alloy.createController('winWebviewActiveSession', {title:"logout"}).getView());
			}
		 });*/
	}
}

function openHelp(){
	pushEffect($.labelHelp);
	if (Alloy.Globals.currentWindow == "winHelp")
		return;
	
	if (Ti.Network.online)
		Alloy.Globals.openWindow(Alloy.createController('winAppHelp').getView());
	else
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Ti.App.fireEvent("showInternetToast");
}

function emailCallBack() {}

function openAppShare(){
	pushEffect($.labelShare);	
try {
	var opts = {
		cancel : -1,
		options : [Alloy.Globals.selectedLanguage.facebook, Alloy.Globals.selectedLanguage.twitter, Alloy.Globals.selectedLanguage.shareEmail, Alloy.Globals.selectedLanguage.whatsApp, Alloy.Globals.selectedLanguage.cancel],
		selectedIndex : 4,
		destructive : 4,
		title : Alloy.Globals.selectedLanguage.share
	};
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener("click", function(e) {
		if (Ti.Network.online) {
			Alloy.Globals.isReturnFromSocial = true;
			if (e.index == 0) {
				// var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "images/iPhoneImages/imgDepartmentLogo.png");
				// var blob = f.read();
				var fbObj = {
					messageBody : Alloy.Globals.selectedLanguage.downloadApp + "\nhttps://itunes.apple.com/us/app/smartuaq/id1063110068?ls=1&mt=8",
					caption : Alloy.Globals.selectedLanguage.shareData,
					picture : "http://is1.mzstatic.com/image/thumb/Purple5/v4/94/e4/47/94e44717-0544-8230-3e36-dad097d53d38/source/1200x630bf.jpg",
					// picture:blob,
					contentLink : "https://itunes.apple.com/us/app/smartuaq/id1063110068?ls=1&mt=8"
				};
				utilities.facebookShare(Alloy.Globals.selectedLanguage.fbShare, fbObj, function() {
				});
			} else if (e.index == 1) {
				Ti.API.info('twitter');
				Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
				utilities.shareOnTwitter(Alloy.Globals.selectedLanguage.twitterShare, "https://itunes.apple.com/us/app/smartuaq/id1063110068?ls=1&mt=8", function(response) {
					if (response == true) {
						Alloy.Globals.hideLoading();
						utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.shareTwitterSuccess);
					} else if (response == false) {
						Alloy.Globals.hideLoading();
						utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.duplicateMessage);
					} else if (response == null) {
						Alloy.Globals.hideLoading();
						utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.shareTwitterFail);
					}
				});
			} else if (e.index == 2) {
				utilities.sendMail("", Alloy.Globals.selectedLanguage.downloadApp, "https://itunes.apple.com/us/app/smartuaq/id1063110068?ls=1&mt=8", emailCallBack);
			} else if (e.index == 3) {
				if (OS_IOS) {
					var url = encodeURIComponent("https://itunes.apple.com/ae/app/smartuaq/id1063110068?mt=8").replace(/'/g,"%27").replace(/"/g,"%22");
					var whatsappUrl = 'whatsapp://send?text=' + url;
					if (Ti.Platform.canOpenURL(whatsappUrl)) {
						Ti.Platform.openURL(whatsappUrl);
			        } else {			
			            Ti.Platform.openURL("https://itunes.apple.com/ae/app/whatsapp-messenger/id310633997?mt=8");			
			        }
				} else {
					var url = "https://play.google.com/store/apps/details?id=uae.gov.uaq";
					var whatsappUrl = 'whatsapp://send?text=' + url;
					var isSuccess = Ti.Platform.openURL(whatsappUrl);
					if (!isSuccess) {
						Ti.Platform.openURL("https://play.google.com/store/apps/details?id=com.whatsapp&hl=en");
					}
				}
			}
		} else {
			//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
			Ti.App.fireEvent("showInternetToast");
			return;
		}
	});
	dialog.show();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}

}


function openProfile(){
}


function changeProfile(){
	//alert("Open Profile");
	// $.labelEdit.text =  Alloy.Globals.selectedLanguage.edit;
	
	$.labelHome.text =  Alloy.Globals.selectedLanguage.home;
	$.labelSuggestion.text =  Alloy.Globals.selectedLanguage.feedback;
	$.labelServices.text =  Alloy.Globals.selectedLanguage.myservices;
	$.labelPaymentHistory.text =  Alloy.Globals.selectedLanguage.viewMyPayment;
	$.labelHelp.text =  Alloy.Globals.selectedLanguage.help;
	$.imageViewHelp.backgroundImage = (Alloy.Globals.isEnglish?Alloy.Globals.path.iconHelp:Alloy.Globals.path.iconHelp_ar);
	$.labelShare.text =  Alloy.Globals.selectedLanguage.shareapp;
	$.labelPushNotification.text = Alloy.Globals.selectedLanguage.notification;
	$.labelMenu.text = Alloy.Globals.selectedLanguage.menuDirection;
	$.labelLanguage.text = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabic : Alloy.Globals.selectedLanguage.english;
	$.viewLangauge.language = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabicLF : Alloy.Globals.selectedLanguage.englishLF;
	
	if(Alloy.Globals.userInfo === false){
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.login;
	 
	} else {
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.logout;

	}

}

// $.labelEdit.text =  Alloy.Globals.selectedLanguage.edit;

Ti.API.info('Username is: '+Ti.App.Properties.getString("username"));
$.labelUsername.text = (Alloy.Globals.userInfo==false?Alloy.Globals.selectedLanguage.welcomeGuest:Ti.App.Properties.getString("username"));
$.labelHome.text =  Alloy.Globals.selectedLanguage.home;
$.labelSuggestion.text =  Alloy.Globals.selectedLanguage.feedback;
$.labelServices.text =  Alloy.Globals.selectedLanguage.myservices;
$.labelPaymentHistory.text =  Alloy.Globals.selectedLanguage.viewMyPayment;
$.labelHelp.text =  Alloy.Globals.selectedLanguage.help;
$.imageViewHelp.backgroundImage = (Alloy.Globals.isEnglish?Alloy.Globals.path.iconHelp:Alloy.Globals.path.iconHelp_ar);
$.labelShare.text =  Alloy.Globals.selectedLanguage.shareapp;
$.labelPushNotification.text = Alloy.Globals.selectedLanguage.notification;
$.labelMenu.text = Alloy.Globals.selectedLanguage.menuDirection;
$.labelLanguage.text = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabic : Alloy.Globals.selectedLanguage.english;
$.viewLangauge.language = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabicLF : Alloy.Globals.selectedLanguage.englishLF;

arrOptions = [Alloy.Globals.selectedLanguage.useCamera, Alloy.Globals.selectedLanguage.selectFromGallery];
	if (OS_IOS) {
		arrOptions.push(Alloy.Globals.selectedLanguage.cancel);
	}
	mediaOptionDialogLeft.options = arrOptions;

function changeLanguage(e) {
	pushEffect($.labelLanguage);
	Alloy.Globals.changeLanguage(e.source.language);
	
	// $.labelEdit.text =  Alloy.Globals.selectedLanguage.edit;
	Ti.API.info('Username is:@Function '+Ti.App.Properties.getString("username"));
	$.labelUsername.text = (Alloy.Globals.userInfo==false?Alloy.Globals.selectedLanguage.welcomeGuest:Ti.App.Properties.getString("username"));
	$.labelHome.text =  Alloy.Globals.selectedLanguage.home;
	$.labelSuggestion.text =  Alloy.Globals.selectedLanguage.feedback;
	$.labelServices.text =  Alloy.Globals.selectedLanguage.myservices;
	$.labelPaymentHistory.text =  Alloy.Globals.selectedLanguage.viewMyPayment;
	$.labelHelp.text =  Alloy.Globals.selectedLanguage.help;
	$.imageViewHelp.backgroundImage = (Alloy.Globals.isEnglish?Alloy.Globals.path.iconHelp:Alloy.Globals.path.iconHelp_ar);
	$.labelShare.text =  Alloy.Globals.selectedLanguage.shareapp;
	$.labelPushNotification.text = Alloy.Globals.selectedLanguage.notification;
	$.labelMenu.text = Alloy.Globals.selectedLanguage.menuDirection;
	$.labelLanguage.text = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabic : Alloy.Globals.selectedLanguage.english;
	$.viewLangauge.language = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabicLF : Alloy.Globals.selectedLanguage.englishLF;
	
	if(Alloy.Globals.userInfo === false){
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.login;
	 
	} else {
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.logout;

	}
	$.viewLeftPanel.changeLanguage();
	if (Ti.Network.online == false) {
		Ti.App.fireEvent("showInternetToast");	
	}
}

exports.changeLangLeft = function() {
	// $.labelEdit.text =  Alloy.Globals.selectedLanguage.edit;
	Ti.API.info('Username is:@Change Lang. Left '+Ti.App.Properties.getString("username"));
	$.labelUsername.text = (Alloy.Globals.userInfo==false?Alloy.Globals.selectedLanguage.welcomeGuest:Ti.App.Properties.getString("username"));
	$.labelHome.text =  Alloy.Globals.selectedLanguage.home;
	$.labelSuggestion.text =  Alloy.Globals.selectedLanguage.feedback;
	$.labelServices.text =  Alloy.Globals.selectedLanguage.myservices;
	$.labelPaymentHistory.text =  Alloy.Globals.selectedLanguage.viewMyPayment;
	$.labelHelp.text =  Alloy.Globals.selectedLanguage.help;
	$.imageViewHelp.backgroundImage = (Alloy.Globals.isEnglish?Alloy.Globals.path.iconHelp:Alloy.Globals.path.iconHelp_ar);
	$.labelShare.text =  Alloy.Globals.selectedLanguage.shareapp;
	$.labelPushNotification.text = Alloy.Globals.selectedLanguage.notification;
	$.labelMenu.text = Alloy.Globals.selectedLanguage.menuDirection;
	$.labelLanguage.text = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabic : Alloy.Globals.selectedLanguage.english;
	$.viewLangauge.language = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabicLF : Alloy.Globals.selectedLanguage.englishLF;
	if(Alloy.Globals.userInfo === false){
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.login;
	 
	} else {
	 $.labelLogout.text = Alloy.Globals.selectedLanguage.logout;

	}
	//arrOptions = [Alloy.Globals.selectedLanguage.useCamera, Alloy.Globals.selectedLanguage.selectFromGallery];
	//if (OS_IOS) {
		//arrOptions.push(Alloy.Globals.selectedLanguage.cancel);
	//}
	//mediaOptionDialogLeft.options = arrOptions;
};

exports.setLanguage = function() {
	$.labelLanguage.text = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabic : Alloy.Globals.selectedLanguage.english;
	$.viewLangauge.language = (Alloy.Globals.isEnglish) ? Alloy.Globals.selectedLanguage.arabicLF : Alloy.Globals.selectedLanguage.englishLF;

	$.labelMenuDirection.text = Alloy.Globals.selectedLanguage.left;
	$.labelNotification.text = Alloy.Globals.selectedLanguage.on;	
};

function openMySuggestion() {
	pushEffect($.labelSuggestion);
	Ti.API.info('Alloy.Globals.currentWindow == ' + Alloy.Globals.currentWindow);
	if (Ti.Network.online == false) {
		Ti.App.fireEvent("showInternetToast");
		return;	
	}
	if (Alloy.Globals.currentWindow == "winFeedback") {
		return;
	}
	Alloy.Globals.openWindow(Alloy.createController("Feedback/winFeedback").getView());
}

function openMyServices() {
	pushEffect($.labelServices);
	
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Ti.App.fireEvent("showInternetToast");
		return;
	}
	Ti.API.info('Current window before open is: '+Alloy.Globals.currentWindow);
	if (Alloy.Globals.currentWindow == "winMyServices") {
		return;
	}
	//getPostPaymentService
	//httpManager.getPostPaymentService(function(response) {
	    //Ti.API.info('http manager responce borkn paymnet'+ response);
	    //httpManager.getMyRequestService(function(response) {
			//if(response == null)
				//return;
			// response ="";
			
			var data = {"response":"", "idToExpand":"", "isNoRecord":"" , url : "" };
	     	Alloy.Globals.openWindow(Alloy.createController("Services/MyServices/winMyServices", data).getView());
	     	Ti.API.info('Alloy.Globals.currentWindow == ' + Alloy.Globals.currentWindow);
	     	Ti.API.info('MY REQ. is about to open...');
       // });
	//});	
	
}

var menuDirectionCallback = undefined;
exports.setMenuDirectionView = function(obj) {
	menuDirectionCallback = obj.menuCallback;
	if (obj.direction == "left") {
		$.viewDirection.isLeft = false;
	} else {
		$.viewDirection.isLeft = true;
	}
	changeMenuDirection();

	if (Alloy.Globals.pushEnabled) {
		$.viewNotification.isOn = false;
	} else {
		$.viewNotification.isOn = true;
	}
	setNotification(false);

};



var hideLeftPanel = Ti.UI.createAnimation({
	right : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	//	transform : Ti.UI.create2DMatrix().scale(0.9, 0.80),
	duration : 400,
});



function onHome() {
	pushEffect($.labelHome);
	Ti.API.info('MENU CLICK === ');
	Alloy.Globals.gotoHome();

	try {
		$.viewLeftPanel.closeLeftPanel();
	} catch(e) {
		//alert('Error');
	} //alert("close"+Alloy.Globals.currentWindow);
	if(Alloy.Globals.currentWindow == "winSuggestions" || Alloy.Globals.currentWindow == "winMyServices")
	{  
		//$.viewLeftPanel.changeLanguage();
		Ti.App.fireEvent('slideMenu', {
            name: 'slidemenuevetn'
        });
    }

}
exports.onHome = onHome;

function doAutomaticUserLogout(screenFrom){
	Ti.API.info('is web session expired?? :'+Alloy.Globals.isWebSessionExpired);
	if (Alloy.Globals.isWebSessionExpired == true){
		$.viewBottom.top="-10%";
		//hide the myrequest menu
		$.labelLogout.text = Alloy.Globals.selectedLanguage.login;
		$.viewServices.width = 0;
		$.viewServices.height = 0;
		$.hideLineService.width = 0;
		$.hideLineService.height = 0;
		//hide the payment history menu
		$.viewPaymentHistory.width = 0;
		$.viewPaymentHistory.height = 0;
		//changeProfile();
		$.labelLogout.text = Alloy.Globals.selectedLanguage.login;
		$.labelUsername.text = Alloy.Globals.selectedLanguage.welcomeGuest;
	    Alloy.Globals.userInfo = false;
	    Ti.App.Properties.setString("username", null);
	    Ti.App.Properties.setString("password", null);
	    Alloy.Globals.isWebSessionExpired = true;
	    Ti.API.info('Performed user logout becoz of session expired from web.');
	    if (screenFrom == "home"){
	    	Alloy.Globals.isWebSessionExpired = false;
	    }
	    else{
	    	Alloy.Globals.isWebSessionExpired = true;
	    }
	}
	else{
		
	}
}
exports.doAutomaticUserLogout = doAutomaticUserLogout;

/*
function AddImageToViewLeftPanel(e) {
	var selected_Image = e.media; //

	var heightOfImage = selected_Image.height;
	var widthOfImage = selected_Image.width;

	var newHeight = 500;
	
	try {
		if (heightOfImage > newHeight) {
			selected_Image.imageAsResized(400, 480);
		}
		$.imageViewProfile.image = "";
		//alert("iamge"+JSON.stringify(selected_Image));
        $.imageViewProfile.image = selected_Image;
        //alert(JSON.stringify($.imageViewProfile.image));
	} catch(ex) {
		Ti.API.info('Exception: ' + ex);
	}
}
// This is open camera and attached capture image
function showCameraLeftPanel(arg) {

	try {
		var success = true;
		
		if (success) {
			Titanium.Media.showCamera({
				success : AddImageToViewLeftPanel,
				cancel : function() {
					Ti.API.info(' Cancelled ');
				},
				error : function(error) {
					if (error.code == 2) {
						//Alloy.Globals.ShowAlert(Alloy.Globals.selectedLanguage.attachMedia, Alloy.Globals.selectedLanguage.cameraNotAvail);
						alert("NO Camera");
					}
				},
				allowEditing : true,
				saveToPhotoGallery : true,
				mediaTypes : arrMediaTypes,
			});
		} else {
			Alloy.Globals.ShowAlert(Alloy.Globals.selectedLanguage.camera, Alloy.Globals.selectedLanguage.cameraNotAccess);
		}
	} catch(ex) {
	}

}

// This function is open device gallery for select image to attached
function choosePhotoGalleryLeftPanel(arg) {
	try {
		Titanium.Media.openPhotoGallery({
			success : AddImageToViewLeftPanel, // end of success block
			cancel : function() {
				Ti.API.info(' Cancelled ');
			},
			error : function(error) {
				Ti.API.info(' An error occurred!! ');
			},
			allowEditing : true,
			mediaTypes : arrMediaTypes,

		});
	} catch(ex) {
	}

}
function AttachImageProfile(){ //alert("test");
	mediaOptionDialogLeft.show();
}
*/
function changeMenuDirection(e) {
	var direction;
	if ($.viewDirection.isLeft) {
		$.viewDirection.backgroundImage = Alloy.Globals.path.switchLeft;
		$.labelMenuDirection.left = undefined; 
		$.labelMenuDirection.right = 6;
		$.labelMenuDirection.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;

		$.labelMenuDirection.text = Alloy.Globals.selectedLanguage.right;
		direction = "right";
		Ti.App.Properties.setString("isMenuDirection", direction);
	} else {
		$.viewDirection.backgroundImage = Alloy.Globals.path.switchRight;
		$.labelMenuDirection.left = 6;
		$.labelMenuDirection.right = undefined;
		$.labelMenuDirection.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;

		$.labelMenuDirection.text = Alloy.Globals.selectedLanguage.left;
		direction = "left";
		Ti.App.Properties.setString("isMenuDirection", direction);

	}
	
	Alloy.Globals.SelectedMenuDirection = direction;
	
	if (menuDirectionCallback != undefined) {
		menuDirectionCallback(direction);
	}
	
	$.viewDirection.isLeft = !$.viewDirection.isLeft;
}

if (Alloy.Globals.SelectedMenuDirection == "left") {
	$.viewDirection.isLeft = false;
} else {
	$.viewDirection.isLeft = true;
}
changeMenuDirection();

function setNotification(e) {
	if ($.viewNotification.isOn) {
		$.viewNotification.backgroundImage = Alloy.Globals.path.switchLeft;
		$.labelNotification.left = undefined;
		$.labelNotification.right = 9;
		$.labelNotification.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
		$.labelNotification.text = Alloy.Globals.selectedLanguage.off;
		Alloy.Globals.pushEnabled = false;
		Ti.App.Properties.setBool('isPushEnabled',false);
		
	} else {
		$.viewNotification.backgroundImage = Alloy.Globals.path.switchRight;
		$.labelNotification.left = 9;
		$.labelNotification.right = undefined;
		$.labelNotification.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
		$.labelNotification.text = Alloy.Globals.selectedLanguage.on;
		Alloy.Globals.pushEnabled = true;
		Ti.App.Properties.setBool('isPushEnabled',true);
	}
	$.viewNotification.isOn = !$.viewNotification.isOn;
	
	Ti.API.info(' e VALUE  : '+e);
	
	if (e==false)
		return;
	else{
		Ti.API.info('CHECK VALUE FOR :::::::: Alloy.Globals.pushEnabled: '+Alloy.Globals.pushEnabled +'   &  $.viewNotification.isOn : '+ $.viewNotification.isOn);
		
		httpManager.updateNotificationSetting(Alloy.Globals.pushEnabled, function(response){
			Ti.API.info(' RESPONSE RESULT ::: (PUSH - TOGGLE) :: '+JSON.stringify(response));
			if(response.status=="success"){
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, (Alloy.Globals.pushEnabled==true?Alloy.Globals.selectedLanguage.push_subscribe_success:Alloy.Globals.selectedLanguage.push_unsubscribe_success), null);
			}
			else{
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, (Alloy.Globals.pushEnabled==true?Alloy.Globals.selectedLanguage.push_subscribe_success:Alloy.Globals.selectedLanguage.push_unsubscribe_success), null);
			}
		});
	}
}

if (Alloy.Globals.pushEnabled) {
	$.viewNotification.isOn = false;
} else {
	$.viewNotification.isOn = true;
}

setNotification(false);