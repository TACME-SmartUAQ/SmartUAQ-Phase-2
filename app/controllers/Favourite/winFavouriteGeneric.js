var utilities = require("utilities");
var httpManager = require("httpManager");
var dbManager = require("dbUtility");
var args = arguments[0] || {};
var rowDelete = true;
var preLang = undefined;
var arrData;

function changeLanguage() {
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winFavouriteGeneric);
		return;
	}
	try {
		var data = "";
		dbManager.retrieveData(3, 0, function(response) {
			Ti.API.info('response ' + response);
			data = response;
			dbManager.closeDatabase();
			Ti.API.info('data ' + data.length);
			loadFavourite(data);
		});

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

		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.generic;
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}

}

function loadFavourite(arr) {
	try {

		arrData = [];
		for (var i = 0,
		    len = arr.length; i < len; i++) {

			var row = Ti.UI.createTableViewRow({
				height : 60,
				left : 0,
				right : 0,
				backgroundColor : "transparent",
				selectedBackgroundColor : "red",
				selectionStyle : 0,
				rowId : arr[i].category_id
			});

			var viewFavouriteRow = Ti.UI.createView({
				height : "100%",
				width : "100%",
				backgroundImage : Alloy.Globals.path.imgNormalRow,
				isFavouriteView : true
			});

			var labelFavouriteTitle = Ti.UI.createLabel({
				top : 0,
				bottom : 0,
				left : 30,
				right : 30,
				font : Alloy.Globals.path.font15,
				color : Alloy.Globals.path.whiteColor,
				touchEnabled : false,
				//text : arr[i].subCategory,
				subcat_id : arr[i].category_id,
				textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
				isFavouriteView : false
			});

			if (arr[i].category_id == 3) {
				labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.overView;
			} else if (arr[i].category_id == 4) {
				labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.ruler;
			} else if (arr[i].category_id == 5) {
				labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.departments;
			} else if (arr[i].category_id == 6) {
				labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.crown;
			}

			viewFavouriteRow.add(labelFavouriteTitle);

			var imageView = Ti.UI.createView({
				height : 35,
				width : 35,
				left : (Alloy.Globals.isEnglish) ? undefined : 0,
				right : (Alloy.Globals.isEnglish) ? 0 : undefined,
				backgroundColor : "transparent",
				isFavouriteView : false,
				isDeleteImage : true,
				visible : false
			});

			var imageviewDelete = Ti.UI.createImageView({
				height : 15,
				width : 15,
				image : Alloy.Globals.path.imgDelete,
				isDeleteImage : true
			});
			imageView.add(imageviewDelete);
			viewFavouriteRow.add(imageView);
			row.add(viewFavouriteRow);
			arrData.push(row);
		}

		$.tableviewFavouriteGeneric.setData(arrData);

		if (arrData.length == 0) {
		$.labelNoRecordFound.text = Alloy.Globals.selectedLanguage.noRecordsFound;
		$.labelNoRecordFound.visible = true;
		} else {
		$.labelNoRecordFound.visible = false;
		}

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}

}

function onRowClick(e) {
	try {

		if (arrData.length <= 0) {
			return;
		}

		if (e.source.isDeleteImage) {
			dbManager.deleteFromTable(3, e.row.children[0].children[0].subcat_id);
			var data = "";
			dbManager.retrieveData(3, 0, function(response) {
				Ti.API.info('response ' + response);
				data = response;
			});
			loadFavourite(data);
		} else {
			var sub_category_id = e.row.children[0].children[0].subcat_id;
			var rowData = [];
			var payload = {
				category : sub_category_id,
				pageType : "Favourites",
				deptId : 5
			};
			if (sub_category_id == 3 || sub_category_id == 4 || sub_category_id == 6 || sub_category_id == 5) {
				Alloy.Globals.openWindow(Alloy.createController("About/winAboutLanding", payload).getView());
			}
		}

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

try {
	if (OS_IOS) {
		$.tableviewFavouriteGeneric.addEventListener("swipe", function(e) {
			try {
				if (e.direction == "left") {
					e.source.backgroundImage = Alloy.Globals.path.imgSelectedRow;
					e.row.children[0].children[1].visible = true;
				} else if (e.direction == "right") {
					e.source.backgroundImage = Alloy.Globals.path.imgNormalRow;
					e.row.children[0].children[1].visible = false;
				}
			} catch(e) {
				Ti.API.info('Error ' + JSON.stringify(e));
			}
		});
	} else if (OS_ANDROID) {
		$.tableviewFavouriteGeneric.addEventListener("longpress", function(e) {
			try {
				if (rowDelete) {
					e.source.backgroundImage = Alloy.Globals.path.imgSelectedRow;
					e.row.children[0].children[1].visible = true;
					rowDelete = false;
				} else {
					e.source.backgroundImage = Alloy.Globals.path.imgNormalRow;
					e.row.children[0].children[1].visible = false;
					rowDelete = true;
				}

			} catch(e) {
				Ti.API.info('Error ' + JSON.stringify(e));
			}
		});
	}

} catch(e) {
	Ti.API.info('Error ' + e.message);
}

function winOpen() {
	try {
		Alloy.Globals.arrWindows.push($.winFavouriteGeneric);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
		changeLanguage();
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
		if(Alloy.Globals.isFavData){
			changeLanguage();			
		}
		// show push notification panel based upon user is logged in or not?
		/*if (Ti.App.Properties.getObject("LoginDetaisObj") == null || Ti.App.Properties.getObject("LoginDetaisObj") == undefined || Ti.App.Properties.getObject("LoginDetaisObj") == "") {
			Titanium.App.fireEvent('makeNotificationIsOFF');
		} else {
			Titanium.App.fireEvent('makeNotificationIsON');
		}*/
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function closeWindow() {
	Alloy.Globals.arrWindows.pop($.winFavouriteGeneric);
	$.tableviewFavouriteGeneric.setData([]);
	$.winFavouriteGeneric.remove($.tableviewFavouriteGeneric);
	$.tableviewFavouriteGeneric = null;
	$.winFavouriteGeneric.close();
}