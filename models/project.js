const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const projectSchema=new Schema({
    title:String,
    subject:String,
    description:String,
    deadline:String,
    attachment :{
        data:Buffer,
        contentType:String
    },
    image:String
});

module.exports=mongoose.model('project',projectSchema)