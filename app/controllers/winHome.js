var httpManager = require("httpManager");
var dbManager = require("dbUtility");
var args = arguments[0] || {};

var menuType = args;
Alloy.Globals.SelectedMenuDirection = menuType;

var preLang = null;

var weathtypeget = "3200";

function weatherSerCall() {
	if (Ti.Network.online) {
		var wParser = require("WeatherForcastParser");
		wParser.parser(function(responce) {
			//Ti.API.info("wether text" + responce.text);
			if (responce == null) {
				return;
			}
			weathtypeget = responce.text;
			Ti.API.info(Alloy.Globals.selectedLanguage.weathtypeget + 'wther type in home page' + weathtypeget);
			$.labelDegree.text = responce.temp + "º" || "35`";
			//$.labelWeatherType.text = Alloy.Globals.selectedLanguage.weathtypeget || Alloy.Globals.selectedLanguage.weatherType;
			$.labelWeatherType.text = weathtypeget || Alloy.Globals.selectedLanguage.weathtypeget;
			$.imageViewWeather.image = responce.iconName || Alloy.Globals.path.weatherICONOCHNG;
			//$.imageViewWeather.image = Alloy.Globals.path.icnJnazah;
			
		});
	} else {
		$.labelDegree.text = "";
		$.labelWeatherType.text = "";
		$.labelLine.text = "";
		$.imageViewWeather.image = "";
	}
}

function changeLanguage() {
	
	$.viewNotification.changeLanguage();
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	$.viewLeftPanel.changeLangLeft();
	$.viewLeftPanel.setLanguage();
	$.labelWeatherCity.text = Alloy.Globals.selectedLanguage.weatherCity;
	//$.labelWeatherType.text = Alloy.Globals.selectedLanguage.weatherType;
	$.labelAbout.text = Alloy.Globals.selectedLanguage.aboutUAQ;
	$.labelNews.text = Alloy.Globals.selectedLanguage.news;
	$.labelServices.text = Alloy.Globals.selectedLanguage.services;
	$.labelEvents.text = Alloy.Globals.selectedLanguage.events;
	// $.labelFeedback.text = Alloy.Globals.selectedLanguage.feedback;
	$.labelFeedback.text = Alloy.Globals.selectedLanguage.mysuggestions;
	$.labelFuneral.text  = Alloy.Globals.selectedLanguage.funeral;
	$.labelContact.text = Alloy.Globals.selectedLanguage.contactUs;
	$.viewHappinessIndicator.changeLanguage();
	try {
		$.labelWeatherType.text = Alloy.Globals.selectedLanguage.weathtypeget || Alloy.Globals.selectedLanguage.weatherType;
	} catch(e) {
	}

	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : changeMenuDirection
	});
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
	weatherSerCall();
}

