const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer=require('multer')
const{storage}=require("../cloudConfig.js")
const upload=multer({storage})

router.route("/")
.get(wrapAsync(listingController.index))

.post(isLoggedIn,upload.single("listing[image]"),
  wrapAsync(listingController.addNewListings)
);
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),
  wrapAsync(listingController.editListing)
)
.delete(isLoggedIn,isOwner,
  wrapAsync(listingController.deleteListing)
);

router.get(
  "/:id/update",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//destroy
router

module.exports = router;
