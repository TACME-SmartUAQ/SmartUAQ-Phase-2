var httpManager = require('httpManager');
var utilities = require('utilities');
var db,
    dbName = "favouritesDB";
    
/*
 * Creating or Opening a Database 
 */    

exports.createDatabase = function(){
	db = Ti.Database.open(dbName);
};

/*
 * Creating a Table
 */

exports.createTable = function(){
	db = Ti.Database.open(dbName);
	db.execute("CREATE TABLE IF NOT EXISTS FAVOURITES(asset_id INTEGER PRIMARY KEY NOT NULL,category TEXT,category_id INTERGER NOT NULL,subcategory TEXT,sub_cat_id INTEGER NOT NULL);");
};

/*
 * Delete columns from table
 */

exports.deleteFromTable = function(id,item_Id){
	db = Ti.Database.open(dbName);
	switch(id){
		case 1 : db.execute("DELETE FROM FAVOURITES WHERE category_id = ?",item_Id);
		         break;
		         
		case 2 : db.execute("DELETE FROM FAVOURITES WHERE asset_id = ?",item_Id);
		         break;
		         
		case 3 : db.execute("DELETE FROM FAVOURITES WHERE sub_cat_id = ?",item_Id);
		         break;
		  
	}
	//db.close();
};

/*
 * Insert data into table
 */

exports.insertData = function(item_Id,category,category_id,sub_category,sub_cat_id){
	db = Ti.Database.open(dbName);
	db.execute('INSERT INTO FAVOURITES (asset_id,category,category_id,subcategory,sub_cat_id) VALUES (?,?,?,?,?)', item_Id,category,category_id,sub_category,sub_cat_id);
	db.close();
};

/*
 * Retrieve data from table
 */

exports.retrieveData = function(id,item_id,callback){
	db = Ti.Database.open(dbName);
	var rowData = [];
	var resultSet = "";
	switch(id){
		case 1 : resultSet = db.execute('SELECT asset_id from FAVOURITES where category_id = ?',item_id);
		         break;
		        
		case 2 : resultSet = db.execute('SELECT asset_id from FAVOURITES where sub_cat_id = ?',item_id);
		         break;
		        
		case 3 : resultSet = db.execute('SELECT DISTINCT sub_cat_id from FAVOURITES where category_id = ?',item_id);
		         break;
		        
		case 4 : resultSet = db.execute("SELECT DISTINCT category_id from FAVOURITES");
		         break;
		         
		case 5 : resultSet = db.execute("SELECT asset_id from FAVOURITES");
		         break;
	}
	
	while(resultSet.isValidRow()){
		if(id == 1 || id == 2 || id == 5){
			rowData.push({
			  "category_id":resultSet.fieldByName('asset_id'),
		    });
		}else if(id == 3){
			rowData.push({
			  "category_id":resultSet.fieldByName('sub_cat_id'),
		    });
		}else if(id == 4){
			rowData.push({
				"category_id":resultSet.fieldByName('category_id'),
			});
		}
		
		resultSet.next();
	}
	
	callback(rowData);
	
};


/*
 * Closing the Databse
 */

exports.closeDatabase = function(){
	db.close();
};