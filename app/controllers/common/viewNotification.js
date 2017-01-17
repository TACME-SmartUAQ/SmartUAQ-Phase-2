var httpManager = require("httpManager");

var getAllNotificationsResponse = null;
exports.changeLanguage = function () {
	
	$.labelTitle.text = Alloy.Globals.selectedLanguage.notificationTitle;
	if (Alloy.Globals.isEnglish) {
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	}
	else {
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
	
	// Ti.API.info(newsCnt, eventCnt, funeralCnt, eServicesCnt);
	Ti.API.info('CURRENT WIN: '+Alloy.Globals.currentWindow);
	loadNotification();
};


function closeView(e) {
	Ti.API.info('GOING TO CLOSE' + e.source.id);
	
	if (e.source.id == "viewNotificationMain")
	{
		if ($.viewNotificationMain.visible) {
			$.viewNotificationMain.animate({
				opacity : 0,
				duration : 300
			}, function(e) {
				$.viewNotificationMain.visible = false;
			});
		} else {
			$.viewNotificationMain.visible = true;
			$.viewNotificationMain.animate({
				opacity : 1,
				duration : 300
			});
		}
	}
	else
	{
		return;
	}
}
var tblData = [];
var arrStoredAllNotificationData=[];
function loadNotification() {
	try
	{
		getAllNotificationsResponse = null;
		httpManager.getAllNotifications(function(response) {
			if (response == null || response == "" || response == "undefined")
				return;
			
			//getAllNotificationsResponse = response;
			Ti.API.info(' LENGTH: '+ response.count);
			Ti.API.info(' FINAL RESPONSE ALL NOTIFICATION HISTORY:::::; ' + JSON.stringify(response));
			var cntNews = 0;
			var cntEvents = 0;
			var cntFunerals = 0;
			var cntEservices = 0;
			Alloy.Globals.storedAllNotificationData=[];
			arrStoredAllNotificationData = [];
			tblData=[];
			if (response.count == 0){
				Ti.API.info('NO MSG TO SHOW');
				$.lblEmptyNotifications.visible=true;
				$.lblEmptyNotifications.text = Alloy.Globals.selectedLanguage.no_notification;
				//setBadgeValue(cntNews, cntEvents, cntFunerals, cntEservices);
				//$.tableviewAllNotifications.setData(tblData);
			}
			else{
				if (Object.prototype.toString.call(response.searchResults) == "[object Array]") {
					Ti.API.info('Get All Notifications: Object Array so no need to push');
					getAllNotificationsResponse = response.searchResults;
				} else {
					Ti.API.info('Get All Notifications: Only one Object so push in array');
					getAllNotificationsResponse = [response.searchResults];
				}
				Ti.API.info('GET ALL NOTIFICATION: '+ JSON.stringify(getAllNotificationsResponse));
				//////////////////////////////////////////////////////////////////////////////////
				$.lblEmptyNotifications.visible=false;
				var nTypeId = null;
				var msg = null;
				
				sortByKey(getAllNotificationsResponse,"messageId");
				Ti.API.info('Meessages are Sorted..');
				
				for (var i=0; i<getAllNotificationsResponse.length; i++)
				{
					Ti.API.info('Looping to bind rows:'+i);
					try{
						msg = JSON.parse(getAllNotificationsResponse[i].message);
						nTypeId = parseInt(msg.nTypeId);
						
						var rows = Alloy.createController('common/allNotificationTableRows', msg).getView();
							rows.messageId = getAllNotificationsResponse[i].messageId;
							rows.nTypeId = nTypeId;
							rows.nTypeIdVal = msg.nTypeIdVal;
						
						(nTypeId==1?Ti.API.info('NOT YET'):(nTypeId==2?cntNews=cntNews+1:(nTypeId==3?cntEvents=cntEvents+1:(nTypeId==4?cntFunerals=cntFunerals+1:cntEservices=cntEservices+1))));
						
						(nTypeId==5?tblData.push(rows):Ti.API.info('DONT SHOW OTHER NOTIFICATION'));
						
						//arrStoredAllNotificationData.push(getAllNotificationsResponse[i]);
						//rows=null;
					}
					catch(e){
						Ti.API.info('Eror occured while binding rows for eServices notification panel');
					}
					
				}
				//nTypeId = null;
				//msg = null;
				//setBadgeValue(cntNews, cntEvents, cntFunerals, cntEservices);
			}
			
			
			Ti.API.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<COUNTER VALUES>>>>>>>>>>>>>>>>>>>>>>>>>>>');

			try{
				Ti.API.info('cntNews : '+ cntNews);
				Ti.API.info('cntEvents : '+ cntEvents);
				Ti.API.info('cntFunerals : '+ cntFunerals);
				Ti.API.info('cntEservices : '+ cntEservices);
				Ti.API.info('TOTAL COUNTER ALL: '+ parseInt(cntNews + cntEvents + cntFunerals + cntEservices));
				
				(OS_IOS?Ti.UI.iPhone.setAppBadge(parseInt(cntNews + cntEvents + cntFunerals + cntEservices)):Ti.API.info('!...!'));
				
				if (cntNews ==0 && cntEvents==0 && cntFunerals==0 && cntEservices==0){
					Alloy.Globals.NotificationCounterNews.visible=false;
					Alloy.Globals.NotificationCounterEvents.visible=false;
					Alloy.Globals.NotificationCounterFunerals.visible=false;
					// Alloy.Globals.AllNotificationLabelCounter.visible=false;
					
					if (Alloy.Globals.currentWindow=="winHome"){
						Ti.API.info('U R ON HOME SCREEN..1111'+ Alloy.Globals.currentWindow);
						$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
					}
					else{
						Alloy.Globals.AllNotificationLabelCounter.visible=false;
						
						$.lblEmptyNotifications.visible=true;
						$.lblEmptyNotifications.text = Alloy.Globals.selectedLanguage.no_notification;
					}
				}
				else
				{
					if (cntNews==0){
						Alloy.Globals.NotificationCounterNews.visible=false;
					}
					else{
						Alloy.Globals.NotificationCounterNews.visible=true;
						Alloy.Globals.NotificationCounterNews.children[0].text = cntNews;
					}
					if (cntEvents==0){
						Alloy.Globals.NotificationCounterEvents.visible=false;
					}
					else{
						Alloy.Globals.NotificationCounterEvents.visible=true;
						Alloy.Globals.NotificationCounterEvents.children[0].text = cntEvents;
					}
					if (cntFunerals==0){
						Alloy.Globals.NotificationCounterFunerals.visible=false;
					}
					else{
						Alloy.Globals.NotificationCounterFunerals.visible=true;
						Alloy.Globals.NotificationCounterFunerals.children[0].text = cntFunerals;
					}
					
					if (cntEservices==0){
						if (Alloy.Globals.currentWindow=="winHome"){
							Ti.API.info('U R ON HOME SCREEN..22222'+ Alloy.Globals.currentWindow);
							$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
						}
						else{
							Alloy.Globals.AllNotificationLabelCounter.visible=false;
						}
					}
					else{
						if (Alloy.Globals.currentWindow=="winHome"){
							Ti.API.info('U R ON HOME SCREEN..33333'+ Alloy.Globals.currentWindow);
							$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
						}
						else{
							Alloy.Globals.AllNotificationLabelCounter.visible=true;
							Alloy.Globals.AllNotificationLabelCounter.children[0].text = cntEservices;
						}
					}
				}
			}
			catch(e){
				Ti.API.info('Error in setting badge counter'+JSON.stringify(e));
			}
			$.tableviewAllNotifications.setData(tblData);
			Ti.API.info('Table data set');
			Alloy.Globals.storedAllNotificationData = getAllNotificationsResponse;
		});
	}
	catch(e){
		Ti.API.info('############### ERROR ############ '+ JSON.stringify (e));
	}
}
//Ascending order: Latest entry wil come first (>, <):
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; 
        var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}


