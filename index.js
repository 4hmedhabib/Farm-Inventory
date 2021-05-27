const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

// Connect To DB
mongoose.connect('mongodb://localhost:27017/farmDB', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log('MONGO CONNECTION SUCCESSFULLY !!!')
    })
    .catch((err) => {
        console.log('MONGO CONNECTION ERROR?')
        console.log(err)
    })

const Product = require('./models/products.js')
const Farm = require('./models/farm.js')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride('_method'));

// Error Handler



// Categories
const categories = ['fruit', 'vegetable', 'dairy']




// FARM ROUTES
// ===========
app.get('/farms', async(req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
});

app.post('/farms', async(req, res) => {
    const { name, city, email } = req.body;
    const farm = new Farm({ name, city, email })
    await farm.save();
    res.redirect('/farms')
});

app.get('/farms/:id', async(req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id).populate('products');
    console.log(farm);
    res.render('farms/show', { farm })
});

app.get('/farms/edit/:id', async(req, res) => {
    const farm = await Farm.findById(req.params.id);
    res.render('farms/edit', { farm })
})

app.put('/farms/:id', async(req, res) => {
    const { id } = req.params;
    const { name, city, email } = req.body;
    const farm = await Farm.findByIdAndUpdate(id, { name, city, email }, { runValidators: true });
    farm.save();
    res.redirect(`/farms/${id}`)
});

app.get('/farms/:id/products/new', (req, res) => {
    const { id } = req.params;
    res.render('products/new', { id, categories })
})

app.post('/farms/:id/products/', async(req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const farm = await Farm.findById(id);

    const product = new Product({ name, price, category });
    product.farm = farm;
    farm.products.push(product)

    await product.save()
    await farm.save()

    res.redirect(`/farms/${id}`)
});

app.delete('/farms/:id', async(req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms')
})


// PRODUCT ROUTES
// ===============

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

app.post('/products/', async(req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect('/products')
});




// Edit Product
app.get('/products/edit/:id', async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
});

app.put('/products/edit/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect(`/products/p/${id}`)
    } catch (e) {
        next(e)
    }
})


// Delete Product
app.delete('/products/d/:id', async(req, res) => {
    const { id } = req.params;
    await Product.findByIdAndRemove(id)
    res.redirect('/products')
})

// Get Detailed Product
app.get('/products/p/:id/', async(req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            throw new AppError('NOT FOUND THIS PRODUCT  ', 401)
        }
        res.render('products/show', { product });
    } catch (e) {
        next(e)
    }
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong!' } = err
    res.status(status).send(message);

});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});