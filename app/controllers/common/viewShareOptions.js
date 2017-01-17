var utilities = require("utilities");
var dbManager = require("dbUtility");
var category,
    category_id,
    sub_category,
    sub_cat_id,
    item_Id,
    item_IdAr,
    fbObj,
    Subject,
    twitter_url;

exports.setColoredIcon = function(iconColor, type, cat_id, id, id_Ar, sub_cat_type, subcat_id, obj, tweet_url, subject) {
	category = type;
	item_Id = id;
	item_IdAr = id_Ar;
	category_id = cat_id;
	sub_category = sub_cat_type;
	sub_cat_id = subcat_id;
	Subject = subject;
	fbObj = obj;
	twitter_url = (tweet_url !== "" || tweet_url !== null) ? tweet_url : "http://www.uaq.gov.ae";
	Ti.API.info("twitter_url" + twitter_url);
	switch(iconColor) {
	case "red":
		$.imageviewShare.image = Alloy.Globals.path.icnShareRed;
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteRed;
		break;
	case "white":
		$.imageviewShare.image = Alloy.Globals.path.icnShareWhite;
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
		break;
	default:
		$.imageviewShare.image = Alloy.Globals.path.icnShareWhite;
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
		break;
	}

	if (sub_cat_id == 5) {
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavourite;
	}
};

function emailCallBack() {

}

function onShare() {
	try {
		var opts = {
			cancel : 4,
			options : [Alloy.Globals.selectedLanguage.facebook, Alloy.Globals.selectedLanguage.twitter, Alloy.Globals.selectedLanguage.shareEmail, Alloy.Globals.selectedLanguage.whatsApp, Alloy.Globals.selectedLanguage.cancel],
			selectedIndex : 4,
			destructive : 4,
			title : Alloy.Globals.selectedLanguage.share
		};

		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		dialog.addEventListener("click", function(e) {
			if (Ti.Network.online) {
				Alloy.Globals.isReturnFromSocial = true;
				if (e.index == 0) {
					utilities.facebookShare(Alloy.Globals.selectedLanguage.fbShare, fbObj, function() {
					});
				} else if (e.index == 1) {
					Ti.API.info('twitter');
					twitter_url = twitter_url.replace(/(\r\n\t|\n|\r)/gm, "");
					Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
					utilities.shareOnTwitter(Alloy.Globals.selectedLanguage.twitterShare, JSON.stringify(twitter_url), function(response) {
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
					utilities.sendMail("", Subject, (twitter_url !== "" ? twitter_url : "http://www.uaq.gov.ae"), emailCallBack);
				} else if (e.index == 3) {
					var whatsappUrl = encodeURI('whatsapp://send?text=' + (twitter_url !== "" ? twitter_url : "http://www.uaq.gov.ae"));
					if (OS_IOS) {
						//Ti.Platform.openURL(whatsappUrl);
						if (Ti.Platform.canOpenURL(whatsappUrl)) {
							Ti.Platform.openURL(whatsappUrl);
						} else {
							Ti.Platform.openURL("https://itunes.apple.com/ae/app/whatsapp-messenger/id310633997?mt=8");
						}
					} else {
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

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

exports.onShare = onShare;

Ti.API.info('Alloy.Globals.isEnglish + ' + Alloy.Globals.isEnglish);
exports.onFavourite = onFavourite;

exports.setFavouriteIcon = function() {
	if (sub_cat_id == 5) {
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteRed;
	} else {
		$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhiteFill;
	}
};

var alertView = Ti.UI.createView({
	top : (Alloy.Globals.isIOS7Plus) ? 64 : 44,
	height : 1,
	width : "100%",
	backgroundImage : Alloy.Globals.path.imgSelectedRow,
	zIndex : 71,
});

var lbl = Ti.UI.createLabel({
	font : Alloy.Globals.path.font15,
	color : "white",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE
});
alertView.add(lbl);

var sWindow;
function showAlertView() {
	sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1];
	Ti.API.info('sWindow === ' + sWindow.id);
	sWindow.add(alertView);
	alertView.animate({
		height : 40,
		duration : 300
	}, function() {
		var timeout = setTimeout(function() {
			clearTimeout(timeout);
			alertView.animate({
				height : 1,
				duration : 300
			}, function() {
				if (Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1] == sWindow) {
					Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].remove(alertView);
				}
			});
		}, 1000);
	});
}

function onFavourite() {
	if ((item_Id == undefined || item_Id == '-') || (item_IdAr == undefined || item_IdAr == '-')) {
		lbl.text = Alloy.Globals.selectedLanguage.dataNotAvailable;
	} else {
		if (sub_cat_id == 5 && $.imageviewFavourite.image == Alloy.Globals.path.icnFavouriteRed) {
			lbl.text = Alloy.Globals.selectedLanguage.removeFavourites;
			$.imageviewFavourite.image = Alloy.Globals.path.icnFavourite;
			dbManager.deleteFromTable(2, item_Id, item_IdAr);
		} else if (sub_cat_id == 5 && $.imageviewFavourite.image == Alloy.Globals.path.icnFavourite) {
			lbl.text = Alloy.Globals.selectedLanguage.addFavourites;
			$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteRed;
			Ti.API.info('id ' + item_Id + 'category ' + category + "sub category " + sub_category);
			dbManager.insertData(item_Id, item_IdAr, category, category_id, sub_category, sub_cat_id);
		} else if ($.imageviewFavourite.image == Alloy.Globals.path.icnFavouriteWhiteFill) {
			lbl.text = Alloy.Globals.selectedLanguage.removeFavourites;
			$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhite;
			Alloy.Globals.isFavData = true;
			dbManager.deleteFromTable(2, item_Id, item_IdAr);
		} else if ($.imageviewFavourite.image == Alloy.Globals.path.icnFavouriteWhite) {
			lbl.text = Alloy.Globals.selectedLanguage.addFavourites;
			$.imageviewFavourite.image = Alloy.Globals.path.icnFavouriteWhiteFill;
			dbManager.insertData(item_Id, item_IdAr, category, category_id, sub_category, sub_cat_id);
		}
	}
	showAlertView();
	return;
}
