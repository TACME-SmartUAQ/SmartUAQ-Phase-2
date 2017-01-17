var utilities = require("utilities");
var httpManager = require("httpManager");
var dbManager = require("dbUtility");
var args = arguments[0] || {};
var overViewResponse = args;
var rulerResponse = null;
var departmentList = null;
var crownPrinceResponse = null;
var language = Alloy.Globals.language;
Ti.API.info('args' + JSON.stringify(args));
var viewDepartmentList = undefined;
var alignment;
var preLang = null;
var preFavSelection = null;
var selectedTabName = "overview";
var overViewId,
    overViewIdAr;
var rulerId,
    rulerIdAr;
var crownId,
    crownIdAr;
var idCount;
var fbObj;

function setContent() {

	if (args.category && args.category == 3) {
		selectedTabName = "overview";
	} else if (args.category && args.category == 4) {
		selectedTabName = "ruler";
		$.viewRuler.children[1].visible = true;
		$.viewOverview.children[1].visible = false;

		$.viewRuler.children[0].backgroundColor = Alloy.Globals.path.titleRedColor;
		$.viewOverview.children[0].backgroundColor = Alloy.Globals.path.silverColor;

		$.viewRuler.children[0].color = Alloy.Globals.path.whiteColor;
		$.viewOverview.children[0].color = Alloy.Globals.path.darkestGray;

		preSelection = $.viewRuler;
		preViewId = 2;

	} else if (args.category && args.category == 6) {
		selectedTabName = "crown";
		$.viewPrince.children[1].visible = true;
		$.viewOverview.children[1].visible = false;
		$.viewPrince.children[0].backgroundColor = Alloy.Globals.path.titleRedColor;
		$.viewOverview.children[0].backgroundColor = Alloy.Globals.path.silverColor;
		$.viewPrince.children[0].color = Alloy.Globals.path.whiteColor;
		$.viewOverview.children[0].color = Alloy.Globals.path.darkestGray;

		preSelection = $.viewPrince;
		preViewId = 3;

	} else if (args.category && args.category == 5) {
		selectedTabName = "department";
		$.viewDepartment.children[1].visible = true;
		$.viewOverview.children[1].visible = false;

		$.viewDepartment.children[0].backgroundColor = Alloy.Globals.path.titleRedColor;
		$.viewOverview.children[0].backgroundColor = Alloy.Globals.path.silverColor;

		$.viewDepartment.children[0].color = Alloy.Globals.path.whiteColor;
		$.viewOverview.children[0].color = Alloy.Globals.path.darkestGray;
		$.viewDepartmentParent.show();
		$.viewOverviewParent.hide();
		preSelection = $.viewDepartment;
		preViewId = 4;
	}
}

