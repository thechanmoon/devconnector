const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// const bcrypt = require('bcrypt');
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
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err)
                    {
                        throw err;
                        // console.log(err.message);
                        // return res.status(500).send('hash gen error');
                    }
                    user.password = hash;
                    user.save(); 
                });
            });

            
            //Return jsonwebtoken

            console.log(req.body);
            res.send('User registered');

            // const payload = {
            //     user: {
            //         id: user.id
            //     }
            // }
            // jwt.sign(
            //     payload,
            //     config.get('jwtSecret'),
            //     {expireIN:3600}
            // );
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;

// {"_id":{"$oid":"63ad823b484071c2afa39ebd"},"name":"thechanmoon","email":"thechanmoon@gmail.con","password":"$2a$10$Ik9ZqoQCHC.05vDa63cxgutZNaIQEv9.fLav22YD1JOM6aeG0oX6u","avavatar":"//www.gravatar.com/avatar/b47f6159e86c5e123ac1c3109fe8135f?s=200&r=pg&d=mm","__v":{"$numberInt":"0"}}