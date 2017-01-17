var utilities = require("utilities");
var httpManager = require("httpManager");
var dbManager = require("dbUtility");
var args = arguments[0] || {};
var preLang = undefined;
Alloy.Globals.isFavourite = true;
var rowDelete = true;
var genericData = [],
    newsData = [],
    eventsData = [];
var arrData;

function changeLanguage() {
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winFavouriteLanding);
		return;
	}
	
	try {
		var data = "";
		dbManager.retrieveData(4, "", function(response) {
			Ti.API.info('response ' + response);
			data = response;
		});
		dbManager.closeDatabase();
		Ti.API.info('data '+data.length);
		getCategoryData(data);
		loadFavourite(data);

		if (preLang == Alloy.Globals.language) {
			Ti.API.info('2 preLang' + preLang);
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
		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.favourite;
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function loadFavourite(arr) {
	try {
		arrData = [];
		if (arr.length > 0) {
			$.labelNoRecordFound.text = "";
			for (var i = 0,
			    len = arr.length; i < len; i++) {
				var row = Ti.UI.createTableViewRow({
					height : 60,
					left : 0,
					right : 0,
					backgroundColor : "transparent",
					selectionStyle : 0,
					rowId : arr[i].category_id
				});

				arrData.push(row);
				var viewFavouriteRow = Ti.UI.createView({
					height : "100%",
					width : "100%",
					backgroundImage : Alloy.Globals.path.imgNormalRow,
					isFavouriteView : true
				});
				row.add(viewFavouriteRow);

				var viewCategoryCount = Ti.UI.createView({
					backgroundColor : 'red',
					top : '15dp',
					left : undefined,
					right : '95dp',
					//zIndex:234,
					borderRadius : 7,
					height : '15dp',
					width : '15dp',
				});

				if (OS_IOS) {
					if (Ti.Platform.displayCaps.platformWidth >= 375 && Ti.Platform.displayCaps.platformWidth < 414) {
						viewCategoryCount.right = '120dp';
						if (arr[i].category_id == 0) {
							viewCategoryCount.right = (Alloy.Globals.isEnglish) ? '105dp' : '117dp';
						} else if (arr[i].category_id == 1) {
							viewCategoryCount.right = '123dp';
						}
					} else if (Ti.Platform.displayCaps.platformWidth >= 414) {
						viewCategoryCount.right = '140dp';
						if (arr[i].category_id == 0) {
							viewCategoryCount.right = (Alloy.Globals.isEnglish) ? '125dp' : '137dp';
						} else if (arr[i].category_id == 1) {
							viewCategoryCount.right = '143dp';
						}
					} else {
						if (arr[i].category_id == 0) {
							viewCategoryCount.right = (Alloy.Globals.isEnglish) ? '80dp' : '92dp';
						} else if (arr[i].category_id == 1) {
							viewCategoryCount.right = '98dp';
						}
					}
				} else if (OS_ANDROID) {
					if (Ti.Platform.displayCaps.platformWidth >= 1080) {
						viewCategoryCount.right = '110dp';
					}
				}

				var labelCategoryCount = Ti.UI.createLabel({
					text : '0',
					color : 'white',
					font : {
						fontFamily : 'Arial',
						fontSize : '8sp',
						fontWeight : 'bold'
					},
					textAlign : 'center',
					height : '15dp',
					width : '15dp'
				});

				viewCategoryCount.add(labelCategoryCount);

				var labelFavouriteTitle = Ti.UI.createLabel({
					top : 0,
					bottom : 0,
					// left : 30,
					// right : 30,
					font : Alloy.Globals.path.font15,
					color : Alloy.Globals.path.whiteColor,
					touchEnabled : false,
					//text : arr[i].category,
					catId : arr[i].category_id,
					textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
					isFavouriteView : false
				});

				if (arr[i].category_id == 0) {
					labelCategoryCount.text = genericData.length;
					labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.generic;
				} else if (arr[i].category_id == 1) {
					labelCategoryCount.text = newsData.length;
					labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.news;
				} else if (arr[i].category_id == 2) {
					labelCategoryCount.text = eventsData.length;
					labelFavouriteTitle.text = Alloy.Globals.selectedLanguage.events;
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
				viewFavouriteRow.add(viewCategoryCount);
			}
			$.tableviewFavourite.setData(arrData);
		} else {
			$.tableviewFavourite.setData([]);
			$.labelNoRecordFound.text = Alloy.Globals.selectedLanguage.noRecordsFound;
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

var selectedRow = undefined;

try {
	if (OS_IOS) {
		$.tableviewFavourite.addEventListener("swipe", function(e) {
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
		$.tableviewFavourite.addEventListener("longpress", function(e) {
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

function getCategoryData(arr) {
	try {
		if (arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].category_id == 0) {
					dbManager.retrieveData(3, 0, function(response) {
						Ti.API.info('generic ' + response);
						genericData = response;
					});
				} else if (arr[i].category_id == 1) {
					dbManager.retrieveData(1, 1, function(response) {
						Ti.API.info('news ' + response);
						newsData = response;
					});
				} else if (arr[i].category_id == 2) {
					dbManager.retrieveData(1, 2, function(response) {
						Ti.API.info('events ' + response);
						eventsData = response;
					});
				}
			}
			dbManager.closeDatabase();
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
		var rowDataEnglish = [];
		var rowDataArabic = [];
		if (e.source.isDeleteImage) {
			Ti.API.info(e.row.children[0].children[0].catId);
			dbManager.deleteFromTable(1, e.row.children[0].children[0].catId);
			var data = "";
			dbManager.retrieveData(4, "", function(response) {
				Ti.API.info('response ' + response);
				data = response;
			});
			dbManager.closeDatabase();
			getCategoryData(data);
			loadFavourite(data);
		} else {
			var category_id = e.row.children[0].children[0].catId;
			var payLoad = {
				isFromMenu : false,
				pageType : "Favourites"
			};

			if (category_id == 1) {
				Alloy.Globals.openWindow(Alloy.createController("News/winNewsList", payLoad).getView());
			} else if (category_id == 2) {
				Alloy.Globals.openWindow(Alloy.createController("Events/winEventsList", payLoad).getView());
			} else if (category_id == 0) {
				Alloy.Globals.openWindow(Alloy.createController("Favourite/winFavouriteGeneric").getView());
			}
		}

	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function onItemClick(e) {
	utilities.disableMultiTouch(e.source);
	var section = $.listviewFavourite.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);

	Ti.API.info('e == ' + e.bindId);
	if (e.bindId == "imageviewDelete") {
		section.deleteItemsAt(e.itemIndex, 1);
		if (section.getItems().length == 0) {
			$.labelNoRecordFound.visible = true;
		}
	}

}

function winOpen() {
	try {
		Alloy.Globals.arrWindows.push($.winFavouriteLanding);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	try {
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		Alloy.Globals.bottomMenu = $.backView;
		$.viewBottomMenu.addInnerMenu();
		Alloy.Globals.currentWindow = e.source.id;
		changeLanguage();
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
	Alloy.Globals.arrWindows.pop($.winFavouriteLanding);
	$.tableviewFavourite.setData([]);
	$.winFavouriteLanding.remove($.tableviewFavourite);
	$.tableviewFavourite = null;
	$.winFavouriteLanding.close();
}