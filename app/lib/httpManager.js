var utilities = require('utilities');

var ServerUsername = "uaqdev"; 
var ServerPassword = "welcome1";

/**
 * Function to check the internet connection
 */
function hasConnection() {
	if (Ti.Network.online == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return false;
	}
	return true;
}

/**
 * Get language code
 */
function getLanguageCode() {
	var langCode;
	if (Alloy.Globals.isEnglish) {
		langCode = "EN";
	} else {
		langCode = "AR";
	}
	return langCode;
}

/**
 * Utility function for formating xml data if need to change (Some times Web service return &lt for < for need to replace it with correct sign)
 * @param {String} str
 */
var getXMLFormate = function(str) {
	if (str == undefined || str == null) {
		str = "";
	}
	str = str.replace(/&lt;/g, "<");
	str = str.replace(/&gt;/g, ">");
	str = str.replace(/&amp;/g, "&");
	str = str.replace(/> </g, "><");
	str = str.replace(/>  </g, "><");
	str = str.replace(/>   </g, "><");
	return str;
};

/**
 *  Get httpclient
 * @param {String} url
 */
function getHttpClient(url) {
	url = encodeURI(url);
	var request = Titanium.Network.createHTTPClient();
	request.open("GET", url);
	request.timeout = 15000;
	/* in milliseconds */
	Ti.API.info("Accesing url : " + url);
	return request;
}

var username = "uaqwebserviceuser";
var password = "uaqwebserviceuser";

function getHttpClientWithHeader(url) {
	url = encodeURI(url);
	var request = Titanium.Network.createHTTPClient();
	request.open("GET", url);
	request.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(username + ':' + password));
	request.timeout = 40000;

	Ti.API.info("Accesing url : " + url);
	return request;
}

function getPostHttpClientWithHeader(url) {
	url = encodeURI(url);
	var request = Titanium.Network.createHTTPClient();
	request.open("POST", url);
	request.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(username + ':' + password));
	request.timeout = 40000;

	Ti.API.info("Accesing url : " + url);
	return request;
}

function getPostHttpHeaderautherization() {
	
	var messageAuth;
	
	messageAuth  = '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
    messageAuth += '<wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
    messageAuth += '<wsse:Username>uaqdev</wsse:Username>';
    messageAuth += '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">welcome1</wsse:Password>';
    messageAuth += '</wsse:UsernameToken>';
    messageAuth += '</wsse:Security>';
	
	return messageAuth;
}


function getRequestUrlParam(param, values) {
	var uri = "";
	for (var i = 0,
	    length = param.length; i < length; i++) {
		if (i == (length - 1)) {
			uri += param[i] + "=" + values[i];

		} else {
			uri += param[i] + "=" + values[i] + "&";
		}
	}
	return uri;
}

function getFormatRequestUrlParam(url, param, values) {
	for (var i = 0,
	    length = param.length; i < length; i++) {
		url = url.replace(param[i], values[i]);
	}
	return url;
}

function getUserToken() {
	if (Ti.App.Properties.hasProperty("isUserLoggedIn") && Ti.App.Properties.getBool("isUserLoggedIn")) {
		var securityToken = Ti.App.Properties.getObject("loggedinUser").SecureToken;
		return "bearer " + securityToken.Token;
	} else
		return "bearer ";
}

var getXMLFormate = function(str) {
	if (str == undefined || str == null) {
		str = "";
	}
	str = str.replace(/&lt;/g, "<");
	str = str.replace(/&gt;/g, ">");
	str = str.replace(/&amp;/g, "&");
	str = str.replace(/> </g, "><");
	str = str.replace(/>  </g, "><");
	str = str.replace(/>   </g, "><");
	return str;
};

exports.getNewsList = function(callBackFunction, pagenumber, recordnumber) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		var url;
		if (Alloy.Globals.isEnglish)
			url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getNews/uaq/en/" + pagenumber + "/" + recordnumber;
		else
			url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getNews/uaq/ar/" + pagenumber + "/" + recordnumber;

		Ti.API.info("==> Url  :" + url);
		var request = getHttpClientWithHeader(url);
		request.onload = function(e) {
			try {
				Ti.API.info("==> getNewsList Response  :" + this.responseText);
				if (this.responseText == null) {
					//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
					callBackFunction(null);
				} else {
					var obj = JSON.parse(this.responseText);
					callBackFunction(obj);
				}
				Alloy.Globals.hideLoading();
			} catch(e) {
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getNewsList)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {

			});
		};
		request.send();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
};

exports.getEventsList = function(callBackFunction, pagenumber, recordnumber) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		var url;
		if (Alloy.Globals.isEnglish)
			url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getEvents/uaq/en/" + pagenumber + "/" + recordnumber;
		else
			url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getEvents/uaq/ar/" + pagenumber + "/" + recordnumber;

		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

		Ti.API.info("==> Url  :" + url);
		var request = getHttpClientWithHeader(url);
		request.onload = function(e) {
			try {
				Ti.API.info("==> getEventsList Response  :" + this.responseText);

				if (this.responseText == null) {
					//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
					callBackFunction(null);
				} else {
					var obj = JSON.parse(this.responseText);
					callBackFunction(obj);
				}
				Alloy.Globals.hideLoading();
			} catch(e) {
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getEventsList)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {

			});
		};
		request.send();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
};

exports.getOverViewDetails = function(callBackFunction) {

	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	var url;
	if (Alloy.Globals.isEnglish) {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/About" + " " + "Umm" + " " + "Al" + " " + "Quwain/uaq/en/";
	} else {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/About" + " " + "Umm" + " " + "Al" + " " + "Quwain/uaq/ar/";
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try {
			Ti.API.info("==> getOverViewDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		} catch(e) {
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getOverViewDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {

		});
	};
	request.send();
};

exports.getRulerDetails = function(callBackFunction) {

	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	var url;
	if (Alloy.Globals.isEnglish) {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/The" + " " + "Ruler/uaq/en/";
	} else {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/The" + " " + "Ruler/uaq/ar/";
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try {
			Ti.API.info("==> getRulerDetails Response  :" + this.responseText);

			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		} catch(e) {
			Ti.API.info('JSON parsing error..(getRulerDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};

exports.getCrownDetails = function(callBackFunction) {

	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	var url;
	if (Alloy.Globals.isEnglish) {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/MobileCrown/uaq/en/";
	} else {
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getContent/MobileCrown/uaq/ar/";
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try {
			Ti.API.info("==> getCrownDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		} catch(e) {
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getCrownDetails)'|+JSON.stringify(e));
			//Alloy.Globals.hideLoading();
		}
	};
	request.onerror = function(e) {
		
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};

exports.getDepartmentDetails = function(callBackFunction) {
	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	var url;
	if (Alloy.Globals.isEnglish)
		url = Alloy.Globals.webserviceUrl + "/uaqws/service/getServicesByDepartment/en/";
	else
		url = Alloy.Globals.webserviceUrl + "/uaqws/service/getServicesByDepartment/ar/";

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try {
			Ti.API.info("==> getDepartmentDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		} catch(e) {
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getDepartmentDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};

exports.getBusinessServicesDetails = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	var url;
	if (Alloy.Globals.isEnglish)
		url = Alloy.Globals.webserviceUrl + "/uaqws/service/getServicesByCategory/en/";
	else
		url = Alloy.Globals.webserviceUrl + "/uaqws/service/getServicesByCategory/ar/";
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try {
			Ti.API.info("==> getBusinessServicesDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		} catch(e) {
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getBusinessServicesDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};

exports.getServicesDetailsInfo = function(callBackFunction, department, id) {
	var siteName = null;
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	if (department == "EGovernment")
		siteName = "egd";
	
else if (department == "Municipality")
		siteName = "mun";
	
else if (department == "EconomicDevelopment")
		siteName = "ded";
	
else if (department == "LandsProperties")
		siteName = "lap";
	
else if (department == "PublicWorksService")
		siteName = "pws";
	
else if (department == "PlanningSurvey")
		siteName = "pas";
	
else if (department == "ArchaeologyHeritage")
		siteName = "aah";
	
else if (department == "FalajMunicipality")
		siteName = "dfm";
	
else if (department == "IndustrialCityAuthority")
		siteName = "ica";
	
else if (department == "PortsCustomsFreeZone")
		siteName = "pcf";
	
else if (department == "ExecutiveCouncil")
		siteName = "dec";
	
else if (department == "FinanceAdministration")
		siteName = "faa";
	
else if (department == "FinancialAuditing")
		siteName = "dfa";
	
else if (department == "UAQInternetPortal")
		siteName = "uaq";

	var url = Alloy.Globals.webserviceUrl + "/uaqws/service/getServiceDetail/" + siteName + "/" + id;
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getServicesDetailsInfo Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		}
		catch(e){
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getServicesDetailsInfo)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};

/*
 * News Details web service : Nikunj
 */
exports.getNewsDetails = function(callBackFunction, subIdVal) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {

		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		// http://94.57.252.237:8080
		var url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getNewsDetail/uaq/" + subIdVal;
		var request = getHttpClientWithHeader(url);
		request.onload = function(e) {
			try{
				Ti.API.info("==> getNewsDetails Response  :" + this.responseText);
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				} else {
					Alloy.Globals.hideLoading();
					var obj = JSON.parse(this.responseText);
					callBackFunction(obj);
				}
			}
			catch(e){
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getNewsDetails)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {
			});
		};
		request.send();
	} catch(e) {
		Ti.API.info(' ERROR IN MAKING CALL OF WEB SERVICE : (getNewsDetails) : ' + JSON.stringify(e));
	}
};
/*
 * Nikunj Event detail
 */
exports.getEventDetails = function(callBackFunction, subIdVal) {

	Ti.API.info(subIdVal);

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		var url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getEventDetails/uaq/" + subIdVal;
		var request = getHttpClientWithHeader(url);
		request.onload = function(e) {
			try{
				Ti.API.info("==> Event Details Response  :" + this.responseText);
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				} else {
					Alloy.Globals.hideLoading();
					var obj = JSON.parse(this.responseText);
					callBackFunction(obj);
				}
			}
			catch(e){
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getEventDetails)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		};
		request.send();
	} catch(e) {
		Ti.API.info(' ERROR IN MAKING CALL OF WEB SERVICE : (getEventDetails) : ' + JSON.stringify(e));
	}
};

/*
 * Nikunj -  Notification: Get all the notifications from server and displayed over there on top right navigationbar
 */

exports.getAllNotifications = function(callBackFunction) {
	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		//var userid = Ti.App.Properties.getObject("LoginDetaisObj");
		//userid = (Ti.App.Properties.getObject("LoginDetaisObj") == null ? 0 : Ti.App.Properties.getObject("LoginDetaisObj").userName);
		
		var username = 0;
		if (Ti.App.Properties.getString("username")!= null){
			username = Ti.App.Properties.getString("username");
		}
		
		//actual implemented URL
		var url = Alloy.Globals.webserviceUrl + "/uaqws/pushnotification/notificationsHistory/" + ( OS_IOS ? Alloy.Globals.DEVICE_TOKEN : Titanium.Platform.id) + "/" + username;

		var request = getHttpClientWithHeader(url);

		request.onload = function(e) {
			try {
				Ti.API.info("Received text: " + this.responseText);
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				}
				// Alloy.Globals.hideLoading();
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			} catch(e) {
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getAllNotifications)');
			}
		};
		request.onerror = function(e) {
			// Alloy.Globals.hideLoading();
			Ti.API.debug(e.error);
			Ti.API.info('Error is : ' + JSON.stringify(e.error));
		};
		request.send();
	} catch(e) {
		Ti.API.info(' Eror in Calling get All Notifications... ' + JSON.stringify(e));
	}
};



exports.getEndPointDetails = function(callback) {
	try {
		
		////////DEVELOPEMENT :::  SIT END POINT URL
		var request = getHttpClientWithHeader("http://94.57.252.237/uaqws/asset/getEndPointDetails/dev/");
		
		////////STAGING:::  UAT END POINT URL
		//var request = getHttpClientWithHeader("https://stg.uaq.ae/uaqws/asset/getEndPointDetails/stg/");
		
		
		// var request = getHttpClientWithHeader("http://83.111.136.9/uaqws/asset/getEndPointDetails/prod/"); //THIS IS FULL URL FOR PROD. - WILL COME
		
		
		//old URL: We are calling this URL to get endpoint (which is on Store)
		//var request = getHttpClientWithHeader("http://83.111.136.2/uaqws/asset/getEndPointDetails/prod/"); //Staging keywords  stg , dev

		request.onload = function(e) {
			try {
				Ti.API.info("==> getEndPointDetails Response  :" + this.responseText);
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					return;
				} else {
					callback(JSON.parse(this.responseText));
				}
			} catch(e) {
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(getEndPointDetails)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
				utilities.showAlert("Error", "The service is currently unavailable. Please try again later.", function() {
			});
		};
		request.send();
	} catch(e) {
		Ti.API.info('ERROR IN GET END POINT URLs web service' + JSON.stringify(e));
	}
};

/*
 * Nikunj : Mark Notification(s) message as Read
 */
function markNotificationMessageAsRead(callBackFunction, Ids, username) {
	Ti.API.info(' IDSSSS:: ' + Ids);
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		//1: Delivered
		//2: Un Read
		//3: READ
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		
		// LIVE IP - URL
		var url = Alloy.Globals.webserviceUrl + "/uaqws/pushnotification/markNotification/" + ( OS_IOS ? Alloy.Globals.DEVICE_TOKEN : Titanium.Platform.id) + //devicetoken/UDID
												"/" + Ids +  //notificationTypeIdVal/messageId/mid
												"/0"+ //notificationType
												"/" + username + "/3";  //0: username and 3 : Mark as Read
		
		var request = getHttpClientWithHeader(url);

		request.onload = function(e) {
			try {
				Alloy.Globals.hideLoading();
				Ti.API.info("Received text:  MARK AS READ:: " + this.responseText);
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Ti.API.info("Unable to mark notification messages as Read ...!");
					return;
				}
				var parsedData = JSON.parse(this.responseText);
				if (parsedData.status == 'success') {
					callBackFunction('1');
				} else {
					callBackFunction('0');
				}
			} catch(e) {
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(markNotificationMessageAsRead)');
			}
		};
		request.onerror = function(e) {
			Alloy.Globals.hideLoading();
			Ti.API.debug(e.error);
		};
		request.send();
	} catch(e) {
		Ti.API.info(' Eror in Calling markNotificationMessageAsRead Web service... ' + JSON.stringify(e));
	}
};
exports.markNotificationMessageAsRead = markNotificationMessageAsRead;
/*
 * Nikunj : Set Notification service, user can set notification On / Off from Left Panel Push Notification toggeling button
 */

