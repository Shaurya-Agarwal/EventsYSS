const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	Event  = require("./models/events"),
	multer      =require("multer"),
	User        = require("./models/user"),
	path        =require("path"),
	passport    = require("passport"),
    LocalStrategy = require("passport-local")


mongoose.connect('mongodb+srv://shaurya:rahul@yssevents.1d78f.mongodb.net/yssevents?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var Storage=multer.diskStorage({
	destination:"./public/stylesheets/uploads/",
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
	}
});

var upload=multer({
	storage:Storage
}).single("image");

app.get("/",function(req,res){
	Event.find({},function(err,allEvent){
		if(err){
			console.log("err");
		}else{
			res.render("index",{event:allEvent});
		}
	});
});


app.post("/login",passport.authenticate("local",{
		successRedirect:"/",
		failureRedirect:"/login",
	}),function(req,res){	
});

var isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	};
	// var username = req.body.username;
	// var password = req.body.password;
	// if ( username == "admin" && password == "password"){
	// 	return next();
	// };
	res.redirect("/login")
};

app.post("/",upload,isLoggedIn,function(req,res){
	var event=req.body.event;
	var image=req.file.filename;
	var desc=req.body.desc;
	var newevent={event:event,image:image,desc:desc};
	Event.create(newevent,function(err,newlycreated){
		if(err){
			console.log("err");
		}else{
			res.redirect("/");
		}
	});
});


app.get("/login",function(req,res){
	res.render("login");
});



app.get("/new",function(req,res){
	res.render("new");
});


app.listen(3000, function(){
   console.log("The YSS Server Has Started!");
})