//
// based off of code from https://github.com/sintaxi/node-dbox
//
/**
 * OAUTH CLIENT CODE
 */
var oauth = function(consumerKey, consumerSecret) {

	var encode = function(data) {
		return encodeURIComponent(data || "").replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
	};
	var getSignature = function(tokenSecret) {
		return encode(consumerSecret) + "&" + encode(tokenSecret);
	};
	var getTimestamp = function() {
		return (Math.floor((new Date()).getTime() / 1000)).toString();
	};
	var getNonce = function(timestamp) {
		return timestamp + Math.floor(Math.random() * 100000000);
	};

	return function(options) {
		var options = JSON.parse(JSON.stringify(options));
		var secret = options["oauth_token_secret"];
		var signature = getSignature(secret);
		var timestamp = getTimestamp();
		var nonce = getNonce(timestamp);

		options["oauth_consumer_key"] = consumerKey;
		options["oauth_signature"] = signature;
		options["oauth_timestamp"] = timestamp;
		options["oauth_nonce"] = nonce;
		options["oauth_signature_method"] = "PLAINTEXT";
		options["oauth_version"] = "1.0";
		delete options["oauth_token_secret"];
		delete options["uid"];

		return options;
	};
};
/**
 * DROPBOX CLIENT CODE
 */
