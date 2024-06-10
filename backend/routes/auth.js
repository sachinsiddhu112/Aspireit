const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Define JWT_SECRET, usually from an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/register', [
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must have at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("validation error")
        return res.status(400).json({ success, errors:"Enter Valid credentials" });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({  $or: [
            { email: req.body.email},
            { username: req.body.username}
        ]});
        if (user) {
            console.log("user already exist")
            return res.status(400).json({ success, error: "Sorry, this username or email already exists." });
        }

        // Salt and hash password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create new user
        user = await User.create({
            username: req.body.username,
            password: secPass,
            email: req.body.email,
        });

        // Create JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        console.log(user);
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.status(200).json({ success, authtoken,user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error has occurred");
    }
});



//ROUTE:2
//Authenticate a user using Post"/api/auth/login" no login required.
router.post('/login', [

    body('username', 'enter a valid username').exists(),
    body('password', 'password cannot be blank').exists(),

], async (req, res) => {
    let success=false;
    //If there are errors(user input wrong email or password means that in format not supported by server) return bad request and errors

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: 
        "Enter Valid Credentials"
         })
    }

    const { username, password } = req.body;
    try {
        //here we check is there any user exist or not with this email id
        //if not return from here
        let user = await User.findOne({ username: username});
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct username and password" })
        }
        //bcz exist so compare its entered password with saved password .
        //compare function return true or false;
        //if false then also return from here no need to let him loged in
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            
            return res.status(400).json({success, error: "Please try to login with correct username and password" })
        }
        //if password matched
        //find user data
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        console.log(user);
        res.status(200).json({success,authtoken,user});
    }
    catch (error) {
        
        res.status(500).send("Internal server error has occured");
    }
})


router.put("/update/:id",async(req,res)=>{
    try{
        console.log(req.params);
        const updatedUser= await User.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true});
        res.status(200).json(updatedUser);
    }catch (err){
      res.status(500).json("Error in updating user");
    }
}

)


module.exports = router;