if (Alloy.Globals.currentWindow == "winHome")
	Ti.App.addEventListener('loadNbindNotificationDataInTable', loadNotification);

function _eventTableAllNotificationClicked(e)
{
	try
	{
		if (Alloy.Globals.currentWindow == "winMyServices" && (Alloy.Globals.currentWindow != null || Alloy.Globals.currentWindow != undefined))
			Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length - 1].close();
			
		var nTypeId = e.row.nTypeId;
		if (nTypeId=="5"){
			Ti.API.info('ASSOCIATED MESSAGE ROW: '+e.row.nTypeIdVal);
			
			/*var username = null;
			if (Ti.App.Properties.getString("username")!= null){
				username = Ti.App.Properties.getString("username");
			}*/
			httpManager.markNotificationMessageAsRead(function(response){
					if (response=='1')
						$.tableviewAllNotifications.deleteRow(e.index);
					var data = {"response":"", "idToExpand":e.row.nTypeIdVal, "isNoRecord":"" , url : ""};
					Alloy.Globals.openWindow(Alloy.createController("Services/MyServices/winMyServices", data).getView());
				},e.row.messageId, Ti.App.Properties.getString("username"));
		}else{
			Ti.API.info('WHY OTHER RECORDS CAME HERE... ONLY eSERVICES NOTIFICATION COMES HERE');
			return;
		}
		setTimeout(function(){$.viewNotificationMain.animate({opacity : 0,duration : 300}, function(e) {$.viewNotificationMain.visible = false;});},500);
	}
	catch(e){Ti.API.info(' ############# ERROR IN eSERVICES TABLE NOTIFICATION CLICK ############## '+JSON.stringify(e));}
};

