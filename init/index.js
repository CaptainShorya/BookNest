//We have written logic through which Data from data.js will get initialize into our Database
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("../init/data");  //Receving an object in initData from data.js

main()
.then(() => {
    console.log("Connected to DB")
}).catch((err) =>{
    console.log(err)
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/BookNest');
}

const initDB = async (req,res) => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner:'6681116b67586015bc3dc055'}))
    await Listing.insertMany(initData.data);
    console.log("Data initialized!!");
}
initDB();