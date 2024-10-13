const mongoose =require("mongoose")

const initData= require("./data.js")
const Listing = require("../models/listing.js")

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
const MONGO_URL="mongodb+srv://delta:qfqL8pxxEVAUhnJA@delta.eqzwt.mongodb.net/?retryWrites=true&w=majority&appName=delta";
main()
.then((res)=>{
    console.log("connection successful");
})
.catch((err)=>console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67056ea550c832aa92b363b1"}));
    await Listing.insertMany(initData.data);
    console.log("data was inti");
}
initDB();