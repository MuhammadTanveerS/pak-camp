const { default: mongoose } = require("mongoose");
const schema = mongoose.Schema;

const campSchema = new schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

module.exports = new mongoose.model('Campground',campSchema);