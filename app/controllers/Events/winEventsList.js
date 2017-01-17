var httpManager = require("httpManager");
var utilities = require("utilities");
var dbManager = require("dbUtility");
var args = arguments[0] || {};
var location = null;
var preLang = null;
var totalPages = null;
var currentPage = null;
var numberOfRecords = null;
var isMoreRow = null;
var itemCount = null;
var payLoad = {};
var data;

function changeLanguage() {		
	try {
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

		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.events;
		$.labelNoRecordFound.text = Alloy.Globals.selectedLanguage.noRecordsFound;
		//$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();
		if (Ti.Network.online==false){
			Alloy.Globals.showInternetMsg($.winEventsList);
			return;
		}
		if (args.pageType && args.pageType === "Favourites") {
			getFavouriteEvents();
		} else {
			currentPage = 1;
			itemCount = 0;
			isMoreRow = true;
			numberOfRecords = 5;
			$.listviewEvents.sections[0].setItems([]);
			getResponseData();
		}

		Ti.API.info('CHANGE');
		
	} catch(e) {
		Ti.API.info('Error '+e.message);
	}
}

function getFavouriteEvents(){	
	try {
		payLoad = {
			data : []
		};

		var rowData = [];

		dbManager.retrieveData(1, 2, function(response) {
			Ti.API.info('response ' + JSON.stringify(response));
			rowData = response;
		});

		$.listviewEvents.sections[0].setItems([]);

		if (rowData.length == 0) {
			$.labelNoRecordFound.visible = true;
		} else {
			$.labelNoRecordFound.visible = false;
			for (var i = 0; i < rowData.length; i++) {
				httpManager.getEventDetails(function(response) {
					if (response == null) {
						return;
					}
					payLoad.data.push(response);
					if (payLoad.data.length == rowData.length) {
						getLocations(payLoad.data);
					}
				}, rowData[i].category_id);
			}
		}

		dbManager.closeDatabase();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}	
}


