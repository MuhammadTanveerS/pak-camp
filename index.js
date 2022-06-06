const express = require("express");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");
const ejsMate = require('ejs-mate')
const app = express();
const path = require('path');
const ExpressError = require("./utils/ExpressError"); 
const session = require('express-session')
const flash = require('connect-flash')

const campground = require('./routes/campground')
const review = require('./routes/review')



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
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'abadsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*25*7, 
        maxAge:1000*60*60*25*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campground)
app.use('/campgrounds/:id/reviews',review)

app.get('/',(req,res)=>{
    res.send('HELLO')
}) 


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