exports.updateNotificationSetting = function(isPushOn, callback) {
	try {
		if (hasConnection() == false) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
			return;
		}

		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		Ti.API.info(' is Push On: ? ' + isPushOn);

		//URL format
		//http://94.57.252.246:8080/pushnotification/subscription/{deviceuid}/{flag}

		//LIVE IP - URL
		var url = Alloy.Globals.webserviceUrl + "/uaqws/pushnotification/subscription/" + ( OS_IOS ? Alloy.Globals.DEVICE_TOKEN : Titanium.Platform.id) + "/" + isPushOn;

		// Raheem local IP - For Testing
		// var url = "http://192.168.1.85:8080/uaqws/pushnotification/subscription/" + (OS_IOS?Alloy.Globals.DEVICE_TOKEN:Titanium.Platform.id) + "/" + isPushOn;

		var request = getHttpClientWithHeader(url);

		request.onload = function(e) {
			try{
				Alloy.Globals.hideLoading();
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				}
				var parsedData = JSON.parse(this.responseText);
				callback(parsedData);
			}
			catch(e){
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(updateNotificationSetting)');
			}
		};
		request.onerror = function(e) {
			Alloy.Globals.hideLoading();
			Ti.API.debug(e.error);
			Ti.API.info('Error is : ' + JSON.stringify(e.error));
		};
		request.send();
	} catch(e) {
		Ti.API.info('ERORR IN MAKING CALL FOR updateNotificationSetting : ' + JSON.stringify(e));
	}
};

/*
 * Nikunj : CaLL  after successfull login of user into app , aim is to getting eServices base push notifications
 */
exports.updateRegistrationWithUser = function(callbackFunction, username) {
	try {
		if (hasConnection() == false) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
			return;
		}

		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

		var url = Alloy.Globals.webserviceUrl + "/uaqws/pushnotification/updateRegistration/" + ( OS_IOS ? Alloy.Globals.DEVICE_TOKEN : Titanium.Platform.id) + "/" + username;

		var request = getHttpClientWithHeader(url);

		request.onload = function(e) {
			try{
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				}
				Alloy.Globals.hideLoading();
				var parsedData = JSON.parse(this.responseText);
				callbackFunction(parsedData);
			}
			catch(e){
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(updateNotificationSetting)');
			}
		};
		request.onerror = function(e) {
			Alloy.Globals.hideLoading();
			Ti.API.debug(e.error);
			utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.serviceError);
		};
		request.send();
	} catch(e) {
		Ti.API.info('ERROR IN updateRegistrationWithUser web service' + JSON.stringify(e));
	}
};

//// Getting All suggestion categories
exports.getAllSuggestion = function(callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		
		// URL for Get All Suggestions
		var url = Alloy.Globals.webserviceUrl+ "/uaqws/mySuggestion/getAllSuggestionCategory/1";
		
		Ti.API.info('FULL URL for GET ALL SUGGESTION: ' + url);

		var request = getHttpClientWithHeader(url);
		var suggestionData = [];
		request.onload = function(e) {
			try{
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to get data from server for notification history...!");
					return;
				}
				Alloy.Globals.hideLoading();
				var parsedData = JSON.parse(this.responseText);
				var suggestionData = [];
				if (parsedData.statusCode == "SUCCESS"){
					Ti.API.info('Category Length: '+parsedData.categoryList.length);
					
					if (parsedData.count == 0)
						return;
					
					for (var i = 0; i < parsedData.categoryList.length; i++) {
						suggestionData.push({
							"categoryId" : parsedData.categoryList[i].categoryId,
							"categoryName_en" : parsedData.categoryList[i].categoryNameEn,
							"categoryName_ar" : parsedData.categoryList[i].categoryNameAr
						});
					}
					callBackFunction(suggestionData);
				}
				else{
					Ti.API.info('SERVICE FAILURE RESPONSE');
				}
			}
			catch(e){
				Alloy.Globals.hideLoading();
				Ti.API.info('JSON parsing error..(updateNotificationSetting)');
			}
		};
		request.onerror = function(e) {
			Alloy.Globals.hideLoading();
			Ti.API.debug(e.error);
			utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.serviceError);
		};
		request.send();
		
	} 
	catch(e) {
		Ti.API.info('ERROR IN MAKING CALL OF WEB SERVICE : (getAllSuggestion) : ' + JSON.stringify(e));
	}
};

//// Send uplaoded photo server from Suggestion 
exports.sendUploadedPhotoToServer = function(callBackFunction, objPhotoData) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

		var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_DocumentUpload_Download_Ser/uaq_upload_download_service_client_ep?WSDL";
		
		var params = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:upl="http://xmlns.oracle.com/UAQBusinessProcess/UAQ_DocumentUpload_Download_Ser/Upload_DownloadBpel">';
		params += '<soapenv:Header>';
        params += getPostHttpHeaderautherization();
        params += '</soapenv:Header>';
		params += '<soapenv:Body>';
		params += '<upl:UploadInput>';
        params += '<upl:DocName>' + 'Suggestionphoto' + String(new Date().getTime()) + '</upl:DocName>';
        params += '<upl:DocTitle>' + 'PhotoTitle' + String(new Date().getTime()) + '</upl:DocTitle>';
        params += '<upl:DocType>Document</upl:DocType>';
        params += '<upl:DocSecurityGroup>Public</upl:DocSecurityGroup>';
        params += '<upl:AuthorName>uaqdev</upl:AuthorName>';
        params += '<upl:FileList>';
        params += '<upl:FileRecord>';
        params += '<upl:Filename>' + String(new Date().getTime()) + ".jpg" + '</upl:Filename>';
        params += '<upl:FileContent>' + objPhotoData.data + '</upl:FileContent>';
        params += '</upl:FileRecord>';
        params += '</upl:FileList>';
        params += '</upl:UploadInput>';
      	params += '</soapenv:Body>';
		params += '</soapenv:Envelope>';

		Ti.API.info(' FULL URL FOR UPLOADING PHOTO... '+url+params);

		var request = Ti.Network.createHTTPClient();
		request.timeout = 150000;
		request.onload = function(e) {
			
			var result = this.responseXML;
			var ns = "http://xmlns.oracle.com/UAQBusinessProcess/UAQ_DocumentUpload_Download_Ser/Upload_DownloadBpel";
			
			try {
				Ti.API.info(' REQUEST :: ' + JSON.stringify(objPhotoData));
				Ti.API.info('PHOTO UPLOAD RESPONSE ------- Stamp XML ' + this.responseXML + ' text ' + this.responseText);
				
				Ti.API.info('PARSED XML DATA (PHOTO UPLAOD)==>> ' + result);
				if (result.getElementsByTagNameNS(ns, 'Status').item(0).textContent === "Success") {
					var uploadDocList = {
						status : result.getElementsByTagNameNS(ns, "Status").item(0).textContent,
						did : result.getElementsByTagNameNS(ns, "Did").item(0).textContent,
						message_En : result.getElementsByTagNameNS(ns, "Message_En").item(0).textContent,
						message_Ar : result.getElementsByTagNameNS(ns, "Message_Ar").item(0).textContent,
						attachmentType : objPhotoData.docTitle,
						mediaFileName : objPhotoData.filename,
					};
					callBackFunction(uploadDocList);
					if (objPhotoData.docType == "Document") {
						Alloy.Globals.hideLoading();
					}
				} else {
					var alert = Ti.UI.createAlertDialog({
						title : Alloy.Globals.selectedLanguage.appTitle,
						message : (Alloy.Globals.isEnglish) ? result.getElementsByTagName(ns, "Message_En").item(0).textContent : result.getElementsByTagName(ns, "Message_Ar").item(0).textContent,
						buttonNames : [Alloy.Globals.selectedLanguage.ok]
					});
					alert.show();
					Alloy.Globals.hideLoading();
					callBackFunction(null);
				}
				// Ti.API.info('RECEIVED UPLAODED PHOTO ID: ' + photoId);
			} catch(e) {
				Alloy.Globals.hideLoading();
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.photo_upload_failed);
				Ti.API.info('JSON parsing error..(sendUploadedPhotoToServer)');
			}
		};
		request.onerror = function(e) {
			Alloy.Globals.hideLoading();
			// callBackFunction("error");
			utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.serviceError);
		};
		request.open("POST", url);
		request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		// request.setRequestHeader("SOAPAction", ""); 
		
		request.send(params);
	} catch(e) {
		Ti.API.info('ERROR IN MAKING CALL OF WEB SERVICE : (getAllSuggestion) : ' + JSON.stringify(e));
	}
};

////// SENd my Suggestion filling data
exports.sendMySuggestion = function(callBackFunction, formData) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	try {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

		var url = Alloy.Globals.webserviceUrl + "/uaqws/mySuggestion/sendMySuggestion/";

		var request = getPostHttpClientWithHeader(url);
		request.onload = function(e) {
			try{
				if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
					Alloy.Globals.hideLoading();
					Ti.API.info("Unable to submit Suggestions...!");
					return;
				} else {
					var obj = JSON.parse(this.responseText);
					Ti.API.info('RESPONSE: '+ JSON.stringify(obj));
					if (obj.status == "SUCCESS") {
						callBackFunction("1");
					} else {
						callBackFunction("0");
					}
				}
				Alloy.Globals.hideLoading();	
			}
			catch(e){
				Ti.API.info('JSON parsing error...(submitRating)');
			}
		};
		request.onerror = function(e) {
			Titanium.API.error('Status: ' + this.status);
			Titanium.API.error('ResponseText: ' + this.responseText);
			Titanium.API.error('connectionType: ' + this.connectionType);
			Titanium.API.error('location: ' + this.location);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {
			});
		};
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(formData));
	} catch(e) {
		Ti.API.info('ERROR IN MAKING CALL OF WEB SERVICE : (sendSuggestion) : ' + JSON.stringify(e));
	}
};


/*
 * Nikunj :  Send device token to server
 */

exports.sendDeviceTokenToServer = function(url) {
	try {
		var request = getHttpClientWithHeader(url);
		request.onload = function(e) {
			try {
				if (this.responseText) {
					Ti.API.info(' RESPONSE OF SENDING DEVICE TOKEN TO SERVER  : ' + this.responseText);
					var parsedData = JSON.parse(this.responseText);
					if (parsedData.status == "success") {
						Ti.App.Properties.setString('deviceToken', Alloy.Globals.DEVICE_TOKEN);
						/* No need bcoz server can handle with this web service... 
						 markNotificationMessageAsRead(function() {
							Ti.API.info('............RESET (MARK AS READ) THIS DEVICE ALL PUBLIC NOTIFICATION................');
						}, null, true);*/
					} else {
						Ti.App.Properties.setString('deviceToken', null);
					}
				} else {
					Ti.API.info('Failed in response to send device token to server');
					Ti.App.Properties.setString('deviceToken', null);
				}
			} catch(e) {
				Ti.App.Properties.setString('deviceToken', null);
				Ti.API.info(' Error in making call of sending device token to server..' + JSON.stringify(e));
			}
		};
		request.onerror = function(e) {
			Ti.API.debug(e.error);
			utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.serviceError);
		};
		request.send();
	} catch(e) {
		Ti.API.info('ERROR IN SENDING DEVIVE TOKEN TO SERVER web service' + JSON.stringify(e));
	}
};

/*
 * Changes by Ravindra.
 */
exports.forgetPassword = function(callback, user, uname, mobile, emiratespassport) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_ForgetPassword/checkforgetpasswordaccountvaliditybpel_client_ep";
	
	
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:for="http://ForgetPassword">';
	message += '<soapenv:Header>';
	message += getPostHttpHeaderautherization();
	message += '</soapenv:Header>';
	message += '<soapenv:Body>';

	message += '<for:Input>';
	message += '<for:UserDetails>';
	if (user === 1) {
		message += '<for:ApplicantUserDetails>';
		message += '<for:EmiritesID>' + emiratespassport + '</for:EmiritesID>';
		message += '<for:Username>' + uname + '</for:Username>';
		//<for:PassportNo>?</for:PassportNo>
		message += '<for:MobileNo>' + mobile + '</for:MobileNo>';
		message += '</for:ApplicantUserDetails>';
	} else if (user === 2) {
		message += '<for:EstablishmentUserDetails>';
		message += '<for:TradeLicenseNo>' + emiratespassport + '</for:TradeLicenseNo>';
		message += '<for:Username>' + uname + '</for:Username>';
		message += '<for:MobileNo>' + mobile + '</for:MobileNo>';
		message += '</for:EstablishmentUserDetails>';
	}
	message += '</for:UserDetails>';
	message += '<for:TypeOfUser>' + user + '</for:TypeOfUser>';
	message += '</for:Input>';
	message += '</soapenv:Body></soapenv:Envelope>'; 


	Ti.API.info('FORGOT PASSWORD : ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		try{
			var response = this.responseXML;
			//var response2 = this.responseXML;
			//Ti.API.info('authentication data  this.responseText==>> ' + JSON.stringify(response));
			//var result;
			/*try {
				result = Ti.XML.parseString(response);
				
			} catch(e) {
				//alert('Error');
				Ti.API.info("Error");
			}*/
			callback(response);
		}
		catch(e){
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(forgetPassword)');
		}
	};

	request.onerror = function(e) {
		Ti.API.info('JSON parsing error..(forgetPassword)');
		var alert = Ti.UI.createAlertDialog({
			title : Alloy.Globals.selectedLanguage.appTitle,
			message : Alloy.Globals.selectedLanguage.serviceError,
			buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		alert.show();
		Alloy.Globals.hideLoading();
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);
};

exports.forgetUsername = function(callback, user, email, mobile, emiratespassport) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_ForgetUserName/forgetusernamebpel_client_ep";
	
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:for="http://ForgetUserName">';
	message += '<soapenv:Header>';
	message += getPostHttpHeaderautherization();
	message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<for:Input>';
    message += '<for:UserDetails>';
    if (user === 1) {
    message += '<for:ApplicantUserDetails>';
    message += '<for:EmiritesID>' + emiratespassport + '</for:EmiritesID>';
    //message += '<for:PassportNo>?</for:PassportNo>';
    message += '<for:EmailAddress>' + email + '</for:EmailAddress>';
    message += '<for:MobileNo>' + mobile + '</for:MobileNo>';
    message += '</for:ApplicantUserDetails>';
    } else if (user === 2) {
    message += '<for:EstablishmentUserDetails>';
    message += '<for:TradeLicenseNo>' + emiratespassport + '</for:TradeLicenseNo>';
    message += '<for:EmailAddress>' + email + '</for:EmailAddress>';
    message += '<for:MobileNo>' + mobile + '</for:MobileNo>';
    message += '</for:EstablishmentUserDetails>';
    }
    message += '</for:UserDetails>';
    message += '<for:TypeOfUser>' + user + '</for:TypeOfUser>';
    message += '</for:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		try{
			//var response = this.responseText;
			var response2 = this.responseXML;
			var result;
			/*try {
				result = Ti.XML.parseString(response);
			} catch(e) {
				//alert('Error');
				Ti.API.info("Error");
			}*/
			callback(response2);
		}
		catch(e){
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(forgetUsername)');
		}
	};
	request.onerror = function(e) {
		var alert = Ti.UI.createAlertDialog({
			title : Alloy.Globals.selectedLanguage.appTitle,
			message : Alloy.Globals.selectedLanguage.serviceError,
			buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		alert.show();
		Alloy.Globals.hideLoading();
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);

};

exports.userLogin = function(username, password, callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	
	//var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQServiceMiddleLayer/RegistrationServicePort";
	
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl +"/soa-infra/services/default/UAQ_REG_UserLogin!1.0*soa_a8a671c8-22c9-4bd8-9bec-96c4cd6ad027/userloginbpel_client_ep?WSDL";
	
    var message;
    message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://UserLogin">';
    message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
    message += '<soapenv:Body>';
    message += '<user:Input>';
    message += '<user:LoginUsername>' + username + '</user:LoginUsername>';
    message += '<user:Password>' + password + '</user:Password>';
    message += '</user:Input>';
    message += '</soapenv:Body>';
    message += '</soapenv:Envelope>';
   
	Ti.API.info('authentication data  this.responseText==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 45000;
	request.onload = function(e) {
		//var response = this.responseText;
		
		var response2 = this.responseXML;
		
		Ti.API.info('authentication data  this.responseText==>> ' + this.responseText);
		
		//var result;
		/*try {
			
			result = Ti.XML.parseString(this.responseText);
			Ti.API.info('authentication data  this.responseText==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}*/
		
		var ns = "http://UserLogin";
		var rootNode = response2.getElementsByTagName("Output");
		
		Ti.API.info('status ' + response2.getElementsByTagNameNS(ns, "Status").item(0).textContent);
			
		if (rootNode.length > 0) {
			var status = response2.getElementsByTagNameNS(ns,"Status").item(0).text;
			var authenticate = response2.getElementsByTagNameNS(ns,"AuthenticationTokenData");
			Ti.API.info('authentication data ==>> ' + status);
			if (status === "Success" && authenticate.length > 0) {
				var tokenParse = response2.getElementsByTagNameNS(ns,"AuthenticationTokenData").item(0);
				Alloy.Globals.userInfo = true;
				//Alloy.Globals.openWindow(Alloy.createController('common/winMenuSelection').getView());
				var tokenObject = {
					tokenCode : tokenParse.getElementsByTagNameNS(ns,"TokenCode").item(0).textContent,
					userName : tokenParse.getElementsByTagNameNS(ns,"Username").item(0).textContent,
					accountID : tokenParse.getElementsByTagNameNS(ns,"AcountId").item(0).textContent,
					status : tokenParse.getElementsByTagNameNS(ns,"Status").item(0).textContent,
					typeOfuser : tokenParse.getElementsByTagNameNS(ns,"TypeOfUser").item(0).textContent,
					createdDate : tokenParse.getElementsByTagNameNS(ns,"CreatedDate").item(0).textContent,
					lastUpdatedDate : tokenParse.getElementsByTagNameNS(ns,"LastUpdatedDate").item(0).textContent,
					username : username,
					password : password
				};

				callBackFunction(tokenObject);

				//Ti.App.Properties.setObject("LoginDetaisObj", tokenObject);
				//Ti.API.info('authentication data  pint stored setobject==>> ' + Ti.App.Properties.getObject("LoginDetaisObj").tokenCode);

			} else if (status === "Failure") {
				Alloy.Globals.hideLoading();
				callBackFunction(null);
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? response2.getElementsByTagNameNS(ns,"Message_EN").item(0).text : response2.getElementsByTagNameNS(ns,"Message_AR").item(0).text,
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			}
		} else {
			
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);

		}

	};

	request.onerror = function(e) {
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);

	//return Alloy.Globals.userLoginNode;
};

exports.userLogout = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_UserLogout/userlogoutbpel_client_ep";
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://UserLogout">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>'; 
	message += '<user:Input>';
    message += '<user:AuthenticationTokenData>';
    message += '<user:TokenCode>' + Ti.App.Properties.getObject("LoginDetaisObj").tokenCode + '</user:TokenCode>';
    message += '<user:Username>' + Ti.App.Properties.getObject("LoginDetaisObj").userName + '</user:Username>';
    message += '<user:AcountId>' + Ti.App.Properties.getObject("LoginDetaisObj").accountID + '</user:AcountId>';
    message += '<user:Status>' + Ti.App.Properties.getObject("LoginDetaisObj").status + '</user:Status>';
    message += '<user:TypeOfUser>' + Ti.App.Properties.getObject("LoginDetaisObj").typeOfuser + '</user:TypeOfUser>';
    message += '<user:CreatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").createdDate + '</user:CreatedDate>';
    message += '<user:LastUpdatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").lastUpdatedDate + '</user:LastUpdatedDate>';
    message += '</user:AuthenticationTokenData>';
    message += '</user:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('logout request' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;
		//var result;
		
		/*try {
			result = Ti.XML.parseString(response);
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}*/
		Ti.API.info('logout responce data==>> ' + result);
		var ns = "http://UserLogout";
		var rootNode = result.getElementsByTagName("Output");
		var subNode = result.getElementsByTagNameNS(ns, "Status");

		if (rootNode.length > 0 && subNode.length > 0) {
			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;
			if (status === "Success") {
				Alloy.Globals.userInfo = false;
				Ti.App.Properties.setObject("LoginDetaisObj", null);
				callBackFunction("Success");

			} else if (status === "Failure") {
				callBackFunction("Failure");
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
			}
		} else {
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);
};

