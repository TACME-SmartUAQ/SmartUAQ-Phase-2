//Global function for show alert from any screen
/**
 * Show alert
 * @param {String} title
 * @param {String} message
 */
Alloy.Globals.fb = require('facebook');
Alloy.Globals.fb.appid = "810638079054259";

var fb = Alloy.Globals.fb;
var TWITTER_CONSUMER_SECRET = "eMfqUnbmrwaLqoUnLjFpgOX9VdyBsb9XSRvN34t0Q8JAVdpLsO";
var TWITTER_CONSUMER_KEY = "HRsWE0OfbyslVO089tsucjd0x";

exports.showAlert = function(title, message, callback, win) {

	try {
		var a = Ti.UI.createAlertDialog({
			title : title || Ti.App.name,
			message : message,
			// buttonNames:["OK"],
			buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		if ( typeof callback == 'function') {
			a.addEventListener('click', function(e) {
				callback(e);
			});
		}
		a.show();
	} catch(e) {
		var a = Ti.UI.createAlertDialog({
			title : "UAQ",
			message : message,
			buttonNames : ["OK"],
			//buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		a.show();
	}
};

/**
 * Show confirmation alert
 * @param {String} title
 * @param {String} message
 */
exports.showConfirmAlert = function(title, message, callback) {

	try {
		var a = Ti.UI.createAlertDialog({
			title : title || Ti.App.name,
			message : message,
			cancel : 0,
			buttonNames : [(Alloy.Globals.selectedLanguage.cancel ? Alloy.Globals.selectedLanguage.cancel : "Cancel"), (Alloy.Globals.selectedLanguage.ok ? Alloy.Globals.selectedLanguage.ok : "OK")]
		});
		if ( typeof callback == 'function') {
			a.addEventListener('click', function(e) {
				callback(e);
			});
		}
		a.show();
	} catch(e) {
		var a = Ti.UI.createAlertDialog({
			title : "UAQ",
			message : message,
			buttonNames : ["OK"],
			//buttonNames : [Alloy.Globals.selectedLanguage.ok]
		});
		a.show();
	}
};

/**
 * pop window to show images
 *
 */
exports.popup = function(imagePath) {
	var win = Ti.UI.createWindow({
		backgroundColor : 'transparent',
		fullscreen : false,
		navBarHidden : false,
		//opacity : 0.50,
		id : "popup"
	});
	win.orientationModes = [Ti.UI.PORTRAIT];

	var blur = Ti.UI.createAnimation({
		opacity : 0.50
	});
	var shadow = Ti.UI.createView({
		left : 0,
		right : 0,
		opacity : 0.50,
		backgroundColor : 'gray'
	});
	var frmLog = Ti.UI.createView({
		top : 110,
		bottom : 210,
		height : 280,
		opacity : 1,
		width : "80%",
		borderRadius : 10,
		backgroundColor : 'white',
		layout : "vertical"
	});

	var imageview = Ti.UI.createImageView({
		image : imagePath,
		top : 20,
		//width: "80%",
		height : 200
	});

	var cancelBtn = Ti.UI.createButton({
		width : "90%",
		height : 35,
		borderRadius : 5,
		top : 20,
		bottom : 20,
		title : Alloy.Globals.selectedLanguage.cancel,
		// backgroundColor : Alloy.Globals.path.titleRedColor,
		backgroundImage : Alloy.Globals.path.btnRed,
		color : Alloy.Globals.path.whiteColor,
		font : Alloy.Globals.path.font15,
	});
	cancelBtn.addEventListener('click', function(e) {
		win.close();
	});

	frmLog.add(imageview);
	frmLog.add(cancelBtn);

	shadow.animate(blur);
	win.add(shadow);
	win.add(frmLog);
	win.open();
};

/**
 * Create formatted html
 * @param {String} language
 * @param {String} content
 * @param {Number} textSize
 * @param {Boolean} isDefault
 */
exports.getFormattedHtml = function(language, content, textSize, isDefault) {

	try {
		var colorfont,
		    colorback;
		if (isDefault) {
			colorfont = Alloy.Globals.path.whiteColor;
			colorback = Alloy.Globals.path.blackColor;
		} else {
			colorfont = Alloy.Globals.path.blackColor;
			colorback = Alloy.Globals.path.whiteColor;
		}
		var htmlContent = "<!DOCTYPE html>";
		htmlContent += "<html lang=\"en\">";
		htmlContent += "<head>";
		htmlContent += "<meta charset=\"utf-8\">";
		htmlContent += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
		htmlContent += '<meta name="viewport" content="initial-scale=0" user-scalable="0">';
		//htmlContent += "<meta name=\"viewport\" content=\"width=300, initial-scale=1, maximum-scale=1,user-scalable=0\">";
		htmlContent += "<title>Title of the document</title>";
		htmlContent += "<style type=\"text/css\">";

		if (language == 1) {
			htmlContent += 'html, body, p, h1, h2{padding:0px; margin:0px; }';
			htmlContent += 'body {font-family: Tahoma, Helvetica, sans-serif; font-size:' + (((Alloy.isTablet) ? 1.0 : 0.8) + textSize) + 'em; margin:1em; }';
			htmlContent += 'h1, h2 {font-family: Arial, Helvetica, sans-serif; font-size:' + (((Alloy.isTablet) ? 1.5 : 1.3) + textSize) + 'em; padding-top: 1.8em}';
			htmlContent += 'body > h1:first-child {padding-top: 0}';
			htmlContent += 'h2 {font-size:' + (((Alloy.isTablet) ? 1.4 : 1.2) + textSize) + 'em;; padding-top: 1.2em; text-decoration: underline}';
			htmlContent += 'ul, ol {padding:0 1.5em; margin:0px;}';
			htmlContent += 'li {padding: 0.2em 0}';
			htmlContent += '.certDetails {padding: 0 1em}';
			htmlContent += '.certDetails h2:first-child {padding-top: 0.2em}';
			htmlContent += '.redPadd {padding-top: 0.2em}';

			htmlContent += "</style>";
			htmlContent += "</head>";

			htmlContent += "<body text=" + colorfont + " bgcolor=" + colorback + ">";
			htmlContent += "<div id=\"container\">";
		} else {
			htmlContent += 'html, body, p, h1, h2{padding:0px; margin:0px; }';
			htmlContent += 'body {font-family: Tahoma, Helvetica, sans-serif; font-size:' + (((Alloy.isTablet) ? 1.0 : 0.8) + textSize) + 'em; margin:1em; }';
			htmlContent += 'h1, h2 {font-family: Arial, Helvetica, sans-serif; font-size:' + (((Alloy.isTablet) ? 1.4 : 1.2) + textSize) + 'em; padding-top: 1.8em}';
			htmlContent += 'body > h1:first-child {padding-top: 0}';
			htmlContent += 'h2 {font-size:' + (((Alloy.isTablet) ? 1.4 : 1.2) + textSize) + 'em;; padding-top: 1.2em; text-decoration: underline}';
			htmlContent += 'ul, ol {padding:0 1.5em; margin:0px;}';
			htmlContent += 'li {padding: 0.2em 0}';
			htmlContent += '.certDetails {padding: 0 1em}';
			htmlContent += '.certDetails h2:first-child {padding-top: 0.2em}';
			htmlContent += '.redPadd {padding-top: 0.2em}';

			htmlContent += "</style>";
			htmlContent += "</head>";

			htmlContent += "<body dir=\"rtl\" text=" + colorfont + " bgcolor=" + colorback + ">";
			htmlContent += "<div id=\"container\">";
		}

		htmlContent += content;
		htmlContent += "</div></body></html>";
		Ti.API.info(">>>>>>>" + htmlContent);
		return htmlContent;
	} catch(e) {
		return "";
		Ti.API.info('ERROR IN GET FORMATTED HTML CONTENT');
	}

};
/**
 * Send an email
 * @param {String} emailid
 * @param {String} message
 * @param {Function} callBack
 */
exports.sendMail = function(emailId, subject, message, callBack) {
	var emailDialog = Ti.UI.createEmailDialog({});
	if (emailDialog.isSupported()) {
		emailDialog.subject = subject;
		emailDialog.toRecipients = [emailId];
		emailDialog.messageBody = message;
		emailDialog.html = true;
		callBack(true);
		emailDialog.open();

	} else {
		callBack(false);
		exports.showAlert(Alloy.Globals.selectedLanguage.sendMail, Alloy.Globals.selectedLanguage.mailAccountMsg);
	}
};

/**
 * Set zooming on map regions
 * @param {Object} points
 */
exports.getFitZoomMapRegionWithCoords = function(points) {
	/* Function set the region of the map as per the annotations latitude and longitude
	 so that the all annoation pin Fit on the map and can see all the annotion together.
	 */
	var topLeftLatitude = -90;
	var topLeftLongitude = 180;
	var bottomRightLatitude = 90;
	var bottomRightLongitude = -180;

	for (var i = 0; i < points.length; i++) {
		var reg = points[i];
		topLeftLongitude = Math.min(topLeftLongitude, parseFloat(reg.longitude));
		topLeftLatitude = Math.max(topLeftLatitude, parseFloat(reg.latitude));
		bottomRightLongitude = Math.max(bottomRightLongitude, parseFloat(reg.longitude));
		bottomRightLatitude = Math.min(bottomRightLatitude, parseFloat(reg.latitude));
	}

	var fitLatitude = topLeftLatitude - (topLeftLatitude - bottomRightLatitude) * 0.5;
	var fitLongitude = topLeftLongitude + (bottomRightLongitude - topLeftLongitude) * 0.5;
	var fitSpanLatDelta = Math.abs(topLeftLatitude - bottomRightLatitude) * 1.1;
	var fitSpanLongDelta = Math.abs(bottomRightLongitude - topLeftLongitude) * 1.1;
	if (fitSpanLatDelta == 0 && fitSpanLongDelta == 0) {
		fitSpanLatDelta = fitSpanLongDelta = 0.01;
	}
	var fitRegion = {
		latitude : fitLatitude,
		longitude : fitLongitude,
		latitudeDelta : fitSpanLatDelta,
		longitudeDelta : fitSpanLongDelta
	};

	return fitRegion;
};

/**
 * Clean HTML content
 * @param {String} content
 */
exports.cleanHtml = function(content) {
	//alert("success");
	try {
		Ti.API.info('contetnt' + content);
		if (content != undefined) {
			content = content.replace(/<html[^>]*>/g, '').replace(/<\/html>/g, '');
			content = content.replace(/<body[^>]*>/g, '').replace(/<\/body>/g, '');
			content = content.replace(/<b[^>]*>/g, '').replace(/<\/b>/g, '');
			content = content.replace(/&amp;/g, '&');
			content = content.replace(/&ldquo;/g, '"');
			content = content.replace(/&quot;/g, '"');
			content = content.replace(/&rdquo;/g, '"');
			content = content.replace(/&ndash;/g, '-');
			content = content.replace(/&rsquo;/g, '\'');
			content = content.replace(/&lsquo;/g, '\'');
			content = content.replace(/&nbsp;/g, ' ');
			content = content.replace(/\u200e/g, '');
			content = content.replace(/&rqduo;/g, '\"');
			content = content.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
			content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
			content = content.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
			content = content.replace(/<strong[^>]*>/g, '').replace(/<\/strong>/g, '');
			content = content.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
			content = content.replace(/<br *\/?>/gi, '\n');

			return content;
		}
	} catch(e) {
		return "";
		Ti.API.info('Error ' + e.message);
	}
};

exports.cleanFuneralHtml = function(content) {
	// alert("success");  //:-
	try {
		//content = content.replace(/<br *\/?>/gi, '\n');
		content = content.replace(/\r/g, '');
		content = content.replace(/\n/g, '');
		content = content.replace(/\t/g, '');
		content = content.replace(/<html[^>]*>/g, '').replace(/<\/html>/g, '');
		content = content.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '');
		content = content.replace(/<body[^>]*>/g, '').replace(/<\/body>/g, '');
		//content = content.replace(/<b[^>]*>/g, '').replace(/<\/b>/g, '');
		content = content.replace(/&amp;/g, '&');
		content = content.replace(/:-/g, ':');
		content = content.replace(/&ldquo;/g, '"');
		content = content.replace(/&quot;/g, '"');
		content = content.replace(/&rdquo;/g, '"');
		content = content.replace(/&ndash;/g, '-');
		content = content.replace(/&rsquo;/g, '\'');
		content = content.replace(/&lsquo;/g, '\'');
		content = content.replace(/&nbsp;/g, ' ');
		content = content.replace(/\u200e/g, '');
		content = content.replace(/&rqduo;/g, '\"');
		content = content.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '\n');
		content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
		content = content.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
		content = content.replace(/<strong[^>]*>/g, '').replace(/<\/strong>/g, '');
		// content = content.replace(/<em[^>]*>/g, '').replace(/<\/em>/g, '');
		content = content.replace(/<br *\/?>/gi, '\n ');
		//content = content.replace(/<br\s*[\/]?>/gi, '\n');
		//content = content.replace(/<br \/>/gi, '121\n');
		content = content.replace(/\<br\s*\>/g, '\n');

		return content;
	} catch(e) {
		return "";
		Ti.API.info('Error ' + e.message);
	}

};

/**
 * Function is used for getting user's current location by "Titanium.Geolocation.getCurrentPosition" function.
 * @param {Function} callback
 */
exports.getCurrentLocation = function(callback) {
	try {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				callback({
					latitude : 25.3994029,
					longitude : 55.5305745,
					isAuthorised : false
				});
			} else {
				/*	var longitude = e.coords.longitude;
				 var latitude = e.coords.latitude;
				 var altitude = e.coords.altitude;
				 var heading = e.coords.heading;
				 var accuracy = e.coords.accuracy;
				 var speed = e.coords.speed;
				 var timestamp = e.coords.timestamp;
				 var altitudeAccuracy = e.coords.altitudeAccuracy;*/
				var coords = e.coords;
				coords.isAuthorised = true;
				Alloy.Globals.UserLocation = e.coords;
				Ti.API.log('geo - current location: ' + JSON.stringify(coords));
				callback(coords);
			}
		});
	} catch(e) {
		Ti.API.info('ERROR IN GET CURRENT LOCATION');
	}

};
/**
 * Start location manager
 * @param {Object} e
 */