function getResponseData() {	
	try {
		httpManager.getEventsList(function(response) {
			if (response == null)
				return;
			totalPages = Math.ceil((response.count / numberOfRecords));
			if (response.count == 0 || response.count == null || response.count == undefined || response.count == "") {
				$.labelNoRecordFound.visible = true;
			} else {
				$.labelNoRecordFound.visible = false;
				if (Object.prototype.toString.call(response.events) == "[object Array]") {
					getLocations(response.events);
				} else {
					getLocations([response.events]);
				}

			}

		}, currentPage, numberOfRecords);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}


function getLocations(arr) {
	try{
		var arrayLocations = [];
		if(arr.length == 0){
			$.labelNoRecordFound.visible = true;
		}else{
			$.labelNoRecordFound.visible = false;
			for (var i = 0,len = arr.length; i < len; i++) {
				utilities.reverseGeocodingNew(arr[i].latitude, arr[i].longitude, function(response) {
					if (response == null) {
						arrayLocations.push("null");
					} else {
						arrayLocations.push(response.results[0].address);
					}
					if (arrayLocations.length == arr.length) {
						loadEvents(arr, arrayLocations);
					}
				});
			}
	}
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
	
	
}


function loadEvents(arr,locations) {
	try{
		if(arr.length > 0){
			currentPage++;
			var arrData = [];
			if (isMoreRow) {
				$.listviewEvents.sections[0].deleteItemsAt(itemCount, 1);
			}
			for (var i = 0,len = arr.length; i < len; i++) {
		

		var openingDate = " ";
		var endDate = " ";
		 if(arr[i].openingDate)
		 {
		  openingDate = getMonthName(arr[i].openingDate);
		 }
		
		 if(arr[i].openingDate)
		 {
		   endDate = getMonthName(arr[i].endDate);
		 }		

		 var imageObject = null;
		 if (arr[i].images) {
			imageObject = JSON.parse(JSON.stringify(arr[i].images)).teaserImage;
		 }
		 
		 var teaserTitle = arr[i].teaserTitle;
		 teaserTitle = teaserTitle.replace(/\r?\n/g, "");
		

		arrData.push({
			imageviewDetail : {
				right : (Alloy.Globals.isEnglish) ? undefined : 0,
				left : (Alloy.Globals.isEnglish) ? 0 : undefined,
				image : (Alloy.Globals.sitesUrl) + imageObject
			},
			viewDetail : {
				left : (Alloy.Globals.isEnglish) ? 110 : 20,
				right : (Alloy.Globals.isEnglish) ? 20 : 110,
			},
			labelTitle : {
				text : teaserTitle,
				textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT
			},
			imageviewLocationIcon : {
				right : (Alloy.Globals.isEnglish) ? undefined : 0,
				left : (Alloy.Globals.isEnglish) ? 0 : undefined,
			},
			labelLocation : {
				text : locations[i],
				right : (Alloy.Globals.isEnglish) ? undefined : 20,
				left : (Alloy.Globals.isEnglish) ? 20 : undefined,
				//textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT,
			},
			imageviewDateIcon : {
				right : (Alloy.Globals.isEnglish) ? undefined : 0,
				left : (Alloy.Globals.isEnglish) ? 0 : undefined,
			},
			labelDate : {
				text : openingDate + ' - ' + endDate,
				right : (Alloy.Globals.isEnglish) ? undefined : 20,
				left : (Alloy.Globals.isEnglish) ? 20 : undefined,
			},
			properties : {
				doc : arr[i],
				backgroundColor : 'transparent'
			}
		});
		
				itemCount++;

			}
	
			if (currentPage <= totalPages) {
				isMoreRow = true;
				arrData.push({
					template : "more",
					viewMoreLabel : {
						text : Alloy.Globals.selectedLanguage.viewMore,
						textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT
					},
	
					properties : {
						type : "more",
						backgroundColor : 'transparent'
					}
				});
			}
			else
			{
				isMoreRow = false;
			}

	
			if (arrData.length == 0) {
				$.labelNoRecordFound.visible = true;
			} else {
				$.labelNoRecordFound.visible = false;
			}
			$.listviewEvents.sections[0].appendItems(arrData);
		}else{
			$.labelNoRecordFound.visible = true;
		}
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
}

function onItemClick(e) {	
	try {
		utilities.disableMultiTouch(e.source);
		var section = $.listviewEvents.sections[e.sectionIndex];
		var item = section.getItemAt(e.itemIndex);
		if (item.properties.type == "more") {
			getResponseData();
		} else {
			if (Ti.Network.online==false){
				Alloy.Globals.showInternetMsg($.winEventsList);
				return;
			}
			Alloy.Globals.openWindow(Alloy.createController("Events/winEventsDetail", item.properties.doc).getView());
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function getMonthName(date){	
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

function winOpen() {	
	try {
		Alloy.Globals.arrWindows.push($.winEventsList);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		$.viewLeftPanel.getView().changeLanguage = changeLanguage;
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

		if (args.pageType && args.pageType === "Favourites" && Alloy.Globals.isFavData) {
			getFavouriteEvents();
		}
		
		if (preLang == Alloy.Globals.language) {
			return;
		}else{
			changeLanguage();	
		}


		$.viewLeftPanel.setMenuDirectionView({
			direction : Alloy.Globals.SelectedMenuDirection,
			menuCallback : undefined
		});
		// show push notification panel based upon user is logged in or not?
		// if (Ti.App.Properties.getObject("LoginDetaisObj") == null || Ti.App.Properties.getObject("LoginDetaisObj") == undefined || Ti.App.Properties.getObject("LoginDetaisObj") == "") {
			// Titanium.App.fireEvent('makeNotificationIsOFF');
		// } else {
			// Titanium.App.fireEvent('makeNotificationIsON');
		// }
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
		Alloy.Globals.arrWindows.pop($.winEventsList);
		$.winEventsList.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}
setTimeout(function() {
	Alloy.Globals.markPublicNotificationAsRead("3");
}, 1000);

// changeLanguage(); // I have put into commented beacuse it called in open & focus also