exports.userValidation = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_ValidateAuthenticationToken/validateauthenticationtokenbpel_client_ep";
	
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:val="http://ValidateAuthenticationToken">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<val:Input>';
    message += '<val:ServiceID>?</val:ServiceID>';
    message += '<val:AuthenticationTokenData>';
    message += '<val:TokenCode>' + Ti.App.Properties.getObject("LoginDetaisObj").tokenCode + '</val:TokenCode>';
    message += '<val:Username>' + Ti.App.Properties.getObject("LoginDetaisObj").userName + '</val:Username>';
    message += '<val:AcountId>' + Ti.App.Properties.getObject("LoginDetaisObj").accountID + '</val:AcountId>';
    message += '<val:Status>' + Ti.App.Properties.getObject("LoginDetaisObj").status + '</val:Status>';
    message += '<val:TypeOfUser>' + Ti.App.Properties.getObject("LoginDetaisObj").typeOfuser + '</val:TypeOfUser>';
    message += '<val:CreatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").createdDate + '</val:CreatedDate>';
    message += '<val:LastUpdatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").lastUpdatedDate + '</val:LastUpdatedDate>';
    message += '</val:AuthenticationTokenData>';
    message += '</val:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('validation request' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		
		var result = this.responseXML;
		
		var ns ="http://ValidateAuthenticationToken";
		
		try {
			
			var rootNode = result.getElementsByTagName("Output");
		    var subNode = result.getElementsByTagNameNS(ns,"Status");
		    
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}
		Ti.API.info('validation responce data==>> ' + result);

		
		
		if (rootNode.length > 0 && subNode.length > 0) {
			
			var status = result.getElementsByTagNameNS(ns,"Status").item(0).textContent;
			if (status == "Success") {
				var authentication = result.getElementsByTagNameNS(ns,"AuthenticationTokenData").item(0);
				var status = authentication.getElementsByTagNameNS(ns,"Status").item(0).textContent;
				callBackFunction(status);
				Alloy.Globals.hideLoading();
			} else if (status === "Failure") {
				callBackFunction("Failure");
				Alloy.Globals.hideLoading();
			}
			
		} else {
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);
};

/*
 * Changes by Ravindra.
 */

/*
 * Dharma - About : get all department details list
 */

exports.getAboutDepartmentDetails = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	var url;
	if (Alloy.Globals.isEnglish)
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getDepartments/uaq/en/";
	else
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getDepartments/uaq/ar/";

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getAboutDepartmentDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		}
		catch(e){
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(getAboutDepartmentDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {
		});
	};
	request.send();
};

/*
* Changes by bru.
*/
//Create soap envelop body for all web service depends on requirement

exports.getUserAccountDetails = function(callBackFunction) {
	Ti.API.info("-----user object");
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	// Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_GetAccountDetailsFrmAuthToken/getaccountdetailsfrmauthtokenbpel_client_ep?WSDL";

	//var param1 = ["get:TokenCode", "get:Username", "get:AcountId", "get:Status", "get:TypeOfUser", "get:CreatedDate", "get:LastUpdatedDate"];
	//var values1  = [Ti.App.Properties.getObject("LoginDetaisObj").tokenCode, obj.emiratesID, obj.passportID];

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:get="http://GetAccountDetailsFrmAuthToken">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<get:Input>';
    message += '<get:AuthenticationTokenData>';
    message += '<get:TokenCode>' + Ti.App.Properties.getObject("LoginDetaisObj").tokenCode + '</get:TokenCode>';
    message += '<get:Username>' + Ti.App.Properties.getObject("LoginDetaisObj").userName + '</get:Username>';
    message += '<get:AcountId>' + Ti.App.Properties.getObject("LoginDetaisObj").accountID + '</get:AcountId>';
    message += '<get:Status>' + Ti.App.Properties.getObject("LoginDetaisObj").status + '</get:Status>';
    message += '<get:TypeOfUser>' + Ti.App.Properties.getObject("LoginDetaisObj").typeOfuser + '</get:TypeOfUser>';
    message += '<get:CreatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").createdDate + '</get:CreatedDate>';
    message += '<get:LastUpdatedDate>' + Ti.App.Properties.getObject("LoginDetaisObj").lastUpdatedDate + '</get:LastUpdatedDate>';
    message += '</get:AuthenticationTokenData>';
    message += '</get:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	//Ti.API.info('soap request OTP generate ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		//Ti.API.info('user Details parsing==>> ' + JSON.stringify(this.responseXML));
		/*var result;
		try {
			result = Ti.XML.parseString(response);

			//Ti.API.info('user Details parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}*/
        var ns = "http://GetAccountDetailsFrmAuthToken";
        
		var rootNode = result.getElementsByTagName("Output");

		var subNode = result.getElementsByTagNameNS(ns, "AccountDetailsREC");

		var userDetails = [];
		if (rootNode.length > 0 && subNode.length > 0) {
			var actDetailData = result.getElementsByTagNameNS(ns, "AccountDetailsREC").item(0);
			var account_details_obj = {
				id : actDetailData.getElementsByTagNameNS(ns, "id").item(0).textContent,
				//emiratesId : actDetailData.getElementsByTagName("uaq:emiratesId").item(0).textContent,
				mobileNo : actDetailData.getElementsByTagNameNS(ns, "mobileNo").item(0).textContent,
				//tradeLienceNo : actDetailData.getElementsByTagName("uaq:tradeLienceNo").item(0).textContent,
				firstName : actDetailData.getElementsByTagNameNS(ns, "firstName").item(0).textContent,
				//dob : actDetailData.getElementsByTagName("uaq:dob").item(0).textContent,
				emailAddress : actDetailData.getElementsByTagNameNS(ns, "emailAddress").item(0).textContent,
				//addressline1 : actDetailData.getElementsByTagName("uaq:addressline1").item(0).textContent,
				//emirate : actDetailData.getElementsByTagName("uaq:emirate").item(0).textContent,
				//postbox : actDetailData.getElementsByTagName("uaq:postbox").item(0).textContent,
				languageId : actDetailData.getElementsByTagNameNS(ns, "languageId").item(0).textContent,
				//nationalityId : actDetailData.getElementsByTagName("uaq:nationalityId").item(0).textContent,
				//emiratesCode : actDetailData.getElementsByTagName("uaq:emiratesCode").item(0).textContent,
				typeOfUser : actDetailData.getElementsByTagNameNS(ns, "typeOfUser").item(0).textContent,
				//eidaExpiryDate : actDetailData.getElementsByTagName("uaq:eidaExpiryDate").item(0).textContent,
				//passportNo : actDetailData.getElementsByTagName("uaq:passportNo").item(0).textContent,
				applicanttypeid : actDetailData.getElementsByTagNameNS(ns, "applicanttypeid").item(0).textContent,
				//subcribetonewsletterflag : actDetailData.getElementsByTagName("uaq:subcribetonewsletterflag").item(0).textContent,
				//countryidofcitizenshipid : actDetailData.getElementsByTagName("uaq:countryidofcitizenshipid").item(0).textContent,
				//countryidofresidencyid : actDetailData.getElementsByTagName("uaq:countryidofresidencyid").item(0).textContent,
				//hasfamilybookno : actDetailData.getElementsByTagName("uaq:hasfamilybookno").item(0).textContent
			};
			var userData = result.getElementsByTagNameNS(ns, "UserDetailsREC").item(0);
			var user_Details_obj = {
				userName : userData.getElementsByTagNameNS(ns, "userName").item(0).textContent,
				accountId : userData.getElementsByTagNameNS(ns, "accountId").item(0).textContent,
				mobileNo : userData.getElementsByTagNameNS(ns, "mobileNo").item(0).textContent,
				emailAddress : userData.getElementsByTagNameNS(ns, "emailAddress").item(0).textContent,
				accountStatusId : userData.getElementsByTagNameNS(ns, "accountStatusId").item(0).textContent,
				loginusername : userData.getElementsByTagNameNS(ns, "loginusername").item(0).textContent
			};
			var userDetails = {
				account_details : account_details_obj,
				user_Details : user_Details_obj
			};

			Ti.API.info('soap responce user details  ==>> ' + JSON.stringify(userDetails));
			callBackFunction(userDetails);
		} else {
			Alloy.Globals.hideLoading();
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}

		// Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		//callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);
};

exports.getTradeLicenseType = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findTradelicensetypeLookupsView1";

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findTradelicensetypeLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:fetchStart>0</ns2:fetchStart><ns2:fetchSize>-1</ns2:fetchSize><ns2:filter>';
	message += '<ns2:conjunction>And</ns2:conjunction><ns2:group><ns2:conjunction>And</ns2:conjunction>';
	message += '<ns2:upperCaseCompare>false</ns2:upperCaseCompare><ns2:item>';
	message += '<ns2:conjunction>And</ns2:conjunction><ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	message += '<ns2:attribute>Isactive</ns2:attribute><ns2:operator>=</ns2:operator><ns2:value>1</ns2:value>';
	message += '</ns2:item></ns2:group></ns2:filter>';
	message += '<ns2:findAttribute>TradelicensetypeEn</ns2:findAttribute>';
	message += '<ns2:findAttribute>TradelicensetypeAr</ns2:findAttribute>';
	message += '<ns2:findAttribute>Tradelicensetypeid</ns2:findAttribute>';
	message += '<ns2:excludeAttribute>false</ns2:excludeAttribute>';
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl></ns1:findTradelicensetypeLookupsView1>';
	message += '</soap:Body></soap:Envelope>';

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = this.responseText;
		Ti.API.info('nation list response data==>> ' + this.responseText);
		var result;
		try {
			result = Ti.XML.parseString(response);
			//Ti.API.info(result + 'nation list data  after parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:TradelicensetypeEn");
		Ti.API.info('emirates list length==>> ' + rootNode.length);
		var arrTradeLicenseList = [];
		if (rootNode.length > 0) {

			for (var i = 0; i < rootNode.length; i++) {
				Ti.API.info('emirates list data ==>> ' + result.getElementsByTagName("uaq:TradelicensetypeEn").item(i).textContent);
				arrTradeLicenseList.push({
					title : result.getElementsByTagName("uaq:TradelicensetypeEn").item(i).textContent,
					titleAr : result.getElementsByTagName("uaq:TradelicensetypeAr").item(i).textContent,
					id : result.getElementsByTagName("uaq:Tradelicensetypeid").item(i).textContent,
				});
			}

			callBackFunction(arrTradeLicenseList);
		} else {
			Alloy.Globals.hideLoading();
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);

};
// export.getEmiratesLoopup = function(callBackFunction) {