exports.startLocationManager = function(e) {
	try {
		if (Ti.Geolocation.locationServicesEnabled != true) {
			exports.showAlert(Alloy.Globals.selectedLanguage.gpsLocation, Alloy.Globals.selectedLanguage.gpsLocationMessage);
			Alloy.Globals.UserLocation = {
				latitude : 24.492187,
				longitude : 54.375679
			};
			return;
		}
		Ti.Geolocation.preferredProvider = "GPS";
		Titanium.Geolocation.purpose = "For UMM ALQUWAIN government.";

		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.distanceFilter = 10;

		var locationCallback = function(e) {
			if (!e.success || e.error) {
				return;
			}
			Alloy.Globals.UserLocation = e.coords;
			//Ti.App.fireEvent('locationUpdate');
		};

		Alloy.Globals.getCurrentLocation(function(e) {
			Titanium.Geolocation.addEventListener('location', locationCallback);
		});
	} catch(e) {
		Ti.API.info('ERROR IN STORE LOCATION MANAGER ');
	}

};

/**
 * Call to number
 * @param {Object} number
 */
exports.makeCall = function(number) {
	try {
		if (exports.isUndefined(number) == false)
			return;
		number += "";
		number = number.replace(" ", "");

		if (Ti.Platform.osname == 'android') {
			var phoneNum = "tel:" + number;
			var confomAlert = Ti.UI.createAlertDialog({
				title : Alloy.Globals.selectedLanguage.callTitle,
				//message : Alloy.Globals.selectedLanguage.callConformAlert + number + ((Alloy.Globals.isArabic) ? "؟" : "?"),
				message : number + ((Alloy.Globals.isArabic) ? "؟" : "?"),
				buttonNames : [Alloy.Globals.selectedLanguage.cancel, Alloy.Globals.selectedLanguage.call]
			});
			confomAlert.addEventListener('click', function(e) {
				if (e.index == 1) {
					Ti.Platform.openURL(phoneNum);
				}
			});
			confomAlert.show();
		} else {
			var phoneNum = "telprompt:" + number;

			if (Ti.Platform.canOpenURL(phoneNum)) {
				Ti.Platform.openURL(phoneNum);
			} else {
				exports.showAlert(Alloy.Globals.selectedLanguage.call, Alloy.Globals.selectedLanguage.noCallAlert);
			}
		}
	} catch(e) {
		Ti.API.info('ERROR IN MAKING A CALL');
	}

};

