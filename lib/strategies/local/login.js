var login = function(passport,req,res,next){
	
	passport.authenticate('local', function(err, user, info) {
    	if (err) { return next(err) }
    	if (!user) {
      		//req.flash('error', info.message);
      		return res.redirect('/')
    	}
    	req.logIn(user, function(err) {
      		if (err) { return next(err); }
      		return res.redirect('/');
    	});
  	})(req, res, next);	
}
module.exports = login;