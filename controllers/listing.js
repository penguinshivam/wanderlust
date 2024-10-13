const Listing = require("../models/listing.js");

module.exports.index=async (req, res, next) => {
   const allListings = await Listing.find();
   res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ 
        path: "reviews", 
        populate: { 
        path:"author"},
      })
      .populate("owner");
    if (!listing) {
      req.flash("deleted", "listing not avilable");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  module.exports.addNewListings=async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.image.url=req.file.path;
    newListing.image.filename=req.file.filename;
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing added successfully");
    res.redirect("/listings");
  }

  module.exports.renderEditForm=async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("deleted", "listing not avilable");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/update.ejs", { listing,originalImageUrl });
  };

  module.exports.editListing=async (req, res, next) => {
    let { id } = req.params;

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
      listing.image.url=req.file.path;
      listing.image.filename=req.file.filename;
      await listing.save();
    }
    
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
  };

  module.exports.deleteListing=async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing deleted successfully");
    res.redirect("/listings");
  };

