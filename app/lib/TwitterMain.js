// var exports = exports || this;
exports.Twitter = (function(global) {
	var K = function() {
	},
	    isAndroid = Ti.Platform.osname === "android",
	    jsOAuth = require('twitter/jsOAuth-1.3.1');

	/**
	 * Twitter constructor function
	 *
	 *     var client = Twitter({
	 *       consumerKey: "INSERT YOUR KEY HERE",
	 *       consumerSecret: "INSERT YOUR SECRET HERE"
	 *     });
	 *
	 * Can be used with or without `new` keyword.
	 *
	 * @constructor
	 * @requires jsOAuth: http://github.com/bytespider/jsOAuth
	 * @param options {Object} Configuration object
	 * @param options.consumerKey {String} Application consumer key
	 * @param options.consumerSecret {String} Application consumer secret
	 * @param options.accessTokenKey {String} (optional) The user's access token key
	 * @param options.accessTokenSecret {String} (optional) The user's access token secret
	 * @param [options.windowTitle="Twitter Authorization"] {String} (optional) The title to display in the authentication window
	 */
	var Twitter = function(options) {
		var self;

		if (this instanceof Twitter) {
			self = this;
		} else {
			self = new K();
		}

		if (!options) {
			options = {};
		}
		self.windowTitle = options.windowTitle || "Twitter Authorization";
		self.consumerKey = options.consumerKey;
		self.consumerSecret = options.consumerSecret;
		self.authorizeUrl = "https://api.twitter.com/oauth/authorize";
		self.accessTokenKey = options.accessTokenKey;
		self.accessTokenSecret = options.accessTokenSecret;
		self.authorized = false;
		self.listeners = {};

		if (self.accessTokenKey && self.accessTokenSecret) {
			self.authorized = true;
		}

		options.requestTokenUrl = options.requestTokenUrl || "https://api.twitter.com/oauth/request_token";
		self.oauthClient = jsOAuth.OAuth(options);

		return self;
	};

	K.prototype = Twitter.prototype;

	function createAuthWindow() {
		var self = this,
		    oauth = this.oauthClient,
		    webViewWindow = (OS_IOS ) ? Ti.UI.createWindow({
			title : this.windowTitle
		}) : Ti.UI.createWindow({
			title : this.windowTitle,
			windowSoftInputMode : Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE
		}),
		    webView = Ti.UI.createWebView({
			top : (Alloy.Globals.isIOS7Plus) ? 70 : 50,
			bottom : 0,
		}),

		    loadingOverlay = Ti.UI.createView({
			backgroundColor : 'black',
			opacity : 0.7,
			zIndex : 1
		}),
		    actInd = Titanium.UI.createActivityIndicator({
			height : 45,
			width : 10,
			message : 'Loading...',
			color : 'white'
		}),
		    closeButton = Ti.UI.createButton({
			title : "Close"
		}),
		    backButton = Ti.UI.createButton({
			title : "Back"
		});

		var navView = Ti.UI.createView({
			top : 0,
			height : (Alloy.Globals.isIOS7Plus) ? 70 : 50,
			width : "100%",
			backgroundColor : "white"
		});

		webViewWindow.add(navView);

		var btnNavClose = Ti.UI.createButton({
			top : (Alloy.Globals.isIOS7Plus) ? 30 : 10,
			left : 15,
			width : 60,
			height : 30,
			borderColor : "#2F99F9",
			color : "#2F99F9",
			font : {
				fontSize : "14sp"
			},
			title : 'Close',
			backgroundColor : "transparent"
		});
		navView.add(btnNavClose);

		this.webView = webView;

		webViewWindow.leftNavButton = closeButton;

		actInd.show();
		//loadingOverlay.add(actInd);
		webViewWindow.add(loadingOverlay);
		webViewWindow.open({
			modal : true
		});

		webViewWindow.add(webView);

		btnNavClose.addEventListener('click', function(e) {
			Alloy.Globals.hideLoading();
			webViewWindow.close();

			Ti.App.fireEvent("cancelSharing");
			self.fireEvent('cancel', {
				success : false,
				error : "The user cancelled.",
				result : null
			});
		});

		backButton.addEventListener('click', function(e) {
			webView.goBack();
		});

		webViewWindow.addEventListener("androidback", function(e) {
			Ti.App.fireEvent("cancelSharing");
			webViewWindow.close();
		});

		webView.addEventListener('beforeload', function(e) {
			if (!isAndroid) {
				webViewWindow.add(loadingOverlay);
			}
			actInd.show();
		});

		var webViewFirstLoad = true;
		webView.addEventListener('error', function(event) {
			webViewWindow.remove(loadingOverlay);
			actInd.hide();
			Ti.App.fireEvent("cancelSharing");
			webViewWindow.close();
		});
		webView.addEventListener('load', function(event) {
			// If we're not on the Twitter authorize page
			if (event.url.indexOf(self.authorizeUrl) === -1) {
				webViewWindow.remove(loadingOverlay);
				actInd.hide();
				// Required for Android

				// Switch out close button for back button
				if (webViewWindow.leftNavButton !== backButton) {
					webViewWindow.leftNavButton = backButton;
				}
			} else {
				// Switch out back button for close button
				if (webViewWindow.leftNavButton !== closeButton) {
					webViewWindow.leftNavButton = closeButton;
				}
			}

			// Grab the PIN code out of the DOM

			//Sort out android with version > 4.4.2
			if (isAndroid && Ti.Platform.version >= '4.4.2') {
				//Need to setup a collection method.

				webViewWindow.remove(loadingOverlay);
				actInd.hide();

				if (!webViewFirstLoad) {
					var promptView = Ti.UI.createView({
						width : '70%',
						height : '15%',
						layout : "vertical",
						backgroundColor : 'white',
						bottom : "15%",
						borderColor:"white"
					}),
					
				    pinField = Ti.UI.createTextField({
						width : Ti.UI.FILL,
						font : {
							fontSize : '16sp'
						},
						height : Ti.UI.SIZE,
						borderColor: 'white',
						hintText : 'Please Enter PIN'
					}),
					
					pinButton = Ti.UI.createButton({
						width : Ti.UI.SIZE,
						height : Ti.UI.SIZE,
						title : "Authorize"
					});

					promptView.add(pinField);
					promptView.add(pinButton);
					webViewWindow.add(promptView);

					pinButton.addEventListener('click', function() {
						if (!pinField.value) {
							alert('Please enter the PIN');
						} else {
							var pin = pinField.value;

							if (!isAndroid) {// on iOS we can close the modal window right away
								webViewWindow.close();
							}

							oauth.accessTokenUrl = "https://api.twitter.com/oauth/access_token?oauth_verifier=" + pin;

							oauth.fetchAccessToken(function(data) {
								var returnedParams = oauth.parseTokenRequest(data.text);
								self.fireEvent('login', {
									success : true,
									error : false,
									accessTokenKey : returnedParams.oauth_token,
									accessTokenSecret : returnedParams.oauth_token_secret
								});

								if (isAndroid) {// we have to wait until now to close the modal window on Android: http://developer.appcelerator.com/question/91261/android-probelm-with-httpclient
									webViewWindow.close();
								}
							}, function(data) {
								self.fireEvent('login', {
									success : false,
									error : "Failure to fetch access token, please try again.",
									result : data
								});
							});
						}
					});
				} else {
					webViewFirstLoad = false;
				}

			} else {
				var pin = event.source.evalJS("document.getElementById('oauth_pin').getElementsByTagName('code')[0].innerText");

				if (!pin) {
					// We're here when:
					// - "No thanks" button clicked
					// - Bad username/password
					// - we just don't have a PIN yet'

					webViewWindow.remove(loadingOverlay);
					actInd.hide();
				} else {
					if (!isAndroid) {// on iOS we can close the modal window right away
						webViewWindow.close();
					}

					oauth.accessTokenUrl = "https://api.twitter.com/oauth/access_token?oauth_verifier=" + pin;

					oauth.fetchAccessToken(function(data) {
						var returnedParams = oauth.parseTokenRequest(data.text);
						self.fireEvent('login', {
							success : true,
							error : false,
							accessTokenKey : returnedParams.oauth_token,
							accessTokenSecret : returnedParams.oauth_token_secret
						});

						if (isAndroid) {// we have to wait until now to close the modal window on Android: http://developer.appcelerator.com/question/91261/android-probelm-with-httpclient
							webViewWindow.close();
						}
					}, function(data) {
						self.fireEvent('login', {
							success : false,
							error : "Failure to fetch access token, please try again.",
							result : data
						});
					});
				}
			}

		});

	}

	/*
	 * Requests the user to authorize via Twitter through a modal WebView.
	 */
	Twitter.prototype.authorize = function() {
		var self = this;

		if (this.authorized) {
			// TODO: verify access tokens are still valid?

			// We're putting this fireEvent call inside setTimeout to allow
			// a user to add an event listener below the call to authorize.
			// Not totally sure if the timeout should be greater than 1. It
			// seems to do the trick on iOS/Android.
			setTimeout(function() {
				self.fireEvent('login', {
					success : true,
					error : false,
					accessTokenKey : self.accessTokenKey,
					accessTokenSecret : self.accessTokenSecret
				});
			}, 1);
		} else {
			createAuthWindow.call(this);

			this.oauthClient.fetchRequestToken(function(requestParams) {
				var authorizeUrl = self.authorizeUrl + requestParams;
				self.webView.url = authorizeUrl;
			}, function(data) {
				self.fireEvent('login', {
					success : false,
					error : "Failure to fetch access token, please try again.",
					result : data
				});
			});
		}
	};

	/*
	 * Make an authenticated Twitter API request.
	 *
	 * @param {String} path the Twitter API path without leading forward slash. For example: `1/statuses/home_timeline.json`
	 * @param {Object} params  the parameters to send along with the API call
	 * @param {String} [httpVerb="GET"] the HTTP verb to use
	 * @param {Function} callback
	 */
	Twitter.prototype.request = function(path, params, httpVerb, callback) {
		var self = this,
		    oauth = this.oauthClient,
		    url = "https://api.twitter.com/" + path;

		oauth.request({
			method : httpVerb,
			url : url,
			data : params,
			success : function(data) {
				callback.call(self, {
					success : true,
					error : false,
					result : data
				});
			},
			failure : function(data) {
				callback.call(self, {
					success : false,
					error : "Request failed",
					result : data
				});
			}
		});
	};

	/*
	 * Add an event listener
	 */
	Twitter.prototype.addEventListener = function(eventName, callback) {
		this.listeners = this.listeners || {};
		this.listeners[eventName] = this.listeners[eventName] || [];
		this.listeners[eventName].push(callback);
	};

	/*
	 * Fire an event
	 */
	Twitter.prototype.fireEvent = function(eventName, data) {
		var eventListeners = this.listeners[eventName] || [];
		for (var i = 0; i < eventListeners.length; i++) {
			eventListeners[i].call(this, data);
		}
	};

	return Twitter;
})(this);