exports.getEmiratesLookUp = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findEmirateLookupsView1";

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findEmirateLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:fetchStart>0</ns2:fetchStart><ns2:fetchSize>-1</ns2:fetchSize>';
	message += '<ns2:filter><ns2:conjunction>And</ns2:conjunction><ns2:group>';
	message += '<ns2:conjunction>And</ns2:conjunction><ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	message += '<ns2:item><ns2:conjunction>And</ns2:conjunction><ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	message += '<ns2:attribute>IsActive</ns2:attribute><ns2:operator>=</ns2:operator><ns2:value>1</ns2:value></ns2:item>';
	message += '</ns2:group></ns2:filter>';
	message += '<ns2:findAttribute>EmiratenameEn</ns2:findAttribute>';
	message += '<ns2:findAttribute>EmiratenameAr</ns2:findAttribute>';
	message += '<ns2:findAttribute>EmirateId</ns2:findAttribute>';
	message += '<ns2:excludeAttribute>false</ns2:excludeAttribute>';
	message += '<ns2:sortOrder>';
	message += '<ns2:sortAttribute>';
	message += '<ns2:name>EmiratenameEn</ns2:name>';
	message += '<ns2:descending>false</ns2:descending>';
	message += '</ns2:sortAttribute>';
	message += '</ns2:sortOrder>';
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl></ns1:findEmirateLookupsView1>';
	message += '</soap:Body></soap:Envelope>';

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = this.responseText;
		Ti.API.info('nation list response data==>> ' + this.responseText);
		var result;
		try {
			result = Ti.XML.parseString(response);
			//Ti.API.info(result + 'nation list data  after parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:EmiratenameEn");
		Ti.API.info('emirates list length==>> ' + rootNode.length);
		var arrEmiratesList = [];
		if (rootNode.length > 0) {

			for (var i = 0; i < rootNode.length; i++) {
				Ti.API.info('emirates list data ==>> ' + result.getElementsByTagName("uaq:EmiratenameEn").item(i).textContent);
				arrEmiratesList.push({
					title : result.getElementsByTagName("uaq:EmiratenameEn").item(i).textContent,
					titleAr : result.getElementsByTagName("uaq:EmiratenameAr").item(i).textContent,
					id : result.getElementsByTagName("uaq:EmirateId").item(i).textContent,
				});
			}

			callBackFunction(arrEmiratesList);
		} else {
			Alloy.Globals.hideLoading();
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

function getFilterCountryModule(paramFilter, valueFilter, paramFilter2, valueFilter2, conj1, conj2, uppercase) {
	var bodyMessage = "";

	bodyMessage += '<ns2:fetchStart>0</ns2:fetchStart>';
	bodyMessage += '<ns2:fetchSize>-1</ns2:fetchSize>';
	bodyMessage += '<ns2:filter>';
	bodyMessage += '<ns2:conjunction>' + conj1 + '</ns2:conjunction>';
	bodyMessage += '<ns2:group>';
	bodyMessage += '<ns2:conjunction>' + conj2 + '</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>' + uppercase + '</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:item>';
	bodyMessage += getBodyEnvelop(paramFilter, valueFilter);
	bodyMessage += '</ns2:item>';
	bodyMessage += '</ns2:group>';
	bodyMessage += '<ns2:group>';
	bodyMessage += '<ns2:conjunction>' + conj2 + '</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>' + uppercase + '</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:item>';
	bodyMessage += getBodyEnvelop(paramFilter2, valueFilter2);
	bodyMessage += '</ns2:item>';
	bodyMessage += '<ns2:item>';
	bodyMessage += '<ns2:conjunction>And</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:attribute>NationalityId</ns2:attribute>';
	bodyMessage += '<ns2:operator>&gt;=</ns2:operator>';
	bodyMessage += '<ns2:value>2</ns2:value>';
	bodyMessage += '</ns2:item>';
	bodyMessage += '</ns2:group>';
	bodyMessage += '</ns2:filter>';

	return bodyMessage;
}

function getFilterAllCountry(paramFilter, valueFilter, conj1, conj2, uppercase) {
	var bodyMessage = "";

	bodyMessage += '<ns2:fetchStart>0</ns2:fetchStart>';
	bodyMessage += '<ns2:fetchSize>-1</ns2:fetchSize>';
	bodyMessage += '<ns2:filter>';
	bodyMessage += '<ns2:conjunction>' + conj1 + '</ns2:conjunction>';
	bodyMessage += '<ns2:group>';
	bodyMessage += '<ns2:conjunction>' + conj2 + '</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>' + uppercase + '</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:item>';
	bodyMessage += getBodyEnvelop(paramFilter, valueFilter);
	bodyMessage += '</ns2:item>';
	bodyMessage += '<ns2:item>';
	bodyMessage += '<ns2:conjunction>And</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:attribute>NationalityId</ns2:attribute>';
	bodyMessage += '<ns2:operator>&gt;=</ns2:operator>';
	bodyMessage += '<ns2:value>2</ns2:value>';
	bodyMessage += '</ns2:item>';
	bodyMessage += '</ns2:group>';
	bodyMessage += ' </ns2:filter>';

	return bodyMessage;
}

/*
exports.getNationalityLookup = function(applicantType, cntryType, callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findNationalityLookupsView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	// FOR all cuntry
	var paramAllCtry = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueAllCtry = ["And", "false", "IsActive", "=", "1"];

	// FOR GCC cuntry
	var paramGccCtry = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueGccCtry = ["And", "false", "Isgcccountries", "=", "1"];

	// FOR UAE cuntry
	var paramUAECtry = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueUAECtry = ["And", "false", "NationalitynameEn", "=", "UAE"];

	var param = ["ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:excludeAttribute"];
	var value = ["NationalitynameEn", "NationalitynameAr", "NationalityId", "false"];

	var countryFilterQuery;

	var uaeCntryTrue = false;

	if (applicantType == 1 && cntryType == 'cntryCitizen') {
		countryFilterQuery = getFilterCountryModule(paramAllCtry, valueAllCtry, paramUAECtry, valueUAECtry, "And", "And", "false");
		uaeCntryTrue = true;
	} else if (applicantType == 2 && cntryType == 'cntryCitizen') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else if (applicantType == 3 && cntryType == 'cntryCitizen') {
		countryFilterQuery = getFilterCountryModule(paramAllCtry, valueAllCtry, paramGccCtry, valueGccCtry, "And", "And", "false");
	} else if (applicantType == 4 && cntryType == 'cntryCitizen') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else if (applicantType == 5 && cntryType == 'cntryCitizen') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else if (applicantType == 1 && cntryType == 'cntryResidence') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else if (applicantType == 2 && cntryType == 'cntryResidence') {
		countryFilterQuery = getFilterCountryModule(paramAllCtry, valueAllCtry, paramUAECtry, valueUAECtry, "And", "And", "false");
		uaeCntryTrue = true;
	} else if (applicantType == 3 && cntryType == 'cntryResidence') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else if (applicantType == 4 && cntryType == 'cntryResidence') {
		countryFilterQuery = getFilterCountryModule(paramAllCtry, valueAllCtry, paramGccCtry, valueGccCtry, "And", "And", "false");
	} else if (applicantType == 5 && cntryType == 'cntryResidence') {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	} else {
		countryFilterQuery = getFilterAllCountry(paramAllCtry, valueAllCtry, "And", "And", "false");
	}

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findNationalityLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	//ALL country
	//message += getFilterConditionModule(paramAllCtry, valueAllCtry, "And", "And", "false");
	// GCC country only
	//message += getFilterCountryModule(paramAllCtry, valueAllCtry, paramGccCtry, valueGccCtry, "And", "And", "false");
	//UAE coutnry only
	//message += getFilterCountryModule(paramAllCtry, valueAllCtry, paramUAECtry, valueUAECtry, "And", "And", "false");
	message += countryFilterQuery;
	message += '<ns2:sortOrder>';
	message += '<ns2:sortAttribute>';
	message += '<ns2:name>NationalitynameEn</ns2:name>';
	message += '<ns2:descending>false</ns2:descending>';
	message += '</ns2:sortAttribute>';
	message += '</ns2:sortOrder>';
	message += getBodyEnvelop(param, value);
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations></ns1:findControl>';
	message += '</ns1:findNationalityLookupsView1>';
	message += '</soap:Body></soap:Envelope>';

	Ti.API.info('Params: '+message);
	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);
		Ti.API.info('nation list response data==>> ' + this.responseText);

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			//Ti.API.info(result + 'nation list data  after parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:NationalitynameEn");
		Ti.API.info('national list length==>> ' + rootNode.length);
		var arrNationalList = [];
		if (rootNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;
			arrNationalList.push({
				title : "United Arab Emirates",
				titleAr : "الإمارات العربية المتحدة",
				id : 1,
			});
			for (var i = 0; i < rootNode.length; i++) {
				//Ti.API.info('nation list data ==>> ' + result.getElementsByTagName("uaq:NationalitynameEn").item(i).textContent);
				arrNationalList.push({
					title : result.getElementsByTagName("uaq:NationalitynameEn").item(i).textContent,
					titleAr : result.getElementsByTagName("uaq:NationalitynameAr").item(i).textContent,
					id : result.getElementsByTagName("uaq:NationalityId").item(i).textContent,
				});
			}

			callBackFunction(arrNationalList);
		} else if (uaeCntryTrue == true) {
			arrNationalList.push({
				title : "United Arab Emirates",
				titleAr : "الإمارات العربية المتحدة",
				id : 1,
			});
			callBackFunction(arrNationalList);
		} else {
			Alloy.Globals.hideLoading();
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};
*/

exports.getNationalityLookupForFeedback = function(callBackFunction) {
	
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	
	var url = Alloy.Globals.webserviceUrl + "/uaqws/mySuggestion/getAllCountry/1";
	//var url = "http://94.57.252.237/uaqws/mySuggestion/getAllCountry/1";

	Ti.API.info('COUNTRY SERVICE URL: '+ url);
	var request = getHttpClientWithHeader(url);
	
	request.onload = function(e) {
		try{
			if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
				Alloy.Globals.hideLoading();
				Ti.API.info("Unable to get data from server for notification history...!");
				return;
			}
			Alloy.Globals.hideLoading();
			var parsedData = JSON.parse(this.responseText);
			var arrNationalList = [];
			if (parsedData.statusCode == "SUCCESS"){
				if (parsedData.count > 0){
					Ti.API.info('Category Length: '+parsedData.countryList.length);
					for (var i = 0; i < parsedData.countryList.length; i++) {
						//Ti.API.info('nation list data ==>> ' + result.getElementsByTagName("uaq:NationalitynameEn").item(i).textContent);
						arrNationalList.push({
							title : parsedData.countryList[i].countryNameEn,
							titleAr : parsedData.countryList[i].countryNameAr,
							id : parsedData.countryList[i].countryId
						});
					}
					callBackFunction(arrNationalList);
				}
				else{
					arrNationalList.push({
						title : "United Arab Emirates",
						titleAr : "الإمارات العربية المتحدة",
						id : 1,
					});
					callBackFunction(arrNationalList);
				}
			}
			else{
				Ti.API.info('SERVICE FAILURE RESPONSE');
			}
		}
		catch(e){
			Alloy.Globals.hideLoading();
			Ti.API.info('JSON parsing error..(updateNotificationSetting)');
		}
	};
	request.onerror = function(e) {
		Alloy.Globals.hideLoading();
		Ti.API.debug(e.error);
		utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.serviceError);
	};
	request.send();
};
function getBodyEnvelop(arrKeys, arrValues) {
	var bodyMessage = "";

	for (var i = 0; i < arrKeys.length; i++) {
		bodyMessage += "<" + arrKeys[i] + ">" + arrValues[i] + "</" + arrKeys[i] + ">";
	}
	return bodyMessage;
}

function getAttachmentBodyEnvelope(countArr, arrValues) {
	var bodyMessage = "";

	Ti.API.info(arrValues.length + 'attachment test data ==>> ');

	for (var i = 0; i < arrValues.length; i++) {
		bodyMessage += "<cre:AttachmentRec><cre:ContentID>" + arrValues[i].did + "</cre:ContentID>";
		bodyMessage += "<cre:URL>" + arrValues[i].url + "</cre:URL>";
		bodyMessage += "<cre:AttachemntType>" + photoUploadCategoryId(arrValues[i].imgType) + "</cre:AttachemntType>";
		bodyMessage += "<cre:AttachemntName>" + arrValues[i].fileName + "</cre:AttachemntName></cre:AttachmentRec>";
	}
	Ti.API.info(bodyMessage + 'attachment test data ==>> ');

	return bodyMessage;

}