function changeLanguage() {
	
	language = Alloy.Globals.language;
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	$.viewLeftPanel.changeLangLeft();
	$.viewLeftPanel.setLanguage();
	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();

	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.aboutUAQ;

	$.labelOverview.text = Alloy.Globals.selectedLanguage.overviewCap;
	$.labelRuler.text = Alloy.Globals.selectedLanguage.theRulerCap;
	$.labelPrince.text = Alloy.Globals.selectedLanguage.crownPrinceCap;
	$.labelDepartment.text = Alloy.Globals.selectedLanguage.departmentCap;
	if (args.isFromMenu) {
		$.webOverViewDetails.html = overViewResponse.data.body;
		$.imageviewAbout.image = overViewResponse.data.image;
	} else if (args.body) {
		$.webOverViewDetails.html = overViewResponse.body;
		$.imageviewAbout.image = overViewResponse.image;
	}

	if (Alloy.Globals.isEnglish) {
		$.overviewShareView.right = 15;
		$.overviewShareView.left = undefined;

		alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		$.overviewShareView.right = undefined;
		$.overviewShareView.left = 15;

		alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
	if (Ti.Network.online == false) {
		Alloy.Globals.showInternetMsg($.winAboutLanding);
		return;
	}
	getResponseData();
}

var preSelection = $.viewOverview;
$.imageviewOverviewArrow.visible = true;
var preViewId = 1;

function getResponseData() {
	
	if (selectedTabName == "overview")
		updateOverviewDetails();
	else if (selectedTabName == "ruler")
		updateRulerDetails();
	else if (selectedTabName == "crown")
		updateCrownDetails();
	else
		updateDepartmentDetails();
}

function selectOption(e) {
	
	if (Ti.Network.online == false) {
		Alloy.Globals.showInternetMsg($.winAboutLanding);
		return;
	}
	
	Ti.API.info('Select Option == ' + JSON.stringify(e));
	if (preViewId == e.source.viewId) {
		return;
	}

	if (e.source.viewId == 1) {
		updateOverviewDetails();
	} else if (e.source.viewId == 2) {
		updateRulerDetails();
	} else if (e.source.viewId == 3) {
		updateCrownDetails();
	} else if (e.source.viewId == 4) {
		updateDepartmentDetails();
	}

	preViewId = e.source.viewId;
	e.source.children[1].visible = true;
	preSelection.children[1].visible = false;
	e.source.children[0].backgroundColor = Alloy.Globals.path.titleRedColor;
	preSelection.children[0].backgroundColor = Alloy.Globals.path.silverColor;
	e.source.children[0].color = Alloy.Globals.path.whiteColor;
	preSelection.children[0].color = Alloy.Globals.path.darkestGray;

	if (e.source.viewId == 4) {
		$.viewOverviewParent.hide();
		$.viewDepartmentParent.show();
	} else {
		$.viewOverviewParent.show();
		$.viewDepartmentParent.hide();
	}

	preSelection = e.source;
}

function updateOverviewDetails() {
	callFavouritesIds();
	selectedTabName = "overview";
	httpManager.getOverViewDetails(function(response) {
		if (response == null)
			return;
		if (Alloy.Globals.isEnglish) {
			overViewId = (response.id != undefined) ? response.id : '-';
			overViewIdAr = (response.translatedAssetId != undefined) ? response.translatedAssetId : '-';
		} else {
			overViewId = response.translatedAssetId;
			overViewIdAr = response.id;
		}

		Ti.API.info('response ' + overViewId);
		
		fbObj = {
			messageBody : utilities.cleanHtml(response.body),
			caption : Alloy.Globals.selectedLanguage.shareData,
			picture : (response.image) ? Alloy.Globals.webserviceUrl + response.image : "",
			contentLink : ""
		};
		
		Ti.API.info('test object'+ JSON.stringify(fbObj));

		var twitterLink = utilities.cleanHtml(response.body);
		var subject = Alloy.Globals.selectedLanguage.aboutUAQ;

		$.overviewShareOption.setColoredIcon("white", Alloy.Globals.selectedLanguage.generic, 0, overViewId, overViewIdAr, Alloy.Globals.selectedLanguage.overView, 3, fbObj, twitterLink, subject);
		for (var i = 0; i < idCount.length; i++) {
			if (idCount[i].category_id == overViewId || idCount[i].category_id == overViewIdAr) {
				$.overviewShareOption.setFavouriteIcon();
			}
		}

		if (OS_IOS) {
			$.webOverViewDetails.html = "<html></head><body text=\"white\">" + response.body + "<p>" + " " + "<p>" + " " + "<br><br>" + " " + "</body></html>";
		} else if (OS_ANDROID) {
			$.webOverViewDetails.html = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head></head><body text=\"white\">" + response.body + "<p>" + "  " + "<p>" + " " + "<br><br>" + " " + "</body></html>";
		}
		$.imageviewAbout.image = Alloy.Globals.sitesUrl + response.image;
	});

}

function updateRulerDetails() {
	callFavouritesIds();
	selectedTabName = "ruler";
	httpManager.getRulerDetails(function(response) {
		if (response == null)
			return;

		if (Alloy.Globals.isEnglish) {
			rulerId = (response.id != undefined) ? response.id : '-';
			rulerIdAr = (response.translatedAssetId != undefined) ? response.translatedAssetId : '-';
		} else {
			rulerId = response.translatedAssetId;
			rulerIdAr = response.id;
		}
		fbObj = {
			messageBody : utilities.cleanHtml(response.body),
			caption : Alloy.Globals.selectedLanguage.shareData,
			picture : (response.image) ? Alloy.Globals.webserviceUrl + response.image : "",
			contentLink : ""
		};

		var twitterLink = utilities.cleanHtml(response.body);
		var subject = Alloy.Globals.selectedLanguage.ruler;

		$.overviewShareOption.setColoredIcon("white", Alloy.Globals.selectedLanguage.generic, 0, rulerId, rulerIdAr, Alloy.Globals.selectedLanguage.overView, 4, fbObj, twitterLink, subject);
		for (var i = 0; i < idCount.length; i++) {
			if (idCount[i].category_id == rulerId || idCount[i].category_id == rulerIdAr) {
				$.overviewShareOption.setFavouriteIcon();
			}
		}

		if (OS_IOS) {
			$.webOverViewDetails.html = "<html></head><body text=\"white\">" + response.body + "<br><br>" + " " + "</body></html>";
		} else if (OS_ANDROID) {
			$.webOverViewDetails.html = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head></head><body text=\"white\">" + response.body + "<br><br>" + " " + "</body></html>";
		}
		$.imageviewAbout.image = Alloy.Globals.sitesUrl + response.image;
	});
}

function updateCrownDetails() {
	callFavouritesIds();
	selectedTabName = "crown";
	httpManager.getCrownDetails(function(response) {
		if (response == null)
			return;

		if (Alloy.Globals.isEnglish) {
			crownId = (response.id != undefined) ? response.id : '-';
			crownIdAr = (response.translatedAssetId != undefined) ? response.translatedAssetId : '-';
		} else {
			crownId = response.translatedAssetId;
			crownIdAr = response.id;
		}
		fbObj = {
			messageBody : utilities.cleanHtml(response.body),
			caption : Alloy.Globals.selectedLanguage.shareData,
			picture : (response.image) ? Alloy.Globals.webserviceUrl + response.image : "",
			contentLink : ""
		};
		var twitterLink = utilities.cleanHtml(response.body);
		var subject = Alloy.Globals.selectedLanguage.crown;
		$.overviewShareOption.setColoredIcon("white", Alloy.Globals.selectedLanguage.generic, 0, crownId, crownIdAr, Alloy.Globals.selectedLanguage.overView, 6, fbObj, twitterLink, subject);
		for (var i = 0; i < idCount.length; i++) {
			if (idCount[i].category_id == crownId || idCount[i].category_id == crownIdAr) {
				$.overviewShareOption.setFavouriteIcon();
			}
		}

		if (OS_IOS) {
			$.webOverViewDetails.html = "<html></head><body text=\"white\">" + response.body + "<br><br>" + " " + "</body></html>";
		} else if (OS_ANDROID) {
			$.webOverViewDetails.html = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head></head><body text=\"white\">" + response.body + "<br><br>" + " " + "</body></html>";
		}
		$.imageviewAbout.image = Alloy.Globals.sitesUrl + response.image;
	});
}

function updateDepartmentDetails(e) {
	selectedTabName = "department";
	if (args.pageType && args.pageType == "Favourites") {
		var payload = {};
		payload.deptData = [];

		dbManager.retrieveData(2, 5, function(response) {
			Ti.API.info('response ' + response);
			payload.deptData = response;
		});
		dbManager.closeDatabase();
		if (payload.deptData.length > 0) {
			getFavDeptData(payload.deptData);
		} else {
			getDepartmentDetails();
		}
	} else {
		getDepartmentDetails();
	}
}

function getFavDeptData(arr) {
	var deptDataResponse = [];

	for (var i = 0; i < arr.length; i++) {
		httpManager.getDeptDetails(function(response) {
			if (response == null)
				return;
			deptDataResponse.push(response);
			Alloy.Globals.hideLoading();
			if (deptDataResponse.length == arr.length) {
				$.viewDepartmentList.loadDepartment(deptDataResponse, "");
			}

		}, arr[i].category_id);
	}
}

function getDepartmentDetails(e) {
	httpManager.getAboutDepartmentDetails(function(response) {
		if (response == null)
			return;
		$.viewDepartmentList.loadDepartment(response.departments, "web");
	});
}

function winOpen(e) {
	Alloy.Globals.arrWindows.push($.winAboutLanding);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewOverview.detailView = $.viewOverviewParent;
	$.viewDepartment.detailView = $.viewDepartmentParent;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function callFavouritesIds() {
	dbManager.retrieveData(5, "", function(response) {
		Ti.API.info('response ' + response);
		idCount = response;
		Ti.API.info('idCount ' + JSON.stringify(idCount));
	});
	dbManager.closeDatabase();
}

function winFocus(e) {
	Alloy.Globals.isFavData = false;
	Alloy.Globals.bottomMenu = $.backView;
	$.viewBottomMenu.addInnerMenu();
	Alloy.Globals.currentWindow = e.source.id;
	callFavouritesIds();
	Ti.API.info('idCount ' + JSON.stringify(idCount));
	if (idCount.length > 0) {
		for (var i = 0; i < idCount.length; i++) {
			if (selectedTabName == "overview") {
				if (idCount[i].category_id == overViewId || idCount[i].category_id == overViewIdAr) {
					$.overviewShareOption.setFavouriteIcon();
					return;
				} else {
					$.overviewShareOption.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
				}
			} else if (selectedTabName == "ruler") {
				if (idCount[i].category_id == rulerId || idCount[i].category_id == rulerIdAr) {
					$.overviewShareOption.setFavouriteIcon();
					return;
				} else {
					$.overviewShareOption.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
				}
			} else if (selectedTabName == "crown") {
				if (idCount[i].category_id == crownId || idCount[i].category_id == crownIdAr) {
					$.overviewShareOption.setFavouriteIcon();
					return;
				} else {
					$.overviewShareOption.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
				}
			}
		}
	}else{
		$.overviewShareOption.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
	} 

	if (args.pageType && args.pageType == "Favourites") {
		if(selectedTabName == "department"){
			updateDepartmentDetails();
		}
		setContent();
	}
	changeLanguage();
	Alloy.Globals.hideLoaderWhileReturnBackToApp();
	// Alloy.Globals.manageEservicesNotification();
}

function closeWindow() {
	Ti.API.info('1.args ===' + args.isFromMenu);
	if (args.isFromMenu) {
		Alloy.Globals.gotoHome();
		return;
	}
	Alloy.Globals.arrWindows.pop($.winAboutLanding);
	$.winAboutLanding.close();
}

