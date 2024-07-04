if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE",err);
})



//options object
const sessionOptions = {
  secret :process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +7*24*60*60*100, //write time in milliseconds here
    maxAge:7*24*60*60*1000,
    httpOnly:true //To protect from cross shifting attacks
  }
}

//We have to introduce flash before our routes bcz basically we are using flash with the help of routes 
app.use(session(sessionOptions));//To check whether session is working or not,To check ->run server then go to inspect of /listings from their to applications then to cookie a connect.sid is present which will comes only when session is working.
app.use(flash());

app.use(passport.initialize()); //passport.initialize() returns middleware that initializes Passport for your Express app.It sets up Passport to handle user authentication. Without this middleware, Passport wouldn't be able to process authentication requests.
app.use(passport.session());//This line of code integrates Passport.js with session management in your Express application.//It tells your app to use Passport's session middleware,allowing them to remain authenticated across multiple requests without needing to log in again.
passport.use(new LocalStrategy(User.authenticate()))//setting up passport to use LocalStrategy for authentication,using the authenticate method provided by the User model.
//It tells Passport to use the authenticate method provided by the User model to handle the process of authenticating users based on their username and password.

//When a user is authenticated, Passport.js will call the serializeUser function to decide what user data should be stored in the session. Typically, this is a user ID.
//On subsequent requests, Passport.js will use the deserializeUser function to retrieve the full user details from the session store using the user ID stored in the session.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());//used to configure Passport.js to deserialize user information from the session.deserialization is to retrieve the full user details from the data stored in the session (typically a user ID)
//User.deserializeUser() ->it is a method by passport local mongoose library which defines how to look up the user in the database using info stored in session.
//flash middleware
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");//If any msg present inside flash's success then it will get saved in res.locals in success
  // console.log(res.locals.success); //This will return an array inside which mesage of success key is written
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser",async (req,res) => {
//   let fakeUser = new User({
//     email:"fakeuser@gmail.com",
//     username:"Jai-Bhim"
//   })
//   let registeredUser = await User.register(fakeUser,"Ambedkar");
//   res.send(registeredUser);
// })


// app.get("/", (req, res) => {
//   res.send("I am Root");
// });

app.use('/listings',listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//Error handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("listings/error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});























