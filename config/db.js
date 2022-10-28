const mongoose = require('mongoose');

const connectDB=()=>{
    return mongoose.connect('mongodb+srv://root:root@cluster0.z3axvxj.mongodb.net/blog-app?retryWrites=true&w=majority')
    .then(() => {
        console.log("connected to Db");
    })
    .catch(() => {
        console.log("Connection Failed");
    });
}

module.exports= connectDB;