function winOpen() {
	if (OS_IOS) {
		//iPhone 6
		if (Ti.Platform.displayCaps.platformWidth >= 375 && Ti.Platform.displayCaps.platformWidth < 414) {
			$.scrollingView.top = '25%';
		}
		//iPhone 6plus 
		else if (Ti.Platform.displayCaps.platformWidth >= 414) {
			$.scrollingView.top = '30%';
		}
		//iPhone 4S 
		else if(Ti.Platform.displayCaps.platformHeight == 480){
			$.scrollingView.height = 400;
			$.viewNews.top = 55;
			$.viewServices.top = 105;
			$.viewEvents.top = 165;
			$.viewFeedback.top = 225;
			$.viewFuneral.top = 280;
			$.viewContact.top = 335;
		}
	}
	// Assign the object to global for managing badge counter
	Alloy.Globals.NotificationCounterNews = $.viewIconContainerNews;
	//$.lblNewsBadgeCounter;
	Alloy.Globals.NotificationCounterEvents = $.viewIconContainerEvents;
	//$.lblEventBadgeCounter;
	Alloy.Globals.NotificationCounterFunerals = $.viewIconContainerFunerals;
	//$.lblFuneralBadgeCounter;

	// changeLanguage(); // commented by NK becoz it's called in focus also so
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewLeftPanel.getView().win = $.mainView;
	$.viewLeftPanel.getView().closeLeftPanel = closeLeftPanel;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.labelAbout.color = Alloy.Globals.path.greenColor;
	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAboutSelected;
	$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	if (Ti.Network.online) {
		if (OS_IOS){
			if (Titanium.Geolocation.locationServicesEnabled === false) {
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.turn_on_location_service);
			} else {
				Ti.API.info('LOCATION SERVICE IS ALREDAY STARTED....');
				Titanium.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
				Titanium.Geolocation.distanceFilter = 10;
				Titanium.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
				Titanium.Geolocation.getCurrentPosition(function(e) {
					Ti.API.info('LOCATION e Obj : ' + JSON.stringify(e));
				});
			}	
		}
		else{
			var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
			if (hasLocationPermissions) {
				return Ti.API.info('You already have permission.');
			}
			Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
				Ti.API.info('Ti.Geolocation.requestLocationPermissions', e);
		
				if (e.success) {
					// Instead, probably call the same method you call if hasLocationPermissions() is true
					Ti.API.info('You granted permission.');
				} 
				else if (OS_ANDROID) {
					Ti.API.info('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');
		
				} else {
					// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
					Ti.UI.createAlertDialog({
						title: 'You denied permission.',
						// We also end up here if the NSLocationAlwaysUsageDescription is missing from tiapp.xml in which case e.error will say so
						message: e.error
					}).show();
				}
			});
		}
	}
	else{
		//showInternetToast();
		Ti.API.info('You are not connected to internet..')
		///Alloy.Globals.showInternetMsg($.winHome);
	}
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function createDatabase() {
	dbManager.createDatabase();
	dbManager.createFavouritesTable();
	dbManager.createHappinessTable();
}

function closeWindow() {
	$.winHome.close();
}

