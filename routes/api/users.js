const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    '/',   
    [   check('name','Name is required')
        .not()
        .isEmpty(),
        check('email','Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({min:6})
    ],
    // [
    // check('name', 'Name is required').notEmpty(),
    // check('email', 'Please include a valid email').isEmail(),
    // check(
    // 'password',
    // 'Please enter a password with 6 or more characters'
    // ).isLength({ min: 6 }),
    // ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body;

        try{
            //Check user exists
            let user = await User.findOne({email});

            if (user){
                return res.status(400).json({error:[{msg: 'User already exists'}]});
            }
            
            // Get users gravatar
            const avavatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avavatar,
                password
            });
            //password Encrypt ( Bcrypt)
            // const salt = await bcrypt.getSalt(10);

            // user.password = await bcrypt.hash(password,salt);

            await user.save();
            //Return jsonwebtoken

            console.log(req.body);
            res.send('User registered');
        }catch{

        }

    }
);

module.exports = router;