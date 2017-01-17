
(function() {

  Ti.include('/twitter/lib/jasmine-1.0.2.js');
  Ti.include('/twitter/lib/jasmine-titanium.js');
  
  Ti.include('/twitter/twitter.js');
    
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
  jasmine.getEnv().execute();
})();
