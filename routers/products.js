const express = require('express');
const { Product } = require('../models/product')
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    let filter={}
    if(req.query.categories)
    {
        filter={category:req.query.categories.split(',')};
    }
    const productList = await Product.find(filter);
    if (!productList) {
        return res.status(500).json({ success: false })
    }
    res.send(productList)
});
router.get(`/:productId`, async (req, res) => {

    const productList = await Product.findById(req.params.productId).populate('category');
    if (!productList) {
        return res.status(500).json({ success: false,message:'product not found' })
    }
    res.send(productList)
});
router.get(`/:id`, async (req, res) => {

    const productList = await Product.findById(req.params.id).select('name image');
    // select particular column then specify in select and 
    //if de select specific column mention like (minus)-columnName
    if (!productList) {
        return res.status(500).json({ success: false,message:'product not found' })
    }
    res.send(productList)
});
router.post(`/FindById`, async (req, res) => {
    console.log(req.body.productId)
    const productList = await Product.findById(req.body.productId);
    if (!productList) {
        return res.status(500).json({ success: false })
    }
    res.send(productList)
});
router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if (!product)
        return res.status(500).send('the product cannot be updated!')

    res.send(product);
});
router.delete('/:productId', (req, res) => {
    Product.findByIdAndRemove(req.params.productId).then(product => {
        if (product) {
            return res.status(200).
                json({ success: true, message: 'ther product is deleted' });
        }
        else {
            return res.status(404).
                json({ success: false, message: 'product not found' });
        }
    }).catch(err => {
        return res.status(400).
            json({ success: false, error: err });
    });
});
router.get(`/Get/ProductCount`,async (req, res) => {
    const proeductCount = await Product.countDocuments();
    if (!proeductCount)
        return res.status(500).json({success:false})

    res.send({ProductCount:proeductCount});
});
router.get(`/Get/Featured`,async (req, res) => {
    const product = await Product.find({isFeatured:true});
    if (!product)
        return res.status(500).json({success:false})

    res.send(product);
});
router.get(`/Get/Featured/:count`,async (req, res) => {
    const count=req.params.count?req.params.count:0;
    const product = await Product.find({isFeatured:true}).limit(count);
    if (!product)
        return res.status(500).json({success:false})

    res.send(product);
});
module.exports = router;