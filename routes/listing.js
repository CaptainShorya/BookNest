const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require('multer');
const {storage} = require('../cloudConfig')
const upload = multer({storage})

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.createNewListing)
  ); //Before Validating Listing user should be logged in

//New Route //If this route placed below id route then /new would be interpreted as /id,try to search new into data which would give error
router.get("/new", isLoggedIn, listingController.renderNewForm);

   
router.route("/:id").get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('image'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);



//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