exports.generateOTPwebservice = function(obj, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_GenerateOTP/generateotpbpel_client_ep";

	var param1 = ["gen:MobileNo", "gen:EmiratesID", "gen:PassportID"];
	var values1 = [obj.mobilenumInd, obj.emiratesID, obj.passportID];

	var param2 = ["gen:MobileNo", "gen:TradeLicenseNo", "gen:EmiratesCode"];
	var values2 = [obj.mobileEstablish, obj.tradeLicenseNo, obj.emiratesCode];

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gen="http://GenerateOTP">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<gen:Input>';
    message += '<gen:TypeOfUser>2</gen:TypeOfUser>';
    message += '<gen:AccountId>86356</gen:AccountId>';
    message += '<gen:IndividualREC>';
	message += getBodyEnvelop(param1, values1);
	message += '</gen:IndividualREC>';
	message += '<gen:EstablishmentREC>';
	message += getBodyEnvelop(param2, values2);
	message += '</gen:EstablishmentREC>';
    message += '</gen:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request OTP generate ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		var rootNode = result.getElementsByTagName("Output");

		var subNode = result.getElementsByTagNameNS(ns, "Status");

		var uploadDocList = [];
		if (rootNode.length > 0 && subNode.length > 0) {
			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;
			if (status === "Success") {
				var uploadDocList = {
					status : result.getElementsByTagNameNS(ns, "Status").item(0).textContent,
					message_En : result.getElementsByTagNameNS(ns, "Message_En").item(0).textContent,
					message_Ar : result.getElementsByTagNameNS(ns, "Message_Ar").item(0).textContent,
					attachmentType : obj.docName,
					mediaFileName : obj.filename,
				};
				//Ti.API.info('soap responce otp generate ==>> ' + JSON.stringify(uploadDocList));
				callBackFunction(uploadDocList);
			} else {
				callBackFunction(null);
			}
		} else {
			callBackFunction(null);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		//callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);
};

exports.getWeburlfromDID = function(uploadDocListdata, callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		Alloy.Globals.hideLoading();
		return;
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQUCMCommonService/UCMWCMServicePort";
	//url = "http://83.111.136.7:80/UAQUCMCommonService/UCMWCMServicePort";

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mod="http://model.common.ucm.service.uaq/">';
	message += '<soapenv:Header/>';
	message += '<soapenv:Body>';
	message += '<mod:getWebURL>';
	message += '<arg0>' + uploadDocListdata.did + '</arg0>';
	//4192
	//message += '<arg0>4192</arg0>';
	message += '</mod:getWebURL>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('RESPONSE OF getWeburlfromDID:::: ' + message);
	var request = Ti.Network.createHTTPClient();
	request.timeout = 25000;
	request.onload = function(e) {
		Ti.API.info('RESPONSE OF getWeburlfromDID:::: ' + this.responseText);
		var response = getXMLFormate(this.responseText);
		Ti.API.info('RESPONSE OF getWeburlfromDID:::: ' + response);
		var result;
		try {
			result = Ti.XML.parseString(response);
		} catch(e) {
			Ti.API.info("Error");
			//alert('Error::: ' + JSON.stringify(e));
		}

		var rootNode = result.getElementsByTagName("ns2:getWebURLResponse");

		var subNode = result.getElementsByTagName("weblocation");

		var uploadDocList = [];
		if (rootNode.length > 0 && subNode.length > 0) {

			var uploadDocList = {
				status : uploadDocListdata.status,
				did : uploadDocListdata.did,
				url : result.getElementsByTagName("weblocation").item(0).textContent,
				message_En : uploadDocListdata.message_En,
				message_Ar : uploadDocListdata.message_Ar,
				attachmentType : uploadDocListdata.attachmentType,
				mediaFileName : uploadDocListdata.mediaFileName,
			};
			//Ti.API.info('soap getWeburlfromDID upload ==>> ' + JSON.stringify(uploadDocList));
			callBackFunction(uploadDocList);

		} else {
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}
		obj = null;
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();
		obj = null;
		//callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

/*
 exports.uploadDocumentList = function(obj, callBackFunction) {

 Ti.API.info('hasConnection() ==>> ' + hasConnection());
 if (hasConnection() == false) {
 utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
 Alloy.Globals.hideLoading();
 return;
 }

 //Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

 //var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080

 //old
 // var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQServiceMiddleLayer/GenericServicePort";

 var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQCommonMiddlewareService/CommonServicesPort"; //changed on 31 oct

 var paramApp = ["upl:DocName", "upl:DocTitle", "upl:DocType", "upl:DocSecurityGroup", "upl:AuthorName"];
 var valuesAPP = [obj.docName, obj.docTitle, "Document", "Public", "uaqdev"];
 //Document
 //var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.middleware.uaq/" xmlns:upl="http://xmlns.oracle.com/UAQBusinessProcess/UAQ_DocumentUpload_Download_Ser/Upload_DownloadBpel">';
 var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mod="http://model.common.service.uaq/" xmlns:upl="http://xmlns.oracle.com/UAQBusinessProcess/UAQ_DocumentUpload_Download_Ser/Upload_DownloadBpel">';
 message += '<soapenv:Header/>';
 message += '<soapenv:Body>';
 message += '<mod:uploadDOcument>';
 message += '<arg0>';
 message += getBodyEnvelop(paramApp, valuesAPP);
 message += '<upl:FileList>';
 message += '<upl:FileRecord>';
 message += '<upl:Filename>' + obj.filename + '</upl:Filename>';
 message += '<upl:FileContent>' + obj.data + '</upl:FileContent>';
 //message += '<upl:FileContent>cid:847954048801</upl:FileContent>';
 message += '</upl:FileRecord>';
 message += '</upl:FileList>';
 message += '</arg0>';
 message += '<arg1>';
 message += '<password>' + ServerPassword + '</password>';
 message += '<username>' + ServerUsername + '</username>';
 message += '</arg1>';
 message += '</mod:uploadDOcument>';
 message += '</soapenv:Body></soapenv:Envelope>';

 //Ti.API.info(' PARAMETERS :::::::: '+ message);

 //Ti.API.info('soap request registration ==>> ' + getBodyEnvelop(paramApp, valuesAPP));

 var request = Ti.Network.createHTTPClient();
 request.timeout = 25000;
 request.onload = function(e) {
 var response = getXMLFormate(this.responseText);
 Ti.API.info('RESPONSE OF :::: '+ response);
 var result;
 try {
 result = Ti.XML.parseString(response);
 } catch(e) {
 alert('Error::: '+ JSON.stringify(e));
 }

 var rootNode = result.getElementsByTagName("uaqup:uploadDOcumentResponse");

 var subNode = result.getElementsByTagName("uaqup:Status");

 var uploadDocList = [];
 if (rootNode.length > 0 && subNode.length > 0) {

 var status = result.getElementsByTagName("uaqup:Status").item(0).text;

 if (status === "Success") {
 var uploadDocList = {
 status : result.getElementsByTagName("uaqup:Status").item(0).textContent,
 did : result.getElementsByTagName("uaqup:Did").item(0).textContent,
 message_En : result.getElementsByTagName("uaqup:Message_En").item(0).textContent,
 message_Ar : result.getElementsByTagName("uaqup:Message_Ar").item(0).textContent,
 attachmentType : obj.docTitle,
 mediaFileName : obj.filename,
 };
 Ti.API.info('soap responce upload ==>> ' + JSON.stringify(uploadDocList));

 callBackFunction(uploadDocList);
 } else if (status === "Failure") {

 var nodeAlert = result.getElementsByTagName("uaqup:Message_En");
 Ti.API.info("test");
 if (nodeAlert.length > 0) {
 Ti.API.info("image" + status);
 var alert = Ti.UI.createAlertDialog({
 title : Alloy.Globals.selectedLanguage.appTitle,
 message : (Alloy.Globals.isEnglish) ? result.getElementsByTagName("uaqup:Message_En").item(0).text : result.getElementsByTagName("uaqup:Message_Ar").item(0).text,
 //message: "Duplicate Account Exists",
 buttonNames : [Alloy.Globals.selectedLanguage.ok]
 });
 alert.show();
 }
 Alloy.Globals.hideLoading();
 callBackFunction(null);
 } else if (status === "Failure") {

 var nodeAlert = result.getElementsByTagName("uaqup:Message_En");
 Ti.API.info("test");
 if (nodeAlert.length > 0) {
 Ti.API.info("image" + status);
 var alert = Ti.UI.createAlertDialog({
 title : Alloy.Globals.selectedLanguage.appTitle,
 message : (Alloy.Globals.isEnglish) ? result.getElementsByTagName("uaqup:Message_En").item(0).text : result.getElementsByTagName("uaqup:Message_Ar").item(0).text,
 //message: "Duplicate Account Exists",
 buttonNames : [Alloy.Globals.selectedLanguage.ok]
 });
 alert.show();
 }
 Alloy.Globals.hideLoading();
 callBackFunction(null);
 } else {
 callBackFunction(null);
 Alloy.Globals.hideLoading();
 utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
 }
 } else {
 callBackFunction(null);
 Alloy.Globals.hideLoading();
 utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
 }
 obj = null;

 };

 request.onerror = function(e) {
 Titanium.API.error('Status: ' + this.status);
 Titanium.API.error('ResponseText: ' + this.responseText);
 Titanium.API.error('connectionType: ' + this.connectionType);
 Titanium.API.error('location: ' + this.location);

 Alloy.Globals.hideLoading();
 obj = null;
 //callBackFunction(null);

 if (request.status != 200) {
 Alloy.Globals.hideLoading();
 utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
 return;
 }
 };

 request.open("POST", url);
 request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
 //request.setRequestHeader('SOAPAction', soapAction);
 request.send(message);
 };*/

function dateFormatChange(date) {
   
   
   
	var dateSplit = date.split("/");
	Ti.API.info('date format chage'+ dateSplit[1] + "  onlydate "+dateSplit[0] +" date " +dateSplit[2]);
	var monthF = dateSplit[1];
	var dateFset = dateSplit[0];
	var dayF =   dateFset;  //(dateFset < 10 ? "0" + dateFset : dateFset);
	var yearF = dateSplit[2];
	var newDateF = yearF + "-" + monthF + "-" + dayF + "T20:00:00";
	//Ti.API.info('date format chage'+ newDateF + "  onlydate "+dayF +" date " +dateSplit[0]);
	return newDateF;
}

function photoUploadCategoryId(mediaCat) {
	var catIdMedia = 0;
	switch(mediaCat) {
	case "Emirate Id Front":
		catIdMedia = 22;
		break;
	case "Emirate Id Back":
		catIdMedia = 23;
		break;
	case "Passport Front":
		catIdMedia = 24;
		break;
	case "Passport Residency Page":
		catIdMedia = 25;
		break;
	case "Visa Page":
		catIdMedia = 26;
		break;
	case "Family Book":

		catIdMedia = 20;
		break;
	case "Trade License":
		catIdMedia = 1;
		break;
	case "Signatories Attestation":
		catIdMedia = 2;
		break;
	}

	return catIdMedia;
}

exports.regstrationAllUserType = function(obj, callBackFunction) {
	Ti.API.info(obj.choosenEmirates + 'hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	// ### all param #####  //
	var applicantType = (obj.applicantType != undefined) ? obj.applicantType : "";
	var fullname = (obj.fullname != undefined) ? obj.fullname : "";
	var mobileNum1 = (obj.mobileNum1 != undefined) ? obj.mobileNum1 : "";
	var mobileNum2 = (obj.mobileNum2 != undefined) ? obj.mobileNum2 : "";
	var landlineNum = (obj.landlineNum != undefined) ? obj.landlineNum : "";
	var cntryOfCitizen = (obj.cntryOfCitizen != undefined) ? obj.cntryOfCitizen : "";
	var cntryOfResident = (obj.cntryOfResident != undefined) ? obj.cntryOfResident : "";
	var addressIndiv = (obj.addressIndivid != undefined) ? obj.addressIndivid : "";
	var emailAddress = (obj.emailAddress != undefined) ? obj.emailAddress : "";

	var passportNumber = (obj.passportNumber != undefined) ? obj.passportNumber : "";
	var fullnameBook = (obj.fullnameBook != undefined && obj.applicantType == 1) ? obj.fullnameBook : "";
	var chooseEmiratesBook = (obj.chooseEmiratesBook != undefined && obj.applicantType == 1) ? obj.chooseEmiratesBook : "";
	var townName = (obj.townName != undefined && obj.applicantType == 1) ? obj.townName : "";
	var townNumber = (obj.townNumber != undefined && obj.applicantType == 1) ? obj.townNumber : "";
	var familyNumber = (obj.familyNumber != undefined && obj.applicantType == 1) ? obj.familyNumber : "";
	var tribeName = (obj.tribeName != undefined && obj.applicantType == 1) ? obj.tribeName : "";
	var clanNumber = (obj.clanNumber != undefined && obj.applicantType == 1) ? obj.clanNumber : "";
	var issuanceDate = (obj.issuanceDate != undefined && obj.applicantType == 1) ? obj.issuanceDate : "";
	var mothersName = (obj.mothersName != undefined && obj.applicantType == 1) ? obj.mothersName : "";
	var motherFatherNm = (obj.motherFatherNm != undefined && obj.applicantType == 1) ? obj.motherFatherNm : "";
	var tribeName = (obj.tribeName != undefined && obj.applicantType == 1) ? obj.tribeName : "";

	var fullname1 = (obj.fullname != undefined && (obj.applicantType != 4 || obj.applicantType != 5 )) ? obj.fullname : "";
	var emiratedId = (obj.emiratedId != undefined && (obj.applicantType != 4 || obj.applicantType != 5)) ? obj.emiratedId : "";
	var choosenEmirates = (obj.choosenEmirates != undefined && (obj.applicantType != 4 || obj.applicantType != 5)) ? obj.choosenEmirates : "";
	var emiratedIdexpiry = (obj.emiratedIdexpiry != undefined && (obj.applicantType != 4 || obj.applicantType != 5)) ? obj.emiratedIdexpiry : "";
	var DOB = (obj.DOB != undefined && (obj.applicantType != 4 || obj.applicantType != 5)) ? obj.DOB : "";
	var passportFullName = (obj.passportFullName != undefined && (obj.applicantType == 3 || obj.applicantType == 4 || obj.applicantType == 5)) ? obj.passportFullName : "";

	if (obj.applicantType == 3) {//alert("test" + obj.applicantType);
		fullname1 = (obj.fullname1 != undefined) ? obj.fullname : "";
		emiratedId = (obj.emiratedId != undefined) ? obj.emiratedId : "";
		choosenEmirates = (obj.choosenEmirates != undefined) ? obj.choosenEmirates : "";
		emiratedIdexpiry = (obj.emiratedIdexpiry != undefined) ? obj.emiratedIdexpiry : "";
		DOB = (obj.DOB != undefined) ? obj.DOB : "";
		//fullname1 = emiratedId = choosenEmirates =  emiratedIdexpiry =DOB = 1;
		//alert("test" + fullname1+ "" +emiratedId+ "");
		//to do chagne the working way in user tpe 3
	}

	var establishName = (obj.establishName != undefined && obj.applicantType == 6) ? obj.establishName : "";
	var establishMobileNum = (obj.establishMobileNum != undefined && obj.applicantType == 6) ? obj.establishMobileNum : "";
	var officePhone = (obj.officePhone != undefined && obj.applicantType == 6) ? obj.officePhone : "";
	var emailAddressEst = (obj.emailAddressEst != undefined && obj.applicantType == 6) ? obj.emailAddressEst : "";
	var addressEst = (obj.addressEst != undefined && obj.applicantType == 6) ? obj.addressEst : "";
	var websiteEst = (obj.websiteEst != undefined && obj.applicantType == 6) ? obj.websiteEst : "";
	var emiratesEst = (obj.emiratesEst != undefined && obj.applicantType == 6) ? obj.emiratesEst : "";
	var postboxEst = (obj.postboxEst != undefined && obj.applicantType == 6) ? obj.postboxEst : "";
	var tradeLicNumberEst = (obj.tradeLicNumberEst != undefined && obj.applicantType == 6) ? obj.tradeLicNumberEst : "";
	var tradeLicExpiryEst = (obj.tradeLicExpiryEst != undefined && obj.applicantType == 6) ? obj.tradeLicExpiryEst : "";
	var tradeLicTypeEst = (obj.tradeLicTypeEst != undefined && obj.applicantType == 6) ? obj.tradeLicTypeEst : "";
	var emiratesIDestablish = (obj.emiratedIdEstblish != undefined && obj.applicantType == 6) ? obj.emiratedIdEstblish : "";
	//applicantType = (obj.applicantType == 6)

	var hasFamilyBook = (obj.hasFamilyBook == true) ? 1 : 0;
	var subscribeSet = (obj.subscribeSet == true) ? 1 : 0;

	mobileNum1 = (obj.typeOfUser == 2) ? establishMobileNum : mobileNum1;

	var addressSet = (obj.typeOfUser == 1) ? addressIndiv : addressEst;

	fullname = (obj.passportFullName != undefined && (obj.applicantType != 4 || obj.applicantType != 5)) ? passportFullName : fullname;

	fullname = (obj.establishName != undefined && obj.applicantType == 6) ? establishName : fullname;

	applicantType = (obj.typeOfUser == 2) ? 1 : applicantType;
	emailAddress = (obj.typeOfUser == 2) ? emailAddressEst : emailAddress;
	cntryOfCitizen = (obj.typeOfUser == 2) ? 1 : cntryOfCitizen;
	cntryOfResident = (obj.typeOfUser == 2) ? 1 : cntryOfResident;

	/*var DOB = (DOB != undefined) ? dateFormatChange(DOB) : "1800-01-01'T'00:00:000Z";
	var emiratedIdexpiry = (emiratedIdexpiry != undefined) ? dateFormatChange(emiratedIdexpiry) : "1800-01-01'T'00:00:000Z";
	var tradeLicExpiryEst = (tradeLicExpiryEst != undefined) ? dateFormatChange(tradeLicExpiryEst) : "1800-01-01'T'00:00:000Z";
	var issuanceDate = (issuanceDate != undefined) ? dateFormatChange(issuanceDate) : "1800-01-01'T'00:00:000Z";*/
	Ti.API.info(tradeLicExpiryEst+'isseu date empty or not' + issuanceDate + "");
	Ti.API.info('++++'+  (issuanceDate != undefined) ? dateFormatChange(issuanceDate) : "");
	Ti.API.info('++++'+  (issuanceDate.length == 0) ? "" : dateFormatChange(issuanceDate));
	Ti.API.info('++++'+  (issuanceDate.length == 0) ? dateFormatChange(issuanceDate) : "");
	
	if(issuanceDate.length == 0){
		Ti.API.info('==='+ issuanceDate.length);
	}else{
		Ti.API.info(dateFormatChange(issuanceDate)+'===qqqq'+ issuanceDate.length);
	}
	
	var DOB = (DOB == undefined || DOB.length == 0) ? "" : dateFormatChange(DOB);
	var emiratedIdexpiry = (emiratedIdexpiry == undefined || emiratedIdexpiry.length == 0) ? "": dateFormatChange(emiratedIdexpiry) ;
	var tradeLicExpiryEst = (tradeLicExpiryEst == undefined || tradeLicExpiryEst.length == 0) ? "" : dateFormatChange(tradeLicExpiryEst);
	var issuanceDate = (issuanceDate == undefined || issuanceDate.length == 0) ? "" :  dateFormatChange(issuanceDate);

	var samplePObox = (obj.postboxEst != undefined && obj.applicantType == 6) ? obj.postboxEst : "87310";

	var paramAppUser = ["cre:ApplicantTypeId", "cre:FirstName", "cre:Address1", "cre:MobileNo1", "cre:MobileNo2", "cre:landLine", "cre:CountryIdOfCitizenship", "cre:CountryIdOfResidency", "cre:EmailID", "cre:postbox"];
	var valuesAPPuser = [applicantType, fullname, addressSet, mobileNum1, mobileNum2, landlineNum, cntryOfCitizen, cntryOfResident, emailAddress, samplePObox];

	var paramAppUserEmir = ["cre:FullName", "cre:EmiratesID", "cre:EmiratesCode", "cre:ExpiryDate", "cre:DOB", "cre:ResidenceNo", "cre:ResidenceExpiryDate"];
	var valuesAPPuserEmir = [fullname1, emiratedId, choosenEmirates, emiratedIdexpiry, DOB, "", ""];

	var paramAppUserPssport = ["cre:FullName", "cre:PassportNumber", "cre:PassportExpiryDate"];
	var valuesAPPuserPssport = [passportFullName, passportNumber, ""];

	var paramAppUserFamilyB = ["cre:Fullname", "cre:EmirateCode", "cre:TownName", "cre:TownNumber", "cre:FamilyNumber", "cre:TribeName", "cre:ClanNumber", "cre:IssuanceDate", "cre:MotherName", "cre:MothersFatherName"];
	var valuesAPPuserFamilyB = [fullnameBook, chooseEmiratesBook, townName, townNumber, familyNumber, tribeName, clanNumber, issuanceDate, mothersName, motherFatherNm];

	var paramEstablish = ["cre:FullName", "cre:MobileNumber", "cre:OfficePhone", "cre:EmailAddress", "cre:Address1", "cre:WebSite", "cre:EmiratesCode", "cre:PostBox", "cre:TradeLicenseNo", "cre:TradeLicenseExpiryDate", "cre:TradeLicenseTypeid", "cre:EmiratesId"];
	var valuesEstablish = [establishName, establishMobileNum, officePhone, emailAddressEst, addressEst, websiteEst, emiratesEst, postboxEst, tradeLicNumberEst, tradeLicExpiryEst, tradeLicTypeEst, emiratesIDestablish];

	var paramGeneral = ["cre:Username", "cre:Accountid", "cre:RequestId", "cre:RequestNo", "cre:WorkFlowId", "cre:LanguageID", "cre:ProfileImageId", "cre:SubcribeForNewsLetterFlag"];
	var valuesGeneral = [obj.username, "", "", "", "", obj.lang, "", subscribeSet];

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_CreateOnLineAccount/creatonlineaccountbpel_client_ep?WSDL";

	var userNameChnge = obj.username.toLowerCase();

	//var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.middleware.uaq/" xmlns:cre="http://CreateOnlineAccount">';
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cre="http://CreateOnlineAccount">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<cre:Input>';

	message += '<cre:UserDetails>';
	message += '<cre:ApplicantUserDetails>';
	message += getBodyEnvelop(paramAppUser, valuesAPPuser);
	message += '<cre:EmiratesIDRec>';
	message += getBodyEnvelop(paramAppUserEmir, valuesAPPuserEmir);
	message += '</cre:EmiratesIDRec>';
	message += '<cre:PassportRec>';
	message += getBodyEnvelop(paramAppUserPssport, valuesAPPuserPssport);
	message += '</cre:PassportRec>';
	message += '<cre:HasFamilyBookNo>' + hasFamilyBook + '</cre:HasFamilyBookNo>';
	message += '<cre:FamilyBookRec>';
	message += getBodyEnvelop(paramAppUserFamilyB, valuesAPPuserFamilyB);
	message += '</cre:FamilyBookRec>';
	message += '</cre:ApplicantUserDetails>';

	message += '<cre:EstablishmentUserDetails>';
	message += getBodyEnvelop(paramEstablish, valuesEstablish);
	message += '</cre:EstablishmentUserDetails>';

	message += '</cre:UserDetails>';
	message += '<cre:TypeOfUser>' + obj.typeOfUser + '</cre:TypeOfUser>';
	message += '<cre:LoginUserName>' + userNameChnge + '</cre:LoginUserName>';
	message += '<cre:password>' + obj.password + '</cre:password>';
	message += '<cre:GenericDetails>';
	message += getBodyEnvelop(paramGeneral, valuesGeneral);
	message += '</cre:GenericDetails>';
	message += '<cre:AttachmentList>';
	message += getAttachmentBodyEnvelope(1, obj.arrMedia);
	message += '</cre:AttachmentList>';
	
	message += '</cre:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request registration ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;
		
		Ti.API.info('resgistration responce data ==>> ' + result);
		
        var ns = "http://CreateOnlineAccount";
        try {
		 var rootNode = result.getElementsByTagName("output");
		 var statusRes = result.getElementsByTagNameNS(ns, "Status");
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}
		
		Ti.API.info('registarion responce  roonode lenght ==>> ' + rootNode.length + '>>' + statusRes.length);
		
		if (rootNode.length > 0 && statusRes.length > 0) {
			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;

			var geneDetil = result.getElementsByTagNameNS(ns, "GenericDetails");
			Ti.API.info(status + 'registarion responce  data ==>> ' + geneDetil.length);
			if (status === "Success" && geneDetil.length > 0) {

				var generalDetails = result.getElementsByTagNameNS(ns, "GenericDetails").item(0);

				var regCreationObj = {
					username : generalDetails.getElementsByTagNameNS(ns, "Username").item(0).textContent,
					accountId : generalDetails.getElementsByTagNameNS(ns, "Accountid").item(0).textContent,
					requestId : generalDetails.getElementsByTagNameNS(ns, "RequestId").item(0).textContent,
					requestno : generalDetails.getElementsByTagNameNS(ns, "RequestNo").item(0).textContent,
					workflowid : generalDetails.getElementsByTagNameNS(ns, "WorkFlowId").item(0).textContent,
					messageEn : result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent,
					messageAr : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
				};
				//Ti.API.info('soap responce after registraton ==>> ' + JSON.stringify(regCreationObj));
				callBackFunction(regCreationObj);

			} else {
				callBackFunction(null);
				var nodeAlert = result.getElementsByTagNameNS(ns, "Message_EN");
				if (nodeAlert.length > 0) {
					var alert = Ti.UI.createAlertDialog({
						title : Alloy.Globals.selectedLanguage.appTitle,
						message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
						//message: "Duplicate Account Exists",
						buttonNames : [Alloy.Globals.selectedLanguage.ok]
					});
					alert.show();
				}
			}
			Alloy.Globals.hideLoading();
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}

	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);

	//return Alloy.Globals.userLoginNode;
};
 
exports.getServicesFees = function(callBackFunction) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";
	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findServiceLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:fetchStart>' + 0 + '</ns2:fetchStart>';
	message += '<ns2:fetchSize>' + -1 + '</ns2:fetchSize>';
	message += '<ns2:filter>';
	message += '<ns2:conjunction>' + 'And' + '</ns2:conjunction>';
	message += '<ns2:group>';
	message += '<ns2:conjunction>' + 'And' + '</ns2:conjunction>';
	message += '<ns2:upperCaseCompare>' + 'false' + '</ns2:upperCaseCompare>';
	message += '<ns2:item>';
	message += '<ns2:conjunction>' + 'And' + '</ns2:conjunction>';
	message += '<ns2:upperCaseCompare>' + 'false' + '</ns2:upperCaseCompare>';
	message += '<ns2:attribute>' + 'ServiceId' + '</ns2:attribute>';
	message += '<ns2:operator>' + '=' + '</ns2:operator>';
	message += '<ns2:value>' + 303 + '</ns2:value>';
	message += '</ns2:item>';
	message += '</ns2:group>';
	message += '</ns2:filter>';
	message += '<ns2:sortOrder/>';
	message += '<ns2:findAttribute>' + 'AppFees' + '</ns2:findAttribute>';
	message += '<ns2:findAttribute>' + 'ServiceFee' + '</ns2:findAttribute>';
	message += '<ns2:excludeAttribute>' + 'false' + '</ns2:excludeAttribute>';
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl>';
	message += '</ns1:findServiceLookupsView1>';
	message += '</soap:Body>';
	message += '</soap:Envelope>';

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		try{
			var response = this.responseText;
			var result;
			try {
				result = Ti.XML.parseString(response);
			} catch(e) {
				//alert('Error');
				Ti.API.info("Error");
			}
			callBackFunction(result);
			Alloy.Globals.hideLoading();
		}
		catch(e){
			Ti.API.info('JSON parsing error... (getServicesFees)');			
		}
	};

	request.onerror = function(e) {
		var alert = Ti.UI.createAlertDialog({
			title : Alloy.Globals.selectedLanguage.appTitle,
			message : this.responseText,
			buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		alert.show();
		Alloy.Globals.hideLoading();
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.send(message);

	//return Alloy.Globals.userLoginNode;
};

// ### bruno web service ### //

exports.getAccountDetails = function(obj, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	Ti.API.info(obj.mobileno + ' userdetails obj passed ==>> ' + obj);
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_GetAccountDetails/getaccountdetailsbpel_client_ep?WSDL";

	var mobileNo = (obj.mobileno != undefined && obj.userType == 1) ? obj.mobileno : "";
	var emiratesId = (obj.emiratesId != undefined && obj.userType == 1) ? obj.emiratesId : obj.passpoertno;
	//emiratesId = (obj.passpoertno != undefined && obj.userType == 1)? obj.passpoertno : "";
	var passportId = (obj.passpoertno != undefined && obj.userType == 1) ? obj.passpoertno : "";

	var mobileNoEst = (obj.mobileNoEst != undefined && obj.userType == 2) ? obj.mobileNoEst : "";
	var tradelicense = (obj.tradelicense != undefined && obj.userType == 2) ? obj.tradelicense : "";
	var emiratesCode = (obj.emiratesCode != undefined && obj.userType == 2) ? obj.emiratesCode : "";

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:get="http://GetAccountDetails">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<get:Input>';
    message += '<get:TypeOfUser>' + obj.userType + '</get:TypeOfUser>';

    message += '<get:IndividualREC>';
    message += '<get:MobileNo>' + mobileNo + '</get:MobileNo>';
	message += '<get:EmiratesID>' + emiratesId + '</get:EmiratesID>';
	message += '<get:PassportID>' + passportId + '</get:PassportID>';
    message += '</get:IndividualREC>';

    message += '<get:EstablishmentREC>';
    message += '<get:MobileNo>' + mobileNoEst + '</get:MobileNo>';
	message += '<get:TradeLicenseNo>' + tradelicense + '</get:TradeLicenseNo>';
	message += '<get:EmiratesCode>' + emiratesCode + '</get:EmiratesCode>';
    message += '</get:EstablishmentREC>';
    message += '</get:Input>';

	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request userdetails for activation ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		//Ti.API.info('get user details responce==>> ' + JSON.stringify(this.responseText));
        var ns = "http://GetAccountDetails";
		try {
			
			var rootNode = result.getElementsByTagName("Output");
		    var subNode = result.getElementsByTagNameNS(ns, "UserDetailsREC");

		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		
        Ti.API.info(subNode.length+'get user details responce==>> ' + JSON.stringify(rootNode.length));
        
		var userDetails = [];
		
		if (rootNode.length > 0 && subNode.length > 0) {
			try {
				var actDetailData = result.getElementsByTagNameNS(ns, "AccountDetailsREC").item(0);

				var emiratesCodevalidate = actDetailData.getElementsByTagNameNS(ns, "emiratesCode");

				var account_details_obj = {
					id : (actDetailData.getElementsByTagNameNS(ns, "id").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "id").item(0).textContent : "",
					emiratesId : (actDetailData.getElementsByTagNameNS(ns, "emiratesId").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "emiratesId").item(0).textContent : "",
					mobileNo : (actDetailData.getElementsByTagNameNS(ns, "mobileNo").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "mobileNo").item(0).textContent : "",
					mobileno2 : (actDetailData.getElementsByTagNameNS(ns, "mobileno2").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "mobileno2").item(0).textContent : "",
					homePhone : (actDetailData.getElementsByTagNameNS(ns, "homePhone").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "homePhone").item(0).textContent : "",
					tradeLienceNo : (actDetailData.getElementsByTagNameNS(ns, "tradeLienceNo").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "tradeLienceNo").item(0).textContent : "",
					tradeLienceExpiry : (actDetailData.getElementsByTagNameNS(ns, "tradeLienceExpiryDate").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "tradeLienceExpiryDate").item(0).textContent : "",
					firstName : (actDetailData.getElementsByTagNameNS(ns, "firstName").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "firstName").item(0).textContent : "",
					//dob : actDetailData.getElementsByTagName("dob").item(0).textContent,
					emailAddress : (actDetailData.getElementsByTagNameNS(ns, "emailAddress").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "emailAddress").item(0).textContent : "",
					addressline1 : (actDetailData.getElementsByTagNameNS(ns, "addressline1").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "addressline1").item(0).textContent : "",
					website : (actDetailData.getElementsByTagNameNS(ns, "website").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "website").item(0).textContent : "",
					emirate : (actDetailData.getElementsByTagNameNS(ns, "emirate").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "emirate").item(0).textContent : "",
					postbox : (actDetailData.getElementsByTagNameNS(ns, "postbox").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "postbox").item(0).textContent : "",
					languageId : (actDetailData.getElementsByTagNameNS(ns, "languageId").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "languageId").item(0).textContent : "",
					//nationalityId : actDetailData.getElementsByTagName("uaqregaccount:nationalityId").item(0).textContent,
					emiratesCode : (emiratesCodevalidate.length > 0) ? actDetailData.getElementsByTagNameNS(ns, "emiratesCode").item(0).textContent : "",
					typeOfUser : (actDetailData.getElementsByTagNameNS(ns, "typeOfUser").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "typeOfUser").item(0).textContent : "",
					eidaExpiryDate : (actDetailData.getElementsByTagNameNS(ns, "eidaExpiryDate").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "eidaExpiryDate").item(0).textContent : "",
					passportNo : (actDetailData.getElementsByTagNameNS(ns, "passportNo").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "passportNo").item(0).textContent : "",
					applicanttypeid : (actDetailData.getElementsByTagNameNS(ns, "applicanttypeid").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "applicanttypeid").item(0).textContent : "",
					subcribetonewsletterflag : (actDetailData.getElementsByTagNameNS(ns, "subcribetonewsletterflag").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "subcribetonewsletterflag").item(0).textContent : "",
					countryidofcitizenshipid : (actDetailData.getElementsByTagNameNS(ns, "countryidofcitizenshipid").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "countryidofcitizenshipid").item(0).textContent : "",
					//countryidofcitizenship : actDetailData.getElementsByTagName("uaqregaccount:countryidofcitizenshipid").item(0).textContent, // TO DO for cntry name for esatblish ,not there in webservice
					countryidofcitizenship : (actDetailData.getElementsByTagNameNS(ns, "countryidofcitizenship_EN").length > 0) ? (Alloy.Globals.isEnglish) ? actDetailData.getElementsByTagNameNS(ns, "countryidofcitizenship_EN").item(0).textContent : actDetailData.getElementsByTagNameNS(ns, "countryidofcitizenship_AR").item(0).textContent : "",
					countryidofresidencyid : (actDetailData.getElementsByTagNameNS(ns, "countryidofresidencyid").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "countryidofresidencyid").item(0).textContent : "",
					//countryidofresidency : actDetailData.getElementsByTagName("uaqregaccount:countryidofresidencyid").item(0).textContent, // TO DO for cntry name for esatblish ,not there in webservice
					countryidofresidency : (actDetailData.getElementsByTagNameNS(ns, "countryidofresidency_EN").length > 0) ? (Alloy.Globals.isEnglish) ? actDetailData.getElementsByTagNameNS(ns, "countryidofresidency_EN").item(0).textContent : actDetailData.getElementsByTagNameNS(ns, "countryidofresidency_AR").item(0).textContent : "",
					emiratesName : (actDetailData.getElementsByTagNameNS(ns, "emirates_EN").length > 0) ? (Alloy.Globals.isEnglish) ? actDetailData.getElementsByTagNameNS(ns, "emirates_EN").item(0).textContent : actDetailData.getElementsByTagNameNS(ns, "emirates_AR").item(0).textContent : "",
					hasfamilybookno : (actDetailData.getElementsByTagNameNS(ns, "hasfamilybookno").length > 0) ? actDetailData.getElementsByTagNameNS(ns, "hasfamilybookno").item(0).textContent : ""
				};

				var userData = result.getElementsByTagNameNS(ns, "UserDetailsREC").item(0);
				var user_Details_obj = {
					userName : userData.getElementsByTagNameNS(ns, "userName").item(0).textContent,
					accountId : userData.getElementsByTagNameNS(ns, "accountId").item(0).textContent,
					actStatusId : userData.getElementsByTagNameNS(ns, "accountStatusId").item(0).textContent,
					mobileNo : userData.getElementsByTagNameNS(ns, "mobileNo").item(0).textContent,
					emailAddress : userData.getElementsByTagNameNS(ns, "emailAddress").item(0).textContent,
					statusMsg_en : userData.getElementsByTagNameNS(ns, "accountStatus_EN").item(0).textContent,
					statusMsg_ar : userData.getElementsByTagNameNS(ns, "accountStatus_AR").item(0).textContent,
					sourceId : userData.getElementsByTagNameNS(ns, "sourceId").item(0).textContent,
					accountStatusId : userData.getElementsByTagNameNS(ns, "accountStatusId").item(0).textContent

				};

				var userDetails = {
					account_details : account_details_obj,
					user_Details : user_Details_obj
				};

				/*var userData = result.getElementsByTagName("UserDetailsREC").item(0);
				 var user_Details_obj = {
				 actStatusId : userData.getElementsByTagName("accountStatusId").item(0).textContent,
				 statusMsg_en : userData.getElementsByTagName("accountStatus_EN").item(0).textContent,
				 statusMsg_ar : userData.getElementsByTagName("accountStatus_AR").item(0).textContent,
				 accountId : userData.getElementsByTagName("accountId").item(0).textContent
				 };*/

				Ti.API.info('soap responce user details  ==>> ' + JSON.stringify(userDetails));
				callBackFunction(userDetails);
			} catch(e) {
				//callBackFunction(null);
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			}
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			var NodeArt = result.getElementsByTagNameNS(ns, "Message_EN");
			if (NodeArt.length > 0) {
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show(); 
			} else {
				utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			}
		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.generateOTPresend = function(obj, typeUser, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Ti.API.info(' userdetails obj passed ==>> ' + JSON.stringify(obj));

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_GenerateOTP/generateotpbpel_client_ep?WSDL";
     Ti.API.info('url generatre' + url); 
	var mobileNo = (obj.mobileno != undefined && typeUser == 1) ? obj.mobileno : "";
	var emiratesId = (obj.emiratesId != undefined && typeUser == 1) ? obj.emiratesId : "";
	//emiratesId = (obj.passpoertno != undefined && obj.userType == 1)? obj.passpoertno : "";
	var passportId = (obj.passportNo != undefined && typeUser == 1) ? obj.passportNo : "";

	var mobileNoEst = (obj.mobileno != undefined && typeUser == 2) ? obj.mobileno : "";
	var tradelicense = (obj.tradelicense != undefined && typeUser == 2) ? obj.tradelicense : "";
	var emiratesCode = (obj.emiratesCode != undefined && typeUser == 2) ? obj.emiratesCode : "";

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gen="http://GenerateOTP">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<gen:Input>';
    message += '<gen:TypeOfUser>' + typeUser + '</gen:TypeOfUser>';
    message += '<gen:AccountId>' + obj.accountID + '</gen:AccountId>';
    message += '<gen:IndividualREC>';
	message += '<gen:MobileNo>' + mobileNo + '</gen:MobileNo>';
	message += '<gen:EmiratesID>' + emiratesId + '</gen:EmiratesID>';
	message += '<gen:PassportID>' + passportId + '</gen:PassportID>';
	message += '</gen:IndividualREC>';
	message += '<gen:EstablishmentREC>';
	message += '<gen:MobileNo>' + mobileNoEst + '</gen:MobileNo>';
	message += '<gen:TradeLicenseNo>' + tradelicense + '</gen:TradeLicenseNo>';
	message += '<gen:EmiratesCode>' + emiratesCode + '</gen:EmiratesCode>';
	message += '</gen:EstablishmentREC>';
    message += '</gen:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';
	
	Ti.API.info('soap request userdetails for activation ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		var ns = "http://GenerateOTP";
		try {
			
			var rootNode = result.getElementsByTagName("Output");
		    var subNode = result.getElementsByTagNameNS(ns, "Status");

		} catch(e) {
			
			Ti.API.info("error");
		}

		
		if (rootNode.length > 0 && subNode.length > 0) {

			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;

			if (status === "Success") {

				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction("success");
			} else {
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction(null);
			}
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);

		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.validateOTPwebService = function(accountID, tokenOTP, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_ValidateOTP/validateotpbpel_client_ep?WSDL";

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:val="http://validateOTP">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<val:Input>';
    message += '<val:OTPvalue>' + tokenOTP + '</val:OTPvalue>';
    message += '<val:AccountId>' + accountID + '</val:AccountId>';
    message += '</val:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request userdetails for activation ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		var ns = "http://validateOTP";
		try {
			var rootNode = result.getElementsByTagName("Output");
		    var subNode = result.getElementsByTagNameNS(ns, "Status");

			//Ti.API.info('get validateOTPwebService parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		

		if (rootNode.length > 0 && subNode.length > 0) {

			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;

			if (status === "Success") {

				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok] 
				});
				alert.show();
				callBackFunction("success");
			} else {
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction(null);
			}
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);

		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.activateAccountFrontEnd = function(obj, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_ActivateAccount/activateuseraccountbpel_client_ep?WSDL";

	var accountID = (obj.accountID != undefined) ? obj.accountID : "";
	var userType = (obj.userType != undefined) ? obj.userType : "";
	var loginusername = (obj.loginusername != undefined) ? obj.loginusername : "";
	loginusername = loginusername.toLowerCase();
	var password = (obj.password != undefined) ? obj.password : "";
	var mobileno = (obj.mobileno != undefined) ? obj.mobileno : "";
	var postbox = (obj.postbox != undefined && obj.userType == 2) ? obj.postbox : "";

	var email2 = (obj.email != undefined && obj.userType == 2 ) ? obj.email : "";
	var email1 = (obj.email != undefined && obj.userType == 1) ? obj.email : "";

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:act="http://ActivateUserAccount">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<act:Input>'; 
    message += '<act:AccountId>' + accountID + '</act:AccountId>';
	message += '<act:TypeOfUser>' + userType + '</act:TypeOfUser>';
	message += '<act:loginusername>' + loginusername + '</act:loginusername>';
	message += '<act:password>' + password + '</act:password>';
	message += '<act:mobileno>' + mobileno + '</act:mobileno>';
    message += '<act:IndividualRec>';
    message += '<act:emailAddress>' + email1 + '</act:emailAddress>';
    message += '</act:IndividualRec>';
    message += '<act:EstablishmentRec>';
    message += '<act:emailAddress>' + email2 + '</act:emailAddress>';
    message += '</act:EstablishmentRec>';
    message += '</act:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request activation for front end reg ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;

		var ns = "http://ActivateUserAccount";
		
		try {
			
			 var rootNode = result.getElementsByTagName("Output");
		     var subNode = result.getElementsByTagNameNS(ns, "Status");

		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		if (rootNode.length > 0 && subNode.length > 0) {

			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;

			if (status === "Success") {

				/*var alert = Ti.UI.createAlertDialog({
				 title : Alloy.Globals.selectedLanguage.appTitle,
				 message : (Alloy.Globals.isEnglish)?result.getElementsByTagName("uaqregactivate:Message_EN").item(0).text:result.getElementsByTagName("uaqregactivate:Message_AR").item(0).text,
				 //message: "Duplicate Account Exists",
				 buttonNames : [Alloy.Globals.selectedLanguage.ok]
				 });
				 alert.show();*/
				var messageTo = (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent;
				//generateOTPresendFRONT(accountID, userType, messageTo);
				var fontreguser = {
					messageTo : messageTo,
					accountId : accountID,
					userType : userType,
				};
				callBackFunction(fontreguser);
			} else {
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction(null);
			}
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);

		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};
// TO DO changed due to web service soa problem on UIT, need to be chagned back to previous state
exports.generateOTPresendFRONT = function(obj, callBackFunction) {

	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Ti.API.info(' userdetails obj passed ==>> ' + JSON.stringify(obj));

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/soa-infra/services/default/UAQ_REG_GenerateOTP/generateotpbpel_client_ep?WSDL";
    Ti.API.info('url otp' + url);
	
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gen="http://GenerateOTP">';
	message += '<soapenv:Header>';
    message += getPostHttpHeaderautherization();
    message += '</soapenv:Header>';
	message += '<soapenv:Body>';
	message += '<gen:Input>';
    message += '<gen:TypeOfUser>' + obj.userType + '</gen:TypeOfUser>';
	message += '<gen:AccountId>' + obj.accountId + '</gen:AccountId>';
    message += '</gen:Input>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('soap request userdetails for generateOTPresendFRONT ==>> ' + message);

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var result = this.responseXML;
		Ti.API.info('get user details parsing==>> ' + JSON.stringify(result));
		
		try {
			
			var rootNode = result.getElementsByTagName("Output");
		    var subNode = result.getElementsByTagNameNS(ns, "Status");

			//Ti.API.info('get user generateOTPresendFRONT parsing==>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		

		if (rootNode.length > 0 && subNode.length > 0) {

			var status = result.getElementsByTagNameNS(ns, "Status").item(0).textContent;

			if (status === "Success") {

				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					//message : (Alloy.Globals.isEnglish)?result.getElementsByTagName("uaqreggenerateotpnew:Message_EN").item(0).text:result.getElementsByTagName("uaqreggenerateotpnew:Message_AR").item(0).text,
					message : obj.messageTo,
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction("success");
			} else {
				var alert = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : (Alloy.Globals.isEnglish) ? result.getElementsByTagNameNS(ns, "Message_EN").item(0).textContent : result.getElementsByTagNameNS(ns, "Message_AR").item(0).textContent,
					//message: "Duplicate Account Exists",
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				alert.show();
				callBackFunction(null);
			}
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);

		}

		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.submitFeedback = function(fname, lname, mail, mobile, country, comments, callBackFunction) {
	Ti.API.info(fname + " " + lname + " " + mail + " " + mobile + " " + country + " " + comments);
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	// http://94.57.252.237:8080
	var url = Alloy.Globals.webserviceUrl + "/uaqws/asset/sendFeedback/";
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getPostHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getFeedBack Response  :" + this.responseText);
			if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
				Alloy.Globals.hideLoading();
				Ti.API.info("Unable to submit feedback...!");
				return;
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		}
		catch(e){
			Ti.API.info('JSON parsing error.... (submitFeedback)');
		}
		
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {
		});
	};
	request.setRequestHeader("Content-Type", "application/json");
	var params = {
		"firstName" : fname,
		"lastName" : lname,
		"emailAddress" : mail,
		"telephoneNumber" : mobile,
		"country" : (country=="" || country== null || country == undefined?"NA":country),
		"details" : comments
	};
	Ti.API.info('paramas ' + JSON.stringify(params));
	request.send(JSON.stringify(params));
};

exports.submitRating = function(rating, callBackFunction) {
	if (hasConnection() == false) {
		//utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	// http://94.57.252.237:8080
	var url = Alloy.Globals.webserviceUrl + "/uaqws/asset/sendHappiness/";
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getPostHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getFeedBack Response  :" + this.responseText);
			if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
				Alloy.Globals.hideLoading();
				Ti.API.info("Unable to submit feedback...!");
				return;
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();	
		}
		catch(e){
			Ti.API.info('JSON parsing error...(submitRating)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {
		});
	};
	request.setRequestHeader("Content-Type", "application/json");
	var params = {
		"site" : "Mobile",
		"questionKey" : "happiness.questionKey",
		"answer" : rating
	};
	request.send(JSON.stringify(params));
};

exports.getDeptDetails = function(callBackFunction, subIdVal) {
	Ti.API.info(subIdVal);
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	// http://94.57.252.237:8080
	var url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getDepartmentDeatil/uaq/" + subIdVal;
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);

	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getDeptDetails Response  :" + this.responseText);
			if (this.responseText == "" || this.responseText == null || this.responseText == undefined) {
				Alloy.Globals.hideLoading();
				Ti.API.info("Unable to get data from server for notification history...!");
				return;
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}	
		}
		catch(e){
			Ti.API.info('JSON parsing error... (getDeptDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.ok, function() {
		});
	};
	request.send();
};

/*
 * Dharma - About : get all funeral details list
 */

exports.getFuneralDetails = function(callBackFunction, pagenumber, recordnumber) {
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	var url;
	if (Alloy.Globals.isEnglish)
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getFuneralList/en/" + pagenumber + "/" + recordnumber;
	else
		url = Alloy.Globals.webserviceUrl + "/uaqws/asset/getFuneralList/ar/" + pagenumber + "/" + recordnumber;

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	Ti.API.info("==> Url  :" + url);
	var request = getHttpClientWithHeader(url);
	request.onload = function(e) {
		try{
			Ti.API.info("==> getFuneralDetails Response  :" + this.responseText);
			if (this.responseText == null) {
				//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
				callBackFunction(null);
			} else {
				var obj = JSON.parse(this.responseText);
				callBackFunction(obj);
			}
			Alloy.Globals.hideLoading();
		}
		catch(e){
			Ti.API.info('JSON parsing error.. (getFuneralDetails)');
		}
	};
	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		Alloy.Globals.hideLoading();
		utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError, function() {

		});
	};
	request.send();
};

/*
 * Bruno - My request service
 */
function getFilterConditionModule(paramFilter, valueFilter, conj1, conj2, uppercase) {
	var bodyMessage = "";

	bodyMessage += '<ns2:fetchStart>0</ns2:fetchStart>';
	bodyMessage += '<ns2:fetchSize>-1</ns2:fetchSize>';
	bodyMessage += '<ns2:filter>';
	bodyMessage += '<ns2:conjunction>' + conj1 + '</ns2:conjunction>';
	bodyMessage += '<ns2:group>';
	bodyMessage += '<ns2:conjunction>' + conj2 + '</ns2:conjunction>';
	bodyMessage += '<ns2:upperCaseCompare>' + uppercase + '</ns2:upperCaseCompare>';
	bodyMessage += '<ns2:item>';
	bodyMessage += getBodyEnvelop(paramFilter, valueFilter);
	bodyMessage += '</ns2:item>';
	bodyMessage += '</ns2:group>';
	bodyMessage += ' </ns2:filter>';

	return bodyMessage;
}

exports.getPostPaymentService = function(callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findApplicantRequestView1";

	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/PaymentServiceBrokenTransaction/PostPaymentServicePort";
	// Keep this on 7th as per Gireesh told

	var userid = Ti.App.Properties.getObject("LoginDetaisObj");
	userid = (Ti.App.Properties.getObject("LoginDetaisObj") == null ? 0 : Ti.App.Properties.getObject("LoginDetaisObj").userName);
	Ti.API.info('username in payment broken' + userid);
	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.pymt.middleware.uaq/">';
	message += '<soapenv:Header/>';
	message += '<soapenv:Body>';
	message += '<ser:postPaymentServiceBrokenTransactions>';
	message += '<arg0>' + userid + '</arg0>';
	message += '<arg1>';
	message += '<password>welcome1</password>';
	message += '<username>uaqdev</username>';
	message += '</arg1>';
	message += '</ser:postPaymentServiceBrokenTransactions>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('filter request message>> ' + JSON.stringify(message));

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);

		Ti.API.info('requestview responce=>> ' + JSON.stringify(response));

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			//Ti.API.info(result + 'filter condtion my request responce=>> ' + JSON.stringify(result));  //noRecordsFound
		} catch(e) {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}

		var rootNode = result.getElementsByTagName("uaq:postPaymentServiceBrokenTransactionsResponse");

		Ti.API.info('payment broken length res==>> ' + rootNode.length);
		var arrMyRequest = [];
		if (rootNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;

			Ti.API.info('payment broken length res= list data ==>> ' + JSON.stringify(rootNode) + " ff ");

			callBackFunction(result.getElementsByTagName("uaq:postPaymentServiceBrokenTransactionsResponse").item(0).text);
		} else {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}

	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);

};

