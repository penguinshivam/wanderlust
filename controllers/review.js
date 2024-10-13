const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "review added successfully");
    res.redirect(`/listings/${req.params.id}`);
  };

module.exports.deleteReview=async (req, res, next) => {
    await Listing.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "review deleted successfully");
    res.redirect(`/listings/${req.params.id}`);
  }