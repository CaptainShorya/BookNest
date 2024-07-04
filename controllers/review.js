
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id); //Here We find out the listing for which review has to be made.
    let newReview = new Review(req.body.review); //req.body -> return an obj jiske andar review ek object h jiske andar reviewSchema present h and it has values which are pass by user in form
    newReview.author = req.user._id;//We store author name also in the newReview created and we get the data of author from req.user._id as user is login.
    console.log(newReview);//Stored data in Review collection
    listing.reviews.push(newReview)
  
    await newReview.save(); //Review is saved inside the particular listing in database
    await listing.save(); //listing is saved in the database too
  
    console.log("New Review saved");
    req.flash("success","Review Created!");
    res.redirect(`/listings/${listing._id}`)
  }

  module.exports.destroyReview = async (req,res)=> {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) //By pull operator we remove an instance from an array which matches with specified value
    //Here in reviews array jis bhi review me hmari reviewId match kr jaye usse pull ya remove krdo  
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
  }