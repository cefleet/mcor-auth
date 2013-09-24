var login = function(passport,req,res,next){
	passport.authenticate('google')(req,res,next);
};
module.exports = login; 