exports.createClient = function(config) {

	var sign = oauth(config.app_key, config.app_secret);
	var root = config.root || "sandbox";
	//
	// Create Global "extend" method
	//
	var extend = function(obj, extObj) {
		if (arguments.length > 2) {
			for (var a = 1; a < arguments.length; a++) {
				extend(obj, arguments[a]);
			}
		} else {
			for (var i in extObj) {
				if (i) {
					obj[i] = extObj[i];
				}
			}
		}
		return obj;
	};

	/**
	 * load the saved access token from the properties file
	 */
	var loadAccessToken = function() {
		var token,
		    that = this;

		var raw = Ti.App.Properties.getString('DROPBOX_TOKENS', null);
		if (!raw) {
			return null;
		}

		try {
			token = JSON.parse(raw);
		} catch (err) {
			Ti.API.error('Failed to parse stored access token for DROPBOX_TOKENS !');
			Ti.API.error(err);
			return null;
		}

		if (token.accessToken) {
			that.accessToken = token.accessToken;
		}
		if (token.accessTokenSecret) {
			that.accessTokenSecret = token.accessTokenSecret;
		}

		return token;
	};
	var saveAccessToken = function() {
		Ti.App.Properties.setString('DROPBOX_TOKENS', JSON.stringify({
			accessToken : this.accessToken,
			accessTokenSecret : this.accessTokenSecret
		}));
	};

	/**
	 * Clear access token to log out of dropbox
	 * @param {Object} pService
	 */
	var clearAccessToken = function(pService) {
		Ti.App.Properties.setString('DROPBOX_TOKENS', null);
		this.accessToken = null;
		this.accessTokenSecret = null;
		if ( typeof pService == 'function') {
			pService({
				success : "Logged out successfully"
			});
		}
	};

	var request = function(args, callback) {
		if (Ti.Network.online == false) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.error, Alloy.Globals.selectedLanguage.noInternet);
		} else {
			Alloy.Globals.showLoading(Alloy.Globals.selectedLanguage.loading);
			var client = Ti.Network.createHTTPClient({
				timeout : 10000,
				onsendstream : function(e) {
					Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
				},
				onload : function() {
					Alloy.Globals.hideLoading();
					callback(true, this);
				},
				onerror : function() {
					Alloy.Globals.hideLoading();
					Ti.API.error(' FAILED to send a request!');
					Ti.API.info(this.responseText);
					callback(false, this);
				}
			});

			client.open(args.method, args.url);
			Ti.API.info('Arguements : ' + JSON.stringify(args));
			if (OS_IOS && args.headers) {
				client.setRequestHeader("Content-Type", args.headers);
			}
			if (args.method === 'PUT') {
				client.send(args.body);
			} else {
				client.send(args.body ? JSON.parse(args.body) : {});
			}
		}
	};

	return {
		// will tell if the consumer is authorized
		isAuthorized : function() {
			var that = this;
			loadAccessToken.call(that);
			Ti.API.info('---Access Token: ' + this.accessToken + " Access Token Secret : " + this.accessTokenSecret);
			return !(this.accessToken == null || this.accessTokenSecret == null);
		},
		logout : function(callback) {
			var that = this;
			this.accessToken = null;
			this.accessTokenSecret = null;
			Ti.App.Properties.setString('DROPBOX_TOKENS', null);
			clearAccessToken.call(that, callback);
		},
		login : function(callback) {
			var that = this;
			that.request_token(function(status, reply) {
				if (status == true) {
					var authorizeUICallback = function(e) {
						Alloy.Globals.hideLoading();
						//Check if it's the final callback that contains a &uid otherwise missing...
						if (e.url.indexOf('&uid=') != -1) {
							var tokens = e.url.split("&");
							ACCESS_TOKEN_SECRET = tokens[1].split("=")[1];
							if (_.isEmpty(reply) == false) {
								destroyAuthorizeUI();
								var options = {
									oauth_token : reply.oauth_token, // required
									oauth_token_secret : reply.oauth_token_secret // required
								};
								Ti.API.info('Accessing Token: ' + JSON.stringify(options));
								// get access
								that.access_token(options, function(status, reply) {
									that.accessToken = reply.oauth_token;
									that.accessTokenSecret = reply.oauth_token_secret;
									// save so we don't login everytime
									saveAccessToken.call(that);

									// callback on success
									callback(reply);
								});
								return;
							} else {
								alert('Error: ' + reply);
							}
							return;

						} else if ('https://www.dropbox.com/' === e.url || e.url.indexOf('not_approved=true') != -1 || e.url.indexOf('#error=access_denied') != -1) {
							//Something went wrong or the user didn't approve the access
							destroyAuthorizeUI();
							return;
						}
					};
					// unloads the UI used to have the user authorize the application
					var destroyAuthorizeUI = function() {
						// if the window doesn't exist, exit
						if (window == null) {
							return;
						}
						// remove the UI
						try {
							wv.removeEventListener('load', authorizeUICallback);
							window.close();
							loading = null;
							wv = null;
							window = null;
						} catch (ex) {
							Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
						}
					};
					Ti.API.info('URL : ' + 'https://www.dropbox.com/1/oauth/authorize?oauth_token=' + reply.oauth_token + '&display=mobile&oauth_callback=http://www.tacme.com');
					var window = Alloy.createController('common/dropbox/winDropboxLogin', {
						authorizeUICallback : authorizeUICallback,
						url : 'https://www.dropbox.com/1/oauth/authorize?oauth_token=' + reply.oauth_token + '&display=mobile&oauth_callback=http://www.tacme.com'
					}).getView();
					var wv = window.children[1].children[0];
					wv.addEventListener('load', authorizeUICallback);
					window.open();
				} else {
					Ti.API.info('Timeout Error');
				}
			});
		},

		request_token : function(cb) {
			var signature = sign({});
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded"
				},
				"url" : "https://api.dropbox.com/1/oauth/request_token",
				"body" : JSON.stringify(signature)
			};
			request(args, function(status, xhr) {
				if (status) {
					var b = xhr.responseText;
					var obj = {};
					b.split("&").forEach(function(kv) {
						var kv = kv.split("=");
						obj[kv[0]] = kv[1];
					});
					cb(true, obj);
				} else {
					cb(false);
				}

			});
		},
		build_authorize_url : function(oauth_token, oauth_callback) {
			var url = "https://www.dropbox.com/1/oauth/authorize?oauth_token=" + oauth_token;
			if (oauth_callback) {
				url = url + "&display=mobile&oauth_callback=" + oauth_callback;
			}
			return url;
		},
		access_token : function(options, cb) {
			var params = sign(options);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded"
				},
				"url" : "https://api.dropbox.com/1/oauth/access_token",
				"body" : JSON.stringify(params)
			};
			request(args, function(status, xhr) {
				if (status) {
					var b = xhr.responseText;
					var obj = {};
					b.split("&").forEach(function(kv) {
						var kv = kv.split("=");
						obj[kv[0]] = kv[1];
					});
					cb(true, obj);
				} else {
					cb(false);
				}

			});
		},

		account : function(options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded"
				},
				"url" : "https://api.dropbox.com/1/account/info",
				"body" : JSON.stringify(params)
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		delta : function(options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded"
				},
				"url" : "https://api.dropbox.com/1/delta",
				"body" : JSON.stringify(params)
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},

		get : function(path, options, cb) {
			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}
			var args = {
				"method" : "GET",
				"url" : "https://api-content.dropbox.com/1/files/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"encoding" : null
			};
			return request(args, function(status, xhr) {
				if (status) {
					cb(true, xhr);
				} else {
					cb(false);
				}
			});
		},

		metadata : function(path, options, cb) {
			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}
			var args = {
				"method" : "GET",
				"url" : "https://api.dropbox.com/1/metadata/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"encoding" : null
			};
			return request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},

		revisions : function(path, options, cb) {
			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}
			var args = {
				"method" : "GET",
				"url" : "https://api.dropbox.com/1/revisions/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"encoding" : null
			};
			return request(args, function(e, r, b) {
				cb( e ? null : r.statusCode, JSON.parse(b));
			});
		},

		put : function(path, body, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}

			var args = {
				"method" : "PUT",
				"headers" : {
					"content-length" : body.length
				},
				"url" : "https://api-content.dropbox.com/1/files_put/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},

		search : function(path, query, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			params["query"] = query;

			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/search/" + (params.root || root) + "/" + escape(path),
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		shares : function(path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/shares/" + (params.root || root) + "/" + escape(path),
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		media : function(path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/media/" + (params.root || root) + "/" + escape(path),
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},

		thumbnails : function(path, options, cb) {
			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);
			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}
			var args = {
				"method" : "GET",
				"url" : "https://api-content.dropbox.com/1/thumbnails/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"encoding" : null
			};
			return request(args, function(status, xhr) {
				if (status) {
					cb(true, xhr);
				} else {
					cb(false);
				}
			});
		},
		cp : function(from_path, to_path, from_copy_ref, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);

			params["root"] = params.root || root;
			if (!from_copy_ref) {
				params["from_path"] = from_path;
			} else {
				params["from_copy_ref"] = from_copy_ref;
			}
			params["to_path"] = to_path;

			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/fileops/copy",
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		mv : function(from_path, to_path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);

			params["root"] = params.root || root;
			params["from_path"] = from_path;
			params["to_path"] = to_path;

			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/fileops/move",
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},

		rm : function(path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);

			params["root"] = params.root || root;
			params["path"] = path;

			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/fileops/delete",
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		mkdir : function(path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);

			params["root"] = params.root || root;
			params["path"] = path;

			var body = JSON.stringify(params);
			var args = {
				"method" : "POST",
				"headers" : {
					"content-type" : "application/x-www-form-urlencoded",
					"content-length" : body.length
				},
				"url" : "https://api.dropbox.com/1/fileops/create_folder",
				"body" : body
			};
			request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		},
		copyref : function(path, options, cb) {

			// ensure we have the tokens
			options = extend(options, {
				oauth_token : this.accessToken,
				oauth_token_secret : this.accessTokenSecret
			});

			var params = sign(options);

			var urlX = "";
			for (var a in params) {
				if (a) {
					urlX += Titanium.Network.encodeURIComponent(a) + '=' + Titanium.Network.encodeURIComponent(params[a]) + '&';
				}
			}

			var args = {
				"method" : "GET",
				"url" : "https://api.dropbox.com/1/copy_ref/" + (params.root || root) + "/" + escape(path) + "?" + urlX,
				"encoding" : null
			};
			return request(args, function(status, xhr) {
				if (status) {
					cb(true, JSON.parse(xhr.responseText));
				} else {
					cb(false);
				}
			});
		}
	};
};
