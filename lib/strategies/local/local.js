//passport configuration for local strategy
//TODO Users does not need to be passed
var LocalStrategy = require('passport-local').Strategy;

var strategy = function(passport, Users){ 
		
	passport.use(new LocalStrategy(function(username, password,done){
	//TODO this needs to connect to a DB (OR REDIS)
		console.log('The Local stragity has started');
		//TODO need to hash this	
		if (Users.hasOwnProperty(username)){
			var user = Users[username];
			if(password == user.password){
				console.log('all is good Log on in');
				return done(null, user);
			} else {
				console.log('Incorrect username or password');
				return done(null, false,{message:'Incorrect username or password'})
			}
		} else {
			console.log('Incorrect username or password');
			return done(null, false,{message:'Incorrect username or password'})
		}
	}));
}
module.exports.strategy = strategy;