function openNewsList() {
	if (Ti.Network.online) {
		selectedView = 2;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.News : Alloy.Globals.path.News_Right;
		$.labelNews.color = Alloy.Globals.path.greenColor;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNewsSelected;

		openNewsWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
}

function openEvents() {
	if (Ti.Network.online) {
		selectedView = 4;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Events : Alloy.Globals.path.Events_Right;

		//	Ti.API.info('4');
		$.labelEvents.color = Alloy.Globals.path.greenColor;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEventsSelected;

		openEventsWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
}

function openUaqFunerals() {
	if (Ti.Network.online) {
		selectedView = 6;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Funeral : Alloy.Globals.path.Funeral_Right;

		$.labelFuneral.color = Alloy.Globals.path.greenColor;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazahSelected;

		openFuneralsWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}

}

function openDepartment() {
	if (Ti.Network.online)
		Alloy.Globals.openWindow(Alloy.createController("Department/winDepartmentDetail").getView());
	else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
}

function openSuggestion() {
	if (Ti.Network.online)
		Alloy.Globals.openWindow(Alloy.createController("Suggestion/winSuggestions").getView());
	else
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
}

function openServices() {
	if (Ti.Network.online) {
		selectedView = 3;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Services : Alloy.Globals.path.Services_Right;

		//	Ti.API.info('3');
		$.labelServices.color = Alloy.Globals.path.greenColor;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnServiceSelected;

		openServiceWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
}

function openAbout() {
	if (Ti.Network.online) {
		selectedView = 1;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.About : Alloy.Globals.path.About_Right;

		//	Ti.API.info('1');
		$.labelAbout.color = Alloy.Globals.path.greenColor;
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAboutSelected;
		openAboutWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}
}

function openFeedback() {
	if (Ti.Network.online) {
		selectedView = 5;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Feedback : Alloy.Globals.path.Feedback_Right;

		//	Ti.API.info('5');
		$.labelFeedback.color = Alloy.Globals.path.greenColor;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedbackSelected;

		openFeedbackWindow();
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	}

}

function openContactUsWin() {
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
		Alloy.Globals.showInternetMsg($.winHome);
		return;
	} 
	selectedView = 7;
	$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Contact_Us : Alloy.Globals.path.Contact_Us_Right;
	$.labelContact.color = Alloy.Globals.path.greenColor;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContactSelected;
	openContactWindow();
}

function setNotificationLabel(obj) {
	Ti.API.info(' OBJ ALL :  ' + JSON.stringify(obj));
	$.viewNavigationTools.setBadgeToEservices(obj);
}


$.viewNotification.getView().setNotificationLabel = setNotificationLabel;

//var firstTime = true;
function winFocus(e) {
	// Alloy.Globals.manageEservicesNotification();
	//Alloy.Globals.arrWindows.push($.winHome);
	Alloy.Globals.currentWindow = e.source.id;
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : changeMenuDirection
	});
	if (Ti.Network.online) {
		changeLanguage();
		if (Alloy.Globals.webserviceUrl == null || Alloy.Globals.SOAPLOOKUPServiceUrl == null) {
			httpManager.getEndPointDetails(function(response) {
				if (response == null || response == undefined || response == "") {
					Ti.API.info('EMPTY RESPOSE');
					return;
				}
				Alloy.Globals.webserviceUrl = response.infoURL;
				// Alloy.Globals.webserviceUrl = response.contentURL; // Content URL
				Alloy.Globals.SOAPLOOKUPServiceUrl = response.soaURL;
			});
		}
		
		Alloy.Globals.hideLoaderWhileReturnBackToApp();
		
		if(Alloy.Globals.isWebSessionExpired == true)
			$.viewLeftPanel.doAutomaticUserLogout("home");
		else
			Ti.API.info('No need to do automatic user logout based on web session');
			
			
	} else {
		$.labelAbout.text = Alloy.Globals.selectedLanguage.aboutUAQ;
		$.labelNews.text = Alloy.Globals.selectedLanguage.news;
		$.labelServices.text = Alloy.Globals.selectedLanguage.services;
		$.labelEvents.text = Alloy.Globals.selectedLanguage.events;
		///////// $.labelFeedback.text = Alloy.Globals.selectedLanguage.feedback;
		$.labelFeedback.text = Alloy.Globals.selectedLanguage.mysuggestions;
		$.labelFuneral.text = Alloy.Globals.selectedLanguage.funeral;
		$.labelContact.text = Alloy.Globals.selectedLanguage.contactUs;

		Alloy.Globals.showInternetMsg($.winHome);
	}
}

var selectedView;

var totalHeight = $.scrollingView.toImage().height;

