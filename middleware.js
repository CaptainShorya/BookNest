const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");


module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.user);//Jaise hi login hoga req.user m user related info store hogi jo hm pass krenge
    if(!req.isAuthenticated()){ //Means user is not login
      console.log(req.originalUrl);
      req.session.reDirectUrl = req.originalUrl; //req.originalUrl gives that path on which user desires to redirect.
      req.flash("error","you must be logged in to create listing!");
      return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if (req.session.reDirectUrl) {
    console.log('Redirect URL found in session:', req.session.reDirectUrl);
    res.locals.url = req.session.reDirectUrl;
    delete req.session.reDirectUrl; // Optionally clear the redirect URL from the session
  } else {
    console.log('No redirect URL found in session');
  }
  next();
}

//Work of this middleware is to check whether current user is owner of that listing or not
module.exports.isOwner = async(req,res,next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing!")
      return res.redirect(`/listings/${id}`);//Further operation after if will not perform if we pass return statement here
    }
  next();
}

// module.exports.validateListing = (req,res,next) => {
//   let {error} = listingSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// }

// module.exports.validateReview = (req,res,next) => {
//   let {error} = reviewSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// }

//Work of this middleware is to check whether the author of the review is deleting the review or not
module.exports.isreviewAuthor = async(req,res,next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of this review!")
      return res.redirect(`/listings/${id}`);//Further operation after if will not perform if we pass return statement here
    }
  next();
}