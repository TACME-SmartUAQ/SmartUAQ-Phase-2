var utilities = require("utilities");
var mapModule = require('ti.map');
var args = arguments[0] || {};
var dbManager = require("dbUtility");
var alignment;
var preLang = null;
var location;
var translateId = null;
// $.viewNavigationTools.viewMenu.width = 0;
// $.viewNavigationTools.viewMenu.height = 0;
function changeLanguage() {
	try {
		if (preLang == Alloy.Globals.language) {
			return;
		}

		preLang = Alloy.Globals.language;

		if (Ti.Network.online==false){
			Alloy.Globals.showInternetMsg($.winEventsDetail);
			return;
		}
	
		if (translateId) {
			if (translateId == "none") {
				$.winEventsDetail.close();
			} else {
				httpManager.getEventDetails(function(response) {
					if (response == null) {
						return;
					}
					args = response;
					bindEventDetails();
				}, translateId);
			}
		} else {
			bindEventDetails();
		}

	} catch(e) {
		Ti.API.info('ERROR :' + e.message);
	}
}

function bindEventDetails() {
	try {
		if (args.translatedAssetId == "" || args.translatedAssetId == null) {
			translateId = "none";
		} else {
			translateId = args.translatedAssetId;
		}

		var imageObject = null;

		if (args.images) {
			imageObject = JSON.parse(JSON.stringify(args.images)).teaserImage;
		}

		$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();
		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.events;
		$.labelTitle.text = args.title;
		var openingDate = getMonthName(args.openingDate);
		var endDate = getMonthName(args.endDate);
		$.labelDate.text = openingDate + ' - ' + endDate;
		var details = (args.body).replace(/\r?\n/g, "");
		if (OS_IOS) {
			$.eventsWebView.html = "<html><head><style>body {font-family: Helvetica;font-size:16;}</style></head><body text=\"white\">" + details + "<br><br>" + " " + "</body></html>";
		} else if (OS_ANDROID) {
			$.eventsWebView.html = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head><style>body {font-family: Helvetica;font-size:16;}</style></head><body text=\"white\">" + details + "<br><br>" + " " + "</body></html>";
		}

		$.imageviewEvents.image = Alloy.Globals.sitesUrl + imageObject;


		if (Alloy.Globals.isEnglish) {
			$.imageviewLocationIcon.left = $.imageviewDateIcon.left = 0;
			$.imageviewLocationIcon.right = $.imageviewDateIcon.right = undefined;
			$.labelLocation.left = $.labelDate.left = 33;
			$.labelLocation.right = $.labelDate.right = 0;
			$.viewShareOption.getView().right = 0;
			$.viewShareOption.getView().left = undefined;
			$.labelDate.left = 33;
			$.labelDate.right = undefined;
			// $.labelDetail.left = 0;
			// $.labelDetail.right = undefined;
			alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		} else {
			$.imageviewLocationIcon.left = $.imageviewDateIcon.left = undefined;
			$.imageviewLocationIcon.right = $.imageviewDateIcon.right = 0;
			$.labelLocation.left = $.labelDate.left = 0;
			$.labelLocation.right = $.labelDate.right = 33;
			$.viewShareOption.getView().right = undefined;
			$.viewShareOption.getView().left = 0;
			$.labelDate.left = undefined;
			$.labelDate.right = 33;
			// $.labelDetail.left = undefined;
			// $.labelDetail.right = 0;
			alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		}

		$.labelTitle.textAlign = $.labelLocation.textAlign = $.labelDate.textAlign = alignment;

		utilities.reverseGeocodingNew(args.latitude, args.longitude, function(response) {
			if (response == null)
				return;
			var result = (response.results[1].address).split('-');
			$.labelLocation.text = result[0];
		});

		shareSocialData(args);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function shareSocialData(data) {
	try {
		var fbObj = {
			messageBody : utilities.cleanHtml(data.body),
			caption : Alloy.Globals.selectedLanguage.shareData,
			picture : data.images ? Alloy.Globals.webserviceUrl + JSON.parse(JSON.stringify(data.images)).teaserImage : "",
			contentLink : (data.externalLink) ? data.externalLink : ""
		};

		var twitterLink = utilities.cleanHtml(data.body);
		var subject = data.title;
		var language = Alloy.Globals.language;

		if (OS_IOS) {
			$.eventsWebView.width = Ti.Platform.displayCaps.platformWidth - 10;
		} else if (OS_ANDROID) {
			$.eventsWebView.width = 350;
		}

		var EnglishId,
		    ArabicId;

		if (Alloy.Globals.isEnglish) {
			EnglishId = (data.id != undefined)?data.id : "-";
			ArabicId =  (data.translatedAssetId != undefined)?data.translatedAssetId : "-";
		} else {
			EnglishId = (data.translatedAssetId != undefined)?data.translatedAssetId : "-";
			ArabicId =  (data.id != undefined)?data.id : "-";
		}

		$.viewShareOption.setColoredIcon("white", Alloy.Globals.selectedLanguage.events, 2, EnglishId, ArabicId, "", "", fbObj, twitterLink, subject);

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

function winOpen() {
	try {
		// Alloy.Globals.manageEservicesNotification();
		Alloy.Globals.arrWindows.push($.winEventsDetail);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewLeftPanel.getView().changeLanguage = changeLanguage;
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function getMonthName(date) {
	try {
		var newDate = date.split('/');
		var dateModified;
		switch(newDate[1]) {
		case '01' :
			dateModified = newDate[0] + ' Jan ' + newDate[2];
			break;

		case '02' :
			dateModified = newDate[0] + ' Feb ' + newDate[2];
			break;

		case '03' :
			dateModified = newDate[0] + ' Mar ' + newDate[2];
			break;

		case '04' :
			dateModified = newDate[0] + ' Apr ' + newDate[2];
			break;

		case '05' :
			dateModified = newDate[0] + ' May ' + newDate[2];
			break;

		case '06' :
			dateModified = newDate[0] + ' Jun ' + newDate[2];
			break;

		case '07' :
			dateModified = newDate[0] + ' Jul ' + newDate[2];
			break;

		case '08' :
			dateModified = newDate[0] + ' Aug ' + newDate[2];
			break;

		case '09' :
			dateModified = newDate[0] + ' Sep ' + newDate[2];
			break;

		case '10' :
			dateModified = newDate[0] + ' Oct ' + newDate[2];
			break;

		case '11' :
			dateModified = newDate[0] + ' Nov ' + newDate[2];
			break;

		case '12' :
			dateModified = newDate[0] + ' Dec ' + newDate[2];
			break;
		}
		if (dateModified == undefined || dateModified == "" || dateModified == null)
			return dateModified = "";
		else
			return dateModified;
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function showMap() {
	/*try {
		if ($.labelLocation.text == "Not Available") {
			return;
		} else {
			var annotation = mapModule.createAnnotation({
				latitude : args.latitude,
				longitude : args.longitude,
				title : args.title,
				subtitle : args.teaserTitle,
				pincolor : mapModule.ANNOTATION_RED
			});
			$.mapview.addAnnotations([annotation]);

			$.mapview.region = {
				latitudeDelta : 0.12,
				longitudeDelta : 0.12,
				latitude : args.latitude,
				longitude : args.longitude,
			};

			if ($.viewMapViewBack.visible) {
				$.viewMapViewBack.animate({
					opacity : 0,
					duration : 400
				}, function() {
					$.viewMapViewBack.hide();
				});
			} else {
				$.viewMapViewBack.show();
				$.viewMapViewBack.animate({
					opacity : 1,
					duration : 400
				});
			}
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}*/
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	try {
		shareSocialData(args);
		Alloy.Globals.bottomMenu = $.backView;
		Alloy.Globals.isFavData = false;
		changeLanguage();
		$.viewBottomMenu.addInnerMenu();
		Alloy.Globals.currentWindow = e.source.id;
		$.viewLeftPanel.setMenuDirectionView({
			direction : Alloy.Globals.SelectedMenuDirection,
			menuCallback : undefined
		});

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
	Alloy.Globals.hideLoaderWhileReturnBackToApp();
}

function closeWindow() {
	try {
		Alloy.Globals.arrWindows.pop($.winEventsDetail);
		$.winEventsDetail.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}