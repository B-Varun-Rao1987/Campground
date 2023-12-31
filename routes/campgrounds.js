const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {campgroundSchema}=require('../schemas.js');
const Campground=require('../models/campground');

const validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);
    // console.log(result);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

router.get('/',catchAsync(async(req,res,next)=>{
    const campgrounds=await Campground.find({});
    // for(let i=0;i<campgrounds.length;i++)
    //     console.log(campgrounds[i]);
    res.render('campgrounds/index',{campgrounds});
}));

router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
});

router.post('/',validateCampground,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground){
    //     throw new ExpressError('Invalid Campground Data',400);
    // }
    //Here,we will be using joi.Wrt which, we will be defining a new schema wrt joi(not related to schema in mongoose).
    const campground=new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id',catchAsync(async (req,res,next)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}));

router.get('/:id/edit',catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}));

router.put('/:id',validateCampground,catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true});
    req.flash('success','Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id',catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!');
    res.redirect('/campgrounds');
}));



module.exports=router;