var mongoose=require("mongoose");

var eventSchema= new mongoose.Schema({
	event:String,
	image:String,
	desc:String,
});

var Event=mongoose.model("event",eventSchema);

module.exports=mongoose.model("Event",eventSchema);