/**
 * Create random colors
 */
/*exports.createGuid = function() {
function _p8(s) {
var p = (Math.random().toString(16) + "000000000").substr(2, 8);
return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
}

return _p8() + _p8(true) + _p8(true) + _p8();
};*/

/**
 * Adding randomColor property in Alloy.Globals
 */
/*Object.defineProperty(Alloy.Globals, 'randomColor', {
get : function() {
//alert('inn11');
return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
});*/

/**
 * Disable Multi touch
 * @param {Object} view
 */
exports.disableMultiTouch = function(view) {
	view.touchEnabled = false;
	var st = setTimeout(function() {
		view.touchEnabled = true;
		if (st) {
			clearTimeout(st);
		}
	}, 1000);
};

/**
 * Check to see if the object is undefined
 * @param {Object} obj
 */
exports.isUndefined = function(obj) {
	if ( typeof obj == undefined || obj == null || obj == "" || obj == 'null' || obj == 'undefined') {
		return false;
	} else if ( typeof obj.trim == 'function') {
		return obj.trim();
	} else {
		return obj;
	}
};

/**
 * Validate email id
 * @param {Object} str
 */

/*
 function validateEmail(email) {
 var re = /[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(com|ae|uk|in)/g;
 var valid = re.test(email);
 return valid;
 };
 */