$.scrollingView.addEventListener("touchmove", function(e) {
	//	Ti.API.info('touch move e===' + JSON.stringify(e));
	//	Ti.API.info('totalHeight==' + totalHeight);

	var perView = totalHeight / 7;
	var y = parseInt(e.y);
	var perViewHeight;
	//	Ti.API.info('y==' + y);
	//	Ti.API.info('perView==' + perView);
	if (OS_IOS) {
		perViewHeight = 50;
	} else if (OS_ANDROID) {
		if (Ti.Platform.displayCaps.platformWidth >= 1080) {
			perViewHeight = 80;
		} else {
			perViewHeight = 70;
		}
	}
	// Ti.API.info('perViewHeight ' + perViewHeight);

	if (y > 0 && y < perView + perViewHeight) {
		if (selectedView == 1) {
			return;
		}
		selectedView = 1;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.About : Alloy.Globals.path.About_Right;

		//	Ti.API.info('1');
		$.labelAbout.color = Alloy.Globals.path.greenColor;
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAboutSelected;

		/*Arrow Images*/

		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelNews.color = $.labelServices.color = $.labelEvents.color = $.labelFeedback.color = $.labelFuneral.color = $.labelContact.color = "white";
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView && y < perView * 2) {
		if (selectedView == 2) {
			return;
		}
		selectedView = 2;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.News : Alloy.Globals.path.News_Right;
		//	Ti.API.info('2');
		$.labelNews.color = Alloy.Globals.path.greenColor;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNewsSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelServices.color = $.labelEvents.color = $.labelFeedback.color = $.labelFuneral.color = $.labelContact.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView * 2 && y < perView * 3) {
		if (selectedView == 3) {
			return;
		}
		selectedView = 3;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Services : Alloy.Globals.path.Services_Right;

		//	Ti.API.info('3');
		$.labelServices.color = Alloy.Globals.path.greenColor;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnServiceSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelNews.color = $.labelEvents.color = $.labelFeedback.color = $.labelFuneral.color = $.labelContact.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView * 3 && y < perView * 4) {
		if (selectedView == 4) {
			return;
		}
		selectedView = 4;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Events : Alloy.Globals.path.Events_Right;

		//	Ti.API.info('4');
		$.labelEvents.color = Alloy.Globals.path.greenColor;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEventsSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelNews.color = $.labelServices.color = $.labelFeedback.color = $.labelFuneral.color = $.labelContact.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView * 4 && y < perView * 5) {
		if (selectedView == 5) {
			return;
		}
		selectedView = 5;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Feedback : Alloy.Globals.path.Feedback_Right;

		//	Ti.API.info('5');
		$.labelFeedback.color = Alloy.Globals.path.greenColor;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedbackSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelNews.color = $.labelServices.color = $.labelEvents.color = $.labelFuneral.color = $.labelContact.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView * 4.3 && y < perView * 5.3) {
		if (selectedView == 6) {
			return;
		}
		selectedView = 6;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Funeral : Alloy.Globals.path.Funeral_Right;

		//	Ti.API.info('6');
		$.labelFuneral.color = Alloy.Globals.path.greenColor;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazahSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewContactArrow.backgroundImage = " ";

		if (menuType == 'left') {
			$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelNews.color = $.labelServices.color = $.labelEvents.color = $.labelFeedback.color = $.labelContact.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	} else if (y > perView * 5.3 && y < perView * 6.3) {
		if (selectedView == 7) {
			return;
		}
		selectedView = 7;
		//$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Events : Alloy.Globals.path.Events_Right;
		$.scrollingView.backgroundImage = (menuType == "left") ? Alloy.Globals.path.Contact_Us : Alloy.Globals.path.Contact_Us_Right;
		//	Ti.API.info('7');
		$.labelContact.color = Alloy.Globals.path.greenColor;
		$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContactSelected;

		/*Arrow Images*/

		$.imageViewAboutArrow.backgroundImage = " ";
		$.imageViewNewsArrow.backgroundImage = " ";
		$.imageViewServicesArrow.backgroundImage = " ";
		$.imageViewEventsArrow.backgroundImage = " ";
		$.imageViewFeedbackArrow.backgroundImage = " ";
		$.imageViewFuneralArrow.backgroundImage = " ";
		if (menuType == 'left') {
			$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else {
			$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}

		$.labelAbout.color = $.labelNews.color = $.labelServices.color = $.labelEvents.color = $.labelFeedback.color = $.labelFuneral.color = "white";
		$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
		$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
		$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
		$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
		$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
		$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	}
});
/*function resetScaledMenus(){
	$.labelAbout.animate({transform:scaleResetMenus, duration:0});
	$.labelNews.animate({transform:scaleResetMenus, duration:0});
	$.labelServices.animate({transform:scaleResetMenus, duration:0});
	$.labelEvents.animate({transform:scaleResetMenus, duration:0});
	$.labelFeedback.animate({transform:scaleResetMenus, duration:0});
	$.labelFuneral.animate({transform:scaleResetMenus, duration:0});
	$.labelContact.animate({transform:scaleResetMenus, duration:0});
}
function scaleSelectedMenu(objNameToScale){
	objNameToScale.animate({transform:scaleMenus, duration:250},function(){
		objNameToScale.animate({transform:scaleResetMenus, duration:20});
	});
}*/


/*
 $.scrollingView.addEventListener("touchend", function(e) {
 switch(selectedView){
 case 1 :openAboutWindow();
 break;

 case 2 :openNewsWindow();
 break;

 case 3 : openServiceWindow();
 break;

 case 4 : openEventsWindow();
 break;

 case 5 : openFeedbackWindow();
 break;

 case 6 : openFuneralsWindow();
 break;

 case 7 : openContactWindow();
 break;
 }
 });
 */

function openAboutWindow() {
	$.labelNews.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	Alloy.Globals.openWindow(Alloy.createController("About/winAboutLanding").getView());
}

function openNewsWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	var payLoad = {
		isFromMenu : false,
	};
	// resetCategoryBadgeToZero($.lblNewsBadgeCounter);
	Alloy.Globals.openWindow(Alloy.createController("News/winNewsList", payLoad).getView());
}

function openServiceWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelNews.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	if (Alloy.Globals.currentWindow == "winServicesLanding") {
		return;
	}

	Alloy.Globals.openWindow(Alloy.createController("Services/servicesWebView").getView());

}

function openEventsWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelNews.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	// resetCategoryBadgeToZero($.lblEventBadgeCounter);
	Alloy.Globals.openWindow(Alloy.createController("Events/winEventsList").getView());
}

function openFeedbackWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelNews.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}
	Alloy.Globals.openWindow(Alloy.createController("Suggestion/winSuggestions").getView());
}

function openFuneralsWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelNews.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelContact.color = "#ffffff";

	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewContact.backgroundImage = Alloy.Globals.path.icnContact;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewContactArrow.backgroundImage = " ";

	if (menuType == 'left') {
		$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	Alloy.Globals.openWindow(Alloy.createController("Jnazah/winJnazahLanding").getView());
}

function openContactWindow() {
	$.labelAbout.color = "#ffffff";
	$.labelNews.color = "#ffffff";
	$.labelServices.color = "#ffffff";
	$.labelEvents.color = "#ffffff";
	$.labelFeedback.color = "#ffffff";
	$.labelFuneral.color = "#ffffff";
	$.imageViewAbout.backgroundImage = Alloy.Globals.path.icnAbout;
	$.imageViewServices.backgroundImage = Alloy.Globals.path.icnService;
	$.imageViewEvents.backgroundImage = Alloy.Globals.path.icnEvent;
	$.imageViewFeedback.backgroundImage = Alloy.Globals.path.icnFeedback;
	$.imageViewFuneral.backgroundImage = Alloy.Globals.path.icnJnazah;
	$.imageViewNews.backgroundImage = Alloy.Globals.path.icnNews;

	/*Arrow Images*/

	$.imageViewAboutArrow.backgroundImage = " ";
	$.imageViewNewsArrow.backgroundImage = " ";
	$.imageViewServicesArrow.backgroundImage = " ";
	$.imageViewEventsArrow.backgroundImage = " ";
	$.imageViewFeedbackArrow.backgroundImage = " ";
	$.imageViewFuneralArrow.backgroundImage = " ";
	if (menuType == 'left') {
		$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
	} else {
		$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
	}

	Alloy.Globals.openWindow(Alloy.createController("ContactUs/winContactUs").getView());
}

