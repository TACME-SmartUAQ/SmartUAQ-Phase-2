Ti.API.info('start');

/*$(".degree").html(data.query.results.channel.item.condition.temp +"<sup>o</sup>C");
description = data.query.results.channel.item.description;
var wimg= description.match(/src="(.+?[\.jpg|\.gif|\.png]")/)[1];
wimg= wimg.split('"');*/

var weatherEnglish = [];
weatherEnglish ={
	    0 : "Tornado",
		1 : "Tropical storm",
		2: "Hurricane",
		3: "Severe thunderstorms",
		4: "Thunderstorms",
		5: "Mixed rain and snow",
		6: "Mixed rain and sleet",
		7: "Mixed snow and sleet",
		8: "Freezing drizzle",
		9: "Drizzle",
		10: "Freezing rain",
		11: "Showers",
		12: "Showers",
		13: "Snow flurries",
		14: "Light snow showers",
		15: "Blowing snow",
		16: "Snow",
		17: "Hail",
		18: "Sleet",
		19: "Dust",
		20: "Foggy",
		21: "Haze",
		22: "Smoky",
		23: "Blustery",
		24: "Windy",
		25: "Cold",
		26: "Cloudy",
		27: "Mostly cloudy",
		28: "Mostly cloudy",
		29: "Partly cloudy",
		30: "Partly cloudy",
		31: "Clear",
		32 : "Sunny",
		33 : "Fair",
		34 : "Fair",
		35 : "Mixed rain and hail",
		36 : "Hot",
		37 : "Isolated thunderstorms",
		38 : "Scattered thunderstorms",
		39 : "Scattered thunderstorms",
		40 : "Scattered showers",
		41 : "Heavy snow",
		42 : "Scattered snow showers",
		43 : "Heavy snow",
		44 : "Partly cloudy",
		45 : "Thundershowers",
		46 : "Snow showers",
		47 : "Isolated thundershowers",
		3200 : "not available",

};

var weatherArabic = [];
weatherArabic = {
	    0 : "إعصار",
		1 : "عاصفة إستوائية",
		2: "زوبعة",
		3: "عواصف رعدية شديدة",
		4: "عواصف رعدية",
		5: "امطار وثلوج",
		6: "امطار وصقيع",
		7: "ثلوج وصقيع",
		8: "رذاذ متجمد",
		9: "رذاذ",
		10: "امطار متجمدة",
		11: "أمطار غزيرة",
		12: "أمطار غزيرة",
		13: "هبات الثلوج",
		14: "زخات الثلوج خفيفة",
		15: "ثلوج عاصفة",
		16: "ثلج",
		17: "برد",
		18: "صقيع",
		19: "غبار",
		20: "ضبابي",
		21: "ضباب",
		22: "مفعم بالدخان",
		23: "متهيج",
		24: "عاصف",
		25: "بارد",
		26: "غائم",
		27: "غائم كلياً",
		28: "غائم كلياً",
		29: "غائم جزئيا",
		30: "غائم جزئيا",
		31: "صافي",
		32 : "مشمس",
		33 : "مقبول",
		34 : "مقبول",
		35 : "امطار وبرد",
		36 : "حار",
		37 : "عواصف رعدية معزولة",
		38 : "عواصف رعدية متفرقة",
		39 : "عواصف رعدية متفرقة",
		40 : "أمطار غزيرة متفرقة",
		41 : "ثلوج كثيفة",
		42 : "زخات الثلوج المتناثرة",
		43 : "ثلوج كثيفة",
		44 : "غائم جزئياً",
		45 : "عواصف رعدية",
		46 : "ثلوج قوية",
		47 : "عواصف رعدية معزولة",
		3200 : "غير موجود",
};

function parseWeatherResponse(data)
{
	var retVal = {
		iconName:undefined,
		temp: " ",
		text: (Alloy.Globals.isEnglish != undefined)? "not available" : "غير موجود"
	};
	//alert(data);
	try {
	retVal.temp = data.query.results.channel.item.condition.temp;
	var description = data.query.results.channel.item.description;
	var wimg= description.match(/src="(.+?[\.jpg|\.gif|\.png]")/)[1];
	wimg= wimg.split('"');
	retVal.iconName  =wimg[0]; 
	var weathTypeCde = data.query.results.channel.item.condition.code; //code
	Ti.API.info('wether type code ' + weathTypeCde); 
	//weathTypeCde = 45;
	var weathType;
	if(Alloy.Globals.isEnglish != undefined){
		if(Alloy.Globals.isEnglish){
			weathType = weatherEnglish[weathTypeCde];
		}else{
			weathType = weatherArabic[weathTypeCde];
		}
	}else{
		weathType = weatherEnglish[weathTypeCde];
	}
	//var weathType = data.query.results.channel.item.condition.code;
	Ti.API.info(weathTypeCde+'weth type' + weathType);
	
	 retVal.text =  weathType; //data.query.results.channel.item.condition.text; //weathType;
	} catch(e) {
	}
	Ti.API.info(retVal); //alert(data.query.results.channel.item.condition.text);
	return retVal;
};
exports.parser = function(callBackFunction){
	Ti.API.info('parser is called weather');
	if (Ti.Network.online == false) {
	   return;
	}
	var request = Ti.Network.createHTTPClient();
	request.timeout = 15000;
	request.onload = function(e) {
		
		try {
			   var obj = JSON.parse(this.responseText);
			   var result =  parseWeatherResponse(obj);
			   callBackFunction(result);
	     	} catch(e) {
	     		callBackFunction(null);   
			    Ti.API.info('Error in weather service');
		    }
		 
    };

	request.onerror = function(e) {	
		Titanium.API.error('Status: ' + this.status);
		Titanium.API.error('ResponseText: ' + this.responseText);
		Titanium.API.error('connectionType: ' + this.connectionType);
		Titanium.API.error('location: ' + this.location);
		callBackFunction(null);
	};

	request.open('GET','https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D%222347115%22%20and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
	request.send();
		
	
};
