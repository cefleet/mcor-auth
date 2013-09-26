//passport configuration for local strategy
//TODO Users does not need to be passed
var encrypt = require('encrypt');
var LocalStrategy = require('passport-local').Strategy;

var strategy = function(passport,db){ 
	
	passport.use(new LocalStrategy(function(email, password,done){
	//TODO this needs to connect to a DB (OR REDIS)
		console.log('The Local stragity has started');
		//We are looking in the types array for the value local
		db.hgetall(email, function(err,user){			
			if(err){
				console.log('Error on retriving the user');
				return done(null, false,{message:'Incorrect username or password'});
			} else if(user == null) {
				console.log('User does not exists');
				return done(null, false,{message:'Incorrect username or password'});				
			} else {	
				var types = JSON.parse(user.types);
				if(types.hasOwnProperty('local')){
					encrypt.comparePassword(password,user.password, function(err,matching){
						if(err){
							console.log(err);
							return done(null, false,{message:'Incorrect username or password'});
						} else if(!matching){
							console.log('Incorrect Password');
							return done(null, false,{message:'Incorrect username or password'});
						} else {
							return done(null, user);
						}
					});
				} else {
					console.log('This user is not allowed to login in this manner');
					return done(null, false,{message:'Incorrect username or password'})
				}
			}
		});
	}));
}
module.exports.strategy = strategy;