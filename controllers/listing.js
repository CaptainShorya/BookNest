
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect('/listings');
    }
    // console.log(listing);//To check whether owner full data not just id is printed or not.
    res.render("listings/show.ejs", { listing });
  }

  module.exports.createNewListing = async (req, res, next) => {
    //   console.log(req.body);
      // if (!req.body || Object.keys(req.body).length === 0) {
      //   throw new ExpressError(400, "Send Valid data for listing");
      // }
    //   const result = listingSchema.validate(req.body); //Jo bhi condition hamne joi ke andar  listingSchema ke andar di h kya vo condition req.body ke andar satistfy ya validate ho pa rhi h 
      //console.log(result);
      let url = req.file.path;
      let filename = req.file.filename;
      const newListing = new Listing(req.body);
      newListing.owner = req.user._id;//We are not providing id so we directly take it from req.user._id(which save id of the current session in it)into owner 
      newListing.image = {url,filename}
      await newListing.save();
      req.flash("success","New Listing Created!"); //We can access this in res.locals inside app.js file now
      res.redirect("/listings");
    }

    module.exports.renderEditForm = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        req.flash("success","Listing Edited!");
        if(!listing){
          req.flash("error","Listing you requested for does not exist");
          res.redirect('/listings');
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_350");
        res.render("listings/edit.ejs", { listing ,originalImageUrl});
      }
  
      module.exports.updateListing = async (req, res) => {
        // if (!req.body) {
        //   throw new ExpressError(400, "Send Valid data for listing");
        // }
        let { id } = req.params;
        let updateListing = await Listing.findByIdAndUpdate(id, { ...req.body });
        if(typeof req.file !== "undefined"){
          let url = req.file.path;
          let filename = req.file.filename;
          updateListing.image = {url,filename}
          await updateListing.save();
        }
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
      }

      module.exports.destroyListing = async (req, res) => {
        let { id } = req.params;
        const deleteListing = await Listing.findByIdAndDelete(id); //After this call,post middleware present in listing schema will get implemented
        console.log(deleteListing);
        req.flash("success","Listing Deleted");
        res.redirect("/listings");
      }