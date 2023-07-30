//I will be running this seperately from the actual running file(app.js),just to seed in data,to our database.
const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers'); 
const Campground=require('../models/campground');
const campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seeDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+1;
        const camp=new Campground({
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://source.unsplash.com/random/500×300/?${this.title}`,
            description:'lorem ipsuim khdafdbfkabfk khabkas kgakhsfbk gkaubflasjbflsj agdkja k',
            price
        })
        await camp.save();
    } 
}

//https://unsplash.com/collections/483251/in-the-woods

//https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80

// https://unsplash.com/collections/483251/in-the-woods

seeDB().then(()=>{
    mongoose.connection.close();
})