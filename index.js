var passport = require("passport");
var fs = require("fs");

var redis = require("redis");
var client = redis.createClient();

//TODO for now we are going to use REDIS
/*
client.hmset('clint.fleetwood@gmail.com', {
	username:"cefleet",
	email:"clint.fleetwood@gmail.com",
	types:'{"google":{"identifier":"AItOawl6Ly-Ux5CDpNgeDkT0j35P76XJOYRVkmY", "active":"true"}, "local":{"active":"true"}}',
	apps:'{"woi":{"type":"admin"}}'
});
*/
/*
client.hmset('clint.fleetwood@gmail.com:info', {
	types:'{"google":{"identifier":"AItOawl6Ly-Ux5CDpNgeDkT0j35P76XJOYRVkmY", "active":"true"}}',
	apps:'{"woi":{"type":"admin"}}'
});

client.hget("clint.fleetwood@gmail.com", "type", function(err,types){
	types = types.split(',');
	if(types.indexOf('google') > -1){
		console.log('We have google action over here');
		client.hget("clint.fleetwood@gmail.com:info","types", function(err,types){
			console.log(JSON.parse(types).google.identifier);
		});
	}
});
*/
/*
var Users = {
	cefleet:{username:'cefleet',password:'password', id:'1'},
	user:{username:'user', password:'password2', id:'2'},
	clint2: {username:'cefleet2',password:'3rg34f4D3423f',id:'3', type:['google'],identifier:'AItOawl6Ly-Ux5CDpNgeDkT0j35P76XJOYRVkmY'}
}
*/

var Auth = function Auth(app,express){
	this.authenticate = function(req,res,next){
		var type = req.params.type;
		var action = req.params.action;
		fs.exists(__dirname+'/lib/strategies/'+type+'/'+type+'.js', function(exists){
			if(exists){
				require('./lib/strategies/'+type+'/'+type).strategy(passport,client);
				fs.exists(__dirname+'/lib/strategies/'+type+'/'+action+'.js', function(_exists){
					if(_exists){
						require('./lib/strategies/'+type+'/'+action)(passport,req,res,next);
					}
				})
			}
		})
	}
	this.app = app;
    this.app.use(express.cookieParser());
	this.app.use(express.session({ secret: 'SomeSecrete' }));
    this.app.use(passport.initialize());
	this.app.use(passport.session());	
	
	passport.serializeUser(function(user, done) {
	    done(null, user.email);
	});

	passport.deserializeUser(function(email, done) {
		client.hgetall(email, function(err,user){			
			if(err || user == null){
				done(null, false,{message:'Error Verifying User'});
			} else {	
				done(null,user);
			}
		});	    
	});
	
	this.app.all('/auth/:type/:action',function(req,res,next){
		this.authenticate(req,res,next);
	}.bind(this));
	
	//This checks for authentencation
	this.app.all('/',function(req,res, next){
		//if you are not authenticated and are not in the '/auth/' route you must go through login
		//TODO this needs to have some options.. like "safe" pages etc.
		if(!req.isAuthenticated()){
			fs.readFile('public/login.html', function(err,data){
				res.write(data);
				res.end();
			});
		} else {
			next();
		}
	}.bind(this));
		
	//logouts no matter what type is used to log in
	this.app.get('/auth/logout', function(req, res){
		req.logout();
		res.redirect('/');
	}.bind(this));
}

module.exports = function(app,express){
	return new Auth(app,express);
}