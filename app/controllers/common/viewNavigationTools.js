// var isOn = false;
// $.viewNotification.add(Alloy.Globals.actBadge);
var viewHappinessIndicator;
var dbManager = require("dbUtility");
function onHappinessIndicator() {
	try {
		var ratingValue = "";
		dbManager.retrieveHappyData(function(response) {
			ratingValue = response;
		});
		dbManager.closeDatabase();
		if (ratingValue && ratingValue == 1) {
			var dialog = Ti.UI.createAlertDialog({
				ok : 0,
				title : Alloy.Globals.selectedLanguage.appTitle,
				message : Alloy.Globals.selectedLanguage.submittedRating,
				buttonNames : [Alloy.Globals.selectedLanguage.ok]
			});
			
			viewHappinessIndicator.visible = false;

			dialog.show();
		} else {
			if (viewHappinessIndicator.visible) {
				viewHappinessIndicator.animate({
					opacity : 0,
					duration : 300
				}, function(e) {
					viewHappinessIndicator.visible = false;
				});
			} else {
				viewHappinessIndicator.visible = true;
				viewHappinessIndicator.animate({
					opacity : 1,
					duration : 300
				});
			}
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}

}

exports.onHappinessIndicator = onHappinessIndicator;

exports.setHappinessView = function(view) {
	viewHappinessIndicator = view;
};

function onFavourite() {
	if (Alloy.Globals.currentWindow == "winFavouriteLanding" || Alloy.Globals.currentWindow == "winFavouriteGeneric") {
		return;
	}
	if (Ti.Network.online == false) {
		Ti.App.fireEvent("showInternetToast");
		return;	
	}
	Alloy.Globals.openWindow(Alloy.createController("Favourite/winFavouriteLanding").getView());
}

exports.onFavourite = onFavourite;

var viewNotification;
exports.setNotificationView = function(view) {
	viewNotification = view;
};

function onNotification() {
	try {
		//if (Ti.App.Properties.getObject("LoginDetaisObj") == null || Ti.App.Properties.getObject("LoginDetaisObj") == undefined || Ti.App.Properties.getObject("LoginDetaisObj") == "") {
		if (Ti.App.Properties.getString("username") == null || Ti.App.Properties.getString("username") == undefined || Ti.App.Properties.getString("username") == "") {
			Ti.API.info('BUDDY, YOU ARE NOT LOGGED IN, TO SEE ESERVICES NOTIFICATIONS, Go & Login--->');
			Alloy.Globals.openWindow(Alloy.createController("UserManagement/winLogin", {isFromLeftPanel : true}).getView());
			return;
		}
		
		// hide and show the notification panel
		if (viewNotification.visible) {
			viewNotification.animate({
				opacity : 0,
				duration : 300
			}, function(e) {
				viewNotification.visible = false;
			});
		} else {
			viewNotification.visible = true;
			viewNotification.animate({
				opacity : 1,
				duration : 300
			});
		}
	} catch(e) {
		Ti.API.info('ERROR IN MANAGING NOTIFICATION ICON CLICK MANAGEMENT');
	}

}

// Alloy.Globals.NotificationViewObj = viewNotification;
exports.onNotification = onNotification;

var isLeftMenuOpened = false;

var hideLeftPanel = Ti.UI.createAnimation({
	right : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	//	transform : Ti.UI.create2DMatrix().scale(0.9, 0.80),
	duration : 400,
});

var showLeftPanel = Ti.UI.createAnimation({
	right : "75%",
	curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
	//	transform : Ti.UI.create2DMatrix().scale(1.0, 1.0),
	duration : 400,
});

var showLeftPanel1 = Ti.UI.createAnimation({
	right : "65%",
	curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
	//	transform : Ti.UI.create2DMatrix().scale(1.0, 1.0),
	duration : 200,
});

Ti.App.addEventListener('slideMenu', function(e) {
	hideleftPanel();
	// logs 'bar'
});
function onMenu() {
	if ($.viewNavigationTools.win == undefined) {
		return;
	}
	Ti.API.info('MENU CLICK === ');
	if (!isLeftMenuOpened) {
		$.viewNavigationTools.win.animate(showLeftPanel);
		var view3 = setTimeout(function() {
			$.viewNavigationTools.win.animate(showLeftPanel1);
		}, 500);
		$.viewNavigationTools.transparentView.show();

		isLeftMenuOpened = true;
	} else {
		$.viewNavigationTools.win.animate(hideLeftPanel);
		$.viewNavigationTools.transparentView.hide();

		isLeftMenuOpened = false;
	}

}

exports.onMenu = onMenu;

function hideleftPanel() {
	if ($.viewNavigationTools.win == undefined) {
		return;
	}

	$.viewNavigationTools.win.animate(hideLeftPanel);
	$.viewNavigationTools.transparentView.hide();

	isLeftMenuOpened = false;

}

exports.hideleftPanel = hideleftPanel;

exports.hideViewWithId = function(viewID) {
	Ti.API.info('str == ' + $.viewNavigationTools.win);

	switch(viewID) {
	case "viewHapinessIndicator":
		$.viewHapinessIndicator.height = $.viewHapinessIndicator.width = 0;
		break;
	case "viewFavourite":
		$.viewFavourite.height = $.viewFavourite.width = 0;
		break;
	case "viewNotification":
		$.viewNotification.height = $.viewNotification.width = 0;
		break;
	case "viewMenu":
		$.viewMenu.height = $.viewMenu.width = 0;
		break;
	}
};
exports.setBadgeToEservices = function(v) {
	Ti.API.info('VALUE:: is :: ' + v.counterValue);
	Ti.API.info('BEFOR VAL: ' + $.labelNotificationCounter.text);
	$.labelNotificationCounter.text = v.counterValue;
	Ti.API.info('AFTER VAL: ' + $.labelNotificationCounter.text);
	if ($.labelNotificationCounter.text == 0) {
		$.viewIconContainer.visible = false;
	} else {
		$.viewIconContainer.visible = true;
	}
};

/*Titanium.App.addEventListener('makeNotificationIsON', function() {
	isOn = true;
	// Ti.API.info('MADE NOTIFICATION  ON...');
	$.viewNotification.opacity = 1.0;
	$.viewNotification.enabled = true;
});
Titanium.App.addEventListener('makeNotificationIsOFF', function() {
	isOn = false;
	// Ti.API.info('MADE NOTIFICATION  OFF...');
	$.viewNotification.opacity = 0.50;
	$.viewNotification.enabled = false;
});*/

Alloy.Globals.AllNotificationLabelCounter = $.viewIconContainer;
//$.labelNotificationCounter;