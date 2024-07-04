const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const{isLoggedIn,isreviewAuthor} = require('../middleware')
const reviewController = require('../controllers/review')

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }


//Reviews
//Post Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))
  
  //Delete Review Route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.destroyReview))

  module.exports = router;
  