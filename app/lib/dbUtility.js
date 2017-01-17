var httpManager = require('httpManager');
var utilities = require('utilities');
var db,
    dbName = "favouritesDB";

/*
 * Creating or Opening a Database
 */

exports.createDatabase = function() {
	try {
		db = Ti.Database.open(dbName);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
};

/*
 * Creating a Table
 */

exports.createFavouritesTable = function() {
	try {
		db = Ti.Database.open(dbName);
		db.execute("CREATE TABLE IF NOT EXISTS FAVOURITES(asset_id INTEGER PRIMARY KEY NOT NULL,asset_idAr INTEGER NOT NULL,category TEXT,category_id INTERGER NOT NULL,subcategory TEXT,sub_cat_id INTEGER NOT NULL);");
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
};

exports.createHappinessTable = function() {
	try {
		db = Ti.Database.open(dbName);
		db.execute("CREATE TABLE IF NOT EXISTS HAPPINESS(value INTEGER NOT NULL);");
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
};

/*
 * Delete columns from table
 */

exports.deleteFromTable = function(id, item_Id, item_idAr) {
	try {
		db = Ti.Database.open(dbName);
		switch(id) {
		case 1 :
			db.execute("DELETE FROM FAVOURITES WHERE category_id = ?", item_Id);
			break;

		case 2 :
			if (Alloy.Globals.isEnglish) {
				db.execute("DELETE FROM FAVOURITES WHERE asset_id = ?", item_Id);
			} else {
				db.execute("DELETE FROM FAVOURITES WHERE asset_idAr = ?", item_idAr);
			}
			break;

		case 3 :
			db.execute("DELETE FROM FAVOURITES WHERE sub_cat_id = ?", item_Id);
			break;

		}
		db.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
		db.close();
	}
};

/*
 * Insert data into table
 */

exports.insertHappyData = function(value) {
	try {
		db = Ti.Database.open(dbName);
		db.execute('INSERT INTO HAPPINESS (value) VALUES (?)', value);
		db.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
		db.close();
	}
};

exports.insertData = function(item_Id, item_IdAr, category, category_id, sub_category, sub_cat_id) {
	try {
		db = Ti.Database.open(dbName);
		db.execute('INSERT INTO FAVOURITES (asset_id,asset_idAr,category,category_id,subcategory,sub_cat_id) VALUES (?,?,?,?,?,?)', item_Id, item_IdAr, category, category_id, sub_category, sub_cat_id);
		db.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
		db.close();
	}
};

/*
 * Retrieve data from table
 */

exports.retrieveHappyData = function(callback) {
	try {
		db = Ti.Database.open(dbName);
		var resultData = "";
		var result = db.execute("SELECT value from HAPPINESS");
		while (result.isValidRow()) {
			resultData = result.fieldByName('value');
			result.next();
			Ti.API.info("resultData " + resultData);
		}
		result.close();
		callback(resultData);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
		db.close();
	}
};

exports.retrieveData = function(id, item_id, callback) {
	try {
		db = Ti.Database.open(dbName);
		var rowData = [];
		var resultSet = "";
		switch(id) {
		case 1 :
			if (Alloy.Globals.isEnglish) {
				resultSet = db.execute('SELECT asset_id from FAVOURITES where asset_id != "-" AND category_id = ?', item_id);
			} else {
				resultSet = db.execute('SELECT asset_idAr from FAVOURITES where asset_idAr != "-" AND category_id = ?', item_id);
			}
			break;

		case 2 :
			if (Alloy.Globals.isEnglish) {
				resultSet = db.execute('SELECT asset_id from FAVOURITES where asset_id != "-" AND sub_cat_id = ?', item_id);
			} else {
				resultSet = db.execute('SELECT asset_idAr from FAVOURITES where asset_idAr != "-" AND sub_cat_id = ?', item_id);
			}
			break;

		case 3 :
			resultSet = db.execute('SELECT DISTINCT sub_cat_id from FAVOURITES where category_id = ?', item_id);
			break;

		case 4 :
			resultSet = db.execute("SELECT DISTINCT category_id from FAVOURITES");
			break;

		case 5 :
			if (Alloy.Globals.isEnglish) {
				resultSet = db.execute('SELECT asset_id from FAVOURITES where asset_id != "-"');
			} else {
				resultSet = db.execute('SELECT asset_idAr from FAVOURITES where asset_idAr != "-" ');
			}
			break;
		}

		while (resultSet.isValidRow()) {
			if (id == 1 || id == 2 || id == 5) {
				if (Alloy.Globals.isEnglish) {
					rowData.push({
						"category_id" : resultSet.fieldByName('asset_id')
					});
				} else {
					rowData.push({
						"category_id" : resultSet.fieldByName('asset_idAr')
					});
				}
			} else if (id == 3) {
				rowData.push({
					"category_id" : resultSet.fieldByName('sub_cat_id'),
				});
			} else if (id == 4) {
				rowData.push({
					"category_id" : resultSet.fieldByName('category_id'),
				});
			}

			resultSet.next();
		}
		resultSet.close();
		callback(rowData);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
		db.close();
	}
};

/*
 * Closing the Databse
 */

exports.closeDatabase = function() {
	try {
		db.close();
	} catch(e) {
		Ti.API.info('Error '+e.message);
	}
};
