var utilities = require("utilities");
var dbManager = require("dbUtility");
var mapModule = require('ti.map');
var args = arguments[0] || {};
var preLang = null;
var serviceId = null;
//$.viewNavigationTools.viewMenu.width = 0;
//$.viewNavigationTools.viewMenu.height = 0;

function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	$.viewLeftPanel.setLanguage();
	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();

	if (serviceId) {
		if (serviceId == "none") {
			$.winDepartmentDetail.close();
		} else {
			httpManager.getDeptDetails(function(response) {
				if (response == null)
					return;
				Alloy.Globals.hideLoading();
				args = response;
				getDepartmentDetails();
			}, serviceId);
		}

	} else {
		getDepartmentDetails();
	}
}

function getDepartmentDetails() {
	if (args.translatedAssetId == "") {
		serviceId = "none";
	} else {
		serviceId = args.translatedAssetId;
	}
	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.departments;
	$.labelTitle.text = (Alloy.Globals.isEnglish) ? args.departmentNameEN.toUpperCase() : args.departmentNameAR;
	$.labelTitle.font = Alloy.Globals.path.font14Bold;

	$.labelWorkingHour.text = Alloy.Globals.selectedLanguage.workingHour + ":";
	$.labelRamadanWorkingHour.text = Alloy.Globals.selectedLanguage.ramadan + ":";

	$.labelContactUs.text = Alloy.Globals.selectedLanguage.contactUs + "";

	$.labelWorkingHourValue.text = args.timings;
	$.labelRamadanWorkingHourValue.text = args.ramadanTimings;

	$.labelPhoneNumber.text = args.telephoneNumber;
	$.labelFaxNumber.text = args.fax;
	$.labelMail.text = args.emailID;
	$.labelWeb.text = args.website;
	$.labelFacebook.text = args.facebookContact;
	$.labelTwitter.text = args.twitterContact;

	if ($.labelPhoneNumber.text == "") {
		$.viewPhoneNumber.height = 0;
		$.viewPhoneNumber.top = 0;
	}
	if ($.labelFaxNumber.text == "") {
		$.viewFaxNumber.height = 0;
		$.viewFaxNumber.top = 0;
	}
	if ($.labelMail.text == "") {
		$.viewMail.height = 0;
		$.viewMail.top = 0;
	}
	if ($.labelWeb.text == "") {
		$.viewWeb.height = 0;
		$.viewWeb.top = 0;
	}
	if ($.labelFacebook.text == "") {
		$.viewFacebook.height = 0;
		$.viewFacebook.top = 0;
	}
	if ($.labelTwitter.text == "") {
		$.viewTwitter.height = 0;
		$.viewTwitter.top = 0;
	}

	if (Alloy.Globals.isEnglish) {
		$.labelFacebook.left = 30;
		$.labelFacebook.right = undefined;
		$.labelFacebook.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		$.labelTitle.left = 0;
		$.labelTitle.right = 85;
		$.labelWorkingHour.left = 15;
		$.labelWorkingHour.right = undefined;
		$.labelRamadanWorkingHour.left = 15;
		$.labelRamadanWorkingHour.right = undefined;
		$.labelWorkingHourValue.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		$.labelRamadanWorkingHourValue.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
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
		$.viewShareOption.getView().right = 0;
		$.viewShareOption.getView().left = undefined;
	} else {
		$.labelWorkingHourValue.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		$.labelRamadanWorkingHourValue.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		$.labelFacebook.left = undefined;
		$.labelFacebook.right = 30;
		$.labelFacebook.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		$.labelTitle.left = 85;
		$.labelTitle.right = 0;
		$.labelWorkingHour.left = undefined;
		$.labelWorkingHour.right = 15;
		$.labelRamadanWorkingHour.left = undefined;
		$.labelRamadanWorkingHour.right = 15;
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
		$.viewShareOption.getView().right = undefined;
		$.viewShareOption.getView().left = 0;
	}

	shareSocialData(args);
}

