const express = require("express");
const router = express.Router({mergeParams:true});

const ExpressError = require("../utils/ExpressError");
const catchAsync = require('../utils/catchAsync')
const Campground = require("../models/Campground");
const {campgroundSchema} = require('../schemas')



const validateCamp = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
    // console.log(result);
}


router.get('/', catchAsync(async (req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/home',{camps});
}))

router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/', validateCamp, catchAsync(async (req,res,next)=>{
    
    // if(!req.body.campgrounds) throw new ExpressError('Invalid data',400);
    const camp = new Campground(req.body.campgrounds)
    await camp.save()
    req.flash('success', 'successfully made a new campground!');
     res.redirect(`/campgrounds/${camp._id}`);
}))


router.get('/:id',  catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{camp});
}))

router.get('/:id/edit', catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
}))

router.put('/:id', validateCamp, catchAsync(async (req,res)=>{
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campgrounds});
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

module.exports = router;