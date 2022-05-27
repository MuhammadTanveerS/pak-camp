const express = require("express");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");
const ejsMate = require('ejs-mate')
const app = express();
const path = require('path');
const Campground = require("./models/Campground");




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

app.get('/campgrounds', async (req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/home',{camps});
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req,res)=>{
    const camp = new Campground(req.body.campgrounds)
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`);
})


app.get('/campgrounds/:id', async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{camp});
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
})

app.put('/campgrounds/:id', async (req,res)=>{
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campgrounds});
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen('3000',()=>{
    console.log('Listening to port 3000');
})