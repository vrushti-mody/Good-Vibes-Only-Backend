var mongoose= require('mongoose');

var schema = new mongoose.Schema({
    name: {type:String, required:true},
    text: {type:String, required:true},
    image:{type:String}
})

module.exports = mongoose.model('Upload',schema)