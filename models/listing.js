const { types, ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review.js");

const Schema= mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:{
        type:String,
        default:"https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        filename:{
            type:String,
            default:"Upload"
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
});
listingSchema.post("findOneAndDelete",async (data) => {
    if (data.reviews.length) {
        let res= await Review.deleteMany({_id:{$in:data.reviews}})
        console.log(res);
    }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;