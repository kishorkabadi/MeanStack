const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.send(categoryList);
});
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,

        image: req.body.image
    });
    await category.save().then(createdCategory => {
        res.status(200).json(createdCategory);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    });

});

//api/v1/id
router.delete('/:categoryId', (req, res) => {
    Category.findByIdAndRemove(req.params.categoryId).then(category => {
        if (category) {
            return res.status(200).
                json({ success: true, message: 'ther category is delted' });
        }
        else {
            return res.status(404).
                json({ success: false, message: 'category not found' });
        }
    }).catch(err => {
        return res.status(400).
            json({ success: false, error: err });
    });
});
router.get(`/:categoryId`, async (req, res) => {
    const categoryList = await Category.findById(req.params.categoryId);

    if (!categoryList) {
        res.status(500).json({ success: false, message: 'category not found' });
    }
    res.status(200).send(categoryList);
});
router.post(`/FindById`, async (req, res) => {
    const categoryList = await Category.findById(req.body.categoryId);
    if (!categoryList) {
        res.status(500).json({ success: false, message: 'category not found' });
    }
    res.status(200).send(categoryList);
});

//update
router.put('/:id',async (req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
        },
        {
            new:true
        }
    )
    if (!category) {
        res.status(500).json({ success: false, message: 'category not found' });
    }
    res.status(200).send(category);
});
module.exports = router;