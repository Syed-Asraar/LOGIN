const express=require('express');
const path=require('path');
const bcrypt=require("bcrypt");
const collection=require('./config');

const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render("login");
});
app.get('/signup',(req,res)=>{
    res.render("signup");
});
app.post('/signup',async (req,res)=>{
    const data={
        name:req.body.username,
        password: req.body.password
    }
    const existingUser= await collection.findOne({name:data.name});
    if(existingUser){
        res.send("User Already exits. use different username");
    }
    else{
        const salt=10;
        const hash= await bcrypt.hash(data.password,salt);
        data.password=hash;

    const userdata=await collection.insertMany(data);
    console.log(userdata);
    res.redirect('/');
    }
});
app.post('/login',async (req,res)=>{
    try{
        const check= await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user not found");

        }
        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch){
            res.render("home");
        }
        else{
            req.send("wrong password");
        }
    }

    catch{
        res.send("wrong details");
    }
});

 

const port=3000;
app.listen(port,()=>{
    console.log(`Server running on :${port}`);
})