exports.getMyRequestService = function(callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findApplicantRequestView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";
	// Keep this on 7th as per Gireesh told
	// var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQCommonMiddlewareService/CommonServicesPort";

	var paramFilter = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueFilter = ["And", "false", "UserName", "=", Ti.App.Properties.getObject("LoginDetaisObj").userName];

	var param = ["ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:findAttribute", "ns2:excludeAttribute"];
	var value = ["RequestNo", "RequestId", "ServiceId", "CreatedDate", "ModifiedDate", "StatusId", "Source", "false"];

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findApplicantRequestView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += getFilterConditionModule(paramFilter, valueFilter, "And", "And", "false");
	message += '<ns2:sortOrder><ns2:sortAttribute>';
	message += '<ns2:name>CreatedDate</ns2:name>';
	message += '<ns2:descending>true</ns2:descending>';
	message += '</ns2:sortAttribute>';
	message += '</ns2:sortOrder>';
	message += getBodyEnvelop(param, value);
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl>';
	message += '</ns1:findApplicantRequestView1>';
	message += '</soap:Body></soap:Envelope>';

	/*var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mod="http://model.common.service.uaq/" xmlns:val="http://ValidateAuthenticationToken">';
	 message += '<soapenv:Header/>';
	 message += '<soapenv:Body>';
	 message += '<mod:getMyRequest>';
	 message += '<arg0>';
	 message += '<val:login_username>pritam12</val:login_username>';
	 message += '</arg0><arg1>';
	 message += '<password>welcome1</password>';
	 message += '<username>uaqdev</username>';
	 message += '</arg1>';
	 message += '</mod:getMyRequest>';
	 message += '</soapenv:Body></soapenv:Envelope>';*/

	Ti.API.info('filter request message>> ' + JSON.stringify(message));

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);

		//Ti.API.info('requestview responce=>> ' + JSON.stringify(response));

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			//Ti.API.info(result + 'filter condtion my request responce=>> ' + JSON.stringify(result));  //noRecordsFound
		} catch(e) {
			callBackFunction(null);
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}

		var rootNode = result.getElementsByTagName("uaq:findApplicantRequestView1Response");
		var subNode = result.getElementsByTagName("uaq:RequestNo");
		Ti.API.info(subNode.length + 'my request list length==>> ' + rootNode.length);
		var arrMyRequest = [];
		if (rootNode.length > 0 && subNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;

			for (var i = 0; i < subNode.length; i++) {
				Ti.API.info('my request  list data ==>> ' + result.getElementsByTagName("uaq:RequestNo").item(i).textContent);
				arrMyRequest.push({
					requestNo : result.getElementsByTagName("uaq:RequestNo").item(i).textContent,
					requestid : result.getElementsByTagName("uaq:RequestId").item(i).textContent,
					statusId : result.getElementsByTagName("uaq:StatusId").item(i).textContent,
					serviceId : result.getElementsByTagName("uaq:ServiceId").item(i).textContent,
					source : result.getElementsByTagName("uaq:Source").item(i).textContent,
					createdDate : result.getElementsByTagName("uaq:CreatedDate").item(i).textContent,
					modifiedDate : result.getElementsByTagName("uaq:ModifiedDate").item(i).textContent,
				});
			}

			callBackFunction(arrMyRequest);
		} else if (rootNode.length == 1 && subNode.length == 0) {
			callBackFunction(1);
			//utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.noRecordsFound);
		} else {
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);

};