exports.isValidEmail = function(str) {
	var regularExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (exports.isUndefined(str)) {
		return regularExp.test(str);
	}
	return false;
};

/**
 * Validate Password
 * @param {Object} str
 */
exports.isPasswordValid = function(str) {
	var regExp = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/;
	if (exports.isUndefined(str)) {
		return regExp.test(str);
	}
	return false;
};
/**
 * Check if the enter value is number
 * @param {Object} text
 */
exports.validateNo = function(number) {
	//return /^(?:\971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/.test(phone);
	var pattern = /^(?:50|51|52|55|56|2|4|5|8|1|3|6|7|9)\d{7}$/;
	if (exports.isUndefined(number)) {
		return pattern.test(number);
	}
	return false;
};
/**
 * Check if the enter name/surname (character) is valid character or not?
 * @param {Object} text
 */
exports.validateCharacters = function(inputtxt) {
	// var letters = /^[A-Za-z]+$/;
	//var letters = /^([a-zA-Z]+\s)*[a-zA-Z]+$/; // this reg. expression allows space and characters in input field not allowed caps letter
	//var letters = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;

	var letters = /[\s./,:;'"*&^%!@#$"+=٠١٢٣٤٥٦٧٨٩0-9]+/;
	// this reg. expression allows space and characters in input field.
	if (inputtxt.match(letters)) {
		return false;
	} else {
		return true;
	}
};
/**
 * Check if the string is of arabic language
 * @param {Object} text
 */
exports.isArabic = function(str) {
	var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
	result = pattern.test(str);
	return result;
};
/**
 * Check if the string is of arabic language
 * @param {Object} text
 */
exports.validatePhone = function(number) {
	var abc = /^(?:50|51|52|55|56|2|4|5|8|1|3|6|7|9)\d{8}$/;
	var pattern = /^(?:5)\d{8}$/;
	if (exports.isUndefined(number)) {
		return pattern.test(number);
	}
	return false;
};
// convert dp to pixel.
exports.dpToPixel = function(dp) {
	return (parseInt(dp) * (Titanium.Platform.displayCaps.dpi / 160));
};
// convert pixel to dp.
exports.pixelToDp = function(px) {
	return (parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160)) + 'dp';
};

exports.selectImageFrom = function(source, callback) {
	var options = {
		success : function(e) {
			if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				callback(e);
			}
		},
		cancel : function() {
			Ti.API.info(' Cancelled ');
		},
		error : function(e) {
			if (error.code == 2) {
				exports.showAlert(Alloy.Globals.selectedLanguage.attachMedia, Alloy.Globals.selectedLanguage.cameraNotAvail);
			} else {
				exports.showAlert(Alloy.Globals.selectedLanguage.attachMedia, e);
			}
		},
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
		allowEditing : true
	};
	if (source == 'gallery') {
		Ti.Media.openPhotoGallery(options);
	} else if (source == 'camera') {
		var success = true;
		if (OS_IOS) {
			success = Titanium.Media.isCameraAccessible();
		}
		if (success) {
			Ti.Media.showCamera(options);
		}
	}
};

/**
 * Add keyboard toolbar
 * @param {Array} textfields
 * @param {Function} callback
 */
exports.addKeyboarToolbar = function(arrTextField, callback) {
	if (OS_IOS) {
		var send = Titanium.UI.createButton({
			title : Alloy.Globals.selectedLanguage.doneTitle,
			style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
		});
		var flexSpace = Titanium.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var toolBar = Ti.UI.iOS.createToolbar({
			items : [flexSpace, flexSpace, flexSpace, flexSpace, send],
			backgroundColor : "#999999",
		});
		send.addEventListener('click', callback);
		for (var i = 0,
		    length = arrTextField.length; i < length; i++) {
			arrTextField[i].keyboardToolbar = toolBar;
		}
	}
};

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

/**
 * Calculate distance between two gps points
 * @param {Object} lat1
 * @param {Object} lon1
 * @param {Object} lat2
 * @param {Object} lon2
 */
exports.getDistance = function(lat1, lon1, lat2, lon2) {
	Ti.API.info('Latitude: ' + lat1 + " Longitude: " + lon1 + " Latitude 2:" + lat2 + " Longitude: " + lon2);
	var R = 6371;
	// Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);
	// deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	// Distance in km
	return parseInt(d);
};

/**
 * Function to get current weather
 *
 */
function parseWeatherResponse(data) {

	try {
		var retVal = {
			iconName : undefined,
			temp : undefined,
			text : undefined
		};

		var xml = Ti.XML.parseString(data);
		retVal.iconName = (xml.getElementsByTagName('weather').item(0).getElementsByTagName('cc').item(0).getElementsByTagName('icon').item(0).textContent);
		retVal.temp = (xml.getElementsByTagName('weather').item(0).getElementsByTagName('cc').item(0).getElementsByTagName('tmp').item(0).textContent);
		retVal.text = (xml.getElementsByTagName('weather').item(0).getElementsByTagName('cc').item(0).getElementsByTagName('t').item(0).textContent);
		// alert(retVal);
		return retVal;
	} catch (ex) {
		return {
			iconName : undefined,
			temp : undefined,
			text : undefined
		};
	}
};

exports.parser = function(fn_end) {
	if (Ti.Network.online) {
		try {
			var xhr = Ti.Network.createHTTPClient({
				onerror : function() {
					Ti.API.info('Connection Error!!\n Please try again later.');
				},
				onload : function() {
					var result = parseWeatherResponse(this.responseText);
					fn_end(result);
				},
				timeout : 10000
			});
			xhr.open('GET', 'http://wxdata.weather.com/wxdata/weather/local/AEXX0001?cc=*&dayf=1&link=xoap&prod=xoap&par=1160927424&key=6da813a3f61c2558&unit=m');
			xhr.send();
		} catch (ex) {
			Ti.API.info('Exception: ' + ex);
		}
	}
};

// Momentjs
exports.moment = require('alloy/moment');

