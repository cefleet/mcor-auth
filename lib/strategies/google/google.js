var GoogleStrategy = require('passport-google').Strategy;
var url = require('url');
var strategy = function(passport, Users){ 
	passport.use(new GoogleStrategy({
		returnURL: 'http://mapoven2.mcleanlocalmaps.org:3000/auth/google/return',
	    realm: 'http://mapoven2.mcleanlocalmaps.org:3000/'
		},	
  		function(identifier, profile, done) {
  			var found = false;
  			for(var user in Users){
  				if(Users[user].hasOwnProperty('type')){
  					var id = url.parse(identifier).query.replace('id=','');
  					if(Users[user].type == 'google' && Users[user].identifier == id){
  						console.log('all is good Log on in');
						return done(null, Users[user]);
  					} else {
  						console.log('You are a sneaky google user.. but you do not have privaliges to enter this site boyee');
						return done(null, false,{message:'Badd Googler bad'})
  					}
  				}
  			} 
  		}
	));
}
module.exports.strategy = strategy