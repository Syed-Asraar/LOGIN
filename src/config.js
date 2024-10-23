const mongoose=require('mongoose');
const connect = mongoose.connect("mongodb+srv://syedasraar5103:asraar%4011@cluster0.zdd4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

connect.then(()=>{
    console.log("Database connected");
})
.catch(()=>{
    console.log("Not connected");
});
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const collection=new mongoose.model('users',LoginSchema);
module.exports=collection;