/*********************************************************************************/
/***********************SOCIAL NETWORK INTEGRATION********************************/
/*********************************************************************************/
exports.facebook = function() {
	if (Titanium.Network.online) {
		Ti.API.info('Is Facebook Logged In :: ' + Alloy.Globals.fb.loggedIn);
		if (Alloy.Globals.fb.loggedIn) {
			Ti.API.info('Authorization success...');
			exports.facebookLoginCallback({
				success : true
			});
		} else {
			Ti.API.info('Trying to Authorize....');
			Alloy.Globals.fb.authorize();
		}
	} else {
		exports.alertDialogBox(L('no_internet_connection'));
	}
};

/**
 * Get data from facebook once logged in
 */
exports.getProfileFromFacebook = function(fble, fbProfileCallback) {
	if (fble.success) {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
		Alloy.Globals.fb.permissions = ['publish_stream', 'email', 'read_stream', 'publish_actions', 'manage_notifications'];
		Alloy.Globals.fb.requestWithGraphPath('me', {
			fields : "first_name,last_name,picture{url},id,email,name,birthday"
		}, 'GET', function(e) {
			Ti.API.info('GET FB PROFILE == ' + JSON.stringify(e));
			if (e.success) {
				Ti.API.info('Response from Facebook:' + JSON.stringify(e));
				var data = JSON.parse(e.result);
				fbProfileCallback(data);
			}
			Alloy.Globals.hideLoading();
		});
	}
};

function shareOnFacebookProfile(obj, callback) {
	try{
		fb.requestWithGraphPath('me/feed', obj, 'POST', function(event) {
			if (event.success) {
				callback('success');
			} else {
				callback('failure');
			}
		});
	}
	catch(e){
		Ti.API.info('ERROR in shareOnFacebookProfile : '+JSON.stringify(e));
	}
}

exports.facebookShareOnIOS = function(obj, callBack) {
	if (OS_IOS) {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
	}
	fb.appid = "810638079054259";
	fb.permissions = ['publish_actions'];
	fb.initialize(1000);
	
	if (fb.loggedIn) {
		shareOnFacebookProfile(obj, callBack);
	} else {
		fb.authorize();
		fb.addEventListener('login', function(e) {
			if (e.success) {
				shareOnFacebookProfile(obj, callBack);
			} else if (e.error) {
				callBack('failure');
				Alloy.Globals.hideLoading();
			} else if (e.cancelled) {
				alert("Canceled");
			}

		});
	}
};

/*
 * Facebook Share
 */

var win = Ti.UI.createWindow({
	backgroundColor : '#80000000',
});

var alertT,
    objShare,
    SharecallBack;
function winOpen() {
	win.removeEventListener("open", winOpen);
	try {
		if (!fb.loggedIn) {
			Alloy.Globals.hideLoading();
			fb.authorize();
		} else {
			Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
			shareOnFBDialog(win, alertT, objShare, SharecallBack);
		}
	} catch(e) {
		Ti.API.info('EXCEPTION  Authorize == ' + JSON.stringify(e));
		if (!fb.loggedIn) {
			Alloy.Globals.hideLoading();
			fb.authorize();
		} else {
			Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
			shareOnFBDialog(win, alertT, objShare, SharecallBack);
		}
	}
}

function facebookLoginSuccess(e) {
	fb.removeEventListener('login', facebookLoginSuccess);
	Ti.API.info('LOGIN == ' + JSON.stringify(e));
	if (e.success) {
		shareOnFBDialog(win, alertT, objShare, SharecallBack);
	} else if (e.cancelled) {
		Alloy.Globals.hideLoading();
		win.close();
		if (OS_ANDROID) {
			setTimeout(function(e) {
				exports.showAlert(alertT, Alloy.Globals.selectedLanguage.facebookCancel);
			}, 300);
		} else {
			exports.showAlert(alertT, Alloy.Globals.selectedLanguage.facebookCancel);
		}

	}
}

fb.addEventListener('shareCompleted', function(e) {
	if (e.success) {
		exports.showAlert(alertT, Alloy.Globals.selectedLanguage.shareFBSuccess);
		SharecallBack(true);
		Alloy.Globals.hideLoading();
	} else if (e.error) {
		exports.showAlert(alertT, Alloy.Globals.selectedLanguage.shareFBFail);
	} else {
		exports.showAlert(alertT, Alloy.Globals.selectedLanguage.facebookCancel);
	}
	Alloy.Globals.hideLoading();
});

function shareOnFBDialog(win, alertTitle, obj, callBack) {
	Alloy.Globals.hideLoading();
	
	Ti.API.info('win: '+win);
	Ti.API.info('alertTitle: '+alertTitle);
	Ti.API.info('obj: '+JSON.stringify(obj));
	Ti.API.info('callBack: '+callBack);
	Ti.API.info('getCanPresentShareDialog: '+fb.getCanPresentShareDialog());
	
	if (fb.getCanPresentShareDialog()) {
		try{
			if (OS_IOS) {
				fb.presentWebShareDialog({
					link : ((obj.contentLink == "") ? 'http://www.uaq.gov.ae/web/guest' : obj.contentLink),
					name : Alloy.Globals.selectedLanguage.govtUAQ,
					description : obj.messageBody,
					caption : alertTitle,
					picture : (obj.picture == "") ? "http://www.mygov.ae/mygov/App_Themes/imagesnew/logo-uae_ar.gif" : obj.picture
				});
			} else {
				fb.presentShareDialog({
					link : ((obj.contentLink == "") ? 'http://www.uaq.gov.ae/web/guest' : obj.contentLink),
					name : Alloy.Globals.selectedLanguage.govtUAQ,
					description : obj.messageBody,
					caption : alertTitle,
					picture : (obj.picture == "") ? "http://www.mygov.ae/mygov/App_Themes/imagesnew/logo-uae_ar.gif" : obj.picture
				});
			}
		}
		catch(e){
			Ti.API.info('Error in getCanPresentShareDialog() == false : '+JSON.stringify(e));
		}
	} else {
		try{
			fb.presentWebShareDialog({
				link : ((obj.contentLink == "") ? 'http://www.uaq.gov.ae/web/guest' : obj.contentLink),
				name : Alloy.Globals.selectedLanguage.govtUAQ,
				description : obj.messageBody,
				caption : alertTitle,
				picture : obj.picture
				// picture : (obj.picture == "") ? "http://www.am.gov.ae/Style%20Library/Images/Logo.gif" : obj.picture
			});
		}
		catch(e){
			Ti.API.info('Error in getCanPresentShareDialog() == false : '+JSON.stringify(e));
		}
	}
}

