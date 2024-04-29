const chalk = require('chalk')
const inquirer = require('inquirer')

inquirer.prompt([{
    name: 'nome',
    message: 'Qual o seu nome: ',
}, {
    name: 'idade',
    message: 'Qual a sua idade: ',
},]).then((answers) => {
    let nome = answers.nome
    let idade = answers.idade
    console.log(chalk.bgYellow.black.bold(`O nome é [${nome}] e a idade é [${idade}]`))
}).catch((err) => console.log(err))

