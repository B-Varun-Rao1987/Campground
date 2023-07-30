const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate'); 
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');

const campgrounds=require('./routes/campgrounds.js');
const reviews=require('./routes/review.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

mongoose.set('strictQuery', true);

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


const sessionConfig={
    secret:"thisshouldbeabettersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};

// httpOnly setting to true implicates,the cookie data can't be accessed from the client-side script.

app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    //it basically makes our work easy,in terms of that we won't need to pass in the resp. flash val ,out to the templates again and again.Now,we just always have access to something called success.
    res.locals.error=req.flash('error'); 
    next();
});

app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews",reviews);

app.get('/',(req,res)=>{
    res.send("Hello!!,Welcome to YelpCamp :)");
})

//This will run only if,nothing above doesn't match.
app.all('*',(req,res,next)=>{
    // res.send("404!!");
    next(new ExpressError('Page not found!',404));
});

app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    // res.send("ERROR!!");
});

app.listen(3000,()=>{
    console.log("LISTENING AT PORT 3000!!");
});

 