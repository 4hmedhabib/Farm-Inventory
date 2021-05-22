const mongoose = require('mongoose');
const Product = require('./models/products')
    // Connect To DB
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION SUCCESSFULLY !!!')
    })
    .catch((err) => {
        console.log('MONGO CONNECTION ERROR?')
        console.log(err)
    })

const data = [{
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable',
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable',
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    }
]

Product.insertMany(data)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err)
    })