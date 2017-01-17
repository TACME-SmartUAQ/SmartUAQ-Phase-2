var args = arguments[0] || {};
var utilities = require("utilities");
var mapModule = require('ti.map');
var preLang = null;

// $.viewNavigationTools.viewMenu.width = 0;
// $.viewNavigationTools.viewMenu.height = 0;
function changeLanguage() {
	try {
		if (preLang == Alloy.Globals.language) {
			return;
		}
		preLang = Alloy.Globals.language;
		$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();

		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.contactUs;
		$.labelTitle.text = Alloy.Globals.selectedLanguage.deptUAQ;
		$.labelWorkingHour.text = Alloy.Globals.selectedLanguage.workingHour + ":";
		$.labelRamadanHour.text = Alloy.Globals.selectedLanguage.ramadan + ":";
		$.labelContactUs.text = Alloy.Globals.selectedLanguage.contactUs + ":";

		$.labelWorkingHourValue.text = "From 7:00 AM to 2:00 PM";
		$.labelRamadanHourValue.text = "From 9:00 AM to 2:00 PM";
		$.labelPhoneNumber.text = "067641000";
		$.labelFaxNumber.text = "067641777";
		$.labelMail.text = "info@uaqgov.ae";
		$.labelWeb.text = "www.uaq.ae/ar/home.html";
		$.labelFacebook.text = "www.facebook.com/Um-Al-Quwain-EGov-292347434296161/timeline";
		$.labelTwitter.text = "www.twitter.com/uaq_egov";

		if (Alloy.Globals.isEnglish) {
			$.labelFacebook.left = 30;
			$.labelFacebook.right = undefined;
			$.labelFacebook.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
			$.labelTitle.left = 0;
			$.labelTitle.right = undefined;
			$.labelWorkingHour.left = 15;
			$.labelWorkingHour.right = undefined;
			$.labelRamadanHour.left = 15;
			$.labelRamadanHour.right = undefined;
			$.labelContactUs.left = 15;
			$.labelContactUs.right = undefined;
			$.labelPhoneNumber.left = 30;
			$.labelPhoneNumber.right = undefined;
			$.labelFaxNumber.left = 30;
			$.labelFaxNumber.right = undefined;
			$.labelMail.left = 30;
			$.labelMail.right = undefined;
			$.labelWeb.left = 30;
			$.labelWeb.right = undefined;
			$.labelTwitter.left = 30;
			$.labelTwitter.right = undefined;
			$.imageviewWeb.left = 0;
			$.imageviewWeb.right = undefined;
			$.imageviewPhone.left = 0;
			$.imageviewPhone.right = undefined;
			$.imageviewFax.left = 0;
			$.imageviewFax.right = undefined;
			$.imageviewMail.left = 0;
			$.imageviewMail.right = undefined;
			$.imageviewFacebook.left = 0;
			$.imageviewFacebook.right = undefined;
			$.imageviewTwitter.left = 0;
			$.imageviewTwitter.right = undefined;
		} else {
			$.labelFacebook.left = undefined;
			$.labelFacebook.right = 30;
			$.labelFacebook.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
			$.labelTitle.left = undefined;
			$.labelTitle.right = 0;
			$.labelWorkingHour.left = undefined;
			$.labelWorkingHour.right = 15;
			$.labelRamadanHour.left = undefined;
			$.labelRamadanHour.right = 15;
			$.labelContactUs.left = undefined;
			$.labelContactUs.right = 15;
			$.labelPhoneNumber.left = undefined;
			$.labelPhoneNumber.right = 30;
			$.labelFaxNumber.left = undefined;
			$.labelFaxNumber.right = 30;
			$.labelMail.left = undefined;
			$.labelMail.right = 30;
			$.labelWeb.left = undefined;
			$.labelWeb.right = 30;
			$.labelTwitter.left = undefined;
			$.labelTwitter.right = 30;
			$.imageviewWeb.left = undefined;
			$.imageviewWeb.right = 0;
			$.imageviewPhone.left = undefined;
			$.imageviewPhone.right = 0;
			$.imageviewFax.left = undefined;
			$.imageviewFax.right = 0;
			$.imageviewMail.left = undefined;
			$.imageviewMail.right = 0;
			$.imageviewFacebook.left = undefined;
			$.imageviewFacebook.right = 0;
			$.imageviewTwitter.left = undefined;
			$.imageviewTwitter.right = 0;
		}
		Ti.API.info('Error ' + e.message);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function mapClicked() {
	try {
		if (Ti.Network.online) {
			if (OS_IOS) {
				Ti.Platform.openURL('Maps://http://maps.google.com/maps?q=25.572547,55.566583');
			} else {
				Ti.Platform.openURL('http://maps.google.com/maps?q=25.572547,55.566583');
			}
		} else {
			alert(L("No Internet Connection"));
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function winOpen() {
	try {
		// Alloy.Globals.manageEservicesNotification();
		Alloy.Globals.arrWindows.push($.winContactUs);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewLeftPanel.getView().changeLanguage = changeLanguage;
		//$.viewBottomMenu.getView().viewBack = $.backView;
		//$.viewShareOption.setColoredIcon("red");
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
		var annotation = mapModule.createAnnotation({
			latitude : 25.572547,
			longitude : 55.566583,
			title : Alloy.Globals.selectedLanguage.govtUAQ,
			subtitle : Alloy.Globals.selectedLanguage.deptUAQ,
			pincolor : mapModule.ANNOTATION_RED
		});
		$.mapview.addAnnotations([annotation]);

		$.mapview.region = {
			latitudeDelta : 0.12,
			longitudeDelta : 0.12,
			latitude : 25.572547,
			longitude : 55.566583,
		};
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	try {
		Alloy.Globals.bottomMenu = $.backView;
		$.viewBottomMenu.addInnerMenu();
		Alloy.Globals.currentWindow = e.source.id;
		changeLanguage();

		$.viewLeftPanel.setMenuDirectionView({
			direction : Alloy.Globals.SelectedMenuDirection,
			menuCallback : undefined
		});
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}

}

function closeWindow() {
	try {
		if (args.isFromMenu) {
			Alloy.Globals.gotoHome();
			return;
		}
		Alloy.Globals.arrWindows.pop($.winContactUs);
		$.winContactUs.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

/*
 * Ravindra Changes
 */

function contactUAQ() {
	try {
		var device = Ti.Platform.model;
		device = device.substr(0, 4);
		if (device === "iPod") {
			var dialog = Ti.UI.createAlertDialog({
				ok : 0,
				title : Alloy.Globals.selectedLanguage.appTitle,
				message : Alloy.Globals.selectedLanguage.notAvailable,
				buttonNames : [Alloy.Globals.selectedLanguage.ok]
			});

			dialog.show();
		} else {
			utilities.makeCall($.labelPhoneNumber.text);
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function emailCallBack() {

}

function mailUAQ() {
	try{
		utilities.sendMail($.labelMail.text, Alloy.Globals.selectedLanguage.contactInfo, "", emailCallBack);		
	}catch(e){
		Ti.API.info('Error ' + e.message);
	}
}

function openWebsite() {
	try{
		utilities.openWebsite($.labelWeb.text,  "contact");		
	}catch(e){
		Ti.API.info('Error ' + e.message);
	}
}

function openFaceBook() {
	utilities.openWebsite($.labelFacebook.text, "contact");
}

function openTwitter() {
	utilities.openWebsite($.labelTwitter.text, "contact");
}

// changeLanguage();