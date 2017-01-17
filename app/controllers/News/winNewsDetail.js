var utilities = require("utilities");
var args = arguments[0] || {};
var dbManager = require("dbUtility");
var preLang = null;
var translateId = null;
// $.viewNavigationTools.viewMenu.width = 0;
// $.viewNavigationTools.viewMenu.height = 0;
Ti.API.info('news argumetns======='+ JSON.stringify(args));
function changeLanguage() {
	
	
	try {
		if (preLang == Alloy.Globals.language) {
			return;
		}
		preLang = Alloy.Globals.language;
		if (Ti.Network.online==false){
			Alloy.Globals.showInternetMsg($.winNewsList);
			return;
		}
		$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();

		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.news;
		
		if (Ti.Network.online==false){
			Alloy.Globals.showInternetMsg($.winNewsList);
			return;
		}
		if (translateId) {
			if (translateId == "none") {
				$.winNewsDetail.close();
			} else {
				httpManager.getNewsDetails(function(response) {
					if (response == null) {
						return;
					}
					args = response;
					Ti.API.info('args ' + response);
					bindNewsDetails();
				}, translateId);
			}
		} else {
			Ti.API.info('COME HERE...');
			bindNewsDetails();
		}

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function bindNewsDetails() {
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

		$.labelTitle.text = args.title;
		$.labelDate.text = getMonthName(args.createdDate);
		var details = (args.body).replace(/\r?\n/g, "");
			details = details.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
			
		if (OS_IOS) 
		{
			$.newsWebView.html = "<html><head><style>body {font-family: Helvetica;font-size:16;}</style></head><body text=\"white\">" + details + "<br><br>" + " " + "</body></html>";
		} 
		else if (OS_ANDROID) 
		{
			$.newsWebView.html = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head><style>body {font-family: Helvetica;font-size:16;}</style></head><body text=\"white\">" + details + "<br><br>" + " " + "</body></html>";
		}
		
		//$.labelDetail.text = utilities.cleanHtml(args.body);
		$.imageviewNews.image = (Alloy.Globals.sitesUrl + imageObject);

		if (Alloy.Globals.isEnglish) {
			$.imageviewDateIcon.left = 0;
			$.imageviewDateIcon.right = undefined;

			$.labelDate.left = 33;
			$.labelDate.right = 0;

			$.viewShareOption.getView().right = 0;
			$.viewShareOption.getView().left = undefined;

			$.labelDate.left = 33;
			$.labelDate.right = undefined;

			// $.labelDetail.left = 0;
			// $.labelDetail.right = undefined;

			alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		} else {
			$.imageviewDateIcon.left = undefined;
			$.imageviewDateIcon.right = 0;

			$.labelDate.left = 0;
			$.labelDate.right = 33;

			$.viewShareOption.getView().right = undefined;
			$.viewShareOption.getView().left = 0;

			$.labelDate.left = undefined;
			$.labelDate.right = 33;

			// $.labelDetail.left = undefined;
			// $.labelDetail.right = 0;

			alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		}
		$.labelTitle.textAlign = $.labelDate.textAlign = alignment;

		shareSocialData(args);

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function shareSocialData(data) {
	try {
		Ti.API.info(' News Data: '+data);
		Ti.API.info(' News Data: After clean:  '+utilities.cleanHtml(data.body));
		var fbObj = {
			messageBody : utilities.cleanHtml(data.body),
			caption : Alloy.Globals.selectedLanguage.shareData,
			// picture : data.images ? Alloy.Globals.webserviceUrl + JSON.parse(JSON.stringify(data.images)).teaserImage : "",
			picture: $.imageviewNews.image,
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

		var twitterLink = utilities.cleanHtml(data.body);
		var subject = data.title;
		if (OS_IOS) {
			$.newsWebView.width = Ti.Platform.displayCaps.platformWidth - 10;
		} else if (OS_ANDROID) {
			$.newsWebView.width = 350;
		}

		$.viewShareOption.setColoredIcon("white", Alloy.Globals.selectedLanguage.news, 1, EnglishId, ArabicId, "", "", fbObj, twitterLink, subject);

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
		var language = Alloy.Globals.language;
		Alloy.Globals.arrWindows.push($.winNewsDetail);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewLeftPanel.getView().changeLanguage = changeLanguage;
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	} catch(e) {
		Ti.API.info('image praser error');
	}
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
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

function winFocus(e) {
	try {
		$.viewBottomMenu.addInnerMenu();
		Alloy.Globals.bottomMenu = $.backView;
		Alloy.Globals.currentWindow = e.source.id;
		shareSocialData(args);
		Alloy.Globals.isFavData = false;
		changeLanguage();
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
		Alloy.Globals.arrWindows.pop($.winNewsDetail);
		$.winNewsDetail.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}