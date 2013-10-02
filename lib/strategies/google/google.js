var GoogleStrategy = require('passport-google').Strategy;
var url = require('url');

var strategy = function(passport, db){ 
	var multi = db.multi();
	passport.use(new GoogleStrategy(
		{
		returnURL: config.general.url+'/auth/google/return',
	    	realm: config.general.url
		},	
  		function(identifier, profile, done) { 
  			//var emails = profile.emails; 
  			var emails = [{value:'bob.jones@goom.com'},{value:"billt@snail.com"}, {value:"clint.fleetwood@gmail.com"},{value:"judy.bloom@gmail.com"}];
  				
  			//parses the identifier to it's id
			var id = url.parse(identifier).query.replace('id=','');
			
			//goes through all of the emails and sets up a search for it
			for(var i = 0; i<emails.length; i++){
				multi.hgetall(emails[i].value);
			}
			multi.exec(function(err,replies){
				//possible Users //this filters out the null values
				var pUsers = replies.filter(function(val) { return val !== null; });
				var uLen = pUsers.length;
				var i = 0;
				var found = false;
				if(pUsers.length == 0){
					console.log('This googler is not allowed in here');
					return done(null, false,{message:'This Googler is not Authorized to be here'});
				} else {
					pUsers.forEach(function(user){
						console.log(user);
						i++;
						var types = JSON.parse(user.types);
						if(types.hasOwnProperty('google')){
							if(id == types.google.identifier){
								console.log('come on in google user');
								found = true;
								return done(null, user);						
							}
						}
						if(i == uLen && found == false){
							return done(null, false,{message:'This Googler is not Authorized to be here'}); 	
						}					
					});
				}			
			});
		}	
	));
}
module.exports.strategy = strategy
