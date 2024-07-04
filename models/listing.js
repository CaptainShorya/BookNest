const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Review = require("./review")

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        default:0
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post('findOneAndDelete',async (listing)=> {
    if(listing){
        await Review.deleteMany({_id:{$in :listing.reviews}}) //All reviewId get deleted from here by in operator
    }
    
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;