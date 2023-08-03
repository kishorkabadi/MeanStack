const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get(`/`, async (req, res) => {
    const userList = await User.find();//.select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
});
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    await user.save().then(createdUser => {
        res.status(200).json(createdUser);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    });

});
router.get(`/:userId`, async (req, res) => {
    const user = await User.findById(req.params.userId).select('-passwordHash');

    if (!user) {
        res.status(500).json({ success: false, message: 'user not found' });
    }
    res.status(200).send(user);
});
//update
router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.passwordHash) {
        newPassword = bcrypt.hashSync(req.body.passwordHash, 10);
    }
    else
        newPassword = userExist.passwordHash;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },
        {
            new: true
        }
    )
    if (!user) {
        res.status(500).json({ success: false, message: 'User not found' });
    }
    res.status(200).send(user);
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
   const secret=process.env.secret;
    if (!user) {
        res.status(500).json({ success: false, message: 'User not found' });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: req.body.id,
                isAdmin:user.isAdmin
            },
            secret,
            {
                expiresIn:'1d'
            });
        res.status(200).json({ success: true, message: 'User found', jwtToken: token });
    }
    else {
        res.status(500).json(
            { success: false, message: 'User email and password is wrong!' });
    }
    res.status(200).send(user);
});
module.exports = router;