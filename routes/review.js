const express = require("express");
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync')
const Campground = require("../models/Campground");
const Review = require('../models/review');
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require('../schemas')


const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
    // console.log(result);
}

router.post('/', validateReview, catchAsync(async (req,res) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))
 
router.delete('/:reviewId',catchAsync(async (req,res) => {
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
}))

module.exports = router;