function shareSocialData(data) {
	try {
		var fbObj = {
			messageBody : (Alloy.Globals.isEnglish) ? data.departmentNameEN : data.departmentNameAR,
			caption : Alloy.Globals.selectedLanguage.shareData,
			picture : data.images ? Alloy.Globals.webserviceUrl + data.images.teaserImage : "",
			contentLink : (data.externalLink) ? data.externalLink : ""
		};

		var EnglishId,
		    ArabicId;
		    
		if (Alloy.Globals.isEnglish) {
			EnglishId = (data.id != undefined)?data.id : "-";
			ArabicId = (data.translatedAssetId != undefined)?data.translatedAssetId : "-";
		} else {
			EnglishId = (data.translatedAssetId != undefined)?data.translatedAssetId : "-";
			ArabicId = (data.id != undefined)?data.id : "-";
		}

		var subject = (Alloy.Globals.isEnglish) ? data.departmentNameEN.toUpperCase() : data.departmentNameAR;
		var twitterLink = "";
		twitterLink = 'Department Name :' + subject + "\n";
		twitterLink = twitterLink + 'Working Hours :' + data.timings + "\n";
		twitterLink = twitterLink + 'Ramadan Hours :' + data.ramadanTimings + "\n";
		twitterLink = twitterLink + 'Phone :' + data.telephoneNumber + "\n";
		twitterLink = twitterLink + 'Fax :' + data.fax + "\n";
		twitterLink = twitterLink + 'Email :' + data.emailID + "\n";
		twitterLink = twitterLink + 'Website :' + data.website + "\n";
		twitterLink = twitterLink + 'Facebook Contact :' + data.facebookContact + "\n";
		twitterLink = twitterLink + 'Twitter Contact :' + data.twitterContact;

		$.viewShareOption.setColoredIcon("red", Alloy.Globals.selectedLanguage.generic, 0, EnglishId, ArabicId, Alloy.Globals.selectedLanguage.department, 5, fbObj, twitterLink, subject);

		var idCount;
		dbManager.retrieveData(5, "", function(response) {
			Ti.API.info('response ' + response);
			idCount = response;
		});

		for (var i = 0; i < idCount.length; i++) {
			if (idCount[i].category_id == EnglishId || idCount[i].category_id == ArabicId) {
				$.viewShareOption.setFavouriteIcon();
			}
		}
		dbManager.closeDatabase();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function mapClicked() {
	if (Ti.Network.online) {
		if (OS_IOS) {
			Ti.Platform.openURL("Maps://http://maps.google.com/maps?q=args." + args.latitude + "," + args.longitude);
		} else {
			Ti.Platform.openURL("http://maps.google.com/maps?q=" + args.latitude + "," + args.longitude);
		}
	} else {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
	}
}

function winOpen() {
	// Alloy.Globals.manageEservicesNotification();
	var language = Alloy.Globals.language;
	Alloy.Globals.arrWindows.push($.winDepartmentDetail);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;

	var annotation = mapModule.createAnnotation({
		latitude : args.latitude,
		longitude : args.longitude,
		title : " ",
		subtitle : (Alloy.Globals.isEnglish) ? args.departmentNameEN.toUpperCase() : args.departmentNameAR,
		pincolor : mapModule.ANNOTATION_RED
	});
	$.mapview.addAnnotations([annotation]);

	$.mapview.region = {
		latitudeDelta : 0.12,
		longitudeDelta : 0.12,
		latitude : args.latitude,
		longitude : args.longitude,
	};
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	$.viewBottomMenu.addInnerMenu();
	Alloy.Globals.bottomMenu = $.backView;
	Alloy.Globals.currentWindow = e.source.id;
	shareSocialData(args);
	changeLanguage();
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	Alloy.Globals.hideLoaderWhileReturnBackToApp();
}

function closeWindow() {
	Alloy.Globals.arrWindows.pop($.winDepartmentDetail);
	$.winDepartmentDetail.close();
}

function contactUAQ() {
	utilities.makeCall($.labelPhoneNumber.text);
}

function emailCallBack() {

}

function mailUAQ() {
	utilities.sendMail($.labelMail.text, Alloy.Globals.selectedLanguage.contactInfo, "", emailCallBack);
}

function openWebsite() {
	utilities.openWebsite($.labelWeb.text, "dept");
}

function openFaceBook() {
	utilities.openWebsite($.labelFacebook.text, "dept");
}

function openTwitter() {
	utilities.openWebsite($.labelTwitter.text, "dept");
}

changeLanguage();
