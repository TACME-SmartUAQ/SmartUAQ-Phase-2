var utilities = require("utilities");
var httpManager = require("httpManager");
var dbManager = require("dbUtility");
var args = arguments[0] || {};
Ti.API.info('args.data===news===='+JSON.stringify(args.data));
var totalPages = null;
var currentPage = null;
var numberOfRecords = null;
var preLang = null;
var isMoreRow = null;
var itemCount = null;
var payLoad = {};

function changeLanguage() {
	
	try{	
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

		
		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.news;
		$.labelNoRecordFound.text = Alloy.Globals.selectedLanguage.noRecordsFound;	
		//$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();
		
		if (Ti.Network.online==false){
			Alloy.Globals.showInternetMsg($.winNewsList);
			return;
		}
		
		if (args.pageType && args.pageType === "Favourites") {
			getFavouriteNews();			
		} else {
			currentPage = 1;
			itemCount = 0;
			isMoreRow = true;
			numberOfRecords = 5;
			$.listviewNews.sections[0].setItems([]);
			getResponseData();
		}
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
}

function getFavouriteNews(){
	
	try {
		payLoad = {
			data : []
		};

		var rowData = [];

		dbManager.retrieveData(1, 1, function(response) {
			Ti.API.info('response ' + JSON.stringify(response));
			rowData = response;
		});

		$.listviewNews.sections[0].setItems([]);

		if (rowData.length == 0) {
			$.labelNoRecordFound.visible = true;
		} else {
			$.labelNoRecordFound.visible = false;
			for (var i = 0; i < rowData.length; i++) {
				httpManager.getNewsDetails(function(response) {
					if (response == null) {
						return;
					}
					payLoad.data.push(response);
					if (payLoad.data.length == rowData.length) {
						loadNews(payLoad.data);
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
		httpManager.getNewsList(function(response) {
			if (response == null)
				return;
			totalPages = Math.ceil((response.count / numberOfRecords));
			if (response.count == 0 || response.count == null || response.count == undefined || response.count == "") {
				$.labelNoRecordFound.visible = true;
			}else{				
				$.labelNoRecordFound.visible = false;
				if (Object.prototype.toString.call(response.news) == "[object Array]") {
					loadNews(response.news);
				} else {
					loadNews([response.news]);
				}
			}
		}, currentPage, numberOfRecords);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}


function loadNews(arr) {
	try{
		currentPage++;
		var arrData = [];
		if (isMoreRow) {
			$.listviewNews.sections[0].deleteItemsAt(itemCount, 1);
		}
		
		if(arr.length > 0){
			for (var i = 0,len = arr.length; i < len; i++) {
				var imageObject = null;
				var teaserTitle = arr[i].teaserTitle;
				teaserTitle = teaserTitle.replace(/\r?\n/g, "");
				if (arr[i].images) {
					imageObject = JSON.parse(JSON.stringify(arr[i].images)).teaserImage;
				}

				arrData.push({
					imageviewDetail : {
						right : (Alloy.Globals.isEnglish) ? undefined : 0,
						left : (Alloy.Globals.isEnglish) ? 0 : undefined,
						image : (Alloy.Globals.sitesUrl +imageObject)
					},
					viewDetail : {
						left : (Alloy.Globals.isEnglish) ? 110 : 20,
						right : (Alloy.Globals.isEnglish) ? 20 : 110,
					},
					labelTitle : {
						text : teaserTitle,
						textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT
					},
					imageviewDateIcon : {
						right : (Alloy.Globals.isEnglish) ? undefined : 0,
						left : (Alloy.Globals.isEnglish) ? 0 : undefined,
					},
					labelDate : {
						text : getMonthName(arr[i].createdDate),
						right : (Alloy.Globals.isEnglish) ? undefined : 20,
						left : (Alloy.Globals.isEnglish) ? 20 : undefined,
					},
					properties : {
						doc : arr[i],
						backgroundColor : 'transparent',
						type: "new",
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
			$.listviewNews.sections[0].appendItems(arrData);
	 }else{
	 	$.labelNoRecordFound.visible = true;
	 }		
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
}

function getMonthName(date){
	try{
		var newDate = date.split('/');
		var dateModified;
		switch(newDate[1]){
			case '01' : dateModified =  newDate[0]+' Jan '+newDate[2];
						break;
						
			case '02' : dateModified =  newDate[0]+' Feb '+newDate[2];
						break;
						
			case '03' : dateModified =  newDate[0]+' Mar '+newDate[2];
						break;
						
			case '04' : dateModified =  newDate[0]+' Apr '+newDate[2];
						break;
						
			case '05' : dateModified =  newDate[0]+' May '+newDate[2];
						break;
						
			case '06' : dateModified =  newDate[0]+' Jun '+newDate[2];
						break;
						
			case '07' : dateModified =  newDate[0]+' Jul '+newDate[2];
						break;
						
			case '08' : dateModified =  newDate[0]+' Aug '+newDate[2];
						break;
						
			case '09' : dateModified =  newDate[0]+' Sep '+newDate[2];
						break;
						
			case '10' : dateModified =  newDate[0]+' Oct '+newDate[2];
						break;
						
			case '11' : dateModified =  newDate[0]+' Nov '+newDate[2];
						break;
						
			case '12' : dateModified =  newDate[0]+' Dec '+newDate[2];
						break;
		}
	
		if (dateModified == undefined || dateModified =="" || dateModified == null)
			return dateModified = "";
		else
			return dateModified;
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
}


function onItemClick(e) {	
	try {
		utilities.disableMultiTouch(e.source);
		var section = $.listviewNews.sections[e.sectionIndex];
		var item = section.getItemAt(e.itemIndex);
		if (item.properties.type == "more") {
			getResponseData();
		} else {
			if (Ti.Network.online==false){
				Alloy.Globals.showInternetMsg($.winNewsList);
				return;
			}
			Alloy.Globals.openWindow(Alloy.createController("News/winNewsDetail", item.properties.doc).getView());
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function winOpen() {	
	try {
		Alloy.Globals.arrWindows.push($.winNewsList);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		//$.viewLeftPanel.getView().changeLanguage = changeLanguage;
		//$.viewBottomMenu.getView().viewBack = $.backView;
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
		changeLanguage();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}	
}

function closeLeftPanel(){
	$.viewNavigationTools.onMenu();
}

var viewBottomMenu = null;

function winFocus(e) {	
	try {
		// Alloy.Globals.manageEservicesNotification();
		Alloy.Globals.bottomMenu = $.backView;
		$.viewBottomMenu.addInnerMenu();

		if (args.pageType && args.pageType === "Favourites" && Alloy.Globals.isFavData) {
			getFavouriteNews();
		}
		
		if (preLang == Alloy.Globals.language) {
			return;
		}else{
			changeLanguage();	
		}

		

		Alloy.Globals.currentWindow = e.source.id;
		// $.viewLeftPanel.setMenuDirectionView({
			// direction : Alloy.Globals.SelectedMenuDirection,
			// menuCallback : undefined
		// });
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function winBlur(e){
// $.winNewsList.remove(viewBottomMenu);
}

function closeWindow() {	
	try {
		Ti.API.info('2.args ===' + args.isFromMenu);
		if (args.isFromMenu) {
			Alloy.Globals.gotoHome();
			return;
		}

		Alloy.Globals.arrWindows.pop($.winNewsList);
		$.winNewsList.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

setTimeout(function(){
	 Alloy.Globals.markPublicNotificationAsRead("2");
},1000);
