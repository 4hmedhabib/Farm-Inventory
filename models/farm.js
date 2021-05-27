const mongoose = require('mongoose');
const Product = require('./products');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'farm must have name!']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email required!']
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

farmSchema.post('findOneAndDelete', async function(farm) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(res)
})

const Farm = new mongoose.model('Farm', farmSchema);


module.exports = Farm;