function changeMenuDirection(mType) {
	menuType = mType;
	if (menuType == "left") {
		$.scrollingView.backgroundImage = Alloy.Globals.path.About;
		$.scrollingView.left = 0;
		$.scrollingView.right = undefined;
		$.viewAbout.left = $.viewContact.left = 30;
		$.viewNews.left = $.viewFuneral.left = 130;
		$.viewServices.left = $.viewFeedback.left = 170;
		$.viewEvents.left = 190;
		$.imageViewAbout.left = $.imageViewNews.left = $.imageViewServices.left = $.imageViewEvents.left = $.imageViewFeedback.left = $.imageViewFuneral.left = $.imageViewContact.left = 10;
		$.imageViewAbout.right = $.imageViewNews.right = $.imageViewServices.right = $.imageViewEvents.right = $.imageViewFeedback.right = $.imageViewFuneral.right = $.imageViewContact.right = undefined;

		$.labelAbout.left = $.labelNews.left = $.labelServices.left = $.labelEvents.left = $.labelFeedback.left = $.labelFuneral.left = $.labelContact.left = 65;
		$.labelAbout.right = $.labelNews.right = $.labelServices.right = $.labelEvents.right = $.labelFeedback.right = $.labelFuneral.right = $.labelContact.right = undefined;
		$.labelAbout.textAlign = $.labelNews.textAlign = $.labelServices.textAlign = $.labelEvents.textAlign = $.labelFeedback.textAlign = $.labelFuneral.textAlign = $.labelContact.textAlign = "left";
		$.viewAbout.right = $.viewNews.right = $.viewServices.right = $.viewEvents.right = $.viewFeedback.right = $.viewFuneral.right = $.viewContact.right = undefined;

		$.viewIconContainerNews.right = $.viewIconContainerEservices.right = $.viewIconContainerEvents.right = $.viewIconContainerFunerals.right = undefined;
		$.viewIconContainerNews.left = $.viewIconContainerEservices.left = $.viewIconContainerEvents.left = $.viewIconContainerFunerals.left = 45;

		$.imageViewAboutArrow.left = $.imageViewNewsArrow.left = $.imageViewFuneralArrow.left = $.imageViewContactArrow.left = 165;
		$.imageViewServicesArrow.left = 130;
		$.imageViewEventsArrow.left = 110;
		$.imageViewFeedbackArrow.left = 135;

		$.imageViewAboutArrow.right = $.imageViewNewsArrow.right = undefined;
		$.imageViewFuneralArrow.right = $.imageViewContactArrow.right = undefined;
		$.imageViewServicesArrow.right = $.imageViewEventsArrow.right = $.imageViewFeedbackArrow.right = undefined;

		if ($.labelAbout.color == Alloy.Globals.path.greenColor) {
			$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelNews.color == Alloy.Globals.path.greenColor) {
			$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelFuneral.color == Alloy.Globals.path.greenColor) {
			$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelContact.color == Alloy.Globals.path.greenColor) {
			$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelServices.color == Alloy.Globals.path.greenColor) {
			$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelEvents.color == Alloy.Globals.path.greenColor) {
			$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		} else if ($.labelFeedback.color == Alloy.Globals.path.greenColor) {
			$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrow;
		}
	} else {
		$.scrollingView.backgroundImage = Alloy.Globals.path.About_Right;
		$.scrollingView.right = 0;
		$.scrollingView.left = undefined;

		$.viewAbout.right = $.viewContact.right = 30;
		$.viewNews.right = $.viewFuneral.right = 130;
		$.viewServices.right = $.viewFeedback.right = 170;
		$.viewEvents.right = 190;
		$.imageViewAbout.right = $.imageViewNews.right = $.imageViewServices.right = $.imageViewEvents.right = $.imageViewFeedback.right = $.imageViewFuneral.right = $.imageViewContact.right = 10;
		$.imageViewAbout.left = $.imageViewNews.left = $.imageViewServices.left = $.imageViewEvents.left = $.imageViewFeedback.left = $.imageViewFuneral.left = $.imageViewContact.left = undefined;
		$.labelAbout.right = $.labelNews.right = $.labelServices.right = $.labelEvents.right = $.labelFeedback.right = $.labelFuneral.right = $.labelContact.right = 65;
		$.labelAbout.left = $.labelNews.left = $.labelServices.left = $.labelEvents.left = $.labelFeedback.left = $.labelFuneral.left = $.labelContact.left = undefined;

		$.labelAbout.textAlign = $.labelNews.textAlign = $.labelServices.textAlign = $.labelEvents.textAlign = $.labelFeedback.textAlign = $.labelFuneral.textAlign = $.labelContact.textAlign = "right";

		$.viewAbout.left = $.viewNews.left = $.viewServices.left = $.viewEvents.left = $.viewFeedback.left = $.viewFuneral.left = $.viewContact.left = undefined;

		$.viewIconContainerNews.right = $.viewIconContainerEservices.right = $.viewIconContainerEvents.right = $.viewIconContainerFunerals.right = 45;
		$.viewIconContainerNews.left = $.viewIconContainerEservices.left = $.viewIconContainerEvents.left = $.viewIconContainerFunerals.left = undefined;

		$.imageViewAboutArrow.right = $.imageViewNewsArrow.right = $.imageViewFuneralArrow.right = $.imageViewContactArrow.right = 165;
		$.imageViewServicesArrow.right = 130;
		$.imageViewEventsArrow.right = 110;
		$.imageViewFeedbackArrow.right = 135;

		$.imageViewAboutArrow.left = $.imageViewNewsArrow.left = undefined;
		$.imageViewFuneralArrow.left = $.imageViewContactArrow.left = undefined;
		$.imageViewServicesArrow.left = $.imageViewEventsArrow.left = $.imageViewFeedbackArrow.left = undefined;

		if ($.labelAbout.color == Alloy.Globals.path.greenColor) {
			$.imageViewAboutArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelNews.color == Alloy.Globals.path.greenColor) {
			$.imageViewNewsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelFuneral.color == Alloy.Globals.path.greenColor) {
			$.imageViewFuneralArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelContact.color == Alloy.Globals.path.greenColor) {
			$.imageViewContactArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelServices.color == Alloy.Globals.path.greenColor) {
			$.imageViewServicesArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelEvents.color == Alloy.Globals.path.greenColor) {
			$.imageViewEventsArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		} else if ($.labelFeedback.color == Alloy.Globals.path.greenColor) {
			$.imageViewFeedbackArrow.backgroundImage = Alloy.Globals.path.icnActiveArrowLeft;
		}
	}
}

