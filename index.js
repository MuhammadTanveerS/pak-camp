const express = require("express");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");
const ejsMate = require('ejs-mate')
const app = express();
const path = require('path');
const catchAsync = require('./utils/catchAsync')
const Campground = require("./models/Campground");
const ExpressError = require("./utils/ExpressError"); 
const {campgroundSchema, reviewSchema} = require('./schemas')
const Review = require('./models/review')




mongoose.connect('mongodb://localhost:27017/casual-camp')
.then(()=>{
    console.log("CONNECTION STARTED")
}).catch(err =>{
    console.log("OOPS ERROR!!")
    console.log(err)
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.send('HELLO')
})

const validateCamp = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
    console.log(result);
}

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

app.get('/campgrounds', catchAsync(async (req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/home',{camps});
}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCamp, catchAsync(async (req,res,next)=>{
    // if(!req.body.campgrounds) throw new ExpressError('Invalid data',400);
    const camp = new Campground(req.body.campgrounds)
    await camp.save()
     res.redirect(`/campgrounds/${camp._id}`);
}))


app.get('/campgrounds/:id',  catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{camp});
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
}))

app.put('/campgrounds/:id', validateCamp, catchAsync(async (req,res)=>{
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campgrounds});
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id', validateCamp, catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next) => {
    const{statusCode=500}= err;
    if(!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('errors',{err});
    
})

app.listen('3000',()=>{
    console.log('Listening to port 3000');
})