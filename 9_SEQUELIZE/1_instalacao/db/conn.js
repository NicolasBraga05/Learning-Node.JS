const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodesequelize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {

    sequelize.authenticate()
    console.log('Conectamos com sucesso com o sequelize!!!')

} catch(err) {
    console.log('Nao foi possivel conectar!!!')
}


module.exports = sequelize