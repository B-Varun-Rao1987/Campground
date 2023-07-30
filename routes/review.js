const express=require('express');
const router=express.Router({mergeParams:true});
//such that all the params from the app.js file gets merged with the express router.(Basically if the prefix to the routes contain parameters,then by default it will not encorporate the id passed as in the route,we would have to explicitly set mergeParams to be true,for passing the parameters to this file).
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const Review=require('../models/review');
const {reviewSchema}=require('../schemas.js');


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

router.post('/',validateReview,catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));


router.delete('/:reviewId',catchAsync(async (req,res)=>{
    try{
    const { id,reviewId }=req.params;
    await Campground.findByIdAndUpdate(id,{ $pull : { reviews:reviewId } }); 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
    }
    catch(e){
        console.log("error : ",e);
    }
    // res.send(`id : ${id} and revId : ${reviewId}`);
}));

module.exports=router;