if (OS_ANDROID) {
	$.winHome.addEventListener("androidback", function() {
		var alert = Ti.UI.createAlertDialog({
			title : Alloy.Globals.selectedLanguage.appTitle,
			message : Alloy.Globals.selectedLanguage.exitConfirm,
			buttonNames : [Alloy.Globals.selectedLanguage.cancel, Alloy.Globals.selectedLanguage.ok]
		});
		alert.addEventListener('click', function(e) {

			if (e.index == 1) {
				if(OS_ANDROID)
					Ti.App.fireEvent("destroyWebActivity");
					setTimeout(function(){
						$.winHome.close();		
					},500);
				
			}
		});
		alert.show();
	});
}
createDatabase();
changeMenuDirection(menuType);

Ti.App.addEventListener('resumed', function(e) {
	if (Ti.Network.online) {
		Ti.API.info("APPLICATION STARTUP =====>>> RESUMED = getArguments() == " + JSON.stringify(Titanium.App.getArguments()) +'	IS APP OPENED..? '+Alloy.Globals.isAppOpened);
		var resumedAppData = Titanium.App.getArguments();
		if (resumedAppData.launchOptionsLocationKey == false || resumedAppData.launchOptionsLocationKey == 0 || resumedAppData.launchOptionsLocationKey == 'false'){
			Ti.API.info('MAKE A CALL FOR PUSH NOTIFICATION HISTORY @ TIME OF RESUME APP');
			Ti.App.fireEvent('loadNbindNotificationDataInTable');
		}
		else{
			Ti.API.info('RESUME WITH SOME TRAY DATA');
		}
	} else {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err, $.winHome);
		//Alloy.Globals.showInternetMsg($.winHome);
	}
});

///// Add this event listener and fired in Left Panel view bcoz there is view not window
Ti.App.addEventListener("showInternetToast",function(){
	Alloy.Globals.showInternetMsg($.winHome);
});