exports.facebookShare = function(alertTitle, obj, callBack) {
	fb.addEventListener('login', facebookLoginSuccess);
	if (OS_ANDROID) {
		win.fbProxy = Alloy.Globals.fb.createActivityWorker({
			lifecycleContainer : win
		});
	}
	Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
	fb.forceDialogAuth = true;
	//fb.permissions = ['read_stream'];

	alertT = alertTitle;
	objShare = obj;
	SharecallBack = callBack;
	win.addEventListener("open", winOpen);
	try {
		if (OS_ANDROID) {
			if (!fb.loggedIn) {
				win.open();
			} else {
				shareOnFBDialog(win, alertT, objShare, SharecallBack);
			}

		} else {
			if (!fb.loggedIn) {
				fb.authorize();
			} else {
				shareOnFBDialog(win, alertT, objShare, SharecallBack);
			}
		}
	} catch(e) {
		Ti.API.info('EXCEPTION  Authorize == ' + JSON.stringify(e));
	}

};

/**
 * Login to Twitter
 */
function getTwitterUserInfo(obj, callBack) {
	var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
	    accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');

	var Twitter = require('TwitterMain').Twitter;

	var client = Twitter({
		consumerKey : TWITTER_CONSUMER_KEY,
		consumerSecret : TWITTER_CONSUMER_SECRET,
		accessTokenKey : accessTokenKey,
		accessTokenSecret : accessTokenSecret
	});

	client.addEventListener('login', function(e) {
		if (e.success) {
			Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
			Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);

			client.request("1.1/users/show.json", {
				screen_name : obj.screen_name
			}, "GET", function(e) {
				if (e.success) {
					var strResponse = e.result.text;
					// strResponse = strResponse.replace(/\\/g,"");
					var objResult = JSON.parse(strResponse);
					callBack(objResult);
				} else {
					alert("FAIL TO LOGIN");
					exports.showAlert("alertTitle", Alloy.Globals.selectedLanguage.shareTwitterFail);
				}
				Alloy.Globals.hideLoading();
			});

		} else {
			Alloy.Globals.hideLoading();
			callBack(null);
		}
	});

	client.authorize();
}

exports.twitter = function(callBack) {
	if (Titanium.Network.online) {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading, false);
		var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
		    accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');

		var Twitter = require('TwitterMain').Twitter;

		var client = Twitter({
			consumerKey : TWITTER_CONSUMER_KEY,
			consumerSecret : TWITTER_CONSUMER_SECRET,
			accessTokenKey : accessTokenKey,
			accessTokenSecret : accessTokenSecret
		});

		client.addEventListener('login', function(e) {
			if (e.success) {
				Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
				Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);

				client.request("1.1/account/settings.json", {}, "GET", function(obj) {
					if (obj.success) {
						var strResponse = obj.result.text;
						strResponse = strResponse.replace(/\\/g, "");
						var objResult = JSON.parse(strResponse);
						getTwitterUserInfo(objResult, callBack);

					} else {
						callBack(null);
						Alloy.Globals.hideLoading();
					}
				});

			} else {
				Alloy.Globals.hideLoading();
				callBack(null);
			}
		});

		client.authorize();
	} else {

	}
};

var social = require('social').create({
	site : "twitter",
	consumerSecret : TWITTER_CONSUMER_KEY,
	consumerKey : TWITTER_CONSUMER_SECRET
});

var isResponseGot = false;
exports.shareOnTwitter = function(alertTitle, messageBody, callBack) {
	isResponseGot = false;
	var len = (messageBody.length > 140) ? 140 : messageBody.length;
	msgBody = messageBody.substr(0, len);
	if (Titanium.Network.online) {
		Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
		    accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');
		var Twitter = require('TwitterMain').Twitter;
		var client = Twitter({
			consumerKey : TWITTER_CONSUMER_KEY,
			consumerSecret : TWITTER_CONSUMER_SECRET,
			accessTokenKey : accessTokenKey,
			accessTokenSecret : accessTokenSecret
		});
		client.addEventListener('login', function(e) {
			if (e.success) {
				Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
				Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
				client.request("1.1/statuses/update.json", {
					status : msgBody
				}, "POST", function(e) {
					if (isResponseGot) {
						return;
					}
					isResponseGot = true;
					var isSuccess = false;
					if (e.success) {
						//exports.showAlert(alertTitle, Alloy.Globals.selectedLanguage.shareTwitterSuccess);
						isSuccess = true;
					} else if (e.result.text.indexOf("duplicate") > 0) {
						//exports.showAlert(alertTitle, Alloy.Globals.selectedLanguage.duplicateMessage);
						isSuccess = false;
					} else {
						//exports.showAlert(alertTitle, Alloy.Globals.selectedLanguage.shareTwitterFail);
						isSuccess = null;
					}
					Alloy.Globals.hideLoading();
					callBack(isSuccess);
				});

			} else {
				Alloy.Globals.hideLoading();
				callBack(false);
			}
		});
		client.authorize();
		if (!OS_IOS) {
			Alloy.Globals.hideLoading();
		}

	} else {
		alert(L('no_internet_connection'));
	}
};

/**
 * Logout from twitter
 */
exports.twitterLogout = function() {
	Alloy.Globals.birdHouse.deauthorize(function(e) {
		if (e === true) {
			Ti.App.Properties.removeProperty('ttname');
			var client = Titanium.Network.createHTTPClient();
			client.clearCookies('https://twitter.com/');
			alert("Logged out from twitter successfully.");
		} else {
			alert('Failed to deauthorize Twiiter \n Please try again.');
		}
	});
};

