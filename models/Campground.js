const { default: mongoose } = require("mongoose");
const schema = mongoose.Schema;
const Review = require('./review')

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

campSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = new mongoose.model('Campground',campSchema);