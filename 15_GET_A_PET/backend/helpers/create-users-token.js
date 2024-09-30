const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    // create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'nossosecret')

    // return a token 
    res.status(200).json({
        message: 'Voce esta autenticado',
        token: token,
        userId: user._id,
    })

}

module.exports = createUserToken