/*function setBadgeValue(cntNews, cntEvents, cntFunerals, cntEservices){
	
	// for testing runtime purpose
	// cntNews = 2;
	// cntEvents = 3;
	// cntFunerals = 4;
	// cntEservices = 2;
	// Alloy.Globals.actBadge.hide();
	Ti.API.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<COUNTER VALUES>>>>>>>>>>>>>>>>>>>>>>>>>>>');

	try{
		Ti.API.info('cntNews : '+ cntNews);
		Ti.API.info('cntEvents : '+ cntEvents);
		Ti.API.info('cntFunerals : '+ cntFunerals);
		Ti.API.info('cntEservices : '+ cntEservices);
		Ti.API.info('TOTAL COUNTER ALL: '+ parseInt(cntNews + cntEvents + cntFunerals + cntEservices));
		
		(OS_IOS?Ti.UI.iPhone.setAppBadge(parseInt(cntNews + cntEvents + cntFunerals + cntEservices)):Ti.API.info('!...!'));
		
		if (cntNews ==0 && cntEvents==0 && cntFunerals==0 && cntEservices==0){
			Alloy.Globals.NotificationCounterNews.visible=false;
			Alloy.Globals.NotificationCounterEvents.visible=false;
			Alloy.Globals.NotificationCounterFunerals.visible=false;
			// Alloy.Globals.AllNotificationLabelCounter.visible=false;
			
			if (Alloy.Globals.currentWindow=="winHome"){
				Ti.API.info('U R ON HOME SCREEN..1111'+ Alloy.Globals.currentWindow);
				$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
			}
			else{
				Alloy.Globals.AllNotificationLabelCounter.visible=false;
				
				$.lblEmptyNotifications.visible=true;
				$.lblEmptyNotifications.text = Alloy.Globals.selectedLanguage.no_notification;
			}
		}
		else
		{
			if (cntNews==0){
				Alloy.Globals.NotificationCounterNews.visible=false;
			}
			else{
				Alloy.Globals.NotificationCounterNews.visible=true;
				Alloy.Globals.NotificationCounterNews.children[0].text = cntNews;
			}
			if (cntEvents==0){
				Alloy.Globals.NotificationCounterEvents.visible=false;
			}
			else{
				Alloy.Globals.NotificationCounterEvents.visible=true;
				Alloy.Globals.NotificationCounterEvents.children[0].text = cntEvents;
			}
			if (cntFunerals==0){
				Alloy.Globals.NotificationCounterFunerals.visible=false;
			}
			else{
				Alloy.Globals.NotificationCounterFunerals.visible=true;
				Alloy.Globals.NotificationCounterFunerals.children[0].text = cntFunerals;
			}
			
			if (cntEservices==0){
				if (Alloy.Globals.currentWindow=="winHome"){
					Ti.API.info('U R ON HOME SCREEN..22222'+ Alloy.Globals.currentWindow);
					$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
				}
				else{
					Alloy.Globals.AllNotificationLabelCounter.visible=false;
				}
			}
			else{
				if (Alloy.Globals.currentWindow=="winHome"){
					Ti.API.info('U R ON HOME SCREEN..33333'+ Alloy.Globals.currentWindow);
					$.viewNotificationMain.setNotificationLabel({counterValue:cntEservices});
				}
				else{
					Alloy.Globals.AllNotificationLabelCounter.visible=true;
					Alloy.Globals.AllNotificationLabelCounter.children[0].text = cntEservices;
				}
			}
		}
	}
	catch(e){
		Ti.API.info('Error in setting badge counter'+JSON.stringify(e));
	}
};*/
