const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-users-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController{

    static async register(req, res) {
        
        const {name, email, phone, password, confirmpassword} = req.body
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPhone = /^\d{11}$/
        

        // validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatorio!'})
            return
        }

        if(!email) {
            res.status(422).json({message: 'O email é obrigatorio!'})
            return
        }
        
        if(regexEmail.test(email)) {
            
        } else {
            res.status(400).json({message: 'O email é invalido, confirme se o dominio esta correto, por exemplo: teste@dominio.com'})
            return
        }
        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatorio!'})
            return
        }

        if(regexPhone.test(phone)) {
            
        } else {
            res.status(400).json({message: 'O numero de telefone é invalido, confirme se esta e acordo por exemplo: 11860437564'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatorio!'})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatorio!'})
            return
        } 

        if(password !== confirmpassword) {
            res.status(400).json({message: 'A confirmação de senha nao corresponde a senha!'})
            return
        }

        // check if users exists
        const userExist = await User.findOne({email: email})

        if(userExist) {
            res.status(400).json({message: 'Utilize outro email!'})
            return
        }

        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)
        
        // create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {

            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)
        }catch(error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {

        const { email, password } = req.body
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPhone = /^\d{11}$/


        if(!email) {
            res.status(422).json({message: 'O email é obrigatorio!'})
            return
        }
        
        if(regexEmail.test(email)) {
            
        } else {
            res.status(400).json({message: 'O email é invalido, confirme se o dominio esta correto, por exemplo: teste@dominio.com'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatorio!'})
            return
        }

        // check if users exists
        const user = await User.findOne({email: email})

        if(!user) {
            res.status(400).json({message: 'Nao existe usuario cadastrado com esse email!'})
            return
        }

        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({message: 'A senha é invalida!'})
            return
        }
        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {


        let currentUser

        if(req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id, "-password")

            currentUser.password = undefined

        } else {
            currentUser = null
        }
        
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {

        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(400).json({
                message: 'Usuario nao encontrado!'
            })
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res) {

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPhone = /^\d{11}$/

        const id = req.params.id

        // check if users exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body


        if(req.file) {
            user.image = req.file.filename
        }

        //validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatorio!'})
            return
        }
        user.name = name

        if(!email) {
            res.status(422).json({message: 'O email é obrigatorio!'})
            return
        }

        // check if email has already taken
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({
                message: 'Por favor utilize outro email!'
            })
            return
        }

        user.email = email
        
        if(regexEmail.test(email)) {
            
        } else {
            res.status(400).json({message: 'O email é invalido, confirme se o dominio esta correto, por exemplo: teste@dominio.com'})
            return
        }
        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatorio!'})
            return
        }

        user.phone = phone

        if(regexPhone.test(phone)) {
            
        } else {
            res.status(400).json({message: 'O numero de telefone é invalido, confirme se esta e acordo por exemplo: 11860437564'})
            return
        }

        if(password != confirmpassword) {
            res.status(400).json({message: 'A senha e confirmação de senha precisam ser iguais!'})
            return
        } else if(password === confirmpassword && password != null) {

            // creting password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {

            // returns user updated data
            await User.findByIdAndUpdate(
                {_id: user.id},
                {$set: user},
                {new: true},
            )


            res.status(200).json({
                message: 'Usuario atualizado com sucesso!'
            })

        } catch(error) {
            res.staus(500).json({
                message: `Nao foi possivel realizar a atualização: ${error}`
            })
            return
        }
    }
}