/*********************************************************************************/
exports.getDDMMYYYY = function(nDate) {
	var arr = nDate.split(' ');
	arr = arr[0].split('/');
	var d2 = new Date(arr[2], parseInt(arr[0]) - 1, arr[1]);
	return d2;
};
exports.getDateFromString = function(nDate) {
	var arr = nDate.split('/');
	var d2 = new Date(arr[2], parseInt(arr[0]) - 1, arr[1]);
	return d2;
};

exports.CleanHtml = function(content) {
	//alert("success");
	try {
		content = content.replace(/<html[^>]*>/g, '').replace(/<\/html>/g, '');
		content = content.replace(/<body[^>]*>/g, '').replace(/<\/body>/g, '');
		content = content.replace(/<b[^>]*>/g, '').replace(/<\/b>/g, '');
		content = content.replace(/&amp;/g, '&');
		content = content.replace(/&ldquo;/g, '"');
		content = content.replace(/&quot;/g, '"');
		content = content.replace(/&rdquo;/g, '"');
		content = content.replace(/&ndash;/g, '-');
		content = content.replace(/&rsquo;/g, '\'');
		content = content.replace(/&lsquo;/g, '\'');
		content = content.replace(/&nbsp;/g, ' ');
		content = content.replace(/\u200e/g, '');
		content = content.replace(/&rqduo;/g, '\"');
		content = content.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
		content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
		content = content.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
		content = content.replace(/<strong[^>]*>/g, '').replace(/<\/strong>/g, '');
		content = content.replace(/<br *\/?>/gi, '\n');

		return content;
	} catch(e) {
		return "";
		Ti.API.info('ERROR IN CLEAN HTML ....');
	}

};

exports.DeleteFileFromOffline = function(fileName) {
	// Test if External Storage (Android only)
	if (Ti.Filesystem.isExternalStoragePresent()) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory + "attachments", fileName);
	}

	// No SD or iOS
	else {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "attachments", fileName);
	}

	// Save file

	// Debug: Test if file exist now
	if (file.exists) {
		file.deleteFile();
		Ti.API.info('[deleteFile] Deleted: YES! (' + fileName + ')');
	}
};

/**
 * PUSH NOTIFICATION
 */
/*var deviceToken = null;
function subscribeToChannel() {

	Alloy.Globals.Cloud.PushNotifications.subscribeToken({
		device_token : deviceToken,
		channel : 'test Alert',
		type : OS_ANDROID ? 'android' : 'ios'
	}, function(e) {
		if (e.success) {
			Ti.API.info('Subscribed');
			Ti.App.Properties.setString("deviceToken", deviceToken);
			// loginUser();
		} else {
			Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function receivePush(e) {
	Ti.API.info('Received push: ' + JSON.stringify(e));
	alert(e.data.alert);
	// Ti.UI.iPhone.appBadge = Ti.UI.iPhone.appBadge - 1;
}

function deviceTokenError(e) {
	alert('Failed to register for push notifications! ' + e.error);
}

exports.getDeviceTocken = function(callBackFunction) {
	if (Ti.Network.online == false) {
		//Alloy.Globals.ShowAlert(Alloy.Globals.selectedLanguage.networkError, Alloy.Globals.selectedLanguage.noInternet);
		return;
	}
	if (Ti.App.Properties.hasProperty("deviceToken")) {
		deviceToken = Ti.App.Properties.getString("deviceToken");
		callBackFunction(deviceToken);
		return;
	}
	if (OS_IOS) {
		if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {

			Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

				Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

				Ti.Network.registerForPushNotifications({
					success : function(e) {
						deviceToken = e.deviceToken;

						Ti.API.info('Device Token: ' + deviceToken);
						subscribeToChannel();
						callBackFunction(deviceToken);
					},
					error : deviceTokenError,
					callback : receivePush
				});
			});

			Ti.App.iOS.registerUserNotificationSettings({
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
		} else {
			Ti.Network.registerForPushNotifications({
				types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
				success : function(e) {
					deviceToken = e.deviceToken;

					Ti.API.info('Device Token: ' + deviceToken);
					subscribeToChannel();
					callBackFunction(deviceToken);
				},
				error : deviceTokenError,
				callback : receivePush
			});
		}
	} else {
		Alloy.Globals.CloudPush.retrieveDeviceToken({
			success : function(e) {
				deviceToken = e.deviceToken;

				Ti.API.info('Device Token: ' + deviceToken);
				subscribeToChannel();
				callBackFunction(deviceToken);
			},
			error : deviceTokenError,
		});

	}
};
*/
var pinkeysen = ["medicalservices", "governmentalCenters", "Shopping", "publicServices", "tourismAndLeisure", "restaurants", "plantation", "flats"];
var pinImageKey = ["pinHospital", "pinBank", "pinShopping", "pinOffice", "pinPark", "pinRestaurant", "platationIconSelected", "flatIconSelected"];
var bigPinImageKey = ["bigPinHospital", "bigPinBank", "bigPinShopping", "bigPinOffice", "bigPinPark", "bigPinRestaurant", "bigPlatationIconSelected", "bigFlatIconSelected"];

/**
 * Get Pin Images
 */
exports.getPinImages = function() {
	var pinImages = {};
	for (var key in pinkeysen) {
		if (OS_IOS) {
			pinImages[Alloy.Globals.selectedLanguage[pinkeysen[key]]] = (Alloy.Globals.currentTheme == 'dark') ? Alloy.Globals.allpaths.dark[pinImageKey[key]] : Alloy.Globals.path[pinImageKey[key]];
		} else {
			pinImages[Alloy.Globals.selectedLanguage[pinkeysen[key]]] = (Alloy.Globals.currentTheme == 'dark') ? Alloy.Globals.allpaths.dark[bigPinImageKey[key]] : Alloy.Globals.path[bigPinImageKey[key]];
		}
	}
	Ti.API.info('--' + JSON.stringify(pinImages));
	return pinImages;
};
/**
 * Get Big Pin Images
 */
exports.getBigPinImages = function() {
	var pinImages = {};
	for (var key in pinkeysen) {
		pinImages[Alloy.Globals.selectedLanguage[pinkeysen[key]]] = (Alloy.Globals.currentTheme == 'dark') ? Alloy.Globals.allpaths.dark[bigPinImageKey[key]] : Alloy.Globals.path[bigPinImageKey[key]];
	}
	Ti.API.info('--' + JSON.stringify(pinImages));
	return pinImages;
};

