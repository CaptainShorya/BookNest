const User = require('../models/user')

module.exports.renderSignupForm = (req,res) =>{
    res.render('users/signup.ejs');
}

module.exports.signup = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to BookNest");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req,res) => {
    req.flash("success","Welcome Back to BookNest!");
    const redirectURL = res.locals.url || '/listings';//redirectURL m res.locals.url m save krvado if res.locals.url is not undefined(i.e have some value)otherwise /listings par redirect krdo
    res.redirect(redirectURL);
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {//If error occur while loging out then err will take that error otherwise proceed further
        if(err){
            return next(err)
        }
        req.flash('success','You are successfully LogOut');
        res.redirect('/listings');
    })
}