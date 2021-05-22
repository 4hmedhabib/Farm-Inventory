const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

// Connect To DB
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION SUCCESSFULLY !!!')
    })
    .catch((err) => {
        console.log('MONGO CONNECTION ERROR?')
        console.log(err)
    })

const Product = require('./models/products.js')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride('_method'))


// Categories
const categories = ['fruit', 'vegetable', 'dairy']


// Get All Products
app.get('/products', async(req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: category });
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' })
    }
});


// Add new Product
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products/new', async(req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect('/products')
});


// Edit Product
app.get('/products/edit/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product)
    res.render('products/edit', { product, categories })
});

app.put('/products/edit/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);

    res.redirect(`/products/p/${id}`)
})


// Delete Product
app.delete('/products/d/:id', async(req, res) => {
    const { id } = req.params;
    await Product.findByIdAndRemove(id)
    res.redirect('/products')
})

// Get Detailed Product
app.get('/products/p/:id/', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});