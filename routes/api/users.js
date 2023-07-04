//authenticate user
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
require('../../models/Users')(passport);
const multer = require('multer'); 
const path = require('path');

//Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load user model
const User = require('../../models/Users');

// Set up multer storage and file filter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });

//@route    GET api/users/test
//@desc     Tests users route
//@access   Public

router.get('/test', (req,res) => res.json({msg: 'Users Works'}));

//@route    POST api/users/register
//@desc     Register user
//@access   Public

router.post('/register', upload.single('avatar'), (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.email = 'Email already exists!';
        return res.status(400).json(errors);
      } else {
        let avatar;
        if (req.file) {
          // If a file is uploaded, store the path in the avatar field
          avatar = req.file.path;
        }
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        });
  
        bcrypt.genSalt(8, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => res.json(user)).catch((err) => console.log(err));
          });
        });
      }
    });
  });

//@route    GET api/users/login
//@desc     login user
//@access   Public

router.post('/login', (req,res) =>{

    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);

    }
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email


    User.findOne({email}).then(user=>
        // pass in errors and password just like email in uprop ERRORS!!
        {if(!user){ return res.status(404).json({email: 'User not found'});}

        //Password?
        bcrypt.compare(password,user.password)
        .then(isMatch =>{
            if(isMatch){
               // res.json({msg: 'Yup!'});
               const payload = {id: user.id, name: user.name, avatar: user.avatar}

               jwt.sign(payload, keys.secretOrKey,{expiresIn: 3600}, (err, token) =>{
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                });


               }
               );
            } else{
                return res.status(400).json({ password: 'Password incorrect'});
            }

        })


        });

});

//@route    GET api/users/current
//@desc     return current user
//@access   Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) =>{ res.json({

    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
});
});


module.exports = router;