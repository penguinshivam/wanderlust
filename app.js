if (process.env.NODE_ENV!="production") {
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose =require("mongoose")
const path = require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")


app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.engine("ejs",ejsMate);

const MONGO_URL=process.env.ATLAS_URL;

main().then((res)=>{console.log("connection successful");}).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);   
}


const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

store.on("error",()=>{
    console.log("error in mongo store");
    
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.deleted=req.flash("deleted");
    res.locals.currUser=req.user;
    next();
})



app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
})
 
app.listen(8080,()=>{
    console.log("listening to port 8080");
    
})