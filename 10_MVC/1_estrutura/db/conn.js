const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodemvc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectamos ao MySQL')
} catch(error) {
    console.log(`Houve um erro, nao foi possivel conectar : ${error}`)
}

exports.default = sequelize