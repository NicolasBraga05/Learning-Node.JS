const chalk = require('chalk')

const nota = 6



if(nota >= 7) {
    console.log(chalk.green.bold('Parabéns! Voce esta aprovado!'))
} else {
    console.log(chalk.bgRed.black.bold(`Infelizmente voce foi reprovado, sua nota é (${nota})`))
}