exports.getImageUrl = function(url) {
	Ti.API.info('---------------------------------' + url);
	if (exports.isUndefined(url)) {
		url = url.replace('edmzsspwfe01', '83.111.145.117');
		Ti.API.info('URL: ' + url);
	}
	return url;
};

/*
 * Ravindra Changes
 */

exports.openWebsite = function(webURL, comingFrom) {
	Ti.API.info('url is :'+webURL +" Came from : "+comingFrom);
	
	if (exports.isUndefined(webURL) == false)
		return;
	//(comingFrom == "contact"?"https://":"http://")
	var preProtocol = (comingFrom=="dept"? "http://":"https://");
	
	if (Ti.Platform.osname == 'android') {
		//var website = "https://" + webURL;
		var website = preProtocol + webURL;
		Ti.API.info('URL is: '+website);
		var confomAlert = Ti.UI.createAlertDialog({
			title : Alloy.Globals.selectedLanguage.webTitle,
			message : website + ((Alloy.Globals.isArabic) ? "؟" : "?"),
			buttonNames : [Alloy.Globals.selectedLanguage.cancel, Alloy.Globals.selectedLanguage.open]
		});
		confomAlert.addEventListener('click', function(e) {
			if (e.index == 1) {
				Ti.Platform.openURL(website);
			}
		});
		confomAlert.show();
	} else {
		//var website = "https://" + webURL;
		var website = preProtocol + webURL;
		Ti.API.info('URL is: '+website);
		//if (Ti.Platform.canOpenURL(webURL)) {
			var confomAlert = Ti.UI.createAlertDialog({
				title : Alloy.Globals.selectedLanguage.webTitle,
				message : website + ((Alloy.Globals.isArabic) ? "؟" : "?"),
				buttonNames : [Alloy.Globals.selectedLanguage.cancel, Alloy.Globals.selectedLanguage.open]
			});
			confomAlert.addEventListener('click', function(e) {
				if (e.index == 1) {
					Ti.Platform.openURL(website);
				}
			});
			confomAlert.show();
		// } else {
			// exports.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.webURLMsg);
		// }
	}
};

function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

/*
 * Changes by Ravindra
 */

exports.getGeoLocation = function(latitude, longitude, callback) {
	Titanium.Geolocation.reverseGeocoder(latitude, longitude, function(evt) {
		if (evt.success) {
			var places = evt.places;
			if (places && places.length) {
				street = places[0].address;
				callback(places[0].address);
			} else {
				var address = "No address found";
				callback("No address found");
			}
		} else {
			callback("Not Available");
		}
	});
};

/*
 * Nikunj : Exctract the notification data(Ids) as I needed from all notifications data and pass those Ids as Mark as Read message notifications.
 */

exports.exctractIdsForCategory = function(categoryId) {
	try {
		var allData = Alloy.Globals.storedAllNotificationData;
		Ti.API.info('ALL GLOBAL NOTIFICATION DATAs ARE::: ' + JSON.stringify(allData));
		var exctractedIds = [];
		Ti.API.info('EXCTRACT THE DATA FOR THIS CATEGORY:  ' + categoryId);

		for (var i = 0; i < allData.length; i++) {
			var msgData = JSON.parse(allData[i].message);
			// Ti.API.info('CATEGORY Id: '+categoryId +" AND MATCHED nTypeId VALUE : "+msgData.nTypeId);
			if (msgData.nTypeId == categoryId) {
				exctractedIds.push(allData[i].messageId);
			} else {
				Ti.API.info('NO MATCH....!');
			}
		}
		Ti.API.info('RETURNED IDs: ' + exctractedIds);
		if (exctractedIds.length > 0) {
			return exctractedIds;
		} else {
			return "empty";
		}

	} catch(e) {
		Ti.API.info('%%%%%%%%%%%%%%%% GETTING ERROR IN EXCTRACTING DATA CATEGORY WISE %%%%%%%%%%%%%%%% ');
		return "empty";
	}
};

/*
 * Ravindra Changes
 */

var social = require('social');
var twitter = social.create({
	consumerSecret : TWITTER_CONSUMER_SECRET,
	consumerKey : TWITTER_CONSUMER_KEY,
	cb : function(bool) {
		if (!bool) {
			var currentLanguage = Ti.App.Properties.getString("userLanguage", "en");
			Ti.App.Properties.twitterButton.image = (currentLanguage == "en") ? icons.connectButton : icons.connectButton_ar;
			Ti.App.Properties.twitterImage.image = icons.twitterOff;
		}
	}
});

var closeWebView = function() {
	twitter.closeWin();
};

exports.closeWebView = closeWebView;

exports.twitterIsAuthorized = function() {
	return twitter.isAuthorized();
};

exports.twitterAuthentication = function() {
	if (twitter.isAuthorized()) {
		twitter.deauthorize();
	} else {
		twitter.authorize();
	}
};

var logoutTwitter = function() {
	if (twitter.isAuthorized()) {
		twitter.deauthorize();
	}
};

exports.logoutTwitter = logoutTwitter;

exports.twitterSharePost = function(obj, callback) {
	if (Titanium.Network.online) {
		//Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
		twitter.share({
			message : obj.message,
			success : function(e) {
				Alloy.Globals.hideLoading();
				callback("Success");
			},
			error : function(e) {
				Alloy.Globals.hideLoading();
				callback("Failure");
			}
		});
	} else {
		alert(L('no_internet_connection'));
	}
};

var geocoding = require('geocoding').Geocoding();
exports.reverseGeocodingNew = function(lat, lng, callBack) {
	geocoding.reverse({
		latitude : lat,
		longitude : lng,
		language : Alloy.Globals.languageCode,
		success : function(e) {
			Ti.API.info('REVERSE GEOCODING ===  === ' + JSON.stringify(e));
			callBack(e);

			// e.results.forEach(function(result){
			// Ti.API.info(result.address);
			// });
		},
		error : function(e) {
			Ti.API.info(e);
		}
	});
};
