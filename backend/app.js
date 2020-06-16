const express=require('express');
const bodyParser=require('body-parser');
const Post=require('./models/post');
const mongoose=require('mongoose');
const postRoutes=require('./routes/posts');
const userRoutes=require('./routes/user');
const path=require('path');
const app=express();
mongoose.connect("mongodb+srv://aks:"+process.env.MONGO_ATLAS_PW+"@cluster0-kqqgi.mongodb.net/node-angular?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology:true}).
then(()=>{
    console.log("connected to database");
}).catch(()=>{
    console.log("error while connecting to database");
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use("/images",express.static(path.join("backend/images")))

app.use((req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin","*");
   res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
   res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS"); 
   next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports=app;