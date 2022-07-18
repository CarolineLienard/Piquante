const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { userValidation } = require('../middleware/userValidation')


//Sign up
exports.signUp = async (req, res, next) => {

    //Validate the data before we add a user
    const {error} = userValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exist')

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //Create a new user
   const user = new User({
        email: req.body.email,
        password: hashPassword
   })
   try {
        const savedUser = await user.save()
        res.send({message: "Utilisateur créé"})
   } catch(err) {
        res.status(404).send(err)
   }
}

//Login
exports.login = async (req, res, next) => {

    //Validate data before login
    const { error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the email exist
    const user =  await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email is not found')

    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password')

    //Create and assign a token 
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET )
    res.header('auth-token', token).send({token: token, userId: user._id})
}