exports.getMyreqFeesValues = function(requestNo, callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findLpToWhomConcernView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findLpToWhomConcernView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:filter>';
	message += '<ns2:conjunction>And</ns2:conjunction>';
	message += '<ns2:group>';
	message += '<ns2:conjunction>And</ns2:conjunction>';
	message += '<ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	message += '<ns2:item>';
	message += '<ns2:conjunction>And</ns2:conjunction>';
	message += '<ns2:upperCaseCompare>false</ns2:upperCaseCompare>';
	message += '<ns2:attribute>RequestNo</ns2:attribute>';
	message += '<ns2:operator>=</ns2:operator>';
	message += '<ns2:value>' + requestNo + '</ns2:value>';
	message += '</ns2:item>';
	message += '</ns2:group>';
	message += '</ns2:filter>';
	message += '<ns2:excludeAttribute>false</ns2:excludeAttribute>';
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl>';
	message += '</ns1:findLpToWhomConcernView1>';
	message += '</soap:Body></soap:Envelope>';
	Ti.API.info('filter condtion my request responce=>> ' + JSON.stringify(message));
	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);
		Ti.API.info(response + 'filter condtion my request responce=>> ' + JSON.stringify(response));
		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			Ti.API.info(result + 'filter condtion my request responce=>> ' + JSON.stringify(result));
		} catch(e) {
			Ti.API.info('Error');
		}

		var rootNode = result.getElementsByTagName("uaq:findLpToWhomConcernView1Response");

		//var subNode = result.getElementsByTagName("uaq:ServiceNameEn");
		Ti.API.info('my request list length==>> ' + rootNode.length);
		var arrAddressto = [];
		if (rootNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;
			try {
				for (var i = 0; i < rootNode.length; i++) {
					Ti.API.info('my request  list data ==>> ' + result.getElementsByTagName("uaq:AddressedtoId").item(i).textContent);
					arrAddressto.push({
						addressto : result.getElementsByTagName("uaq:AddressedtoId").item(i).textContent,
					});
				}
				callBackFunction(arrAddressto);
			} catch(e) {
				arrAddressto.push({
					addressto : "0",
				});

				callBackFunction(arrAddressto);
			}

		} else {
			arrAddressto.push({
				addressto : "0",
			});

			callBackFunction(arrAddressto);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.getServiceLookUpcall = function(serviceId, callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findServiceLookupsView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	var paramFilter = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueFilter = ["And", "false", "ServiceId", "=", serviceId];

	var param = ["ns2:findAttribute", "ns2:findAttribute", "ns2:excludeAttribute"];
	var value = ["ServiceNameEn", "ServiceNameAr", "false"];

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findServiceLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += getFilterConditionModule(paramFilter, valueFilter, "And", "And", "false");
	message += getBodyEnvelop(param, value);
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl>';
	message += '</ns1:findServiceLookupsView1>';
	message += '</soap:Body></soap:Envelope>';

	Ti.API.info('filter condtion getServiceLookUpcall my request responce=>> ' + JSON.stringify(message));

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			Ti.API.info(result + 'filter condtion my request responce=>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:findServiceLookupsView1Response");
		var subNode = result.getElementsByTagName("uaq:ServiceNameEn");
		Ti.API.info('my request list length==>> ' + rootNode.length);
		var arrServiceName = [];
		if (rootNode.length > 0 && subNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;

			for (var i = 0; i < rootNode.length; i++) {
				Ti.API.info('my request  list data ==>> ' + result.getElementsByTagName("uaq:ServiceNameEn").item(i).textContent);
				arrServiceName.push({
					serviceNme : (Alloy.Globals.isEnglish) ? result.getElementsByTagName("uaq:ServiceNameEn").item(i).textContent : result.getElementsByTagName("uaq:ServiceNameAr").item(i).textContent,
				});
			}

			callBackFunction(arrServiceName);
		} else {
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			Alloy.Globals.hideLoading();
		}
		//Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);

};

exports.getServiceStatusIdLookUp = function(statusId, callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findStatusLookupsView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQEServiceServiceInterface/AppModuleService";

	var paramFilter = ["ns2:conjunction", "ns2:upperCaseCompare", "ns2:attribute", "ns2:operator", "ns2:value"];
	var valueFilter = ["And", "false", "StatusId", "=", statusId];

	var param = ["ns2:findAttribute", "ns2:findAttribute", "ns2:excludeAttribute"];
	var value = ["StatusEn", "StatusAr", "false"];

	var message = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	message += '<soap:Body>';
	message += '<ns1:findStatusLookupsView1 xmlns:ns1="/uaq/db/si/model/common/types/">';
	message += '<ns1:findCriteria xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += getFilterConditionModule(paramFilter, valueFilter, "And", "And", "false");
	message += getBodyEnvelop(param, value);
	message += '</ns1:findCriteria>';
	message += '<ns1:findControl xmlns:ns2="http://xmlns.oracle.com/adf/svc/types/">';
	message += '<ns2:retrieveAllTranslations>true</ns2:retrieveAllTranslations>';
	message += '</ns1:findControl>';
	message += '</ns1:findStatusLookupsView1>';
	message += '</soap:Body></soap:Envelope>';
	Ti.API.info('getServiceStatusIdLookUp  request=>> ' + JSON.stringify(message));

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			Ti.API.info(result + 'getServiceStatusIdLookUp my request responce=>> ' + JSON.stringify(response));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:findStatusLookupsView1Response");
		var subNode = result.getElementsByTagName("uaq:StatusAr");
		Ti.API.info('my request list length==>> ' + rootNode.length);
		var arrStatusName = [];
		if (rootNode.length > 0 && subNode.length > 0) {
			//var status = result.getElementsByTagName("NationalitynameEn").item(i).text;

			for (var i = 0; i < rootNode.length; i++) {
				Ti.API.info('my request  list data ==>> ' + result.getElementsByTagName("uaq:StatusEn").item(i).textContent);
				arrStatusName.push({
					statusNm : (Alloy.Globals.isEnglish) ? result.getElementsByTagName("uaq:StatusEn").item(i).textContent : result.getElementsByTagName("uaq:StatusAr").item(i).textContent,
				});

			}

			callBackFunction(arrStatusName);
		} else {
			callBackFunction(null);
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		}
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};

exports.getReviewerService = function(obj, callBackFunction) {
	Ti.API.info('hasConnection() ==>> ' + hasConnection());
	if (hasConnection() == false) {
		utilities.showAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}

	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
	var soapAction = "/uaq/db/si/model/common/findStatusLookupsView1";

	//var url = Alloy.Globals.SOADWebServiceUrl+"/UAQEServiceServiceInterface/AppModuleService";  http://94.57.252.237:8080
	var url = Alloy.Globals.SOAPLOOKUPServiceUrl + "/UAQServiceMiddleLayer/MyRequestServicePort";

	var param = ["arg0", "arg1", "arg2", "arg3", "arg4"];
	var value = [obj.statusId, obj.serviceId, obj.requestno, obj.requestId, obj.serviceName];

	var message = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.middleware.uaq/">';
	message += '<soapenv:Header/>';
	message += '<soapenv:Body>';
	message += '<ser:callReviewerService>';
	message += getBodyEnvelop(param, value);
	message += '<arg5>';
	message += '<password>' + ServerPassword + '</password>';
	message += '<username>' + ServerUsername + '</username>';
	message += '</arg5>';
	message += '</ser:callReviewerService>';
	message += '</soapenv:Body></soapenv:Envelope>';

	Ti.API.info('getReviewerService  request=>> ' + JSON.stringify(message));

	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		var response = getXMLFormate(this.responseText);

		var result;
		try {
			result = Ti.XML.parseString(response);
			//result = Ti.XML.parseString(this.responseXML.toString());
			//Ti.API.info(result + 'filter condtion my request responce=>> ' + JSON.stringify(result));
		} catch(e) {
			//alert('Error');
			Ti.API.info("Error");
		}

		var rootNode = result.getElementsByTagName("uaq:callReviewerServiceResponse");
		/*var subNode = result.getElementsByTagName("ns1:StatusAr");
		 Ti.API.info('my request list length==>> ' + rootNode.length);
		 var arrStatusName = [];
		 if (rootNode.length > 0 && subNode.length > 0) {
		 //var status = result.getElementsByTagName("NationalitynameEn").item(i).text;

		 for (var i = 0; i < rootNode.length; i++) {
		 Ti.API.info('my request  list data ==>> ' + result.getElementsByTagName("ns1:StatusEn").item(i).textContent);
		 arrStatusName.push({
		 statusNm : (Alloy.Globals.isEnglish)? result.getElementsByTagName("ns1:StatusEn").item(i).textContent : result.getElementsByTagName("ns1:StatusAr").item(i).textContent,
		 });

		 }

		 callBackFunction(arrStatusName);
		 }else{
		 callBackFunction(null);
		 utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
		 }*/
		Alloy.Globals.hideLoading();
	};

	request.onerror = function(e) {
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);

		Alloy.Globals.hideLoading();

		callBackFunction(null);

		if (request.status != 200) {
			Alloy.Globals.hideLoading();
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.serviceError);
			return;
		}
	};

	request.open("POST", url);
	request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//request.setRequestHeader('SOAPAction', soapAction);
	request.send(message);
};
